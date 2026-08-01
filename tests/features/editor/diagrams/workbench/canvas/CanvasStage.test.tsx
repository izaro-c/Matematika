import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createTemplateModel } from '@/fixed-pages/editor/diagrams/model';
import { CanvasStage } from '@/fixed-pages/editor/diagrams/ui/canvas/CanvasStage';
import { publicationContentSize } from '@/fixed-pages/editor/diagrams/ui/canvas/canvasFrameMode';

vi.mock('@/diagrams/public', async importOriginal => {
  const actual = await importOriginal<typeof import('@/diagrams/public')>();
  return {
    ...actual,
    DiagramRenderer: () => <div data-testid="mock-diagram-renderer" />,
  };
});

beforeEach(() => {
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

function defaultProps(overrides: Record<string, unknown> = {}) {
  const model = createTemplateModel('lienzo-inicial', 'T', 'sandbox');
  return {
    model,
    selectedIds: [] as string[],
    activeTool: 'select' as const,
    pendingRefs: [] as string[],
    frameMode: 'editor' as const,
    onSelect: vi.fn(),
    onModelEdit: vi.fn(),
    onChooseReferenceForTool: vi.fn(() => true),
    onCompleteTool: vi.fn(),
    onCancelTool: vi.fn(),
    onResetViewport: vi.fn(),
    onToggleGrid: vi.fn(),
    onToggleAxis: vi.fn(),
    ...overrides,
  };
}

describe('CanvasStage', () => {
  it('shows empty state when model is null', () => {
    render(<CanvasStage {...defaultProps({ model: null })} />);
    expect(screen.getByText(/Cargando lienzo/i)).toBeTruthy();
    expect(screen.queryByTestId('workshop-surface')).toBeNull();
  });

  it('renders workshop surface with the board host and no publication frame in editor mode', () => {
    render(<CanvasStage {...defaultProps({ frameMode: 'editor' })} />);
    expect(screen.getByTestId('workshop-surface')).toBeTruthy();
    expect(screen.getByTestId('mock-diagram-renderer')).toBeTruthy();
    expect(screen.queryByTestId('publication-diagram-slot')).toBeNull();
  });

  it('renders a publication frame sized to device content in tablet mode', () => {
    render(<CanvasStage {...defaultProps({ frameMode: 'tablet' })} />);
    const slot = screen.getByTestId('publication-diagram-slot');
    const content = publicationContentSize('tablet');
    expect(slot.style.width).toBe(`${content.width}px`);
    expect(slot.style.height).toBe(`${content.height}px`);
    expect(screen.getByTestId('mock-diagram-renderer')).toBeTruthy();
  });

  it('renders the view dock (Rejilla/Ejes/Centrar) as overlay chrome', () => {
    render(<CanvasStage {...defaultProps()} />);
    expect(screen.getByRole('button', { name: 'Rejilla' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Ejes' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Centrar' })).toBeTruthy();
  });
});
