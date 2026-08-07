import { describe, expect, it } from 'vitest';
import { parseInlineNodes } from '@/fixed-pages/editor/session/parser';
import { editableHtmlToMdx, mdxToEditableHtml } from '@/fixed-pages/editor/ui/prose/inlineProseOps';

function roundtrip(mdx: string): string {
  const root = document.createElement('div');
  root.innerHTML = mdxToEditableHtml(mdx);
  return editableHtmlToMdx(root);
}

function expectSameInlineNodes(input: string, output: string) {
  expect(parseInlineNodes(output)).toEqual(parseInlineNodes(input));
}

describe('inlineProseOps', () => {
  it('roundtrips plain text', () => {
    const input = 'Un párrafo simple.';
    expect(roundtrip(input)).toBe(input);
  });

  it('roundtrips bold and italic', () => {
    const input = 'Un **cateto** y *altura*.';
    expectSameInlineNodes(input, roundtrip(input));
  });

  it('keeps inline latex editable as $code$', () => {
    const input = 'La variable $x$ crece.';
    expectSameInlineNodes(input, roundtrip(input));
    const html = mdxToEditableHtml(input);
    expect(html).toContain('data-mdx="latex"');
    expect(html).toContain('$x$');
    expect(html).toContain('data-latex-preview="1" contenteditable="false"');
  });

  it('roundtrips Formula blocks inside step bodies', () => {
    const input = 'Luego\n<Formula>\n  $$a^2+b^2$$\n</Formula>\nsigue.';
    const html = mdxToEditableHtml(input);
    expect(html).toContain('data-mdx="formula"');
    expect(html).toContain('katex');
    const out = roundtrip(input);
    expect(out).toContain('<Formula>');
    expect(out).toContain('a^2+b^2');
  });

  it('roundtrips ConceptLink', () => {
    const input = '<ConceptLink targetId="altura" highlightTarget="segAltura">altura</ConceptLink>';
    expectSameInlineNodes(input, roundtrip(input));
  });

  it('roundtrips InteractiveElement', () => {
    const input = '<InteractiveElement target="pA" color="ocre">punto A</InteractiveElement>';
    expectSameInlineNodes(input, roundtrip(input));
  });

  it('roundtrips nested ConceptLink inside InteractiveElement as combined link', () => {
    const input = '<InteractiveElement target="pA" color="ocre"><ConceptLink targetId="punto">punto</ConceptLink></InteractiveElement>';
    expectSameInlineNodes(input, roundtrip(input));
  });
});
