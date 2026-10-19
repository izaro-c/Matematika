import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { useI18n } from '@/i18n';
import { translateEditorText } from '@/fixed-pages/editor/types/editorMessage';
import { useEditorCore } from '@/fixed-pages/editor/session/useEditorCore';
import { SemanticLinker } from '../components/SemanticLinker';
import { DiagramWorkbenchHost } from '../../diagrams/ui/workbench/DiagramWorkbenchHost';
import type { EditorDiagramReference, EditorValidationIssue } from '@/fixed-pages/editor/session/editorTypes';
import { useDiagramUsages } from '@/fixed-pages/editor/diagrams/ui/workbench/useDiagramUsages';
import { usePageDiagramTargets } from '@/fixed-pages/editor/diagrams/ui/workbench/usePageDiagramTargets';
import { PublishedRuntimePreview } from '../preview/PublishedRuntimePreview';
import { defaultMode } from '@/fixed-pages/editor/diagrams/model/tools/diagramOptions';
import { EditorLandingView } from '../landing/EditorLandingView';

import { useEditorNavigationFlow } from '@/fixed-pages/editor/ui/page/useEditorNavigationFlow';
import { useUnsavedChangesGuard } from '@/fixed-pages/editor/ui/page/useUnsavedChangesGuard';
import { EditorRouteNotFound } from '@/fixed-pages/editor/ui/page/EditorRouteNotFound';
import { MathProviderBoundary } from '@/lib/page-context/MathStoreContext';
import { DiagramStepSyncContext } from '@/lib/page-context/DiagramStepSyncContext';
import { EditorShell } from '../page/EditorShell';
import { DiagnosticsDock } from './DiagnosticsDock';
import { EditorDiagnosticsPanel } from '../panels/EditorDiagnosticsPanel';
import { EditorNavigation } from '../page/EditorNavigation';
import { VisualEditorPanel } from '../panels/VisualEditorPanel';
import { CodeEditorPanel } from '../panels/CodeEditorPanel';
import { DiagramSourcePanel } from '../panels/DiagramSourcePanel';
import { EditorApiStatusBanner } from '../safety/EditorApiStatusBanner';
import { buildEditorSafetyPresentation } from '@/fixed-pages/editor/review/safetyPresentation';

import { MdxWorkbenchDialogs } from './mdx/MdxWorkbenchDialogs';
import { MdxWorkbenchHeader } from './MdxWorkbenchHeader';
import { MdxWorkbenchInspector, type InspectorTab } from './MdxWorkbenchInspector';
import { TranslationWorkbench } from './TranslationWorkbench';
import { useDocumentVersionsFlow } from './mdx/useDocumentVersionsFlow';
import { useDocumentSave } from './mdx/useDocumentSave';
import { useDiagramStepState } from './mdx/useDiagramStepState';
import { useBlockSelection } from './mdx/useBlockSelection';
import { useDiagramEditorSession } from './mdx/useDiagramEditorSession';
import { useSemanticLinker } from './mdx/useSemanticLinker';
import { findBlockIdForIssue } from './mdx/issueBlockTarget';

import {
  buildPageConnectionSummary,
  buildPageDiagramLinks,
  getInlineDiagramTargets,
  getPreviewPath,
  mergeDiagramTargets,
  type PageDiagramLink,
} from '../page/editorPageModel';

