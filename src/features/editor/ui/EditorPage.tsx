import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { useNavigationStore } from '@/features/search/NavigationStore';
import { useEditorCore } from '../core/useEditorCore';
import { SemanticLinker } from './components/SemanticLinker';
import { DiagramWorkbench, type DiagramWorkbenchMode } from './diagrams/DiagramWorkbench';
import { Block, createBlockId, parseAttributes } from '../core/parser';
import type { DiagramSpec, DiagramTargetRegistry } from '../core/editorTypes';
import type { FileNode } from '../lib/editorContracts';
import { approveDiffReview, buildDiffReview, isDiffReviewStale, type DiffReview } from '../ux/diffReview';
import { buildEditorSafetyPresentation } from '../ux/safetyPresentation';
import { useDiagramUsages } from '../diagrams/hooks/useDiagramUsages';

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

interface PageDiagramLink {
  componentName: string;
  importSource?: string;
  path?: string;
  role: 'Simulation' | 'Diagram' | 'Inline' | 'Imported';
  targets?: DiagramTargetRegistry;
}

function normalizeDiagramImportPath(source: string): string | undefined {
  const withoutExtension = source.replace(/\.tsx$/, '');
  if (withoutExtension.startsWith('@/')) return `${withoutExtension.slice(2)}.tsx`;

  const sharedIndex = withoutExtension.indexOf('shared/diagrams/');
  if (sharedIndex >= 0) return `${withoutExtension.slice(sharedIndex)}.tsx`;

  const widgetsIndex = withoutExtension.indexOf('widgets/diagrams/');
  if (widgetsIndex >= 0) return `${withoutExtension.slice(widgetsIndex)}.tsx`;

  return undefined;
}

function findDiagramFile(files: FileNode[], componentName: string, importSource?: string): FileNode | undefined {
  const normalizedPath = importSource ? normalizeDiagramImportPath(importSource) : undefined;
  return files.find(file => (
    file.path === normalizedPath ||
    file.path.endsWith(`/${componentName}.tsx`) ||
    file.name === `${componentName}.tsx`
  ));
}

