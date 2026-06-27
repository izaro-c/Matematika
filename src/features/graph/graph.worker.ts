export interface WorkerInput {
  graphData: unknown;
  disabledAxioms: string[];
}

const VISIBLE_TYPES = new Set(['axioma', 'lema', 'corolario', 'teorema', 'definicion', 'modelo']);

interface JsonNode {
  id: string;
  type: string;
  subtype?: string;
  title: string;
  description: string;
  proofs: { id: string; dependencies: string[] }[];
  directDependencies: string[];
}

// Se inicializa en computeGraph()
let structure: {
  topologicalOrder: string[];
  nodes: Record<string, JsonNode>;
} = null as unknown as { topologicalOrder: string[]; nodes: Record<string, JsonNode> };


export interface FlowNodeData {
  label: string;
  nodeType: string;
  subtype?: string;
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

function getDependencies(node: JsonNode): string[] {
  // Si el nodo tiene demostraciones, las dependencias se calculan SOLO a partir de ellas (OR).
  if (node.proofs.length > 0) {
    const deps: string[] = [];
    for (const proof of node.proofs) {
      for (const dep of proof.dependencies) {
        deps.push(dep);
      }
    }
    return deps;
  }
  // Sin demostraciones, usar dependencias directas (metadatos y ConceptLinks)
  // Incluye axiomas (que ahora dependen de conceptos primitivos) y definiciones
  return [...node.directDependencies];
}

function addEdgeIfValid(
  edges: Array<{ source: string; target: string }>,
  seen: Set<string>,
  dep: string,
  id: string,
  ids: Set<string>,
): void {
  if (!ids.has(dep)) return;
  const key = `${dep}\u2192${id}`;
  if (seen.has(key)) return;
  seen.add(key);
  edges.push({ source: dep, target: id });
}

function buildEdgeList(filtered: Record<string, JsonNode>): Array<{ source: string; target: string }> {
  const ids = new Set(Object.keys(filtered));
  const edges: Array<{ source: string; target: string }> = [];
  const seen = new Set<string>();

  for (const [id, node] of Object.entries(filtered)) {
    for (const dep of getDependencies(node)) {
      addEdgeIfValid(edges, seen, dep, id, ids);
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

    // lema, teorema, corolario → OR sobre demostraciones
    // (misma lógica que el sandbox: Nodo.isSatisfiedBy → isTheorem)
    if (node.type === 'teorema' || node.type === 'corolario' || node.type === 'lema') {
      if (node.proofs.length === 0) {
        // Sin demostraciones: activo si no tiene dependencias directas
        active[id] = node.directDependencies.length === 0;
      } else {
        // OR: al menos una demostración con todas sus dependencias activas
        active[id] = node.proofs.some((proof) =>
          proof.dependencies.every((dep) => {
            if (!filtered[dep]) return false;
            return active[dep] !== false;
          }),
        );
      }
      continue;
    }

    // definicion, modelo → AND sobre dependencias directas
    if (node.directDependencies.length === 0) {
      active[id] = true;
    } else {
      active[id] = node.directDependencies.every((dep) => {
        if (!filtered[dep]) return true;
        return active[dep] !== false;
      });
    }
  }

  return active;
}

// ── Layout Sugiyama con Network Simplex ────────────────────────────────────

function computeLayers(
  topologicalOrder: string[],
  edgeList: Array<{ source: string; target: string }>,
  axiomIds: Set<string>,
  primitiveIds: Set<string>,
): Record<string, number> {
  const preds: Record<string, string[]> = {};
  for (const id of topologicalOrder) preds[id] = [];
  for (const { source, target } of edgeList) {
    preds[target].push(source);
  }

  const layers: Record<string, number> = {};

  for (const id of topologicalOrder) {
    if (primitiveIds.has(id)) {
      layers[id] = 0;
    } else if (axiomIds.has(id)) {
      layers[id] = 1;
    } else if (preds[id].length === 0) {
      layers[id] = 2;
    } else {
      let l = 0;
      for (const p of preds[id]) {
        if (layers[p] !== undefined) {
          l = Math.max(l, layers[p] + 1);
        }
      }
      layers[id] = Math.max(2, l);
    }
  }

  return layers;
}

// ── Cruce mínimo: baricentro en 2 pasadas ──────────────────────────────────
function minimizeCrossings(
  layers: Record<string, number>,
  edgeList: Array<{ source: string; target: string }>,
  layerKeys: number[],
  byLayer: Record<number, string[]>,
): void {
  const succs: Record<string, string[]> = {};
  const preds: Record<string, string[]> = {};
  for (const id of Object.keys(layers)) { succs[id] = []; preds[id] = []; }
  for (const { source, target } of edgeList) {
    succs[source].push(target);
    preds[target].push(source);
  }

  // 4 iteraciones: 2 pasadas completas (top-down + bottom-up)
  for (let iter = 0; iter < 4; iter++) {
    // Top-down: ordenar capa i+1 según baricentro de padres en capa i
    for (let i = 1; i < layerKeys.length; i++) {
      const l = layerKeys[i];
      const prevL = layerKeys[i - 1];
      byLayer[l].sort((a, b) => {
        const pa = preds[a].filter(p => layers[p] === prevL);
        const pb = preds[b].filter(p => layers[p] === prevL);
        const ba = pa.length > 0 ? pa.reduce((s, p) => s + byLayer[prevL].indexOf(p), 0) / pa.length : Infinity;
        const bb = pb.length > 0 ? pb.reduce((s, p) => s + byLayer[prevL].indexOf(p), 0) / pb.length : Infinity;
        return ba - bb;
      });
    }
    // Bottom-up: ordenar capa i según baricentro de hijos en capa i+1
    for (let i = layerKeys.length - 2; i >= 0; i--) {
      const l = layerKeys[i];
      const nextL = layerKeys[i + 1];
      byLayer[l].sort((a, b) => {
        const ca = succs[a].filter(c => layers[c] === nextL);
        const cb = succs[b].filter(c => layers[c] === nextL);
        const ba = ca.length > 0 ? ca.reduce((s, c) => s + byLayer[nextL].indexOf(c), 0) / ca.length : Infinity;
        const bb = cb.length > 0 ? cb.reduce((s, c) => s + byLayer[nextL].indexOf(c), 0) / cb.length : Infinity;
        return ba - bb;
      });
    }
  }
}

// ── Posicionamiento horizontal: Network Simplex relajado ────────────────────

// eslint-disable-next-line sonarjs/cognitive-complexity
function initTopDownPositions(
  layerKeys: number[],
  byLayer: Record<number, string[]>,
  preds: Record<string, string[]>,
  layers: Record<string, number>,
  minDist: number,
): { xPos: Record<string, number>; topDown: Record<string, number> } {
  const xPos: Record<string, number> = {};
  const topDown: Record<string, number> = {};

  for (const l of layerKeys) {
    const nodes = byLayer[l];
    if (l === 0) {
      const totalW = (nodes.length - 1) * minDist;
      let cx = -totalW / 2;
      for (const id of nodes) { topDown[id] = cx; cx += minDist; }
    } else {
      for (const id of nodes) {
        const parents = preds[id].filter(p => layers[p] === l - 1);
        topDown[id] = parents.length > 0
          ? parents.reduce((s, p) => s + (topDown[p] ?? 0), 0) / parents.length
          : 0;
      }
      const sorted = [...nodes].sort((a, b) => (topDown[a] ?? 0) - (topDown[b] ?? 0));
      let cursor = -Infinity;
      for (const id of sorted) {
        const placed = Math.max(topDown[id] ?? 0, cursor);
        xPos[id] = placed;
        cursor = placed + minDist;
      }
    }
  }
  for (const id of byLayer[0] ?? []) xPos[id] = topDown[id];

  return { xPos, topDown };
}

function relaxLayerPositions(
  layerKeys: number[],
  byLayer: Record<number, string[]>,
  preds: Record<string, string[]>,
  succs: Record<string, string[]>,
  xPos: Record<string, number>,
  layers: Record<string, number>,
  damping: number,
  minDist: number,
  nodeIds: string[],
): { xPos: Record<string, number>; maxChange: number } {
  const newX: Record<string, number> = {};
  let maxChange = 0;

  for (const l of layerKeys) {
    const nodes = byLayer[l];

    for (const id of nodes) {
      const neighbors = [
        ...preds[id].filter(p => layers[p] !== undefined),
        ...succs[id].filter(c => layers[c] !== undefined),
      ];
      if (neighbors.length > 0) {
        const avg = neighbors.reduce((s, n) => s + (xPos[n] ?? 0), 0) / neighbors.length;
        const desired = xPos[id] + (avg - xPos[id]) * damping;
        newX[id] = desired;
        maxChange = Math.max(maxChange, Math.abs(desired - xPos[id]));
      } else {
        newX[id] = xPos[id];
      }
    }

    const sorted = [...nodes].sort((a, b) => (newX[a] ?? 0) - (newX[b] ?? 0));
    let cursor = -Infinity;
    for (const id of sorted) {
      const placed = Math.max(newX[id] ?? 0, cursor);
      newX[id] = placed;
      cursor = placed + minDist;
    }
  }

  for (const id of nodeIds) {
    if (newX[id] !== undefined) xPos[id] = newX[id];
  }

  return { xPos, maxChange };
}

function horizontalPlacement(
  layers: Record<string, number>,
  layerKeys: number[],
  byLayer: Record<number, string[]>,
  edgeList: Array<{ source: string; target: string }>,
  nodeIds: string[],
  minDist: number,
): Record<string, number> {
  const succs: Record<string, string[]> = {};
  const preds: Record<string, string[]> = {};
  for (const id of nodeIds) { succs[id] = []; preds[id] = []; }
  for (const { source, target } of edgeList) {
    succs[source].push(target);
    preds[target].push(source);
  }

  const { xPos } = initTopDownPositions(layerKeys, byLayer, preds, layers, minDist);

  const MAX_ITER = 200;
  const DAMPING_START = 0.45;
  const DAMPING_END = 0.05;
  const CONVERGENCE_THRESHOLD = 1.0;

  for (let iter = 0; iter < MAX_ITER; iter++) {
    const progress = iter / MAX_ITER;
    const damping = DAMPING_START + (DAMPING_END - DAMPING_START) * progress;
    const result = relaxLayerPositions(layerKeys, byLayer, preds, succs, xPos, layers, damping, minDist, nodeIds);
    if (result.maxChange < CONVERGENCE_THRESHOLD) break;
  }

  return xPos;
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

  // Paso 1: minimizar cruces de aristas
  minimizeCrossings(layers, edgeList, layerKeys, byLayer);

  // Paso 2: posicionamiento horizontal con Network Simplex
  const xPos = horizontalPlacement(layers, layerKeys, byLayer, edgeList, nodeIds, minDist);

  const positions: Record<string, { x: number; y: number }> = {};
  for (const id of nodeIds) {
    positions[id] = { x: xPos[id] ?? 0, y: layers[id] * vgap };
  }

  return positions;
}

 
export async function computeGraph(graphData: unknown, disabledAxioms: string[]): Promise<WorkerOutput> {
  structure = graphData as { topologicalOrder: string[]; nodes: Record<string, JsonNode> };
  const disabledSet = new Set(disabledAxioms);

  const filtered = filterNodes();
  const activeStates = evaluateActiveNodes(filtered, disabledSet);
  const edgeList = buildEdgeList(filtered);

  const nodeIds = Object.keys(filtered);
  const axiomIds = new Set(nodeIds.filter(id => filtered[id].type === 'axioma'));
  const primitiveIds = new Set(nodeIds.filter(id => filtered[id].type === 'definicion' && filtered[id].subtype === 'primitivo'));

  const sortedIds = structure.topologicalOrder.filter(id => nodeIds.includes(id));
  const layers = computeLayers(sortedIds, edgeList, axiomIds, primitiveIds);

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
    const isPrimitive = node.type === 'definicion' && node.subtype === 'primitivo';
    const label = node.title || id.replace(/[-_]/g, ' ');
    const nodeTypeLabel = isPrimitive ? 'concepto' : node.type;
    return {
      id,
      type: 'mathNode',
      position: { x: pos.x, y: pos.y },
      width: NODE_W,
      height: NODE_H,
      data: {
        label,
        nodeType: nodeTypeLabel,
        subtype: node.subtype,
        description: node.description || '',
        isActive: activeStates[id] ?? true,
        scale: 1,
        isHighlighted: false,
      },
      style: {},
    };
  });

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const flowEdges: FlowEdge[] = edgeList.map(({ source, target }) => {
    const srcNode = filtered[source];
    const srcActive = activeStates[source] ?? true;
    const tgtActive = activeStates[target] ?? true;
    const isLive = srcActive && tgtActive;

    let strokeDasharray: string | undefined;
    if (srcNode?.type === 'lema') {
      strokeDasharray = '6,4';
    } else if (srcNode?.type === 'definicion' && srcNode?.subtype !== 'primitivo') {
      strokeDasharray = '2,3';
    }

    const isFromPrimitive = srcNode?.type === 'definicion' && srcNode?.subtype === 'primitivo';
    let edgeColor: string;
    let edgeWidth: number;
    if (isFromPrimitive) {
      edgeColor = isLive ? '#818cf8AA' : '#818cf822';
      edgeWidth = isLive ? 2.5 : 1;
    } else {
      edgeColor = isLive ? '#333333AA' : '#33333322';
      edgeWidth = isLive ? 1.5 : 1;
    }

    return {
      id: `e-${source}-${target}`,
      source,
      target,
      type: 'default',
      style: {
        stroke: edgeColor,
        strokeWidth: edgeWidth,
        ...(strokeDasharray ? { strokeDasharray } : {}),
      },
      markerEnd: {
        type: 'arrowclosed',
        color: edgeColor,
        width: 10,
        height: 10,
      },
    };
  });

  return { nodes: flowNodes, edges: flowEdges, adjacency, activeStates, dependsOn };
}

// ── Web Worker Interface ──────────────────────────────────────────────────────

if (typeof self !== 'undefined' && typeof window === 'undefined') {
  self.onmessage = async (e: MessageEvent<unknown>) => {
    const { graphData, disabledAxioms, msgId } = e.data as { msgId: number; graphData: unknown; disabledAxioms: string[] };
    try {
      const result = await computeGraph(graphData, disabledAxioms);
      self.postMessage({ msgId, result, error: null });
    } catch (err: unknown) {
      self.postMessage({ msgId, result: null, error: (err as Error).message });
    }
  };
}
