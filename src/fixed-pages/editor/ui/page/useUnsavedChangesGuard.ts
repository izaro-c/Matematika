import { useEffect, useRef, useState } from 'react';
import { useLocation, useRouter, useSearch } from 'wouter';
import { editorDocumentKey } from '@/fixed-pages/editor/session/editorNavigationModel';

export interface UseUnsavedChangesGuardOptions {
  hasLocalChanges: boolean;
  setLocation: (url: string) => void;
  /** Limpia superficie diagrama / targeting antes de descartar y navegar. */
  onBeforeDiscardNavigate?: () => void;
}

/** Clave en `history.state` con la posición de cada entrada, para deshacer atrás/adelante. */
const HISTORY_INDEX_KEY = 'matematikaEditorIndex';

function historyIndexOf(state: unknown): number | null {
  const value = state && typeof state === 'object' ? (state as Record<string, unknown>)[HISTORY_INDEX_KEY] : undefined;
  return typeof value === 'number' ? value : null;
}

function stampHistoryIndex(index: number) {
  const state = window.history.state && typeof window.history.state === 'object' ? window.history.state : {};
  window.history.replaceState({ ...state, [HISTORY_INDEX_KEY]: index }, '');
}

export function useUnsavedChangesGuard({
  hasLocalChanges,
  setLocation,
  onBeforeDiscardNavigate,
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

  // Cada entrada del historial lleva su posición. wouter emite `pushState`/`replaceState`
  // tras cambiar el historial: una entrada nueva recibe la siguiente posición y una
  // reemplazada conserva la suya. Así se puede volver con `history.go` sin crear entradas.
  const historyIndexRef = useRef(0);
  useEffect(() => {
    const existing = historyIndexOf(window.history.state);
    if (existing === null) stampHistoryIndex(historyIndexRef.current);
    else historyIndexRef.current = existing;

    const onPush = () => {
      historyIndexRef.current += 1;
      stampHistoryIndex(historyIndexRef.current);
    };
    const onReplace = () => {
      if (historyIndexOf(window.history.state) === null) stampHistoryIndex(historyIndexRef.current);
    };
    window.addEventListener('pushState', onPush);
    window.addEventListener('replaceState', onReplace);
    return () => {
      window.removeEventListener('pushState', onPush);
      window.removeEventListener('replaceState', onReplace);
    };
  }, []);

  // Atrás/adelante: el navegador ya cambió la URL cuando llega `popstate`. Si eso nos
  // saca del documento (o de la superficie de diagrama) con cambios sin guardar, se
  // vuelve a la entrada anterior antes de que wouter la vea y se pide confirmación.
  const [location] = useLocation();
  const search = useSearch();
  const { base } = useRouter();
  const committedUrlRef = useRef({ pathname: '', search: '' });
  /** Salto de historial que repite el atrás/adelante bloqueado si se confirma. */
  const blockedTraversalRef = useRef<{ url: string; delta: number } | null>(null);
  const allowNextTraversalRef = useRef(false);
  useEffect(() => {
    committedUrlRef.current = { pathname: window.location.pathname, search: window.location.search };
  }, [location, search]);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const committedIndex = historyIndexRef.current;
      const targetIndex = historyIndexOf(event.state);
      const allowed = allowNextTraversalRef.current;
      allowNextTraversalRef.current = false;
      const committed = committedUrlRef.current;
      const target = { pathname: window.location.pathname, search: window.location.search };
      const blocks = hasLocalChanges && !allowed && Boolean(committed.pathname)
        && editorDocumentKey(target) !== editorDocumentKey(committed);
      if (!blocks) {
        if (targetIndex !== null) historyIndexRef.current = targetIndex;
        return;
      }
      event.stopImmediatePropagation();
      const appPath = base && target.pathname.startsWith(base) ? target.pathname.slice(base.length) || '/' : target.pathname;
      const url = `${appPath}${target.search}`;
      if (targetIndex !== null) {
        // Deshacer el salto: el `popstate` de vuelta coincide con la URL acordada y no bloquea.
        blockedTraversalRef.current = { url, delta: targetIndex - committedIndex };
        window.history.go(committedIndex - targetIndex);
      } else {
        // Entrada anterior al editor, sin posición conocida: se restaura empujando la URL.
        blockedTraversalRef.current = null;
        window.history.pushState(window.history.state, '', `${committed.pathname}${committed.search}`);
      }
      setPendingFileNavigation(url);
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
    const traversal = blockedTraversalRef.current;
    blockedTraversalRef.current = null;
    setPendingFileNavigation(null);
    if (!target) return;
    onBeforeDiscardNavigate?.();
    if (traversal && traversal.url === target) {
      allowNextTraversalRef.current = true;
      window.history.go(traversal.delta);
      return;
    }
    setLocation(target);
  };

  const cancelPendingNavigation = () => {
    blockedTraversalRef.current = null;
    setPendingFileNavigation(null);
  };

  return {
    pendingFileNavigation,
    setPendingFileNavigation,
    continuePendingNavigation,
    cancelPendingNavigation,
  };
}
