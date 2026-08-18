import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { useEditorCore } from '@/fixed-pages/editor/session/useEditorCore';
import { SemanticLinker } from '../components/SemanticLinker';
import { DiagramWorkbenchHost } from '../../diagrams/ui/workbench/DiagramWorkbenchHost';
import type { DiagramWorkbenchMode } from '@/fixed-pages/editor/diagrams/ui/workbench/useDiagramWorkbenchLoader';
import { DiagramRewriteDialog } from '../../diagrams/ui/DiagramRewriteDialog';
import type { Block } from '@/fixed-pages/editor/session/parser';
import type { EditorDiagramReference, EditorValidationIssue } from '@/fixed-pages/editor/session/editorTypes';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import { useDiagramUsages } from '@/fixed-pages/editor/diagrams/ui/workbench/useDiagramUsages';
import { usePageDiagramTargets } from '@/fixed-pages/editor/diagrams/ui/workbench/usePageDiagramTargets';
import { PublishedRuntimePreview } from '../preview/PublishedRuntimePreview';
import { CreatePageDialog } from '../create/CreatePageDialog';
import { CreateDiagramDialog } from '../create/CreateDiagramDialog';
import { AddDiagramDialog } from '../create/AddDiagramDialog';
import { defaultMode } from '@/fixed-pages/editor/diagrams/model/tools/diagramOptions';
import { toDiagramImportPath } from '@/fixed-pages/editor/review/authoringModel';
import { EditorLandingView } from '../landing/EditorLandingView';

