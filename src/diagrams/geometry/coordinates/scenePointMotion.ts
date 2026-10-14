import type { DiagramObject, DiagramRelation } from '@/diagrams/model/schema/v3';
import { evaluateMathExpression } from '@/diagrams/model/expressions/expressions';
import { objectKind } from '@/diagrams/model/objects/kinds';
import {
  findObject,
  isPositionedPoint,
  pointIsImmovable,
  pointPosition,
  pointRelationIds,
  segmentEndpoints,
  withPointPosition,
  angleSweep,
  isMeasurableAngle,
  type PositionedPoint,
} from '@/diagrams/model/objects/queries';
import { objectConstructionReferences } from '@/diagrams/model/objects/references';
import {
  equalAngleRoles,
  equalLengthRoles,
  insideDiskRoles,
  linearRelationRoles,
  relationParticipants,
  sameSideRoles,
  type RelationOf,
} from '@/diagrams/model/objects/relations';
import {
  clampLinearParameterToHalfPlane,
  computeHalfPlaneSide,
  constrainToHalfPlaneWithSide,
  signedCross,
} from '@/diagrams/geometry/areas/areaGeometry';
import {
  constrainPointForAreaMembership,
} from '@/diagrams/geometry/areas/areaRegions';
import {
  activePointConstraints,
  angleMeasureRadians,
  asGliderPoint,
  expressionVariables,
  isJsxgraphOnSupportPoint,
  linearProjectionDirection,
  linearSupportCarrier,
  onSupportTargetId,
  projectPointToSupport,
  resolvePointCoordinates,
  resolveReflectedPoint,
  type Coordinates,
  type DiagramScene,
} from '@/diagrams/geometry/coordinates/sceneCoordinates';

/**
 * Rellena `side` en las relaciones `same-half-plane` que aún no lo tienen.
 * El signo se congela en la geometría actual para que el semiplano sea
 * invariante cuando se mueven los puntos de frontera.
 */
export function materializeSameSideRelations<T extends DiagramScene>(spec: T): T {
  if (!spec.relations.some(relation => relation.type === 'same-half-plane' && relation.side === undefined)) {
    return spec;
  }
  const relations = spec.relations.map(relation => {
    if (relation.type !== 'same-half-plane' || relation.side !== undefined) return relation;
    const roles = sameSideRoles(relation);
    const sidePoint = resolvePointCoordinates(spec, roles.point);
    const lineA = resolvePointCoordinates(spec, roles.lineA);
    const lineB = resolvePointCoordinates(spec, roles.lineB);
    if (!sidePoint || !lineA || !lineB) return relation;
    return { ...relation, side: computeHalfPlaneSide(lineA, lineB, sidePoint) };
  });
  return { ...spec, relations };
}

const resolvedScenes = new WeakMap<object, object>();

/**
 * Escena lista para el runtime: semiplanos congelados y puntos restringidos
 * resueltos. Se memoiza por identidad; resolver una escena ya resuelta es gratis.
 */
export function resolveDiagramScene<T extends DiagramScene>(spec: T): T {
  const cached = resolvedScenes.get(spec) as T | undefined;
  if (cached) return cached;
  const resolved = withResolvedPointConstraints(materializeSameSideRelations(spec));
  resolvedScenes.set(spec, resolved);
  resolvedScenes.set(resolved, resolved);
  return resolved;
}

function withPositionedPointAt<T extends DiagramScene>(spec: T, pointId: string, coordinates: Coordinates): T {
  return {
    ...spec,
    objects: spec.objects.map(object => (
      object.id === pointId && object.objectType === 'point' ? withPointPosition(object, coordinates) : object
    )),
  };
}

export function withMovedPoint<T extends DiagramScene>(inputSpec: T, pointId: string, x: number, y: number): T {
  const spec = materializeSameSideRelations(inputSpec);
  const point = findObject(spec, pointId);
  if (!isPositionedPoint(point) || pointIsImmovable(point)) return spec;
  const constrained = constrainPointCoordinates(spec, point, { x, y });
  return withResolvedPointConstraints(withPositionedPointAt(spec, pointId, constrained), { skipPointIds: [pointId] });
}

