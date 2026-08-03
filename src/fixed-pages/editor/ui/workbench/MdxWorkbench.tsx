import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { useEditorCore } from '@/fixed-pages/editor/session/useEditorCore';
import { SemanticLinker } from '../components/SemanticLinker';
import { DiagramWorkbenchHost } from '../../diagrams/ui/workbench/DiagramWorkbenchHost';
import type { DiagramWorkbenchMode } from '@/fixed-pages/editor/diagrams/ui/workbench/useDiagramWorkbenchLoader';
import { DiagramRewriteDialog } from '../../diagrams/ui/DiagramRewriteDialog';
import type { EditorDiagramReference, EditorValidationIssue } from '@/fixed-pages/editor/session/editorTypes';
import { useDiagramUsages } from '@/fixed-pages/editor/diagrams/ui/workbench/useDiagramUsages';
import { usePageDiagramTargets } from '@/fixed-pages/editor/diagrams/ui/workbench/usePageDiagramTargets';
import { PublishedRuntimePreview } from '../preview/PublishedRuntimePreview';
import { CreatePageDialog } from '../create/CreatePageDialog';
import { DiffReviewPanel } from '../diff/DiffReviewPanel';
import { reviewDiffForDocument } from '../diff/EditorDiffController';
import type { DiffReview } from '@/fixed-pages/editor/review/diffReview';

import { useEditorNavigationFlow } from '@/fixed-pages/editor/ui/page/useEditorNavigationFlow';
import { useUnsavedChangesGuard } from '@/fixed-pages/editor/ui/page/useUnsavedChangesGuard';
import { EditorShell } from '../page/EditorShell';
import { EditorNavigation } from '../page/EditorNavigation';
import { VisualEditorPanel } from '../panels/VisualEditorPanel';
import { CodeEditorPanel } from '../panels/CodeEditorPanel';
import { DiagramSourcePanel } from '../panels/DiagramSourcePanel';
import { EditorApiStatusBanner } from '../safety/EditorApiStatusBanner';
import { UnsavedChangesDialog } from '../safety/UnsavedChangesDialog';
import { buildEditorSafetyPresentation } from '@/fixed-pages/editor/review/safetyPresentation';

import { MdxWorkbenchHeader, type MdxViewMode } from './MdxWorkbenchHeader';
import { MdxWorkbenchInspector, type InspectorTab } from './MdxWorkbenchInspector';

