/**
 * Estabilidad de rayBC en DemoAnguloExterno (tubo completo).
 * Reproduce el reporte: al acercar C a B, la semirrecta BC voltea.
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
import { DemoAnguloExternoSpec } from '@/widgets/diagrams/Demos/DemoAnguloExterno';
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

function svgLine(node: SVGLineElement) {
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

describe('DemoAnguloExterno: rayBC estable al acercar C a B', () => {
  it('no voltea rayBC cuando C se acerca a B por la recta BC', async () => {
    renderWithStubbedSizes(DemoAnguloExternoSpec);
    const board = await locateBoard();

    const objects = board.objectsList as JXG.GeometryElement[];
    const points = objects.filter(el => el.elType === 'point') as JXG.Point[];
    const lines = objects.filter(el => el.elType === 'line') as JXG.Line[];
    const pB = points.find(p => p.name === 'B')!;
    const pC = points.find(p => p.name === 'C')!;
    const rays = lines.filter(l => !l.evalVisProp('straightfirst') && l.evalVisProp('straightlast'));
    const rayBC = rays.find(l => (
      (l.point1 === pB && l.point2 === pC) || (l.point2 === pB && l.point1 === pC)
    ));
    expect(pB && pC && rayBC).toBeTruthy();

    const badFrames: Array<{ step: number; cos: number; cx: number; cy: number }> = [];
    const c0 = { x: pC.X(), y: pC.Y() };
    const path = Array.from({ length: 35 }, (_, i) => {
      const t = (i + 1) / 35;
      return [c0.x + t * (pB.X() - c0.x), c0.y + t * (pB.Y() - c0.y)] as [number, number];
    });

    dragGesture(board, pC, path, (step) => {
      const separation = Math.hypot(pC.X() - pB.X(), pC.Y() - pB.Y());
      const cos = rayDirectionCosine(rayBC, pB, pC);
      if (cos < 0.98 && separation > 0.05) {
        badFrames.push({ step, cos, cx: pC.X(), cy: pC.Y() });
      }
    });

    expect(badFrames).toEqual([]);
  });
});
