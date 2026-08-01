import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createTemplateModel } from '@/features/editor/diagrams/model';
import { BoardHost } from '@/features/editor/diagrams/ui/canvas/BoardHost';

const rendererState = vi.hoisted(() => ({ props: null as Record<string, unknown> | null }));

vi.mock('@/shared/diagrams/public', async importOriginal => {
  const actual = await importOriginal<typeof import('@/shared/diagrams/public')>();
  return {
    ...actual,
    DiagramRenderer: (props: Record<string, unknown>) => {
      rendererState.props = props;
      return (
        <div data-testid="mock-diagram-renderer">
          <button
            type="button"
            data-testid="trigger-create-point"
            onClick={() => (props.onCanvasPointCreate as ((x: number, y: number) => void) | undefined)?.(1.37, 2.63)}
          >
            Crear punto
          </button>
        </div>
      );
    },
  };
});

beforeEach(() => {
  rendererState.props = null;
  class RO {
    cb: ResizeObserverCallback;
    constructor(cb: ResizeObserverCallback) { this.cb = cb; }
    observe(target: Element) {
      this.cb([{
        target,
        contentRect: { width: 640, height: 400, top: 0, left: 0, bottom: 400, right: 640, x: 0, y: 0, toJSON: () => ({}) },
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      }] as ResizeObserverEntry[], this);
    }
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal('ResizeObserver', RO);
});

describe('BoardHost', () => {
  it('does not mount DiagramRenderer until host has size, then mounts with viewportControls false', () => {
    const model = createTemplateModel('lienzo-inicial', 'T', 'sandbox');
    render(
      <BoardHost
        model={model}
        selectedIds={[]}
        activeTool="select"
        pendingRefs={[]}
        onSelect={() => {}}
        onModelEdit={() => {}}
        onChooseReferenceForTool={() => false}
        onCompleteTool={() => {}}
      />,
    );
    expect(screen.getByTestId('mock-diagram-renderer')).toBeTruthy();
    expect(rendererState.props?.viewportControls).toBe(false);
    expect(rendererState.props?.stepControls).toBe(false);
    expect(rendererState.props?.mode).toBe('editor');
    expect(rendererState.props?.spec).toBe(model);
  });

  it('creates a snapped point when tool is point', () => {
    const model = createTemplateModel('lienzo-inicial', 'T', 'sandbox');
    const onModelEdit = vi.fn();
    const onSelect = vi.fn();
    const onCompleteTool = vi.fn();
    render(
      <BoardHost
        model={model}
        selectedIds={[]}
        activeTool="point"
        pendingRefs={[]}
        onSelect={onSelect}
        onModelEdit={onModelEdit}
        onChooseReferenceForTool={() => false}
        onCompleteTool={onCompleteTool}
      />,
    );
    fireEvent.click(screen.getByTestId('trigger-create-point'));
    expect(onModelEdit).toHaveBeenCalled();
    const next = onModelEdit.mock.calls[0][0];
    expect(next.points.some((p: { x: number; y: number }) => p.x === 1.5 && p.y === 2.5)).toBe(true);
    expect(onCompleteTool).toHaveBeenCalled();
  });
});
