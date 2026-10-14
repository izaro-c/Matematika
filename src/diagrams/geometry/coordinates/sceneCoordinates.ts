import type { DiagramSpec } from '@/diagrams/model/schema/v3';
import type { DiagramObject, DiagramRelation, PointObject } from '@/diagrams/model/schema/v3';
import { evaluateMathExpression } from '@/diagrams/model/expressions/expressions';
import { sceneObjectHasCapability } from '@/diagrams/model/semantics/semantics';
import { objectKind, type DiagramObjectKind } from '@/diagrams/model/objects/kinds';
import {
  findObject,
  isControlObject,
  isMeasurableAngle,
  isPositionedPoint,
  pointGliderSupportId,
  pointPosition,
  angleSweep,
  type PositionedPoint,
} from '@/diagrams/model/objects/queries';
import {
  expressionSourceIds,
  objectConstructionReferences,
  objectExpressions,
  projectionSupportPoints,
} from '@/diagrams/model/objects/references';
import { pointActiveRelations, sceneRelations } from '@/diagrams/model/objects/relations';

export type Coordinates = { x: number; y: number };

/** Escena mínima que necesitan los cálculos geométricos. */
export type DiagramScene = Pick<DiagramSpec, 'objects' | 'relations' | 'viewport'>;

function resolveExpressionPoint(spec: DiagramScene, point: PositionedPoint, visiting: Set<string>): Coordinates {
  const variables: Record<string, number> = {};
  const sourceIds = new Set([
    ...objectExpressions(point).flatMap(expressionSourceIds),
    ...(point.interaction?.attractorIds ?? []),
  ]);
  sourceIds.delete(point.id);
  for (const dependencyId of sourceIds) {
    const coordinates = resolvePointCoordinates(spec, dependencyId, new Set(visiting));
    if (coordinates) {
      variables[`${dependencyId}.x`] = coordinates.x;
      variables[`${dependencyId}.y`] = coordinates.y;
    }
    const control = findObject(spec, dependencyId);
    if (isControlObject(control)) variables[dependencyId] = control.value;
  }
  const fallback = pointPosition(point)!;
  if (point.definition.type !== 'expression') return fallback;
  try {
    return {
      x: evaluateMathExpression(point.definition.x, variables),
      y: evaluateMathExpression(point.definition.y, variables),
    };
  } catch {
    return fallback;
  }
}

function resolveConstructedPoint(spec: DiagramScene, derived: PointObject, visiting: Set<string>): Coordinates | undefined {
  const definition = derived.definition;
  if (definition.type === 'intersection') {
    const first = linearSupportCarrier(spec, definition.supports[0], visiting);
    const second = linearSupportCarrier(spec, definition.supports[1], visiting);
    if (!first || !second) return undefined;
    const firstDx = first.b.x - first.a.x;
    const firstDy = first.b.y - first.a.y;
    const secondDx = second.b.x - second.a.x;
    const secondDy = second.b.y - second.a.y;
    const denominator = firstDx * secondDy - firstDy * secondDx;
    if (Math.abs(denominator) < 1e-10) return undefined;
    const offsetX = second.a.x - first.a.x;
    const offsetY = second.a.y - first.a.y;
    const parameter = (offsetX * secondDy - offsetY * secondDx) / denominator;
    return { x: first.a.x + parameter * firstDx, y: first.a.y + parameter * firstDy };
  }
  if (definition.type === 'midpoint') {
    const a = resolvePointCoordinates(spec, definition.points[0], new Set(visiting));
    const b = resolvePointCoordinates(spec, definition.points[1], new Set(visiting));
    return a && b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : undefined;
  }
  if (definition.type === 'projection') {
    const [lineA, lineB] = projectionSupportPoints(definition, spec.objects);
    // Cada referencia se resuelve con su propia copia del recorrido: dos hermanas
    // pueden depender del mismo punto sin que eso sea un ciclo.
    const a = resolvePointCoordinates(spec, lineA, new Set(visiting));
    const b = resolvePointCoordinates(spec, lineB, new Set(visiting));
    const source = resolvePointCoordinates(spec, definition.point, new Set(visiting));
    if (!a || !b || !source) return undefined;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lengthSquared = dx * dx + dy * dy || 1;
    const t = ((source.x - a.x) * dx + (source.y - a.y) * dy) / lengthSquared;
    return { x: a.x + dx * t, y: a.y + dy * t };
  }
  return undefined;
}

