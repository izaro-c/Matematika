/** Minimum interval between pulse-driven board updates (milliseconds). */
export const STEP_EMPHASIS_PULSE_FRAME_MS = 32;

/** Full pulse cycle duration for primary step emphasis (milliseconds). */
export const STEP_EMPHASIS_PULSE_PERIOD_MS = 2000;

/** Peak additive stroke width for animated primary emphasis. */
export const STEP_EMPHASIS_STROKE_DELTA = 2;

/** Peak additive fill opacity for animated primary emphasis. */
export const STEP_EMPHASIS_FILL_DELTA = 0.2;

/** Peak additive point size for animated primary emphasis. */
export const STEP_EMPHASIS_POINT_DELTA = 1;

/** Peak additive stroke opacity for animated primary emphasis. */
export const STEP_EMPHASIS_STROKE_OPACITY_DELTA = 0.4;

/** Peak additive scene opacity for animated primary text emphasis. */
export const STEP_EMPHASIS_TEXT_OPACITY_DELTA = 0.22;

/** Peak additive angle radius for animated primary emphasis. */
export const STEP_EMPHASIS_ANGLE_RADIUS_DELTA = 0.08;

/** Multiplicative growth for geometric marks (congruence, parallel arrows). */
export const STEP_EMPHASIS_MARK_SCALE_DELTA = 0.55;

/** Peak additive tick height for ruler graduations (pixels). */
export const STEP_EMPHASIS_TICK_HEIGHT_DELTA = 10;

/** Peak additive font size for annotations and dimension labels. */
export const STEP_EMPHASIS_FONT_SIZE_DELTA = 5;

/** Peak additive fill opacity for emphasized points. */
export const STEP_EMPHASIS_POINT_FILL_DELTA = 0.35;

/** Default font size when pulsing annotations without an explicit label size. */
export const STEP_EMPHASIS_DEFAULT_FONT_SIZE = 16;

/** Static pulse amount when motion is reduced (mid-high emphasis, no animation). */
export const STEP_EMPHASIS_STATIC_PULSE_AMOUNT = 0.65;

export interface StepEmphasisVisualState {
  hoverActive: boolean;
  externalActive: boolean;
  stepPrimary: boolean;
  stepSecondary: boolean;
  active: boolean;
  pulseAmount: number;
}

export interface StepEmphasisMetricDefaults {
  normal?: number;
  primary?: number;
  highlight?: number;
  secondary?: number;
}

export interface StepEmphasisStyle {
  strokeWidth?: number;
  strokeOpacity?: number;
  fillOpacity?: number;
  highlightStrokeWidth?: number;
  highlightFillOpacity?: number;
  highlightPointSize?: number;
  pointSize?: number;
  angleRadius?: number;
  markHeight?: number;
  labelSize?: number;
}

export function resolveStepEmphasisStrokeWidth(
  style: StepEmphasisStyle | undefined,
  state: StepEmphasisVisualState,
  defaults: StepEmphasisMetricDefaults = {},
): number {
  const normal = style?.strokeWidth ?? defaults.normal ?? 2;
  const highlight = style?.highlightStrokeWidth ?? defaults.highlight ?? 3.6;
  const primary = style?.highlightStrokeWidth ?? defaults.primary ?? 3.2;
  if (state.externalActive || state.hoverActive || state.stepSecondary) return highlight;
  if (state.stepPrimary) return pulsedPrimaryValue(primary, STEP_EMPHASIS_STROKE_DELTA, state.pulseAmount);
  return normal;
}

export function resolveStepEmphasisFillOpacity(
  style: StepEmphasisStyle | undefined,
  state: StepEmphasisVisualState,
  sceneOpacity: number,
  defaults: { normal?: number; highlight?: number } = {},
): number {
  const normal = (style?.fillOpacity ?? defaults.normal ?? 0.1) * sceneOpacity;
  const highlight = style?.highlightFillOpacity ?? defaults.highlight ?? 0.24;
  if (state.externalActive || state.hoverActive) return highlight;
  if (state.stepPrimary) return pulsedPrimaryValue(highlight, STEP_EMPHASIS_FILL_DELTA, state.pulseAmount);
  if (state.active) return highlight;
  return normal;
}

export function resolveStepEmphasisPointSize(
  style: StepEmphasisStyle | undefined,
  state: StepEmphasisVisualState,
): number {
  const normal = style?.pointSize ?? 4;
  const highlight = style?.highlightPointSize ?? 10;
  if (state.stepPrimary) return pulsedPrimaryValue(highlight, STEP_EMPHASIS_POINT_DELTA, state.pulseAmount);
  if (state.active || state.hoverActive) return highlight;
  return normal;
}

