import { element, generatedElementId, refsMatch } from './diagramElements';
import { nextLayerItemOrder } from './sceneOrdering';
import type { VisualDiagramModel, VisualElement } from './types';

function ticksForSegment(model: VisualDiagramModel, segment: VisualElement): VisualElement[] {
  return model.elements.filter(candidate => (
    candidate.kind === 'measureTicks'
    && candidate.refs[0] === segment.id
  ));
}

function congruenceMarksForSegment(model: VisualDiagramModel, segment: VisualElement): VisualElement[] {
  return model.elements.filter(candidate => (
    candidate.kind === 'congruenceMark'
    && refsMatch(candidate.refs, segment.refs, true)
  ));
}

export function measureTicksForSegment(
  model: VisualDiagramModel,
  segmentId: string,
): VisualElement | undefined {
  const segment = model.elements.find(candidate => candidate.id === segmentId && candidate.kind === 'segment');
  return segment ? ticksForSegment(model, segment)[0] : undefined;
}

export function congruenceMarkForSegment(
  model: VisualDiagramModel,
  segmentId: string,
): VisualElement | undefined {
  const segment = model.elements.find(candidate => candidate.id === segmentId && candidate.kind === 'segment');
  return segment ? congruenceMarksForSegment(model, segment)[0] : undefined;
}

function removeSegmentMarks(model: VisualDiagramModel, removedIds: Set<string>): VisualDiagramModel {
  if (removedIds.size === 0) return model;
  return {
    ...model,
    elements: model.elements.filter(candidate => !removedIds.has(candidate.id)),
    steps: model.steps.map(step => ({
      ...step,
      visibleTargets: step.visibleTargets.filter(targetId => !removedIds.has(targetId)),
      objectStates: step.objectStates
        ? Object.fromEntries(Object.entries(step.objectStates).filter(([targetId]) => !removedIds.has(targetId)))
        : undefined,
    })),
    groups: model.groups.map(group => ({
      ...group,
      memberIds: group.memberIds.filter(memberId => !removedIds.has(memberId)),
    })),
    dependencies: model.dependencies?.filter(dependency => (
      !removedIds.has(dependency.sourceId) && !removedIds.has(dependency.targetId)
    )),
  };
}

function nextLayerOrder(model: VisualDiagramModel, layerId: string): number {
  return nextLayerItemOrder(model, layerId);
}

export function setSegmentMeasureTicks(
  model: VisualDiagramModel,
  segmentId: string,
  requestedDistance: number,
  requestedHeight?: number,
): VisualDiagramModel {
  const segment = model.elements.find(candidate => candidate.id === segmentId && candidate.kind === 'segment');
  if (!segment || segment.refs.length < 2) return model;

  const existingTicks = ticksForSegment(model, segment);
  if (requestedDistance <= 0) {
    return removeSegmentMarks(model, new Set(existingTicks.map(ticks => ticks.id)));
  }

  const tickDistance = Math.max(0.05, requestedDistance);
  const existing = existingTicks[0];
  const markHeight = Math.max(0.05, requestedHeight ?? existing?.style?.markHeight ?? 10);
  if (existing) {
    return {
      ...model,
      elements: model.elements.map(candidate => candidate.id === existing.id
        ? {
            ...candidate,
            properties: { ...candidate.properties, tickDistance },
            style: { ...candidate.style, markHeight },
          }
        : candidate),
    };
  }

  const id = generatedElementId('measureTicks', [segment.id], model.elements);
  const label = `Marcas de medida de ${segment.label}`;
  const ticks = {
    ...element(id, label, 'measureTicks', [segment.id], 'carbon', true, {
      properties: { tickDistance },
      style: { strokeWidth: 2, markHeight },
    }),
    layerId: segment.layerId,
    order: nextLayerOrder(model, segment.layerId),
  };

  return {
    ...model,
    elements: [...model.elements, ticks],
    steps: model.steps.map(step => ({
      ...step,
      visibleTargets: step.visibleTargets.includes(id) ? step.visibleTargets : [...step.visibleTargets, id],
    })),
    dependencies: [
      ...(model.dependencies ?? []),
      { sourceId: segment.id, targetId: id, relation: 'construction' as const },
    ],
  };
}

export function setSegmentCongruenceMark(
  model: VisualDiagramModel,
  segmentId: string,
  requestedCount: number,
  requestedHeight?: number,
): VisualDiagramModel {
  const segment = model.elements.find(candidate => candidate.id === segmentId && candidate.kind === 'segment');
  if (!segment || segment.refs.length < 2) return model;

  const existingMarks = congruenceMarksForSegment(model, segment);
  if (requestedCount <= 0) {
    return removeSegmentMarks(model, new Set(existingMarks.map(mark => mark.id)));
  }

  const markCount = Math.max(1, Math.min(4, Math.round(requestedCount)));
  const existing = existingMarks[0];
  const markHeight = Math.max(0.05, requestedHeight ?? existing?.style?.markHeight ?? 0.32);
  if (existing) {
    return {
      ...model,
      elements: model.elements.map(candidate => candidate.id === existing.id
        ? {
            ...candidate,
            properties: { ...candidate.properties, markCount },
            style: { ...candidate.style, markHeight },
          }
        : candidate),
    };
  }

  const id = generatedElementId('congruenceMark', segment.refs, model.elements);
  const label = `Marca de congruencia de ${segment.label}`;
  const mark = {
    ...element(id, label, 'congruenceMark', [...segment.refs], 'ocre', true, {
      properties: { markCount },
      style: { strokeWidth: 2, markHeight },
    }),
    layerId: segment.layerId,
    order: nextLayerOrder(model, segment.layerId),
  };

  return {
    ...model,
    elements: [...model.elements, mark],
    steps: model.steps.map(step => ({
      ...step,
      visibleTargets: step.visibleTargets.includes(id) ? step.visibleTargets : [...step.visibleTargets, id],
    })),
    dependencies: [
      ...(model.dependencies ?? []),
      ...segment.refs.map(sourceId => ({ sourceId, targetId: id, relation: 'construction' as const })),
    ],
  };
}
