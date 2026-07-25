import { updatePoint } from './diagramElements';
import type { PointConstraint, VisualConstraint, VisualDiagramModel } from './types';
import { getConstraintConflictReason } from './relationCompatibility';

export interface ConstraintPresentation {
  label: string;
  description: string;
  refs: number;
}

export type RelationCategory = 'position' | 'points' | 'direction' | 'region' | 'congruence' | 'expression';
export type RelationScope = 'point' | 'segment' | 'angle';
export type RelationSurface = 'point' | 'element';

export interface RelationCatalogEntry extends ConstraintPresentation {
  value: VisualConstraint['kind'];
  category: RelationCategory;
  scopes: RelationScope[];
  preferredSurface: RelationSurface;
}

export const CONSTRAINT_OPTIONS: Array<ConstraintPresentation & { value: VisualConstraint['kind'] }> = [
  { value: 'fixed', label: 'Posición fija', description: 'El punto no puede moverse.', refs: 1 },
  { value: 'horizontal', label: 'Movimiento horizontal', description: 'Conserva la coordenada y (misma altura que el punto de referencia). Solo puede desplazarse en horizontal.', refs: 2 },
  { value: 'vertical', label: 'Movimiento vertical', description: 'Conserva la coordenada x (misma vertical que el punto de referencia). Solo puede desplazarse en vertical.', refs: 2 },
  { value: 'coincident', label: 'Coincidir con un punto', description: 'Ocupa exactamente la posición de otro punto.', refs: 2 },
  { value: 'on', label: 'Sobre un objeto', description: 'Solo puede desplazarse sobre una recta, segmento, arco o circunferencia.', refs: 2 },
  { value: 'distance', label: 'A distancia fija', description: 'Mantiene una distancia numérica respecto de otro punto.', refs: 2 },
  { value: 'equalLength', label: 'Misma longitud que otro segmento', description: 'Ajusta un extremo para que su segmento conserve la longitud de otro segmento.', refs: 3 },
  { value: 'midpoint', label: 'Punto medio', description: 'Mantiene el punto exactamente a mitad de camino entre otros dos puntos.', refs: 3 },
  { value: 'perpendicular', label: 'Sobre una perpendicular', description: 'Se mueve sobre la perpendicular a una dirección dada.', refs: 3 },
  { value: 'parallel', label: 'Sobre una paralela', description: 'Se mueve sobre una paralela a una dirección dada.', refs: 3 },
  { value: 'insideDisk', label: 'Dentro de un disco', description: 'No puede salir del disco definido por centro y borde.', refs: 3 },
  { value: 'sameSide', label: 'En el mismo semiplano', description: 'No puede cruzar la recta definida por dos puntos.', refs: 3 },
  { value: 'insideArea', label: 'En un área', description: 'Mantiene el punto en el interior o en el perímetro de un semiplano, polígono, disco o intersección.', refs: 2 },
  { value: 'reflection', label: 'Reflejo simétrico', description: 'Posiciona un punto o segmento como reflejo respecto de un centro (punto) o eje (recta/segmento).', refs: 2 },
];

export const RELATION_CATALOG: RelationCatalogEntry[] = [
  ...CONSTRAINT_OPTIONS.map(option => ({
    ...option,
    category: (
      ['fixed', 'horizontal', 'vertical', 'on'].includes(option.value) ? 'position'
        : ['coincident', 'distance', 'midpoint'].includes(option.value) ? 'points'
          : ['perpendicular', 'parallel'].includes(option.value) ? 'direction'
            : ['insideDisk', 'sameSide', 'insideArea'].includes(option.value) ? 'region'
              : 'congruence'
    ) as RelationCategory,
    scopes: (
      option.value === 'reflection'
        ? ['segment', 'point'] as RelationScope[]
        : option.value === 'equalLength'
          ? ['segment'] as RelationScope[]
          : ['point'] as RelationScope[]
    ),
    preferredSurface: (
      option.value === 'equalLength' || option.value === 'reflection' ? 'element' : 'point'
    ) as RelationSurface,
  })),
  {
    value: 'equalAngle',
    label: 'Misma amplitud que otro ángulo',
    description: 'Ajusta uno de los lados para que el ángulo conserve la amplitud de otro ángulo.',
    refs: 5,
    category: 'congruence',
    scopes: ['angle'],
    preferredSurface: 'element',
  },
  {
    value: 'expression',
    label: 'Relación por expresión',
    description: 'Relación avanzada conservada por el modelo.',
    refs: 1,
    category: 'expression',
    scopes: [] as RelationScope[],
    preferredSurface: 'point',
  },
];