export function resolveStepEmphasisAngleRadius(
  style: StepEmphasisStyle | undefined,
  state: StepEmphasisVisualState,
  defaultRadius: number,
): number {
  const base = style?.angleRadius ?? defaultRadius;
  if (state.stepPrimary) return pulsedPrimaryValue(base, STEP_EMPHASIS_ANGLE_RADIUS_DELTA, state.pulseAmount);
  if (state.active) return base;
  return base;
}

export function resolveStepEmphasisStrokeOpacity(
  style: StepEmphasisStyle | undefined,
  state: StepEmphasisVisualState,
  sceneOpacity: number,
): number {
  const dimmed = (style?.strokeOpacity ?? 1) * sceneOpacity;
  if (state.externalActive || state.hoverActive) return style?.strokeOpacity ?? 1;
  if (state.stepPrimary) {
    return pulsedPrimaryValue(style?.strokeOpacity ?? 1, STEP_EMPHASIS_STROKE_OPACITY_DELTA, state.pulseAmount);
  }
  if (state.active) return style?.strokeOpacity ?? 1;
  return dimmed;
}

export function resolveStepEmphasisSceneOpacity(
  state: StepEmphasisVisualState,
  sceneOpacity: number,
): number {
  if (state.externalActive || state.hoverActive) return 1;
  if (state.stepPrimary) return pulsedPrimaryValue(1, STEP_EMPHASIS_TEXT_OPACITY_DELTA, state.pulseAmount);
  if (state.active) return 1;
  return sceneOpacity;
}

export function applyPolygonBorderEmphasis(
  element: {
    setAttribute?: (attrs: Record<string, unknown>) => void;
    borders?: Array<{ setAttribute?: (attrs: Record<string, unknown>) => void }>;
  },
  borderAttrs: Record<string, unknown>,
) {
  element.setAttribute?.({ borders: borderAttrs });
  element.borders?.forEach(border => border.setAttribute?.(borderAttrs));
}

export function buildLineEmphasisAttributes(
  color: string,
  style: StepEmphasisStyle | undefined,
  state: StepEmphasisVisualState,
  sceneOpacity: number,
  defaults?: StepEmphasisMetricDefaults,
) {
  return {
    strokeColor: color,
    strokeWidth: resolveStepEmphasisStrokeWidth(style, state, defaults),
    strokeOpacity: resolveStepEmphasisStrokeOpacity(style, state, sceneOpacity),
  };
}

export function buildPolygonEmphasisAttributes(
  color: string,
  style: StepEmphasisStyle | undefined,
  state: StepEmphasisVisualState,
  sceneOpacity: number,
  defaults: {
    fill?: { normal?: number; highlight?: number };
    stroke?: StepEmphasisMetricDefaults;
  } = {},
) {
  const fillOpacity = resolveStepEmphasisFillOpacity(style, state, sceneOpacity, defaults.fill);
  const borderAttrs = {
    strokeColor: color,
    strokeWidth: resolveStepEmphasisStrokeWidth(style, state, {
      normal: defaults.stroke?.normal ?? 1.5,
      primary: defaults.stroke?.primary ?? 2.4,
      highlight: defaults.stroke?.highlight ?? 3.2,
      secondary: defaults.stroke?.secondary ?? 2,
    }),
    strokeOpacity: resolveStepEmphasisStrokeOpacity(style, state, sceneOpacity),
  };
  return {
    fillColor: color,
    fillOpacity,
    borders: borderAttrs,
    borderAttrs,
  };
}

export function stepEmphasisPulseAmount(phaseRadians: number): number {
  return 0.5 + 0.5 * Math.sin(phaseRadians);
}

export function pulsedPrimaryValue(base: number, delta: number, pulseAmount: number): number {
  return base + delta * pulseAmount;
}

export function pulsedPrimaryScale(base: number, scaleDelta: number, pulseAmount: number): number {
  return base * (1 + scaleDelta * pulseAmount);
}

export function syncMarkLayoutEmphasis(
  element: { __matematikaMarkLayout?: { markHeight: number } },
  style: StepEmphasisStyle | undefined,
  state: StepEmphasisVisualState,
  defaultHeight: number,
) {
  if (!element.__matematikaMarkLayout) return;
  const base = style?.markHeight ?? defaultHeight;
  element.__matematikaMarkLayout.markHeight = state.stepPrimary
    ? pulsedPrimaryScale(base, STEP_EMPHASIS_MARK_SCALE_DELTA, state.pulseAmount)
    : base;
}

