import { describe, expect, it } from 'vitest';
import { materializeSameSideConstraints } from '@/diagrams/geometry/layout/scene';
import { migrateDiagramSpecV2ToV3, toWorkingSceneV2 } from '@/diagrams/model/schema/v3Compatibility';
import type { DiagramSpecV3 } from '@/diagrams/model/schema/v3';

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

  it('preserva nombres, unidades, precisión, offsets y visibilidad de cotas y medidas en roundtrip V2→V3→V2', () => {
    const v2Spec = {
      ...toWorkingSceneV2(minimalSameSideV3),
      elements: [
        {
          id: 'dimAB',
          label: 'Cateto a',
          text: 'Cateto a: {value}',
          kind: 'dimensionLine' as const,
          refs: ['pA', 'pB'],
          color: 'pizarra' as const,
          layerId: 'geometry',
          order: 3,
          visible: true,
          showLabel: false,
          locked: false,
          groupIds: [],
          selection: { selectable: true, role: 'primary' as const },
          target: false,
          properties: {
            offset: 0.6,
            precision: 1,
            unit: 'cm',
          },
          style: {
            textOffset: [0.2, -0.4] as [number, number],
          },
        },
        {
          id: 'measureBC',
          label: 'Hipotenusa c',
          text: 'Hipotenusa: {value}',
          kind: 'measurement' as const,
          refs: ['pB', 'pC'],
          color: 'salvia' as const,
          layerId: 'geometry',
          order: 4,
          visible: true,
          showLabel: true,
          locked: false,
          groupIds: [],
          selection: { selectable: true, role: 'primary' as const },
          target: false,
          properties: {
            precision: 3,
            unit: 'm',
            anchorParameter: 0.75,
          },
          style: {
            textOffset: [-0.1, 0.3] as [number, number],
          },
        },
      ],
    };

    const v3 = migrateDiagramSpecV2ToV3(v2Spec);
    const roundtrip = toWorkingSceneV2(v3);

    const dim = roundtrip.elements.find((e: any) => e.id === 'dimAB');
    expect(dim).toBeDefined();
    expect(dim.label).toBe('Cateto a');
    expect(dim.text).toBe('Cateto a: {value}');
    expect(dim.showLabel).toBe(false);
    expect(dim.properties?.offset).toBe(0.6);
    expect(dim.properties?.precision).toBe(1);
    expect(dim.properties?.unit).toBe('cm');
    expect(dim.style?.textOffset).toEqual([0.2, -0.4]);

    const meas = roundtrip.elements.find((e: any) => e.id === 'measureBC');
    expect(meas).toBeDefined();
    expect(meas.label).toBe('Hipotenusa c');
    expect(meas.text).toBe('Hipotenusa: {value}');
    expect(meas.showLabel).toBe(true);
    expect(meas.properties?.precision).toBe(3);
    expect(meas.properties?.unit).toBe('m');
    expect(meas.properties?.anchorParameter).toBe(0.75);
    expect(meas.style?.textOffset).toEqual([-0.1, 0.3]);
  });
});
