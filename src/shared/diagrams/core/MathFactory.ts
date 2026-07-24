import type { ThemeColors } from './MathBoard';
import JXG from 'jsxgraph';
import type { GeometryOptions, JXGCoord, JXGPolygon, JXGSlider, PointLike, PointSupport } from './MathUtils';
import { setExactPointPosition } from './MathUtils';
import { DEFAULT_ANGLE_RADIUS, DEFAULT_RIGHT_ANGLE_RADIUS } from '../spec';
import {
  halfPlaneViewportPolygon,
  type Coordinates,
} from '../spec/areaGeometry';

const diagramFontStyle = 'font-family: var(--font-diagram-family);';

export interface PointOptions extends GeometryOptions {
  size?: number;
  highlightSize?: number;
  fillColor?: string;
  strokeColor?: string;
  highlightFillColor?: string;
  highlightStrokeColor?: string;
  showInfobox?: boolean;
  label?: Record<string, unknown>;
}

export interface AngleOptions extends GeometryOptions {
  radius?: number;
  type?: string;
}

export interface RightAngleMarkerOptions extends GeometryOptions {
  size?: number;
}

export interface CongruenceMarkOptions extends GeometryOptions {
  markHeight?: number;
}

export interface ParallelMarkOptions extends GeometryOptions {
  markHeight?: number;
}

export interface DimensionLineOptions extends GeometryOptions {
  fontSize?: number;
}

export interface TextOptions extends GeometryOptions {
  color?: string;
  cssClass?: string;
  cssDefaultStyle?: string;
  highlightCssDefaultStyle?: string;
  display?: string;
}

export interface SliderOptions extends GeometryOptions {
  name?: string;
  baseline?: GeometryOptions;
  highline?: GeometryOptions;
  label?: Record<string, unknown>;
}

export interface TicksOptions extends GeometryOptions {
  majorHeight?: number;
  ticksDistance?: number;
  minorTicks?: number;
  minorHeight?: number;
  drawLabels?: boolean;
}

export interface AreaDecompositionOptions extends GeometryOptions {
  borders?: GeometryOptions;
}

export interface CompositeElement {
  rendNode?: Element | SVGElement;
  setAttribute: (attributes: Record<string, unknown>) => void;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  elements: (JXG.GeometryElement | CompositeElement | undefined)[];
  __matematikaMarkLayout?: MarkLayout;
}

export interface MarkLayout {
  markHeight: number;
}

function pointLabel(theme: ThemeColors, label: Record<string, unknown> = {}) {
  const cssClass = 'JXGtext JXgpointLabel matematika-point-label';
  const highlightCssClass = `${cssClass} matematika-point-label--highlight`;
  return {
    fontSize: 19,
    cssClass,
    highlightCssClass,
    cssDefaultStyle: diagramFontStyle,
    highlightCssDefaultStyle: diagramFontStyle,
    strokeColor: theme.carbon,
    highlightStrokeColor: theme.ocre,
    highlightStrokeOpacity: 1,
    transitionDuration: 250,
    transitionProperties: ['color', 'opacity', 'fill', 'fill-opacity', 'stroke', 'stroke-opacity'],
    ...label,
  };
}

export function createPoint(
  board: JXG.Board,
  coords: [JXGCoord, JXGCoord],
  options: PointOptions = {},
  theme: ThemeColors,
): JXG.Point {
  const { label, ...attributes } = options;
  return board.create('point', coords, {
    size: 4,
    highlightSize: 6,
    fillColor: theme.carbon,
    strokeColor: theme.carbon,
    highlightFillColor: theme.ocre,
    highlightStrokeColor: theme.ocre,
    showInfobox: false,
    ...attributes,
    label: pointLabel(theme, label),
  } as never) as JXG.Point;
}

export function createIntersection(
  board: JXG.Board,
  supports: [PointSupport, PointSupport],
  index: 0 | 1 = 0,
  options: PointOptions = {},
  theme: ThemeColors,
): JXG.Point {
  const { label, ...attributes } = options;
  return board.create('intersection', [supports[0], supports[1], index], {
    size: 4,
    highlightSize: 6,
    fillColor: theme.terracota,
    strokeColor: theme.terracota,
    highlightFillColor: theme.ocre,
    highlightStrokeColor: theme.ocre,
    showInfobox: false,
    fixed: true,
    ...attributes,
    label: pointLabel(theme, label),
  } as never) as JXG.Point;
}

export function createSegment(
  board: JXG.Board,
  points: [PointSupport, PointSupport],
  options: GeometryOptions = {},
  theme: ThemeColors,
): JXG.Segment {
  return board.create('segment', points, {
    strokeColor: theme.carbon,
    strokeWidth: 2,
    ...options,
  } as never) as JXG.Segment;
}

export function createLine(
  board: JXG.Board,
  points: [PointSupport, PointSupport],
  options: GeometryOptions = {},
  theme: ThemeColors,
): JXG.Line {
  return board.create('line', points, {
    strokeColor: theme.carbon,
    strokeWidth: 2,
    ...options,
  } as never) as JXG.Line;
}

