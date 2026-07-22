import {
  DEFAULT_ANGLE_RADIUS,
  DEFAULT_RIGHT_ANGLE_RADIUS,
  type DiagramStepObjectState,
} from '../../../../shared/diagrams/spec';
import { nextLayerItemOrder } from './sceneOrdering';
import type {
  ColorToken,
  ElementKind,
  PointConstraint,
  VisualConstraint,
  VisualDiagramModel,
  VisualElement,
  VisualPoint,
  VisualSlider,
  VisualStep,
} from './types';

export function point(id: string, label: string, x: number, y: number, fixed = false, color: ColorToken = 'terracota', constraint: PointConstraint = fixed ? 'fixed' : 'free', gliderTarget?: string): VisualPoint {
  const constraintLocksPosition = constraint === 'fixed' || constraint === 'derived';
  return {
    id, label, x, y, showLabel: true, fixed: constraintLocksPosition, color, target: true, targetId: id, constraint, gliderTarget,
    layerId: 'geometry', order: 0, visible: true, locked: false, groupIds: [],
    selection: { selectable: true, role: 'primary', ariaLabel: `Punto ${label}` },
    style: {
      pointSize: 7,
      highlightPointSize: 10,
      preserveColorOnHighlight: true,
    },
  };
}

export function derivedPoint(id: string, label: string, xExpression: string, yExpression: string, dependencies: string[], fallback = { x: 0, y: 0 }, color: ColorToken = 'ocre'): VisualPoint {
  return {
    ...point(id, label, fallback.x, fallback.y, true, color, 'derived'),
    fixed: true,
    dependencies,
    xExpression,
    yExpression,
    selection: { selectable: true, role: 'construction', ariaLabel: `Punto derivado ${label}` },
    style: {
      pointSize: 7,
      highlightPointSize: 10,
      preserveColorOnHighlight: true,
    },
  };
}

export function diagramConstraint(id: string, label: string, kind: VisualConstraint['kind'], refs: string[], extra: Partial<VisualConstraint> = {}): VisualConstraint {
  return { id, label, kind, refs, enabled: true, ...extra };
}

function defaultElementStyle(kind: ElementKind): NonNullable<VisualElement['style']> {
  if (kind === 'angle' || kind === 'nonReflexAngle') return { angleRadius: DEFAULT_ANGLE_RADIUS, preserveColorOnHighlight: true };
  if (kind === 'rightAngle' || kind === 'perpendicularMark') return { angleRadius: DEFAULT_RIGHT_ANGLE_RADIUS, preserveColorOnHighlight: true };
  if (kind === 'parallelMark') return { markHeight: 0.42, strokeWidth: 2, highlightStrokeWidth: 3, preserveColorOnHighlight: true };
  const lineKinds: ElementKind[] = ['segment', 'line', 'ray', 'perpendicular', 'parallel', 'angleBisector', 'poincareGeodesic', 'poincareArc'];
  if (lineKinds.includes(kind)) return { strokeWidth: 2.4, highlightStrokeWidth: 3, preserveColorOnHighlight: true };
  return { preserveColorOnHighlight: true };
}

export function element(id: string, label: string, kind: ElementKind, refs: string[], color: ColorToken, target = true, extra: Partial<VisualElement> = {}): VisualElement {
  const defaultStyle = defaultElementStyle(kind);
  const mergedExtra = {
    ...extra,
    style: { ...defaultStyle, ...extra.style },
  };
  return {
    id, label, kind, refs, color, target, targetId: target ? id : undefined,
    layerId: 'geometry', order: 1000, visible: true, locked: false, groupIds: [],
    selection: { selectable: true, role: kind === 'text' || kind === 'measurement' ? 'annotation' : 'secondary', ariaLabel: label },
    ...mergedExtra,
  };
}

export function slider(id: string, label: string, x: number, y: number, value: number, color: ColorToken = 'pavo'): VisualSlider {
  return {
    id, label, x, y, min: 0, max: 10, value, step: 0.1, color, target: true, targetId: id,
    layerId: 'controls', order: 2000, visible: true, locked: false, groupIds: [],
    selection: { selectable: true, role: 'annotation', ariaLabel: label },
  };
}

export function step(id: string, label: string, description: string, visibleTargets: string[]): VisualStep {
  return {
    id,
    label,
    description,
    visibleTargets,
    durationMs: 1800,
    objectStates: Object.fromEntries(visibleTargets.map(targetId => [targetId, { visible: true, emphasis: 'none', interactive: true }])),
  };
}

