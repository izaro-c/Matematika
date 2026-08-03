import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DiagramPointMovementAidsEditor } from '../../../../../src/fixed-pages/editor/diagrams/ui/DiagramPointMovementAidsEditor';
import type { VisualDiagramModel, VisualPoint } from '../../../../../src/fixed-pages/editor/diagrams/model/types';

const point = (overrides: Partial<VisualPoint> = {}): VisualPoint => ({
  id: 'pA',
  label: 'A',
  x: 0,
  y: 0,
  showLabel: true,
  fixed: false,
  color: 'terracota',
  constraint: 'free',
  layerId: 'geometry',
  order: 0,
  visible: true,
  locked: false,
  groupIds: [],
  selection: { selectable: true },
  target: true,
  ...overrides,
});

const model = (p: VisualPoint): VisualDiagramModel => ({
  version: '2.0',
  renderer: 'matematika-diagram-renderer-v2',
  title: 'Snap style',
  componentId: 'snap-style',
  category: 'Demos',
  mode: 'simulation',
  axis: false,
  grid: false,
  showLabels: true,
  viewport: { bounds: [-5, 5, 5, -5], home: [-5, 5, 5, -5], minZoom: 0.2, maxZoom: 12, padding: 0.16 },
  layers: [{ id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false }],
  groups: [],
  points: [p],
  elements: [
    {
      id: 'segAB',
      label: 'AB',
      kind: 'segment',
      refs: ['pA', 'pB'],
      color: 'carbon',
      layerId: 'geometry',
      order: 1,
      visible: true,
      locked: false,
      groupIds: [],
      selection: { selectable: true },
      target: true,
    },
  ],
  sliders: [],
  steps: [],
  constraints: [],
  dependencies: [],
  note: '',
  extensions: {},
});

describe('DiagramPointMovementAidsEditor style', () => {
  it('no usa DiagramPanel (sin details ni chrome pavo)', () => {
    const p = point();
    const { container } = render(
      <DiagramPointMovementAidsEditor
        model={model(p)}
        point={p}
        onPointChange={vi.fn()}
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
        onPointChange={vi.fn()}
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
        onPointChange={vi.fn()}
        onAttractorsChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Ajuste a cuadrícula')).toBeTruthy();
  });

  it('usa tokens carbon/salvia en checkbox de snap (no accent-pavo/ocre)', () => {
    const p = point({ snapToGrid: true });
    render(
      <DiagramPointMovementAidsEditor
        model={model(p)}
        point={p}
        onPointChange={vi.fn()}
        onAttractorsChange={vi.fn()}
      />,
    );

    const snap = screen.getByLabelText('Ajuste a cuadrícula');
    expect(snap.className).toMatch(/text-salvia|focus:ring-salvia|border-carbon\/30/);
    expect(snap.className).not.toMatch(/accent-pavo|accent-ocre/);
  });

  it('marca atractores en ciclo como deshabilitados visualmente', () => {
    const p = point({ snapToGrid: true });
    render(
      <DiagramPointMovementAidsEditor
        model={model(p)}
        point={p}
        onPointChange={vi.fn()}
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
