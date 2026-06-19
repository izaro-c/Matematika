export interface GraphNodeProof {
  id: string;
  dependencies: string[];
}

export interface GraphNodeMeta {
  type: string;
  proofs: GraphNodeProof[];
  directDependencies: string[];
}

export interface GraphStructure {
  topologicalOrder: string[];
  nodes: Record<string, GraphNodeMeta>;
}

export interface ModelInfo {
  id: string;
  title: string;
  axioms: string[];
}

export interface SystemInfo {
  id: string;
  title: string;
  axioms: string[];
}

export interface GraphEdge {
  source: string;
  target: string;
}
