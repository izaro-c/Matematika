import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  editableSegmentEndpoints,
  findPointLike,
  setEqualLengthConstraint,
} from '../../../../src/features/editor/diagrams/model/segmentLengthConstraints';
import { SegmentLengthConstraintEditor } from '../../../../src/features/editor/diagrams/ui/SegmentLengthConstraintEditor';
import { AngleEqualityConstraintEditor } from '../../../../src/features/editor/diagrams/ui/AngleEqualityConstraintEditor';
import { DiagramConstraintEditor } from '../../../../src/features/editor/diagrams/ui/DiagramConstraintEditor';
import { parseDiagramSpecV2 } from '../../../../src/shared/diagrams/spec/schema';
import { humanizeDiagnosticMessage, DiagramValidationPanel } from '../../../../src/features/editor/diagrams/ui/DiagramValidationPanel';
import type { VisualDiagramModel } from '../../../../src/features/editor/diagrams/model/types';

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

  it('offers equalAngle and expression kinds in Nueva relación', () => {
    const pointF = mockDemoModel.points.find(p => p.id === 'pF')!;
    render(<DiagramConstraintEditor model={mockDemoModel} point={pointF} onModelEdit={vi.fn()} />);

    const select = screen.getByLabelText('Nueva restricción') as HTMLSelectElement;
    const optionLabels = Array.from(select.options).map(option => option.textContent);
    expect(optionLabels).toContain('Misma amplitud que otro ángulo');
    expect(optionLabels).toContain('Relación por expresión');
  });

  it('humanizes Zod and technical code diagnostic messages cleanly', () => {
    const rawZod = 'objects.3.definition.supports.0: El soporte no es válido.';
    const humanized = humanizeDiagnosticMessage(rawZod, [{ id: 'pF', label: 'F', scopeId: 'demo', qualifiedId: 'demo:pF', color: 'ocre', kind: 'point' }]);
    expect(humanized).toBe('En objeto #4 (definition.supports.0): El soporte no es válido.');

    const rawEnum = 'Invalid enum value';
    expect(humanizeDiagnosticMessage(rawEnum)).toBe('El valor no es válido.');
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

  it('splits multi-issue diagnostic strings into separate individual elements in DiagramValidationPanel', () => {
    const diagnostics = [
      { code: 'warn1', severity: 'warning' as const, message: 'elements.0.refs: Error uno. elements.1.refs: Error dos.', source: 'test' as const },
    ];
    render(<DiagramValidationPanel diagnostics={diagnostics} targets={[]} selectedTargetId="" onSelectTarget={vi.fn()} />);

    expect(screen.getByText('2 avisos')).toBeDefined();
  });
});
