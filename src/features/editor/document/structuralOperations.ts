import { applySourceEdits } from './applySourceEdits';
import { serializeRegisteredBlock } from './blockRegistry';
import type {
  DocumentMutationPlan,
  EditableBlock,
  EditorDocument,
  MutationPreview,
  ProjectedBlock,
  SourceEdit,
  SourceRange,
} from './documentTypes';
import { parseEditorDocument } from './parseEditorDocument';
import { validateProjectedMetadata } from './metadataProjection';

function editableBlock(document: EditorDocument, blockId: string): EditableBlock {
  const block = document.bodyBlocks.find(candidate => candidate.id === blockId);
  if (!block) throw new Error(`Unknown block: ${blockId}`);
  if (block.kind !== 'editable') throw new Error(`Source-only block cannot be mutated visually: ${blockId}`);
  return block;
}

function siblings(document: EditorDocument, parentId: string): ProjectedBlock[] {
  return document.bodyBlocks
    .filter(block => block.parentId === parentId)
    .sort((left, right) => left.location.range.start - right.location.range.start);
}

function operationId(document: EditorDocument, kind: DocumentMutationPlan['kind'], suffix: string): string {
  return `${kind}-${suffix}-${document.sourceFingerprint}`;
}

function affectedRange(edits: SourceEdit[]): SourceRange {
  return {
    start: Math.min(...edits.map(edit => edit.range.start)),
    end: Math.max(...edits.map(edit => edit.range.end)),
  };
}

function preview(
  title: string,
  summary: string,
  edits: SourceEdit[],
  requiresReview: boolean,
): MutationPreview {
  return {
    title,
    summary,
    originalSnippet: edits.map(edit => edit.expectedSource).join('\n⋯\n'),
    candidateSnippet: edits.map(edit => edit.replacement).join('\n⋯\n'),
    affectedRange: affectedRange(edits),
    requiresReview,
  };
}

function plan(
  document: EditorDocument,
  kind: DocumentMutationPlan['kind'],
  id: string,
  edits: SourceEdit[],
  mutationPreview: MutationPreview,
): DocumentMutationPlan {
  return {
    operationId: id,
    kind,
    baseFingerprint: document.sourceFingerprint,
    edits,
    preview: mutationPreview,
  };
}

function lineEnding(source: string): '\r\n' | '\n' {
  return source.includes('\r\n') ? '\r\n' : '\n';
}

function defaultGap(document: EditorDocument, parentId: string): string {
  const list = siblings(document, parentId);
  for (let index = 0; index < list.length - 1; index += 1) {
    const gap = document.source.slice(list[index].location.range.end, list[index + 1].location.range.start);
    if (/^\s+$/.test(gap)) return gap;
  }
  const eol = lineEnding(document.source);
  return `${eol}${eol}`;
}

function rangeWithAdjacentGap(list: Array<{ location: { range: SourceRange } }>, index: number): SourceRange {
  const block = list[index];
  const next = list[index + 1];
  if (next) return { start: block.location.range.start, end: next.location.range.start };
  const previous = list[index - 1];
  if (previous) return { start: previous.location.range.end, end: block.location.range.end };
  return block.location.range;
}

function assertMetadataIdentityPreserved(before: EditorDocument, after: EditorDocument): void {
  const beforeId = before.metadata.value?.id;
  const afterId = after.metadata.value?.id;
  if (typeof beforeId === 'string' && afterId !== beforeId) {
    throw new Error('Content ID is immutable and cannot be changed by the MDX engine');
  }
}

