import type { VisualDiagramModel } from './types';

type OrderedSceneItem = {
  id: string;
  layerId: string;
  order: number;
};

function compareSceneItems(left: OrderedSceneItem, right: OrderedSceneItem): number {
  return left.order - right.order || left.id.localeCompare(right.id);
}

export function listSceneItems(model: VisualDiagramModel): OrderedSceneItem[] {
  return [
    ...model.points.map(item => ({ id: item.id, layerId: item.layerId, order: item.order })),
    ...model.elements.map(item => ({ id: item.id, layerId: item.layerId, order: item.order })),
    ...model.sliders.map(item => ({ id: item.id, layerId: item.layerId, order: item.order })),
  ];
}

export function listLayerSceneItems(model: VisualDiagramModel, layerId: string): OrderedSceneItem[] {
  return listSceneItems(model).filter(item => item.layerId === layerId).sort(compareSceneItems);
}

/** Orden de visualización: el primero es el que queda delante en el lienzo. */
export function listLayerSceneItemsFrontFirst(model: VisualDiagramModel, layerId: string): OrderedSceneItem[] {
  return listLayerSceneItems(model, layerId).reverse();
}

/** IDs de escena ordenados por capa (orden de capas) y, dentro de cada una, por pila visual. */
export function listSceneItemIdsInLayerVisualOrder(model: VisualDiagramModel): string[] {
  return model.layers
    .slice()
    .sort((left, right) => left.order - right.order)
    .flatMap(layer => listLayerSceneItemsFrontFirst(model, layer.id).map(item => item.id));
}

export function moveSceneItemVisual(
  model: VisualDiagramModel,
  objectId: string,
  targetLayerId: string,
  visualIndex: number,
): VisualDiagramModel {
  const destinationItems = listLayerSceneItems(model, targetLayerId).filter(item => item.id !== objectId);
  const clampedVisual = Math.max(0, Math.min(visualIndex, destinationItems.length));
  const storageIndex = destinationItems.length - clampedVisual;
  return moveSceneItem(model, objectId, targetLayerId, storageIndex);
}

export function nextLayerItemOrder(model: VisualDiagramModel, layerId: string): number {
  const layerItems = listLayerSceneItems(model, layerId);
  if (layerItems.length === 0) return 0;
  return layerItems[layerItems.length - 1].order + 1;
}

function applyOrderMap(model: VisualDiagramModel, orderById: Map<string, { layerId: string; order: number }>): VisualDiagramModel {
  return {
    ...model,
    points: model.points.map(item => {
      const next = orderById.get(item.id);
      return next ? { ...item, layerId: next.layerId, order: next.order } : item;
    }),
    elements: model.elements.map(item => {
      const next = orderById.get(item.id);
      return next ? { ...item, layerId: next.layerId, order: next.order } : item;
    }),
    sliders: model.sliders.map(item => {
      const next = orderById.get(item.id);
      return next ? { ...item, layerId: next.layerId, order: next.order } : item;
    }),
  };
}

export function normalizeLayerItemOrders(model: VisualDiagramModel): VisualDiagramModel {
  const orderById = new Map<string, { layerId: string; order: number }>();
  const layerIds = [...new Set(listSceneItems(model).map(item => item.layerId))];
  layerIds.forEach(layerId => {
    listLayerSceneItems(model, layerId).forEach((item, index) => {
      orderById.set(item.id, { layerId, order: index });
    });
  });
  return applyOrderMap(model, orderById);
}

function reorderLayerItems(layerItems: OrderedSceneItem[], objectId: string, targetIndex: number): OrderedSceneItem[] {
  const currentIndex = layerItems.findIndex(item => item.id === objectId);
  if (currentIndex < 0) return layerItems;
  const reordered = layerItems.filter(item => item.id !== objectId);
  const clampedIndex = Math.max(0, Math.min(targetIndex, reordered.length));
  reordered.splice(clampedIndex, 0, layerItems[currentIndex]);
  return reordered.map((item, index) => ({ ...item, order: index }));
}

export function moveSceneItem(
  model: VisualDiagramModel,
  objectId: string,
  targetLayerId: string,
  targetIndex: number,
): VisualDiagramModel {
  const current = listSceneItems(model).find(item => item.id === objectId);
  if (!current) return model;

  const orderById = new Map<string, { layerId: string; order: number }>();
  listSceneItems(model).forEach(item => {
    orderById.set(item.id, { layerId: item.layerId, order: item.order });
  });

  if (current.layerId === targetLayerId) {
    const reordered = reorderLayerItems(listLayerSceneItems(model, targetLayerId), objectId, targetIndex);
    reordered.forEach(item => orderById.set(item.id, { layerId: targetLayerId, order: item.order }));
    return normalizeLayerItemOrders(applyOrderMap(model, orderById));
  }

  const sourceItems = listLayerSceneItems(model, current.layerId).filter(item => item.id !== objectId);
  sourceItems.forEach((item, index) => orderById.set(item.id, { layerId: current.layerId, order: index }));

  const destinationItems = listLayerSceneItems(model, targetLayerId).filter(item => item.id !== objectId);
  const clampedIndex = Math.max(0, Math.min(targetIndex, destinationItems.length));
  destinationItems.splice(clampedIndex, 0, { ...current, layerId: targetLayerId });
  destinationItems.forEach((item, index) => orderById.set(item.id, { layerId: targetLayerId, order: index }));

  return normalizeLayerItemOrders(applyOrderMap(model, orderById));
}

function moveSceneItemByOffset(model: VisualDiagramModel, objectId: string, offset: number): VisualDiagramModel {
  const current = listSceneItems(model).find(item => item.id === objectId);
  if (!current) return model;
  const layerItems = listLayerSceneItems(model, current.layerId);
  const currentIndex = layerItems.findIndex(item => item.id === objectId);
  if (currentIndex < 0) return model;
  const targetIndex = currentIndex + offset;
  if (targetIndex < 0 || targetIndex >= layerItems.length) return model;
  return moveSceneItem(model, objectId, current.layerId, targetIndex);
}

export function bringSceneItemForward(model: VisualDiagramModel, objectId: string): VisualDiagramModel {
  return moveSceneItemByOffset(model, objectId, 1);
}

export function sendSceneItemBackward(model: VisualDiagramModel, objectId: string): VisualDiagramModel {
  return moveSceneItemByOffset(model, objectId, -1);
}

export function bringSceneItemToFront(model: VisualDiagramModel, objectId: string): VisualDiagramModel {
  const current = listSceneItems(model).find(item => item.id === objectId);
  if (!current) return model;
  const layerItems = listLayerSceneItems(model, current.layerId);
  return moveSceneItem(model, objectId, current.layerId, layerItems.length - 1);
}

export function sendSceneItemToBack(model: VisualDiagramModel, objectId: string): VisualDiagramModel {
  const current = listSceneItems(model).find(item => item.id === objectId);
  if (!current) return model;
  return moveSceneItem(model, objectId, current.layerId, 0);
}

export function moveSceneItemToLayer(
  model: VisualDiagramModel,
  objectId: string,
  targetLayerId: string,
): VisualDiagramModel {
  const destinationCount = listLayerSceneItems(model, targetLayerId).filter(item => item.id !== objectId).length;
  return moveSceneItem(model, objectId, targetLayerId, destinationCount);
}
