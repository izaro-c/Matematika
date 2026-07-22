import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const handlers: Record<string, () => void> = {};
  const board = {
    on: vi.fn((event: string, handler: () => void) => { handlers[event] = handler; }),
    update: vi.fn(),
    getBoundingBox: vi.fn(() => [-2, 2, 2, -2]),
    setBoundingBox: vi.fn(),
    resizeContainer: vi.fn(),
    renderer: { container: { style: {} } },
  };
  return { handlers, board, freeBoard: vi.fn() };
});

vi.mock('jsxgraph', () => ({
  default: {
    JSXGraph: {
      initBoard: vi.fn(() => mocks.board),
      freeBoard: mocks.freeBoard,
    },
  },
}));

vi.mock('../../../src/shared/lib/MathStoreContext', () => ({
  useMathStore: (selector: (state: { variables: Record<string, unknown> }) => unknown) => selector({ variables: {} }),
}));

import {
  contentBoundsFromSafeArea,
  fitBoundsToAspect,
  fitBoundsToSafeArea,
  MathBoard,
} from '../../../src/shared/diagrams/core/MathBoard';

describe('MathBoard controlled viewport', () => {
  it('expands the short viewport axis so wide and tall canvases contain the full mathematical scene', () => {
    expect(fitBoundsToAspect([-4, 8.5, 9, -8.5], 699, 484)).toEqual([
      -9.775826446280991,
      8.5,
      14.775826446280991,
      -8.5,
    ]);
    expect(fitBoundsToAspect([-4, 4, 4, -4], 320, 640)).toEqual([-4, 8, 4, -8]);
  });

  it('maps geometry into the area left free by diagram headers and controls', () => {
    const display = fitBoundsToSafeArea([-4, 4, 4, -4], 400, 400, { top: 100, right: 20, bottom: 50, left: 20 });
    expect(display[0]).toBeCloseTo(-6.4);
    expect(display[1]).toBeCloseTo(7.2);
    expect(display[2]).toBeCloseTo(6.4);
    expect(display[3]).toBeCloseTo(-5.6);
    const content = contentBoundsFromSafeArea(display, 400, 400, { top: 100, right: 20, bottom: 50, left: 20 });
    expect(content[0]).toBeCloseTo(-5.76);
    expect(content[1]).toBeCloseTo(4);
    expect(content[2]).toBeCloseTo(5.76);
    expect(content[3]).toBeCloseTo(-4);
  });

  it('names the interactive region and exposes keyboard instructions', () => {
    render(<MathBoard onInit={vi.fn()} ariaLabel="Construcción de prueba" />);

    const board = screen.getByRole('region', { name: 'Construcción de prueba' });
    expect(board.getAttribute('tabindex')).toBe('0');
    expect(screen.getByText(/Use Tab para recorrer/).classList.contains('sr-only')).toBe(true);
  });

  it('re-asserts the controlled viewport after programmatic board updates', () => {
    const onUpdate = vi.fn();
    render(<MathBoard boundingbox={[-2, 2, 2, -2]} onInit={vi.fn()} onUpdate={onUpdate} />);
    mocks.board.getBoundingBox.mockReturnValue([-20, 20, 20, -20]);
    mocks.board.setBoundingBox.mockClear();
    act(() => { mocks.handlers.update(); });
    expect(mocks.board.setBoundingBox).toHaveBeenCalled();
    const lastCall = mocks.board.setBoundingBox.mock.calls.at(-1)?.[0];
    expect(lastCall?.[0]).toBeCloseTo(-2, 0);
    expect(lastCall?.[2]).toBeCloseTo(2, 0);
  });

  it('reports the JSXGraph boundingbox event used by pan and wheel zoom', () => {
    const onBoundingBoxChange = vi.fn();
    render(<MathBoard onInit={vi.fn()} onBoundingBoxChange={onBoundingBoxChange} pan zoom />);
    expect(mocks.handlers.boundingbox).toBeTypeOf('function');
    expect(onBoundingBoxChange).not.toHaveBeenCalled();
    mocks.board.getBoundingBox.mockReturnValueOnce([-3, 2, 3, -2]);
    act(() => mocks.handlers.boundingbox());
    expect(onBoundingBoxChange).toHaveBeenCalledWith([-3, 2, 3, -2]);
  });
});
