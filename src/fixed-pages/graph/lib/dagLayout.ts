/**
 * Layout por capas del DAG deductivo (Sugiyama), puro y sin dependencias.
 *
 * 1. Filas fijas: los primitivos ocupan la fila 0 y los axiomas la fila 1, solos y
 *    agrupados por familia, para que el lector los encuentre y los active de un vistazo.
 *    Las aristas que llegan a un axioma desde una definición derivada (III.1 → segmento)
 *    apuntan hacia arriba: se conservan como `backEdges`, pero no condicionan el layout.
 * 2. Reducción transitiva: solo se dibujan las aristas que no se deducen de otras.
 * 3. Capas: camino más largo y después se baja cada nodo hasta justo encima de su primer
 *    consecuente, para acortar aristas. Los fundamentos ajenos a la geometría (conjuntos,
 *    álgebra) se cuelgan encima de quien los usa, en su propia columna.
 * 4. Orden: nodos ficticios en las aristas largas y barridos por mediana, conservando
 *    el orden con menos cruces.
 * 5. Posición horizontal: cada capa se coloca lo más cerca posible de la media de sus
 *    vecinos con separación mínima, resuelto exactamente por regresión isotónica
 *    (sin el desplazamiento hacia la derecha de una compactación en un solo sentido).
 *    Los resultados de una teoría concreta se desplazan a su lado: euclídeos a la
 *    derecha, hiperbólicos a la izquierda, absolutos en el centro.
 */

export interface DagLayoutEdge {
  source: string;
  target: string;
}

export interface DagLayoutInput {
  /** IDs en orden topológico (las dependencias antes que sus consecuentes). */
  ids: string[];
  edges: DagLayoutEdge[];
  /** Conceptos primitivos: fila 0. */
  primitiveIds?: Set<string>;
  /** Axiomas en el orden en que se muestran: fila 1, solos. */
  axiomIds?: string[];
  /** Familia de cada axioma; entre familias se deja un hueco mayor. */
  axiomFamily?: Record<string, string>;
  /** −1 hiperbólico, 0 absoluto, +1 euclídeo. */
  side?: Record<string, number>;
  /** Fundamentos ajenos a la geometría: se cuelgan encima de su primer consecuente, en su propia columna. */
  freeIds?: Set<string>;
  nodeWidth?: number;
  nodeHeight?: number;
  hgap?: number;
  vgap?: number;
  /** Hueco extra entre familias de axiomas. */
  familyGap?: number;
  /** Desplazamiento horizontal hacia el que tiran los nodos de cada lado. */
  sideOffset?: number;
}

export interface DagLayoutAxiomGroup {
  family: string;
  /** Extremos horizontales del grupo (bordes de los nodos). */
  left: number;
  right: number;
  top: number;
}

export interface DagLayoutResult {
  /** Esquina superior izquierda de cada nodo. */
  positions: Record<string, { x: number; y: number }>;
  layers: Record<string, number>;
  axiomGroups: DagLayoutAxiomGroup[];
  /** Aristas de la reducción transitiva, con los puntos intermedios (centros) por los que pasan. */
  displayEdges: Array<DagLayoutEdge & { points: Array<{ x: number; y: number }> }>;
  /** Claves `source→target` de las aristas implicadas por otras. */
  impliedEdges: Set<string>;
  /** Claves de las aristas que suben hacia la fila de axiomas. */
  backEdges: Set<string>;
}

const PRIMITIVE_ROW = 0;
const AXIOM_ROW = 1;
const FIRST_FREE_ROW = 2;
/** Aire extra encima y debajo de la fila de axiomas, para sus cartelas. */
const AXIOM_ROW_MARGIN = 90;

/** Columna de los fundamentos: a la izquierda, más allá de los hiperbólicos. */
const FREE_SIDE = -2;

export const edgeKey = (source: string, target: string) => `${source}→${target}`;

/** Aristas que no se deducen de un camino más largo. `ids` debe estar en orden topológico. */
export function transitiveReduction(ids: string[], edges: DagLayoutEdge[]): DagLayoutEdge[] {
  const preds = new Map<string, Set<string>>(ids.map((id) => [id, new Set()]));
  for (const { source, target } of edges) preds.get(target)?.add(source);

  const ancestors = new Map<string, Set<string>>();
  for (const id of ids) {
    const all = new Set<string>();
    for (const p of preds.get(id) ?? []) {
      all.add(p);
      for (const a of ancestors.get(p) ?? []) all.add(a);
    }
    ancestors.set(id, all);
  }

  const kept: DagLayoutEdge[] = [];
  for (const id of ids) {
    const direct = [...(preds.get(id) ?? [])];
    for (const p of direct) {
      const implied = direct.some((other) => other !== p && ancestors.get(other)?.has(p));
      if (!implied) kept.push({ source: p, target: id });
    }
  }
  return kept;
}

