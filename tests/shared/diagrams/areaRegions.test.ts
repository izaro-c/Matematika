import { describe, expect, it } from 'vitest';
import { clipPolygonToAreaElement, resolveAreaDisplayPolygon, resolveAreaDisplayPolygons, viewportPolygon } from '../../../src/shared/diagrams/spec/areaRegions';
import { pointInHalfPlane, pointInPolygon } from '../../../src/shared/diagrams/spec/areaGeometry';
import type { DiagramSpecV2 } from '../../../src/shared/diagrams/spec/types';

function baseSpec(): DiagramSpecV2 {
  return {
    version: 2,
    renderer: 'matematika-diagram-renderer-v2',
    title: 'Áreas',
    componentId: 'areas',
    category: 'Demos',
    mode: 'simulation',
    axis: false,
    grid: false,
    viewport: { bounds: [-6, 6, 6, -6], home: [-6, 6, 6, -6], minZoom: 0.5, maxZoom: 4, padding: 0.08 },
    layers: [{ id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false }],
    groups: [],
    points: [
      { id: 'pA', label: 'A', x: -2, y: 0, showLabel: true, fixed: false, color: 'carbon', target: true, targetId: 'pA', constraint: 'free', layerId: 'geometry', order: 0, visible: true, locked: false, groupIds: [], selection: { selectable: true, role: 'primary' } },
      { id: 'pB', label: 'B', x: 2, y: 0, showLabel: true, fixed: false, color: 'carbon', target: true, targetId: 'pB', constraint: 'free', layerId: 'geometry', order: 1, visible: true, locked: false, groupIds: [], selection: { selectable: true, role: 'primary' } },
      { id: 'pC', label: 'C', x: 0, y: 2, showLabel: true, fixed: false, color: 'carbon', target: true, targetId: 'pC', constraint: 'free', layerId: 'geometry', order: 2, visible: true, locked: false, groupIds: [], selection: { selectable: true, role: 'primary' } },
      { id: 'pD', label: 'D', x: 0, y: -2, showLabel: true, fixed: false, color: 'carbon', target: true, targetId: 'pD', constraint: 'free', layerId: 'geometry', order: 3, visible: true, locked: false, groupIds: [], selection: { selectable: true, role: 'primary' } },
    ],
    elements: [
      { id: 'halfTop', label: 'Superior', kind: 'halfPlane', refs: ['pA', 'pB', 'pC'], color: 'salvia', layerId: 'geometry', order: 4, visible: true, locked: false, groupIds: [], target: true, targetId: 'halfTop', selection: { selectable: true, role: 'secondary' } },
      { id: 'halfBottom', label: 'Inferior', kind: 'halfPlane', refs: ['pA', 'pB', 'pD'], color: 'salvia', layerId: 'geometry', order: 5, visible: true, locked: false, groupIds: [], target: true, targetId: 'halfBottom', selection: { selectable: true, role: 'secondary' } },
      { id: 'strip', label: 'Franja', kind: 'areaIntersection', refs: ['halfTop', 'halfBottom'], color: 'salvia', layerId: 'geometry', order: 6, visible: true, locked: false, groupIds: [], target: true, targetId: 'strip', selection: { selectable: true, role: 'secondary' } },
    ],
    sliders: [],
    steps: [{ id: 'initial', label: 'Inicio', description: '', visibleTargets: [], durationMs: 0 }],
    note: '',
    extensions: {},
  };
}

