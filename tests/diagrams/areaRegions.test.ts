import { describe, expect, it } from 'vitest';
import { clipPolygonToAreaElement, resolveAreaDisplayPolygon, resolveAreaDisplayPolygons, viewportPolygon } from '@/diagrams/geometry/areas/areaRegions';
import { pointInHalfPlane, pointInPolygon } from '@/diagrams/geometry/areas/areaGeometry';
import type { DiagramObject, DiagramSpec } from '@/diagrams';
import { element, point } from '@/fixed-pages/editor/diagrams/model';
import { curvePath, findById, sceneSpec } from '../helpers/diagramSpec';

const pointA = point('pA', 'A', -2, 0);
const pointB = point('pB', 'B', 2, 0);
const pointC = point('pC', 'C', 0, 2);
const pointD = point('pD', 'D', 0, -2);
const halfTop = element('halfTop', 'Superior', 'halfPlane', ['pA', 'pB', 'pC'], 'canela');
const halfBottom = element('halfBottom', 'Inferior', 'halfPlane', ['pA', 'pB', 'pD'], 'canela');
const strip = element('strip', 'Franja', 'areaIntersection', ['halfTop', 'halfBottom'], 'canela');

function baseSpec(objects: DiagramObject[] = [pointA, pointB, pointC, pointD, halfTop, halfBottom, strip]): DiagramSpec {
  return sceneSpec({
    viewport: { bounds: [-6, 6, 6, -6], home: [-6, 6, 6, -6], minZoom: 0.5, maxZoom: 4, padding: 0.08 },
    objects,
    steps: [{ id: 'initial', label: 'Inicio', description: '', visibleTargets: [], durationMs: 0 }],
  });
}

const sinHalfPlane = (samples: number) => curvePath('sinArea', 'sin(x)', 'functionCurve', ['pSide'], {
  expression: 'sin(x)',
  variable: 'x',
  domain: [-5, 5],
  samples,
  areaFill: 'half-plane',
});

