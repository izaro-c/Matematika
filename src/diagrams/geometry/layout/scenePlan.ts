import type {
  DiagramDependency,
  DiagramPoint,
  DiagramSceneItem,
  DiagramSceneState,
  DiagramSpecV2,
  DiagramStepOverlay,
} from '@/diagrams/model/schema/types';
import type { DiagramSpecV3 } from '@/diagrams/model/schema/v3';
import type {
  DiagramDependencyEdge,
  DiagramDependencyGraph,
  DiagramSceneBag,
  PlannedSceneItem,
} from '@/diagrams/geometry/layout/sceneTypes';
import { resolveStepSceneAppearance } from '@/diagrams/geometry/layout/sceneTypes';
import { evaluateMathExpression, extractMathExpressionIdentifiers } from '@/diagrams/model/expressions/expressions';
import { interpolateDiagramTemplate } from '@/diagrams/model/semantics/infoPanels';
import { prepareSceneSpec } from '@/diagrams/geometry/coordinates/scenePointMotion';

function expressionUsesSource(source: string | undefined, sourceId: string): boolean {
  if (!source) return false;
  try {
    return extractMathExpressionIdentifiers(source)
      .some(identifier => identifier.split('.')[0] === sourceId);
  } catch {
    return false;
  }
}

/**
 * Distingue dependencias que construyen valores de las reactivas que solo
 * afectan a presentación después de crear la escena. En particular,
 * visibleWhen y las reglas de texto no introducen ciclos geométricos.
 */
export function dependencyDeterminesConstructionOrder(
  spec: DiagramSceneBag,
  dependency: DiagramDependency,
): boolean {
  if (dependency.relation === 'construction') return true;
  const targetPoint = spec.points.find(point => point.id === dependency.targetId);
  if (dependency.relation === 'constraint') {
    if (dependency.constraintId) {
      const constraint = spec.constraints?.find(c => c.id === dependency.constraintId);
      return constraint?.kind === 'on';
    }
    return targetPoint?.constraint === 'glider' && targetPoint.gliderTarget === dependency.sourceId;
  }
  if (targetPoint) {
    return expressionUsesSource(targetPoint.xExpression, dependency.sourceId)
      || expressionUsesSource(targetPoint.yExpression, dependency.sourceId);
  }
  const targetSlider = spec.sliders.find(slider => slider.id === dependency.targetId);
  if (targetSlider) return expressionUsesSource(targetSlider.maxExpression, dependency.sourceId);
  const targetElement = spec.elements.find(element => element.id === dependency.targetId);
  if (!targetElement) return false;
  if (targetElement.kind === 'functionCurve') {
    return expressionUsesSource(targetElement.properties?.expression, dependency.sourceId);
  }
  if (targetElement.kind === 'parametricCurve') {
    return expressionUsesSource(targetElement.properties?.xExpression, dependency.sourceId)
      || expressionUsesSource(targetElement.properties?.yExpression, dependency.sourceId);
  }
  if (targetElement.kind === 'measureTicks') {
    return expressionUsesSource(targetElement.properties?.tickDistanceExpression, dependency.sourceId);
  }
  return false;
}

export function evaluateStepOverlayContent(overlay: DiagramStepOverlay, variables: Record<string, number>): string {
  const rendered = interpolateDiagramTemplate(overlay.content, variables, {
    expression: overlay.expression,
    precision: overlay.precision,
    unit: overlay.unit,
  });
  if (!overlay.expression) return rendered;
  try {
    const evaluated = evaluateMathExpression(overlay.expression, variables);
    const suffix = overlay.unit ? ` ${overlay.unit}` : '';
    const value = `${evaluated.toFixed(overlay.precision ?? 2)}${suffix}`;
    return rendered.split('{value}').join(value);
  } catch {
    return rendered.split('{value}').join('valor no definido');
  }
}

function compareSceneItemOrder(left: DiagramSceneItem, right: DiagramSceneItem): number {
  return left.order - right.order || left.id.localeCompare(right.id);
}

function buildSceneItemVisualRanks(spec: DiagramSceneBag): Map<string, number> {
  const ranks = new Map<string, number>();
  const itemsByLayer = new Map<string, DiagramSceneItem[]>();
  [...spec.points, ...spec.elements, ...spec.sliders].forEach(item => {
    const layerItems = itemsByLayer.get(item.layerId) ?? [];
    layerItems.push(item);
    itemsByLayer.set(item.layerId, layerItems);
  });
  itemsByLayer.forEach(layerItems => {
    layerItems.sort(compareSceneItemOrder).forEach((item, index) => ranks.set(item.id, index));
  });
  return ranks;
}

