import type { DiagramBounds, DiagramElement, DiagramSpecV2 } from './types';
import { evaluateMathExpression } from './expressions';
import {
  pointInPolygon,
  polygonSignedArea,
  type Coordinates,
} from './areaGeometry';

export type CurveAreaFill = 'none' | 'interior' | 'half-plane';

export const DEFAULT_CURVE_SAMPLES = 64;
export const MAX_CURVE_SAMPLES = 256;
export const MAX_CURVE_INTERIOR_LOOPS = 8;
const EXTERIOR_LOOP_AREA_RATIO = 0.85;

export function curveAreaFill(element: DiagramElement): CurveAreaFill {
  const mode = element.properties?.areaFill;
  if (mode === 'half-plane') return 'half-plane';
  if (mode === 'interior' && element.kind === 'parametricCurve') return 'interior';
  return 'none';
}

export function curveActsAsArea(element: DiagramElement): boolean {
  return (element.kind === 'functionCurve' || element.kind === 'parametricCurve')
    && curveAreaFill(element) !== 'none';
}

function finiteSample(value: number): number | undefined {
  return Number.isFinite(value) ? value : undefined;
}

export function sampleCurveElement(
  element: DiagramElement,
  variables: Record<string, number>,
): Coordinates[] {
  const properties = element.properties;
  if (!properties?.domain) return [];
  const [minimum, maximum] = properties.domain;
  const requested = properties.samples ?? DEFAULT_CURVE_SAMPLES;
  const samples = Math.min(MAX_CURVE_SAMPLES, Math.max(8, requested));
  const parameter = properties.parameter ?? (element.kind === 'functionCurve' ? 'x' : 't');
  const coordinates: Coordinates[] = [];

  for (let index = 0; index <= samples; index += 1) {
    const value = minimum + (maximum - minimum) * index / samples;
    const scope = { ...variables, [parameter]: value, x: value, t: value };
    try {
      if (element.kind === 'functionCurve' && properties.expression) {
        const y = finiteSample(evaluateMathExpression(properties.expression, scope));
        if (y !== undefined) coordinates.push({ x: value, y });
      } else if (element.kind === 'parametricCurve' && properties.xExpression && properties.yExpression) {
        const x = finiteSample(evaluateMathExpression(properties.xExpression, scope));
        const y = finiteSample(evaluateMathExpression(properties.yExpression, scope));
        if (x !== undefined && y !== undefined) coordinates.push({ x, y });
      }
    } catch {
      // Expresiones inválidas se omiten; el validador de schema reporta el error.
    }
  }
  return coordinates;
}

export function sampleCurveFromSpec(
  spec: DiagramSpecV2,
  element: DiagramElement,
  variables?: Record<string, number>,
): Coordinates[] {
  const resolved = variables ?? buildStaticCurveVariables(spec);
  return sampleCurveElement(element, resolved);
}

export function buildStaticCurveVariables(spec: DiagramSpecV2): Record<string, number> {
  const variables: Record<string, number> = {};
  spec.points.forEach(point => {
    variables[`${point.id}.x`] = point.x;
    variables[`${point.id}.y`] = point.y;
  });
  spec.sliders.forEach(slider => {
    variables[slider.id] = slider.value;
  });
  return variables;
}

export function curveSpan(points: readonly Coordinates[]): number {
  if (points.length === 0) return 1;
  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;
  points.forEach(point => {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  });
  return Math.max(maxX - minX, maxY - minY, 1e-6);
}

export function curveIsClosed(points: readonly Coordinates[], tolerance?: number): boolean {
  if (points.length < 3) return false;
  const first = points[0];
  const last = points[points.length - 1];
  const limit = tolerance ?? curveSpan(points) * 0.02;
  return Math.hypot(first.x - last.x, first.y - last.y) <= limit;
}

function viewportCorners(bounds: DiagramBounds): Coordinates[] {
  const [xMin, yMax, xMax, yMin] = bounds;
  return [
    { x: xMin, y: yMax },
    { x: xMax, y: yMax },
    { x: xMax, y: yMin },
    { x: xMin, y: yMin },
  ];
}

function perimeterPointOnViewport(
  bounds: DiagramBounds,
  projection: { edgeIndex: number; amount: number },
): Coordinates {
  return perimeterPoint(viewportCorners(bounds), projection.edgeIndex, projection.amount);
}

export function prepareHalfPlaneCurvePoints(
  element: DiagramElement,
  curvePoints: readonly Coordinates[],
  _variables: Record<string, number>,
  _bounds: DiagramBounds,
): Coordinates[] {
  if (curvePoints.length < 2) return [...curvePoints];
  if (element.kind === 'functionCurve') return [...curvePoints];
  return [...curvePoints];
}

