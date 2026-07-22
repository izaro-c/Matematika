import { describe, expect, it } from 'vitest';
import { element } from '../../../src/features/editor/diagrams/model/diagramElements';
import {
  curveIsClosed,
  resolveCurveAreaPolygon,
  resolveCurveHalfPlanePolygon,
  sampleCurveElement,
} from '../../../src/shared/diagrams/spec/curveGeometry';

describe('curveGeometry', () => {
  it('muestrea una función sin evaluadores dinámicos', () => {
    const curve = element('sin1', 'sin(x)', 'functionCurve', [], 'pavo', true, {
      properties: {
        expression: 'sin(x)',
        parameter: 'x',
        domain: [-1, 1],
        samples: 16,
      },
    });
    const samples = sampleCurveElement(curve, { x: 0 });
    expect(samples.length).toBeGreaterThan(10);
    expect(samples.every(point => Number.isFinite(point.x) && Number.isFinite(point.y))).toBe(true);
    expect(samples[0].x).toBe(-1);
    expect(samples[samples.length - 1].x).toBe(1);
  });

  it('detecta curvas paramétricas cerradas', () => {
    const points = Array.from({ length: 33 }, (_, index) => {
      const angle = (index / 32) * Math.PI * 2;
      return { x: Math.cos(angle), y: Math.sin(angle) };
    });
    expect(curveIsClosed(points)).toBe(true);
    expect(curveIsClosed([{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 2 }])).toBe(false);
  });

  it('construye un semiplano acotado por la curva y el viewport', () => {
    const curveElement = element('sin', 'sin(x)', 'functionCurve', [], 'pavo', true, {
      properties: { expression: 'sin(x)', parameter: 'x', domain: [-5, 5], samples: 16 },
    });
    const curve = Array.from({ length: 11 }, (_, index) => ({ x: -5 + index, y: Math.sin(-5 + index) }));
    const polygon = resolveCurveHalfPlanePolygon(curveElement, curve, { x: 0, y: 4 }, [-6, 6, 6, -6]);
    expect(polygon.length).toBeGreaterThan(6);
    expect(polygon.some(point => point.y >= 5.9)).toBe(true);
    expect(polygon.every(point => point.x >= -5.01 && point.x <= 5.01 || Math.abs(point.y - 6) < 0.02)).toBe(true);
  });

  it('rellena el interior de una elipse paramétrica cerrada', () => {
    const curve = element('ellipse', 'Elipse', 'parametricCurve', [], 'pavo', true, {
      properties: {
        xExpression: '3*cos(t)',
        yExpression: '2*sin(t)',
        parameter: 't',
        domain: [0, 2 * Math.PI],
        samples: 64,
        areaFill: 'interior',
      },
    });
    const samples = sampleCurveElement(curve, { t: 0 });
    expect(curveIsClosed(samples)).toBe(true);
    const polygon = resolveCurveAreaPolygon(curve, samples, undefined, [-6, 6, 6, -6]);
    expect(polygon.length).toBeGreaterThan(10);
    expect(curveIsClosed(polygon)).toBe(true);
  });

  it('ignora el relleno interior en gráficas de función', () => {
    const curve = element('sin', 'sin(x)', 'functionCurve', [], 'pavo', true, {
      properties: {
        expression: 'sin(x)',
        parameter: 'x',
        domain: [0, 2 * Math.PI],
        samples: 64,
        areaFill: 'interior',
      },
    });
    const samples = sampleCurveElement(curve, {});
    expect(resolveCurveAreaPolygon(curve, samples, undefined, [-6, 6, 6, -6])).toEqual([]);
  });
});
