import React from 'react';
import { useI18n } from '@/i18n';
import { IconButton } from '@/fixed-pages/editor/ui/primitives';

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
    <IconButton size="sm" label={t('editor.visual.blockUp')} disabled={index === 0} onClick={() => moveBlock(index, index - 1)}>↑</IconButton>
    <IconButton size="sm" label={t('editor.visual.blockDown')} disabled={index === blockCount - 1} onClick={() => moveBlock(index, index + 1)}>↓</IconButton>
    <IconButton size="sm" label={t('editor.visual.blockDuplicate')} onClick={() => duplicateBlock(blockId)}>⧉</IconButton>
    <IconButton size="sm" label={t('editor.visual.blockDelete')} onClick={() => removeBlock(blockId)}>✕</IconButton>
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
