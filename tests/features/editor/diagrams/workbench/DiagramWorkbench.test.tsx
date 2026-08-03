import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DiagramWorkbench } from '@/fixed-pages/editor/diagrams/ui/workbench/DiagramWorkbench';

describe('DiagramWorkbench Component', () => {
  it('renderiza la cabecera, barra de herramientas y lienzo interactivo', () => {
    render(<DiagramWorkbench />);

    expect(screen.getByText('Plantillas')).toBeDefined();
    expect(screen.getByText('Código')).toBeDefined();
    expect(screen.getAllByText('Centrar').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Editor' })).toBeDefined();
  });

  it('permite cambiar entre las pestañas del inspector (Objetos, Propiedades, Pasos, Salud)', () => {
    render(<DiagramWorkbench />);

    const propTab = screen.getByRole('tab', { name: /^Propiedades$/i });
    fireEvent.click(propTab);
    expect(propTab.getAttribute('aria-selected')).toBe('true');

    const stepsTab = screen.getByRole('tab', { name: /^Pasos \(/i });
    fireEvent.click(stepsTab);
    expect(stepsTab.getAttribute('aria-selected')).toBe('true');

    const diagTabs = screen.getAllByRole('tab', { name: /Salud/i });
    expect(diagTabs.length).toBeGreaterThan(0);
    fireEvent.click(diagTabs[diagTabs.length - 1]);
    expect(diagTabs[diagTabs.length - 1].getAttribute('aria-selected')).toBe('true');
  });

  it('crea e inspecciona un panel informativo (infoPanel) con editor de bloques', () => {
    render(<DiagramWorkbench />);

    const annotBtn = screen.getByRole('button', { name: /Anotaciones & Explicación/i });
    fireEvent.click(annotBtn);

    const infoPanelBtn = screen.getByRole('button', { name: /Panel informativo/i });
    fireEvent.click(infoPanelBtn);

    expect(screen.getByText(/infoPanel:/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Editar contenido y diseño del panel/i })).toBeDefined();
    expect(screen.queryByRole('button', { name: /Restricciones Geométricas/i })).toBeNull();
  });
});
