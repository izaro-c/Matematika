import React, { useRef, useState } from 'react';
import type { EditorDiagramReference } from '../../core/editorTypes';
import type { CanvasTool, ConstructionKind, ElementKind, VisualDiagramModel } from '../../diagrams/model/types';
import { useDiagramState } from '../../diagrams/hooks/useDiagramState';
import { buildTargets, getDiagramSaveCapability } from '../../diagrams/model/selectors';
import { DiagramCanvas } from '../../diagrams/ui/DiagramCanvas';
import { DiagramToolbar } from '../../diagrams/ui/DiagramToolbar';
import { DiagramInspector } from '../../diagrams/ui/DiagramInspector';
import { DiagramStatusBar } from '../../diagrams/ui/DiagramStatusBar';
import { DiagramReferencesPanel } from '../../diagrams/ui/DiagramReferencesPanel';
import { DiagramCodePanel } from '../../diagrams/ui/DiagramCodePanel';
import { DiagramValidationPanel } from '../../diagrams/ui/DiagramValidationPanel';
import { DiagramStepsEditor } from '../../diagrams/ui/DiagramStepsEditor';
import { DiagramTargetSelector } from '../../diagrams/ui/DiagramTargetSelector';
import { DiagramObjectList } from '../../diagrams/ui/DiagramObjectList';
import { DiagramOrganizationPanel } from '../../diagrams/ui/DiagramOrganizationPanel';
import { DiagramToolGuidance } from '../../diagrams/ui/DiagramToolGuidance';
import { DiagramWorkbenchNotices } from '../../diagrams/ui/DiagramWorkbenchNotices';
import { DiagramSectionOutlet } from '../../diagrams/ui/DiagramSectionOutlet';
import { DiagramGuidedConstructions } from '../../diagrams/ui/DiagramGuidedConstructions';
import { DiagramMovementAidsPanel } from '../../diagrams/ui/DiagramMovementAidsPanel';
import { DiagramResponsivePreview } from '../../diagrams/ui/DiagramResponsivePreview';
import { DiagramHeaderReadingsEditor } from '../../diagrams/ui/DiagramHeaderReadingsEditor';
import { generateDiagramSource } from '../../diagrams/source/generator';
import {
  KIND_LABELS, refsNeededForTool,
  addToolReference, toolReferencesAreReady,
  point, element, slider, projectPointToSupport,
  generatedElementId, elementColorForKind,
  defaultElementProperties,
  addLabelToElement,
  removeDiagramElements,
  supportElements, applyGuidedConstruction,
  normalizeConstructionRefs, validConstructionRefs,
  toolReferenceCandidates,
  deleteDiagramCascade,
} from '../../diagrams/model/commands';
import { useModalFocus } from '../hooks/useModalFocus';
import { useDiagramClipboard } from '../../diagrams/hooks/useDiagramClipboard';
import { useDiagramWorkbenchLoader, type DiagramWorkbenchMode } from '../../diagrams/hooks/useDiagramWorkbenchLoader';
import { getDiagramUsages } from '../../diagrams/references/usageIndex';
import { pageTypeFromContentPath } from '../../diagrams/model/publishedDiagramLayout';

export type { DiagramWorkbenchMode } from '../../diagrams/hooks/useDiagramWorkbenchLoader';

interface DiagramWorkbenchCoreProps {
  isOpen: boolean;
  mode: DiagramWorkbenchMode;
  metadataType: string;
  onClose: () => void;
  onConfirm: (spec: EditorDiagramReference) => boolean | void | Promise<boolean | void>;
}

type DiagramWorkbenchAdapterProps = Omit<DiagramWorkbenchCoreProps, 'mode'>;

function refsForElementKind(kind: ElementKind, refs: string[]): string[] {
  if (kind === 'polygon') return refs;
  if (kind === 'segment' || kind === 'line' || kind === 'ray' || kind === 'circle' || kind === 'intersection' || kind === 'midpoint' || kind === 'congruenceMark' || kind === 'parallelMark' || kind === 'dimensionLine' || kind === 'measurement') {
    return refs.slice(0, 2);
  }
  if (kind === 'arc' || kind === 'perpendicularFoot' || kind === 'baseExtension' || kind === 'perpendicular' || kind === 'parallel' || kind === 'angleBisector' || kind === 'angle' || kind === 'nonReflexAngle' || kind === 'rightAngle' || kind === 'perpendicularMark') {
    return refs.slice(0, 3);
  }
  if (kind === 'areaDecomposition') return refs.slice(0, 4);
  if (kind === 'poincareGeodesic' || kind === 'poincareArc' || kind === 'grid') return refs.slice(0, 4);
  if (kind === 'functionCurve' || kind === 'parametricCurve' || kind === 'infoPanel') return [];
  return refs.slice(0, 1);
}

