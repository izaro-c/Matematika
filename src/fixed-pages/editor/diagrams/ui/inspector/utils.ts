import { objectKind, sceneReferences, type DiagramObjectKind } from '@/diagrams';
import type { VisualDiagramModel, VisualElement } from '@/fixed-pages/editor/diagrams/model/types';
import { renameDiagramId } from '@/fixed-pages/editor/diagrams/model/tools/graphCommands';
import { modelElements, modelPoints, modelSliders, toolReferenceCandidatesForSlot, withSceneReferences } from '@/fixed-pages/editor/diagrams/model';

export function availableLayers(model: VisualDiagramModel, t: (key: string) => string) {
  return model.layers && model.layers.length > 0
    ? model.layers
    : [
        { id: 'geometry', label: t('editor.diagramOptions.layerGeometry') },
        { id: 'annotations', label: t('editor.diagramOptions.layerAnnotations') },
        { id: 'controls', label: t('editor.diagramOptions.layerControls') },
        { id: 'background', label: t('editor.diagramOptions.layerBackground') },
      ];
}

const POINT_ONLY_KINDS = new Set([
  'segment', 'line', 'ray', 'circle', 'arc', 'polygon', 'perpendicular', 'parallel',
  'angle', 'nonReflexAngle', 'rightAngle', 'angleBisector', 'midpoint', 'perpendicularFoot',
  'segmentExtension', 'congruenceMark', 'parallelMark', 'measureTicks', 'dimensionLine',
]);

export function elementReferenceCandidates(
  model: VisualDiagramModel,
  excludeId: string,
  kind?: DiagramObjectKind,
  slotIndex = 0,
) {
  if (kind && kind !== 'point' && kind !== 'control') {
    try {
      const slotted = toolReferenceCandidatesForSlot(model, kind, slotIndex)
        .filter(item => item.id !== excludeId)
        .map(item => ({
          id: item.id,
          label: item.label || item.id,
          type: String(objectKind(item)),
        }));
      if (slotted.length > 0) return slotted;
    } catch {
      // kind may not be a CanvasTool; fall through
    }
  }
  if (kind && POINT_ONLY_KINDS.has(kind)) {
    return modelPoints(model).map(p => ({ id: p.id, label: p.label || p.id, type: 'point' }));
  }
  return [
    ...modelPoints(model).map(p => ({ id: p.id, label: p.label || p.id, type: 'point' })),
    ...modelElements(model).filter(e => e.id !== excludeId).map(e => ({ id: e.id, label: e.label || e.id, type: String(objectKind(e)) })),
    ...modelSliders(model).map(s => ({ id: s.id, label: s.label || s.id, type: 'slider' })),
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

/** Referencias ordenadas del objeto según los huecos de su herramienta. */
export function elementRefs(model: VisualDiagramModel, element: VisualElement): string[] {
  return sceneReferences(model, element);
}

export function updateElementRef(model: VisualDiagramModel, element: VisualElement, refIndex: number, newRefId: string): VisualElement {
  const nextRefs = elementRefs(model, element);
  nextRefs[refIndex] = newRefId;
  return withSceneReferences(element, nextRefs);
}
