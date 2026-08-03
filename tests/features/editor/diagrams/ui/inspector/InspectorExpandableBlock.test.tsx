import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { InspectorExpandableBlock } from '../../../../../../src/fixed-pages/editor/diagrams/ui/inspector/InspectorExpandableBlock';

describe('InspectorExpandableBlock', () => {
  it('cerrado por defecto: no muestra hijos; toggle abre y cierra', () => {
    render(
      <InspectorExpandableBlock title="Bloque demo">
        <p>Contenido interno</p>
      </InspectorExpandableBlock>,
    );

    const toggle = screen.getByRole('button', { name: /Bloque demo/i });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('Contenido interno')).toBeNull();

    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Contenido interno')).toBeTruthy();

    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('Contenido interno')).toBeNull();
  });

  it('honra defaultOpen', () => {
    render(
      <InspectorExpandableBlock title="Abierto" defaultOpen>
        <span>Ya visible</span>
      </InspectorExpandableBlock>,
    );
    expect(screen.getByRole('button', { name: /Abierto/i }).getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Ya visible')).toBeTruthy();
  });

  it('modo controlado notifica onOpenChange', () => {
    const onOpenChange = vi.fn();
    function Harness() {
      const [open, setOpen] = useState(true);
      return (
        <InspectorExpandableBlock
          title="Controlado"
          open={open}
          onOpenChange={next => {
            onOpenChange(next);
            setOpen(next);
          }}
        >
          <span>Body</span>
        </InspectorExpandableBlock>
      );
    }
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: /Controlado/i }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByText('Body')).toBeNull();
  });

  it('header plano sin chrome de panel (sin details/pavo)', () => {
    const { container } = render(
      <InspectorExpandableBlock title="Plano">
        <span>x</span>
      </InspectorExpandableBlock>,
    );
    expect(container.querySelector('details')).toBeNull();
    expect(container.innerHTML).not.toMatch(/border-pavo|bg-pavo/);
    const toggle = screen.getByRole('button', { name: /Plano/i });
    expect(toggle.className).toMatch(/border-t/);
    expect(toggle.className).not.toMatch(/rounded-lg|bg-carbon\/5/);
  });
});
