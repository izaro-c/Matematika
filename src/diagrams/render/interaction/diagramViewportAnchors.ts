/**
 * Pure placement helpers for annotations / panels relative to the diagram
 * viewport. Kept out of the React hook so lifecycle + element creation can
 * share them without pulling ResizeObserver state.
 */

import type { DiagramBounds, DiagramSpecV2 } from '@/diagrams/model';

export function renderedCoordinates(element: any, parameter?: number): [number, number] | null {
  if (!element || typeof element.X !== 'function' || typeof element.Y !== 'function') return null;
  try {
    const x = parameter === undefined ? element.X() : element.X(parameter);
    const y = parameter === undefined ? element.Y() : element.Y(parameter);
    return Number.isFinite(x) && Number.isFinite(y) ? [x, y] : null;
  } catch {
    return null;
  }
}

/**
 * World-space anchor for a label that tracks a referenced object
 * (point, curve parameter, angle bisector, segment lerp, …).
 */
export function referencedLabelAnchor(
  referenceId: string,
  parameter: number,
  elements: Record<string, any>,
  spec: DiagramSpecV2,
): [number, number] {
  const referencedItem = [...spec.points, ...spec.elements, ...spec.sliders].find(item => item.id === referenceId);
  const rendered = elements[referenceId];
  if (!referencedItem || !('kind' in referencedItem)) return renderedCoordinates(rendered) ?? [0, 0];

  if (['poincareGeodesic', 'poincareArc', 'parametricCurve', 'functionCurve'].includes(referencedItem.kind)) {
    const domain = referencedItem.kind === 'poincareGeodesic' || referencedItem.kind === 'poincareArc'
      ? [0, 1]
      : referencedItem.properties?.domain ?? (referencedItem.kind === 'functionCurve' ? [-5, 5] : [0, Math.PI * 2]);
    const curveParameter = domain[0] + (domain[1] - domain[0]) * parameter;
    const curveCoordinates = renderedCoordinates(rendered, curveParameter);
    if (curveCoordinates) return curveCoordinates;
  }

  const referenceCoordinates = referencedItem.refs
    .map(id => renderedCoordinates(elements[id]))
    .filter((coordinates): coordinates is [number, number] => Boolean(coordinates));
  if (referencedItem.kind === 'circle' && referenceCoordinates.length >= 2) {
    const [center, boundary] = referenceCoordinates;
    const radius = Math.hypot(boundary[0] - center[0], boundary[1] - center[1]);
    const angle = Math.PI * 2 * parameter;
    return [center[0] + radius * Math.cos(angle), center[1] + radius * Math.sin(angle)];
  }
  if (['segment', 'line', 'ray'].includes(referencedItem.kind) && referenceCoordinates.length >= 2) {
    const [start, end] = referenceCoordinates;
    return [start[0] + (end[0] - start[0]) * parameter, start[1] + (end[1] - start[1]) * parameter];
  }
  if (['angle', 'nonReflexAngle', 'rightAngle', 'perpendicularMark'].includes(referencedItem.kind)) {
    const labelCoordinates = renderedCoordinates(rendered?.label);
    if (labelCoordinates) return labelCoordinates;

    if (referenceCoordinates.length >= 3) {
      const [pA, pO, pB] = referenceCoordinates;
      const a = Math.atan2(pA[1] - pO[1], pA[0] - pO[0]);
      const b = Math.atan2(pB[1] - pO[1], pB[0] - pO[0]);
      const diff = (b - a + 2 * Math.PI) % (2 * Math.PI);
      let midAngle = a + diff / 2;
      if (referencedItem.kind !== 'angle') {
        if (diff > Math.PI) midAngle += Math.PI;
      }
      const radius = (referencedItem.style?.angleRadius ?? 1) * 1.5;
      return [pO[0] + radius * Math.cos(midAngle), pO[1] + radius * Math.sin(midAngle)];
    }
  }

  if (referenceCoordinates.length > 0) {
    const total = referenceCoordinates.reduce(([x, y], coordinates) => [x + coordinates[0], y + coordinates[1]], [0, 0]);
    return [total[0] / referenceCoordinates.length, total[1] / referenceCoordinates.length];
  }
  return renderedCoordinates(rendered) ?? [0, 0];
}

/**
 * Map a normalized viewport position `[0..1, 0..1]` into user coordinates,
 * respecting MathBoard's viewport safe-area chrome.
 */
export function viewportPositionCoordinates(
  board: any,
  position: [number, number],
  fallbackBounds: DiagramBounds,
): [number, number] {
  const [left, top, right, bottom] = board.getBoundingBox?.() ?? fallbackBounds;
  const width = board.__matematikaContainerSize?.width ?? board.canvasWidth ?? 1;
  const height = board.__matematikaContainerSize?.height ?? board.canvasHeight ?? 1;
  const safeArea = board.__matematikaViewportSafeArea ?? board.__matematikaSafeArea ?? {};
  const safeLeft = Math.max(0, safeArea.left ?? 0);
  const safeRight = Math.max(0, safeArea.right ?? 0);
  const safeTop = Math.max(0, safeArea.top ?? 0);
  const safeBottom = Math.max(0, safeArea.bottom ?? 0);
  const pixelX = safeLeft + Math.max(1, width - safeLeft - safeRight) * position[0];
  const pixelY = safeTop + Math.max(1, height - safeTop - safeBottom) * position[1];
  return [
    left + (right - left) * pixelX / width,
    top - (top - bottom) * pixelY / height,
  ];
}

/** JSXGraph text anchors for a normalized panel position. */
export function viewportPanelAnchors(position: [number, number]): {
  anchorX: 'left' | 'middle' | 'right';
  anchorY: 'top' | 'middle' | 'bottom';
} {
  const [x, y] = position;
  return {
    anchorX: x < 0.34 ? 'left' : x > 0.66 ? 'right' : 'middle',
    anchorY: y < 0.34 ? 'top' : y > 0.66 ? 'bottom' : 'middle',
  };
}

/**
 * Map user coordinates `[x, y]` back to normalized viewport position `[0..1, 0..1]`,
 * respecting MathBoard's viewport safe-area chrome.
 */
export function coordinatesToViewportPosition(
  board: any,
  coordinates: [number, number],
  fallbackBounds: DiagramBounds,
): [number, number] {
  const [left, top, right, bottom] = board.getBoundingBox?.() ?? fallbackBounds;
  const width = board.__matematikaContainerSize?.width ?? board.canvasWidth ?? 1;
  const height = board.__matematikaContainerSize?.height ?? board.canvasHeight ?? 1;
  const safeArea = board.__matematikaViewportSafeArea ?? board.__matematikaSafeArea ?? {};
  const safeLeft = Math.max(0, safeArea.left ?? 0);
  const safeRight = Math.max(0, safeArea.right ?? 0);
  const safeTop = Math.max(0, safeArea.top ?? 0);
  const safeBottom = Math.max(0, safeArea.bottom ?? 0);
  const safeWidth = Math.max(1, width - safeLeft - safeRight);
  const safeHeight = Math.max(1, height - safeTop - safeBottom);
  const [x, y] = coordinates;
  const pixelX = width * (x - left) / (right - left);
  const pixelY = height * (top - y) / (top - bottom);
  const clamp = (val: number) => Math.max(0, Math.min(1, val));
  return [
    clamp((pixelX - safeLeft) / safeWidth),
    clamp((pixelY - safeTop) / safeHeight),
  ];
}

