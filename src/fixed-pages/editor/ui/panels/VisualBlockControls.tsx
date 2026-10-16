import React, { useState } from 'react';
import { useI18n } from '@/i18n';
import type { BlockType } from '@/fixed-pages/editor/session/parser';

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

const BLOCK_LABEL_KEYS = {
  paragraph: 'editor.visual.blockParagraph',
  heading: 'editor.visual.blockHeading',
  list: 'editor.visual.blockList',
  table: 'editor.visual.blockTable',
  formula: 'editor.visual.blockFormula',
  separator: 'editor.visual.blockSeparator',
  note: 'editor.visual.blockNote',
  citation: 'editor.visual.blockCitation',
  definitionBox: 'editor.visual.blockDefinitionBox',
} as const;

interface InsertOption {
  type: BlockType;
  labelKey: 'paragraph' | 'heading' | 'list' | 'table' | 'formula' | 'separator' | 'note' | 'citation' | 'definitionBox';
  className: string;
}

const INSERT_OPTIONS: InsertOption[] = [
  { type: 'paragraph', labelKey: 'paragraph', className: 'text-canela hover:bg-canela/10' },
  { type: 'heading', labelKey: 'heading', className: 'text-mora hover:bg-mora/10' },
  { type: 'list', labelKey: 'list', className: 'text-pavo hover:bg-pavo/10' },
  { type: 'table', labelKey: 'table', className: 'text-ocre hover:bg-ocre/10' },
  { type: 'formula', labelKey: 'formula', className: 'text-ocre hover:bg-ocre/10' },
  { type: 'separator', labelKey: 'separator', className: 'text-carbon hover:bg-carbon/10' },
  { type: 'note', labelKey: 'note', className: 'text-ocre hover:bg-ocre/10' },
  { type: 'citation', labelKey: 'citation', className: 'text-canela hover:bg-canela/10' },
  { type: 'definition_box', labelKey: 'definitionBox', className: 'text-terracota hover:bg-terracota/10' },
];

interface BlockInsertMenuProps {
  index: number;
  addBlock: (index: number, type: BlockType) => void;
  openDiagramBuilder: (index: number) => void;
}

export const BlockInsertMenu: React.FC<BlockInsertMenuProps> = ({ index, addBlock, openDiagramBuilder }) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return <div className="relative z-20 mx-auto mt-3 flex w-full justify-center opacity-0 transition-opacity group-hover/block:opacity-100 group-focus-within/block:opacity-100">
    <button type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} className="rounded-full border border-carbon/20 bg-lienzo px-3 py-1 text-[10px] font-bold text-carbon/55 shadow-sm hover:border-canela/30 hover:text-canela">{t('editor.visual.insertHere')}</button>
    {open && <div className="absolute top-full mt-2 grid w-80 grid-cols-2 gap-1 rounded border border-carbon/20 bg-lienzo p-2 shadow-xl sm:grid-cols-3">
      {INSERT_OPTIONS.map(option => <button key={option.type} type="button" onClick={() => { addBlock(index + 1, option.type); setOpen(false); }} className={`rounded px-2 py-2 text-left font-serif text-[10px] font-bold ${option.className}`}>{t(BLOCK_LABEL_KEYS[option.labelKey])}</button>)}
      <button type="button" onClick={() => { openDiagramBuilder(index + 1); setOpen(false); }} className="rounded px-2 py-2 text-left font-serif text-[10px] font-bold text-pavo hover:bg-pavo/10">{t('editor.visual.blockDiagram')}</button>
    </div>}
  </div>;
};
