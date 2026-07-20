import type { ThemeColors } from './MathBoard';
import { DEFAULT_ANGLE_RADIUS, DEFAULT_RIGHT_ANGLE_RADIUS } from '../spec';

type JXGCoord = number | (() => number);
const diagramFontStyle = 'font-family: var(--font-diagram-family);';

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
    ...label,
  };
}

export function createPoint(board: any, coords: [JXGCoord, JXGCoord], options: any = {}, theme: ThemeColors) {
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
  });
}

export function createIntersection(
  board: any,
  supports: [any, any],
  index: 0 | 1 = 0,
  options: any = {},
  theme: ThemeColors,
) {
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
  });
}

export function createSegment(board: any, points: [any, any], options: any = {}, theme: ThemeColors) {
  return board.create('segment', points, {
    strokeColor: theme.carbon,
    strokeWidth: 2,
    ...options,
  });
}

export function createLine(board: any, points: [any, any], options: any = {}, theme: ThemeColors) {
  return board.create('line', points, {
    strokeColor: theme.carbon,
    strokeWidth: 2,
    ...options,
  });
}

export function createRay(board: any, points: [any, any], options: any = {}, theme: ThemeColors) {
  return board.create('line', points, {
    strokeColor: theme.carbon,
    strokeWidth: 2,
    straightFirst: false,
    straightLast: true,
    ...options,
  });
}

export function createPolygon(board: any, vertices: any[], options: any = {}, theme: ThemeColors) {
  return board.create('polygon', vertices, {
    fillColor: theme.salvia,
    fillOpacity: 0.12,
    borders: { strokeColor: theme.salvia, strokeWidth: 1.5 },
    vertices: { visible: false },
    ...options,
  });
}

export function createCircle(board: any, points: [any, any], options: any = {}, theme: ThemeColors) {
  return board.create('circle', points, {
    strokeColor: theme.salvia,
    strokeWidth: 2,
    fillOpacity: 0,
    ...options,
  });
}

export function createArc(board: any, points: [any, any, any], options: any = {}, theme: ThemeColors) {
  return board.create('arc', points, {
    strokeColor: theme.salvia,
    strokeWidth: 2,
    fillOpacity: 0,
    ...options,
  });
}

export function createFunctionCurve(
  board: any,
  evaluate: (x: number) => number,
  domain: [number, number],
  options: any = {},
  theme: ThemeColors,
) {
  return board.create('functiongraph', [evaluate, domain[0], domain[1]], {
    strokeColor: theme.pavo,
    strokeWidth: 2,
    ...options,
  });
}

export function createParametricCurve(
  board: any,
  evaluateX: (t: number) => number,
  evaluateY: (t: number) => number,
  domain: [number, number],
  options: any = {},
  theme: ThemeColors,
) {
  return board.create('curve', [evaluateX, evaluateY, domain[0], domain[1]], {
    strokeColor: theme.pavo,
    strokeWidth: 2,
    ...options,
  });
}

function poincareCircle(center: any, boundary: any, a: any, b: any) {
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
  board: any,
  points: [any, any, any, any],
  options: any = {},
  theme: ThemeColors,
) {
  const [center, boundary, a, b] = points;
  const coordinates = (t: number) => {
    const circle = poincareCircle(center, boundary, a, b);
    if (circle.diameter) return { x: a.X() + (b.X() - a.X()) * t, y: a.Y() + (b.Y() - a.Y()) * t };
    const start = Math.atan2(a.Y() - circle.cy, a.X() - circle.cx);
    const end = Math.atan2(b.Y() - circle.cy, b.X() - circle.cx);
    const angle = start + normalizedArcDelta(start, end) * t;
    return { x: circle.cx + circle.geodesicRadius * Math.cos(angle), y: circle.cy + circle.geodesicRadius * Math.sin(angle) };
  };
  return createParametricCurve(board, t => coordinates(t).x, t => coordinates(t).y, [0, 1], options, theme);
}