import { useEditorNavigationFlow } from '@/fixed-pages/editor/ui/page/useEditorNavigationFlow';
import { useUnsavedChangesGuard } from '@/fixed-pages/editor/ui/page/useUnsavedChangesGuard';
import { useI18n, isSupportedLanguage } from '@/i18n';
import { MathProviderBoundary } from '@/lib/page-context/MathStoreContext';
import { DiagramStepSyncContext, type DiagramStepSyncContextValue } from '@/lib/page-context/DiagramStepSyncContext';
import type { ProofStepData } from '@/fixed-pages/editor/session/parser';
import { editableHtmlToMdx, insertHtmlAtSelection, mdxToEditableHtml } from '@/fixed-pages/editor/ui/prose/inlineProseOps';
import { EditorShell } from '../page/EditorShell';
import { EditorNavigation } from '../page/EditorNavigation';
import { VisualEditorPanel } from '../panels/VisualEditorPanel';
import { CodeEditorPanel } from '../panels/CodeEditorPanel';
import { DiagramSourcePanel } from '../panels/DiagramSourcePanel';
import { EditorApiStatusBanner } from '../safety/EditorApiStatusBanner';
import { UnsavedChangesDialog } from '../safety/UnsavedChangesDialog';
import { SaveErrorModal } from '../safety/SaveErrorModal';
import { buildEditorSafetyPresentation } from '@/fixed-pages/editor/review/safetyPresentation';
import {
  buildMdxSaveCapability,
  warningSaveConfirmCopy,
} from '@/fixed-pages/editor/save/saveCapability';
import {
  editorApiUnavailableInProduction,
  editorWriteAccessGranted,
} from '@/fixed-pages/editor/save/editorApiBase';
import { DiagramConfirmDialog } from '../../diagrams/ui/DiagramConfirmDialog';

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
  const { lang: appLang, setLang: setAppLang } = useI18n();
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

  // State for landing section ('documents' | 'diagrams') and view mode ('visual' | 'code' | 'preview')
  const [landingSection, setLandingSection] = useState<'documents' | 'diagrams'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') || params.get('section');
      if (tab === 'diagrams' || tab === 'diagram') return 'diagrams';
    }
    return 'documents';
  });
  const [viewMode, setViewMode] = useState<MdxViewMode>('visual');
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('page');
  const [formatBarNode, setFormatBarNode] = useState<React.ReactNode>(null);

  // Modals state
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [createPageOpen, setCreatePageOpen] = useState(false);
  const [createDiagramOpen, setCreateDiagramOpen] = useState(false);
  const [addDiagramOpen, setAddDiagramOpen] = useState(false);
  const [saveErrorModalOpen, setSaveErrorModalOpen] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [warningSaveOpen, setWarningSaveOpen] = useState(false);

  const currentLang = useMemo(() => {
    if (metadata && typeof metadata === 'object' && 'lang' in metadata && typeof (metadata as { lang?: unknown }).lang === 'string') {
      return (metadata as { lang: string }).lang;
    }
    if (currentFile) {
      const match = currentFile.split('/').find(p => /^[a-z]{2}(-[A-Z]{2})?$/.test(p));
      if (match) return match;
    }
    return 'es';
  }, [currentFile, metadata]);

  const currentConceptId = useMemo(() => {
    if (metadata && typeof metadata === 'object' && 'id' in metadata && typeof (metadata as { id?: unknown }).id === 'string') {
      return (metadata as { id: string }).id;
    }
    if (currentFile) {
      return currentFile.split('/').pop()?.replace(/\.(mdx|tsx)$/, '') || '';
    }
    return '';
  }, [currentFile, metadata]);

  const currentConceptVariants = useMemo(() => {
    if (!currentConceptId) return {};
    const map: Record<string, FileNode> = {};
    for (const file of files) {
      if (file.kind !== 'mdx-document') continue;
      const parts = file.path.split('/');
      const slug = parts[parts.length - 1]?.replace(/\.mdx$/, '') || file.name.replace(/\.mdx$/, '');
      const fileLang = file.lang || parts.find(p => /^[a-z]{2}(-[A-Z]{2})?$/.test(p)) || 'es';
      if ((file.id && file.id === currentConceptId) || slug === currentConceptId) {
        map[fileLang] = file;
      }
    }
    return map;
  }, [currentConceptId, files]);

  const availableLangs = useMemo(() => Object.keys(currentConceptVariants), [currentConceptVariants]);

  const handleSwitchLanguage = useCallback((targetLang: string) => {
    const targetFile = currentConceptVariants[targetLang];
    if (targetFile) {
      openFileSafely(targetFile.path);
      if (isSupportedLanguage(targetLang) && targetLang !== appLang) {
        setAppLang(targetLang);
      }
    }
  }, [currentConceptVariants, openFileSafely, appLang, setAppLang]);

  const handleCreateTranslation = useCallback(async (fileOrLang: FileNode | string, maybeLang?: string) => {
    const targetLang = typeof fileOrLang === 'string' ? fileOrLang : maybeLang;
    if (!targetLang) return;
    if (typeof fileOrLang !== 'string' && fileOrLang.path !== currentFile) {
      openFileSafely(fileOrLang.path);
    }
    await createTranslation(targetLang);
    if (isSupportedLanguage(targetLang) && targetLang !== appLang) {
      setAppLang(targetLang);
    }
  }, [createTranslation, currentFile, openFileSafely, appLang, setAppLang]);

  const writeAvailable = !editorApiUnavailableInProduction() && editorWriteAccessGranted();
  const saveCapability = useMemo(
    () =>
      buildMdxSaveCapability({
        isDirty: hasLocalChanges,
        saving,
        errorCount: validation.errorCount,
        warningCount: validation.warningCount,
        hasFile: Boolean(currentFile),
        hasVersion: Boolean(baseVersion),
        writeAvailable,
        isReadOnly,
      }),
    [
      baseVersion,
      currentFile,
      hasLocalChanges,
      isReadOnly,
      saving,
      validation.errorCount,
      validation.warningCount,
      writeAvailable,
    ],
  );

  const performSaveDocument = useCallback(async () => {
    if (!hasLocalChanges) return false;
    if (validation.errorCount > 0) {
      setSaveErrorMessage(
        `No se puede guardar: existen ${validation.errorCount} error(es) de validación que impiden la persistencia de cambios.`,
      );
      setSaveErrorModalOpen(true);
      return false;
    }
    const result = await saveCurrentFile();
    if (!result.ok) {
      setSaveErrorMessage(
        result.reason
        || 'No se pudo guardar el archivo. Revisa los permisos, el token de edición o el panel de avisos.',
      );
      setSaveErrorModalOpen(true);
      return false;
    }
    return true;
  }, [hasLocalChanges, saveCurrentFile, validation.errorCount]);

  const handleSaveDocument = useCallback(() => {
    if (!saveCapability.allowed) return;
    if (saveCapability.warningCount > 0) {
      setWarningSaveOpen(true);
      return;
    }
    void performSaveDocument();
  }, [performSaveDocument, saveCapability.allowed, saveCapability.warningCount]);

  const confirmWarningSave = useCallback(() => {
    setWarningSaveOpen(false);
    void performSaveDocument();
  }, [performSaveDocument]);

  const [diagramWorkbenchOverride, setDiagramWorkbenchOverride] = useState<DiagramWorkbenchMode | null>(null);
  const [rewriteDiagramPath, setRewriteDiagramPath] = useState<string | null>(null);
  const [activeDiagramBlockId, setActiveDiagramBlockId] = useState<string | null>(null);
  const [activeDiagramIndex, setActiveDiagramIndex] = useState<number | null>(null);
  const [editorDiagramStepId, setEditorDiagramStepId] = useState<string | null>('initial');
  const [editorDiagramStepIndex, setEditorDiagramStepIndex] = useState<number | null>(null);

  const selectDiagramStep = React.useCallback((stepInput: number | string) => {
    if (typeof stepInput === 'number') {
      setEditorDiagramStepIndex(stepInput);
      setEditorDiagramStepId(null);
      return;
    }
    setEditorDiagramStepId(stepInput);
    setEditorDiagramStepIndex(null);
  }, []);

  const diagramStepSyncValue = useMemo<DiagramStepSyncContextValue>(() => ({
    activeStepIndex: editorDiagramStepIndex,
    activeStepId: editorDiagramStepId,
    selectDiagramStep,
  }), [editorDiagramStepId, editorDiagramStepIndex, selectDiagramStep]);

  const syncDemoStepToDiagram = React.useCallback((step: ProofStepData, index: number) => {
    if (step.diagramStep === 'initial') {
      setEditorDiagramStepId('initial');
      setEditorDiagramStepIndex(null);
      return;
    }
    if (step.diagramStep !== undefined && step.diagramStep !== '') {
      setEditorDiagramStepId(String(step.diagramStep));
      setEditorDiagramStepIndex(typeof step.diagramStep === 'number' ? step.diagramStep : null);
      return;
    }
    setEditorDiagramStepId(null);
    setEditorDiagramStepIndex(index);
  }, []);

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
  const linkerRangeRef = useRef<Range | null>(null);
  const [linkerState, setLinkerState] = useState<{
    isOpen: boolean;
    blockId: string;
    selectedText: string;
    selectionStart: number;
    selectionEnd: number;
    editingMarkup?: string;
    editingTag?: string;
    initialAttrs?: Record<string, unknown>;
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
    const wasDiagramFile = isDiagramFile || (currentFile?.endsWith('.tsx') ?? false);
    setDiagramWorkbenchOverride(null);
    setRewriteDiagramPath(null);
    setActiveDiagramBlockId(null);
    setActiveDiagramIndex(null);
    setDiagramDirty(false);
    closeDiagramSurface();
    if (restoreView) {
      setViewMode(restoreView);
    } else {
      if (wasDiagramFile) {
        setLandingSection('diagrams');
      } else {
        setLandingSection('documents');
      }
      closeFile();
    }
  };

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
      }),
    [compatibility, compatibilityReasons, currentFile, editorMode, isDiagramFile, persistenceStatus, validation],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && pendingFileNavigation) {
        event.preventDefault();
        cancelPendingNavigation();
        return;
      }

      const isModifier = event.ctrlKey || event.metaKey;
      if (isModifier && event.key.toLowerCase() === 's') {
        event.preventDefault();
        if (currentFile) {
          void handleSaveDocument();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pendingFileNavigation, cancelPendingNavigation, currentFile, handleSaveDocument]);

  const [focusRange] = useState<{ start: number; end: number } | undefined>(undefined);
  const [highlightedBlockId, setHighlightedBlockId] = useState<string | null>(null);

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

    let targetBlockId = issue.blockId;

    if (!targetBlockId && issue.sourceRange && blocks.length > 0) {
      let currentOffset = 0;
      for (const block of blocks) {
        if (!block.content) continue;
        const pos = rawBody.indexOf(block.content, currentOffset);
        if (pos !== -1) {
          const blockEnd = pos + block.content.length;
          if (issue.sourceRange.start >= pos && issue.sourceRange.start <= blockEnd) {
            targetBlockId = block.id;
            break;
          }
          currentOffset = pos;
        }
      }
      if (!targetBlockId) {
        let closestBlock: Block | null = null;
        let minDistance = Infinity;
        currentOffset = 0;
        for (const block of blocks) {
          if (!block.content) continue;
          const pos = rawBody.indexOf(block.content, currentOffset);
          if (pos !== -1) {
            const dist = Math.abs(pos - issue.sourceRange.start);
            if (dist < minDistance) {
              minDistance = dist;
              closestBlock = block;
            }
            currentOffset = pos;
          }
        }
        targetBlockId = closestBlock?.id ?? blocks[0]?.id;
      }
    }

    if (!targetBlockId && blocks.length > 0) {
      targetBlockId = blocks[0].id;
    }

    if (targetBlockId) {
      setEditingBlockId(targetBlockId);
      setHighlightedBlockId(targetBlockId);
      setTimeout(() => {
        const element = document.getElementById(`block-${targetBlockId}`) || document.querySelector(`[data-block-id="${targetBlockId}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          (element as HTMLElement).focus?.();
        }
      }, 50);
      setTimeout(() => {
        setHighlightedBlockId(null);
      }, 3500);
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
  const pageType = typeof metadata.type === 'string' ? metadata.type : '';
  const currentContentType = pageType || (metadata.contentType as string) || (isDiagramFile ? 'Diagrama' : 'Página');
  const publishedDiagramMode = defaultMode(pageType);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-lienzo font-sans text-carbon antialiased select-none">
      {/* API Status Banners */}
      <EditorApiStatusBanner />

      {/* Header Unificado */}
      {!diagramSurfaceOpen && currentFile && (
      <MdxWorkbenchHeader
        currentFile={currentFile}
        fileTitle={currentTitle}
        contentType={currentContentType}
        currentLang={currentLang}
        availableLangs={availableLangs}
        onSwitchLanguage={handleSwitchLanguage}
        onCreateTranslation={(lang) => { void handleCreateTranslation(lang); }}
        saving={saving}
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
        onTitleChange={(newTitle) => handleMetadataChange('title', newTitle)}
        onSave={handleSaveDocument}
        onSaveDraft={() => void saveDraftCurrentFile()}
        onCreatePage={() => setCreatePageOpen(true)}
        onCloseEditor={() => {
          if (isDiagramFile) {
            setLandingSection('diagrams');
          } else {
            setLandingSection('documents');
          }
          closeFile();
          clearDiagramSession();
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
            onConfirm={async (spec: EditorDiagramReference) => {
              await bindDiagram(spec);
              return true;
            }}
          />
        </div>
      ) : !currentFile ? (
        <EditorLandingView
          files={files}
          isLoading={filesLoading}
          initialSection={landingSection}
          favoritePaths={workspace.favoritePaths}
          recentPaths={workspace.recentPaths}
          onOpenFile={(path) => {
            if (path.endsWith('.tsx')) {
              setLandingSection('diagrams');
            } else {
              setLandingSection('documents');
            }
            openFileSafely(path);
          }}
          onToggleFavorite={toggleFavorite}
          onCreateDocument={() => setCreatePageOpen(true)}
          onCreateDiagram={() => setCreateDiagramOpen(true)}
        />
      ) : (
      <>
      <MathProviderBoundary>
      <DiagramStepSyncContext.Provider value={diagramStepSyncValue}>
      {/* Shell Principal de 3 Columnas */}
      <EditorShell
        toolbar={null}
        subToolbar={viewMode === 'visual' && !isDiagramFile ? formatBarNode : null}
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
            currentFile={currentFile}
            resource={currentResource}
            metadata={metadata}
            canEditVisualMetadata={canEditVisualMetadata}
            canMutateVisualStructure={canMutateVisualStructure}
            handleMetadataChange={handleMetadataChange}
            handleRemoveMetadataField={handleRemoveMetadataField}
            handleAddCustomMetadataField={() => {}}
            removeBlock={removeBlock}
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
                  duplicateBlock={duplicateBlock}
                  removeBlock={removeBlock}
                  updateBlock={updateBlock}
                  handleTextareaSelect={() => {}}
                  handleEditLink={(blockId, rawMarkup, text, attrs, tag) => {
                    const targetBlock = blocks.find(b => b.id === blockId);
                    const selectedText = text || window.getSelection()?.toString() || '';
                    const sel = window.getSelection();
                    linkerRangeRef.current = sel?.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
                    const fromContent = targetBlock && selectedText
                      ? targetBlock.content.indexOf(selectedText)
                      : -1;
                    setLinkerState({
                      isOpen: true,
                      blockId,
                      selectedText,
                      editingMarkup: rawMarkup || undefined,
                      editingTag: tag,
                      initialAttrs: attrs,
                      selectionStart: fromContent >= 0 ? fromContent : 0,
                      selectionEnd: fromContent >= 0 ? fromContent + selectedText.length : 0,
                    });
                  }}
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
          onClose={() => setLinkerState(prev => ({ ...prev, isOpen: false }))}
          files={files}
          selectedText={linkerState.selectedText}
          onLinkCreated={(markup) => {
            if (!linkerState.blockId) {
              setLinkerState(prev => ({ ...prev, isOpen: false }));
              return;
            }

            // Restore the selection captured before the linker stole focus.
            if (linkerRangeRef.current) {
              try {
                const sel = window.getSelection();
                sel?.removeAllRanges();
                sel?.addRange(linkerRangeRef.current);
              } catch {
                linkerRangeRef.current = null;
              }
            }
            // Only attempt selection insertion for brand new links.
            // When editing or removing an existing link (editingMarkup is defined), insertHtmlAtSelection must be skipped.
            if (!linkerState.editingMarkup && insertHtmlAtSelection(mdxToEditableHtml(markup))) {
              linkerRangeRef.current = null;
              const active = document.activeElement as HTMLElement | null;
              const surface = active?.closest?.('[data-prose-surface="true"]') as HTMLElement | null
                ?? document.getElementById(`${linkerState.blockId}-body`)
                ?? document.getElementById(`${linkerState.blockId}-title`)
                ?? document.getElementById(`prose-${linkerState.blockId}`);
              if (surface) {
                const mdx = editableHtmlToMdx(surface);
                const targetBlock = blocks.find(b => b.id === linkerState.blockId);
                if (targetBlock?.type === 'demonstration') {
                  const baseStep = {
                    ...(Array.isArray(targetBlock.metadata?.steps) ? targetBlock.metadata.steps[0] as object : {}),
                    number: targetBlock.metadata?.number ?? 1,
                    title: targetBlock.metadata?.title ?? '',
                    target: targetBlock.metadata?.target,
                    body: targetBlock.content,
                  };
                  if (surface.id.endsWith('-title')) {
                    updateBlock(linkerState.blockId, targetBlock.content, {
                      ...targetBlock.metadata,
                      title: mdx,
                      steps: [{ ...baseStep, title: mdx }],
                    });
                  } else {
                    updateBlock(linkerState.blockId, mdx, {
                      ...targetBlock.metadata,
                      steps: [{ ...baseStep, body: mdx }],
                    });
                  }
                } else if (targetBlock) {
                  updateBlock(linkerState.blockId, mdx, targetBlock.metadata);
                }
              }
              setLinkerState(prev => ({ ...prev, isOpen: false }));
              return;
            }
            linkerRangeRef.current = null;

            const targetBlock = blocks.find(b => b.id === linkerState.blockId);
            if (!targetBlock) {
              setLinkerState(prev => ({ ...prev, isOpen: false }));
              return;
            }

            if (targetBlock.type === 'demonstration' && linkerState.editingMarkup && targetBlock.metadata?.title?.includes(linkerState.editingMarkup)) {
              const nextTitle = targetBlock.metadata.title.replace(linkerState.editingMarkup, markup);
              const baseStep = {
                ...(Array.isArray(targetBlock.metadata?.steps) ? targetBlock.metadata.steps[0] as object : {}),
                number: targetBlock.metadata?.number ?? 1,
                title: nextTitle,
                target: targetBlock.metadata?.target,
                body: targetBlock.content,
              };
              updateBlock(linkerState.blockId, targetBlock.content, {
                ...targetBlock.metadata,
                title: nextTitle,
                steps: [{ ...baseStep, title: nextTitle }],
              });
              setLinkerState(prev => ({ ...prev, isOpen: false }));
              return;
            }

            let nextContent: string;
            if (linkerState.editingMarkup && targetBlock.content.includes(linkerState.editingMarkup)) {
              nextContent = targetBlock.content.replace(linkerState.editingMarkup, markup);
            } else if (
              typeof linkerState.selectionStart === 'number'
              && typeof linkerState.selectionEnd === 'number'
              && linkerState.selectionEnd > linkerState.selectionStart
            ) {
              nextContent = `${targetBlock.content.slice(0, linkerState.selectionStart)}${markup}${targetBlock.content.slice(linkerState.selectionEnd)}`;
            } else if (linkerState.selectedText && targetBlock.content.includes(linkerState.selectedText)) {
              nextContent = targetBlock.content.replace(linkerState.selectedText, markup);
            } else {
              const gap = targetBlock.content.trim() ? ' ' : '';
              nextContent = `${targetBlock.content}${gap}${markup}`;
            }

            updateBlock(linkerState.blockId, nextContent, targetBlock.type === 'demonstration'
              ? {
                  ...targetBlock.metadata,
                  steps: [{
                    ...(Array.isArray(targetBlock.metadata?.steps) ? targetBlock.metadata.steps[0] : {}),
                    number: targetBlock.metadata?.number ?? 1,
                    title: targetBlock.metadata?.title ?? '',
                    target: targetBlock.metadata?.target,
                    body: nextContent,
                  }],
                }
              : targetBlock.metadata);

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

      {/* Create Page Modal */}
      <CreatePageDialog
        open={createPageOpen}
        onClose={() => setCreatePageOpen(false)}
        onCreate={async (params) => createPage(params)}
        initialLang={currentLang}
      />

      {/* Create Diagram Modal */}
      <CreateDiagramDialog
        open={createDiagramOpen}
        onClose={() => setCreateDiagramOpen(false)}
        onCreate={async (params) => {
          const result = await createDiagram(params);
          if (result) {
            setCreateDiagramOpen(false);
            openFileSafely(result.path);
            return true;
          }
          return false;
        }}
      />

      {/* Add Diagram to Document Modal */}
      <AddDiagramDialog
        open={addDiagramOpen}
        onClose={() => {
          setAddDiagramOpen(false);
          setActiveDiagramBlockId(null);
          setActiveDiagramIndex(null);
        }}
        files={files}
        onSelectExisting={async (diagramFile) => {
          const componentName = diagramFile.name.replace(/\.tsx$/, '');
          if (pageDiagramLinks.length === 0) {
            if ('hasSimulation' in metadata || metadata.type !== 'modelo') handleMetadataChange('hasSimulation', true);
            if ('hasDiagram' in metadata || metadata.type === 'modelo') handleMetadataChange('hasDiagram', true);
          }
          bindDiagram({
            componentName,
            importPath: toDiagramImportPath(diagramFile.path),
            path: diagramFile.path,
            category: typeof diagramFile.type === 'string' ? diagramFile.type : '',
            mode: publishedDiagramMode,
          });
          setActiveDiagramBlockId(null);
          setActiveDiagramIndex(null);
          setAddDiagramOpen(false);
        }}
        onCreateNew={async (params) => {
          const result = await createDiagram(params);
          if (!result) return false;
          if (pageDiagramLinks.length === 0) {
            if ('hasSimulation' in metadata || metadata.type !== 'modelo') handleMetadataChange('hasSimulation', true);
            if ('hasDiagram' in metadata || metadata.type === 'modelo') handleMetadataChange('hasDiagram', true);
          }
          bindDiagram({
            componentName: result.componentName,
            importPath: toDiagramImportPath(result.path),
            path: result.path,
            category: params.category,
            mode: publishedDiagramMode,
          });
          setAddDiagramOpen(false);
          openDiagramEditor({ modeOverride: { kind: 'file', path: result.path } });
          return true;
        }}
      />

      {/* Unsaved changes confirmation dialog */}
      {pendingFileNavigation && (
        <UnsavedChangesDialog
          isOpen={Boolean(pendingFileNavigation)}
          targetLabel={typeof pendingFileNavigation === 'string' ? pendingFileNavigation : 'Página'}
          presentation={safetyPresentation}
          onCancel={() => cancelPendingNavigation()}
          onSave={() => void handleSaveDocument()}
          onSaveDraft={() => void saveDraftCurrentFile()}
          onDiscardAndContinue={() => continuePendingNavigation()}
          canSave={canSave}
          canSaveDraft={canSaveDraft}
        />
      )}

      {/* Save Error & Validation Feedback Modal */}
      <DiagramConfirmDialog
        isOpen={warningSaveOpen}
        title={warningSaveConfirmCopy(saveCapability.warningCount).title}
        message={warningSaveConfirmCopy(saveCapability.warningCount).message}
        confirmLabel="Guardar de todos modos"
        cancelLabel="Cancelar"
        variant="warning"
        onConfirm={confirmWarningSave}
        onCancel={() => setWarningSaveOpen(false)}
      />
      <SaveErrorModal
        isOpen={saveErrorModalOpen}
        onClose={() => setSaveErrorModalOpen(false)}
        issues={validation.issues.filter(issue => issue.severity === 'error')}
        saveMessage={saveErrorMessage}
        onJumpToIssue={handleSelectIssue}
        onOpenAvisos={() => {
          setIsInspectorOpen(true);
          setInspectorTab('avisos');
        }}
      />
    </div>
  );
};

export default MdxWorkbench;
