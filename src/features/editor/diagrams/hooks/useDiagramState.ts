import { useReducer, useCallback, useRef, useEffect, useState } from 'react';
import { diagramReducer, initialDiagramState } from '../state/reducer';
import { diagramRepository } from '../persistence/repository';
import { generateDiagramSource } from '../source/generator';
import { parseDiagramSourceOnServer } from '../source/parser';
import { getDiagramSaveCapability, isDiagramStateDirty } from '../model/selectors';
import type { VisualDiagramModel, CanvasTool } from '../model/types';
import { asPersistenceError } from '../../persistence/persistenceErrors';

export function useDiagramState() {
  const [state, dispatch] = useReducer(diagramReducer, initialDiagramState);
  const stateRef = useRef(state);
  const versionRef = useRef<string>('');
  const parseDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sourceSyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const parseControllerRef = useRef<AbortController | null>(null);
  const parseRequestIdRef = useRef(0);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Clean up timers/requests on unmount
  useEffect(() => {
    return () => {
      if (parseDebounceTimerRef.current) clearTimeout(parseDebounceTimerRef.current);
      if (sourceSyncTimerRef.current) clearTimeout(sourceSyncTimerRef.current);
      parseControllerRef.current?.abort();
    };
  }, []);

  const loadDiagram = useCallback(async (filePath: string, componentName: string) => {
    try {
      parseRequestIdRef.current += 1;
      if (parseDebounceTimerRef.current) clearTimeout(parseDebounceTimerRef.current);
      parseControllerRef.current?.abort();
      dispatch({ type: 'SET_STATUS', status: 'saving' }); // Loading state
      const result = await diagramRepository.readDiagram(filePath);
      versionRef.current = result.version;
      dispatch({
        type: 'LOAD_DIAGRAM',
        filePath,
        componentName,
        source: result.source,
        model: result.model,
        parseStatus: result.parseStatus,
        diagnostics: result.diagnostics,
        expectedVersion: result.version,
      });
    } catch (error) {
      console.error('Error loading diagram:', error);
      dispatch({
        type: 'SAVE_FAILURE',
        error: error instanceof Error ? error.message : 'Error al cargar el archivo de diagrama.',
      });
    }
  }, []);

  const loadInlineDiagram = useCallback((source: string, componentName: string, model: VisualDiagramModel | null) => {
    parseRequestIdRef.current += 1;
    if (parseDebounceTimerRef.current) clearTimeout(parseDebounceTimerRef.current);
    parseControllerRef.current?.abort();
    versionRef.current = '';
    const generated = model ? generateDiagramSource(model, componentName) : null;
    const isExact = Boolean(model && generated?.ok && generated.source === source);
    dispatch({
      type: 'LOAD_DIAGRAM',
      filePath: null,
      componentName,
      source,
      model: isExact ? model : null,
      parseStatus: isExact ? 'visual-exact' : 'code-preview',
      diagnostics: isExact ? [] : [{
        code: 'inline-model-missing',
        severity: 'warning',
        message: model
          ? 'El modelo inline no regenera toda la fuente de forma idéntica; se conserva la autoridad del código.'
          : 'La fuente inline no tiene un modelo visual verificable.',
        source: 'synchronization',
      }],
      expectedVersion: null,
    });
  }, []);

  const loadNewDiagram = useCallback((componentName: string, model: VisualDiagramModel) => {
    parseRequestIdRef.current += 1;
    if (parseDebounceTimerRef.current) clearTimeout(parseDebounceTimerRef.current);
    parseControllerRef.current?.abort();
    versionRef.current = '';
    const generated = generateDiagramSource(model, componentName);
    dispatch({
      type: 'LOAD_NEW_DIAGRAM',
      componentName,
      source: generated.ok ? generated.source : '',
      model,
      diagnostics: generated.ok ? [] : generated.diagnostics,
    });
  }, []);

  const loadDiagramForRewrite = useCallback(async (filePath: string, componentName: string, model: VisualDiagramModel) => {
    try {
      parseRequestIdRef.current += 1;
      if (parseDebounceTimerRef.current) clearTimeout(parseDebounceTimerRef.current);
      parseControllerRef.current?.abort();
      dispatch({ type: 'SET_STATUS', status: 'saving' });
      const existing = await diagramRepository.readDiagram(filePath);
      const generated = generateDiagramSource(model, componentName);
      if (!generated.ok) {
        dispatch({ type: 'SAVE_FAILURE', error: 'La plantilla visual inicial no genera una fuente TSX válida.' });
        dispatch({ type: 'SET_DIAGNOSTICS', diagnostics: generated.diagnostics });
        return;
      }
      versionRef.current = existing.version;
      dispatch({
        type: 'LOAD_REWRITE_DIAGRAM',
        filePath,
        componentName,
        originalSource: existing.source,
        source: generated.source,
        model,
        expectedVersion: existing.version,
        diagnostics: [],
      });
    } catch (error) {
      dispatch({
        type: 'SAVE_FAILURE',
        error: error instanceof Error ? error.message : 'Error al preparar la reescritura visual del diagrama.',
      });
    }
  }, []);

  const syncSourceFromModel = useCallback((nextModel: VisualDiagramModel) => {
    const current = stateRef.current;
    if (current.status !== 'synced' && current.status !== 'visual-authoritative') return;
    const gen = generateDiagramSource(nextModel, current.componentName);
    if (gen.ok) {
      dispatch({ type: 'RESOLVE_TO_VISUAL', source: gen.source, diagnostics: gen.diagnostics });
    } else {
      dispatch({ type: 'SET_DIAGNOSTICS', diagnostics: gen.diagnostics });
    }
  }, []);

  const handleVisualEdit = useCallback((nextModel: VisualDiagramModel, command?: { label?: string; mergeKey?: string }) => {
    dispatch({
      type: 'VISUAL_EDIT', model: nextModel,
      commandId: `diagram-command-${Date.now()}`,
      label: command?.label,
      mergeKey: command?.mergeKey,
    });

    if (command?.mergeKey) {
      if (sourceSyncTimerRef.current) clearTimeout(sourceSyncTimerRef.current);
      sourceSyncTimerRef.current = setTimeout(() => {
        sourceSyncTimerRef.current = null;
        syncSourceFromModel(stateRef.current.currentModel ?? nextModel);
      }, 250);
      return;
    }

    syncSourceFromModel(nextModel);
  }, [syncSourceFromModel]);

  const regenerateFromHistory = useCallback((direction: 'undo' | 'redo') => {
    const current = stateRef.current;
    const history = direction === 'undo'
      ? current.modelHistory.past[current.modelHistory.past.length - 1]?.before
      : current.modelHistory.future[0]?.after;
    if (!history) return;
    dispatch({ type: direction === 'undo' ? 'UNDO' : 'REDO' });
    const generated = generateDiagramSource(history, current.componentName);
    if (generated.ok) {
      dispatch({ type: 'RESOLVE_TO_VISUAL', source: generated.source, diagnostics: generated.diagnostics });
    } else {
      dispatch({ type: 'SET_DIAGNOSTICS', diagnostics: generated.diagnostics });
    }
  }, []);

  const triggerServerParse = useCallback(async (sourceText: string) => {
    parseControllerRef.current?.abort();
    const controller = new AbortController();
    parseControllerRef.current = controller;
    const requestId = ++parseRequestIdRef.current;

    try {
      const parsed = await parseDiagramSourceOnServer(sourceText, controller.signal);
      if (controller.signal.aborted || requestId !== parseRequestIdRef.current || stateRef.current.currentSource !== sourceText) return;

      if (parsed.status === 'visual-exact') {
        dispatch({
          type: 'APPLY_PARSED_MODEL',
          model: parsed.model,
          diagnostics: parsed.diagnostics,
        });
      } else if (parsed.status === 'code-preview') {
        dispatch({
          type: 'PARSE_CODE_PREVIEW',
          diagnostics: parsed.diagnostics,
        });
      } else {
        dispatch({
          type: 'PARSE_FAILED',
          diagnostics: parsed.diagnostics,
        });
      }
    } catch (err) {
      if (controller.signal.aborted || requestId !== parseRequestIdRef.current || stateRef.current.currentSource !== sourceText) return;
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
        dispatch({ type: 'RESOLVE_TO_VISUAL', source: gen.source, diagnostics: gen.diagnostics });
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
    const capability = getDiagramSaveCapability(current);
    if (!capability.allowed) {
      return false;
    }
    if (!current.filePath) return false;

    dispatch({ type: 'SAVE_START' });

    try {
      const response = await diagramRepository.saveDiagram(
        current.filePath,
        current.currentSource,
        current.expectedVersion ?? versionRef.current
      );
      versionRef.current = response.version;
      dispatch({
        type: 'SAVE_SUCCESS',
        source: current.currentSource,
        model: current.currentModel,
        expectedVersion: response.version,
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

  const [mdxLinkNotice, setMdxLinkNotice] = useState<string | null>(null);

  const linkToMdxPage = useCallback(async (mdxPath: string, mode: 'simulation' | 'diagram' | 'inline') => {
    const current = stateRef.current;
    if (!current.filePath) {
      setMdxLinkNotice('No hay un archivo de diagrama guardado para vincular a una página MDX.');
      return false;
    }
    try {
      await diagramRepository.updateMdxImports(
        mdxPath,
        current.componentName,
        current.filePath,
        mode,
      );
      setMdxLinkNotice(null);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo vincular el diagrama a la página MDX.';
      setMdxLinkNotice(`No se pudo vincular el diagrama a la página MDX. ${message}`);
      return false;
    }
  }, []);

  const isDirty = isDiagramStateDirty(state);

  return {
    state,
    isDirty,
    mdxLinkNotice,
    loadDiagram,
    loadInlineDiagram,
    loadNewDiagram,
    loadDiagramForRewrite,
    handleVisualEdit,
    handleSourceEdit,
    undo: () => regenerateFromHistory('undo'),
    redo: () => regenerateFromHistory('redo'),
    selectElement,
    setCanvasTool,
    setActiveStep,
    resolveDivergence,
    saveDiagram,
    linkToMdxPage,
  };
}
export type UseDiagramStateReturn = ReturnType<typeof useDiagramState>;
