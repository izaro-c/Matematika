import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function visibleFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter(element => !element.hidden && element.getAttribute('aria-hidden') !== 'true');
}

/** Keeps keyboard focus inside an editor modal and restores it when the modal closes. */
export function useModalFocus<T extends HTMLElement>(
  open: boolean,
  onRequestClose: () => void,
  initialFocusRef?: RefObject<HTMLElement | null>,
  escapeDisabled = false,
): RefObject<T | null> {
  const containerRef = useRef<T>(null);
  const closeRef = useRef(onRequestClose);
  const escapeDisabledRef = useRef(escapeDisabled);

  useEffect(() => {
    closeRef.current = onRequestClose;
    escapeDisabledRef.current = escapeDisabled;
  }, [escapeDisabled, onRequestClose]);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = requestAnimationFrame(() => {
      const container = containerRef.current;
      const target = initialFocusRef?.current ?? (container ? visibleFocusableElements(container)[0] : null) ?? container;
      target?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;
      if (event.key === 'Escape' && !escapeDisabledRef.current) {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = visibleFocusableElements(container);
      if (focusable.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !container.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !container.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
      previous?.focus();
    };
  }, [initialFocusRef, open]);

  return containerRef;
}
