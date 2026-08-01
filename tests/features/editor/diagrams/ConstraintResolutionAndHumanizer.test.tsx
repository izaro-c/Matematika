import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import {
  editableSegmentEndpoints,
  findPointLike,
  setEqualLengthConstraint,
} from '../../../../src/fixed-pages/editor/diagrams/model/segmentLengthConstraints';
import { SegmentLengthConstraintEditor } from '../../../../src/fixed-pages/editor/diagrams/ui/SegmentLengthConstraintEditor';
import { DiagramConstraintEditor } from '../../../../src/fixed-pages/editor/diagrams/ui/DiagramConstraintEditor';
import { parseDiagramSpecV2 } from '../../../../src/diagrams/spec/schema';
import { enrichDiagramDiagnostics } from '../../../../src/fixed-pages/editor/diagrams/diagnostics';
import type { VisualDiagramModel } from '../../../../src/fixed-pages/editor/diagrams/model/types';

const mockDemoModel: VisualDiagramModel = {
  version: '2.0',
  renderer: 'matematika-diagram-renderer-v2',
  title: 'Demo Ángulo Externo',
  componentId: 'demo-angulo-externo',
  category: 'Demos',
  mode: 'simulation',
  axis: false,
  grid: false,
  showLabels: true,
  viewport: { bounds: [-5, 5, 5, -5], home: [-5, 5, 5, -5], minZoom: 0.2, maxZoom: 12, padding: 0.16 },
  layers: [
    { id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false },
    { id: 'controls', label: 'Controles', order: 1, visible: true, locked: false },
  ],
  groups: [],
  points: [
    {
      id: 'pA', label: 'A', x: -5.91, y: -3.64, showLabel: true, fixed: false, color: 'terracota',
      constraint: 'free', layerId: 'geometry', order: 0, visible: true, locked: false, groupIds: [],
      selection: { selectable: true }, target: true, targetId: 'pA',
    },
    {
      id: 'pB', label: 'B', x: -0.96, y: -1.38, showLabel: true, fixed: false, color: 'terracota',
      constraint: 'free', layerId: 'geometry', order: 1000, visible: true, locked: false, groupIds: [],
      selection: { selectable: true }, target: true, targetId: 'pB',
    },
    {
      id: 'pC', label: 'C', x: -1.86, y: 1.58, showLabel: true, fixed: false, color: 'terracota',
      constraint: 'free', layerId: 'geometry', order: 2000, visible: true, locked: false, groupIds: [],
      selection: { selectable: true }, target: true, targetId: 'pC',
    },
    {
      id: 'pF', label: 'F', x: -9.28, y: -0.38, showLabel: true, fixed: false, color: 'ocre',
      constraint: 'constrained', constraintIds: ['constraint3'], layerId: 'geometry', order: 17000, visible: true, locked: false, groupIds: [],
      selection: { selectable: true }, target: true, targetId: 'pF',
    },
  ],
  elements: [
    {
      id: 'midAC', label: 'E', kind: 'midpoint', refs: ['pA', 'pC'], color: 'terracota', target: true, targetId: 'midAC',
      layerId: 'geometry', order: 14000, visible: true, locked: false, groupIds: [], selection: { selectable: true },
    },
    {
      id: 'segBmidAC', label: 'Segmento EB', kind: 'segment', refs: ['pB', 'midAC'], color: 'carbon', target: true, targetId: 'segBmidAC',
      layerId: 'geometry', order: 15000, visible: true, locked: false, groupIds: [], selection: { selectable: true },
    },
    {
      id: 'segmidACF', label: 'Segmento FE', kind: 'segment', refs: ['midAC', 'pF'], color: 'carbon', target: true, targetId: 'segmidACF',
      layerId: 'geometry', order: 18000, visible: true, locked: false, groupIds: [], selection: { selectable: true },
    },
  ],
  sliders: [],
  steps: [],
  constraints: [
    { id: 'constraint3', label: 'Sobre un objeto', kind: 'on', refs: ['pF', 'segBmidAC'], enabled: true },
  ],
  dependencies: [],
  note: 'Test note',
  extensions: {},
};

