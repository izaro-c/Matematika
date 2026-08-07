import React, { useEffect, useState } from 'react';
import {
  getSelectedPlainText,
  selectionIsInProseSurface,
  wrapSelectionWithTag,
} from './inlineProseOps';

export interface SelectionLinkBubbleProps {
  disabled?: boolean;
  onLinkSelection: () => void;
  onHighlightSelection: () => void;
  onProseMutated?: () => void;
}

/** Floating actions when the user selects text inside a prose surface. */
export function SelectionLinkBubble({
  disabled = false,
  onLinkSelection,
  onHighlightSelection,
  onProseMutated,
}: SelectionLinkBubbleProps) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    if (disabled) return undefined;

    const update = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed || !selectionIsInProseSurface()) {
        setPos(null);
        setText('');
        return;
      }
      const selected = getSelectedPlainText().trim();
      if (!selected) {
        setPos(null);
        return;
      }
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        setPos(null);
        return;
      }
      setText(selected);
      setPos({
        top: rect.top + window.scrollY - 44,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    };

    document.addEventListener('selectionchange', update);
    window.addEventListener('scroll', update, true);
    return () => {
      document.removeEventListener('selectionchange', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [disabled]);

  if (!pos || !text) return null;

  const keep = (handler: () => void) => (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handler();
  };

  return (
    <div
      role="toolbar"
      aria-label="Acciones sobre la selección"
      className="pointer-events-auto fixed z-[90] flex -translate-x-1/2 items-center gap-0.5 rounded-xl border border-carbon/20 bg-lienzo px-1 py-1 shadow-xl font-serif"
      style={{ top: pos.top, left: pos.left }}
      onMouseDown={event => event.preventDefault()}
    >
      <button
        type="button"
        className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-salvia hover:bg-salvia/10"
        onMouseDown={keep(onLinkSelection)}
        title="Enlazar concepto, teorema o definición"
      >
        Enlazar
      </button>
      <button
        type="button"
        className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-terracota hover:bg-terracota/10"
        onMouseDown={keep(onHighlightSelection)}
        title="Resaltar elemento del diagrama"
      >
        Diagrama
      </button>
      <span className="mx-0.5 h-4 w-px bg-carbon/15" />
      <button
        type="button"
        className="rounded-lg px-2 py-1.5 text-xs font-bold hover:bg-carbon/5"
        onMouseDown={keep(() => {
          if (wrapSelectionWithTag('strong')) onProseMutated?.();
        })}
        title="Negrita"
      >
        N
      </button>
      <button
        type="button"
        className="rounded-lg px-2 py-1.5 text-xs italic hover:bg-carbon/5"
        onMouseDown={keep(() => {
          if (wrapSelectionWithTag('em')) onProseMutated?.();
        })}
        title="Cursiva"
      >
        C
      </button>
    </div>
  );
}
