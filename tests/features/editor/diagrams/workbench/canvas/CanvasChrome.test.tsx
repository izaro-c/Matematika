import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createTemplateModel } from '@/features/editor/diagrams/model';
import { CanvasChrome } from '@/features/editor/diagrams/ui/canvas/CanvasChrome';

function defaultProps(overrides: Record<string, unknown> = {}) {
  const model = createTemplateModel('lienzo-inicial', 'T', 'sandbox');
  return {
    model,
    activeTool: 'select' as const,
    pendingRefs: [] as string[],
    stepCount: 0,
    activeStepIndex: null,
    onCancelTool: vi.fn(),
    onChooseReferenceForTool: vi.fn(() => true),
    onCompleteTool: vi.fn(),
    onToggleGrid: vi.fn(),
    onToggleAxis: vi.fn(),
    onResetViewport: vi.fn(),
    ...overrides,
  };
}

describe('CanvasChrome', () => {
  it('hides tool dock when activeTool is select', () => {
    render(<CanvasChrome {...defaultProps()} />);
    expect(screen.queryByTitle('Cancelar herramienta')).toBeNull();
    expect(screen.queryByText(/Clic en el lienzo/)).toBeNull();
  });

  it('shows tool dock when activeTool is not select', () => {
    render(<CanvasChrome {...defaultProps({ activeTool: 'point' })} />);
    expect(screen.getByText(/Clic en el lienzo para colocar el punto/)).toBeTruthy();
    expect(screen.getByTitle('Cancelar herramienta')).toBeTruthy();
  });

  it('hides steps dock when stepCount is 0', () => {
    render(<CanvasChrome {...defaultProps()} />);
    expect(screen.queryByLabelText('Paso anterior')).toBeNull();
    expect(screen.queryByLabelText('Paso siguiente')).toBeNull();
  });

  it('shows steps dock when stepCount > 0', () => {
    const model = createTemplateModel('lienzo-inicial', 'T', 'sandbox');
    model.steps = [
      { id: 's1', label: 'Primer paso', description: '', visibleTargets: [], durationMs: 0 },
    ];
    render(
      <CanvasChrome
        {...defaultProps({ model, stepCount: 1, activeStepIndex: 0, onStepPrev: vi.fn(), onStepNext: vi.fn() })}
      />,
    );
    expect(screen.getByLabelText('Paso anterior')).toBeTruthy();
    expect(screen.getByLabelText('Paso siguiente')).toBeTruthy();
    expect(screen.getByText('Primer paso')).toBeTruthy();
  });

  it('always shows view dock with Rejilla, Ejes, and Centrar', () => {
    render(<CanvasChrome {...defaultProps()} />);
    expect(screen.getByRole('button', { name: 'Rejilla' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Ejes' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Centrar' })).toBeTruthy();
  });

  it('calls onResetViewport when Centrar is clicked', () => {
    const onResetViewport = vi.fn();
    render(<CanvasChrome {...defaultProps({ onResetViewport })} />);
    fireEvent.click(screen.getByRole('button', { name: 'Centrar' }));
    expect(onResetViewport).toHaveBeenCalledOnce();
  });
});
