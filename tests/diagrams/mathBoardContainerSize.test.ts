import { describe, expect, it, vi } from 'vitest';
import {
  readLayoutBoxSize,
  syncBoardToContainerSize,
} from '@/diagrams/jsxgraph/mathBoardContainerSize';

describe('syncBoardToContainerSize', () => {
  it('resizes the canvas buffer without locking CSS pixel dimensions', () => {
    const style = { width: '320px', height: '240px' };
    const containerEl = { style } as unknown as HTMLElement;
    const resizeContainer = vi.fn();

    expect(syncBoardToContainerSize({ resizeContainer }, 640, 480, containerEl)).toBe(true);

    // dontset + dontSetBoundingBox: CSS stays layout-driven; MathBoard owns the bbox.
    expect(resizeContainer).toHaveBeenCalledWith(640, 480, true, true);
    expect(style.width).toBe('');
    expect(style.height).toBe('');
  });

  it('ignores degenerate boxes so a collapsed layout cannot ratchet the board down', () => {
    const resizeContainer = vi.fn();
    expect(syncBoardToContainerSize({ resizeContainer }, 0, 480)).toBe(false);
    expect(syncBoardToContainerSize({ resizeContainer }, 640, 2)).toBe(false);
    expect(resizeContainer).not.toHaveBeenCalled();
  });

  it('can grow again after a shrink because CSS is never pinned to the smaller size', () => {
    const style = { width: '', height: '' };
    const containerEl = { style } as unknown as HTMLElement;
    const resizeContainer = vi.fn();
    const board = { resizeContainer };

    syncBoardToContainerSize(board, 400, 300, containerEl);
    syncBoardToContainerSize(board, 800, 600, containerEl);

    expect(resizeContainer).toHaveBeenNthCalledWith(1, 400, 300, true, true);
    expect(resizeContainer).toHaveBeenNthCalledWith(2, 800, 600, true, true);
    expect(style.width).toBe('');
    expect(style.height).toBe('');
  });
});

describe('readLayoutBoxSize', () => {
  it('prefers the ResizeObserver content box over a stale client box', () => {
    expect(readLayoutBoxSize(
      { contentRect: { width: 800, height: 600 } },
      { clientWidth: 400, clientHeight: 300 },
    )).toEqual({ width: 800, height: 600 });
  });

  it('falls back to the element when no observer entry is available', () => {
    expect(readLayoutBoxSize(null, { clientWidth: 640, clientHeight: 480 }))
      .toEqual({ width: 640, height: 480 });
  });
});
