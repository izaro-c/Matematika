import { describe, expect, it } from 'vitest';
import pointsFixture from '../../fixtures/diagrams/phase3-points-constraints.json';
import primitivesFixture from '../../fixtures/diagrams/phase3-euclidean-primitives.json';
import curvesFixture from '../../fixtures/diagrams/phase3-curves.json';
import poincareFixture from '../../fixtures/diagrams/phase3-poincare.json';
import marksFixture from '../../fixtures/diagrams/phase3-marks-angles.json';
import measurementsFixture from '../../fixtures/diagrams/phase3-measurements.json';
import areasFixture from '../../fixtures/diagrams/phase3-area-grids.json';
import annotationsFixture from '../../fixtures/diagrams/phase3-annotations-layers.json';
import {
  buildDependencyGraph,
  evaluateMathExpression,
  extractMathExpressionIdentifiers,
  parseDiagramSpecV2,
  parseMathExpression,
  resolvePointCoordinates,
  withMovedPoint,
} from '../../../src/shared/diagrams/public';
import { Congruence1Spec } from '../../../src/widgets/diagrams/Axiomas/Congruence1';

const fixtures = [
  pointsFixture,
  primitivesFixture,
  curvesFixture,
  poincareFixture,
  marksFixture,
  measurementsFixture,
  areasFixture,
  annotationsFixture,
];

function modelWithIntersection() {
  const model = structuredClone(primitivesFixture);
  model.elements.push({
    ...model.elements[1],
    id: 'lineOC',
    label: 'Recta OC',
    kind: 'line',
    refs: ['pO', 'pC'],
    target: false,
  });
  model.elements.push({
    ...model.elements[0],
    id: 'intQ',
    label: 'Q',
    kind: 'intersection',
    refs: ['lineOC', 'segAB'],
    order: 80,
    locked: true,
    target: true,
    properties: { restrictToSupports: true },
    style: { pointSize: 5, highlightPointSize: 8 },
  });
  return model;
}

function modelWithLengthConstraint() {
  const model = structuredClone(primitivesFixture);
  model.points = model.points.map(point => point.id === 'pC'
    ? { ...point, constraint: 'constrained', constraintIds: ['equalOCAB'] }
    : point);
  model.elements.push({
    ...model.elements[0],
    id: 'segOC',
    label: 'Segmento OC',
    refs: ['pO', 'pC'],
    order: 20,
  });
  model.constraints = [{
    id: 'equalOCAB',
    label: 'OC tiene la misma longitud que AB',
    kind: 'equalLength',
    refs: ['pC', 'pO', 'segAB'],
    enabled: true,
  }];
  model.dependencies = [
    { sourceId: 'pO', targetId: 'pC', relation: 'constraint', constraintId: 'equalOCAB' },
    { sourceId: 'segAB', targetId: 'pC', relation: 'constraint', constraintId: 'equalOCAB' },
  ];
  return model;
}

