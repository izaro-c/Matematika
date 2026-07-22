import { describe, expect, it } from 'vitest';
import type { VisualDiagramModel } from '../../../../src/features/editor/diagrams/model/types';
import {
  bringSceneItemForward,
  bringSceneItemToFront,
  listLayerSceneItems,
  listLayerSceneItemsFrontFirst,
  moveSceneItem,
  moveSceneItemToLayer,
  moveSceneItemVisual,
  nextLayerItemOrder,
  normalizeLayerItemOrders,
  sendSceneItemBackward,
  sendSceneItemToBack,
} from '../../../../src/features/editor/diagrams/model/sceneOrdering';
import { element, point } from '../../../../src/features/editor/diagrams/model/diagramElements';

function sampleModel(): VisualDiagramModel {
  return {
    points: [
      point('pA', 'A', 0, 0),
      point('pB', 'B', 1, 0),
      point('pC', 'C', 0, 1),
    ],
    elements: [
      element('segAB', 'AB', 'segment', ['pA', 'pB'], 'carbon'),
      element('segBC', 'BC', 'segment', ['pB', 'pC'], 'pavo'),
    ],
    sliders: [],
    layers: [
      { id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false },
      { id: 'annotations', label: 'Anotaciones', order: 1, visible: true, locked: false },
    ],
    groups: [],
    steps: [],
    constraints: [],
    dependencies: [],
    viewport: { bounds: [-6, 6, 6, -6] },
    showLabels: true,
    note: '',
  };
}

describe('sceneOrdering', () => {
  it('assigns compact sequential orders when normalizing a layer', () => {
    const model = normalizeLayerItemOrders({
      ...sampleModel(),
      points: sampleModel().points.map((item, index) => ({ ...item, order: index * 10_000 })),
      elements: sampleModel().elements.map((item, index) => ({ ...item, order: (index + 3) * 10_000 })),
    });
    expect(listLayerSceneItems(model, 'geometry').map(item => item.order)).toEqual([0, 1, 2, 3, 4]);
  });

  it('moves an item one step forward within the same layer', () => {
    const model = normalizeLayerItemOrders(sampleModel());
    const next = bringSceneItemForward(model, 'pA');
    expect(listLayerSceneItems(next, 'geometry').map(item => item.id)).toEqual(['pB', 'pA', 'pC', 'segAB', 'segBC']);
  });

  it('moves an item to the front and back of its layer', () => {
    const model = normalizeLayerItemOrders(sampleModel());
    const front = bringSceneItemToFront(model, 'pA');
    expect(listLayerSceneItems(front, 'geometry').map(item => item.id).at(-1)).toBe('pA');
    const back = sendSceneItemToBack(front, 'pA');
    expect(listLayerSceneItems(back, 'geometry').map(item => item.id)[0]).toBe('pA');
  });

  it('moves an item between layers at the requested index', () => {
    const model = normalizeLayerItemOrders(sampleModel());
    const moved = moveSceneItem(model, 'segAB', 'annotations', 0);
    expect(listLayerSceneItems(moved, 'geometry').map(item => item.id)).not.toContain('segAB');
    expect(listLayerSceneItems(moved, 'annotations').map(item => item.id)).toEqual(['segAB']);
    const appended = moveSceneItemToLayer(model, 'pC', 'annotations');
    expect(listLayerSceneItems(appended, 'annotations').map(item => item.id)).toEqual(['pC']);
  });

  it('uses the next compact order when appending to a layer', () => {
    const model = normalizeLayerItemOrders(sampleModel());
    expect(nextLayerItemOrder(model, 'geometry')).toBe(5);
    expect(nextLayerItemOrder(model, 'annotations')).toBe(0);
  });

  it('does not move an item beyond the layer bounds', () => {
    const model = normalizeLayerItemOrders(sampleModel());
    expect(sendSceneItemBackward(model, 'pA')).toBe(model);
    const front = bringSceneItemToFront(model, 'segBC');
    expect(bringSceneItemForward(front, 'segBC')).toBe(front);
  });

  it('maps visual index 0 to the front of the layer', () => {
    const model = normalizeLayerItemOrders(sampleModel());
    const moved = moveSceneItemVisual(model, 'pA', 'geometry', 0);
    expect(listLayerSceneItemsFrontFirst(moved, 'geometry').map(item => item.id)[0]).toBe('pA');
  });
});
