import {
  DEFAULT_ANGLE_RADIUS,
  DEFAULT_RIGHT_ANGLE_RADIUS,
  type DiagramStepObjectState,
} from '../../../../shared/diagrams/spec';
import type {
  CanvasTool,
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
    id, label, x, y, fixed: constraintLocksPosition, color, target: true, targetId: id, constraint, gliderTarget,
    layerId: 'geometry', order: 0, visible: true, locked: false, groupIds: [],
    selection: { selectable: true, role: 'primary', ariaLabel: `Punto ${label}` },
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
  };
}

export function diagramConstraint(id: string, label: string, kind: VisualConstraint['kind'], refs: string[], extra: Partial<VisualConstraint> = {}): VisualConstraint {
  return { id, label, kind, refs, enabled: true, ...extra };
}

export function element(id: string, label: string, kind: ElementKind, refs: string[], color: ColorToken, target = true, extra: Partial<VisualElement> = {}): VisualElement {
  const defaultStyle = kind === 'angle'
    ? { angleRadius: DEFAULT_ANGLE_RADIUS }
    : kind === 'rightAngle' || kind === 'perpendicularMark'
      ? { angleRadius: DEFAULT_RIGHT_ANGLE_RADIUS }
      : undefined;
  const mergedExtra = defaultStyle
    ? { ...extra, style: { ...defaultStyle, ...extra.style } }
    : extra;
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

export function duplicateStep(steps: VisualStep[], stepId: string): VisualStep[] {
  const index = steps.findIndex(item => item.id === stepId);
  if (index < 0) return steps;
  const id = nextStepId(steps);
  const source = steps[index];
  const copy: VisualStep = {
    ...source,
    id,
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
  return [...steps.slice(0, index + 1), copy, ...steps.slice(index + 1)];
}

export function removeStep(steps: VisualStep[], stepId: string): VisualStep[] {
  return steps.filter(item => item.id !== stepId);
}

export function moveStep(steps: VisualStep[], stepId: string, direction: -1 | 1): VisualStep[] {
  const index = steps.findIndex(item => item.id === stepId);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= steps.length) return steps;
  const reordered = [...steps];
  [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
  return reordered;
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

export function refsNeededForTool(tool: CanvasTool): number {
  if (['segment', 'line', 'ray', 'circle', 'intersection', 'midpoint', 'congruenceMark', 'dimensionLine', 'measurement'].includes(tool)) return 2;
  if (['arc', 'polygon', 'perpendicularFoot', 'baseExtension', 'perpendicular', 'parallel', 'angleBisector', 'angle', 'rightAngle', 'perpendicularMark', 'areaDecomposition'].includes(tool)) return 3;
  if (['poincareGeodesic', 'poincareArc', 'grid'].includes(tool)) return 4;
  if (['text', 'label', 'formula'].includes(tool)) return 1;
  if (tool === 'infoPanel') return 0;
  return 0;
}

export function generatedElementId(kind: ElementKind, refs: string[], existing: VisualElement[]): string {
  const suffix = refs.map(ref => ref.replace(/^p/, '')).join('');
  const prefixes: Partial<Record<ElementKind, string>> = {
    segment: 'seg', line: 'line', ray: 'ray', circle: 'circle', arc: 'arc', intersection: 'int', midpoint: 'mid',
    perpendicularFoot: 'foot', baseExtension: 'ext', perpendicular: 'perp', parallel: 'par',
    angleBisector: 'bis', angle: 'angle', rightAngle: 'rightAngle',
  };
  const base = `${prefixes[kind] ?? kind}${suffix || existing.length + 1}`;
  return uniqueElementId(base, existing);
}

export function elementColorForKind(kind: ElementKind): ColorToken {
  if (kind === 'polygon' || kind === 'areaDecomposition' || kind === 'grid') return 'salvia';
  if (kind === 'intersection' || kind === 'midpoint') return 'terracota';
  if (kind === 'perpendicularFoot' || kind === 'angle' || kind === 'rightAngle' || kind === 'perpendicularMark' || kind === 'congruenceMark') return 'ocre';
  if (kind === 'baseExtension' || kind === 'measurement' || kind === 'dimensionLine' || kind === 'formula' || kind === 'infoPanel') return 'pizarra';
  if (kind === 'perpendicular' || kind === 'parallel' || kind === 'angleBisector' || kind === 'line' || kind === 'ray' || kind === 'functionCurve' || kind === 'parametricCurve' || kind === 'poincareGeodesic' || kind === 'poincareArc') return 'pavo';
  return 'carbon';
}

export function updatePoint(model: VisualDiagramModel, pointId: string, update: Partial<VisualPoint>): VisualDiagramModel {
  const previous = model.points.find(item => item.id === pointId);
  if (!previous) return model;
  const removedConstraintIds = update.constraint && update.constraint !== 'constrained'
    ? new Set(previous.constraintIds ?? [])
    : new Set<string>();
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
    return next;
  });
  if (removedConstraintIds.size === 0) return { ...model, points };
  return {
    ...model,
    points,
    constraints: model.constraints?.filter(item => !removedConstraintIds.has(item.id)),
    dependencies: model.dependencies?.filter(item => !item.constraintId || !removedConstraintIds.has(item.constraintId)),
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
