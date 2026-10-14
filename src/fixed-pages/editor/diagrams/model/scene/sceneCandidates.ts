import {
  isAreaElement,
  objectConstructionReferences,
  objectKind,
  sceneObjectHasCapability,
  sceneReferenceCandidates,
  type DiagramCapability,
  type DiagramObject,
} from '@/diagrams';
import type { VisualDiagramModel } from '../types';

const REFLECTION_AXIS_KINDS = new Set(['segment', 'line', 'ray']);

/** Candidatos de escena filtrados por capacidad semántica. */
export function sceneCandidates(model: VisualDiagramModel, capability: DiagramCapability): DiagramObject[] {
  return sceneReferenceCandidates(model, capability);
}

export function pointLikeCandidates(model: VisualDiagramModel): DiagramObject[] {
  return sceneCandidates(model, 'point');
}

export function segmentCandidates(model: VisualDiagramModel): DiagramObject[] {
  return sceneCandidates(model, 'segment');
}

export function supportCandidates(model: VisualDiagramModel): DiagramObject[] {
  return sceneCandidates(model, 'support');
}

export function linearSupportCandidates(model: VisualDiagramModel): DiagramObject[] {
  return sceneCandidates(model, 'linear-support');
}

/** Centros o ejes válidos para simetría: puntos libres, construidos y soportes lineales rectos. */
export function reflectionAxisCandidates(model: VisualDiagramModel): DiagramObject[] {
  const seen = new Set<string>();
  const candidates: DiagramObject[] = [];
  for (const item of [...pointLikeCandidates(model), ...linearSupportCandidates(model)]) {
    if (seen.has(item.id)) continue;
    if (!REFLECTION_AXIS_KINDS.has(objectKind(item)) && !sceneObjectHasCapability(item, 'point')) continue;
    seen.add(item.id);
    candidates.push(item);
  }
  return candidates;
}

export function angleCandidates(
  model: VisualDiagramModel,
  kinds: Array<'angle' | 'nonReflexAngle'> = ['angle', 'nonReflexAngle'],
): DiagramObject[] {
  const allowed = new Set<string>(kinds);
  return model.objects.filter(object => allowed.has(objectKind(object)));
}

export function areaCandidates(model: VisualDiagramModel): DiagramObject[] {
  return model.objects.filter(item => isAreaElement(item));
}

export function segmentsSharingPoint(model: VisualDiagramModel, pointId: string): DiagramObject[] {
  return segmentCandidates(model).filter(segment => objectConstructionReferences(segment).includes(pointId));
}

export function anchorCandidatesForEqualLength(model: VisualDiagramModel, adjustedEndpointId: string): DiagramObject[] {
  return pointLikeCandidates(model).filter(candidate => (
    segmentsSharingPoint(model, adjustedEndpointId).some(segment => objectConstructionReferences(segment).includes(candidate.id))
  ));
}

export function otherSegmentCandidatesForEqualLength(
  model: VisualDiagramModel,
  anchorId: string,
  adjustedEndpointId: string,
): DiagramObject[] {
  const targetSegment = segmentCandidates(model).find(segment => {
    const refs = objectConstructionReferences(segment);
    return refs.includes(adjustedEndpointId) && refs.includes(anchorId);
  });
  return segmentCandidates(model).filter(segment => segment.id !== targetSegment?.id);
}
