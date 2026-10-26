/**
 * Relleno de una `area` de tipo `intersection` que sigue a sus puntos.
 *
 * Reproduce tres fallos vistos en navegador (Puppeteer, página
 * /definicion/interseccion, dos discos arrastrables):
 * - con una sola pieza, el relleno no tenía estado y no se actualizaba al arrastrar;
 * - si la intersección empezaba vacía no se creaba ningún relleno, y nunca aparecía;
 * - al pasar a un polígono con menos puntos que vértices, los vértices sobrantes
 *   se quedaban en su posición anterior y dejaban restos de la región.
 */
import { describe, expect, it } from 'vitest';
import JXG from 'jsxgraph';
import {
  createAreaIntersectionComposite,
  createAreaIntersectionFills,
  createStaticAreaPolygon,
  updateStaticAreaPolygon,
} from '@/diagrams/jsxgraph/MathFactory';
import type { ThemeColors } from '@/diagrams/jsxgraph/theme';

const theme: ThemeColors = {
  carbon: '#222222',
  terracota: '#b5654a',
  canela: '#c79a6b',
  lienzo: '#f6f0e4',
  mora: '#7b5a8c',
  ocre: '#c9a227',
  pavo: '#3e6f86',
  granada: '#a8323e',
  musgo: '#5e7d3c',
};

function createBoard(id: string): JXG.Board {
  const div = document.createElement('div');
  div.id = id;
  Object.defineProperty(div, 'clientWidth', { value: 600, configurable: true });
  Object.defineProperty(div, 'clientHeight', { value: 600, configurable: true });
  div.getBoundingClientRect = () => ({
    x: 0, y: 0, left: 0, top: 0, right: 600, bottom: 600, width: 600, height: 600,
    toJSON: () => ({}),
  }) as DOMRect;
  document.body.appendChild(div);
  return JXG.JSXGraph.initBoard(id, { boundingbox: [-5, 5, 5, -5], axis: false, showCopyright: false, showNavigation: false });
}

const polygon16 = Array.from({ length: 16 }, (_, index) => {
  const angle = (2 * Math.PI * index) / 16;
  return { x: 2 * Math.cos(angle), y: 2 * Math.sin(angle) };
});

describe('relleno de intersección de áreas', () => {
  it('una sola pieza conserva el estado que permite actualizarla', () => {
    const board = createBoard('jxg-area-int-single');
    const fills = createAreaIntersectionFills(board, () => [polygon16], {}, theme);
    const element = createAreaIntersectionComposite(fills) as { __matematikaAreaIntersection?: { fills: unknown[] } };
    expect(element.__matematikaAreaIntersection?.fills).toHaveLength(1);
  });

  it('una intersección vacía crea igualmente un relleno colapsado', () => {
    const board = createBoard('jxg-area-int-empty');
    const fills = createAreaIntersectionFills(board, () => [], {}, theme);
    expect(fills).toHaveLength(1);
    const vertices = fills[0].vertices as JXG.Point[];
    expect(vertices.length).toBeGreaterThanOrEqual(32);
    expect(new Set(vertices.map(vertex => `${vertex.X()},${vertex.Y()}`)).size).toBe(1);
  });

  it('los vértices sobrantes repiten el último punto en lugar de quedarse donde estaban', () => {
    const board = createBoard('jxg-area-int-shrink');
    const polygon = createStaticAreaPolygon(board, polygon16, {}, theme, 16);
    const triangle = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }];
    updateStaticAreaPolygon(polygon, triangle);
    const vertices = polygon!.vertices as JXG.Point[];
    vertices.forEach(vertex => {
      expect(triangle.some(point => Math.abs(point.x - vertex.X()) < 1e-9 && Math.abs(point.y - vertex.Y()) < 1e-9)).toBe(true);
    });
  });
});
