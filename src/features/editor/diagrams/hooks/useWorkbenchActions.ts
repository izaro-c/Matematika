import { useMemo } from 'react';
import type { EditorDiagramReference } from '../../core/editorTypes';
import type { CanvasTool, ConstructionKind, ElementKind, VisualDiagramModel } from '../model/types';
import { buildTargets } from '../model/selectors';
import {
  KIND_LABELS,
  addToolReference,
  toolReferencesAreReady,
  point,
  element,
  slider,
  projectPointToSupport,
  generatedElementId,
  elementColorForKind,
  defaultElementProperties,
  addLabelToElement,
  removeDiagramElements,
  refsForKind,
  supportElements,
  applyGuidedConstruction,
  normalizeConstructionRefs,
  validConstructionRefs,
  toolReferenceCandidates,
  deleteDiagramCascade,
  refsNeededForTool,
  nextLayerItemOrder,
} from '../model';
import type { DiagramWorkbenchMode } from './useDiagramWorkbenchLoader';

export function makeVisibleInEveryStep(candidate: VisualDiagramModel, objectId: string): VisualDiagramModel {
  return {
    ...candidate,
    steps: candidate.steps.map(item => ({
      ...item,
      visibleTargets: item.visibleTargets.includes(objectId) ? item.visibleTargets : [...item.visibleTargets, objectId],
      objectStates: item.objectStates?.[objectId]
        ? { ...item.objectStates, [objectId]: { ...item.objectStates[objectId], visible: true } }
        : item.objectStates,
    })),
  };
}

function addLabelsToEveryElement(model: VisualDiagramModel): VisualDiagramModel {
  return model.elements.reduce((currentModel, diagramElement) => {
    if (['label', 'text', 'formula', 'infoPanel', 'grid'].includes(diagramElement.kind)) return currentModel;
    return addLabelToElement(currentModel, diagramElement.id).model;
  }, model);
}

function removeEveryElementLabel(model: VisualDiagramModel): VisualDiagramModel | null {
  const labelIds = new Set(model.elements.filter(item => item.kind === 'label').map(item => item.id));
  return labelIds.size > 0 ? removeDiagramElements(model, labelIds) : null;
}

export function workbenchIsBlocked(status: string, hasError: boolean): boolean {
  return ['invalid-source', 'diverged', 'conflict'].includes(status) || hasError;
}

export function sourceCanRegenerate(parseStatus: string, status: string): boolean {
  return parseStatus === 'visual-exact' && !['source-authoritative', 'diverged'].includes(status);
}

export function saveDiagramInFileMode(isFileMode: boolean, save: () => Promise<boolean>): void {
  if (isFileMode) void save();
}

export function shouldShowCodeFallback(model: VisualDiagramModel | null, source: string, diagnosticCount: number): boolean {
  return !model && (source.length > 0 || diagnosticCount > 0);
}

export interface DeleteConfirmationRequest {
  objectId: string;
  dependentIds: string[];
  onConfirm: () => void;
}

export function buildDeleteConfirmationMessage(_objectId: string, dependentIds: string[]): string {
  const details = dependentIds.length > 0
    ? `También se eliminarán ${dependentIds.length} dependiente(s): ${dependentIds.join(', ')}.`
    : '';
  return `${details}${details ? '\n\n' : ''}Puede deshacer esta operación.`.trim();
}

function appendDiagramElement(model: VisualDiagramModel, kind: ElementKind, explicitRefs?: string[]): { model: VisualDiagramModel; id: string } {
  const refs = explicitRefs || toolReferenceCandidates(model, kind).map(item => item.id);
  const elementRefs = refsForKind(kind, refs);
  const id = generatedElementId(kind, elementRefs, model.elements);
  const properties = defaultElementProperties(kind);
  const baseElement = element(
    id,
    KIND_LABELS[kind],
    kind,
    elementRefs,
    elementColorForKind(kind),
    kind !== 'label',
    {
      ...(properties ? { properties } : {}),
      ...(kind === 'label' ? { style: { textOffset: [0.04, 0.04] as [number, number], preserveColorOnHighlight: true } } : {}),
    },
  );
  const nextElement = {
    ...baseElement,
    order: nextLayerItemOrder(model, baseElement.layerId),
  };
  const nextModel = makeVisibleInEveryStep({
    ...model,
    elements: [...model.elements, nextElement],
    dependencies: [
      ...(model.dependencies || []),
      ...elementRefs.map(sourceId => ({ sourceId, targetId: id, relation: 'construction' as const })),
    ],
  }, id);
  return { model: nextModel, id };
}

