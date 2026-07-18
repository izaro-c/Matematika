import { migrateDiagramSpec } from '../../../../shared/diagrams/spec';
import { cleanTargetId } from './diagramElements';
import type { VisualDiagramModel } from './types';

function renameStepTargets(model: VisualDiagramModel, oldId: string, newId: string) {
  return model.steps.map(item => ({
    ...item,
    visibleTargets: item.visibleTargets.map(target => target === oldId ? newId : target),
    objectStates: item.objectStates
      ? Object.fromEntries(Object.entries(item.objectStates).map(([id, state]) => [id === oldId ? newId : id, state]))
      : undefined,
  }));
}

function renameGroups(model: VisualDiagramModel, oldId: string, newId: string) {
  return model.groups.map(group => ({ ...group, memberIds: group.memberIds.map(id => id === oldId ? newId : id) }));
}

function renameDependencies(model: VisualDiagramModel, oldId: string, newId: string) {
  return model.dependencies?.map(dependency => ({
    ...dependency,
    sourceId: dependency.sourceId === oldId ? newId : dependency.sourceId,
    targetId: dependency.targetId === oldId ? newId : dependency.targetId,
  }));
}

export function renamePoint(model: VisualDiagramModel, oldId: string, newIdRaw: string): VisualDiagramModel {
  const newId = cleanTargetId(newIdRaw, oldId);
  if (newId !== oldId && model.points.some(item => item.id === newId)) return model;
  return {
    ...model,
    points: model.points.map(item => ({
      ...(item.id === oldId ? { ...item, id: newId } : item),
      dependencies: item.dependencies?.map(id => id === oldId ? newId : id),
    })),
    elements: model.elements.map(item => ({ ...item, refs: item.refs.map(ref => ref === oldId ? newId : ref) })),
    steps: renameStepTargets(model, oldId, newId),
    groups: renameGroups(model, oldId, newId),
    constraints: model.constraints?.map(constraint => ({ ...constraint, refs: constraint.refs.map(id => id === oldId ? newId : id) })),
    dependencies: renameDependencies(model, oldId, newId),
  };
}

export function renameElement(model: VisualDiagramModel, oldId: string, newIdRaw: string): VisualDiagramModel {
  const newId = cleanTargetId(newIdRaw, oldId);
  if (newId !== oldId && model.elements.some(item => item.id === newId)) return model;
  return {
    ...model,
    points: model.points.map(item => ({
      ...(item.gliderTarget === oldId ? { ...item, gliderTarget: newId } : item),
      dependencies: item.dependencies?.map(id => id === oldId ? newId : id),
      attractorIds: item.attractorIds?.map(id => id === oldId ? newId : id),
    })),
    elements: model.elements.map(item => ({
      ...(item.id === oldId ? { ...item, id: newId } : item),
      refs: item.refs.map(ref => ref === oldId ? newId : ref),
    })),
    steps: renameStepTargets(model, oldId, newId),
    groups: renameGroups(model, oldId, newId),
    constraints: model.constraints?.map(constraint => ({ ...constraint, refs: constraint.refs.map(id => id === oldId ? newId : id) })),
    dependencies: renameDependencies(model, oldId, newId),
  };
}

export function renameSlider(model: VisualDiagramModel, oldId: string, newIdRaw: string): VisualDiagramModel {
  const newId = cleanTargetId(newIdRaw, oldId);
  if (newId !== oldId && model.sliders.some(item => item.id === newId)) return model;
  return {
    ...model,
    sliders: model.sliders.map(item => item.id === oldId ? { ...item, id: newId } : item),
    steps: renameStepTargets(model, oldId, newId),
    groups: renameGroups(model, oldId, newId),
  };
}

export function normalizeVisualModel(value: unknown, _metadataType: string): VisualDiagramModel | null {
  try {
    return migrateDiagramSpec(value).spec;
  } catch {
    return null;
  }
}
