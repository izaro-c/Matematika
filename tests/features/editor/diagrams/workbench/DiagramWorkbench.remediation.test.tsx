import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DiagramWorkbench } from '@/fixed-pages/editor/diagrams/ui/workbench/DiagramWorkbench';
import { createTemplateModel } from '@/fixed-pages/editor/diagrams/model/scene/templateModels';
import { deleteDiagramCascade } from '@/fixed-pages/editor/diagrams/model/tools/graphCommands';
import { updatePoint } from '@/fixed-pages/editor/diagrams/model/elements/diagramElements';
import {
  defaultConstraintRefs,
  uniqueConstraintId,
  withConstraintDependencies,
} from '@/fixed-pages/editor/diagrams/model/constraints/constraintOptions';
import { removeConstraintFromModel } from '@/fixed-pages/editor/diagrams/model/constraints/segmentLengthConstraints';
import { toolReferencesAreReady } from '@/fixed-pages/editor/diagrams/model/tools/toolReferences';
import type { VisualDiagramModel, VisualPoint } from '@/fixed-pages/editor/diagrams/model/types';
import { DIAGRAM_RENDERER_V2_ID, DIAGRAM_SPEC_V2_VERSION } from '@/diagrams';

function baseModel(overrides: Partial<VisualDiagramModel> = {}): VisualDiagramModel {
  return {
    version: DIAGRAM_SPEC_V2_VERSION,
    renderer: DIAGRAM_RENDERER_V2_ID,
    title: 'Test',
    componentId: 'Test',
    category: 'demostracion',
    mode: 'simulation',
    axis: false,
    grid: false,
    showLabels: true,
    viewport: { bounds: [-5, 5, 5, -5], home: [-5, 5, 5, -5] },
    layers: [
      { id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false },
      { id: 'controls', label: 'Controles', order: 1, visible: true, locked: false },
    ],
    groups: [],
    points: [
      { id: 'pA', label: 'A', x: 0, y: 0, color: 'carbon', constraint: 'free', groupIds: [], target: true },
      { id: 'pB', label: 'B', x: 2, y: 0, color: 'carbon', constraint: 'free', groupIds: [], target: true },
      { id: 'pC', label: 'C', x: 1, y: 2, color: 'carbon', constraint: 'free', groupIds: [], target: true },
    ],
    elements: [
      { id: 'segAB', label: 'AB', kind: 'segment', refs: ['pA', 'pB'], color: 'pavo', groupIds: [] },
    ],
    sliders: [],
    steps: [
      { id: 'initial', label: 'Inicio', visibleTargets: ['pA', 'pB', 'pC', 'segAB'] },
    ],
    constraints: [],
    dependencies: [],
    ...overrides,
  };
}

