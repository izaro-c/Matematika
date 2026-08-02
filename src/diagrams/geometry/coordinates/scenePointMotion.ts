import type {
  DiagramConstraint,
  DiagramElement,
  DiagramPoint,
  DiagramSpecV2,
} from '@/diagrams/model/schema/types';
import type { DiagramSpecV3 } from '@/diagrams/model/schema/v3';
import type { DiagramSceneBag } from '@/diagrams/geometry/layout/sceneTypes';
import { evaluateMathExpression } from '@/diagrams/model/expressions/expressions';
import { toWorkingSceneV2 } from '@/diagrams/model/schema/v3Compatibility';
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
} from '@/diagrams/geometry/coordinates/sceneCoordinates';

/**
 * Rellena `constraint.side` en restricciones `sameSide` que aún no lo tienen.
 * El signo se congela en la geometría actual para que el semiplano sea
 * invariante cuando se mueven los puntos de frontera.
 */
export function materializeSameSideConstraints(spec: DiagramSpecV2): DiagramSpecV2 {
  if (!spec.constraints?.some(constraint => constraint.kind === 'sameSide' && constraint.side === undefined)) {
    return spec;
  }
  const constraints = spec.constraints.map(constraint => {
    if (constraint.kind !== 'sameSide' || constraint.side !== undefined || constraint.refs.length < 3) {
      return constraint;
    }
    const sidePoint = resolvePointCoordinates(spec, constraint.refs[0]);
    const lineA = resolvePointCoordinates(spec, constraint.refs[1]);
    const lineB = resolvePointCoordinates(spec, constraint.refs[2]);
    if (!sidePoint || !lineA || !lineB) return constraint;
    return { ...constraint, side: computeHalfPlaneSide(lineA, lineB, sidePoint) };
  });
  return { ...spec, constraints };
}

/** Normaliza V2|V3 a V2 materializado para el pipeline de escena/runtime (Fase 1). */
export function prepareSceneSpec(inputSpec: DiagramSpecV2 | DiagramSpecV3): DiagramSpecV2 {
  if (inputSpec.version !== 3) {
    return withResolvedPointConstraints(materializeSameSideConstraints(inputSpec));
  }
  const projected = toWorkingSceneV2(inputSpec);
  // Overrides enumerables (workbench / preview) ganan sobre la proyección interna.
  type SceneOverrides = Partial<Pick<DiagramSpecV2, 'points' | 'elements' | 'sliders' | 'constraints' | 'dependencies'>>;
  const compatibility = inputSpec as DiagramSpecV3 & SceneOverrides;
  if (!Object.prototype.propertyIsEnumerable.call(inputSpec, 'points')) {
    return withResolvedPointConstraints(materializeSameSideConstraints(projected));
  }
  const merged: DiagramSpecV2 = {
    ...projected,
    points: Array.isArray(compatibility.points) ? [...compatibility.points] : projected.points,
    elements: Array.isArray(compatibility.elements) ? [...compatibility.elements] : projected.elements,
    sliders: Array.isArray(compatibility.sliders) ? [...compatibility.sliders] : projected.sliders,
    ...(Object.prototype.propertyIsEnumerable.call(inputSpec, 'constraints')
      ? { constraints: compatibility.constraints }
      : {}),
    ...(Object.prototype.propertyIsEnumerable.call(inputSpec, 'dependencies')
      ? { dependencies: compatibility.dependencies }
      : {}),
  };
  return withResolvedPointConstraints(materializeSameSideConstraints(merged));
}

export function withMovedPoint(inputSpec: DiagramSpecV2 | DiagramSpecV3, pointId: string, x: number, y: number): DiagramSpecV2 {
  const spec = materializeSameSideConstraints(
    inputSpec.version === 3 ? toWorkingSceneV2(inputSpec) : inputSpec,
  );
  const point = spec.points.find(item => item.id === pointId);
  if (!point || point.fixed || point.constraint === 'fixed' || point.constraint === 'derived') return spec;
  const constrained = constrainPointCoordinates(spec, point, { x, y });
  const moved = {
    ...spec,
    points: spec.points.map(item => item.id === pointId ? { ...item, ...constrained } : item),
  };
  return withResolvedPointConstraints(moved, { skipPointIds: [pointId] });
}

