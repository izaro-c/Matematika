import dagre from 'dagre';
import graphData from '../store/graph_structure.json';

// ── Solo se muestran estos tipos en el grafo axiomático ──────────────────────
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

// ── Tipos exportados ─────────────────────────────────────────────────────────
export interface FlowNodeData {
  label: string;
  nodeType: string;
  description: string;
  isActive: boolean;
  /** Escala visual CSS (no influye en dagre) */
  scale: number;
  isHighlighted: boolean;
}

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: FlowNodeData;
  style: Record<string, unknown>;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  style?: Record<string, unknown>;
  markerEnd?: Record<string, unknown>;
}

/** El worker sólo recibe los axiomas desactivados (no el foco, que se trata en el componente) */
export interface WorkerInput {
  disabledAxioms: string[];
}

export interface WorkerOutput {
  nodes: FlowNode[];
  edges: FlowEdge[];
  /** Lista de adyacencia BIDIRECCIONAL para que el componente calcule BFS localmente */
  adjacency: Record<string, string[]>;
  activeStates: Record<string, boolean>;
}

// ── Dimensiones fijas: NUNCA cambian para que dagre sea estable ───────────────
const NODE_W = 210;
const NODE_H = 64;

function filterNodes(): Record<string, JsonNode> {
  const out: Record<string, JsonNode> = {};
  for (const [id, node] of Object.entries(structure.nodes)) {
    if (VISIBLE_TYPES.has(node.type)) out[id] = node;
  }
  return out;
}

/**
 * Construye aristas SÓLO entre nodos visibles.
 * Dirección: dependencia (arriba) → nodo dependiente (abajo).
 * Esto garantiza que dagre coloque los axiomas en el nivel superior.
 */
function buildEdgeList(filtered: Record<string, JsonNode>): Array<{ source: string; target: string }> {
  const ids = new Set(Object.keys(filtered));
  const edges: Array<{ source: string; target: string }> = [];
  const seen = new Set<string>();

  for (const [id, node] of Object.entries(filtered)) {
    let deps: string[] = [];

    if (node.type === 'teorema' || node.type === 'corolario') {
      // Los deps vienen de las pruebas (lógica OR sobre pruebas, AND sobre deps de cada prueba)
      for (const proof of node.proofs) {
        for (const dep of proof.dependencies) {
          deps.push(dep);
        }
      }
    } else if (node.type === 'lema' || node.type === 'definicion') {
      deps = [...node.directDependencies];
    }
    // axiomas no tienen dependencias visibles

    for (const dep of deps) {
      if (!ids.has(dep)) continue; // ignorar deps no visibles (definiciones, etc.)
      const key = `${dep}→${id}`;
      if (!seen.has(key)) {
        seen.add(key);
        // dep está ENCIMA (source), id está DEBAJO (target)
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
        // Válido si al menos UNA prueba tiene TODAS sus deps activas (OR sobre AND)
        active[id] = node.proofs.some((proof) =>
          proof.dependencies.every((dep) => {
            if (!filtered[dep]) return true; // dep fuera del grafo visible → siempre activo
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

// ── Handler principal ────────────────────────────────────────────────────────
self.onmessage = (event: MessageEvent<WorkerInput>) => {
  const { disabledAxioms } = event.data;
  const disabledSet = new Set(disabledAxioms);

  const filtered = filterNodes();
  const activeStates = evaluateActiveNodes(filtered, disabledSet);
  const edgeList = buildEdgeList(filtered);

  // ── Layout con dagre: dimensiones FIJAS (la escala visual es responsabilidad del componente) ──
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: 'TB',   // top → bottom: axiomas arriba, corolarios abajo
    ranksep: 90,
    nodesep: 55,
    marginx: 50,
    marginy: 50,
  });

  for (const id of Object.keys(filtered)) {
    g.setNode(id, { width: NODE_W, height: NODE_H });
  }
  for (const { source, target } of edgeList) {
    g.setEdge(source, target);
  }

  dagre.layout(g);

  // ── Adyacencia bidireccional para BFS en el componente ───────────────────
  const adjacency: Record<string, string[]> = {};
  for (const id of Object.keys(filtered)) adjacency[id] = [];
  for (const { source, target } of edgeList) {
    adjacency[source].push(target);
    adjacency[target].push(source);
  }

  // ── Nodos React Flow ─────────────────────────────────────────────────────
  const flowNodes: FlowNode[] = Object.keys(filtered).map((id) => {
    const node = filtered[id];
    const pos = g.node(id);
    // Título: usar el campo title del JSON si existe, si no formatear el id
    const label = node.title || id.replace(/[-_]/g, ' ');
    return {
      id,
      type: 'mathNode',
      position: {
        x: pos.x - NODE_W / 2,
        y: pos.y - NODE_H / 2,
      },
      data: {
        label,
        nodeType: node.type,
        description: node.description || '',
        isActive: activeStates[id] ?? true,
        scale: 1,
        isHighlighted: false,
      },
      style: { width: NODE_W, height: NODE_H },
    };
  });

  // ── Aristas React Flow ──────────────────────────────────────────────────
  const flowEdges: FlowEdge[] = edgeList.map(({ source, target }) => {
    const srcActive = activeStates[source] ?? true;
    const tgtActive = activeStates[target] ?? true;
    const isLive = srcActive && tgtActive;
    return {
      id: `e-${source}-${target}`,
      source,
      target,
      type: 'smoothstep',
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

  self.postMessage({ nodes: flowNodes, edges: flowEdges, adjacency, activeStates } as WorkerOutput);
};