export const RELATION_CATEGORY_LABELS: Record<RelationCategory, string> = {
  position: 'Posición y guía',
  points: 'Relaciones entre puntos',
  direction: 'Dirección',
  region: 'Región',
  congruence: 'Congruencia y simetría',
  expression: 'Medición y expresión',
};

export const RELATION_CATEGORY_ORDER: RelationCategory[] = [
  'position', 'points', 'direction', 'region', 'congruence', 'expression',
];

const SUPPORT_KINDS = new Set(['segment', 'line', 'ray', 'circle', 'arc', 'functionCurve', 'parametricCurve', 'perpendicular', 'parallel', 'angleBisector']);

export function getConstraintSlotLabel(kind: VisualConstraint['kind'], slotIndex: number): string {
  switch (kind) {
    case 'fixed':
      return 'Punto a fijar (x, y)';
    case 'horizontal':
      return slotIndex === 0 ? 'Punto restringido' : 'Punto de referencia Y (misma altura)';
    case 'vertical':
      return slotIndex === 0 ? 'Punto restringido' : 'Punto de referencia X (misma vertical)';
    case 'coincident':
      return slotIndex === 0 ? 'Punto restringido' : 'Punto objetivo de coincidencia';
    case 'on':
      return slotIndex === 0 ? 'Punto deslizador' : 'Objeto de soporte (recta/segmento/círculo)';
    case 'distance':
      return slotIndex === 0 ? 'Punto móvil' : 'Centro / Punto de referencia de distancia';
    case 'equalLength':
      return slotIndex === 0 ? 'Extremo a ajustar' : slotIndex === 1 ? 'Punto ancla fijo' : 'Segmento de referencia';
    case 'midpoint':
      return slotIndex === 0 ? 'Punto medio resultante' : slotIndex === 1 ? 'Extremo A' : 'Extremo B';
    case 'perpendicular':
      return slotIndex === 0 ? 'Punto restringido' : slotIndex === 1 ? 'Punto o dirección 1' : 'Punto o recta base';
    case 'parallel':
      return slotIndex === 0 ? 'Punto restringido' : slotIndex === 1 ? 'Punto o dirección 1' : 'Punto o recta base';
    case 'insideDisk':
      return slotIndex === 0 ? 'Punto restringido' : slotIndex === 1 ? 'Centro del disco' : 'Punto en el borde';
    case 'sameSide':
      return slotIndex === 0 ? 'Punto restringido' : slotIndex === 1 ? 'Punto 1 del eje' : 'Punto 2 del eje';
    case 'insideArea':
      return slotIndex === 0 ? 'Punto restringido' : 'Región o polígono continente';
    case 'reflection':
      return slotIndex === 0 ? 'Punto reflejado' : slotIndex === 1 ? 'Centro o eje de simetría' : 'Punto origen';
    case 'equalAngle':
      return slotIndex === 0 ? 'Extremo móvil' : slotIndex === 1 ? 'Vértice' : slotIndex === 2 ? 'Extremo fijo' : slotIndex === 3 ? 'Ángulo de referencia' : 'Ángulo objetivo';
    default:
      return `Objeto de referencia ${slotIndex + 1}`;
  }
}

export function constraintPresentation(kind: VisualConstraint['kind']): ConstraintPresentation {
  if (kind === 'equalAngle') {
    return {
      label: 'Misma amplitud que otro ángulo',
      description: 'Ajusta uno de los lados para que el ángulo conserve la amplitud de otro ángulo.',
      refs: 5,
    };
  }
  const configured = CONSTRAINT_OPTIONS.find(option => option.value === kind);
  if (configured) return configured;
  return {
    label: kind === 'expression' ? 'Relación por expresión' : kind,
    description: 'Relación avanzada conservada por el modelo.',
    refs: kind === 'expression' ? 1 : 2,
  };
}

