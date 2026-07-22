import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createTemplateModel } from '../../../../src/features/editor/diagrams/model';
import { DiagramToolbar } from '../../../../src/features/editor/diagrams/ui/DiagramToolbar';

vi.mock('../../../../src/features/editor/diagrams/ui/DiagramResponsivePreview', () => ({
  DiagramResponsivePreview: () => <div data-testid="visual-divergence-preview">Vista visual</div>,
}));

describe('DiagramToolbar divergence banner', () => {
  const baseProps = {
    model: createTemplateModel('circunferencia', 'Divergencia', 'definicion'),
    canvasTool: 'select' as const,
    currentSource: 'export const Divergencia = () => <svg data-source="edited" />;\n',
    onSetCanvasTool: vi.fn(),
    onAddElement: vi.fn(),
    onModelEdit: vi.fn(),
    onAddSlider: vi.fn(),
    onAddGliderPoint: vi.fn(),
    onResolveDivergence: vi.fn(),
  };

  it('does not show the divergence banner when the diagram is synced', () => {
    render(<DiagramToolbar {...baseProps} syncStatus="synced" />);

    expect(screen.queryByText(/DIVERGENCIA DETECTADA/)).toBeNull();
    expect(screen.queryByRole('button', { name: /Resolver divergencia/i })).toBeNull();
  });

  it('opens the divergence dialog and resolves to visual or source authority', () => {
    const onResolveDivergence = vi.fn();
    render(
      <DiagramToolbar
        {...baseProps}
        syncStatus="diverged"
        onResolveDivergence={onResolveDivergence}
      />,
    );

    expect(screen.getByText(/DIVERGENCIA DETECTADA/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Resolver divergencia/i }));
    expect(screen.getByRole('dialog', { name: 'Resolver divergencia' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Usar modelo visual' }));
    expect(onResolveDivergence).toHaveBeenCalledWith('visual');

    fireEvent.click(screen.getByRole('button', { name: /Resolver divergencia/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Usar código fuente' }));
    expect(onResolveDivergence).toHaveBeenCalledWith('source');
  });
});
