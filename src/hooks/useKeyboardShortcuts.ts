import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useNavigationStore } from '../store/NavigationStore';
import { useGlossaryStore } from '../store/GlossaryStore';

function isEditing(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  if ((el as HTMLElement).isContentEditable) return true;
  return false;
}

const NAV_ACTIONS: Record<string, string> = {
  h: '/',
  g: '/grafo',
  a: '/axiomas',
  e: '/editor',
  s: '/diccionario',
};

export function useKeyboardShortcuts() {
  const [, navigate] = useLocation();
  const { isSearchOpen, toggleSearch, closeSearch } = useNavigationStore();
  const { closeTerm, activeTerm } = useGlossaryStore();
  const gRef = useRef<{ timer: ReturnType<typeof setTimeout> | null }>({ timer: null });

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (isEditing()) return;

      if (e.key === 'Escape') {
        if (isSearchOpen) {
          closeSearch();
          e.preventDefault();
          return;
        }
        if (activeTerm) {
          closeTerm();
          e.preventDefault();
          return;
        }
        return;
      }

      if (e.key === '?') {
        if (!e.shiftKey) return;
        toggleSearch();
        e.preventDefault();
        return;
      }

      if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
        if (gRef.current.timer) {
          clearTimeout(gRef.current.timer);
          gRef.current.timer = null;
        }
        gRef.current.timer = setTimeout(() => {
          gRef.current.timer = null;
        }, 800);

        const handler = (e2: KeyboardEvent) => {
          if (isEditing()) return;
          window.removeEventListener('keydown', handler);
          if (gRef.current.timer) {
            clearTimeout(gRef.current.timer);
            gRef.current.timer = null;
          }
          const action = NAV_ACTIONS[e2.key];
          if (action) {
            navigate(action);
            e2.preventDefault();
          }
        };
        window.addEventListener('keydown', handler);
        e.preventDefault();
        return;
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigate, isSearchOpen, closeSearch, activeTerm, closeTerm, toggleSearch]);
}
