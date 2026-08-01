import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useDiagramState } from '../hooks/useDiagramState';
import { useDiagramDiagnostics } from '../hooks/useDiagramDiagnostics';
import { useDiagramClipboard } from '../hooks/useDiagramClipboard';
import { useWorkbenchKeyboard } from '../hooks/useWorkbenchKeyboard';
import { createTemplateModel } from '../model/templateModels';
import { useDiagramWorkbenchLoader, type DiagramWorkbenchMode } from '../hooks/useDiagramWorkbenchLoader';
import type {
  CanvasTool,
  TemplateKind,
  VisualPoint,
  VisualElement,
  VisualSlider,
  VisualStep,
  VisualDiagramModel,
  ElementKind,
} from '../model/types';
import {
  refsNeededForTool,
  toolReferencesAreReady,
  addToolReference,
  KIND_LABELS,
  refsForKind,
  generatedElementId,
  elementColorForKind,
  defaultElementProperties,
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
} from '../model';
import {
  confirmWorkbench,
  makeVisibleInEveryStep,
  workbenchIsBlocked,
} from '../hooks/useWorkbenchActions';
import { buildTargets } from '../model/selectors';
import type { EditorDiagramReference } from '../../core/editorTypes';
import { WorkbenchHeader } from './WorkbenchHeader';
import { WorkbenchToolbar } from './WorkbenchToolbar';
import { CanvasStage } from './canvas/CanvasStage';
import type { CanvasFrameMode } from './canvas/canvasFrameMode';
import { WorkbenchSceneTree } from './WorkbenchSceneTree';
import { WorkbenchElementInspector } from './WorkbenchElementInspector';
import { WorkbenchStepsEditor } from './WorkbenchStepsEditor';
import { WorkbenchDiagnosticsPanel } from './WorkbenchDiagnosticsPanel';
import { PresetsModal } from './modals/PresetsModal';
import { CodeModal } from './modals/CodeModal';
import { DiagramSettingsModal } from './modals/DiagramSettingsModal';
import { MdxLinkModal } from './modals/MdxLinkModal';
import { GuidedConstructionsModal } from './modals/GuidedConstructionsModal';
import { DiagramConfirmDialog } from './DiagramConfirmDialog';
import { DiagramDivergenceDialog } from './DiagramDivergenceDialog';
import {
  effectiveSelection,
  primaryIdForSelection,
  repairBrokenReferences,
  syncStepObjectVisibility,
  toggleAdditiveSelection,
} from './workbenchSelection';

type InspectorTab = 'scene' | 'properties' | 'steps' | 'diagnostics';

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
}

