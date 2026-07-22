import { withResolvedPointConstraints } from '../../../../shared/diagrams/spec/scene';
import { withConstraintDependencies } from './constraintOptions';
import { findPointLike, removeConstraintFromModel } from './segmentLengthConstraints';
import type { VisualConstraint, VisualDiagramModel } from './types';

export function editableReflectionCandidates(model: VisualDiagramModel, targetId: string) {
  const points = model.points.filter(point => point.id !== targetId);
  const elements = model.elements.filter(element => (
    ['segment', 'line', 'ray', 'midpoint', 'intersection', 'perpendicularFoot'].includes(element.kind)
    && element.id !== targetId
  ));
  return [...points, ...elements];
}

function uniqueConstraintId(model: VisualDiagramModel, basePrefix = 'cRefl'): string {
  const existingIds = new Set((model.constraints || []).map(c => c.id));
  let count = (model.constraints?.length || 0) + 1;
  let candidate = `${basePrefix}${count}`;
  while (existingIds.has(candidate)) {
    count++;
    candidate = `${basePrefix}${count}`;
  }
  return candidate;
}

export function reflectionConstraintForPoint(
  model: VisualDiagramModel,
  pointId: string,
): VisualConstraint | undefined {
  return model.constraints?.find(constraint => (
    constraint.kind === 'reflection' && constraint.refs[0] === pointId
  ));
}

export function reflectionConstraintForSegment(
  model: VisualDiagramModel,
  segmentId: string,
): VisualConstraint | undefined {
  return model.constraints?.find(constraint => (
    constraint.kind === 'reflection' && constraint.refs[0] === segmentId
  ));
}

export function removeSegmentReflectionConstraint(
  model: VisualDiagramModel,
  segmentId: string,
): VisualDiagramModel {
  const segment = model.elements.find(item => item.kind === 'segment' && item.id === segmentId);
  if (!segment) return model;

  let next = model;
  const segmentConstraint = reflectionConstraintForSegment(next, segmentId);
  if (segmentConstraint) {
    next = removeConstraintFromModel(next, segmentConstraint.id);
  }

  for (const endpointId of segment.refs) {
    const pointConstraint = reflectionConstraintForPoint(next, endpointId);
    if (pointConstraint) {
      next = removeConstraintFromModel(next, pointConstraint.id);
    }
  }

  return withResolvedPointConstraints(next);
}

export function setReflectionConstraintForPoint(
  model: VisualDiagramModel,
  targetPointId: string,
  centerOrAxisId: string,
  sourcePointId?: string,
): VisualDiagramModel {
  const targetPoint = findPointLike(model, targetPointId);
  if (!targetPoint) return model;

  const centerOrAxis = findPointLike(model, centerOrAxisId)
    ?? model.elements.find(item => item.id === centerOrAxisId);
  if (!centerOrAxis) return model;

  const existing = reflectionConstraintForPoint(model, targetPointId);
  const next = existing ? removeConstraintFromModel(model, existing.id) : model;
  const constraintId = existing?.id ?? uniqueConstraintId(next);
  const sourcePoint = sourcePointId ? findPointLike(next, sourcePointId) : undefined;

  const refs = sourcePoint
    ? [targetPointId, centerOrAxis.id, sourcePoint.id]
    : [targetPointId, centerOrAxis.id];

  const label = sourcePoint
    ? `Reflejo de ${sourcePoint.label} respecto de ${centerOrAxis.label}`
    : `Reflejo de ${targetPoint.label} respecto de ${centerOrAxis.label}`;

  const constraint: VisualConstraint = {
    id: constraintId,
    label,
    kind: 'reflection',
    refs,
    enabled: true,
  };

  const updatedPoints = next.points.map(point => {
    if (point.id !== targetPointId) return point;
    const remainingIds = (point.constraintIds ?? []).filter(id => id !== constraintId);
    return {
      ...point,
      fixed: false,
      constraint: 'constrained' as const,
      constraintIds: [...remainingIds, constraintId],
    };
  });

  const updatedModel: VisualDiagramModel = {
    ...next,
    points: updatedPoints,
    constraints: [...(next.constraints || []).filter(c => c.id !== constraintId), constraint],
  };

  return withResolvedPointConstraints(withConstraintDependencies(updatedModel, constraintId, refs));
}

export function setReflectionConstraintForSegment(
  model: VisualDiagramModel,
  targetSegmentId: string,
  centerOrAxisId: string,
  sourceSegmentId?: string,
): VisualDiagramModel {
  const targetSegment = model.elements.find(item => item.kind === 'segment' && item.id === targetSegmentId);
  if (!targetSegment || targetSegment.refs.length < 2) return model;

  const existingSegment = reflectionConstraintForSegment(model, targetSegmentId);
  let nextModel = removeSegmentReflectionConstraint(model, targetSegmentId);

  const sourceSegment = sourceSegmentId
    ? model.elements.find(item => item.kind === 'segment' && item.id === sourceSegmentId)
    : undefined;

  if (sourceSegment && sourceSegment.refs.length >= 2) {
    nextModel = setReflectionConstraintForPoint(nextModel, targetSegment.refs[0], centerOrAxisId, sourceSegment.refs[0]);
    nextModel = setReflectionConstraintForPoint(nextModel, targetSegment.refs[1], centerOrAxisId, sourceSegment.refs[1]);
  } else {
    nextModel = setReflectionConstraintForPoint(nextModel, targetSegment.refs[0], centerOrAxisId);
    nextModel = setReflectionConstraintForPoint(nextModel, targetSegment.refs[1], centerOrAxisId);
  }

  const constraintId = existingSegment?.id ?? uniqueConstraintId(nextModel);
  const centerOrAxis = findPointLike(nextModel, centerOrAxisId)
    ?? nextModel.elements.find(item => item.id === centerOrAxisId);

  const segmentConstraint: VisualConstraint = {
    id: constraintId,
    label: sourceSegment
      ? `${targetSegment.label} es reflejo de ${sourceSegment.label} respecto de ${centerOrAxis?.label ?? centerOrAxisId}`
      : `${targetSegment.label} reflejado respecto de ${centerOrAxis?.label ?? centerOrAxisId}`,
    kind: 'reflection',
    refs: sourceSegment ? [targetSegmentId, sourceSegment.id, centerOrAxisId] : [targetSegmentId, centerOrAxisId],
    enabled: true,
  };

  return withResolvedPointConstraints({
    ...nextModel,
    constraints: [...(nextModel.constraints || []).filter(c => c.id !== constraintId), segmentConstraint],
  });
}
