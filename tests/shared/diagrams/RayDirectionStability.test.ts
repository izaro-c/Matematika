/**
 * Estabilidad de dirección de la semirrecta (nivel JSXGraph puro).
 *
 * Reproduce, sobre un board JSXGraph real en jsdom y usando la fábrica de
 * producción (`createRay`/`createPoint` de `MathFactory`), la sospecha
 * reportada en páginas publicadas: una semirrecta que "da la vuelta" tras
 * varios movimientos. Cubre tanto el arrastre puro como un resize del
 * contenedor intercalado durante el arrastre, que es la condición que el
 * runtime compartido (`MathBoard`) introduce y que un arrastre aislado no
 * ejercita.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import JXG from 'jsxgraph';
import { createLine, createPoint, createRay, createSegment } from '@/shared/diagrams/core/MathFactory';
import type { ThemeColors } from '@/shared/diagrams/core/MathBoard';

const WIDTH = 600;
const HEIGHT = 600;

const theme: ThemeColors = {
  carbon: '#000000', terracota: '#000000', salvia: '#000000', lienzo: '#000000',
  pizarra: '#000000', ocre: '#000000', pavo: '#000000', granada: '#000000', musgo: '#000000',
};

let containerSequence = 0;

function createContainer(width = WIDTH, height = HEIGHT): HTMLDivElement {
  const div = document.createElement('div');
  containerSequence += 1;
  div.id = `jxg-ray-stability-${containerSequence}`;
  Object.defineProperty(div, 'clientWidth', { value: width, configurable: true });
  Object.defineProperty(div, 'clientHeight', { value: height, configurable: true });
  div.getBoundingClientRect = () => ({
    x: 0, y: 0, left: 0, top: 0, right: width, bottom: height, width, height,
    toJSON: () => ({}),
  }) as DOMRect;
  document.body.appendChild(div);
  return div;
}

interface RaySvg { x1: number; y1: number; x2: number; y2: number }

function raySvgCoords(ray: JXG.Line): RaySvg {
  const node = ray.rendNode as SVGLineElement;
  return {
    x1: Number(node.getAttribute('x1')),
    y1: Number(node.getAttribute('y1')),
    x2: Number(node.getAttribute('x2')),
    y2: Number(node.getAttribute('y2')),
  };
}

/**
 * La semirrecta con origen O visible debe dibujarse empezando en O y
 * extendiéndose en la dirección O→A. Devuelve el coseno entre la dirección
 * dibujada y la dirección esperada (>0 correcto, <0 volteada).
 */
function rayDirectionCosine(ray: JXG.Line, origin: JXG.Point, direction: JXG.Point): number {
  const svg = raySvgCoords(ray);
  const originScreen = origin.coords.scrCoords;
  const directionScreen = direction.coords.scrCoords;
  const d1 = Math.hypot(svg.x1 - originScreen[1], svg.y1 - originScreen[2]);
  const d2 = Math.hypot(svg.x2 - originScreen[1], svg.y2 - originScreen[2]);
  const [ox, oy, tx, ty] = d1 <= d2 ? [svg.x1, svg.y1, svg.x2, svg.y2] : [svg.x2, svg.y2, svg.x1, svg.y1];
  const drawn = { x: tx - ox, y: ty - oy };
  const expected = { x: directionScreen[1] - originScreen[1], y: directionScreen[2] - originScreen[2] };
  const drawnLength = Math.hypot(drawn.x, drawn.y) || 1;
  const expectedLength = Math.hypot(expected.x, expected.y) || 1;
  return (drawn.x * expected.x + drawn.y * expected.y) / (drawnLength * expectedLength);
}

function spiralPath(centerX: number, steps: number, angleStep: number, radiusStep: number, radiusPeriod: number): Array<[number, number]> {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const angle = index * angleStep;
    const radius = 0.2 + (index % radiusPeriod) * radiusStep;
    return [centerX + radius * Math.cos(angle), radius * Math.sin(angle)] as [number, number];
  });
}