export async function confirmWorkbench({
  shouldSave,
  blocked,
  save,
  reference,
  onConfirm,
  close,
}: {
  shouldSave: boolean;
  blocked: boolean;
  save: () => Promise<boolean>;
  reference: EditorDiagramReference;
  onConfirm: (spec: EditorDiagramReference) => boolean | void | Promise<boolean | void>;
  close: () => void;
}): Promise<void> {
  if (shouldSave && !await save()) return;
  if (!shouldSave && blocked) return;
  if (await onConfirm(reference) === false) return;
  close();
}

export function chooseToolReference({
  tool,
  pendingRefs,
  referenceId,
  addElement,
  setPendingRefs,
  select,
}: {
  tool: CanvasTool;
  pendingRefs: string[];
  referenceId: string;
  addElement: (kind: ElementKind, refs: string[]) => void;
  setPendingRefs: (refs: string[]) => void;
  select: (id: string) => void;
}): boolean {
  if (tool === 'select' || tool === 'point' || refsNeededForTool(tool) === 0) return false;
  const nextRefs = addToolReference(tool, pendingRefs, referenceId);
  if (tool !== 'polygon' && nextRefs.every(Boolean) && toolReferencesAreReady(tool, nextRefs)) {
    addElement(tool, nextRefs);
    setPendingRefs([]);
  } else {
    setPendingRefs(nextRefs);
    select(referenceId);
  }
  return true;
}

interface UseWorkbenchActionsOptions {
  model: VisualDiagramModel | null;
  mode: DiagramWorkbenchMode;
  isFileMode: boolean;
  componentName: string;
  currentSource: string;
  status: string;
  diagnostics: readonly { severity: string }[];
  selectedId: string;
  constructionKind: ConstructionKind;
  constructionRefs: Record<string, string>;
  pendingRefs: string[];
  handleVisualEdit: (model: VisualDiagramModel, options?: { label: string; mergeKey?: string }) => void;
  selectOnly: (id: string) => void;
  setCanvasTool: (tool: CanvasTool) => void;
  setPendingRefs: (refs: string[]) => void;
  saveDiagram: () => Promise<boolean>;
  onConfirm: (spec: EditorDiagramReference) => boolean | void | Promise<boolean | void>;
  onClose: () => void;
  onRequestDeleteConfirmation: (request: DeleteConfirmationRequest) => void;
}

