/**
 * Estabilidad de dirección y coste de reconciliación del runtime compartido,
 * a través de la tubería completa (React + MathBoard + JSXGraph reales en
 * jsdom, eventos de puntero reales). Generaliza los antiguos spikes
 * `scratch-ray-flip*.spike.*` a un segundo widget con vértice fijo
 * (Bisectriz) y añade dos escenarios nuevos que los spikes no ejercitaban:
 * resize del contenedor a mitad de gesto, y recuento de pasadas de
 * `board.update()` por evento de arrastre.
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
import { SemirrectaSpec } from '@/widgets/diagrams/Definiciones/Semirrecta';
import { BisectrizSpec } from '@/widgets/diagrams/Definiciones/Bisectriz';
import type { DiagramSpecV2, DiagramSpecV3 } from '@/shared/diagrams/spec';
import { diagramConstraint, element, point } from '@/features/editor/diagrams/model/diagramElements';

/**
 * Construye un spec sintético con `dependentCount` puntos que dependen todos
 * de la longitud del segmento AB mediante `equalLength`: al arrastrar A, los
 * `dependentCount` puntos deben reposicionarse en el mismo fotograma.
 */
function equalLengthFanoutSpec(dependentCount: number): DiagramSpecV2 {
  const anchor = point('O', 'O', 0, 0, true);
  const pA = point('A', 'A', 2, 0);
  const pB = point('B', 'B', 4, 0);
  const segAB = element('segAB', 'AB', 'segment', ['A', 'B'], 'carbon', false);
  const dependents = Array.from({ length: dependentCount }, (_, index) => {
    const angle = (index / Math.max(dependentCount, 1)) * Math.PI * 2;
    const id = `C${index}`;
    return {
      ...point(id, id, Math.cos(angle) * 2, Math.sin(angle) * 2),
      constraintIds: [`equalLength-${id}`],
    };
  });
  const constraints = dependents.map((dependent) => (
    diagramConstraint(`equalLength-${dependent.id}`, `${dependent.id} a la misma longitud que AB`, 'equalLength', [dependent.id, 'O', 'segAB'])
  ));
  return {
    version: 2,
    renderer: 'matematika-diagram-renderer-v2',
    title: 'Abanico de igualdad de longitud (test)',
    componentId: `equal-length-fanout-${dependentCount}`,
    category: 'Demos',
    mode: 'simulation',
    axis: false,
    grid: false,
    viewport: { bounds: [-6, 6, 6, -6], home: [-6, 6, 6, -6], minZoom: 0.5, maxZoom: 4, padding: 0.08 },
    layers: [{ id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false }],
    groups: [],
    points: [anchor, pA, pB, ...dependents],
    elements: [segAB],
    sliders: [],
    steps: [{ id: 'initial', label: 'Inicio', description: '', visibleTargets: ['O', 'A', 'B', 'segAB', ...dependents.map(d => d.id)], durationMs: 0 }],
    constraints,
    note: '',
    extensions: {},
  };
}

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

describe.each([
  { name: 'Semirrecta (rayo con origen móvil)', spec: SemirrectaSpec, originAt: [-2, 0] as [number, number], originLabel: 'O', directionLabel: 'A' },
  { name: 'Bisectriz (rayo con vértice fijo)', spec: BisectrizSpec, originAt: [0, 0] as [number, number], originLabel: 'O', directionLabel: 'A' },
])('$name: dirección estable a través de la tubería completa', ({ spec, originAt, originLabel, directionLabel }) => {
  it('no voltea tras gestos repetidos de arrastre en espiral, a través y alrededor del origen', async () => {
    renderWithStubbedSizes(spec);
    const board = await locateBoard();

    const objects = board.objectsList as JXG.GeometryElement[];
    const points = objects.filter(el => el.elType === 'point') as JXG.Point[];
    const lines = objects.filter(el => el.elType === 'line') as JXG.Line[];
    const pOrigin = points.find(p => p.name === originLabel)!;
    const pDirection = points.find(p => p.name === directionLabel)!;
    const ray = lines.find(l => (
      !l.evalVisProp('straightfirst') && l.evalVisProp('straightlast')
      && ((l.point1 === pOrigin && l.point2 === pDirection) || (l.point2 === pOrigin && l.point1 === pDirection))
    ))!;
    expect(pOrigin && pDirection && ray).toBeTruthy();

    const badFrames: Array<{ step: number; cos: number }> = [];
    const check = (step: number) => {
      const separation = Math.hypot(pDirection.X() - pOrigin.X(), pDirection.Y() - pOrigin.Y());
      const cos = rayDirectionCosine(ray, pOrigin, pDirection);
      if (cos < 0.98 && separation > 0.05) badFrames.push({ step, cos });
    };

    dragGesture(board, pDirection, Array.from({ length: 60 }, (_, i) => {
      const angle = i * 0.4;
      const radius = 0.15 + (i % 20) * 0.3;
      return [originAt[0] + radius * Math.cos(angle), originAt[1] + radius * Math.sin(angle)] as [number, number];
    }), check);

    for (let repeat = 0; repeat < 5; repeat += 1) {
      dragGesture(board, pDirection, Array.from({ length: 12 }, (_, i) => {
        const angle = repeat + i * 0.6;
        return [pOrigin.X() + 0.4 * Math.cos(angle), pOrigin.Y() + 0.4 * Math.sin(angle)] as [number, number];
      }), check);
    }

    expect(badFrames).toEqual([]);
  });
});