describe('areaRegions', () => {
  it('resuelve la intersección de dos semiplanos como una franja visible', () => {
    const polygon = resolveAreaDisplayPolygon(baseSpec(), strip);
    expect(polygon.length).toBeGreaterThanOrEqual(3);
    polygon.forEach(vertex => {
      expect(vertex.y).toBeGreaterThanOrEqual(-1e-6);
      expect(vertex.y).toBeLessThanOrEqual(1e-6);
    });
    expect(polygon.some(vertex => Math.abs(vertex.x + 6) < 1e-6 || Math.abs(vertex.x - 6) < 1e-6)).toBe(true);
  });

  it('resuelve un semiplano recortado al viewport', () => {
    const polygon = resolveAreaDisplayPolygon(baseSpec(), halfTop);
    expect(polygon.length).toBeGreaterThanOrEqual(4);
    const lineA = { x: -2, y: 0 };
    const lineB = { x: 2, y: 0 };
    const side = { x: 0, y: 2 };
    polygon.forEach(vertex => expect(pointInHalfPlane(lineA, lineB, side, vertex, 1e-6)).toBe(true));
    expect(polygon.some(vertex => vertex.y === 6)).toBe(true);
  });

  it('resuelve la intersección de un polígono con un semiplano', () => {
    const spec = baseSpec([
      pointA, pointB, pointC, pointD,
      point('p1', '1', 0, 0), point('p2', '2', 4, 0), point('p3', '3', 2, 3),
      halfTop,
      element('tri', 'Triángulo', 'polygon', ['p1', 'p2', 'p3'], 'canela'),
      element('mix', 'Mezcla', 'areaIntersection', ['tri', 'halfTop'], 'canela'),
    ]);
    const polygon = resolveAreaDisplayPolygon(spec, findById(spec, 'mix'));
    expect(polygon.length).toBeGreaterThanOrEqual(3);
    const lineA = { x: -2, y: 0 };
    const lineB = { x: 2, y: 0 };
    const side = { x: 0, y: 2 };
    polygon.forEach(vertex => {
      expect(pointInHalfPlane(lineA, lineB, side, vertex, 1e-6)).toBe(true);
      expect(vertex.y).toBeGreaterThanOrEqual(-1e-6);
    });
  });

  it('recorta el viewport a un disco', () => {
    const spec = baseSpec([
      point('pO', 'O', 0, 0), point('pR', 'R', 3, 0),
      element('disk', 'Disco', 'circle', ['pO', 'pR'], 'canela'),
    ]);
    const clipped = clipPolygonToAreaElement(spec, viewportPolygon(spec.viewport.bounds), findById(spec, 'disk'));
    expect(clipped.length).toBeGreaterThanOrEqual(3);
  });

  it('resuelve la intersección de un disco con un semiplano', () => {
    const spec = baseSpec([
      pointA, pointB, pointC, pointD,
      point('pO', 'O', 0, 0), point('pR', 'R', 3, 0),
      halfTop,
      element('disk', 'Disco', 'circle', ['pO', 'pR'], 'canela'),
      element('mix', 'Mezcla', 'areaIntersection', ['disk', 'halfTop'], 'canela'),
    ]);
    const polygon = resolveAreaDisplayPolygon(spec, findById(spec, 'mix'));
    expect(polygon.length).toBeGreaterThanOrEqual(3);
    const center = { x: 0, y: 0 };
    polygon.forEach(vertex => {
      expect(Math.hypot(vertex.x - center.x, vertex.y - center.y)).toBeLessThanOrEqual(3 + 1e-5);
      expect(vertex.y).toBeGreaterThanOrEqual(-1e-6);
    });
  });

  it('resuelve el semiplano de una función muestreada', () => {
    const spec = baseSpec([pointA, pointB, pointC, pointD, point('pSide', 'S', 0, 4), sinHalfPlane(32)]);
    const polygon = resolveAreaDisplayPolygon(spec, findById(spec, 'sinArea'));
    expect(polygon.length).toBeGreaterThan(10);
    expect(polygon.some(vertex => vertex.y >= 5.9)).toBe(true);
  });

  it('resuelve la intersección de un polígono con un disco', () => {
    const spec = baseSpec([
      point('p1', '1', -1, -1), point('p2', '2', 4, -1), point('p3', '3', 1.5, 4),
      point('pO', 'O', 0, 0), point('pR', 'R', 3, 0),
      element('tri', 'Triángulo', 'polygon', ['p1', 'p2', 'p3'], 'canela'),
      element('disk', 'Disco', 'circle', ['pO', 'pR'], 'canela'),
      element('mix', 'Mezcla', 'areaIntersection', ['tri', 'disk'], 'canela'),
    ]);
    const polygon = resolveAreaDisplayPolygon(spec, findById(spec, 'mix'));
    expect(polygon.length).toBeGreaterThanOrEqual(3);
    const center = { x: 0, y: 0 };
    polygon.forEach(vertex => {
      expect(Math.hypot(vertex.x - center.x, vertex.y - center.y)).toBeLessThanOrEqual(3 + 1e-4);
    });
  });

  it('resuelve la intersección de un semiplano funcional con un semiplano recto', () => {
    const spec = baseSpec([
      pointA, pointB, pointC, pointD, point('pSide', 'S', 0, 4),
      halfTop,
      sinHalfPlane(48),
      element('mix', 'Mezcla', 'areaIntersection', ['halfTop', 'sinArea'], 'canela'),
    ]);
    const polygons = resolveAreaDisplayPolygons(spec, findById(spec, 'mix'));
    expect(polygons.length).toBeGreaterThan(0);
    const lineA = { x: -2, y: 0 };
    const lineB = { x: 2, y: 0 };
    const side = { x: 0, y: 2 };
    polygons.forEach(polygon => {
      expect(polygon.length).toBeGreaterThanOrEqual(3);
      polygon.forEach(vertex => {
        expect(pointInHalfPlane(lineA, lineB, side, vertex, 1e-5)).toBe(true);
        expect(vertex.y).toBeGreaterThanOrEqual(-1e-5);
      });
    });
    expect(pointInPolygon(polygons[0], { x: 0, y: 1 })).toBe(true);
  });
});
