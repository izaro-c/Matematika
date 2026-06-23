import type { ThemeColors } from '@/features/graph/ui/MathBoard';

type JXGCoord = number | (() => number);
const FONT_CLASSES = 'font-serif font-bold italic';

export function createPoint(board: any, coords: [JXGCoord, JXGCoord], options: any = {}, theme: ThemeColors) {
  const defaultOpts = {
    size: 5,
    fillColor: theme.carbon,
    strokeColor: theme.carbon,
    label: {
      fontSize: 18,
      cssClass: FONT_CLASSES,
      offset: [-15, -15],
      strokeColor: theme.carbon
    }
  };

  const labelOpts = { ...defaultOpts.label, ...(options.label || {}) };
  const finalOpts = { ...defaultOpts, ...options, label: labelOpts };
  return board.create('point', coords, finalOpts);
}

export function createMidpoint(board: any, elements: [any, any], options: any = {}, theme: ThemeColors) {
  const defaultOpts = {
    size: 4,
    fillColor: theme.carbon,
    strokeColor: theme.carbon,
    label: {
      fontSize: 18,
      cssClass: FONT_CLASSES,
      offset: [5, -15],
      strokeColor: theme.carbon
    }
  };
  const labelOpts = { ...defaultOpts.label, ...(options.label || {}) };
  const finalOpts = { ...defaultOpts, ...options, label: labelOpts };
  return board.create('midpoint', elements, finalOpts);
}

export function createGlider(board: any, coords: [JXGCoord, JXGCoord, any], options: any = {}, theme: ThemeColors) {
  const defaultOpts = {
    size: 5,
    fillColor: theme.terracota,
    strokeColor: theme.terracota,
    label: {
      fontSize: 18,
      cssClass: FONT_CLASSES,
      offset: [10, 10],
      strokeColor: theme.terracota
    }
  };
  const labelOpts = { ...defaultOpts.label, ...(options.label || {}) };
  const finalOpts = { ...defaultOpts, ...options, label: labelOpts };
  return board.create('glider', coords, finalOpts);
}

export function createSegment(board: any, points: [any, any], options: any = {}, theme: ThemeColors) {
  const defaultOpts = {
    strokeColor: theme.carbon,
    strokeWidth: 2
  };
  return board.create('segment', points, { ...defaultOpts, ...options });
}

export function createLine(board: any, points: [any, any], options: any = {}, theme: ThemeColors) {
  const defaultOpts = {
    strokeColor: theme.carbon,
    strokeWidth: 2
  };
  return board.create('line', points, { ...defaultOpts, ...options });
}

export function createPerpendicular(board: any, elements: [any, any], options: any = {}, theme: ThemeColors) {
  const defaultOpts = {
    strokeColor: theme.carbon,
    strokeWidth: 2,
    label: {
      fontSize: 18,
      cssClass: FONT_CLASSES,
      offset: [10, 10],
      strokeColor: theme.carbon
    }
  };
  const labelOpts = { ...defaultOpts.label, ...(options.label || {}) };
  const finalOpts = { ...defaultOpts, ...options, label: labelOpts };
  return board.create('perpendicular', elements, finalOpts);
}

export function createPolygon(board: any, vertices: any[], options: any = {}, theme: ThemeColors) {
  const defaultOpts = {
    fillColor: theme.carbon,
    fillOpacity: 0.05,
    borders: { strokeOpacity: 0 },
    vertices: { visible: false }
  };
  return board.create('polygon', vertices, { ...defaultOpts, ...options });
}

export function createAngle(board: any, points: [any, any, any], options: any = {}, theme: ThemeColors) {
  const defaultOpts = {
    radius: 0.7,
    fillColor: theme.terracota,
    fillOpacity: 0.2,
    strokeColor: theme.terracota,
    strokeWidth: 2
  };
  return board.create('angle', points, { ...defaultOpts, ...options });
}

export function createRightAngle(board: any, points: [any, any, any], options: any = {}, theme: ThemeColors) {
  const defaultOpts = {
    type: 'sectordot',
    size: 20,
    fillColor: theme.carbon,
    strokeColor: theme.carbon
  };
  return board.create('angle', points, { ...defaultOpts, ...options });
}

export function createCircle(board: any, points: [any, any], options: any = {}, theme: ThemeColors) {
  const defaultOpts = {
    strokeColor: theme.carbon,
    strokeWidth: 1,
    fillOpacity: 0
  };
  return board.create('circle', points, { ...defaultOpts, ...options });
}

export function createIntersection(board: any, elements: [any, any], options: any = {}) {
  const defaultOpts = {
    visible: false
  };
  return board.create('intersection', elements, { ...defaultOpts, ...options });
}

export function createTicks(board: any, elements: [any, number], options: any = {}, theme: ThemeColors) {
  const defaultOpts = {
    strokeColor: theme.carbon,
    strokeWidth: 2
  };
  return board.create('ticks', elements, { ...defaultOpts, ...options });
}
