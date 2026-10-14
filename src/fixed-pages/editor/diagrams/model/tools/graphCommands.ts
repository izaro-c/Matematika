import {
  expressionSourceIds,
  isPositionedPoint,
  mapObjectExpressions,
  mapObjectReferences,
  mapRelationReferences,
  objectExpressions,
  objectReferences,
  relationReferences,
  renameDiagramTemplateIdentifiers,
  renameMathExpressionIdentifier,
  type DiagramObject,
} from '@/diagrams';
import { cleanTargetId } from '../elements/diagramElements';
import type { VisualDiagramModel, VisualSlider } from '../types';

export interface DiagramDeleteImpact {
  requestedId: string;
  removedIds: string[];
  dependentIds: string[];
  relationIds: string[];
}

export function allDiagramIds(model: VisualDiagramModel): Set<string> {
  return new Set([
    ...model.objects.map(item => item.id), ...model.layers.map(item => item.id), ...model.groups.map(item => item.id),
    ...model.steps.map(item => item.id), ...model.relations.map(item => item.id),
  ]);
}

function safeRenameExpression(source: string | undefined, oldId: string, newId: string): string | undefined {
  if (!source) return source;
  try { return renameMathExpressionIdentifier(source, oldId, newId); }
  catch { return source; }
}

export function renameDiagramId(model: VisualDiagramModel, oldId: string, requestedId: string): VisualDiagramModel {
  const newId = cleanTargetId(requestedId, oldId);
  if (newId === oldId || allDiagramIds(model).has(newId)) return model;
  const renameRef = (id: string) => id === oldId ? newId : id;
  return {
    ...model,
    objects: model.objects.map(object => mapObjectExpressions(
      mapObjectReferences({ ...object, ...(object.id === oldId ? { id: newId } : {}) }, renameRef),
      source => safeRenameExpression(source, oldId, newId) ?? source,
      source => renameDiagramTemplateIdentifiers(source, oldId, newId),
    )),
    layers: model.layers.map(layer => layer.id === oldId ? { ...layer, id: newId } : layer),
    groups: model.groups.map(group => ({
      ...(group.id === oldId ? { ...group, id: newId } : group),
      ...(group.targetId === oldId ? { targetId: newId } : {}),
      memberIds: group.memberIds.map(renameRef),
    })),
    header: model.header ? {
      ...model.header,
      readings: model.header.readings.map(reading => ({ ...reading, sourceIds: reading.sourceIds.map(renameRef) })),
    } : undefined,
    steps: model.steps.map(step => ({
      ...(step.id === oldId ? { ...step, id: newId } : step),
      visibleTargets: step.visibleTargets.map(renameRef),
      objectStates: step.objectStates
        ? Object.fromEntries(Object.entries(step.objectStates).map(([id, state]) => [renameRef(id), {
          ...state,
          overlay: state.overlay ? {
            ...state.overlay,
            content: renameDiagramTemplateIdentifiers(state.overlay.content, oldId, newId),
            expression: safeRenameExpression(state.overlay.expression, oldId, newId),
          } : undefined,
        }]))
        : undefined,
    })),
    relations: model.relations.map(relation => {
      const renamed = mapRelationReferences(relation, renameRef);
      return renamed.type === 'expression'
        ? { ...renamed, expression: safeRenameExpression(renamed.expression, oldId, newId) ?? renamed.expression }
        : renamed;
    }),
  };
}

function objectDependsOn(object: DiagramObject, id: string): boolean {
  return objectReferences(object).includes(id)
    || objectExpressions(object).some(source => expressionSourceIds(source).includes(id));
}

function directDependents(model: VisualDiagramModel, id: string): string[] {
  return model.objects
    .filter(object => object.id !== id && objectDependsOn(object, id))
    .map(object => object.id);
}

export function diagramDeleteImpact(model: VisualDiagramModel, requestedId: string): DiagramDeleteImpact {
  const removed = new Set<string>([requestedId]);
  const queue = [requestedId];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    directDependents(model, current).forEach(id => { if (!removed.has(id)) { removed.add(id); queue.push(id); } });
  }
  const markerRelationIds = new Set(model.objects.flatMap(object => (
    removed.has(object.id) && object.objectType === 'angle' && object.perpendicularRelationId ? [object.perpendicularRelationId] : []
  )));
  const relationIds = model.relations
    .filter(relation => relation.id === requestedId || markerRelationIds.has(relation.id) || relationReferences(relation).some(ref => removed.has(ref)))
    .map(relation => relation.id);
  return { requestedId, removedIds: [...removed], dependentIds: [...removed].filter(id => id !== requestedId), relationIds };
}

export function deleteDiagramCascade(model: VisualDiagramModel, requestedId: string): { model: VisualDiagramModel; impact: DiagramDeleteImpact } {
  const impact = diagramDeleteImpact(model, requestedId);
  const removed = new Set(impact.removedIds);
  const relationIds = new Set(impact.relationIds);
  const objects = model.objects.filter(item => !removed.has(item.id)).map(item => {
    const groupIds = item.groupIds.filter(id => !removed.has(id));
    if (item.objectType === 'control') {
      return { ...item, groupIds, ...(item.action?.effects ? { action: withoutRemovedEffects(item.action, removed) } : {}) };
    }
    if (!isPositionedPoint(item)) return { ...item, groupIds };
    const attractorIds = item.interaction?.attractorIds?.filter(id => !removed.has(id));
    const interaction = item.interaction ? { ...item.interaction, ...(attractorIds ? { attractorIds } : {}) } : undefined;
    if (interaction && attractorIds?.length === 0) delete interaction.attractorIds;
    const withInteraction = { ...item, groupIds, ...(interaction ? { interaction } : {}) };
    if (item.mobility.type !== 'constrained') return withInteraction;
    const relationIdsLeft = item.mobility.relationIds.filter(id => !relationIds.has(id));
    return relationIdsLeft.length > 0
      ? { ...withInteraction, mobility: { type: 'constrained' as const, relationIds: relationIdsLeft } }
      : { ...withInteraction, mobility: { type: 'free' as const } };
  });
  return {
    impact,
    model: {
      ...model,
      objects,
      layers: model.layers.filter(item => !removed.has(item.id)),
      steps: model.steps.filter(item => !removed.has(item.id)).map(step => ({
        ...step,
        visibleTargets: step.visibleTargets.filter(id => !removed.has(id)),
        objectStates: step.objectStates ? Object.fromEntries(Object.entries(step.objectStates).filter(([id]) => !removed.has(id))) : undefined,
      })),
      groups: model.groups.filter(group => !removed.has(group.id)).map(group => ({ ...group, memberIds: group.memberIds.filter(id => !removed.has(id)) })),
      header: model.header ? {
        ...model.header,
        readings: model.header.readings.flatMap(reading => {
          const sourceIds = reading.sourceIds.filter(id => !removed.has(id));
          if (sourceIds.length === 0) return [];
          return [{ ...reading, sourceIds, presentation: reading.presentation === 'equality' && sourceIds.length < 2 ? 'label-value' as const : reading.presentation }];
        }),
      } : undefined,
      relations: model.relations.filter(relation => !relationIds.has(relation.id)),
    },
  };
}

function withoutRemovedEffects(action: NonNullable<VisualSlider['action']>, removed: ReadonlySet<string>): NonNullable<VisualSlider['action']> {
  const effects = action.effects?.filter(effect => !removed.has(effect.control));
  const next = { ...action, effects };
  if (!effects?.length) delete next.effects;
  return next;
}