export function createRay(
  board: JXG.Board,
  points: [PointSupport, PointSupport],
  options: GeometryOptions = {},
  theme: ThemeColors,
): JXG.Line {
  return board.create('line', points, {
    strokeColor: theme.carbon,
    strokeWidth: 2,
    straightFirst: false,
    straightLast: true,
    ...options,
  } as never) as JXG.Line;
}

export function createPolygon(
  board: JXG.Board,
  vertices: PointSupport[],
  options: GeometryOptions = {},
  theme: ThemeColors,
): JXGPolygon {
  return board.create('polygon', vertices, {
    fillColor: theme.salvia,
    fillOpacity: 0.12,
    borders: { strokeColor: theme.salvia, strokeWidth: 1.5 },
    vertices: { visible: false },
    ...options,
  } as never) as unknown as JXGPolygon;
}

export function createCircle(
  board: JXG.Board,
  points: [PointSupport, PointSupport | number],
  options: GeometryOptions = {},
  theme: ThemeColors,
): JXG.Circle {
  return board.create('circle', points, {
    strokeColor: theme.salvia,
    strokeWidth: 2,
    fillOpacity: 0,
    ...options,
  } as never) as JXG.Circle;
}

export function createArc(
  board: JXG.Board,
  points: [PointSupport, PointSupport, PointSupport],
  options: GeometryOptions = {},
  theme: ThemeColors,
): JXG.Curve {
  return board.create('arc', points, {
    strokeColor: theme.salvia,
    strokeWidth: 2,
    fillOpacity: 0,
    ...options,
  } as never) as JXG.Curve;
}

export function createFunctionCurve(
  board: JXG.Board,
  points: Array<{ x: number; y: number }>,
  options: GeometryOptions = {},
  theme: ThemeColors,
): JXG.Curve {
  return createSampledCurve(board, points, options, theme);
}

export function createParametricCurve(
  board: JXG.Board,
  points: Array<{ x: number; y: number }>,
  options: GeometryOptions = {},
  theme: ThemeColors,
): JXG.Curve {
  return createSampledCurve(board, points, options, theme);
}

export function createSampledCurve(
  board: JXG.Board,
  points: Array<{ x: number; y: number }>,
  options: GeometryOptions = {},
  theme: ThemeColors,
): JXG.Curve {
  const safePoints = points.length >= 2 ? points : [{ x: 0, y: 0 }, { x: 0, y: 0 }];
  const xs = safePoints.map(point => point.x);
  const ys = safePoints.map(point => point.y);
  const curve = board.create('curve', [xs, ys], {
    strokeColor: theme.pavo,
    strokeWidth: 2,
    curveType: 'plot',
    ...options,
  } as never) as JXG.Curve;
  (curve as { __matematikaSamplePoints?: Array<{ x: number; y: number }> }).__matematikaSamplePoints = safePoints;
  return curve;
}

export function subsamplePolygonPoints(
  points: readonly Coordinates[],
  targetCount: number,
): Coordinates[] {
  if (points.length <= targetCount) return [...points];
  const output: Coordinates[] = [];
  for (let index = 0; index < targetCount; index += 1) {
    const position = index * (points.length - 1) / Math.max(targetCount - 1, 1);
    const lower = Math.floor(position);
    const upper = Math.min(points.length - 1, lower + 1);
    const amount = position - lower;
    const start = points[lower];
    const end = points[upper];
    output.push({
      x: start.x + (end.x - start.x) * amount,
      y: start.y + (end.y - start.y) * amount,
    });
  }
  return output;
}

export function updateStaticAreaPolygon(
  polygon: JXG.Polygon | null | undefined,
  points: Array<{ x: number; y: number }>,
): void {
  if (!polygon?.vertices || points.length < 3) return;
  const vertices = polygon.vertices as JXG.Point[];
  const sampled = subsamplePolygonPoints(points, vertices.length);
  sampled.forEach((point, index) => {
    const vertex = vertices[index];
    if (vertex) setExactPointPosition(vertex, JXG.COORDS_BY_USER, [point.x, point.y]);
  });
}
export function updateSampledCurve(
  curve: JXG.Curve | undefined,
  points: Array<{ x: number; y: number }>,
): void {
  if (!curve || points.length < 2) return;
  const element = curve as JXG.Curve & {
    dataX?: number[];
    dataY?: number[];
    fullUpdate?: () => void;
    __matematikaSamplePoints?: Array<{ x: number; y: number }>;
  };
  element.dataX = points.map(point => point.x);
  element.dataY = points.map(point => point.y);
  element.__matematikaSamplePoints = points;
  if (typeof element.fullUpdate === 'function') element.fullUpdate();
}

export function createStaticAreaPolygon(
  board: JXG.Board,
  points: Array<{ x: number; y: number }>,
  options: GeometryOptions = {},
  theme: ThemeColors,
  maxVertices = 24,
): JXGPolygon | null {
  if (points.length < 3) return null;
  const budget = Math.min(maxVertices, Math.max(12, points.length));
  const vertexPoints = subsamplePolygonPoints(points, budget);
  const polygonPoints = vertexPoints.map(point => board.create('point', [point.x, point.y], { visible: false } as never) as JXG.Point);
  return createPolygon(board, polygonPoints, {
    fillColor: theme.salvia,
    fillOpacity: 0.12,
    borders: { strokeColor: theme.salvia, strokeWidth: 1.2, strokeOpacity: 0.45 },
    fixed: true,
    hasInnerPoints: true,
    ...options,
  }, theme);
}