export function resolveStepEmphasisTickHeights(
  style: StepEmphasisStyle | undefined,
  state: StepEmphasisVisualState,
  defaultMajor = 10,
): { majorHeight: number; minorHeight: number } {
  const base = style?.markHeight ?? defaultMajor;
  const majorHeight = state.stepPrimary
    ? pulsedPrimaryValue(base, STEP_EMPHASIS_TICK_HEIGHT_DELTA, state.pulseAmount)
    : base;
  return {
    majorHeight,
    minorHeight: Math.max(1, majorHeight * 0.4),
  };
}

export function resolveStepEmphasisFontSize(
  style: StepEmphasisStyle | undefined,
  state: StepEmphasisVisualState,
  defaultSize = STEP_EMPHASIS_DEFAULT_FONT_SIZE,
): number {
  const base = style?.labelSize ?? defaultSize;
  if (state.stepPrimary) return pulsedPrimaryValue(base, STEP_EMPHASIS_FONT_SIZE_DELTA, state.pulseAmount);
  if (state.active) return base;
  return base;
}

export function resolveStepEmphasisPointFillOpacity(
  sceneOpacity: number,
  state: StepEmphasisVisualState,
): number {
  if (state.stepPrimary) return pulsedPrimaryValue(sceneOpacity, STEP_EMPHASIS_POINT_FILL_DELTA, state.pulseAmount);
  return sceneOpacity;
}

export function buildMarkEmphasisAttributes(
  color: string,
  style: StepEmphasisStyle | undefined,
  state: StepEmphasisVisualState,
  sceneOpacity: number,
) {
  return buildLineEmphasisAttributes(color, style, state, sceneOpacity, {
    normal: 2,
    primary: 3.6,
    highlight: 4.4,
    secondary: 2.8,
  });
}

export function prefersReducedStepEmphasisMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface StepEmphasisAnimationController {
  setBoard: (board: { update?: () => void } | null) => void;
  setOnPulse: (handler: (() => void) | null) => void;
  setActive: (active: boolean) => void;
  getPulseAmount: () => number;
  dispose: () => void;
}

export function createStepEmphasisAnimation(): StepEmphasisAnimationController {
  let board: { update?: () => void } | null = null;
  let onPulse: (() => void) | null = null;
  let active = false;
  let phase = -Math.PI / 2;
  let frameId: number | null = null;
  let lastTimestamp = 0;
  let lastPulseTimestamp = 0;

  const cancelFrame = () => {
    if (frameId !== null && typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
      window.cancelAnimationFrame(frameId);
    }
    frameId = null;
    lastTimestamp = 0;
    lastPulseTimestamp = 0;
  };

  const tick = (timestamp: number) => {
    frameId = null;
    if (!active || !board?.update) return;
    if (!prefersReducedStepEmphasisMotion()) {
      const delta = lastTimestamp > 0 ? timestamp - lastTimestamp : 0;
      lastTimestamp = timestamp;
      phase += (delta / STEP_EMPHASIS_PULSE_PERIOD_MS) * Math.PI * 2;
      const sinceLastPulse = lastPulseTimestamp > 0 ? timestamp - lastPulseTimestamp : STEP_EMPHASIS_PULSE_FRAME_MS;
      if (sinceLastPulse >= STEP_EMPHASIS_PULSE_FRAME_MS) {
        lastPulseTimestamp = timestamp;
        if (onPulse) {
          onPulse();
        } else {
          board.update();
        }
      }
    }
    if (active && typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      frameId = window.requestAnimationFrame(tick);
    }
  };

  const schedule = () => {
    if (frameId !== null || typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') return;
    frameId = window.requestAnimationFrame(tick);
  };

  return {
    setBoard(nextBoard) {
      board = nextBoard;
    },
    setOnPulse(handler) {
      onPulse = handler;
    },
    setActive(nextActive) {
      if (active === nextActive) return;
      active = nextActive;
      if (!active) {
        cancelFrame();
        phase = -Math.PI / 2;
        return;
      }
      schedule();
    },
    getPulseAmount() {
      if (prefersReducedStepEmphasisMotion()) return STEP_EMPHASIS_STATIC_PULSE_AMOUNT;
      return stepEmphasisPulseAmount(phase);
    },
    dispose() {
      active = false;
      cancelFrame();
      board = null;
      onPulse = null;
      phase = -Math.PI / 2;
    },
  };
}
