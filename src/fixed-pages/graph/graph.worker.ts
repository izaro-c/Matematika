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
import { findAxiomSelectionConflicts } from '@/data/graph/axiomSelection';
import { computeDagLayout, edgeKey } from './lib/dagLayout';
import { AXIOMATIC_NODE_SIZE } from './constants';

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

const NODE_W = AXIOMATIC_NODE_SIZE;
const NODE_H = AXIOMATIC_NODE_SIZE;

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

function assertConsistentAxiomSelection(
  filtered: Record<string, JsonNode>,
  disabledAxioms: Set<string>,
): void {
  const selectableAxioms = Object.values(filtered)
    .filter((node) => node.type === 'axioma')
    .map((node) => ({ id: node.id, alternativeGroup: node.alternativeGroup }));
  const activeAxiomIds = selectableAxioms
    .filter((axiom) => !disabledAxioms.has(axiom.id))
    .map((axiom) => axiom.id);
  const conflicts = findAxiomSelectionConflicts(selectableAxioms, activeAxiomIds);
  if (conflicts.length === 0) return;

  const conflict = conflicts[0];
  throw {
    code: 'INCONSISTENT_AXIOMS',
    message: `Selección axiomática inconsistente en ${conflict.group}: ${conflict.axiomIds.join(', ')}`,
  };
}

function evaluateActiveNodes(
  filtered: Record<string, JsonNode>,
  disabledAxioms: Set<string>,
): Record<string, boolean> {
  const active: Record<string, boolean> = {};

  if (!structure) return active;
  assertConsistentAxiomSelection(filtered, disabledAxioms);

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

// ── Layout ──────────────────────────────────────────────────────────────────

/** Orden de las familias en la fila de axiomas, como en los *Grundlagen*. */
const FAMILY_ORDER = ['incidencia', 'orden', 'congruencia', 'paralelas', 'continuidad'];

/** Lado de la teoría que fija cada axioma alternativo: euclídeo a la derecha, hiperbólico a la izquierda. */
const THEORY_SIDE: Record<string, number> = {
  'axioma-paralelas-euclides': 1,
  'axioma-paralelas-hiperbolico': -1,
};

/** Nodos sin ningún primitivo geométrico entre sus antecedentes: conjuntos, funciones, álgebra. */
function computeFoundationIds(
  sortedIds: string[],
  edgeList: Array<{ source: string; target: string }>,
  filtered: Record<string, JsonNode>,
): Set<string> {
  const preds: Record<string, string[]> = {};
  for (const id of sortedIds) preds[id] = [];
  for (const { source, target } of edgeList) preds[target]?.push(source);
  const geometric = new Set<string>();
  for (const id of sortedIds) {
    const node = filtered[id];
    const isPrimitive = node.type === 'definicion' && node.subtype === 'primitivo';
    if (isPrimitive || node.type === 'axioma' || preds[id].some((p) => geometric.has(p))) geometric.add(id);
  }
  return new Set(sortedIds.filter((id) => !geometric.has(id)));
}

function computeSides(
  sortedIds: string[],
  edgeList: Array<{ source: string; target: string }>,
): Record<string, number> {
  const preds: Record<string, string[]> = {};
  for (const id of sortedIds) preds[id] = [];
  for (const { source, target } of edgeList) preds[target]?.push(source);
  const reaches: Record<string, Set<number>> = {};
  const side: Record<string, number> = {};
  for (const id of sortedIds) {
    const own = new Set<number>(THEORY_SIDE[id] ? [THEORY_SIDE[id]] : []);
    for (const p of preds[id]) for (const s of reaches[p] ?? []) own.add(s);
    reaches[id] = own;
    // Un nodo que necesita ambas alternativas no es de ninguna teoría concreta.
    side[id] = own.size === 1 ? [...own][0] : 0;
  }
  return side;
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

  const sortedIds = structure.topologicalOrder.filter(id => nodeIdSet.has(id));
  const primitiveIds = new Set(nodeIds.filter((id) => filtered[id].type === 'definicion' && filtered[id].subtype === 'primitivo'));
  const axiomFamily: Record<string, string> = {};
  for (const id of nodeIds) {
    if (filtered[id].type === 'axioma') axiomFamily[id] = filtered[id].axiomFamily ?? 'otros';
  }
  const familyRank = (id: string) => {
    const index = FAMILY_ORDER.indexOf(axiomFamily[id]);
    return index === -1 ? FAMILY_ORDER.length : index;
  };
  const side = computeSides(sortedIds, edgeList);
  // Dentro de cada familia, el orden de los Grundlagen (I.1, I.2…); en paralelas, el hiperbólico a la izquierda.
  const axiomIds = sortedIds
    .filter((id) => id in axiomFamily)
    .sort((left, right) => familyRank(left) - familyRank(right)
      || (side[left] ?? 0) - (side[right] ?? 0)
      || left.localeCompare(right, 'es', { numeric: true }));
  const layout = computeDagLayout({
    ids: sortedIds,
    edges: edgeList,
    primitiveIds,
    axiomIds,
    axiomFamily,
    side,
    freeIds: computeFoundationIds(sortedIds, edgeList, filtered),
    nodeWidth: NODE_W,
    nodeHeight: NODE_H,
  });
  const positions = layout.positions;
  const pointsByEdge = new Map(layout.displayEdges.map((e) => [edgeKey(e.source, e.target), e.points]));

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
        layer: layout.layers[id],
        side: side[id],
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
      type: 'ink',
      data: {
        points: pointsByEdge.get(edgeKey(source, target)) ?? [],
        implied: layout.impliedEdges.has(edgeKey(source, target)),
        back: layout.backEdges.has(edgeKey(source, target)),
        fromPrimitive: primitiveIds.has(source),
      },
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

  return { nodes: flowNodes, edges: flowEdges, adjacency, activeStates, dependsOn, axiomGroups: layout.axiomGroups };
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
