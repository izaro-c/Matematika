import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DiagramConfirmDialog } from '../../../../../src/features/editor/diagrams/ui/DiagramConfirmDialog';

describe('DiagramConfirmDialog', () => {
  it('no renderiza nada cuando está cerrado', () => {
    const { container } = render(
      <DiagramConfirmDialog
        isOpen={false}
        title="¿Eliminar pA?"
        message="Puede deshacer esta operación."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('muestra título, mensaje y acciones accesibles', () => {
    render(
      <DiagramConfirmDialog
        isOpen
        title="¿Eliminar pA?"
        message="También se eliminarán 2 dependiente(s): segAB, labelA."
        confirmLabel="Eliminar"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole('dialog', { name: '¿Eliminar pA?' })).toBeTruthy();
    expect(screen.getByText(/También se eliminarán 2 dependiente/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Eliminar' })).toBeTruthy();
  });

  it('notifica confirmación y cancelación', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <DiagramConfirmDialog
        isOpen
        title="¿Eliminar midOA?"
        message="Puede deshacer esta operación."
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
