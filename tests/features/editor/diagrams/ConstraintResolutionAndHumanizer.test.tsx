import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import {
  editableSegmentEndpoints,
  findPointLike,
  setEqualLengthConstraint,
} from '../../../../src/fixed-pages/editor/diagrams/model/constraints/segmentLengthConstraints';
import { SegmentLengthConstraintEditor } from '../../../../src/fixed-pages/editor/diagrams/ui/constraints/SegmentLengthConstraintEditor';
import { DiagramConstraintEditor } from '../../../../src/fixed-pages/editor/diagrams/ui/panels/DiagramConstraintEditor';
import { parseDiagramSpecV3 } from '../../../../src/diagrams';
import { element, point, relationDraft } from '../../../../src/fixed-pages/editor/diagrams/model';
import { constrained, diagramConstraint, findById, pointById, relationFor, sceneFromParts } from '../../../helpers/diagramSpec';
import { enrichDiagramDiagnostics } from '../../../../src/fixed-pages/editor/diagrams/checks';
import type { VisualDiagramModel } from '../../../../src/fixed-pages/editor/diagrams/model/types';

const mockDemoModel: VisualDiagramModel = sceneFromParts({
  title: 'Demo Ángulo Externo',
  componentId: 'demo-angulo-externo',
  viewport: { bounds: [-5, 5, 5, -5], home: [-5, 5, 5, -5], minZoom: 0.2, maxZoom: 12, padding: 0.16 },
  layers: [
    { id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false },
    { id: 'controls', label: 'Controles', order: 1, visible: true, locked: false },
  ],
  points: [
    point('pA', 'A', -5.91, -3.64),
    { ...point('pB', 'B', -0.96, -1.38), order: 1000 },
    { ...point('pC', 'C', -1.86, 1.58), order: 2000 },
    { ...constrained(point('pF', 'F', -9.28, -0.38, false, 'ocre'), ['constraint3']), order: 17000 },
  ],
  elements: [
    { ...element('midAC', 'E', 'midpoint', ['pA', 'pC'], 'terracota'), order: 14000 },
    { ...element('segBmidAC', 'Segmento EB', 'segment', ['pB', 'midAC'], 'carbon'), order: 15000 },
    { ...element('segmidACF', 'Segmento FE', 'segment', ['midAC', 'pF'], 'carbon'), order: 18000 },
  ],
  constraints: [diagramConstraint('constraint3', 'Sobre un objeto', 'on', ['pF', 'segBmidAC'])],
  note: 'Test note',
});

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
    const addedConstraint = updated.relations.find(relation => relation.type === 'equal-length');
    expect(addedConstraint).toBeDefined();
    expect(relationDraft(addedConstraint!, updated.objects).refs).toEqual(['pF', 'midAC', 'segBmidAC']);
  });

  it('renders SegmentLengthConstraintEditor enabled and ready for segmidACF', () => {
    const seg = findById(mockDemoModel, 'segmidACF');
    render(<SegmentLengthConstraintEditor model={mockDemoModel} segment={seg} onModelEdit={vi.fn()} />);

    const button = screen.getByRole('button', { name: 'Mantener la misma longitud' });
    expect(button).toBeDefined();
    expect((button as HTMLButtonElement).disabled).toBe(false);
  });

  it('renders explanation message when adding a constraint is disabled in DiagramConstraintEditor', () => {
    const pointF = pointById(mockDemoModel, 'pF');
    render(<DiagramConstraintEditor model={mockDemoModel} point={pointF} onModelEdit={vi.fn()} />);

    expect(screen.getByText('Relaciones geométricas')).toBeDefined();
  });

  it('offers horizontal, vertical and region relations in Nueva relación', () => {
    const pointF = pointById(mockDemoModel, 'pF');
    render(<DiagramConstraintEditor model={mockDemoModel} point={pointF} onModelEdit={vi.fn()} />);

    const select = screen.getByLabelText('Nueva restricción') as HTMLSelectElement;
    const optionLabels = Array.from(select.options).map(option => option.textContent);
    expect(optionLabels).toContain('Movimiento horizontal');
    expect(optionLabels).toContain('Movimiento vertical');
    expect(optionLabels).toContain('En el mismo semiplano');
    expect(optionLabels).not.toContain('Posición fija');
    expect(optionLabels).not.toContain('Relación por expresión');
  });

  it('blocks incompatible coincidence and midpoint combinations', () => {
    const model: VisualDiagramModel = {
      ...mockDemoModel,
      relations: [...mockDemoModel.relations, relationFor('coincident', 'constraintCoincident', 'Coincidente', ['pF', 'pA'])],
      objects: mockDemoModel.objects.map(object => object.id === 'pF'
        ? constrained(pointById(mockDemoModel, 'pF'), ['constraint3', 'constraintCoincident'])
        : object),
    };
    render(<DiagramConstraintEditor model={model} point={pointById(model, 'pF')} onModelEdit={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Nueva restricción'), { target: { value: 'midpoint' } });
    expect(screen.getByRole('status').textContent).toMatch(/punto medio/i);
    expect((screen.getByRole('button', { name: 'Añadir relación' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('humanizes Zod and technical code diagnostic messages cleanly', () => {
    const targets = [{ id: 'pF', label: 'F', scopeId: 'demo', qualifiedId: 'demo:pF', color: 'ocre' as const, kind: 'point' as const }];
    const [pathDiagnostic, enumDiagnostic] = enrichDiagramDiagnostics([
      {
        code: 'invalid-diagram-spec-v3',
        severity: 'error',
        message: 'El soporte no es válido.',
        source: 'model',
        path: ['objects', 3, 'definition.supports.0'],
      },
      {
        code: 'invalid-diagram-spec-v3',
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
      objects: [
        ...mockDemoModel.objects,
        { ...element('mark1', 'Marca 1', 'congruenceMark', ['midAC', 'pB'], 'ocre'), order: 19000 },
      ],
    };

    const result = parseDiagramSpecV3(modelWithMark);
    expect(result.success).toBe(true);
  });
});
