import type { ThemeColors } from './MathBoard';

type JXGCoord = number | (() => number);

export function createPoint(board: any, coords: [JXGCoord, JXGCoord], options: any = {}, theme: ThemeColors) {
  return board.create('point', coords, {
    size: 5,
    fillColor: theme.carbon,
    strokeColor: theme.carbon,
    label: {
      fontSize: 18,
      cssClass: 'font-serif font-bold italic',
      strokeColor: theme.carbon,
    },
    ...options,
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

export function createMidpoint(board: any, points: [any, any], options: any = {}, theme: ThemeColors) {
  return board.create('midpoint', points, {
    size: 5,
    fillColor: theme.terracota,
    strokeColor: theme.terracota,
    label: {
      fontSize: 18,
      cssClass: 'font-serif font-bold italic',
      strokeColor: theme.carbon,
    },
    ...options,
  });
}

export function createGlider(board: any, coordsAndSupport: [JXGCoord, JXGCoord, any], options: any = {}, theme: ThemeColors) {
  return board.create('glider', coordsAndSupport, {
    size: 5,
    fillColor: theme.ocre,
    strokeColor: theme.ocre,
    label: {
      fontSize: 18,
      cssClass: 'font-serif font-bold italic',
      strokeColor: theme.carbon,
    },
    ...options,
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

  return board.create('point', [
    () => projected().x,
    () => projected().y,
  ], {
    size: 5,
    fillColor: theme.ocre,
    strokeColor: theme.ocre,
    label: {
      fontSize: 18,
      cssClass: 'font-serif font-bold italic',
      strokeColor: theme.carbon,
    },
    ...options,
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
  return board.create('angle', points, {
    type: 'sector',
    radius: 0.55,
    fillColor: theme.ocre,
    fillOpacity: 0.18,
    strokeColor: theme.ocre,
    strokeWidth: 1.5,
    label: { visible: false },
    ...options,
  });
}

export function createRightAngleMarker(board: any, points: [any, any, any], options: any = {}, theme: ThemeColors) {
  const [legA, vertex, legB] = points;
  const { size = 0.45, ...attrs } = options;
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
    fillOpacity: 0.18,
    strokeColor: theme.ocre,
    strokeWidth: 1.5,
    vertices: { visible: false },
    borders: { strokeColor: theme.ocre, strokeWidth: 1.5 },
    ...attrs,
  });
}

export function createText(board: any, coords: [JXGCoord, JXGCoord, string | (() => string)], options: any = {}, theme: ThemeColors) {
  return board.create('text', coords, {
    fixed: true,
    color: theme.carbon,
    cssClass: 'font-serif text-sm',
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
  return board.create('slider', [anchors[0], anchors[1], values], {
    name: '',
    baseline: { strokeColor: theme.pizarra, strokeWidth: 2 },
    highline: { strokeColor: theme.terracota, strokeWidth: 3 },
    fillColor: theme.terracota,
    strokeColor: theme.terracota,
    label: { cssClass: 'font-serif text-sm', strokeColor: theme.carbon },
    ...options,
  });
}

export function createTicks(board: any, elements: [any, number], options: any = {}, theme: ThemeColors) {
  return board.create('ticks', elements, {
    strokeColor: theme.carbon,
    strokeWidth: 2,
    ...options,
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
