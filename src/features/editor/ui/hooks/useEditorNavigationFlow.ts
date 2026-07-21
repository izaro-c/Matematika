import { useEffect, useState } from 'react';
import { useNavigationStore } from '@/shared/stores/NavigationStore';
import {
  readEditorWorkspacePreferences,
  recordRecentPath,
  toggleFavoritePath,
  writeEditorWorkspacePreferences,
  type EditorWorkspacePreferences,
} from '../../navigation/editorNavigationModel';

export interface UseEditorNavigationFlowOptions {
  files: Array<{ path: string }>;
  currentFile: string | null;
  openFile: (path: string, options?: { discardLocalChanges?: boolean }) => void;
  loadFileList: () => void;
  hasLocalChanges: boolean;
  setPendingFileNavigation: (path: string | null) => void;
}

export function useEditorNavigationFlow({
  files,
  currentFile,
  openFile,
  loadFileList,
  hasLocalChanges,
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

  const { toggleSearch } = useNavigationStore();

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

  const openFileSafely = (path: string) => {
    if (currentFile && currentFile !== path && hasLocalChanges) {
      setPendingFileNavigation(path);
      return;
    }
    setWorkspace(previous => ({
      ...previous,
      recentPaths: recordRecentPath(previous.recentPaths, path),
    }));
    openFile(path);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

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
  };
}
