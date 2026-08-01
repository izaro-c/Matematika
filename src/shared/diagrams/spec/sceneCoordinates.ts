import type {
  DiagramConstraint,
  DiagramElement,
  DiagramPoint,
} from './types';
import type { DiagramSceneBag } from './sceneTypes';
import { evaluateMathExpression } from './expressions';
import { legacyElementCapabilities } from './semantics';

export type Coordinates = { x: number; y: number };

function resolveExpressionPoint(spec: DiagramSceneBag, point: DiagramPoint, visiting: Set<string>): Coordinates {
  const variables: Record<string, number> = {};
  for (const dependencyId of point.dependencies ?? []) {
    const coordinates = resolvePointCoordinates(spec, dependencyId, new Set(visiting));
    if (coordinates) {
      variables[`${dependencyId}.x`] = coordinates.x;
      variables[`${dependencyId}.y`] = coordinates.y;
    }
    const slider = spec.sliders.find(item => item.id === dependencyId);
    if (slider) variables[dependencyId] = slider.value;
  }
  try {
    return {
      x: evaluateMathExpression(point.xExpression!, variables),
      y: evaluateMathExpression(point.yExpression!, variables),
    };
  } catch {
    return { x: point.x, y: point.y };
  }
}

function resolveConstructedPoint(spec: DiagramSceneBag, derived: DiagramElement, visiting: Set<string>): Coordinates | undefined {
  if (derived.kind === 'intersection') {
    const first = linearSupportCarrier(spec, derived.refs[0], visiting);
    const second = linearSupportCarrier(spec, derived.refs[1], visiting);
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
  if (derived.kind === 'midpoint') {
    const a = resolvePointCoordinates(spec, derived.refs[0], visiting);
    const b = resolvePointCoordinates(spec, derived.refs[1], visiting);
    return a && b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : undefined;
  }
  if (derived.kind === 'perpendicularFoot') {
    const a = resolvePointCoordinates(spec, derived.refs[0], visiting);
    const b = resolvePointCoordinates(spec, derived.refs[1], visiting);
    const source = resolvePointCoordinates(spec, derived.refs[2], visiting);
    if (!a || !b || !source) return undefined;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lengthSquared = dx * dx + dy * dy || 1;
    const t = ((source.x - a.x) * dx + (source.y - a.y) * dy) / lengthSquared;
    return { x: a.x + dx * t, y: a.y + dy * t };
  }
  return undefined;
}

export function resolveReflectedPoint(
  spec: DiagramSceneBag,
  direct: DiagramPoint,
  constraint: DiagramConstraint,
  visiting: Set<string>,
): Coordinates | undefined {
  const targetId = constraint.refs[0];
  const centerOrAxisId = constraint.refs[1];
  const sourceId = constraint.refs.length >= 3 ? constraint.refs[2] : targetId;

  let sourceCoords: Coordinates | undefined;
  if (sourceId === direct.id) {
    sourceCoords = { x: direct.x, y: direct.y };
  } else {
    sourceCoords = resolvePointCoordinates(spec, sourceId, visiting);
  }
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

export function resolvePointCoordinates(spec: DiagramSceneBag, id: string, visiting = new Set<string>()): Coordinates | undefined {
  const direct = spec.points.find(point => point.id === id);
  if (visiting.has(id)) return undefined;
  visiting.add(id);

  if (direct) {
    if (direct.constraint === 'constrained' && direct.constraintIds?.length) {
      const reflectionConstraint = spec.constraints?.find(c => (
        c.enabled
        && c.kind === 'reflection'
        && direct.constraintIds?.includes(c.id)
      ));
      if (reflectionConstraint) {
        const reflected = resolveReflectedPoint(spec, direct, reflectionConstraint, visiting);
        if (reflected) return reflected;
      }
    }
    if (direct.constraint === 'derived' && direct.xExpression && direct.yExpression) {
      return resolveExpressionPoint(spec, direct, visiting);
    }
    return { x: direct.x, y: direct.y };
  }

  const derived = spec.elements.find(element => element.id === id);
  return derived ? resolveConstructedPoint(spec, derived, visiting) : undefined;
}

export function linearSupportCarrier(
  spec: DiagramSceneBag,
  id: string,
  visiting: Set<string>,
): { a: { x: number; y: number }; b: { x: number; y: number } } | undefined {
  const support = spec.elements.find(element => element.id === id);
  if (!support) return undefined;
  const first = resolvePointCoordinates(spec, support.refs[0], new Set(visiting));
  const second = resolvePointCoordinates(spec, support.refs[1], new Set(visiting));
  if (!first || !second) return undefined;
  if (support.kind === 'segment' || support.kind === 'line' || support.kind === 'ray') return { a: first, b: second };
  const through = resolvePointCoordinates(spec, support.refs[2], new Set(visiting));
  if (!through) return undefined;
  if (support.kind === 'parallel') {
    return { a: through, b: { x: through.x + second.x - first.x, y: through.y + second.y - first.y } };
  }
  if (support.kind === 'perpendicular') {
    return { a: through, b: { x: through.x - (second.y - first.y), y: through.y + second.x - first.x } };
  }
  if (support.kind === 'angleBisector') {
    const vertex = second;
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
  return undefined;
}

export function expressionVariables(spec: DiagramSceneBag): Record<string, number> {
  const variables: Record<string, number> = {};
  spec.points.forEach(point => {
    const coordinates = resolvePointCoordinates(spec, point.id);
    if (!coordinates) return;
    variables[`${point.id}.x`] = coordinates.x;
    variables[`${point.id}.y`] = coordinates.y;
  });
  spec.sliders.forEach(slider => {
    variables[slider.id] = slider.value;
  });
  spec.elements.forEach(element => {
    const coordinates = resolvePointCoordinates(spec, element.id);
    if (coordinates) {
      variables[`${element.id}.x`] = coordinates.x;
      variables[`${element.id}.y`] = coordinates.y;
    }
    if (element.refs.length >= 2) {
      const a = resolvePointCoordinates(spec, element.refs[0]);
      const b = resolvePointCoordinates(spec, element.refs[1]);
      if (a && b) variables[`${element.id}.length`] = Math.hypot(b.x - a.x, b.y - a.y);
    }
    if ((element.kind === 'angle' || element.kind === 'nonReflexAngle') && element.refs.length >= 3) {
      const first = resolvePointCoordinates(spec, element.refs[0]);
      const vertex = resolvePointCoordinates(spec, element.refs[1]);
      const second = resolvePointCoordinates(spec, element.refs[2]);
      const radians = first && vertex && second
        ? angleMeasureRadians(element.kind, first, vertex, second)
        : undefined;
      if (radians !== undefined) {
        variables[`${element.id}.value`] = radians;
        variables[`${element.id}.radians`] = radians;
        variables[`${element.id}.degrees`] = radians * 180 / Math.PI;
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

export function supportElements(spec: DiagramSceneBag): DiagramElement[] {
  return spec.elements.filter(item => legacyElementCapabilities(item.kind).has('support'));
}

function projectToCircle(spec: DiagramSceneBag, support: DiagramElement, coordinates: Coordinates): Coordinates {
  const center = resolvePointCoordinates(spec, support.refs[0]);
  const edge = resolvePointCoordinates(spec, support.refs[1]);
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

export function linearProjectionDirection(support: DiagramElement, a: Coordinates, b: Coordinates, through: Coordinates | undefined): Coordinates {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (support.kind === 'angleBisector') return angleBisectorDirection(a, b, through) ?? { x: dx, y: dy };
  if (support.kind === 'perpendicular') return { x: -dy, y: dx };
  return { x: dx, y: dy };
}

export function activePointConstraints(spec: DiagramSceneBag, point: DiagramPoint): DiagramConstraint[] {
  return (point.constraintIds ?? [])
    .map(constraintId => (spec.constraints ?? []).find(item => item.id === constraintId && item.enabled))
    .filter((constraint): constraint is DiagramConstraint => Boolean(constraint));
}

/** Soporte de deslizamiento: `glider` directo o relación `on` en relaciones combinadas. */
export function onSupportTargetId(spec: DiagramSceneBag, point: DiagramPoint): string | undefined {
  if (point.constraint === 'glider' && point.gliderTarget) return point.gliderTarget;
  if (point.constraint === 'constrained') {
    const on = activePointConstraints(spec, point).find(constraint => (
      constraint.kind === 'on' && constraint.refs[0] === point.id
    ));
    if (on) return on.refs[1];
  }
  return undefined;
}

/** Punto cuya posición en el soporte mantiene JSXGraph sin re-resolución pasiva. */
export function isJsxgraphOnSupportPoint(spec: DiagramSceneBag, point: DiagramPoint): boolean {
  if (!onSupportTargetId(spec, point)) return false;
  if (point.constraint === 'glider') return true;
  return point.constraint === 'constrained' && activePointConstraints(spec, point).length === 1;
}

export function asGliderPoint(point: DiagramPoint, supportId: string): DiagramPoint {
  return { ...point, constraint: 'glider', gliderTarget: supportId };
}

export function projectPointToSupport(
  spec: DiagramSceneBag,
  point: DiagramPoint,
  coordinates: { x: number; y: number },
): { x: number; y: number } {
  if (!point.gliderTarget) return coordinates;
  const support = spec.elements.find(item => item.id === point.gliderTarget);
  if (!support) return coordinates;

  if (support.kind === 'circle') return projectToCircle(spec, support, coordinates);

  const a = resolvePointCoordinates(spec, support.refs[0]);
  const b = resolvePointCoordinates(spec, support.refs[1]);
  const through = resolvePointCoordinates(spec, support.refs[2]);
  const lineA = support.kind === 'perpendicular' || support.kind === 'parallel' ? through : a;
  if (!lineA || !a || !b) return coordinates;

  const angleVertex = support.kind === 'angleBisector' ? b : undefined;
  const direction = linearProjectionDirection(support, a, b, through);
  const origin = support.kind === 'angleBisector' && angleVertex ? angleVertex : lineA;
  const lengthSquared = direction.x * direction.x + direction.y * direction.y || 1;
  const t = ((coordinates.x - origin.x) * direction.x + (coordinates.y - origin.y) * direction.y) / lengthSquared;
  const projectedT = support.kind === 'ray' || support.kind === 'angleBisector' ? Math.max(0, t) : t;
  return { x: origin.x + direction.x * projectedT, y: origin.y + direction.y * projectedT };
}