describe('areaRegions', () => {
  it('resuelve la intersección de dos semiplanos como una franja visible', () => {
    const polygon = resolveAreaDisplayPolygon(baseSpec(), baseSpec().elements[2]);
    expect(polygon.length).toBeGreaterThanOrEqual(3);
    polygon.forEach(vertex => {
      expect(vertex.y).toBeGreaterThanOrEqual(-1e-6);
      expect(vertex.y).toBeLessThanOrEqual(1e-6);
    });
    expect(polygon.some(vertex => Math.abs(vertex.x + 6) < 1e-6 || Math.abs(vertex.x - 6) < 1e-6)).toBe(true);
  });

  it('resuelve un semiplano recortado al viewport', () => {
    const polygon = resolveAreaDisplayPolygon(baseSpec(), baseSpec().elements[0]);
    expect(polygon.length).toBeGreaterThanOrEqual(4);
    const lineA = { x: -2, y: 0 };
    const lineB = { x: 2, y: 0 };
    const side = { x: 0, y: 2 };
    polygon.forEach(vertex => expect(pointInHalfPlane(lineA, lineB, side, vertex, 1e-6)).toBe(true));
    expect(polygon.some(vertex => vertex.y === 6)).toBe(true);
  });

  it('resuelve la intersección de un polígono con un semiplano', () => {
    const spec: DiagramSpecV2 = {
      ...baseSpec(),
      points: [
        ...baseSpec().points,
        { id: 'p1', label: '1', x: 0, y: 0, showLabel: true, fixed: false, color: 'carbon', target: true, targetId: 'p1', constraint: 'free', layerId: 'geometry', order: 4, visible: true, locked: false, groupIds: [], selection: { selectable: true, role: 'primary' } },
        { id: 'p2', label: '2', x: 4, y: 0, showLabel: true, fixed: false, color: 'carbon', target: true, targetId: 'p2', constraint: 'free', layerId: 'geometry', order: 5, visible: true, locked: false, groupIds: [], selection: { selectable: true, role: 'primary' } },
        { id: 'p3', label: '3', x: 2, y: 3, showLabel: true, fixed: false, color: 'carbon', target: true, targetId: 'p3', constraint: 'free', layerId: 'geometry', order: 6, visible: true, locked: false, groupIds: [], selection: { selectable: true, role: 'primary' } },
      ],
      elements: [
        baseSpec().elements[0],
        { id: 'tri', label: 'Triángulo', kind: 'polygon', refs: ['p1', 'p2', 'p3'], color: 'salvia', layerId: 'geometry', order: 7, visible: true, locked: false, groupIds: [], target: true, targetId: 'tri', selection: { selectable: true, role: 'secondary' } },
        { id: 'mix', label: 'Mezcla', kind: 'areaIntersection', refs: ['tri', 'halfTop'], color: 'salvia', layerId: 'geometry', order: 8, visible: true, locked: false, groupIds: [], target: true, targetId: 'mix', selection: { selectable: true, role: 'secondary' } },
      ],
    };
    const polygon = resolveAreaDisplayPolygon(spec, spec.elements.find(item => item.id === 'mix')!);
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
    const spec: DiagramSpecV2 = {
      ...baseSpec(),
      points: [
        { id: 'pO', label: 'O', x: 0, y: 0, showLabel: true, fixed: false, color: 'carbon', target: true, targetId: 'pO', constraint: 'free', layerId: 'geometry', order: 0, visible: true, locked: false, groupIds: [], selection: { selectable: true, role: 'primary' } },
        { id: 'pR', label: 'R', x: 3, y: 0, showLabel: true, fixed: false, color: 'carbon', target: true, targetId: 'pR', constraint: 'free', layerId: 'geometry', order: 1, visible: true, locked: false, groupIds: [], selection: { selectable: true, role: 'primary' } },
      ],
      elements: [
        { id: 'disk', label: 'Disco', kind: 'circle', refs: ['pO', 'pR'], color: 'salvia', layerId: 'geometry', order: 2, visible: true, locked: false, groupIds: [], target: true, targetId: 'disk', selection: { selectable: true, role: 'secondary' } },
      ],
    };
    const clipped = clipPolygonToAreaElement(spec, viewportPolygon(spec.viewport.bounds), spec.elements[0]);
    expect(clipped.length).toBeGreaterThanOrEqual(3);
  });

  it('resuelve la intersección de un disco con un semiplano', () => {
    const spec: DiagramSpecV2 = {
      ...baseSpec(),
      points: [
        ...baseSpec().points,
        { id: 'pO', label: 'O', x: 0, y: 0, showLabel: true, fixed: false, color: 'carbon', target: true, targetId: 'pO', constraint: 'free', layerId: 'geometry', order: 4, visible: true, locked: false, groupIds: [], selection: { selectable: true, role: 'primary' } },
        { id: 'pR', label: 'R', x: 3, y: 0, showLabel: true, fixed: false, color: 'carbon', target: true, targetId: 'pR', constraint: 'free', layerId: 'geometry', order: 5, visible: true, locked: false, groupIds: [], selection: { selectable: true, role: 'primary' } },
      ],
      elements: [
        baseSpec().elements[0],
        { id: 'disk', label: 'Disco', kind: 'circle', refs: ['pO', 'pR'], color: 'salvia', layerId: 'geometry', order: 7, visible: true, locked: false, groupIds: [], target: true, targetId: 'disk', selection: { selectable: true, role: 'secondary' } },
        { id: 'mix', label: 'Mezcla', kind: 'areaIntersection', refs: ['disk', 'halfTop'], color: 'salvia', layerId: 'geometry', order: 8, visible: true, locked: false, groupIds: [], target: true, targetId: 'mix', selection: { selectable: true, role: 'secondary' } },
      ],
    };
    const polygon = resolveAreaDisplayPolygon(spec, spec.elements.find(item => item.id === 'mix')!);
    expect(polygon.length).toBeGreaterThanOrEqual(3);
    const center = { x: 0, y: 0 };
    polygon.forEach(vertex => {
      expect(Math.hypot(vertex.x - center.x, vertex.y - center.y)).toBeLessThanOrEqual(3 + 1e-5);
      expect(vertex.y).toBeGreaterThanOrEqual(-1e-6);
    });
  });

  it('resuelve el semiplano de una función muestreada', () => {
    const spec: DiagramSpecV2 = {
      ...baseSpec(),
      points: [
        ...baseSpec().points,
        { id: 'pSide', label: 'S', x: 0, y: 4, showLabel: true, fixed: false, color: 'carbon', target: true, targetId: 'pSide', constraint: 'free', layerId: 'geometry', order: 4, visible: true, locked: false, groupIds: [], selection: { selectable: true, role: 'primary' } },
      ],
      elements: [
        {
          id: 'sinArea',
          label: 'sin(x)',
          kind: 'functionCurve',
          refs: ['pSide'],
          color: 'salvia',
          layerId: 'geometry',
          order: 5,
          visible: true,
          locked: false,
          groupIds: [],
          target: true,
          targetId: 'sinArea',
          selection: { selectable: true, role: 'secondary' },
          properties: {
            expression: 'sin(x)',
            parameter: 'x',
            domain: [-5, 5],
            samples: 32,
            areaFill: 'half-plane',
          },
        },
      ],
    };
    const polygon = resolveAreaDisplayPolygon(spec, spec.elements[0]);
    expect(polygon.length).toBeGreaterThan(10);
    expect(polygon.some(vertex => vertex.y >= 5.9)).toBe(true);
  });

  it('resuelve la intersección de un polígono con un disco', () => {
    const spec: DiagramSpecV2 = {
      ...baseSpec(),
      points: [
        { id: 'p1', label: '1', x: -1, y: -1, showLabel: true, fixed: false, color: 'carbon', target: true, targetId: 'p1', constraint: 'free', layerId: 'geometry', order: 0, visible: true, locked: false, groupIds: [], selection: { selectable: true, role: 'primary' } },
        { id: 'p2', label: '2', x: 4, y: -1, showLabel: true, fixed: false, color: 'carbon', target: true, targetId: 'p2', constraint: 'free', layerId: 'geometry', order: 1, visible: true, locked: false, groupIds: [], selection: { selectable: true, role: 'primary' } },
        { id: 'p3', label: '3', x: 1.5, y: 4, showLabel: true, fixed: false, color: 'carbon', target: true, targetId: 'p3', constraint: 'free', layerId: 'geometry', order: 2, visible: true, locked: false, groupIds: [], selection: { selectable: true, role: 'primary' } },
        { id: 'pO', label: 'O', x: 0, y: 0, showLabel: true, fixed: false, color: 'carbon', target: true, targetId: 'pO', constraint: 'free', layerId: 'geometry', order: 3, visible: true, locked: false, groupIds: [], selection: { selectable: true, role: 'primary' } },
        { id: 'pR', label: 'R', x: 3, y: 0, showLabel: true, fixed: false, color: 'carbon', target: true, targetId: 'pR', constraint: 'free', layerId: 'geometry', order: 4, visible: true, locked: false, groupIds: [], selection: { selectable: true, role: 'primary' } },
      ],
      elements: [
        { id: 'tri', label: 'Triángulo', kind: 'polygon', refs: ['p1', 'p2', 'p3'], color: 'salvia', layerId: 'geometry', order: 5, visible: true, locked: false, groupIds: [], target: true, targetId: 'tri', selection: { selectable: true, role: 'secondary' } },
        { id: 'disk', label: 'Disco', kind: 'circle', refs: ['pO', 'pR'], color: 'salvia', layerId: 'geometry', order: 6, visible: true, locked: false, groupIds: [], target: true, targetId: 'disk', selection: { selectable: true, role: 'secondary' } },
        { id: 'mix', label: 'Mezcla', kind: 'areaIntersection', refs: ['tri', 'disk'], color: 'salvia', layerId: 'geometry', order: 7, visible: true, locked: false, groupIds: [], target: true, targetId: 'mix', selection: { selectable: true, role: 'secondary' } },
      ],
    };
    const polygon = resolveAreaDisplayPolygon(spec, spec.elements.find(item => item.id === 'mix')!);
    expect(polygon.length).toBeGreaterThanOrEqual(3);
    const center = { x: 0, y: 0 };
    polygon.forEach(vertex => {
      expect(Math.hypot(vertex.x - center.x, vertex.y - center.y)).toBeLessThanOrEqual(3 + 1e-4);
    });
  });

  it('resuelve la intersección de un semiplano funcional con un semiplano recto', () => {
    const spec: DiagramSpecV2 = {
      ...baseSpec(),
      points: [
        ...baseSpec().points,
        { id: 'pSide', label: 'S', x: 0, y: 4, showLabel: true, fixed: false, color: 'carbon', target: true, targetId: 'pSide', constraint: 'free', layerId: 'geometry', order: 4, visible: true, locked: false, groupIds: [], selection: { selectable: true, role: 'primary' } },
      ],
      elements: [
        baseSpec().elements[0],
        {
          id: 'sinArea',
          label: 'sin(x)',
          kind: 'functionCurve',
          refs: ['pSide'],
          color: 'salvia',
          layerId: 'geometry',
          order: 5,
          visible: true,
          locked: false,
          groupIds: [],
          target: true,
          targetId: 'sinArea',
          selection: { selectable: true, role: 'secondary' },
          properties: {
            expression: 'sin(x)',
            parameter: 'x',
            domain: [-5, 5],
            samples: 48,
            areaFill: 'half-plane',
          },
        },
        { id: 'mix', label: 'Mezcla', kind: 'areaIntersection', refs: ['halfTop', 'sinArea'], color: 'salvia', layerId: 'geometry', order: 8, visible: true, locked: false, groupIds: [], target: true, targetId: 'mix', selection: { selectable: true, role: 'secondary' } },
      ],
    };
    const polygons = resolveAreaDisplayPolygons(spec, spec.elements.find(item => item.id === 'mix')!);
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
