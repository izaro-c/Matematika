import { cleanTargetId, updatePoint } from './diagramElements';
import { withConstraintDependencies } from './constraintOptions';
import { removeConstraintFromModel } from './segmentLengthConstraints';
import type { VisualConstraint, VisualDiagramModel, VisualElement, VisualPoint } from './types';

const ANGLE_KINDS = new Set(['angle', 'nonReflexAngle']);

function isEditableAngle(element: VisualElement): boolean {
  return ANGLE_KINDS.has(element.kind) && element.refs.length >= 3;
}

function targetAngleForConstraint(model: VisualDiagramModel, constraint: VisualConstraint): VisualElement | undefined {
  if (constraint.kind !== 'equalAngle' || constraint.refs.length < 5) return undefined;
  return model.elements.find(element => element.id === constraint.refs[4] && isEditableAngle(element));
}

function uniqueConstraintId(model: VisualDiagramModel, base: string): string {
  const cleanBase = cleanTargetId(base, `constraint${(model.constraints?.length ?? 0) + 1}`);
  let candidate = cleanBase;
  let index = 2;
  while (model.constraints?.some(constraint => constraint.id === candidate)) candidate = `${cleanBase}_${index++}`;
  return candidate;
}

export function equalAngleConstraintForAngle(
  model: VisualDiagramModel,
  angleId: string,
): VisualConstraint | undefined {
  return model.constraints?.find(constraint => targetAngleForConstraint(model, constraint)?.id === angleId);
}

export function editableAngleEndpoints(model: VisualDiagramModel, angleId: string): VisualPoint[] {
  const angle = model.elements.find(element => element.id === angleId && isEditableAngle(element));
  if (!angle) return [];
  return [angle.refs[0], angle.refs[2]]
    .map(ref => model.points.find(point => point.id === ref))
    .filter((point): point is VisualPoint => Boolean(
      point
      && !point.fixed
      && !point.locked
      && ['free', 'constrained'].includes(point.constraint),
    ));
}

export function referenceAngles(
  model: VisualDiagramModel,
  targetAngleId: string,
  movingPointId: string,
): VisualElement[] {
  const target = model.elements.find(element => element.id === targetAngleId && isEditableAngle(element));
  if (!target) return [];
  return model.elements.filter(element => (
    element.id !== target.id
    && element.kind === target.kind
    && element.refs.length >= 3
    && !element.refs.includes(movingPointId)
  ));
}

export function setEqualAngleConstraint(
  model: VisualDiagramModel,
  targetAngleId: string,
  movingPointId: string,
  sourceAngleId: string,
): VisualDiagramModel {
  const targetAngle = model.elements.find(element => element.id === targetAngleId && isEditableAngle(element));
  const sourceAngle = model.elements.find(element => element.id === sourceAngleId && isEditableAngle(element));
  const movingPoint = model.points.find(point => point.id === movingPointId);
  if (!targetAngle || !sourceAngle || targetAngle.id === sourceAngle.id || targetAngle.kind !== sourceAngle.kind || !movingPoint) return model;
  if (!editableAngleEndpoints(model, targetAngleId).some(point => point.id === movingPointId)) return model;
  if (sourceAngle.refs.includes(movingPointId)) return model;

  const vertexPointId = targetAngle.refs[1];
  const fixedRayPointId = targetAngle.refs[0] === movingPointId ? targetAngle.refs[2] : targetAngle.refs[0];
  if (!vertexPointId || !fixedRayPointId) return model;

  const existing = equalAngleConstraintForAngle(model, targetAngleId);
  let next = existing ? removeConstraintFromModel(model, existing.id) : model;
  const constraintId = existing?.id ?? uniqueConstraintId(next, `equalAngle${targetAngleId}`);
  const constraint: VisualConstraint = {
    id: constraintId,
    label: `${targetAngle.label} tiene la misma amplitud que ${sourceAngle.label}`,
    kind: 'equalAngle',
    refs: [movingPointId, vertexPointId, fixedRayPointId, sourceAngleId, targetAngleId],
    enabled: true,
  };
  const refreshedPoint = next.points.find(point => point.id === movingPointId);
  if (!refreshedPoint) return model;

  next = withConstraintDependencies({
    ...next,
    constraints: [...(next.constraints ?? []), constraint],
  }, constraintId, constraint.refs.slice(0, 4));
  return updatePoint(next, movingPointId, {
    constraint: 'constrained',
    constraintIds: [...(refreshedPoint.constraintIds ?? []), constraintId],
  });
}
