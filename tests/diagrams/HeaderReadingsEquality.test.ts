import { describe, it, expect } from 'vitest';
import type { DiagramSpecV2, DiagramElement } from '@/diagrams/model';
import { compactHeaderReadings, headerReadingText } from '@/diagrams/render/DiagramKatexOverlay';

describe('Header Readings Equality Behavior', () => {
  const baseSpec: DiagramSpecV2 = {
    id: 'test-diagram',
    title: 'Test Diagram',
    componentId: 'TestDiagram',
    canvasSize: { width: 500, height: 400 },
    viewport: { bounds: [-5, 5, 5, -5] },
    points: [
      { id: 'A', label: 'A', x: 0, y: 0, color: 'canela', selection: { selectable: true } },
      { id: 'B', label: 'B', x: 4, y: 0, color: 'canela', selection: { selectable: true } },
      { id: 'C', label: 'C', x: 4, y: 3, color: 'canela', selection: { selectable: true } },
    ],
    elements: [
      {
        id: 'dimAB',
        kind: 'dimensionLine',
        label: 'AB',
        color: 'mora',
        refs: ['A', 'B'],
        selection: { selectable: true },
        properties: { offset: 0.4, precision: 2, unit: 'cm' },
      },
      {
        id: 'dimBC',
        kind: 'dimensionLine',
        label: 'BC',
        color: 'mora',
        refs: ['B', 'C'],
        selection: { selectable: true },
        properties: { offset: 0.4, precision: 2, unit: 'cm' },
      },
    ],
    sliders: [],
    steps: [],
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
  };

  it('separates readings when values are different', () => {
    // AB = 4 cm, BC = 3 cm
    const variables = {
      'A.x': 0, 'A.y': 0,
      'B.x': 4, 'B.y': 0,
      'C.x': 4, 'C.y': 3,
    };
    const entries = baseSpec.elements.map(item => ({
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
    const entries = baseSpec.elements.map(item => ({
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
    const specLabelValue: DiagramSpecV2 = {
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
    const entries = specLabelValue.elements.map(item => ({
      item,
      text: headerReadingText(item, variables)!,
    }));

    const readings = compactHeaderReadings(entries, specLabelValue);
    expect(readings).toHaveLength(2);
    expect(readings[0].text).toBe('AB: 4.00 cm');
    expect(readings[1].text).toBe('3.00 cm');
  });
});
