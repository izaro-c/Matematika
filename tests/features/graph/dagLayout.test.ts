import { describe, it, expect } from 'vitest';
import {
  computeDagLayout,
  edgeKey,
  placeWithGaps,
  transitiveReduction,
} from '@/fixed-pages/graph/lib/dagLayout';

describe('transitiveReduction', () => {
  it('quita las aristas que se deducen de un camino más largo', () => {
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
      { source: 'a', target: 'c' },
    ];
    expect(transitiveReduction(['a', 'b', 'c'], edges)).toEqual([
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
    ]);
  });
});

describe('placeWithGaps', () => {
  it('respeta la separación mínima y no desplaza el conjunto hacia un lado', () => {
    const xs = placeWithGaps([0, 0, 0], [10, 10]);
    expect(xs).toEqual([-10, 0, 10]);
  });

  it('deja en su sitio los nodos que no se solapan', () => {
    expect(placeWithGaps([0, 50], [10])).toEqual([0, 50]);
  });
});

describe('computeDagLayout', () => {
  // p: primitivo; ax1, ax2: axiomas; def: definición que usa ax1 y que ax2 necesita (arista hacia arriba).
  const ids = ['p', 'ax1', 'def', 'ax2', 'set', 'rel', 'thm', 'euc'];
  const edges = [
    { source: 'p', target: 'ax1' },
    { source: 'p', target: 'def' },
    { source: 'ax1', target: 'def' },
    { source: 'def', target: 'ax2' },
    { source: 'ax2', target: 'thm' },
    { source: 'def', target: 'thm' },
    { source: 'p', target: 'thm' },
    { source: 'thm', target: 'euc' },
    { source: 'set', target: 'rel' },
    { source: 'rel', target: 'thm' },
  ];
  const layout = computeDagLayout({
    ids,
    edges,
    primitiveIds: new Set(['p']),
    axiomIds: ['ax1', 'ax2'],
    axiomFamily: { ax1: 'incidencia', ax2: 'congruencia' },
    side: { euc: 1 },
    freeIds: new Set(['set', 'rel']),
  });

  it('los axiomas ocupan solos una misma fila, bajo los primitivos', () => {
    expect(layout.layers.p).toBe(0);
    expect(layout.layers.ax1).toBe(1);
    expect(layout.layers.ax2).toBe(1);
    const axiomRow = ids.filter((id) => layout.layers[id] === 1);
    expect(axiomRow.sort()).toEqual(['ax1', 'ax2']);
  });

  it('separa las familias de axiomas y devuelve un grupo por familia', () => {
    expect(layout.axiomGroups.map((g) => g.family)).toEqual(['incidencia', 'congruencia']);
    expect(layout.positions.ax1.x).toBeLessThan(layout.positions.ax2.x);
  });

  it('las aristas que suben hacia un axioma se marcan aparte', () => {
    expect(layout.backEdges.has(edgeKey('def', 'ax2'))).toBe(true);
    expect(layout.backEdges.size).toBe(1);
  });

  it('el resto de dependencias quedan por encima de sus consecuentes', () => {
    for (const { source, target } of edges) {
      if (layout.backEdges.has(edgeKey(source, target))) continue;
      expect(layout.layers[source]).toBeLessThan(layout.layers[target]);
    }
  });

  it('marca como implicadas las aristas redundantes', () => {
    expect(layout.impliedEdges.has(edgeKey('p', 'def'))).toBe(true);
    expect(layout.impliedEdges.has(edgeKey('p', 'thm'))).toBe(true);
  });

  it('cuelga los fundamentos encima de su consecuente, por debajo de la fila de axiomas', () => {
    expect(layout.layers.rel).toBe(layout.layers.thm - 1);
    expect(layout.layers.set).toBeGreaterThanOrEqual(2);
  });

  it('lleva a la derecha los resultados euclídeos', () => {
    expect(layout.positions.euc.x).toBeGreaterThan(layout.positions.thm.x);
  });
});
