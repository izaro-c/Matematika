import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useSearch } from 'wouter';
import { useNavigationStore } from '@/lib/stores/NavigationStore';
import { useI18n } from '@/i18n';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import type { EditorText } from '@/fixed-pages/editor/types/editorMessage';
import {
  editorStateFromUrl,
  editorUrlFromState,
  readEditorWorkspacePreferences,
  recordRecentPath,
  toggleFavoritePath,
  writeEditorWorkspacePreferences,
  type EditorResourceSection,
  type EditorRoute,
  type EditorWorkspacePreferences,
} from '@/fixed-pages/editor/session/editorNavigationModel';
import type { MdxViewMode } from '@/fixed-pages/editor/ui/workbench/MdxWorkbenchHeader';

export interface DiagramReturnContext {
  pagePath: string;
  blockId?: string | null;
  viewMode: MdxViewMode;
}

export interface UseEditorNavigationFlowOptions {
  files: FileNode[];
  filesLoading: boolean;
  /** Error al cargar el catálogo: sin él no se puede resolver la ruta. */
  filesError?: EditorText | null;
  currentFile: string | null;
  openFile: (path: string, options?: { discardLocalChanges?: boolean }) => void;
  closeFile: () => void;
  loadFileList: () => void;
  hasLocalChanges: boolean;
  /** Cambios sin guardar en el workbench de diagrama (superficie abierta). */
  diagramDirty?: boolean;
  setPendingFileNavigation: (target: string | null) => void;
}

type EditorUrlPatch = {
  viewMode?: MdxViewMode;
  blockId?: string | null;
  diagramSurface?: boolean;
  step?: string | null;
  returnTo?: string | null;
};

/**
 * Navegación del editor con la URL como fuente de verdad: archivo abierto, vista,
 * bloque, superficie de diagrama, paso y ruta de vuelta se leen de la URL y se
 * cambian con `navigate`. El núcleo (`useEditorCore`) se sincroniza con ella.
 */
