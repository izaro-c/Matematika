import { describe, it, expect } from 'vitest';
import {
  addLabelToElement,
  convertAngleKind,
  movementAttractorCreatesCycle,
  removeDiagramElements,
  setPointAttractors,
  createTemplateModel,
  point,
  element,
  generatedElementId,
  modelElements,
  modelPoints,
  pointMode,
  projectPointToSupport,
  relationDraft,
  removeConstraintFromModel,
  setEqualAngleConstraint,
  setEqualLengthConstraint,
  setPointMode,
  toolReferenceLabel,
  toolReferenceCandidates,
} from '../../../../src/fixed-pages/editor/diagrams/model';
import {
  DEFAULT_ANGLE_RADIUS,
  DEFAULT_RIGHT_ANGLE_RADIUS,
  diagramDependencies,
  objectConstructionReferences,
  objectKind,
  objectLabelVisible,
  objectStyle,
  pointPosition,
  type DiagramObject,
  type PointObject,
} from '../../../../src/diagrams/public';
import { buildTargets, targetKind } from '../../../../src/fixed-pages/editor/diagrams/model/scene/selectors';
import { diagramConstraint, findById, pointById, sceneFromParts } from '../../../helpers/diagramSpec';

const attractors = (model: { objects: DiagramObject[] }, id: string) => findById<PointObject>(model, id).interaction?.attractorIds;