export function createPoincareGeodesic(
  board: any,
  points: [any, any, any, any],
  options: any = {},
  theme: ThemeColors,
) {
  const [center, boundary, a, b] = points;
  const coordinates = (t: number) => {
    const circle = poincareCircle(center, boundary, a, b);
    if (circle.diameter) {
      const dx = b.X() - a.X();
      const dy = b.Y() - a.Y();
      const length = Math.hypot(dx, dy) || 1;
      return {
        x: circle.ox + dx / length * circle.radius * (2 * t - 1),
        y: circle.oy + dy / length * circle.radius * (2 * t - 1),
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
  return createParametricCurve(board, t => coordinates(t).x, t => coordinates(t).y, [0, 1], options, theme);
}

function createComposite(elements: any[]) {
  const primary = elements.find(Boolean);
  return {
    rendNode: primary?.rendNode,
    setAttribute: (attributes: any) => elements.forEach(element => element?.setAttribute?.(attributes)),
    on: (event: string, handler: (...args: any[]) => void) => elements.forEach(element => element?.on?.(event, handler)),
    elements,
  };
}

export function createCongruenceMark(
  board: any,
  points: [any, any],
  count = 1,
  options: any = {},
  theme: ThemeColors,
) {
  const [a, b] = points;
  const { markHeight = 0.32, ...markOptions } = options;
  const marks = Array.from({ length: count }, (_, index) => {
    const centered = index - (count - 1) / 2;
    const offset = centered * 0.14;
    const half = markHeight / 2;
    const coordinate = (side: -1 | 1, axis: 'x' | 'y') => () => {
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
    const p1 = board.create('point', [coordinate(-1, 'x'), coordinate(-1, 'y')], { visible: false });
    const p2 = board.create('point', [coordinate(1, 'x'), coordinate(1, 'y')], { visible: false });
    return board.create('segment', [p1, p2], { strokeColor: theme.ocre, strokeWidth: 2, fixed: true, ...markOptions });
  });
  return createComposite(marks);
}

export function createParallelMark(
  board: any,
  points: [any, any],
  count = 1,
  options: any = {},
  theme: ThemeColors,
) {
  const [a, b] = points;
  const { markHeight = 0.42, ...markOptions } = options;
  const chevrons = Array.from({ length: count }, (_, index) => {
    const centered = index - (count - 1) / 2;
    const offset = centered * markHeight * 0.72;
    const coordinate = (part: 'tip' | 'upper' | 'lower', axis: 'x' | 'y') => () => {
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
      const normal = part === 'upper' ? 0.38 : part === 'lower' ? -0.38 : 0;
      const x = centerX + tangentX * markHeight * direction + normalX * markHeight * normal;
      const y = centerY + tangentY * markHeight * direction + normalY * markHeight * normal;
      return axis === 'x' ? x : y;
    };
    const tip = board.create('point', [coordinate('tip', 'x'), coordinate('tip', 'y')], { visible: false });
    const upper = board.create('point', [coordinate('upper', 'x'), coordinate('upper', 'y')], { visible: false });
    const lower = board.create('point', [coordinate('lower', 'x'), coordinate('lower', 'y')], { visible: false });
    return [
      board.create('segment', [upper, tip], { strokeColor: theme.pavo, strokeWidth: 2, fixed: true, ...markOptions }),
      board.create('segment', [lower, tip], { strokeColor: theme.pavo, strokeWidth: 2, fixed: true, ...markOptions }),
    ];
  }).flat();
  return createComposite(chevrons);
}

export function createDimensionLine(
  board: any,
  points: [any, any],
  label: () => string,
  offset = 0.35,
  options: any = {},
  theme: ThemeColors,
) {
  const [a, b] = points;
  const { fontSize, ...lineOptions } = options;
  const shifted = (point: any, axis: 'x' | 'y') => () => {
    const dx = b.X() - a.X();
    const dy = b.Y() - a.Y();
    const length = Math.hypot(dx, dy) || 1;
    return (axis === 'x' ? point.X() - dy / length * offset : point.Y() + dx / length * offset);
  };
  const a2 = board.create('point', [shifted(a, 'x'), shifted(a, 'y')], { visible: false });
  const b2 = board.create('point', [shifted(b, 'x'), shifted(b, 'y')], { visible: false });
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
  board: any,
  points: [any, any, any, any],
  rows: number,
  columns: number,
  options: any = {},
  theme: ThemeColors,
) {
  const [a, b, c, d] = points;
  const lines: any[] = [];
  const interpolate = (p: any, q: any, amount: number, axis: 'x' | 'y') => () => (
    (axis === 'x' ? p.X() : p.Y()) + ((axis === 'x' ? q.X() : q.Y()) - (axis === 'x' ? p.X() : p.Y())) * amount
  );
  for (let row = 1; row < rows; row += 1) {
    const amount = row / rows;
    const left = board.create('point', [interpolate(a, d, amount, 'x'), interpolate(a, d, amount, 'y')], { visible: false });
    const right = board.create('point', [interpolate(b, c, amount, 'x'), interpolate(b, c, amount, 'y')], { visible: false });
    lines.push(createSegment(board, [left, right], { strokeColor: theme.carbon, strokeWidth: 0.8, strokeOpacity: 0.35, ...options }, theme));
  }
  for (let column = 1; column < columns; column += 1) {
    const amount = column / columns;
    const bottom = board.create('point', [interpolate(a, b, amount, 'x'), interpolate(a, b, amount, 'y')], { visible: false });
    const top = board.create('point', [interpolate(d, c, amount, 'x'), interpolate(d, c, amount, 'y')], { visible: false });
    lines.push(createSegment(board, [bottom, top], { strokeColor: theme.carbon, strokeWidth: 0.8, strokeOpacity: 0.35, ...options }, theme));
  }
  return createComposite(lines);
}

export function createAreaDecomposition(
  board: any,
  points: any[],
  rows: number,
  columns: number,
  options: any = {},
  theme: ThemeColors,
) {
  const polygon = createPolygon(board, points, options, theme);
  if (points.length !== 4) return polygon;
  const grid = createGridOverlay(board, points as [any, any, any, any], rows, columns, options.borders ?? {}, theme);
  return createComposite([polygon, grid]);
}

export function createMidpoint(board: any, points: [any, any], options: any = {}, theme: ThemeColors) {
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
  });
}

export function createGlider(board: any, coordsAndSupport: [JXGCoord, JXGCoord, any], options: any = {}, theme: ThemeColors) {
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
  });
}

