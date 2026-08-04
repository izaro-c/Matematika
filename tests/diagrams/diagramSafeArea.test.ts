import { describe, expect, it } from 'vitest';
import {
  computeDiagramSafeAreas,
  preferSideHeader,
  sameInsets,
  sideChromeWidthPx,
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
    expect(result.headerLayout).toBe('top');
    expect(result.sideChromeWidth).toBe(0);
    expect(result.viewportSafeArea).toEqual({ top: 130, right: 32, bottom: 64, left: 32 });
    expect(result.safeArea).toEqual({ top: 130, right: 32, bottom: 64, left: 32 });
  });

  it('switches to rails when the canvas is narrow or short', () => {
    const narrow = computeDiagramSafeAreas(metrics({ rootWidth: 400 }), baseOptions);
    expect(narrow.toolbarLayout).toBe('rails');
    expect(narrow.headerLayout).toBe('top');
    expect(narrow.viewportSafeArea.bottom).toBe(16);
    expect(narrow.safeArea).toEqual({
      top: 130,
      right: 52,
      bottom: 16,
      left: 52,
    });

    const short = computeDiagramSafeAreas(metrics({ rootWidth: 450, rootHeight: 350 }), {
      ...baseOptions,
      showStepControls: false,
      viewportControls: false,
    });
    expect(short.toolbarLayout).toBe('rails');
    expect(short.headerLayout).toBe('top');
    expect(short.safeArea.right).toBe(16);
    expect(short.safeArea.left).toBe(16);
  });

  it('moves header to a left column on wide short boards', () => {
    // Tablet-landscape sticky diagram: wide and short.
    const result = computeDiagramSafeAreas(
      metrics({ rootWidth: 900, rootHeight: 280, visibleHeaderContentBottom: 120, headerHeight: 130 }),
      baseOptions,
    );
    expect(preferSideHeader(900, 280)).toBe(true);
    expect(result.headerLayout).toBe('side');
    expect(result.toolbarLayout).toBe('rails');
    expect(result.sideChromeWidth).toBe(sideChromeWidthPx(900));
    // Geometry clears the title strip; overlays/buttons share that column.
    expect(result.safeArea.left).toBe(result.sideChromeWidth + 10);
    expect(result.safeArea.top).toBe(16);
    expect(result.viewportSafeArea.top).toBe(130);
    expect(result.viewportSafeArea.left).toBe(16);
    expect(result.sidePad).toBe(16);
  });

  it('scales the side column with diagram width', () => {
    const narrow = sideChromeWidthPx(600);
    const wide = sideChromeWidthPx(1200);
    expect(narrow).toBe(Math.round(600 * 0.36));
    expect(wide).toBe(Math.round(1200 * 0.36));
    expect(wide).toBeGreaterThan(narrow);
  });

  it('keeps top header on tall portrait diagram columns', () => {
    const result = computeDiagramSafeAreas(metrics({ rootWidth: 720, rootHeight: 900 }), baseOptions);
    expect(result.headerLayout).toBe('top');
    expect(result.sideChromeWidth).toBe(0);
  });

  it('skips side header when hasHeader is false', () => {
    const result = computeDiagramSafeAreas(
      metrics({ rootWidth: 900, rootHeight: 280 }),
      { ...baseOptions, hasHeader: false },
    );
    expect(result.headerLayout).toBe('top');
    expect(result.sideChromeWidth).toBe(0);
  });

  it('reserves space for a top viewport panel in geometry insets', () => {
    const result = computeDiagramSafeAreas(metrics(), { ...baseOptions, hasTopViewportPanel: true });
    expect(result.safeArea.top).toBe(130 + 42);
    expect(result.viewportSafeArea.top).toBe(130);
  });

  it('sameInsets compares by value', () => {
    expect(sameInsets({ top: 1, right: 2, bottom: 3, left: 4 }, { top: 1, right: 2, bottom: 3, left: 4 })).toBe(true);
    expect(sameInsets({ top: 1, right: 2, bottom: 3, left: 4 }, { top: 1, right: 2, bottom: 3, left: 5 })).toBe(false);
  });
});