function spanAlongHorizontal(xFrom: number, xTo: number, y: number): Coordinates[] {
  const steps = Math.max(2, Math.ceil(Math.abs(xTo - xFrom)));
  const output: Coordinates[] = [];
  for (let index = 1; index < steps; index += 1) {
    output.push({ x: xFrom + (xTo - xFrom) * index / steps, y });
  }
  return output;
}

function resolveFunctionGraphHalfPlanePolygon(
  curvePoints: readonly Coordinates[],
  sidePoint: Coordinates,
  bounds: DiagramBounds,
): Coordinates[] {
  if (curvePoints.length < 2) return [];
  const [, yMax, , yMin] = bounds;
  const start = curvePoints[0];
  const end = curvePoints[curvePoints.length - 1];

  const buildCandidate = (exitY: number) => dedupeAdjacent([
    ...curvePoints,
    { x: end.x, y: exitY },
    ...spanAlongHorizontal(end.x, start.x, exitY),
    { x: start.x, y: exitY },
  ]);

  const top = buildCandidate(yMax);
  const bottom = buildCandidate(yMin);
  const topInside = pointInPolygon(top, sidePoint);
  const bottomInside = pointInPolygon(bottom, sidePoint);
  if (topInside && !bottomInside) return ensurePolygonContainsPoint(top, sidePoint);
  if (bottomInside && !topInside) return ensurePolygonContainsPoint(bottom, sidePoint);
  const chosen = Math.abs(sidePoint.y - yMax) <= Math.abs(sidePoint.y - yMin) ? top : bottom;
  return ensurePolygonContainsPoint(chosen, sidePoint);
}

function resolveParametricHalfPlanePolygon(
  curvePoints: readonly Coordinates[],
  sidePoint: Coordinates,
  bounds: DiagramBounds,
): Coordinates[] {
  if (curvePoints.length < 2) return [];
  const start = curvePoints[0];
  const end = curvePoints[curvePoints.length - 1];
  const startOnPerimeter = projectToViewportPerimeter(start, bounds);
  const endOnPerimeter = projectToViewportPerimeter(end, bounds);
  const startPos = perimeterPosition(startOnPerimeter.edgeIndex, startOnPerimeter.amount);
  const endPos = perimeterPosition(endOnPerimeter.edgeIndex, endOnPerimeter.amount);
  const clockwiseArc = perimeterArc(bounds, endPos, startPos, true);
  const counterArc = perimeterArc(bounds, endPos, startPos, false);
  const clockwisePolygon = appendDomainBoundedClosure(curvePoints, clockwiseArc, bounds);
  const counterPolygon = appendDomainBoundedClosure(curvePoints, counterArc, bounds);
  const clockwiseInside = pointInPolygon(clockwisePolygon, sidePoint);
  const counterInside = pointInPolygon(counterPolygon, sidePoint);
  if (clockwiseInside && !counterInside) return ensurePolygonContainsPoint(clockwisePolygon, sidePoint);
  if (counterInside && !clockwiseInside) return ensurePolygonContainsPoint(counterPolygon, sidePoint);
  const clockwiseMid = clockwiseArc[Math.floor(clockwiseArc.length / 2)] ?? sidePoint;
  const counterMid = counterArc[Math.floor(counterArc.length / 2)] ?? sidePoint;
  const clockwiseDistance = Math.hypot(clockwiseMid.x - sidePoint.x, clockwiseMid.y - sidePoint.y);
  const counterDistance = Math.hypot(counterMid.x - sidePoint.x, counterMid.y - sidePoint.y);
  const chosen = clockwiseDistance <= counterDistance ? clockwisePolygon : counterPolygon;
  return ensurePolygonContainsPoint(chosen, sidePoint);
}

function appendDomainBoundedClosure(
  curvePoints: readonly Coordinates[],
  arc: readonly Coordinates[],
  bounds: DiagramBounds,
): Coordinates[] {
  if (curvePoints.length < 2 || arc.length < 2) return dedupeAdjacent([...curvePoints, ...arc]);
  const start = curvePoints[0];
  const end = curvePoints[curvePoints.length - 1];
  const startExit = perimeterPointOnViewport(bounds, projectToViewportPerimeter(start, bounds));
  const endExit = perimeterPointOnViewport(bounds, projectToViewportPerimeter(end, bounds));
  const endLead = Math.hypot(end.x - endExit.x, end.y - endExit.y) > 1e-6 ? [endExit] : [];
  const arcPoints = Math.hypot(arc[0].x - endExit.x, arc[0].y - endExit.y) < 1e-6 ? arc.slice(1) : arc;
  const startLead = Math.hypot(start.x - startExit.x, start.y - startExit.y) > 1e-6 ? [startExit] : [];
  return dedupeAdjacent([...curvePoints, ...endLead, ...arcPoints, ...startLead]);
}

