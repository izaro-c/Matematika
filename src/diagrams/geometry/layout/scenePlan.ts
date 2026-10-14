import type {
  DiagramSceneState,
  DiagramStepOverlay,
} from '@/diagrams/model/schema/types';
import type { DiagramObject, DiagramSpec } from '@/diagrams/model/schema/v3';
import type {
  DiagramDependencyEdge,
  DiagramDependencyGraph,
  PlannedSceneItem,
} from '@/diagrams/geometry/layout/sceneTypes';
import { resolveStepSceneAppearance } from '@/diagrams/geometry/layout/sceneTypes';
import { evaluateMathExpression, extractMathExpressionIdentifiers } from '@/diagrams/model/expressions/expressions';
import { interpolateDiagramTemplate } from '@/diagrams/model/semantics/infoPanels';
import {
  findObject,
  isExpressionPoint,
  isPositionedPoint,
  pointGliderSupportId,
  pointIsImmovable,
  type PositionedPoint,
} from '@/diagrams/model/objects/queries';
import { diagramDependencies } from '@/diagrams/model/objects/references';
import { relationParticipants, sceneRelations } from '@/diagrams/model/objects/relations';
import { sceneReferences } from '@/diagrams/geometry/coordinates/sceneCoordinates';

/** Escena que necesita la planificación: objetos, relaciones, capas, grupos y pasos. */
export type DiagramPlanScene = Pick<DiagramSpec, 'objects' | 'relations' | 'layers' | 'groups' | 'steps'> & { componentId?: string };

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
  spec: Pick<DiagramSpec, 'objects' | 'relations'>,
  dependency: DiagramDependencyEdge,
): boolean {
  if (dependency.relation === 'construction') return true;
  const target = findObject(spec, dependency.targetId);
  if (dependency.relation === 'constraint') {
    if (dependency.constraintId) {
      const relation = spec.relations.find(item => item.id === dependency.constraintId);
      return relation?.type === 'on-support';
    }
    return isPositionedPoint(target) && pointGliderSupportId(target) === dependency.sourceId;
  }
  if (!target) return false;
  if (target.objectType === 'point') {
    return target.definition.type === 'expression'
      && (expressionUsesSource(target.definition.x, dependency.sourceId)
        || expressionUsesSource(target.definition.y, dependency.sourceId));
  }
  if (target.objectType === 'control') return expressionUsesSource(target.range.maxExpression, dependency.sourceId);
  if (target.objectType === 'path' && target.geometry.type === 'function') {
    return expressionUsesSource(target.geometry.expression, dependency.sourceId);
  }
  if (target.objectType === 'path' && target.geometry.type === 'parametric') {
    return expressionUsesSource(target.geometry.x, dependency.sourceId)
      || expressionUsesSource(target.geometry.y, dependency.sourceId);
  }
  if (target.objectType === 'mark' && target.variant === 'graduation') {
    return expressionUsesSource(target.spacingExpression, dependency.sourceId);
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

function compareSceneItemOrder(left: DiagramObject, right: DiagramObject): number {
  return left.order - right.order || left.id.localeCompare(right.id);
}

function buildSceneItemVisualRanks(spec: Pick<DiagramSpec, 'objects'>): Map<string, number> {
  const ranks = new Map<string, number>();
  const itemsByLayer = new Map<string, DiagramObject[]>();
  spec.objects.forEach(item => {
    const layerItems = itemsByLayer.get(item.layerId) ?? [];
    layerItems.push(item);
    itemsByLayer.set(item.layerId, layerItems);
  });
  itemsByLayer.forEach(layerItems => {
    layerItems.sort(compareSceneItemOrder).forEach((item, index) => ranks.set(item.id, index));
  });
  return ranks;
}

export function createScenePlan(spec: DiagramPlanScene, state: DiagramSceneState = {}): PlannedSceneItem[] {
  const highlighted = new Set(state.highlightedIds ?? []);
  const selected = new Set(state.selectedIds ?? []);
  const activeStep = state.activeStepId ? spec.steps.find(step => step.id === state.activeStepId) : undefined;
  const stepTargets = activeStep ? new Set(activeStep.visibleTargets) : null;
  const objectStates = activeStep?.objectStates ?? {};
  const layers = new Map(spec.layers.map(layer => [layer.id, layer]));
  const groups = new Map(spec.groups.map(group => [group.id, group]));
  const visualRanks = buildSceneItemVisualRanks(spec);

  const memberToGroups = new Map<string, Set<any>>();
  spec.groups.forEach(group => {
    group.memberIds?.forEach(memberId => {
      const set = memberToGroups.get(memberId) ?? new Set();
      set.add(group);
      memberToGroups.set(memberId, set);
    });
  });

  const isTargetHighlighted = (targetId: string | undefined) => {
    if (!targetId) return false;
    if (highlighted.has(targetId)) return true;
    if (spec.componentId) {
      if (highlighted.has(`${spec.componentId}:${targetId}`)) return true;
      if (highlighted.has(`${spec.componentId.toLowerCase()}:${targetId}`)) return true;
    }
    for (const h of highlighted) {
      if (typeof h === 'string' && (h === targetId || h.endsWith(`:${targetId}`))) {
        return true;
      }
    }
    return false;
  };

  const isTargetSelected = (targetId: string | undefined) => {
    if (!targetId) return false;
    if (selected.has(targetId)) return true;
    if (spec.componentId) {
      if (selected.has(`${spec.componentId}:${targetId}`)) return true;
      if (selected.has(`${spec.componentId.toLowerCase()}:${targetId}`)) return true;
    }
    for (const s of selected) {
      if (typeof s === 'string' && (s === targetId || s.endsWith(`:${targetId}`))) {
        return true;
      }
    }
    return false;
  };

  return spec.objects
    .map(item => {
      const objectState = objectStates[item.id];
      const layer = layers.get(item.layerId);
      const directGroups = item.groupIds.map(id => groups.get(id)).filter(Boolean);
      const indirectGroups = Array.from(memberToGroups.get(item.id) ?? []);
      const itemGroups = Array.from(new Set([...directGroups, ...indirectGroups]));
      const visible = layer?.visible !== false
        && itemGroups.every(group => group?.visible !== false)
        && (objectState?.visible ?? (item.visible && (!stepTargets || stepTargets.has(item.id))));
      const interactive = objectState?.interactive ?? true;
      const fixedPoint = isPositionedPoint(item) && pointIsImmovable(item);
      const locked = !interactive || fixedPoint || item.locked || layer?.locked === true || itemGroups.some(group => group?.locked === true);
      const layerOrder = layer?.order ?? 0;
      const highlightedByGroup = itemGroups.some(group => group?.selection.highlightable !== false && (isTargetHighlighted(group?.id) || isTargetHighlighted(group?.targetId)));
      const selectedByGroup = itemGroups.some(group => group?.selection.highlightable !== false && (isTargetSelected(group?.id) || isTargetSelected(group?.targetId)));
      const appearance = resolveStepSceneAppearance(item, objectState);
      return {
        item,
        visible,
        locked,
        highlighted: isTargetHighlighted(item.id) || isTargetHighlighted(item.targetId) || highlightedByGroup,
        selected: isTargetSelected(item.id) || isTargetSelected(item.targetId) || selectedByGroup,
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

function expressionPointDependencies(point: PositionedPoint, dependencies: readonly DiagramDependencyEdge[]): string[] {
  return dependencies.filter(edge => edge.targetId === point.id).map(edge => edge.sourceId);
}

function creationDependencies(
  spec: Pick<DiagramSpec, 'objects'>,
  item: DiagramObject,
  dependencies: readonly DiagramDependencyEdge[],
): string[] {
  if (isPositionedPoint(item)) {
    const glider = pointGliderSupportId(item);
    return [
      ...(glider ? [glider] : []),
      ...(isExpressionPoint(item) ? expressionPointDependencies(item, dependencies) : []),
    ];
  }
  if (item.objectType === 'control') return [];
  return sceneReferences(spec, item);
}

/** Orden de creación: cada objeto aparece después de los objetos de los que depende. */
export function createSceneConstructionPlan(spec: DiagramPlanScene): PlannedSceneItem[] {
  const scene = createScenePlan(spec);
  const itemIds = new Set(scene.map(entry => entry.item.id));
  const declared = diagramDependencies(spec.objects);
  const graphEdges = buildDependencyGraph(spec).edges.filter(dependency => dependencyDeterminesConstructionOrder(spec, dependency));
  const entries = new Map(scene.map(entry => [entry.item.id, entry]));
  const dependencies = new Map(scene.map(entry => [entry.item.id, new Set(
    creationDependencies(spec, entry.item, declared).filter(sourceId => itemIds.has(sourceId)),
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

export function buildDependencyGraph(spec: Pick<DiagramSpec, 'objects' | 'relations'>): DiagramDependencyGraph {
  const declared = diagramDependencies(spec.objects);
  const edges: DiagramDependencyEdge[] = [];
  spec.objects.forEach(object => {
    if (isPositionedPoint(object)) {
      const glider = pointGliderSupportId(object);
      if (glider) edges.push({ sourceId: glider, targetId: object.id, relation: 'constraint' });
      if (isExpressionPoint(object)) {
        expressionPointDependencies(object, declared).forEach(sourceId => edges.push({ sourceId, targetId: object.id, relation: 'expression' }));
      }
      return;
    }
    if (object.objectType === 'control') return;
    sceneReferences(spec, object).forEach(sourceId => edges.push({ sourceId, targetId: object.id, relation: 'construction' }));
  });
  sceneRelations(spec).forEach(relation => {
    const { target, sources } = relationParticipants(relation, spec.objects);
    if (!target) return;
    sources.forEach(sourceId => edges.push({ sourceId, targetId: target, relation: 'constraint', constraintId: relation.id }));
  });
  edges.push(...declared);
  const unique = new Map(edges.map(edge => [`${edge.sourceId}:${edge.targetId}:${edge.relation}:${edge.constraintId ?? ''}`, edge]));
  return {
    nodes: spec.objects.map(item => item.id),
    edges: [...unique.values()],
  };
}

type RevisionScene = Pick<DiagramSpec, 'objects' | 'relations' | 'layers' | 'showLabels'>;

export function sceneRevision(spec: RevisionScene): string {
  return JSON.stringify({
    objects: spec.objects,
    layers: spec.layers.map(({ id, order }) => [id, order]),
    showLabels: spec.showLabels,
    relations: spec.relations,
  });
}

/** Revisión geométrica del lienzo: cambia cuando hay que reconstruir los objetos JSXGraph. */
export function sceneGeometryRevision(spec: RevisionScene): string {
  return JSON.stringify({
    objects: spec.objects,
    layers: spec.layers.map(({ id, label, visible, locked }) => ({ id, label, visible, locked })),
    showLabels: spec.showLabels,
    relations: spec.relations,
  });
}

export function sceneStackRevision(spec: DiagramPlanScene): string {
  return JSON.stringify(createScenePlan(spec).map(entry => [entry.item.id, entry.item.layerId, entry.visualOrder]));
}

const itemLayerNumberCache = new Map<string, Map<string, number>>();

export function itemLayerNumber(spec: DiagramPlanScene & RevisionScene, item: DiagramObject): number {
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

/** Punto con posición propia (coordenadas o expresión). */
export function isPointItem(item: DiagramObject): item is PositionedPoint {
  return isPositionedPoint(item);
}
