import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DiagramPointMovementAidsEditor } from '../../../../../src/fixed-pages/editor/diagrams/ui/DiagramPointMovementAidsEditor';
import type { VisualDiagramModel, VisualPoint } from '../../../../../src/fixed-pages/editor/diagrams/model/types';
import { element, point as createPoint } from '../../../../../src/fixed-pages/editor/diagrams/model';
import { sceneSpec } from '../../../../helpers/diagramSpec';

const point = (interaction: VisualPoint['interaction'] = undefined): VisualPoint => ({
  ...createPoint('pA', 'A', 0, 0),
  ...(interaction ? { interaction } : {}),
});

const model = (p: VisualPoint): VisualDiagramModel => sceneSpec({
  title: 'Snap style',
  componentId: 'snap-style',
  viewport: { bounds: [-5, 5, 5, -5], home: [-5, 5, 5, -5], minZoom: 0.2, maxZoom: 12, padding: 0.16 },
  objects: [p, createPoint('pB', 'B', 1, 0), { ...element('segAB', 'AB', 'segment', ['pA', 'pB'], 'carbon'), order: 1 }],
});

describe('DiagramPointMovementAidsEditor style', () => {
  it('no usa DiagramPanel (sin details ni chrome pavo)', () => {
    const p = point();
    const { container } = render(
      <DiagramPointMovementAidsEditor
        model={model(p)}
        point={p}
        onInteractionChange={vi.fn()}
        onAttractorsChange={vi.fn()}
      />,
    );

    expect(container.querySelector('details')).toBeNull();
    expect(container.innerHTML).not.toMatch(/border-pavo/);
    expect(container.innerHTML).not.toMatch(/bg-pavo/);
    expect(screen.queryByText('Opcional')).toBeNull();
    expect(screen.queryByText('Activo')).toBeNull();
  });

  it('disclosure plano: cerrado por defecto sin ayudas; al abrir muestra el cuerpo', () => {
    const p = point();
    render(
      <DiagramPointMovementAidsEditor
        model={model(p)}
        point={p}
        onInteractionChange={vi.fn()}
        onAttractorsChange={vi.fn()}
      />,
    );

    expect(screen.queryByLabelText('Ajuste a cuadrícula')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Snap y magnetismo/i }));

    expect(screen.getByLabelText('Ajuste a cuadrícula')).toBeTruthy();
    expect(screen.getByText(/Ayudas opcionales durante el arrastre/)).toBeTruthy();
  });

  it('abre por defecto si hay snap o atractores', () => {
    const p = point({ snapToGrid: true });
    render(
      <DiagramPointMovementAidsEditor
        model={model(p)}
        point={p}
        onInteractionChange={vi.fn()}
        onAttractorsChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Ajuste a cuadrícula')).toBeTruthy();
  });

  it('usa tokens carbon/canela en checkbox de snap (no accent-pavo/ocre)', () => {
    const p = point({ snapToGrid: true });
    render(
      <DiagramPointMovementAidsEditor
        model={model(p)}
        point={p}
        onInteractionChange={vi.fn()}
        onAttractorsChange={vi.fn()}
      />,
    );

    const snap = screen.getByLabelText('Ajuste a cuadrícula');
    expect(snap.className).toMatch(/text-canela|focus:ring-canela|border-carbon\/30/);
    expect(snap.className).not.toMatch(/accent-pavo|accent-ocre/);
  });

  it('marca atractores en ciclo como deshabilitados visualmente', () => {
    const p = point({ snapToGrid: true });
    render(
      <DiagramPointMovementAidsEditor
        model={model(p)}
        point={p}
        onInteractionChange={vi.fn()}
        onAttractorsChange={vi.fn()}
      />,
    );

    const checkbox = screen.getByLabelText('Usar AB como atractor') as HTMLInputElement;
    expect(checkbox.disabled).toBe(true);
    const row = checkbox.closest('label');
    expect(row?.className).toMatch(/pointer-events-none/);
    expect(row?.className).toMatch(/cursor-not-allowed/);
    expect(row?.className).toMatch(/bg-carbon\/5/);
    expect(screen.getByText(/no disponible \(ciclo\)/)).toBeTruthy();
    expect(row?.querySelector('.line-through')).toBeTruthy();
  });
});
