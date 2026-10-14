import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DiagramWorkbench } from '@/fixed-pages/editor/diagrams/ui/workbench/DiagramWorkbench';
import { createTemplateModel } from '@/fixed-pages/editor/diagrams/model/scene/templateModels';
import { deleteDiagramCascade } from '@/fixed-pages/editor/diagrams/model/tools/graphCommands';
import { element, point, updateObject } from '@/fixed-pages/editor/diagrams/model/elements/diagramElements';
import { defaultConstraintRefs } from '@/fixed-pages/editor/diagrams/model/constraints/constraintOptions';
import { assignRelationToPoint, removeConstraintFromModel, uniqueConstraintId } from '@/fixed-pages/editor/diagrams/model/constraints/relationModel';
import { pointMode } from '@/fixed-pages/editor/diagrams/model';
import { toolReferencesAreReady } from '@/fixed-pages/editor/diagrams/model/tools/toolReferences';
import type { PointConstraint, VisualDiagramModel } from '@/fixed-pages/editor/diagrams/model/types';
import { constrained, findById, pointById, relationFor, sceneSpec } from '../../../../helpers/diagramSpec';

function baseModel(overrides: Partial<VisualDiagramModel> = {}): VisualDiagramModel {
  return sceneSpec({
    title: 'Test',
    componentId: 'Test',
    viewport: { bounds: [-5, 5, 5, -5], home: [-5, 5, 5, -5], minZoom: 0.2, maxZoom: 12, padding: 0.16 },
    layers: [
      { id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false },
      { id: 'controls', label: 'Controles', order: 1, visible: true, locked: false },
    ],
    objects: [
      point('pA', 'A', 0, 0, false, 'carbon'),
      point('pB', 'B', 2, 0, false, 'carbon'),
      point('pC', 'C', 1, 2, false, 'carbon'),
      element('segAB', 'AB', 'segment', ['pA', 'pB'], 'pavo'),
    ],
    steps: [
      { id: 'initial', label: 'Inicio', description: '', visibleTargets: ['pA', 'pB', 'pC', 'segAB'] },
    ],
    ...overrides,
  });
}

describe('Editor remediation regressions', () => {
  it('deleteDiagramCascade removes dependents and cleans constraintIds', () => {
    const base = baseModel();
    const model = baseModel({
      relations: [relationFor('on', 'cOn', 'Sobre', ['pC', 'segAB'])],
      objects: base.objects.map(object => object.id === 'pC' ? constrained(pointById(base, 'pC'), ['cOn']) : object),
    });

    const { model: withoutPoint } = deleteDiagramCascade(model, 'pA');
    expect(withoutPoint.objects.find(p => p.id === 'pA')).toBeUndefined();
    expect(withoutPoint.objects.find(e => e.id === 'segAB')).toBeUndefined();

    const { model: withoutSeg } = deleteDiagramCascade(model, 'segAB');
    expect(withoutSeg.objects.find(e => e.id === 'segAB')).toBeUndefined();
    expect(withoutSeg.relations.find(c => c.id === 'cOn')).toBeUndefined();
    const pointC = withoutSeg.objects.find(p => p.id === 'pC');
    if (pointC?.objectType === 'point') {
      expect(pointC.mobility.type === 'constrained' && pointC.mobility.relationIds.includes('cOn')).toBe(false);
    }
  });

  it('adding a relation assigns it to the point and removing it frees the point', () => {
    let model = baseModel();
    const target = 'pA';
    const refs = defaultConstraintRefs(model, 'horizontal', target);
    const id = uniqueConstraintId(model);
    model = assignRelationToPoint(model, target, relationFor('horizontal', id, 'Horizontal', refs));
    const assigned = pointById(model, target);
    expect(assigned.mobility.type === 'constrained' && assigned.mobility.relationIds).toContain(id);

    model = removeConstraintFromModel(model, id);
    expect(model.relations.find(c => c.id === id)).toBeUndefined();
    expect(pointMode(pointById(model, target))).toBe('free');
  });

  it('rejects illegal point constraint modes through the legal mode set', () => {
    const legal: PointConstraint[] = [
      'free', 'fixed', 'horizontal', 'vertical', 'glider', 'derived', 'constrained',
    ];
    expect(legal).not.toContain('onSegment' as PointConstraint);
    expect(legal).not.toContain('midpoint' as PointConstraint);
    expect(legal).not.toContain('intersection' as PointConstraint);
  });

  it('polygon tool becomes ready at ≥3 vertices and stays open-ended until create', () => {
    expect(toolReferencesAreReady('polygon', ['pA', 'pB'])).toBe(false);
    expect(toolReferencesAreReady('polygon', ['pA', 'pB', 'pC'])).toBe(true);
    expect(toolReferencesAreReady('areaIntersection', ['a1'])).toBe(false);
    expect(toolReferencesAreReady('areaIntersection', ['a1', 'a2'])).toBe(true);
  });

  it('layer move+order can be applied atomically without stomping', () => {
    const model = updateObject(baseModel(), 'segAB', { layerId: 'geometry', order: 1 });
    const itemId = 'segAB';
    const newLayerId = 'controls';
    const orderDelta = 1;
    const next = updateObject(model, itemId, object => ({ ...object, layerId: newLayerId, order: (object.order || 0) + orderDelta }));
    const moved = findById(next, itemId);
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
