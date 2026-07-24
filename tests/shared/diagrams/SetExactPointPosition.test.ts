/**
 * `setExactPointPosition` (nivel JSXGraph puro).
 *
 * Reproduce sobre un board JSXGraph real en jsdom el bug de producción
 * encontrado con evidencia de navegador real (Puppeteer, página
 * /definicion/mediana): `Point#setPosition` reaplica `snapToGrid` en cada
 * llamada, así que reposicionar un punto con una coordenada ya RESUELTA por
 * el motor de restricciones (p. ej. el recorte de `sameSide`, que separa el
 * punto de la línea límite por una distancia submilimétrica) puede volver a
 * redondearla a la rejilla y reintroducir la violación que la restricción
 * acababa de corregir.
 *
 * Este test no depende de simular un arrastre completo (drag) en jsdom -algo
 * que resultó frágil por limitaciones del hit-testing de jsdom sobre SVG- y
 * en su lugar ejercita directamente la API pública que usan los manejadores
 * de producción (`useBoardLifecycle.ts`, `MathFactory.ts`).
 */
import { describe, expect, it } from 'vitest';
import JXG from 'jsxgraph';
import { setExactPointPosition } from '@/shared/diagrams/core/MathUtils';

function createContainer(id: string): HTMLDivElement {
  const div = document.createElement('div');
  div.id = id;
  Object.defineProperty(div, 'clientWidth', { value: 600, configurable: true });
  Object.defineProperty(div, 'clientHeight', { value: 600, configurable: true });
  div.getBoundingClientRect = () => ({
    x: 0, y: 0, left: 0, top: 0, right: 600, bottom: 600, width: 600, height: 600,
    toJSON: () => ({}),
  }) as DOMRect;
  document.body.appendChild(div);
  return div;
}

function createSnappingPoint(containerId: string, snapSize = 0.25) {
  createContainer(containerId);
  const board = JXG.JSXGraph.initBoard(containerId, {
    boundingbox: [-5, 5, 5, -5],
    axis: false,
    showCopyright: false,
    showNavigation: false,
  });
  const point = board.create('point', [0, 0], {
    snapToGrid: true,
    snapSizeX: snapSize,
    snapSizeY: snapSize,
  }) as JXG.Point;
  return { board, point };
}

describe('setExactPointPosition', () => {
  it('reproduce el bug: Point#setPosition directo redondea a la rejilla una coordenada ya resuelta', () => {
    const { point } = createSnappingPoint('jxg-exact-pos-repro');
    // Una coordenada intencionadamente fuera de rejilla (0.25), como la que
    // produce el recorte de `sameSide` al separar un punto de un límite.
    point.setPosition(JXG.COORDS_BY_USER, [1.05, 2.05]);
    expect(point.X()).not.toBeCloseTo(1.05, 5);
    expect(point.Y()).not.toBeCloseTo(2.05, 5);
    // Confirma que efectivamente aterrizó en la rejilla de 0.25.
    expect(point.X()).toBeCloseTo(1.0, 5);
    expect(point.Y()).toBeCloseTo(2.0, 5);
  });

  it('corrige el bug: setExactPointPosition preserva la coordenada exacta pese a snapToGrid', () => {
    const { point } = createSnappingPoint('jxg-exact-pos-fixed');
    setExactPointPosition(point, JXG.COORDS_BY_USER, [1.05, 2.05]);
    expect(point.X()).toBeCloseTo(1.05, 9);
    expect(point.Y()).toBeCloseTo(2.05, 9);
  });

  it('restaura snapToGrid tras su uso: una llamada posterior a setPosition vuelve a redondear', () => {
    const { point } = createSnappingPoint('jxg-exact-pos-restore');
    setExactPointPosition(point, JXG.COORDS_BY_USER, [1.05, 2.05]);
    expect(point.evalVisProp('snaptogrid')).toBe(true);
    point.setPosition(JXG.COORDS_BY_USER, [3.1, -1.1]);
    expect(point.X()).toBeCloseTo(3.0, 5);
    expect(point.Y()).toBeCloseTo(-1.0, 5);
  });

  it('no afecta a otros puntos del mismo board (solo suspende los imanes del punto dado)', () => {
    const { board, point: snapped } = createSnappingPoint('jxg-exact-pos-scope');
    const other = board.create('point', [0, 0], {
      snapToGrid: true,
      snapSizeX: 0.25,
      snapSizeY: 0.25,
    }) as JXG.Point;
    setExactPointPosition(snapped, JXG.COORDS_BY_USER, [1.05, 2.05]);
    other.setPosition(JXG.COORDS_BY_USER, [1.05, 2.05]);
    expect(snapped.X()).toBeCloseTo(1.05, 9);
    expect(other.X()).toBeCloseTo(1.0, 5);
  });

  it('funciona igual sin snapToGrid activo (no-op sobre el comportamiento normal)', () => {
    createContainer('jxg-exact-pos-nosnap');
    const board = JXG.JSXGraph.initBoard('jxg-exact-pos-nosnap', {
      boundingbox: [-5, 5, 5, -5],
      axis: false,
      showCopyright: false,
      showNavigation: false,
    });
    const point = board.create('point', [0, 0], {}) as JXG.Point;
    setExactPointPosition(point, JXG.COORDS_BY_USER, [1.234, -2.345]);
    expect(point.X()).toBeCloseTo(1.234, 9);
    expect(point.Y()).toBeCloseTo(-2.345, 9);
  });
});
