import { describe, expect, test } from 'vitest';
import {
  COMPASS_LAYOUT,
  COMPASS_OFFSET,
  LABEL_GAP,
  nativeLabelPlacementOptions,
} from '../../src/diagrams/render/elements/createBoardElement';

describe('native label placement', () => {
  test('explicit compass presets share equal Euclidean offset distance', () => {
    for (const [name, layout] of Object.entries(COMPASS_LAYOUT)) {
      expect(Math.hypot(layout.offset[0], layout.offset[1]), name).toBeCloseTo(LABEL_GAP, 9);
    }
  });

  test('Automática uses stable JSXGraph default urt (no custom auto-pick)', () => {
    expect(nativeLabelPlacementOptions(undefined)).toEqual({
      autoPosition: false,
      position: 'urt',
    });
  });

  test('explicit preset uses isometric layout', () => {
    expect(nativeLabelPlacementOptions('lft')).toEqual({
      autoPosition: false,
      position: 'lft',
      anchorX: 'right',
      anchorY: 'middle',
      offset: COMPASS_OFFSET.lft,
    });
  });
});
