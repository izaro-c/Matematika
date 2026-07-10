import { describe, expect, it } from 'vitest';
import { parseExperimentalDocument, applySourceEdits, reparseEditedDocument } from '../../../../src/features/editor/experimental/lossless-mdx/losslessMdx';
import { SourceEdit } from '../../../../src/features/editor/experimental/lossless-mdx/documentTypes';

describe('Lossless MDX Editor Prototipo', () => {
  // --- Parseo ---
  it('correctly parses markdown and computes a stable SHA-256 hash', () => {
    const source = '## Un Título\n\nEste es un párrafo de texto normal.';
    const doc = parseExperimentalDocument(source);

    expect(doc.source).toBe(source);
    expect(doc.sourceHash).toHaveLength(8);
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

    expect(doc.compatibility).toBe('read-only');

    const opacities = doc.blocks.filter(b => b.kind === 'opaque');
    expect(opacities).not.toHaveLength(0);

    const jsxBlock = opacities.find(b => b.reason.includes('JSX block component'));
    expect(jsxBlock).toBeDefined();
    expect(jsxBlock!.source).toContain('<Box>');

    const listBlock = opacities.find(b => b.reason.includes('list block'));
    expect(listBlock).toBeDefined();
  });

  // --- Proyección ---
  it('projects paragraph simple as editable and unknown node types as opaque', () => {
    const source = 'Un párrafo simple.\n\n<ComponenteDesconocido />';
    const doc = parseExperimentalDocument(source);

    expect(doc.blocks).toHaveLength(2);
    expect(doc.blocks[0].kind).toBe('editable');
    expect((doc.blocks[0] as any).blockType).toBe('paragraph');
    
    expect(doc.blocks[1].kind).toBe('opaque');
    expect(doc.blocks[1].reason).toContain('JSX block component');
    expect(doc.compatibility).toBe('partially-editable');
  });

  // --- Parches ---
  it('applies localized patches and detects obsolete sources and overlaps', () => {
    const source = 'Un párrafo inicial.\n\nOtro párrafo aquí.';
    const doc = parseExperimentalDocument(source);

    const edit1: SourceEdit = {
      range: { start: 0, end: 19 },
      expectedSource: 'Un párrafo inicial.',
      replacement: 'Un párrafo modificado.',
      operationId: 'op-1'
    };

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

  it('rejects invalid range boundaries and guarantees atomicity', () => {
    const source = 'Texto corto.';
    
    // Range out of bounds
    const edit1: SourceEdit = {
      range: { start: 0, end: 50 },
      expectedSource: 'Texto corto.',
      replacement: 'Largo',
      operationId: 'op-1'
    };
    const res1 = applySourceEdits(source, [edit1]);
    expect(res1.success).toBe(false);
    expect(res1.error).toContain('out of bounds');

    // Negative range
    const edit2: SourceEdit = {
      range: { start: 5, end: 2 },
      expectedSource: '',
      replacement: 'Inv',
      operationId: 'op-2'
    };
    const res2 = applySourceEdits(source, [edit2]);
    expect(res2.success).toBe(false);
    expect(res2.error).toContain('Invalid negative edit range');
  });

  // --- Preservación ---
  it('editing a paragraph does not alter nearby JSX, imports, exports, or opaque blocks', () => {
    const source = `import { Math } from './Math';

Un párrafo simple que será editado.

<OpaqueComponent complexProps={{ a: 1 }} />`;
    const doc = parseExperimentalDocument(source);

    // Find the paragraph block
    const pBlock = doc.blocks.find(b => b.kind === 'editable')!;
    const edit: SourceEdit = {
      range: pBlock.location.range,
      expectedSource: (pBlock as any).originalSource,
      replacement: 'Párrafo modificado.',
      operationId: 'op-p'
    };

    const res = applySourceEdits(source, [edit]);
    expect(res.success).toBe(true);
    
    // Check that imports and JSX block are byte-for-byte identical in the output
    const expectedOutput = `import { Math } from './Math';

Párrafo modificado.

<OpaqueComponent complexProps={{ a: 1 }} />`;
    expect(res.output).toBe(expectedOutput);
  });

  // --- Unicode y saltos de línea ---
  it('correctly handles mathematical symbols and non-ASCII Unicode characters', () => {
    const source = 'La variable 𝕏 y 𝜆 definen el espacio.';
    // Unified offset coordinates are based on UTF-16 code units (same as String.prototype.slice)
    const doc = parseExperimentalDocument(source);

    expect(doc.blocks).toHaveLength(1);
    const block = doc.blocks[0];
    
    // Slice using the range offsets matches perfectly
    const slice = source.slice(block.location.range.start, block.location.range.end);
    expect(slice).toBe(source);
    expect(source.indexOf('𝕏')).toBe(12);
  });

  it('handles CRLF and LF line endings without throwing offset mismatches', () => {
    const lfSource = 'Línea 1.\n\nLínea 2.\n';
    const crlfSource = 'Línea 1.\r\n\r\nLínea 2.\r\n';

    const docLf = parseExperimentalDocument(lfSource);
    const docCrlf = parseExperimentalDocument(crlfSource);

    expect(docLf.blocks).toHaveLength(2);
    expect(docCrlf.blocks).toHaveLength(2);

    expect(lfSource.slice(docLf.blocks[1].location.range.start, docLf.blocks[1].location.range.end)).toBe('Línea 2.');
    expect(crlfSource.slice(docCrlf.blocks[1].location.range.start, docCrlf.blocks[1].location.range.end)).toBe('Línea 2.');
  });
});
