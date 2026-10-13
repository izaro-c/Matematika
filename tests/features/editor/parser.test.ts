import { describe, it, expect } from 'vitest';
import {
  parseInlineNodes,
} from '@/fixed-pages/editor/session/parser';

describe('Editor MDX Parser', () => {

  it('should parse inline semantic links, emphasis and inline latex as nodes', () => {
    const nodes = parseInlineNodes('Un **cateto** mide $a$ y <ConceptLink targetId="altura" highlightTarget="segAltura">altura</ConceptLink>.');

    expect(nodes).toEqual(expect.arrayContaining([
      { type: 'bold', value: 'cateto' },
      { type: 'inlineLatex', value: 'a' },
      expect.objectContaining({
        type: 'conceptLink',
        value: 'altura',
        attrs: expect.objectContaining({ targetId: 'altura', highlightTarget: 'segAltura' }),
      }),
    ]));
  });

  it('should parse common inline markdown variants and unquoted JSX attributes', () => {
    const nodes = parseInlineNodes('__base__ y _altura_ conectan <ConceptLink targetId=altura highlightTarget=segAltura highlightColor=canela>altura</ConceptLink>.');

    expect(nodes).toEqual(expect.arrayContaining([
      { type: 'bold', value: 'base' },
      { type: 'italic', value: 'altura' },
      expect.objectContaining({
        type: 'conceptLink',
        value: 'altura',
        attrs: expect.objectContaining({
          targetId: 'altura',
          highlightTarget: 'segAltura',
          highlightColor: 'canela',
        }),
      }),
    ]));
  });

  it('projects a nested InteractiveElement and ConceptLink as one editable combined link', () => {
    const raw = '<InteractiveElement target="pA" color="ocre"><ConceptLink targetId="punto">punto</ConceptLink></InteractiveElement>';
    const nodes = parseInlineNodes(raw);

    expect(nodes).toEqual([{
      type: 'conceptLink',
      value: 'punto',
      attrs: {
        targetId: 'punto',
        highlightTarget: 'pA',
        highlightColor: 'ocre',
      },
      raw,
    }]);
  });

  it('prefers the current ConceptLink highlight over a stale outer InteractiveElement target', () => {
    const raw = '<InteractiveElement target="pP" color="terracota"><ConceptLink targetId="punto" highlightTarget="pA" highlightColor="ocre">punto</ConceptLink></InteractiveElement>';
    const nodes = parseInlineNodes(raw);

    expect(nodes).toEqual([{
      type: 'conceptLink',
      value: 'punto',
      attrs: {
        targetId: 'punto',
        highlightTarget: 'pA',
        highlightColor: 'ocre',
      },
      raw,
    }]);
  });
});