export function resolveCurveHalfPlanePolygon(
  element: DiagramElement,
  curvePoints: readonly Coordinates[],
  sidePoint: Coordinates,
  bounds: DiagramBounds,
): Coordinates[] {
  if (element.kind === 'functionCurve') {
    return resolveFunctionGraphHalfPlanePolygon(curvePoints, sidePoint, bounds);
  }
  return resolveParametricHalfPlanePolygon(curvePoints, sidePoint, bounds);
}

function perimeterPoint(corners: Coordinates[], edgeIndex: number, amount: number): Coordinates {
  const start = corners[edgeIndex % corners.length];
  const end = corners[(edgeIndex + 1) % corners.length];
  return {
    x: start.x + (end.x - start.x) * amount,
    y: start.y + (end.y - start.y) * amount,
  };
}

function projectToViewportPerimeter(point: Coordinates, bounds: DiagramBounds): { edgeIndex: number; amount: number } {
  const [xMin, yMax, xMax, yMin] = bounds;
  const candidates = [
    { edgeIndex: 0, amount: (point.x - xMin) / Math.max(xMax - xMin, 1e-12), point: { x: point.x, y: yMax } },
    { edgeIndex: 1, amount: (yMax - point.y) / Math.max(yMax - yMin, 1e-12), point: { x: xMax, y: point.y } },
    { edgeIndex: 2, amount: (xMax - point.x) / Math.max(xMax - xMin, 1e-12), point: { x: point.x, y: yMin } },
    { edgeIndex: 3, amount: (point.y - yMin) / Math.max(yMax - yMin, 1e-12), point: { x: xMin, y: point.y } },
  ];
  let best = candidates[0];
  let bestDistance = Number.POSITIVE_INFINITY;
  candidates.forEach(candidate => {
    const clampedAmount = Math.max(0, Math.min(1, candidate.amount));
    const projected = perimeterPoint(viewportCorners(bounds), candidate.edgeIndex, clampedAmount);
    const distance = Math.hypot(point.x - projected.x, point.y - projected.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = { ...candidate, amount: clampedAmount };
    }
  });
  return { edgeIndex: best.edgeIndex, amount: Math.max(0, Math.min(1, best.amount)) };
}

function perimeterPosition(edgeIndex: number, amount: number): number {
  return edgeIndex + amount;
}

function perimeterArc(
  bounds: DiagramBounds,
  from: number,
  to: number,
  clockwise: boolean,
): Coordinates[] {
  const corners = viewportCorners(bounds);
  const total = corners.length;
  const output: Coordinates[] = [];
  const steps = 24;
  const delta = clockwise
    ? ((to - from + total) % total)
    : -(((from - to + total) % total));
  for (let step = 0; step <= steps; step += 1) {
    const position = from + delta * step / steps;
    const normalized = ((position % total) + total) % total;
    const edgeIndex = Math.floor(normalized);
    const amount = normalized - edgeIndex;
    output.push(perimeterPoint(corners, edgeIndex, amount));
  }
  return output;
}

function ensurePolygonContainsPoint(polygon: Coordinates[], point: Coordinates): Coordinates[] {
  if (polygon.length < 3) return polygon;
  if (pointInPolygon(polygon, point)) {
    return polygonSignedArea(polygon) < 0 ? [...polygon].reverse() : polygon;
  }
  const reversed = [...polygon].reverse();
  return pointInPolygon(reversed, point) ? reversed : polygon;
}

function ensurePositiveArea(polygon: Coordinates[]): Coordinates[] {
  return polygonSignedArea(polygon) < 0 ? [...polygon].reverse() : polygon;
}

function orient(a: Coordinates, b: Coordinates, c: Coordinates): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function segmentsIntersectProper(
  a1: Coordinates,
  a2: Coordinates,
  b1: Coordinates,
  b2: Coordinates,
): { point: Coordinates } | null {
  const o1 = orient(a1, a2, b1);
  const o2 = orient(a1, a2, b2);
  const o3 = orient(b1, b2, a1);
  const o4 = orient(b1, b2, a2);
  if (!(o1 * o2 < 0 && o3 * o4 < 0)) return null;
  const x1 = a1.x;
  const y1 = a1.y;
  const x2 = a2.x;
  const y2 = a2.y;
  const x3 = b1.x;
  const y3 = b1.y;
  const x4 = b2.x;
  const y4 = b2.y;
  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denominator) < 1e-12) return null;
  const px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denominator;
  const py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denominator;
  const ta = Math.hypot(px - x1, py - y1) / (Math.hypot(x2 - x1, y2 - y1) || 1);
  const tb = Math.hypot(px - x3, py - y3) / (Math.hypot(x4 - x3, y4 - y3) || 1);
  if (ta <= 1e-9 || ta >= 1 - 1e-9 || tb <= 1e-9 || tb >= 1 - 1e-9) return null;
  return { point: { x: px, y: py } };
}

