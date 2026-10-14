import { describe, expect, test, vi } from 'vitest';
import {
  COMPASS_LAYOUT,
  LABEL_GAP,
  nativeLabelPlacementOptions,
} from '../../src/diagrams/render/elements/createBoardElement';
import {
  calculateLineLabelAnchor,
  syncNativeElementLabel,
} from '../../src/diagrams/render/lifecycle/useBoardLifecycle';

describe('native label placement', () => {
  test('explicit compass presets share equal Euclidean offset distance', () => {
    for (const [name, layout] of Object.entries(COMPASS_LAYOUT)) {
      expect(Math.hypot(layout.offset[0], layout.offset[1]), name).toBeCloseTo(LABEL_GAP, 9);
    }
  });

  test('explicit preset uses isometric layout', () => {
    expect(nativeLabelPlacementOptions('lft')).toEqual({
      autoPosition: false,
      position: 'lft',
      anchorX: 'right',
      anchorY: 'middle',
      offset: COMPASS_LAYOUT.lft.offset,
    });
  });

  test('Automática uses stable JSXGraph default urt (no custom auto-pick)', () => {
    expect(nativeLabelPlacementOptions(undefined)).toEqual({
      autoPosition: false,
      position: 'urt',
    });
  });

  test('calculateLineLabelAnchor calculates screen percentage position identically for line and parallel', () => {
    const div = document.createElement('div');
    div.id = 'label-pos-test-board';
    div.style.width = '500px';
    div.style.height = '500px';
    div.getBoundingClientRect = () => ({
      width: 500,
      height: 500,
      top: 0,
      left: 0,
      right: 500,
      bottom: 500,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect);
    document.body.appendChild(div);

    const board = JXG.JSXGraph.initBoard('label-pos-test-board', {
      boundingbox: [-10, 10, 10, -10],
      showCopyright: false,
      showNavigation: false,
    });

    const pA = board.create('point', [0, 0]);
    const pB = board.create('point', [2, 1]);
    const pC = board.create('point', [0, 4]);
    const baseLine = board.create('line', [pA, pB]);
    const par = board.create('parallel', [baseLine, pC]);

    board.update();

    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const lineAnchor = calculateLineLabelAnchor(baseLine, t);
      const parAnchor = calculateLineLabelAnchor(par, t);

      // Verify anchor lies strictly on base line
      const lineResidual = Math.abs(baseLine.stdform[0] + baseLine.stdform[1] * lineAnchor.usrCoords[1] + baseLine.stdform[2] * lineAnchor.usrCoords[2]);
      expect(lineResidual).toBeLessThan(1e-6);

      // Verify anchor lies strictly on parallel line
      const parResidual = Math.abs(par.stdform[0] + par.stdform[1] * parAnchor.usrCoords[1] + par.stdform[2] * parAnchor.usrCoords[2]);
      expect(parResidual).toBeLessThan(1e-6);
    }
  });

  test('syncNativeElementLabel treats numeric labelPosition on parallel elements as parametric', () => {
    const labelSetAttribute = vi.fn();
    const element: any = {
      elType: 'parallel',
      board: { canvasWidth: 500, canvasHeight: 500 },
      point1: { X: () => 0, Y: () => 0 },
      point2: { X: () => 1, Y: () => 1 },
      label: {
        setAttribute: labelSetAttribute,
        visProp: {},
      },
    };
    syncNativeElementLabel(element, {
      visible: true,
      color: 'canela',
      highlightColor: 'ocre',
      opacity: 1,
      text: 'l_1',
      labelPosition: 0.5,
    });

    expect(typeof element.getLabelAnchor).toBe('function');
    expect(labelSetAttribute).toHaveBeenCalledWith(expect.objectContaining({
      autoPosition: false,
      anchorX: 'center',
      anchorY: 'middle',
    }));
  });
});