function applyDistanceConstraint(spec: DiagramScene, result: Coordinates, other: Coordinates, relation: RelationOf<'distance'>): Coordinates {
  const distance = relation.value ?? (relation.expression ? evaluateMathExpression(relation.expression, expressionVariables(spec)) : 0);
  const dx = result.x - other.x;
  const dy = result.y - other.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: other.x + dx / length * distance, y: other.y + dy / length * distance };
}

function segmentLength(spec: DiagramScene, segmentId: string): number | undefined {
  const endpoints = segmentEndpoints(findObject(spec, segmentId));
  const sourceA = endpoints ? resolvePointCoordinates(spec, endpoints[0]) : undefined;
  const sourceB = endpoints ? resolvePointCoordinates(spec, endpoints[1]) : undefined;
  return sourceA && sourceB ? Math.hypot(sourceB.x - sourceA.x, sourceB.y - sourceA.y) : undefined;
}

function applyEqualLengthConstraint(spec: DiagramScene, point: PositionedPoint, result: Coordinates, relation: RelationOf<'equal-length'>): Coordinates {
  const roles = equalLengthRoles(relation, spec.objects);
  const anchor = resolvePointCoordinates(spec, roles.anchor);
  const desiredLength = segmentLength(spec, roles.source);
  const previous = pointPosition(point)!;
  if (!anchor || desiredLength === undefined) return result;
  const requestedDx = result.x - anchor.x;
  const requestedDy = result.y - anchor.y;
  const previousDx = previous.x - anchor.x;
  const previousDy = previous.y - anchor.y;
  const directionLength = Math.hypot(requestedDx, requestedDy);
  const fallbackLength = Math.hypot(previousDx, previousDy) || 1;
  const directionX = directionLength > 1e-10 ? requestedDx / directionLength : previousDx / fallbackLength;
  const directionY = directionLength > 1e-10 ? requestedDy / directionLength : previousDy / fallbackLength;
  return { x: anchor.x + directionX * desiredLength, y: anchor.y + directionY * desiredLength };
}

function applyEqualAngleConstraint(spec: DiagramScene, point: PositionedPoint, result: Coordinates, relation: RelationOf<'equal-angle'>): Coordinates {
  const roles = equalAngleRoles(relation, spec.objects);
  const vertex = resolvePointCoordinates(spec, roles.vertex);
  const fixedRayPoint = resolvePointCoordinates(spec, roles.fixed);
  const sourceAngle = findObject(spec, roles.source);
  const targetAngle = findObject(spec, roles.target);
  const desiredAngle = sourceAngle ? angleMagnitude(spec, sourceAngle) : undefined;
  if (!vertex || !fixedRayPoint || !targetAngle || desiredAngle === undefined) return result;
  const previous = pointPosition(point)!;
  const fixedDx = fixedRayPoint.x - vertex.x;
  const fixedDy = fixedRayPoint.y - vertex.y;
  const fixedLength = Math.hypot(fixedDx, fixedDy);
  if (fixedLength < 1e-10) return result;
  const requestedDx = result.x - vertex.x;
  const requestedDy = result.y - vertex.y;
  const previousDx = previous.x - vertex.x;
  const previousDy = previous.y - vertex.y;
  const requestedLength = Math.hypot(requestedDx, requestedDy);
  const radius = requestedLength > 1e-10 ? requestedLength : Math.hypot(previousDx, previousDy);
  if (radius < 1e-10) return result;
  const fixedDirection = { x: fixedDx / fixedLength, y: fixedDy / fixedLength };
  const orientedRotation = objectConstructionReferences(targetAngle)[0] === point.id ? -desiredAngle : desiredAngle;
  let direction = rotateUnit(fixedDirection, orientedRotation);
  if (objectKind(targetAngle) === 'nonReflexAngle') {
    const alternate = rotateUnit(fixedDirection, -orientedRotation);
    const requestedDirection = requestedLength > 1e-10
      ? { x: requestedDx / requestedLength, y: requestedDy / requestedLength }
      : { x: previousDx / radius, y: previousDy / radius };
    if (dot(alternate, requestedDirection) > dot(direction, requestedDirection)) direction = alternate;
  }
  return { x: vertex.x + direction.x * radius, y: vertex.y + direction.y * radius };
}

