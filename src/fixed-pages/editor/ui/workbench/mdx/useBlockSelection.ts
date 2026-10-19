import { useCallback, useEffect, useRef, useState } from 'react';
import type { Block } from '@/fixed-pages/editor/session/parser';

interface Options {
  urlBlockId: string | null;
  setUrlBlockId: (id: string | null) => void;
  blocks: Block[];
  loading: boolean;
}

/** Bloque en edición, sincronizado con `bloque=` de la URL, y el resalte al saltar a un aviso. */
export function useBlockSelection({ urlBlockId, setUrlBlockId, blocks, loading }: Options) {
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [highlightedBlockId, setHighlightedBlockId] = useState<string | null>(null);

  // Cada par usa una referencia con el último valor acordado para no rebotar.
  const lastUrlBlockRef = useRef<string | null>(null);
  const pendingBlockScrollRef = useRef<string | null>(null);
  useEffect(() => {
    if (urlBlockId === lastUrlBlockRef.current) return;
    lastUrlBlockRef.current = urlBlockId;
    if (urlBlockId === editingBlockId) return;
    setEditingBlockId(urlBlockId);
    pendingBlockScrollRef.current = urlBlockId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlBlockId]);
  useEffect(() => {
    if (editingBlockId === lastUrlBlockRef.current) return;
    lastUrlBlockRef.current = editingBlockId;
    setUrlBlockId(editingBlockId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingBlockId]);
  // Al recargar con `bloque=` el documento llega después: desplazarse cuando exista.
  useEffect(() => {
    const target = pendingBlockScrollRef.current;
    if (!target || loading) return;
    const element = document.getElementById(`block-${target}`) || document.querySelector(`[data-block-id="${target}"]`);
    if (!element) return;
    pendingBlockScrollRef.current = null;
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [blocks, loading]);

  const focusBlock = useCallback((targetBlockId: string) => {
    setEditingBlockId(targetBlockId);
    setHighlightedBlockId(targetBlockId);
    setTimeout(() => {
      const element = document.getElementById(`block-${targetBlockId}`) || document.querySelector(`[data-block-id="${targetBlockId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (element as HTMLElement).focus?.();
      }
    }, 50);
    setTimeout(() => {
      setHighlightedBlockId(null);
    }, 3500);
  }, []);

  return { editingBlockId, setEditingBlockId, highlightedBlockId, focusBlock };
}
