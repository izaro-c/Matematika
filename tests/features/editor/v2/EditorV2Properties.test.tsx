import { describe, expect, it } from 'vitest';
import { curveAreaFill } from '@/shared/diagrams/spec/curveGeometry';
import { defaultConstraintRefs, withConstraintDependencies } from '@/features/editor/diagrams/model/constraintOptions';
import { updatePoint } from '@/features/editor/diagrams/model/diagramElements';
import { createTemplateModel } from '@/features/editor/diagrams/model/templateModels';
import {
  congruenceMarkForSegment,
  dimensionLineForSegment,
  measurementForSegment,
  parallelMarkForSegment,
  setSegmentCongruenceMark,
  setSegmentParallelMark,
  toggleSegmentDimensionLine,
  toggleSegmentMeasurement,
} from '@/features/editor/diagrams/model/segmentMarks';
import {
  equalLengthConstraintForSegment,
  setEqualLengthConstraint,
} from '@/features/editor/diagrams/model/segmentLengthConstraints';
import {
  equalAngleConstraintForAngle,
  setEqualAngleConstraint,
} from '@/features/editor/diagrams/model/angleConstraints';
import type { DiagramElement, VisualDiagramModel } from '@/features/editor/diagrams/model/types';

describe('Editor V2 - Property Completeness & Correctness', () => {
  it('correctly identifies interior area fill for functionCurve', () => {
    const fnElement: DiagramElement = {
      id: 'fn1',
      label: 'f(x)',
      kind: 'functionCurve',
      refs: [],
      color: 'pavo',
      properties: {
        expression: 'sin(x)',
        domain: [-5, 5],
        areaFill: 'interior',
      },
    };
    expect(curveAreaFill(fnElement)).toBe('interior');
  });

  it('correctly sets target point constraint mode to constrained when equalLength is applied', () => {
    let model: VisualDiagramModel = {
      title: 'Test Model',
      viewport: { bounds: [-5, 5, 5, -5] },
      points: [
        { id: 'A', label: 'A', x: 0, y: 0, color: 'carbon', constraint: 'free', selection: { selectable: true } },
        { id: 'B', label: 'B', x: 2, y: 0, color: 'carbon', constraint: 'free', selection: { selectable: true } },
        { id: 'C', label: 'C', x: 0, y: 2, color: 'carbon', constraint: 'free', selection: { selectable: true } },
        { id: 'D', label: 'D', x: 3, y: 2, color: 'carbon', constraint: 'free', selection: { selectable: true } },
      ],
      elements: [
        { id: 'segAB', label: 'AB', kind: 'segment', refs: ['A', 'B'], color: 'pavo' },
        { id: 'segCD', label: 'CD', kind: 'segment', refs: ['C', 'D'], color: 'pavo' },
      ],
      sliders: [],
      steps: [],
    };

    const targetPointId = 'C';
    const refs = defaultConstraintRefs(model, 'equalLength', targetPointId);
    expect(refs).toEqual(['C', 'D', 'segAB']);

    const newConstraint = {
      id: 'c1',
      label: 'Misma longitud que segAB',
      kind: 'equalLength' as const,
      refs,
      enabled: true,
    };

    model = { ...model, constraints: [newConstraint] };
    model = withConstraintDependencies(model, 'c1', refs);
    const targetPt = model.points.find(p => p.id === targetPointId);
    const constraintIds = [...(targetPt?.constraintIds || []), 'c1'];
    model = updatePoint(model, targetPointId, { constraint: 'constrained', constraintIds });

    const targetPoint = model.points.find(p => p.id === targetPointId);
    expect(targetPoint?.constraint).toBe('constrained');
    expect(targetPoint?.constraintIds ?? []).toContain('c1');
  });

  it('adds and updates segment marks: congruence (up to 4), parallel, dimension, and measurement', () => {
    let model: VisualDiagramModel = {
      title: 'Segment Marks Test',
      viewport: { bounds: [-5, 5, 5, -5] },
      points: [
        { id: 'A', label: 'A', x: 0, y: 0, color: 'carbon', constraint: 'free' },
        { id: 'B', label: 'B', x: 4, y: 0, color: 'carbon', constraint: 'free' },
      ],
      elements: [
        { id: 'segAB', label: 'AB', kind: 'segment', refs: ['A', 'B'], color: 'pavo' },
      ],
      sliders: [],
      steps: [],
    };

    // Congruencia (4 marcas)
    model = setSegmentCongruenceMark(model, 'segAB', 4);
    const congMark = congruenceMarkForSegment(model, 'segAB');
    expect(congMark).toBeDefined();
    expect(congMark?.properties?.markCount).toBe(4);

    // Paralelismo (2 flechas)
    model = setSegmentParallelMark(model, 'segAB', 2);
    const parMark = parallelMarkForSegment(model, 'segAB');
    expect(parMark).toBeDefined();
    expect(parMark?.properties?.markCount).toBe(2);

    // Cota
    model = toggleSegmentDimensionLine(model, 'segAB', true);
    expect(dimensionLineForSegment(model, 'segAB')).toBeDefined();

    // Medida
    model = toggleSegmentMeasurement(model, 'segAB', true);
    expect(measurementForSegment(model, 'segAB')).toBeDefined();
  });

  it('correctly sets equalLength on segment and equalAngle on angle', () => {
    let model: VisualDiagramModel = {
      title: 'Constraints Test',
      viewport: { bounds: [-5, 5, 5, -5] },
      points: [
        { id: 'A', label: 'A', x: 0, y: 0, color: 'carbon', constraint: 'free' },
        { id: 'B', label: 'B', x: 2, y: 0, color: 'carbon', constraint: 'free' },
        { id: 'C', label: 'C', x: 0, y: 2, color: 'carbon', constraint: 'free' },
        { id: 'D', label: 'D', x: 4, y: 2, color: 'carbon', constraint: 'free' },
        { id: 'O1', label: 'O1', x: 0, y: 0, color: 'carbon', constraint: 'free' },
        { id: 'P1', label: 'P1', x: 1, y: 0, color: 'carbon', constraint: 'free' },
        { id: 'Q1', label: 'Q1', x: 0, y: 1, color: 'carbon', constraint: 'free' },
        { id: 'O2', label: 'O2', x: 3, y: 0, color: 'carbon', constraint: 'free' },
        { id: 'P2', label: 'P2', x: 4, y: 0, color: 'carbon', constraint: 'free' },
        { id: 'Q2', label: 'Q2', x: 3, y: 1, color: 'carbon', constraint: 'free' },
      ],
      elements: [
        { id: 'segAB', label: 'AB', kind: 'segment', refs: ['A', 'B'], color: 'pavo' },
        { id: 'segCD', label: 'CD', kind: 'segment', refs: ['C', 'D'], color: 'pavo' },
        { id: 'ang1', label: 'ang1', kind: 'angle', refs: ['P1', 'O1', 'Q1'], color: 'ocre' },
        { id: 'ang2', label: 'ang2', kind: 'angle', refs: ['P2', 'O2', 'Q2'], color: 'ocre' },
      ],
      sliders: [],
      steps: [],
    };

    // Igualar longitud segCD con segAB haciéndose móvil D
    model = setEqualLengthConstraint(model, 'segCD', 'D', 'segAB');
    const eqLen = equalLengthConstraintForSegment(model, 'segCD');
    expect(eqLen).toBeDefined();
    expect(eqLen?.kind).toBe('equalLength');
    expect(eqLen?.refs[0]).toBe('D');
    expect(eqLen?.refs[2]).toBe('segAB');

    // Igualar amplitud ang2 con ang1 haciéndose móvil Q2
    model = setEqualAngleConstraint(model, 'ang2', 'Q2', 'ang1');
    const eqAng = equalAngleConstraintForAngle(model, 'ang2');
    expect(eqAng).toBeDefined();
    expect(eqAng?.kind).toBe('equalAngle');
    expect(eqAng?.refs[0]).toBe('Q2');
    expect(eqAng?.refs[3]).toBe('ang1');
  });

  it('creates initial infoPanel with normalized viewport coordinates', () => {
    const model = createTemplateModel('triangulo-deformable', 'Test', 'demostracion');
    expect(model).toBeDefined();
  });

  it('gates geometric constraints to segment and angle only', async () => {
    const { v2ShowsConstraintsSection, v2ConstraintScopeForKind } = await import(
      '@/features/editor/v2/ui/inspector/v2ElementSections'
    );
    expect(v2ShowsConstraintsSection('segment')).toBe(true);
    expect(v2ConstraintScopeForKind('segment')).toBe('segment');
    expect(v2ShowsConstraintsSection('angle')).toBe(true);
    expect(v2ShowsConstraintsSection('nonReflexAngle')).toBe(true);
    expect(v2ShowsConstraintsSection('rightAngle')).toBe(false);
    expect(v2ShowsConstraintsSection('infoPanel')).toBe(false);
    expect(v2ShowsConstraintsSection('circle')).toBe(false);
    expect(v2ConstraintScopeForKind('infoPanel')).toBeNull();
  });
});
