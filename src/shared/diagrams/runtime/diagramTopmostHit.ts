/**
 * Cuando varios objetos coinciden bajo el puntero, solo uno debe recibir el hit.
 *
 * Regla general: el de mayor `visualOrder` (cima del apilado).
 * Excepción por restricciones: si un punto es glider/`on` sobre un soporte
 * definido por otro punto también bajo el puntero (p. ej. D sobre rayo BC
 * coincidiendo con C), se prefiere el punto dependiente. Si no, al mover C el
 * glider permanece en el parámetro de C y es imposible separarlos.
 */

type HasPointElement = {
  hasPoint?: (x: number, y: number) => boolean;
  visPropCalc?: { visible?: boolean };
  __matematikaOriginalHasPoint?: (x: number, y: number) => boolean;
  __matematikaObjectId?: string;
};

export function buildVisualOrderById(
  entries: readonly { item: { id: string }; visualOrder: number }[],
): Map<string, number> {
  return new Map(entries.map(entry => [entry.item.id, entry.visualOrder]));
}

export function pickPreferredHitId(
  hitIds: readonly string[],
  visualOrderById: ReadonlyMap<string, number>,
  supportParentsByPointId?: ReadonlyMap<string, readonly string[]>,
): string | undefined {
  if (hitIds.length === 0) return undefined;
  const hitSet = new Set(hitIds);
  const dependents = hitIds.filter(id => {
    const parents = supportParentsByPointId?.get(id);
    return parents?.some(parentId => hitSet.has(parentId));
  });
  const pool = dependents.length > 0 ? dependents : hitIds;
  return pool.reduce((best, id) => (
    (visualOrderById.get(id) ?? Number.NEGATIVE_INFINITY)
      >= (visualOrderById.get(best) ?? Number.NEGATIVE_INFINITY)
      ? id
      : best
  ));
}

/** @deprecated Prefer `pickPreferredHitId`. */
export function pickTopmostHitId(
  hitIds: readonly string[],
  visualOrderById: ReadonlyMap<string, number>,
): string | undefined {
  return pickPreferredHitId(hitIds, visualOrderById);
}

/**
 * Sustituye `hasPoint` para que solo el hit preferido (cima del apilado, o
 * glider dependiente si solapa con un extremo de su soporte) sea verdadero.
 */
export function installTopmostOnlyHitTesting(
  elements: Record<string, HasPointElement | undefined>,
  visualOrderById: ReadonlyMap<string, number>,
  supportParentsByPointId?: ReadonlyMap<string, readonly string[]>,
): void {
  const ids = Object.keys(elements);
  ids.forEach(id => {
    const element = elements[id];
    if (!element || typeof element.hasPoint !== 'function') return;
    if (!element.__matematikaOriginalHasPoint) {
      element.__matematikaOriginalHasPoint = element.hasPoint.bind(element);
      element.__matematikaObjectId = id;
    }
    const original = element.__matematikaOriginalHasPoint;
    element.hasPoint = (x: number, y: number) => {
      if (!original(x, y)) return false;
      const hitIds = ids.filter(candidateId => {
        const candidate = elements[candidateId];
        if (!candidate?.__matematikaOriginalHasPoint) return false;
        if (candidate.visPropCalc?.visible === false) return false;
        return candidate.__matematikaOriginalHasPoint(x, y);
      });
      return pickPreferredHitId(hitIds, visualOrderById, supportParentsByPointId) === id;
    };
  });
}
