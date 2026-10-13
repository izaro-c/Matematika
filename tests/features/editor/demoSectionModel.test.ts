import { describe, expect, it } from 'vitest';
import {
  bodyHasLogicalJustification,
  extractJustificationIdsFromBody,
} from '@/fixed-pages/editor/ui/blocks/demoJustification';

describe('demo section model', () => {

  it('detects justifications from body links and prose', () => {
    expect(bodyHasLogicalJustification('Por hipótesis, A.')).toBe(true);
    expect(bodyHasLogicalJustification('<ConceptLink targetId="axioma-1">axioma</ConceptLink>')).toBe(true);
    expect(bodyHasLogicalJustification('Solo texto sin apoyo.')).toBe(false);
    expect(extractJustificationIdsFromBody(
      'Por <ConceptLink targetId="axioma-1">a</ConceptLink> y <RefLink targetId="teorema-2">t</RefLink>.',
    )).toEqual(['axioma-1', 'teorema-2']);
  });
});
