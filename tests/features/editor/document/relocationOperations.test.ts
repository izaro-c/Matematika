import { describe, expect, it } from 'vitest';
import {
  applyMutationPlan,
  parseEditorDocument,
  planBlockRelocation,
  planSectionRelocation,
  planSectionStep,
  sectionBlockIds,
  type EditorDocument,
} from '../../../../src/fixed-pages/editor/document';

const envelope = `export const metadata = {
  "id": "relocation-test",
  "type": "definicion",
  "title": "Prueba",
  "description": "Documento de prueba.",
  "subtype": "nominal"
};`;

const source = `${envelope}

Entrada.

### Uno

Texto uno.

<StepSection step="s1">
Paso uno.

Paso uno bis.
</StepSection>

### Dos

Texto dos.

#### Dos punto uno

Detalle.

### Tres

Texto tres.
`;

function blockId(document: EditorDocument, text: string): string {
  const block = document.bodyBlocks.find(candidate => (
    document.source.slice(candidate.location.range.start, candidate.location.range.end).includes(text)
  ));
  if (!block) throw new Error(`Missing block: ${text}`);
  return block.id;
}

function order(document: EditorDocument, ...texts: string[]): number[] {
  return texts.map(text => document.source.indexOf(text));
}

const increasing = (values: number[]) => values.every((value, index) => index === 0 || value > values[index - 1]);

describe('relocationOperations', () => {
  const document = parseEditorDocument(source);

  it('moves a block before another sibling and keeps every byte of the moved block', () => {
    const moved = applyMutationPlan(document, planBlockRelocation(document, blockId(document, 'Texto tres.'), blockId(document, '### Uno'), 'before'));
    expect(increasing(order(moved, 'Entrada.', 'Texto tres.', '### Uno'))).toBe(true);
    expect(moved.source.match(/Texto tres\./g)).toHaveLength(1);
    expect(moved.source.endsWith('### Tres\n')).toBe(true);
  });

  it('moves a block into and out of a StepSection', () => {
    const into = applyMutationPlan(document, planBlockRelocation(document, blockId(document, 'Texto dos.'), blockId(document, 'Paso uno.'), 'after'));
    const step = into.source.slice(into.source.indexOf('<StepSection'), into.source.indexOf('</StepSection>'));
    expect(step).toContain('Texto dos.');
    const intoBlock = into.bodyBlocks.find(block => block.id === blockId(into, 'Texto dos.'));
    expect(intoBlock?.parentId).not.toBe('container-root');

    const out = applyMutationPlan(into, planBlockRelocation(into, blockId(into, 'Texto dos.'), blockId(into, '### Dos'), 'after'));
    expect(out.source).toBe(source);
  });

  it('refuses to empty a StepSection or to stay in place', () => {
    const single = parseEditorDocument(`${envelope}\n\nA.\n\n<StepSection step="s1">\nSolo.\n</StepSection>\n`);
    expect(() => planBlockRelocation(single, blockId(single, 'Solo.'), blockId(single, 'A.'), 'before')).toThrow('empty');
    expect(() => planBlockRelocation(document, blockId(document, '### Dos'), blockId(document, 'Texto dos.'), 'before')).toThrow('already');
    expect(() => planBlockRelocation(document, blockId(document, '### Dos'), blockId(document, 'Paso uno bis.'), 'after')).not.toThrow();
  });

  it('moves a heading with its subsections and nested StepSection', () => {
    expect(sectionBlockIds(document, blockId(document, '### Uno'))).toEqual([
      blockId(document, '### Uno'), blockId(document, 'Texto uno.'), blockId(document, 'Paso uno.'), blockId(document, 'Paso uno bis.'),
    ]);
    const moved = applyMutationPlan(document, planSectionRelocation(document, blockId(document, '### Uno'), blockId(document, 'Texto tres.'), 'after'));
    expect(increasing(order(moved, 'Entrada.', '### Dos', 'Detalle.', '### Tres', 'Texto tres.', '### Uno', '<StepSection', 'Paso uno bis.'))).toBe(true);
    expect(() => planSectionRelocation(document, blockId(document, '### Uno'), blockId(document, 'Paso uno.'), 'after')).toThrow('inside itself');
    expect(() => planSectionRelocation(document, blockId(document, '### Dos'), blockId(document, 'Detalle.'), 'after')).toThrow('already');
  });

  it('steps a section past its neighbour and back', () => {
    const down = applyMutationPlan(document, planSectionStep(document, blockId(document, '### Uno'), 1));
    expect(increasing(order(down, '### Dos', 'Detalle.', '### Uno', 'Paso uno bis.', '### Tres'))).toBe(true);
    const up = applyMutationPlan(down, planSectionStep(down, blockId(down, '### Uno'), -1));
    expect(up.source).toBe(source);
    expect(() => planSectionStep(document, blockId(document, '### Tres'), 1)).toThrow('last');
    const subsection = applyMutationPlan(document, planSectionStep(document, blockId(document, '#### Dos punto uno'), -1));
    expect(increasing(order(subsection, '#### Dos punto uno', 'Detalle.', '\n### Dos', 'Texto dos.'))).toBe(true);
  });
});
