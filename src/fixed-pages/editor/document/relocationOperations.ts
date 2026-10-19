import type { DocumentMutationPlan, EditorDocument, ProjectedBlock, SourceEdit, SourceRange } from './documentTypes';
import { mutationPlan, mutationPreview, siblingGap, structuralOperationId } from './structuralOperations';

/**
 * Drag-and-drop moves: the moving source is cut and pasted byte for byte, so a block
 * or a whole section can also cross into (or out of) a transparent container such as
 * <StepSection>. Only the gaps next to the cut and the paste are touched.
 */

/** A block or a nested container, as it sits among its siblings. */
export interface SiblingUnit {
  id: string;
  kind: 'block' | 'container';
  range: SourceRange;
  /** Heading depth, when the unit is a heading block. */
  headingDepth?: number;
}

export type RelocationPlacement = 'before' | 'after';

interface Insertion {
  offset: number;
  parentId: string;
  placement: RelocationPlacement;
  /** Position among the siblings of `parentId`, counted before the cut. */
  index: number;
}

function headingDepth(block: ProjectedBlock): number | undefined {
  if (block.kind !== 'editable' || block.blockType !== 'heading') return undefined;
  const depth = (block.data as { depth?: unknown } | undefined)?.depth;
  return typeof depth === 'number' ? depth : undefined;
}

export function siblingUnits(document: EditorDocument, parentId: string): SiblingUnit[] {
  const blocks: SiblingUnit[] = document.bodyBlocks
    .filter(block => block.parentId === parentId)
    .map(block => ({ id: block.id, kind: 'block', range: block.location.range, headingDepth: headingDepth(block) }));
  const containers: SiblingUnit[] = document.containers
    .filter(container => container.parentId === parentId && container.range)
    .map(container => ({ id: container.id, kind: 'container', range: container.range as SourceRange }));
  return [...blocks, ...containers].sort((left, right) => left.range.start - right.range.start);
}

function findBlock(document: EditorDocument, blockId: string): ProjectedBlock {
  const block = document.bodyBlocks.find(candidate => candidate.id === blockId);
  if (!block) throw new Error(`Unknown block: ${blockId}`);
  return block;
}

/** Last unit of the section opened by the heading at `first` (or `first` itself for any other unit). */
function sectionLast(units: SiblingUnit[], first: number, depth = units[first].headingDepth): number {
  if (depth === undefined) return first;
  let last = first;
  while (last + 1 < units.length) {
    const next = units[last + 1].headingDepth;
    if (next !== undefined && next <= depth) break;
    last += 1;
  }
  return last;
}

function headingSection(document: EditorDocument, headingId: string) {
  const heading = findBlock(document, headingId);
  if (headingDepth(heading) === undefined) throw new Error(`Block is not a heading: ${headingId}`);
  const units = siblingUnits(document, heading.parentId);
  const first = units.findIndex(unit => unit.id === headingId);
  return { parentId: heading.parentId, units, first, last: sectionLast(units, first) };
}

/** Every block that moves with a heading: the heading and what follows it up to the next heading of the same or higher level. */
export function sectionBlockIds(document: EditorDocument, headingId: string): string[] {
  const { units, first, last } = headingSection(document, headingId);
  const start = units[first].range.start;
  const end = units[last].range.end;
  return document.bodyBlocks
    .filter(block => block.location.range.start >= start && block.location.range.end <= end)
    .map(block => block.id);
}

function anchorInsertion(document: EditorDocument, anchorId: string, placement: RelocationPlacement): Insertion {
  const anchor = findBlock(document, anchorId);
  const index = siblingUnits(document, anchor.parentId).findIndex(unit => unit.id === anchorId);
  return {
    offset: placement === 'before' ? anchor.location.range.start : anchor.location.range.end,
    parentId: anchor.parentId,
    placement,
    index: placement === 'before' ? index : index + 1,
  };
}

function unitInsertion(parentId: string, units: SiblingUnit[], index: number, placement: RelocationPlacement): Insertion {
  const unit = units[index];
  return {
    offset: placement === 'before' ? unit.range.start : unit.range.end,
    parentId,
    placement,
    index: placement === 'before' ? index : index + 1,
  };
}

