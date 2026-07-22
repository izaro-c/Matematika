import {
  isAreaElement,
  legacyItemHasCapability,
  legacyReferenceCandidates,
  migrateDiagramSpecV2ToV3,
  objectHasCapability,
  type DiagramCapability,
  type DiagramElement,
  type DiagramSceneItem,
} from '../../../../shared/diagrams/spec';
import type { DiagramObject, DiagramSpecV3 } from '../../../../shared/diagrams/spec/v3';
import type { VisualDiagramModel } from './types';

const REFLECTION_AXIS_KINDS = new Set(['segment', 'line', 'ray']);

/** Proyección explícita del modelo v2 del editor al contrato v3. */
export function projectEditorModelToV3(model: VisualDiagramModel): DiagramSpecV3 {
  return migrateDiagramSpecV2ToV3(model);
}

/** Objetos v3 que declaran la capacidad pedida. */
export function v3ObjectsWithCapability(model: VisualDiagramModel, capability: DiagramCapability): DiagramObject[] {
  return projectEditorModelToV3(model).objects.filter(object => objectHasCapability(object, capability));
}

/** Candidatos de escena v2 filtrados por capacidad semántica. */
export function legacySceneCandidates(model: VisualDiagramModel, capability: DiagramCapability): DiagramSceneItem[] {
  return legacyReferenceCandidates(model, capability);
}

export function pointLikeCandidates(model: VisualDiagramModel): DiagramSceneItem[] {
  return legacySceneCandidates(model, 'point');
}

export function segmentCandidates(model: VisualDiagramModel): DiagramElement[] {
  return legacySceneCandidates(model, 'segment').filter((item): item is DiagramElement => 'kind' in item);
}

export function supportCandidates(model: VisualDiagramModel): DiagramSceneItem[] {
  return legacySceneCandidates(model, 'support');
}

export function linearSupportCandidates(model: VisualDiagramModel): DiagramSceneItem[] {
  return legacySceneCandidates(model, 'linear-support');
}

/** Centros o ejes válidos para simetría: puntos libres, construidos y soportes lineales rectos. */
export function reflectionAxisCandidates(model: VisualDiagramModel): DiagramSceneItem[] {
  const seen = new Set<string>();
  const candidates: DiagramSceneItem[] = [];
  for (const item of [...pointLikeCandidates(model), ...linearSupportCandidates(model)]) {
    if (seen.has(item.id)) continue;
    if ('kind' in item && !REFLECTION_AXIS_KINDS.has(item.kind) && !legacyItemHasCapability(item, 'point')) continue;
    seen.add(item.id);
    candidates.push(item);
  }
  return candidates;
}

export function angleCandidates(
  model: VisualDiagramModel,
  kinds: Array<'angle' | 'nonReflexAngle'> = ['angle', 'nonReflexAngle'],
): DiagramElement[] {
  const allowed = new Set(kinds);
  return model.elements.filter(element => allowed.has(element.kind as 'angle' | 'nonReflexAngle'));
}

export function areaCandidates(model: VisualDiagramModel): DiagramElement[] {
  return model.elements.filter(item => isAreaElement(item));
}

export function segmentsSharingPoint(model: VisualDiagramModel, pointId: string): DiagramElement[] {
  return segmentCandidates(model).filter(segment => segment.refs.includes(pointId));
}

export function anchorCandidatesForEqualLength(model: VisualDiagramModel, adjustedEndpointId: string): DiagramSceneItem[] {
  return pointLikeCandidates(model).filter(candidate => (
    segmentsSharingPoint(model, adjustedEndpointId).some(segment => segment.refs.includes(candidate.id))
  ));
}

export function otherSegmentCandidatesForEqualLength(
  model: VisualDiagramModel,
  anchorId: string,
  adjustedEndpointId: string,
): DiagramElement[] {
  const targetSegment = segmentCandidates(model).find(segment => (
    segment.refs.includes(adjustedEndpointId) && segment.refs.includes(anchorId)
  ));
  return segmentCandidates(model).filter(segment => segment.id !== targetSegment?.id);
}
