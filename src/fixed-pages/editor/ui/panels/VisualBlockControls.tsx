import React from 'react';
import { useI18n } from '@/i18n';

interface BlockActionsProps {
  blockId: string;
  index: number;
  blockCount: number;
  moveBlock: (from: number, to: number) => void;
  duplicateBlock: (id: string) => void;
  removeBlock: (id: string) => void;
}

export const BlockActions: React.FC<BlockActionsProps> = ({ blockId, index, blockCount, moveBlock, duplicateBlock, removeBlock }) => {
  const { t } = useI18n();
  return (
  <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded border border-carbon/10 bg-lienzo/95 p-1 opacity-0 shadow-sm transition-opacity group-hover/block:opacity-100 group-focus-within/block:opacity-100">
    <button type="button" disabled={index === 0} onClick={() => moveBlock(index, index - 1)} className="flex h-6 w-6 cursor-pointer items-center justify-center rounded border border-carbon/20 bg-lienzo text-[10px] text-carbon hover:bg-carbon/5 disabled:opacity-30" title={t('editor.visual.blockUp')}>↑</button>
    <button type="button" disabled={index === blockCount - 1} onClick={() => moveBlock(index, index + 1)} className="flex h-6 w-6 cursor-pointer items-center justify-center rounded border border-carbon/20 bg-lienzo text-[10px] text-carbon hover:bg-carbon/5 disabled:opacity-30" title={t('editor.visual.blockDown')}>↓</button>
    <button type="button" onClick={() => duplicateBlock(blockId)} className="flex h-6 w-6 cursor-pointer items-center justify-center rounded border border-pavo/30 bg-lienzo text-[10px] text-pavo hover:bg-pavo/10" title={t('editor.visual.blockDuplicate')}>⧉</button>
    <button type="button" onClick={() => removeBlock(blockId)} className="flex h-6 w-6 cursor-pointer items-center justify-center rounded bg-terracota text-[10px] text-lienzo hover:bg-terracota/80" title={t('editor.visual.blockDelete')}>✕</button>
  </div>
  );
};

interface BlockInsertGapProps {
  label: string;
  onOpen: () => void;
}

/** Hueco entre bloques: un filete que muestra ＋ al acercarse y abre la paleta en esa posición. */
export const BlockInsertGap: React.FC<BlockInsertGapProps> = ({ label, onOpen }) => (
  <div className="ed-insert-gap">
    <button type="button" className="ed-insert-gap__button" aria-label={label} title={label} onClick={onOpen}>
      <span aria-hidden="true">＋</span>
    </button>
  </div>
);

interface BlockDragHandleProps {
  label: string;
  section: boolean;
  onDragStart: (event: React.DragEvent<HTMLButtonElement>) => void;
  onDragEnd: () => void;
}

/** Asa en el margen: arrastra el bloque o, en un título, la sección entera. */
export const BlockDragHandle: React.FC<BlockDragHandleProps> = ({ label, section, onDragStart, onDragEnd }) => (
  <button
    type="button"
    draggable
    tabIndex={-1}
    aria-label={label}
    title={label}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    className={`ed-drag-handle${section ? ' ed-drag-handle--section' : ''}`}
  >
    <span aria-hidden="true">{section ? '§' : '⠿'}</span>
  </button>
);
