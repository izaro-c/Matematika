import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DiagramWorkbench } from '@/features/editor/diagrams/ui/DiagramWorkbench';

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

    const propTab = screen.getByRole('button', { name: /^Propiedades$/i });
    fireEvent.click(propTab);
    expect(propTab.className).toContain('font-bold');

    const stepsTab = screen.getByRole('button', { name: /^Pasos \(/i });
    fireEvent.click(stepsTab);
    expect(stepsTab.className).toContain('font-bold');

    const diagTabs = screen.getAllByRole('button', { name: /Salud/i });
    expect(diagTabs.length).toBeGreaterThan(0);
    fireEvent.click(diagTabs[diagTabs.length - 1]);
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
