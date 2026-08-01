import { describe, expect, it } from 'vitest';
import { materializeSameSideConstraints } from '@/diagrams/spec/scene';
import { toWorkingSceneV2 } from '@/diagrams/spec/v3Compatibility';
import type { DiagramSpecV3 } from '@/diagrams/spec/v3';

const minimalSameSideV3: DiagramSpecV3 = {
  version: 3,
  renderer: 'matematika-diagram-renderer-v3',
  title: 'Semiplano v3',
  componentId: 'sameside-v3-compat',
  category: 'Demos',
  mode: 'simulation',
  axis: false,
  grid: false,
  viewport: { bounds: [-6, 6, 6, -6], home: [-6, 6, 6, -6], minZoom: 0.5, maxZoom: 4, padding: 0.08 },
  layers: [{ id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false }],
  groups: [],
  objects: [
    {
      id: 'pA', label: 'A', color: 'terracota', layerId: 'geometry', order: 0, visible: true, locked: false,
      groupIds: [], selection: { selectable: true, role: 'primary', ariaLabel: 'A' },
      objectType: 'point', definition: { type: 'coordinates', x: 0, y: 0 },
      mobility: { type: 'constrained', relationIds: ['sameA'] },
    },
    {
      id: 'pB', label: 'B', color: 'terracota', layerId: 'geometry', order: 1, visible: true, locked: false,
      groupIds: [], selection: { selectable: true, role: 'primary', ariaLabel: 'B' },
      objectType: 'point', definition: { type: 'coordinates', x: -2, y: -2 },
      mobility: { type: 'free' },
    },
    {
      id: 'pC', label: 'C', color: 'terracota', layerId: 'geometry', order: 2, visible: true, locked: false,
      groupIds: [], selection: { selectable: true, role: 'primary', ariaLabel: 'C' },
      objectType: 'point', definition: { type: 'coordinates', x: 2, y: -2 },
      mobility: { type: 'free' },
    },
  ],
  relations: [{
    id: 'sameA', label: 'A no cruza BC', enabled: true, type: 'same-half-plane',
    points: ['pA', 'pB'], boundary: 'pC',
  }],
  steps: [],
  note: '',
};

describe('v3Compatibility', () => {
  it('no materializa side en proyección v3→v2', () => {
    const v2 = toWorkingSceneV2(minimalSameSideV3);
    const projectedSameA = v2.constraints.find(constraint => constraint.id === 'sameA');
    expect(projectedSameA?.side).toBeUndefined();
  });

  it('materializa side bajo demanda con materializeSameSideConstraints', () => {
    const v2 = toWorkingSceneV2(minimalSameSideV3);
    const materialized = materializeSameSideConstraints(v2);
    const materializedSameA = materialized.constraints.find(constraint => constraint.id === 'sameA');
    expect(materializedSameA?.side).toBe(1);
  });
});
