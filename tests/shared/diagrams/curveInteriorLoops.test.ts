import { describe, expect, it } from 'vitest';
import { element } from '../../../src/features/editor/diagrams/model/diagramElements';
import {
  resolveCurveAreaPolygon,
  resolveCurveAreaPolygons,
  resolveCurveInteriorPolygon,
  sampleCurveElement,
  pointInCurveAreaPolygons,
} from '../../../src/shared/diagrams/spec/curveGeometry';
import { pointInPolygon, polygonSignedArea } from '../../../src/shared/diagrams/spec/areaGeometry';
import { subsamplePolygonPoints } from '../../../src/shared/diagrams/core/MathFactory';

const bounds = [-6, 6, 6, -6] as const;

describe('curve interior and half-plane fixes', () => {
  it('respeta el dominio de la función en semiplanos', () => {
    const curve = element('sin', 'sin(x)', 'functionCurve', ['pSide'], 'pavo', true, {
      properties: {
        expression: 'sin(x)',
        parameter: 'x',
        domain: [-2, 2],
        samples: 64,
        areaFill: 'half-plane',
      },
    });
    const samples = sampleCurveElement(curve, {});
    const side = { x: 0, y: 4 };
    const polygon = resolveCurveAreaPolygon(curve, samples, side, bounds, {});
    const curveBand = polygon.filter(point => (
      Math.abs(point.y) < 5.8
      && Math.abs(point.x + 6) > 0.2
      && Math.abs(point.x - 6) > 0.2
    ));
    curveBand.forEach(point => {
      expect(point.x).toBeGreaterThanOrEqual(-2.1);
      expect(point.x).toBeLessThanOrEqual(2.1);
    });
    expect(pointInPolygon(polygon, side)).toBe(true);
  });

  it('rellena todos los lazos cerrados de una curva autointersectante', () => {
    const curve = element('loops', 'Lazos', 'parametricCurve', [], 'pavo', true, {
      properties: {
        xExpression: '4*cos(t)',
        yExpression: '3*sin(t+3)+t',
        parameter: 't',
        domain: [0, 8 * Math.PI],
        samples: 384,
        areaFill: 'interior',
      },
    });
    const samples = sampleCurveElement(curve, { t: 0 });
    const polygons = resolveCurveAreaPolygons(curve, samples, undefined, bounds, { t: 0 });
    expect(polygons.length).toBeGreaterThan(1);
    polygons.forEach(polygon => {
      expect(polygon.length).toBeGreaterThanOrEqual(3);
      expect(Math.abs(polygonSignedArea(polygon))).toBeGreaterThan(0.1);
    });
  });

  it('mantiene el punto lateral dentro del semiplano de una función', () => {
    const curve = element('sin', 'sin(x)', 'functionCurve', ['pSide'], 'pavo', true, {
      properties: {
        expression: 'sin(x)',
        parameter: 'x',
        domain: [-5, 5],
        samples: 64,
        areaFill: 'half-plane',
      },
    });
    const samples = sampleCurveElement(curve, {});
    const side = { x: 0, y: 4 };
    const polygon = resolveCurveAreaPolygon(curve, samples, side, bounds);
    const subsampled = subsamplePolygonPoints(polygon, 64);
    expect(polygon.length).toBeGreaterThan(10);
    expect(pointInPolygon(polygon, side)).toBe(true);
    expect(pointInPolygon(subsampled, side)).toBe(true);
    expect(Math.abs(polygonSignedArea(polygon))).toBeGreaterThan(1);
  });

  it('rellena el interior de una curva paramétrica que se autointersecta', () => {
    const curve = element('loop', 'Lazo', 'parametricCurve', [], 'pavo', true, {
      properties: {
        xExpression: '4*cos(t)',
        yExpression: '3*sin(t+3)+t',
        parameter: 't',
        domain: [0, 4 * Math.PI],
        samples: 256,
        areaFill: 'interior',
      },
    });
    const samples = sampleCurveElement(curve, { t: 0 });
    const polygon = resolveCurveInteriorPolygon(samples);
    expect(polygon.length).toBeGreaterThanOrEqual(3);
    expect(Math.abs(polygonSignedArea(polygon))).toBeGreaterThan(0.5);
    const centroid = polygon.reduce((accumulator, vertex) => ({
      x: accumulator.x + vertex.x / polygon.length,
      y: accumulator.y + vertex.y / polygon.length,
    }), { x: 0, y: 0 });
    expect(pointInPolygon(polygon, centroid)).toBe(true);
  });

  it('no rellena interior si la curva abierta no forma lazo alguno', () => {
    const curve = element('open', 'Abierta', 'parametricCurve', [], 'pavo', true, {
      properties: {
        xExpression: '4*cos(t)',
        yExpression: '3*sin(t+3)+t',
        parameter: 't',
        domain: [0, 2 * Math.PI],
        samples: 128,
        areaFill: 'interior',
      },
    });
    const samples = sampleCurveElement(curve, { t: 0 });
    expect(resolveCurveInteriorPolygon(samples)).toEqual([]);
  });

  it('resuelve el interior de la curva en espacio cerrado vía resolveCurveAreaPolygon', () => {
    const curve = element('loop', 'Lazo', 'parametricCurve', [], 'pavo', true, {
      properties: {
        xExpression: '4*cos(t)',
        yExpression: '3*sin(t+3)+t',
        parameter: 't',
        domain: [0, 4 * Math.PI],
        samples: 256,
        areaFill: 'interior',
      },
    });
    const samples = sampleCurveElement(curve, { t: 0 });
    const polygon = resolveCurveAreaPolygon(curve, samples, undefined, bounds);
    expect(polygon.length).toBeGreaterThanOrEqual(3);
  });

  it('no rellena el exterior en lazos de curvas abiertas', () => {
    const curve = element('loop', 'Lazo', 'parametricCurve', [], 'pavo', true, {
      properties: {
        xExpression: '4*cos(t)',
        yExpression: '3*sin(t+3)+t',
        parameter: 't',
        domain: [0, 4 * Math.PI],
        samples: 256,
        areaFill: 'interior',
      },
    });
    const samples = sampleCurveElement(curve, { t: 0 });
    const polygons = resolveCurveAreaPolygons(curve, samples, undefined, bounds, { t: 0 });
    expect(polygons.length).toBeGreaterThan(0);
    const exteriorProbe = { x: 5.5, y: 5.5 };
    expect(pointInCurveAreaPolygons(polygons, exteriorProbe)).toBe(false);
    const bboxArea = 12 * 12;
    const filledArea = polygons.reduce(
      (total, polygon) => total + Math.abs(polygonSignedArea(polygon)),
      0,
    );
    expect(filledArea).toBeLessThan(bboxArea * 0.6);
  });
});
