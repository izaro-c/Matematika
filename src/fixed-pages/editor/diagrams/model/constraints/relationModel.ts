import { isPositionedPoint, omitKeys, sceneRelations, type DiagramRelation, type PositionedPoint } from '@/diagrams';
import { cleanTargetId } from '../elements/diagramElements';
import { pointMode, setPointMode } from '../elements/pointModes';
import { draftToRelation, relationDraft, type RelationDraft } from './relationIntents';
import type { VisualDiagramModel } from '../types';

export function uniqueConstraintId(model: VisualDiagramModel, base?: string): string {
  if (!base) {
    let index = model.relations.length + 1;
    while (model.relations.some(item => item.id === `constraint${index}`)) index += 1;
    return `constraint${index}`;
  }
  const cleanBase = cleanTargetId(base, `constraint${model.relations.length + 1}`);
  let candidate = cleanBase;
  let index = 2;
  while (model.relations.some(item => item.id === candidate)) candidate = `${cleanBase}_${index++}`;
  return candidate;
}

export function findPositionedPoint(model: VisualDiagramModel, id: string): PositionedPoint | undefined {
  const object = model.objects.find(item => item.id === id);
  return isPositionedPoint(object) ? object : undefined;
}

/** Relaciones asignadas a un punto restringido, en su orden de aplicación. */
export function pointRelations(model: VisualDiagramModel, pointId: string): DiagramRelation[] {
  const point = findPositionedPoint(model, pointId);
  if (point?.mobility.type !== 'constrained') return [];
  const relationIds = point.mobility.relationIds;
  return relationIds
    .map(id => model.relations.find(relation => relation.id === id))
    .filter((relation): relation is DiagramRelation => Boolean(relation));
}

function withRelationIds(model: VisualDiagramModel, pointId: string, relationIds: string[]): VisualDiagramModel {
  return {
    ...model,
    objects: model.objects.map(object => {
      if (object.id !== pointId || !isPositionedPoint(object)) return object;
      if (relationIds.length === 0) return { ...object, mobility: { type: 'free' } };
      return { ...object, definition: object.definition.type === 'expression' ? { type: 'coordinates', x: object.definition.fallback[0], y: object.definition.fallback[1] } : object.definition, mobility: { type: 'constrained', relationIds } };
    }),
  };
}

/**
 * Añade (o sustituye por id) una relación y la asigna al punto restringido.
 * Con `keepSupport`, un punto que deslizaba sobre un soporte conserva ese
 * soporte como relación `on-support` explícita para combinarlo con la nueva
 * restricción; si no, deja de deslizar.
 */
export function assignRelationToPoint(
  model: VisualDiagramModel,
  pointId: string,
  relation: DiagramRelation,
  options: { keepSupport?: boolean } = {},
): VisualDiagramModel {
  const keepSupport = options.keepSupport ?? true;
  const point = findPositionedPoint(model, pointId);
  if (!point) return model;
  let next: VisualDiagramModel = {
    ...model,
    relations: model.relations.some(item => item.id === relation.id)
      ? model.relations.map(item => item.id === relation.id ? relation : item)
      : [...model.relations, relation],
  };
  const assignedIds = point.mobility.type === 'constrained' ? [...point.mobility.relationIds] : [];
  if (point.mobility.type === 'on-support' && keepSupport) {
    const onRelationId = uniqueConstraintId(next, `on${pointId}`);
    next = {
      ...next,
      relations: [...next.relations, {
        id: onRelationId,
        label: `${point.label} sobre ${point.mobility.support}`,
        type: 'on-support',
        point: pointId,
        support: point.mobility.support,
        enabled: true,
      }],
    };
    assignedIds.push(onRelationId);
  }
  if (!assignedIds.includes(relation.id)) assignedIds.push(relation.id);
  return withRelationIds(next, pointId, assignedIds);
}

/** Elimina una relación y la retira de los puntos; un punto sin relaciones queda libre. */
export function removeConstraintFromModel(model: VisualDiagramModel, relationId: string): VisualDiagramModel {
  const withoutRelation: VisualDiagramModel = {
    ...model,
    relations: model.relations.filter(relation => relation.id !== relationId),
  };
  return model.objects.reduce((current, object) => {
    if (!isPositionedPoint(object) || object.mobility.type !== 'constrained' || !object.mobility.relationIds.includes(relationId)) return current;
    return withRelationIds(current, object.id, object.mobility.relationIds.filter(id => id !== relationId));
  }, withoutRelation);
}

/** Un punto puede recibir restricciones si es libre, desliza o ya está restringido. */
export function pointAcceptsRelations(point: PositionedPoint): boolean {
  return !point.locked && ['free', 'glider', 'constrained'].includes(pointMode(point));
}

/** Borradores de las relaciones asignadas a un punto. */
export function pointRelationDrafts(model: VisualDiagramModel, pointId: string): RelationDraft[] {
  return pointRelations(model, pointId).map(relation => relationDraft(relation, model.objects));
}

/** Reescribe una relación a partir de su borrador editado. */
export function updateRelationDraft(
  model: VisualDiagramModel,
  relationId: string,
  update: (draft: RelationDraft) => RelationDraft,
): VisualDiagramModel {
  const relation = model.relations.find(item => item.id === relationId);
  if (!relation) return model;
  const next = draftToRelation(update(relationDraft(relation, model.objects)), model.objects);
  if (!next) return model;
  return { ...model, relations: model.relations.map(item => item.id === relationId ? next : item) };
}

/**
 * Convierte un punto en el punto medio de otros dos: deja de tener posición
 * propia y pierde sus relaciones.
 */
export function makePointMidpoint(model: VisualDiagramModel, pointId: string, first: string, second: string): VisualDiagramModel {
  const point = findPositionedPoint(model, pointId);
  if (!point) return model;
  const removed = new Set(point.mobility.type === 'constrained' ? point.mobility.relationIds : []);
  const rest = omitKeys(point, 'interaction');
  return {
    ...model,
    objects: model.objects.map(object => object.id === pointId
      ? { ...rest, definition: { type: 'midpoint', points: [first, second] }, mobility: { type: 'fixed' } }
      : object),
    relations: model.relations.filter(relation => !removed.has(relation.id)),
  };
}

/**
 * Añade al punto la relación descrita por el borrador. `fixed` fija el punto y
 * `midpoint` lo convierte en punto medio, porque no son relaciones en V3.
 */
export function addRelationDraftToPoint(model: VisualDiagramModel, pointId: string, draft: RelationDraft): VisualDiagramModel {
  if (draft.kind === 'fixed') return setPointMode(model, pointId, 'fixed');
  if (draft.kind === 'midpoint') return makePointMidpoint(model, pointId, draft.refs[1], draft.refs[2]);
  const relation = draftToRelation(draft, model.objects);
  return relation ? assignRelationToPoint(model, pointId, relation, { keepSupport: false }) : model;
}

/** Borradores de todas las relaciones editables (sin las de marcadores de ángulo recto). */
export function modelRelationDrafts(model: VisualDiagramModel): RelationDraft[] {
  return sceneRelations(model).map(relation => relationDraft(relation, model.objects));
}
