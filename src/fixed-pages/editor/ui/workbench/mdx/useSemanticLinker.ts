import { useCallback, useRef, useState } from 'react';
import type { Block } from '@/fixed-pages/editor/session/parser';
import { editableHtmlToMdx, insertHtmlAtSelection, mdxToEditableHtml } from '@/fixed-pages/editor/ui/prose/inlineProseOps';

type UpdateBlock = (id: string, content: string, metadata?: Block['metadata']) => void;

interface LinkerState {
  isOpen: boolean;
  blockId: string;
  selectedText: string;
  selectionStart: number;
  selectionEnd: number;
  editingMarkup?: string;
  editingTag?: string;
  initialAttrs?: Record<string, unknown>;
}

const CLOSED: LinkerState = {
  isOpen: false,
  blockId: '',
  selectedText: '',
  selectionStart: 0,
  selectionEnd: 0,
};

/** Estado del selector de enlaces semánticos y la inserción del marcado resultante en el bloque. */
export function useSemanticLinker(blocks: Block[], updateBlock: UpdateBlock) {
  const linkerRangeRef = useRef<Range | null>(null);
  const [linkerState, setLinkerState] = useState<LinkerState>(CLOSED);

  const closeLinker = useCallback(() => setLinkerState(prev => ({ ...prev, isOpen: false })), []);

  const openLinker = useCallback((
    blockId: string,
    rawMarkup: string | undefined,
    text: string | undefined,
    attrs: Record<string, unknown> | undefined,
    tag: string | undefined,
  ) => {
    const targetBlock = blocks.find(b => b.id === blockId);
    const selectedText = text || window.getSelection()?.toString() || '';
    const sel = window.getSelection();
    linkerRangeRef.current = sel?.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
    const fromContent = targetBlock && selectedText
      ? targetBlock.content.indexOf(selectedText)
      : -1;
    setLinkerState({
      isOpen: true,
      blockId,
      selectedText,
      editingMarkup: rawMarkup || undefined,
      editingTag: tag,
      initialAttrs: attrs,
      selectionStart: fromContent >= 0 ? fromContent : 0,
      selectionEnd: fromContent >= 0 ? fromContent + selectedText.length : 0,
    });
  }, [blocks]);

  const handleLinkCreated = (markup: string) => {
    if (!linkerState.blockId) {
      closeLinker();
      return;
    }

    // Restore the selection captured before the linker stole focus.
    if (linkerRangeRef.current) {
      try {
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(linkerRangeRef.current);
      } catch {
        linkerRangeRef.current = null;
      }
    }
    // Only attempt selection insertion for brand new links.
    // When editing or removing an existing link (editingMarkup is defined), insertHtmlAtSelection must be skipped.
    if (!linkerState.editingMarkup && insertHtmlAtSelection(mdxToEditableHtml(markup))) {
      linkerRangeRef.current = null;
      const active = document.activeElement as HTMLElement | null;
      const surface = active?.closest?.('[data-prose-surface="true"]') as HTMLElement | null
        ?? document.getElementById(`${linkerState.blockId}-body`)
        ?? document.getElementById(`${linkerState.blockId}-title`)
        ?? document.getElementById(`prose-${linkerState.blockId}`);
      if (surface) {
        const mdx = editableHtmlToMdx(surface);
        const targetBlock = blocks.find(b => b.id === linkerState.blockId);
        if (targetBlock?.type === 'demonstration') {
          const baseStep = {
            ...(Array.isArray(targetBlock.metadata?.steps) ? targetBlock.metadata.steps[0] as object : {}),
            number: targetBlock.metadata?.number ?? 1,
            title: targetBlock.metadata?.title ?? '',
            target: targetBlock.metadata?.target,
            body: targetBlock.content,
          };
          if (surface.id.endsWith('-title')) {
            updateBlock(linkerState.blockId, targetBlock.content, {
              ...targetBlock.metadata,
              title: mdx,
              steps: [{ ...baseStep, title: mdx }],
            });
          } else {
            updateBlock(linkerState.blockId, mdx, {
              ...targetBlock.metadata,
              steps: [{ ...baseStep, body: mdx }],
            });
          }
        } else if (targetBlock) {
          updateBlock(linkerState.blockId, mdx, targetBlock.metadata);
        }
      }
      closeLinker();
      return;
    }
    linkerRangeRef.current = null;

    const targetBlock = blocks.find(b => b.id === linkerState.blockId);
    if (!targetBlock) {
      closeLinker();
      return;
    }

    if (targetBlock.type === 'demonstration' && linkerState.editingMarkup && targetBlock.metadata?.title?.includes(linkerState.editingMarkup)) {
      const nextTitle = targetBlock.metadata.title.replace(linkerState.editingMarkup, markup);
      const baseStep = {
        ...(Array.isArray(targetBlock.metadata?.steps) ? targetBlock.metadata.steps[0] as object : {}),
        number: targetBlock.metadata?.number ?? 1,
        title: nextTitle,
        target: targetBlock.metadata?.target,
        body: targetBlock.content,
      };
      updateBlock(linkerState.blockId, targetBlock.content, {
        ...targetBlock.metadata,
        title: nextTitle,
        steps: [{ ...baseStep, title: nextTitle }],
      });
      closeLinker();
      return;
    }

    let nextContent: string;
    if (linkerState.editingMarkup && targetBlock.content.includes(linkerState.editingMarkup)) {
      nextContent = targetBlock.content.replace(linkerState.editingMarkup, markup);
    } else if (
      typeof linkerState.selectionStart === 'number'
      && typeof linkerState.selectionEnd === 'number'
      && linkerState.selectionEnd > linkerState.selectionStart
    ) {
      nextContent = `${targetBlock.content.slice(0, linkerState.selectionStart)}${markup}${targetBlock.content.slice(linkerState.selectionEnd)}`;
    } else if (linkerState.selectedText && targetBlock.content.includes(linkerState.selectedText)) {
      nextContent = targetBlock.content.replace(linkerState.selectedText, markup);
    } else {
      const gap = targetBlock.content.trim() ? ' ' : '';
      nextContent = `${targetBlock.content}${gap}${markup}`;
    }

    updateBlock(linkerState.blockId, nextContent, targetBlock.type === 'demonstration'
      ? {
          ...targetBlock.metadata,
          steps: [{
            ...(Array.isArray(targetBlock.metadata?.steps) ? targetBlock.metadata.steps[0] : {}),
            number: targetBlock.metadata?.number ?? 1,
            title: targetBlock.metadata?.title ?? '',
            target: targetBlock.metadata?.target,
            body: nextContent,
          }],
        }
      : targetBlock.metadata);

    closeLinker();
  };

  return { linkerState, openLinker, closeLinker, handleLinkCreated };
}
