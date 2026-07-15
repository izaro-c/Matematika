import type { GraphNodeMeta } from './graphTypes';

const THEOREM_TYPES = new Set([
  'teorema', 'theorem', 'lema', 'lemma', 'corolario', 'corollary',
]);

export class Nodo {
  readonly id: string;
  readonly type: string;
  readonly alternativeGroup?: string;
  readonly proofs: GraphNodeMeta['proofs'];
  readonly directDependencies: string[];

  constructor(id: string, meta: GraphNodeMeta) {
    this.id = id;
    this.type = meta.type;
    this.alternativeGroup = meta.alternativeGroup;
    this.proofs = meta.proofs;
    this.directDependencies = meta.directDependencies;
  }

  get isAxiom(): boolean {
    return this.type === 'axioma';
  }

  get isTheorem(): boolean {
    return THEOREM_TYPES.has(this.type);
  }

  isSatisfiedBy(validNodes: Set<string>): boolean {
    if (this.isTheorem) {
      if (this.proofs.length > 0) {
        return this.proofs.some((p) =>
          p.dependencies.every((depId) => validNodes.has(depId)),
        );
      }
      return this.directDependencies.length === 0;
    }
    return (
      this.directDependencies.length === 0 ||
      this.directDependencies.every((depId) => validNodes.has(depId))
    );
  }
}
