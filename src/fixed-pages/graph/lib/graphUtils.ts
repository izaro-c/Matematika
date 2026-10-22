import { CONTENT_TYPE_CONFIG } from '@/lib/theme/constants';
import { CONTENT_TYPE_COLORS } from '@/design/contentTypeColors';
import { getLanguage } from '@/i18n/config';

export const NODE_URL_PREFIX: Record<string, string> = {
  axioma: 'axioma',
  definicion: 'definicion',
  concepto: 'definicion',
  modelo: 'modelo',
  'sistema-axiomatico': 'sistema',
  metodo: 'metodo',
  'caso-de-uso': 'caso-de-uso',
};

const KNOWLEDGE_GRAPH_GROUP_TYPES: Record<string, string> = {
  axioma: 'axioma',
  axiom: 'axioma',
  definition: 'definicion',
  definicion: 'definicion',
  theorem: 'teorema',
  teorema: 'teorema',
  lemma: 'lema',
  lema: 'lema',
  corollary: 'corolario',
  corolario: 'corolario',
  modelo: 'modelo',
  model: 'modelo',
  'sistema-axiomatico': 'sistema-axiomatico',
  'axiomatic-system': 'sistema-axiomatico',
  metodo: 'metodo',
  method: 'metodo',
  'caso-de-uso': 'caso-de-uso',
  usecase: 'caso-de-uso',
  mathematician: 'matematico',
  matematico: 'matematico',
};

const KNOWLEDGE_GRAPH_SPECIAL_GROUPS: Record<string, { label: string; colorType: string }> = {
  central: { label: 'Mapa', colorType: 'matematico' },
  branch: { label: 'Rama', colorType: 'teorema' },
};

const KNOWLEDGE_GRAPH_LEGEND_ORDER = [
  'axioma',
  'sistema-axiomatico',
  'definicion',
  'teorema',
  'lema',
  'corolario',
  'modelo',
  'metodo',
  'caso-de-uso',
  'matematico',
] as const;

export function getKnowledgeGraphContentType(group: string): string | null {
  return KNOWLEDGE_GRAPH_GROUP_TYPES[group] ?? null;
}

export function getKnowledgeGraphGroupPresentation(group: string): {
  label: string;
  color: string;
} {
  const special = KNOWLEDGE_GRAPH_SPECIAL_GROUPS[group];
  if (special) {
    return {
      label: special.label,
      color: CONTENT_TYPE_CONFIG[special.colorType].graphColor,
    };
  }

  const contentType = getKnowledgeGraphContentType(group);
  const config = contentType ? CONTENT_TYPE_CONFIG[contentType] : undefined;
  return {
    label: config?.labelSingular ?? group,
    color: config?.graphColor ?? 'var(--theme-carbon)',
  };
}

/** Devuelve únicamente los tipos que tienen al menos un nodo en el grafo. */
export function getKnowledgeGraphLegendTypes(groups: Iterable<string>): string[] {
  const presentTypes = new Set<string>();
  for (const group of groups) {
    const contentType = getKnowledgeGraphContentType(group);
    if (contentType) presentTypes.add(contentType);
  }
  return KNOWLEDGE_GRAPH_LEGEND_ORDER.filter(type => presentTypes.has(type));
}

export function getNodeTypeColor(type: string): string {
  const config = CONTENT_TYPE_CONFIG[type];
  return config?.graphColor ?? 'var(--theme-carbon)';
}

export function getDependencyDotColor(type: string): string {
  return getNodeTypeColor(type);
}

export function getNodeUrlPrefix(type: string): string {
  return NODE_URL_PREFIX[type] ?? 'teorema';
}

export function getAxiomGroup(id: string, lang?: string): { color: string; label: string; familyKey: string } | null {
  const dict = getLanguage(lang).dictionary.axiomFamilies;
  if (id.startsWith('axioma-incidencia')) return { color: CONTENT_TYPE_COLORS.teorema.cssVar, label: dict.incidencia, familyKey: 'incidencia' };
  if (id.startsWith('axioma-orden')) return { color: CONTENT_TYPE_COLORS.lema.cssVar, label: dict.orden, familyKey: 'orden' };
  if (id.startsWith('axioma-congruencia')) return { color: CONTENT_TYPE_COLORS.definicion.cssVar, label: dict.congruencia, familyKey: 'congruencia' };
  if (['axioma-paralelas-euclides', 'axioma-paralelas-hiperbolico'].includes(id)) return { color: CONTENT_TYPE_COLORS.axioma.cssVar, label: dict.paralelas, familyKey: 'paralelas' };
  if (id === 'axioma-arquimedes' || id === 'axioma-completitud') return { color: CONTENT_TYPE_COLORS.axioma.cssVar, label: dict.continuidad, familyKey: 'continuidad' };
  return null;
}