export const DiagramWorkbench: React.FC<DiagramWorkbenchProps> = ({
  mode,
  metadataType = 'demostración',
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
    linkToMdxPage,
  } = useDiagramState();
  const sandboxMode = !mode;

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
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [frameMode, setFrameMode] = useState<CanvasFrameMode>('editor');
  const [showAllObjects, setShowAllObjects] = useState(false);

  const [presetsOpen, setPresetsOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mdxLinksOpen, setMdxLinksOpen] = useState(false);
  const [guidedOpen, setGuidedOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[] | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [divergenceDismissed, setDivergenceDismissed] = useState(false);

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
      handleVisualEdit({ ...model, title: newTitle }, { label: 'Renombrar diagrama' });
    },
    [handleVisualEdit, model]
  );

  const handleAddElementWithRefs = useCallback(
    (kind: ElementKind, explicitRefs: string[]) => {
      if (!model) return;
      const elementRefs = refsForKind(kind, explicitRefs);
      const newId = generatedElementId(kind, elementRefs, model.elements);
      const defaultProps = defaultElementProperties(kind) || {};
      const isAnnotation = ANNOTATION_KINDS.has(kind);
      const layerId = isAnnotation ? 'annotations' : 'geometry';

      const extraProperties =
        kind === 'infoPanel'
          ? {
              title: 'Panel Informativo',
              anchorMode: 'viewport' as const,
              viewportPosition: [0.08, 0.22] as [number, number],
            }
          : kind === 'text' || kind === 'label' || kind === 'formula'
          ? {
              text: 'Texto explicativo $A$',
            }
          : {};

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
          properties: { ...defaultProps, ...extraProperties },
          text: kind === 'infoPanel' ? 'Explicación del teorema o propiedad matemática en KaTeX: $a^2 + b^2 = c^2$' : undefined,
        }
      );
      const nextElement = {
        ...baseElement,
        layerId,
        order: nextLayerItemOrder(workingModel, layerId),
      };
      const nextModel = makeVisibleInEveryStep(
        {
          ...workingModel,
          elements: [...workingModel.elements, nextElement],
          dependencies: [
            ...(workingModel.dependencies || []),
            ...elementRefs.map(sourceId => ({ sourceId, targetId: newId, relation: 'construction' as const })),
          ],
        },
        newId
      );

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
      if (additive && ids.length === 1) {
        const next = toggleAdditiveSelection(effectiveSelectedIds, ids[0]);
        selectMany(next);
        return;
      }
      selectMany(ids);
    },
    [effectiveSelectedIds, selectMany],
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
      label: 'Parámetro k',
      x: -4,
      y: -4,
      min: -5,
      max: 5,
      value: 1,
      step: 0.1,
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
      makeVisibleInEveryStep({ ...model, sliders: [...model.sliders, newSlider] }, newId),
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
      const id = nextPointId(model.points);
      const nextPoint = {
        ...point(id, id.replace(/^p/, ''), 0, 0, false, 'ocre', 'glider', support.id),
        order: nextLayerItemOrder(model, 'geometry'),
      };
      const projected = projectPointToSupport(model, nextPoint, { x: 0, y: 0 });
      handleVisualEdit(
        makeVisibleInEveryStep(
          { ...model, points: [...model.points, { ...nextPoint, ...projected }] },
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
      ...model.points.map((p: VisualPoint) => p.id),
      ...model.elements.map((e: VisualElement) => e.id),
      ...model.sliders.map((s: VisualSlider) => s.id),
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
    (id: string, updates: Partial<VisualPoint>) => {
      if (!model) return;
      handleVisualEdit(updatePoint(model, id, updates), { label: `Editar punto ${id}` });
    },
    [handleVisualEdit, model]
  );

  const handleUpdateElement = useCallback(
    (id: string, updates: Partial<VisualElement>) => {
      if (!model) return;
      handleVisualEdit(updateElement(model, id, updates), { label: `Editar elemento ${id}` });
    },
    [handleVisualEdit, model]
  );

  const handleUpdateSlider = useCallback(
    (id: string, updates: Partial<VisualSlider>) => {
      if (!model) return;
      handleVisualEdit(updateSlider(model, id, updates), { label: `Editar deslizador ${id}` });
    },
    [handleVisualEdit, model]
  );

  const handleUpdateModel = useCallback(
    (nextModel: VisualDiagramModel, label: string) => {
      handleVisualEdit(nextModel, { label });
    },
    [handleVisualEdit]
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
    if (isDirty && !window.confirm('Hay cambios sin guardar. ¿Cerrar el editor de todos modos?')) return;
    if (onClose) {
      onClose();
      return;
    }
    if (window.history.length > 1) window.history.back();
    else window.location.href = '/';
  }, [isDirty, onClose]);

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

  const handleSave = onConfirm ? handleSaveAndConfirm : () => { void saveDiagram(); };

  const confirmBlocked = workbenchIsBlocked(
    state.status,
    state.diagnostics.some(diagnostic => diagnostic.severity === 'error'),
  );
  const effectiveSaveCapability = onConfirm
    ? { ...saveCapability, allowed: Boolean(model) && !confirmBlocked }
    : saveCapability;

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
    ? model.points.length + model.elements.length + model.sliders.length
    : 0;

  return (
    <div
      className="flex h-screen w-screen flex-col bg-lienzo text-carbon overflow-hidden select-none font-serif transition-colors"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <WorkbenchHeader
        model={model}
        componentName={state.componentName}
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
        diagnostics={enrichedDiagnostics}
        errorCount={errorCount}
        warningCount={warningCount}
        onOpenDiagnostics={() => setActiveTab('diagnostics')}
        onTitleChange={handleTitleChange}
        sandboxMode={sandboxMode}
        isDirty={isDirty}
        syncStatus={state.status}
        allowCleanApply={Boolean(onConfirm) && mode?.kind !== 'file' && mode?.kind !== 'rewrite'}
        saveCapability={effectiveSaveCapability}
        onSave={handleSave}
        onCloseEditor={handleCloseEditor}
      />

      <div className="relative z-40">
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
      </div>



      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        <CanvasStage
          model={model}
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
          onModelEdit={(nextModel, cmd) => handleVisualEdit(nextModel, cmd)}
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

        <aside className="w-80 md:w-96 flex flex-col border-l border-carbon/15 bg-lienzo/95 backdrop-blur-md overflow-hidden z-10 transition-colors">
          <div className="flex items-center border-b border-carbon/10 bg-carbon/5 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('scene')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'scene' ? 'bg-lienzo text-carbon shadow-2xs' : 'text-carbon/60 hover:text-carbon'
              }`}
            >
              Objetos ({objectCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('properties')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'properties' ? 'bg-lienzo text-carbon shadow-2xs' : 'text-carbon/60 hover:text-carbon'
              }`}
            >
              Propiedades
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('steps')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'steps' ? 'bg-lienzo text-carbon shadow-2xs' : 'text-carbon/60 hover:text-carbon'
              }`}
            >
              Pasos ({(model?.steps || []).length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('diagnostics')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer relative ${
                activeTab === 'diagnostics' ? 'bg-lienzo text-carbon shadow-2xs' : 'text-carbon/60 hover:text-carbon'
              }`}
            >
              Salud
              {errorCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-granada animate-pulse" />
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-visible relative z-0">
            {activeTab === 'scene' && (
              <WorkbenchSceneTree
                model={model}
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

            {activeTab === 'properties' && (
              <WorkbenchElementInspector
                model={model}
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
                model={model}
                activeStepIndex={activeStepIndex}
                selectedIds={effectiveSelectedIds}
                onSelectStepIndex={handleSelectStepIndex}
                onAddStep={handleAddStepClick}
                onUpdateStep={(idx, updates) => {
                  if (!model) return;
                  const nextSteps = [...(model.steps || [])];
                  nextSteps[idx] = { ...nextSteps[idx], ...updates };
                  handleVisualEdit({ ...model, steps: nextSteps }, { label: `Editar paso ${idx + 1}` });
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
              />
            )}

            {activeTab === 'diagnostics' && (
              <WorkbenchDiagnosticsPanel
                model={model}
                diagnostics={enrichedDiagnostics}
                onSelectDiagnostic={d => {
                  const objId = d.location?.objectId;
                  if (objId) {
                    selectMany([objId]);
                    setActiveTab('properties');
                  }
                }}
                onAutoFixBrokenReferences={handleAutoFixBrokenReferences}
              />
            )}
          </div>
        </aside>
      </div>

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
        isOpen={Boolean(pendingDeleteIds?.length)}
        title={pendingDeleteIds?.length === 1 ? 'Eliminar objeto' : 'Eliminar selección'}
        message={
          pendingDeleteIds?.length === 1
            ? `Se eliminará «${pendingDeleteIds[0]}» y sus dependientes. Esta acción se puede deshacer.`
            : `Se eliminarán ${pendingDeleteIds?.length ?? 0} objetos y sus dependientes. Esta acción se puede deshacer.`
        }
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
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
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-salvia/40 bg-lienzo px-4 py-2 text-xs font-bold text-salvia shadow-lg"
          onAnimationEnd={() => setStatusMessage('')}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
};