export function defaultConstraintRefs(model: VisualDiagramModel, kind: VisualConstraint['kind'], targetId: string): string[] {
  if (!targetId) return [];
  const presentation = constraintPresentation(kind);
  if (presentation.refs === 1) return [targetId];
  if (kind === 'on') {
    const support = model.elements.find(item => SUPPORT_KINDS.has(item.kind));
    return support ? [targetId, support.id] : [targetId];
  }
  if (kind === 'insideArea') {
    const area = model.elements.find(item => (
      ['halfPlane', 'polygon', 'circle', 'areaIntersection', 'areaDecomposition', 'grid'].includes(item.kind)
    ));
    return area ? [targetId, area.id] : [targetId];
  }
  if (kind === 'reflection') {
    const centerOrAxis = model.points.find(item => item.id !== targetId)
      ?? model.elements.find(item => ['segment', 'line', 'ray', 'midpoint', 'intersection'].includes(item.kind) && item.id !== targetId);
    if (!centerOrAxis) return [targetId];
    const sourcePoint = model.points.find(item => item.id !== targetId && item.id !== centerOrAxis.id);
    return sourcePoint ? [targetId, centerOrAxis.id, sourcePoint.id] : [targetId, centerOrAxis.id];
  }
  if (kind === 'equalLength') {
    const targetSegment = model.elements.find(item => item.kind === 'segment' && item.refs.includes(targetId));
    const anchorId = targetSegment?.refs.find(ref => ref !== targetId);
    const sourceSegment = model.elements.find(item => item.kind === 'segment' && item.id !== targetSegment?.id);
    return anchorId && sourceSegment ? [targetId, anchorId, sourceSegment.id] : [targetId, ...(anchorId ? [anchorId] : [])];
  }
  if (kind === 'equalAngle') {
    const targetAngle = model.elements.find(item => (
      (item.kind === 'angle' || item.kind === 'nonReflexAngle')
      && (item.refs[0] === targetId || item.refs[2] === targetId)
    ));
    if (!targetAngle) return [targetId];
    const fixedRayPointId = targetAngle.refs[0] === targetId ? targetAngle.refs[2] : targetAngle.refs[0];
    const sourceAngle = model.elements.find(item => (
      item.id !== targetAngle.id
      && item.kind === targetAngle.kind
      && !item.refs.includes(targetId)
    ));
    return sourceAngle
      ? [targetId, targetAngle.refs[1], fixedRayPointId, sourceAngle.id, targetAngle.id]
      : [targetId, targetAngle.refs[1], fixedRayPointId];
  }
  const otherPoints = model.points.filter(item => item.id !== targetId).map(item => item.id);
  return [targetId, ...otherPoints.slice(0, presentation.refs - 1)];
}

export function withConstraintDependencies(model: VisualDiagramModel, constraintId: string, refs: string[]): VisualDiagramModel {
  return {
    ...model,
    dependencies: [
      ...(model.dependencies || []).filter(dependency => dependency.constraintId !== constraintId),
      ...refs.slice(1).map(sourceId => ({ sourceId, targetId: refs[0], relation: 'constraint' as const, constraintId })),
    ],
  };
}

export function relationCatalogEntry(kind: VisualConstraint['kind']): RelationCatalogEntry {
  const entry = RELATION_CATALOG.find(item => item.value === kind);
  if (entry) return entry;
  const presentation = constraintPresentation(kind);
  return {
    ...presentation,
    value: kind,
    category: 'expression',
    scopes: ['point'],
    preferredSurface: 'point',
  };
}

export function relationsForScope(scope: RelationScope): RelationCatalogEntry[] {
  return RELATION_CATALOG.filter(entry => entry.scopes.includes(scope));
}

export function relationsForPointPicker(): RelationCatalogEntry[] {
  return relationsForScope('point').filter(entry => entry.value !== 'fixed' && entry.value !== 'expression');
}

export function combinedConstraintBlockReason(
  model: VisualDiagramModel,
  kind: VisualConstraint['kind'],
  targetId: string,
  activeKinds: readonly VisualConstraint['kind'][],
  options?: { ignoreKind?: VisualConstraint['kind'] },
): string | undefined {
  return getConstraintDisabledReason(model, kind, targetId)
    ?? getConstraintConflictReason(activeKinds, kind, options);
}

