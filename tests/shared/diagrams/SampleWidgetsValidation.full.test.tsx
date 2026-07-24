/**
 * Validación de la Fase 3 de la auditoría del runtime de diagramas: repite la
 * batería de estabilidad sobre una muestra representativa adicional que
 * `RayDirectionStability.full.test.tsx` no cubre — Ángulo (dos semirrectas
 * ancladas a un vértice fijo, con atractores) y Paralelogramo (región
 * derivada por expresión, con una restricción `mantenerConvexo` sobre el
 * vértice móvil) — a través de la tubería completa (React + MathBoard +
 * JSXGraph reales en jsdom, eventos de puntero reales).
 */
import React from 'react';
import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import JXG from 'jsxgraph';

const WIDTH = 700;
const HEIGHT = 500;

vi.mock('@/shared/ui/KatexText', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>();
  return { ...original, renderKatexTextToHtml: (text: string) => text };
});

import { DiagramRenderer } from '@/shared/diagrams/runtime/DiagramRenderer';
import { AnguloSpec } from '@/widgets/diagrams/Definiciones/Angulo';
import { ParalelogramoSpec } from '@/widgets/diagrams/Definiciones/Paralelogramo';
import type { DiagramSpecV2, DiagramSpecV3 } from '@/shared/diagrams/spec';

function stubSize(node: HTMLElement) {
  Object.defineProperty(node, 'clientWidth', { value: WIDTH, configurable: true });
  Object.defineProperty(node, 'clientHeight', { value: HEIGHT, configurable: true });
  node.getBoundingClientRect = () => ({
    x: 0, y: 0, left: 0, top: 0, right: WIDTH, bottom: HEIGHT, width: WIDTH, height: HEIGHT,
    toJSON: () => ({}),
  }) as DOMRect;
}

function renderWithStubbedSizes(spec: DiagramSpecV2 | DiagramSpecV3) {
  const originalCreateElement = document.createElement.bind(document);
  const spy = vi.spyOn(document, 'createElement').mockImplementation(((tag: string, options?: ElementCreationOptions) => {
    const node = originalCreateElement(tag, options);
    if (tag === 'div') stubSize(node as HTMLElement);
    return node;
  }) as typeof document.createElement);
  const view = render(<DiagramRenderer spec={spec} />);
  [...view.container.querySelectorAll('div')].forEach(node => stubSize(node as HTMLElement));
  spy.mockRestore();
  return view;
}

async function locateBoard(): Promise<JXG.Board> {
  await act(async () => { await Promise.resolve(); });
  const boardIds = Object.keys(JXG.boards);
  expect(boardIds.length).toBeGreaterThan(0);
  const board = JXG.boards[boardIds[boardIds.length - 1]] as JXG.Board;
  stubSize(board.containerObj as HTMLElement);
  return board;
}

interface RaySvg { x1: number; y1: number; x2: number; y2: number }

function svgLine(node: SVGLineElement): RaySvg {
  return {
    x1: Number(node.getAttribute('x1')),
    y1: Number(node.getAttribute('y1')),
    x2: Number(node.getAttribute('x2')),
    y2: Number(node.getAttribute('y2')),
  };
}