function applyDistanceConstraint(spec: DiagramSceneBag, result: Coordinates, other: Coordinates, constraint: DiagramConstraint): Coordinates {
  const variables = expressionVariables(spec);
  const distance = constraint.value ?? (constraint.expression ? evaluateMathExpression(constraint.expression, variables) : 0);
  const dx = result.x - other.x;
  const dy = result.y - other.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: other.x + dx / length * distance, y: other.y + dy / length * distance };
}

function applyEqualLengthConstraint(spec: DiagramSceneBag, point: DiagramPoint, result: Coordinates, constraint: DiagramConstraint): Coordinates {
  if (constraint.refs.length < 3) return result;
  const anchor = resolvePointCoordinates(spec, constraint.refs[1]);
  const sourceSegment = spec.elements.find(element => element.id === constraint.refs[2] && element.kind === 'segment');
  const sourceA = sourceSegment ? resolvePointCoordinates(spec, sourceSegment.refs[0]) : undefined;
  const sourceB = sourceSegment ? resolvePointCoordinates(spec, sourceSegment.refs[1]) : undefined;
  if (!anchor || !sourceA || !sourceB) return result;
  const desiredLength = Math.hypot(sourceB.x - sourceA.x, sourceB.y - sourceA.y);
  const requestedDx = result.x - anchor.x;
  const requestedDy = result.y - anchor.y;
  const previousDx = point.x - anchor.x;
  const previousDy = point.y - anchor.y;
  const directionLength = Math.hypot(requestedDx, requestedDy);
  const fallbackLength = Math.hypot(previousDx, previousDy) || 1;
  const directionX = directionLength > 1e-10 ? requestedDx / directionLength : previousDx / fallbackLength;
  const directionY = directionLength > 1e-10 ? requestedDy / directionLength : previousDy / fallbackLength;
  return { x: anchor.x + directionX * desiredLength, y: anchor.y + directionY * desiredLength };
}

function applyEqualAngleConstraint(spec: DiagramSceneBag, point: DiagramPoint, result: Coordinates, constraint: DiagramConstraint): Coordinates {
  if (constraint.refs.length < 5) return result;
  const vertex = resolvePointCoordinates(spec, constraint.refs[1]);
  const fixedRayPoint = resolvePointCoordinates(spec, constraint.refs[2]);
  const sourceAngle = spec.elements.find(element => element.id === constraint.refs[3]);
  const targetAngle = spec.elements.find(element => element.id === constraint.refs[4]);
  const desiredAngle = sourceAngle ? angleMagnitude(spec, sourceAngle) : undefined;
  if (!vertex || !fixedRayPoint || !targetAngle || desiredAngle === undefined) return result;
  const fixedDx = fixedRayPoint.x - vertex.x;
  const fixedDy = fixedRayPoint.y - vertex.y;
  const fixedLength = Math.hypot(fixedDx, fixedDy);
  if (fixedLength < 1e-10) return result;
  const requestedDx = result.x - vertex.x;
  const requestedDy = result.y - vertex.y;
  const previousDx = point.x - vertex.x;
  const previousDy = point.y - vertex.y;
  const requestedLength = Math.hypot(requestedDx, requestedDy);
  const radius = requestedLength > 1e-10 ? requestedLength : Math.hypot(previousDx, previousDy);
  if (radius < 1e-10) return result;
  const fixedDirection = { x: fixedDx / fixedLength, y: fixedDy / fixedLength };
  const orientedRotation = targetAngle.refs[0] === point.id ? -desiredAngle : desiredAngle;
  let direction = rotateUnit(fixedDirection, orientedRotation);
  if (targetAngle.kind === 'nonReflexAngle') {
    const alternate = rotateUnit(fixedDirection, -orientedRotation);
    const requestedDirection = requestedLength > 1e-10
      ? { x: requestedDx / requestedLength, y: requestedDy / requestedLength }
      : { x: previousDx / radius, y: previousDy / radius };
    if (dot(alternate, requestedDirection) > dot(direction, requestedDirection)) direction = alternate;
  }
  return { x: vertex.x + direction.x * radius, y: vertex.y + direction.y * radius };
}

