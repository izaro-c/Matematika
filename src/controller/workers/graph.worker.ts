export interface WorkerInput {
  graphData: any;
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
} = null as any;


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

// ── Layout basado en conexiones parentales ────────────────────────────────
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
    // Primitivos: capa 0 (Grado absoluto)
    if (primitiveIds.has(id)) {
      layers[id] = 0;
    } else if (axiomIds.has(id)) {
      // Axiomas: capa 1 (dependen de los primitivos)
      layers[id] = 1;
    } else if (preds[id].length === 0) {
      // Nodos sin dependencias que no son primitivos ni axiomas: capa 2 mínimo
      layers[id] = 2;
    } else {
      let l = 0;
      for (const p of preds[id]) {
        if (layers[p] !== undefined) {
          l = Math.max(l, layers[p] + 1);
        }
      }
      // Las definiciones derivadas y el resto empiezan en capa 2 como mínimo
      layers[id] = Math.max(2, l);
    }
  }

  return layers;
}

function positionLayer(
  l: number,
  layerNodes: string[],
  layers: Record<string, number>,
  preds: Record<string, string[]>,
  succs: Record<string, string[]>,
  xPos: Record<string, number>,
  minDist: number,
): void {
  const connected: string[] = [];
  const free: string[] = [];

  for (const id of layerNodes) {
    const hp = preds[id].some(p => layers[p] < l);
    const hc = succs[id].some(c => layers[c] > l);
    if (hp || hc) connected.push(id);
    else free.push(id);
  }

  if (connected.length === 0) {
    let cx = 0;
    for (const id of layerNodes) { xPos[id] = cx; cx += minDist; }
    return;
  }

  // Compute desired x from parents
  const desired: Record<string, number> = {};
  for (const id of connected) {
    const parents = preds[id].filter(p => layers[p] < l);
    if (parents.length > 0) {
      desired[id] = parents.reduce((s, p) => s + (xPos[p] ?? 0), 0) / parents.length;
    } else {
      const children = succs[id].filter(c => layers[c] > l);
      desired[id] = children.reduce((s, c) => s + (xPos[c] ?? 0), 0) / children.length;
    }
  }

  // Resolve overlaps
  const sorted = [...connected].sort((a, b) => (desired[a] ?? 0) - (desired[b] ?? 0));
  let prev = desired[sorted[0]] ?? 0;
  for (const id of sorted) {
    const placed = Math.max(desired[id] ?? prev, prev);
    xPos[id] = placed;
    prev = placed + minDist;
  }

  // Free nodes to the right
  let pos = prev;
  for (const id of free) {
    xPos[id] = pos;
    pos += minDist;
  }
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

  for (const l of layerKeys) {
    if (l === 0) {
      const totalW = byLayer[l].length * NODE_W + (byLayer[l].length - 1) * hgap;
      let cx = -totalW / 2 + NODE_W / 2;
      for (const id of byLayer[l]) {
        xPos[id] = cx;
        cx += NODE_W + hgap;
      }
    } else {
      positionLayer(l, byLayer[l], layers, preds, succs, xPos, minDist);
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

export async function computeGraph(graphData: any, disabledAxioms: string[]): Promise<WorkerOutput> {
  structure = graphData;
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
    // Primitivos (conceptos): aristas sólidas, más gruesas — base ontológica
    const isFromPrimitive = srcNode?.type === 'definicion' && srcNode?.subtype === 'primitivo';
    const edgeColor = isFromPrimitive
      ? (isLive ? '#818cf8AA' : '#818cf822')
      : (isLive ? '#333333AA' : '#33333322');
    const edgeWidth = isFromPrimitive ? (isLive ? 2.5 : 1) : (isLive ? 1.5 : 1);

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