export function useWorkbenchActions({
  model,
  mode,
  isFileMode,
  componentName,
  currentSource,
  status,
  diagnostics,
  selectedId,
  constructionKind,
  constructionRefs,
  pendingRefs,
  handleVisualEdit,
  selectOnly,
  setCanvasTool,
  setPendingRefs,
  saveDiagram,
  onConfirm,
  onClose,
  onRequestDeleteConfirmation,
}: UseWorkbenchActionsOptions) {
  return useMemo(() => {
    if (!model) {
      const noop = () => undefined;
      const noopBool = () => false;
      return {
        activateCanvasTool: noop,
        chooseReferenceForTool: noopBool,
        handleAddSlider: noop,
        handleAddElement: noop,
        handleAddGliderPoint: noop,
        handleAddElementLabel: noop,
        handleAddAllLabels: noop,
        handleRemoveAllLabels: noop,
        handleDeleteSelected: noop,
        handleCreateGuidedConstruction: noop,
        handleSaveAndConfirm: noop,
        normalizedRefs: { a: '', b: '', c: '' },
        constructionReady: false,
      };
    }

    const activateCanvasTool = (tool: CanvasTool) => {
    setPendingRefs([]);
    setCanvasTool(tool);
  };

  const handleAddElement = (kind: ElementKind, explicitRefs?: string[]) => {
    const result = appendDiagramElement(model, kind, explicitRefs);
    handleVisualEdit(result.model, { label: `Añadir ${KIND_LABELS[kind]}` });
    selectOnly(result.id);
    activateCanvasTool('select');
  };

  const chooseReferenceForTool = (referenceId: string, canvasTool: CanvasTool) => {
    return chooseToolReference({
      tool: canvasTool,
      pendingRefs,
      referenceId,
      addElement: handleAddElement,
      setPendingRefs,
      select: selectOnly,
    });
  };

  const handleAddSlider = () => {
    const id = `slider${model.sliders.length + 1}`;
    const newSlider = {
      ...slider(id, `Control ${model.sliders.length + 1}`, -4, -4 + model.sliders.length * 0.45, 1),
      order: nextLayerItemOrder(model, 'controls'),
    };
    handleVisualEdit(makeVisibleInEveryStep({
      ...model,
      sliders: [...model.sliders, newSlider],
    }, id), { label: `Añadir control ${id}` });
    selectOnly(id);
    activateCanvasTool('select');
  };

  const handleAddGliderPoint = (supportId?: string) => {
    const candidates = supportElements(model);
    const support = candidates.find(item => item.id === supportId) ?? candidates[0];
    if (!support) return;
    const id = `p${model.points.length + 1}`;
    const initial = { x: 0, y: 0 };
    const nextPoint = {
      ...point(id, id.replace(/^p/, ''), initial.x, initial.y, false, 'ocre', 'glider', support.id),
      order: nextLayerItemOrder(model, 'geometry'),
    };
    const projected = projectPointToSupport(model, nextPoint, initial);
    handleVisualEdit(makeVisibleInEveryStep({
      ...model,
      points: [...model.points, { ...nextPoint, ...projected }],
    }, id), { label: `Añadir punto sobre ${support.id}` });
    selectOnly(id);
    activateCanvasTool('select');
  };

  const handleAddElementLabel = (elementId: string) => {
    const result = addLabelToElement(model, elementId);
    const next = makeVisibleInEveryStep(result.model, result.labelId);
    handleVisualEdit(next, { label: `Añadir etiqueta a ${elementId}` });
    selectOnly(result.labelId);
    activateCanvasTool('select');
  };

  const handleAddAllLabels = () => {
    handleVisualEdit(addLabelsToEveryElement(model), { label: 'Añadir etiquetas a todos los elementos' });
  };

  const handleRemoveAllLabels = () => {
    const nextModel = removeEveryElementLabel(model);
    if (nextModel) handleVisualEdit(nextModel, { label: 'Quitar todas las etiquetas' });
  };

  const handleDeleteSelected = () => {
    if (!selectedId) return;
    const deletion = deleteDiagramCascade(model, selectedId);
    onRequestDeleteConfirmation({
      objectId: selectedId,
      dependentIds: deletion.impact.dependentIds,
      onConfirm: () => {
        handleVisualEdit(deletion.model, { label: `Eliminar ${selectedId} y dependientes` });
        selectOnly('');
      },
    });
  };

  const normalizedRefs = normalizeConstructionRefs(model.points, constructionRefs);
  const constructionReady = validConstructionRefs(constructionKind, normalizedRefs);

  const handleCreateGuidedConstruction = () => {
    if (!constructionReady) return;
    const result = applyGuidedConstruction(model, constructionKind, normalizedRefs);
    handleVisualEdit(result.model);
    selectOnly(result.selectedId);
    activateCanvasTool('select');
  };

  const handleSaveAndConfirm = () => confirmWorkbench({
    shouldSave: isFileMode,
    blocked: workbenchIsBlocked(status, diagnostics.some(diagnostic => diagnostic.severity === 'error')),
    save: saveDiagram,
    reference: {
      componentName,
      category: model.category,
      path: mode.kind === 'file' || mode.kind === 'rewrite' ? mode.path : '',
      importPath: mode.kind === 'file' || mode.kind === 'rewrite' ? mode.path : '',
      source: currentSource,
      targets: buildTargets(model),
      mode: model.mode,
      visualModel: model as unknown as Record<string, unknown>,
    },
    onConfirm,
    close: onClose,
  });

  return {
    activateCanvasTool,
    chooseReferenceForTool,
    handleAddSlider,
    handleAddElement,
    handleAddGliderPoint,
    handleAddElementLabel,
    handleAddAllLabels,
    handleRemoveAllLabels,
    handleDeleteSelected,
    handleCreateGuidedConstruction,
    handleSaveAndConfirm,
    normalizedRefs,
    constructionReady,
  };
  }, [
    model,
    mode,
    isFileMode,
    componentName,
    currentSource,
    status,
    diagnostics,
    selectedId,
    constructionKind,
    constructionRefs,
    pendingRefs,
    handleVisualEdit,
    selectOnly,
    setCanvasTool,
    setPendingRefs,
    saveDiagram,
    onConfirm,
    onClose,
    onRequestDeleteConfirmation,
  ]);
}
