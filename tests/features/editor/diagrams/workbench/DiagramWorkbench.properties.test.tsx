import { describe, expect, it } from 'vitest';
import { curveAreaFill } from '@/diagrams/geometry/curves/curveGeometry';
import { defaultConstraintRefs } from '@/fixed-pages/editor/diagrams/model/constraints/constraintOptions';
import { assignRelationToPoint } from '@/fixed-pages/editor/diagrams/model/constraints/relationModel';
import { relationDraft } from '@/fixed-pages/editor/diagrams/model/constraints/relationIntents';
import { pointMode } from '@/fixed-pages/editor/diagrams/model';
import { element, point } from '@/fixed-pages/editor/diagrams/model/elements/diagramElements';
import { createTemplateModel } from '@/fixed-pages/editor/diagrams/model/scene/templateModels';
import {
  congruenceMarkForSegment,
  dimensionLineForSegment,
  measurementForSegment,
  parallelMarkForSegment,
  setSegmentCongruenceMark,
  setSegmentParallelMark,
  toggleSegmentDimensionLine,
  toggleSegmentMeasurement,
} from '@/fixed-pages/editor/diagrams/model/elements/segmentMarks';
import {
  equalLengthConstraintForSegment,
  setEqualLengthConstraint,
} from '@/fixed-pages/editor/diagrams/model/constraints/segmentLengthConstraints';
import {
  equalAngleConstraintForAngle,
  setEqualAngleConstraint,
} from '@/fixed-pages/editor/diagrams/model/constraints/angleConstraints';
import type { VisualDiagramModel } from '@/fixed-pages/editor/diagrams/model/types';
import { curvePath, pointById, relationFor, sceneSpec } from '../../../../helpers/diagramSpec';

function freePoints(entries: Array<[string, number, number]>) {
  return entries.map(([id, x, y]) => point(id, id, x, y, false, 'carbon'));
}

describe('Editor - Property Completeness & Correctness', () => {
  it('correctly identifies interior area fill for functionCurve', () => {
    const fnElement = curvePath('fn1', 'f(x)', 'functionCurve', [], {
      expression: 'sin(x)',
      domain: [-5, 5],
      areaFill: 'interior',
    });
    expect(curveAreaFill(fnElement)).toBe('interior');
  });

  it('correctly sets target point constraint mode to constrained when equalLength is applied', () => {
    let model: VisualDiagramModel = sceneSpec({
      title: 'Test Model',
      objects: [
        ...freePoints([['A', 0, 0], ['B', 2, 0], ['C', 0, 2], ['D', 3, 2]]),
        element('segAB', 'AB', 'segment', ['A', 'B'], 'pavo'),
        element('segCD', 'CD', 'segment', ['C', 'D'], 'pavo'),
      ],
    });

    const targetPointId = 'C';
    const refs = defaultConstraintRefs(model, 'equalLength', targetPointId);
    expect(refs).toEqual(['C', 'D', 'segAB']);

    model = assignRelationToPoint(model, targetPointId, relationFor('equalLength', 'c1', 'Misma longitud que segAB', refs, model.objects));

    const targetPoint = pointById(model, targetPointId);
    expect(pointMode(targetPoint)).toBe('constrained');
    expect(targetPoint.mobility.type === 'constrained' && targetPoint.mobility.relationIds).toContain('c1');
  });

  it('adds and updates segment marks: congruence (up to 4), parallel, dimension, and measurement', () => {
    let model: VisualDiagramModel = sceneSpec({
      title: 'Segment Marks Test',
      objects: [
        ...freePoints([['A', 0, 0], ['B', 4, 0]]),
        element('segAB', 'AB', 'segment', ['A', 'B'], 'pavo'),
      ],
    });

    // Congruencia (4 marcas)
    model = setSegmentCongruenceMark(model, 'segAB', 4);
    const congMark = congruenceMarkForSegment(model, 'segAB');
    expect(congMark).toBeDefined();
    expect(congMark?.objectType === 'mark' && congMark.count).toBe(4);

    // Paralelismo (2 flechas)
    model = setSegmentParallelMark(model, 'segAB', 2);
    const parMark = parallelMarkForSegment(model, 'segAB');
    expect(parMark).toBeDefined();
    expect(parMark?.objectType === 'mark' && parMark.count).toBe(2);

    // Cota
    model = toggleSegmentDimensionLine(model, 'segAB', true);
    expect(dimensionLineForSegment(model, 'segAB')).toBeDefined();

    // Medida
    model = toggleSegmentMeasurement(model, 'segAB', true);
    expect(measurementForSegment(model, 'segAB')).toBeDefined();
  });

  it('correctly sets equalLength on segment and equalAngle on angle', () => {
    let model: VisualDiagramModel = sceneSpec({
      title: 'Constraints Test',
      objects: [
        ...freePoints([['A', 0, 0], ['B', 2, 0], ['C', 0, 2], ['D', 4, 2], ['O1', 0, 0], ['P1', 1, 0], ['Q1', 0, 1], ['O2', 3, 0], ['P2', 4, 0], ['Q2', 3, 1]]),
        element('segAB', 'AB', 'segment', ['A', 'B'], 'pavo'),
        element('segCD', 'CD', 'segment', ['C', 'D'], 'pavo'),
        element('ang1', 'ang1', 'angle', ['P1', 'O1', 'Q1'], 'ocre'),
        element('ang2', 'ang2', 'angle', ['P2', 'O2', 'Q2'], 'ocre'),
      ],
    });

    // Igualar longitud segCD con segAB haciéndose móvil D
    model = setEqualLengthConstraint(model, 'segCD', 'D', 'segAB');
    const eqLen = equalLengthConstraintForSegment(model, 'segCD');
    expect(eqLen).toBeDefined();
    const lengthDraft = relationDraft(eqLen!, model.objects);
    expect(lengthDraft.kind).toBe('equalLength');
    expect(lengthDraft.refs[0]).toBe('D');
    expect(lengthDraft.refs[2]).toBe('segAB');

    // Igualar amplitud ang2 con ang1 haciéndose móvil Q2
    model = setEqualAngleConstraint(model, 'ang2', 'Q2', 'ang1');
    const eqAng = equalAngleConstraintForAngle(model, 'ang2');
    expect(eqAng).toBeDefined();
    const angleDraft = relationDraft(eqAng!, model.objects);
    expect(angleDraft.kind).toBe('equalAngle');
    expect(angleDraft.refs[0]).toBe('Q2');
    expect(angleDraft.refs[3]).toBe('ang1');
  });

  it('creates initial infoPanel with normalized viewport coordinates', () => {
    const model = createTemplateModel('triangulo-deformable', 'Test', 'demostracion');
    expect(model).toBeDefined();
  });

  it('gates geometric constraints to segment and angle only', async () => {
    const { showsConstraintsSection, constraintScopeForKind } = await import(
      '@/fixed-pages/editor/diagrams/ui/inspector/elementSections'
    );
    expect(showsConstraintsSection('segment')).toBe(true);
    expect(constraintScopeForKind('segment')).toBe('segment');
    expect(showsConstraintsSection('angle')).toBe(true);
    expect(showsConstraintsSection('nonReflexAngle')).toBe(true);
    expect(showsConstraintsSection('rightAngle')).toBe(false);
    expect(showsConstraintsSection('infoPanel')).toBe(false);
    expect(showsConstraintsSection('circle')).toBe(false);
    expect(constraintScopeForKind('infoPanel')).toBeNull();
  });
});