describe('estabilidad de dirección: createRay (MathFactory) sobre board real', () => {
  let container: HTMLDivElement;
  let board: JXG.Board;

  beforeEach(() => {
    container = createContainer();
    board = JXG.JSXGraph.initBoard(container.id, {
      boundingbox: [-5, 5, 5, -5],
      axis: false,
      showCopyright: false,
      showNavigation: false,
      pan: { enabled: true },
      zoom: { wheel: true },
      resize: { enabled: false },
    });
  });

  afterEach(() => {
    JXG.JSXGraph.freeBoard(board);
    container.remove();
  });

  it('mantiene la dirección al mover el punto de dirección con setPosition en espiral', () => {
    const pO = createPoint(board, [-2, 0], { name: 'O' }, theme);
    const pA = createPoint(board, [1.16, 2.07], { name: 'A' }, theme);
    const ray = createRay(board, [pO, pA], {}, theme);
    board.update();

    const badFrames: Array<{ step: number; cos: number }> = [];
    spiralPath(-2, 200, 0.31, 0.22, 40).forEach(([x, y], step) => {
      pA.setPosition(JXG.COORDS_BY_USER, [x, y]);
      board.update();
      const cos = rayDirectionCosine(ray, pO, pA);
      if (cos < 0.99) badFrames.push({ step, cos });
    });
    expect(badFrames).toEqual([]);
  });

  it('mantiene la dirección al arrastrar con eventos de puntero reales', () => {
    const pO = createPoint(board, [-2, 0], { name: 'O' }, theme);
    const pA = createPoint(board, [1.16, 2.07], { name: 'A' }, theme);
    const ray = createRay(board, [pO, pA], {}, theme);
    board.update();

    const screenOf = (x: number, y: number) => {
      const coords = new JXG.Coords(JXG.COORDS_BY_USER, [x, y], board);
      return { clientX: coords.scrCoords[1], clientY: coords.scrCoords[2] };
    };
    const pointerEvent = (type: string, position: { clientX: number; clientY: number }) => new PointerEvent(type, {
      bubbles: true, cancelable: true, pointerId: 1, isPrimary: true,
      clientX: position.clientX, clientY: position.clientY, buttons: type === 'pointerup' ? 0 : 1,
    });

    const badFrames: Array<{ step: number; cos: number }> = [];
    container.dispatchEvent(pointerEvent('pointerdown', screenOf(pA.X(), pA.Y())));
    spiralPath(-2, 150, 0.37, 0.28, 30).forEach(([x, y], step) => {
      container.dispatchEvent(pointerEvent('pointermove', screenOf(x, y)));
      const cos = rayDirectionCosine(ray, pO, pA);
      if (cos < 0.99) badFrames.push({ step, cos });
    });
    container.dispatchEvent(pointerEvent('pointerup', screenOf(pA.X(), pA.Y())));
    expect(badFrames).toEqual([]);
  });

  it('mantiene la dirección cuando el contenedor cambia de tamaño (resizeContainer + setBoundingBox) durante el arrastre', () => {
    const pO = createPoint(board, [-2, 0], { name: 'O' }, theme);
    const pA = createPoint(board, [1.16, 2.07], { name: 'A' }, theme);
    const ray = createRay(board, [pO, pA], {}, theme);
    board.update();

    const badFrames: Array<{ step: number; cos: number }> = [];
    const path = spiralPath(-2, 120, 0.4, 0.25, 24);
    path.forEach(([x, y], step) => {
      pA.setPosition(JXG.COORDS_BY_USER, [x, y]);
      // Cada pocos pasos, se dispara exactamente lo que MathBoard hace desde su
      // ResizeObserver: resizeContainer + setBoundingBox + update, intercalado
      // con la propia actualización del arrastre.
      if (step % 7 === 0) {
        const nextWidth = step % 14 === 0 ? WIDTH - 40 : WIDTH;
        const nextHeight = step % 14 === 0 ? HEIGHT - 40 : HEIGHT;
        board.resizeContainer(nextWidth, nextHeight);
        board.setBoundingBox([-5, 5, 5, -5], true);
      }
      board.update();
      const cos = rayDirectionCosine(ray, pO, pA);
      if (cos < 0.99) badFrames.push({ step, cos });
    });
    expect(badFrames).toEqual([]);
  });
});

describe('generalización a recta y segmento: no exhiben la misma inestabilidad', () => {
  let container: HTMLDivElement;
  let board: JXG.Board;

  beforeEach(() => {
    container = createContainer();
    board = JXG.JSXGraph.initBoard(container.id, {
      boundingbox: [-5, 5, 5, -5],
      axis: false,
      showCopyright: false,
      showNavigation: false,
    });
  });

  afterEach(() => {
    JXG.JSXGraph.freeBoard(board);
    container.remove();
  });

  it('la recta (createLine) siempre pasa por ambos puntos bajo la misma trayectoria de arrastre', () => {
    const pA = createPoint(board, [-2, 0], { name: 'A' }, theme);
    const pB = createPoint(board, [1.16, 2.07], { name: 'B' }, theme);
    const line = createLine(board, [pA, pB], {}, theme);
    board.update();

    spiralPath(-2, 120, 0.35, 0.24, 30).forEach(([x, y]) => {
      pB.setPosition(JXG.COORDS_BY_USER, [x, y]);
      board.update();
      expect(line.point1.Dist(pA)).toBeCloseTo(0, 6);
      expect(line.point2.Dist(pB)).toBeCloseTo(0, 6);
    });
  });

  it('el segmento (createSegment) mantiene sus extremos exactos en los dos puntos bajo la misma trayectoria de arrastre', () => {
    const pA = createPoint(board, [-2, 0], { name: 'A' }, theme);
    const pB = createPoint(board, [1.16, 2.07], { name: 'B' }, theme);
    const segment = createSegment(board, [pA, pB], {}, theme);
    board.update();

    spiralPath(-2, 120, 0.35, 0.24, 30).forEach(([x, y]) => {
      pB.setPosition(JXG.COORDS_BY_USER, [x, y]);
      board.update();
      const svg = raySvgCoords(segment as unknown as JXG.Line);
      const aScreen = pA.coords.scrCoords;
      const bScreen = pB.coords.scrCoords;
      const matchesDirect = Math.hypot(svg.x1 - aScreen[1], svg.y1 - aScreen[2]) < 0.5
        && Math.hypot(svg.x2 - bScreen[1], svg.y2 - bScreen[2]) < 0.5;
      const matchesSwapped = Math.hypot(svg.x1 - bScreen[1], svg.y1 - bScreen[2]) < 0.5
        && Math.hypot(svg.x2 - aScreen[1], svg.y2 - aScreen[2]) < 0.5;
      expect(matchesDirect || matchesSwapped).toBe(true);
    });
  });
});