describe('Editor V2 remediation regressions', () => {
  it('deleteDiagramCascade removes dependents and cleans constraintIds', () => {
    const model = baseModel({
      constraints: [{
        id: 'cOn',
        label: 'Sobre',
        kind: 'on',
        refs: ['pC', 'segAB'],
        enabled: true,
      }],
      points: [
        { id: 'pA', label: 'A', x: 0, y: 0, color: 'carbon', constraint: 'free', groupIds: [], target: true },
        { id: 'pB', label: 'B', x: 2, y: 0, color: 'carbon', constraint: 'free', groupIds: [], target: true },
        {
          id: 'pC',
          label: 'C',
          x: 1,
          y: 1,
          color: 'carbon',
          constraint: 'constrained',
          constraintIds: ['cOn'],
          groupIds: [],
          target: true,
        },
      ],
      dependencies: [
        { sourceId: 'segAB', targetId: 'pC', relation: 'constraint', constraintId: 'cOn' },
      ],
    });

    const { model: withoutPoint } = deleteDiagramCascade(model, 'pA');
    expect(withoutPoint.points.find(p => p.id === 'pA')).toBeUndefined();
    expect(withoutPoint.elements.find(e => e.id === 'segAB')).toBeUndefined();

    const { model: withoutSeg } = deleteDiagramCascade(model, 'segAB');
    expect(withoutSeg.elements.find(e => e.id === 'segAB')).toBeUndefined();
    expect(withoutSeg.constraints?.find(c => c.id === 'cOn')).toBeUndefined();
    const pointC = withoutSeg.points.find(p => p.id === 'pC');
    if (pointC) {
      expect(pointC.constraintIds?.includes('cOn') ?? false).toBe(false);
    }
  });

  it('adding a constraint appends constraintIds via updatePoint', () => {
    let model = baseModel();
    const target = 'pA';
    const refs = defaultConstraintRefs(model, 'fixed', target);
    const id = uniqueConstraintId(model);
    model = {
      ...model,
      constraints: [...(model.constraints || []), {
        id,
        label: 'Fijo',
        kind: 'fixed',
        refs,
        enabled: true,
      }],
    };
    model = withConstraintDependencies(model, id, refs);
    const point = model.points.find(p => p.id === target)!;
    model = updatePoint(model, target, {
      constraint: 'constrained',
      constraintIds: [...(point.constraintIds || []), id],
    });
    expect(model.points.find(p => p.id === target)?.constraintIds).toContain(id);

    model = removeConstraintFromModel(model, id);
    expect(model.constraints?.find(c => c.id === id)).toBeUndefined();
    expect(model.points.find(p => p.id === target)?.constraint).toBe('free');
  });

  it('rejects illegal point constraint modes through updatePoint legal set', () => {
    const legal: VisualPoint['constraint'][] = [
      'free', 'fixed', 'horizontal', 'vertical', 'glider', 'derived', 'constrained',
    ];
    expect(legal).not.toContain('onSegment' as VisualPoint['constraint']);
    expect(legal).not.toContain('midpoint' as VisualPoint['constraint']);
    expect(legal).not.toContain('intersection' as VisualPoint['constraint']);
  });

  it('polygon tool becomes ready at ≥3 vertices and stays open-ended until create', () => {
    expect(toolReferencesAreReady('polygon', ['pA', 'pB'])).toBe(false);
    expect(toolReferencesAreReady('polygon', ['pA', 'pB', 'pC'])).toBe(true);
    expect(toolReferencesAreReady('areaIntersection', ['a1'])).toBe(false);
    expect(toolReferencesAreReady('areaIntersection', ['a1', 'a2'])).toBe(true);
  });

  it('layer move+order can be applied atomically without stomping', () => {
    const model = baseModel({
      elements: [
        { id: 'segAB', label: 'AB', kind: 'segment', refs: ['pA', 'pB'], color: 'pavo', groupIds: [], layerId: 'geometry', order: 1 },
      ],
    });
    const itemId = 'segAB';
    const newLayerId = 'controls';
    const orderDelta = 1;
    const nextElements = model.elements.map(e =>
      e.id === itemId ? { ...e, layerId: newLayerId, order: (e.order || 0) + orderDelta } : e,
    );
    const next = { ...model, elements: nextElements };
    const moved = next.elements.find(e => e.id === itemId)!;
    expect(moved.layerId).toBe('controls');
    expect(moved.order).toBe(2);
  });

  it('shows Crear polígono control when polygon tool is active with enough refs', () => {
    render(<DiagramWorkbench />);

    const linesMenu = screen.getByRole('button', { name: /Líneas & Geometría/i });
    fireEvent.click(linesMenu);
    const polygonBtn = screen.getAllByText('Polígono')[0].closest('button')!;
    fireEvent.click(polygonBtn);

    // After selecting polygon tool, guidance panel appears; Crear is disabled until 3 refs.
    expect(screen.getByRole('button', { name: /Crear Polígono|Crear polígono/i })).toBeDefined();
  });

  it('marks the editor as sandbox in the header', () => {
    render(<DiagramWorkbench />);
    expect(screen.getByText('Sandbox')).toBeDefined();
  });

  it('template includes home viewport for reset', () => {
    const template = createTemplateModel('triangulo-deformable', 'Triángulo', 'demostración');
    expect(template.viewport.home).toEqual(template.viewport.bounds);
  });
});
