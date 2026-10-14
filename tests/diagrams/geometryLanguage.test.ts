import { describe, expect, it } from 'vitest';
import pointsFixture from '../fixtures/diagrams/points-constraints.json';
import primitivesFixture from '../fixtures/diagrams/euclidean-primitives.json';
import curvesFixture from '../fixtures/diagrams/curves.json';
import poincareFixture from '../fixtures/diagrams/poincare.json';
import marksFixture from '../fixtures/diagrams/marks-angles.json';
import measurementsFixture from '../fixtures/diagrams/measurements.json';
import areasFixture from '../fixtures/diagrams/area-grids.json';
import annotationsFixture from '../fixtures/diagrams/annotations-layers.json';
import {
  buildDependencyGraph,
  evaluateMathExpression,
  expressionVariables,
  extractMathExpressionIdentifiers,
  objectKind,
  parseDiagramSpecV3,
  parseMathExpression,
  resolvePointCoordinates,
  withMovedPoint,
  type AngleObject,
  type DiagramSpec,
} from '@/diagrams/public';
import { element, point, withPointMode } from '@/fixed-pages/editor/diagrams/model';
import { Congruence1Spec } from '../../content/diagrams/Axiomas/Congruence1';
import { findById, positionOf, relationFor } from '../helpers/diagramSpec';

const fixtures = [
  pointsFixture,
  primitivesFixture,
  curvesFixture,
  poincareFixture,
  marksFixture,
  measurementsFixture,
  areasFixture,
  annotationsFixture,
] as unknown as DiagramSpec[];

function clone(fixture: unknown): DiagramSpec {
  return structuredClone(fixture) as DiagramSpec;
}

function modelWithIntersection(): DiagramSpec {
  const model = clone(primitivesFixture);
  model.objects.push(
    { ...element('lineOC', 'Recta OC', 'line', ['pO', 'pC'], 'pavo', false) },
    { ...element('intQ', 'Q', 'intersection', ['lineOC', 'segAB'], 'terracota'), order: 80, locked: true, appearance: { size: 5, highlightSize: 8 } },
  );
  return model;
}

function modelWithLengthConstraint(): DiagramSpec {
  const model = clone(primitivesFixture);
  model.objects = model.objects.map(object => object.id === 'pC' && object.objectType === 'point'
    ? withPointMode(object as never, 'constrained', { relationIds: ['equalOCAB'] })
    : object);
  model.objects.push({ ...element('segOC', 'Segmento OC', 'segment', ['pO', 'pC'], 'carbon'), order: 20 });
  model.relations = [relationFor('equalLength', 'equalOCAB', 'OC tiene la misma longitud que AB', ['pC', 'pO', 'segAB'], model.objects)];
  return model;
}

function modelWithAngleConstraint(): DiagramSpec {
  const model = clone(marksFixture);
  const targetAngle = model.objects.find((object): object is AngleObject => object.objectType === 'angle' && object.sweep === 'non-reflex' && object.marker === 'arc')!;
  model.objects = [
    { ...point('pA', 'A', 2, 0), order: 0 },
    { ...point('pV', 'V', 0, 0, true), locked: true, order: 1 },
    { ...withPointMode(point('pB', 'B', 0, 2), 'constrained', { relationIds: ['equalAVBCWD'] }), order: 2 },
    { ...point('pC', 'C', 5, 0), order: 3 },
    { ...point('pW', 'W', 4, 0, true), locked: true, order: 4 },
    { ...point('pD', 'D', 4.5, Math.sqrt(3) / 2), order: 5 },
    { ...targetAngle, id: 'angleAVB', label: 'Ángulo AVB', points: ['pA', 'pV', 'pB'], order: 10 },
    { ...targetAngle, id: 'angleCWD', label: 'Ángulo CWD', points: ['pC', 'pW', 'pD'], color: 'pavo', order: 11 },
  ];
  model.relations = [relationFor('equalAngle', 'equalAVBCWD', 'AVB tiene la misma amplitud que CWD', ['pB', 'pV', 'pA', 'angleCWD', 'angleAVB'], model.objects)];
  return model;
}

