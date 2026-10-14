import { objectConstructionReferences, objectKind, objectStyle, segmentEndpoints, type DiagramObject, type MarkObject } from '@/diagrams';
import { element, generatedElementId, refsMatch, removeDiagramElements, type ElementOptions } from '../elements/diagramElements';
import { nextLayerItemOrder } from '../scene/sceneOrdering';
import type { ElementKind, VisualDiagramModel, VisualElement } from '../types';

function plainSegment(model: VisualDiagramModel, segmentId: string): (DiagramObject & { objectType: 'path' }) | undefined {
  const segment = model.objects.find(candidate => candidate.id === segmentId);
  return segment?.objectType === 'path' && segmentEndpoints(segment) ? segment : undefined;
}

function marksForSegment(model: VisualDiagramModel, segment: DiagramObject, variant: MarkObject['variant']): MarkObject[] {
  const endpoints = segmentEndpoints(segment) ?? [];
  return model.objects.filter((candidate): candidate is MarkObject => (
    candidate.objectType === 'mark'
    && candidate.variant === variant
    && refsMatch(objectConstructionReferences(candidate), endpoints, true)
  ));
}

export function congruenceMarkForSegment(
  model: VisualDiagramModel,
  segmentId: string,
): VisualElement | undefined {
  const segment = plainSegment(model, segmentId);
  return segment ? marksForSegment(model, segment, 'congruence')[0] : undefined;
}

export function parallelMarkForSegment(
  model: VisualDiagramModel,
  segmentId: string,
): VisualElement | undefined {
  const segment = plainSegment(model, segmentId);
  return segment ? marksForSegment(model, segment, 'parallel')[0] : undefined;
}

/** Añade un objeto ligado a un segmento en su misma capa y visible en todos los pasos. */
function appendSegmentCompanion(
  model: VisualDiagramModel,
  segment: DiagramObject,
  kind: ElementKind,
  label: string,
  color: VisualElement['color'],
  options: ElementOptions,
  configure: (object: VisualElement) => VisualElement = object => object,
): VisualDiagramModel {
  const endpoints = segmentEndpoints(segment) ?? [];
  const id = generatedElementId(kind, [...endpoints], model.objects);
  const companion = configure(element(id, label, kind, [...endpoints], color, true, {
    ...options,
    layerId: segment.layerId,
    order: nextLayerItemOrder(model, segment.layerId),
  }));
  return {
    ...model,
    objects: [...model.objects, companion],
    steps: model.steps.map(step => ({
      ...step,
      visibleTargets: step.visibleTargets.includes(id) ? step.visibleTargets : [...step.visibleTargets, id],
    })),
  };
}

function setSegmentMark(
  model: VisualDiagramModel,
  segmentId: string,
  variant: 'congruence' | 'parallel',
  requestedCount: number,
  requestedHeight: number | undefined,
): VisualDiagramModel {
  const segment = plainSegment(model, segmentId);
  if (!segment) return model;

  const existingMarks = marksForSegment(model, segment, variant);
  if (requestedCount <= 0) {
    return removeDiagramElements(model, existingMarks.map(mark => mark.id));
  }

  const maximum = variant === 'congruence' ? 4 : 3;
  const defaultHeight = variant === 'congruence' ? 0.32 : 0.42;
  const markCount = Math.max(1, Math.min(maximum, Math.round(requestedCount)));
  const existing = existingMarks[0];
  const markHeight = Math.max(0.05, requestedHeight ?? (existing ? objectStyle(existing)?.markHeight : undefined) ?? defaultHeight);
  if (existing) {
    return {
      ...model,
      objects: model.objects.map(candidate => candidate.id === existing.id && candidate.objectType === 'mark'
        ? { ...candidate, count: markCount, height: markHeight }
        : candidate),
    };
  }

  const kind: ElementKind = variant === 'congruence' ? 'congruenceMark' : 'parallelMark';
  const label = variant === 'congruence' ? `Marca de congruencia de ${segment.label}` : `Marca de paralelismo de ${segment.label}`;
  return appendSegmentCompanion(
    model,
    segment,
    kind,
    label,
    variant === 'congruence' ? 'ocre' : 'pavo',
    { style: { strokeWidth: 2, markHeight } },
    object => object.objectType === 'mark' ? { ...object, count: markCount } : object,
  );
}

export function setSegmentCongruenceMark(
  model: VisualDiagramModel,
  segmentId: string,
  requestedCount: number,
  requestedHeight?: number,
): VisualDiagramModel {
  return setSegmentMark(model, segmentId, 'congruence', requestedCount, requestedHeight);
}

export function setSegmentParallelMark(
  model: VisualDiagramModel,
  segmentId: string,
  requestedCount: number,
  requestedHeight?: number,
): VisualDiagramModel {
  return setSegmentMark(model, segmentId, 'parallel', requestedCount, requestedHeight);
}

function companionForSegment(model: VisualDiagramModel, segmentId: string, kind: ElementKind): VisualElement | undefined {
  const segment = plainSegment(model, segmentId);
  const endpoints = segmentEndpoints(segment);
  if (!endpoints) return undefined;
  return model.objects.find((candidate): candidate is VisualElement => {
    if (objectKind(candidate) !== kind) return false;
    const refs = objectConstructionReferences(candidate);
    return refsMatch(refs, [...endpoints], true) || refs[0] === segmentId;
  });
}

export function dimensionLineForSegment(
  model: VisualDiagramModel,
  segmentId: string,
): VisualElement | undefined {
  return companionForSegment(model, segmentId, 'dimensionLine');
}

export function toggleSegmentDimensionLine(
  model: VisualDiagramModel,
  segmentId: string,
  enable: boolean,
): VisualDiagramModel {
  const segment = plainSegment(model, segmentId);
  if (!segment) return model;

  const existing = dimensionLineForSegment(model, segmentId);
  if (!enable) {
    return existing ? removeDiagramElements(model, [existing.id]) : model;
  }
  if (existing) return model;

  return appendSegmentCompanion(
    model,
    segment,
    'dimensionLine',
    `Cota de ${segment.label}`,
    'carbon',
    { style: { strokeWidth: 1.5 } },
    object => object.objectType === 'path' && object.geometry.type === 'dimension'
      ? { ...object, geometry: { ...object.geometry, offset: 0.4, precision: 2 } }
      : object,
  );
}

export function measurementForSegment(
  model: VisualDiagramModel,
  segmentId: string,
): VisualElement | undefined {
  return companionForSegment(model, segmentId, 'measurement');
}

export function toggleSegmentMeasurement(
  model: VisualDiagramModel,
  segmentId: string,
  enable: boolean,
): VisualDiagramModel {
  const segment = plainSegment(model, segmentId);
  if (!segment) return model;

  const existing = measurementForSegment(model, segmentId);
  if (!enable) {
    return existing ? removeDiagramElements(model, [existing.id]) : model;
  }
  if (existing) return model;

  return appendSegmentCompanion(
    model,
    segment,
    'measurement',
    `Medida de ${segment.label}`,
    'carbon',
    {},
    object => object.objectType === 'annotation'
      ? { ...object, content: { ...object.content, precision: 2, unit: 'cm' } }
      : object,
  );
}