describe('Diagram Model & Selectors', () => {
  it('should construct visual point with correct options', () => {
    const pt = point('pA', 'A', 2.5, -3.1, true, 'canela');
    expect(pt.id).toBe('pA');
    expect(pt.label).toBe('A');
    expect(pointPosition(pt)!.x).toBe(2.5);
    expect(pointPosition(pt)!.y).toBeCloseTo(-3.1);
    expect(pt.mobility).toEqual({ type: 'fixed' });
    expect(pt.color).toBe('canela');
    expect(pointMode(pt)).toBe('fixed');
  });

  it('replaces the fixed mobility when the point switches to another movement mode', () => {
    const model = createTemplateModel('circunferencia', 'Restricciones', 'definicion');
    const source = modelPoints(model)[0];
    const support = modelElements(model)[0].id;
    const fixedModel = setPointMode(model, source.id, 'fixed');
    expect(pointMode(pointById(fixedModel, source.id))).toBe('fixed');

    const gliderModel = setPointMode(fixedModel, source.id, 'glider', { gliderTarget: support });
    const glider = pointById(gliderModel, source.id);

    expect(pointMode(glider)).toBe('glider');
    expect(glider.mobility).toEqual({ type: 'on-support', support });
  });

  it('should construct elements with correct references', () => {
    const el = element('segAB', 'Segmento AB', 'segment', ['pA', 'pB'], 'carbon');
    expect(el.id).toBe('segAB');
    expect(objectKind(el)).toBe('segment');
    expect(objectConstructionReferences(el)).toEqual(['pA', 'pB']);
    expect(el.color).toBe('carbon');
  });

  it('creates angular marks with explicit valid radii and identifies the vertex slot', () => {
    expect(objectStyle(element('angleABC', 'Ángulo ABC', 'angle', ['pA', 'pB', 'pC'], 'ocre'))?.angleRadius).toBe(DEFAULT_ANGLE_RADIUS);
    expect(objectStyle(element('minorABC', 'Ángulo no reflejo ABC', 'nonReflexAngle', ['pA', 'pB', 'pC'], 'ocre'))?.angleRadius).toBe(DEFAULT_ANGLE_RADIUS);
    expect(objectStyle(element('rightABC', 'Ángulo recto ABC', 'rightAngle', ['pA', 'pB', 'pC'], 'ocre'))?.angleRadius).toBe(DEFAULT_RIGHT_ANGLE_RADIUS);
    expect(toolReferenceLabel('angle', 0)).toBe('Punto del primer lado');
    expect(toolReferenceLabel('angle', 1)).toBe('Vértice');
    expect(toolReferenceLabel('angle', 2)).toBe('Punto del segundo lado');
    expect(toolReferenceLabel('nonReflexAngle', 1)).toBe('Vértice');
  });

  it('should create template models successfully', () => {
    const model = createTemplateModel('circunferencia', 'Círculo de prueba', 'definicion');
    expect(model.title).toBe('Círculo de prueba');
    expect(modelPoints(model)).toHaveLength(2); // O and A
    expect(modelPoints(model).every(item => objectLabelVisible(item) === true)).toBe(true);
    expect(modelElements(model).some(e => objectKind(e) === 'circle')).toBe(true);
  });

  it('adds one editable label directly to an element and reuses it on repeated requests', () => {
    const model = createTemplateModel('triangulo-deformable', 'Etiquetas', 'definicion');
    const source = modelElements(model).find(item => objectKind(item) === 'segment')!;
    const first = addLabelToElement(model, source.id);
    const label = findById(first.model, first.labelId);

    expect(label).toMatchObject({
      objectType: 'annotation',
      variant: 'label',
      anchor: { type: 'object', object: source.id, parameter: 0.5 },
      visible: true,
      target: false,
    });
    expect(objectStyle(label)).toMatchObject({ textOffset: [0.04, 0.04], labelSize: 14 });
    expect(diagramDependencies(first.model.objects)).toContainEqual({ sourceId: source.id, targetId: label.id, relation: 'construction' });
    expect(toolReferenceCandidates(model, 'label').map(item => item.id)).toContain(source.id);
    expect(toolReferenceLabel('label', 0)).toBe('Objeto etiquetado');

    const repeated = addLabelToElement(first.model, source.id);
    expect(repeated.labelId).toBe(label.id);
    expect(repeated.model.objects.filter(item => objectKind(item) === 'label' && objectConstructionReferences(item)[0] === source.id)).toHaveLength(1);
  });

  it('removes attached labels without leaving dangling step, group or dependency references', () => {
    const base = createTemplateModel('triangulo-deformable', 'Etiquetas', 'definicion');
    const source = modelElements(base).find(item => objectKind(item) === 'segment')!;
    const labelled = addLabelToElement(base, source.id);
    const removed = removeDiagramElements(labelled.model, [labelled.labelId]);

    expect(removed.objects.some(item => item.id === labelled.labelId)).toBe(false);
    expect(removed.steps.every(item => !item.visibleTargets.includes(labelled.labelId) && !item.objectStates?.[labelled.labelId])).toBe(true);
    expect(removed.groups.every(item => !item.memberIds.includes(labelled.labelId))).toBe(true);
    expect(diagramDependencies(removed.objects).every(item => item.sourceId !== labelled.labelId && item.targetId !== labelled.labelId)).toBe(true);
  });

  it('keeps attractor dependencies synchronized and rejects supports that would close a cycle', () => {
    const base = createTemplateModel('triangulo-deformable', 'Magnetismo', 'definicion');
    const point = modelPoints(base)[0];
    const cyclicSupport = modelElements(base).find(item => objectConstructionReferences(item).includes(point.id))!;
    const safeSupport = modelElements(base).find(item => !objectConstructionReferences(item).includes(point.id))!;

    expect(movementAttractorCreatesCycle(base, point.id, cyclicSupport.id)).toBe(true);
    const rejected = setPointAttractors(base, point.id, [cyclicSupport.id]);
    expect(attractors(rejected, point.id)).toBeUndefined();

    const accepted = setPointAttractors(base, point.id, [safeSupport.id]);
    expect(attractors(accepted, point.id)).toEqual([safeSupport.id]);
    expect(diagramDependencies(accepted.objects)).toContainEqual({ sourceId: safeSupport.id, targetId: point.id, relation: 'constraint' });
    const cleared = setPointAttractors(accepted, point.id, []);
    expect(diagramDependencies(cleared.objects)).not.toContainEqual({ sourceId: safeSupport.id, targetId: point.id, relation: 'constraint' });
  });

  it('allows attraction to the opposite perpendicular bisector when same-side constraints couple the triangle vertices', () => {
    const base = createTemplateModel('triangulo-deformable', 'Mediatrices', 'definicion');
    const model = sceneFromParts({
      ...base,
      objects: [
        ...base.objects,
        element('midAB', 'Punto medio de AB', 'midpoint', ['pA', 'pB'], 'terracota'),
        element('lineMediatrizAB', 'Mediatriz de AB', 'perpendicular', ['pA', 'pB', 'midAB'], 'pavo'),
        element('midBC', 'Punto medio de BC', 'midpoint', ['pB', 'pC'], 'terracota'),
        element('lineMediatrizBC', 'Mediatriz de BC', 'perpendicular', ['pB', 'pC', 'midBC'], 'pavo'),
        element('midCA', 'Punto medio de CA', 'midpoint', ['pC', 'pA'], 'terracota'),
        element('lineMediatrizCA', 'Mediatriz de CA', 'perpendicular', ['pC', 'pA', 'midCA'], 'pavo'),
      ],
      constraints: [
        diagramConstraint('sameA', 'A no cruza BC', 'sameSide', ['pA', 'pB', 'pC']),
        diagramConstraint('sameB', 'B no cruza CA', 'sameSide', ['pB', 'pC', 'pA']),
        diagramConstraint('sameC', 'C no cruza AB', 'sameSide', ['pC', 'pA', 'pB']),
      ],
    });

    expect(movementAttractorCreatesCycle(model, 'pA', 'lineMediatrizBC')).toBe(false);
    expect(movementAttractorCreatesCycle(model, 'pA', 'lineMediatrizAB')).toBe(true);

    const withA = setPointAttractors(model, 'pA', ['lineMediatrizBC']);
    expect(movementAttractorCreatesCycle(withA, 'pB', 'lineMediatrizCA')).toBe(false);
    const withB = setPointAttractors(withA, 'pB', ['lineMediatrizCA']);
    expect(movementAttractorCreatesCycle(withB, 'pC', 'lineMediatrizAB')).toBe(false);
    const edited = setPointAttractors(withB, 'pC', ['lineMediatrizAB']);

    expect(['pA', 'pB', 'pC'].map(id => attractors(edited, id))).toEqual([
      ['lineMediatrizBC'],
      ['lineMediatrizCA'],
      ['lineMediatrizAB'],
    ]);
    expect(diagramDependencies(edited.objects)).toEqual(expect.arrayContaining([
      { sourceId: 'lineMediatrizBC', targetId: 'pA', relation: 'constraint' },
      { sourceId: 'lineMediatrizCA', targetId: 'pB', relation: 'constraint' },
      { sourceId: 'lineMediatrizAB', targetId: 'pC', relation: 'constraint' },
    ]));
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
    const pP = pointById(model, 'pP');
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
      objects: [
        point('pA', 'A', -3, 1),
        point('pB', 'B', -1, 1),
        point('pC', 'C', 1, -1),
        point('pD', 'D', 3, -1, false, 'terracota', 'glider', 'rayCDir'),
        point('pDir', 'dir', 4, 0),
        element('segAB', 'Segmento AB', 'segment', ['pA', 'pB'], 'carbon'),
        element('segCD', 'Segmento CD', 'segment', ['pC', 'pD'], 'carbon'),
        element('rayCDir', 'Semirrecta desde C', 'ray', ['pC', 'pDir'], 'pavo'),
      ],
      relations: [],
    };

    const edited = setEqualLengthConstraint(model, 'segCD', 'pD', 'segAB');
    const pointD = pointById(edited, 'pD');
    const equalLength = edited.relations.find(item => item.type === 'equal-length');
    const onRay = edited.relations.find(item => item.type === 'on-support');
    expect(equalLength).toBeDefined();
    expect(onRay).toBeDefined();
    if (!equalLength || !onRay) return;

    expect(pointD.mobility).toEqual({ type: 'constrained', relationIds: expect.arrayContaining([equalLength.id, onRay.id]) });
    expect(relationDraft(equalLength, edited.objects).refs).toEqual(['pD', 'pC', 'segAB']);
    expect(relationDraft(onRay, edited.objects).refs).toEqual(['pD', 'rayCDir']);

    const removed = removeConstraintFromModel(edited, equalLength.id);
    expect(removed.relations.some(item => item.id === equalLength.id)).toBe(false);
    expect(pointById(removed, 'pD').mobility).toEqual({ type: 'constrained', relationIds: [onRay.id] });
  });

  it('creates an equal-angle relation from the selected angular object', () => {
    const base = createTemplateModel('modelo-estatico', 'Ángulos', 'definicion');
    const model = {
      ...base,
      objects: [
        point('pA', 'A', 2, 0),
        point('pV', 'V', 0, 0, true),
        point('pB', 'B', 0, 2),
        point('pC', 'C', 5, 0),
        point('pW', 'W', 4, 0, true),
        point('pD', 'D', 4.5, Math.sqrt(3) / 2),
        element('angleAVB', 'Ángulo AVB', 'nonReflexAngle', ['pA', 'pV', 'pB'], 'ocre'),
        element('angleCWD', 'Ángulo CWD', 'nonReflexAngle', ['pC', 'pW', 'pD'], 'pavo'),
      ],
      relations: [],
    };

    const edited = setEqualAngleConstraint(model, 'angleAVB', 'pB', 'angleCWD');
    const equalAngle = edited.relations.find(item => item.type === 'equal-angle');
    expect(equalAngle).toBeDefined();
    if (!equalAngle) return;

    expect(relationDraft(equalAngle, edited.objects).refs).toEqual(['pB', 'pV', 'pA', 'angleCWD', 'angleAVB']);
    expect(pointById(edited, 'pB').mobility).toEqual({ type: 'constrained', relationIds: [equalAngle.id] });

    const converted = convertAngleKind(edited, 'angleAVB', 'angle');
    expect(['angleAVB', 'angleCWD'].map(id => objectKind(findById(converted, id)))).toEqual(['angle', 'angle']);
    expect(converted.relations).toEqual(edited.relations);

    const removed = removeConstraintFromModel(edited, equalAngle.id);
    expect(removed.relations.some(item => item.id === equalAngle.id)).toBe(false);
    expect(pointMode(pointById(removed, 'pB'))).toBe('free');
  });
});
