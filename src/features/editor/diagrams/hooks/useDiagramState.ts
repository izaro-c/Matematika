import { useReducer, useCallback, useRef, useEffect } from 'react';
import { diagramReducer, initialDiagramState } from '../state/reducer';
import { diagramRepository } from '../persistence/repository';
import { generateDiagramSource } from '../source/generator';
import { parseDiagramSourceOnServer } from '../source/parser';
import type { VisualDiagramModel, CanvasTool } from '../model/types';
import { asPersistenceError } from '../../persistence/persistenceErrors';

export function useDiagramState() {
  const [state, dispatch] = useReducer(diagramReducer, initialDiagramState);
  const stateRef = useRef(state);
  const versionRef = useRef<string>('');
  const parseDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const parseControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Clean up timers/requests on unmount
  useEffect(() => {
    return () => {
      if (parseDebounceTimerRef.current) clearTimeout(parseDebounceTimerRef.current);
      parseControllerRef.current?.abort();
    };
  }, []);

  const loadDiagram = useCallback(async (filePath: string, componentName: string) => {
    try {
      dispatch({ type: 'SET_STATUS', status: 'saving' }); // Loading state
      const result = await diagramRepository.readDiagram(filePath);
      versionRef.current = result.version;
      dispatch({
        type: 'LOAD_DIAGRAM',
        filePath,
        componentName,
        source: result.source,
        model: result.model,
      });
    } catch (error) {
      console.error('Error loading diagram:', error);
      dispatch({
        type: 'SAVE_FAILURE',
        error: error instanceof Error ? error.message : 'Error al cargar el archivo de diagrama.',
      });
    }
  }, []);

  const handleVisualEdit = useCallback((nextModel: VisualDiagramModel) => {
    dispatch({ type: 'VISUAL_EDIT', model: nextModel });
    
    // Automatically regenerate source from visual model if authoritative or synced
    const current = stateRef.current;
    if (current.status === 'synced' || current.status === 'visual-authoritative') {
      const gen = generateDiagramSource(nextModel, current.componentName);
      if (gen.ok) {
        dispatch({ type: 'RESOLVE_TO_VISUAL', source: gen.source });
      } else {
        dispatch({ type: 'SET_DIAGNOSTICS', diagnostics: gen.diagnostics });
      }
    }
  }, []);

  const triggerServerParse = useCallback(async (sourceText: string) => {
    parseControllerRef.current?.abort();
    const controller = new AbortController();
    parseControllerRef.current = controller;

    try {
      const parsed = await parseDiagramSourceOnServer(sourceText, controller.signal);
      if (controller.signal.aborted) return;

      if (parsed.status === 'supported' && parsed.model) {
        dispatch({
          type: 'APPLY_PARSED_MODEL',
          model: parsed.model,
          diagnostics: parsed.diagnostics,
        });
      } else if (parsed.status === 'partially-supported') {
        dispatch({
          type: 'APPLY_PARSED_MODEL',
          model: parsed.model || stateRef.current.currentModel || {} as VisualDiagramModel,
          diagnostics: parsed.diagnostics,
        });
      } else {
        dispatch({
          type: 'PARSE_FAILED',
          diagnostics: parsed.diagnostics,
        });
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      dispatch({
        type: 'PARSE_FAILED',
        diagnostics: [{
          code: 'parse-exception',
          severity: 'error',
          message: err instanceof Error ? err.message : 'Excepción al parsear código.',
          source: 'source',
        }],
      });
    }
  }, []);

  const handleSourceEdit = useCallback((nextSource: string) => {
    dispatch({ type: 'SOURCE_EDIT', source: nextSource });

    // Debounce server AST parsing
    if (parseDebounceTimerRef.current) {
      clearTimeout(parseDebounceTimerRef.current);
    }
    parseDebounceTimerRef.current = setTimeout(() => {
      triggerServerParse(nextSource);
    }, 600);
  }, [triggerServerParse]);

  const selectElement = useCallback((id: string) => {
    dispatch({ type: 'SELECT_ELEMENT', id });
  }, []);

  const setCanvasTool = useCallback((tool: CanvasTool) => {
    dispatch({ type: 'SET_CANVAS_TOOL', tool });
  }, []);

  const setActiveStep = useCallback((stepId: string) => {
    dispatch({ type: 'SET_ACTIVE_STEP', stepId });
  }, []);

  const resolveDivergence = useCallback((authority: 'visual' | 'source') => {
    const current = stateRef.current;
    if (authority === 'visual') {
      if (!current.currentModel) return;
      const gen = generateDiagramSource(current.currentModel, current.componentName);
      if (gen.ok) {
        dispatch({ type: 'RESOLVE_TO_VISUAL', source: gen.source });
        dispatch({ type: 'SET_STATUS', status: 'visual-authoritative' });
      } else {
        dispatch({ type: 'SET_DIAGNOSTICS', diagnostics: gen.diagnostics });
      }
    } else {
      triggerServerParse(current.currentSource);
    }
  }, [triggerServerParse]);

  const saveDiagram = useCallback(async (): Promise<boolean> => {
    const current = stateRef.current;
    if (!current.filePath || !current.currentSource) return false;

    // Check if there are critical errors
    const hasCriticalError = current.diagnostics.some(d => d.severity === 'error');
    if (hasCriticalError || current.status === 'invalid-source') {
      return false;
    }

    dispatch({ type: 'SAVE_START' });

    try {
      const response = await diagramRepository.saveDiagram(
        current.filePath,
        current.currentSource,
        versionRef.current
      );
      versionRef.current = response.version;
      dispatch({
        type: 'SAVE_SUCCESS',
        source: current.currentSource,
        model: current.currentModel,
      });
      return true;
    } catch (error) {
      const parsedError = asPersistenceError(error);
      const isConflict = parsedError.kind === 'content-conflict' || parsedError.kind === 'draft-conflict';
      dispatch({
        type: 'SAVE_FAILURE',
        error: ('message' in parsedError ? parsedError.message : '') || 'Error al persistir el diagrama en el disco.',
        isConflict,
      });
      return false;
    }
  }, []);

  const linkToMdxPage = useCallback(async (mdxPath: string, mode: 'simulation' | 'diagram' | 'inline') => {
    const current = stateRef.current;
    if (!current.filePath) return;
    try {
      await diagramRepository.updateMdxImports(
        mdxPath,
        current.componentName,
        current.filePath,
        mode
      );
    } catch (error) {
      console.error('Error linking diagram to MDX page:', error);
    }
  }, []);

  const isDirty = state.currentSource !== state.originalSource || JSON.stringify(state.currentModel) !== JSON.stringify(state.originalModel);

  return {
    state,
    isDirty,
    loadDiagram,
    handleVisualEdit,
    handleSourceEdit,
    selectElement,
    setCanvasTool,
    setActiveStep,
    resolveDivergence,
    saveDiagram,
    linkToMdxPage,
  };
}
export type UseDiagramStateReturn = ReturnType<typeof useDiagramState>;