import {
  buildPageConnectionSummary,
  buildPageDiagramLinks,
  getDiagramWorkbenchMode,
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
    currentFile,
    editorMode,
    metadata,
    imports,
    exports: exportsSource,
    blocks,
    rawBody,
    baseSource,
    localRevision,
    baseVersion,
    saving,
    dirtyState,
    validation,
    persistenceStatus,
    loadFileList,
    openFile,
    setEditorMode,
    updateRawBody,
    updateBlock,
    removeBlock,
    addBlock,
    moveBlock,
    duplicateBlock,
    saveCurrentFile,
    saveDraftCurrentFile,
    setMetadata,
    bindDiagram,
    createPage,
    compatibility,
    compatibilityReasons,
    canMutateVisualStructure,
    canEditVisualMetadata,
    persistenceLabel,
    getExpectedDiffRanges,
  } = useEditorCore();

  const isReadOnly = compatibility === 'read-only';
  const hasLocalChanges = dirtyState !== 'clean' || rawBody !== baseSource;
  const isDiagramFile = currentFile?.endsWith('.tsx') ?? false;
  const currentResource = files.find(file => file.path === currentFile);

  const [, setLocation] = useLocation();
  const [diagramDirty, setDiagramDirty] = useState(false);
  const cleanupDiagramSessionRef = useRef<() => void>(() => {});
  const afterDiscardFileRef = useRef<(path: string) => void>(() => {});

  // 1. Unsaved changes guard & navigation flow
  const {
    pendingFileNavigation,
    setPendingFileNavigation,
    continuePendingNavigation,
    cancelPendingNavigation,
  } = useUnsavedChangesGuard({
    hasLocalChanges: hasLocalChanges || diagramDirty,
    openFile,
    setLocation,
    onBeforeDiscardNavigate: () => cleanupDiagramSessionRef.current(),
    onAfterDiscardFileNavigate: path => afterDiscardFileRef.current(path),
  });

  const {
    workspace,
    setWorkspace,
    isSidebarOpen,
    setIsSidebarOpen,
    isInspectorOpen,
    setIsInspectorOpen,
    isDiagnosticsOpen,
    openFileSafely,
    toggleFavorite,
    diagramSurfaceOpen,
    diagramReturnContext,
    openDiagramSurface,
    closeDiagramSurface,
  } = useEditorNavigationFlow({
    files,
    currentFile,
    openFile,
    loadFileList,
    hasLocalChanges,
    diagramDirty,
    setPendingFileNavigation,
  });

  // State for view mode: 'visual' | 'code' | 'preview'
  const [viewMode, setViewMode] = useState<MdxViewMode>('visual');
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('page');

  // Modals state
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [diffReview, setDiffReview] = useState<DiffReview | null>(null);
  const [createPageOpen, setCreatePageOpen] = useState(false);

  const [diagramWorkbenchOverride, setDiagramWorkbenchOverride] = useState<DiagramWorkbenchMode | null>(null);
  const [rewriteDiagramPath, setRewriteDiagramPath] = useState<string | null>(null);
  const [activeDiagramBlockId, setActiveDiagramBlockId] = useState<string | null>(null);
  const [activeDiagramIndex, setActiveDiagramIndex] = useState<number | null>(null);

  const clearDiagramSession = () => {
    setDiagramWorkbenchOverride(null);
    setRewriteDiagramPath(null);
    setActiveDiagramBlockId(null);
    setActiveDiagramIndex(null);
    setDiagramDirty(false);
    closeDiagramSurface();
  };

  useEffect(() => {
    cleanupDiagramSessionRef.current = clearDiagramSession;
    afterDiscardFileRef.current = (path: string) => {
      if (path.endsWith('.tsx')) openDiagramSurface(null);
    };
  });

  // Semantic Linker state
  const [linkerState, setLinkerState] = useState<{
    isOpen: boolean;
    blockId: string;
    selectedText: string;
    selectionStart: number;
    selectionEnd: number;
    editingMarkup?: string;
    editingTag?: string;
    initialAttrs?: Record<string, any>;
  }>({
    isOpen: false,
    blockId: '',
    selectedText: '',
    selectionStart: 0,
    selectionEnd: 0,
  });

  const {
    linkedPages: diagramLinkedPages,
    error: diagramUsageError,
  } = useDiagramUsages(isDiagramFile ? currentFile : null, files);

  // Archivo .tsx → superficie diagrama (p. ej. tras descartar cambios y navegar)
  useEffect(() => {
    if (isDiagramFile && currentFile) {
      openDiagramSurface(null);
    }
  }, [currentFile, isDiagramFile, openDiagramSurface]);

  const openDiagramEditor = (options?: {
    blockId?: string | null;
    blockIndex?: number | null;
    modeOverride?: DiagramWorkbenchMode | null;
    asRewrite?: boolean;
  }) => {
    if (options?.blockId !== undefined) setActiveDiagramBlockId(options.blockId);
    if (options?.blockIndex !== undefined) setActiveDiagramIndex(options.blockIndex);
    if (options?.modeOverride !== undefined) setDiagramWorkbenchOverride(options.modeOverride);
    if (options?.asRewrite && currentFile?.endsWith('.tsx')) {
      setRewriteDiagramPath(currentFile);
    }
    const returnContext =
      currentFile?.endsWith('.mdx')
        ? { pagePath: currentFile, blockId: options?.blockId ?? activeDiagramBlockId, viewMode }
        : null;
    openDiagramSurface(returnContext);
  };

  const handleCloseDiagramSurface = () => {
    const restoreView = diagramReturnContext?.viewMode;
    setDiagramWorkbenchOverride(null);
    setRewriteDiagramPath(null);
    setActiveDiagramBlockId(null);
    setActiveDiagramIndex(null);
    setDiagramDirty(false);
    closeDiagramSurface();
    if (restoreView) setViewMode(restoreView);
  };

  const setDiagramBuilderOpen = (open: boolean) => {
    if (open) openDiagramEditor();
    else handleCloseDiagramSurface();
  };

  const handleMetadataChange = (key: string, value: any) => {
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
  const canReviewDiff = Boolean(currentFile?.endsWith('.mdx') && rawBody !== baseSource);

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
      }),
    [compatibility, compatibilityReasons, currentFile, editorMode, isDiagramFile, persistenceStatus, validation],
  );

  const reviewCurrentDiff = () => {
    reviewDiffForDocument(
      {
        currentFile,
        baseSource,
        rawBody,
        localRevision,
        baseVersion,
        compatibility,
        editorMode,
        coordinatedView: false,
        getExpectedDiffRanges,
        saveCurrentFile,
      },
      setDiffReview,
    );
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (pendingFileNavigation) {
          event.preventDefault();
          cancelPendingNavigation();
          return;
        }
        if (diffReview && !saving) {
          event.preventDefault();
          setDiffReview(null);
        }
      }

      const isModifier = event.ctrlKey || event.metaKey;
      if (isModifier) {
        if (event.key.toLowerCase() === 's') {
          event.preventDefault();
          if (currentFile) {
            void saveCurrentFile();
          }
        } else if (event.key.toLowerCase() === 'd') {
          event.preventDefault();
          if (canReviewDiff) {
            reviewCurrentDiff();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pendingFileNavigation, cancelPendingNavigation, diffReview, saving, canReviewDiff, currentFile, saveCurrentFile]);

  const [focusRange, setFocusRange] = useState<{ start: number; end: number } | undefined>(undefined);

  const handleSelectIssue = (issue: EditorValidationIssue) => {
    if (issue.area === 'metadata') {
      setIsInspectorOpen(true);
    }
    if (issue.blockId) {
      setViewMode('visual');
      setEditingBlockId(issue.blockId);
      setTimeout(() => {
        const element = document.querySelector(`[data-block-id="${issue.blockId}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    } else if (issue.sourceRange) {
      setViewMode('code');
      setFocusRange(issue.sourceRange);
    }
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

  const activeDiagramBlock = useMemo(
    () => blocks.find(b => b.id === activeDiagramBlockId) ?? (activeDiagramIndex !== null ? blocks[activeDiagramIndex] : null),
    [activeDiagramBlockId, activeDiagramIndex, blocks],
  );

  const activeDiagramWorkbenchMode = useMemo(() => {
    if (diagramWorkbenchOverride) return diagramWorkbenchOverride;
    return getDiagramWorkbenchMode(currentFile, activeDiagramBlock);
  }, [activeDiagramBlock, currentFile, diagramWorkbenchOverride]);

  const insertInteractiveTargetParagraph = (target: { id: string; label?: string; color?: string }) => {
    const label = target.label || target.id;
    const content = `Paso interactivo sobre <InteractiveTarget targetId="${target.id}">${label}</InteractiveTarget>.`;
    addBlock(blocks.length, 'paragraph', content);
  };

  const currentTitle = (metadata.title as string) || '';
  const currentContentType = (metadata.contentType as string) || (isDiagramFile ? 'Diagrama' : 'Página');

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-lienzo font-sans text-carbon antialiased select-none">
      {/* API Status Banners */}
      <EditorApiStatusBanner />

      {/* Header Unificado */}
      {!diagramSurfaceOpen && (
      <MdxWorkbenchHeader
        currentFile={currentFile}
        fileTitle={currentTitle}
        contentType={currentContentType}
        hasLocalChanges={hasLocalChanges}
        saving={saving}
        persistenceStatus={persistenceStatus.kind}
        viewMode={viewMode}
        onSetViewMode={(mode) => {
          setViewMode(mode);
          if (mode === 'code') setEditorMode('code');
          if (mode === 'visual') setEditorMode('visual');
        }}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isInspectorOpen={isInspectorOpen}
        onToggleInspector={() => setIsInspectorOpen(!isInspectorOpen)}
        onOpenAvisos={() => {
          setIsInspectorOpen(true);
          setInspectorTab('avisos');
        }}
        diagramDrawerOpen={false}
        onToggleDiagramDrawer={() => openDiagramEditor()}
        hasDiagrams={pageDiagramLinks.length > 0}
        errorCount={validation.errorCount}
        warningCount={validation.warningCount}
        onTitleChange={(newTitle) => handleMetadataChange('title', newTitle)}
        onSave={() => void saveCurrentFile()}
        onSaveDraft={() => void saveDraftCurrentFile()}
        onReviewDiff={reviewCurrentDiff}
        onCreatePage={() => setCreatePageOpen(true)}
        canSaveDraft={canSaveDraft}
        canReviewDiff={canReviewDiff}
        isReadOnly={isReadOnly}
        workspaceLevel={workspace.level}
        onToggleWorkspaceLevel={() =>
          setWorkspace(prev => ({
            ...prev,
            level: prev.level === 'advanced' ? 'basic' : 'advanced',
          }))
        }
      />
      )}

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
            leftPanel={
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
              />
            }
            onConfirm={async (spec: EditorDiagramReference) => {
              await bindDiagram(spec);
              handleCloseDiagramSurface();
              return true;
            }}
          />
        </div>
      ) : (
      <>
      {/* Shell Principal de 3 Columnas */}
      <EditorShell
        toolbar={null}
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
          />
        }
        inspectorOpen={isInspectorOpen}
        inspectorWidth={workspace.inspectorWidth}
        setInspectorWidth={(width) => setWorkspace(prev => ({ ...prev, inspectorWidth: width }))}
        inspector={
          <MdxWorkbenchInspector
            currentFile={currentFile}
            resource={currentResource}
            metadata={metadata}
            canEditVisualMetadata={canEditVisualMetadata}
            canMutateVisualStructure={canMutateVisualStructure}
            handleMetadataChange={handleMetadataChange}
            handleRemoveMetadataField={handleRemoveMetadataField}
            handleAddCustomMetadataField={() => {}}
            validation={validation}
            persistenceStatus={persistenceStatus}
            persistenceLabel={persistenceLabel}
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
            onSelectIssue={handleSelectIssue}
            onClose={() => setIsInspectorOpen(false)}
            activeTab={inspectorTab}
            onActiveTabChange={setInspectorTab}
          />
        }
        diagnosticsOpen={isDiagnosticsOpen}
        diagnosticsHeight={workspace.diagnosticsHeight}
        setDiagnosticsHeight={(height) => setWorkspace(prev => ({ ...prev, diagnosticsHeight: height }))}
        diagnostics={null}
        persistPanelSizes={() => {}}
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
                focusRange={focusRange}
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
                metadata={metadata}
                isReadOnly={isReadOnly}
                canEditVisualMetadata={canEditVisualMetadata}
                canMutateVisualStructure={canMutateVisualStructure}
                blocks={blocks}
                editingBlockId={editingBlockId}
                setEditingBlockId={setEditingBlockId}
                handleMetadataChange={handleMetadataChange}
                addBlock={addBlock}
                moveBlock={moveBlock}
                duplicateBlock={duplicateBlock}
                removeBlock={removeBlock}
                updateBlock={updateBlock}
                handleTextareaSelect={() => {}}
                handleEditLink={(blockId, rawMarkup, text, attrs, tag) => {
                  setLinkerState({
                    isOpen: true,
                    blockId,
                    selectedText: text,
                    editingMarkup: rawMarkup,
                    editingTag: tag,
                    initialAttrs: attrs,
                    selectionStart: 0,
                    selectionEnd: text.length,
                  });
                }}
                setActiveDiagramIndex={setActiveDiagramIndex}
                setActiveDiagramBlockId={setActiveDiagramBlockId}
                setDiagramBuilderOpen={setDiagramBuilderOpen}
                diagramTargets={combinedDiagramTargets}
              />
            </div>
          )}
        </div>
      </EditorShell>
      </>
      )}

      {/* Semantic Linker Popover / Modal */}
      {linkerState.isOpen && (
        <SemanticLinker
          isOpen={linkerState.isOpen}
          onClose={() => setLinkerState(prev => ({ ...prev, isOpen: false }))}
          files={files}
          selectedText={linkerState.selectedText}
          onLinkCreated={(markup) => {
            if (linkerState.editingMarkup && linkerState.blockId) {
              const targetBlock = blocks.find(b => b.id === linkerState.blockId);
              if (targetBlock) {
                const newContent = targetBlock.content.replace(linkerState.editingMarkup, markup);
                updateBlock(linkerState.blockId, newContent);
              }
            } else if (linkerState.blockId) {
              const targetBlock = blocks.find(b => b.id === linkerState.blockId);
              if (targetBlock) {
                const before = targetBlock.content.substring(0, linkerState.selectionStart);
                const after = targetBlock.content.substring(linkerState.selectionEnd);
                updateBlock(linkerState.blockId, `${before}${markup}${after}`);
              }
            }
            setLinkerState(prev => ({ ...prev, isOpen: false }));
          }}
          position={{ top: 120, left: 240 }}
          initialAttrs={linkerState.initialAttrs}
          editingTag={linkerState.editingTag}
          editingMarkup={linkerState.editingMarkup}
          diagramTargets={combinedDiagramTargets}
        />
      )}

      {/* Diagram Rewrite Dialog */}
      {rewriteDiagramPath && !diagramSurfaceOpen && (
        <DiagramRewriteDialog
          path={rewriteDiagramPath}
          initialTitle="Diagrama"
          onClose={() => setRewriteDiagramPath(null)}
          onStart={() => openDiagramEditor({ asRewrite: true })}
        />
      )}

      {/* Diff Review Modal */}
      {diffReview && (
        <DiffReviewPanel
          review={diffReview}
          isStale={false}
          isApplying={saving}
          onClose={() => setDiffReview(null)}
          onApply={async () => {
            await saveCurrentFile();
            setDiffReview(null);
          }}
        />
      )}

      {/* Create Page Modal */}
      <CreatePageDialog
        open={createPageOpen}
        onClose={() => setCreatePageOpen(false)}
        onCreate={async (params) => {
          const newPath = await createPage(params);
          if (typeof newPath === 'string' && newPath) {
            setCreatePageOpen(false);
            openFileSafely(newPath);
            return true;
          }
          return false;
        }}
      />

      {/* Unsaved changes confirmation dialog */}
      {pendingFileNavigation && (
        <UnsavedChangesDialog
          isOpen={Boolean(pendingFileNavigation)}
          targetLabel={typeof pendingFileNavigation === 'string' ? pendingFileNavigation : 'Página'}
          presentation={safetyPresentation}
          onCancel={() => cancelPendingNavigation()}
          onReviewDiff={reviewCurrentDiff}
          onSaveDraft={() => void saveDraftCurrentFile()}
          onDiscardAndContinue={() => continuePendingNavigation()}
          canReviewDiff={canReviewDiff}
          canSaveDraft={canSaveDraft}
        />
      )}
    </div>
  );
};

export default MdxWorkbench;
