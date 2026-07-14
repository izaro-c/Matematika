import { element, pointNameFromRef, reusableElement, uniqueElementId } from './diagramElements';
import { CONSTRUCTION_OPTIONS } from './diagramOptions';
import type { ColorToken, ConstructionKind, ConstructionRefKey, ElementKind, VisualDiagramModel, VisualElement, VisualPoint, VisualStep } from './types';

export function constructionOption(kind: ConstructionKind) {
  return CONSTRUCTION_OPTIONS.find(item => item.value === kind) || CONSTRUCTION_OPTIONS[0];
}

export function defaultConstructionRefs(points: VisualPoint[]): Record<ConstructionRefKey, string> {
  return { a: points[0]?.id || '', b: points[1]?.id || points[0]?.id || '', c: points[2]?.id || points[0]?.id || '' };
}

export function normalizeConstructionRefs(points: VisualPoint[], refs: Record<ConstructionRefKey, string>): Record<ConstructionRefKey, string> {
  const pointIds = new Set(points.map(item => item.id));
  const defaults = defaultConstructionRefs(points);
  return {
    a: pointIds.has(refs?.a) ? refs.a : defaults.a,
    b: pointIds.has(refs?.b) ? refs.b : defaults.b,
    c: pointIds.has(refs?.c) ? refs.c : defaults.c,
  };
}

export function validConstructionRefs(kind: ConstructionKind, refs: Record<ConstructionRefKey, string>): boolean {
  const values = constructionOption(kind).slots.map(slot => refs[slot.key]).filter(Boolean);
  return values.length === constructionOption(kind).slots.length && new Set(values).size === values.length;
}

export function appendTargetsToSteps(steps: VisualStep[], targetIds: string[]): VisualStep[] {
  if (targetIds.length === 0) return steps;
  return steps.map(item => ({ ...item, visibleTargets: Array.from(new Set([...item.visibleTargets, ...targetIds])) }));
}

export function applyGuidedConstruction(model: VisualDiagramModel, kind: ConstructionKind, refs: Record<ConstructionRefKey, string>): { model: VisualDiagramModel; selectedId: string } {
  const { a, b, c } = refs;
  const elements = [...model.elements];
  const addedTargetIds: string[] = [];
  let selectedId = model.elements[0]?.id || model.points[0]?.id || '';
  const addOrReuse = (baseId: string, label: string, elementKind: ElementKind, elementRefs: string[], color: ColorToken, unordered = false, extra: Partial<VisualElement> = {}) => {
    const existing = reusableElement(elements, elementKind, elementRefs, unordered);
    if (existing) { selectedId = existing.id; return existing.id; }
    const id = uniqueElementId(baseId, elements);
    elements.push(element(id, label, elementKind, elementRefs, color, true, extra));
    addedTargetIds.push(id);
    selectedId = id;
    return id;
  };

  if (kind === 'mediatriz') {
    const pair = `${pointNameFromRef(a)}${pointNameFromRef(b)}`;
    const midpointId = addOrReuse(`mid${pair}`, `Punto medio de ${pair}`, 'midpoint', [a, b], 'terracota', true);
    addOrReuse(`lineMediatriz${pair}`, `Mediatriz de ${pair}`, 'perpendicular', [a, b, midpointId], 'pavo', false, { dashed: true });
  } else if (kind === 'mediana') {
    const pair = `${pointNameFromRef(a)}${pointNameFromRef(b)}`;
    const vertex = pointNameFromRef(c);
    const midpointId = addOrReuse(`mid${pair}`, `Punto medio de ${pair}`, 'midpoint', [a, b], 'terracota', true);
    addOrReuse(`segMediana${vertex}${pair}`, `Mediana desde ${vertex} a ${pair}`, 'segment', [c, midpointId], 'salvia', true);
  } else if (kind === 'altura') {
    const pair = `${pointNameFromRef(a)}${pointNameFromRef(b)}`;
    const vertex = pointNameFromRef(c);
    const footId = addOrReuse(`foot${vertex}${pair}`, `Pie de altura ${vertex}${pair}`, 'perpendicularFoot', [a, b, c], 'ocre');
    addOrReuse(`extAltura${vertex}${pair}`, `Extensión de base ${pair}`, 'baseExtension', [a, b, footId], 'pizarra', false, { dashed: true });
    addOrReuse(`lineAltura${vertex}${pair}`, `Recta de altura desde ${vertex}`, 'perpendicular', [a, b, c], 'pavo', false, { dashed: true });
    addOrReuse(`segAltura${vertex}${pair}`, `Altura desde ${vertex} a ${pair}`, 'segment', [c, footId], 'terracota', true);
    addOrReuse(`rightAngleAltura${vertex}${pair}`, 'Ángulo recto de la altura', 'rightAngle', [a, footId, c], 'ocre');
  } else {
    const triple = `${pointNameFromRef(a)}${pointNameFromRef(b)}${pointNameFromRef(c)}`;
    addOrReuse(`angle${triple}`, `Ángulo ${triple}`, 'angle', [a, b, c], 'ocre');
    addOrReuse(`bis${triple}`, `Bisectriz de ${triple}`, 'angleBisector', [a, b, c], 'pavo', false, { dashed: true });
  }

  return { model: { ...model, elements, steps: appendTargetsToSteps(model.steps, addedTargetIds) }, selectedId };
}