export function computeDependencyChain(nodeId: string, dependsOn: Record<string, string[]>): Set<string> {
  const chain = new Set<string>();
  const stack = [nodeId];
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (chain.has(current)) continue;
    chain.add(current);
    for (const pred of (dependsOn[current] || [])) stack.push(pred);
  }
  return chain;
}

export type GraphDirection = 'up' | 'down' | 'left' | 'right';

/**
 * Nodo al que lleva una flecha del teclado desde `currentId`: arriba, la dependencia más
 * próxima en horizontal; abajo, el consecuente más próximo; a los lados, el vecino de fila.
 */
export function stepSelection(
  currentId: string,
  direction: GraphDirection,
  positions: Record<string, { x: number; y: number }>,
  dependsOn: Record<string, string[]>,
): string | null {
  const here = positions[currentId];
  if (!here) return null;
  let candidates: string[];
  if (direction === 'up') {
    candidates = (dependsOn[currentId] ?? []).filter((id) => positions[id]);
  } else if (direction === 'down') {
    candidates = Object.keys(dependsOn).filter((id) => positions[id] && dependsOn[id].includes(currentId));
  } else {
    const sign = direction === 'right' ? 1 : -1;
    candidates = Object.keys(positions).filter((id) =>
      id !== currentId && positions[id].y === here.y && (positions[id].x - here.x) * sign > 0);
  }
  let best: string | null = null;
  let bestDistance = Infinity;
  for (const id of candidates) {
    const distance = Math.abs(positions[id].x - here.x) + Math.abs(positions[id].y - here.y) * 0.01;
    if (distance < bestDistance) { best = id; bestDistance = distance; }
  }
  return best;
}

export interface ActivationFlow {
  kind: 'on' | 'off';
  /** Momento (ms) en que la tinta sale del origen. */
  start: number;
}

export interface ActivationSchedule {
  /** Momento (ms) en que cada nodo cambia de estado. */
  nodeAt: Map<string, number>;
  /** Recorrido de cada arista cuyo estado (viva o muerta) cambia, por clave `source→target`. */
  edgeAt: Map<string, ActivationFlow>;
  /** Lo que tarda la tinta en recorrer una arista (ms). */
  travel: number;
  total: number;
}

/**
 * Horario de la propagación tras un cambio de axiomas. Un nodo se enciende cuando le llega
 * la última línea que necesita y se apaga cuando le llega la primera que se rompe; cada línea
 * sale de su origen en el momento en que este cambia. Si la cascada dura más de `maxTotal`,
 * se comprime entera. Con `arrival: 'first'` un nodo se enciende con la primera línea que le
 * llega (útil para recorrer una cadena hacia arriba, donde los fundamentos reciben muchas).
 */
export function activationSchedule(
  order: string[],
  previous: Record<string, boolean>,
  next: Record<string, boolean>,
  edges: Array<{ source: string; target: string }>,
  travel = 240,
  maxTotal = 2800,
  arrival: 'last' | 'first' = 'last',
): ActivationSchedule {
  const preds = new Map<string, string[]>();
  for (const { source, target } of edges) {
    const list = preds.get(target) ?? [];
    list.push(source);
    preds.set(target, list);
  }
  const changed = (id: string) => (previous[id] ?? false) !== (next[id] ?? false);

  const nodeAt = new Map<string, number>();
  for (const id of order) {
    if (!changed(id)) continue;
    const causes = (preds.get(id) ?? []).filter((p) => nodeAt.has(p) && next[p] === next[id]);
    if (causes.length === 0) {
      nodeAt.set(id, 0);
      continue;
    }
    const arrivals = causes.map((p) => nodeAt.get(p)! + travel);
    const waitsForAll = next[id] && arrival === 'last';
    nodeAt.set(id, waitsForAll ? Math.max(...arrivals) : Math.min(...arrivals));
  }

  const rawTotal = Math.max(0, ...nodeAt.values());
  const scale = rawTotal > maxTotal ? maxTotal / rawTotal : 1;
  for (const [id, t] of nodeAt) nodeAt.set(id, t * scale);
  const scaledTravel = travel * scale;

  const at = (id: string) => nodeAt.get(id);
  const edgeAt = new Map<string, ActivationFlow>();
  for (const { source, target } of edges) {
    const before = (previous[source] ?? false) && (previous[target] ?? false);
    const after = (next[source] ?? false) && (next[target] ?? false);
    if (before === after) continue;
    const sourceAt = at(source);
    const targetAt = at(target);
    let start: number;
    if (after) start = Math.max(sourceAt ?? 0, (targetAt ?? 0) - scaledTravel);
    else start = sourceAt ?? (targetAt ?? 0) - scaledTravel;
    edgeAt.set(`${source}→${target}`, { kind: after ? 'on' : 'off', start: Math.max(0, start) });
  }

  return { nodeAt, edgeAt, travel: scaledTravel, total: rawTotal * scale + scaledTravel };
}