describe('Phase 3 geometry language', () => {
  it.each(fixtures.map(fixture => [fixture.extensions.acceptanceFamily, fixture] as const))('validates and serializes the %s family without loss', (_family, fixture) => {
    const parsed = parseDiagramSpecV2(fixture);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(JSON.parse(JSON.stringify(parsed.data))).toEqual(fixture);
  });

  it('covers every required object family with a canonical acceptance fixture', () => {
    const kinds = new Set(fixtures.flatMap(fixture => fixture.elements.map(element => element.kind)));
    [
      'segment', 'line', 'ray', 'polygon', 'circle', 'arc', 'functionCurve', 'parametricCurve',
      'poincareGeodesic', 'poincareArc', 'angle', 'congruenceMark', 'measureTicks', 'perpendicularMark',
      'dimensionLine', 'measurement', 'grid', 'areaDecomposition', 'label', 'formula', 'infoPanel',
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

  it('resolves derived points and enforces explicit point constraints', () => {
    const parsed = parseDiagramSpecV2(pointsFixture);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(resolvePointCoordinates(parsed.data, 'pB')).toEqual({ x: 0, y: 1 });
    const moved = withMovedPoint(parsed.data, 'pC', 4, 3);
    expect(moved.points.find(point => point.id === 'pC')).toMatchObject({ x: 4, y: 0 });
    const graph = buildDependencyGraph(parsed.data);
    expect(graph.edges).toContainEqual({ sourceId: 'pA', targetId: 'pB', relation: 'expression' });
    expect(graph.edges).toContainEqual({ sourceId: 'pA', targetId: 'pC', relation: 'constraint', constraintId: 'horizontalC' });
  });

  it('keeps one authored segment equal in length to another when either source endpoint moves', () => {
    const parsed = parseDiagramSpecV2(modelWithLengthConstraint());
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    const moved = withMovedPoint(parsed.data, 'pA', 4, 0);
    const pointO = moved.points.find(point => point.id === 'pO')!;
    const pointC = moved.points.find(point => point.id === 'pC')!;
    const pointA = moved.points.find(point => point.id === 'pA')!;
    const pointB = moved.points.find(point => point.id === 'pB')!;

    expect(Math.hypot(pointC.x - pointO.x, pointC.y - pointO.y))
      .toBeCloseTo(Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y));
    expect(buildDependencyGraph(moved).edges).toContainEqual({
      sourceId: 'segAB',
      targetId: 'pC',
      relation: 'constraint',
      constraintId: 'equalOCAB',
    });
  });

  it('keeps D on the ray and at distance AB when D itself is moved', () => {
    const moved = withMovedPoint(Congruence1Spec, 'pD', 2, 4);
    const pointA = moved.points.find(point => point.id === 'pA')!;
    const pointB = moved.points.find(point => point.id === 'pB')!;
    const pointC = moved.points.find(point => point.id === 'pC')!;
    const pointD = moved.points.find(point => point.id === 'pD')!;
    const pointDir = moved.points.find(point => point.id === 'pDir')!;
    const rayX = pointDir.x - pointC.x;
    const rayY = pointDir.y - pointC.y;
    const cdX = pointD.x - pointC.x;
    const cdY = pointD.y - pointC.y;

    expect(rayX * cdY - rayY * cdX).toBeCloseTo(0);
    expect(rayX * cdX + rayY * cdY).toBeGreaterThanOrEqual(0);
    expect(Math.hypot(cdX, cdY)).toBeCloseTo(Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y));
  });

  it('keeps an authored point at the midpoint of two moving endpoints', () => {
    const model = structuredClone(pointsFixture);
    model.points = model.points.map(point => point.id === 'pC'
      ? { ...point, constraint: 'constrained', constraintIds: ['midpointC'] }
      : point);
    model.constraints = [{
      id: 'midpointC',
      label: 'C es el punto medio de A y B',
      kind: 'midpoint',
      refs: ['pC', 'pA', 'pB'],
      enabled: true,
    }];
    model.dependencies = [
      { sourceId: 'pA', targetId: 'pB', relation: 'expression' },
      { sourceId: 'pA', targetId: 'pC', relation: 'constraint', constraintId: 'midpointC' },
      { sourceId: 'pB', targetId: 'pC', relation: 'constraint', constraintId: 'midpointC' },
      { sourceId: 'pA', targetId: 'segAC', relation: 'construction' },
      { sourceId: 'pC', targetId: 'segAC', relation: 'construction' },
    ];
    const parsed = parseDiagramSpecV2(model);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    const moved = withMovedPoint(parsed.data, 'pA', 2, 3);
    const pointA = moved.points.find(point => point.id === 'pA')!;
    const pointB = resolvePointCoordinates(moved, 'pB')!;
    const pointC = moved.points.find(point => point.id === 'pC')!;
    expect(pointC).toMatchObject({
      x: (pointA.x + pointB.x) / 2,
      y: (pointA.y + pointB.y) / 2,
    });
  });

  it('validates and resolves an exact intersection between two authored supports', () => {
    const parsed = parseDiagramSpecV2(modelWithIntersection());
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const coordinates = resolvePointCoordinates(parsed.data, 'intQ');
    expect(coordinates?.x).toBeCloseTo(4 / 3);
    expect(coordinates?.y).toBeCloseTo(2 / 3);
  });

  it('rejects intersection references that are not compatible supports', () => {
    const model = modelWithIntersection();
    const intersection = model.elements.find(element => element.id === 'intQ');
    if (intersection) intersection.refs = ['pO', 'segAB'];
    const parsed = parseDiagramSpecV2(model);
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.error.message).toContain('solo admite rectas, segmentos, semirrectas');
  });

  it('keeps constrained Poincaré points inside the represented disk', () => {
    const parsed = parseDiagramSpecV2(poincareFixture);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const moved = withMovedPoint(parsed.data, 'pA', 20, 0);
    const point = moved.points.find(item => item.id === 'pA')!;
    expect(Math.hypot(point.x, point.y)).toBeLessThan(3);
  });

  it('rejects unsafe expressions and dependency cycles with field-level diagnostics', () => {
    const unsafe = structuredClone(curvesFixture);
    unsafe.elements[0].properties!.expression = 'Math.sin(x)';
    const unsafeResult = parseDiagramSpecV2(unsafe);
    expect(unsafeResult.success).toBe(false);
    if (!unsafeResult.success) expect(unsafeResult.error.message).toContain('elements.0.properties.expression');

    const cyclic = structuredClone(pointsFixture);
    cyclic.dependencies.push({ sourceId: 'pB', targetId: 'pA', relation: 'expression' });
    const cyclicResult = parseDiagramSpecV2(cyclic);
    expect(cyclicResult.success).toBe(false);
    if (!cyclicResult.success) expect(cyclicResult.error.message).toContain('forma un ciclo');
  });
});