/**
 * Refleja el origen de una relación `reflection` (`refs`: destino, centro o eje,
 * origen opcional) respecto de un punto o de un soporte lineal.
 */
export function resolveReflectedPoint(
  spec: DiagramScene,
  direct: PositionedPoint,
  relation: Extract<DiagramRelation, { type: 'reflection' }>,
  visiting: Set<string>,
): Coordinates | undefined {
  const targetId = relation.refs[0];
  const centerOrAxisId = relation.refs[1];
  const sourceId = relation.refs.length >= 3 ? relation.refs[2] : targetId;

  const sourceCoords = sourceId === direct.id
    ? pointPosition(direct)
    : resolvePointCoordinates(spec, sourceId, visiting);
  if (!sourceCoords) return undefined;

  const centerCoords = resolvePointCoordinates(spec, centerOrAxisId, visiting);
  if (centerCoords) {
    return {
      x: 2 * centerCoords.x - sourceCoords.x,
      y: 2 * centerCoords.y - sourceCoords.y,
    };
  }

  const carrier = linearSupportCarrier(spec, centerOrAxisId, visiting);
  if (carrier) {
    const dx = carrier.b.x - carrier.a.x;
    const dy = carrier.b.y - carrier.a.y;
    const lengthSquared = dx * dx + dy * dy || 1;
    const t = ((sourceCoords.x - carrier.a.x) * dx + (sourceCoords.y - carrier.a.y) * dy) / lengthSquared;
    const footX = carrier.a.x + t * dx;
    const footY = carrier.a.y + t * dy;
    return {
      x: 2 * footX - sourceCoords.x,
      y: 2 * footY - sourceCoords.y,
    };
  }

  return undefined;
}

export function resolvePointCoordinates(spec: DiagramScene, id: string, visiting = new Set<string>()): Coordinates | undefined {
  if (visiting.has(id)) return undefined;
  visiting.add(id);
  const object = findObject(spec, id);
  if (object?.objectType !== 'point') return undefined;

  if (isPositionedPoint(object)) {
    if (object.mobility.type === 'constrained' && object.mobility.relationIds.length > 0) {
      const relationIds = object.mobility.relationIds;
      const reflection = sceneRelations(spec).find(relation => (
        relation.enabled
        && relation.type === 'reflection'
        && relationIds.includes(relation.id)
      ));
      if (reflection?.type === 'reflection') {
        const reflected = resolveReflectedPoint(spec, object, reflection, visiting);
        if (reflected) return reflected;
      }
    }
    if (object.definition.type === 'expression') return resolveExpressionPoint(spec, object, visiting);
    return pointPosition(object);
  }

  return resolveConstructedPoint(spec, object, visiting);
}

/** Dos puntos de la recta que soporta un objeto lineal (segmento, recta, semirrecta o recta construida). */
export function linearSupportCarrier(
  spec: DiagramScene,
  id: string,
  visiting: Set<string>,
): { a: Coordinates; b: Coordinates } | undefined {
  const support = findObject(spec, id);
  if (support?.objectType !== 'path') return undefined;
  const geometry = support.geometry;
  const resolve = (pointId: string) => resolvePointCoordinates(spec, pointId, new Set(visiting));
  if ((geometry.type === 'segment' && !geometry.construction) || geometry.type === 'ray') {
    const first = resolve(geometry.points[0]);
    const second = resolve(geometry.points[1]);
    return first && second ? { a: first, b: second } : undefined;
  }
  if (geometry.type !== 'line') return undefined;
  const construction = geometry.construction;
  if (construction.type === 'through-points') {
    const first = resolve(construction.points[0]);
    const second = resolve(construction.points[1]);
    return first && second ? { a: first, b: second } : undefined;
  }
  if (construction.type === 'angle-bisector') {
    const first = resolve(construction.points[0]);
    const vertex = resolve(construction.points[1]);
    const through = resolve(construction.points[2]);
    if (!first || !vertex || !through) return undefined;
    const firstDx = first.x - vertex.x;
    const firstDy = first.y - vertex.y;
    const secondDx = through.x - vertex.x;
    const secondDy = through.y - vertex.y;
    const firstLength = Math.hypot(firstDx, firstDy) || 1;
    const secondLength = Math.hypot(secondDx, secondDy) || 1;
    let directionX = firstDx / firstLength + secondDx / secondLength;
    let directionY = firstDy / firstLength + secondDy / secondLength;
    if (Math.hypot(directionX, directionY) < 1e-10) {
      directionX = -firstDy / firstLength;
      directionY = firstDx / firstLength;
    }
    return { a: vertex, b: { x: vertex.x + directionX, y: vertex.y + directionY } };
  }
  const first = resolve(construction.linePoints[0]);
  const second = resolve(construction.linePoints[1]);
  const through = resolve(construction.through);
  if (!first || !second || !through) return undefined;
  if (construction.type === 'parallel') {
    return { a: through, b: { x: through.x + second.x - first.x, y: through.y + second.y - first.y } };
  }
  return { a: through, b: { x: through.x - (second.y - first.y), y: through.y + second.x - first.x } };
}

