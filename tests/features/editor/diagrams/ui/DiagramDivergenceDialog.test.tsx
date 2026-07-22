import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createTemplateModel } from '../../../../../src/features/editor/diagrams/model';
import { DiagramDivergenceDialog } from '../../../../../src/features/editor/diagrams/ui/DiagramDivergenceDialog';

vi.mock('../../../../../src/features/editor/diagrams/ui/DiagramResponsivePreview', () => ({
  DiagramResponsivePreview: () => <div data-testid="visual-divergence-preview">Vista visual</div>,
}));

describe('DiagramDivergenceDialog', () => {
  const model = createTemplateModel('circunferencia', 'Divergencia', 'definicion');
  const source = 'export const Divergencia = () => <svg data-source="edited" />;\n';

  it('muestra previsualizaciones del modelo visual y del código fuente', () => {
    render(
      <DiagramDivergenceDialog
        isOpen
        model={model}
        source={source}
        onResolve={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'Resolver divergencia' })).toBeTruthy();
    expect(screen.getByLabelText('Código fuente actual')).toBeTruthy();
    expect((screen.getByLabelText('Código fuente actual') as HTMLTextAreaElement).value).toBe(source);
  });

  it('resuelve la divergencia hacia visual o código', () => {
    const onResolve = vi.fn();
    const onClose = vi.fn();
    render(
      <DiagramDivergenceDialog
        isOpen
        model={model}
        source={source}
        onResolve={onResolve}
        onClose={onClose}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Usar modelo visual' }));
    expect(onResolve).toHaveBeenCalledWith('visual');

    fireEvent.click(screen.getByRole('button', { name: 'Usar código fuente' }));
    expect(onResolve).toHaveBeenCalledWith('source');

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