function assignLayers(
  ids: string[],
  edges: DagLayoutEdge[],
  pinned: Map<string, number>,
  free: Set<string>,
): Record<string, number> {
  const preds = new Map<string, string[]>(ids.map((id) => [id, []]));
  const succs = new Map<string, string[]>(ids.map((id) => [id, []]));
  for (const { source, target } of edges) {
    preds.get(target)?.push(source);
    succs.get(source)?.push(target);
  }

  const layer: Record<string, number> = {};
  const longestPath = (id: string, ignoreFree: boolean) => {
    let l = FIRST_FREE_ROW;
    for (const p of preds.get(id) ?? []) {
      if (ignoreFree && free.has(p)) continue;
      l = Math.max(l, layer[p] + 1);
    }
    return l;
  };

  // Los fundamentos no empujan a la geometría: primero se coloca lo demás.
  for (const id of ids) {
    if (pinned.has(id)) layer[id] = pinned.get(id)!;
    else if (free.has(id)) layer[id] = longestPath(id, false);
    else layer[id] = longestPath(id, true);
  }

  // Bajar cada nodo hasta justo encima de su consecuente más alto; los fundamentos se
  // cuelgan directamente encima de quien los usa.
  for (let i = ids.length - 1; i >= 0; i--) {
    const id = ids[i];
    const next = succs.get(id) ?? [];
    if (pinned.has(id) || next.length === 0) continue;
    const limit = Math.min(...next.map((s) => layer[s])) - 1;
    layer[id] = free.has(id) ? Math.max(FIRST_FREE_ROW, limit) : Math.max(layer[id], limit);
  }

  // Si un fundamento no cabía encima de su consecuente, este baja lo necesario.
  for (const id of ids) {
    if (pinned.has(id)) continue;
    for (const p of preds.get(id) ?? []) layer[id] = Math.max(layer[id], layer[p] + 1);
  }
  return layer;
}

interface LayeredGraph {
  order: string[][];
  up: Map<string, string[]>;
  down: Map<string, string[]>;
  chains: Map<string, string[]>;
  isDummy: Set<string>;
}

function buildLayeredGraph(
  edges: DagLayoutEdge[],
  layer: Record<string, number>,
  ids: string[],
  closedRows: Set<number>,
): LayeredGraph {
  const maxLayer = Math.max(0, ...ids.map((id) => layer[id]));
  const order: string[][] = Array.from({ length: maxLayer + 1 }, () => []);
  const up = new Map<string, string[]>();
  const down = new Map<string, string[]>();
  const isDummy = new Set<string>();
  const chains = new Map<string, string[]>();
  const add = (id: string) => {
    if (!up.has(id)) { up.set(id, []); down.set(id, []); }
  };
  for (const id of ids) { add(id); order[layer[id]].push(id); }

  for (const { source, target } of edges) {
    let prev = source;
    const chain: string[] = [];
    for (let l = layer[source] + 1; l < layer[target]; l++) {
      // Por una fila cerrada (la de axiomas) no pasan puntos de paso: la arista la cruza recta.
      if (closedRows.has(l)) continue;
      const dummy = `\u0000${edgeKey(source, target)}#${l}`;
      add(dummy);
      isDummy.add(dummy);
      order[l].push(dummy);
      chain.push(dummy);
      down.get(prev)!.push(dummy);
      up.get(dummy)!.push(prev);
      prev = dummy;
    }
    down.get(prev)!.push(target);
    up.get(target)!.push(prev);
    chains.set(edgeKey(source, target), chain);
  }
  return { order, up, down, chains, isDummy };
}

function countCrossings(upper: string[], lower: string[], up: Map<string, string[]>): number {
  const pos = new Map(upper.map((id, i) => [id, i]));
  const segs: Array<[number, number]> = [];
  lower.forEach((id, j) => {
    for (const p of up.get(id) ?? []) {
      const i = pos.get(p);
      if (i !== undefined) segs.push([i, j]);
    }
  });
  let crossings = 0;
  for (let a = 0; a < segs.length; a++) {
    for (let b = a + 1; b < segs.length; b++) {
      if ((segs[a][0] - segs[b][0]) * (segs[a][1] - segs[b][1]) < 0) crossings++;
    }
  }
  return crossings;
}

