import { describe, it, expect } from 'vitest';
import graphStructureData from '@/data/graph/graph_structure.json';
import type { GraphStructure } from '@/data/graph/graphTypes';

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
    const validTypes = ['axioma', 'definicion', 'sistema-axiomatico', 'teorema', 'lema', 'corolario', 'demostracion', 'metodo', 'modelo', 'matematico', 'ejercicio', 'ejemplo', 'caso-de-uso', 'plan-de-estudio', 'unknown'];
    for (const node of Object.values(graph.nodes)) {
      expect(validTypes).toContain(node.type);
    }
  });

  it('theorems with proofs contain dependencies extracted from proof steps', () => {
    const theoremsWithProofs = Object.values(graph.nodes).filter(
      n => (n.type === 'teorema' || n.type === 'lema') && n.proofs && n.proofs.length > 0
    );
    expect(theoremsWithProofs.length).toBeGreaterThan(0);
    const hasExtractedDeps = theoremsWithProofs.some(
      n => n.proofs.some(p => p.dependencies && p.dependencies.length > 0)
    );
    expect(hasExtractedDeps).toBe(true);
  });
});

describe('graph_structure.json: rigor del DAG', () => {
  const deductive = new Set(['axioma', 'definicion', 'teorema', 'lema', 'corolario']);

  it('axiomas conservan sus dependencias hacia definiciones derivadas', () => {
    // III.5 se enuncia sobre triángulos y ángulos; el validador no debe descartar esas aristas.
    expect(graph.nodes['axioma-congruencia-5'].directDependencies).toEqual(
      expect.arrayContaining(['triangulo', 'angulo']),
    );
  });

  it('las dependencias solo apuntan a antecedentes deductivos', () => {
    for (const [id, node] of Object.entries(graph.nodes)) {
      const systemLevel = node.type === 'sistema-axiomatico' || node.type === 'modelo';
      for (const dep of [...node.directDependencies, ...node.proofs.flatMap(p => p.dependencies)]) {
        const depType = graph.nodes[dep].type;
        const ok = deductive.has(depType) || (systemLevel && depType === 'sistema-axiomatico');
        expect(ok, `${id} -> ${dep} (${depType})`).toBe(true);
      }
    }
  });

  it('los métodos de demostración se registran aparte', () => {
    const proofs = Object.values(graph.nodes).flatMap(n => n.proofs);
    expect(proofs.some(p => (p.methods ?? []).length > 0)).toBe(true);
    for (const p of proofs) {
      for (const m of p.methods ?? []) expect(graph.nodes[m].type).toBe('metodo');
    }
  });
});