function relocateUnits(
  document: EditorDocument,
  parentId: string,
  first: number,
  last: number,
  insertion: Insertion,
  label: string,
): DocumentMutationPlan {
  const units = siblingUnits(document, parentId);
  const moving = { start: units[first].range.start, end: units[last].range.end };
  if (insertion.parentId === parentId && insertion.index >= first && insertion.index <= last + 1) {
    throw new Error('Block is already at the requested position');
  }
  if (insertion.offset >= moving.start && insertion.offset <= moving.end) {
    throw new Error('A block cannot be moved inside itself');
  }
  const previous = units[first - 1];
  const next = units[last + 1];
  const container = document.containers.find(candidate => candidate.id === parentId);
  if (!previous && !next && container?.kind === 'jsx-container' && insertion.parentId !== parentId) {
    throw new Error(`Moving every block out of <${container.name}> would leave it empty`);
  }
  let cut: SourceRange = moving;
  if (next) cut = { start: moving.start, end: next.range.start };
  else if (previous) cut = { start: previous.range.end, end: moving.end };

  const movingSource = document.source.slice(moving.start, moving.end);
  const gap = siblingGap(document, insertion.parentId);
  const id = structuralOperationId(document, 'move-block', `${units[first].id}-${insertion.offset}`);
  const edits: SourceEdit[] = [
    {
      operationId: `${id}:cut`,
      blockId: units[first].id,
      range: cut,
      expectedSource: document.source.slice(cut.start, cut.end),
      replacement: '',
      reason: `Cut ${label} from ${parentId}`,
    },
    {
      operationId: `${id}:paste`,
      blockId: insertion.parentId,
      range: { start: insertion.offset, end: insertion.offset },
      expectedSource: '',
      replacement: insertion.placement === 'before' ? `${movingSource}${gap}` : `${gap}${movingSource}`,
      reason: `Paste ${label} into ${insertion.parentId}`,
    },
  ];
  return mutationPlan(document, 'move-block', id, edits, mutationPreview(
    'Traslado de bloques',
    `Se trasladarán ${last - first + 1} unidades de ${parentId} a ${insertion.parentId} copiando su código byte a byte.`,
    edits,
  ));
}

/** Moves one block next to `anchorId`, which may live in another container. */
export function planBlockRelocation(
  document: EditorDocument,
  blockId: string,
  anchorId: string,
  placement: RelocationPlacement,
): DocumentMutationPlan {
  const block = findBlock(document, blockId);
  if (block.kind !== 'editable') throw new Error(`Source-only block cannot be mutated visually: ${blockId}`);
  const index = siblingUnits(document, block.parentId).findIndex(unit => unit.id === blockId);
  return relocateUnits(document, block.parentId, index, index, anchorInsertion(document, anchorId, placement), `block ${blockId}`);
}

/** Moves a heading with its whole section next to `anchorId`. */
export function planSectionRelocation(
  document: EditorDocument,
  headingId: string,
  anchorId: string,
  placement: RelocationPlacement,
): DocumentMutationPlan {
  const { parentId, first, last } = headingSection(document, headingId);
  return relocateUnits(document, parentId, first, last, anchorInsertion(document, anchorId, placement), `section ${headingId}`);
}

/** Swaps a section with the previous or next section of the same or higher level. */
export function planSectionStep(document: EditorDocument, headingId: string, direction: -1 | 1): DocumentMutationPlan {
  const { parentId, units, first, last } = headingSection(document, headingId);
  const depth = units[first].headingDepth;
  if (direction < 0) {
    if (first === 0) throw new Error('Section is already the first one');
    let target = 0;
    for (let index = first - 1; index >= 0; index -= 1) {
      const candidate = units[index].headingDepth;
      if (candidate !== undefined && depth !== undefined && candidate <= depth) { target = index; break; }
    }
    return relocateUnits(document, parentId, first, last, unitInsertion(parentId, units, target, 'before'), `section ${headingId}`);
  }
  if (last + 1 >= units.length) throw new Error('Section is already the last one');
  const nextLast = sectionLast(units, last + 1, depth);
  return relocateUnits(document, parentId, first, last, unitInsertion(parentId, units, nextLast, 'after'), `section ${headingId}`);
}