export function createPerpendicularLine(board: any, points: [any, any, any], options: any = {}, theme: ThemeColors) {
  const [baseA, baseB, through] = points;
  const baseLine = board.create('line', [baseA, baseB], { visible: false });
  return board.create('perpendicular', [baseLine, through], {
    strokeColor: theme.pavo,
    strokeWidth: 2,
    dash: 2,
    ...options,
  });
}

export function createParallelLine(board: any, points: [any, any, any], options: any = {}, theme: ThemeColors) {
  const [baseA, baseB, through] = points;
  const baseLine = board.create('line', [baseA, baseB], { visible: false });
  return board.create('parallel', [baseLine, through], {
    strokeColor: theme.salvia,
    strokeWidth: 2,
    dash: 2,
    ...options,
  });
}

export function createPerpendicularFoot(board: any, points: [any, any, any], options: any = {}, theme: ThemeColors) {
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
  });
}

export function createBaseExtensionToFoot(board: any, points: [any, any, any], options: any = {}, theme: ThemeColors) {
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
  ], { visible: false });

  return board.create('segment', [extensionEnd, foot], {
    strokeColor: theme.pizarra,
    strokeWidth: 1.5,
    dash: 2,
    visible: false,
    ...options,
  });
}

export function createAngleBisectorRay(board: any, points: [any, any, any], options: any = {}, theme: ThemeColors) {
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
  ], { visible: false });

  return board.create('line', [vertex, directionPoint], {
    strokeColor: theme.pavo,
    strokeWidth: 2.2,
    dash: 2,
    straightFirst: false,
    straightLast: true,
    ...options,
  });
}

export function createAngle(board: any, points: [any, any, any], options: any = {}, theme: ThemeColors) {
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
  });
}

export function createNonReflexAngle(board: any, points: [any, any, any], options: any = {}, theme: ThemeColors) {
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
  });
}

export function createRightAngleMarker(board: any, points: [any, any, any], options: any = {}, theme: ThemeColors) {
  const [legA, vertex, legB] = points;
  const { size = DEFAULT_RIGHT_ANGLE_RADIUS, ...attrs } = options;
  const unit = (from: any, to: any) => {
    const dx = to.X() - from.X();
    const dy = to.Y() - from.Y();
    const len = Math.hypot(dx, dy) || 1;
    return { x: dx / len, y: dy / len };
  };
  const p0 = board.create('point', [() => vertex.X(), () => vertex.Y()], { visible: false });
  const p1 = board.create('point', [
    () => vertex.X() + unit(vertex, legA).x * size,
    () => vertex.Y() + unit(vertex, legA).y * size,
  ], { visible: false });
  const p2 = board.create('point', [
    () => vertex.X() + (unit(vertex, legA).x + unit(vertex, legB).x) * size,
    () => vertex.Y() + (unit(vertex, legA).y + unit(vertex, legB).y) * size,
  ], { visible: false });
  const p3 = board.create('point', [
    () => vertex.X() + unit(vertex, legB).x * size,
    () => vertex.Y() + unit(vertex, legB).y * size,
  ], { visible: false });

  return board.create('polygon', [p0, p1, p2, p3], {
    fillColor: theme.ocre,
    fillOpacity: 0.1,
    strokeColor: theme.ocre,
    strokeWidth: 1.5,
    vertices: { visible: false },
    borders: { strokeColor: theme.ocre, strokeWidth: 1.5, ...(attrs.highlight === false ? { highlight: false } : {}) },
    ...attrs,
  });
}

export function createText(board: any, coords: [JXGCoord, JXGCoord, string | (() => string)], options: any = {}, theme: ThemeColors) {
  return board.create('text', coords, {
    fixed: true,
    display: 'html',
    color: theme.carbon,
    cssClass: 'font-diagram text-sm',
    cssDefaultStyle: diagramFontStyle,
    highlightCssDefaultStyle: diagramFontStyle,
    ...options,
  });
}

export function createSlider(
  board: any,
  anchors: [[number, number], [number, number]],
  values: [number, number, number],
  options: any = {},
  theme: ThemeColors,
) {
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
  });
}

export function createTicks(board: any, elements: [any, number], options: any = {}, theme: ThemeColors) {
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
  });
}

export function createRightAngle(board: any, points: [any, any, any], options: any = {}, theme: ThemeColors) {
  return board.create('angle', points, {
    type: 'sectordot',
    size: 20,
    fillColor: theme.carbon,
    strokeColor: theme.carbon,
    ...options,
  });
}
