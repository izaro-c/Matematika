import React, { useEffect, useState } from 'react';
import {
  getSelectedPlainText,
  selectionIsInProseSurface,
  wrapSelectionWithTag,
} from './inlineProseOps';
import { Button, Card, IconButton } from '@/fixed-pages/editor/ui/primitives';

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
    <Card className="flex items-center gap-0.5" role="toolbar" aria-label="Acciones sobre la selección" style={{ top: pos.top, left: pos.left }} onMouseDown={event => event.preventDefault()}>
      <Button size="sm" onMouseDown={keep(onLinkSelection)} title="Enlazar concepto, teorema o definición">
        Enlazar
      </Button>
      <Button size="sm" variant="danger" onMouseDown={keep(onHighlightSelection)} title="Resaltar elemento del diagrama">
        Diagrama
      </Button>
      <span className="mx-0.5 h-4 w-px bg-carbon/15" />
      <IconButton size="sm" label="Negrita" onMouseDown={keep(() => {
          if (wrapSelectionWithTag('strong')) onProseMutated?.();
        })}>
        N
      </IconButton>
      <IconButton size="sm" label="Cursiva" onMouseDown={keep(() => {
          if (wrapSelectionWithTag('em')) onProseMutated?.();
        })}>
        C
      </IconButton>
    </Card>
  );
}
