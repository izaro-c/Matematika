import { describe, it, expect } from 'vitest';
import type { DiagramObject, DiagramSpec } from '@/diagrams/model';
import { compactHeaderReadings, headerReadingText } from '@/diagrams/render/DiagramKatexOverlay';
import { element, point } from '@/fixed-pages/editor/diagrams/model';
import { sceneSpec } from '../helpers/diagramSpec';

function dimension(id: string, label: string, refs: [string, string]): DiagramObject {
  const base = element(id, label, 'dimensionLine', refs, 'mora');
  return base.objectType === 'path' && base.geometry.type === 'dimension'
    ? { ...base, geometry: { ...base.geometry, offset: 0.4, precision: 2, unit: 'cm' } }
    : base;
}

describe('Header Readings Equality Behavior', () => {
  const dimensions = [dimension('dimAB', 'AB', ['A', 'B']), dimension('dimBC', 'BC', ['B', 'C'])];
  const baseSpec: DiagramSpec = sceneSpec({
    title: 'Test Diagram',
    componentId: 'TestDiagram',
    objects: [point('A', 'A', 0, 0, false, 'canela'), point('B', 'B', 4, 0, false, 'canela'), point('C', 'C', 4, 3, false, 'canela'), ...dimensions],
    header: {
      readingsMode: 'custom',
      readings: [
        {
          id: 'reading-1',
          sourceIds: ['dimAB', 'dimBC'],
          presentation: 'equality',
        },
      ],
    },
  });

  it('separates readings when values are different', () => {
    // AB = 4 cm, BC = 3 cm
    const variables = {
      'A.x': 0, 'A.y': 0,
      'B.x': 4, 'B.y': 0,
      'C.x': 4, 'C.y': 3,
    };
    const entries = dimensions.map(item => ({
      item,
      text: headerReadingText(item, variables)!,
    })).filter(entry => Boolean(entry.text));

    expect(entries).toHaveLength(2);
    expect(entries[0].text).toContain('4.00 cm');
    expect(entries[1].text).toContain('3.00 cm');

    const readings = compactHeaderReadings(entries, baseSpec);
    // When not equal, they must be rendered as separate items, NOT joined by '='
    expect(readings).toHaveLength(2);
    expect(readings[0].text).toBe('AB: 4.00 cm');
    expect(readings[1].text).toBe('BC: 3.00 cm');
    expect(readings.some(r => r.text.includes('AB = BC'))).toBe(false);
  });

  it('combines readings as equality when values are equal', () => {
    // AB = 3 cm, BC = 3 cm
    const variables = {
      'A.x': 1, 'A.y': 0,
      'B.x': 4, 'B.y': 0,
      'C.x': 4, 'C.y': 3,
    };
    const entries = dimensions.map(item => ({
      item,
      text: headerReadingText(item, variables)!,
    })).filter(entry => Boolean(entry.text));

    expect(entries).toHaveLength(2);
    expect(entries[0].text).toContain('3.00 cm');
    expect(entries[1].text).toContain('3.00 cm');

    const readings = compactHeaderReadings(entries, baseSpec);
    // When equal, they are combined as equality
    expect(readings).toHaveLength(1);
    expect(readings[0].text).toBe('AB = BC = 3.00 cm');
    expect(readings[0].visibility).toBe('all');
  });

  it('handles label-value and value presentations', () => {
    const specLabelValue: DiagramSpec = {
      ...baseSpec,
      header: {
        readingsMode: 'custom',
        readings: [
          { id: 'r1', sourceIds: ['dimAB'], presentation: 'label-value' },
          { id: 'r2', sourceIds: ['dimBC'], presentation: 'value' },
        ],
      },
    };
    const variables = {
      'A.x': 0, 'A.y': 0,
      'B.x': 4, 'B.y': 0,
      'C.x': 4, 'C.y': 3,
    };
    const entries = dimensions.map(item => ({
      item,
      text: headerReadingText(item, variables)!,
    }));

    const readings = compactHeaderReadings(entries, specLabelValue);
    expect(readings).toHaveLength(2);
    expect(readings[0].text).toBe('AB: 4.00 cm');
    expect(readings[1].text).toBe('3.00 cm');
  });
});
