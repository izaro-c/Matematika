import React, { useRef, useState } from 'react';
import type { EditorDiagramReference } from '../../core/editorTypes';
import type { ConstructionKind, VisualDiagramModel } from '../model/types';
import { useDiagramState } from '../hooks/useDiagramState';
import { buildTargets } from '../model/selectors';
import { useDiagramDiagnostics } from '../hooks/useDiagramDiagnostics';
import { DiagramCanvas } from './DiagramCanvas';
import { DiagramInspector } from './DiagramInspector';
import { DiagramStatusBar } from './DiagramStatusBar';
import { DiagramReferencesPanel } from './DiagramReferencesPanel';
import { DiagramCodePanel } from './DiagramCodePanel';
import { DiagramValidationPanel } from './DiagramValidationPanel';
import { DiagramStepsEditor } from './DiagramStepsEditor';
import { DiagramTargetSelector } from './DiagramTargetSelector';
import { DiagramObjectList } from './DiagramObjectList';
import { DiagramOrganizationPanel } from './DiagramOrganizationPanel';
import { DiagramToolGuidance } from './DiagramToolGuidance';
import { DiagramWorkbenchNotices } from './DiagramWorkbenchNotices';
import { DiagramSectionOutlet } from './DiagramSectionOutlet';
import { DiagramGuidedConstructions } from './DiagramGuidedConstructions';
import { DiagramMovementAidsPanel } from './DiagramMovementAidsPanel';
import { DiagramResponsivePreview } from './DiagramResponsivePreview';
import { DiagramHeaderReadingsEditor } from './DiagramHeaderReadingsEditor';
import { generateDiagramSource } from '../source/generator';
import {
  buildDeleteConfirmationMessage,
  saveDiagramInFileMode,
  shouldShowCodeFallback,
  sourceCanRegenerate,
  useWorkbenchActions,
  type DeleteConfirmationRequest,
} from '../hooks/useWorkbenchActions';
import { DiagramConfirmDialog } from './DiagramConfirmDialog';
import { useWorkbenchKeyboard } from '../hooks/useWorkbenchKeyboard';
import { useModalFocus } from '../../ui/hooks/useModalFocus';
import { useDiagramClipboard } from '../hooks/useDiagramClipboard';
import { useDiagramWorkbenchLoader, type DiagramWorkbenchMode } from '../hooks/useDiagramWorkbenchLoader';
import { getDiagramUsages } from '../references/usageIndex';
import { pageTypeFromContentPath } from '../model/publishedDiagramLayout';
import { ReferencePickProvider } from './relations/ReferencePickContext';
import { useReferencePick } from './relations/useReferencePick';
import { WorkbenchHeader } from './workbench/WorkbenchHeader';
import { WorkbenchWorkspaceNav } from './workbench/WorkbenchWorkspaceNav';
import { CanvasToolbarDock } from './workbench/CanvasToolbarDock';
import { CanvasControlsDock } from './workbench/CanvasControlsDock';

if (typeof window !== 'undefined') {
  if (!('popover' in HTMLElement.prototype)) {
    import('@oddbird/popover-polyfill').catch(console.error);
  }
  if (!('anchorName' in document.documentElement.style)) {
    import('@oddbird/css-anchor-positioning').catch(console.error);
  }
}

export type { DiagramWorkbenchMode } from '../hooks/useDiagramWorkbenchLoader';

type CanvasProps = React.ComponentProps<typeof DiagramCanvas>;

const DiagramCanvasWithReferencePick: React.FC<Omit<CanvasProps, 'referencePickActive' | 'onReferencePick'>> = (props) => {
  const { session, rejectMessage, handleCanvasId, clearPick } = useReferencePick();
  return (
    <div className="space-y-2">
      {session && (
        <div className="rounded border border-pavo/30 bg-pavo/10 px-2 py-1.5 text-[10px] font-medium text-pavo" role="status">
          {session.hint}
          {' · '}
          <button type="button" className="underline" onClick={clearPick}>Cancelar (Esc)</button>
        </div>
      )}
      {rejectMessage && (
        <div className="rounded border border-ocre/25 bg-ocre/10 px-2 py-1.5 text-[10px] font-medium text-ocre" role="status">
          {rejectMessage}
        </div>
      )}
      <DiagramCanvas
        {...props}
        referencePickActive={Boolean(session)}
        onReferencePick={handleCanvasId}
      />
    </div>
  );
};

