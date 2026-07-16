import { cleanTargetId, updatePoint } from './diagramElements';
import { withConstraintDependencies } from './constraintOptions';
import type { VisualConstraint, VisualDiagramModel, VisualElement, VisualPoint } from './types';

function sameEndpoints(segment: VisualElement, firstId: string, secondId: string): boolean {
  return segment.kind === 'segment'
    && segment.refs.includes(firstId)
    && segment.refs.includes(secondId);
}

function uniqueConstraintId(model: VisualDiagramModel, base: string): string {
  const cleanBase = cleanTargetId(base, `constraint${(model.constraints?.length ?? 0) + 1}`);
  let candidate = cleanBase;
  let index = 2;
  while (model.constraints?.some(constraint => constraint.id === candidate)) candidate = `${cleanBase}_${index++}`;
  return candidate;
}

export function equalLengthConstraintForSegment(
  model: VisualDiagramModel,
  segmentId: string,
): VisualConstraint | undefined {
  const segment = model.elements.find(element => element.id === segmentId && element.kind === 'segment');
  if (!segment || segment.refs.length < 2) return undefined;
  return model.constraints?.find(constraint => (
    constraint.kind === 'equalLength'
    && sameEndpoints(segment, constraint.refs[0], constraint.refs[1])
  ));
}

export function editableSegmentEndpoints(model: VisualDiagramModel, segmentId: string): VisualPoint[] {
  const segment = model.elements.find(element => element.id === segmentId && element.kind === 'segment');
  if (!segment) return [];
  return segment.refs
    .map(ref => model.points.find(point => point.id === ref))
    .filter((point): point is VisualPoint => Boolean(
      point
      && !point.fixed
      && !point.locked
      && ['free', 'glider', 'constrained'].includes(point.constraint),
    ));
}

export function removeConstraintFromModel(
  model: VisualDiagramModel,
  constraintId: string,
): VisualDiagramModel {
  const affectedPoints = model.points.filter(point => point.constraintIds?.includes(constraintId));
  const withoutConstraint: VisualDiagramModel = {
    ...model,
    constraints: model.constraints?.filter(constraint => constraint.id !== constraintId),
    dependencies: model.dependencies?.filter(dependency => dependency.constraintId !== constraintId),
  };
  return affectedPoints.reduce((current, point) => {
    const remainingIds = (point.constraintIds ?? []).filter(id => id !== constraintId);
    return remainingIds.length > 0
      ? updatePoint(current, point.id, { constraintIds: remainingIds })
      : updatePoint(current, point.id, { constraint: 'free' });
  }, withoutConstraint);
}

export function setEqualLengthConstraint(
  model: VisualDiagramModel,
  targetSegmentId: string,
  movingEndpointId: string,
  sourceSegmentId: string,
): VisualDiagramModel {
  const targetSegment = model.elements.find(element => element.id === targetSegmentId && element.kind === 'segment');
  const sourceSegment = model.elements.find(element => element.id === sourceSegmentId && element.kind === 'segment');
  const movingPoint = model.points.find(point => point.id === movingEndpointId);
  const anchorId = targetSegment?.refs.find(ref => ref !== movingEndpointId);
  if (!targetSegment || !sourceSegment || targetSegment.id === sourceSegment.id || !movingPoint || !anchorId) return model;
  if (sourceSegment.refs.includes(movingEndpointId)) return model;
  if (!editableSegmentEndpoints(model, targetSegmentId).some(point => point.id === movingEndpointId)) return model;

  const existing = equalLengthConstraintForSegment(model, targetSegmentId);
  let next = existing ? removeConstraintFromModel(model, existing.id) : model;
  const constraintId = existing?.id ?? uniqueConstraintId(next, `equalLength${targetSegmentId}`);
  const constraint: VisualConstraint = {
    id: constraintId,
    label: `${targetSegment.label} tiene la misma longitud que ${sourceSegment.label}`,
    kind: 'equalLength',
    refs: [movingEndpointId, anchorId, sourceSegmentId],
    enabled: true,
  };

  const refreshedPoint = next.points.find(point => point.id === movingEndpointId);
  if (!refreshedPoint) return model;
  const assignedIds = [...(refreshedPoint.constraintIds ?? [])];

  if (refreshedPoint.constraint === 'glider' && refreshedPoint.gliderTarget) {
    const onConstraintId = uniqueConstraintId(next, `on${movingEndpointId}`);
    const onConstraint: VisualConstraint = {
      id: onConstraintId,
      label: `${refreshedPoint.label} sobre ${refreshedPoint.gliderTarget}`,
      kind: 'on',
      refs: [movingEndpointId, refreshedPoint.gliderTarget],
      enabled: true,
    };
    next = withConstraintDependencies({
      ...next,
      constraints: [...(next.constraints ?? []), onConstraint],
    }, onConstraintId, onConstraint.refs);
    assignedIds.push(onConstraintId);
  }

  next = withConstraintDependencies({
    ...next,
    constraints: [...(next.constraints ?? []), constraint],
  }, constraintId, constraint.refs);
  return updatePoint(next, movingEndpointId, {
    constraint: 'constrained',
    constraintIds: [...assignedIds, constraintId],
  });
}
