import { useCallback, useState } from 'react';
import type { DiagramState } from '@/fixed-pages/editor/diagrams/history/types';
import type { useDiagramState } from '@/fixed-pages/editor/diagrams/history/useDiagramState';
import type { EditorDiagramReference } from '@/fixed-pages/editor/session/editorTypes';
import {
  buildEditorSaveCapabilityFromDiagram,
  warningSaveConfirmCopy,
  type EditorSaveBlockReason,
} from '@/fixed-pages/editor/save/saveCapability';
import { buildTargets } from '../../model/scene/selectors';
import type { VisualDiagramModel } from '../../model/types';
import type { DiagramSaveCapability } from '../../model/scene/selectors';
import { confirmWorkbench, workbenchIsBlocked } from './useWorkbenchActions';
import type { DiagramWorkbenchMode } from './useDiagramWorkbenchLoader';

interface Options {
  mode: DiagramWorkbenchMode | undefined;
  model: VisualDiagramModel | null;
  state: DiagramState;
  isDirty: boolean;
  sandboxMode: boolean;
  saveCapability: DiagramSaveCapability;
  errorCount: number;
  warningCount: number;
  saveDiagram: ReturnType<typeof useDiagramState>['saveDiagram'];
  onConfirm?: (spec: EditorDiagramReference) => boolean | void | Promise<boolean | void>;
}

/** Guardar o confirmar el diagrama: capacidad, confirmación de avisos y aplicación al documento que lo aloja. */
export function useDiagramSaveFlow({
  mode,
  model,
  state,
  isDirty,
  sandboxMode,
  saveCapability,
  errorCount,
  warningCount,
  saveDiagram,
  onConfirm,
}: Options) {
  const handleSaveAndConfirm = useCallback(() => {
    if (!model || !mode || !onConfirm) {
      void saveDiagram();
      return;
    }
    const isFileMode = mode.kind === 'file' || mode.kind === 'rewrite';
    void confirmWorkbench({
      shouldSave: isFileMode,
      blocked: workbenchIsBlocked(
        state.status,
        state.diagnostics.some(diagnostic => diagnostic.severity === 'error'),
      ),
      save: saveDiagram,
      reference: {
        componentName: state.componentName,
        category: model.category,
        path: isFileMode ? mode.path : '',
        importPath: isFileMode ? mode.path : '',
        source: state.currentSource,
        targets: buildTargets(model),
        mode: model.mode,
        visualModel: model as unknown as Record<string, unknown>,
      },
      onConfirm,
    });
  }, [
    mode,
    model,
    onConfirm,
    saveDiagram,
    state.componentName,
    state.currentSource,
    state.diagnostics,
    state.status,
  ]);

  const runSave = useCallback(() => {
    if (onConfirm) handleSaveAndConfirm();
    else void saveDiagram();
  }, [handleSaveAndConfirm, onConfirm, saveDiagram]);

  const [warningSaveOpen, setWarningSaveOpen] = useState(false);

  const confirmBlocked = workbenchIsBlocked(
    state.status,
    state.diagnostics.some(diagnostic => diagnostic.severity === 'error'),
  );
  const diagramGate = onConfirm
    ? { ...saveCapability, allowed: Boolean(model) && !confirmBlocked }
    : saveCapability;
  const allowCleanApply = Boolean(onConfirm) && mode?.kind !== 'file' && mode?.kind !== 'rewrite';
  const editorSaveCapability = buildEditorSaveCapabilityFromDiagram({
    allowed: diagramGate.allowed,
    reason: diagramGate.reason as EditorSaveBlockReason | undefined,
    summary: diagramGate.summary,
    errorCount,
    warningCount,
    isDirty,
    saving: state.status === 'saving',
    sandboxMode,
    allowCleanApply,
  });

  const handleSave = useCallback(() => {
    if (!editorSaveCapability.allowed) return;
    if (editorSaveCapability.warningCount > 0) {
      setWarningSaveOpen(true);
      return;
    }
    runSave();
  }, [editorSaveCapability.allowed, editorSaveCapability.warningCount, runSave]);

  const confirmWarningSave = useCallback(() => {
    setWarningSaveOpen(false);
    runSave();
  }, [runSave]);

  const warningSaveCopy = warningSaveConfirmCopy(editorSaveCapability.warningCount, 'diagram');

  return { editorSaveCapability, handleSave, confirmWarningSave, warningSaveOpen, setWarningSaveOpen, warningSaveCopy };
}
