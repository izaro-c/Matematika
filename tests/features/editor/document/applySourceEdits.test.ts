import { describe, expect, it } from 'vitest';
import { applySourceEdits, parseEditorDocument, reparseEditedDocument, type SourceEdit } from '../../../../src/features/editor/document';

function editFor(source: string, blockIndex: number, replacement: string, operationId = 'op-1'): { doc: ReturnType<typeof parseEditorDocument>; edit: SourceEdit } {
  const doc = parseEditorDocument(source);
  const block = doc.bodyBlocks[blockIndex];
  if (!block || block.kind !== 'editable') throw new Error('Fixture block is not editable');
  return { doc, edit: { operationId, blockId: block.id, range: block.editRange, expectedSource: block.originalSource, replacement } };
}

describe('lossless source edits', () => {
  it('changes only the authorized paragraph slice and recalculates offsets', () => {
    const source = `export const metadata = { title: 'T' };\n\nPrimero.\n\nSegundo.`;
    const { doc, edit } = editFor(source, 0, 'Primer párrafo ampliado.');
    const next = reparseEditedDocument(doc, doc.sourceHash, [edit]);
    expect(next.source).toBe(`export const metadata = { title: 'T' };\n\nPrimer párrafo ampliado.\n\nSegundo.`);
    expect(next.source.slice(next.envelope.metadataRange!.start, next.envelope.metadataRange!.end))
      .toBe(`export const metadata = { title: 'T' };`);
    expect(next.bodyBlocks[1].location.range.start).toBeGreaterThan(doc.bodyBlocks[1].location.range.start);
  });

  it('edits heading text without removing or duplicating markers', () => {
    const { doc, edit } = editFor('### Antiguo\n\nTexto.', 0, 'Nuevo');
    expect(reparseEditedDocument(doc, doc.sourceHash, [edit]).source).toBe('### Nuevo\n\nTexto.');
  });

  it('rejects stale hashes, stale slices, unknown and opaque blocks', () => {
    const source = 'Texto.\n\n<Caja />';
    const { doc, edit } = editFor(source, 0, 'Cambio');
    expect(() => reparseEditedDocument(doc, 'deadbeef', [edit])).toThrow('Stale document revision');
    expect(() => reparseEditedDocument(doc, doc.sourceHash, [{ ...edit, expectedSource: 'Viejo' }])).toThrow('Expected source mismatch');
    expect(() => reparseEditedDocument(doc, doc.sourceHash, [{ ...edit, blockId: 'missing' }])).toThrow('Unknown block');
    const opaque = doc.bodyBlocks[1];
    expect(() => reparseEditedDocument(doc, doc.sourceHash, [{ ...edit, blockId: opaque.id, range: opaque.location.range, expectedSource: '<Caja />' }]))
      .toThrow('Opaque block');
  });

  it('rejects mismatched ranges and invalid MDX replacements', () => {
    const { doc, edit } = editFor('Texto.', 0, 'Cambio');
    expect(() => reparseEditedDocument(doc, doc.sourceHash, [{ ...edit, range: { start: 1, end: edit.range.end } }]))
      .toThrow('does not match editable range');
    expect(() => reparseEditedDocument(doc, doc.sourceHash, [{ ...edit, replacement: '{ broken JS }' }]))
      .toThrow('not valid project MDX');
  });

  it('rejects overlaps, duplicate operations and ambiguous insertions', () => {
    const source = 'abcdefghij';
    const base = { blockId: 'block-0', replacement: 'x' };
    expect(applySourceEdits(source, [
      { ...base, operationId: 'a', range: { start: 0, end: 5 }, expectedSource: 'abcde' },
      { ...base, operationId: 'b', range: { start: 4, end: 8 }, expectedSource: 'efgh' }
    ]).error).toContain('Overlapping');
    expect(applySourceEdits(source, [
      { ...base, operationId: 'a', range: { start: 0, end: 1 }, expectedSource: 'a' },
      { ...base, operationId: 'a', range: { start: 2, end: 3 }, expectedSource: 'c' }
    ]).error).toContain('Duplicate');
    expect(applySourceEdits(source, [
      { ...base, operationId: 'a', range: { start: 2, end: 2 }, expectedSource: '' },
      { ...base, operationId: 'b', range: { start: 2, end: 2 }, expectedSource: '' }
    ]).error).toContain('Ambiguous');
  });
});