export function applyMutationPlan(document: EditorDocument, mutation: DocumentMutationPlan): EditorDocument {
  if (mutation.baseFingerprint !== document.sourceFingerprint) throw new Error('Stale document revision');
  if (mutation.edits.some(edit => !edit.operationId.startsWith(mutation.operationId))) {
    throw new Error('Mutation contains an edit from another operation');
  }
  const applied = applySourceEdits(document.source, mutation.edits);
  if (!applied.success || applied.output === undefined) throw new Error(applied.error ?? 'Mutation failed');
  const candidate = parseEditorDocument(applied.output);
  if (candidate.compatibility === 'unsupported') throw new Error('Mutation result is not valid project MDX');
  assertMetadataIdentityPreserved(document, candidate);
  if (mutation.kind === 'update-metadata' && !candidate.metadata.schemaValid) {
    const reason = candidate.diagnostics
      .filter(diagnostic => diagnostic.panel === 'metadata')
      .map(diagnostic => diagnostic.message)
      .join(' ');
    throw new Error(`Metadata update violates the authoritative schema. ${reason}`.trim());
  }
  return candidate;
}

export function planBlockReplacement(
  document: EditorDocument,
  blockId: string,
  replacement: string,
): DocumentMutationPlan {
  const block = editableBlock(document, blockId);
  const id = operationId(document, 'replace-block', blockId);
  const edits: SourceEdit[] = [{
    operationId: id,
    blockId,
    range: block.editRange,
    expectedSource: block.originalSource,
    replacement,
    reason: `Localized edit of ${block.blockType}`,
  }];
  return plan(document, 'replace-block', id, edits, preview(
    'Edición localizada de bloque',
    `Solo cambia el rango editable de ${blockId}; el envelope y los demás bloques quedan intactos.`,
    edits,
    false,
  ));
}

export interface InsertBlockInput {
  blockType: string;
  index: number;
  parentId?: string;
  content?: string;
  metadata?: Record<string, unknown>;
}

export function planBlockInsertion(document: EditorDocument, input: InsertBlockInput): DocumentMutationPlan {
  const globalTarget = document.bodyBlocks[input.index];
  const parentId = input.parentId ?? globalTarget?.parentId ?? 'container-root';
  const container = document.containers.find(candidate => candidate.id === parentId);
  if (!container) throw new Error(`Unknown block container: ${parentId}`);
  const list = siblings(document, parentId);
  let localIndex = list.length;
  if (input.parentId) localIndex = Math.max(0, Math.min(input.index, list.length));
  else if (globalTarget) localIndex = list.findIndex(block => block.id === globalTarget.id);
  const source = serializeRegisteredBlock(input.blockType, input);
  const gap = defaultGap(document, parentId);
  let offset: number;
  let replacement: string;
  if (list.length === 0) {
    offset = container.contentRange.start;
    replacement = container.kind === 'jsx-container' ? `${gap}${source}${gap}` : source;
  } else if (localIndex < list.length) {
    offset = list[Math.max(0, localIndex)].location.range.start;
    replacement = `${source}${gap}`;
  } else {
    offset = list[list.length - 1].location.range.end;
    replacement = `${gap}${source}`;
  }
  const id = operationId(document, 'insert-block', `${parentId}-${offset}`);
  const edits: SourceEdit[] = [{
    operationId: id,
    blockId: parentId,
    range: { start: offset, end: offset },
    expectedSource: '',
    replacement,
    reason: `Insert registered ${input.blockType} block`,
  }];
  return plan(document, 'insert-block', id, edits, preview(
    'Inserción de bloque registrado',
    `Se insertará un bloque ${input.blockType} en ${parentId}; no se reserializa el documento.`,
    edits,
    false,
  ));
}

export function planBlockDeletion(document: EditorDocument, blockId: string): DocumentMutationPlan {
  const block = editableBlock(document, blockId);
  const list = siblings(document, block.parentId);
  const index = list.findIndex(candidate => candidate.id === block.id);
  const range = rangeWithAdjacentGap(list, index);
  const id = operationId(document, 'delete-block', blockId);
  const edits: SourceEdit[] = [{
    operationId: id,
    blockId,
    range,
    expectedSource: document.source.slice(range.start, range.end),
    replacement: '',
    reason: `Delete registered ${block.blockType} block`,
  }];
  return plan(document, 'delete-block', id, edits, preview(
    'Borrado de bloque',
    `Se eliminará ${blockId} y únicamente su separador de espacio adyacente.`,
    edits,
    true,
  ));
}

