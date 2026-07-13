import React from 'react';
import { act, render } from '@testing-library/react';
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

import { MathBoard } from '../../../src/shared/diagrams/core/MathBoard';

describe('MathBoard controlled viewport', () => {
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
