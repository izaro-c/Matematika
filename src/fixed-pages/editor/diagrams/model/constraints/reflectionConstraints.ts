import { withResolvedPointConstraints } from '@/diagrams/geometry/layout/scene';
import { objectKind, segmentEndpoints, type DiagramObject, type DiagramRelation } from '@/diagrams';
import { assignRelationToPoint, findPositionedPoint, removeConstraintFromModel, uniqueConstraintId } from './relationModel';
import { findPointLike } from './segmentLengthConstraints';
import type { VisualDiagramModel } from '../types';

const REFLECTION_AXIS_KINDS = new Set(['segment', 'line', 'ray', 'midpoint', 'intersection', 'perpendicularFoot']);

export function editableReflectionCandidates(model: VisualDiagramModel, targetId: string): DiagramObject[] {
  const points = model.objects.filter(object => objectKind(object) === 'point' && object.id !== targetId);
  const elements = model.objects.filter(object => REFLECTION_AXIS_KINDS.has(objectKind(object)) && object.id !== targetId);
  return [...points, ...elements];
}

export function reflectionConstraintForPoint(
  model: VisualDiagramModel,
  pointId: string,
): DiagramRelation | undefined {
  return model.relations.find(relation => relation.type === 'reflection' && relation.refs[0] === pointId);
}

export function reflectionConstraintForSegment(
  model: VisualDiagramModel,
  segmentId: string,
): DiagramRelation | undefined {
  return model.relations.find(relation => relation.type === 'reflection' && relation.refs[0] === segmentId);
}

function plainSegmentEndpoints(model: VisualDiagramModel, segmentId: string): [string, string] | undefined {
  return segmentEndpoints(model.objects.find(object => object.id === segmentId));
}

export function removeSegmentReflectionConstraint(
  model: VisualDiagramModel,
  segmentId: string,
): VisualDiagramModel {
  const endpoints = plainSegmentEndpoints(model, segmentId);
  if (!endpoints) return model;

  let next = model;
  const segmentConstraint = reflectionConstraintForSegment(next, segmentId);
  if (segmentConstraint) {
    next = removeConstraintFromModel(next, segmentConstraint.id);
  }

  for (const endpointId of endpoints) {
    const pointConstraint = reflectionConstraintForPoint(next, endpointId);
    if (pointConstraint) {
      next = removeConstraintFromModel(next, pointConstraint.id);
    }
  }

  return withResolvedPointConstraints(next);
}

function objectLabel(model: VisualDiagramModel, id: string): string | undefined {
  return findPointLike(model, id)?.label ?? model.objects.find(item => item.id === id)?.label;
}

export function setReflectionConstraintForPoint(
  model: VisualDiagramModel,
  targetPointId: string,
  centerOrAxisId: string,
  sourcePointId?: string,
): VisualDiagramModel {
  const targetPoint = findPointLike(model, targetPointId);
  if (!targetPoint) return model;

  const centerOrAxisLabel = objectLabel(model, centerOrAxisId);
  if (centerOrAxisLabel === undefined) return model;

  const existing = reflectionConstraintForPoint(model, targetPointId);
  const next = existing ? removeConstraintFromModel(model, existing.id) : model;
  const constraintId = existing?.id ?? uniqueConstraintId(next, 'cRefl');
  const sourcePoint = sourcePointId ? findPointLike(next, sourcePointId) : undefined;

  const refs = sourcePoint
    ? [targetPointId, centerOrAxisId, sourcePoint.id]
    : [targetPointId, centerOrAxisId];

  const label = sourcePoint
    ? `Reflejo de ${sourcePoint.label} respecto de ${centerOrAxisLabel}`
    : `Reflejo de ${targetPoint.label} respecto de ${centerOrAxisLabel}`;

  const relation: DiagramRelation = { id: constraintId, label, type: 'reflection', refs, enabled: true };
  const updatedModel = findPositionedPoint(next, targetPointId)
    ? assignRelationToPoint(next, targetPointId, relation, { keepSupport: false })
    : { ...next, relations: [...next.relations.filter(item => item.id !== constraintId), relation] };
  return withResolvedPointConstraints(updatedModel);
}

export function setReflectionConstraintForSegment(
  model: VisualDiagramModel,
  targetSegmentId: string,
  centerOrAxisId: string,
  sourceSegmentId?: string,
): VisualDiagramModel {
  const targetSegment = model.objects.find(object => object.id === targetSegmentId);
  const targetEndpoints = plainSegmentEndpoints(model, targetSegmentId);
  if (!targetSegment || !targetEndpoints) return model;

  const existingSegment = reflectionConstraintForSegment(model, targetSegmentId);
  let nextModel = removeSegmentReflectionConstraint(model, targetSegmentId);

  const sourceSegment = sourceSegmentId ? model.objects.find(object => object.id === sourceSegmentId) : undefined;
  const sourceEndpoints = sourceSegmentId ? plainSegmentEndpoints(model, sourceSegmentId) : undefined;

  if (sourceSegment && sourceEndpoints) {
    nextModel = setReflectionConstraintForPoint(nextModel, targetEndpoints[0], centerOrAxisId, sourceEndpoints[0]);
    nextModel = setReflectionConstraintForPoint(nextModel, targetEndpoints[1], centerOrAxisId, sourceEndpoints[1]);
  } else {
    nextModel = setReflectionConstraintForPoint(nextModel, targetEndpoints[0], centerOrAxisId);
    nextModel = setReflectionConstraintForPoint(nextModel, targetEndpoints[1], centerOrAxisId);
  }

  const constraintId = existingSegment?.id ?? uniqueConstraintId(nextModel, 'cRefl');
  const centerOrAxisLabel = objectLabel(nextModel, centerOrAxisId) ?? centerOrAxisId;
  const hasSource = Boolean(sourceSegment && sourceEndpoints);

  const segmentRelation: DiagramRelation = {
    id: constraintId,
    label: hasSource
      ? `${targetSegment.label} es reflejo de ${sourceSegment!.label} respecto de ${centerOrAxisLabel}`
      : `${targetSegment.label} reflejado respecto de ${centerOrAxisLabel}`,
    type: 'reflection',
    refs: hasSource ? [targetSegmentId, sourceSegment!.id, centerOrAxisId] : [targetSegmentId, centerOrAxisId],
    enabled: true,
  };

  return withResolvedPointConstraints({
    ...nextModel,
    relations: [...nextModel.relations.filter(relation => relation.id !== constraintId), segmentRelation],
  });
}