describe('Declarative geometry language', () => {
  it.each(fixtures.map(fixture => [fixture.componentId, fixture] as const))('validates and serializes the %s family without loss', (_family, fixture) => {
    const parsed = parseDiagramSpecV3(fixture);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(JSON.parse(JSON.stringify(parsed.data))).toEqual(fixture);
  });

  it('covers every required object family with a canonical acceptance fixture', () => {
    const kinds = new Set(fixtures.flatMap(fixture => fixture.objects.map(object => objectKind(object))));
    [
      'segment', 'line', 'ray', 'polygon', 'circle', 'arc', 'functionCurve', 'parametricCurve',
      'poincareGeodesic', 'poincareArc', 'angle', 'nonReflexAngle', 'congruenceMark', 'parallelMark', 'measureTicks',
      'dimensionLine', 'measurement', 'grid', 'areaDecomposition', 'label', 'formula', 'infoPanel', 'rightAngle',
    ].forEach(kind => expect(kinds.has(kind)).toBe(true));
  });

  it('evaluates only the mathematical DSL and rejects arbitrary JavaScript syntax', () => {
    expect(evaluateMathExpression('sqrt(a^2 + b^2)', { a: 3, b: 4 })).toBe(5);
    expect(evaluateMathExpression('sin(pi / 2) + max(2, 3)')).toBeCloseTo(4);
    expect(extractMathExpressionIdentifiers('pA.x + 2 * sliderT')).toEqual(['pA.x', 'sliderT']);
    expect(() => parseMathExpression('globalThis.alert(1)')).toThrow(/no está permitida/);
    expect(() => parseMathExpression('(() => 42)()')).toThrow(/no está permitido|esperaba/);
    expect(() => parseMathExpression('a; process.exit()')).toThrow(/no está permitido/);
  });

  it('validates condition arity instead of silently ignoring arguments', () => {
    expect(evaluateMathExpression('eq(2,2,2)')).toBe(1);
    expect(evaluateMathExpression('eq(2,2,3)')).toBe(0);
    expect(() => parseMathExpression('approx(90,90,0,1)')).toThrow(/entre 2 y 3 argumentos/);
    expect(() => parseMathExpression('gt(2,1,0)')).toThrow(/necesita 2 argumentos/);
  });

  it('exports radians and degrees for oriented and non-reflex angles', () => {
    const parsed = parseDiagramSpecV3(marksFixture);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const variables = expressionVariables(parsed.data);

    expect(variables['angleAVB.radians']).toBeCloseTo(3 * Math.PI / 2);
    expect(variables['angleAVB.degrees']).toBeCloseTo(270);
    expect(variables['nonReflexAngleAVB.radians']).toBeCloseTo(Math.PI / 2);
    expect(variables['nonReflexAngleAVB.degrees']).toBeCloseTo(90);
    expect(variables['angleAVB.value']).toBe(variables['angleAVB.radians']);
    expect(evaluateMathExpression(
      'angleAVB.degrees + nonReflexAngleAVB.radians',
      variables,
    )).toBeCloseTo(270 + Math.PI / 2);
  });

  it('resolves derived points and enforces explicit point constraints', () => {
    const parsed = parseDiagramSpecV3(pointsFixture);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(resolvePointCoordinates(parsed.data, 'pB')).toEqual({ x: 0, y: 1 });
    const moved = withMovedPoint(parsed.data, 'pC', 4, 3);
    expect(positionOf(moved, 'pC')).toMatchObject({ x: 4, y: 0 });
    const graph = buildDependencyGraph(parsed.data);
    expect(graph.edges).toContainEqual({ sourceId: 'pA', targetId: 'pB', relation: 'expression' });
    expect(graph.edges).toContainEqual({ sourceId: 'pA', targetId: 'pC', relation: 'constraint', constraintId: 'horizontalC' });
  });

  it('keeps one authored segment equal in length to another when either source endpoint moves', () => {
    const parsed = parseDiagramSpecV3(modelWithLengthConstraint());
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    const moved = withMovedPoint(parsed.data, 'pA', 4, 0);
    const pointO = positionOf(moved, 'pO');
    const pointC = positionOf(moved, 'pC');
    const pointA = positionOf(moved, 'pA');
    const pointB = positionOf(moved, 'pB');

    expect(Math.hypot(pointC.x - pointO.x, pointC.y - pointO.y))
      .toBeCloseTo(Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y));
    expect(buildDependencyGraph(moved).edges).toContainEqual({
      sourceId: 'segAB',
      targetId: 'pC',
      relation: 'constraint',
      constraintId: 'equalOCAB',
    });
  });

  it('keeps one authored angle equal to another when the source angle changes', () => {
    const parsed = parseDiagramSpecV3(modelWithAngleConstraint());
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    const initiallyResolved = withMovedPoint(parsed.data, 'pB', 0, 2);
    const pointB = positionOf(initiallyResolved, 'pB');
    expect(pointB.x).toBeCloseTo(1);
    expect(pointB.y).toBeCloseTo(Math.sqrt(3));

    const movedSource = withMovedPoint(initiallyResolved, 'pD', 4, 2);
    const updatedB = positionOf(movedSource, 'pB');
    expect(updatedB.x).toBeCloseTo(0);
    expect(updatedB.y).toBeCloseTo(2);
    expect(buildDependencyGraph(movedSource).edges).toContainEqual({
      sourceId: 'angleCWD',
      targetId: 'pB',
      relation: 'constraint',
      constraintId: 'equalAVBCWD',
    });
  });

  it('rejects equal-angle relations that mix oriented and non-reflex angles', () => {
    const model = modelWithAngleConstraint();
    const sourceAngle = findById<AngleObject>(model, 'angleCWD');
    sourceAngle.sweep = 'directed';
    const parsed = parseDiagramSpecV3(model);
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.error.message).toContain('ángulos del mismo tipo');
  });

  it('keeps D on the ray and at distance AB when D itself is moved', () => {
    const moved = withMovedPoint(Congruence1Spec, 'pD', 2, 4);
    const pointA = positionOf(moved, 'pA');
    const pointB = positionOf(moved, 'pB');
    const pointC = positionOf(moved, 'pC');
    const pointD = positionOf(moved, 'pD');
    const pointDir = positionOf(moved, 'pDir');
    const rayX = pointDir.x - pointC.x;
    const rayY = pointDir.y - pointC.y;
    const cdX = pointD.x - pointC.x;
    const cdY = pointD.y - pointC.y;

    expect(rayX * cdY - rayY * cdX).toBeCloseTo(0);
    expect(rayX * cdX + rayY * cdY).toBeGreaterThanOrEqual(0);
    expect(Math.hypot(cdX, cdY)).toBeCloseTo(Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y));
  });

  it('keeps an authored point at the midpoint of two moving endpoints', () => {
    const model = clone(pointsFixture);
    model.objects = model.objects.map(object => object.id === 'pC' && object.objectType === 'point'
      ? { ...object, definition: { type: 'midpoint', points: ['pA', 'pB'] }, mobility: { type: 'fixed' } }
      : object);
    model.relations = [];
    const parsed = parseDiagramSpecV3(model);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    const moved = withMovedPoint(parsed.data, 'pA', 2, 3);
    const pointA = positionOf(moved, 'pA');
    const pointB = resolvePointCoordinates(moved, 'pB')!;
    const pointC = resolvePointCoordinates(moved, 'pC')!;
    expect(pointC).toMatchObject({
      x: (pointA.x + pointB.x) / 2,
      y: (pointA.y + pointB.y) / 2,
    });
  });

  it('validates and resolves an exact intersection between two authored supports', () => {
    const parsed = parseDiagramSpecV3(modelWithIntersection());
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const coordinates = resolvePointCoordinates(parsed.data, 'intQ');
    expect(coordinates?.x).toBeCloseTo(4 / 3);
    expect(coordinates?.y).toBeCloseTo(2 / 3);
  });

  it('rejects intersection references that are not compatible supports', () => {
    const model = modelWithIntersection();
    const intersection = findById(model, 'intQ');
    if (intersection.objectType === 'point' && intersection.definition.type === 'intersection') intersection.definition.supports = ['pO', 'segAB'];
    const parsed = parseDiagramSpecV3(model);
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.error.message).toContain('debe ser un soporte lineal');
  });

  it('keeps constrained Poincaré points inside the represented disk', () => {
    const parsed = parseDiagramSpecV3(poincareFixture);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const moved = withMovedPoint(parsed.data, 'pA', 20, 0);
    const moved_A = positionOf(moved, 'pA');
    expect(Math.hypot(moved_A.x, moved_A.y)).toBeLessThan(3);
  });

  it('rejects unsafe expressions and dependency cycles with field-level diagnostics', () => {
    const unsafe = clone(curvesFixture);
    const curve = unsafe.objects.find(object => object.id === 'functionSin');
    if (curve?.objectType === 'path' && curve.geometry.type === 'function') curve.geometry.expression = 'Math.sin(x)';
    const unsafeResult = parseDiagramSpecV3(unsafe);
    expect(unsafeResult.success).toBe(false);
    if (!unsafeResult.success) expect(unsafeResult.error.message).toContain('geometry.expression');

    const cyclic = clone(pointsFixture);
    cyclic.objects = cyclic.objects.map(object => object.id === 'pA' && object.objectType === 'point'
      ? { ...object, definition: { type: 'expression', x: 'pB.x - 2', y: 'pB.y - 1', fallback: [0, 0] }, mobility: { type: 'fixed' } }
      : object);
    const cyclicResult = parseDiagramSpecV3(cyclic);
    expect(cyclicResult.success).toBe(false);
    if (!cyclicResult.success) expect(cyclicResult.error.message).toContain('ciclo');
  });

  it('does not treat angular visibility as a geometric dependency cycle', () => {
    const model = clone(marksFixture);
    findById(model, 'angleAVB').visibleWhen = 'gt(angleAVB.degrees, 180)';

    const parsed = parseDiagramSpecV3(model);

    expect(parsed.success).toBe(true);
  });
});