function applyInsideDiskConstraint(spec: DiagramScene, result: Coordinates, relation: RelationOf<'inside-disk'>): Coordinates {
  const roles = insideDiskRoles(relation, spec.objects);
  const center = resolvePointCoordinates(spec, roles.center);
  const boundary = resolvePointCoordinates(spec, roles.boundary);
  if (!center || !boundary) return result;
  const radius = Math.hypot(boundary.x - center.x, boundary.y - center.y) * 0.999;
  const dx = result.x - center.x;
  const dy = result.y - center.y;
  const length = Math.hypot(dx, dy);
  return length > radius ? { x: center.x + dx / length * radius, y: center.y + dy / length * radius } : result;
}

function linearSupportFrame(
  spec: DiagramScene,
  support: DiagramObject,
): { origin: Coordinates; direction: Coordinates; minParameter: number } | undefined {
  const refs = objectConstructionReferences(support);
  const kind = objectKind(support);
  const a = refs[0] ? resolvePointCoordinates(spec, refs[0]) : undefined;
  const b = refs[1] ? resolvePointCoordinates(spec, refs[1]) : undefined;
  const through = refs[2] ? resolvePointCoordinates(spec, refs[2]) : undefined;
  const lineA = kind === 'perpendicular' || kind === 'parallel' ? through : a;
  if (!lineA || !a || !b) return undefined;
  const direction = linearProjectionDirection(kind, a, b, through);
  const origin = kind === 'angleBisector' ? b : lineA;
  const minParameter = kind === 'ray' || kind === 'angleBisector' ? 0 : -Infinity;
  return { origin, direction, minParameter };
}

function parameterOnLinearSupport(
  frame: { origin: Coordinates; direction: Coordinates },
  support: DiagramObject,
  coordinates: Coordinates,
): number {
  const lengthSquared = frame.direction.x * frame.direction.x + frame.direction.y * frame.direction.y || 1;
  const t = ((coordinates.x - frame.origin.x) * frame.direction.x + (coordinates.y - frame.origin.y) * frame.direction.y) / lengthSquared;
  const kind = objectKind(support);
  if (kind === 'ray' || kind === 'angleBisector') return Math.max(0, t);
  return t;
}

function pointAtLinearSupportParameter(
  frame: { origin: Coordinates; direction: Coordinates },
  parameter: number,
): Coordinates {
  return {
    x: frame.origin.x + parameter * frame.direction.x,
    y: frame.origin.y + parameter * frame.direction.y,
  };
}

function normalizedLerp(a: Coordinates, b: Coordinates, t: number): Coordinates {
  const x = a.x + (b.x - a.x) * t;
  const y = a.y + (b.y - a.y) * t;
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}

const LINE_CARRIER_EPSILON = 1e-6;
const MAX_LINEAR_PROJECTION_STEP_ANGLE = Math.PI / 36; // ~5°

/**
 * Proyección estable de `position` sobre la recta que pasa por `origin` con
 * dirección `targetDirection`. Subdivide giros grandes en pasos pequeños para
 * evitar inversiones de signo y disparos de parámetro cuando el portador gira
 * mucho en un solo fotograma. Compartida por restricciones `parallel`/`perpendicular`.
 */
