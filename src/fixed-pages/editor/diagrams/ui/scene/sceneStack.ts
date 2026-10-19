import type { VisualDiagramModel } from '../../model/types';
import type { DiagramLayer } from '@/diagrams';
import { DEFAULT_DIAGRAM_LAYERS } from '@/diagrams';

export function ensureSceneStack(model: VisualDiagramModel): VisualDiagramModel {
  const existing = model.layers?.length ? model.layers : DEFAULT_DIAGRAM_LAYERS.map(layer => ({ ...layer }));
  const layerIds = new Set(existing.map(layer => layer.id));
  const fallbackLayer = existing.find(layer => layer.id === 'geometry')?.id
    ?? existing[0]?.id
    ?? 'geometry';

  return {
    ...model,
    layers: existing,
    objects: model.objects.map(object => ({
      ...object,
      layerId: object.layerId && layerIds.has(object.layerId)
        ? object.layerId
        : object.objectType === 'control'
          ? (existing.find(layer => layer.id === 'controls')?.id ?? fallbackLayer)
          : fallbackLayer,
      order: Number.isFinite(object.order) ? object.order : 0,
    })),
  };
}

export function ensureLayerExists(model: VisualDiagramModel, layerId: string): VisualDiagramModel {
  if (model.layers.some(layer => layer.id === layerId)) return model;
  const fromDefaults = DEFAULT_DIAGRAM_LAYERS.find(layer => layer.id === layerId);
  const nextLayer: DiagramLayer = fromDefaults
    ? { ...fromDefaults, order: (Math.max(0, ...model.layers.map(layer => layer.order)) + 10) }
    : {
        id: layerId,
        label: layerId,
        order: (Math.max(0, ...model.layers.map(layer => layer.order)) + 10),
        visible: true,
        locked: false,
      };
  return { ...model, layers: [...model.layers, nextLayer] };
}
