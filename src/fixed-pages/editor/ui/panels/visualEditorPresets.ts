import type { BlockType } from '@/fixed-pages/editor/session/parser';

export const LATEX_SYMBOLS = [
  { label: '∀', code: '\\forall ' }, { label: '∃', code: '\\exists ' },
  { label: '⟹', code: '\\implies ' }, { label: '∈', code: '\\in ' },
  { label: '≅', code: '\\cong ' }, { label: 'AB', code: '\\overline{AB}' },
  { label: '∠', code: '\\angle ' }, { label: '△', code: '\\triangle ' },
  { label: '⊥', code: '\\perp ' }, { label: '∥', code: '\\parallel ' },
];

export const INLINE_EDITABLE_BLOCKS = new Set<BlockType>([
  'paragraph', 'heading', 'list', 'table', 'note', 'citation', 'definition_box', 'exercise',
]);