function stabilizedProjectionOnDirection(
  origin: Coordinates,
  targetDirection: Coordinates,
  position: Coordinates,
): Coordinates {
  const targetLengthSquared = targetDirection.x * targetDirection.x + targetDirection.y * targetDirection.y;
  const targetLength = Math.sqrt(targetLengthSquared);
  const previousVector = { x: position.x - origin.x, y: position.y - origin.y };
  const previousLength = Math.hypot(previousVector.x, previousVector.y);

  if (targetLength < LINE_CARRIER_EPSILON) {
    if (previousLength < LINE_CARRIER_EPSILON) return position;
    return { x: origin.x + previousVector.x, y: origin.y + previousVector.y };
  }

  if (previousLength < LINE_CARRIER_EPSILON) {
    return {
      x: origin.x + targetDirection.x / targetLength,
      y: origin.y + targetDirection.y / targetLength,
    };
  }

  const previousUnit = { x: previousVector.x / previousLength, y: previousVector.y / previousLength };
  const targetUnit = { x: targetDirection.x / targetLength, y: targetDirection.y / targetLength };
  const cosAngle = Math.max(-1, Math.min(1, previousUnit.x * targetUnit.x + previousUnit.y * targetUnit.y));
  const angle = Math.acos(cosAngle);
  const steps = Math.max(1, Math.ceil(angle / MAX_LINEAR_PROJECTION_STEP_ANGLE));

  let currentVector = previousVector;
  for (let step = 1; step <= steps; step += 1) {
    const stepUnit = step === steps ? targetUnit : normalizedLerp(previousUnit, targetUnit, step / steps);
    const stepDirection = { x: stepUnit.x * targetLength, y: stepUnit.y * targetLength };
    const amount = (currentVector.x * stepDirection.x + currentVector.y * stepDirection.y) / targetLengthSquared;
    currentVector = { x: amount * stepDirection.x, y: amount * stepDirection.y };
  }

  return { x: origin.x + currentVector.x, y: origin.y + currentVector.y };
}

function isPointInPersistedHalfPlane(
  lineA: Coordinates,
  lineB: Coordinates,
  side: 1 | -1,
  coordinates: Coordinates,
): boolean {
  return signedCross(lineA, lineB, coordinates) * side >= -1e-8;
}

function sameSideFrame(
  spec: DiagramScene,
  point: PositionedPoint,
  relation: RelationOf<'same-half-plane'>,
): { baseA: Coordinates; baseB: Coordinates; side: 1 | -1 } | undefined {
  const roles = sameSideRoles(relation);
  const baseA = resolvePointCoordinates(spec, roles.lineA);
  const baseB = resolvePointCoordinates(spec, roles.lineB);
  if (!baseA || !baseB) return undefined;
  // `side` se materializa al cargar o al primer movimiento. El fallback desde
  // la posición confirmada del punto solo cubre escenas sin materializar
  // durante el arrastre del punto restringido.
  const side: 1 | -1 = relation.side ?? computeHalfPlaneSide(baseA, baseB, pointPosition(point)!);
  return { baseA, baseB, side };
}

/**
 * `same-half-plane` sobre un soporte lineal: el semiplano 2D solo puede mover
 * el punto a lo largo del soporte (no puede sacarlo del rayo/recta).
 * Si el arrastre pediría salir y el punto ya está dentro, se mantiene (como
 * el semiplano solo impide cruzar).
 */
function clampOnSupportToSameSide(
  spec: DiagramScene,
  supportId: string,
  sameSideRelation: RelationOf<'same-half-plane'>,
  point: PositionedPoint,
  onSupport: Coordinates,
): Coordinates {
  const support = findObject(spec, supportId);
  if (!support) return onSupport;
  const frame = linearSupportFrame(spec, support);
  if (!frame) return onSupport;
  const halfPlane = sameSideFrame(spec, point, sameSideRelation);
  if (!halfPlane) return onSupport;
  const { baseA, baseB, side } = halfPlane;
  const position = pointPosition(point)!;
  if (isPointInPersistedHalfPlane(baseA, baseB, side, onSupport)) return onSupport;
  if (isPointInPersistedHalfPlane(baseA, baseB, side, position)) {
    return projectPointToSupport(spec, asGliderPoint(point, supportId), position);
  }
  const requested = parameterOnLinearSupport(frame, support, onSupport);
  const bounded = frame.minParameter === -Infinity ? requested : Math.max(frame.minParameter, requested);
  return pointAtLinearSupportParameter(frame, clampLinearParameterToHalfPlane(
    frame.origin,
    frame.direction,
    baseA,
    baseB,
    side,
    bounded,
    frame.minParameter,
  ));
}

