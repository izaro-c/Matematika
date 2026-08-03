/**
 * Pure viewport math for MathBoard: aspect fitting and chrome-aware safe areas.
 * Kept free of React / JSXGraph so geometry stays unit-testable.
 */

export interface MathBoardSafeArea {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export type DiagramBounds = [number, number, number, number];

/** Clamp safe-area insets so the remaining box stays at least 1×1 CSS px. */
export function resolvedSafeArea(safeArea: MathBoardSafeArea | undefined, width: number, height: number) {
  const left = Math.max(0, Math.min(safeArea?.left ?? 0, Math.max(0, width - 1)));
  const right = Math.max(0, Math.min(safeArea?.right ?? 0, Math.max(0, width - left - 1)));
  const top = Math.max(0, Math.min(safeArea?.top ?? 0, Math.max(0, height - 1)));
  const bottom = Math.max(0, Math.min(safeArea?.bottom ?? 0, Math.max(0, height - top - 1)));
  return { top, right, bottom, left };
}

/**
 * Expand the short axis of `bounds` so the mathematical scene fills `width`×`height`
 * without distortion (letterbox / pillarbox in user coordinates).
 */
export function fitBoundsToAspect(
  bounds: DiagramBounds,
  width: number,
  height: number,
): DiagramBounds {
  if (width <= 0 || height <= 0) return [...bounds];
  const [left, top, right, bottom] = bounds;
  const spanX = Math.abs(right - left);
  const spanY = Math.abs(top - bottom);
  if (spanX <= 0 || spanY <= 0) return [...bounds];
  const centerX = (left + right) / 2;
  const centerY = (top + bottom) / 2;
  const containerAspect = width / height;
  const boundsAspect = spanX / spanY;
  if (containerAspect > boundsAspect) {
    const fittedSpanX = spanY * containerAspect;
    return [centerX - fittedSpanX / 2, top, centerX + fittedSpanX / 2, bottom];
  }
  const fittedSpanY = spanX / containerAspect;
  return [left, centerY + fittedSpanY / 2, right, centerY - fittedSpanY / 2];
}

/**
 * Map content bounds into the full container so that the content rectangle lands
 * inside the area left free by headers / toolbars (`safeArea`).
 */
export function fitBoundsToSafeArea(
  bounds: DiagramBounds,
  width: number,
  height: number,
  safeArea?: MathBoardSafeArea,
): DiagramBounds {
  if (width <= 0 || height <= 0) return [...bounds];
  const [left, top, right, bottom] = bounds;
  const spanX = Math.abs(right - left);
  const spanY = Math.abs(top - bottom);
  if (spanX <= 0 || spanY <= 0) return [...bounds];
  const insets = resolvedSafeArea(safeArea, width, height);
  const safeWidth = width - insets.left - insets.right;
  const safeHeight = height - insets.top - insets.bottom;
  const scale = Math.min(safeWidth / spanX, safeHeight / spanY);
  if (!Number.isFinite(scale) || scale <= 0) return fitBoundsToAspect(bounds, width, height);
  const xStart = insets.left + (safeWidth - spanX * scale) / 2;
  const yStart = insets.top + (safeHeight - spanY * scale) / 2;
  const displayLeft = left - xStart / scale;
  const displayTop = top + yStart / scale;
  return [displayLeft, displayTop, displayLeft + width / scale, displayTop - height / scale];
}

/**
 * Inverse of {@link fitBoundsToSafeArea}: recover content bounds from a display
 * bounding box that already includes chrome insets.
 */
export function contentBoundsFromSafeArea(
  displayBounds: DiagramBounds,
  width: number,
  height: number,
  safeArea?: MathBoardSafeArea,
): DiagramBounds {
  if (width <= 0 || height <= 0) return [...displayBounds];
  const [left, top, right, bottom] = displayBounds;
  const insets = resolvedSafeArea(safeArea, width, height);
  const unitX = (right - left) / width;
  const unitY = (top - bottom) / height;
  return [
    left + insets.left * unitX,
    top - insets.top * unitY,
    right - insets.right * unitX,
    bottom + insets.bottom * unitY,
  ];
}