export function useEditorNavigationFlow({
  files,
  filesLoading,
  filesError = null,
  currentFile,
  openFile,
  closeFile,
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

  const { toggleSearch } = useNavigationStore();
  const { lang: uiLang } = useI18n();
  const [location, navigate] = useLocation();
  const search = useSearch();

  const parsedRoute = useMemo(
    () => editorStateFromUrl({ pathname: location, search }, files),
    [files, location, search],
  );
  // Mientras llega el catálogo no se puede resolver la ruta: no es un «no encontrado».
  // Si el catálogo falló, tampoco: se informa del error en lugar de esperar para siempre.
  const route: EditorRoute | { status: 'pending' } | { status: 'catalog-error'; requested: string } =
    parsedRoute.status !== 'not-found' ? parsedRoute
      : filesError ? { status: 'catalog-error', requested: parsedRoute.requested }
      : filesLoading || files.length === 0 ? { status: 'pending' }
      : parsedRoute;
  const routeFile = route.status === 'file' ? route : null;
  const currentUrl = search ? `${location}?${search}` : location;

  const urlForPath = useCallback(
    (path: string, patch: EditorUrlPatch = {}) => editorUrlFromState({ uiLang, path, ...patch }),
    [uiLang],
  );

  const updateCurrentUrl = useCallback((patch: EditorUrlPatch, options: { replace?: boolean } = {}) => {
    if (!routeFile) return;
    const url = urlForPath(routeFile.path, {
      viewMode: routeFile.viewMode,
      blockId: routeFile.blockId,
      diagramSurface: routeFile.diagramSurface,
      step: routeFile.step,
      returnTo: routeFile.returnTo,
      ...patch,
    });
    if (url !== currentUrl) navigate(url, { replace: options.replace });
  }, [currentUrl, navigate, routeFile, urlForPath]);

  const goToLanding = useCallback((section: EditorResourceSection = 'documents', options: { replace?: boolean } = {}) => {
    navigate(editorUrlFromState({ uiLang, path: null, section }), { replace: options.replace });
  }, [navigate, uiLang]);

  // --- Sincronización URL ⇄ núcleo -----------------------------------------
  // `syncedPathRef` guarda el último archivo acordado entre ambos lados, para
  // distinguir quién originó el cambio y no rebotar entre URL y núcleo.
  const syncedPathRef = useRef<string | null>(null);
  const previousCoreFileRef = useRef<string | null>(currentFile);

  // URL → núcleo. La navegación ya pasó por los avisos de cambios sin guardar.
  const routePath = routeFile?.path ?? null;
  const routeStatus = route.status;
  useEffect(() => {
    if (routeStatus === 'pending' || routeStatus === 'catalog-error') return;
    if (routePath === syncedPathRef.current) return;
    syncedPathRef.current = routePath;
    if (routePath) {
      if (routePath !== currentFile) openFile(routePath, { discardLocalChanges: true });
    } else if (currentFile) {
      closeFile();
    }
    // Solo reacciona a cambios de la URL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routePath, routeStatus]);

  // Núcleo → URL: archivos abiertos por el propio motor (crear página, traducción…).
  useEffect(() => {
    const previous = previousCoreFileRef.current;
    previousCoreFileRef.current = currentFile;
    if (currentFile === previous || currentFile === syncedPathRef.current) return;
    if (!currentFile) return;
    syncedPathRef.current = currentFile;
    navigate(urlForPath(currentFile));
  }, [currentFile, navigate, urlForPath]);

  // --- Superficie de diagrama -------------------------------------------------
  const isDiagramRoute = routeFile?.path.endsWith('.tsx') ?? false;
  const diagramSurfaceOpen = Boolean(routeFile && (isDiagramRoute || routeFile.diagramSurface));
  const diagramReturnContext: DiagramReturnContext | null = routeFile?.diagramSurface
    ? { pagePath: routeFile.path, blockId: routeFile.blockId, viewMode: routeFile.viewMode }
    : null;

  const openDiagramSurface = useCallback((returnContext: DiagramReturnContext | null = null) => {
    if (!routeFile || isDiagramRoute) return;
    updateCurrentUrl({
      diagramSurface: true,
      blockId: returnContext?.blockId ?? routeFile.blockId,
      viewMode: returnContext?.viewMode ?? routeFile.viewMode,
    });
  }, [isDiagramRoute, routeFile, updateCurrentUrl]);

  /** Cierra la superficie: vuelve a la página, a `volver` o a la portada de diagramas. */
  const closeDiagramSurface = useCallback(() => {
    if (!routeFile) return;
    if (routeFile.diagramSurface) {
      updateCurrentUrl({ diagramSurface: false });
      return;
    }
    if (routeFile.returnTo) {
      navigate(routeFile.returnTo);
      return;
    }
    goToLanding(isDiagramRoute ? 'diagrams' : 'documents');
  }, [goToLanding, isDiagramRoute, navigate, routeFile, updateCurrentUrl]);

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
    // Un diagrama abierto desde una página recuerda cómo volver a ella.
    const returnTo = path.endsWith('.tsx') && routeFile && !isDiagramRoute ? currentUrl : null;
    // Reabrir la página actual conserva vista, bloque y paso; solo cierra la superficie.
    const url = routeFile?.path === path
      ? urlForPath(path, { viewMode: routeFile.viewMode, blockId: routeFile.blockId, step: routeFile.step, returnTo: routeFile.returnTo })
      : urlForPath(path, { returnTo });
    const leavingCurrent = Boolean(currentFile && currentFile !== path);
    const leavingDirtySurface = diagramSurfaceOpen && diagramDirty && url !== currentUrl;
    if ((leavingCurrent && hasLocalChanges) || leavingDirtySurface) {
      setPendingFileNavigation(url);
      return;
    }
    setWorkspace(previous => ({
      ...previous,
      recentPaths: recordRecentPath(previous.recentPaths, path),
    }));
    if (url !== currentUrl) navigate(url);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  }, [
    currentFile,
    currentUrl,
    diagramDirty,
    diagramSurfaceOpen,
    hasLocalChanges,
    isDiagramRoute,
    navigate,
    routeFile,
    setPendingFileNavigation,
    urlForPath,
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

  const setViewMode = useCallback((viewMode: MdxViewMode) => {
    updateCurrentUrl({ viewMode });
  }, [updateCurrentUrl]);

  const setUrlBlockId = useCallback((blockId: string | null) => {
    updateCurrentUrl({ blockId }, { replace: true });
  }, [updateCurrentUrl]);

  const setUrlStep = useCallback((step: string | null) => {
    updateCurrentUrl({ step }, { replace: true });
  }, [updateCurrentUrl]);

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
    route,
    viewMode: routeFile?.viewMode ?? 'visual',
    setViewMode,
    urlBlockId: routeFile?.blockId ?? null,
    setUrlBlockId,
    urlStep: routeFile?.step ?? null,
    setUrlStep,
    landingSection: route.status === 'landing' ? route.section : null,
    goToLanding,
    urlForPath,
    diagramSurfaceOpen,
    diagramReturnContext,
    openDiagramSurface,
    closeDiagramSurface,
  };
}
