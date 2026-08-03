/**
 * Chrome insets for the diagram renderer: space reserved by header, toolbar,
 * and optional side rails so geometry / overlays stay in the free box.
 *
 * Pure (no DOM): the hook measures elements, this module decides insets.
 */

/** CSS px insets on each edge of the diagram surface. */
export interface DiagramInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type DiagramToolbarLayout = 'bar' | 'rails';

/** Measured chrome sizes; all lengths in CSS px relative to the renderer root. */
export interface DiagramChromeMetrics {
  rootWidth: number;
  rootHeight: number;
  /** Bottom of visible header content (title / readouts) relative to root top. */
  visibleHeaderContentBottom: number;
  /** Full header element height (includes invisible readout slots). */
  headerHeight: number;
  toolbarHeight: number;
  /** `matchMedia('(min-width: 640px)')` — wider horizontal padding on sm+. */
  isSmUp: boolean;
}

export interface DiagramSafeAreaOptions {
  showToolbar: boolean;
  showStepControls: boolean;
  viewportControls: boolean;
  hasTopViewportPanel: boolean;
}

export interface DiagramSafeAreas {
  /** Insets for viewport-anchored overlays (info panels, labels). */
  viewportSafeArea: DiagramInsets;
  /** Insets that shrink the mathematical scene (MathBoard safeArea). */
  safeArea: DiagramInsets;
  toolbarLayout: DiagramToolbarLayout;
}

/** Breakpoints / chrome constants. Named so magic numbers are not re-lit. */
export const DIAGRAM_CHROME = {
  railsMinWidth: 480,
  railsMinHeight: 400,
  headerGap: 10,
  headerFallbackHeight: 130,
  topViewportPanelExtra: 84,
  railsControlInset: 52,
  railsEdgeInset: 16,
  headerInsetSm: 32,
  headerInsetXs: 20,
  toolbarGapWithToolbar: 8,
  toolbarGapWithoutToolbar: 20,
  toolbarFallbackHeight: 56,
  /** Initial React state before the first measure. */
  initialHeaderTop: 150,
  initialToolbarBottom: 68,
} as const;

export function sameInsets(a: DiagramInsets, b: DiagramInsets): boolean {
  return a.top === b.top && a.right === b.right && a.bottom === b.bottom && a.left === b.left;
}

export function initialDiagramSafeAreas(showToolbar: boolean): Pick<DiagramSafeAreas, 'safeArea' | 'viewportSafeArea'> {
  const area: DiagramInsets = {
    top: DIAGRAM_CHROME.initialHeaderTop,
    right: DIAGRAM_CHROME.headerInsetXs,
    bottom: showToolbar ? DIAGRAM_CHROME.initialToolbarBottom : DIAGRAM_CHROME.headerInsetXs,
    left: DIAGRAM_CHROME.headerInsetXs,
  };
  return { safeArea: area, viewportSafeArea: area };
}

/**
 * Derive geometry + viewport safe areas from measured chrome.
 *
 * - **bar**: toolbar along the bottom; side insets follow header padding.
 * - **rails**: narrow/short canvas; controls move to side columns and the
 *   mathematical scene gets fixed side gutters for those controls.
 */
export function computeDiagramSafeAreas(
  metrics: DiagramChromeMetrics,
  options: DiagramSafeAreaOptions,
): DiagramSafeAreas {
  const { showToolbar, showStepControls, viewportControls, hasTopViewportPanel } = options;
  const viewportHeaderBottom = Math.ceil(metrics.visibleHeaderContentBottom) + DIAGRAM_CHROME.headerGap;
  const stableHeaderBottom = Math.ceil(metrics.headerHeight) + DIAGRAM_CHROME.headerGap;
  const toolbarBottom = Math.ceil(metrics.toolbarHeight)
    + (showToolbar ? DIAGRAM_CHROME.toolbarGapWithToolbar : DIAGRAM_CHROME.toolbarGapWithoutToolbar);
  const useRails = Boolean(
    showToolbar
    && (metrics.rootWidth < DIAGRAM_CHROME.railsMinWidth || metrics.rootHeight < DIAGRAM_CHROME.railsMinHeight),
  );
  const headerInset = metrics.isSmUp ? DIAGRAM_CHROME.headerInsetSm : DIAGRAM_CHROME.headerInsetXs;
  const panelExtra = hasTopViewportPanel ? DIAGRAM_CHROME.topViewportPanelExtra : 0;

  const viewportSafeArea: DiagramInsets = {
    top: viewportHeaderBottom,
    right: headerInset,
    bottom: useRails ? DIAGRAM_CHROME.railsEdgeInset : toolbarBottom,
    left: headerInset,
  };

  const safeArea: DiagramInsets = useRails
    ? {
      top: stableHeaderBottom + panelExtra,
      right: showStepControls ? DIAGRAM_CHROME.railsControlInset : DIAGRAM_CHROME.railsEdgeInset,
      bottom: DIAGRAM_CHROME.railsEdgeInset,
      left: viewportControls ? DIAGRAM_CHROME.railsControlInset : DIAGRAM_CHROME.railsEdgeInset,
    }
    : {
      ...viewportSafeArea,
      top: stableHeaderBottom + panelExtra,
    };

  return {
    viewportSafeArea,
    safeArea,
    toolbarLayout: useRails ? 'rails' : 'bar',
  };
}
