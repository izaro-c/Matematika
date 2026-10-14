import {
  equalLengthRoles,
  isPointObject,
  segmentEndpoints,
  type DiagramObject,
  type DiagramRelation,
} from '@/diagrams';
import { buildRelation } from './relationIntents';
import {
  assignRelationToPoint,
  findPositionedPoint,
  pointAcceptsRelations,
  removeConstraintFromModel,
  uniqueConstraintId,
} from './relationModel';
import type { VisualDiagramModel, VisualPoint } from '../types';

export { removeConstraintFromModel } from './relationModel';

function plainSegment(model: VisualDiagramModel, segmentId: string): DiagramObject | undefined {
  const segment = model.objects.find(object => object.id === segmentId);
  return segmentEndpoints(segment) ? segment : undefined;
}

export function equalLengthConstraintForSegment(
  model: VisualDiagramModel,
  segmentId: string,
): DiagramRelation | undefined {
  const endpoints = segmentEndpoints(plainSegment(model, segmentId));
  if (!endpoints) return undefined;
  return model.relations.find(relation => {
    if (relation.type !== 'equal-length') return false;
    const roles = equalLengthRoles(relation, model.objects);
    return endpoints.includes(roles.driven) && endpoints.includes(roles.anchor);
  });
}

export interface PointLikeEntity {
  id: string;
  label: string;
}

export function findPointLike(model: VisualDiagramModel, id: string): PointLikeEntity | undefined {
  const object = model.objects.find(item => item.id === id);
  return isPointObject(object) ? { id: object.id, label: object.label } : undefined;
}

export function editableSegmentEndpoints(model: VisualDiagramModel, segmentId: string): VisualPoint[] {
  const endpoints = segmentEndpoints(plainSegment(model, segmentId));
  if (!endpoints) return [];
  return endpoints
    .map(ref => findPositionedPoint(model, ref))
    .filter((point): point is VisualPoint => Boolean(point && pointAcceptsRelations(point)));
}

export function setEqualLengthConstraint(
  model: VisualDiagramModel,
  targetSegmentId: string,
  movingEndpointId: string,
  sourceSegmentId: string,
): VisualDiagramModel {
  const targetSegment = plainSegment(model, targetSegmentId);
  const sourceSegment = plainSegment(model, sourceSegmentId);
  const targetEndpoints = segmentEndpoints(targetSegment);
  const sourceEndpoints = segmentEndpoints(sourceSegment);
  const movingPoint = findPositionedPoint(model, movingEndpointId);
  const anchorId = targetEndpoints?.find(ref => ref !== movingEndpointId);
  const anchor = anchorId ? findPointLike(model, anchorId) : undefined;
  if (!targetSegment || !sourceSegment || targetSegment.id === sourceSegment.id || !movingPoint || !anchorId || !anchor) return model;
  if (sourceEndpoints?.includes(movingEndpointId)) return model;
  if (!editableSegmentEndpoints(model, targetSegmentId).some(point => point.id === movingEndpointId)) return model;

  const existing = equalLengthConstraintForSegment(model, targetSegmentId);
  const next = existing ? removeConstraintFromModel(model, existing.id) : model;
  const constraintId = existing?.id ?? uniqueConstraintId(next, `equalLength${targetSegmentId}`);
  const relation = buildRelation(
    'equalLength',
    constraintId,
    `${targetSegment.label} tiene la misma longitud que ${sourceSegment.label}`,
    [movingEndpointId, anchorId, sourceSegmentId],
    next.objects,
  );
  return relation ? assignRelationToPoint(next, movingEndpointId, relation) : model;
}
