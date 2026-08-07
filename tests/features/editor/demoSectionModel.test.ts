import { describe, expect, it } from 'vitest';
import {
  bodyHasLogicalJustification,
  extractJustificationIdsFromBody,
  parseDemoDiagramSlots,
  withDemoDiagramSlots,
} from '@/fixed-pages/editor/ui/blocks/demoJustification';

describe('demo section model', () => {
  it('parses single and multi diagram attrs', () => {
    expect(parseDemoDiagramSlots('diagram={<DemoFoo />}')).toEqual([
      { key: 'default', component: 'DemoFoo' },
    ]);
    expect(parseDemoDiagramSlots('diagrams={{ "1": <DemoA />, "2": DemoB }}')).toEqual([
      { key: '1', component: 'DemoA' },
      { key: '2', component: 'DemoB' },
    ]);
  });

  it('roundtrips diagram slots into attributesStr', () => {
    const next = withDemoDiagramSlots('className="x"', [
      { key: 'a', component: 'DemoA' },
      { key: 'b', component: 'DemoB' },
    ]);
    expect(next).toContain('diagrams={{');
    expect(next).toContain('"a": <DemoA />');
    expect(next).toContain('className="x"');
  });

  it('detects justifications from body links and prose', () => {
    expect(bodyHasLogicalJustification('Por hipótesis, A.')).toBe(true);
    expect(bodyHasLogicalJustification('<ConceptLink targetId="axioma-1">axioma</ConceptLink>')).toBe(true);
    expect(bodyHasLogicalJustification('Solo texto sin apoyo.')).toBe(false);
    expect(extractJustificationIdsFromBody(
      'Por <ConceptLink targetId="axioma-1">a</ConceptLink> y <RefLink targetId="teorema-2">t</RefLink>.',
    )).toEqual(['axioma-1', 'teorema-2']);
  });
});
