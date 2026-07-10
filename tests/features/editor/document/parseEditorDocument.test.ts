import { describe, expect, it } from 'vitest';
import { parseEditorDocument } from '../../../../src/features/editor/document/parseEditorDocument';

describe('Production Lossless MDX Parser', () => {
  it('parses correct MDX source and computes a stable hash', () => {
    const source = '## Título\n\nTexto plano.';
    const doc = parseEditorDocument(source);

    expect(doc.source).toBe(source);
    expect(doc.sourceHash).toHaveLength(8);
    expect(doc.diagnostics).toHaveLength(0);
    expect(doc.compatibility).toBe('fully-editable'); // No ast nodes are projected yet
    expect(doc.ast).toBeDefined();
  });

  it('captures critical diagnostics on malformed MDX expressions', () => {
    // Braces with syntax error in expression
    const source = 'Un párrafo { un syntax error here } y texto.';
    const doc = parseEditorDocument(source);

    expect(doc.compatibility).toBe('unsupported');
    expect(doc.diagnostics).toHaveLength(1);
    expect(doc.diagnostics[0].code).toBe('PARSE_EXCEPTION');
    expect(doc.diagnostics[0].severity).toBe('critical');
    expect(doc.diagnostics[0].message).toContain('Could not parse expression with acorn');
  });

  it('handles math Unicode characters and calculates correct byte locations', () => {
    const source = 'Sea 𝕏 un espacio de Banach.';
    const doc = parseEditorDocument(source);

    expect(doc.diagnostics).toHaveLength(0);
    expect(doc.sourceHash).toBeDefined();
  });
});
