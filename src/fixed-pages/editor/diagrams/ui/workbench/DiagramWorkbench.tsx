import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useDiagramState } from '@/fixed-pages/editor/diagrams/history/useDiagramState';
import { useDiagramDiagnostics } from '@/fixed-pages/editor/diagrams/checks/useDiagramDiagnostics';
import { useDiagramClipboard } from '@/fixed-pages/editor/diagrams/ui/workbench/useDiagramClipboard';
import { useWorkbenchKeyboard } from '@/fixed-pages/editor/diagrams/ui/workbench/useWorkbenchKeyboard';
import { createTemplateModel } from '../../model/scene/templateModels';
import { useDiagramWorkbenchLoader, type DiagramWorkbenchMode } from '@/fixed-pages/editor/diagrams/ui/workbench/useDiagramWorkbenchLoader';
import type {
  CanvasTool,
  TemplateKind,
  VisualSlider,
  VisualStep,
  VisualDiagramModel,
  ElementKind,
} from '../../model/types';
import {
  refsNeededForTool,
  toolReferencesAreReady,
  addToolReference,
  KIND_LABELS,
  refsForKind,
  generatedElementId,
  elementColorForKind,
  insertObjects,
  modelPoints,
  modelSliders,
  modelElements,
  element,
  nextLayerItemOrder,
  deleteDiagramCascade,
  updatePoint,
  updateElement,
  updateSlider,
  point,
  nextPointId,
  supportElements,
  projectPointToSupport,
} from '../../model';
import { withPointPosition } from '@/diagrams';
import type { ElementUpdate, PointUpdate, SliderUpdate } from '../inspector/types';
import {
  confirmWorkbench,
  makeVisibleInEveryStep,
  workbenchIsBlocked,
} from '@/fixed-pages/editor/diagrams/ui/workbench/useWorkbenchActions';
import { buildTargets } from '../../model/scene/selectors';
import type { EditorDiagramReference } from '@/fixed-pages/editor/session/editorTypes';
import { WorkbenchHeader } from './WorkbenchHeader';
import { WorkbenchToolbar } from '../toolbar/WorkbenchToolbar';
import { CanvasStage } from '../canvas/CanvasStage';
import type { CanvasFrameMode } from '../canvas/canvasFrameMode';
import { WorkbenchSceneTree } from './WorkbenchSceneTree';
import { GroupsAndLayersManager } from '../scene/GroupsAndLayersManager';
import { WorkbenchElementInspector } from './WorkbenchElementInspector';
import { WorkbenchStepsEditor } from '../toolbar/WorkbenchStepsEditor';
import { WorkbenchDiagnosticsPanel } from './WorkbenchDiagnosticsPanel';
import { WorkbenchAsideTabs } from '@/fixed-pages/editor/ui/workbench/WorkbenchAsideTabs';
import { EditorShell } from '@/fixed-pages/editor/ui/page/EditorShell';
import { DiagnosticsDock } from '@/fixed-pages/editor/ui/workbench/DiagnosticsDock';
import { useI18n } from '@/i18n';
import { translateEditorText } from '@/fixed-pages/editor/types/editorMessage';
import { DiagramDataPanel } from './DiagramDataPanel';
import { localizeDiagramSpec } from '@/diagrams/model/localizeDiagram';
import { applyLocalizedModelEdit } from '../../model/scene/translationEdits';
import { PresetsModal } from '../modals/PresetsModal';
import { CodeModal } from '../modals/CodeModal';
import { DiagramSettingsModal } from '../modals/DiagramSettingsModal';
import { MdxLinkModal } from '../modals/MdxLinkModal';
import { GuidedConstructionsModal } from '../modals/GuidedConstructionsModal';
import { DiagramConfirmDialog } from '../DiagramConfirmDialog';
import { DiagramDivergenceDialog } from '../DiagramDivergenceDialog';
import { renderRichText } from '@/fixed-pages/editor/diagrams/ui/primitives/richText';
import {
  buildEditorSaveCapabilityFromDiagram,
  warningSaveConfirmCopy,
  type EditorSaveBlockReason,
} from '@/fixed-pages/editor/save/saveCapability';
import {
  effectiveSelection,
  primaryIdForSelection,
  repairBrokenReferences,
  syncStepObjectVisibility,
  toggleAdditiveSelection,
} from '../workbenchSelection';

type InspectorTab = 'scene' | 'layers' | 'properties' | 'steps';

const ANNOTATION_KINDS = new Set(['infoPanel', 'text', 'label', 'formula']);

function ensureLayer(
  model: VisualDiagramModel,
  layerId: string,
  label: string,
  order: number,
): VisualDiagramModel {
  if (model.layers.some(layer => layer.id === layerId)) return model;
  return {
    ...model,
    layers: [...model.layers, { id: layerId, label, order, visible: true, locked: false }],
  };
}

