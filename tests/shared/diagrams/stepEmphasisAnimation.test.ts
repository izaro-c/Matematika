import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createStepEmphasisAnimation,
  pulsedPrimaryScale,
  pulsedPrimaryValue,
  resolveStepEmphasisAngleRadius,
  resolveStepEmphasisStrokeWidth,
  resolveStepEmphasisTickHeights,
  stepEmphasisPulseAmount,
  syncMarkLayoutEmphasis,
  STEP_EMPHASIS_ANGLE_RADIUS_DELTA,
  STEP_EMPHASIS_FILL_DELTA,
  STEP_EMPHASIS_MARK_SCALE_DELTA,
  STEP_EMPHASIS_POINT_DELTA,
  STEP_EMPHASIS_STATIC_PULSE_AMOUNT,
  STEP_EMPHASIS_STROKE_DELTA,
  STEP_EMPHASIS_TICK_HEIGHT_DELTA,
  type StepEmphasisVisualState,
} from '../../../src/shared/diagrams/runtime/stepEmphasisAnimation';
import { DEFAULT_ANGLE_RADIUS } from '../../../src/shared/diagrams/spec';

const primaryState = (pulseAmount = 0): StepEmphasisVisualState => ({
  hoverActive: false,
  externalActive: false,
  stepPrimary: true,
  stepSecondary: false,
  active: true,
  pulseAmount,
});

const secondaryState: StepEmphasisVisualState = {
  hoverActive: false,
  externalActive: false,
  stepPrimary: false,
  stepSecondary: true,
  active: true,
  pulseAmount: 0,
};

describe('stepEmphasisAnimation', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('maps phase to a normalized pulse amount', () => {
    expect(stepEmphasisPulseAmount(-Math.PI / 2)).toBeCloseTo(0, 5);
    expect(stepEmphasisPulseAmount(Math.PI / 2)).toBeCloseTo(1, 5);
    expect(stepEmphasisPulseAmount(0)).toBeCloseTo(0.5, 5);
  });

  it('adds pulse delta to the base emphasis value', () => {
    expect(pulsedPrimaryValue(3.2, STEP_EMPHASIS_STROKE_DELTA, 0)).toBe(3.2);
    expect(pulsedPrimaryValue(3.2, STEP_EMPHASIS_STROKE_DELTA, 1)).toBeCloseTo(5.2, 5);
    expect(pulsedPrimaryValue(10, STEP_EMPHASIS_POINT_DELTA, 1)).toBeCloseTo(11, 5);
    expect(pulsedPrimaryValue(0.24, STEP_EMPHASIS_FILL_DELTA, 1)).toBeCloseTo(0.44, 5);
  });

  it('pulses stroke width for primary emphasis on line-like elements', () => {
    expect(resolveStepEmphasisStrokeWidth(undefined, primaryState(0))).toBe(3.2);
    expect(resolveStepEmphasisStrokeWidth(undefined, primaryState(1))).toBeCloseTo(5.2, 5);
    expect(resolveStepEmphasisStrokeWidth({ strokeWidth: 2.4, highlightStrokeWidth: 4 }, primaryState(1))).toBeCloseTo(6, 5);
  });

  it('uses the configured highlight stroke width for secondary emphasis, like hover', () => {
    expect(resolveStepEmphasisStrokeWidth(undefined, secondaryState)).toBe(3.6);
    expect(resolveStepEmphasisStrokeWidth({ strokeWidth: 2.4, highlightStrokeWidth: 4.8 }, secondaryState)).toBe(4.8);
  });

  it('pulses angle radius for primary emphasis', () => {
    expect(resolveStepEmphasisAngleRadius(undefined, primaryState(0), DEFAULT_ANGLE_RADIUS)).toBe(DEFAULT_ANGLE_RADIUS);
    expect(resolveStepEmphasisAngleRadius(undefined, primaryState(1), DEFAULT_ANGLE_RADIUS))
      .toBeCloseTo(DEFAULT_ANGLE_RADIUS + STEP_EMPHASIS_ANGLE_RADIUS_DELTA, 5);
  });

  it('scales geometric mark height and tick heights for primary emphasis', () => {
    expect(pulsedPrimaryScale(0.4, STEP_EMPHASIS_MARK_SCALE_DELTA, 1)).toBeCloseTo(0.62, 5);
    const element = { __matematikaMarkLayout: { markHeight: 0.4 } };
    syncMarkLayoutEmphasis(element, { markHeight: 0.4 }, primaryState(1), 0.32);
    expect(element.__matematikaMarkLayout.markHeight).toBeCloseTo(0.62, 5);
    expect(resolveStepEmphasisTickHeights({ markHeight: 12 }, primaryState(1))).toEqual({
      majorHeight: 12 + STEP_EMPHASIS_TICK_HEIGHT_DELTA,
      minorHeight: (12 + STEP_EMPHASIS_TICK_HEIGHT_DELTA) * 0.4,
    });
  });

  it('starts inactive with zero pulse and requests animation frames when activated', () => {
    const update = vi.fn();
    const rafCallbacks: FrameRequestCallback[] = [];
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      rafCallbacks.push(callback);
      return rafCallbacks.length;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList);

    const animation = createStepEmphasisAnimation();
    animation.setBoard({ update });
    expect(animation.getPulseAmount()).toBeCloseTo(0, 5);

    animation.setActive(true);
    expect(window.requestAnimationFrame).toHaveBeenCalled();
    expect(rafCallbacks).toHaveLength(1);

    rafCallbacks[0]?.(0);
    expect(update).toHaveBeenCalled();
    expect(rafCallbacks.length).toBeGreaterThan(1);

    animation.dispose();
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('uses a static pulse amount when reduced motion is requested', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList);

    const animation = createStepEmphasisAnimation();
    animation.setActive(true);
    expect(animation.getPulseAmount()).toBe(STEP_EMPHASIS_STATIC_PULSE_AMOUNT);
    animation.dispose();
  });
});
