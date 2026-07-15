import { describe, it, expect } from 'vitest';
import { Grafo } from '@/entities/graph/Grafo';
import type { GraphStructure, ModelInfo } from '@/entities/graph/graphTypes';

// UC6 ValutaGrafoAttivo — recorre el DAG en orden topológico
// y devuelve los nodos lógicamente válidos según los axiomas activos.
describe('Grafo.evaluate', () => {
  const structure: GraphStructure = {
    topologicalOrder: ['ax-1', 'ax-2', 'def-1', 'lem-1', 'thm-1', 'cor-1'],
    nodes: {
      'ax-1': { type: 'axioma', proofs: [], directDependencies: [] },
      'ax-2': { type: 'axioma', proofs: [], directDependencies: [] },
      'def-1': { type: 'definicion', proofs: [], directDependencies: ['ax-1'] },
      'lem-1': {
        type: 'lema',
        proofs: [{ id: 'proof-l1', dependencies: ['def-1'] }],
        directDependencies: [],
      },
      'thm-1': {
        type: 'teorema',
        proofs: [{ id: 'proof-t1', dependencies: ['lem-1', 'def-1'] }],
        directDependencies: [],
      },
      'cor-1': {
        type: 'corolario',
        proofs: [{ id: 'proof-c1', dependencies: ['thm-1'] }],
        directDependencies: [],
      },
    },
  };

  it('TC_02: starts empty with no active axioms', () => {
    const grafo = Grafo.from(structure);
    const result = grafo.evaluate({});
    expect(result.size).toBe(0);
  });

  it('TC_01: validates chain with one active axiom', () => {
    const grafo = Grafo.from(structure);
    const result = grafo.evaluate({ 'ax-1': true });
    expect(result.has('ax-1')).toBe(true);
    expect(result.has('def-1')).toBe(true);
    expect(result.has('lem-1')).toBe(true);
    expect(result.has('thm-1')).toBe(true);
    expect(result.has('cor-1')).toBe(true);
  });

  it('TC_03: prevents nodes when dependency chain is broken', () => {
    const grafo = Grafo.from(structure);
    const result = grafo.evaluate({ 'ax-2': true });
    expect(result.has('ax-2')).toBe(true);
    expect(result.has('def-1')).toBe(false);
    expect(result.has('thm-1')).toBe(false);
  });

  it('TC_04: handles theorem with multiple proofs (OR logic)', () => {
    const multiProof: GraphStructure = {
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

    const grafo = Grafo.from(multiProof);
    const result = grafo.evaluate({ 'ax-1': true });
    expect(result.has('thm-1')).toBe(true);

    const resultWithout = grafo.evaluate({});
    expect(resultWithout.has('thm-1')).toBe(false);
  });

  it('TC_06: treats theorem with no proofs as valid when no deps', () => {
    const noProof: GraphStructure = {
      topologicalOrder: ['thm-1'],
      nodes: {
        'thm-1': { type: 'teorema', proofs: [], directDependencies: [] },
      },
    };
    const grafo = Grafo.from(noProof);
    const result = grafo.evaluate({});
    expect(result.has('thm-1')).toBe(true);
  });

  it('TC_05: skips node missing from index and continues evaluation', () => {
    const withMissing: GraphStructure = {
      topologicalOrder: ['ax-1', 'missing-node', 'def-1'],
      nodes: {
        'ax-1': { type: 'axioma', proofs: [], directDependencies: [] },
        'def-1': { type: 'definicion', proofs: [], directDependencies: ['ax-1'] },
      },
    };
    const grafo = Grafo.from(withMissing);
    expect(() => grafo.evaluate({ 'ax-1': true })).not.toThrow();
    const result = grafo.evaluate({ 'ax-1': true });
    expect(result.has('ax-1')).toBe(true);
    expect(result.has('def-1')).toBe(true);
  });

  it('rejects mutually exclusive axioms before evaluating consequences', () => {
    const incompatible: GraphStructure = {
      topologicalOrder: ['ax-euclid', 'ax-hyperbolic'],
      nodes: {
        'ax-euclid': {
          type: 'axioma',
          alternativeGroup: 'parallel-postulate',
          proofs: [],
          directDependencies: [],
        },
        'ax-hyperbolic': {
          type: 'axioma',
          alternativeGroup: 'parallel-postulate',
          proofs: [],
          directDependencies: [],
        },
      },
    };

    expect(() => Grafo.from(incompatible).evaluate({
      'ax-euclid': true,
      'ax-hyperbolic': true,
    })).toThrow(/Selección axiomática inconsistente/);
  });
});

// UC4 EsploraModelli / RF11 — dados los modelos activos,
// devuelve los axiomas que no pertenecen a ninguno de ellos.
describe('Grafo.computeDisabledAxiomsFromModels', () => {
  const models: ModelInfo[] = [
    { id: 'm1', title: 'Model 1', axioms: ['ax-1', 'ax-2'] },
    { id: 'm2', title: 'Model 2', axioms: ['ax-2', 'ax-3'] },
  ];
  const allAxioms = ['ax-1', 'ax-2', 'ax-3', 'ax-4'];

  it('disables every axiom when no model is active', () => {
    expect(Grafo.computeDisabledAxiomsFromModels(models, [], allAxioms)).toEqual(allAxioms);
  });

  it('disables axioms not in active model', () => {
    const result = Grafo.computeDisabledAxiomsFromModels(models, ['m1'], allAxioms);
    expect(result).toContain('ax-3');
    expect(result).toContain('ax-4');
    expect(result).not.toContain('ax-1');
    expect(result).not.toContain('ax-2');
  });

  it('disables nothing when all models active', () => {
    const result = Grafo.computeDisabledAxiomsFromModels(models, ['m1', 'm2'], allAxioms);
    expect(result).toContain('ax-4');
    expect(result).not.toContain('ax-1');
    expect(result).not.toContain('ax-2');
    expect(result).not.toContain('ax-3');
  });
});

// UC12 VerificaCicli / RF07 — comprueba que todos los IDs del orden
// topológico existan en el índice de nodos.
describe('Grafo.isDagValid', () => {
  it('returns true for valid DAG', () => {
    const structure: GraphStructure = {
      topologicalOrder: ['ax-1', 'def-1'],
      nodes: {
        'ax-1': { type: 'axioma', proofs: [], directDependencies: [] },
        'def-1': { type: 'definicion', proofs: [], directDependencies: ['ax-1'] },
      },
    };
    expect(Grafo.from(structure).isDagValid()).toBe(true);
  });

  it('returns false when node missing from topological order', () => {
    const structure: GraphStructure = {
      topologicalOrder: ['ax-1'],
      nodes: {
        'ax-1': { type: 'axioma', proofs: [], directDependencies: [] },
        'def-1': { type: 'definicion', proofs: [], directDependencies: ['ax-1'] },
      },
    };
    expect(Grafo.from(structure).isDagValid()).toBe(false);
  });
});