interface DiagramWorkbenchProps {
  mode?: DiagramWorkbenchMode;
  metadataType?: string;
  onClose?: () => void;
  onConfirm?: (spec: EditorDiagramReference) => boolean | void | Promise<boolean | void>;
  onDirtyChange?: (dirty: boolean) => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  leftPanel?: React.ReactNode;
  leftPanelWidth?: number;
  onLeftPanelWidthChange?: (width: number) => void;
  inspectorWidth?: number;
  onInspectorWidthChange?: (width: number) => void;
  diagnosticsHeight?: number;
  onDiagnosticsHeightChange?: (height: number) => void;
}

export const DiagramWorkbench: React.FC<DiagramWorkbenchProps> = ({
  mode,
  metadataType = 'demostración',
  onClose,
  onConfirm,
  onDirtyChange,
  isSidebarOpen,
  onToggleSidebar,
  leftPanel,
  leftPanelWidth = 304,
  onLeftPanelWidthChange,
  inspectorWidth: inspectorWidthProp,
  onInspectorWidthChange,
  diagnosticsHeight: diagnosticsHeightProp,
  onDiagnosticsHeightChange,
}) => {
  const { t } = useI18n();
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
    linkToMdxPage,
  } = useDiagramState();
  const sandboxMode = !mode;

  useEffect(() => {
    onDirtyChange?.(isDirty);
    return () => onDirtyChange?.(false);
  }, [isDirty, onDirtyChange]);

  const model = state.currentModel;
  const canUndo = state.modelHistory?.past ? state.modelHistory.past.length > 0 : false;
  const canRedo = state.modelHistory?.future ? state.modelHistory.future.length > 0 : false;

  useDiagramWorkbenchLoader({
    isOpen: Boolean(mode),
    mode: mode ?? { kind: 'new', componentName: 'TrianguloInteractivo' },
    metadataType,
    loadDiagram,
    loadInlineDiagram,
    loadNewDiagram,
    loadDiagramForRewrite,
  });

  useEffect(() => {
    if (!mode && !state.currentModel) {
      const initial = createTemplateModel('triangulo-deformable', 'Triángulo Interactivo', 'demostración');
      loadNewDiagram('TrianguloInteractivo', initial);
    }
  }, [loadNewDiagram, mode, state.currentModel]);

  const [selectedIds, setSelectedIds] = useState<readonly string[]>([]);
  const [pendingRefs, setPendingRefs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<InspectorTab>('scene');
  const [diagramLang, setDiagramLang] = useState<string>('es');
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [localInspectorWidth, setLocalInspectorWidth] = useState(336);
  const inspectorWidth = inspectorWidthProp ?? localInspectorWidth;
  const setInspectorWidth = onInspectorWidthChange ?? setLocalInspectorWidth;
  const [localNavWidth, setLocalNavWidth] = useState(leftPanelWidth);
  const navigationWidth = onLeftPanelWidthChange ? leftPanelWidth : localNavWidth;
  const setNavigationWidth = onLeftPanelWidthChange ?? setLocalNavWidth;
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [localDiagnosticsHeight, setLocalDiagnosticsHeight] = useState(220);
  const diagnosticsHeight = diagnosticsHeightProp ?? localDiagnosticsHeight;
  const setDiagnosticsHeight = onDiagnosticsHeightChange ?? setLocalDiagnosticsHeight;
  const navigationOpen = isSidebarOpen ?? true;
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [frameMode, setFrameMode] = useState<CanvasFrameMode>('editor');
  const [showAllObjects, setShowAllObjects] = useState(false);

  const localizedModel = useMemo(
    () => (model ? localizeDiagramSpec(model, diagramLang) : null),
    [model, diagramLang],
  );
  const isTranslating = diagramLang !== 'es';
  /** Modelo que ven el lienzo y el inspector: en otra lengua, sus textos son los traducidos. */
  const editingModel = isTranslating ? (localizedModel ?? model) : model;

  /** En otra lengua, los textos editados se guardan como traducción y el resto va al modelo base. */
  const commitEdit = useCallback(
    (nextModel: VisualDiagramModel, command: Parameters<typeof handleVisualEdit>[1]) => {
      if (!model) return;
      if (!isTranslating || !localizedModel) {
        handleVisualEdit(nextModel, command);
        return;
      }
      const label = command && 'label' in command && command.label ? `${command.label} (${diagramLang.toUpperCase()})` : undefined;
      handleVisualEdit(
        applyLocalizedModelEdit(model, localizedModel, nextModel, diagramLang),
        label ? { ...command, label } : command,
      );
    },
    [diagramLang, handleVisualEdit, isTranslating, localizedModel, model],
  );

  const [presetsOpen, setPresetsOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mdxLinksOpen, setMdxLinksOpen] = useState(false);
  const [guidedOpen, setGuidedOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[] | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [divergenceDismissed, setDivergenceDismissed] = useState(false);
  const [pickingGroupId, setPickingGroupId] = useState<string | null>(null);
  const [pickingStepIndex, setPickingStepIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!statusMessage) return;
    const timer = window.setTimeout(() => setStatusMessage(''), 2200);
    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  useEffect(() => {
    if (state.status !== 'diverged') setDivergenceDismissed(false);
  }, [state.status]);

  const activeTool = state.canvasTool;
  const effectiveSelectedIds = useMemo(
    () => effectiveSelection(model, selectedIds),
    [model, selectedIds],
  );
  const primarySelectedId = primaryIdForSelection(effectiveSelectedIds);

  const { enrichedDiagnostics, diagnosticSummary, passiveErrorHighlightIds, saveCapability } = useDiagramDiagnostics(
    state.diagnostics,
    model,
    primarySelectedId,
    state,
    primarySelectedId,
  );

  const errorCount = diagnosticSummary.errorCount;
  const warningCount = diagnosticSummary.warningCount;

  const selectMany = useCallback(
    (ids: string[], primaryId?: string) => {
      const uniqueIds = [...new Set(ids)];
      setSelectedIds(uniqueIds);
      if (uniqueIds.length === 0) {
        selectElement('');
        return;
      }
      const primary = primaryId && uniqueIds.includes(primaryId) ? primaryId : uniqueIds[0];
      selectElement(primary);
    },
    [selectElement],
  );

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      if (!model) return;
      if (diagramLang === 'es') {
        handleVisualEdit({ ...model, title: newTitle }, { label: 'Renombrar diagrama' });
      } else {
        const currentTr = model.translations?.[diagramLang] || {};
        handleVisualEdit({
          ...model,
          translations: {
            ...model.translations,
            [diagramLang]: { ...currentTr, title: newTitle },
          },
        }, { label: `Renombrar diagrama (${diagramLang.toUpperCase()})` });
      }
    },
    [diagramLang, handleVisualEdit, model],
  );

  const handleAddElementWithRefs = useCallback(
    (kind: ElementKind, explicitRefs: string[]) => {
      if (!model) return;
      const elementRefs = refsForKind(kind, explicitRefs);
      const newId = generatedElementId(kind, elementRefs, model.objects);
      const isAnnotation = ANNOTATION_KINDS.has(kind);
      const layerId = isAnnotation ? 'annotations' : 'geometry';

      const workingModel = isAnnotation
        ? ensureLayer(model, 'annotations', 'Anotaciones & Texto', 20)
        : model;

      const baseElement = element(
        newId,
        KIND_LABELS[kind] || kind,
        kind,
        elementRefs,
        elementColorForKind(kind),
        kind !== 'label',
        {
          text: kind === 'infoPanel'
            ? 'Explicación del teorema o propiedad matemática en KaTeX: $a^2 + b^2 = c^2$'
            : kind === 'text' || kind === 'label' || kind === 'formula' ? 'Texto explicativo $A$' : undefined,
        }
      );
      const configuredElement = baseElement.objectType === 'annotation' && baseElement.variant === 'panel'
        ? { ...baseElement, content: { ...baseElement.content, title: 'Panel Informativo' }, anchor: { type: 'viewport' as const, position: [0.08, 0.22] as [number, number] } }
        : baseElement;
      const nextElement = {
        ...configuredElement,
        layerId,
        order: nextLayerItemOrder(workingModel, layerId),
      };
      const nextModel = makeVisibleInEveryStep(insertObjects(workingModel, [nextElement]), newId);

      handleVisualEdit(nextModel, { label: `Añadir ${KIND_LABELS[kind] || kind}` });
      selectMany([newId]);
      setActiveTab('properties');
    },
    [handleVisualEdit, model, selectMany]
  );

  const handleSelectTool = useCallback(
    (tool: CanvasTool) => {
      if (tool !== 'select' && tool !== 'point' && refsNeededForTool(tool) === 0) {
        handleAddElementWithRefs(tool as ElementKind, []);
        setCanvasTool('select');
        setPendingRefs([]);
        return;
      }
      setCanvasTool(tool);
      setPendingRefs([]);
    },
    [handleAddElementWithRefs, setCanvasTool]
  );

  const handleSelectObjects = useCallback(
    (ids: string[], additive = false) => {
      if (ids.length > 0 && model) {
        const targetId = ids[0];
        if (pickingGroupId) {
          const group = (model.groups || []).find(g => g.id === pickingGroupId);
          if (group) {
            const isMember = (group.memberIds || []).includes(targetId);
            const nextMemberIds = isMember
              ? (group.memberIds || []).filter(id => id !== targetId)
              : [...(group.memberIds || []), targetId];
            const nextGroups = (model.groups || []).map(g =>
              g.id === pickingGroupId ? { ...g, memberIds: nextMemberIds } : g
            );
            const updateGroupIds = <T extends { id: string; groupIds?: string[] }>(items: T[]): T[] => items.map(item => {
              if (item.id !== targetId) return item;
              const gIds = item.groupIds || [];
              return {
                ...item,
                groupIds: isMember ? gIds.filter(id => id !== pickingGroupId) : [...new Set([...gIds, pickingGroupId])],
              };
            });
            handleVisualEdit({
              ...model,
              groups: nextGroups,
              objects: updateGroupIds(model.objects),
            }, { label: `Modificar miembros de grupo ${pickingGroupId} desde lienzo` });
          }
        } else if (pickingStepIndex !== null && model.steps?.[pickingStepIndex]) {
          const step = model.steps[pickingStepIndex];
          const isVisible = (step.visibleTargets || []).includes(targetId);
          const updatedStep = syncStepObjectVisibility(step, targetId, !isVisible);
          const nextSteps = model.steps.map((st, i) => (i === pickingStepIndex ? updatedStep : st));
          handleVisualEdit({ ...model, steps: nextSteps }, { label: `Alternar visibilidad de ${targetId} en paso desde lienzo` });
        }
      }

      if (additive && ids.length === 1) {
        const next = toggleAdditiveSelection(effectiveSelectedIds, ids[0]);
        selectMany(next);
        return;
      }
      selectMany(ids);
    },
    [effectiveSelectedIds, handleVisualEdit, model, pickingGroupId, pickingStepIndex, selectMany],
  );

  const handleChooseReferenceForTool = useCallback(
    (refId: string): boolean => {
      if (activeTool === 'select' || activeTool === 'point' || refsNeededForTool(activeTool) === 0) {
        return false;
      }
      const nextRefs = addToolReference(activeTool, pendingRefs, refId);
      const isOpenEnded = activeTool === 'polygon' || activeTool === 'areaIntersection';
      if (!isOpenEnded && nextRefs.every(Boolean) && toolReferencesAreReady(activeTool, nextRefs)) {
        handleAddElementWithRefs(activeTool as ElementKind, nextRefs);
        setPendingRefs([]);
        setCanvasTool('select');
      } else {
        setPendingRefs(nextRefs);
        selectMany([refId]);
      }
      return true;
    },
    [activeTool, handleAddElementWithRefs, pendingRefs, selectMany, setCanvasTool]
  );

  const handleCompleteTool = useCallback(() => {
    if (
      (activeTool === 'polygon' || activeTool === 'areaIntersection')
      && toolReferencesAreReady(activeTool, pendingRefs)
    ) {
      handleAddElementWithRefs(activeTool, pendingRefs);
      setPendingRefs([]);
      setCanvasTool('select');
    }
  }, [activeTool, handleAddElementWithRefs, pendingRefs, setCanvasTool]);

  const handleCancelTool = useCallback(() => {
    setCanvasTool('select');
    setPendingRefs([]);
  }, [setCanvasTool]);

  const handleAddSliderClick = useCallback(() => {
    if (!model) return;
    const newId = `slider${Date.now().toString(36).slice(-3)}`;
    const newSlider: VisualSlider = {
      id: newId,
      objectType: 'control',
      variant: 'slider',
      label: 'Parámetro k',
      position: [-4, -4],
      range: { min: -5, max: 5, step: 0.1 },
      value: 1,
      color: 'pavo',
      layerId: 'controls',
      order: nextLayerItemOrder(model, 'controls'),
      visible: true,
      locked: false,
      groupIds: [],
      target: true,
      selection: { selectable: true, role: 'annotation' },
    };
    handleVisualEdit(
      makeVisibleInEveryStep(insertObjects(model, [newSlider]), newId),
      { label: 'Añadir deslizador' },
    );
    selectMany([newId]);
    setActiveTab('properties');
  }, [handleVisualEdit, model, selectMany]);

  const handleAddGliderPoint = useCallback(
    (supportId?: string) => {
      if (!model) return;
      const candidates = supportElements(model);
      const support = candidates.find(item => item.id === supportId) ?? candidates[0];
      if (!support) return;
      const id = nextPointId(model.objects);
      const nextPoint = {
        ...point(id, id.replace(/^p/, ''), 0, 0, false, 'ocre', 'glider', support.id),
        order: nextLayerItemOrder(model, 'geometry'),
      };
      const projected = projectPointToSupport(model, nextPoint, { x: 0, y: 0 });
      handleVisualEdit(
        makeVisibleInEveryStep(
          insertObjects(model, [withPointPosition(nextPoint, projected)]),
          id,
        ),
        { label: `Añadir punto sobre ${support.id}` },
      );
      selectMany([id]);
      setActiveTab('properties');
      setCanvasTool('select');
    },
    [handleVisualEdit, model, selectMany, setCanvasTool],
  );

  const handleAddStepClick = useCallback(() => {
    if (!model) return;
    const nextIdx = (model.steps || []).length + 1;
    const allObjectIds = [
      ...modelPoints(model).map(p => p.id),
      ...modelElements(model).map(e => e.id),
      ...modelSliders(model).map(s => s.id),
    ];
    const newStep: VisualStep = {
      id: `step${nextIdx}`,
      label: `Paso ${nextIdx}`,
      description: 'Descripción del nuevo paso de la demostración.',
      visibleTargets: allObjectIds,
    };
    handleVisualEdit({ ...model, steps: [...(model.steps || []), newStep] }, { label: `Añadir paso ${nextIdx}` });
    setActiveTab('steps');
    setActiveStepIndex(nextIdx - 1);
    setActiveStep(newStep.id);
  }, [handleVisualEdit, model, setActiveStep]);

  const handleSelectStepIndex = useCallback(
    (index: number | null) => {
      setActiveStepIndex(index);
      if (index === null || !model?.steps[index]) {
        setActiveStep('');
        setShowAllObjects(true);
        return;
      }
      setShowAllObjects(false);
      setActiveStep(model.steps[index].id);
    },
    [model, setActiveStep],
  );

  const handleUpdatePoint = useCallback(
    (id: string, updates: PointUpdate) => {
      if (!editingModel) return;
      commitEdit(updatePoint(editingModel, id, updates), { label: `Editar punto ${id}` });
    },
    [commitEdit, editingModel]
  );

  const handleUpdateElement = useCallback(
    (id: string, updates: ElementUpdate) => {
      if (!editingModel) return;
      commitEdit(updateElement(editingModel, id, updates), { label: `Editar elemento ${id}` });
    },
    [commitEdit, editingModel]
  );

  const handleUpdateSlider = useCallback(
    (id: string, updates: SliderUpdate) => {
      if (!editingModel) return;
      commitEdit(updateSlider(editingModel, id, updates), { label: `Editar deslizador ${id}` });
    },
    [commitEdit, editingModel]
  );

  const handleUpdateModel = useCallback(
    (nextModel: VisualDiagramModel, label: string) => {
      commitEdit(nextModel, { label });
    },
    [commitEdit]
  );

  const requestDeleteIds = useCallback((ids: string[]) => {
    const unique = [...new Set(ids)].filter(Boolean);
    if (unique.length === 0) return;
    setPendingDeleteIds(unique);
  }, []);

  const handleDeleteSelected = useCallback(
    (id: string) => {
      requestDeleteIds([id]);
    },
    [requestDeleteIds],
  );

  const confirmDeleteIds = useCallback(() => {
    if (!model || !pendingDeleteIds?.length) {
      setPendingDeleteIds(null);
      return;
    }
    let nextModel = model;
    for (const id of pendingDeleteIds) {
      nextModel = deleteDiagramCascade(nextModel, id).model;
    }
    handleVisualEdit(nextModel, {
      label: pendingDeleteIds.length === 1
        ? `Eliminar ${pendingDeleteIds[0]}`
        : `Eliminar ${pendingDeleteIds.length} objetos`,
    });
    selectMany(effectiveSelectedIds.filter(id => !pendingDeleteIds.includes(id)));
    setStatusMessage(
      pendingDeleteIds.length === 1
        ? `Eliminado ${pendingDeleteIds[0]}`
        : `Eliminados ${pendingDeleteIds.length} objetos`,
    );
    setPendingDeleteIds(null);
  }, [effectiveSelectedIds, handleVisualEdit, model, pendingDeleteIds, selectMany]);

  const handleToggleObjectInAllSteps = useCallback(
    (objectId: string, makeVisible: boolean) => {
      if (!model || !model.steps) return;
      const nextSteps = model.steps.map(st => syncStepObjectVisibility(st, objectId, makeVisible));
      handleVisualEdit({ ...model, steps: nextSteps }, { label: `Actualizar visibilidad masiva de ${objectId}` });
    },
    [handleVisualEdit, model]
  );

  const handleSelectPreset = useCallback(
    (kind: TemplateKind, title: string) => {
      const template = createTemplateModel(kind, title, 'demostración');
      const compName = title.replace(/[^A-Za-z0-9]/g, '') || 'DiagramaPreset';
      loadNewDiagram(compName, template);
      selectMany([]);
      setActiveStepIndex(null);
      setActiveStep('');
      setCanvasTool('select');
      setPendingRefs([]);
    },
    [loadNewDiagram, selectMany, setActiveStep, setCanvasTool]
  );

  const handleResetViewport = useCallback(() => {
    if (!model) return;
    const home = model.viewport.home ?? model.viewport.bounds ?? [-5, 5, 5, -5];
    handleVisualEdit(
      {
        ...model,
        viewport: { ...model.viewport, bounds: [...home] as [number, number, number, number] },
      },
      { label: 'Restablecer vista a coordenadas iniciales' }
    );
  }, [handleVisualEdit, model]);

  const handleAutoFixBrokenReferences = useCallback(() => {
    if (!model) return;
    handleVisualEdit(repairBrokenReferences(model), { label: 'Auto-reparar referencias rotas' });
    setStatusMessage('Referencias reparadas');
  }, [handleVisualEdit, model]);

  const handleCloseEditor = useCallback(() => {
    if (onClose) {
      onClose();
      return;
    }
    if (window.history.length > 1) window.history.back();
    else window.location.href = '/';
  }, [onClose]);

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

  const clipboard = useDiagramClipboard({
    model,
    selectedIds: effectiveSelectedIds,
    onModelEdit: handleVisualEdit,
    onSelectMany: selectMany,
    onShowObjects: () => setActiveTab('scene'),
  });

  const { onKeyDown } = useWorkbenchKeyboard({
    canvasTool: activeTool,
    selectedId: primarySelectedId,
    handleClipboardKeyDown: clipboard.handleKeyDown,
    selectTool: handleCancelTool,
    deleteSelected: () => {
      if (effectiveSelectedIds.length > 0) requestDeleteIds([...effectiveSelectedIds]);
    },
    undo,
    redo,
  });

  const objectCount = model
    ? model.objects.length
    : 0;

  const warningSaveCopy = warningSaveConfirmCopy(editorSaveCapability.warningCount, 'diagram');

  return (
    <div
      className="flex h-full w-full min-h-0 flex-col bg-lienzo text-carbon overflow-hidden select-none font-serif transition-colors"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <EditorShell
        className="font-serif"
        mainLabel={t('editor.diagramWorkbench.diagramCanvas')}
        header={
          <WorkbenchHeader
            model={model}
            filePath={state.filePath}
            metadataType={metadataType}
            componentName={state.componentName}
            activeLang={diagramLang}
            onSelectActiveLang={setDiagramLang}
            canUndo={canUndo}
            canRedo={canRedo}
            frameMode={frameMode}
            onSelectFrameMode={setFrameMode}
            onUndo={undo}
            onRedo={redo}
            onOpenPresets={() => setPresetsOpen(true)}
            onOpenCode={() => setCodeOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenMdxLinks={() => setMdxLinksOpen(true)}
            onOpenGuided={() => setGuidedOpen(true)}
            onResetViewport={handleResetViewport}
            isDiagnosticsOpen={isDiagnosticsOpen}
            onToggleDiagnostics={() => setIsDiagnosticsOpen(open => !open)}
            onTitleChange={handleTitleChange}
            sandboxMode={sandboxMode}
            saveCapability={editorSaveCapability}
            onSave={handleSave}
            onCloseEditor={handleCloseEditor}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={onToggleSidebar}
            isInspectorOpen={isInspectorOpen}
            onToggleInspector={() => setIsInspectorOpen(open => !open)}
          />
        }
        toolbar={
          <WorkbenchToolbar
            model={model}
            activeTool={activeTool}
            onSelectTool={handleSelectTool}
            onAddSliderClick={handleAddSliderClick}
            onAddStepClick={handleAddStepClick}
            onOpenGuidedClick={() => setGuidedOpen(true)}
            onAddGliderPoint={handleAddGliderPoint}
            gliderSupports={model ? supportElements(model) : []}
          />
        }
        navigationOpen={navigationOpen}
        navigationWidth={navigationWidth}
        setNavigationWidth={setNavigationWidth}
        navigation={
          leftPanel ?? (
            <DiagramDataPanel
              model={model}
              activeLang={diagramLang}
              onSelectActiveLang={setDiagramLang}
              onUpdateModel={(updates, label) => model && handleVisualEdit({ ...model, ...updates }, { label })}
              width={navigationWidth}
              onClose={onToggleSidebar}
            />
          )
        }
        inspectorOpen={isInspectorOpen}
        inspectorWidth={inspectorWidth}
        setInspectorWidth={setInspectorWidth}
        inspector={
          <WorkbenchAsideTabs
            aria-label={t('editor.diagramWorkbench.diagramInspectorSections')}
            tabs={[
              { id: 'scene', label: t('editor.diagramWorkbench.tabObjects', { count: objectCount }) },
              { id: 'layers', label: t('editor.diagramWorkbench.tabLayers') },
              { id: 'properties', label: t('editor.diagramWorkbench.tabProperties') },
              { id: 'steps', label: t('editor.diagramWorkbench.tabSteps', { count: (model?.steps || []).length }) },
            ]}
            activeTab={activeTab}
            onTabChange={id => setActiveTab(id as typeof activeTab)}
          >
            {activeTab === 'scene' && (
              <WorkbenchSceneTree
                model={editingModel}
                selectedIds={effectiveSelectedIds}
                onSelectObjects={(ids, additive) => handleSelectObjects(ids, additive)}
                onUpdatePoint={handleUpdatePoint}
                onUpdateElement={handleUpdateElement}
                onUpdateSlider={handleUpdateSlider}
                onUpdateModel={handleUpdateModel}
                onCopySelection={clipboard.copySelected}
                onDeleteSelection={() => requestDeleteIds([...effectiveSelectedIds])}
              />
            )}

            {activeTab === 'layers' && (
              <GroupsAndLayersManager
                model={model}
                selectedIds={effectiveSelectedIds}
                pickingGroupId={pickingGroupId}
                onUpdateModel={handleUpdateModel}
                onSelectObjects={(ids, additive) => handleSelectObjects(ids, additive)}
                onTogglePickingGroupId={id => {
                  setPickingStepIndex(null);
                  setPickingGroupId(id);
                }}
              />
            )}

            {activeTab === 'properties' && isTranslating && (
              <p className="mx-4 mt-3 rounded-xl border border-canela/30 bg-canela/10 px-3 py-2 text-[11px] leading-snug text-carbon/75" role="status">
                {renderRichText(t('editor.diagramWorkbench.editingTextsIn', { language: diagramLang.toUpperCase() }), { b: c => <strong>{c}</strong> })}
              </p>
            )}
            {activeTab === 'properties' && (
              <WorkbenchElementInspector
                model={editingModel}
                selectedId={primarySelectedId}
                onUpdatePoint={handleUpdatePoint}
                onUpdateElement={handleUpdateElement}
                onUpdateSlider={handleUpdateSlider}
                onDeleteSelected={handleDeleteSelected}
                onUpdateModel={handleUpdateModel}
                onSelectId={newId => selectMany([newId])}
              />
            )}

            {activeTab === 'steps' && (
              <WorkbenchStepsEditor
                model={editingModel}
                activeStepIndex={activeStepIndex}
                selectedIds={effectiveSelectedIds}
                pickingStepIndex={pickingStepIndex}
                onSelectStepIndex={handleSelectStepIndex}
                onAddStep={handleAddStepClick}
                onUpdateStep={(idx, updates) => {
                  if (!editingModel) return;
                  const nextSteps = [...(editingModel.steps || [])];
                  nextSteps[idx] = { ...nextSteps[idx], ...updates };
                  commitEdit({ ...editingModel, steps: nextSteps }, { label: `Editar paso ${idx + 1}` });
                }}
                onDeleteStep={idx => {
                  if (!model) return;
                  const nextSteps = (model.steps || []).filter((_: VisualStep, i: number) => i !== idx);
                  handleVisualEdit({ ...model, steps: nextSteps }, { label: `Eliminar paso ${idx + 1}` });
                  if (activeStepIndex === null) return;
                  if (activeStepIndex === idx) {
                    handleSelectStepIndex(null);
                  } else if (activeStepIndex > idx) {
                    handleSelectStepIndex(activeStepIndex - 1);
                  }
                }}
                onToggleObjectInAllSteps={handleToggleObjectInAllSteps}
                onUpdateModel={handleUpdateModel}
                onSelectObjects={(ids, additive) => handleSelectObjects(ids, additive)}
                onTogglePickingStepIndex={idx => {
                  setPickingGroupId(null);
                  setPickingStepIndex(idx);
                }}
              />
            )}
          </WorkbenchAsideTabs>
        }
        diagnosticsOpen={isDiagnosticsOpen}
        diagnosticsHeight={diagnosticsHeight}
        setDiagnosticsHeight={setDiagnosticsHeight}
        diagnostics={
          <DiagnosticsDock
            errorCount={editorSaveCapability.errorCount}
            warningCount={editorSaveCapability.warningCount}
            onClose={() => setIsDiagnosticsOpen(false)}
          >
            <WorkbenchDiagnosticsPanel
              model={model}
              diagnostics={enrichedDiagnostics}
              onSelectDiagnostic={d => {
                const objId = d.location?.objectId;
                if (objId) {
                  selectMany([objId]);
                  setIsInspectorOpen(true);
                  setActiveTab('properties');
                }
              }}
              onAutoFixBrokenReferences={handleAutoFixBrokenReferences}
            />
          </DiagnosticsDock>
        }
      >
        <CanvasStage
          model={editingModel}
          lang={diagramLang}
          selectedIds={effectiveSelectedIds}
          activeTool={activeTool}
          pendingRefs={pendingRefs}
          frameMode={frameMode}
          stepPreviewActive={activeStepIndex !== null && !showAllObjects}
          activeStepIndex={showAllObjects ? null : activeStepIndex}
          stepCount={model?.steps?.length ?? 0}
          errorHighlightedIds={passiveErrorHighlightIds}
          showAllObjects={showAllObjects || activeStepIndex === null}
          onToggleShowAllObjects={() => setShowAllObjects(prev => !prev)}
          onClearStepPreview={() => {
            handleSelectStepIndex(null);
            setShowAllObjects(true);
          }}
          onStepPrev={() => {
            if (!model?.steps?.length) return;
            setShowAllObjects(false);
            const idx = activeStepIndex === null ? model.steps.length - 1 : Math.max(0, activeStepIndex - 1);
            handleSelectStepIndex(idx);
          }}
          onStepNext={() => {
            if (!model?.steps?.length) return;
            setShowAllObjects(false);
            const idx = activeStepIndex === null ? 0 : Math.min(model.steps.length - 1, activeStepIndex + 1);
            handleSelectStepIndex(idx);
          }}
          onSelect={handleSelectObjects}
          onModelEdit={commitEdit}
          onChooseReferenceForTool={handleChooseReferenceForTool}
          onCompleteTool={handleCompleteTool}
          onCancelTool={handleCancelTool}
          onResetViewport={handleResetViewport}
          onToggleGrid={() =>
            model && handleVisualEdit({ ...model, grid: !model.grid }, { label: 'Alternar rejilla' })
          }
          onToggleAxis={() =>
            model && handleVisualEdit({ ...model, axis: !model.axis }, { label: 'Alternar ejes' })
          }
        />
      </EditorShell>

      <PresetsModal
        isOpen={presetsOpen}
        onClose={() => setPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <CodeModal
        isOpen={codeOpen}
        model={model}
        componentName={state.componentName}
        sandboxMode={sandboxMode}
        source={state.currentSource}
        onSourceChange={handleSourceEdit}
        onClose={() => setCodeOpen(false)}
      />

      <DiagramSettingsModal
        isOpen={settingsOpen}
        model={model}
        onClose={() => setSettingsOpen(false)}
        onUpdateModel={(updates, label) => {
          if (!model) return;
          handleVisualEdit({ ...model, ...updates }, { label });
        }}
      />

      <MdxLinkModal
        isOpen={mdxLinksOpen}
        model={model}
        componentName={state.componentName}
        onClose={() => setMdxLinksOpen(false)}
        onUpdatePoint={handleUpdatePoint}
        onUpdateElement={handleUpdateElement}
        onUpdateSlider={handleUpdateSlider}
        sandboxMode={sandboxMode}
        filePath={state.filePath}
        diagramMode={model?.mode}
        onLinkToMdxPage={(mdxPath, diagramMode) => {
          void linkToMdxPage(mdxPath, diagramMode);
        }}
      />

      <GuidedConstructionsModal
        isOpen={guidedOpen}
        model={model}
        onClose={() => setGuidedOpen(false)}
        onUpdateModel={handleUpdateModel}
      />

      <DiagramConfirmDialog
        isOpen={warningSaveOpen}
        title={translateEditorText(t, warningSaveCopy.title)}
        message={translateEditorText(t, warningSaveCopy.message)}
        confirmLabel={t('editor.save.saveAnyway')}
        cancelLabel={t('editor.common.cancel')}
        variant="warning"
        onConfirm={confirmWarningSave}
        onCancel={() => setWarningSaveOpen(false)}
      />

      <DiagramConfirmDialog
        isOpen={Boolean(pendingDeleteIds?.length)}
        title={pendingDeleteIds?.length === 1 ? t('editor.diagramWorkbench.deleteObject') : t('editor.diagramWorkbench.deleteSelection')}
        message={
          pendingDeleteIds?.length === 1
            ? t('editor.diagramWorkbench.deleteOneMessage', { id: pendingDeleteIds[0] })
            : t('editor.diagramWorkbench.deleteManyMessage', { count: pendingDeleteIds?.length ?? 0 })
        }
        confirmLabel={t('editor.diagramWorkbench.delete')}
        cancelLabel={t('editor.diagramWorkbench.cancel')}
        onConfirm={confirmDeleteIds}
        onCancel={() => setPendingDeleteIds(null)}
      />

      {state.status === 'diverged' && !divergenceDismissed && model && (
        <DiagramDivergenceDialog
          isOpen
          model={model}
          source={state.currentSource}
          onResolve={authority => {
            resolveDivergence(authority);
            setDivergenceDismissed(false);
          }}
          onClose={() => setDivergenceDismissed(true)}
        />
      )}

      {statusMessage && (
        <div
          role="status"
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-canela/40 bg-lienzo px-4 py-2 text-xs font-bold text-canela shadow-lg"
          onAnimationEnd={() => setStatusMessage('')}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
};
