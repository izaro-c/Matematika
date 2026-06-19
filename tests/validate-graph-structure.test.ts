import { describe, it, expect } from 'vitest';
import graphStructureData from '../src/store/graph_structure.json';
import type { GraphStructure } from '../src/store/graphUtils';

const graph = graphStructureData as unknown as GraphStructure;

describe('graph_structure.json', () => {
  it('has topologicalOrder array', () => {
    expect(Array.isArray(graph.topologicalOrder)).toBe(true);
    expect(graph.topologicalOrder.length).toBeGreaterThan(0);
  });

  it('has nodes record', () => {
    expect(graph.nodes).toBeDefined();
    expect(typeof graph.nodes).toBe('object');
    expect(Object.keys(graph.nodes).length).toBeGreaterThan(0);
  });

  it('topologicalOrder matches nodes keys', () => {
    const nodeKeys = new Set(Object.keys(graph.nodes));
    for (const id of graph.topologicalOrder) {
      expect(nodeKeys.has(id)).toBe(true);
    }
  });

  it('topologicalOrder has no duplicates', () => {
    const seen = new Set<string>();
    for (const id of graph.topologicalOrder) {
      expect(seen.has(id)).toBe(false);
      seen.add(id);
    }
  });

  it('no node references an ID outside the graph', () => {
    const allIds = new Set(graph.topologicalOrder);
    for (const node of Object.values(graph.nodes)) {
      for (const dep of node.directDependencies) {
        expect(allIds.has(dep)).toBe(true);
      }
      for (const proof of node.proofs) {
        for (const dep of proof.dependencies) {
          expect(allIds.has(dep)).toBe(true);
        }
      }
    }
  });

  it('all nodes have a valid type', () => {
    const validTypes = ['axioma', 'definicion', 'sistema-axiomatico', 'teorema', 'lema', 'corolario', 'demostracion', 'modelo', 'matematico', 'leccion', 'ejercicio', 'ejemplo', 'caso_de_uso', 'plan_de_estudio', 'unknown'];
    for (const node of Object.values(graph.nodes)) {
      expect(validTypes).toContain(node.type);
    }
  });
});
