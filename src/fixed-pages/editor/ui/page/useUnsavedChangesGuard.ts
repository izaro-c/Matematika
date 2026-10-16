import { useEffect, useRef, useState } from 'react';
import { useLocation, useRouter, useSearch } from 'wouter';
import { editorDocumentKey } from '@/fixed-pages/editor/session/editorNavigationModel';

export interface UseUnsavedChangesGuardOptions {
  hasLocalChanges: boolean;
  openFile: (path: string, options?: { discardLocalChanges?: boolean }) => void;
  setLocation: (url: string) => void;
  /** Limpia superficie diagrama / targeting antes de descartar y navegar. */
  onBeforeDiscardNavigate?: () => void;
  /** Tras openFile por path de corpus (no URL de app). */
  onAfterDiscardFileNavigate?: (path: string) => void;
}

export function useUnsavedChangesGuard({
  hasLocalChanges,
  openFile,
  setLocation,
  onBeforeDiscardNavigate,
  onAfterDiscardFileNavigate,
}: UseUnsavedChangesGuardOptions) {
  const [pendingFileNavigation, setPendingFileNavigation] = useState<string | null>(null);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasLocalChanges) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [hasLocalChanges]);

  // Atrás/adelante: el navegador ya cambió la URL cuando llega `popstate`. Si eso nos
  // saca del documento (o de la superficie de diagrama) con cambios sin guardar, se
  // restaura la URL anterior antes de que wouter la vea y se pide confirmación.
  const [location] = useLocation();
  const search = useSearch();
  const { base } = useRouter();
  const committedUrlRef = useRef({ pathname: '', search: '' });
  useEffect(() => {
    committedUrlRef.current = { pathname: window.location.pathname, search: window.location.search };
  }, [location, search]);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      if (!hasLocalChanges) return;
      const committed = committedUrlRef.current;
      const target = { pathname: window.location.pathname, search: window.location.search };
      if (!committed.pathname || editorDocumentKey(target) === editorDocumentKey(committed)) return;
      event.stopImmediatePropagation();
      window.history.pushState(window.history.state, '', `${committed.pathname}${committed.search}`);
      const appPath = base && target.pathname.startsWith(base) ? target.pathname.slice(base.length) || '/' : target.pathname;
      setPendingFileNavigation(`${appPath}${target.search}`);
    };
    window.addEventListener('popstate', onPopState, true);
    return () => window.removeEventListener('popstate', onPopState, true);
  }, [base, hasLocalChanges]);

  // Interceptar clicks globales para proteger la navegación interna (wouter)
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      if (!hasLocalChanges) return;
      const target = event.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href) {
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

  const continuePendingNavigation = () => {
    const target = pendingFileNavigation;
    setPendingFileNavigation(null);
    if (!target) return;
    onBeforeDiscardNavigate?.();
    if (target.startsWith('/') && !target.includes('database/content/')) {
      setLocation(target);
      return;
    }
    openFile(target, { discardLocalChanges: true });
    onAfterDiscardFileNavigate?.(target);
  };

  const cancelPendingNavigation = () => {
    setPendingFileNavigation(null);
  };

  return {
    pendingFileNavigation,
    setPendingFileNavigation,
    continuePendingNavigation,
    cancelPendingNavigation,
  };
}
