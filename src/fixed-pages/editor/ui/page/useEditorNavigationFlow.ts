import { useCallback, useEffect, useState } from 'react';
import { useNavigationStore } from '@/lib/stores/NavigationStore';
import {
  readEditorWorkspacePreferences,
  recordRecentPath,
  toggleFavoritePath,
  writeEditorWorkspacePreferences,
  type EditorWorkspacePreferences,
} from '@/fixed-pages/editor/session/editorNavigationModel';
import type { MdxViewMode } from '@/fixed-pages/editor/ui/workbench/MdxWorkbenchHeader';

export interface DiagramReturnContext {
  pagePath: string;
  blockId?: string | null;
  viewMode: MdxViewMode;
}

export interface UseEditorNavigationFlowOptions {
  files: Array<{ path: string }>;
  currentFile: string | null;
  openFile: (path: string, options?: { discardLocalChanges?: boolean }) => void;
  loadFileList: () => void;
  hasLocalChanges: boolean;
  /** Cambios sin guardar en el workbench de diagrama (superficie abierta). */
  diagramDirty?: boolean;
  setPendingFileNavigation: (path: string | null) => void;
}

export function useEditorNavigationFlow({
  files,
  currentFile,
  openFile,
  loadFileList,
  hasLocalChanges,
  diagramDirty = false,
  setPendingFileNavigation,
}: UseEditorNavigationFlowOptions) {
  const [workspace, setWorkspace] = useState<EditorWorkspacePreferences>(() =>
    readEditorWorkspacePreferences(window.localStorage),
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [isInspectorOpen, setIsInspectorOpen] = useState(() => window.innerWidth >= 1100);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  );
  const [diagramSurfaceOpen, setDiagramSurfaceOpen] = useState(false);
  const [diagramReturnContext, setDiagramReturnContext] = useState<DiagramReturnContext | null>(null);

  const { toggleSearch } = useNavigationStore();

  const openDiagramSurface = useCallback((returnContext: DiagramReturnContext | null = null) => {
    setDiagramReturnContext(returnContext);
    setDiagramSurfaceOpen(true);
  }, []);

  const closeDiagramSurface = useCallback(() => {
    setDiagramSurfaceOpen(false);
    setDiagramReturnContext(null);
  }, []);

  // Sincronizar el modo oscuro mediante MutationObserver
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    loadFileList();
  }, [loadFileList]);

  useEffect(() => {
    writeEditorWorkspacePreferences(workspace, window.localStorage);
  }, [workspace]);

  const openFileSafely = useCallback((path: string) => {
    const leavingCurrent = Boolean(currentFile && currentFile !== path);
    const diagramBlocksNav = diagramSurfaceOpen && diagramDirty;
    if (leavingCurrent && (hasLocalChanges || diagramBlocksNav)) {
      setPendingFileNavigation(path);
      return;
    }
    setWorkspace(previous => ({
      ...previous,
      recentPaths: recordRecentPath(previous.recentPaths, path),
    }));
    openFile(path);
    if (path.endsWith('.tsx')) {
      openDiagramSurface(null);
    } else {
      closeDiagramSurface();
    }
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  }, [
    closeDiagramSurface,
    currentFile,
    diagramDirty,
    diagramSurfaceOpen,
    hasLocalChanges,
    openDiagramSurface,
    openFile,
    setPendingFileNavigation,
  ]);

  // Búsqueda de conceptos: misma ruta segura que el sidebar (cierra superficie / pide confirmación)
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
          openFileSafely(matchedFile.path);
        }
      }
    };
    window.addEventListener('editor-open-concept', handleOpenConcept);
    return () => window.removeEventListener('editor-open-concept', handleOpenConcept);
  }, [files, openFileSafely]);

  const toggleFavorite = (path: string) => {
    setWorkspace(previous => ({
      ...previous,
      favoritePaths: toggleFavoritePath(previous.favoritePaths, path),
    }));
  };

  return {
    workspace,
    setWorkspace,
    isSidebarOpen,
    setIsSidebarOpen,
    isInspectorOpen,
    setIsInspectorOpen,
    isDiagnosticsOpen,
    setIsDiagnosticsOpen,
    isDark,
    toggleSearch,
    openFileSafely,
    toggleFavorite,
    diagramSurfaceOpen,
    diagramReturnContext,
    openDiagramSurface,
    closeDiagramSurface,
  };
}
