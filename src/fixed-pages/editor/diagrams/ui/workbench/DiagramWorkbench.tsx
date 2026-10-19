import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useDiagramState } from '@/fixed-pages/editor/diagrams/history/useDiagramState';
import { useDiagramDiagnostics } from '@/fixed-pages/editor/diagrams/checks/useDiagramDiagnostics';
import { useDiagramClipboard } from '@/fixed-pages/editor/diagrams/ui/workbench/useDiagramClipboard';
import { useWorkbenchKeyboard } from '@/fixed-pages/editor/diagrams/ui/workbench/useWorkbenchKeyboard';
import { createTemplateModel } from '../../model/scene/templateModels';
import { useDiagramWorkbenchLoader, type DiagramWorkbenchMode } from '@/fixed-pages/editor/diagrams/ui/workbench/useDiagramWorkbenchLoader';
import type {
  TemplateKind,
  VisualDiagramModel,
} from '../../model/types';
import {
  updatePoint,
  updateElement,
  updateSlider,
  supportElements,
} from '../../model';
import type { ElementUpdate, PointUpdate, SliderUpdate } from '../inspector/types';
import type { EditorDiagramReference } from '@/fixed-pages/editor/session/editorTypes';
import { useDiagramAuthoringActions } from './useDiagramAuthoringActions';
import { useDiagramSaveFlow } from './useDiagramSaveFlow';
import { useDiagramDeletion } from './useDiagramDeletion';
import { DiagramInspectorTabs, type InspectorTab } from './DiagramInspectorTabs';
import { DiagramWorkbenchDialogs } from './DiagramWorkbenchDialogs';
import { WorkbenchHeader } from './WorkbenchHeader';
import { WorkbenchToolbar } from '../toolbar/WorkbenchToolbar';
import { CanvasStage } from '../canvas/CanvasStage';
import type { CanvasFrameMode } from '../canvas/canvasFrameMode';
import { WorkbenchDiagnosticsPanel } from './WorkbenchDiagnosticsPanel';
import { EditorShell } from '@/fixed-pages/editor/ui/page/EditorShell';
import { DiagnosticsDock } from '@/fixed-pages/editor/ui/workbench/DiagnosticsDock';
import { DEFAULT_EDITOR_WORKSPACE_PREFERENCES } from '@/fixed-pages/editor/session/editorNavigationModel';
import { useI18n } from '@/i18n';
import { DiagramDataPanel } from './DiagramDataPanel';
import { localizeDiagramSpec } from '@/diagrams/model/localizeDiagram';
import { applyLocalizedModelEdit } from '../../model/scene/translationEdits';
import {
  effectiveSelection,
  primaryIdForSelection,
  repairBrokenReferences,
  syncStepObjectVisibility,
  toggleAdditiveSelection,
} from '../workbenchSelection';

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
  /** Panel inferior de avisos; controlado por la sesión del editor si se pasa. */
  isDiagnosticsOpen?: boolean;
  onDiagnosticsOpenChange?: (open: boolean) => void;
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
  isDiagnosticsOpen: isDiagnosticsOpenProp,
  onDiagnosticsOpenChange,
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
  const [activeTab, setActiveTab] = useState<InspectorTab>('scene');
  const [diagramLang, setDiagramLang] = useState<string>('es');
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [localInspectorWidth, setLocalInspectorWidth] = useState(336);
  const inspectorWidth = inspectorWidthProp ?? localInspectorWidth;
  const setInspectorWidth = onInspectorWidthChange ?? setLocalInspectorWidth;
  const [localNavWidth, setLocalNavWidth] = useState(leftPanelWidth);
  const navigationWidth = onLeftPanelWidthChange ? leftPanelWidth : localNavWidth;
  const setNavigationWidth = onLeftPanelWidthChange ?? setLocalNavWidth;
  const [localDiagnosticsOpen, setLocalDiagnosticsOpen] = useState(false);
  const isDiagnosticsOpen = isDiagnosticsOpenProp ?? localDiagnosticsOpen;
  const setIsDiagnosticsOpen = onDiagnosticsOpenChange ?? setLocalDiagnosticsOpen;
  const [localDiagnosticsHeight, setLocalDiagnosticsHeight] = useState(DEFAULT_EDITOR_WORKSPACE_PREFERENCES.diagnosticsHeight);
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


  const showProperties = useCallback(() => setActiveTab('properties'), []);
  const showSteps = useCallback(() => setActiveTab('steps'), []);
  const {
    pendingRefs,
    setPendingRefs,
    handleSelectTool,
    handleChooseReferenceForTool,
    handleCompleteTool,
    handleCancelTool,
    handleAddSliderClick,
    handleAddGliderPoint,
    handleAddStepClick,
  } = useDiagramAuthoringActions({
    model,
    activeTool,
    handleVisualEdit,
    selectMany,
    setCanvasTool,
    setActiveStep,
    setActiveStepIndex,
    showProperties,
    showSteps,
  });

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

  const { pendingDeleteIds, setPendingDeleteIds, requestDeleteIds, handleDeleteSelected, confirmDeleteIds } =
    useDiagramDeletion({
      model,
      selectedIds: effectiveSelectedIds,
      handleVisualEdit,
      selectMany,
      setStatusMessage,
    });

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
    [loadNewDiagram, selectMany, setActiveStep, setCanvasTool, setPendingRefs]
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

  const {
    editorSaveCapability,
    handleSave,
    confirmWarningSave,
    warningSaveOpen,
    setWarningSaveOpen,
    warningSaveCopy,
  } = useDiagramSaveFlow({
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
  });

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
            onToggleDiagnostics={() => setIsDiagnosticsOpen(!isDiagnosticsOpen)}
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
          <DiagramInspectorTabs
            model={model}
            editingModel={editingModel}
            objectCount={objectCount}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            selectedIds={effectiveSelectedIds}
            primarySelectedId={primarySelectedId}
            diagramLang={diagramLang}
            isTranslating={isTranslating}
            pickingGroupId={pickingGroupId}
            pickingStepIndex={pickingStepIndex}
            activeStepIndex={activeStepIndex}
            onSelectObjects={handleSelectObjects}
            onSelectId={newId => selectMany([newId])}
            onUpdatePoint={handleUpdatePoint}
            onUpdateElement={handleUpdateElement}
            onUpdateSlider={handleUpdateSlider}
            onUpdateModel={handleUpdateModel}
            onDeleteSelected={handleDeleteSelected}
            onDeleteSelection={() => requestDeleteIds([...effectiveSelectedIds])}
            onCopySelection={clipboard.copySelected}
            onTogglePickingGroupId={id => {
              setPickingStepIndex(null);
              setPickingGroupId(id);
            }}
            onTogglePickingStepIndex={idx => {
              setPickingGroupId(null);
              setPickingStepIndex(idx);
            }}
            onSelectStepIndex={handleSelectStepIndex}
            onAddStep={handleAddStepClick}
            onToggleObjectInAllSteps={handleToggleObjectInAllSteps}
            commitEdit={commitEdit}
            handleVisualEdit={handleVisualEdit}
          />
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

      <DiagramWorkbenchDialogs
        model={model}
        state={state}
        sandboxMode={sandboxMode}
        presetsOpen={presetsOpen}
        setPresetsOpen={setPresetsOpen}
        codeOpen={codeOpen}
        setCodeOpen={setCodeOpen}
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
        mdxLinksOpen={mdxLinksOpen}
        setMdxLinksOpen={setMdxLinksOpen}
        guidedOpen={guidedOpen}
        setGuidedOpen={setGuidedOpen}
        warningSaveOpen={warningSaveOpen}
        setWarningSaveOpen={setWarningSaveOpen}
        warningSaveCopy={warningSaveCopy}
        confirmWarningSave={confirmWarningSave}
        pendingDeleteIds={pendingDeleteIds}
        setPendingDeleteIds={setPendingDeleteIds}
        confirmDeleteIds={confirmDeleteIds}
        divergenceDismissed={divergenceDismissed}
        setDivergenceDismissed={setDivergenceDismissed}
        statusMessage={statusMessage}
        setStatusMessage={setStatusMessage}
        handleSelectPreset={handleSelectPreset}
        handleSourceEdit={handleSourceEdit}
        handleVisualEdit={handleVisualEdit}
        handleUpdateModel={handleUpdateModel}
        handleUpdatePoint={handleUpdatePoint}
        handleUpdateElement={handleUpdateElement}
        handleUpdateSlider={handleUpdateSlider}
        linkToMdxPage={linkToMdxPage}
        resolveDivergence={resolveDivergence}
      />
    </div>
  );
};