export const EditorPage: React.FC = () => {
  const {
    files,
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
    saveCurrentFile,
    saveDraftCurrentFile,
    setMetadata,
    setImports,
    setExports,
    setBlocks,
    getExpectedDiffRanges,
    compatibility,
    compatibilityReasons,
    canMutateVisualStructure,
    canEditVisualMetadata,
    persistenceLabel
  } = useEditorCore();

  const isReadOnly = compatibility === 'read-only';

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [diffReview, setDiffReview] = useState<DiffReview | null>(null);
  const [pendingFileNavigation, setPendingFileNavigation] = useState<string | null>(null);
  const [focusRange, setFocusRange] = useState<{ start: number; end: number } | undefined>(undefined);

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
  const [activeDiagramBlockId, setActiveDiagramBlockId] = useState<string | null>(null);
  const [activeDiagramIndex, setActiveDiagramIndex] = useState<number | null>(null);

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

  const isDiagramFile = currentFile?.endsWith('.tsx') ?? false;
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
    openFile(path);
  };

  function reviewCurrentDiff() {
    if (!currentFile?.endsWith('.mdx')) {
      void saveCurrentFile();
      return;
    }
    setDiffReview(buildDiffReview({
      documentId: currentFile,
      baseSource,
      candidateSource: rawBody,
      localRevision,
      baseVersion,
      expectedRanges: getExpectedDiffRanges(),
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

  const diagramTargets: DiagramTargetRegistry = useMemo(() => {
    return blocks.flatMap(block => {
      if (block.type !== 'diagram') return [];
      return Array.isArray(block.metadata?.targets) ? block.metadata.targets : [];
    });
  }, [blocks]);

  const activeDiagramBlock = useMemo(() => {
    return activeDiagramBlockId
      ? blocks.find(block => block.id === activeDiagramBlockId)
      : null;
  }, [activeDiagramBlockId, blocks]);

  const diagramWorkbenchMode = useMemo<DiagramWorkbenchMode>(() => {
    if (currentFile?.endsWith('.tsx')) {
      return { kind: 'file', path: currentFile };
    }

    if (activeDiagramBlock) {
      return {
        kind: 'inline',
        source: typeof activeDiagramBlock.metadata?.source === 'string' ? activeDiagramBlock.metadata.source : '',
        componentName: activeDiagramBlock.content || 'DiagramaInteractivo',
        model: activeDiagramBlock.metadata?.visualModel as Record<string, unknown> | undefined,
      };
    }

    return { kind: 'new', componentName: 'DiagramaInteractivo' };
  }, [activeDiagramBlock, currentFile]);

  const pageDiagramLinks = useMemo<PageDiagramLink[]>(() => {
    if (!currentFile?.endsWith('.mdx')) return [];

    const links = new Map<string, PageDiagramLink>();
    const importRegex = /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]([^'"]+)['"]/g;
    let match: RegExpExecArray | null;

    while ((match = importRegex.exec(imports)) !== null) {
      const names = match[1].split(',').map(name => name.trim()).filter(Boolean);
      const importSource = match[2];
      for (const name of names) {
        const componentName = name.split(/\s+as\s+/i)[0].trim();
        if (!componentName) continue;
        const role = exports.includes(`Simulation = ${componentName}`)
          ? 'Simulation'
          : exports.includes(`Diagram = ${componentName}`)
            ? 'Diagram'
            : 'Imported';
        const diagramFile = findDiagramFile(files, componentName, importSource);
        links.set(componentName, {
          componentName,
          importSource,
          path: diagramFile?.path ?? normalizeDiagramImportPath(importSource),
          role,
        });
      }
    }

    for (const block of blocks) {
      if (block.type !== 'diagram') continue;
      const existing = links.get(block.content);
      links.set(block.content, {
        componentName: block.content,
        importSource: typeof block.metadata?.importPath === 'string' ? block.metadata.importPath : existing?.importSource,
        path: typeof block.metadata?.path === 'string' ? block.metadata.path : existing?.path,
        role: existing?.role === 'Simulation' || existing?.role === 'Diagram' ? existing.role : 'Inline',
        targets: Array.isArray(block.metadata?.targets) ? block.metadata.targets : existing?.targets,
      });
    }

    return [...links.values()].filter(link => (
      link.path?.includes('diagrams') ||
      link.role === 'Simulation' ||
      link.role === 'Diagram' ||
      link.role === 'Inline'
    ));
  }, [blocks, currentFile, exports, files, imports]);

  const getPreviewPath = () => {
    const id = String(metadata.id || '').trim();
    if (!id) return null;
    const type = String(metadata.type || '');
    if (type === 'definicion') return `/definicion/${id}`;
    if (type === 'teorema' || type === 'lema' || type === 'corolario') return `/teorema/${id}`;
    if (type === 'demostracion') return `/demo/${id}`;
    if (type === 'axioma') return `/axioma/${id}`;
    if (type === 'modelo') return `/modelo/${id}`;
    if (type === 'ejemplo') return `/ejemplo/${id}`;
    if (type === 'ejercicio') return `/ejercicio/${id}`;
    if (type === 'caso-de-uso') return `/caso/${id}`;
    if (type === 'plan-de-estudio') return `/plan/${id}`;
    return null;
  };

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

  const handleConfirmDiagram = (spec: DiagramSpec) => {
    if (currentFile?.endsWith('.tsx')) {
      updateRawBody(spec.source);
      setDiagramBuilderOpen(false);
      setActiveDiagramBlockId(null);
      setActiveDiagramIndex(null);
      return;
    }

    const importLine = `import { ${spec.componentName} } from '${spec.importPath}';`;
    setImports(prev => prev.includes(importLine) || prev.includes(spec.componentName)
      ? prev
      : `${prev.trim()}\n${importLine}`.trim()
    );

    const exportName = spec.mode === 'diagram' ? 'Diagram' : 'Simulation';
    const exportLine = `export const ${exportName} = ${spec.componentName};`;
    setExports(prev => {
      const withoutSameExport = prev
        .split('\n')
        .filter(line => !new RegExp(`^\\s*export\\s+const\\s+${exportName}\\s*=`).test(line))
        .join('\n')
        .trim();
      return `${withoutSameExport}\n${exportLine}`.trim();
    });

    setMetadata(prev => ({
      ...prev,
      hasDiagram: true,
      hasSimulation: spec.mode !== 'diagram',
      layout: String(prev.type) === 'demostracion' ? 'split' : prev.layout,
    }));

    const diagramMetadata = {
      path: spec.path,
      importPath: spec.importPath,
      targets: spec.targets,
      generatedBy: 'DiagramWorkbench',
      visualModel: spec.visualModel,
    };

    if (activeDiagramBlockId) {
      updateBlock(activeDiagramBlockId, spec.componentName, diagramMetadata);
    } else if (activeDiagramIndex !== null) {
      const newBlock: Block = {
        id: createBlockId(),
        type: 'diagram',
        content: spec.componentName,
        metadata: diagramMetadata
      };
      setBlocks(prev => {
        const updated = [...prev];
        updated.splice(activeDiagramIndex, 0, newBlock);
        return updated;
      });
    }
    setDiagramBuilderOpen(false);
    setActiveDiagramBlockId(null);
    setActiveDiagramIndex(null);
  };

  const insertInteractiveTargetParagraph = (target: { id: string; label?: string; color?: string }) => {
    const label = target.label || target.id;
    const color = target.color || 'salvia';
    const newBlock: Block = {
      id: createBlockId(),
      type: 'paragraph',
      content: `<InteractiveElement target="${target.id}" color="${color}">${label}</InteractiveElement>`,
    };
    setBlocks(prev => [...prev, newBlock]);
  };

  const pageConnectionSummary = useMemo(() => {
    const text = blocks.map(block => block.content).join('\n');
    const conceptHighlights = [...text.matchAll(/<ConceptLink\b([^>]*?)>([\s\S]*?)<\/ConceptLink>/g)]
      .map(match => ({ attrs: parseAttributes(match[1] || ''), label: match[2].replace(/<[^>]+>/g, '').trim() }))
      .filter(item => item.attrs.highlightTarget);
    const interactiveTargets = [...text.matchAll(/<InteractiveElement\b([^>]*?)>([\s\S]*?)<\/InteractiveElement>/g)]
      .map(match => ({ attrs: parseAttributes(match[1] || ''), label: match[2].replace(/<[^>]+>/g, '').trim() }))
      .filter(item => item.attrs.target);
    const connectedTargetIds = new Set<string>([
      ...conceptHighlights.map(item => String(item.attrs.highlightTarget)),
      ...interactiveTargets.map(item => String(item.attrs.target)),
    ]);
    const missingTargets = diagramTargets.filter(target => !connectedTargetIds.has(target.id));

    return {
      connected: [
        ...conceptHighlights.map(item => ({
          target: String(item.attrs.highlightTarget),
          label: item.label,
          kind: 'concepto + diagrama',
        })),
        ...interactiveTargets.map(item => ({
          target: String(item.attrs.target),
          label: item.label,
          kind: 'diagrama',
        })),
      ],
      missingTargets,
    };
  }, [blocks, diagramTargets]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center italic text-carbon/50 font-serif">
          <span>Cargando contenido...</span>
        </div>
      );
    }

    if (!currentFile) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-carbon/5">
          <h3 className="text-lg font-serif font-bold text-carbon">Editor del Archivo</h3>
          <p className="text-xs text-carbon/50 max-w-sm mt-2 font-serif italic">
            Seleccione un documento en el panel izquierdo para comenzar a editar.
          </p>
        </div>
      );
    }

    return (
      <>
        {/* PANEL CENTRAL: Editor Híbrido */}
        {!isDiagramFile && editorMode === 'visual' ? (
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
                <span className="font-bold text-terracota">❌ Modo Visual no Disponible:</span> Este archivo contiene sintaxis compleja o expresiones matemáticas con llaves <code>{`{}`}</code> que impiden el parseo seguro en modo visual.
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

        {/* PANEL DERECHO: Metadatos o Diagrama */}
        {isInspectorOpen && currentFile.endsWith('.mdx') && (
          <MetadataPanel
            metadata={metadata}
            canEditVisualMetadata={canEditVisualMetadata}
            handleMetadataChange={handleMetadataChange}
            handleRemoveMetadataField={handleRemoveMetadataField}
            handleAddCustomMetadataField={handleAddCustomMetadataField}
            validation={validation}
            blocks={blocks}
            openFile={openFileSafely}
            pageDiagramLinks={pageDiagramLinks}
            pageConnectionSummary={pageConnectionSummary}
            setActiveDiagramIndex={setActiveDiagramIndex}
            setActiveDiagramBlockId={setActiveDiagramBlockId}
            setDiagramBuilderOpen={setDiagramBuilderOpen}
            insertInteractiveTargetParagraph={insertInteractiveTargetParagraph}
            onSelectIssue={handleSelectIssue}
          />
        )}
        {isDiagramFile && (
          <DiagramSourcePanel
            currentFile={currentFile}
            diagramLinkedPages={diagramUsageLookup.linkedPages}
            diagramUsageError={diagramUsageLookup.error}
            openFile={openFileSafely}
            setActiveDiagramBlockId={setActiveDiagramBlockId}
            setActiveDiagramIndex={setActiveDiagramIndex}
            setDiagramBuilderOpen={setDiagramBuilderOpen}
          />
        )}
      </>
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
          isDiagramFile={isDiagramFile}
          editorMode={editorMode}
          toggleEditorMode={toggleEditorMode}
          validation={validation}
          saveCurrentFile={isDiagramFile ? saveCurrentFile : reviewCurrentDiff}
          saving={saving}
          previewPath={getPreviewPath()}
          setLocation={setLocation}
          isInspectorOpen={isInspectorOpen}
          setIsInspectorOpen={setIsInspectorOpen}
          toggleSearch={toggleSearch}
        />
      }
      navigation={
        isSidebarOpen ? (
          <EditorNavigation
            files={files}
            currentFile={currentFile}
            openFile={openFileSafely}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        ) : null
      }
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
          setActiveDiagramBlockId(null);
          setActiveDiagramIndex(null);
        }}
        onConfirm={handleConfirmDiagram}
      />
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
    </EditorShell>
  );
};

export default EditorPage;