type DiagramWorkbenchCoreProps = {
  isOpen: boolean;
  mode: DiagramWorkbenchMode;
  metadataType: string;
  onClose: () => void;
  onConfirm: (spec: EditorDiagramReference) => boolean | void | Promise<boolean | void>;
};

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
    linkToMdxPage,
    mdxLinkNotice,
  } = useDiagramState();

  const [workspace, setWorkspace] = useState<'build' | 'steps' | 'targets' | 'check' | 'source'>('build');
  const [canvasDisplay, setCanvasDisplay] = useState<'edit' | 'preview'>('edit');
  const [showAllObjects, setShowAllObjects] = useState(false);
  const [mobilePane, setMobilePane] = useState<'scene' | 'canvas' | 'properties'>('canvas');
  const [leftPanel, setLeftPanel] = useState<'objects' | 'organization' | 'diagram'>('objects');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const previewPageType = publicationPageType(metadataType, mode);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const workbenchRef = useModalFocus<HTMLDivElement>(isOpen, onClose, closeButtonRef);

  const [previewHighlightId, setPreviewHighlightId] = useState('');
  const [selectedTargetId, setSelectedTargetId] = useState('');

  const [constructionKind, setConstructionKind] = useState<ConstructionKind>('mediatriz');
  const [constructionRefs, setConstructionRefs] = useState<Record<string, string>>({ a: '', b: '', c: '' });

  const [pendingRefs, setPendingRefs] = useState<string[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmationRequest | null>(null);
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

  const componentName = state.componentName || 'DiagramaInteractivo';
  const actions = useWorkbenchActions({
    model: state.currentModel,
    mode,
    isFileMode,
    componentName,
    currentSource: state.currentSource,
    status: state.status,
    diagnostics: state.diagnostics,
    selectedId: state.selectedId,
    constructionKind,
    constructionRefs,
    pendingRefs,
    handleVisualEdit,
    selectOnly,
    setCanvasTool,
    setPendingRefs,
    saveDiagram,
    onConfirm,
    onRequestDeleteConfirmation: setDeleteConfirmation,
  });

  const keyboard = useWorkbenchKeyboard({
    canvasTool: state.canvasTool,
    selectedId: state.selectedId,
    handleClipboardKeyDown: clipboard.handleKeyDown,
    selectTool: () => actions.activateCanvasTool('select'),
    deleteSelected: actions.handleDeleteSelected,
    undo,
    redo,
  });

  const diagnostics = useDiagramDiagnostics(
    state.diagnostics,
    state.currentModel,
    state.selectedId,
    state,
    previewHighlightId,
  );

  const navigationOptions = {
    setWorkspace,
    setLeftPanel,
    setMobilePane,
    selectOnly,
    setPreviewHighlightId,
  };

  const navigateToDiagnostic = (diagnostic: Parameters<typeof diagnostics.navigateToDiagnostic>[0]) => {
    diagnostics.navigateToDiagnostic(diagnostic, navigationOptions);
  };

  const openDiagnostics = () => {
    diagnostics.openDiagnostics(setWorkspace);
  };

  if (!isOpen) return null;

  const model: VisualDiagramModel | null = state.currentModel;
  const saveCapability = diagnostics.saveCapability;
  const saveCodeOnlyDiagram = () => saveDiagramInFileMode(isFileMode, saveDiagram);

  if (shouldShowCodeFallback(model, state.currentSource, state.diagnostics.length)) {
    return (
        <div ref={workbenchRef} className="fixed inset-0 z-50 flex flex-col bg-lienzo text-carbon font-sans" role="dialog" aria-modal="true" aria-label="Editor de diagramas en código">
          <header className="flex items-center justify-between gap-3 border-b border-carbon/15 px-4 py-3 bg-carbon/5">
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-carbon">Editor de diagramas: código TSX</h2>
              <p className="text-[11px] text-carbon/55 font-mono">{state.filePath}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <DiagramStatusBar
                variant="inline"
                status={state.status}
                isDirty={isDirty}
                saveCapability={isFileMode ? saveCapability : undefined}
                onSave={saveCodeOnlyDiagram}
                onOpenDiagnostics={openDiagnostics}
              />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="rounded border border-carbon/20 px-3 py-1 text-xs font-bold text-carbon/75 hover:bg-carbon/5 transition-all"
              >
                Cerrar
              </button>
            </div>
          </header>
          <DiagramCodePanel
            source={state.currentSource}
            sourceTouched={isDirty}
            filePath={state.filePath}
            componentName={componentName}
            onSourceChange={handleSourceEdit}
          />
          <DiagramValidationPanel
            diagnostics={diagnostics.enrichedDiagnostics}
            targets={[]}
            selectedTargetId=""
            focusedDiagnosticId={diagnostics.focusedDiagnosticId}
            onSelectTarget={() => {}}
            onNavigate={navigateToDiagnostic}
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

  const {
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
  } = actions;

  const mdxTargets = buildTargets(model);

  return (
    <ReferencePickProvider>
    <div ref={workbenchRef} onKeyDown={keyboard.onKeyDown} className="fixed inset-0 z-50 flex flex-col bg-lienzo text-carbon font-sans" role="dialog" aria-modal="true" aria-labelledby="diagram-workbench-title">
      {/* Header Subcomponent */}
      <WorkbenchHeader
        model={model}
        filePath={state.filePath}
        status={state.status}
        isDirty={isDirty}
        isFileMode={isFileMode}
        saveCapability={saveCapability}
        selectedCount={effectiveSelectedIds.length}
        undoPastCount={state.modelHistory.past.length}
        undoFutureCount={state.modelHistory.future.length}
        undoLabel={state.modelHistory.past[state.modelHistory.past.length - 1]?.label}
        redoLabel={state.modelHistory.future[0]?.label}
        canPaste={clipboard.canPaste}
        clipboardStatus={clipboard.status}
        closeButtonRef={closeButtonRef}
        onSave={handleSaveAndConfirm}
        onOpenDiagnostics={openDiagnostics}
        onUndo={undo}
        onRedo={redo}
        onCopy={clipboard.copySelected}
        onPaste={clipboard.paste}
        onClose={onClose}
      />

      <DiagramConfirmDialog
        isOpen={Boolean(deleteConfirmation)}
        title={deleteConfirmation ? `¿Eliminar ${deleteConfirmation.objectId}?` : ''}
        message={deleteConfirmation ? buildDeleteConfirmationMessage(deleteConfirmation.objectId, deleteConfirmation.dependentIds) : ''}
        confirmLabel="Eliminar"
        onConfirm={() => {
          deleteConfirmation?.onConfirm();
          setDeleteConfirmation(null);
        }}
        onCancel={() => setDeleteConfirmation(null)}
      />

      <DiagramWorkbenchNotices clipboardStatus={clipboard.status} mode={mode} mdxLinkNotice={mdxLinkNotice} />

      <div className="flex min-h-0 flex-1 flex-col">
        {/* Workspace Task Navigation Subcomponent */}
        <WorkbenchWorkspaceNav
          model={model}
          workspace={workspace}
          mdxTargetsCount={mdxTargets.length}
          diagnosticSummary={diagnostics.diagnosticSummary}
          diagnosticsAcknowledged={diagnostics.diagnosticsAcknowledged}
          onSelectWorkspace={setWorkspace}
          onAcknowledgeDiagnostics={diagnostics.acknowledgeDiagnostics}
        />

          <DiagramSectionOutlet active={workspace === 'build'}><div className="flex min-h-0 flex-1 flex-col">

          <div className="relative grid min-h-0 flex-1 grid-cols-1 overflow-hidden xl:grid-cols-[280px_minmax(0,1fr)_340px] 2xl:grid-cols-[320px_minmax(0,1fr)_360px]">
          {/* Left panel: tools & quick actions */}
          <aside className={`${paneDisplay(mobilePane === 'scene', 'flex')} flex-col overflow-hidden border-r border-carbon/15 bg-lienzo md:absolute md:inset-y-0 md:left-0 md:z-40 md:w-80 md:shadow-2xl xl:static xl:z-auto xl:flex xl:w-auto xl:shadow-none`}>
            <nav className="sticky top-0 z-30 grid shrink-0 grid-cols-3 border-b border-carbon/10 bg-lienzo p-1.5" role="tablist" aria-label="Panel de escena">
              {([['objects', 'Objetos'], ['organization', 'Organizar'], ['diagram', 'Diagrama']] as const).map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={leftPanel === id} onClick={() => setLeftPanel(id)} className={`min-h-11 rounded px-1 text-[10px] font-bold ${leftPanel === id ? 'bg-carbon text-lienzo' : 'text-carbon/55 hover:bg-carbon/5'}`}>{label}</button>)}
            </nav>
            <div className="flex-1 overflow-y-auto p-3 overscroll-contain scrollbar-gutter-stable">
              {leftPanel === 'objects' && <DiagramObjectList model={model} selectedId={state.selectedId} selectedIds={effectiveSelectedIds} onSelect={selectOnly} onToggleSelection={toggleSelection} onSelectMany={ids => selectMany(ids)} onCopySelection={clipboard.copySelected} onModelEdit={handleVisualEdit} errorObjectIds={diagnostics.errorObjectIds} focusObjectId={diagnostics.listFocusObjectId} />}

              {leftPanel === 'organization' && <DiagramOrganizationPanel model={model} selectedId={state.selectedId} onModelEdit={handleVisualEdit} onSelect={selectOnly} onCopyGroup={clipboard.copyGroup} />}

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

          {/* Center panel: toolbar dock + canvas + controls dock */}
          <main className={`${paneDisplay(mobilePane === 'canvas', 'flex')} relative min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-carbon/[0.02] md:flex`}>
            {/* Top Toolbar Dock */}
            <CanvasToolbarDock
              model={model}
              canvasTool={state.canvasTool}
              syncStatus={state.status}
              currentSource={state.currentSource}
              pageType={previewPageType}
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

            {/* Middle Canvas Area */}
            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden p-2">
              <DiagramToolGuidance
                model={model}
                tool={state.canvasTool}
                refs={pendingRefs}
                onRefsChange={setPendingRefs}
                onCreate={handleAddElement}
                onCancel={() => activateCanvasTool('select')}
              />

              <div className="flex-1 overflow-hidden">
                {canvasDisplay === 'edit' ? (
                  <DiagramCanvasWithReferencePick
                    model={model}
                    pageType={previewPageType}
                    selectedId={state.selectedId}
                    selectedIds={effectiveSelectedIds}
                    canvasTool={state.canvasTool}
                    pendingRefs={pendingRefs}
                    previewHighlightId={previewHighlightId}
                    errorHighlightedIds={diagnostics.passiveErrorHighlightIds}
                    previewStepId={state.activeStepId}
                    showAllObjects={showAllObjects}
                    onSelect={(id, additive) => additive ? toggleSelection(id) : selectOnly(id)}
                    onModelEdit={handleVisualEdit}
                    onChooseReferenceForTool={(referenceId) => chooseReferenceForTool(referenceId, state.canvasTool)}
                    onCompleteTool={() => activateCanvasTool('select')}
                  />
                ) : (
                  <DiagramResponsivePreview model={model} pageType={previewPageType} activeStepId={state.activeStepId} highlightedId={previewHighlightId} />
                )}
              </div>
            </div>

            {/* Bottom Controls Dock */}
            <CanvasControlsDock
              model={model}
              canvasDisplay={canvasDisplay}
              showAllObjects={showAllObjects}
              activeStepId={state.activeStepId}
              onCanvasDisplayChange={setCanvasDisplay}
              onToggleShowAllObjects={setShowAllObjects}
              onActiveStepChange={setActiveStep}
              onModelEdit={handleVisualEdit}
            />
          </main>

          {/* Right panel: contextual properties */}
          <aside className={`${paneDisplay(mobilePane === 'properties', 'flex')} flex-col overflow-hidden border-l border-carbon/15 bg-lienzo md:absolute md:inset-y-0 md:right-0 md:z-40 md:w-96 md:shadow-2xl xl:static xl:z-auto xl:flex xl:w-auto xl:shadow-none`}>
            <div className="flex-1 overflow-y-auto p-3 overscroll-contain scrollbar-gutter-stable">
              <DiagramInspector
                model={model}
                selectedId={state.selectedId}
                selectedIds={effectiveSelectedIds}
                onSelect={selectOnly}
                onModelEdit={handleVisualEdit}
                onDeleteSelected={handleDeleteSelected}
                onAddElementLabel={handleAddElementLabel}
                onCopySelection={clipboard.copySelected}
                fieldErrors={diagnostics.selectedFieldErrors}
                navigation={diagnostics.inspectorNavigation}
                inspectorSection={diagnostics.inspectorSection}
                onInspectorSectionChange={diagnostics.handleInspectorSectionChange}
              />
            </div>
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
                <DiagramCanvas model={model} pageType={previewPageType} selectedId={state.selectedId} selectedIds={effectiveSelectedIds} canvasTool="select" pendingRefs={[]} previewHighlightId={previewHighlightId} errorHighlightedIds={diagnostics.passiveErrorHighlightIds} previewStepId={state.activeStepId} onSelect={(id, additive) => additive ? toggleSelection(id) : selectOnly(id)} onModelEdit={handleVisualEdit} onChooseReferenceForTool={() => false} onCompleteTool={() => {}} />
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
                diagnostics={diagnostics.enrichedDiagnostics}
                targets={mdxTargets}
                selectedTargetId={selectedTargetId}
                focusedDiagnosticId={diagnostics.focusedDiagnosticId}
                onSelectTarget={(target) => {
                  setSelectedTargetId(target.id);
                  setPreviewHighlightId(target.objectId ?? target.id);
                }}
                onNavigate={navigateToDiagnostic}
              />
              <DiagramReferencesPanel
                filePath={state.filePath}
                diagramMode={model.mode}
                onLinkToMdxPage={(mdxPath, mode) => { void linkToMdxPage(mdxPath, mode); }}
              />
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
    </div>
    </ReferencePickProvider>
  );
};

export const DiagramWorkbench = DiagramWorkbenchCore;
export default DiagramWorkbench;
