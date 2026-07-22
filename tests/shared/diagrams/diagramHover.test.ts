import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  commitElementVisuals,
  createDiagramHoverController,
  DIAGRAM_HOVER_TRANSITION_MS,
  diagramVisualTransitionKey,
  shouldAnimateDiagramVisuals,
  withDiagramHoverTransition,
} from '../../../src/shared/diagrams/runtime/diagramHover';

describe('diagramHover', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds transition attributes and disables JSXGraph native highlight', () => {
    expect(withDiagramHoverTransition({ strokeWidth: 2 })).toMatchObject({
      highlight: false,
      transitionDuration: DIAGRAM_HOVER_TRANSITION_MS,
      strokeWidth: 2,
    });
    expect(withDiagramHoverTransition({ highlight: false, strokeWidth: 2 })).toMatchObject({
      highlight: false,
      strokeWidth: 2,
      transitionDuration: DIAGRAM_HOVER_TRANSITION_MS,
    });
  });

  it('tracks hover ids and requests updates only on changes', () => {
    const hover = createDiagramHoverController();
    const requestUpdate = vi.fn();

    hover.setHovered('segAB', true, requestUpdate);
    expect(hover.isHovered('segAB')).toBe(true);
    expect(requestUpdate).toHaveBeenCalledTimes(1);

    hover.setHovered('segAB', true, requestUpdate);
    expect(requestUpdate).toHaveBeenCalledTimes(1);

    hover.setHovered('segAB', false, requestUpdate);
    expect(hover.isHovered('segAB')).toBe(false);
    expect(requestUpdate).toHaveBeenCalledTimes(2);
  });

  it('clears all hovered ids', () => {
    const hover = createDiagramHoverController();
    const requestUpdate = vi.fn();
    hover.setHovered('a', true, () => undefined);
    hover.setHovered('b', true, () => undefined);
    hover.clearAll(requestUpdate);
    expect(hover.isHovered('a')).toBe(false);
    expect(hover.isHovered('b')).toBe(false);
    expect(requestUpdate).toHaveBeenCalledTimes(1);
  });

  it('builds stable transition keys without pulse amount', () => {
    expect(diagramVisualTransitionKey({
      hoverActive: true,
      externalActive: false,
      stepPrimary: false,
      stepSecondary: false,
      visible: true,
      dimmed: false,
    })).toBe('true|false|false|false|true|false');
  });

  it('animates only when the visual tier changes outside pulse frames', () => {
    const element = { __matematikaTransitionKey: 'false|false|false|false|true|false' };
    expect(shouldAnimateDiagramVisuals(element, 'true|false|false|false|true|false', false)).toBe(true);
    expect(shouldAnimateDiagramVisuals(element, 'false|false|false|false|true|false', false)).toBe(false);
    expect(shouldAnimateDiagramVisuals(element, 'true|false|false|false|true|false', true)).toBe(false);
    expect(shouldAnimateDiagramVisuals(undefined, 'true|false|false|false|true|false', false)).toBe(false);
    expect(shouldAnimateDiagramVisuals({}, 'true|false|false|false|true|false', false)).toBe(false);
  });

  it('does not animate step-driven visibility or emphasis changes', () => {
    const element = { __matematikaTransitionKey: 'false|false|false|false|true|false' };
    expect(shouldAnimateDiagramVisuals(element, 'false|false|true|false|true|false', false)).toBe(false);
    expect(shouldAnimateDiagramVisuals(element, 'false|false|false|false|false|false', false)).toBe(false);
    expect(shouldAnimateDiagramVisuals(element, 'false|true|false|false|true|false', false)).toBe(false);
  });

  it('uses CSS transitions via setAttribute and skips redundant commits', () => {
    const setAttribute = vi.fn();
    const fullUpdate = vi.fn();
    const element = { setAttribute, fullUpdate, __matematikaDisplayed: true, __matematikaVisualSignature: undefined };

    commitElementVisuals(element, { visible: true }, { size: 5, fillOpacity: 0.8 }, false);
    expect(setAttribute).toHaveBeenCalledTimes(1);

    setAttribute.mockClear();
    commitElementVisuals(element, { visible: true }, { size: 5, fillOpacity: 0.8 }, false);
    expect(setAttribute).not.toHaveBeenCalled();
  });

  it('falls back to immediate setAttribute when animation is disabled', () => {
    const setAttribute = vi.fn();
    const fullUpdate = vi.fn();
    const element = { setAttribute, fullUpdate };

    commitElementVisuals(element, { visible: true }, { strokeWidth: 3 }, false);
    expect(setAttribute).toHaveBeenCalledTimes(1);
    expect(setAttribute).toHaveBeenCalledWith({ visible: true, strokeWidth: 3 });
    expect(fullUpdate).not.toHaveBeenCalled();
  });

  it('fades out before hiding when visibility drops with animation', () => {
    vi.useFakeTimers();
    const setAttribute = vi.fn();
    const element = { setAttribute, __matematikaDisplayed: true };

    commitElementVisuals(
      element,
      { visible: false },
      { strokeOpacity: 0.8, fillOpacity: 0.2 },
      true,
    );

    expect(setAttribute).toHaveBeenCalledWith({
      visible: true,
      strokeOpacity: 0,
      fillOpacity: 0,
    });

    vi.advanceTimersByTime(DIAGRAM_HOVER_TRANSITION_MS + 24);
    expect(setAttribute).toHaveBeenLastCalledWith({ visible: false });
    expect(element.__matematikaDisplayed).toBe(false);
  });

  it('fades in when visibility returns with animation', () => {
    const setAttribute = vi.fn();
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return 1;
    });
    const element = { setAttribute, __matematikaDisplayed: false };

    commitElementVisuals(
      element,
      { visible: true },
      { strokeOpacity: 0.8, fillOpacity: 0.2 },
      true,
    );

    expect(setAttribute).toHaveBeenNthCalledWith(1, {
      visible: true,
      strokeOpacity: 0,
      fillOpacity: 0,
    });
    expect(setAttribute).toHaveBeenNthCalledWith(2, {
      visible: true,
      strokeOpacity: 0.8,
      fillOpacity: 0.2,
    });
    expect(element.__matematikaDisplayed).toBe(true);
    raf.mockRestore();
  });
});