function segmentBounds(a: Coordinates, b: Coordinates) {
  return {
    minX: Math.min(a.x, b.x),
    maxX: Math.max(a.x, b.x),
    minY: Math.min(a.y, b.y),
    maxY: Math.max(a.y, b.y),
  };
}

function boundsOverlap(
  left: ReturnType<typeof segmentBounds>,
  right: ReturnType<typeof segmentBounds>,
): boolean {
  return left.maxX >= right.minX && right.maxX >= left.minX
    && left.maxY >= right.minY && right.maxY >= left.minY;
}

function loopCentroid(loop: readonly Coordinates[]): Coordinates {
  return loop.reduce((accumulator, point) => ({
    x: accumulator.x + point.x / loop.length,
    y: accumulator.y + point.y / loop.length,
  }), { x: 0, y: 0 });
}

function boundingBoxArea(points: readonly Coordinates[]): number {
  if (points.length === 0) return 1;
  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;
  points.forEach(point => {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  });
  return Math.max((maxX - minX) * (maxY - minY), 1e-12);
}

function filterSpuriousExteriorLoops(
  points: readonly Coordinates[],
  loops: readonly Coordinates[][],
): Coordinates[][] {
  const areaLimit = boundingBoxArea(points) * EXTERIOR_LOOP_AREA_RATIO;
  return loops.filter(loop => Math.abs(polygonSignedArea(loop)) <= areaLimit);
}

function pruneNestedInteriorLoops(loops: readonly Coordinates[][]): Coordinates[][] {
  return loops.filter(loop => {
    if (loop.length < 3) return false;
    const centroid = loopCentroid(loop);
    if (!pointInPolygon(loop, centroid)) return false;
    const area = Math.abs(polygonSignedArea(loop));
    return !loops.some(other => {
      if (other === loop || other.length < 3) return false;
      const otherArea = Math.abs(polygonSignedArea(other));
      if (otherArea >= area * 0.99) return false;
      return pointInPolygon(loop, loopCentroid(other));
    });
  });
}

function dedupeLoopsByCentroid(loops: readonly Coordinates[][]): Coordinates[][] {
  const output: Coordinates[][] = [];
  loops.forEach(loop => {
    const centroid = loopCentroid(loop);
    const area = Math.abs(polygonSignedArea(loop));
    const duplicate = output.some(existing => {
      const existingCentroid = loopCentroid(existing);
      const existingArea = Math.abs(polygonSignedArea(existing));
      return Math.hypot(existingCentroid.x - centroid.x, existingCentroid.y - centroid.y) < 0.2
        && Math.abs(existingArea - area) < 0.2;
    });
    if (!duplicate) output.push(loop);
  });
  return output;
}

export function polylineHasSelfIntersection(points: readonly Coordinates[]): boolean {
  if (points.length < 4) return false;
  for (let i = 0; i < points.length - 1; i += 1) {
    const boundsA = segmentBounds(points[i], points[i + 1]);
    for (let j = i + 2; j < points.length - 1; j += 1) {
      const boundsB = segmentBounds(points[j], points[j + 1]);
      if (!boundsOverlap(boundsA, boundsB)) continue;
      if (segmentsIntersectProper(points[i], points[i + 1], points[j], points[j + 1])) return true;
    }
  }
  return false;
}