function rayDirectionCosine(ray: JXG.Line, origin: JXG.Point, direction: JXG.Point): number {
  const svg = svgLine(ray.rendNode as SVGLineElement);
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

function screenOf(board: JXG.Board, x: number, y: number) {
  const coords = new JXG.Coords(JXG.COORDS_BY_USER, [x, y], board);
  return { clientX: coords.scrCoords[1], clientY: coords.scrCoords[2] };
}

function pointerEvent(type: string, position: { clientX: number; clientY: number }) {
  return new PointerEvent(type, {
    bubbles: true, cancelable: true, pointerId: 1, isPrimary: true,
    clientX: position.clientX, clientY: position.clientY, buttons: type === 'pointerup' ? 0 : 1,
  });
}

function dragGesture(board: JXG.Board, target: JXG.Point, path: Array<[number, number]>, onStep?: (step: number) => void) {
  const boardContainer = board.containerObj as HTMLElement;
  act(() => { boardContainer.dispatchEvent(pointerEvent('pointerdown', screenOf(board, target.X(), target.Y()))); });
  path.forEach(([x, y], step) => {
    act(() => { boardContainer.dispatchEvent(pointerEvent('pointermove', screenOf(board, x, y))); });
    onStep?.(step);
  });
  act(() => { boardContainer.dispatchEvent(pointerEvent('pointerup', screenOf(board, target.X(), target.Y()))); });
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Ángulo: las dos semirrectas permanecen ancladas al vértice fijo O durante el arrastre', () => {
  it('rayOA no voltea ni se separa de O mientras A recorre un gesto de arrastre en espiral', async () => {
    renderWithStubbedSizes(AnguloSpec);
    const board = await locateBoard();

    const objects = board.objectsList as JXG.GeometryElement[];
    const points = objects.filter(el => el.elType === 'point') as JXG.Point[];
    const lines = objects.filter(el => el.elType === 'line') as JXG.Line[];
    const pO = points.find(p => p.name === 'O')!;
    const pA = points.find(p => p.name === 'A')!;
    const rayOA = lines.find(l => (
      !l.evalVisProp('straightfirst') && l.evalVisProp('straightlast')
      && ((l.point1 === pO && l.point2 === pA) || (l.point2 === pO && l.point1 === pA))
    ))!;
    expect(pO && pA && rayOA).toBeTruthy();

    const badFrames: Array<{ step: number; cos: number }> = [];
    const check = (step: number) => {
      const separation = Math.hypot(pA.X() - pO.X(), pA.Y() - pO.Y());
      const cos = rayDirectionCosine(rayOA, pO, pA);
      if (cos < 0.98 && separation > 0.05) badFrames.push({ step, cos });
      // O es fijo ("mobility.type: fixed" en el spec): un arrastre de A nunca
      // debería desplazarlo.
      expect(pO.X()).toBeCloseTo(0, 5);
      expect(pO.Y()).toBeCloseTo(0, 5);
    };

    dragGesture(board, pA, Array.from({ length: 60 }, (_, i) => {
      const angle = i * 0.37;
      const radius = 0.3 + (i % 18) * 0.22;
      return [radius * Math.cos(angle), radius * Math.sin(angle)] as [number, number];
    }), check);

    expect(badFrames).toEqual([]);
  });
});

describe('Paralelogramo: la restricción de convexidad y la construcción por expresión sobreviven al arrastre', () => {
  it('C = B + D - A se mantiene en todo momento mientras D se arrastra, sin producir NaN/Infinity', async () => {
    renderWithStubbedSizes(ParalelogramoSpec);
    const board = await locateBoard();

    const objects = board.objectsList as JXG.GeometryElement[];
    const points = objects.filter(el => el.elType === 'point') as JXG.Point[];
    const pA = points.find(p => p.name === 'A')!;
    const pB = points.find(p => p.name === 'B')!;
    // JSXGraph autonombra con letras (A, B, C, ...) cualquier punto auxiliar
    // creado sin `name` explícito (p. ej. puntos internos de la guía de
    // rectángulo/lados iguales). Eso puede colisionar con la etiqueta "C" del
    // vértice derivado real, que se distingue porque su creación en
    // `useBoardLifecycle.ts` fija `fixed: true` (es un punto por expresión,
    // no arrastrable).
    const pC = points.find(p => p.name === 'C' && p.evalVisProp('fixed'))!;
    const pD = points.find(p => p.name === 'D')!;
    expect(pA && pB && pC && pD).toBeTruthy();

    const invariantViolations: Array<{ step: number; expected: [number, number]; actual: [number, number] }> = [];
    const check = (step: number) => {
      const values = [pA.X(), pA.Y(), pB.X(), pB.Y(), pC.X(), pC.Y(), pD.X(), pD.Y()];
      expect(values.every(Number.isFinite)).toBe(true);
      const expected: [number, number] = [pB.X() + pD.X() - pA.X(), pB.Y() + pD.Y() - pA.Y()];
      const actual: [number, number] = [pC.X(), pC.Y()];
      if (Math.abs(expected[0] - actual[0]) > 1e-6 || Math.abs(expected[1] - actual[1]) > 1e-6) {
        invariantViolations.push({ step, expected, actual });
      }
    };

    // Recorre una región amplia, incluida una franja cercana a la recta AB
    // donde la restricción "mantenerConvexo" debe recortar D en vez de
    // dejarlo degenerar.
    dragGesture(board, pD, Array.from({ length: 50 }, (_, i) => {
      const angle = i * 0.42;
      const radius = 0.4 + (i % 16) * 0.3;
      return [-1.5 + radius * Math.cos(angle), -1 + radius * Math.sin(angle) * 0.6] as [number, number];
    }), check);

    expect(invariantViolations).toEqual([]);
  });
});
