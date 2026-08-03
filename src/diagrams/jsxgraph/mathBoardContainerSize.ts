/**
 * Container-size sync for MathBoard / JSXGraph.
 *
 * Layout ownership (critical):
 * - The CSS shell (`.content-diagram-surface`, sticky, clamps) must size the box.
 * - JSXGraph only updates its canvas *buffer* to match that box.
 * - Never let `resizeContainer` write inline width/height, and never let the
 *   surface use `height: auto` driven by the SVG intrinsic size — both create
 *   a shrink-only ratchet across repeated viewport resizes.
 */

/** Minimal board surface needed to sync pixel buffer size. */
export interface BoardContainerSizeTarget {
  resizeContainer: (
    width: number,
    height: number,
    dontSetCss?: boolean,
    dontSetBoundingBox?: boolean,
  ) => unknown;
  containerObj?: { style: CSSStyleDeclaration | { width: string; height: string } };
}

export interface LayoutBoxSize {
  width: number;
  height: number;
}

/** Prefer ResizeObserver's content box; fall back to the element's client box. */
export function readLayoutBoxSize(
  entry: { contentRect: { width: number; height: number } } | null | undefined,
  el: { clientWidth: number; clientHeight: number } | null | undefined,
): LayoutBoxSize {
  if (entry) {
    return { width: entry.contentRect.width, height: entry.contentRect.height };
  }
  return { width: el?.clientWidth ?? 0, height: el?.clientHeight ?? 0 };
}

/**
 * Clear inline width/height so percentage / inset layout can reclaim the box.
 */
export function clearBoardContainerCssSize(el: { style: { width: string; height: string } } | null | undefined): void {
  if (!el) return;
  el.style.width = '';
  el.style.height = '';
}

/**
 * Sync the JSXGraph canvas buffer to a layout-driven size.
 *
 * @returns false when the box is degenerate (collapsed / hidden).
 */
export function syncBoardToContainerSize(
  board: BoardContainerSizeTarget,
  width: number,
  height: number,
  containerEl?: { style: { width: string; height: string } } | null,
): boolean {
  if (width <= 2 || height <= 2) return false;
  clearBoardContainerCssSize(containerEl ?? board.containerObj);
  // true, true: do not set CSS; do not let JSXGraph mutate the bounding box.
  board.resizeContainer(width, height, true, true);
  return true;
}
