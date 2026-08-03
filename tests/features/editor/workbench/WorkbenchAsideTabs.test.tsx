import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React, { useState } from 'react';
import { WorkbenchAsideTabs } from '@/fixed-pages/editor/ui/workbench/WorkbenchAsideTabs';

describe('WorkbenchAsideTabs', () => {
  it('marca la pestaña activa y cambia al hacer click', () => {
    const Harness = () => {
      const [active, setActive] = useState('page');
      return (
        <WorkbenchAsideTabs
          tabs={[
            { id: 'page', label: 'Página' },
            { id: 'diagrams', label: 'Diagramas' },
            {
              id: 'avisos',
              label: 'Avisos',
              endAdornment: <span data-testid="error-dot" className="absolute top-1 right-1 h-2 w-2 rounded-full bg-granada" />,
            },
          ]}
          activeTab={active}
          onTabChange={setActive}
        >
          <p>{active === 'page' ? 'contenido-pagina' : active === 'diagrams' ? 'contenido-diagramas' : 'contenido-avisos'}</p>
        </WorkbenchAsideTabs>
      );
    };

    render(<Harness />);

    expect(screen.getByText('contenido-pagina')).toBeDefined();
    expect(screen.getByRole('tab', { name: 'Página' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByTestId('error-dot')).toBeDefined();

    fireEvent.click(screen.getByRole('tab', { name: 'Diagramas' }));
    expect(screen.getByText('contenido-diagramas')).toBeDefined();
    expect(screen.getByRole('tab', { name: 'Diagramas' }).getAttribute('aria-selected')).toBe('true');
  });

  it('invoca onTabChange y renderiza trailing', () => {
    const onTabChange = vi.fn();
    const onClose = vi.fn();
    render(
      <WorkbenchAsideTabs
        tabs={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }]}
        activeTab="a"
        onTabChange={onTabChange}
        trailing={
          <button type="button" aria-label="Cerrar panel" onClick={onClose}>
            ×
          </button>
        }
      >
        body
      </WorkbenchAsideTabs>,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'B' }));
    expect(onTabChange).toHaveBeenCalledWith('b');
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar panel' }));
    expect(onClose).toHaveBeenCalled();
  });
});
