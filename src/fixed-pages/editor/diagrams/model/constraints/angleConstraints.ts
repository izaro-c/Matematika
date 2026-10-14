import {
  equalAngleRoles,
  isMeasurableAngle,
  objectKind,
  type AngleObject,
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

type EditableAngleKind = 'angle' | 'nonReflexAngle';

function editableAngle(model: VisualDiagramModel, angleId: string): AngleObject | undefined {
  const angle = model.objects.find(object => object.id === angleId);
  return isMeasurableAngle(angle) ? angle : undefined;
}

/**
 * Convierte un ángulo sin reemplazar el objeto. Las igualdades angulares
 * conectadas cambian juntas para conservar un modelo válido y la relación.
 */
export function convertAngleKind(
  model: VisualDiagramModel,
  angleId: string,
  kind: EditableAngleKind,
): VisualDiagramModel {
  const source = editableAngle(model, angleId);
  if (!source || objectKind(source) === kind) return model;

  const connectedIds = new Set([source.id]);
  let changed = true;
  while (changed) {
    changed = false;
    model.relations.forEach(relation => {
      if (relation.type !== 'equal-angle') return;
      if (!relation.angles.some(id => connectedIds.has(id))) return;
      relation.angles.forEach(id => {
        if (editableAngle(model, id) && !connectedIds.has(id)) {
          connectedIds.add(id);
          changed = true;
        }
      });
    });
  }

  const sweep = kind === 'angle' ? 'directed' : 'non-reflex';
  return {
    ...model,
    objects: model.objects.map(object => (
      connectedIds.has(object.id) && object.objectType === 'angle' ? { ...object, sweep } : object
    )),
  };
}

export function equalAngleConstraintForAngle(
  model: VisualDiagramModel,
  angleId: string,
): DiagramRelation | undefined {
  return model.relations.find(relation => (
    relation.type === 'equal-angle'
    && editableAngle(model, equalAngleRoles(relation, model.objects).target)?.id === angleId
  ));
}

export function editableAngleEndpoints(model: VisualDiagramModel, angleId: string): VisualPoint[] {
  const angle = editableAngle(model, angleId);
  if (!angle) return [];
  return [angle.points[0], angle.points[2]]
    .map(ref => findPositionedPoint(model, ref))
    .filter((point): point is VisualPoint => Boolean(point && pointAcceptsRelations(point)));
}

export function referenceAngles(
  model: VisualDiagramModel,
  targetAngleId: string,
  movingPointId: string,
): AngleObject[] {
  const target = editableAngle(model, targetAngleId);
  if (!target) return [];
  return model.objects.filter((object): object is AngleObject => (
    isMeasurableAngle(object)
    && object.id !== target.id
    && object.sweep === target.sweep
    && !object.points.includes(movingPointId)
  ));
}

export function setEqualAngleConstraint(
  model: VisualDiagramModel,
  targetAngleId: string,
  movingPointId: string,
  sourceAngleId: string,
): VisualDiagramModel {
  const targetAngle = editableAngle(model, targetAngleId);
  const sourceAngle = editableAngle(model, sourceAngleId);
  const movingPoint = findPositionedPoint(model, movingPointId);
  if (!targetAngle || !sourceAngle || targetAngle.id === sourceAngle.id || targetAngle.sweep !== sourceAngle.sweep || !movingPoint) return model;
  if (!editableAngleEndpoints(model, targetAngleId).some(point => point.id === movingPointId)) return model;
  if (sourceAngle.points.includes(movingPointId)) return model;

  const vertexPointId = targetAngle.points[1];
  const fixedRayPointId = targetAngle.points[0] === movingPointId ? targetAngle.points[2] : targetAngle.points[0];
  if (!vertexPointId || !fixedRayPointId) return model;

  const existing = equalAngleConstraintForAngle(model, targetAngleId);
  const next = existing ? removeConstraintFromModel(model, existing.id) : model;
  const constraintId = existing?.id ?? uniqueConstraintId(next, `equalAngle${targetAngleId}`);
  const relation = buildRelation(
    'equalAngle',
    constraintId,
    `${targetAngle.label} tiene la misma amplitud que ${sourceAngle.label}`,
    [movingPointId, vertexPointId, fixedRayPointId, sourceAngleId, targetAngleId],
    next.objects,
  );
  if (!relation) return model;
  // A diferencia de la igualdad de longitudes, el soporte de un punto deslizante
  // no se conserva: la amplitud fija la dirección del lado.
  return assignRelationToPoint(next, movingPointId, relation, { keepSupport: false });
}
