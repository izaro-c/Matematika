import type { VisualDiagramModel, VisualElement } from '@/fixed-pages/editor/diagrams/model/types';
import { renameDiagramId } from '@/fixed-pages/editor/diagrams/model/tools/graphCommands';
import { toolReferenceCandidatesForSlot } from '@/fixed-pages/editor/diagrams/model';

export function availableLayers(model: VisualDiagramModel) {
  return model.layers && model.layers.length > 0
    ? model.layers
    : [
        { id: 'geometry', label: 'Geometría' },
        { id: 'annotations', label: 'Anotaciones' },
        { id: 'controls', label: 'Controles' },
        { id: 'background', label: 'Fondo' },
      ];
}

const POINT_ONLY_KINDS = new Set([
  'segment', 'line', 'ray', 'circle', 'arc', 'polygon', 'perpendicular', 'parallel',
  'angle', 'nonReflexAngle', 'rightAngle', 'angleBisector', 'midpoint', 'perpendicularFoot',
  'baseExtension', 'congruenceMark', 'parallelMark', 'measureTicks', 'dimensionLine',
]);

export function elementReferenceCandidates(
  model: VisualDiagramModel,
  excludeId: string,
  kind?: VisualElement['kind'],
  slotIndex = 0,
) {
  if (kind) {
    try {
      const slotted = toolReferenceCandidatesForSlot(model, kind, slotIndex)
        .filter(item => item.id !== excludeId)
        .map(item => ({
          id: item.id,
          label: item.label || item.id,
          type: 'kind' in item && item.kind ? String(item.kind) : 'ref',
        }));
      if (slotted.length > 0) return slotted;
    } catch {
      // kind may not be a CanvasTool; fall through
    }
  }
  if (kind && POINT_ONLY_KINDS.has(kind)) {
    return model.points.map(p => ({ id: p.id, label: p.label || p.id, type: 'Punto' }));
  }
  return [
    ...model.points.map(p => ({ id: p.id, label: p.label || p.id, type: 'Punto' })),
    ...model.elements.filter(e => e.id !== excludeId).map(e => ({ id: e.id, label: e.label || e.id, type: e.kind })),
    ...model.sliders.map(s => ({ id: s.id, label: s.label || s.id, type: 'Slider' })),
  ];
}

export function handleRenameId(
  model: VisualDiagramModel,
  oldId: string,
  candidateNewId: string,
  onUpdateModel?: (nextModel: VisualDiagramModel, label: string) => void,
  onSelectId?: (newId: string) => void,
) {
  const trimmed = candidateNewId.trim();
  if (!trimmed || trimmed === oldId || !onUpdateModel) return;
  const nextModel = renameDiagramId(model, oldId, trimmed);
  if (nextModel === model) return;
  onUpdateModel(nextModel, `Renombrar ID de ${oldId} a ${trimmed}`);
  if (onSelectId) onSelectId(trimmed);
}

export function updateElementRef(element: VisualElement, refIndex: number, newRefId: string): string[] {
  const nextRefs = [...(element.refs || [])];
  nextRefs[refIndex] = newRefId;
  return nextRefs;
}
