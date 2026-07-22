import { withResolvedPointConstraints } from '../../../../shared/diagrams/spec/scene';
import { withConstraintDependencies } from './constraintOptions';
import { findPointLike } from './segmentLengthConstraints';
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

  const constraintId = uniqueConstraintId(model);
  const sourcePoint = sourcePointId ? findPointLike(model, sourcePointId) : undefined;

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

  const updatedPoints = model.points.map(point => {
    if (point.id !== targetPointId) return point;
    const existingIds = point.constraintIds || [];
    return {
      ...point,
      fixed: false,
      constraint: 'constrained' as const,
      constraintIds: existingIds.includes(constraintId) ? existingIds : [...existingIds, constraintId],
    };
  });

  const updatedModel: VisualDiagramModel = {
    ...model,
    points: updatedPoints,
    constraints: [...(model.constraints || []).filter(c => c.id !== constraintId), constraint],
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

  const sourceSegment = sourceSegmentId
    ? model.elements.find(item => item.kind === 'segment' && item.id === sourceSegmentId)
    : undefined;

  let nextModel = model;

  if (sourceSegment && sourceSegment.refs.length >= 2) {
    nextModel = setReflectionConstraintForPoint(nextModel, targetSegment.refs[0], centerOrAxisId, sourceSegment.refs[0]);
    nextModel = setReflectionConstraintForPoint(nextModel, targetSegment.refs[1], centerOrAxisId, sourceSegment.refs[1]);
  } else {
    nextModel = setReflectionConstraintForPoint(nextModel, targetSegment.refs[0], centerOrAxisId);
    nextModel = setReflectionConstraintForPoint(nextModel, targetSegment.refs[1], centerOrAxisId);
  }

  const constraintId = uniqueConstraintId(nextModel);
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