describe('reentrancia: resize del contenedor a mitad de un gesto de arrastre', () => {
  class ControllableResizeObserver {
    static readonly instances: ControllableResizeObserver[] = [];
    callback: ResizeObserverCallback;
    target: Element | null = null;
    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
      ControllableResizeObserver.instances.push(this);
    }
    observe(target: Element) { this.target = target; }
    unobserve() { this.target = null; }
    disconnect() { this.target = null; }
    trigger() {
      if (!this.target) return;
      this.callback([{ target: this.target } as ResizeObserverEntry], this as unknown as ResizeObserver);
    }
  }

  it('no voltea la semirrecta cuando el contenedor cambia de tamaño durante el arrastre, incluso en un gesto largo (sin ventana de navegación por temporizador)', async () => {
    const originalResizeObserver = globalThis.ResizeObserver;
    globalThis.ResizeObserver = ControllableResizeObserver as unknown as typeof ResizeObserver;
    ControllableResizeObserver.instances.length = 0;
    vi.useFakeTimers();
    try {
      renderWithStubbedSizes(SemirrectaSpec);
      const board = await locateBoard();
      const boardContainer = board.containerObj as HTMLElement;

      const objects = board.objectsList as JXG.GeometryElement[];
      const points = objects.filter(el => el.elType === 'point') as JXG.Point[];
      const lines = objects.filter(el => el.elType === 'line') as JXG.Line[];
      const pO = points.find(p => p.name === 'O')!;
      const pA = points.find(p => p.name === 'A')!;
      const ray = lines.find(l => !l.evalVisProp('straightfirst') && l.evalVisProp('straightlast'))!;

      // JSXGraph ya protege su propio update() contra reentrancia real (board.inUpdate),
      // por lo que una llamada anidada no corrompe el render. Lo que sí es evitable es
      // recalcular y aplicar un nuevo setBoundingBox mientras el board todavía está en
      // mitad de una pasada de actualización: eso es trabajo desperdiciado, no un no-op.
      let boundingBoxCallsWhileInUpdate = 0;
      const originalSetBoundingBox = board.setBoundingBox.bind(board);
      board.setBoundingBox = ((...args: unknown[]) => {
        if ((board as unknown as { inUpdate?: boolean }).inUpdate) boundingBoxCallsWhileInUpdate += 1;
        return originalSetBoundingBox(...(args as Parameters<typeof originalSetBoundingBox>));
      }) as typeof board.setBoundingBox;

      act(() => { boardContainer.dispatchEvent(pointerEvent('pointerdown', screenOf(board, pA.X(), pA.Y()))); });
      // MathBoard.tsx ya no usa un temporizador fijo para "navegación de usuario":
      // el gesto se rastrea entre 'down' y 'up' reales, así que dejar pasar tiempo
      // sin soltar el puntero (como haría un arrastre lento) no debe reactivar
      // assertControlledViewport a mitad de gesto.
      act(() => { vi.advanceTimersByTime(150); });

      const badFrames: Array<{ step: number; cos: number }> = [];
      const path = Array.from({ length: 40 }, (_, i) => {
        const angle = i * 0.35;
        const radius = 0.2 + (i % 15) * 0.25;
        return [-2 + radius * Math.cos(angle), radius * Math.sin(angle)] as [number, number];
      });
      path.forEach(([x, y], step) => {
        act(() => { boardContainer.dispatchEvent(pointerEvent('pointermove', screenOf(board, x, y))); });
        if (step % 6 === 0) {
          const shrink = step % 12 === 0;
          Object.defineProperty(boardContainer, 'clientWidth', { value: shrink ? WIDTH - 60 : WIDTH, configurable: true });
          Object.defineProperty(boardContainer, 'clientHeight', { value: shrink ? HEIGHT - 60 : HEIGHT, configurable: true });
          act(() => { ControllableResizeObserver.instances.forEach(instance => instance.trigger()); });
        }
        const separation = Math.hypot(pA.X() - pO.X(), pA.Y() - pO.Y());
        const cos = rayDirectionCosine(ray, pO, pA);
        if (cos < 0.98 && separation > 0.05) badFrames.push({ step, cos });
      });
      act(() => { boardContainer.dispatchEvent(pointerEvent('pointerup', screenOf(board, pA.X(), pA.Y()))); });

      expect(badFrames).toEqual([]);
      expect(boundingBoxCallsWhileInUpdate).toBe(0);
    } finally {
      globalThis.ResizeObserver = originalResizeObserver;
      vi.useRealTimers();
    }
  });
});

