import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { useNavigationStore } from '@/features/search/NavigationStore';
import { useEditorCore } from '../core/useEditorCore';
import { SemanticLinker } from './components/SemanticLinker';
import { DiagramWorkbench, type DiagramWorkbenchMode } from './diagrams/DiagramWorkbench';
import { DiagramRewriteDialog } from '../diagrams/ui/DiagramRewriteDialog';
import type { EditorDiagramReference } from '../core/editorTypes';
import { approveDiffReview, buildDiffReview, isDiffReviewStale, type DiffReview } from '../ux/diffReview';
import { buildEditorSafetyPresentation } from '../ux/safetyPresentation';
import { useDiagramUsages } from '../diagrams/hooks/useDiagramUsages';
import { usePageDiagramTargets } from '../diagrams/hooks/usePageDiagramTargets';
import { PublishedRuntimePreview } from './preview/PublishedRuntimePreview';
import { CreatePageDialog } from './create/CreatePageDialog';
import {
  readEditorWorkspacePreferences,
  recordRecentPath,
  toggleFavoritePath,
  writeEditorWorkspacePreferences,
  type EditorWorkspacePreferences,
} from '../navigation/editorNavigationModel';

// Componentes estructurales y paneles
import { EditorShell } from './EditorShell';
import { EditorToolbar } from './EditorToolbar';
import { EditorNavigation } from './EditorNavigation';
import { VisualEditorPanel } from './panels/VisualEditorPanel';
import { CodeEditorPanel } from './panels/CodeEditorPanel';
import { MetadataPanel } from './panels/MetadataPanel';
import { DiagramSourcePanel } from './panels/DiagramSourcePanel';
import { SafetySummary } from './safety/SafetySummary';
import { DiffReviewPanel } from './diff/DiffReviewPanel';
import { UnsavedChangesDialog } from './safety/UnsavedChangesDialog';
import { EditorDiagnosticsPanel } from './panels/EditorDiagnosticsPanel';
import { buildPageConnectionSummary, buildPageDiagramLinks, getDiagramWorkbenchMode, getInlineDiagramTargets, getPreviewPath, mergeDiagramTargets } from './editorPageModel';

function diagramComponentName(path: string): string {
  const fileName = path.split('/').pop()?.replace(/\.tsx$/, '') ?? 'DiagramaInteractivo';
  const cleaned = fileName.replace(/[^A-Za-z0-9_$]/g, '');
  return /^[A-Za-z_$]/.test(cleaned) ? cleaned : `Diagrama${cleaned}`;
}

