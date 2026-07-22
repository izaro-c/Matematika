import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  DiagramButton,
  DiagramField,
  DiagramPanel,
  DiagramTabBar,
} from '../../../../../src/features/editor/diagrams/ui/primitives';

describe('DiagramPanel', () => {
  it('aplica el estilo canónico de panel de restricción pavo/5', () => {
    const { container } = render(
      <DiagramPanel title="Igualar longitudes" badge="Opcional">
        <p>Contenido</p>
      </DiagramPanel>,
    );

    const panel = container.firstElementChild;
    expect(panel?.className).toMatch(/border-pavo\/25/);
    expect(panel?.className).toMatch(/bg-pavo\/5/);
    expect(screen.getByText('Igualar longitudes')).toBeTruthy();
    expect(screen.getByText('Opcional')).toBeTruthy();
    expect(screen.getByText('Contenido')).toBeTruthy();
  });

  it('permite colapsar y expandir con details cuando es collapsible', () => {
    const { container } = render(
      <DiagramPanel title="Panel colapsable" collapsible defaultOpen={false}>
        <p>Interior</p>
      </DiagramPanel>,
    );

    const details = container.querySelector('details');
    const summary = screen.getByText('Panel colapsable').closest('summary');
    expect(summary).toBeTruthy();
    expect(details?.hasAttribute('open')).toBe(false);

    fireEvent.click(summary!);
    expect(details?.hasAttribute('open')).toBe(true);
    expect(screen.getByText('Interior')).toBeTruthy();
  });

  it('notifica cambios de apertura en modo controlado', () => {
    const onOpenChange = vi.fn();
    render(
      <DiagramPanel title="Controlado" collapsible open onOpenChange={onOpenChange}>
        <p>Visible</p>
      </DiagramPanel>,
    );

    const summary = screen.getByText('Controlado').closest('summary');
    fireEvent.click(summary!);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe('DiagramField', () => {
  it('asocia etiqueta y control con altura táctil mínima', () => {
    render(
      <DiagramField label="Extremo que se ajusta">
        <select aria-label="Extremo que se ajusta">
          <option value="a">A</option>
        </select>
      </DiagramField>,
    );

    const control = screen.getByLabelText('Extremo que se ajusta');
    expect(control.className).toContain('min-h-11');
    expect(control.className).toContain('bg-lienzo');
    expect(screen.getByText('Extremo que se ajusta')).toBeTruthy();
  });
});

describe('DiagramButton', () => {
  it('expone variantes primary y danger con min-h-11', () => {
    render(
      <>
        <DiagramButton variant="primary">Confirmar</DiagramButton>
        <DiagramButton variant="danger">Quitar</DiagramButton>
      </>,
    );

    const primary = screen.getByRole('button', { name: 'Confirmar' });
    const danger = screen.getByRole('button', { name: 'Quitar' });
    expect(primary.className).toMatch(/min-h-11/);
    expect(primary.className).toMatch(/bg-pavo/);
    expect(danger.className).toMatch(/min-h-11/);
    expect(danger.className).toMatch(/text-granada/);
  });

  it('respeta disabled en la variante primary', () => {
    render(<DiagramButton variant="primary" disabled>No disponible</DiagramButton>);
    expect(screen.getByRole('button', { name: 'No disponible' }).disabled).toBe(true);
  });
});

describe('DiagramTabBar', () => {
  it('marca la pestaña activa y usa controles de altura táctil', () => {
    const Harness = () => {
      const [active, setActive] = useState('geometry');
      return (
        <DiagramTabBar
          aria-label="Secciones de propiedades"
          tabs={[
            { id: 'general', label: 'Esencial' },
            { id: 'geometry', label: 'Geometría' },
          ]}
          activeTab={active}
          onTabChange={setActive}
        />
      );
    };

    render(<Harness />);

    const geometry = screen.getByRole('button', { name: 'Geometría' });
    const general = screen.getByRole('button', { name: 'Esencial' });
    expect(geometry.className).toMatch(/min-h-11/);
    expect(general.className).toMatch(/min-h-11/);
    expect(geometry.getAttribute('aria-current')).toBe('page');
    expect(general.getAttribute('aria-current')).toBeNull();

    fireEvent.click(general);
    expect(general.getAttribute('aria-current')).toBe('page');
    expect(geometry.getAttribute('aria-current')).toBeNull();
  });
});