export function extractEnclosedLoopsFromPolyline(points: readonly Coordinates[]): Coordinates[][] {
  if (points.length < 4) return [];
  const loops: Coordinates[][] = [];
  const seen = new Set<string>();

  const registerLoop = (loop: Coordinates[]) => {
    const normalized = dedupeAdjacent(loop);
    if (normalized.length < 3) return;
    if (Math.abs(polygonSignedArea(normalized)) <= 1e-6) return;
    const key = normalized.map(point => `${point.x.toFixed(4)},${point.y.toFixed(4)}`).join('|');
    if (seen.has(key)) return;
    seen.add(key);
    loops.push(normalized);
  };

  for (let i = 0; i < points.length - 1; i += 1) {
    const boundsA = segmentBounds(points[i], points[i + 1]);
    for (let j = i + 2; j < points.length - 1; j += 1) {
      const boundsB = segmentBounds(points[j], points[j + 1]);
      if (!boundsOverlap(boundsA, boundsB)) continue;
      const hit = segmentsIntersectProper(points[i], points[i + 1], points[j], points[j + 1]);
      if (!hit) continue;
      const forward = [hit.point, ...points.slice(i + 1, j + 1)];
      const backward = [hit.point, ...points.slice(j + 1), ...points.slice(0, i + 1)];
      const forwardArea = Math.abs(polygonSignedArea(forward));
      const backwardArea = Math.abs(polygonSignedArea(backward));
      const areaLimit = boundingBoxArea(points) * EXTERIOR_LOOP_AREA_RATIO;
      if (forwardArea <= areaLimit) registerLoop(forward);
      if (backwardArea <= areaLimit && backwardArea <= Math.max(forwardArea, 1) * 2.5) {
        registerLoop(backward);
      }
    }
  }
  return dedupeLoopsByCentroid(pruneNestedInteriorLoops(filterSpuriousExteriorLoops(points, loops)));
}

function dedupeAdjacent(points: Coordinates[]): Coordinates[] {
  if (points.length === 0) return [];
  const output = [points[0]];
  for (let index = 1; index < points.length; index += 1) {
    const prior = output[output.length - 1];
    const current = points[index];
    if (Math.hypot(prior.x - current.x, prior.y - current.y) > 1e-9) output.push(current);
  }
  return output;
}

export function resolveCurveInteriorPolygons(curvePoints: readonly Coordinates[]): Coordinates[][] {
  if (curvePoints.length < 3) return [];
  const loops = extractEnclosedLoopsFromPolyline(curvePoints);
  if (loops.length > 0) {
    return loops
      .map(ensurePositiveArea)
      .sort((left, right) => Math.abs(polygonSignedArea(right)) - Math.abs(polygonSignedArea(left)))
      .slice(0, MAX_CURVE_INTERIOR_LOOPS);
  }
  if (curveIsClosed(curvePoints) && !polylineHasSelfIntersection(curvePoints)) {
    return [ensurePositiveArea(dedupeAdjacent([...curvePoints]))];
  }
  return [];
}

export function resolveCurveInteriorPolygon(curvePoints: readonly Coordinates[]): Coordinates[] {
  return resolveCurveInteriorPolygons(curvePoints)[0] ?? [];
}

export function pointInCurveAreaPolygons(polygons: readonly Coordinates[][], point: Coordinates): boolean {
  return polygons.some(polygon => polygon.length >= 3 && pointInPolygon(polygon, point));
}

export function resolveCurveAreaPolygons(
  element: DiagramElement,
  curvePoints: readonly Coordinates[],
  sidePoint: Coordinates | undefined,
  bounds: DiagramBounds,
  variables: Record<string, number> = {},
): Coordinates[][] {
  const mode = curveAreaFill(element);
  if (mode === 'interior') return resolveCurveInteriorPolygons(curvePoints);
  if (mode === 'half-plane' && sidePoint) {
    const prepared = prepareHalfPlaneCurvePoints(element, curvePoints, variables, bounds);
    const polygon = resolveCurveHalfPlanePolygon(element, prepared, sidePoint, bounds);
    return polygon.length >= 3 ? [polygon] : [];
  }
  return [];
}

export function resolveCurveAreaPolygon(
  element: DiagramElement,
  curvePoints: readonly Coordinates[],
  sidePoint: Coordinates | undefined,
  bounds: DiagramBounds,
  variables: Record<string, number> = {},
): Coordinates[] {
  return resolveCurveAreaPolygons(element, curvePoints, sidePoint, bounds, variables)[0] ?? [];
}

export function clampCurveCoordinatesForBounds(
  points: readonly Coordinates[],
  bounds: DiagramBounds,
  padding = 0.25,
): Coordinates[] {
  const [xMin, yMax, xMax, yMin] = bounds;
  const width = Math.max(xMax - xMin, 1);
  const height = Math.max(yMax - yMin, 1);
  const padX = width * padding;
  const padY = height * padding;
  const left = xMin - padX;
  const right = xMax + padX;
  const top = yMax + padY;
  const bottom = yMin - padY;
  return points
    .map(point => ({
      x: Math.min(right, Math.max(left, point.x)),
      y: Math.min(top, Math.max(bottom, point.y)),
    }))
    .filter((point, index, array) => index === 0 || Math.hypot(point.x - array[index - 1].x, point.y - array[index - 1].y) > 1e-9);
}
