import { describe, expect, it } from 'vitest';
import {
  clipPolygonByHalfPlane,
  constrainToDisk,
  constrainToDiskBoundary,
  constrainToHalfPlane,
  constrainToPolygon,
  constrainToPolygonBoundary,
  halfPlaneViewportPolygon,
  pointInDisk,
  pointInHalfPlane,
  pointInPolygon,
  pointOnDiskBoundary,
  pointOnPolygonBoundary,
} from '../../../src/shared/diagrams/spec/areaGeometry';

describe('areaGeometry', () => {
  const lineA = { x: 0, y: 0 };
  const lineB = { x: 4, y: 0 };
  const side = { x: 2, y: 2 };

  it('detecta puntos en un semiplano', () => {
    expect(pointInHalfPlane(lineA, lineB, side, { x: 2, y: 1 })).toBe(true);
    expect(pointInHalfPlane(lineA, lineB, side, { x: 2, y: -1 })).toBe(false);
  });

  it('restringe un punto al semiplano correcto', () => {
    const constrained = constrainToHalfPlane(lineA, lineB, side, { x: 2, y: -3 });
    expect(pointInHalfPlane(lineA, lineB, side, constrained)).toBe(true);
  });

  it('detecta puntos en un polígono', () => {
    const square = [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 2 },
      { x: 0, y: 2 },
    ];
    expect(pointInPolygon(square, { x: 1, y: 1 })).toBe(true);
    expect(pointInPolygon(square, { x: 3, y: 1 })).toBe(false);
  });

  it('restringe un punto al interior de un polígono', () => {
    const triangle = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 2, y: 3 },
    ];
    const constrained = constrainToPolygon(triangle, { x: 2, y: -1 });
    expect(pointInPolygon(triangle, constrained)).toBe(true);
  });

  it('detecta y restringe puntos en un disco', () => {
    const center = { x: 0, y: 0 };
    const boundary = { x: 3, y: 0 };
    expect(pointInDisk(center, boundary, { x: 1, y: 0 })).toBe(true);
    const constrained = constrainToDisk(center, boundary, { x: 5, y: 0 });
    expect(pointInDisk(center, boundary, constrained)).toBe(true);
  });

  it('recorta un polígono por un semiplano', () => {
    const square = halfPlaneViewportPolygon(lineA, lineB, side, [-5, 5, 5, -5]);
    const clipped = clipPolygonByHalfPlane(square, lineA, lineB, { x: 2, y: -2 });
    expect(clipped.length).toBeGreaterThanOrEqual(3);
    clipped.forEach(vertex => {
      expect(pointInHalfPlane(lineA, lineB, { x: 2, y: -2 }, vertex, 1e-6)).toBe(true);
    });
  });

  it('recorta el viewport por un semiplano superior', () => {
    const bounds: [number, number, number, number] = [-5, 5, 5, -5];
    const polygon = halfPlaneViewportPolygon(lineA, lineB, side, bounds);
    expect(polygon.length).toBeGreaterThanOrEqual(4);
    polygon.forEach(vertex => expect(vertex.y).toBeGreaterThanOrEqual(-1e-6));
    expect(polygon.some(vertex => vertex.y === 5)).toBe(true);
    expect(polygon.some(vertex => Math.abs(vertex.y) < 1e-6)).toBe(true);
  });

  it('detecta y restringe puntos en el perímetro de un disco', () => {
    const center = { x: 0, y: 0 };
    const boundary = { x: 2, y: 0 };
    expect(pointOnDiskBoundary(center, boundary, { x: 2, y: 0 })).toBe(true);
    const constrained = constrainToDiskBoundary(center, boundary, { x: 0, y: 0 });
    expect(pointOnDiskBoundary(center, boundary, constrained)).toBe(true);
    expect(pointInDisk(center, boundary, constrained, 1e-6)).toBe(true);
  });

  it('detecta y restringe puntos en el perímetro de un polígono', () => {
    const square = [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 2 },
      { x: 0, y: 2 },
    ];
    expect(pointOnPolygonBoundary(square, { x: 1, y: 0 })).toBe(true);
    const constrained = constrainToPolygonBoundary(square, { x: 1, y: 1 });
    expect(pointOnPolygonBoundary(square, constrained)).toBe(true);
  });
});