export function uniqueConstraintId(model: VisualDiagramModel): string {
  let index = (model.constraints?.length ?? 0) + 1;
  while (model.constraints?.some(item => item.id === `constraint${index}`)) index += 1;
  return `constraint${index}`;
}

export function getConstraintDisabledReason(
  model: VisualDiagramModel,
  kind: VisualConstraint['kind'],
  targetId: string,
): string | undefined {
  const presentation = constraintPresentation(kind);
  const refs = defaultConstraintRefs(model, kind, targetId);
  if (refs.length >= presentation.refs) return undefined;

  switch (kind) {
    case 'equalLength': {
      const targetSegment = model.elements.find(item => item.kind === 'segment' && item.refs.includes(targetId));
      if (!targetSegment) return 'Este punto no forma parte de ningún segmento. Seleccione el segmento en el lienzo para igualar longitudes.';
      const otherSegments = model.elements.filter(item => item.kind === 'segment' && item.id !== targetSegment.id);
      if (otherSegments.length === 0) return 'No existe otro segmento en el diagrama para tomar como referencia de longitud.';
      return 'Se requiere un segmento de referencia y un punto ancla para igualar la longitud.';
    }
    case 'equalAngle': {
      const targetAngle = model.elements.find(item => (item.kind === 'angle' || item.kind === 'nonReflexAngle') && (item.refs[0] === targetId || item.refs[2] === targetId));
      if (!targetAngle) return 'Este punto no es extremo del lado de ningún ángulo. Seleccione el ángulo en el lienzo.';
      return 'No hay otro ángulo del mismo tipo en la escena para copiar su amplitud.';
    }
    case 'on':
      return 'No hay segmentos, rectas, semirrectas ni curvas en el diagrama sobre las que colocar este punto.';
    case 'midpoint':
      return 'Se necesitan al menos otros dos puntos para definir un punto medio.';
    case 'perpendicular':
    case 'parallel':
      return 'Se necesitan otros dos puntos o una recta para definir la dirección de la referencia.';
    case 'insideDisk':
    case 'sameSide':
    case 'insideArea':
      return 'Se necesitan más puntos en la escena para definir la región de esta restricción.';
    case 'horizontal':
    case 'vertical':
    case 'coincident':
    case 'distance':
      return 'Se necesita al menos otro punto en la escena para relacionarlo con este punto.';
    default:
      return 'Se necesitan más objetos en el diagrama para establecer esta relación.';
  }
}

const LEGACY_MOVEMENT_MODES = new Set<PointConstraint>(['horizontal', 'vertical', 'glider']);

/** Convierte modos de movimiento heredados a relaciones combinables en `constrained`. */
export function migrateLegacyPointToConstrained(model: VisualDiagramModel, pointId: string): VisualDiagramModel {
  const point = model.points.find(item => item.id === pointId);
  if (!point || !LEGACY_MOVEMENT_MODES.has(point.constraint)) {
    return model;
  }

  let next = model;
  const constraintIds = [...(point.constraintIds ?? [])];
  let kind: VisualConstraint['kind'];
  if (point.constraint === 'horizontal') kind = 'horizontal';
  else if (point.constraint === 'vertical') kind = 'vertical';
  else kind = 'on';

  const refs = point.constraint === 'glider' && point.gliderTarget
    ? [pointId, point.gliderTarget]
    : defaultConstraintRefs(next, kind, pointId);

  if (refs.length >= constraintPresentation(kind).refs) {
    const id = uniqueConstraintId(next);
    const constraint: VisualConstraint = {
      id,
      label: constraintPresentation(kind).label,
      kind,
      refs,
      enabled: true,
    };
    next = withConstraintDependencies(next, id, refs);
    next = {
      ...next,
      constraints: [...(next.constraints || []), constraint],
    };
    constraintIds.push(id);
  }

  return updatePoint(next, pointId, {
    constraint: 'constrained',
    constraintIds,
    gliderTarget: undefined,
  });
}

export function ensureConstrainedMode(model: VisualDiagramModel, pointId: string): VisualDiagramModel {
  const point = model.points.find(item => item.id === pointId);
  if (!point) return model;
  if (LEGACY_MOVEMENT_MODES.has(point.constraint)) return migrateLegacyPointToConstrained(model, pointId);
  if (point.constraint === 'constrained') return model;
  return updatePoint(model, pointId, { constraint: 'constrained' });
}
