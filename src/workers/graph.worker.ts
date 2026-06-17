import graphData from '../store/graph_structure.json';

const VISIBLE_TYPES = new Set(['axioma', 'lema', 'corolario', 'teorema', 'definicion']);

interface JsonNode {
  id: string;
  type: string;
  title: string;
  description: string;
  proofs: { id: string; dependencies: string[] }[];
  directDependencies: string[];
}

const structure = graphData as {
  topologicalOrder: string[];
  nodes: Record<string, JsonNode>;
};

export interface FlowNodeData {
  label: string;
  nodeType: string;
  description: string;
  isActive: boolean;
  scale: number;
  isHighlighted: boolean;
}

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: FlowNodeData;
  width: number;
  height: number;
  style: Record<string, unknown>;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  style?: Record<string, unknown>;
  markerEnd?: Record<string, unknown>;
  data?: { points: Array<{ x: number; y: number }> };
}

export interface WorkerInput {
  disabledAxioms: string[];
}

export interface WorkerOutput {
  nodes: FlowNode[];
  edges: FlowEdge[];
  adjacency: Record<string, string[]>;
  activeStates: Record<string, boolean>;
  dependsOn: Record<string, string[]>;
}

const NODE_W = 150;
const NODE_H = 150;

function filterNodes(): Record<string, JsonNode> {
  const out: Record<string, JsonNode> = {};
  for (const [id, node] of Object.entries(structure.nodes)) {
    if (VISIBLE_TYPES.has(node.type)) out[id] = node;
  }
  return out;
}