function sameSideAllowsPoint(
  spec: DiagramScene,
  point: PositionedPoint,
  sameSideRelation: RelationOf<'same-half-plane'>,
  coordinates: Coordinates,
): boolean {
  const halfPlane = sameSideFrame(spec, point, sameSideRelation);
  if (!halfPlane) return true;
  return isPointInPersistedHalfPlane(halfPlane.baseA, halfPlane.baseB, halfPlane.side, coordinates);
}

function applySameSideConstraint(spec: DiagramScene, point: PositionedPoint, result: Coordinates, relation: RelationOf<'same-half-plane'>): Coordinates {
  const halfPlane = sameSideFrame(spec, point, relation);
  if (!halfPlane) return result;
  return constrainToHalfPlaneWithSide(halfPlane.baseA, halfPlane.baseB, halfPlane.side, result);
}

function applyInsideAreaConstraint(spec: DiagramScene, result: Coordinates, relation: RelationOf<'inside-area'>): Coordinates {
  const area = findObject(spec, relation.area);
  if (!area || area.objectType === 'point' || area.objectType === 'control') return result;
  const resolver = (model: DiagramScene, id: string) => resolvePointCoordinates(model, id);
  return constrainPointForAreaMembership(spec, area, result, relation.membership ?? 'interior', resolver);
}

function applyLinearConstraint(spec: DiagramScene, result: Coordinates, relation: RelationOf<'perpendicular' | 'parallel'>): Coordinates {
  const roles = linearRelationRoles(relation);
  if (!roles) return result;
  const baseA = resolvePointCoordinates(spec, roles.a);
  const baseB = resolvePointCoordinates(spec, roles.b);
  const origin = baseA;
  if (!baseA || !baseB || !origin) return result;
  const dx = baseB.x - baseA.x;
  const dy = baseB.y - baseA.y;
  const targetDirection = relation.type === 'perpendicular' ? { x: -dy, y: dx } : { x: dx, y: dy };
  return stabilizedProjectionOnDirection(origin, targetDirection, result);
}

function applyConstraint(spec: DiagramScene, point: PositionedPoint, result: Coordinates, relation: DiagramRelation): Coordinates {
  const participants = relationParticipants(relation, spec.objects);
  const otherId = [participants.target, ...participants.sources].find(ref => ref !== undefined && ref !== point.id);
  const other = otherId ? resolvePointCoordinates(spec, otherId) : undefined;
  switch (relation.type) {
    case 'coordinate-equality':
      if (!other) return result;
      return relation.axis === 'y' ? { x: result.x, y: other.y } : { x: other.x, y: result.y };
    case 'coincident': return other ?? result;
    case 'on-support': return otherId ? projectPointToSupport(spec, asGliderPoint(point, otherId), result) : result;
    case 'distance': return other ? applyDistanceConstraint(spec, result, other, relation) : result;
    case 'equal-length': return applyEqualLengthConstraint(spec, point, result, relation);
    case 'equal-angle': return applyEqualAngleConstraint(spec, point, result, relation);
    case 'inside-disk': return applyInsideDiskConstraint(spec, result, relation);
    case 'same-half-plane': return applySameSideConstraint(spec, point, result, relation);
    case 'inside-area': return applyInsideAreaConstraint(spec, result, relation);
    case 'reflection': return resolveReflectedPoint(spec, point, relation, new Set()) ?? result;
    case 'perpendicular': case 'parallel': return applyLinearConstraint(spec, result, relation);
    default: return result;
  }
}

function findOnSupportRelation(relations: readonly DiagramRelation[], pointId: string): RelationOf<'on-support'> | undefined {
  return relations.find((relation): relation is RelationOf<'on-support'> => relation.type === 'on-support' && relation.point === pointId);
}

