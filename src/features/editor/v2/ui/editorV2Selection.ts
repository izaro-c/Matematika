import type { VisualDiagramModel, VisualStep } from '../../diagrams/model/types';

export function allModelObjectIds(model: VisualDiagramModel): Set<string> {
  return new Set([
    ...model.points.map(p => p.id),
    ...model.elements.map(e => e.id),
    ...model.sliders.map(s => s.id),
  ]);
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

export function repairBrokenReferences(model: VisualDiagramModel): VisualDiagramModel {
  const validIds = allModelObjectIds(model);
  const elements = model.elements.map(elem => ({
    ...elem,
    refs: (elem.refs || []).filter(refId => validIds.has(refId)),
  }));
  const deadConstraintIds = new Set(
    (model.constraints || [])
      .filter(constraint => constraint.refs.some(refId => !validIds.has(refId)))
      .map(c => c.id),
  );
  const constraints = (model.constraints || []).filter(c => !deadConstraintIds.has(c.id));
  const points = model.points.map(p => ({
    ...p,
    constraintIds: (p.constraintIds || []).filter(id => !deadConstraintIds.has(id)),
  }));
  const dependencies = (model.dependencies || []).filter(dep => {
    if (!validIds.has(dep.sourceId) || !validIds.has(dep.targetId)) return false;
    if (dep.constraintId && deadConstraintIds.has(dep.constraintId)) return false;
    return true;
  });
  return { ...model, elements, constraints, points, dependencies };
}

/** Parse number allowing explicit 0 (unlike `parseFloat(x) || fallback`). */
export function parseOptionalNumber(raw: string, fallback: number): number {
  const trimmed = raw.trim();
  if (trimmed === '') return fallback;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : fallback;
}