function buildEdgeList(filtered: Record<string, JsonNode>): Array<{ source: string; target: string }> {
  const ids = new Set(Object.keys(filtered));
  const edges: Array<{ source: string; target: string }> = [];
  const seen = new Set<string>();

  for (const [id, node] of Object.entries(filtered)) {
    let deps: string[] = [];

    if (node.type === 'teorema' || node.type === 'corolario') {
      for (const proof of node.proofs) {
        for (const dep of proof.dependencies) {
          deps.push(dep);
        }
      }
    } else if (node.type === 'lema' || node.type === 'definicion') {
      deps = [...node.directDependencies];
    }

    for (const dep of deps) {
      if (!ids.has(dep)) continue;
      const key = `${dep}\u2192${id}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push({ source: dep, target: id });
      }
    }
  }
  return edges;
}

function evaluateActiveNodes(
  filtered: Record<string, JsonNode>,
  disabledAxioms: Set<string>,
): Record<string, boolean> {
  const active: Record<string, boolean> = {};

  for (const id of structure.topologicalOrder) {
    if (!filtered[id]) continue;
    const node = filtered[id];

    if (node.type === 'axioma') {
      active[id] = !disabledAxioms.has(id);
      continue;
    }

    if (node.type === 'teorema' || node.type === 'corolario') {
      if (node.proofs.length === 0) {
        active[id] = true;
      } else {
        active[id] = node.proofs.some((proof) =>
          proof.dependencies.every((dep) => {
            if (!filtered[dep]) return true;
            return active[dep] !== false;
          }),
        );
      }
      continue;
    }

    if (node.type === 'lema' || node.type === 'definicion') {
      if (node.directDependencies.length === 0) {
        active[id] = true;
      } else {
        active[id] = node.directDependencies.every((dep) => {
          if (!filtered[dep]) return true;
          return active[dep] !== false;
        });
      }
      continue;
    }

    active[id] = true;
  }

  return active;
}

// ── Layout basado en conexiones parentales ────────────────────────────────
function computeLayers(
  topologicalOrder: string[],
  edgeList: Array<{ source: string; target: string }>,
  axiomIds: Set<string>,
): Record<string, number> {
  const preds: Record<string, string[]> = {};
  for (const id of topologicalOrder) preds[id] = [];
  for (const { source, target } of edgeList) {
    preds[target].push(source);
  }

  const layers: Record<string, number> = {};

  for (const id of topologicalOrder) {
    if (axiomIds.has(id)) {
      layers[id] = 0;
    } else if (preds[id].length === 0) {
      layers[id] = 1;
    } else {
      let l = 0;
      for (const p of preds[id]) {
        if (layers[p] !== undefined) {
          l = Math.max(l, layers[p] + 1);
        }
      }
      layers[id] = Math.max(1, l);
    }
  }

  return layers;
}

function arrangeLayers(
  nodeIds: string[],
  layers: Record<string, number>,
  edgeList: Array<{ source: string; target: string }>,
): Record<string, { x: number; y: number }> {
  const hgap = 70;
  const vgap = 250;
  const minDist = NODE_W + hgap;

  const byLayer: Record<number, string[]> = {};
  for (const id of nodeIds) {
    const l = layers[id];
    if (!byLayer[l]) byLayer[l] = [];
    byLayer[l].push(id);
  }

  const layerKeys = Object.keys(byLayer).map(Number).sort((a, b) => a - b);

  const preds: Record<string, string[]> = {};
  const succs: Record<string, string[]> = {};
  for (const id of nodeIds) { preds[id] = []; succs[id] = []; }
  for (const { source, target } of edgeList) {
    preds[target].push(source);
    succs[source].push(target);
  }

  const xPos: Record<string, number> = {};

  // Top-down positioning
  for (const l of layerKeys) {
    if (l === 0) {
      // Axioms: evenly spaced, centered
      const totalW = byLayer[l].length * NODE_W + (byLayer[l].length - 1) * hgap;
      let cx = -totalW / 2 + NODE_W / 2;
      for (const id of byLayer[l]) {
        xPos[id] = cx;
        cx += NODE_W + hgap;
      }
    } else {
      const connected: string[] = [];
      const free: string[] = [];

      for (const id of byLayer[l]) {
        const hp = preds[id].some(p => layers[p] < l);
        const hc = succs[id].some(c => layers[c] > l);
        if (hp || hc) connected.push(id);
        else free.push(id);
      }

      if (connected.length === 0) {
        let cx = 0;
        for (const id of byLayer[l]) { xPos[id] = cx; cx += minDist; }
        continue;
      }

      // Compute desired x from parents (only; no bottom-up blending)
      const desired: Record<string, number> = {};
      for (const id of connected) {
        const parents = preds[id].filter(p => layers[p] < l);
        if (parents.length > 0) {
          desired[id] = parents.reduce((s, p) => s + (xPos[p] ?? 0), 0) / parents.length;
        } else {
          // Already connected but no parents in previous layer → use children
          const children = succs[id].filter(c => layers[c] > l);
          desired[id] = children.reduce((s, c) => s + (xPos[c] ?? 0), 0) / children.length;
        }
      }

      // Resolve overlaps (just enough to avoid collisions)
      const sorted = [...connected].sort((a, b) => (desired[a] ?? 0) - (desired[b] ?? 0));
      let prev = desired[sorted[0]] ?? 0;
      for (const id of sorted) {
        const d = desired[id] ?? prev;
        const placed = Math.max(d, prev);
        xPos[id] = placed;
        prev = placed + minDist;
      }

      // Free nodes to the right
      const rightEdge = prev;
      let pos = rightEdge;
      for (const id of free) {
        xPos[id] = pos;
        pos += minDist;
      }
    }
  }

  // Center entire graph horizontally
  const allX = Object.values(xPos);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const shift = -minX - (maxX - minX) / 2;
  for (const id of nodeIds) {
    xPos[id] = (xPos[id] ?? 0) + shift;
  }

  const positions: Record<string, { x: number; y: number }> = {};
  for (const id of nodeIds) {
    positions[id] = { x: xPos[id] ?? 0, y: layers[id] * vgap };
  }

  return positions;
}

export async function computeGraph(disabledAxioms: string[]): Promise<WorkerOutput> {
  const disabledSet = new Set(disabledAxioms);

  const filtered = filterNodes();
  const activeStates = evaluateActiveNodes(filtered, disabledSet);
  const edgeList = buildEdgeList(filtered);

  const nodeIds = Object.keys(filtered);
  const axiomIds = new Set(nodeIds.filter(id => filtered[id].type === 'axioma'));

  const sortedIds = structure.topologicalOrder.filter(id => nodeIds.includes(id));
  const layers = computeLayers(sortedIds, edgeList, axiomIds);

  const positions = arrangeLayers(nodeIds, layers, edgeList);

  const adjacency: Record<string, string[]> = {};
  const dependsOn: Record<string, string[]> = {};
  for (const id of nodeIds) {
    adjacency[id] = [];
    dependsOn[id] = [];
  }
  for (const { source, target } of edgeList) {
    adjacency[source].push(target);
    adjacency[target].push(source);
    dependsOn[target].push(source);
  }

  const flowNodes: FlowNode[] = nodeIds.map((id) => {
    const node = filtered[id];
    const pos = positions[id] ?? { x: 0, y: 0 };
    const label = node.title || id.replace(/[-_]/g, ' ');
    return {
      id,
      type: 'mathNode',
      position: { x: pos.x, y: pos.y },
      width: NODE_W,
      height: NODE_H,
      data: {
        label,
        nodeType: node.type,
        description: node.description || '',
        isActive: activeStates[id] ?? true,
        scale: 1,
        isHighlighted: false,
      },
      style: {},
    };
  });

  const flowEdges: FlowEdge[] = edgeList.map(({ source, target }) => {
    const srcActive = activeStates[source] ?? true;
    const tgtActive = activeStates[target] ?? true;
    const isLive = srcActive && tgtActive;
    return {
      id: `e-${source}-${target}`,
      source,
      target,
      type: 'default',
      style: {
        stroke: isLive ? '#333333AA' : '#33333322',
        strokeWidth: isLive ? 1.5 : 1,
      },
      markerEnd: {
        type: 'arrowclosed',
        color: isLive ? '#333333AA' : '#33333322',
        width: 10,
        height: 10,
      },
    };
  });

  return { nodes: flowNodes, edges: flowEdges, adjacency, activeStates, dependsOn };
}
