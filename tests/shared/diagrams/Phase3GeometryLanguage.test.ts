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
      'poincareGeodesic', 'poincareArc', 'angle', 'congruenceMark', 'perpendicularMark',
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