export const MdxWorkbench: React.FC = () => {
  const {
    files,
    filesLoading,
    filesError,
    loading,
    currentFile,
    editorMode,
    metadata,
    imports,
    exports: exportsSource,
    blocks,
    rawBody,
    localRevision,
    confirmedRevision,
    baseVersion,
    saving,
    validation,
    persistenceStatus,
    loadFileList,
    openFile,
    closeFile,
    setEditorMode,
    updateRawBody,
    updateBlock,
    removeBlock,
    addBlock,
    moveBlock,
    relocateBlock,
    relocateSection,
    stepSection,
    sectionBlocks,
    duplicateBlock,
    saveCurrentFile,
    saveDraftCurrentFile,
    setMetadata,
    bindDiagram,
    assignDiagramStep,
    createPage,
    createDiagram,
    createTranslation,
    compatibility,
    compatibilityReasons,
    canMutateVisualStructure,
    canEditVisualMetadata,
    persistenceLabel,
  } = useEditorCore();

  const isReadOnly = compatibility === 'read-only';
  const hasLocalChanges = localRevision > confirmedRevision;
  const isDiagramFile = currentFile?.endsWith('.tsx') ?? false;
  const currentResource = files.find(file => file.path === currentFile);

  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const [diagramDirty, setDiagramDirty] = useState(false);
  const cleanupDiagramSessionRef = useRef<() => void>(() => {});

  // 1. Unsaved changes guard & navigation flow
  const {
    pendingFileNavigation,
    setPendingFileNavigation,
    continuePendingNavigation,
    cancelPendingNavigation,
  } = useUnsavedChangesGuard({
    hasLocalChanges: hasLocalChanges || diagramDirty,
    setLocation,
    onBeforeDiscardNavigate: () => cleanupDiagramSessionRef.current(),
  });

  const {
    workspace,
    setWorkspace,
    isSidebarOpen,
    setIsSidebarOpen,
    isInspectorOpen,
    setIsInspectorOpen,
    isDiagnosticsOpen,
    setIsDiagnosticsOpen,
    openFileSafely,
    toggleFavorite,
    route,
    viewMode,
    originLang: urlOriginLang,
    setViewMode,
    urlBlockId,
    setUrlBlockId,
    urlStep,
    setUrlStep,
    landingSection: routeLandingSection,
    goToLanding,
    diagramSurfaceOpen,
    openDiagramSurface,
    closeDiagramSurface,
  } = useEditorNavigationFlow({
    files,
    filesLoading,
    filesError,
    currentFile,
    openFile,
    closeFile,
    loadFileList,
    hasLocalChanges,
    diagramDirty,
    setPendingFileNavigation,
  });

  const landingSection = routeLandingSection ?? 'documents';
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('page');
  const [formatBarNode, setFormatBarNode] = useState<React.ReactNode>(null);

  // Modals state
  const [createPageOpen, setCreatePageOpen] = useState(false);
  const [createDiagramOpen, setCreateDiagramOpen] = useState(false);
  const [addDiagramOpen, setAddDiagramOpen] = useState(false);

  const routePath = route.status === 'file' ? route.path : null;
  const {
    currentLang,
    documentVersions,
    translationOrigin,
    handleSwitchLanguage,
    handleCreateTranslation,
  } = useDocumentVersionsFlow({
    files,
    currentFile,
    currentResource,
    metadata,
    loading,
    urlOriginLang,
    routePath,
    hasPendingNavigation: Boolean(pendingFileNavigation),
    openFileSafely,
    createTranslation,
  });

  const {
    saveCapability,
    handleSaveDocument,
    confirmWarningSave,
    warningSaveCopy,
    warningSaveOpen,
    setWarningSaveOpen,
    saveErrorModalOpen,
    setSaveErrorModalOpen,
    saveErrorMessage,
  } = useDocumentSave({
    currentFile,
    hasLocalChanges,
    saving,
    baseVersion,
    isReadOnly,
    validation,
    pendingFileNavigation,
    cancelPendingNavigation,
    saveCurrentFile,
  });

  const { editingBlockId, setEditingBlockId, highlightedBlockId, focusBlock } = useBlockSelection({
    urlBlockId,
    setUrlBlockId,
    blocks,
    loading,
  });
  const { diagramStepSyncValue, syncDemoStepToDiagram } = useDiagramStepState({ urlStep, setUrlStep });

  const {
    rewriteDiagramPath,
    setRewriteDiagramPath,
    setActiveDiagramBlockId,
    setActiveDiagramIndex,
    clearDiagramSession,
    openDiagramEditor,
    handleCloseDiagramSurface,
    activeDiagramWorkbenchMode,
  } = useDiagramEditorSession({
    currentFile,
    blocks,
    route,
    viewMode,
    urlBlockId,
    cleanupRef: cleanupDiagramSessionRef,
    setDiagramDirty,
    openDiagramSurface,
    closeDiagramSurface,
  });

  // `vista=` decide el modo del motor (código o visual) una vez cargado el documento.
  useEffect(() => {
    if (loading || !currentFile?.endsWith('.mdx')) return;
    if (viewMode === 'code' && editorMode !== 'code') setEditorMode('code');
    if ((viewMode === 'visual' || viewMode === 'translate') && editorMode === 'code' && compatibility !== 'unsupported') setEditorMode('visual');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFile, loading, viewMode]);

  const { linkerState, openLinker, closeLinker, handleLinkCreated } = useSemanticLinker(blocks, updateBlock);

  const {
    linkedPages: diagramLinkedPages,
    error: diagramUsageError,
  } = useDiagramUsages(isDiagramFile ? currentFile : null, files);

  const setDiagramBuilderOpen = (open: boolean) => {
    if (open) {
      if (currentFile?.endsWith('.mdx')) {
        setAddDiagramOpen(true);
      } else {
        openDiagramEditor();
      }
    } else {
      setAddDiagramOpen(false);
      handleCloseDiagramSurface();
    }
  };

  const handleMetadataChange = (key: string, value: unknown) => {
    setMetadata(prev => ({ ...prev, [key]: value }));
  };

  const handleRemoveMetadataField = (key: string) => {
    setMetadata(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const canSaveDraft = Boolean(currentFile && hasLocalChanges && baseVersion);
  const canSave = saveCapability.allowed;

  const safetyPresentation = useMemo(
    () =>
      buildEditorSafetyPresentation({
        currentFile,
        compatibility,
        compatibilityReasons,
        persistenceStatus,
        validation,
        editorMode,
        isDiagramFile,
        translateText: text => translateEditorText(t, text),
      }),
    [compatibility, compatibilityReasons, currentFile, editorMode, isDiagramFile, persistenceStatus, t, validation],
  );

  const handleSelectIssue = (issue: EditorValidationIssue) => {
    setViewMode('visual');

    if (issue.area === 'metadata') {
      setIsInspectorOpen(true);
      setInspectorTab('page');
      setTimeout(() => {
        const topEl = document.querySelector('[data-panel="visual-editor"]') || document.querySelector('.max-w-2xl');
        topEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
      return;
    }

    const targetBlockId = findBlockIdForIssue(issue, blocks, rawBody);
    if (targetBlockId) focusBlock(targetBlockId);
  };

  const previewPath = useMemo(() => getPreviewPath(metadata), [metadata]);
  const pageDiagramLinks = useMemo<PageDiagramLink[]>(
    () => buildPageDiagramLinks(currentFile, imports, exportsSource, files, blocks),
    [blocks, currentFile, exportsSource, files, imports],
  );
  const {
    targets: fileDiagramTargets,
    loading: diagramTargetsLoading,
    error: diagramTargetsError,
  } = usePageDiagramTargets(pageDiagramLinks);

  const inlineDiagramTargets = useMemo(() => getInlineDiagramTargets(blocks), [blocks]);
  const combinedDiagramTargets = useMemo(
    () => mergeDiagramTargets(inlineDiagramTargets, fileDiagramTargets),
    [fileDiagramTargets, inlineDiagramTargets],
  );

  const pageConnectionSummary = useMemo(
    () => buildPageConnectionSummary(blocks, combinedDiagramTargets),
    [blocks, combinedDiagramTargets],
  );

  const insertInteractiveTargetParagraph = (target: { id: string; label?: string; color?: string }) => {
    const label = target.label || target.id;
    const content = `Paso interactivo sobre <InteractiveTarget targetId="${target.id}">${label}</InteractiveTarget>.`;
    addBlock(blocks.length, 'paragraph', content);
  };

  const currentTitle = (metadata.title as string) || '';
  const pageType = typeof metadata.type === 'string' ? metadata.type : '';
  const currentContentType = pageType || (metadata.contentType as string) || (isDiagramFile ? 'Diagrama' : 'Página');
  const publishedDiagramMode = defaultMode(pageType);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-lienzo font-sans text-carbon antialiased select-none">
      {/* API Status Banners */}
      <EditorApiStatusBanner />


      {/* Superficie diagrama: header a ancho completo; paneles debajo */}
      {diagramSurfaceOpen && activeDiagramWorkbenchMode ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <DiagramWorkbenchHost
            isOpen
            mode={activeDiagramWorkbenchMode}
            metadataType={currentContentType}
            onClose={handleCloseDiagramSurface}
            onDirtyChange={setDiagramDirty}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            leftPanelWidth={workspace.navigationWidth}
            onLeftPanelWidthChange={(width) => setWorkspace(prev => ({ ...prev, navigationWidth: width }))}
            inspectorWidth={workspace.inspectorWidth}
            onInspectorWidthChange={(width) => setWorkspace(prev => ({ ...prev, inspectorWidth: width }))}
            diagnosticsHeight={workspace.diagnosticsHeight}
            onDiagnosticsHeightChange={(height) => setWorkspace(prev => ({ ...prev, diagnosticsHeight: height }))}
            isDiagnosticsOpen={isDiagnosticsOpen}
            onDiagnosticsOpenChange={setIsDiagnosticsOpen}
            onConfirm={async (spec: EditorDiagramReference) => {
              await bindDiagram(spec);
              return true;
            }}
          />
        </div>
      ) : route.status === 'not-found' ? (
        <EditorRouteNotFound requested={route.requested} onBack={() => goToLanding()} />
      ) : route.status === 'catalog-error' ? (
        <EditorRouteNotFound requested={route.requested} onBack={() => goToLanding()} onRetry={loadFileList} />
      ) : !currentFile && route.status !== 'landing' ? (
        // La URL apunta a un archivo que aún no se ha abierto: no mostrar la portada entretanto.
        <main aria-busy="true" className="flex flex-1 items-center justify-center bg-lienzo font-serif text-sm text-carbon/60">
          {t('editor.nav.loadingContent')}
        </main>
      ) : !currentFile ? (
        <EditorLandingView
          files={files}
          isLoading={filesLoading}
          initialSection={landingSection}
          onSectionChange={section => goToLanding(section, { replace: true })}
          favoritePaths={workspace.favoritePaths}
          recentPaths={workspace.recentPaths}
          onOpenFile={openFileSafely}
          onToggleFavorite={toggleFavorite}
          onCreateDocument={() => setCreatePageOpen(true)}
          onCreateDiagram={() => setCreateDiagramOpen(true)}
        />
      ) : (
      <>
      <MathProviderBoundary>
      <DiagramStepSyncContext.Provider value={diagramStepSyncValue}>
      {/* Esquema único del editor (EditorShell) */}
      <EditorShell
        header={
          <MdxWorkbenchHeader
            currentFile={currentFile}
            fileTitle={currentTitle}
            contentType={currentContentType}
            currentLang={currentLang}
            documentVersions={documentVersions}
            canTranslate={translationOrigin.options.length > 0}
            onSwitchLanguage={handleSwitchLanguage}
            onCreateTranslation={(lang) => { void handleCreateTranslation(lang); }}
            viewMode={viewMode}
            onSetViewMode={setViewMode}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isInspectorOpen={isInspectorOpen}
            onToggleInspector={() => setIsInspectorOpen(!isInspectorOpen)}
            isDiagnosticsOpen={isDiagnosticsOpen}
            onToggleDiagnostics={() => setIsDiagnosticsOpen(open => !open)}
            onTitleChange={(newTitle) => handleMetadataChange('title', newTitle)}
            onSave={handleSaveDocument}
            onSaveDraft={() => void saveDraftCurrentFile()}
            onCreatePage={() => setCreatePageOpen(true)}
            onCloseEditor={() => {
              clearDiagramSession();
              goToLanding(isDiagramFile ? 'diagrams' : 'documents');
            }}
            canSaveDraft={canSaveDraft}
            isReadOnly={isReadOnly}
            workspaceLevel={workspace.level}
            onToggleWorkspaceLevel={() =>
              setWorkspace(prev => ({
                ...prev,
                level: prev.level === 'advanced' ? 'basic' : 'advanced',
              }))
            }
            saveCapability={saveCapability}
          />
        }
        toolbar={viewMode === 'visual' && !isDiagramFile ? formatBarNode : null}
        navigationOpen={isSidebarOpen}
        navigationWidth={workspace.navigationWidth}
        setNavigationWidth={(width) => setWorkspace(prev => ({ ...prev, navigationWidth: width }))}
        navigation={
          <EditorNavigation
            files={files}
            isLoading={filesLoading}
            error={filesError}
            currentFile={currentFile}
            openFile={openFileSafely}
            retry={loadFileList}
            close={() => setIsSidebarOpen(false)}
            level={workspace.level}
            favoritePaths={workspace.favoritePaths}
            recentPaths={workspace.recentPaths}
            toggleFavorite={toggleFavorite}
            width={workspace.navigationWidth}
            onCreatePage={() => setCreatePageOpen(true)}
            onCreateDiagram={() => setCreateDiagramOpen(true)}
            onCreateTranslation={(file, lang) => { void handleCreateTranslation(file, lang); }}
          />
        }
        inspectorOpen={isInspectorOpen}
        inspectorWidth={workspace.inspectorWidth}
        setInspectorWidth={(width) => setWorkspace(prev => ({ ...prev, inspectorWidth: width }))}
        inspector={
          <MdxWorkbenchInspector
            metadata={metadata}
            canEditVisualMetadata={canEditVisualMetadata}
            canMutateVisualStructure={canMutateVisualStructure}
            handleMetadataChange={handleMetadataChange}
            handleRemoveMetadataField={handleRemoveMetadataField}
            handleAddCustomMetadataField={() => {}}
            removeBlock={removeBlock}
            blocks={blocks}
            openFile={openFileSafely}
            pageDiagramLinks={pageDiagramLinks}
            pageConnectionSummary={pageConnectionSummary}
            diagramTargets={combinedDiagramTargets}
            diagramTargetsLoading={diagramTargetsLoading}
            diagramTargetsError={diagramTargetsError}
            setActiveDiagramIndex={setActiveDiagramIndex}
            setActiveDiagramBlockId={setActiveDiagramBlockId}
            setDiagramBuilderOpen={setDiagramBuilderOpen}
            insertInteractiveTargetParagraph={insertInteractiveTargetParagraph}
            onClose={() => setIsInspectorOpen(false)}
            activeTab={inspectorTab}
            onActiveTabChange={setInspectorTab}
          />
        }
        diagnosticsOpen={isDiagnosticsOpen}
        diagnosticsHeight={workspace.diagnosticsHeight}
        setDiagnosticsHeight={(height) => setWorkspace(prev => ({ ...prev, diagnosticsHeight: height }))}
        diagnostics={
          <DiagnosticsDock
            errorCount={validation.errorCount}
            warningCount={validation.warningCount}
            onClose={() => setIsDiagnosticsOpen(false)}
          >
            <EditorDiagnosticsPanel
              currentFile={currentFile}
              resource={currentResource}
              validation={validation}
              persistenceStatus={persistenceStatus}
              persistenceLabel={persistenceLabel}
              level={workspace.level}
              embedded
              onSelectIssue={handleSelectIssue}
              close={() => setIsDiagnosticsOpen(false)}
            />
          </DiagnosticsDock>
        }
      >
        {/* Central Workspace Area */}
        <div className="flex h-full w-full flex-1 overflow-hidden">
            {isDiagramFile ? (
              <div className="flex-1 overflow-hidden p-2">
                <DiagramSourcePanel
                  currentFile={currentFile}
                  diagramLinkedPages={diagramLinkedPages}
                  diagramUsageError={diagramUsageError}
                  openFile={openFileSafely}
                  setActiveDiagramBlockId={setActiveDiagramBlockId}
                  setActiveDiagramIndex={setActiveDiagramIndex}
                  setDiagramBuilderOpen={setDiagramBuilderOpen}
                  onRewriteVisually={() => {
                    setRewriteDiagramPath(currentFile);
                  }}
                  capability={currentResource?.capability}
                />
              </div>
            ) : viewMode === 'code' ? (
              <div className="flex-1 overflow-hidden">
                <CodeEditorPanel
                  rawBody={rawBody}
                  updateRawBody={updateRawBody}
                  isDiagramFile={false}
                  isDark={false}
                />
              </div>
            ) : viewMode === 'translate' ? (
              <div className="flex-1 h-full min-h-0 overflow-hidden">
                <TranslationWorkbench
                  blocks={blocks}
                  currentLang={currentLang}
                  originLang={translationOrigin.lang}
                  originPath={translationOrigin.path}
                  originOptions={translationOrigin.options}
                  onOriginChange={lang => setViewMode('translate', { originLang: lang })}
                  canEdit={!isReadOnly && canMutateVisualStructure}
                  updateBlock={updateBlock}
                  onEditVisually={blockId => {
                    setViewMode('visual');
                    focusBlock(blockId);
                  }}
                />
              </div>
            ) : viewMode === 'preview' ? (
              <div className="flex-1 h-full min-h-0 overflow-hidden">
                <PublishedRuntimePreview
                  open={true}
                  embedded
                  path={previewPath}
                  hasPendingChanges={hasLocalChanges}
                  revision={localRevision}
                  onClose={() => setViewMode('visual')}
                  blocks={blocks}
                  metadata={metadata}
                  diagramTargets={combinedDiagramTargets}
                  currentFile={currentFile}
                />
              </div>
            ) : (
              <div className="flex-1 h-full min-h-0 overflow-hidden">
                <VisualEditorPanel
                  currentFile={currentFile}
                  isLoading={loading}
                  metadata={metadata}
                  isReadOnly={isReadOnly}
                  canEditVisualMetadata={canEditVisualMetadata}
                  canMutateVisualStructure={canMutateVisualStructure}
                  blocks={blocks}
                  editingBlockId={editingBlockId}
                  setEditingBlockId={setEditingBlockId}
                  highlightedBlockId={highlightedBlockId}
                  issues={validation.issues}
                  handleMetadataChange={handleMetadataChange}
                  addBlock={addBlock}
                  moveBlock={moveBlock}
                  relocateBlock={relocateBlock}
                  relocateSection={relocateSection}
                  stepSection={stepSection}
                  sectionBlocks={sectionBlocks}
                  duplicateBlock={duplicateBlock}
                  removeBlock={removeBlock}
                  updateBlock={updateBlock}
                  handleTextareaSelect={() => {}}
                  handleEditLink={openLinker}
                  setActiveDiagramIndex={setActiveDiagramIndex}
                  setActiveDiagramBlockId={setActiveDiagramBlockId}
                  setDiagramBuilderOpen={setDiagramBuilderOpen}
                  diagramTargets={combinedDiagramTargets}
                  onAssignDiagramStep={assignDiagramStep}
                  onSyncDiagramStep={syncDemoStepToDiagram}
                  onFormatBarChange={setFormatBarNode}
                />
              </div>
            )}
        </div>
      </EditorShell>
      </DiagramStepSyncContext.Provider>
      </MathProviderBoundary>
      </>
      )}

      {/* Semantic Linker Popover / Modal */}
      {linkerState.isOpen && (
        <SemanticLinker
          isOpen={linkerState.isOpen}
          onClose={closeLinker}
          files={files}
          selectedText={linkerState.selectedText}
          onLinkCreated={handleLinkCreated}
          position={{ top: 120, left: 240 }}
          initialAttrs={linkerState.initialAttrs}
          editingTag={linkerState.editingTag}
          editingMarkup={linkerState.editingMarkup}
          diagramTargets={combinedDiagramTargets}
        />
      )}

      <MdxWorkbenchDialogs
        files={files}
        metadata={metadata}
        currentLang={currentLang}
        validationIssues={validation.issues}
        diagramSurfaceOpen={diagramSurfaceOpen}
        rewriteDiagramPath={rewriteDiagramPath}
        setRewriteDiagramPath={setRewriteDiagramPath}
        openDiagramEditor={openDiagramEditor}
        createPageOpen={createPageOpen}
        setCreatePageOpen={setCreatePageOpen}
        createDiagramOpen={createDiagramOpen}
        setCreateDiagramOpen={setCreateDiagramOpen}
        addDiagramOpen={addDiagramOpen}
        setAddDiagramOpen={setAddDiagramOpen}
        setActiveDiagramBlockId={setActiveDiagramBlockId}
        setActiveDiagramIndex={setActiveDiagramIndex}
        hasPageDiagramLinks={pageDiagramLinks.length > 0}
        publishedDiagramMode={publishedDiagramMode}
        handleMetadataChange={handleMetadataChange}
        createPage={createPage}
        createDiagram={createDiagram}
        bindDiagram={bindDiagram}
        openFileSafely={openFileSafely}
        pendingFileNavigation={pendingFileNavigation}
        safetyPresentation={safetyPresentation}
        cancelPendingNavigation={cancelPendingNavigation}
        continuePendingNavigation={continuePendingNavigation}
        handleSaveDocument={handleSaveDocument}
        saveDraftCurrentFile={saveDraftCurrentFile}
        canSave={canSave}
        canSaveDraft={canSaveDraft}
        warningSaveOpen={warningSaveOpen}
        warningSaveCopy={warningSaveCopy}
        confirmWarningSave={confirmWarningSave}
        setWarningSaveOpen={setWarningSaveOpen}
        saveErrorModalOpen={saveErrorModalOpen}
        setSaveErrorModalOpen={setSaveErrorModalOpen}
        saveErrorMessage={saveErrorMessage}
        onSelectIssue={handleSelectIssue}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
      />
    </div>
  );
};

export default MdxWorkbench;