function makeVisibleInEveryStep(candidate: VisualDiagramModel, objectId: string): VisualDiagramModel {
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

function workbenchIsBlocked(status: string, hasError: boolean): boolean {
  return ['invalid-source', 'diverged', 'conflict'].includes(status) || hasError;
}

function sourceCanRegenerate(parseStatus: string, status: string): boolean {
  return parseStatus === 'visual-exact' && !['source-authoritative', 'diverged'].includes(status);
}

function saveDiagramInFileMode(isFileMode: boolean, save: () => Promise<boolean>): void {
  if (isFileMode) void save();
}

function shouldShowCodeFallback(model: VisualDiagramModel | null, source: string, diagnosticCount: number): boolean {
  return !model && (source.length > 0 || diagnosticCount > 0);
}

function confirmCascadeDeletion(objectId: string, dependentIds: string[]): boolean {
  const details = dependentIds.length > 0
    ? `\n\nTambién se eliminarán ${dependentIds.length} dependiente(s): ${dependentIds.join(', ')}.`
    : '';
  return typeof globalThis.confirm !== 'function'
    || globalThis.confirm(`¿Eliminar ${objectId}?${details}\n\nPuede deshacer esta operación.`);
}

interface DeleteSelectedDiagramObjectOptions {
  model: VisualDiagramModel;
  selectedId: string;
  edit: (model: VisualDiagramModel, command: { label: string }) => void;
  clearSelection: () => void;
}

function deleteSelectedDiagramObject({
  model,
  selectedId,
  edit,
  clearSelection,
}: DeleteSelectedDiagramObjectOptions): void {
  if (!selectedId) return;
  const deletion = deleteDiagramCascade(model, selectedId);
  if (!confirmCascadeDeletion(selectedId, deletion.impact.dependentIds)) return;
  edit(deletion.model, { label: `Eliminar ${selectedId} y dependientes` });
  clearSelection();
}

function appendDiagramElement(model: VisualDiagramModel, kind: ElementKind, explicitRefs?: string[]): { model: VisualDiagramModel; id: string } {
  const refs = explicitRefs || toolReferenceCandidates(model, kind).map(item => item.id);
  const elementRefs = refsForElementKind(kind, refs);
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
    order: Math.max(0, ...[...model.points, ...model.elements].filter(item => item.layerId === baseElement.layerId).map(item => item.order)) + 1000,
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

interface ConfirmWorkbenchOptions {
  shouldSave: boolean;
  blocked: boolean;
  save: () => Promise<boolean>;
  reference: EditorDiagramReference;
  onConfirm: (spec: EditorDiagramReference) => boolean | void | Promise<boolean | void>;
  close: () => void;
}

async function confirmWorkbench({ shouldSave, blocked, save, reference, onConfirm, close }: ConfirmWorkbenchOptions): Promise<void> {
  if (shouldSave && !await save()) return;
  if (!shouldSave && blocked) return;
  if (await onConfirm(reference) === false) return;
  close();
}

interface ChooseToolReferenceOptions {
  tool: CanvasTool;
  pendingRefs: string[];
  referenceId: string;
  addElement: (kind: ElementKind, refs: string[]) => void;
  setPendingRefs: (refs: string[]) => void;
  select: (id: string) => void;
}

function chooseToolReference({ tool, pendingRefs, referenceId, addElement, setPendingRefs, select }: ChooseToolReferenceOptions): boolean {
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

function sectionTabClass(active: boolean): string {
  return `min-h-11 whitespace-nowrap rounded px-3 py-2 text-left text-xs font-bold transition-colors ${active ? 'bg-carbon text-lienzo' : 'text-carbon/60 hover:bg-carbon/5'}`;
}

function sectionDetailClass(active: boolean): string {
  return `ml-1 font-mono text-[9px] ${active ? 'text-lienzo/65' : 'text-carbon/35'}`;
}

function paneDisplay(active: boolean, display: 'block' | 'flex'): string {
  if (!active) return 'hidden';
  return display;
}

function publicationPageType(metadataType: string, mode: DiagramWorkbenchMode): string {
  if (metadataType) return metadataType;
  const diagramId = mode.kind === 'file' || mode.kind === 'rewrite' ? mode.path : mode.componentName;
  if (!diagramId) return '';
  return pageTypeFromContentPath(getDiagramUsages(diagramId)[0]?.contentPath);
}

function effectiveWorkbenchSelection(
  model: VisualDiagramModel | null,
  localSelection: readonly string[],
  primaryId: string,
): string[] {
  if (!model) return [];
  const validIds = new Set([...model.points, ...model.elements, ...model.sliders].map(item => item.id));
  const retained = localSelection.filter(id => validIds.has(id));
  if (retained.length > 0) return retained;
  return primaryId && validIds.has(primaryId) ? [primaryId] : [];
}

function toggledWorkbenchSelection(
  current: readonly string[],
  id: string,
  primaryId: string,
): { ids: string[]; primaryId: string } {
  if (!current.includes(id)) return { ids: [...current, id], primaryId: id };
  const ids = current.filter(selected => selected !== id);
  return {
    ids,
    primaryId: primaryId === id ? ids[ids.length - 1] ?? '' : primaryId,
  };
}

function primaryIdForSelection(ids: readonly string[], preferredId?: string): string {
  if (preferredId && ids.includes(preferredId)) return preferredId;
  return ids[ids.length - 1] ?? '';
}

interface WorkbenchKeyboardOptions {
  event: React.KeyboardEvent<HTMLDivElement>;
  canvasTool: CanvasTool;
  selectedId: string;
  handleClipboardKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  selectTool: () => void;
  deleteSelected: () => void;
  undo: () => void;
  redo: () => void;
}

function handleWorkbenchKeyboard({
  event,
  canvasTool,
  selectedId,
  handleClipboardKeyDown,
  selectTool,
  deleteSelected,
  undo,
  redo,
}: WorkbenchKeyboardOptions): void {
  handleClipboardKeyDown(event);
  const target = event.target as HTMLElement;
  if (target.matches('input, textarea, select, [contenteditable="true"]')) return;
  if (event.key === 'Escape' && canvasTool !== 'select') {
    event.preventDefault();
    event.stopPropagation();
    selectTool();
    return;
  }
  if ((event.key === 'Delete' || event.key === 'Backspace') && selectedId) {
    event.preventDefault();
    deleteSelected();
    return;
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'z') {
    event.preventDefault();
    if (event.shiftKey) redo();
    else undo();
    return;
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'y') {
    event.preventDefault();
    redo();
  }
}

export const DiagramWorkbenchCore: React.FC<DiagramWorkbenchCoreProps> = ({
  isOpen,
  mode,
  metadataType,
  onClose,
  onConfirm,
}) => {
  const {
    state,
    isDirty,
    loadDiagram,
    loadInlineDiagram,
    loadNewDiagram,
    loadDiagramForRewrite,
    handleVisualEdit,
    handleSourceEdit,
    undo,
    redo,
    selectElement,
    setCanvasTool,
    setActiveStep,
    resolveDivergence,
    saveDiagram,
  } = useDiagramState();

  const [workspace, setWorkspace] = useState<'build' | 'steps' | 'targets' | 'check' | 'source'>('build');
  const [canvasDisplay, setCanvasDisplay] = useState<'edit' | 'preview'>('edit');
  const [mobilePane, setMobilePane] = useState<'scene' | 'canvas' | 'properties'>('canvas');
  const [leftPanel, setLeftPanel] = useState<'objects' | 'organization' | 'diagram'>('objects');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const previewPageType = publicationPageType(metadataType, mode);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const workbenchRef = useModalFocus<HTMLDivElement>(isOpen, onClose, closeButtonRef);

  // Local UI states
  const [previewHighlightId, setPreviewHighlightId] = useState('');
  const [selectedTargetId, setSelectedTargetId] = useState('');

  // Guided constructions
  const [constructionKind, setConstructionKind] = useState<ConstructionKind>('mediatriz');
  const [constructionRefs, setConstructionRefs] = useState<Record<string, string>>({ a: '', b: '', c: '' });

  // Tool references selection
  const [pendingRefs, setPendingRefs] = useState<string[]>([]);
  const isFileMode = mode.kind === 'file' || mode.kind === 'rewrite';
  useDiagramWorkbenchLoader({
    isOpen,
    mode,
    metadataType,
    loadDiagram,
    loadInlineDiagram,
    loadNewDiagram,
    loadDiagramForRewrite,
  });

  const activateCanvasTool = (tool: CanvasTool) => {
    setPendingRefs([]);
    setCanvasTool(tool);
  };

  const chooseReferenceForTool = (referenceId: string) => {
    return chooseToolReference({
      tool: state.canvasTool,
      pendingRefs,
      referenceId,
      addElement: handleAddElement,
      setPendingRefs,
      select: selectOnly,
    });
  };

  const effectiveSelectedIds = effectiveWorkbenchSelection(state.currentModel, selectedIds, state.selectedId);

  const selectOnly = (id: string) => {
    setSelectedIds(id ? [id] : []);
    selectElement(id);
  };
  const selectMany = (ids: string[], primaryId?: string) => {
    const uniqueIds = [...new Set(ids)];
    setSelectedIds(uniqueIds);
    selectElement(primaryIdForSelection(uniqueIds, primaryId));
  };
  const toggleSelection = (id: string) => {
    const next = toggledWorkbenchSelection(effectiveSelectedIds, id, state.selectedId);
    selectMany(next.ids, next.primaryId);
  };

  const clipboard = useDiagramClipboard({
    model: state.currentModel,
    selectedIds: effectiveSelectedIds,
    onModelEdit: handleVisualEdit,
    onSelectMany: selectMany,
    onShowObjects: () => setMobilePane('scene'),
  });

  if (!isOpen) return null;

  const model: VisualDiagramModel | null = state.currentModel;
  const componentName = state.componentName || 'DiagramaInteractivo';
  const saveCapability = getDiagramSaveCapability(state);
  const saveCodeOnlyDiagram = () => saveDiagramInFileMode(isFileMode, saveDiagram);

  if (shouldShowCodeFallback(model, state.currentSource, state.diagnostics.length)) {
    return (
        <div ref={workbenchRef} className="fixed inset-0 z-50 flex flex-col bg-lienzo text-carbon font-sans" role="dialog" aria-modal="true" aria-label="Editor de diagramas en código">
          <header className="flex items-center justify-between border-b border-carbon/15 px-4 py-3 bg-carbon/5">
            <div>
              <h2 className="text-sm font-bold text-carbon">Editor de diagramas: código TSX</h2>
              <p className="text-[11px] text-carbon/55 font-mono">{state.filePath}</p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="rounded border border-carbon/20 px-3 py-1 text-xs font-bold text-carbon/75 hover:bg-carbon/5 transition-all"
            >
              Cerrar
            </button>
          </header>
          <DiagramCodePanel
            source={state.currentSource}
            sourceTouched={isDirty}
            filePath={state.filePath}
            componentName={componentName}
            onSourceChange={handleSourceEdit}
          />
          <DiagramValidationPanel
            diagnostics={state.diagnostics}
            targets={[]}
            selectedTargetId=""
            onSelectTarget={() => {}}
          />
          <DiagramStatusBar
            status={state.status}
            isDirty={isDirty}
            saveCapability={isFileMode ? saveCapability : undefined}
            onSave={saveCodeOnlyDiagram}
          />
        </div>
    );
  }
  if (!model) {
    return (
      <div ref={workbenchRef} className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Cargando editor de diagramas" aria-busy="true" tabIndex={-1}>
        <div className="rounded bg-lienzo p-6 shadow-xl max-w-sm w-full text-center">
          <p className="text-sm font-bold text-carbon">Cargando el editor de diagramas…</p>
        </div>
      </div>
    );
  }

  const handleSaveAndConfirm = () => confirmWorkbench({
    shouldSave: isFileMode,
    blocked: workbenchIsBlocked(state.status, state.diagnostics.some(diagnostic => diagnostic.severity === 'error')),
    save: saveDiagram,
    reference: {
      componentName,
      category: model.category,
      path: mode.kind === 'file' || mode.kind === 'rewrite' ? mode.path : '',
      importPath: mode.kind === 'file' || mode.kind === 'rewrite' ? mode.path : '',
      source: state.currentSource,
      targets: buildTargets(model),
      mode: model.mode,
      visualModel: model as unknown as Record<string, unknown>,
    },
    onConfirm,
    close: onClose,
  });

  // Quick action handlers
  const handleAddSlider = () => {
    const id = `slider${model.sliders.length + 1}`;
    const newSlider = {
      ...slider(id, `Control ${model.sliders.length + 1}`, -4, -4 + model.sliders.length * 0.45, 1),
      order: Math.max(0, ...model.sliders.filter(item => item.layerId === 'controls').map(item => item.order)) + 1000,
    };
    handleVisualEdit(makeVisibleInEveryStep({
      ...model,
      sliders: [...model.sliders, newSlider],
    }, id), { label: `Añadir control ${id}` });
    selectOnly(id);
    activateCanvasTool('select');
  };

  const handleAddElement = (kind: ElementKind, explicitRefs?: string[]) => {
    const result = appendDiagramElement(model, kind, explicitRefs);
    handleVisualEdit(result.model, { label: `Añadir ${KIND_LABELS[kind]}` });
    selectOnly(result.id);
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
      order: Math.max(0, ...[...model.points, ...model.elements].filter(item => item.layerId === 'geometry').map(item => item.order)) + 1000,
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
    deleteSelectedDiagramObject({
      model,
      selectedId: state.selectedId,
      edit: handleVisualEdit,
      clearSelection: () => selectOnly(''),
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

  const mdxTargets = buildTargets(model);

  return (
    <div ref={workbenchRef} onKeyDown={(event) => handleWorkbenchKeyboard({
      event,
      canvasTool: state.canvasTool,
      selectedId: state.selectedId,
      handleClipboardKeyDown: clipboard.handleKeyDown,
      selectTool: () => activateCanvasTool('select'),
      deleteSelected: handleDeleteSelected,
      undo,
      redo,
    })} className="fixed inset-0 z-50 flex flex-col bg-lienzo text-carbon font-sans" role="dialog" aria-modal="true" aria-labelledby="diagram-workbench-title">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-carbon/15 bg-carbon/5 px-3 py-2 sm:gap-4 sm:px-4">
        <div className="min-w-0 flex-1">
          <h2 id="diagram-workbench-title" className="truncate text-sm font-bold text-carbon">{model.title}</h2>
          <p className="hidden truncate text-[10px] font-mono text-carbon/45 sm:block">Editor visual exacto · {state.filePath}</p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="flex rounded border border-carbon/15 p-0.5 bg-lienzo" aria-label="Historial de comandos">
            <button
              type="button"
              onClick={undo}
              disabled={state.modelHistory.past.length === 0}
              className="min-h-11 min-w-11 rounded px-2 text-base font-bold text-carbon/70 hover:bg-carbon/5 disabled:opacity-35"
              aria-label="Deshacer"
              title={state.modelHistory.past[state.modelHistory.past.length - 1]?.label ?? 'Nada que deshacer'}
            >
              ↶
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={state.modelHistory.future.length === 0}
              className="min-h-11 min-w-11 rounded px-2 text-base font-bold text-carbon/70 hover:bg-carbon/5 disabled:opacity-35"
              aria-label="Rehacer"
              title={state.modelHistory.future[0]?.label ?? 'Nada que rehacer'}
            >
              ↷
            </button>
          </div>
          <div className="hidden rounded border border-carbon/15 p-0.5 bg-lienzo sm:flex" aria-label="Copiar y pegar objetos">
            <button type="button" onClick={clipboard.copySelected} disabled={effectiveSelectedIds.length === 0} className="min-h-11 rounded px-2 text-[10px] font-bold text-carbon/70 hover:bg-carbon/5 disabled:opacity-35" title="Copiar selección (Ctrl/Cmd+C)">Copiar {effectiveSelectedIds.length > 1 ? effectiveSelectedIds.length : ''}</button>
            <button type="button" onClick={clipboard.paste} disabled={!clipboard.canPaste} className="min-h-11 rounded px-2 text-[10px] font-bold text-carbon/70 hover:bg-carbon/5 disabled:opacity-35" title="Pegar (Ctrl/Cmd+V)">Pegar</button>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="min-h-11 rounded border border-carbon/20 px-3 text-xs font-bold text-carbon/75 hover:bg-carbon/5 transition-all"
          >
            Cerrar
          </button>
        </div>
      </header>

      <DiagramWorkbenchNotices clipboardStatus={clipboard.status} mode={mode} />

      <div className="flex min-h-0 flex-1 flex-col">
          <label className="flex min-h-14 shrink-0 items-center gap-3 border-b border-carbon/15 bg-lienzo px-3 text-[10px] font-bold uppercase tracking-wider text-carbon/50 sm:hidden">
            Tarea
            <select aria-label="Tarea del editor de diagramas" className="min-h-10 min-w-0 flex-1 rounded border border-carbon/15 bg-lienzo px-2 text-xs font-bold normal-case tracking-normal text-carbon" value={workspace} onChange={event => setWorkspace(event.target.value as typeof workspace)}>
              <option value="build">Diseñar</option>
              <option value="steps">Secuencia</option>
              <option value="targets">Enlaces MDX</option>
              <option value="check">Comprobar</option>
              <option value="source">Código TSX</option>
            </select>
          </label>
          <nav className="hidden shrink-0 items-center gap-1 overflow-x-auto border-b border-carbon/15 bg-lienzo px-2 py-1.5 sm:flex sm:px-3" role="tablist" aria-label="Tareas del editor de diagramas">
            {([
              ['build', 'Diseñar', `${model.points.length + model.elements.length + model.sliders.length} objetos`],
              ['steps', 'Secuencia', `${model.steps.length} pasos`],
              ['targets', 'Enlaces MDX', `${mdxTargets.length} targets`],
              ['check', 'Comprobar', state.diagnostics.length > 0 ? `${state.diagnostics.length} avisos` : 'Sin errores'],
              ['source', 'Código TSX', 'Avanzado'],
            ] as const).map(([id, label, detail]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-label={label}
                aria-selected={workspace === id}
                onClick={() => setWorkspace(id)}
                className={sectionTabClass(workspace === id)}
              >
                {label} <span className={`hidden sm:inline ${sectionDetailClass(workspace === id)}`}>{detail}</span>
              </button>
            ))}
          </nav>

          <DiagramSectionOutlet active={workspace === 'build'}><div className="flex min-h-0 flex-1 flex-col">
          <div className="relative grid min-h-0 flex-1 grid-cols-1 overflow-y-auto xl:grid-cols-[280px_minmax(0,1fr)_320px] xl:overflow-hidden 2xl:grid-cols-[320px_minmax(0,1fr)_360px]">
          {/* Left panel: tools & quick actions */}
          <aside className={`${paneDisplay(mobilePane === 'scene', 'block')} overflow-y-auto border-r border-carbon/15 bg-lienzo md:absolute md:inset-y-0 md:left-0 md:z-40 md:w-80 md:shadow-2xl xl:static xl:z-auto xl:block xl:w-auto xl:shadow-none`}>
            <nav className="sticky top-0 z-30 grid grid-cols-3 border-b border-carbon/10 bg-lienzo p-1.5" role="tablist" aria-label="Panel de escena">
              {([['objects', 'Objetos'], ['organization', 'Organizar'], ['diagram', 'Diagrama']] as const).map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={leftPanel === id} onClick={() => setLeftPanel(id)} className={`min-h-11 rounded px-1 text-[10px] font-bold ${leftPanel === id ? 'bg-carbon text-lienzo' : 'text-carbon/55 hover:bg-carbon/5'}`}>{label}</button>)}
            </nav>
            <div className="p-3">
              {leftPanel === 'objects' && <DiagramObjectList model={model} selectedId={state.selectedId} selectedIds={effectiveSelectedIds} onSelect={selectOnly} onToggleSelection={toggleSelection} onSelectMany={ids => selectMany(ids)} onCopySelection={clipboard.copySelected} onModelEdit={handleVisualEdit} />}

              {leftPanel === 'organization' && <DiagramOrganizationPanel model={model} onModelEdit={handleVisualEdit} onSelect={selectOnly} onCopyGroup={clipboard.copyGroup} />}

              {leftPanel === 'diagram' && <div className="divide-y divide-carbon/10">
                <section className="space-y-2 pb-4">
                  <h3 className="text-xs font-bold text-carbon">Identidad y publicación</h3>
                  <label className="block text-[10px] font-bold text-carbon/55">Título<input value={model.title} onChange={event => handleVisualEdit({ ...model, title: event.target.value }, { label: 'Editar título' })} className="mt-1 min-h-10 w-full rounded border border-carbon/15 bg-lienzo px-2 font-serif text-xs font-bold" /></label>
                  <label className="block text-[10px] font-bold text-carbon/55">Nota introductoria<textarea value={model.note} onChange={event => handleVisualEdit({ ...model, note: event.target.value }, { label: 'Editar nota' })} className="mt-1 min-h-20 w-full rounded border border-carbon/15 bg-lienzo p-2 font-serif text-xs leading-relaxed" /></label>
                  <div className="grid grid-cols-2 gap-2"><label className="text-[10px] font-bold text-carbon/55">Categoría<input value={model.category} onChange={event => handleVisualEdit({ ...model, category: event.target.value }, { label: 'Editar categoría' })} className="mt-1 min-h-10 w-full rounded border border-carbon/15 px-2 text-xs" /></label><label className="text-[10px] font-bold text-carbon/55">Uso<select value={model.mode} onChange={event => handleVisualEdit({ ...model, mode: event.target.value as VisualDiagramModel['mode'] }, { label: 'Editar modo' })} className="mt-1 min-h-10 w-full rounded border border-carbon/15 px-2 text-xs"><option value="diagram">Diagrama</option><option value="simulation">Simulación</option><option value="inline">Inline</option></select></label></div>
                </section>
                <div className="py-4"><DiagramHeaderReadingsEditor model={model} onModelEdit={handleVisualEdit} /></div>
                <section className="space-y-2 py-4">
                  <h3 className="text-xs font-bold text-carbon">Comprobar estados</h3>
                  <label className="block text-[10px] font-bold text-carbon/55">Elemento resaltado<select className="mt-1 min-h-10 w-full rounded border border-carbon/15 bg-lienzo px-2 text-xs" value={previewHighlightId} onChange={(e) => setPreviewHighlightId(e.target.value)}><option value="">Ninguno</option>{mdxTargets.map(t => <option key={t.qualifiedId ?? t.id} value={t.objectId ?? t.id}>{t.label} ({t.id})</option>)}</select></label>
                  <label className="block text-[10px] font-bold text-carbon/55">Paso activo<select className="mt-1 min-h-10 w-full rounded border border-carbon/15 bg-lienzo px-2 text-xs" value={state.activeStepId} onChange={(e) => setActiveStep(e.target.value)}><option value="">Mostrar todo</option>{model.steps.map(s => <option key={s.id} value={s.id}>{s.label} ({s.id})</option>)}</select></label>
                </section>
                <section className="py-4">
                  <h3 className="mb-2 text-xs font-bold text-carbon">Plano y viewport</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">{(['Min X', 'Max Y', 'Max X', 'Min Y'] as const).map((label, idx) => <label key={label} className="text-[10px] font-bold text-carbon/60">{label}<input type="number" step="0.5" className="mt-1 min-h-10 w-full rounded border border-carbon/15 bg-lienzo px-2 text-xs font-mono" value={model.viewport.bounds[idx]} onChange={(e) => { const val = Number(e.target.value); if (Number.isFinite(val)) { const nextBox = [...model.viewport.bounds] as [number, number, number, number]; nextBox[idx] = val; handleVisualEdit({ ...model, viewport: { ...model.viewport, bounds: nextBox } }, { label: 'Editar límites del viewport', mergeKey: 'viewport-input' }); } }} /></label>)}</div>
                  <button type="button" className="mt-2 min-h-10 w-full rounded border border-carbon/15 px-2 text-[10px] font-bold text-carbon/70 hover:bg-carbon/5" onClick={() => handleVisualEdit({ ...model, viewport: { ...model.viewport, home: [...model.viewport.bounds] as [number, number, number, number] } }, { label: 'Guardar vista inicial' })}>Guardar como vista inicial</button>
                </section>
                <div className="pt-4"><DiagramMovementAidsPanel model={model} onModelEdit={handleVisualEdit} onSelect={selectOnly} /></div>
              </div>}
            </div>
          </aside>

          {/* Center panel: toolbar + canvas + validation */}
          <main className={`${paneDisplay(mobilePane === 'canvas', 'flex')} min-h-[480px] min-w-0 flex-col gap-3 overflow-y-auto p-3 md:flex`}>
            <DiagramToolbar
              model={model}
              canvasTool={state.canvasTool}
              syncStatus={state.status}
              onSetCanvasTool={activateCanvasTool}
              onAddElement={handleAddElement}
              onModelEdit={handleVisualEdit}
              onAddSlider={handleAddSlider}
              onAddGliderPoint={handleAddGliderPoint}
              onAddAllLabels={handleAddAllLabels}
              onRemoveAllLabels={handleRemoveAllLabels}
              onResolveDivergence={resolveDivergence}
              guidedConstructions={<DiagramGuidedConstructions
                model={model}
                kind={constructionKind}
                refs={normalizedRefs}
                ready={constructionReady}
                onKindChange={setConstructionKind}
                onRefChange={(key, value) => setConstructionRefs(previous => ({ ...previous, [key]: value }))}
                onCreate={handleCreateGuidedConstruction}
              />}
            />

            <DiagramToolGuidance model={model} tool={state.canvasTool} refs={pendingRefs} onRefsChange={setPendingRefs} onCreate={handleAddElement} onCancel={() => activateCanvasTool('select')} />

            <div className="flex items-center gap-1 self-start rounded border border-carbon/10 bg-carbon/[0.02] p-0.5" role="tablist" aria-label="Modo del lienzo">
              <button type="button" role="tab" aria-selected={canvasDisplay === 'edit'} onClick={() => setCanvasDisplay('edit')} className={`rounded px-3 py-1.5 text-[10px] font-bold ${canvasDisplay === 'edit' ? 'bg-carbon text-lienzo' : 'text-carbon/55'}`}>Editar</button>
              <button type="button" role="tab" aria-selected={canvasDisplay === 'preview'} onClick={() => setCanvasDisplay('preview')} className={`rounded px-3 py-1.5 text-[10px] font-bold ${canvasDisplay === 'preview' ? 'bg-pavo text-lienzo' : 'text-carbon/55'}`}>Previsualizar</button>
            </div>

            {canvasDisplay === 'edit' ? <DiagramCanvas
              model={model}
              pageType={previewPageType}
              selectedId={state.selectedId}
              selectedIds={effectiveSelectedIds}
              canvasTool={state.canvasTool}
              pendingRefs={pendingRefs}
              previewHighlightId={previewHighlightId}
              previewStepId={state.activeStepId}
              onSelect={(id, additive) => additive ? toggleSelection(id) : selectOnly(id)}
              onModelEdit={handleVisualEdit}
              onChooseReferenceForTool={chooseReferenceForTool}
              onCompleteTool={() => activateCanvasTool('select')}
            /> : <DiagramResponsivePreview model={model} pageType={previewPageType} activeStepId={state.activeStepId} highlightedId={previewHighlightId} />}

          </main>

          {/* Right panel: contextual properties */}
          <aside className={`${paneDisplay(mobilePane === 'properties', 'block')} overflow-y-auto border-l border-carbon/15 bg-lienzo md:absolute md:inset-y-0 md:right-0 md:z-40 md:w-96 md:shadow-2xl xl:static xl:z-auto xl:block xl:w-auto xl:shadow-none`}>
            <DiagramInspector
              model={model}
              selectedId={state.selectedId}
              selectedIds={effectiveSelectedIds}
              onSelect={selectOnly}
              onModelEdit={handleVisualEdit}
              onDeleteSelected={handleDeleteSelected}
              onAddElementLabel={handleAddElementLabel}
              onCopySelection={clipboard.copySelected}
            />

          </aside>
        </div>
          <nav className="grid shrink-0 grid-cols-3 border-t border-carbon/15 bg-lienzo p-1 xl:hidden" aria-label="Vistas del editor">
            {([['scene', 'Escena'], ['canvas', 'Lienzo'], ['properties', 'Propiedades']] as const).map(([id, label]) => <button key={id} type="button" aria-current={mobilePane === id ? 'page' : undefined} onClick={() => setMobilePane(id)} className={`min-h-11 rounded px-3 text-sm font-bold ${mobilePane === id ? 'bg-carbon text-lienzo' : 'text-carbon/65'}`}>{label}</button>)}
          </nav>
        </div></DiagramSectionOutlet>
        <DiagramSectionOutlet active={workspace === 'steps'}>
          <main className="min-h-0 flex-1 overflow-y-auto bg-carbon/[0.02] p-3 sm:p-5" aria-label="Edición de la secuencia">
            <div className="mx-auto grid max-w-[96rem] items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,0.8fr)]">
              <DiagramStepsEditor
                model={model}
                activeStepId={state.activeStepId || model.steps[0]?.id || ''}
                onActiveStepChange={setActiveStep}
                onModelEdit={handleVisualEdit}
                onSelectObject={(id) => {
                  selectOnly(id);
                  setWorkspace('build');
                }}
              />
              <div className="sticky top-0">
                <DiagramCanvas model={model} pageType={previewPageType} selectedId={state.selectedId} selectedIds={effectiveSelectedIds} canvasTool="select" pendingRefs={[]} previewHighlightId={previewHighlightId} previewStepId={state.activeStepId} onSelect={(id, additive) => additive ? toggleSelection(id) : selectOnly(id)} onModelEdit={handleVisualEdit} onChooseReferenceForTool={() => false} onCompleteTool={() => {}} />
                <p className="mt-2 rounded border border-carbon/10 bg-lienzo p-2 text-[10px] text-carbon/55">La vista muestra el paso activo. Cambie de paso en la matriz para comprobar exactamente qué aparece.</p>
              </div>
            </div>
          </main>
        </DiagramSectionOutlet>
        <DiagramSectionOutlet active={workspace === 'targets'}>
          <main className="min-h-0 flex-1 overflow-y-auto bg-carbon/[0.02] p-3 sm:p-5" aria-label="Enlaces entre el diagrama y MDX">
            <div className="mx-auto max-w-6xl">
              <DiagramTargetSelector
                model={model}
                selectedTargetId={selectedTargetId}
                onSelectTarget={(objectId, targetId) => {
                  selectOnly(objectId);
                  setSelectedTargetId(targetId);
                  setPreviewHighlightId(objectId);
                }}
                onModelEdit={handleVisualEdit}
              />
            </div>
          </main>
        </DiagramSectionOutlet>
        <DiagramSectionOutlet active={workspace === 'check'}>
          <main className="min-h-0 flex-1 overflow-y-auto bg-carbon/[0.02] p-3 sm:p-5" aria-label="Comprobaciones del diagrama">
            <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
              <DiagramValidationPanel
                diagnostics={state.diagnostics}
                targets={mdxTargets}
                selectedTargetId={selectedTargetId}
                onSelectTarget={(target) => {
                  setSelectedTargetId(target.id);
                  setPreviewHighlightId(target.objectId ?? target.id);
                }}
              />
              <DiagramReferencesPanel filePath={state.filePath} />
            </div>
          </main>
        </DiagramSectionOutlet>
        <DiagramSectionOutlet active={workspace === 'source'}>
        <DiagramCodePanel
          source={state.currentSource}
          sourceTouched={state.status === 'source-authoritative' || state.status === 'diverged'}
          filePath={state.filePath}
          componentName={componentName}
          onSourceChange={handleSourceEdit}
          onRegenerate={sourceCanRegenerate(state.parseStatus, state.status) ? () => {
            const gen = generateDiagramSource(model, componentName);
            if (gen.ok) {
              handleSourceEdit(gen.source);
            }
          } : undefined}
        />
        </DiagramSectionOutlet>
      </div>

      {/* Footer Status Bar */}
      <DiagramStatusBar
        status={state.status}
        isDirty={isDirty}
        saveCapability={isFileMode ? saveCapability : undefined}
        onSave={handleSaveAndConfirm}
      />
    </div>
  );
};

export const FileDiagramWorkbench: React.FC<DiagramWorkbenchAdapterProps & { path: string }> = ({
  path,
  ...props
}) => (
  <DiagramWorkbenchCore
    {...props}
    mode={{ kind: 'file', path }}
  />
);

export const InlineDiagramWorkbench: React.FC<DiagramWorkbenchAdapterProps & {
  source: string;
  componentName?: string;
  model?: Record<string, unknown> | null;
}> = ({
  source,
  componentName,
  model,
  ...props
}) => (
  <DiagramWorkbenchCore
    {...props}
    mode={{ kind: 'inline', source, componentName, model }}
  />
);

export const NewDiagramWorkbench: React.FC<DiagramWorkbenchAdapterProps & { componentName: string }> = ({
  componentName,
  ...props
}) => (
  <DiagramWorkbenchCore
    {...props}
    mode={{ kind: 'new', componentName }}
  />
);

export const DiagramWorkbench = DiagramWorkbenchCore;
export default DiagramWorkbench;
