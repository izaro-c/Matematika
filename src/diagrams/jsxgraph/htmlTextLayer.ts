/**
 * JSXGraph `setAttribute({ layer })` / `setLayer` appends `rendNode` into an
 * SVG layer `<g>`. That is correct for SVG primitives, but HTML `display:'html'`
 * texts must stay on `board.containerObj` — a bare HTML DIV inside SVG lays out
 * as 0×0 and disappears (labels, info panels).
 *
 * Stacking for HTML texts is CSS `z-index` (same formula JSXGraph uses at create).
 */

type HtmlTextHost = {
  board?: { containerObj?: HTMLElement | null };
  rendNode?: Element | null;
  visProp?: { display?: string; layer?: number };
  evalVisProp?: (key: string) => unknown;
};

export function isHtmlBoardText(element: HtmlTextHost | null | undefined): boolean {
  if (!element?.rendNode) return false;
  const display = typeof element.evalVisProp === 'function'
    ? element.evalVisProp('display')
    : element.visProp?.display;
  return display === 'html' && element.rendNode instanceof HTMLElement;
}

/** Keep an HTML text on the board container and map `layer` → CSS z-index. */
export function settleHtmlTextLayer(element: HtmlTextHost | null | undefined, layer?: number): void {
  if (!isHtmlBoardText(element)) return;
  const node = element!.rendNode as HTMLElement;
  const container = element!.board?.containerObj;
  if (!container) return;
  if (node.parentNode !== container) container.appendChild(node);
  const resolvedLayer = layer
    ?? (typeof element!.evalVisProp === 'function' ? Number(element!.evalVisProp('layer')) : undefined)
    ?? element!.visProp?.layer
    ?? 0;
  const base = parseInt(container.style.zIndex || '0', 10) || 0;
  node.style.zIndex = String(base + (Number.isFinite(resolvedLayer) ? resolvedLayer : 0));
}

/** Apply stack order: SVG primitives via JSXGraph layer; HTML texts via settle. */
export function applyBoardStackLayer(
  element: (HtmlTextHost & { setAttribute?: (attrs: { layer: number }) => void }) | null | undefined,
  layer: number,
): void {
  if (!element) return;
  if (isHtmlBoardText(element)) {
    settleHtmlTextLayer(element, layer);
    return;
  }
  element.setAttribute?.({ layer });
}