export function reindexSteps(steps: VisualStep[]): VisualStep[] {
  let stepCounter = 1;
  return steps.map((item, index) => {
    if (index === 0 && item.id === 'initial') {
      return { ...item, id: 'initial' };
    }
    return { ...item, id: `step${stepCounter++}` };
  });
}

export function toggleInitialStep(steps: VisualStep[], stepId: string): VisualStep[] {
  const targetIndex = steps.findIndex(s => s.id === stepId);
  if (targetIndex < 0) return steps;

  const targetStep = steps[targetIndex];
  const isCurrentlyInitial = targetStep.id === 'initial';

  let updatedSteps: VisualStep[];
  if (isCurrentlyInitial) {
    updatedSteps = steps.map(s => s.id === stepId ? { ...s, id: 'temp_step' } : s);
  } else {
    const withoutTarget = steps.filter(s => s.id !== stepId);
    updatedSteps = [{ ...targetStep, id: 'initial' }, ...withoutTarget];
  }

  return reindexSteps(updatedSteps);
}

export function duplicateStep(steps: VisualStep[], stepId: string): VisualStep[] {
  const index = steps.findIndex(item => item.id === stepId);
  if (index < 0) return steps;
  const source = steps[index];
  const copy: VisualStep = {
    ...source,
    id: `temp_copy`,
    label: `${source.label} (copia)`,
    visibleTargets: [...source.visibleTargets],
    objectStates: source.objectStates
      ? Object.fromEntries(Object.entries(source.objectStates).map(([objectId, state]) => [objectId, {
          ...state,
          overlay: state.overlay ? { ...state.overlay } : undefined,
        }]))
      : undefined,
    extensions: source.extensions ? { ...source.extensions } : undefined,
  };
  return reindexSteps([...steps.slice(0, index + 1), copy, ...steps.slice(index + 1)]);
}

export function removeStep(steps: VisualStep[], stepId: string): VisualStep[] {
  return reindexSteps(steps.filter(item => item.id !== stepId));
}

export function moveStep(steps: VisualStep[], stepId: string, direction: -1 | 1): VisualStep[] {
  const index = steps.findIndex(item => item.id === stepId);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= steps.length) return steps;
  const reordered = [...steps];
  [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
  return reindexSteps(reordered);
}

export function updateStepObjectState(steps: VisualStep[], stepId: string, objectId: string, update: Partial<DiagramStepObjectState>): VisualStep[] {
  return steps.map(item => {
    if (item.id !== stepId) return item;
    const previous = item.objectStates?.[objectId] ?? {
      visible: item.visibleTargets.includes(objectId),
      emphasis: 'none' as const,
      interactive: true,
    };
    const nextState = { ...previous, ...update };
    const visibleTargets = nextState.visible === false
      ? item.visibleTargets.filter(id => id !== objectId)
      : [...new Set([...item.visibleTargets, objectId])];
    return { ...item, visibleTargets, objectStates: { ...(item.objectStates ?? {}), [objectId]: nextState } };
  });
}

export function cleanTargetId(value: string, fallback: string): string {
  return value.replace(/[^A-Za-z0-9_-]/g, '') || fallback;
}

export function nextPointId(points: VisualPoint[]): string {
  for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    if (!points.some(item => item.id === `p${letter}`)) return `p${letter}`;
  }
  return `p${points.length + 1}`;
}

export function nextSliderId(sliders: VisualSlider[]): string {
  let index = sliders.length + 1;
  while (sliders.some(item => item.id === `slider${index}`)) index += 1;
  return `slider${index}`;
}

export function nextStepId(steps: VisualStep[]): string {
  let index = steps.length + 1;
  while (steps.some(item => item.id === `step${index}`)) index += 1;
  return `step${index}`;
}

export { refsNeededForTool } from './referenceRules';

export function generatedElementId(kind: ElementKind, refs: string[], existing: VisualElement[]): string {
  const suffix = refs.map(ref => ref.replace(/^p/, '')).join('');
  const prefixes: Partial<Record<ElementKind, string>> = {
    segment: 'seg', line: 'line', ray: 'ray', circle: 'circle', arc: 'arc', intersection: 'int', midpoint: 'mid',
    perpendicularFoot: 'foot', baseExtension: 'ext', perpendicular: 'perp', parallel: 'par',
    angleBisector: 'bis', angle: 'angle', nonReflexAngle: 'nonReflexAngle', rightAngle: 'rightAngle', parallelMark: 'parallelMark', measureTicks: 'ticks',
  };
  const base = `${prefixes[kind] ?? kind}${suffix || existing.length + 1}`;
  return uniqueElementId(base, existing);
}

