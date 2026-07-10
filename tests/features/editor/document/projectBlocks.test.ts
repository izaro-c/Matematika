import { describe, expect, it } from 'vitest';
import { parseEditorDocument } from '../../../../src/features/editor/document/parseEditorDocument';
import { classifyVisualCompatibility, getVisualCapabilities } from '../../../../src/features/editor/document/projectBlocks';

describe('Production Block Projection and Compatibility', () => {
  it('projects simple paragraphs and headings as editable', () => {
    const source = '# Título\n\nEste es un párrafo plano.';
    const doc = parseEditorDocument(source);

    expect(doc.compatibility).toBe('fully-editable');
    expect(doc.blocks).toHaveLength(2);
    
    expect(doc.blocks[0].kind).toBe('editable');
    expect((doc.blocks[0] as any).blockType).toBe('heading');
    expect((doc.blocks[0] as any).data.text).toBe('# Título');

    expect(doc.blocks[1].kind).toBe('editable');
    expect((doc.blocks[1] as any).blockType).toBe('paragraph');
    expect((doc.blocks[1] as any).data.text).toBe('Este es un párrafo plano.');
  });

  it('projects lists, tables, code, and JSX as opaque blocks', () => {
    const source = `## Título

- Elemento 1
- Elemento 2

<ComponenteJSX prop="value" />`;
    const doc = parseEditorDocument(source);

    expect(doc.compatibility).toBe('partially-editable');
    expect(doc.blocks).toHaveLength(3);

    expect(doc.blocks[0].kind).toBe('editable'); // heading
    expect(doc.blocks[1].kind).toBe('opaque'); // list
    expect(doc.blocks[1].reason).toContain('list block');
    expect(doc.blocks[2].kind).toBe('opaque'); // JSX element
    expect(doc.blocks[2].reason).toContain('JSX block component');
  });

  it('sets compatibility to read-only when ESM exports or imports are present', () => {
    const source = `import { Something } from './somewhere';

export const metadata = { title: 'Test' };

Un párrafo plano.`;
    const doc = parseEditorDocument(source);

    expect(doc.compatibility).toBe('read-only');
    const classif = classifyVisualCompatibility(doc);
    expect(classif.compatibility).toBe('read-only');
    expect(classif.reasons[0]).toContain('Document has ESM imports or exports');
  });

  it('calculates capabilities correctly based on compatibility', () => {
    const capsFull = getVisualCapabilities('fully-editable');
    expect(capsFull.canViewVisual).toBe(true);
    expect(capsFull.canEditSafeBlocks).toBe(true);
    expect(capsFull.canApplyVisualChanges).toBe(true);

    const capsUnsupported = getVisualCapabilities('unsupported');
    expect(capsUnsupported.canViewVisual).toBe(false);
    expect(capsUnsupported.canEditSafeBlocks).toBe(false);
    expect(capsUnsupported.canApplyVisualChanges).toBe(false);
  });
});