function applyMidpointConstraint(spec: DiagramSceneBag, result: Coordinates, constraint: DiagramConstraint): Coordinates {
  if (constraint.refs.length < 3) return result;
  const first = resolvePointCoordinates(spec, constraint.refs[1]);
  const second = resolvePointCoordinates(spec, constraint.refs[2]);
  return first && second ? { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 } : result;
}

function applyInsideDiskConstraint(spec: DiagramSceneBag, result: Coordinates, constraint: DiagramConstraint): Coordinates {
  if (constraint.refs.length < 3) return result;
  const center = resolvePointCoordinates(spec, constraint.refs[1]);
  const boundary = resolvePointCoordinates(spec, constraint.refs[2]);
  if (!center || !boundary) return result;
  const radius = Math.hypot(boundary.x - center.x, boundary.y - center.y) * 0.999;
  const dx = result.x - center.x;
  const dy = result.y - center.y;
  const length = Math.hypot(dx, dy);
  return length > radius ? { x: center.x + dx / length * radius, y: center.y + dy / length * radius } : result;
}

function linearSupportFrame(
  spec: DiagramSceneBag,
  support: DiagramElement,
): { origin: Coordinates; direction: Coordinates; minParameter: number } | undefined {
  const a = resolvePointCoordinates(spec, support.refs[0]);
  const b = resolvePointCoordinates(spec, support.refs[1]);
  const through = resolvePointCoordinates(spec, support.refs[2]);
  const lineA = support.kind === 'perpendicular' || support.kind === 'parallel' ? through : a;
  if (!lineA || !a || !b) return undefined;
  const direction = linearProjectionDirection(support, a, b, through);
  const origin = support.kind === 'angleBisector' ? b : lineA;
  const minParameter = support.kind === 'ray' || support.kind === 'angleBisector' ? 0 : -Infinity;
  return { origin, direction, minParameter };
}

