import type { VisualConstraint } from './types';

/** Relaciones que solo pueden existir una vez en el mismo punto. */
const SINGLETON_KINDS = new Set<VisualConstraint['kind']>(['coincident', 'midpoint', 'reflection']);

const SINGLETON_LABELS: Partial<Record<VisualConstraint['kind'], string>> = {
  coincident: 'Coincidir con un punto',
  midpoint: 'Punto medio',
  reflection: 'Reflejo simétrico',
};

/** Pares de relaciones que no pueden coexistir en el mismo punto. */
const INCOMPATIBLE_PAIRS: Array<[VisualConstraint['kind'], VisualConstraint['kind'], string]> = [
  ['midpoint', 'distance', 'El punto medio ya fija la posición; no puede añadirse además una distancia fija.'],
  ['midpoint', 'coincident', 'El punto medio ya fija la posición; no puede coincidir con otro punto a la vez.'],
  ['coincident', 'distance', 'Si el punto coincide con otro, la distancia fija es redundante e incompatible.'],
  ['coincident', 'midpoint', 'Si el punto coincide con otro, no puede ser además punto medio de dos extremos.'],
  ['distance', 'midpoint', 'La distancia fija entra en conflicto con la definición de punto medio.'],
  ['distance', 'coincident', 'La distancia fija entra en conflicto con coincidir con otro punto.'],
];

function pairKey(a: VisualConstraint['kind'], b: VisualConstraint['kind']): string {
  return [a, b].sort().join('|');
}

const INCOMPATIBILITY_MESSAGES = new Map<string, string>();
for (const [a, b, message] of INCOMPATIBLE_PAIRS) {
  INCOMPATIBILITY_MESSAGES.set(pairKey(a, b), message);
}

export function getConstraintConflictReason(
  activeKinds: readonly VisualConstraint['kind'][],
  candidate: VisualConstraint['kind'],
  options?: { ignoreKind?: VisualConstraint['kind'] },
): string | undefined {
  const ignore = options?.ignoreKind;
  const active = activeKinds.filter(kind => kind !== ignore);

  if (SINGLETON_KINDS.has(candidate) && active.includes(candidate)) {
    const label = SINGLETON_LABELS[candidate] ?? candidate;
    return `Ya hay una relación «${label}». Edite la existente o elimínela antes de añadir otra.`;
  }

  for (const kind of active) {
    const message = INCOMPATIBILITY_MESSAGES.get(pairKey(kind, candidate));
    if (message) return message;
  }

  return undefined;
}

export const EXCLUDED_POINT_RELATION_KINDS = new Set<VisualConstraint['kind']>(['fixed', 'expression']);
