import { describe, expect, it } from 'vitest';
import { parseExperimentalDocument, applySourceEdits, reparseEditedDocument } from '../../../../src/features/editor/experimental/lossless-mdx/losslessMdx';
import { SourceEdit } from '../../../../src/features/editor/experimental/lossless-mdx/documentTypes';

describe('Lossless MDX Editor Prototipo', () => {
  it('correctly parses markdown and computes a stable SHA-256 hash', () => {
    const source = '## Un Título\n\nEste es un párrafo de texto normal.';
    const doc = parseExperimentalDocument(source);

    expect(doc.source).toBe(source);
    expect(doc.sourceHash).toHaveLength(64); // SHA-256 length is 64 hex characters
    expect(doc.diagnostics).toHaveLength(0);
    expect(doc.compatibility).toBe('fully-editable');

    expect(doc.blocks).toHaveLength(2);
    expect(doc.blocks[0].kind).toBe('editable');
    expect(doc.blocks[0].id).toBe('block-0');
    expect((doc.blocks[0] as any).blockType).toBe('heading');

    expect(doc.blocks[1].kind).toBe('editable');
    expect(doc.blocks[1].id).toBe('block-1');
    expect((doc.blocks[1] as any).blockType).toBe('paragraph');
  });

  it('preserves imports, exports, lists, and JSX as opaque blocks', () => {
    const source = `export const metadata = { "id": "test" };

import { Box } from './Box';

Este es un párrafo.

<Box>
  Contenido JSX
</Box>

- Elemento de lista
- Otro elemento
`;
    const doc = parseExperimentalDocument(source);

    // Should contain mdxjsEsm and list and mdxJsxFlowElement
    expect(doc.compatibility).toBe('read-only'); // Has exports/imports

    const opacities = doc.blocks.filter(b => b.kind === 'opaque');
    expect(opacities).not.toHaveLength(0);

    // Verify metadata block, imports, JSX Box block, and list block are opaque
    const jsxBlock = opacities.find(b => b.reason.includes('JSX block component'));
    expect(jsxBlock).toBeDefined();
    expect(jsxBlock!.source).toContain('<Box>');
    expect(jsxBlock!.source).toContain('</Box>');

    const listBlock = opacities.find(b => b.reason.includes('list block'));
    expect(listBlock).toBeDefined();
    expect(listBlock!.source).toContain('- Elemento de lista');
  });

  it('applies localized parches and detects obsolete sources and overlaps', () => {
    const source = 'Un párrafo inicial.\n\nOtro párrafo aquí.';
    const doc = parseExperimentalDocument(source);

    // Replace "Un párrafo inicial." with "Un párrafo modificado."
    const edit1: SourceEdit = {
      range: { start: 0, end: 19 },
      expectedSource: 'Un párrafo inicial.',
      replacement: 'Un párrafo modificado.',
      operationId: 'op-1'
    };

    // Replace "aquí" with "allá"
    const edit2: SourceEdit = {
      range: { start: 34, end: 38 },
      expectedSource: 'aquí',
      replacement: 'allá',
      operationId: 'op-2'
    };

    // 1. Success case
    const res = applySourceEdits(source, [edit1, edit2]);
    expect(res.success).toBe(true);
    expect(res.output).toBe('Un párrafo modificado.\n\nOtro párrafo allá.');

    // 2. Obsolete expected source detection
    const badEdit: SourceEdit = {
      range: { start: 0, end: 19 },
      expectedSource: 'Un texto obsoleto.',
      replacement: 'Un párrafo modificado.',
      operationId: 'op-3'
    };
    const resBad = applySourceEdits(source, [badEdit]);
    expect(resBad.success).toBe(false);
    expect(resBad.error).toContain('Expected source mismatch');

    // 3. Overlap detection
    const overlappingEdit: SourceEdit = {
      range: { start: 10, end: 25 },
      expectedSource: ' inicial.\n\nOtro',
      replacement: 'solapado',
      operationId: 'op-4'
    };
    const resOverlap = applySourceEdits(source, [edit1, overlappingEdit]);
    expect(resOverlap.success).toBe(false);
    expect(resOverlap.error).toContain('Overlapping edits detected');
  });

  it('reparses the document correctly after edits', () => {
    const source = 'Un párrafo inicial.';
    const edit: SourceEdit = {
      range: { start: 0, end: 19 },
      expectedSource: 'Un párrafo inicial.',
      replacement: '## Un título nuevo.',
      operationId: 'op-1'
    };

    const newDoc = reparseEditedDocument(source, [edit]);
    expect(newDoc.source).toBe('## Un título nuevo.');
    expect(newDoc.blocks).toHaveLength(1);
    expect((newDoc.blocks[0] as any).blockType).toBe('heading');
  });
});