async function countUpdatesForOneDragStep(spec: DiagramSpecV2 | DiagramSpecV3, targetLabel: string): Promise<number> {
  renderWithStubbedSizes(spec);
  const board = await locateBoard();

  const objects = board.objectsList as JXG.GeometryElement[];
  const points = objects.filter(el => el.elType === 'point') as JXG.Point[];
  const target = points.find(p => p.name === targetLabel)!;
  expect(target).toBeTruthy();

  let updateCalls = 0;
  const originalUpdate = board.update.bind(board);
  board.update = ((...args: unknown[]) => {
    updateCalls += 1;
    return originalUpdate(...(args as Parameters<typeof originalUpdate>));
  }) as typeof board.update;

  const boardContainer = board.containerObj as HTMLElement;
  act(() => { boardContainer.dispatchEvent(pointerEvent('pointerdown', screenOf(board, target.X(), target.Y()))); });
  // Deja que se asiente cualquier efecto de React pendiente del propio montaje/pointerdown
  // (no relacionado con el número de puntos dependientes) antes de medir.
  await act(async () => { await Promise.resolve(); });
  updateCalls = 0;
  act(() => { boardContainer.dispatchEvent(pointerEvent('pointermove', screenOf(board, target.X() + 0.3, target.Y() + 0.2))); });
  const updatesForOneStep = updateCalls;
  act(() => { boardContainer.dispatchEvent(pointerEvent('pointerup', screenOf(board, target.X(), target.Y()))); });
  return updatesForOneStep;
}

describe('recuento de reconciliaciones: un solo evento de arrastre no debe multiplicar board.update() por punto dependiente', () => {
  it('mover un punto sin dependientes cuesta lo mismo que mover uno con un dependiente enlazado por igualdad de longitud', async () => {
    const baseline = await countUpdatesForOneDragStep(SemirrectaSpec, 'A');
    document.body.innerHTML = '';
    const withOneDependent = await countUpdatesForOneDragStep(equalLengthFanoutSpec(1), 'A');

    console.log('board.update() por pointermove — 0 dependientes (Semirrecta):', baseline, '| 1 dependiente:', withOneDependent);
    // El punto dependiente sí necesita una reconciliación real (su posición
    // cambia), así que un +1 constante frente al caso sin dependientes es
    // correcto. Lo que no debe ocurrir es que ese coste crezca con el número
    // de dependientes (ver siguiente test).
    expect(withOneDependent).toBe(baseline + 1);
  });

  it('mover un punto con 6 dependientes enlazados por igualdad de longitud cuesta lo mismo que moverlo con solo 1 (no escala con N)', async () => {
    const withOneDependent = await countUpdatesForOneDragStep(equalLengthFanoutSpec(1), 'A');
    document.body.innerHTML = '';
    const withSixDependents = await countUpdatesForOneDragStep(equalLengthFanoutSpec(6), 'A');

    console.log('board.update() por pointermove — 1 dependiente:', withOneDependent, '| 6 dependientes:', withSixDependents);
    // Antes de la corrección, cada punto dependiente disparaba su propio
    // board.update() completo (un moveTo por punto en el bucle del
    // manejador de arrastre): este test habría fallado con 6 llamadas más
    // que con 1. Tras la corrección, una única reconciliación cubre todos
    // los puntos afectados en el mismo fotograma, sea 1 o sean 6.
    expect(withSixDependents).toBe(withOneDependent);
  });
});
