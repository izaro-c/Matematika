import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { EditorWorkbenchHeader } from '@/fixed-pages/editor/ui/workbench/EditorWorkbenchHeader';

describe('EditorWorkbenchHeader', () => {
  const base = {
    title: 'Demo',
    onTitleChange: vi.fn(),
    center: <span>centro</span>,
    avisos: { errorCount: 0, warningCount: 0, onOpen: vi.fn(), healthyLabel: 'Avisos' },
    save: { label: 'Guardar', variant: 'pavo' as const, title: 'Guardar', disabled: false, onSave: vi.fn() },
  };

  it('expone zonas fijas: título, avisos, guardar, cerrar', () => {
    render(<EditorWorkbenchHeader {...base} fileBadge="demo.mdx" isDirty />);
    expect(screen.getByDisplayValue('Demo')).toBeDefined();
    expect(screen.getByText('demo.mdx')).toBeDefined();
    expect(screen.getByText('centro')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Avisos' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Cerrar editor' })).toBeDefined();
  });

  it('muestra toggles de panel solo cuando hay handlers', () => {
    const onToggleSidebar = vi.fn();
    const onToggleInspector = vi.fn();
    const { rerender } = render(<EditorWorkbenchHeader {...base} />);
    expect(screen.queryByRole('button', { name: /explorador/i })).toBeNull();

    rerender(
      <EditorWorkbenchHeader
        {...base}
        isSidebarOpen={false}
        onToggleSidebar={onToggleSidebar}
        isInspectorOpen={false}
        onToggleInspector={onToggleInspector}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Mostrar explorador/i }));
    fireEvent.click(screen.getByRole('button', { name: /Mostrar detalles/i }));
    expect(onToggleSidebar).toHaveBeenCalled();
    expect(onToggleInspector).toHaveBeenCalled();
  });

  it('reserva espacio fijo para indicador sucio y botón guardar', () => {
    const { container, rerender } = render(<EditorWorkbenchHeader {...base} />);
    const dot = container.querySelector('[title="Cambios no guardados"], [aria-hidden="true"].bg-ocre');
    expect(dot).toBeTruthy();
    expect(dot?.className).toContain('opacity-0');

    rerender(<EditorWorkbenchHeader {...base} isDirty />);
    expect(container.querySelector('.bg-ocre.opacity-100')).toBeTruthy();

    rerender(
      <EditorWorkbenchHeader
        {...base}
        save={{ label: 'Guardado', variant: 'saved', title: 'Guardado', disabled: true }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Guardado' })).toBeDefined();
  });
  it('pide confirmación al cerrar si hay cambios', () => {
    const onCloseEditor = vi.fn();
    render(
      <EditorWorkbenchHeader
        {...base}
        isDirty
        confirmCloseWhenDirty
        onCloseEditor={onCloseEditor}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar editor' }));
    expect(onCloseEditor).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: /Cambios sin guardar/i })).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: /Salir sin guardar/i }));
    expect(onCloseEditor).toHaveBeenCalled();
  });
});
