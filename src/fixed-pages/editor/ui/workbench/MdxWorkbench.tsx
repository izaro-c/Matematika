import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { useI18n } from '@/i18n';
import { translateEditorText } from '@/fixed-pages/editor/types/editorMessage';
import { saveBlockedByValidation } from '@/fixed-pages/editor/session/validationMessages';
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
import { EditorRouteNotFound } from '@/fixed-pages/editor/ui/page/EditorRouteNotFound';
import { MathProviderBoundary } from '@/lib/page-context/MathStoreContext';
import { DiagramStepSyncContext, type DiagramStepSyncContextValue } from '@/lib/page-context/DiagramStepSyncContext';
import type { ProofStepData } from '@/fixed-pages/editor/session/parser';
import { editableHtmlToMdx, insertHtmlAtSelection, mdxToEditableHtml } from '@/fixed-pages/editor/ui/prose/inlineProseOps';
import { EditorShell } from '../page/EditorShell';
import { DiagnosticsDock } from './DiagnosticsDock';
import { EditorDiagnosticsPanel } from '../panels/EditorDiagnosticsPanel';
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

import { MdxWorkbenchHeader } from './MdxWorkbenchHeader';
import { MdxWorkbenchInspector, type InspectorTab } from './MdxWorkbenchInspector';
import { TranslationWorkbench } from './TranslationWorkbench';
import { SUPPORTED_LANGUAGE_CODES } from '@/i18n/config';
import {
  buildConceptIndex,
  conceptKey,
  documentVersionStatuses,
  translationOriginLang,
} from '@/fixed-pages/editor/session/conceptVersions';

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

  const currentConceptVariants = useMemo<Record<string, FileNode>>(() => {
    if (!currentResource || currentResource.kind !== 'mdx-document') return {};
    return buildConceptIndex(files).get(conceptKey(currentResource)) ?? {};
  }, [currentResource, files]);

  const documentVersions = useMemo(
    () => documentVersionStatuses(currentConceptVariants, SUPPORTED_LANGUAGE_CODES),
    [currentConceptVariants],
  );

  // Vista de traducción: el original es el de `desde=` si existe; si no, el de referencia.
  const translationOrigin = useMemo(() => {
    const paths = Object.fromEntries(Object.entries(currentConceptVariants).map(([lang, file]) => [lang, file.path]));
    const lang = urlOriginLang && urlOriginLang !== currentLang && paths[urlOriginLang]
      ? urlOriginLang
      : translationOriginLang(paths, currentLang);
    return {
      lang,
      path: lang ? paths[lang] ?? null : null,
      options: Object.keys(paths).filter(candidate => candidate !== currentLang),
    };
  }, [currentConceptVariants, currentLang, urlOriginLang]);

  const handleSwitchLanguage = useCallback((targetLang: string) => {
    const targetFile = currentConceptVariants[targetLang];
    if (targetFile) {
      // Cambia la versión del documento; el idioma de la interfaz (`:lang`) se mantiene.
      openFileSafely(targetFile.path);
    }
  }, [currentConceptVariants, openFileSafely]);

  // Abrir otro archivo solo navega: la traducción espera a que el núcleo lo haya cargado.
  const [pendingTranslation, setPendingTranslation] = useState<{ path: string; lang: string } | null>(null);
  const handleCreateTranslation = useCallback(async (fileOrLang: FileNode | string, maybeLang?: string) => {
    const targetLang = typeof fileOrLang === 'string' ? fileOrLang : maybeLang;
    if (!targetLang) return;
    if (typeof fileOrLang !== 'string' && fileOrLang.path !== currentFile) {
      setPendingTranslation({ path: fileOrLang.path, lang: targetLang });
      openFileSafely(fileOrLang.path);
      return;
    }
    await createTranslation(targetLang);
  }, [createTranslation, currentFile, openFileSafely]);

  const routePath = route.status === 'file' ? route.path : null;
  useEffect(() => {
    if (!pendingTranslation) return;
    if (routePath !== pendingTranslation.path) {
      // Navegación cancelada en el aviso de cambios sin guardar o sustituida por otra.
      if (!pendingFileNavigation) setPendingTranslation(null);
      return;
    }
    if (currentFile !== pendingTranslation.path || loading) return;
    setPendingTranslation(null);
    void createTranslation(pendingTranslation.lang);
  }, [createTranslation, currentFile, loading, pendingFileNavigation, pendingTranslation, routePath]);

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
      setSaveErrorMessage(translateEditorText(t, saveBlockedByValidation(validation.errorCount)));
      setSaveErrorModalOpen(true);
      return false;
    }
    const result = await saveCurrentFile();
    if (!result.ok) {
      setSaveErrorMessage(translateEditorText(t, result.reason));
      setSaveErrorModalOpen(true);
      return false;
    }
    return true;
  }, [hasLocalChanges, saveCurrentFile, t, validation.errorCount]);

  const warningSaveCopy = warningSaveConfirmCopy(saveCapability.warningCount);

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
  };

  useEffect(() => {
    cleanupDiagramSessionRef.current = clearDiagramSession;
  });

  // --- URL ⇄ estado local (bloque, paso, modo del motor) ----------------------
  // Cada par usa una referencia con el último valor acordado para no rebotar.
  const lastUrlBlockRef = useRef<string | null>(null);
  const pendingBlockScrollRef = useRef<string | null>(null);
  useEffect(() => {
    if (urlBlockId === lastUrlBlockRef.current) return;
    lastUrlBlockRef.current = urlBlockId;
    if (urlBlockId === editingBlockId) return;
    setEditingBlockId(urlBlockId);
    pendingBlockScrollRef.current = urlBlockId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlBlockId]);
  useEffect(() => {
    if (editingBlockId === lastUrlBlockRef.current) return;
    lastUrlBlockRef.current = editingBlockId;
    setUrlBlockId(editingBlockId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingBlockId]);
  // Al recargar con `bloque=` el documento llega después: desplazarse cuando exista.
  useEffect(() => {
    const target = pendingBlockScrollRef.current;
    if (!target || loading) return;
    const element = document.getElementById(`block-${target}`) || document.querySelector(`[data-block-id="${target}"]`);
    if (!element) return;
    pendingBlockScrollRef.current = null;
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [blocks, loading]);

  // Superficie de diagrama recargada desde la URL: recuperar el bloque activo. `bloque=`
  // también es la selección de edición, así que solo cuenta si es un bloque de diagrama.
  useEffect(() => {
    if (route.status !== 'file' || !route.diagramSurface || !urlBlockId || activeDiagramBlockId !== null) return;
    if (blocks.some(block => block.id === urlBlockId && block.type === 'diagram')) {
      setActiveDiagramBlockId(urlBlockId);
    }
  }, [activeDiagramBlockId, blocks, route, urlBlockId]);

  const encodedDiagramStep = editorDiagramStepIndex !== null
    ? String(editorDiagramStepIndex)
    : editorDiagramStepId && editorDiagramStepId !== 'initial' ? editorDiagramStepId : null;
  const lastUrlStepRef = useRef<string | null>(null);
  useEffect(() => {
    if (urlStep === lastUrlStepRef.current) return;
    lastUrlStepRef.current = urlStep;
    if (urlStep === encodedDiagramStep) return;
    if (urlStep === null) {
      setEditorDiagramStepId('initial');
      setEditorDiagramStepIndex(null);
    } else if (/^\d+$/.test(urlStep)) {
      setEditorDiagramStepIndex(Number(urlStep));
      setEditorDiagramStepId(null);
    } else {
      setEditorDiagramStepId(urlStep);
      setEditorDiagramStepIndex(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlStep]);
  useEffect(() => {
    if (encodedDiagramStep === lastUrlStepRef.current) return;
    lastUrlStepRef.current = encodedDiagramStep;
    setUrlStep(encodedDiagramStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encodedDiagramStep]);

  // `vista=` decide el modo del motor (código o visual) una vez cargado el documento.
  useEffect(() => {
    if (loading || !currentFile?.endsWith('.mdx')) return;
    if (viewMode === 'code' && editorMode !== 'code') setEditorMode('code');
    if ((viewMode === 'visual' || viewMode === 'translate') && editorMode === 'code' && compatibility !== 'unsupported') setEditorMode('visual');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFile, loading, viewMode]);

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
    // La URL decide adónde se vuelve: a la página (con su vista), a `volver` o a la portada.
    clearDiagramSession();
    closeDiagramSurface();
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
        translateText: text => translateEditorText(t, text),
      }),
    [compatibility, compatibilityReasons, currentFile, editorMode, isDiagramFile, persistenceStatus, t, validation],
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

  const focusBlock = (targetBlockId: string) => {
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
  };

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
                  focusRange={focusRange}
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
        title={translateEditorText(t, warningSaveCopy.title)}
        message={translateEditorText(t, warningSaveCopy.message)}
        confirmLabel={t('editor.save.saveAnyway')}
        cancelLabel={t('editor.common.cancel')}
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
        onOpenAvisos={() => setIsDiagnosticsOpen(true)}
      />
    </div>
  );
};

export default MdxWorkbench;
