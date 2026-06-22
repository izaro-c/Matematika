import type { GraphStructure, ModelInfo } from './graphTypes';
import { Nodo } from './Nodo';

export class Grafo {
  private readonly order: string[];
  private readonly nodi: ReadonlyMap<string, Nodo>;

  private constructor(structure: GraphStructure) {
    this.order = [...structure.topologicalOrder];
    const map = new Map<string, Nodo>();
    for (const [id, meta] of Object.entries(structure.nodes)) {
      map.set(id, new Nodo(id, meta));
    }
    this.nodi = map;
  }

  static from(structure: GraphStructure): Grafo {
    return new Grafo(structure);
  }

  get topologicalOrder(): readonly string[] {
    return this.order;
  }

  getNodo(id: string): Nodo | undefined {
    return this.nodi.get(id);
  }

  isDagValid(): boolean {
    const seen = new Set<string>();
    for (const id of this.order) {
      if (!this.nodi.has(id)) return false;
      seen.add(id);
    }
    for (const id of this.nodi.keys()) {
      if (!seen.has(id)) return false;
    }
    return true;
  }

  evaluate(activeAxioms: Record<string, boolean>): Set<string> {
    const validNodes = new Set<string>();

    for (const [axiomId, isActive] of Object.entries(activeAxioms)) {
      if (isActive) validNodes.add(axiomId);
    }

    for (const nodeId of this.order) {
      if (validNodes.has(nodeId)) continue;
      const nodo = this.nodi.get(nodeId);
      if (!nodo) continue;
      if (nodo.isAxiom) continue;

      if (nodo.isSatisfiedBy(validNodes)) {
        validNodes.add(nodeId);
      }
    }

    return validNodes;
  }

  static computeDisabledAxiomsFromModels(
    models: ModelInfo[],
    activeModelIds: string[],
    allAxioms: string[] = [],
  ): string[] {
    if (activeModelIds.length === 0) return [];
    const activeModels = models.filter((m) => activeModelIds.includes(m.id));
    const enabled = new Set<string>();
    for (const m of activeModels) {
      for (const ax of m.axioms) enabled.add(ax);
    }
    return allAxioms.filter((ax) => !enabled.has(ax));
  }
}
