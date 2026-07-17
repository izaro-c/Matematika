import { describe, it, expect } from 'vitest';
import {
  addLabelToElement,
  createTemplateModel,
  point,
  element,
  generatedElementId,
  projectPointToSupport,
  removeConstraintFromModel,
  setEqualAngleConstraint,
  setEqualLengthConstraint,
  toolReferenceLabel,
  toolReferenceCandidates,
  updatePoint,
} from '../../../../src/features/editor/diagrams/model/commands';
import { DEFAULT_ANGLE_RADIUS, DEFAULT_RIGHT_ANGLE_RADIUS } from '../../../../src/shared/diagrams/public';
import { buildTargets, targetKind } from '../../../../src/features/editor/diagrams/model/selectors';

describe('Diagram Model & Selectors', () => {
  it('should construct visual point with correct options', () => {
    const pt = point('pA', 'A', 2.5, -3.1, true, 'salvia');
    expect(pt.id).toBe('pA');
    expect(pt.label).toBe('A');
    expect(pt.x).toBe(2.5);
    expect(pt.y).toBe(-3.1);
    expect(pt.fixed).toBe(true);
    expect(pt.color).toBe('salvia');
    expect(pt.constraint).toBe('fixed');
  });

  it('keeps the legacy fixed flag consistent with the selected movement constraint', () => {
    const model = createTemplateModel('circunferencia', 'Restricciones', 'definicion');
    const source = model.points[0];
    const fixedModel = {
      ...model,
      points: model.points.map(item => item.id === source.id
        ? { ...item, fixed: true, constraint: 'fixed' as const }
        : item),
    };

    const gliderModel = updatePoint(fixedModel, source.id, {
      constraint: 'glider',
      gliderTarget: model.elements[0].id,
    });
    const glider = gliderModel.points.find(item => item.id === source.id);

    expect(glider).toMatchObject({
      fixed: false,
      constraint: 'glider',
      gliderTarget: model.elements[0].id,
    });
  });

  it('should construct elements with correct references', () => {
    const el = element('segAB', 'Segmento AB', 'segment', ['pA', 'pB'], 'carbon');
    expect(el.id).toBe('segAB');
    expect(el.kind).toBe('segment');
    expect(el.refs).toEqual(['pA', 'pB']);
    expect(el.color).toBe('carbon');
  });

  it('creates angular marks with explicit valid radii and identifies the vertex slot', () => {
    expect(element('angleABC', 'Ángulo ABC', 'angle', ['pA', 'pB', 'pC'], 'ocre').style?.angleRadius).toBe(DEFAULT_ANGLE_RADIUS);
    expect(element('minorABC', 'Ángulo no reflejo ABC', 'nonReflexAngle', ['pA', 'pB', 'pC'], 'ocre').style?.angleRadius).toBe(DEFAULT_ANGLE_RADIUS);
    expect(element('rightABC', 'Ángulo recto ABC', 'rightAngle', ['pA', 'pB', 'pC'], 'ocre').style?.angleRadius).toBe(DEFAULT_RIGHT_ANGLE_RADIUS);
    expect(toolReferenceLabel('angle', 0)).toBe('Punto del primer lado');
    expect(toolReferenceLabel('angle', 1)).toBe('Vértice');
    expect(toolReferenceLabel('angle', 2)).toBe('Punto del segundo lado');
    expect(toolReferenceLabel('nonReflexAngle', 1)).toBe('Vértice');
  });

  it('should create template models successfully', () => {
    const model = createTemplateModel('circunferencia', 'Círculo de prueba', 'definicion');
    expect(model.title).toBe('Círculo de prueba');
    expect(model.points).toHaveLength(2); // O and A
    expect(model.points.every(item => item.showLabel === true)).toBe(true);
    expect(model.elements.some(e => e.kind === 'circle')).toBe(true);
    expect(model.showLabels).toBe(true);
  });

  it('adds one editable label directly to an element and reuses it on repeated requests', () => {
    const model = createTemplateModel('triangulo-deformable', 'Etiquetas', 'definicion');
    const source = model.elements.find(item => item.kind === 'segment')!;
    const first = addLabelToElement(model, source.id);
    const label = first.model.elements.find(item => item.id === first.labelId)!;

    expect(label).toMatchObject({
      kind: 'label',
      refs: [source.id],
      visible: true,
      target: false,
      properties: { anchorMode: 'reference', anchorParameter: 0.5 },
      style: { textOffset: [0.04, 0.04], labelSize: 14 },
    });
    expect(first.model.dependencies).toContainEqual({ sourceId: source.id, targetId: label.id, relation: 'construction' });
    expect(toolReferenceCandidates(model, 'label').map(item => item.id)).toContain(source.id);
    expect(toolReferenceLabel('label', 0)).toBe('Objeto etiquetado');

    const repeated = addLabelToElement(first.model, source.id);
    expect(repeated.labelId).toBe(label.id);
    expect(repeated.model.elements.filter(item => item.kind === 'label' && item.refs[0] === source.id)).toHaveLength(1);
  });

  it('should map element kinds to target kinds correctly', () => {
    expect(targetKind('segment')).toBe('segment');
    expect(targetKind('perpendicular')).toBe('line');
    expect(targetKind('midpoint')).toBe('point');
    expect(targetKind('angle')).toBe('angle');
    expect(targetKind('nonReflexAngle')).toBe('angle');
    expect(targetKind('text')).toBe('measurement');
  });

  it('should generate build targets registry for a model', () => {
    const model = createTemplateModel('circunferencia', 'Test', 'definicion');
    const targets = buildTargets(model);
    expect(targets.length).toBeGreaterThan(0);
    expect(targets.some(t => t.id === 'pO')).toBe(true);
  });

  it('should project points to glider supports', () => {
    const model = createTemplateModel('lugar-geometrico', 'Lugar', 'definicion');
    const pP = model.points.find(p => p.id === 'pP')!;
    const projected = projectPointToSupport(model, pP, { x: 0.5, y: 1 });
    // Glide target is lineMediatriz, which is x=0 mediatriz of AB.
    // Projected x coordinate must be exactly 0
    expect(projected.x).toBeCloseTo(0, 5);
  });

  it('should generate unique component element IDs', () => {
    const existing = [
      element('segAB', 'Segment', 'segment', ['pA', 'pB'], 'carbon')
    ];
    const nextId = generatedElementId('segment', ['pA', 'pB'], existing);
    expect(nextId).toBe('segAB_2');
  });

  it('creates an equal-length relation from a segment while preserving a glider support', () => {
    const base = createTemplateModel('modelo-estatico', 'Longitudes', 'definicion');
    const model = {
      ...base,
      points: [
        point('pA', 'A', -3, 1),
        point('pB', 'B', -1, 1),
        point('pC', 'C', 1, -1),
        point('pD', 'D', 3, -1, false, 'terracota', 'glider', 'rayCDir'),
        point('pDir', 'dir', 4, 0),
      ],
      elements: [
        element('segAB', 'Segmento AB', 'segment', ['pA', 'pB'], 'carbon'),
        element('segCD', 'Segmento CD', 'segment', ['pC', 'pD'], 'carbon'),
        element('rayCDir', 'Semirrecta desde C', 'ray', ['pC', 'pDir'], 'pavo'),
      ],
      constraints: [],
      dependencies: [],
    };

    const edited = setEqualLengthConstraint(model, 'segCD', 'pD', 'segAB');
    const pointD = edited.points.find(item => item.id === 'pD')!;
    const equalLength = edited.constraints?.find(item => item.kind === 'equalLength');
    const onRay = edited.constraints?.find(item => item.kind === 'on');
    expect(equalLength).toBeDefined();
    expect(onRay).toBeDefined();
    if (!equalLength || !onRay) return;

    expect(pointD).toMatchObject({
      constraint: 'constrained',
      constraintIds: expect.arrayContaining([equalLength.id, onRay.id]),
    });
    expect(equalLength.refs).toEqual(['pD', 'pC', 'segAB']);
    expect(onRay.refs).toEqual(['pD', 'rayCDir']);

    const removed = removeConstraintFromModel(edited, equalLength.id);
    expect(removed.constraints?.some(item => item.id === equalLength.id)).toBe(false);
    expect(removed.points.find(item => item.id === 'pD')).toMatchObject({
      constraint: 'constrained',
      constraintIds: [onRay.id],
    });
  });

  it('creates an equal-angle relation from the selected angular object', () => {
    const base = createTemplateModel('modelo-estatico', 'Ángulos', 'definicion');
    const model = {
      ...base,
      points: [
        point('pA', 'A', 2, 0),
        point('pV', 'V', 0, 0, true),
        point('pB', 'B', 0, 2),
        point('pC', 'C', 5, 0),
        point('pW', 'W', 4, 0, true),
        point('pD', 'D', 4.5, Math.sqrt(3) / 2),
      ],
      elements: [
        element('angleAVB', 'Ángulo AVB', 'nonReflexAngle', ['pA', 'pV', 'pB'], 'ocre'),
        element('angleCWD', 'Ángulo CWD', 'nonReflexAngle', ['pC', 'pW', 'pD'], 'pavo'),
      ],
      constraints: [],
      dependencies: [],
    };

    const edited = setEqualAngleConstraint(model, 'angleAVB', 'pB', 'angleCWD');
    const equalAngle = edited.constraints?.find(item => item.kind === 'equalAngle');
    expect(equalAngle).toBeDefined();
    if (!equalAngle) return;

    expect(equalAngle.refs).toEqual(['pB', 'pV', 'pA', 'angleCWD', 'angleAVB']);
    expect(edited.points.find(item => item.id === 'pB')).toMatchObject({
      constraint: 'constrained',
      constraintIds: [equalAngle.id],
    });
    expect(edited.dependencies).toEqual(expect.arrayContaining([
      { sourceId: 'angleCWD', targetId: 'pB', relation: 'constraint', constraintId: equalAngle.id },
    ]));

    const removed = removeConstraintFromModel(edited, equalAngle.id);
    expect(removed.constraints?.some(item => item.id === equalAngle.id)).toBe(false);
    expect(removed.points.find(item => item.id === 'pB')).toMatchObject({ constraint: 'free' });
  });
});