const totalCrossings = (order: string[][], up: Map<string, string[]>) =>
  order.slice(1).reduce((sum, layerIds, i) => sum + countCrossings(order[i], layerIds, up), 0);

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function minimizeCrossings(
  graph: LayeredGraph,
  sideOf: (id: string) => number,
  rankOf: (id: string) => number,
  fixedRows: Set<number>,
) {
  const { order, up, down } = graph;
  // Orden inicial: lado de la teoría y después orden topológico (las filas fijas ya vienen ordenadas).
  order.forEach((layerIds, l) => {
    if (!fixedRows.has(l)) layerIds.sort((a, b) => sideOf(a) - sideOf(b) || rankOf(a) - rankOf(b));
  });

  const sweep = (l: number, neighbors: Map<string, string[]>, ref: string[]) => {
    if (fixedRows.has(l)) return;
    const layerIds = order[l];
    const pos = new Map(ref.map((id, i) => [id, i]));
    const current = new Map(layerIds.map((id, i) => [id, i]));
    const key = new Map<string, number>();
    for (const id of layerIds) {
      const ps = (neighbors.get(id) ?? []).map((n) => pos.get(n)).filter((p): p is number => p !== undefined);
      // Sin vecinos en la capa de referencia: conserva su sitio relativo.
      key.set(id, ps.length > 0 ? median(ps) : current.get(id)! * (ref.length / Math.max(1, layerIds.length)));
    }
    layerIds.sort((a, b) => key.get(a)! - key.get(b)! || sideOf(a) - sideOf(b));
  };

  let best = order.map((l) => [...l]);
  let bestCrossings = totalCrossings(order, up);
  for (let iter = 0; iter < 12 && bestCrossings > 0; iter++) {
    if (iter % 2 === 0) for (let l = 1; l < order.length; l++) sweep(l, up, order[l - 1]);
    else for (let l = order.length - 2; l >= 0; l--) sweep(l, down, order[l + 1]);
    const crossings = totalCrossings(order, up);
    if (crossings < bestCrossings) {
      bestCrossings = crossings;
      best = order.map((l) => [...l]);
    }
  }
  best.forEach((l, i) => { order[i] = l; });
}

/**
 * Coloca `ids` (en ese orden) lo más cerca posible de `desired`, con `gaps[i]` entre i e i+1.
 * Mínimos cuadrados con restricciones de orden: regresión isotónica (pool adjacent violators).
 */
export function placeWithGaps(desired: number[], gaps: number[]): number[] {
  const offsets = [0];
  for (let i = 1; i < desired.length; i++) offsets.push(offsets[i - 1] + gaps[i - 1]);
  const blocks: Array<{ sum: number; count: number }> = [];
  desired.forEach((d, i) => {
    blocks.push({ sum: d - offsets[i], count: 1 });
    while (blocks.length > 1) {
      const last = blocks[blocks.length - 1];
      const prev = blocks[blocks.length - 2];
      if (prev.sum / prev.count <= last.sum / last.count) break;
      prev.sum += last.sum;
      prev.count += last.count;
      blocks.pop();
    }
  });
  const result: number[] = [];
  for (const block of blocks) {
    for (let k = 0; k < block.count; k++) result.push(block.sum / block.count + offsets[result.length]);
  }
  return result;
}

