import {
  normalizeGraphWorkerError,
  parseGraphWorkerRequest,
} from './lib/graphWorkerContract';
import type {
  FlowEdge,
  FlowNode,
  GraphWorkerEvaluationOutput,
  GraphWorkerOutput,
  GraphWorkerResponse,
  GraphWorkerStructure,
  GraphWorkerNode,
} from './lib/graphWorkerContract';

export type {
  FlowEdge,
  FlowNode,
  FlowNodeData,
  GraphWorkerError,
  GraphWorkerErrorResponse,
  GraphWorkerEvaluatedResponse,
  GraphWorkerEvaluationOutput,
  GraphWorkerInitializedResponse,
  GraphWorkerOutput as WorkerOutput,
  GraphWorkerRequest as WorkerInput,
  GraphWorkerResponse,
} from './lib/graphWorkerContract';

const VISIBLE_TYPES = new Set(['axioma', 'lema', 'corolario', 'teorema', 'definicion', 'modelo']);

type JsonNode = GraphWorkerNode;

// La estructura y el último estado lógico permanecen en el worker tras la
// inicialización. Las evaluaciones posteriores no vuelven a transferir ni a
// preparar el DAG completo.
let structure: GraphWorkerStructure | null = null;
let preparedNodes: Record<string, JsonNode> | null = null;
let previousActiveStates: Record<string, boolean> | null = null;

const NODE_W = 150;
const NODE_H = 150;

function filterNodes(): Record<string, JsonNode> {
  if (!structure) return {};
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

  if (!structure) return active;

  for (const id of structure.topologicalOrder) {
    if (!filtered[id]) continue;
    const node = filtered[id];

    if (node.type === 'axioma') {
      active[id] = !disabledAxioms.has(id);
      continue;
    }

    // lema, teorema, corolario → OR sobre demostraciones
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

  const sortByNeighborBarycenter = (
    nodes: string[],
    neighbors: Record<string, string[]>,
    neighborLayer: number,
  ): void => {
    const neighborPositions = new Map(
      (byLayer[neighborLayer] ?? []).map((id, index) => [id, index]),
    );
    const barycenters = new Map<string, number>();

    for (const id of nodes) {
      const positions = neighbors[id]
        .filter((neighborId) => layers[neighborId] === neighborLayer)
        .map((neighborId) => neighborPositions.get(neighborId))
        .filter((position): position is number => position !== undefined);
      barycenters.set(
        id,
        positions.length > 0
          ? positions.reduce((sum, position) => sum + position, 0) / positions.length
          : Infinity,
      );
    }

    nodes.sort((left, right) => (
      (barycenters.get(left) ?? Infinity) - (barycenters.get(right) ?? Infinity)
    ));
  };

  // 4 iteraciones: 2 pasadas completas (top-down + bottom-up)
  for (let iter = 0; iter < 4; iter++) {
    // Top-down: ordenar capa i+1 según baricentro de padres en capa i
    for (let i = 1; i < layerKeys.length; i++) {
      const l = layerKeys[i];
      const prevL = layerKeys[i - 1];
      sortByNeighborBarycenter(byLayer[l], preds, prevL);
    }
    // Bottom-up: ordenar capa i según baricentro de hijos en capa i+1
    for (let i = layerKeys.length - 2; i >= 0; i--) {
      const l = layerKeys[i];
      const nextL = layerKeys[i + 1];
      sortByNeighborBarycenter(byLayer[l], succs, nextL);
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

 
export async function initializeGraph(
  graphData: GraphWorkerStructure,
  disabledAxioms: string[],
): Promise<GraphWorkerOutput> {
  structure = graphData;
  const disabledSet = new Set(disabledAxioms);

  const filtered = filterNodes();
  const activeStates = evaluateActiveNodes(filtered, disabledSet);
  preparedNodes = filtered;
  previousActiveStates = activeStates;
  const edgeList = buildEdgeList(filtered);

  const nodeIds = Object.keys(filtered);
  const nodeIdSet = new Set(nodeIds);
  const axiomIds = new Set(nodeIds.filter(id => filtered[id].type === 'axioma'));
  const primitiveIds = new Set(nodeIds.filter(id => filtered[id].type === 'definicion' && filtered[id].subtype === 'primitivo'));

  const sortedIds = structure.topologicalOrder.filter(id => nodeIdSet.has(id));
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

  const flowEdges: FlowEdge[] = edgeList.map(({ source, target }) => {
    const srcNode = filtered[source];

    let strokeDasharray: string | undefined;
    if (srcNode?.type === 'lema') {
      strokeDasharray = '6,4';
    } else if (srcNode?.type === 'definicion' && srcNode?.subtype !== 'primitivo') {
      strokeDasharray = '2,3';
    }

    return {
      id: `e-${source}-${target}`,
      source,
      target,
      type: 'default',
      style: {
        ...(strokeDasharray ? { strokeDasharray } : {}),
      },
      markerEnd: {
        type: 'arrowclosed',
        width: 10,
        height: 10,
      },
    };
  });

  return { nodes: flowNodes, edges: flowEdges, adjacency, activeStates, dependsOn };
}

export async function evaluateGraph(
  disabledAxioms: string[],
): Promise<GraphWorkerEvaluationOutput> {
  if (!preparedNodes || !previousActiveStates) {
    throw {
      code: 'NOT_INITIALIZED',
      message: 'Graph worker must be initialized before evaluation',
    };
  }

  const nextActiveStates = evaluateActiveNodes(preparedNodes, new Set(disabledAxioms));
  const changedActiveStates: Record<string, boolean> = {};

  for (const [id, isActive] of Object.entries(nextActiveStates)) {
    if (previousActiveStates[id] !== isActive) {
      changedActiveStates[id] = isActive;
    }
  }

  previousActiveStates = nextActiveStates;
  return { changedActiveStates };
}

/**
 * Compatibilidad para consumidores puros y benchmarks. El flujo de producción
 * usa `initializeGraph` una vez y `evaluateGraph` para las interacciones.
 */
export const computeGraph = initializeGraph;

// ── Web Worker Interface ──────────────────────────────────────────────────────

export async function processGraphWorkerMessage(data: unknown): Promise<GraphWorkerResponse> {
  const parsed = parseGraphWorkerRequest(data);
  if (!parsed.ok) {
    return {
      type: 'error',
      requestId: parsed.requestId,
      error: parsed.error,
    };
  }

  try {
    if (parsed.value.type === 'initialize-graph') {
      const result = await initializeGraph(
        parsed.value.payload.graphData,
        parsed.value.payload.disabledAxioms,
      );
      return {
        type: 'initialized',
        requestId: parsed.value.requestId,
        result,
      };
    }

    const result = await evaluateGraph(parsed.value.payload.disabledAxioms);
    return {
      type: 'evaluated',
      requestId: parsed.value.requestId,
      result,
    };
  } catch (error: unknown) {
    return {
      type: 'error',
      requestId: parsed.value.requestId,
      error: normalizeGraphWorkerError(error),
    };
  }
}

if (typeof self !== 'undefined' && typeof window === 'undefined') {
  self.onmessage = async (e: MessageEvent<unknown>) => {
    self.postMessage(await processGraphWorkerMessage(e.data));
  };
}