/**
 * Referencias de construcción en orden geométrico; el pie de una perpendicular
 * se lee como `[base A, base B, punto proyectado]`. Lo usan las variables
 * `.length` y los encuadres.
 */
export function sceneReferences(spec: { readonly objects: readonly DiagramObject[] }, object: DiagramObject): string[] {
  if (object.objectType === 'point' && object.definition.type === 'projection') {
    return [...projectionSupportPoints(object.definition, spec.objects), object.definition.point];
  }
  return objectConstructionReferences(object);
}

/**
 * Variables reactivas de la escena: coordenadas de puntos (`P.x`, `P.y`),
 * valores de controles, longitudes (`s.length`) y amplitudes de ángulos
 * (`a.value`, `a.radians`, `a.degrees`).
 */
export function expressionVariables(spec: DiagramScene): Record<string, number> {
  const variables: Record<string, number> = {};
  spec.objects.forEach(object => {
    if (!isPositionedPoint(object)) return;
    const coordinates = resolvePointCoordinates(spec, object.id);
    if (!coordinates) return;
    variables[`${object.id}.x`] = coordinates.x;
    variables[`${object.id}.y`] = coordinates.y;
  });
  spec.objects.forEach(object => {
    if (isControlObject(object)) variables[object.id] = object.value;
  });
  spec.objects.forEach(object => {
    if (isPositionedPoint(object) || isControlObject(object)) return;
    const coordinates = resolvePointCoordinates(spec, object.id);
    if (coordinates) {
      variables[`${object.id}.x`] = coordinates.x;
      variables[`${object.id}.y`] = coordinates.y;
    }
    const refs = sceneReferences(spec, object);
    if (refs.length >= 2) {
      const a = resolvePointCoordinates(spec, refs[0]);
      const b = resolvePointCoordinates(spec, refs[1]);
      if (a && b) variables[`${object.id}.length`] = Math.hypot(b.x - a.x, b.y - a.y);
    }
    if (isMeasurableAngle(object)) {
      const first = resolvePointCoordinates(spec, object.points[0]);
      const vertex = resolvePointCoordinates(spec, object.points[1]);
      const second = resolvePointCoordinates(spec, object.points[2]);
      const radians = first && vertex && second
        ? angleMeasureRadians(angleSweep(object), first, vertex, second)
        : undefined;
      if (radians !== undefined) {
        variables[`${object.id}.value`] = radians;
        variables[`${object.id}.radians`] = radians;
        variables[`${object.id}.degrees`] = radians * 180 / Math.PI;
      }
    }
  });
  return variables;
}

/**
 * Mide los dos objetos angulares editables con la misma convención que el
 * renderer: el ángulo orientado pertenece a [0, 2π) y el no reflejo a [0, π].
 */
export function angleMeasureRadians(
  kind: 'angle' | 'nonReflexAngle',
  first: { x: number; y: number },
  vertex: { x: number; y: number },
  second: { x: number; y: number },
): number | undefined {
  const firstDx = first.x - vertex.x;
  const firstDy = first.y - vertex.y;
  const secondDx = second.x - vertex.x;
  const secondDy = second.y - vertex.y;
  const firstLength = Math.hypot(firstDx, firstDy);
  const secondLength = Math.hypot(secondDx, secondDy);
  if (firstLength < 1e-10 || secondLength < 1e-10) return undefined;
  const dot = firstDx * secondDx + firstDy * secondDy;
  if (kind === 'nonReflexAngle') {
    const cosine = Math.max(-1, Math.min(1, dot / (firstLength * secondLength)));
    return Math.acos(cosine);
  }
  const oriented = Math.atan2(firstDx * secondDy - firstDy * secondDx, dot);
  return oriented < 0 ? oriented + Math.PI * 2 : oriented;
}

/** Objetos sobre los que puede deslizar un punto. */
export function supportElements(spec: Pick<DiagramSpec, 'objects'>): DiagramObject[] {
  return spec.objects.filter(item => sceneObjectHasCapability(item, 'support'));
}

