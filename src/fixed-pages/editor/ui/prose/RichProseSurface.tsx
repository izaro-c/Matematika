import React, { useCallback, useEffect, useRef } from 'react';
import { useMathStore } from '@/lib/page-context/MathStoreContext';
import { editableHtmlToMdx, mdxToEditableHtml } from './inlineProseOps';

export interface RichProseSurfaceProps {
  value: string;
  onChange: (mdx: string) => void;
  className?: string;
  placeholder?: string;
  singleLine?: boolean;
  disabled?: boolean;
  surfaceId: string;
  onFocusSurface?: (id: string) => void;
  onEditChip?: (
    raw: string,
    text: string,
    attrs: Record<string, unknown>,
    tag: string,
    event: React.MouseEvent,
  ) => void;
  onEditStepLink?: (step: number, chipElement: HTMLElement) => void;
}

const CHIP_SELECTOR = '[data-mdx="ConceptLink"], [data-mdx="RefLink"], [data-mdx="InteractiveElement"], [data-mdx="ProofStepLink"]';

export function RichProseSurface({
  value,
  onChange,
  className = '',
  placeholder,
  singleLine = false,
  disabled = false,
  surfaceId,
  onFocusSurface,
  onEditChip,
  onEditStepLink,
}: RichProseSurfaceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const focusedRef = useRef(false);
  const lastEmittedRef = useRef(value);
  const mountedRef = useRef(false);

  const syncFromValue = useCallback((mdx: string) => {
    if (!ref.current) return;
    ref.current.innerHTML = mdxToEditableHtml(mdx);
    lastEmittedRef.current = mdx;
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      syncFromValue(value);
      return;
    }
    if (focusedRef.current || value === lastEmittedRef.current) return;
    syncFromValue(value);
  }, [syncFromValue, value]);

  const updateCaretLatexSpans = useCallback(() => {
    if (!ref.current) return;
    const sel = document.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    let activeLatexSpan: HTMLElement | null = null;
    const anchor = sel.anchorNode;
    if (anchor) {
      const el = anchor instanceof Element ? anchor : anchor.parentElement;
      activeLatexSpan = el?.closest('span[data-mdx="latex"]') as HTMLElement | null;
    }

    const allLatexSpans = ref.current.querySelectorAll<HTMLElement>('span[data-mdx="latex"]');
    allLatexSpans.forEach(span => {
      const isCurrentlyEditing = span.classList.contains('is-editing');
      const shouldBeEditing = span === activeLatexSpan;

      if (shouldBeEditing && !isCurrentlyEditing) {
        span.classList.add('is-editing');
        const sourceEl = span.querySelector<HTMLElement>('[data-latex-source="1"]');
        if (sourceEl) {
          const textNode = sourceEl.firstChild || sourceEl;
          const range = document.createRange();
          if (textNode.nodeType === Node.TEXT_NODE) {
            const fullLen = textNode.textContent?.length || 0;
            const cameFromEnd = sel.anchorOffset > 0 || anchor === span.lastChild;
            const offset = cameFromEnd ? Math.max(0, fullLen - 1) : Math.min(1, fullLen);
            range.setStart(textNode, offset);
            range.collapse(true);
          } else {
            range.selectNodeContents(sourceEl);
            range.collapse(true);
          }
          sel.removeAllRanges();
          sel.addRange(range);
        }
      } else if (!shouldBeEditing && isCurrentlyEditing) {
        if (anchor && span.contains(anchor)) {
          const range = document.createRange();
          if (span.nextSibling) {
            range.setStart(span.nextSibling, 0);
          } else if (span.parentNode) {
            range.setStartAfter(span);
          }
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
        span.classList.remove('is-editing');
      }
    });
  }, []);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (focusedRef.current) {
        updateCaretLatexSpans();
      }
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [updateCaretLatexSpans]);

  const emit = () => {
    if (!ref.current) return;
    const mdx = editableHtmlToMdx(ref.current);
    if (mdx === lastEmittedRef.current) return;
    lastEmittedRef.current = mdx;
    onChange(mdx);
  };

  const handleFocus = () => {
    focusedRef.current = true;
    onFocusSurface?.(surfaceId);
    updateCaretLatexSpans();
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && ref.current?.contains(next)) return;
    focusedRef.current = false;
    if (ref.current) {
      const mdx = editableHtmlToMdx(ref.current);
      // Skip no-op blur commits (focus alone must not mark the document dirty).
      if (mdx !== lastEmittedRef.current && mdx !== value) {
        lastEmittedRef.current = mdx;
        onChange(mdx);
      }
      syncFromValue(lastEmittedRef.current);
    }
    updateCaretLatexSpans();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (singleLine && event.key === 'Enter') event.preventDefault();
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
      event.preventDefault();
      document.execCommand('bold', false);
      emit();
    } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'i') {
      event.preventDefault();
      document.execCommand('italic', false);
      emit();
    }
  };

  /** Plain-text paste only — blocks HTML/script injection via clipboard. */
  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    if (!text) return;
    document.execCommand('insertText', false, text);
    emit();
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    updateCaretLatexSpans();
    const chip = (event.target as HTMLElement).closest(CHIP_SELECTOR) as HTMLElement | null;
    if (!chip) return;
    const tag = chip.dataset.mdx ?? '';
    if (tag === 'ProofStepLink') {
      event.preventDefault();
      const currentStep = parseInt(chip.dataset.step || '1', 10);
      if (onEditStepLink) {
        onEditStepLink(isNaN(currentStep) ? 1 : currentStep, chip);
      }
      // Si no hay onEditStepLink el chip no es interactivo (solo lectura)
      return;
    }
    if (!onEditChip) return;
    event.preventDefault();
    const attrs = JSON.parse(decodeURIComponent(chip.dataset.attrs || '{}')) as Record<string, unknown>;
    const raw = chip.dataset.raw
      ? decodeURIComponent(chip.dataset.raw)
      : editableHtmlToMdx(chip);
    onEditChip(raw, chip.textContent ?? '', attrs, tag, event);
  };

  const setVariable = useMathStore(state => state.setVariable);

  useEffect(() => {
    const handleOver = (e: Event) => {
      const targetEl = e.target as HTMLElement | null;
      const chip = targetEl?.closest?.(CHIP_SELECTOR) as HTMLElement | null;
      if (!chip) return;
      try {
        const attrs = JSON.parse(decodeURIComponent(chip.dataset.attrs || '{}')) as Record<string, unknown>;
        const target = String(attrs.targetId || attrs.target || attrs.highlightTarget || chip.dataset.step || '');
        if (target) {
          setVariable('highlight', target);
        }
      } catch {
        // ignore
      }
    };

    const handleOut = (e: Event) => {
      const targetEl = e.target as HTMLElement | null;
      const chip = targetEl?.closest?.(CHIP_SELECTOR) as HTMLElement | null;
      if (!chip) return;
      setVariable('highlight', null);
    };

    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);
    document.addEventListener('mouseenter', handleOver, true);
    document.addEventListener('mouseleave', handleOut, true);
    return () => {
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
      document.removeEventListener('mouseenter', handleOver, true);
      document.removeEventListener('mouseleave', handleOut, true);
    };
  }, [setVariable]);

  return (
    <div
      ref={ref}
      id={surfaceId}
      role="textbox"
      aria-multiline={!singleLine}
      aria-disabled={disabled || undefined}
      contentEditable={!disabled}
      suppressContentEditableWarning
      data-placeholder={placeholder}
      data-prose-surface="true"
      onInput={emit}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyUp={updateCaretLatexSpans}
      onMouseUp={updateCaretLatexSpans}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onClick={handleClick}
      className={`prose prose-mora max-w-none font-serif text-sm leading-relaxed text-carbon outline-none focus:outline-none [&:empty]:before:pointer-events-none [&:empty]:before:text-carbon/30 [&:empty]:before:content-[attr(data-placeholder)] ${className}`}
    />
  );
}