function findSameSideRelation(relations: readonly DiagramRelation[], pointId: string): RelationOf<'same-half-plane'> | undefined {
  return relations.find((relation): relation is RelationOf<'same-half-plane'> => relation.type === 'same-half-plane' && relation.points[0] === pointId);
}

export function constrainPointCoordinates(
  spec: DiagramScene,
  point: PositionedPoint,
  coordinates: { x: number; y: number },
): { x: number; y: number } {
  const supportId = onSupportTargetId(spec, point);
  if (supportId && isJsxgraphOnSupportPoint(spec, point)) {
    return projectPointToSupport(spec, asGliderPoint(point, supportId), coordinates);
  }
  const position = pointPosition(point)!;
  if (point.mobility.type === 'axis-x') return { x: coordinates.x, y: position.y };
  if (point.mobility.type === 'axis-y') return { x: position.x, y: coordinates.y };
  const activeConstraints = activePointConstraints(spec, point);
  const onConstraint = findOnSupportRelation(activeConstraints, point.id);
  const sameSideConstraint = findSameSideRelation(activeConstraints, point.id);
  // Composición: `on-support` (como solo) y después el semiplano a lo largo del soporte.
  if (onConstraint && sameSideConstraint) {
    let result = projectPointToSupport(spec, asGliderPoint(point, onConstraint.support), coordinates);
    result = clampOnSupportToSameSide(spec, onConstraint.support, sameSideConstraint, point, result);
    for (const constraint of activeConstraints) {
      if (constraint.type === 'on-support' || constraint.type === 'same-half-plane') continue;
      result = applyConstraint(spec, point, result, constraint);
    }
    return result;
  }
  const equalLengthConstraint = activeConstraints.find((relation): relation is RelationOf<'equal-length'> => (
    relation.type === 'equal-length' && equalLengthRoles(relation, spec.objects).driven === point.id
  ));
  const exactSupportLength = onConstraint && equalLengthConstraint
    ? pointOnLinearSupportAtEqualLength(spec, point, coordinates, onConstraint.support, equalLengthConstraint)
    : undefined;
  let result = coordinates;
  if (exactSupportLength) result = exactSupportLength;
  for (const constraint of activeConstraints) {
    if (exactSupportLength && (constraint.id === onConstraint?.id || constraint.id === equalLengthConstraint?.id)) continue;
    result = applyConstraint(spec, point, result, constraint);
  }
  return result;
}

function angleMagnitude(spec: DiagramScene, angle: DiagramObject): number | undefined {
  if (!isMeasurableAngle(angle)) return undefined;
  const first = resolvePointCoordinates(spec, angle.points[0]);
  const vertex = resolvePointCoordinates(spec, angle.points[1]);
  const second = resolvePointCoordinates(spec, angle.points[2]);
  if (!first || !vertex || !second) return undefined;
  return angleMeasureRadians(angleSweep(angle), first, vertex, second);
}

function rotateUnit(vector: { x: number; y: number }, angle: number): { x: number; y: number } {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  return {
    x: vector.x * cosine - vector.y * sine,
    y: vector.x * sine + vector.y * cosine,
  };
}

function dot(first: { x: number; y: number }, second: { x: number; y: number }): number {
  return first.x * second.x + first.y * second.y;
}

const LINEAR_SUPPORT_KINDS = new Set(['segment', 'line', 'ray', 'perpendicular', 'parallel', 'angleBisector']);

