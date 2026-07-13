import { describe, expect, it } from 'vitest';
import { parseEditorDocument, getVisualCapabilities } from '../../../../src/features/editor/document';

describe('safe body projection', () => {
  it('projects heading depth separately from its editable text', () => {
    const doc = parseEditorDocument('## Título\n\nTexto plano.');
    const heading = doc.bodyBlocks[0];
    expect(heading.kind).toBe('editable');
    if (heading.kind !== 'editable') return;
    expect(heading.data).toEqual({ depth: 2, text: 'Título' });
    expect(heading.originalSource).toBe('Título');
    expect(doc.source.slice(heading.location.range.start, heading.location.range.end)).toBe('## Título');
  });

  it('excludes metadata and imports from body projection', () => {
    const source = `import X from './x';\n\nexport const metadata = { title: 'T' };\n\nTexto.`;
    const doc = parseEditorDocument(source);
    expect(doc.envelope.importRanges).toHaveLength(1);
    expect(doc.envelope.metadataRange).toBeDefined();
    expect(doc.bodyBlocks).toHaveLength(1);
    expect(doc.compatibility).toBe('fully-editable');
  });

  it('registers lists, GFM tables and math while keeping unknown JSX opaque', () => {
    const source = `Texto.\n\n- uno\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n$$\nx^2\n$$\n\n<Caja value={{ a: [1, 2] }} />`;
    const doc = parseEditorDocument(source);
    expect(doc.compatibility).toBe('partially-editable');
    expect(doc.bodyBlocks.filter(block => block.kind === 'editable').map(block => block.blockType))
      .toEqual(['paragraph', 'list', 'table', 'formula']);
    expect(doc.bodyBlocks.filter(block => block.kind === 'opaque').map(block => block.nodeType))
      .toEqual(['mdxJsxFlowElement']);
  });

  it('makes an opaque-only body visual read-only and unsupported source non-visual', () => {
    const readOnly = parseEditorDocument('<Caja />');
    expect(readOnly.compatibility).toBe('read-only');
    expect(getVisualCapabilities(readOnly.compatibility).canEditSafeBlocks).toBe(false);
    const unsupported = parseEditorDocument('Texto { esto no es JS }');
    expect(unsupported.compatibility).toBe('unsupported');
    expect(getVisualCapabilities(unsupported.compatibility).canViewVisual).toBe(false);
  });
});
