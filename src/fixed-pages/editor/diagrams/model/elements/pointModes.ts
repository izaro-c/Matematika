import { omitKeys, pointPosition, type PositionedPoint } from '@/diagrams';
import type { PointConstraint, VisualDiagramModel } from '../types';

/** Modo de movilidad que presenta el editor para un punto con posición propia. */
export function pointMode(point: PositionedPoint): PointConstraint {
  if (point.definition.type === 'expression') return 'derived';
  switch (point.mobility.type) {
    case 'axis-x': return 'horizontal';
    case 'axis-y': return 'vertical';
    case 'on-support': return 'glider';
    case 'on-points': return 'discrete';
    case 'constrained': return 'constrained';
    case 'fixed': return 'fixed';
    default: return 'free';
  }
}

export interface PointModeOptions {
  /** Soporte del modo `glider`. */
  gliderTarget?: string;
  /** Posiciones candidatas del modo `discrete`. */
  candidatePointIds?: string[];
  /** Relaciones del modo `constrained`. */
  relationIds?: string[];
  /** Expresiones del modo `derived`; por defecto, la posición actual. */
  xExpression?: string;
  yExpression?: string;
}

const MOVEMENT_AID_MODES = new Set<PointConstraint>(['free', 'horizontal', 'vertical', 'constrained']);

/** Indica si el punto admite ayudas durante el arrastre directo (atractores y rejilla). */
export function pointModeSupportsMovementAids(mode: PointConstraint): boolean {
  return MOVEMENT_AID_MODES.has(mode);
}

/**
 * Traduce un modo del editor a `definition` + `mobility` V3. Conserva la
 * posición; un punto derivado guarda su posición como respaldo de la expresión.
 */
export function withPointMode<T extends PositionedPoint>(point: T, mode: PointConstraint, options: PointModeOptions = {}): T {
  const position = pointPosition(point)!;
  const coordinates = { type: 'coordinates' as const, x: position.x, y: position.y };
  let next: PositionedPoint;
  switch (mode) {
    case 'derived': {
      const current = point.definition.type === 'expression' ? point.definition : undefined;
      next = {
        ...point,
        definition: {
          type: 'expression',
          x: options.xExpression ?? current?.x ?? String(position.x),
          y: options.yExpression ?? current?.y ?? String(position.y),
          fallback: [position.x, position.y],
        },
        mobility: { type: 'fixed' },
      };
      break;
    }
    case 'horizontal':
      next = { ...point, definition: coordinates, mobility: { type: 'axis-x', coordinate: position.y } };
      break;
    case 'vertical':
      next = { ...point, definition: coordinates, mobility: { type: 'axis-y', coordinate: position.x } };
      break;
    case 'glider': {
      const support = options.gliderTarget ?? (point.mobility.type === 'on-support' ? point.mobility.support : undefined);
      next = { ...point, definition: coordinates, mobility: support ? { type: 'on-support', support } : { type: 'free' } };
      break;
    }
    case 'discrete': {
      const points = options.candidatePointIds ?? (point.mobility.type === 'on-points' ? point.mobility.points : []);
      next = { ...point, definition: coordinates, mobility: points.length > 0 ? { type: 'on-points', points } : { type: 'free' } };
      break;
    }
    case 'constrained': {
      const relationIds = options.relationIds ?? (point.mobility.type === 'constrained' ? point.mobility.relationIds : []);
      next = { ...point, definition: coordinates, mobility: relationIds.length > 0 ? { type: 'constrained', relationIds } : { type: 'free' } };
      break;
    }
    case 'fixed':
      next = { ...point, definition: coordinates, mobility: { type: 'fixed' } };
      break;
    default:
      next = { ...point, definition: coordinates, mobility: { type: 'free' } };
  }
  if (!pointModeSupportsMovementAids(mode) && next.interaction) {
    const interaction = omitKeys(next.interaction, 'attractorIds', 'attractorDistance', 'snatchDistance');
    next = Object.keys(interaction).length > 0 ? { ...next, interaction } : omitKeys(next, 'interaction');
  }
  return next as T;
}

/**
 * Cambia la movilidad de un punto del modelo. Al abandonar el modo
 * `constrained` se eliminan las relaciones que solo lo restringían a él.
 */
export function setPointMode(
  model: VisualDiagramModel,
  pointId: string,
  mode: PointConstraint,
  options: PointModeOptions = {},
): VisualDiagramModel {
  const previous = model.objects.find((item): item is PositionedPoint => (
    item.id === pointId && item.objectType === 'point' && (item.definition.type === 'coordinates' || item.definition.type === 'expression')
  ));
  if (!previous) return model;
  const removedRelationIds = mode !== 'constrained' && previous.mobility.type === 'constrained'
    ? new Set(previous.mobility.relationIds)
    : new Set<string>();
  const next = withPointMode(previous, mode, options);
  return {
    ...model,
    objects: model.objects.map(item => item.id === pointId ? next : item),
    ...(removedRelationIds.size > 0 ? { relations: model.relations.filter(relation => !removedRelationIds.has(relation.id)) } : {}),
  };
}

/**
 * Cambia la posición persistida del punto. En los modos con eje fijo la
 * coordenada del eje acompaña a la posición para que ambas no diverjan.
 */
export function withEditedPosition<T extends PositionedPoint>(point: T, coordinates: { x: number; y: number }): T {
  const definition = point.definition.type === 'expression'
    ? { ...point.definition, fallback: [coordinates.x, coordinates.y] as [number, number] }
    : { type: 'coordinates' as const, x: coordinates.x, y: coordinates.y };
  const mobility = point.mobility.type === 'axis-x'
    ? { ...point.mobility, coordinate: coordinates.y }
    : point.mobility.type === 'axis-y'
      ? { ...point.mobility, coordinate: coordinates.x }
      : point.mobility;
  return { ...point, definition, mobility };
}