export function createScenePlan(input: DiagramSpecV2 | DiagramSpecV3, state: DiagramSceneState = {}): PlannedSceneItem[] {
  const spec = input.version === 3 ? prepareSceneSpec(input) : input;
  const highlighted = new Set(state.highlightedIds ?? []);
  const selected = new Set(state.selectedIds ?? []);
  const activeStep = state.activeStepId ? spec.steps.find(step => step.id === state.activeStepId) : undefined;
  const stepTargets = activeStep ? new Set(activeStep.visibleTargets) : null;
  const objectStates = activeStep?.objectStates ?? {};
  const layers = new Map(spec.layers.map(layer => [layer.id, layer]));
  const groups = new Map(spec.groups.map(group => [group.id, group]));
  const visualRanks = buildSceneItemVisualRanks(spec);

  return [...spec.points, ...spec.elements, ...spec.sliders]
    .map(item => {
      const objectState = objectStates[item.id];
      const layer = layers.get(item.layerId);
      const itemGroups = item.groupIds.map(id => groups.get(id)).filter(Boolean);
      const visible = layer?.visible !== false
        && itemGroups.every(group => group?.visible !== false)
        && (objectState?.visible ?? (item.visible && (!stepTargets || stepTargets.has(item.id))));
      const interactive = objectState?.interactive ?? true;
      const fixedPoint = 'constraint' in item && (item.fixed || item.constraint === 'fixed' || item.constraint === 'derived');
      const locked = !interactive || fixedPoint || item.locked || layer?.locked === true || itemGroups.some(group => group?.locked === true);
      const layerOrder = layer?.order ?? 0;
      const highlightedByGroup = itemGroups.some(group => group?.selection.highlightable !== false && highlighted.has(group?.id ?? ''));
      const selectedByGroup = itemGroups.some(group => group?.selection.highlightable !== false && selected.has(group?.id ?? ''));
      const appearance = resolveStepSceneAppearance(item, objectState);
      return {
        item,
        visible,
        locked,
        highlighted: highlighted.has(item.id) || highlightedByGroup,
        selected: selected.has(item.id) || selectedByGroup,
        stepEmphasis: objectState?.emphasis ?? 'none',
        stepEmphasisColor: objectState?.emphasisColor,
        color: appearance.color,
        label: appearance.label,
        stepShowLabel: appearance.stepShowLabel,
        stepDashed: appearance.stepDashed,
        style: appearance.style,
        interactive,
        stepValue: objectState?.value,
        layerOrder,
        visualOrder: layerOrder * 10_000 + (visualRanks.get(item.id) ?? 0),
      };
    })
    .sort((left, right) => left.visualOrder - right.visualOrder || left.item.id.localeCompare(right.item.id));
}

function creationDependencies(item: DiagramSceneItem): string[] {
  if ('constraint' in item) return [
    ...(item.constraint === 'glider' && item.gliderTarget ? [item.gliderTarget] : []),
    ...(item.dependencies ?? []),
  ];
  if ('kind' in item) return item.refs;
  return [];
}

export function createSceneConstructionPlan(spec: DiagramSpecV2 | DiagramSpecV3): PlannedSceneItem[] {
  const scene = createScenePlan(spec);
  const itemIds = new Set(scene.map(entry => entry.item.id));
  const bag = prepareSceneSpec(spec);
  const graphEdges = buildDependencyGraph(bag).edges.filter(dependency => dependencyDeterminesConstructionOrder(bag, dependency));
  const entries = new Map(scene.map(entry => [entry.item.id, entry]));
  const dependencies = new Map(scene.map(entry => [entry.item.id, new Set(
    creationDependencies(entry.item).filter(sourceId => itemIds.has(sourceId)),
  )]));
  graphEdges.forEach(edge => {
    if (!itemIds.has(edge.targetId) || !itemIds.has(edge.sourceId)) return;
    dependencies.get(edge.targetId)?.add(edge.sourceId);
  });

  const dependents = new Map<string, string[]>();
  dependencies.forEach((sourceIds, targetId) => sourceIds.forEach(sourceId => {
    dependents.set(sourceId, [...(dependents.get(sourceId) ?? []), targetId]);
  }));

  const remainingDependencies = new Map(
    [...dependencies].map(([targetId, sourceIds]) => [targetId, sourceIds.size]),
  );
  const ready = scene.filter(entry => remainingDependencies.get(entry.item.id) === 0);
  const ordered: PlannedSceneItem[] = [];
  const created = new Set<string>();
  for (let cursor = 0; cursor < ready.length; cursor += 1) {
    const entry = ready[cursor];
    ordered.push(entry);
    created.add(entry.item.id);
    dependents.get(entry.item.id)?.forEach(targetId => {
      const remaining = (remainingDependencies.get(targetId) ?? 1) - 1;
      remainingDependencies.set(targetId, remaining);
      if (remaining === 0) {
        const dependent = entries.get(targetId);
        if (dependent) ready.push(dependent);
      }
    });
  }

  // Los ciclos inválidos se conservan al final para que el renderer siga
  // ofreciendo un diagnóstico útil en vez de descartar objetos silenciosamente.
  return ordered.length === scene.length
    ? ordered
    : [...ordered, ...scene.filter(entry => !created.has(entry.item.id))];
}

