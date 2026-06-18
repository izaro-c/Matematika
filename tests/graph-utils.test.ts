import { describe, it, expect } from 'vitest';
import { evaluateActiveGraph, computeDisabledAxiomsFromModels } from '../src/store/graphUtils';

describe('evaluateActiveGraph', () => {
  const graph: Parameters<typeof evaluateActiveGraph>[1] = {
    topologicalOrder: ['ax-1', 'ax-2', 'def-1', 'lem-1', 'thm-1', 'cor-1'],
    nodes: {
      'ax-1': { type: 'axioma', proofs: [], directDependencies: [] },
      'ax-2': { type: 'axioma', proofs: [], directDependencies: [] },
      'def-1': { type: 'definicion', proofs: [], directDependencies: ['ax-1'] },
      'lem-1': { type: 'lema', proofs: [{ id: 'proof-l1', dependencies: ['def-1'] }], directDependencies: [] },
      'thm-1': { type: 'teorema', proofs: [{ id: 'proof-t1', dependencies: ['lem-1', 'def-1'] }], directDependencies: [] },
      'cor-1': { type: 'corolario', proofs: [{ id: 'proof-c1', dependencies: ['thm-1'] }], directDependencies: [] },
    },
  };

  it('starts empty with no active axioms', () => {
    const result = evaluateActiveGraph({}, graph);
    expect(result.size).toBe(0);
  });

  it('validates chain with one active axiom', () => {
    const result = evaluateActiveGraph({ 'ax-1': true }, graph);
    expect(result.has('ax-1')).toBe(true);
    expect(result.has('def-1')).toBe(true);
    expect(result.has('lem-1')).toBe(true);
    expect(result.has('thm-1')).toBe(true);
    expect(result.has('cor-1')).toBe(true);
  });

  it('prevents nodes when dependency chain is broken', () => {
    const result = evaluateActiveGraph({ 'ax-2': true }, graph);
    expect(result.has('ax-2')).toBe(true);
    expect(result.has('def-1')).toBe(false);
    expect(result.has('thm-1')).toBe(false);
  });

  it('handles theorem with multiple proofs (OR logic)', () => {
    const multiProofGraph = {
      topologicalOrder: ['ax-1', 'ax-2', 'def-1', 'def-2', 'thm-1'],
      nodes: {
        'ax-1': { type: 'axioma', proofs: [], directDependencies: [] },
        'ax-2': { type: 'axioma', proofs: [], directDependencies: [] },
        'def-1': { type: 'definicion', proofs: [], directDependencies: ['ax-1'] },
        'def-2': { type: 'definicion', proofs: [], directDependencies: ['ax-2'] },
        'thm-1': {
          type: 'teorema',
          proofs: [
            { id: 'p1', dependencies: ['def-1'] },
            { id: 'p2', dependencies: ['def-2'] },
          ],
          directDependencies: [],
        },
      },
    };

    const resultWithFirstProof = evaluateActiveGraph({ 'ax-1': true }, multiProofGraph);
    expect(resultWithFirstProof.has('thm-1')).toBe(true);

    const resultWithout = evaluateActiveGraph({}, multiProofGraph);
    expect(resultWithout.has('thm-1')).toBe(false);
  });

  it('treats theorem with no proofs as valid when no deps', () => {
    const noProofGraph = {
      topologicalOrder: ['thm-1'],
      nodes: {
        'thm-1': { type: 'teorema', proofs: [], directDependencies: [] },
      },
    };
    const result = evaluateActiveGraph({}, noProofGraph);
    expect(result.has('thm-1')).toBe(true);
  });
});

describe('computeDisabledAxiomsFromModels', () => {
  const models = [
    { id: 'm1', title: 'Model 1', axioms: ['ax-1', 'ax-2'] },
    { id: 'm2', title: 'Model 2', axioms: ['ax-2', 'ax-3'] },
  ];

  it('returns empty array when no active models', () => {
    expect(computeDisabledAxiomsFromModels(models, [])).toEqual([]);
  });

  it('disables axioms not in active model', () => {
    const result = computeDisabledAxiomsFromModels(models, ['m1']);
    expect(result).toContain('ax-3');
    expect(result).not.toContain('ax-1');
    expect(result).not.toContain('ax-2');
  });

  it('disables nothing when all models active', () => {
    const result = computeDisabledAxiomsFromModels(models, ['m1', 'm2']);
    expect(result.length).toBeLessThanOrEqual(0);
  });
});