export function planBlockDuplication(document: EditorDocument, blockId: string): DocumentMutationPlan {
  const block = editableBlock(document, blockId);
  const blockSource = document.source.slice(block.location.range.start, block.location.range.end);
  if (/<[A-Z][^>]*\s(?:id|targetId)\s*=/.test(blockSource)) {
    throw new Error('Cannot duplicate an ID-bearing JSX block without an explicit replacement ID');
  }
  const gap = defaultGap(document, block.parentId);
  const offset = block.location.range.end;
  const id = operationId(document, 'duplicate-block', blockId);
  const edits: SourceEdit[] = [{
    operationId: id,
    blockId,
    range: { start: offset, end: offset },
    expectedSource: '',
    replacement: `${gap}${blockSource}`,
    reason: `Duplicate registered ${block.blockType} block byte-for-byte`,
  }];
  return plan(document, 'duplicate-block', id, edits, preview(
    'Duplicación de bloque',
    `Se copiará ${blockId} byte a byte junto a su posición actual.`,
    edits,
    true,
  ));
}

export function planBlockMove(
  document: EditorDocument,
  blockId: string,
  targetIndex: number,
): DocumentMutationPlan {
  const block = editableBlock(document, blockId);
  const list = siblings(document, block.parentId);
  const fromIndex = list.findIndex(candidate => candidate.id === block.id);
  const clampedTarget = Math.max(0, Math.min(targetIndex, list.length - 1));
  if (fromIndex === clampedTarget) throw new Error('Block is already at the requested position');
  const startIndex = Math.min(fromIndex, clampedTarget);
  const endIndex = Math.max(fromIndex, clampedTarget);
  const affected = list.slice(startIndex, endIndex + 1);
  if (affected.some(candidate => candidate.kind !== 'editable')) {
    throw new Error('A visual block cannot move across a preserved or opaque source region');
  }
  const gaps = affected.slice(0, -1).map((candidate, index) => (
    document.source.slice(candidate.location.range.end, affected[index + 1].location.range.start)
  ));
  const reordered = [...affected];
  const localFrom = fromIndex - startIndex;
  const localTarget = clampedTarget - startIndex;
  const [moving] = reordered.splice(localFrom, 1);
  reordered.splice(localTarget, 0, moving);
  const replacement = reordered.map((candidate, index) => (
    document.source.slice(candidate.location.range.start, candidate.location.range.end) + (gaps[index] ?? '')
  )).join('');
  const range = {
    start: affected[0].location.range.start,
    end: affected[affected.length - 1].location.range.end,
  };
  const id = operationId(document, 'move-block', `${blockId}-${clampedTarget}`);
  const edits: SourceEdit[] = [{
    operationId: id,
    blockId,
    range,
    expectedSource: document.source.slice(range.start, range.end),
    replacement,
    reason: `Move ${blockId} within ${block.parentId}`,
  }];
  return plan(document, 'move-block', id, edits, preview(
    'Reordenación estructural',
    `Se reordenarán ${affected.length} bloques contiguos dentro de ${block.parentId}. Revise el diff antes de guardar.`,
    edits,
    true,
  ));
}

function serializeMetadataValue(value: unknown): string {
  const serialized = JSON.stringify(value, null, 2);
  if (serialized === undefined) throw new Error('Metadata values must be JSON-serializable');
  return serialized;
}

