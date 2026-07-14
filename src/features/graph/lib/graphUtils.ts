import { CONTENT_TYPE_CONFIG } from '@/shared/lib/constants';
import { CONTENT_TYPE_COLORS } from '@/shared/design/contentTypeColors';

export const NODE_URL_PREFIX: Record<string, string> = {
  axioma: 'axioma',
  definicion: 'definicion',
  concepto: 'definicion',
  modelo: 'modelo',
};

export function getNodeTypeColor(type: string): string {
  const config = CONTENT_TYPE_CONFIG[type];
  return config?.graphColor ?? '#888';
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