export function elementColorForKind(kind: ElementKind): ColorToken {
  if (kind === 'polygon' || kind === 'areaDecomposition' || kind === 'grid') return 'salvia';
  if (kind === 'intersection' || kind === 'midpoint') return 'terracota';
  if (kind === 'measureTicks') return 'carbon';
  if (kind === 'perpendicularFoot' || kind === 'angle' || kind === 'nonReflexAngle' || kind === 'rightAngle' || kind === 'perpendicularMark' || kind === 'congruenceMark') return 'ocre';
  if (kind === 'parallelMark') return 'pavo';
  if (kind === 'baseExtension' || kind === 'measurement' || kind === 'dimensionLine' || kind === 'formula' || kind === 'infoPanel') return 'pizarra';
  if (kind === 'perpendicular' || kind === 'parallel' || kind === 'angleBisector' || kind === 'line' || kind === 'ray' || kind === 'functionCurve' || kind === 'parametricCurve' || kind === 'poincareGeodesic' || kind === 'poincareArc') return 'pavo';
  return 'carbon';
}

export function defaultElementProperties(kind: ElementKind): VisualElement['properties'] | undefined {
  switch (kind) {
    case 'intersection': return { restrictToSupports: true };
    case 'functionCurve': return { expression: 'sin(x)', parameter: 'x', domain: [-5, 5], samples: 128 };
    case 'parametricCurve': return { xExpression: '3*cos(t)', yExpression: '2*sin(t)', parameter: 't', domain: [0, 2 * Math.PI], samples: 128 };
    case 'congruenceMark':
    case 'parallelMark': return { markCount: 1 };
    case 'measureTicks': return { tickDistance: 2 };
    case 'grid':
    case 'areaDecomposition': return { rows: 4, columns: 4 };
    case 'dimensionLine':
    case 'measurement': return { precision: 2 };
    case 'infoPanel': return {
      anchorMode: 'viewport',
      viewportPosition: [0.08, 0.22],
      title: 'Información',
      infoPanelLayout: 'stack',
      infoPanelBlocks: [{ id: 'bloque-1', title: 'Lectura', text: 'Contenido por defecto', rules: [] }],
    };
    case 'label': return { anchorMode: 'reference', anchorParameter: 0.5 };
    default: return undefined;
  }
}

export function updatePoint(model: VisualDiagramModel, pointId: string, update: Partial<VisualPoint>): VisualDiagramModel {
  const previous = model.points.find(item => item.id === pointId);
  if (!previous) return model;
  const removedConstraintIds = update.constraint && update.constraint !== 'constrained'
    ? new Set(previous.constraintIds ?? [])
    : new Set<string>();
  const removesMovementAids = Boolean(update.constraint && !['free', 'horizontal', 'vertical', 'constrained'].includes(update.constraint));
  const removedAttractorIds = removesMovementAids ? new Set(previous.attractorIds ?? []) : new Set<string>();
  const points = model.points.map(item => {
    if (item.id !== pointId) return item;
    if (!update.constraint) return { ...item, ...update };
    const next = {
      ...item,
      ...update,
      fixed: update.constraint === 'fixed' || update.constraint === 'derived',
    };
    if (update.constraint !== 'glider') delete next.gliderTarget;
    if (update.constraint !== 'derived') {
      delete next.dependencies;
      delete next.xExpression;
      delete next.yExpression;
    }
    if (update.constraint !== 'constrained') delete next.constraintIds;
    if (!['free', 'horizontal', 'vertical', 'constrained'].includes(update.constraint)) {
      delete next.attractorIds;
      delete next.attractorDistance;
      delete next.snatchDistance;
    }
    return next;
  });
  if (removedConstraintIds.size === 0 && removedAttractorIds.size === 0) return { ...model, points };
  return {
    ...model,
    points,
    constraints: model.constraints?.filter(item => !removedConstraintIds.has(item.id)),
    dependencies: model.dependencies?.filter(item => (
      (!item.constraintId || !removedConstraintIds.has(item.constraintId))
      && !(item.targetId === pointId && item.relation === 'constraint' && !item.constraintId && removedAttractorIds.has(item.sourceId))
    )),
  };
}

export function updateElement(model: VisualDiagramModel, elementId: string, update: Partial<VisualElement>): VisualDiagramModel {
  return { ...model, elements: model.elements.map(item => item.id === elementId ? { ...item, ...update } : item) };
}

