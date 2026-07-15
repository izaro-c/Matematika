import { CONTENT_TYPE_CONFIG } from '@/shared/lib/constants';
import { CONTENT_TYPE_COLORS } from '@/shared/design/contentTypeColors';

export const NODE_URL_PREFIX: Record<string, string> = {
  axioma: 'axioma',
  definicion: 'definicion',
  concepto: 'definicion',
  modelo: 'modelo',
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
  mathematician: 'matematico',
  matematico: 'matematico',
};

const KNOWLEDGE_GRAPH_SPECIAL_GROUPS: Record<string, { label: string; colorType: string }> = {
  central: { label: 'Mapa', colorType: 'matematico' },
  branch: { label: 'Rama', colorType: 'teorema' },
};

const KNOWLEDGE_GRAPH_LEGEND_ORDER = [
  'teorema',
  'lema',
  'corolario',
  'axioma',
  'definicion',
  'modelo',
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

export const AXIOM_GROUPS = [
  { test: (id: string) => id.startsWith('axioma-incidencia'), color: CONTENT_TYPE_COLORS.teorema.cssVar, label: 'Incidencia' },
  { test: (id: string) => id.startsWith('axioma-orden'), color: CONTENT_TYPE_COLORS.lema.cssVar, label: 'Orden' },
  { test: (id: string) => id.startsWith('axioma-congruencia'), color: CONTENT_TYPE_COLORS.definicion.cssVar, label: 'Congruencia' },
  { test: (id: string) => ['axioma-paralelas-euclides', 'axioma-paralelas-hiperbolico'].includes(id), color: CONTENT_TYPE_COLORS.axioma.cssVar, label: 'Paralelas' },
];

export function getAxiomGroup(id: string): { color: string; label: string } | null {
  for (const g of AXIOM_GROUPS) {
    if (g.test(id)) return { color: g.color, label: g.label };
  }
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
