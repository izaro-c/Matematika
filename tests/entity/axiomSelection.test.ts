import { describe, expect, it } from 'vitest';
import {
  findAxiomSelectionConflicts,
  normalizeActiveAxiomIds,
} from '@/entities/graph/axiomSelection';

const axioms = [
  { id: 'axioma-base' },
  { id: 'axioma-paralelas-euclides', alternativeGroup: 'postulado-paralelas' },
  { id: 'axioma-paralelas-hiperbolico', alternativeGroup: 'postulado-paralelas' },
];

describe('axiom selection consistency', () => {
  it('detects simultaneous alternatives', () => {
    expect(findAxiomSelectionConflicts(axioms, [
      'axioma-paralelas-euclides',
      'axioma-paralelas-hiperbolico',
    ])).toEqual([{
      group: 'postulado-paralelas',
      axiomIds: ['axioma-paralelas-euclides', 'axioma-paralelas-hiperbolico'],
    }]);
  });

  it('lets an explicitly activated alternative replace its sibling', () => {
    expect(normalizeActiveAxiomIds(
      axioms,
      ['axioma-base', 'axioma-paralelas-euclides', 'axioma-paralelas-hiperbolico'],
      'axioma-paralelas-hiperbolico',
    )).toEqual(['axioma-base', 'axioma-paralelas-hiperbolico']);
  });

  it('neutralizes an ambiguous bulk or persisted selection', () => {
    expect(normalizeActiveAxiomIds(axioms, axioms.map((axiom) => axiom.id)))
      .toEqual(['axioma-base']);
  });
});
