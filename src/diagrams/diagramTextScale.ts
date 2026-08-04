/**
 * Height-driven text scale. Stays at 100% for laptop/desktop boards; only short
 * stacked boards (móvil/tablet ~270–320px) shrink.
 *
 * Threshold 400 matches railsMinHeight territory — clearly below any laptop demo surface.
 */
export const DIAGRAM_TEXT_SCALE_REF_PX = 400;
/** Minimum scale so chrome stays readable while freeing vertical space for the board. */
export const DIAGRAM_TEXT_SCALE_MIN = 0.7;

/** Unitless scale from container height; written onto the diagram root for inheritance. */
export function diagramTextScaleFromHeight(heightPx: number): number {
  if (!Number.isFinite(heightPx) || heightPx <= 0) return 1;
  if (heightPx >= DIAGRAM_TEXT_SCALE_REF_PX) return 1;
  return Math.min(1, Math.max(DIAGRAM_TEXT_SCALE_MIN, heightPx / DIAGRAM_TEXT_SCALE_REF_PX));
}

/** Publish `--diagram-text-scale` on a diagram root (inherits to all typography). */
export function syncDiagramTextScale(element: HTMLElement | null | undefined): number {
  if (!element) return 1;
  const scale = diagramTextScaleFromHeight(element.clientHeight);
  element.style.setProperty('--diagram-text-scale', String(scale));
  return scale;
}

/** Fluid font-size from authored desktop px using inherited `--diagram-text-scale`. */
export function diagramScaledFontSizeCss(authoredPx: number): string {
  return `calc(${authoredPx}px * var(--diagram-text-scale, 1))`;
}

/** CSS for elements that expose `--diagram-authored-font-size`. */
export function diagramAuthoredFontSizeCss(fallbackPx: number = 14): string {
  return `calc(var(--diagram-authored-font-size, ${fallbackPx}px) * var(--diagram-text-scale, 1))`;
}

/** Publish authored desktop px; stylesheet owns the scaled font-size. */
export function applyDiagramAuthoredFontSize(
  node: HTMLElement | null | undefined,
  authoredPx: number | undefined,
): void {
  if (!node) return;
  if (authoredPx === undefined || !Number.isFinite(authoredPx)) {
    node.style.removeProperty('--diagram-authored-font-size');
    node.style.removeProperty('font-size');
    return;
  }
  node.style.setProperty('--diagram-authored-font-size', `${authoredPx}px`);
  node.style.removeProperty('font-size');
}

type VisualTextHost = {
  elType?: string;
  rendNode?: Element | null;
  label?: VisualTextHost | null;
  elements?: Array<VisualTextHost | undefined | null>;
};

/** Text DOM nodes inside a board element or composite (e.g. dimensionLine label). */
export function diagramVisualTextNodes(element: VisualTextHost | null | undefined): HTMLElement[] {
  const found: HTMLElement[] = [];
  const walk = (host: VisualTextHost | null | undefined) => {
    if (!host) return;
    const node = host.rendNode as HTMLElement | undefined;
    if (node && (host.elType === 'text' || node.classList?.contains('JXGtext') || node.classList?.contains('matematika-info-panel'))) {
      found.push(node);
    }
    host.elements?.forEach(walk);
    if (host.label && host.label !== host) walk(host.label);
  };
  walk(element);
  if (found.length === 0) {
    const fallback = element?.rendNode as HTMLElement | undefined;
    if (fallback) found.push(fallback);
  }
  return found;
}