function projectToCircle(spec: DiagramScene, refs: readonly string[], coordinates: Coordinates): Coordinates {
  const center = resolvePointCoordinates(spec, refs[0]);
  const edge = resolvePointCoordinates(spec, refs[1]);
  if (!center || !edge) return coordinates;
  const radius = Math.hypot(edge.x - center.x, edge.y - center.y) || 1;
  const dx = coordinates.x - center.x;
  const dy = coordinates.y - center.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: center.x + (dx / length) * radius, y: center.y + (dy / length) * radius };
}

function angleBisectorDirection(a: Coordinates, vertex: Coordinates, other: Coordinates | undefined): Coordinates | undefined {
  if (!other) return undefined;
  const ux = a.x - vertex.x;
  const uy = a.y - vertex.y;
  const wx = other.x - vertex.x;
  const wy = other.y - vertex.y;
  const uLength = Math.hypot(ux, uy) || 1;
  const wLength = Math.hypot(wx, wy) || 1;
  const sumX = ux / uLength + wx / wLength;
  const sumY = uy / uLength + wy / wLength;
  const sumLength = Math.hypot(sumX, sumY);
  return sumLength < 1e-6
    ? { x: -uy / uLength, y: ux / uLength }
    : { x: sumX / sumLength, y: sumY / sumLength };
}

export function linearProjectionDirection(kind: DiagramObjectKind, a: Coordinates, b: Coordinates, through: Coordinates | undefined): Coordinates {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (kind === 'angleBisector') return angleBisectorDirection(a, b, through) ?? { x: dx, y: dy };
  if (kind === 'perpendicular') return { x: -dy, y: dx };
  return { x: dx, y: dy };
}

export function activePointConstraints(spec: DiagramScene, point: PointObject): DiagramRelation[] {
  return pointActiveRelations(spec, point);
}

/** Soporte de deslizamiento: movilidad `on-support` directa o relación `on-support` en relaciones combinadas. */
export function onSupportTargetId(spec: DiagramScene, point: PointObject): string | undefined {
  const glider = pointGliderSupportId(point);
  if (glider) return glider;
  if (point.mobility.type === 'constrained') {
    const on = activePointConstraints(spec, point).find(relation => (
      relation.type === 'on-support' && relation.point === point.id
    ));
    if (on?.type === 'on-support') return on.support;
  }
  return undefined;
}

/** Punto cuya posición en el soporte mantiene JSXGraph sin re-resolución pasiva. */
export function isJsxgraphOnSupportPoint(spec: DiagramScene, point: PointObject): boolean {
  if (!onSupportTargetId(spec, point)) return false;
  if (point.mobility.type === 'on-support') return true;
  return point.mobility.type === 'constrained' && activePointConstraints(spec, point).length === 1;
}

export function asGliderPoint<T extends PointObject>(point: T, supportId: string): T {
  return { ...point, mobility: { type: 'on-support', support: supportId } };
}

export function projectPointToSupport(
  spec: DiagramScene,
  point: PointObject,
  coordinates: { x: number; y: number },
): { x: number; y: number } {
  const supportId = pointGliderSupportId(point);
  if (!supportId) return coordinates;
  const support = findObject(spec, supportId);
  if (!support) return coordinates;
  const refs = objectConstructionReferences(support);
  if (support.objectType === 'path' && support.geometry.type === 'circle') return projectToCircle(spec, refs, coordinates);

  const kind = objectKind(support);
  const a = refs[0] ? resolvePointCoordinates(spec, refs[0]) : undefined;
  const b = refs[1] ? resolvePointCoordinates(spec, refs[1]) : undefined;
  const through = refs[2] ? resolvePointCoordinates(spec, refs[2]) : undefined;
  const lineA = kind === 'perpendicular' || kind === 'parallel' ? through : a;
  if (!lineA || !a || !b) return coordinates;

  const angleVertex = kind === 'angleBisector' ? b : undefined;
  const direction = linearProjectionDirection(kind, a, b, through);
  const origin = kind === 'angleBisector' && angleVertex ? angleVertex : lineA;
  const lengthSquared = direction.x * direction.x + direction.y * direction.y || 1;
  const t = ((coordinates.x - origin.x) * direction.x + (coordinates.y - origin.y) * direction.y) / lengthSquared;
  const projectedT = kind === 'ray' || kind === 'angleBisector' ? Math.max(0, t) : t;
  return { x: origin.x + direction.x * projectedT, y: origin.y + direction.y * projectedT };
}
