import { describe, expect, it } from 'vitest';
import {
  createSceneConstructionPlan,
  parseDiagramSpecV3,
  projectDiagramSpecV3ToV2,
  type DiagramObject,
  type DiagramSpecV3,
  type PointObject,
} from '../../../src/shared/diagrams/public';

const selection = { selectable: true } as const;

function point(id: string, definition: PointObject['definition'], order: number): PointObject {
  return {
    id, objectType: 'point', label: id, color: 'carbon', layerId: 'geometry', order,
    visible: true, locked: false, groupIds: [], selection, target: false,
    definition, mobility: definition.type === 'coordinates' ? { type: 'free' } : { type: 'fixed' },
  };
}

function stressSpec(): DiagramSpecV3 {
  const objects: DiagramObject[] = [
    point('pA', { type: 'coordinates', x: -2, y: 0 }, 0),
    point('pB', { type: 'coordinates', x: 2, y: 0 }, 1),
  ];
  for (let index = 2; index < 250; index += 1) {
    objects.push(point(`p${index}`, { type: 'midpoint', points: [index === 2 ? 'pA' : `p${index - 1}`, 'pB'] }, index));
  }
  return {
    version: 3, renderer: 'matematika-diagram-renderer-v3', title: 'Escena de estrés', componentId: 'stress-scene',
    category: 'Pruebas', mode: 'diagram', axis: false, grid: false,
    viewport: { bounds: [-3, 2, 3, -2], home: [-3, 2, 3, -2], minZoom: 0.2, maxZoom: 12, padding: 0.16 },
    layers: [{ id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false }],
    groups: [], objects, relations: [], steps: [], note: '',
  };
}

describe('large DiagramSpec v3 scenes', () => {
  it('validates and plans a 250-object dependency chain within the interaction budget', () => {
    const spec = stressSpec();
    const started = performance.now();
    const parsed = parseDiagramSpecV3(spec);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const plan = createSceneConstructionPlan(projectDiagramSpecV3ToV2(parsed.data));
    const elapsed = performance.now() - started;

    expect(plan).toHaveLength(250);
    expect(plan.at(-1)?.item.id).toBe('p249');
    expect(elapsed).toBeLessThan(1_000);
  });
});