function pointOnLinearSupportAtEqualLength(
  spec: DiagramScene,
  point: PositionedPoint,
  requested: { x: number; y: number },
  supportId: string,
  equalLengthRelation: RelationOf<'equal-length'>,
): { x: number; y: number } | undefined {
  const support = findObject(spec, supportId);
  const roles = equalLengthRoles(equalLengthRelation, spec.objects);
  const anchor = resolvePointCoordinates(spec, roles.anchor);
  const desiredLength = segmentLength(spec, roles.source);
  if (!support || !anchor || desiredLength === undefined) return undefined;
  const kind = objectKind(support);
  if (!LINEAR_SUPPORT_KINDS.has(kind)) return undefined;

  const carrier = linearSupportCarrier(spec, supportId, new Set());
  if (!carrier) return undefined;
  const dx = carrier.b.x - carrier.a.x;
  const dy = carrier.b.y - carrier.a.y;
  const carrierLength = Math.hypot(dx, dy);
  if (carrierLength < 1e-10) return undefined;
  const unitX = dx / carrierLength;
  const unitY = dy / carrierLength;
  const offsetX = carrier.a.x - anchor.x;
  const offsetY = carrier.a.y - anchor.y;
  const projection = offsetX * unitX + offsetY * unitY;
  const discriminant = projection * projection
    - (offsetX * offsetX + offsetY * offsetY - desiredLength * desiredLength);
  if (discriminant < -1e-10) return undefined;
  const root = Math.sqrt(Math.max(0, discriminant));
  const candidates = [-projection - root, -projection + root].filter(parameter => {
    if (kind === 'segment') return parameter >= -1e-10 && parameter <= carrierLength + 1e-10;
    if (kind === 'ray' || kind === 'angleBisector') return parameter >= -1e-10;
    return true;
  });
  if (candidates.length === 0) return undefined;
  const previous = pointPosition(point)!;
  const requestedParameter = (requested.x - carrier.a.x) * unitX + (requested.y - carrier.a.y) * unitY;
  const previousParameter = (previous.x - carrier.a.x) * unitX + (previous.y - carrier.a.y) * unitY;
  const preferredParameter = Number.isFinite(requestedParameter) ? requestedParameter : previousParameter;
  const parameter = candidates.reduce((best, candidate) => (
    Math.abs(candidate - preferredParameter) < Math.abs(best - preferredParameter) ? candidate : best
  ));
  return {
    x: carrier.a.x + parameter * unitX,
    y: carrier.a.y + parameter * unitY,
  };
}

/** Recoloca los puntos restringidos para que cumplan sus relaciones activas. */
export function withResolvedPointConstraints<T extends DiagramScene>(
  spec: T,
  options?: { skipPointIds?: readonly string[] },
): T {
  const skipPointIds = new Set(options?.skipPointIds ?? []);
  let current = spec;
  const maximumPasses = Math.max(1, spec.objects.filter(isPositionedPoint).length);
  for (let pass = 0; pass < maximumPasses; pass += 1) {
    let changed = false;
    for (const point of current.objects.filter(isPositionedPoint)) {
      if (skipPointIds.has(point.id)) continue;
      // Como `on-support` solo: el glider de JSXGraph mantiene el punto en el soporte.
      if (isJsxgraphOnSupportPoint(current, point)) continue;
      if (pointRelationIds(point).length === 0) continue;

      const position = pointPosition(point)!;
      const activeConstraints = activePointConstraints(current, point);
      const onConstraint = findOnSupportRelation(activeConstraints, point.id);
      const sameSideConstraint = findSameSideRelation(activeConstraints, point.id);

      let coordinates: Coordinates;
      if (onConstraint && sameSideConstraint) {
        // `on-support` como solo (no re-proyectar): el glider ya colocó el punto.
        // El semiplano solo actúa si sale de él, y sin sacar el punto del soporte.
        if (sameSideAllowsPoint(current, point, sameSideConstraint, position)) continue;
        const onSupport = projectPointToSupport(
          current,
          asGliderPoint(point, onConstraint.support),
          position,
        );
        coordinates = clampOnSupportToSameSide(
          current,
          onConstraint.support,
          sameSideConstraint,
          point,
          onSupport,
        );
        for (const constraint of activeConstraints) {
          if (constraint.type === 'on-support' || constraint.type === 'same-half-plane') continue;
          coordinates = applyConstraint(current, point, coordinates, constraint);
        }
      } else {
        coordinates = constrainPointCoordinates(current, point, position);
      }

      if (Math.abs(coordinates.x - position.x) <= 1e-10 && Math.abs(coordinates.y - position.y) <= 1e-10) continue;
      current = withPositionedPointAt(current, point.id, coordinates);
      changed = true;
    }
    if (!changed) break;
  }
  return current;
}

