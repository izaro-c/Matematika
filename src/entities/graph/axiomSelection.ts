export interface SelectableAxiom {
  id: string;
  alternativeGroup?: string;
}

export interface AxiomSelectionConflict {
  group: string;
  axiomIds: string[];
}

/** Devuelve las alternativas incompatibles activas dentro de una selección. */
export function findAxiomSelectionConflicts(
  axioms: readonly SelectableAxiom[],
  activeAxiomIds: Iterable<string>,
): AxiomSelectionConflict[] {
  const active = new Set(activeAxiomIds);
  const activeByGroup = new Map<string, string[]>();

  for (const axiom of axioms) {
    if (!axiom.alternativeGroup || !active.has(axiom.id)) continue;
    const group = activeByGroup.get(axiom.alternativeGroup) ?? [];
    group.push(axiom.id);
    activeByGroup.set(axiom.alternativeGroup, group);
  }

  return [...activeByGroup.entries()]
    .filter(([, axiomIds]) => axiomIds.length > 1)
    .map(([group, axiomIds]) => ({ group, axiomIds }));
}

/**
 * Normaliza una petición de axiomas activos.
 *
 * Si se activa una alternativa concreta, `preferredAxiomId` reemplaza a las
 * demás de su grupo. Las selecciones masivas o persistidas que contengan una
 * contradicción se degradan a la base neutral, sin ninguna alternativa del
 * grupo conflictivo.
 */
export function normalizeActiveAxiomIds(
  axioms: readonly SelectableAxiom[],
  requestedAxiomIds: Iterable<string>,
  preferredAxiomId?: string,
): string[] {
  const knownIds = new Set(axioms.map((axiom) => axiom.id));
  const active = new Set([...requestedAxiomIds].filter((id) => knownIds.has(id)));
  const preferred = preferredAxiomId
    ? axioms.find((axiom) => axiom.id === preferredAxiomId)
    : undefined;

  if (preferred?.alternativeGroup && active.has(preferred.id)) {
    for (const axiom of axioms) {
      if (axiom.alternativeGroup === preferred.alternativeGroup && axiom.id !== preferred.id) {
        active.delete(axiom.id);
      }
    }
  }

  for (const conflict of findAxiomSelectionConflicts(axioms, active)) {
    for (const axiomId of conflict.axiomIds) active.delete(axiomId);
  }

  return axioms.filter((axiom) => active.has(axiom.id)).map((axiom) => axiom.id);
}

export function disabledAxiomIdsFromActive(
  axioms: readonly SelectableAxiom[],
  activeAxiomIds: Iterable<string>,
): string[] {
  const active = new Set(activeAxiomIds);
  return axioms.filter((axiom) => !active.has(axiom.id)).map((axiom) => axiom.id);
}