function sameValue(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function removalEdit(document: EditorDocument, key: string, id: string): SourceEdit {
  const properties = [...document.metadata.properties].sort((left, right) => left.propertyRange.start - right.propertyRange.start);
  const index = properties.findIndex(property => property.key === key);
  const property = properties[index];
  if (!property) throw new Error(`Unknown metadata field: ${key}`);
  const propertyBlocks = properties.map(candidate => ({ location: { range: candidate.propertyRange } }));
  const range = rangeWithAdjacentGap(propertyBlocks, index);
  const trivia = document.source.slice(range.start, range.end)
    .replace(document.source.slice(property.propertyRange.start, property.propertyRange.end), '');
  if (/\/\*|\/\//.test(trivia)) throw new Error(`Delete metadata field "${key}" in code to preserve its adjacent comment explicitly`);
  return {
    operationId: `${id}:remove:${key}`,
    blockId: 'metadata',
    range,
    expectedSource: document.source.slice(range.start, range.end),
    replacement: '',
    reason: `Remove metadata field ${key}`,
  };
}

// Property-level additions, replacements and guarded deletion share one atomic plan.
// eslint-disable-next-line sonarjs/cognitive-complexity
export function planMetadataUpdate(
  document: EditorDocument,
  nextMetadata: Record<string, unknown>,
): DocumentMutationPlan {
  if (document.metadata.status !== 'readable' || !document.metadata.value || !document.metadata.objectRange) {
    throw new Error('Metadata is not a statically readable object');
  }
  const current = document.metadata.value;
  if (typeof current.id === 'string' && current.id !== nextMetadata.id) throw new Error('Content ID is immutable');
  const validation = validateProjectedMetadata(nextMetadata, document.metadata.objectRange);
  if (!validation.valid) throw new Error(`Metadata violates the authoritative schema. ${validation.diagnostics.map(item => item.message).join(' ')}`);

  const changed = Object.keys(nextMetadata).filter(key => !sameValue(current[key], nextMetadata[key]));
  const removed = Object.keys(current).filter(key => !(key in nextMetadata));
  if (changed.length === 0 && removed.length === 0) throw new Error('Metadata update contains no changes');
  if (removed.length > 1) throw new Error('Remove metadata fields one at a time so each deletion has an auditable range');
  const id = operationId(document, 'update-metadata', [...changed, ...removed].sort().join('-'));
  const edits: SourceEdit[] = [];
  const additions: string[] = [];

  for (const key of changed) {
    const property = document.metadata.properties.find(candidate => candidate.key === key);
    if (!property) {
      additions.push(`${JSON.stringify(key)}: ${serializeMetadataValue(nextMetadata[key])}`);
      continue;
    }
    edits.push({
      operationId: `${id}:replace:${key}`,
      blockId: 'metadata',
      range: property.valueRange,
      expectedSource: document.source.slice(property.valueRange.start, property.valueRange.end),
      replacement: serializeMetadataValue(nextMetadata[key]),
      reason: `Update metadata field ${key}`,
    });
  }
  for (const key of removed) edits.push(removalEdit(document, key, id));

  if (additions.length > 0) {
    const properties = [...document.metadata.properties].sort((left, right) => left.propertyRange.start - right.propertyRange.start);
    const objectRange = document.metadata.objectRange;
    const eol = lineEnding(document.source);
    const objectSource = document.source.slice(objectRange.start, objectRange.end);
    const multiline = objectSource.includes('\n');
    let offset = objectRange.start + 1;
    let replacement: string;
    if (properties.length === 0) {
      const multilineSeparator = `,${eol}  `;
      replacement = multiline
        ? `${eol}  ${additions.join(multilineSeparator)}${eol}`
        : ` ${additions.join(', ')} `;
    } else {
      const last = properties[properties.length - 1];
      const suffix = document.source.slice(last.propertyRange.end, objectRange.end - 1);
      const trailingComma = suffix.match(/^\s*,/);
      offset = trailingComma ? last.propertyRange.end + trailingComma[0].length : last.propertyRange.end;
      const separator = multiline ? `${eol}  ` : ' ';
      const leadingSeparator = trailingComma ? separator : `,${separator}`;
      const joiningSeparator = `,${separator}`;
      replacement = leadingSeparator + additions.join(joiningSeparator);
    }
    edits.push({
      operationId: `${id}:insert`,
      blockId: 'metadata',
      range: { start: offset, end: offset },
      expectedSource: '',
      replacement,
      reason: `Insert metadata fields: ${changed.filter(key => !(key in current)).join(', ')}`,
    });
  }

  return plan(document, 'update-metadata', id, edits, preview(
    'Actualización localizada de metadatos',
    `${edits.length} parche(s) sobre propiedades concretas; imports, exports y cuerpo permanecen intactos.`,
    edits,
    edits.length > 3 || removed.length > 0,
  ));
}