export function updateSlider(model: VisualDiagramModel, sliderId: string, update: Partial<VisualSlider>): VisualDiagramModel {
  return { ...model, sliders: model.sliders.map(item => item.id === sliderId ? { ...item, ...update } : item) };
}

export function updateStep(model: VisualDiagramModel, stepId: string, update: Partial<VisualStep>): VisualDiagramModel {
  return { ...model, steps: model.steps.map(item => item.id === stepId ? { ...item, ...update } : item) };
}

export function pointNameFromRef(ref: string): string {
  return ref.replace(/^p/, '') || ref;
}

export function refsMatch(left: string[], right: string[], unordered = false): boolean {
  if (left.length !== right.length) return false;
  return unordered ? left.every(ref => right.includes(ref)) : left.every((ref, index) => ref === right[index]);
}

export function reusableElement(elements: VisualElement[], kind: ElementKind, refs: string[], unordered = false): VisualElement | undefined {
  return elements.find(item => item.kind === kind && refsMatch(item.refs, refs, unordered));
}

export function uniqueElementId(base: string, elements: VisualElement[]): string {
  const cleanBase = cleanTargetId(base, `element${elements.length + 1}`);
  let candidate = cleanBase;
  let index = 2;
  while (elements.some(item => item.id === candidate)) candidate = `${cleanBase}_${index++}`;
  return candidate;
}

export function addLabelToElement(model: VisualDiagramModel, sourceId: string): { model: VisualDiagramModel; labelId: string } {
  const source = model.elements.find(item => item.id === sourceId && item.kind !== 'label');
  if (!source) return { model, labelId: sourceId };
  const existing = model.elements.find(item => item.kind === 'label' && item.refs[0] === sourceId);
  if (existing) return { model, labelId: existing.id };

  const labelId = uniqueElementId(`label-${sourceId}`, model.elements);
  const annotationLayer = model.layers.find(layer => /anot/i.test(`${layer.id} ${layer.label}`))?.id ?? source.layerId;
  const labelElement: VisualElement = {
    ...element(labelId, `Etiqueta de ${source.label}`, 'label', [sourceId], source.color, false),
    layerId: annotationLayer,
    order: nextLayerItemOrder(model, annotationLayer),
    selection: {
      selectable: true,
      highlightable: true,
      dimOthersOnHighlight: false,
      ariaLabel: `Etiqueta de ${source.label}`,
      role: 'annotation',
    },
    style: { textOffset: [0.04, 0.04], labelSize: 14, preserveColorOnHighlight: true },
    text: source.label,
    properties: { anchorMode: 'reference', anchorParameter: 0.5 },
  };
  return {
    labelId,
    model: {
      ...model,
      elements: [...model.elements, labelElement],
      steps: model.steps.map(item => ({
        ...item,
        visibleTargets: item.visibleTargets.includes(labelId) ? item.visibleTargets : [...item.visibleTargets, labelId],
      })),
      dependencies: [
        ...(model.dependencies || []),
        { sourceId, targetId: labelId, relation: 'construction' },
      ],
    },
  };
}

/** Elimina elementos y todas sus referencias editoriales sin dejar una spec parcial. */
export function removeDiagramElements(model: VisualDiagramModel, elementIds: Iterable<string>): VisualDiagramModel {
  const removedIds = new Set(elementIds);
  if (removedIds.size === 0) return model;
  const removedConstraintIds = new Set((model.constraints ?? [])
    .filter(constraint => constraint.refs.some(ref => removedIds.has(ref)))
    .map(constraint => constraint.id));
  return {
    ...model,
    elements: model.elements.filter(element => !removedIds.has(element.id)),
    steps: model.steps.map(item => ({
      ...item,
      visibleTargets: item.visibleTargets.filter(id => !removedIds.has(id)),
      objectStates: item.objectStates
        ? Object.fromEntries(Object.entries(item.objectStates).filter(([id]) => !removedIds.has(id)))
        : undefined,
    })),
    groups: model.groups.map(group => ({ ...group, memberIds: group.memberIds.filter(id => !removedIds.has(id)) })),
    constraints: model.constraints?.filter(constraint => !removedConstraintIds.has(constraint.id)),
    dependencies: model.dependencies?.filter(dependency => (
      !removedIds.has(dependency.sourceId)
      && !removedIds.has(dependency.targetId)
      && (!dependency.constraintId || !removedConstraintIds.has(dependency.constraintId))
    )),
  };
}
