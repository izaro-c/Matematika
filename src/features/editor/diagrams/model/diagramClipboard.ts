import type {
  DiagramConstraint,
  DiagramDependency,
  DiagramGroup,
  DiagramStepObjectState,
} from '../../../../shared/diagrams/spec';
import type {
  VisualDiagramModel,
  VisualElement,
  VisualPoint,
  VisualSlider,
} from './types';

export const DIAGRAM_CLIPBOARD_KIND = 'matematika-diagram-clipboard-v1' as const;

interface ClipboardStepState {
  stepId: string;
  visibleIds: string[];
  objectStates: Record<string, DiagramStepObjectState>;
}

export interface DiagramClipboardPayload {
  kind: typeof DIAGRAM_CLIPBOARD_KIND;
  sourceComponentId: string;
  rootIds: string[];
  points: VisualPoint[];
  elements: VisualElement[];
  sliders: VisualSlider[];
  groups: DiagramGroup[];
  constraints: DiagramConstraint[];
  dependencies: DiagramDependency[];
  stepStates: ClipboardStepState[];
}

export interface DiagramPasteResult {
  model: VisualDiagramModel;
  selectedId: string;
  pastedIds: string[];
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function sceneIds(model: VisualDiagramModel): Set<string> {
  return new Set([...model.points, ...model.elements, ...model.sliders].map(item => item.id));
}

function uniqueId(base: string, used: Set<string>): string {
  let candidate = `${base}_copy`;
  let index = 2;
  while (used.has(candidate)) candidate = `${base}_copy_${index++}`;
  used.add(candidate);
  return candidate;
}

function rewriteExpression(source: string | undefined, idMap: ReadonlyMap<string, string>): string | undefined {
  if (!source) return source;
  return source.replace(/[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*/g, identifier => {
    const [root, ...path] = identifier.split('.');
    const replacement = idMap.get(root);
    return replacement ? [replacement, ...path].join('.') : identifier;
  });
}

function remapProperties(properties: VisualElement['properties'], idMap: ReadonlyMap<string, string>): VisualElement['properties'] {
  if (!properties) return properties;
  return {
    ...clone(properties),
    expression: rewriteExpression(properties.expression, idMap),
    xExpression: rewriteExpression(properties.xExpression, idMap),
    yExpression: rewriteExpression(properties.yExpression, idMap),
    tickDistanceExpression: rewriteExpression(properties.tickDistanceExpression, idMap),
    visibleWhen: rewriteExpression(properties.visibleWhen, idMap),
    textRules: properties.textRules?.map(rule => ({ ...rule, when: rewriteExpression(rule.when, idMap) ?? rule.when })),
    infoPanelBlocks: properties.infoPanelBlocks?.map(block => ({
      ...block,
      expression: rewriteExpression(block.expression, idMap),
      rules: block.rules?.map(rule => ({
        ...rule,
        when: rewriteExpression(rule.when, idMap) ?? rule.when,
        expression: rewriteExpression(rule.expression, idMap),
      })),
    })),
  };
}

export function createDiagramClipboard(
  model: VisualDiagramModel,
  selectedIds: readonly string[],
  selectedGroupIds: readonly string[] = [],
): DiagramClipboardPayload | null {
  const selected = new Set(selectedIds);
  const groups = model.groups.filter(group => selectedGroupIds.includes(group.id));
  groups.forEach(group => group.memberIds.forEach(id => selected.add(id)));
  const rootIds = [...selected];
  let closureChanged = true;
  while (closureChanged) {
    closureChanged = false;
    const add = (id: string | undefined) => {
      if (id && !selected.has(id)) {
        selected.add(id);
        closureChanged = true;
      }
    };
    model.elements.filter(item => selected.has(item.id)).forEach(item => item.refs.forEach(add));
    model.points.filter(item => selected.has(item.id)).forEach(item => {
      add(item.gliderTarget);
      item.dependencies?.forEach(add);
      item.attractorIds?.forEach(add);
      item.constraintIds?.forEach(constraintId => model.constraints?.find(constraint => constraint.id === constraintId)?.refs.forEach(add));
    });
    (model.dependencies ?? []).filter(dependency => selected.has(dependency.targetId)).forEach(dependency => add(dependency.sourceId));
  }

  const points = model.points.filter(item => selected.has(item.id));
  const elements = model.elements.filter(item => selected.has(item.id));
  const sliders = model.sliders.filter(item => selected.has(item.id));
  const copiedIds = new Set([...points, ...elements, ...sliders].map(item => item.id));
  if (copiedIds.size === 0) return null;

  const constraints = (model.constraints ?? []).filter(constraint => constraint.refs.every(ref => copiedIds.has(ref)));
  const constraintIds = new Set(constraints.map(constraint => constraint.id));
  const dependencies = (model.dependencies ?? []).filter(dependency => (
    copiedIds.has(dependency.sourceId)
    && copiedIds.has(dependency.targetId)
    && (!dependency.constraintId || constraintIds.has(dependency.constraintId))
  ));
  const stepStates = model.steps.map(step => ({
    stepId: step.id,
    visibleIds: step.visibleTargets.filter(id => copiedIds.has(id)),
    objectStates: Object.fromEntries(Object.entries(step.objectStates ?? {})
      .filter(([id]) => copiedIds.has(id))
      .map(([id, state]) => [id, clone(state)])),
  }));

  return clone({
    kind: DIAGRAM_CLIPBOARD_KIND,
    sourceComponentId: model.componentId,
    rootIds,
    points,
    elements,
    sliders,
    groups,
    constraints,
    dependencies,
    stepStates,
  });
}

export function serializeDiagramClipboard(payload: DiagramClipboardPayload): string {
  return JSON.stringify(payload, null, 2);
}

export function parseDiagramClipboard(value: string): DiagramClipboardPayload | null {
  try {
    const parsed = JSON.parse(value) as Partial<DiagramClipboardPayload>;
    if (parsed.kind !== DIAGRAM_CLIPBOARD_KIND) return null;
    const hasStringIds = (items: unknown): items is Array<{ id: string }> => Array.isArray(items) && items.every(item => typeof item === 'object' && item !== null && typeof (item as { id?: unknown }).id === 'string');
    const hasStringArray = (items: unknown): items is string[] => Array.isArray(items) && items.every(item => typeof item === 'string');
    if (typeof parsed.sourceComponentId !== 'string' || !hasStringArray(parsed.rootIds)) return null;
    if (!hasStringIds(parsed.points) || !parsed.points.every(item => hasStringArray(item.groupIds))) return null;
    if (!hasStringIds(parsed.elements) || !parsed.elements.every(item => hasStringArray(item.refs) && hasStringArray(item.groupIds))) return null;
    if (!hasStringIds(parsed.sliders) || !parsed.sliders.every(item => hasStringArray(item.groupIds))) return null;
    if (!Array.isArray(parsed.groups) || !Array.isArray(parsed.constraints) || !Array.isArray(parsed.dependencies) || !Array.isArray(parsed.stepStates)) return null;
    if (!hasStringIds(parsed.groups) || !parsed.groups.every(group => hasStringArray(group.memberIds))) return null;
    if (!hasStringIds(parsed.constraints) || !parsed.constraints.every(constraint => hasStringArray(constraint.refs))) return null;
    if (!parsed.dependencies.every(dependency => typeof dependency?.sourceId === 'string' && typeof dependency?.targetId === 'string')) return null;
    if (!parsed.stepStates.every(state => typeof state?.stepId === 'string' && hasStringArray(state?.visibleIds) && typeof state?.objectStates === 'object' && state.objectStates !== null)) return null;
    return parsed as DiagramClipboardPayload;
  } catch {
    return null;
  }
}

export function pasteDiagramClipboard(model: VisualDiagramModel, payload: DiagramClipboardPayload): DiagramPasteResult {
  const usedIds = new Set([
    ...sceneIds(model),
    ...model.groups.map(group => group.id),
    ...model.steps.map(step => step.id),
    ...(model.constraints ?? []).map(constraint => constraint.id),
  ]);
  const idMap = new Map<string, string>();
  [...payload.points, ...payload.elements, ...payload.sliders].forEach(item => idMap.set(item.id, uniqueId(item.id, usedIds)));
  payload.groups.forEach(group => idMap.set(group.id, uniqueId(group.id, usedIds)));
  payload.constraints.forEach(constraint => idMap.set(constraint.id, uniqueId(constraint.id, usedIds)));

  const targetIds = new Set([
    ...model.steps.map(step => step.id),
    ...[...model.points, ...model.elements, ...model.sliders].filter(item => item.target).map(item => item.targetId ?? item.id),
    ...model.groups.filter(group => group.target).map(group => group.targetId ?? group.id),
  ]);
  const uniqueTargetId = (base: string) => uniqueId(base.replace(/_copy(?:_\d+)?$/, ''), targetIds);
  const remapGroupIds = (groupIds: string[]) => groupIds.flatMap(groupId => {
    const mapped = idMap.get(groupId);
    return mapped ? [mapped] : [];
  });
  const remapTarget = <T extends { id: string; target: boolean; targetId?: string }>(item: T, nextId: string): T => ({
    ...item,
    id: nextId,
    targetId: item.target ? uniqueTargetId(item.targetId ?? item.id) : undefined,
  });

  const points = payload.points.map(source => {
    const id = idMap.get(source.id)!;
    const constraintIds = source.constraintIds?.map(constraintId => idMap.get(constraintId)).filter((value): value is string => Boolean(value));
    const constraint = source.constraint === 'constrained' && !constraintIds?.length ? 'free' as const : source.constraint;
    return remapTarget({
      ...clone(source),
      x: source.x + 0.5,
      y: source.y - 0.5,
      label: `${source.label} (copia)`,
      groupIds: remapGroupIds(source.groupIds),
      gliderTarget: source.gliderTarget ? idMap.get(source.gliderTarget) ?? source.gliderTarget : undefined,
      dependencies: source.dependencies?.map(dependency => idMap.get(dependency) ?? dependency),
      attractorIds: source.attractorIds?.map(attractor => idMap.get(attractor) ?? attractor),
      constraintIds: constraintIds?.length ? constraintIds : undefined,
      constraint,
      fixed: constraint === 'fixed' || constraint === 'derived',
      xExpression: rewriteExpression(source.xExpression, idMap),
      yExpression: rewriteExpression(source.yExpression, idMap),
      order: source.order + 1,
    }, id);
  });
  const elements = payload.elements.map(source => {
    const id = idMap.get(source.id)!;
    const viewportPosition = source.properties?.viewportPosition
      ? [Math.min(1, source.properties.viewportPosition[0] + 0.03), Math.min(1, source.properties.viewportPosition[1] + 0.03)] as [number, number]
      : undefined;
    return remapTarget({
      ...clone(source),
      label: `${source.label} (copia)`,
      refs: source.refs.map(ref => idMap.get(ref) ?? ref),
      groupIds: remapGroupIds(source.groupIds),
      properties: {
        ...remapProperties(source.properties, idMap),
        ...(viewportPosition ? { viewportPosition } : {}),
      },
      order: source.order + 1,
    }, id);
  });
  const sliders = payload.sliders.map(source => {
    const id = idMap.get(source.id)!;
    return remapTarget({
      ...clone(source),
      x: source.x + 0.5,
      y: source.y - 0.5,
      label: `${source.label} (copia)`,
      groupIds: remapGroupIds(source.groupIds),
      maxExpression: rewriteExpression(source.maxExpression, idMap),
      order: source.order + 1,
    }, id);
  });
  const groups = payload.groups.map(source => ({
    ...clone(source),
    id: idMap.get(source.id)!,
    label: `${source.label} (copia)`,
    memberIds: source.memberIds.map(id => idMap.get(id)).filter((value): value is string => Boolean(value)),
    targetId: source.target ? uniqueTargetId(source.targetId ?? source.id) : undefined,
  }));
  const constraints = payload.constraints.map(source => ({
    ...clone(source),
    id: idMap.get(source.id)!,
    label: `${source.label} (copia)`,
    refs: source.refs.map(ref => idMap.get(ref) ?? ref),
    expression: rewriteExpression(source.expression, idMap),
  }));
  const dependencies = payload.dependencies.map(source => ({
    ...clone(source),
    sourceId: idMap.get(source.sourceId) ?? source.sourceId,
    targetId: idMap.get(source.targetId) ?? source.targetId,
    constraintId: source.constraintId ? idMap.get(source.constraintId) ?? source.constraintId : undefined,
  }));
  const stepStateById = new Map(payload.stepStates.map(state => [state.stepId, state]));
  const steps = model.steps.map(step => {
    const copied = stepStateById.get(step.id);
    if (!copied) return step;
    const visibleTargets = [...step.visibleTargets, ...copied.visibleIds.map(id => idMap.get(id)).filter((value): value is string => Boolean(value))];
    const objectStates = { ...(step.objectStates ?? {}) };
    Object.entries(copied.objectStates).forEach(([oldId, state]) => {
      const id = idMap.get(oldId);
      if (!id) return;
      objectStates[id] = {
        ...clone(state),
        overlay: state.overlay ? { ...clone(state.overlay), expression: rewriteExpression(state.overlay.expression, idMap) } : undefined,
      };
    });
    return { ...step, visibleTargets: [...new Set(visibleTargets)], objectStates };
  });
  const pastedIds = [...points, ...elements, ...sliders].map(item => item.id);

  return {
    model: {
      ...model,
      points: [...model.points, ...points],
      elements: [...model.elements, ...elements],
      sliders: [...model.sliders, ...sliders],
      groups: [...model.groups, ...groups],
      constraints: [...(model.constraints ?? []), ...constraints],
      dependencies: [...(model.dependencies ?? []), ...dependencies],
      steps,
    },
    selectedId: payload.rootIds.map(id => idMap.get(id)).find((id): id is string => Boolean(id)) ?? pastedIds[0] ?? '',
    pastedIds,
  };
}