describe('Constraint Resolution & UI Explanations', () => {
  it('finds point-like entities for constructed points such as midpoints', () => {
    expect(findPointLike(mockDemoModel, 'pA')).toEqual({ id: 'pA', label: 'A' });
    expect(findPointLike(mockDemoModel, 'midAC')).toEqual({ id: 'midAC', label: 'E' });
    expect(findPointLike(mockDemoModel, 'nonExistent')).toBeUndefined();
  });

  it('allows setting equal length constraint when anchor is a constructed midpoint (FE = EB)', () => {
    const endpoints = editableSegmentEndpoints(mockDemoModel, 'segmidACF');
    expect(endpoints.map(p => p.id)).toContain('pF');

    const updated = setEqualLengthConstraint(mockDemoModel, 'segmidACF', 'pF', 'segBmidAC');
    const addedConstraint = updated.constraints?.find(c => c.kind === 'equalLength');
    expect(addedConstraint).toBeDefined();
    expect(addedConstraint?.refs).toEqual(['pF', 'midAC', 'segBmidAC']);
  });

  it('renders SegmentLengthConstraintEditor enabled and ready for segmidACF', () => {
    const seg = mockDemoModel.elements.find(e => e.id === 'segmidACF')!;
    render(<SegmentLengthConstraintEditor model={mockDemoModel} segment={seg} onModelEdit={vi.fn()} />);

    const button = screen.getByRole('button', { name: 'Mantener la misma longitud' });
    expect(button).toBeDefined();
    expect((button as HTMLButtonElement).disabled).toBe(false);
  });

  it('renders explanation message when adding a constraint is disabled in DiagramConstraintEditor', () => {
    const pointF = mockDemoModel.points.find(p => p.id === 'pF')!;
    render(<DiagramConstraintEditor model={mockDemoModel} point={pointF} onModelEdit={vi.fn()} />);

    expect(screen.getByText('Relaciones geométricas')).toBeDefined();
  });

  it('offers horizontal, vertical and region relations in Nueva relación', () => {
    const pointF = mockDemoModel.points.find(p => p.id === 'pF')!;
    render(<DiagramConstraintEditor model={mockDemoModel} point={pointF} onModelEdit={vi.fn()} />);

    const select = screen.getByLabelText('Nueva restricción') as HTMLSelectElement;
    const optionLabels = Array.from(select.options).map(option => option.textContent);
    expect(optionLabels).toContain('Movimiento horizontal');
    expect(optionLabels).toContain('Movimiento vertical');
    expect(optionLabels).toContain('En el mismo semiplano');
    expect(optionLabels).not.toContain('Posición fija');
    expect(optionLabels).not.toContain('Relación por expresión');
  });

  it('blocks incompatible midpoint and distance combinations', () => {
    const model = {
      ...mockDemoModel,
      constraints: [
        ...(mockDemoModel.constraints ?? []),
        { id: 'constraintMid', label: 'Punto medio', kind: 'midpoint' as const, refs: ['pF', 'pA', 'pB'], enabled: true },
      ],
      points: mockDemoModel.points.map(point => point.id === 'pF'
        ? { ...point, constraintIds: [...(point.constraintIds ?? []), 'constraintMid'] }
        : point),
    };
    render(<DiagramConstraintEditor model={model} point={model.points.find(p => p.id === 'pF')!} onModelEdit={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Nueva restricción'), { target: { value: 'distance' } });
    expect(screen.getByRole('status').textContent).toMatch(/punto medio/i);
    expect((screen.getByRole('button', { name: 'Añadir relación' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('humanizes Zod and technical code diagnostic messages cleanly', () => {
    const targets = [{ id: 'pF', label: 'F', scopeId: 'demo', qualifiedId: 'demo:pF', color: 'ocre' as const, kind: 'point' as const }];
    const [pathDiagnostic, enumDiagnostic] = enrichDiagramDiagnostics([
      {
        code: 'invalid-diagram-spec-v2',
        severity: 'error',
        message: 'El soporte no es válido.',
        source: 'model',
        path: ['objects', 3, 'definition.supports.0'],
      },
      {
        code: 'invalid-diagram-spec-v2',
        severity: 'error',
        message: 'Invalid enum value',
        source: 'model',
      },
    ], mockDemoModel, targets);

    expect(pathDiagnostic.message).toContain('definition.supports.0');
    expect(pathDiagnostic.message).toMatch(/soporte no es válido/i);
    expect(enumDiagnostic.message).toBe('El valor no es válido.');
  });

  it('validates congruenceMark referencing a constructed midpoint without error', () => {
    const modelWithMark: VisualDiagramModel = {
      ...mockDemoModel,
      elements: [
        ...mockDemoModel.elements,
        {
          id: 'mark1',
          label: 'Marca 1',
          kind: 'congruenceMark',
          refs: ['midAC', 'pB'],
          color: 'ocre',
          layerId: 'geometry',
          order: 19000,
          visible: true,
          locked: false,
          groupIds: [],
          selection: { selectable: true },
          target: true,
        },
      ],
    };

    const result = parseDiagramSpecV2({ ...modelWithMark, version: 2 });
    expect(result.success).toBe(true);
  });
});
