import { objectReferences, relationReferences } from '@/diagrams';
import type { VisualDiagramModel, VisualStep } from '../model/types';

export function allModelObjectIds(model: VisualDiagramModel): Set<string> {
  return new Set(model.objects.map(object => object.id));
}

/**
 * Selection is driven only by selectedIds (kept in sync via selectMany).
 * Never revive state.selectedId after an intentional empty selection.
 */
export function effectiveSelection(
  model: VisualDiagramModel | null,
  selectedIds: readonly string[],
): string[] {
  if (!model) return [];
  const valid = allModelObjectIds(model);
  return selectedIds.filter(id => valid.has(id));
}

export function toggleAdditiveSelection(currentIds: readonly string[], id: string): string[] {
  return currentIds.includes(id)
    ? currentIds.filter(item => item !== id)
    : [...currentIds, id];
}

export function primaryIdForSelection(ids: readonly string[]): string {
  return ids[0] || '';
}

export function syncStepObjectVisibility(
  step: VisualStep,
  objectId: string,
  makeVisible: boolean,
): VisualStep {
  const current = step.visibleTargets || [];
  const visibleTargets = makeVisible
    ? [...new Set([...current, objectId])]
    : current.filter(id => id !== objectId);
  const objectStates = { ...(step.objectStates || {}) };
  objectStates[objectId] = {
    ...(objectStates[objectId] || {}),
    visible: makeVisible,
  };
  return { ...step, visibleTargets, objectStates };
}

/**
 * Elimina lo que quedó colgando tras borrar objetos: atractores ausentes,
 * relaciones con referencias rotas y objetos que dependen de objetos ausentes.
 */
export function repairBrokenReferences(model: VisualDiagramModel): VisualDiagramModel {
  let objects = model.objects;
  for (;;) {
    const validIds = new Set(objects.map(object => object.id));
    const next = objects
      .map(object => {
        if (object.objectType !== 'point' || !object.interaction?.attractorIds) return object;
        return { ...object, interaction: { ...object.interaction, attractorIds: object.interaction.attractorIds.filter(id => validIds.has(id)) } };
      })
      .filter(object => objectReferences(object).every(id => validIds.has(id)));
    if (next.length === objects.length) {
      objects = next;
      break;
    }
    objects = next;
  }
  const validIds = new Set(objects.map(object => object.id));
  const deadRelationIds = new Set(model.relations
    .filter(relation => relationReferences(relation).some(refId => !validIds.has(refId)))
    .map(relation => relation.id));
  const relations = model.relations.filter(relation => !deadRelationIds.has(relation.id));
  objects = objects.map(object => {
    if (object.objectType !== 'point' || object.mobility.type !== 'constrained') return object;
    const relationIds = object.mobility.relationIds.filter(id => !deadRelationIds.has(id));
    return relationIds.length > 0
      ? { ...object, mobility: { type: 'constrained', relationIds } }
      : { ...object, mobility: { type: 'free' } };
  });
  return { ...model, objects, relations };
}

/** Parse number allowing explicit 0 (unlike `parseFloat(x) || fallback`). */
export function parseOptionalNumber(raw: string, fallback: number): number {
  const trimmed = raw.trim();
  if (trimmed === '') return fallback;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : fallback;
}