function parameterOnLinearSupport(
  frame: { origin: Coordinates; direction: Coordinates },
  support: DiagramElement,
  coordinates: Coordinates,
): number {
  const lengthSquared = frame.direction.x * frame.direction.x + frame.direction.y * frame.direction.y || 1;
  const t = ((coordinates.x - frame.origin.x) * frame.direction.x + (coordinates.y - frame.origin.y) * frame.direction.y) / lengthSquared;
  if (support.kind === 'ray' || support.kind === 'angleBisector') return Math.max(0, t);
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

/**
 * `sameSide` sobre un soporte lineal: el semiplano 2D solo puede mover el punto
 * a lo largo del soporte (no puede sacarlo del rayo/recta).
 * Si el arrastre pediría salir y el punto ya está dentro, se mantiene (como
 * `sameSide` solo impide cruzar).
 */
function clampOnSupportToSameSide(
  spec: DiagramSceneBag,
  supportId: string,
  sameSideConstraint: DiagramConstraint,
  point: DiagramPoint,
  onSupport: Coordinates,
): Coordinates {
  const support = spec.elements.find(element => element.id === supportId);
  if (!support) return onSupport;
  const frame = linearSupportFrame(spec, support);
  if (!frame) return onSupport;
  const baseA = resolvePointCoordinates(spec, sameSideConstraint.refs[1]);
  const baseB = resolvePointCoordinates(spec, sameSideConstraint.refs[2]);
  if (!baseA || !baseB) return onSupport;
  const side: 1 | -1 = sameSideConstraint.side ?? computeHalfPlaneSide(baseA, baseB, point);
  if (isPointInPersistedHalfPlane(baseA, baseB, side, onSupport)) return onSupport;
  if (isPointInPersistedHalfPlane(baseA, baseB, side, point)) {
    return projectPointToSupport(spec, asGliderPoint(point, supportId), point);
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
  spec: DiagramSceneBag,
  point: DiagramPoint,
  sameSideConstraint: DiagramConstraint,
  coordinates: Coordinates,
): boolean {
  const baseA = resolvePointCoordinates(spec, sameSideConstraint.refs[1]);
  const baseB = resolvePointCoordinates(spec, sameSideConstraint.refs[2]);
  if (!baseA || !baseB) return true;
  const side: 1 | -1 = sameSideConstraint.side ?? computeHalfPlaneSide(baseA, baseB, point);
  return isPointInPersistedHalfPlane(baseA, baseB, side, coordinates);
}

function applySameSideConstraint(spec: DiagramSceneBag, point: DiagramPoint, result: Coordinates, constraint: DiagramConstraint): Coordinates {
  if (constraint.refs.length < 3) return result;
  const baseA = resolvePointCoordinates(spec, constraint.refs[1]);
  const baseB = resolvePointCoordinates(spec, constraint.refs[2]);
  if (!baseA || !baseB) return result;

  // `constraint.side` se materializa al cargar o al primer movimiento. El
  // fallback desde la posición confirmada del punto solo cubre specs
  // legadas durante el arrastre del punto restringido.
  const side: 1 | -1 = constraint.side
    ?? computeHalfPlaneSide(baseA, baseB, point);

  return constrainToHalfPlaneWithSide(baseA, baseB, side, result);
}

function applyInsideAreaConstraint(spec: DiagramSceneBag, result: Coordinates, constraint: DiagramConstraint): Coordinates {
  if (constraint.refs.length < 2) return result;
  const area = spec.elements.find(element => element.id === constraint.refs[1]);
  if (!area) return result;
  const resolver = (model: DiagramSceneBag, id: string) => resolvePointCoordinates(model, id);
  return constrainPointForAreaMembership(spec as DiagramSpecV2, area, result, constraint.areaMembership ?? 'interior', resolver as (model: DiagramSpecV2, id: string) => Coordinates | undefined);
}

function applyLinearConstraint(spec: DiagramSceneBag, result: Coordinates, constraint: DiagramConstraint): Coordinates {
  if (constraint.refs.length < 3) return result;
  const baseA = resolvePointCoordinates(spec, constraint.refs[1]);
  const baseB = resolvePointCoordinates(spec, constraint.refs[2]);
  const origin = constraint.refs[3] ? resolvePointCoordinates(spec, constraint.refs[3]) : baseA;
  if (!baseA || !baseB || !origin) return result;
  const dx = baseB.x - baseA.x;
  const dy = baseB.y - baseA.y;
  const targetDirection = constraint.kind === 'perpendicular' ? { x: -dy, y: dx } : { x: dx, y: dy };
  return stabilizedProjectionOnDirection(origin, targetDirection, result);
}

function applyConstraint(spec: DiagramSceneBag, point: DiagramPoint, result: Coordinates, constraint: DiagramConstraint): Coordinates {
  const otherId = constraint.refs.find(ref => ref !== point.id);
  const other = otherId ? resolvePointCoordinates(spec, otherId) : undefined;
  switch (constraint.kind) {
    case 'fixed': return { x: point.x, y: point.y };
    case 'horizontal': return other ? { x: result.x, y: other.y } : result;
    case 'vertical': return other ? { x: other.x, y: result.y } : result;
    case 'coincident': return other ?? result;
    case 'on': return otherId ? projectPointToSupport(spec, { ...point, constraint: 'glider', gliderTarget: otherId }, result) : result;
    case 'distance': return other ? applyDistanceConstraint(spec, result, other, constraint) : result;
    case 'equalLength': return applyEqualLengthConstraint(spec, point, result, constraint);
    case 'equalAngle': return applyEqualAngleConstraint(spec, point, result, constraint);
    case 'midpoint': return applyMidpointConstraint(spec, result, constraint);
    case 'insideDisk': return applyInsideDiskConstraint(spec, result, constraint);
    case 'sameSide': return applySameSideConstraint(spec, point, result, constraint);
    case 'insideArea': return applyInsideAreaConstraint(spec, result, constraint);
    case 'reflection': return resolveReflectedPoint(spec, point, constraint, new Set()) ?? result;
    case 'perpendicular': case 'parallel': return applyLinearConstraint(spec, result, constraint);
    default: return result;
  }
}

export function constrainPointCoordinates(
  spec: DiagramSceneBag,
  point: DiagramPoint,
  coordinates: { x: number; y: number },
): { x: number; y: number } {
  const supportId = onSupportTargetId(spec, point);
  if (supportId && isJsxgraphOnSupportPoint(spec, point)) {
    return projectPointToSupport(spec, asGliderPoint(point, supportId), coordinates);
  }
  if (point.constraint === 'horizontal') return { x: coordinates.x, y: point.y };
  if (point.constraint === 'vertical') return { x: point.x, y: coordinates.y };
  const activeConstraints = activePointConstraints(spec, point);
  const onConstraint = activeConstraints.find(constraint => constraint.kind === 'on' && constraint.refs[0] === point.id);
  const sameSideConstraint = activeConstraints.find(constraint => constraint.kind === 'sameSide' && constraint.refs[0] === point.id);
  // Composición: `on` (como solo) y después `sameSide` a lo largo del soporte.
  if (onConstraint && sameSideConstraint) {
    let result = projectPointToSupport(spec, asGliderPoint(point, onConstraint.refs[1]), coordinates);
    result = clampOnSupportToSameSide(spec, onConstraint.refs[1], sameSideConstraint, point, result);
    for (const constraint of activeConstraints) {
      if (constraint.kind === 'on' || constraint.kind === 'sameSide') continue;
      result = applyConstraint(spec, point, result, constraint);
    }
    return result;
  }
  const equalLengthConstraint = activeConstraints.find(constraint => constraint.kind === 'equalLength' && constraint.refs[0] === point.id);
  const exactSupportLength = onConstraint && equalLengthConstraint
    ? pointOnLinearSupportAtEqualLength(spec, point, coordinates, onConstraint.refs[1], equalLengthConstraint)
    : undefined;
  let result = coordinates;
  if (exactSupportLength) result = exactSupportLength;
  for (const constraint of activeConstraints) {
    if (exactSupportLength && (constraint.id === onConstraint?.id || constraint.id === equalLengthConstraint?.id)) continue;
    result = applyConstraint(spec, point, result, constraint);
  }
  return result;
}

function angleMagnitude(spec: DiagramSceneBag, angle: DiagramElement): number | undefined {
  const first = resolvePointCoordinates(spec, angle.refs[0]);
  const vertex = resolvePointCoordinates(spec, angle.refs[1]);
  const second = resolvePointCoordinates(spec, angle.refs[2]);
  if (!first || !vertex || !second) return undefined;
  if (angle.kind !== 'angle' && angle.kind !== 'nonReflexAngle') return undefined;
  return angleMeasureRadians(angle.kind, first, vertex, second);
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

function pointOnLinearSupportAtEqualLength(
  spec: DiagramSceneBag,
  point: DiagramPoint,
  requested: { x: number; y: number },
  supportId: string,
  equalLengthConstraint: DiagramConstraint,
): { x: number; y: number } | undefined {
  const support = spec.elements.find(element => element.id === supportId);
  const sourceSegment = spec.elements.find(element => element.id === equalLengthConstraint.refs[2] && element.kind === 'segment');
  const anchor = resolvePointCoordinates(spec, equalLengthConstraint.refs[1]);
  const sourceA = sourceSegment ? resolvePointCoordinates(spec, sourceSegment.refs[0]) : undefined;
  const sourceB = sourceSegment ? resolvePointCoordinates(spec, sourceSegment.refs[1]) : undefined;
  if (!support || !anchor || !sourceA || !sourceB) return undefined;
  if (!['segment', 'line', 'ray', 'perpendicular', 'parallel', 'angleBisector'].includes(support.kind)) return undefined;

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
  const desiredLength = Math.hypot(sourceB.x - sourceA.x, sourceB.y - sourceA.y);
  const discriminant = projection * projection
    - (offsetX * offsetX + offsetY * offsetY - desiredLength * desiredLength);
  if (discriminant < -1e-10) return undefined;
  const root = Math.sqrt(Math.max(0, discriminant));
  const candidates = [-projection - root, -projection + root].filter(parameter => {
    if (support.kind === 'segment') return parameter >= -1e-10 && parameter <= carrierLength + 1e-10;
    if (support.kind === 'ray' || support.kind === 'angleBisector') return parameter >= -1e-10;
    return true;
  });
  if (candidates.length === 0) return undefined;
  const requestedParameter = (requested.x - carrier.a.x) * unitX + (requested.y - carrier.a.y) * unitY;
  const previousParameter = (point.x - carrier.a.x) * unitX + (point.y - carrier.a.y) * unitY;
  const preferredParameter = Number.isFinite(requestedParameter) ? requestedParameter : previousParameter;
  const parameter = candidates.reduce((best, candidate) => (
    Math.abs(candidate - preferredParameter) < Math.abs(best - preferredParameter) ? candidate : best
  ));
  return {
    x: carrier.a.x + parameter * unitX,
    y: carrier.a.y + parameter * unitY,
  };
}

export function withResolvedPointConstraints<T extends DiagramSceneBag>(
  spec: T,
  options?: { skipPointIds?: readonly string[] },
): T {
  const skipPointIds = new Set(options?.skipPointIds ?? []);
  let current = spec;
  const maximumPasses = Math.max(1, spec.points.length);
  for (let pass = 0; pass < maximumPasses; pass += 1) {
    let changed = false;
    for (const point of current.points) {
      if (skipPointIds.has(point.id)) continue;
      // Como `on` solo: el glider de JSXGraph mantiene el punto en el soporte.
      if (isJsxgraphOnSupportPoint(current, point)) continue;
      if (!point.constraintIds?.length) continue;

      const activeConstraints = activePointConstraints(current, point);
      const onConstraint = activeConstraints.find(constraint => (
        constraint.kind === 'on' && constraint.refs[0] === point.id
      ));
      const sameSideConstraint = activeConstraints.find(constraint => (
        constraint.kind === 'sameSide' && constraint.refs[0] === point.id
      ));

      let coordinates: Coordinates;
      if (onConstraint && sameSideConstraint) {
        // `on` como solo (no re-proyectar): el glider ya colocó el punto.
        // `sameSide` como solo: solo actuar si sale del semiplano, y sin
        // sacar el punto del soporte.
        if (sameSideAllowsPoint(current, point, sameSideConstraint, point)) continue;
        const onSupport = projectPointToSupport(
          current,
          asGliderPoint(point, onConstraint.refs[1]),
          point,
        );
        coordinates = clampOnSupportToSameSide(
          current,
          onConstraint.refs[1],
          sameSideConstraint,
          point,
          onSupport,
        );
        for (const constraint of activeConstraints) {
          if (constraint.kind === 'on' || constraint.kind === 'sameSide') continue;
          coordinates = applyConstraint(current, point, coordinates, constraint);
        }
      } else {
        coordinates = constrainPointCoordinates(current, point, { x: point.x, y: point.y });
      }

      if (Math.abs(coordinates.x - point.x) <= 1e-10 && Math.abs(coordinates.y - point.y) <= 1e-10) continue;
      current = {
        ...current,
        points: current.points.map(item => item.id === point.id ? { ...item, ...coordinates } : item),
      };
      changed = true;
    }
    if (!changed) break;
  }
  return current;
}