export const EditorPage: React.FC = () => {
  const {
    files,
    filesLoading,
    filesError,
    loading,
    currentFile,
    editorMode,
    metadata,
    imports,
    exports,
    blocks,
    rawBody,
    baseSource,
    localRevision,
    baseVersion,
    saving,
    dirtyState,
    validation,
    message,
    persistenceStatus,
    loadFileList,
    openFile,
    toggleEditorMode,
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
    getExpectedDiffRanges,
    compatibility,
    compatibilityReasons,
    canMutateVisualStructure,
    canEditVisualMetadata,
    persistenceLabel
  } = useEditorCore();

  const isReadOnly = compatibility === 'read-only';

  const [workspace, setWorkspace] = useState<EditorWorkspacePreferences>(() => readEditorWorkspacePreferences(window.localStorage));
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [isInspectorOpen, setIsInspectorOpen] = useState(() => window.innerWidth >= 1100);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [diffReview, setDiffReview] = useState<DiffReview | null>(null);
  const [pendingFileNavigation, setPendingFileNavigation] = useState<string | null>(null);
  const [focusRange, setFocusRange] = useState<{ start: number; end: number } | undefined>(undefined);
  const [coordinatedView, setCoordinatedView] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [createPageOpen, setCreatePageOpen] = useState(false);

  // Estado para el enlazador semántico
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
    selectionEnd: 0
  });
  const [linkerPosition, setLinkerPosition] = useState({ top: 0, left: 0 });

  // Estado para el constructor visual de diagramas
  const [diagramBuilderOpen, setDiagramBuilderOpen] = useState(false);
  const [diagramWorkbenchOverride, setDiagramWorkbenchOverride] = useState<DiagramWorkbenchMode | null>(null);
  const [rewriteDiagramPath, setRewriteDiagramPath] = useState<string | null>(null);
  const [activeDiagramBlockId, setActiveDiagramBlockId] = useState<string | null>(null);
  const [, setActiveDiagramIndex] = useState<number | null>(null);

  const [, setLocation] = useLocation();
  const { toggleSearch } = useNavigationStore();
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  // Sincronizar el modo oscuro mediante MutationObserver
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Escuchar evento personalizado de búsqueda para abrir archivos de forma reactiva e inmediata
  useEffect(() => {
    const handleOpenConcept = (e: Event) => {
      const customEvent = e as CustomEvent<{ href: string }>;
      const queryHref = customEvent.detail.href;
      if (queryHref && files.length > 0) {
        const slug = queryHref.split('/').pop()?.toLowerCase();
        const matchedFile = files.find(f => {
          const fileSlug = f.path.split('/').pop()?.replace('.mdx', '').toLowerCase();
          return fileSlug === slug;
        });
        if (matchedFile) {
          openFile(matchedFile.path);
        }
      }
    };
    window.addEventListener('editor-open-concept', handleOpenConcept);
    return () => window.removeEventListener('editor-open-concept', handleOpenConcept);
  }, [files, openFile]);

  useEffect(() => {
    loadFileList();
  }, [loadFileList]);

  useEffect(() => {
    writeEditorWorkspacePreferences(workspace, window.localStorage);
  }, [workspace]);

  const isDiagramFile = currentFile?.endsWith('.tsx') ?? false;
  const currentResource = files.find(file => file.path === currentFile);
  const diagramUsageLookup = useDiagramUsages(isDiagramFile ? currentFile : null, files);

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

  const handleAddCustomMetadataField = () => {
    // La metadata visual sigue bloqueada por política lossless; se mantiene sin API nativa genérica.
  };

  const hasLocalChanges = dirtyState !== 'clean' || rawBody !== baseSource;
  const canReviewDiff = Boolean(currentFile?.endsWith('.mdx') && rawBody !== baseSource);
  const canSaveDraft = Boolean(currentFile && hasLocalChanges && baseVersion);
  const safetyPresentation = useMemo(() => buildEditorSafetyPresentation({
    currentFile,
    compatibility,
    compatibilityReasons,
    persistenceStatus,
    validation,
    editorMode,
    isDiagramFile,
  }), [compatibility, compatibilityReasons, currentFile, editorMode, isDiagramFile, persistenceStatus, validation]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasLocalChanges) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [hasLocalChanges]);

  // Interceptar clicks globales para proteger la navegación interna (wouter)
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      if (!hasLocalChanges) return;
      const target = event.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href) {
          // Si es una ruta interna o relativa:
          if (href.startsWith('/') || href.startsWith('#') || href.includes(window.location.host)) {
            event.preventDefault();
            event.stopPropagation();
            setPendingFileNavigation(href);
          }
        }
      }
    };
    window.addEventListener('click', handleGlobalClick, true);
    return () => window.removeEventListener('click', handleGlobalClick, true);
  }, [hasLocalChanges]);

  // Accesos rápidos de teclado (shortcuts) y tecla Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (pendingFileNavigation) {
          event.preventDefault();
          setPendingFileNavigation(null);
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
            if (isDiagramFile) {
              void saveCurrentFile();
            } else if (editorMode === 'code') {
              void saveCurrentFile();
            } else if (editorMode === 'visual') {
              reviewCurrentDiff();
            }
          }
        } else if (event.key.toLowerCase() === 'd') {
          event.preventDefault();
          if (canReviewDiff) {
            reviewCurrentDiff();
          }
        } else if (event.key.toLowerCase() === 'm') {
          event.preventDefault();
          toggleEditorMode();
        } else if (event.shiftKey && event.key.toLowerCase() === 'e') {
          event.preventDefault();
          setIsSidebarOpen(value => !value);
        } else if (event.shiftKey && event.key.toLowerCase() === 'i') {
          event.preventDefault();
          if (currentFile) setIsInspectorOpen(value => !value);
        } else if (event.key.toLowerCase() === 'j') {
          event.preventDefault();
          if (currentFile) setIsDiagnosticsOpen(value => !value);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [currentFile, isDiagramFile, editorMode, canReviewDiff, pendingFileNavigation, diffReview, saving, toggleEditorMode]);

  const openFileSafely = (path: string) => {
    if (currentFile && currentFile !== path && hasLocalChanges) {
      setPendingFileNavigation(path);
      return;
    }
    setWorkspace(previous => ({ ...previous, recentPaths: recordRecentPath(previous.recentPaths, path) }));
    openFile(path);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const toggleFavorite = (path: string) => {
    setWorkspace(previous => ({ ...previous, favoritePaths: toggleFavoritePath(previous.favoritePaths, path) }));
  };

  function reviewCurrentDiff() {
    if (!currentFile?.endsWith('.mdx')) {
      void saveCurrentFile();
      return;
    }
    const structuralRanges = getExpectedDiffRanges();
    const explicitCodeEdit = structuralRanges.length === 0
      && compatibility === 'fully-editable'
      && (editorMode === 'code' || coordinatedView);
    const expectedRanges = explicitCodeEdit ? [{
      start: 0,
      end: baseSource.length,
      reason: 'Edición explícita del source completo en la vista de código.',
      operationId: `code-edit:${localRevision}`,
      blockId: 'source',
    }] : structuralRanges;
    setDiffReview(buildDiffReview({
      documentId: currentFile,
      baseSource,
      candidateSource: rawBody,
      localRevision,
      baseVersion,
      expectedRanges,
    }));
  };

  const applyReviewedDiff = async () => {
    if (!diffReview || isDiffReviewStale(diffReview, localRevision, baseVersion) || diffReview.status !== 'reviewable') return;
    const approval = approveDiffReview(diffReview);
    if (!approval) return;
    const saved = await saveCurrentFile(approval);
    if (saved) setDiffReview(null);
  };

  const continuePendingNavigation = () => {
    const target = pendingFileNavigation;
    setPendingFileNavigation(null);
    if (target) {
      if (target.startsWith('/') && !target.includes('database/content/')) {
        setLocation(target);
      } else {
        openFile(target, { discardLocalChanges: true });
      }
    }
  };

  const handleSelectIssue = (issue: any) => {
    if (issue.blockId) {
      setEditorMode('visual');
      setEditingBlockId(issue.blockId);
      setTimeout(() => {
        const el = document.getElementById(`block-${issue.blockId}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    } else if (issue.sourceRange) {
      setEditorMode('code');
      setFocusRange(issue.sourceRange);
    }
  };

  const handleSelectDiffChange = (change: any) => {
    if (change.blockId) {
      setEditorMode('visual');
      setEditingBlockId(change.blockId);
      setTimeout(() => {
        const el = document.getElementById(`block-${change.blockId}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    } else if (change.originalRange) {
      setEditorMode('code');
      setFocusRange(change.originalRange);
    }
  };

  const inlineDiagramTargets = useMemo(() => getInlineDiagramTargets(blocks), [blocks]);
  const activeDiagramBlock = useMemo(
    () => activeDiagramBlockId ? blocks.find(block => block.id === activeDiagramBlockId) : null,
    [activeDiagramBlockId, blocks],
  );
  const diagramWorkbenchMode = useMemo(
    () => diagramWorkbenchOverride ?? getDiagramWorkbenchMode(currentFile, activeDiagramBlock),
    [activeDiagramBlock, currentFile, diagramWorkbenchOverride],
  );
  const pageDiagramLinks = useMemo(
    () => buildPageDiagramLinks(currentFile, imports, exports, files, blocks),
    [blocks, currentFile, exports, files, imports],
  );
  const diagramTargetLookup = usePageDiagramTargets(pageDiagramLinks);
  const diagramTargets = useMemo(
    () => mergeDiagramTargets(inlineDiagramTargets, diagramTargetLookup.targets),
    [diagramTargetLookup.targets, inlineDiagramTargets],
  );
  const previewPath = useMemo(() => getPreviewPath(metadata), [metadata]);

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>, blockId: string) => {
    const target = e.target as HTMLTextAreaElement;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const text = target.value.substring(start, end).trim();

    if (text.length > 0) {
      const rect = target.getBoundingClientRect();
      setLinkerPosition({
        top: rect.top + window.scrollY - 130,
        left: rect.left + window.scrollX + (target.clientWidth / 4)
      });
      setLinkerState({
        isOpen: true,
        blockId,
        selectedText: text,
        selectionStart: start,
        selectionEnd: end
      });
    }
  };

  const handleLinkCreated = (linkMarkup: string) => {
    const { blockId, selectionStart, selectionEnd, editingMarkup } = linkerState;
    if (!blockId) return;

    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    const newContent = editingMarkup
      ? block.content.replace(editingMarkup, linkMarkup)
      : `${block.content.substring(0, selectionStart)}${linkMarkup}${block.content.substring(selectionEnd)}`;

    updateBlock(blockId, newContent);
    setLinkerState({ isOpen: false, blockId: '', selectedText: '', selectionStart: 0, selectionEnd: 0 });
  };

  const handleEditLink = (
    blockId: string,
    rawMarkup: string,
    text: string,
    attrs: any,
    tag: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setLinkerPosition({
      top: rect.top + window.scrollY - 180,
      left: rect.left + window.scrollX + (rect.width / 2) - 160
    });
    setLinkerState({
      isOpen: true,
      blockId,
      selectedText: text,
      selectionStart: 0,
      selectionEnd: 0,
      editingMarkup: rawMarkup,
      editingTag: tag,
      initialAttrs: attrs
    });
  };

  const handleConfirmDiagram = async (spec: EditorDiagramReference): Promise<boolean> => {
    if (currentFile?.endsWith('.tsx')) {
      await loadFileList();
      await openFile(currentFile, { discardLocalChanges: true });
      setDiagramBuilderOpen(false);
      setActiveDiagramBlockId(null);
      setActiveDiagramIndex(null);
      return true;
    }

    bindDiagram(spec);
    setDiagramBuilderOpen(false);
    setActiveDiagramBlockId(null);
    setActiveDiagramIndex(null);
    return true;
  };

  const insertInteractiveTargetParagraph = (target: { id: string; label?: string; color?: string }) => {
    const label = target.label || target.id;
    const color = target.color || 'salvia';
    addBlock(blocks.length, 'paragraph', `<InteractiveElement target="${target.id}" color="${color}">${label}</InteractiveElement>`);
  };

  const pageConnectionSummary = useMemo(() => buildPageConnectionSummary(blocks, diagramTargets), [blocks, diagramTargets]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-carbon/50 font-serif" role="status">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-carbon/15 border-t-salvia" aria-hidden="true" />
          <span className="mt-3 italic">Cargando contenido…</span>
        </div>
      );
    }

    if (currentFile && persistenceStatus.kind === 'save-error' && rawBody === '') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center" role="alert">
          <h3 className="font-serif text-lg font-bold text-granada">No se pudo abrir el recurso</h3>
          <p className="mt-2 max-w-md text-sm text-carbon/60">{message || 'La lectura falló. El archivo real no se ha modificado.'}</p>
          <button type="button" onClick={() => openFile(currentFile, { discardLocalChanges: true })} className="mt-4 rounded bg-granada px-4 py-2 text-xs font-bold text-lienzo">Reintentar</button>
        </div>
      );
    }

    if (!currentFile) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-carbon/[0.025]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-salvia">Área de trabajo</p>
          <h3 className="mt-2 text-xl font-serif font-bold text-carbon">Abra un recurso para comenzar</h3>
          <p className="text-sm text-carbon/55 max-w-md mt-2 font-serif">
            Documentos MDX y diagramas están separados en el explorador. Cada entrada explica si admite edición exacta o solo código con vista previa.
          </p>
          {!isSidebarOpen && <button type="button" onClick={() => setIsSidebarOpen(true)} className="mt-5 rounded bg-carbon px-4 py-2 text-xs font-bold text-lienzo">Explorar recursos</button>}
        </div>
      );
    }

    return (
      <>
        {/* PANEL CENTRAL: Editor Híbrido */}
        {!isDiagramFile && coordinatedView ? (
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden lg:flex-row" data-testid="coordinated-editor-view">
            <section className="flex min-h-0 min-w-0 flex-1 overflow-hidden border-b border-carbon/15 lg:border-b-0 lg:border-r" aria-label="Vista visual coordinada">
              <VisualEditorPanel
                currentFile={currentFile} metadata={metadata} isReadOnly={isReadOnly}
                canEditVisualMetadata={canEditVisualMetadata} canMutateVisualStructure={canMutateVisualStructure}
                blocks={blocks} editingBlockId={editingBlockId} setEditingBlockId={setEditingBlockId}
                handleMetadataChange={handleMetadataChange} addBlock={addBlock} moveBlock={moveBlock}
                duplicateBlock={duplicateBlock} removeBlock={removeBlock} updateBlock={updateBlock}
                handleTextareaSelect={handleTextareaSelect} handleEditLink={handleEditLink}
                setActiveDiagramIndex={setActiveDiagramIndex} setActiveDiagramBlockId={setActiveDiagramBlockId}
                setDiagramBuilderOpen={setDiagramBuilderOpen} diagramTargets={diagramTargets}
              />
            </section>
            <section className="min-h-[20rem] min-w-0 flex-1 overflow-y-auto p-3 sm:p-5" aria-label="Código coordinado">
              <CodeEditorPanel rawBody={rawBody} updateRawBody={updateRawBody} isDiagramFile={false} isDark={isDark} focusRange={focusRange} />
            </section>
          </div>
        ) : !isDiagramFile && editorMode === 'visual' ? (
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
            handleTextareaSelect={handleTextareaSelect}
            handleEditLink={handleEditLink}
            setActiveDiagramIndex={setActiveDiagramIndex}
            setActiveDiagramBlockId={setActiveDiagramBlockId}
            setDiagramBuilderOpen={setDiagramBuilderOpen}
            diagramTargets={diagramTargets}
          />
        ) : (
          <div className="flex-1 overflow-y-auto p-8">
            {compatibility === 'unsupported' && !isDiagramFile && (
              <div className="mx-auto mb-4 max-w-3xl rounded border border-terracota/30 bg-terracota/5 p-3 text-xs text-carbon shadow-sm">
                <span className="font-bold text-terracota">Recurso MDX inválido:</span> El análisis sintáctico no puede representar este documento con seguridad. El código original se conserva y el guardado queda bloqueado hasta corregirlo.
                {compatibilityReasons.length > 0 && (
                  <div className="mt-1 font-mono text-[10px] text-carbon/70">
                    {compatibilityReasons.join(' ')}
                  </div>
                )}
              </div>
            )}
            <CodeEditorPanel
              rawBody={rawBody}
              updateRawBody={updateRawBody}
              isDiagramFile={isDiagramFile}
              isDark={isDark}
              focusRange={focusRange}
            />
          </div>
        )}

      </>
    );
  };

  const renderInspector = () => {
    if (!currentFile) return null;
    return (
      <div className="relative h-full">
        <button type="button" onClick={() => setIsInspectorOpen(false)} className="absolute right-3 top-3 z-10 rounded border border-carbon/15 bg-lienzo px-2 py-1 text-[10px] font-bold text-carbon/55 lg:hidden">Cerrar</button>
        {currentFile.endsWith('.mdx') ? (
          <MetadataPanel
            metadata={metadata}
            canEditVisualMetadata={canEditVisualMetadata}
            canMutateVisualStructure={canMutateVisualStructure}
            handleMetadataChange={handleMetadataChange}
            handleRemoveMetadataField={handleRemoveMetadataField}
            handleAddCustomMetadataField={handleAddCustomMetadataField}
            validation={validation}
            blocks={blocks}
            openFile={openFileSafely}
            pageDiagramLinks={pageDiagramLinks}
            pageConnectionSummary={pageConnectionSummary}
            diagramTargets={diagramTargets}
            diagramTargetsLoading={diagramTargetLookup.loading}
            diagramTargetsError={diagramTargetLookup.error}
            setActiveDiagramIndex={setActiveDiagramIndex}
            setActiveDiagramBlockId={setActiveDiagramBlockId}
            setDiagramBuilderOpen={setDiagramBuilderOpen}
            insertInteractiveTargetParagraph={insertInteractiveTargetParagraph}
            onSelectIssue={handleSelectIssue}
          />
        ) : (
          <DiagramSourcePanel
            currentFile={currentFile}
            diagramLinkedPages={diagramUsageLookup.linkedPages}
            diagramUsageError={diagramUsageLookup.error}
            openFile={openFileSafely}
            setActiveDiagramBlockId={setActiveDiagramBlockId}
            setActiveDiagramIndex={setActiveDiagramIndex}
            setDiagramBuilderOpen={setDiagramBuilderOpen}
            onRewriteVisually={() => {
              if (currentFile) setRewriteDiagramPath(currentFile);
            }}
            capability={currentResource?.capability}
          />
        )}
      </div>
    );
  };

  return (
    <EditorShell
      toolbar={
        <EditorToolbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          currentFile={currentFile}
          message={message}
          persistenceLabel={persistenceLabel}
          dirtyState={dirtyState}
          isDiagramFile={isDiagramFile}
          editorMode={editorMode}
          toggleEditorMode={toggleEditorMode}
          validation={validation}
          saveCurrentFile={isDiagramFile ? saveCurrentFile : reviewCurrentDiff}
          saving={saving}
          previewPath={previewPath}
          isInspectorOpen={isInspectorOpen}
          setIsInspectorOpen={setIsInspectorOpen}
          isDiagnosticsOpen={isDiagnosticsOpen}
          setIsDiagnosticsOpen={setIsDiagnosticsOpen}
          level={workspace.level}
          setLevel={level => setWorkspace(previous => ({ ...previous, level }))}
          toggleSearch={toggleSearch}
          onCreatePage={() => setCreatePageOpen(true)}
          onOpenPreview={() => setPreviewOpen(true)}
          coordinatedView={coordinatedView}
          onToggleCoordinatedView={() => setCoordinatedView(value => !value)}
        />
      }
      navigation={
        isSidebarOpen ? (
          <EditorNavigation
            files={files}
            isLoading={filesLoading}
            error={filesError}
            currentFile={currentFile}
            openFile={openFileSafely}
            retry={() => { void loadFileList(); }}
            close={() => setIsSidebarOpen(false)}
            level={workspace.level}
            favoritePaths={workspace.favoritePaths}
            recentPaths={workspace.recentPaths}
            toggleFavorite={toggleFavorite}
            width={workspace.navigationWidth}
          />
        ) : null
      }
      navigationOpen={isSidebarOpen}
      navigationWidth={workspace.navigationWidth}
      setNavigationWidth={navigationWidth => setWorkspace(previous => ({ ...previous, navigationWidth }))}
      inspector={renderInspector()}
      inspectorOpen={isInspectorOpen && Boolean(currentFile)}
      inspectorWidth={workspace.inspectorWidth}
      setInspectorWidth={inspectorWidth => setWorkspace(previous => ({ ...previous, inspectorWidth }))}
      diagnostics={
        <EditorDiagnosticsPanel
          currentFile={currentFile}
          resource={currentResource}
          validation={validation}
          persistenceStatus={persistenceStatus}
          persistenceLabel={persistenceLabel}
          level={workspace.level}
          onSelectIssue={handleSelectIssue}
          close={() => setIsDiagnosticsOpen(false)}
        />
      }
      diagnosticsOpen={isDiagnosticsOpen && Boolean(currentFile)}
      diagnosticsHeight={workspace.diagnosticsHeight}
      setDiagnosticsHeight={diagnosticsHeight => setWorkspace(previous => ({ ...previous, diagnosticsHeight }))}
      persistPanelSizes={() => writeEditorWorkspacePreferences(workspace, window.localStorage)}
      safetySummary={
        <SafetySummary
          currentFile={currentFile}
          presentation={safetyPresentation}
          onReviewDiff={reviewCurrentDiff}
          onSaveDraft={() => { void saveDraftCurrentFile(); }}
          canReviewDiff={canReviewDiff}
          canSaveDraft={canSaveDraft}
          compatibility={compatibility}
          persistenceStatus={persistenceStatus.kind}
          isDiagramFile={isDiagramFile}
          showTechnicalDetails={workspace.level === 'advanced'}
        />
      }
    >
      {renderContent()}

      {/* Enlazador Semántico Popover Flotante */}
      <SemanticLinker
        isOpen={linkerState.isOpen}
        onClose={() => setLinkerState(prev => ({ ...prev, isOpen: false }))}
        files={files}
        selectedText={linkerState.selectedText}
        onLinkCreated={handleLinkCreated}
        position={linkerPosition}
        initialAttrs={linkerState.initialAttrs}
        editingTag={linkerState.editingTag}
        editingMarkup={linkerState.editingMarkup}
        diagramTargets={diagramTargets}
      />

      {/* Constructor Visual de Diagramas */}
      <DiagramWorkbench
        isOpen={diagramBuilderOpen}
        mode={diagramWorkbenchMode}
        metadataType={String(metadata.type || '')}
        onClose={() => {
          setDiagramBuilderOpen(false);
          setDiagramWorkbenchOverride(null);
          setActiveDiagramBlockId(null);
          setActiveDiagramIndex(null);
        }}
        onConfirm={handleConfirmDiagram}
      />
      {rewriteDiagramPath && (
        <DiagramRewriteDialog
          path={rewriteDiagramPath}
          initialTitle={diagramComponentName(rewriteDiagramPath)}
          onClose={() => setRewriteDiagramPath(null)}
          onStart={({ title, template }) => {
            setDiagramWorkbenchOverride({
              kind: 'rewrite',
              path: rewriteDiagramPath,
              componentName: diagramComponentName(rewriteDiagramPath),
              title,
              template,
            });
            setRewriteDiagramPath(null);
            setActiveDiagramBlockId(null);
            setActiveDiagramIndex(null);
            setDiagramBuilderOpen(true);
          }}
        />
      )}
      <DiffReviewPanel
        review={diffReview}
        isStale={diffReview ? isDiffReviewStale(diffReview, localRevision, baseVersion) : false}
        isApplying={saving}
        onClose={() => setDiffReview(null)}
        onApply={applyReviewedDiff}
        onSelectChange={handleSelectDiffChange}
      />
      <UnsavedChangesDialog
        isOpen={pendingFileNavigation !== null}
        targetLabel={pendingFileNavigation ?? 'otro archivo'}
        presentation={safetyPresentation}
        onCancel={() => setPendingFileNavigation(null)}
        onReviewDiff={reviewCurrentDiff}
        onSaveDraft={() => { void saveDraftCurrentFile(); }}
        onDiscardAndContinue={continuePendingNavigation}
        canReviewDiff={canReviewDiff}
        canSaveDraft={canSaveDraft}
      />
      <PublishedRuntimePreview open={previewOpen} path={previewPath} hasPendingChanges={hasLocalChanges} revision={localRevision} onClose={() => setPreviewOpen(false)} />
      <CreatePageDialog open={createPageOpen} onClose={() => setCreatePageOpen(false)} onCreate={createPage} />
    </EditorShell>
  );
};

export default EditorPage;