export function computeDagLayout(input: DagLayoutInput): DagLayoutResult {
  const {
    ids,
    nodeWidth = 150,
    nodeHeight = 150,
    hgap = 70,
    vgap = 220,
    familyGap = 90,
    sideOffset = 900,
  } = input;
  const idSet = new Set(ids);
  const edges = input.edges.filter((e) => idSet.has(e.source) && idSet.has(e.target));
  const side = input.side ?? {};
  const free = input.freeIds ?? new Set<string>();
  const primitives = input.primitiveIds ?? new Set<string>();
  const axioms = (input.axiomIds ?? []).filter((id) => idSet.has(id));
  const axiomSet = new Set(axioms);
  const axiomFamily = input.axiomFamily ?? {};
  const rank = new Map(ids.map((id, i) => [id, i]));

  // Las aristas hacia un axioma desde algo que no es primitivo suben: no ordenan el dibujo.
  const isBack = (e: DagLayoutEdge) => axiomSet.has(e.target) && !primitives.has(e.source);
  const backEdges = new Set(edges.filter(isBack).map((e) => edgeKey(e.source, e.target)));
  const forward = edges.filter((e) => !isBack(e));

  const reduced = transitiveReduction(ids, forward);
  const reducedKeys = new Set(reduced.map((e) => edgeKey(e.source, e.target)));
  const impliedEdges = new Set(
    forward.map((e) => edgeKey(e.source, e.target)).filter((k) => !reducedKeys.has(k)),
  );

  const pinned = new Map<string, number>();
  for (const id of primitives) if (idSet.has(id)) pinned.set(id, PRIMITIVE_ROW);
  for (const id of axioms) pinned.set(id, AXIOM_ROW);
  const layer = assignLayers(ids, reduced, pinned, free);
  const graph = buildLayeredGraph(reduced, layer, ids, new Set([AXIOM_ROW]));
  graph.order[AXIOM_ROW] = [
    ...axioms,
    ...graph.order[AXIOM_ROW].filter((id) => !axiomSet.has(id)),
  ];

  const sideOf = (id: string) => {
    if (graph.isDummy.has(id)) return 0;
    return free.has(id) ? FREE_SIDE : side[id] ?? 0;
  };
  minimizeCrossings(graph, sideOf, (id) => rank.get(id) ?? Number.MAX_SAFE_INTEGER, new Set([AXIOM_ROW]));

  const dummyWidth = 24;
  const widthOf = (id: string) => (graph.isDummy.has(id) ? dummyWidth : nodeWidth);
  const gapBetween = (a: string, b: string) => {
    if (graph.isDummy.has(a) && graph.isDummy.has(b)) return dummyWidth + 12;
    const base = (widthOf(a) + widthOf(b)) / 2 + hgap;
    const newFamily = axiomSet.has(a) && axiomSet.has(b) && axiomFamily[a] !== axiomFamily[b];
    return newFamily ? base + familyGap : base;
  };

  const x = new Map<string, number>();
  const placeLayer = (layerIds: string[], desired: number[]) => {
    const gaps = layerIds.slice(1).map((id, i) => gapBetween(layerIds[i], id));
    placeWithGaps(desired, gaps).forEach((value, i) => x.set(layerIds[i], value));
  };
  // Centros iniciales: cada capa centrada en 0. La fila de axiomas queda así, fija y centrada.
  for (const layerIds of graph.order) placeLayer(layerIds, layerIds.map(() => 0));

  const pull = (id: string) => sideOf(id) * sideOffset;
  const relax = (l: number, neighborMaps: Array<Map<string, string[]>>) => {
    if (l === AXIOM_ROW) return;
    const layerIds = graph.order[l];
    const desired = layerIds.map((id) => {
      const ns = neighborMaps.flatMap((m) => m.get(id) ?? []);
      const sideWeight = sideOf(id) !== 0 ? 1 : 0;
      const sum = ns.reduce((s, n) => s + x.get(n)!, 0) + sideWeight * pull(id);
      const count = ns.length + sideWeight;
      return count > 0 ? sum / count : x.get(id)!;
    });
    placeLayer(layerIds, desired);
  };

  for (let iter = 0; iter < 24; iter++) {
    for (let l = 1; l < graph.order.length; l++) relax(l, [graph.up]);
    for (let l = graph.order.length - 2; l >= 0; l--) relax(l, [graph.down]);
  }
  for (let iter = 0; iter < 8; iter++) {
    for (let l = 0; l < graph.order.length; l++) relax(l, [graph.up, graph.down]);
  }

  const yOfLayer = (l: number) =>
    l * vgap + (l >= AXIOM_ROW ? AXIOM_ROW_MARGIN : 0) + (l > AXIOM_ROW ? AXIOM_ROW_MARGIN / 2 : 0);

  const positions: Record<string, { x: number; y: number }> = {};
  for (const id of ids) positions[id] = { x: x.get(id)! - nodeWidth / 2, y: yOfLayer(layer[id]) };

  const displayEdges = reduced.map(({ source, target }) => ({
    source,
    target,
    points: (graph.chains.get(edgeKey(source, target)) ?? []).map((dummy) => {
      const l = Number(dummy.slice(dummy.lastIndexOf('#') + 1));
      return { x: x.get(dummy)!, y: yOfLayer(l) + nodeHeight / 2 };
    }),
  }));

  const axiomGroups: DagLayoutAxiomGroup[] = [];
  for (const id of axioms) {
    const family = axiomFamily[id] ?? '';
    const left = positions[id].x;
    const last = axiomGroups[axiomGroups.length - 1];
    if (last && last.family === family) last.right = left + nodeWidth;
    else axiomGroups.push({ family, left, right: left + nodeWidth, top: yOfLayer(AXIOM_ROW) });
  }

  return { positions, layers: layer, axiomGroups, displayEdges, impliedEdges, backEdges };
}