function poincareCircle(center: PointLike, boundary: PointLike, a: PointLike, b: PointLike) {
  const ox = center.X();
  const oy = center.Y();
  const ax = a.X();
  const ay = a.Y();
  const bx = b.X();
  const by = b.Y();
  const radius = Math.hypot(boundary.X() - ox, boundary.Y() - oy) || 1;
  const matrixA = 2 * (bx - ax);
  const matrixB = 2 * (by - ay);
  const matrixC = 2 * (ax - ox);
  const matrixD = 2 * (ay - oy);
  const rhs1 = bx * bx + by * by - ax * ax - ay * ay;
  const rhs2 = ax * ax + ay * ay - ox * ox - oy * oy + radius * radius;
  const determinant = matrixA * matrixD - matrixB * matrixC;
  if (Math.abs(determinant) < 1e-8) return { diameter: true as const, ox, oy, radius };
  const cx = (rhs1 * matrixD - matrixB * rhs2) / determinant;
  const cy = (matrixA * rhs2 - rhs1 * matrixC) / determinant;
  return { diameter: false as const, ox, oy, radius, cx, cy, geodesicRadius: Math.hypot(ax - cx, ay - cy) };
}

function normalizedArcDelta(start: number, end: number): number {
  let delta = end - start;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

export function createPoincareArc(
  board: JXG.Board,
  points: [PointLike, PointLike, PointLike, PointLike],
  options: GeometryOptions = {},
  theme: ThemeColors,
): JXG.Curve {
  const [center, boundary, a, b] = points;
  const coordinates = (t: number) => {
    const circle = poincareCircle(center, boundary, a, b);
    if (circle.diameter) return { x: a.X() + (b.X() - a.X()) * t, y: a.Y() + (b.Y() - a.Y()) * t };
    const start = Math.atan2(a.Y() - circle.cy, a.X() - circle.cx);
    const end = Math.atan2(b.Y() - circle.cy, b.X() - circle.cx);
    const angle = start + normalizedArcDelta(start, end) * t;
    return { x: circle.cx + circle.geodesicRadius * Math.cos(angle), y: circle.cy + circle.geodesicRadius * Math.sin(angle) };
  };
  const sampled = Array.from({ length: 65 }, (_, index) => coordinates(index / 64));
  return createSampledCurve(board, sampled, options, theme);
}

export function createPoincareGeodesic(
  board: JXG.Board,
  points: [PointLike, PointLike, PointLike, PointLike],
  options: GeometryOptions = {},
  theme: ThemeColors,
): JXG.Curve {
  const [center, boundary, a, b] = points;
  const coordinates = (t: number) => {
    const circle = poincareCircle(center, boundary, a, b);
    if (circle.diameter) {
      const dx = b.X() - a.X();
      const dy = b.Y() - a.Y();
      const length = Math.hypot(dx, dy) || 1;
      return {
        x: circle.ox + (dx / length) * circle.radius * (2 * t - 1),
        y: circle.oy + (dy / length) * circle.radius * (2 * t - 1),
      };
    }
    const distance = Math.hypot(circle.cx - circle.ox, circle.cy - circle.oy) || 1;
    const along = (circle.radius * circle.radius - circle.geodesicRadius * circle.geodesicRadius + distance * distance) / (2 * distance);
    const height = Math.sqrt(Math.max(0, circle.radius * circle.radius - along * along));
    const ux = (circle.cx - circle.ox) / distance;
    const uy = (circle.cy - circle.oy) / distance;
    const baseX = circle.ox + along * ux;
    const baseY = circle.oy + along * uy;
    const q1 = { x: baseX - uy * height, y: baseY + ux * height };
    const q2 = { x: baseX + uy * height, y: baseY - ux * height };
    const start = Math.atan2(q1.y - circle.cy, q1.x - circle.cx);
    const end = Math.atan2(q2.y - circle.cy, q2.x - circle.cx);
    let delta = normalizedArcDelta(start, end);
    const middleAngle = start + delta / 2;
    const middleX = circle.cx + circle.geodesicRadius * Math.cos(middleAngle);
    const middleY = circle.cy + circle.geodesicRadius * Math.sin(middleAngle);
    if (Math.hypot(middleX - circle.ox, middleY - circle.oy) > circle.radius) delta += delta > 0 ? -Math.PI * 2 : Math.PI * 2;
    const angle = start + delta * t;
    return { x: circle.cx + circle.geodesicRadius * Math.cos(angle), y: circle.cy + circle.geodesicRadius * Math.sin(angle) };
  };
  const sampled = Array.from({ length: 65 }, (_, index) => coordinates(index / 64));
  return createSampledCurve(board, sampled, options, theme);
}

export type CurveAreaComposite = CompositeElement & {
  __matematikaCurveArea?: {
    fills: JXGPolygon[];
    curve: JXG.Curve;
    lastAreaSignature?: string;
  };
};

export function createComposite(
  elements: (JXG.GeometryElement | CompositeElement | undefined)[],
  markLayout?: MarkLayout,
): CompositeElement {
  const primary = elements.find(Boolean);
  return {
    rendNode: primary && 'rendNode' in primary ? (primary.rendNode as Element | SVGElement | undefined) : undefined,
    setAttribute: (attributes: Record<string, unknown>) => elements.forEach(element => element?.setAttribute?.(attributes)),
    on: (event: string, handler: (...args: unknown[]) => void) => elements.forEach(element => element?.on?.(event, handler as never)),
    elements,
    ...(markLayout ? { __matematikaMarkLayout: markLayout } : {}),
  };
}

export function createCurveAreaComposite(
  fills: JXGPolygon | JXGPolygon[] | null | undefined,
  curve: JXG.Curve,
): JXG.Curve | CurveAreaComposite {
  const fillList = (Array.isArray(fills) ? fills : fills ? [fills] : []).filter(Boolean);
  if (fillList.length === 0) return curve;
  const composite = createComposite([...fillList, curve]) as CurveAreaComposite;
  composite.__matematikaCurveArea = { fills: fillList, curve };
  return composite;
}

export function createCurveAreaFills(
  board: JXG.Board,
  resolvePolygons: () => Coordinates[][],
  options: GeometryOptions = {},
  theme: ThemeColors,
): JXGPolygon[] {
  const polygons = resolvePolygons().filter(polygon => polygon.length >= 3);
  if (polygons.length === 0) return [];
  return polygons.map(polygon => createStaticAreaPolygon(board, polygon, {
    fillOpacity: 0.12,
    borders: { visible: false, strokeOpacity: 0 },
    fixed: true,
    ...options,
  }, theme, Math.min(96, Math.max(32, polygon.length)))).filter((polygon): polygon is JXGPolygon => Boolean(polygon));
}

export function createCurveAreaFill(
  board: JXG.Board,
  resolvePolygon: () => Coordinates[],
  options: GeometryOptions = {},
  theme: ThemeColors,
): JXGPolygon | null {
  const fills = createCurveAreaFills(board, () => {
    const polygon = resolvePolygon();
    return polygon.length >= 3 ? [polygon] : [];
  }, options, theme);
  return fills[0] ?? null;
}

export function createCongruenceMark(
  board: JXG.Board,
  points: [PointLike, PointLike],
  count = 1,
  options: CongruenceMarkOptions = {},
  theme: ThemeColors,
): CompositeElement {
  const [a, b] = points;
  const { markHeight = 0.32, ...markOptions } = options;
  const layout: MarkLayout = { markHeight };
  const marks = Array.from({ length: count }, (_, index) => {
    const centered = index - (count - 1) / 2;
    const offset = centered * 0.14;
    const coordinate = (side: -1 | 1, axis: 'x' | 'y') => () => {
      const half = layout.markHeight / 2;
      const dx = b.X() - a.X();
      const dy = b.Y() - a.Y();
      const length = Math.hypot(dx, dy) || 1;
      const tangentX = dx / length;
      const tangentY = dy / length;
      const normalX = -tangentY;
      const normalY = tangentX;
      const x = (a.X() + b.X()) / 2 + tangentX * offset + normalX * half * side;
      const y = (a.Y() + b.Y()) / 2 + tangentY * offset + normalY * half * side;
      return axis === 'x' ? x : y;
    };
    const p1 = board.create('point', [coordinate(-1, 'x'), coordinate(-1, 'y')], { visible: false } as never);
    const p2 = board.create('point', [coordinate(1, 'x'), coordinate(1, 'y')], { visible: false } as never);
    return board.create('segment', [p1, p2], { strokeColor: theme.ocre, strokeWidth: 2, fixed: true, ...markOptions } as never) as JXG.Segment;
  });
  return createComposite(marks, layout);
}

export function createParallelMark(
  board: JXG.Board,
  points: [PointLike, PointLike],
  count = 1,
  options: ParallelMarkOptions = {},
  theme: ThemeColors,
): CompositeElement {
  const [a, b] = points;
  const { markHeight = 0.42, ...markOptions } = options;
  const layout: MarkLayout = { markHeight };
  const chevrons = Array.from({ length: count }, (_, index) => {
    const centered = index - (count - 1) / 2;
    const offset = centered * layout.markHeight * 0.72;
    const coordinate = (part: 'tip' | 'upper' | 'lower', axis: 'x' | 'y') => () => {
      const currentMarkHeight = layout.markHeight;
      const dx = b.X() - a.X();
      const dy = b.Y() - a.Y();
      const length = Math.hypot(dx, dy) || 1;
      const tangentX = dx / length;
      const tangentY = dy / length;
      const normalX = -tangentY;
      const normalY = tangentX;
      const centerX = (a.X() + b.X()) / 2 + tangentX * offset;
      const centerY = (a.Y() + b.Y()) / 2 + tangentY * offset;
      const direction = part === 'tip' ? 0.5 : -0.5;
      let normal = 0;
      if (part === 'upper') normal = 0.38;
      else if (part === 'lower') normal = -0.38;
      const x = centerX + tangentX * currentMarkHeight * direction + normalX * currentMarkHeight * normal;
      const y = centerY + tangentY * currentMarkHeight * direction + normalY * currentMarkHeight * normal;
      return axis === 'x' ? x : y;
    };
    const tip = board.create('point', [coordinate('tip', 'x'), coordinate('tip', 'y')], { visible: false } as never);
    const upper = board.create('point', [coordinate('upper', 'x'), coordinate('upper', 'y')], { visible: false } as never);
    const lower = board.create('point', [coordinate('lower', 'x'), coordinate('lower', 'y')], { visible: false } as never);
    return [
      board.create('segment', [upper, tip], { strokeColor: theme.pavo, strokeWidth: 2, fixed: true, ...markOptions } as never) as JXG.Segment,
      board.create('segment', [lower, tip], { strokeColor: theme.pavo, strokeWidth: 2, fixed: true, ...markOptions } as never) as JXG.Segment,
    ];
  }).flat();
  return createComposite(chevrons, layout);
}

export function createDimensionLine(
  board: JXG.Board,
  points: [PointLike, PointLike],
  label: () => string,
  offset = 0.35,
  options: DimensionLineOptions = {},
  theme: ThemeColors,
): CompositeElement {
  const [a, b] = points;
  const { fontSize, ...lineOptions } = options;
  const shifted = (point: PointLike, axis: 'x' | 'y') => () => {
    const dx = b.X() - a.X();
    const dy = b.Y() - a.Y();
    const length = Math.hypot(dx, dy) || 1;
    return axis === 'x' ? point.X() - (dy / length) * offset : point.Y() + (dx / length) * offset;
  };
  const a2 = board.create('point', [shifted(a, 'x'), shifted(a, 'y')], { visible: false } as never) as JXG.Point;
  const b2 = board.create('point', [shifted(b, 'x'), shifted(b, 'y')], { visible: false } as never) as JXG.Point;
  const line = createSegment(board, [a2, b2], { strokeColor: theme.pizarra, strokeWidth: 1.5, ...lineOptions }, theme);
  const highlightOptOut = lineOptions.highlight === false ? { highlight: false } : {};
  const ticks = createCongruenceMark(board, [a2, b2], 1, { strokeColor: theme.pizarra, strokeWidth: 1.5, ...highlightOptOut }, theme);
  const text = createText(board, [
    () => (a2.X() + b2.X()) / 2,
    () => (a2.Y() + b2.Y()) / 2 + 0.18,
    label,
  ], { color: theme.pizarra, ...(fontSize !== undefined ? { fontSize } : {}), ...highlightOptOut }, theme);
  return createComposite([line, ticks, text]);
}

export function createGridOverlay(
  board: JXG.Board,
  points: [PointLike, PointLike, PointLike, PointLike],
  rows: number,
  columns: number,
  options: GeometryOptions = {},
  theme: ThemeColors,
): CompositeElement {
  const [a, b, c, d] = points;
  const lines: (JXG.Segment | CompositeElement)[] = [];
  const interpolate = (p: PointLike, q: PointLike, amount: number, axis: 'x' | 'y') => () =>
    (axis === 'x' ? p.X() : p.Y()) + ((axis === 'x' ? q.X() : q.Y()) - (axis === 'x' ? p.X() : p.Y())) * amount;
  for (let row = 1; row < rows; row += 1) {
    const amount = row / rows;
    const left = board.create('point', [interpolate(a, d, amount, 'x'), interpolate(a, d, amount, 'y')], { visible: false } as never) as JXG.Point;
    const right = board.create('point', [interpolate(b, c, amount, 'x'), interpolate(b, c, amount, 'y')], { visible: false } as never) as JXG.Point;
    lines.push(createSegment(board, [left, right], { strokeColor: theme.carbon, strokeWidth: 0.8, strokeOpacity: 0.35, ...options }, theme));
  }
  for (let column = 1; column < columns; column += 1) {
    const amount = column / columns;
    const bottom = board.create('point', [interpolate(a, b, amount, 'x'), interpolate(a, b, amount, 'y')], { visible: false } as never) as JXG.Point;
    const top = board.create('point', [interpolate(d, c, amount, 'x'), interpolate(d, c, amount, 'y')], { visible: false } as never) as JXG.Point;
    lines.push(createSegment(board, [bottom, top], { strokeColor: theme.carbon, strokeWidth: 0.8, strokeOpacity: 0.35, ...options }, theme));
  }
  return createComposite(lines);
}

export function createAreaDecomposition(
  board: JXG.Board,
  points: PointSupport[],
  rows: number,
  columns: number,
  options: AreaDecompositionOptions = {},
  theme: ThemeColors,
): JXGPolygon | CompositeElement {
  const polygon = createPolygon(board, points, options, theme);
  if (points.length !== 4) return polygon;
  const grid = createGridOverlay(board, points as [PointLike, PointLike, PointLike, PointLike], rows, columns, options.borders ?? {}, theme);
  return createComposite([polygon, grid]);
}

export function createMidpoint(
  board: JXG.Board,
  points: [PointSupport, PointSupport],
  options: PointOptions = {},
  theme: ThemeColors,
): JXG.Point {
  const { label, ...attributes } = options;
  return board.create('midpoint', points, {
    size: 4,
    highlightSize: 6,
    fillColor: theme.terracota,
    strokeColor: theme.terracota,
    highlightFillColor: theme.ocre,
    highlightStrokeColor: theme.ocre,
    showInfobox: false,
    ...attributes,
    label: pointLabel(theme, label),
  } as never) as JXG.Point;
}

export function createGlider(
  board: JXG.Board,
  coordsAndSupport: [JXGCoord, JXGCoord, JXG.GeometryElement | PointLike],
  options: PointOptions = {},
  theme: ThemeColors,
): JXG.Point {
  const { label, ...attributes } = options;
  return board.create('glider', coordsAndSupport, {
    size: 4,
    highlightSize: 6,
    fillColor: theme.ocre,
    strokeColor: theme.ocre,
    highlightFillColor: theme.ocre,
    highlightStrokeColor: theme.ocre,
    showInfobox: false,
    ...attributes,
    label: pointLabel(theme, label),
  } as never) as JXG.Point;
}

export function createPerpendicularLine(
  board: JXG.Board,
  points: [PointSupport, PointSupport, PointSupport],
  options: GeometryOptions = {},
  theme: ThemeColors,
): JXG.Line {
  const [baseA, baseB, through] = points;
  const baseLine = board.create('line', [baseA, baseB], { visible: false } as never);
  return board.create('perpendicular', [baseLine, through], {
    strokeColor: theme.pavo,
    strokeWidth: 2,
    dash: 2,
    ...options,
  } as never) as JXG.Line;
}

export function createParallelLine(
  board: JXG.Board,
  points: [PointSupport, PointSupport, PointSupport],
  options: GeometryOptions = {},
  theme: ThemeColors,
): JXG.Line {
  const [baseA, baseB, through] = points;
  const baseLine = board.create('line', [baseA, baseB], { visible: false } as never);
  return board.create('parallel', [baseLine, through], {
    strokeColor: theme.salvia,
    strokeWidth: 2,
    dash: 2,
    ...options,
  } as never) as JXG.Line;
}

export function createPerpendicularFoot(
  board: JXG.Board,
  points: [PointLike, PointLike, PointLike],
  options: PointOptions = {},
  theme: ThemeColors,
): JXG.Point {
  const [baseA, baseB, source] = points;
  const projected = () => {
    const dx = baseB.X() - baseA.X();
    const dy = baseB.Y() - baseA.Y();
    const len2 = dx * dx + dy * dy || 1;
    const t = ((source.X() - baseA.X()) * dx + (source.Y() - baseA.Y()) * dy) / len2;
    return { x: baseA.X() + dx * t, y: baseA.Y() + dy * t };
  };

  const { label, ...attributes } = options;
  return board.create('point', [
    () => projected().x,
    () => projected().y,
  ], {
    size: 4,
    highlightSize: 6,
    fillColor: theme.ocre,
    strokeColor: theme.ocre,
    highlightFillColor: theme.ocre,
    highlightStrokeColor: theme.ocre,
    showInfobox: false,
    ...attributes,
    label: pointLabel(theme, label),
  } as never) as JXG.Point;
}

export function createBaseExtensionToFoot(
  board: JXG.Board,
  points: [PointLike, PointLike, PointLike],
  options: GeometryOptions = {},
  theme: ThemeColors,
): JXG.Segment {
  const [baseA, baseB, foot] = points;
  const extensionEnd = board.create('point', [
    () => {
      const dx = baseB.X() - baseA.X();
      const dy = baseB.Y() - baseA.Y();
      const len2 = dx * dx + dy * dy || 1;
      const t = ((foot.X() - baseA.X()) * dx + (foot.Y() - baseA.Y()) * dy) / len2;
      if (t < 0) return baseA.X();
      if (t > 1) return baseB.X();
      return foot.X();
    },
    () => {
      const dx = baseB.X() - baseA.X();
      const dy = baseB.Y() - baseA.Y();
      const len2 = dx * dx + dy * dy || 1;
      const t = ((foot.X() - baseA.X()) * dx + (foot.Y() - baseA.Y()) * dy) / len2;
      if (t < 0) return baseA.Y();
      if (t > 1) return baseB.Y();
      return foot.Y();
    },
  ], { visible: false } as never);

  return board.create('segment', [extensionEnd, foot], {
    strokeColor: theme.pizarra,
    strokeWidth: 1.5,
    dash: 2,
    visible: false,
    ...options,
  } as never) as JXG.Segment;
}

export function createAngleBisectorRay(
  board: JXG.Board,
  points: [PointLike, PointLike, PointLike],
  options: GeometryOptions = {},
  theme: ThemeColors,
): JXG.Line {
  const [legA, vertex, legB] = points;
  const direction = () => {
    const ax = legA.X() - vertex.X();
    const ay = legA.Y() - vertex.Y();
    const bx = legB.X() - vertex.X();
    const by = legB.Y() - vertex.Y();
    const aLen = Math.hypot(ax, ay) || 1;
    const bLen = Math.hypot(bx, by) || 1;
    const sumX = ax / aLen + bx / bLen;
    const sumY = ay / aLen + by / bLen;
    const sumLen = Math.hypot(sumX, sumY);
    if (sumLen < 1e-6) return { x: -ay / aLen, y: ax / aLen };
    return { x: sumX / sumLen, y: sumY / sumLen };
  };
  const directionPoint = board.create('point', [
    () => vertex.X() + direction().x,
    () => vertex.Y() + direction().y,
  ], { visible: false } as never);

  return board.create('line', [vertex, directionPoint], {
    strokeColor: theme.pavo,
    strokeWidth: 2.2,
    dash: 2,
    straightFirst: false,
    straightLast: true,
    ...options,
  } as never) as JXG.Line;
}

export function createAngle(
  board: JXG.Board,
  points: [PointSupport, PointSupport, PointSupport],
  options: AngleOptions = {},
  theme: ThemeColors,
): JXG.Angle {
  const { radius = DEFAULT_ANGLE_RADIUS, ...attrs } = options;
  return board.create('angle', points, {
    type: 'sector',
    radius,
    fillColor: theme.ocre,
    fillOpacity: 0.1,
    strokeColor: theme.ocre,
    strokeWidth: 1.5,
    label: { visible: false },
    ...attrs,
  } as never) as JXG.Angle;
}

export function createNonReflexAngle(
  board: JXG.Board,
  points: [PointSupport, PointSupport, PointSupport],
  options: AngleOptions = {},
  theme: ThemeColors,
): JXG.Angle {
  const { radius = DEFAULT_ANGLE_RADIUS, ...attrs } = options;
  return board.create('nonreflexangle', points, {
    type: 'sector',
    radius,
    fillColor: theme.ocre,
    fillOpacity: 0.1,
    strokeColor: theme.ocre,
    strokeWidth: 1.5,
    label: { visible: false },
    ...attrs,
  } as never) as JXG.Angle;
}

export function createRightAngleMarker(
  board: JXG.Board,
  points: [PointLike, PointLike, PointLike],
  options: RightAngleMarkerOptions = {},
  theme: ThemeColors,
): JXGPolygon {
  const [legA, vertex, legB] = points;
  const { size = DEFAULT_RIGHT_ANGLE_RADIUS, ...attrs } = options;
  const unit = (from: PointLike, to: PointLike) => {
    const dx = to.X() - from.X();
    const dy = to.Y() - from.Y();
    const len = Math.hypot(dx, dy) || 1;
    return { x: dx / len, y: dy / len };
  };
  const p0 = board.create('point', [() => vertex.X(), () => vertex.Y()], { visible: false } as never);
  const p1 = board.create('point', [
    () => vertex.X() + unit(vertex, legA).x * size,
    () => vertex.Y() + unit(vertex, legA).y * size,
  ], { visible: false } as never);
  const p2 = board.create('point', [
    () => vertex.X() + (unit(vertex, legA).x + unit(vertex, legB).x) * size,
    () => vertex.Y() + (unit(vertex, legA).y + unit(vertex, legB).y) * size,
  ], { visible: false } as never);
  const p3 = board.create('point', [
    () => vertex.X() + unit(vertex, legB).x * size,
    () => vertex.Y() + unit(vertex, legB).y * size,
  ], { visible: false } as never);

  return board.create('polygon', [p0, p1, p2, p3], {
    fillColor: theme.ocre,
    fillOpacity: 0.1,
    strokeColor: theme.ocre,
    strokeWidth: 1.5,
    vertices: { visible: false },
    borders: { strokeColor: theme.ocre, strokeWidth: 1.5, ...(attrs.highlight === false ? { highlight: false } : {}) },
    ...attrs,
  } as never) as unknown as JXGPolygon;
}

export function createText(
  board: JXG.Board,
  coords: [JXGCoord, JXGCoord, string | (() => string)],
  options: TextOptions = {},
  theme: ThemeColors,
): JXG.Text {
  return board.create('text', coords, {
    fixed: true,
    display: 'html',
    color: theme.carbon,
    cssClass: 'font-diagram text-sm',
    cssDefaultStyle: diagramFontStyle,
    highlightCssDefaultStyle: diagramFontStyle,
    ...options,
  } as never) as JXG.Text;
}

export function createSlider(
  board: JXG.Board,
  anchors: [[number, number], [number, number]],
  values: [number, number, number],
  options: SliderOptions = {},
  theme: ThemeColors,
): JXGSlider {
  const { label, ...attributes } = options;
  return board.create('slider', [anchors[0], anchors[1], values], {
    name: '',
    baseline: { strokeColor: theme.pizarra, strokeWidth: 2 },
    highline: { strokeColor: theme.terracota, strokeWidth: 3 },
    fillColor: theme.terracota,
    strokeColor: theme.terracota,
    ...attributes,
    label: {
      cssClass: 'font-diagram text-sm',
      highlightCssClass: 'font-diagram text-sm',
      cssDefaultStyle: diagramFontStyle,
      highlightCssDefaultStyle: diagramFontStyle,
      strokeColor: theme.carbon,
      ...label,
    },
  } as never) as unknown as JXGSlider;
}

export function createTicks(
  board: JXG.Board,
  elements: [JXG.GeometryElement, number],
  options: TicksOptions = {},
  theme: ThemeColors,
): JXG.Ticks {
  const [support, ticksDistance] = elements;
  const { majorHeight = 10, ...tickOptions } = options;
  return board.create('ticks', [support], {
    strokeColor: theme.carbon,
    strokeWidth: 2,
    insertTicks: false,
    ticksDistance,
    minorTicks: 4,
    minorHeight: Math.max(1, majorHeight * 0.4),
    majorHeight,
    drawLabels: false,
    ...tickOptions,
  } as never) as JXG.Ticks;
}

export function createRightAngle(
  board: JXG.Board,
  points: [PointSupport, PointSupport, PointSupport],
  options: AngleOptions = {},
  theme: ThemeColors,
): JXG.Angle {
  return board.create('angle', points, {
    type: 'sectordot',
    size: 20,
    fillColor: theme.carbon,
    strokeColor: theme.carbon,
    ...options,
  } as never) as JXG.Angle;
}

function pointCoords(point: PointSupport): Coordinates {
  if (typeof point === 'string' || Array.isArray(point)) return { x: 0, y: 0 };
  return { x: point.X(), y: point.Y() };
}

export const CURVE_AREA_MAX_VERTICES = 64;

export function createDynamicAreaPolygon(
  board: JXG.Board,
  resolvePolygon: () => Coordinates[],
  maxVertices = 12,
  options: GeometryOptions = {},
  theme: ThemeColors,
): JXGPolygon {
  const polygonPoints = Array.from({ length: maxVertices }, (_, index) => board.create('point', [
    () => {
      const vertices = resolvePolygon();
      if (vertices.length < 3) return 0;
      const effectiveIndex = Math.min(index, vertices.length - 1);
      return vertices[effectiveIndex].x;
    },
    () => {
      const vertices = resolvePolygon();
      if (vertices.length < 3) return 0;
      const effectiveIndex = Math.min(index, vertices.length - 1);
      return vertices[effectiveIndex].y;
    },
  ], { visible: false } as never) as JXG.Point);
  return createPolygon(board, polygonPoints, {
    fillColor: theme.salvia,
    fillOpacity: 0.12,
    borders: { strokeColor: theme.salvia, strokeWidth: 1.2, strokeOpacity: 0.45 },
    fixed: true,
    ...options,
  }, theme);
}

export function createHalfPlaneFill(
  board: JXG.Board,
  boundary: [PointSupport, PointSupport],
  side: PointSupport,
  bounds: [number, number, number, number] | (() => [number, number, number, number]),
  options: GeometryOptions = {},
  theme: ThemeColors,
): JXGPolygon {
  const resolveBounds = typeof bounds === 'function' ? bounds : () => bounds;
  return createDynamicAreaPolygon(board, () => halfPlaneViewportPolygon(
    pointCoords(boundary[0]),
    pointCoords(boundary[1]),
    pointCoords(side),
    resolveBounds(),
  ), 12, options, theme);
}

export type AreaIntersectionComposite = CompositeElement & {
  __matematikaAreaIntersection?: {
    fills: JXGPolygon[];
    lastSignature?: string;
  };
};

export function createAreaIntersectionFills(
  board: JXG.Board,
  resolvePolygons: () => Coordinates[][],
  options: GeometryOptions = {},
  theme: ThemeColors,
): JXGPolygon[] {
  const polygons = resolvePolygons().filter(polygon => polygon.length >= 3);
  if (polygons.length === 0) return [];
  return polygons.map(polygon => createStaticAreaPolygon(board, polygon, {
    fillOpacity: 0.14,
    borders: { strokeColor: theme.salvia, strokeWidth: 1.2, strokeOpacity: 0.5 },
    fixed: true,
    ...options,
  }, theme, Math.min(96, Math.max(32, polygon.length)))).filter((polygon): polygon is JXGPolygon => Boolean(polygon));
}

export function createAreaIntersectionComposite(
  fills: JXGPolygon[],
): JXGPolygon | AreaIntersectionComposite | null {
  if (fills.length === 0) return null;
  if (fills.length === 1) return fills[0];
  const composite = createComposite(fills) as AreaIntersectionComposite;
  composite.__matematikaAreaIntersection = { fills };
  return composite;
}

export function createAreaIntersectionFill(
  board: JXG.Board,
  resolvePolygon: () => Coordinates[],
  options: GeometryOptions = {},
  theme: ThemeColors,
): JXGPolygon {
  const fills = createAreaIntersectionFills(board, () => {
    const polygon = resolvePolygon();
    return polygon.length >= 3 ? [polygon] : [];
  }, options, theme);
  return createAreaIntersectionComposite(fills) as JXGPolygon;
}

