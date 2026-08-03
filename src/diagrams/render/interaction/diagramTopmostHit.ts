/**
 * Cuando varios objetos coinciden bajo el puntero, solo uno debe recibir el hit.
 *
 * Prioridad:
 * 1. Glider/`on` dependiente si solapa con un extremo de su soporte.
 * 2. Puntos (y construidos point-like) frente a paths/polígonos/áreas.
 * 3. Mayor `visualOrder` (cima del apilado).
 *
 * Los no seleccionables ceden ante cualquier seleccionable bajo el puntero.
 */

type HasPointElement = {
  hasPoint?: (x: number, y: number) => boolean;
  visPropCalc?: { visible?: boolean };
  borders?: HasPointElement[];
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
  pointLikeIds?: ReadonlySet<string>,
): string | undefined {
  if (hitIds.length === 0) return undefined;
  const hitSet = new Set(hitIds);
  const dependents = hitIds.filter(id => {
    const parents = supportParentsByPointId?.get(id);
    return parents?.some(parentId => hitSet.has(parentId));
  });
  let pool = dependents.length > 0 ? dependents : hitIds;
  if (pointLikeIds && pointLikeIds.size > 0) {
    const points = pool.filter(id => pointLikeIds.has(id));
    if (points.length > 0) pool = points;
  }
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

export function resolveCanvasSelectionHitId(options: {
  hitIds: readonly string[];
  selectableIds: ReadonlySet<string>;
  visualOrderById: ReadonlyMap<string, number>;
  supportParentsByPointId?: ReadonlyMap<string, readonly string[]>;
  pointLikeIds?: ReadonlySet<string>;
  hoveredId?: string | null;
  targetId?: string | null;
}): string | undefined {
  const selectableHits = options.hitIds.filter(id => options.selectableIds.has(id));
  if (
    options.hoveredId
    && options.selectableIds.has(options.hoveredId)
    && selectableHits.includes(options.hoveredId)
  ) {
    return options.hoveredId;
  }
  const preferred = pickPreferredHitId(
    selectableHits,
    options.visualOrderById,
    options.supportParentsByPointId,
    options.pointLikeIds,
  );
  if (preferred) return preferred;
  if (options.targetId && options.selectableIds.has(options.targetId)) return options.targetId;
  return undefined;
}

function originalHitsAt(
  elements: Record<string, HasPointElement | undefined>,
  ids: readonly string[],
  x: number,
  y: number,
): string[] {
  return ids.filter(candidateId => {
    const candidate = elements[candidateId];
    if (!candidate || candidate.visPropCalc?.visible === false) return false;
    if (candidate.__matematikaOriginalHasPoint?.(x, y)) return true;
    return Boolean(candidate.borders?.some(border => {
      if (border.visPropCalc?.visible === false) return false;
      return border.__matematikaOriginalHasPoint?.(x, y) ?? false;
    }));
  });
}

/**
 * Sustituye `hasPoint` (y el de sus borders) para que solo el hit preferido
 * sea verdadero.
 */
export function installTopmostOnlyHitTesting(
  elements: Record<string, HasPointElement | undefined>,
  visualOrderById: ReadonlyMap<string, number>,
  supportParentsByPointId?: ReadonlyMap<string, readonly string[]>,
  selectableIds?: ReadonlySet<string>,
  pointLikeIds?: ReadonlySet<string>,
  getHoveredId?: () => string | null | undefined,
): void {
  const ids = Object.keys(elements);

  const ensureOriginal = (element: HasPointElement, objectId: string) => {
    if (!element.__matematikaOriginalHasPoint && typeof element.hasPoint === 'function') {
      element.__matematikaOriginalHasPoint = element.hasPoint.bind(element);
      element.__matematikaObjectId = objectId;
    }
  };

  ids.forEach(id => {
    const element = elements[id];
    if (!element) return;
    ensureOriginal(element, id);
    element.borders?.forEach(border => ensureOriginal(border, id));
  });

  ids.forEach(id => {
    const element = elements[id];
    if (!element?.__matematikaOriginalHasPoint) return;

    const isPreferredAt = (x: number, y: number) => {
      const allHits = originalHitsAt(elements, ids, x, y);
      const competing = selectableIds && selectableIds.size > 0
        ? (() => {
          const selectableHits = allHits.filter(hitId => selectableIds.has(hitId));
          return selectableHits.length > 0 ? selectableHits : allHits;
        })()
        : allHits;
      const hoveredId = getHoveredId?.();
      if (hoveredId && competing.includes(hoveredId)) return hoveredId === id;
      return pickPreferredHitId(
        competing,
        visualOrderById,
        supportParentsByPointId,
        pointLikeIds,
      ) === id;
    };

    element.hasPoint = (x: number, y: number) => {
      if (!element.__matematikaOriginalHasPoint?.(x, y)) return false;
      return isPreferredAt(x, y);
    };

    element.borders?.forEach(border => {
      const borderOriginal = border.__matematikaOriginalHasPoint;
      if (!borderOriginal) return;
      border.hasPoint = (x: number, y: number) => {
        if (!borderOriginal(x, y)) return false;
        return isPreferredAt(x, y);
      };
    });
  });
}