export function buildDependencyGraph(spec: DiagramSceneBag): DiagramDependencyGraph {
  const edges: DiagramDependencyEdge[] = [];
  spec.points.forEach(point => {
    if (point.constraint === 'glider' && point.gliderTarget) edges.push({ sourceId: point.gliderTarget, targetId: point.id, relation: 'constraint' });
    point.dependencies?.forEach(sourceId => edges.push({ sourceId, targetId: point.id, relation: 'expression' }));
  });
  spec.elements.forEach(element => element.refs.forEach(sourceId => edges.push({ sourceId, targetId: element.id, relation: 'construction' })));
  (spec.constraints ?? []).forEach(constraint => {
    const targetId = constraint.refs[0];
    const sourceIds = constraint.kind === 'equalAngle' ? constraint.refs.slice(1, 4) : constraint.refs.slice(1);
    sourceIds.forEach(sourceId => edges.push({ sourceId, targetId, relation: 'constraint', constraintId: constraint.id }));
  });
  edges.push(...(spec.dependencies ?? []));
  const unique = new Map(edges.map(edge => [`${edge.sourceId}:${edge.targetId}:${edge.relation}:${edge.constraintId ?? ''}`, edge]));
  return {
    nodes: [...spec.points, ...spec.elements, ...spec.sliders].map(item => item.id),
    edges: [...unique.values()],
  };
}

export function sceneRevision(spec: DiagramSpecV2): string {
  return JSON.stringify({
    points: spec.points,
    elements: spec.elements,
    sliders: spec.sliders,
    layers: spec.layers.map(({ id, order }) => [id, order]),
    showLabels: spec.showLabels,
    constraints: spec.constraints,
    dependencies: spec.dependencies,
  });
}

/** Revisión sin campos de apilamiento: evita reiniciar el lienzo al reordenar o cambiar de capa. */
export function sceneGeometryRevision(spec: DiagramSpecV2): string {
  const stripStackFields = <T extends { order: number; layerId: string }>(item: T) => {
    const {...rest } = item;
    return rest;
  };
  return JSON.stringify({
    points: spec.points.map(stripStackFields),
    elements: spec.elements.map(stripStackFields),
    sliders: spec.sliders.map(stripStackFields),
    layers: spec.layers.map(({ id, label, visible, locked }) => ({ id, label, visible, locked })),
    showLabels: spec.showLabels,
    constraints: spec.constraints,
    dependencies: spec.dependencies,
  });
}

export function sceneStackRevision(spec: DiagramSpecV2): string {
  return JSON.stringify(createScenePlan(spec).map(entry => [entry.item.id, entry.item.layerId, entry.visualOrder]));
}

const itemLayerNumberCache = new Map<string, Map<string, number>>();

export function itemLayerNumber(spec: DiagramSpecV2, item: DiagramSceneItem): number {
  const revision = sceneRevision(spec);
  let lookup = itemLayerNumberCache.get(revision);
  if (!lookup) {
    const plan = createScenePlan(spec);
    lookup = new Map<string, number>();
    if (plan.length <= 1) {
      plan.forEach(entry => lookup!.set(entry.item.id, 10));
    } else {
      plan.forEach((entry, index) => {
        lookup!.set(entry.item.id, Math.round(index * 20 / (plan.length - 1)));
      });
    }
    itemLayerNumberCache.set(revision, lookup);
    if (itemLayerNumberCache.size > 32) {
      const oldest = itemLayerNumberCache.keys().next().value;
      if (oldest) itemLayerNumberCache.delete(oldest);
    }
  }
  return lookup.get(item.id) ?? 10;
}

export function isPointItem(item: DiagramSceneItem): item is DiagramPoint {
  return 'x' in item && 'constraint' in item && 'fixed' in item;
}
