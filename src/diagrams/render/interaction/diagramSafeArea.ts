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
/** Top banner vs left column for title / note / readings. */
export type DiagramHeaderLayout = 'top' | 'side';

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
  /** When false, never reserve / flip to a side header column. Default true. */
  hasHeader?: boolean;
}

export interface DiagramSafeAreas {
  /** Insets for viewport-anchored overlays (info panels, labels). */
  viewportSafeArea: DiagramInsets;
  /** Insets that shrink the mathematical scene (MathBoard safeArea). */
  safeArea: DiagramInsets;
  toolbarLayout: DiagramToolbarLayout;
  headerLayout: DiagramHeaderLayout;
  /** CSS px width of the side header column; 0 when header is on top. */
  sideChromeWidth: number;
  /** Horizontal padding inside the side column; 0 when header is on top. */
  sidePad: number;
}

/** Breakpoints / chrome constants. Named so magic numbers are not re-lit. */
export const DIAGRAM_CHROME = {
  railsMinWidth: 480,
  railsMinHeight: 400,
  /** Wide+short canvases: header moves left so geometry keeps the height. */
  sideMinWidth: 560,
  /** Above this, a top header is cheap enough — keep it (desktop columns). */
  sideMaxHeight: 480,
  sideWidthFraction: 0.36,
  /** Leave at least this much for the board when sizing the text column. */
  sideBoardMinWidth: 280,
  /** Match header padding so panels share the title text edge. */
  sidePadXs: 12,
  sidePadSm: 16,
  headerGap: 10,
  headerFallbackHeight: 130,
  topViewportPanelExtra: 42,
  railsControlInset: 52,
  railsEdgeInset: 16,
  headerInsetSm: 24,
  headerInsetXs: 14,
  toolbarGapWithToolbar: 8,
  toolbarGapWithoutToolbar: 14,
  toolbarFallbackHeight: 56,
  /** Initial React state before the first measure. */
  initialHeaderTop: 100,
  initialToolbarBottom: 68,
} as const;

export function sameInsets(a: DiagramInsets, b: DiagramInsets): boolean {
  return a.top === b.top && a.right === b.right && a.bottom === b.bottom && a.left === b.left;
}

/** Wide+short board with room for a text column — matches CSS side chrome width. */
export function preferSideHeader(width: number, height: number): boolean {
  return width >= DIAGRAM_CHROME.sideMinWidth
    && height > 0
    && height < DIAGRAM_CHROME.sideMaxHeight
    && width > height;
}

export function sideChromeWidthPx(rootWidth: number): number {
  const proportional = Math.round(rootWidth * DIAGRAM_CHROME.sideWidthFraction);
  const maxForBoard = Math.max(0, Math.round(rootWidth - DIAGRAM_CHROME.sideBoardMinWidth));
  return Math.min(proportional, maxForBoard);
}

export function initialDiagramSafeAreas(
  showToolbar: boolean,
  hasHeader = true,
): Pick<DiagramSafeAreas, 'safeArea' | 'viewportSafeArea' | 'headerLayout' | 'sideChromeWidth' | 'sidePad'> {
  const inset = DIAGRAM_CHROME.headerInsetXs;
  const area: DiagramInsets = {
    top: hasHeader ? DIAGRAM_CHROME.initialHeaderTop : inset,
    right: inset,
    bottom: showToolbar ? DIAGRAM_CHROME.initialToolbarBottom : inset,
    left: inset,
  };
  return { safeArea: area, viewportSafeArea: area, headerLayout: 'top', sideChromeWidth: 0, sidePad: 0 };
}

/**
 * Derive geometry + viewport safe areas from measured chrome.
 *
 * - **bar**: toolbar along the bottom; side insets follow header padding.
 * - **rails**: narrow/short canvas; controls move to side columns and the
 *   mathematical scene gets fixed side gutters for those controls.
 * - **side header**: wide+short canvas; title/note/readings sit in a left
 *   column so the board recovers vertical space (tablet landscape).
 */
export function computeDiagramSafeAreas(
  metrics: DiagramChromeMetrics,
  options: DiagramSafeAreaOptions,
): DiagramSafeAreas {
  const { showToolbar, showStepControls, viewportControls, hasTopViewportPanel } = options;
  const hasHeader = options.hasHeader !== false;
  const isSmallSurface = metrics.rootHeight > 0 && metrics.rootHeight < 320;
  const useSideHeader = hasHeader && preferSideHeader(metrics.rootWidth, metrics.rootHeight);
  const sideChromeWidth = useSideHeader ? sideChromeWidthPx(metrics.rootWidth) : 0;
  const sidePad = useSideHeader
    ? (metrics.isSmUp ? DIAGRAM_CHROME.sidePadSm : DIAGRAM_CHROME.sidePadXs)
    : 0;

  const headerInset = hasHeader
    ? (metrics.isSmUp ? DIAGRAM_CHROME.headerInsetSm : DIAGRAM_CHROME.headerInsetXs)
    : (isSmallSurface ? 10 : 16);

  const minHeaderBottom = metrics.isSmUp ? 48 : 40;
  const measuredHeaderBottom = Math.max(metrics.visibleHeaderContentBottom, minHeaderBottom);

  const viewportHeaderBottom = hasHeader
    ? Math.ceil(measuredHeaderBottom) + DIAGRAM_CHROME.headerGap
    : (useSideHeader ? sidePad : (isSmallSurface ? 8 : 12));

  const toolbarBottom = showToolbar
    ? Math.ceil(metrics.toolbarHeight) + DIAGRAM_CHROME.toolbarGapWithToolbar
    : (isSmallSurface ? 8 : headerInset);

  const useRails = Boolean(
    showToolbar
    && (metrics.rootWidth < DIAGRAM_CHROME.railsMinWidth || metrics.rootHeight < DIAGRAM_CHROME.railsMinHeight),
  );
  const panelExtra = (hasHeader && hasTopViewportPanel) ? DIAGRAM_CHROME.topViewportPanelExtra : 0;
  const sideLeft = sideChromeWidth + DIAGRAM_CHROME.headerGap;
  const edge = DIAGRAM_CHROME.railsEdgeInset;

  if (useSideHeader) {
    const right = useRails
      ? (showStepControls ? DIAGRAM_CHROME.railsControlInset : edge)
      : headerInset;
    const bottom = useRails ? edge : toolbarBottom;
    const viewportSafeArea: DiagramInsets = {
      top: viewportHeaderBottom,
      right,
      bottom,
      left: sidePad,
    };
    return {
      viewportSafeArea,
      safeArea: {
        top: edge,
        right,
        bottom,
        left: sideLeft,
      },
      toolbarLayout: useRails ? 'rails' : 'bar',
      headerLayout: 'side',
      sideChromeWidth,
      sidePad,
    };
  }

  const viewportSafeArea: DiagramInsets = {
    top: viewportHeaderBottom,
    right: headerInset,
    bottom: useRails ? edge : toolbarBottom,
    left: headerInset,
  };

  const safeArea: DiagramInsets = useRails
    ? {
      top: viewportHeaderBottom + panelExtra,
      right: showStepControls ? DIAGRAM_CHROME.railsControlInset : edge,
      bottom: edge,
      left: viewportControls ? DIAGRAM_CHROME.railsControlInset : edge,
    }
    : {
      ...viewportSafeArea,
      top: viewportHeaderBottom + panelExtra,
    };

  return {
    viewportSafeArea,
    safeArea,
    toolbarLayout: useRails ? 'rails' : 'bar',
    headerLayout: 'top',
    sideChromeWidth: 0,
    sidePad: 0,
  };
}
