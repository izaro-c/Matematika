import { describe, expect, it } from 'vitest';
import {
  computeDiagramSafeAreas,
  sameInsets,
  type DiagramChromeMetrics,
  type DiagramSafeAreaOptions,
} from '@/diagrams/render/interaction/diagramSafeArea';

const baseOptions: DiagramSafeAreaOptions = {
  showToolbar: true,
  showStepControls: true,
  viewportControls: true,
  hasTopViewportPanel: false,
};

function metrics(partial: Partial<DiagramChromeMetrics> = {}): DiagramChromeMetrics {
  return {
    rootWidth: 800,
    rootHeight: 600,
    visibleHeaderContentBottom: 120,
    headerHeight: 130,
    toolbarHeight: 56,
    isSmUp: true,
    ...partial,
  };
}

describe('computeDiagramSafeAreas', () => {
  it('uses bar layout with measured header/toolbar insets on a wide canvas', () => {
    const result = computeDiagramSafeAreas(metrics(), baseOptions);
    expect(result.toolbarLayout).toBe('bar');
    expect(result.viewportSafeArea).toEqual({ top: 130, right: 32, bottom: 64, left: 32 });
    // Geometry uses the full header box (stable), not the visible-content bottom.
    expect(result.safeArea).toEqual({ top: 140, right: 32, bottom: 64, left: 32 });
  });

  it('switches to rails when the canvas is narrow or short', () => {
    const narrow = computeDiagramSafeAreas(metrics({ rootWidth: 400 }), baseOptions);
    expect(narrow.toolbarLayout).toBe('rails');
    expect(narrow.viewportSafeArea.bottom).toBe(16);
    expect(narrow.safeArea).toEqual({
      top: 140,
      right: 52,
      bottom: 16,
      left: 52,
    });

    const short = computeDiagramSafeAreas(metrics({ rootHeight: 350 }), {
      ...baseOptions,
      showStepControls: false,
      viewportControls: false,
    });
    expect(short.toolbarLayout).toBe('rails');
    expect(short.safeArea.right).toBe(16);
    expect(short.safeArea.left).toBe(16);
  });

  it('reserves space for a top viewport panel in geometry insets', () => {
    const result = computeDiagramSafeAreas(metrics(), { ...baseOptions, hasTopViewportPanel: true });
    expect(result.safeArea.top).toBe(140 + 84);
    expect(result.viewportSafeArea.top).toBe(130);
  });

  it('sameInsets compares by value', () => {
    expect(sameInsets({ top: 1, right: 2, bottom: 3, left: 4 }, { top: 1, right: 2, bottom: 3, left: 4 })).toBe(true);
    expect(sameInsets({ top: 1, right: 2, bottom: 3, left: 4 }, { top: 1, right: 2, bottom: 3, left: 5 })).toBe(false);
  });
});
