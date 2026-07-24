import type {
  DiagramBounds,
  DiagramConstraint,
  DiagramColorToken,
  DiagramDependency,
  DiagramElement,
  DiagramPoint,
  DiagramSceneItem,
  DiagramSceneState,
  DiagramSpecV2,
  DiagramStepObjectState,
  DiagramStepOverlay,
  DiagramVisualStyle,
} from './types';
import type { DiagramSpecV3 } from './v3';
import { evaluateMathExpression, extractMathExpressionIdentifiers } from './expressions';
import { interpolateDiagramTemplate } from './infoPanels';
import { legacyElementCapabilities } from './semantics';
import { projectDiagramSpecV3ToV2 } from './v3Compatibility';
import {
  clampLinearParameterToHalfPlane,
  computeHalfPlaneSide,
  constrainToHalfPlaneWithSide,
  signedCross,
} from './areaGeometry';
import {
  constrainPointForAreaMembership,
} from './areaRegions';
import {
  clampCurveCoordinatesForBounds,
  sampleCurveFromSpec,
} from './curveGeometry';

export interface DiagramDependencyEdge {
  sourceId: string;
  targetId: string;
  relation: 'construction' | 'expression' | 'constraint';
  constraintId?: string;
}

export interface DiagramDependencyGraph {
  nodes: string[];
  edges: DiagramDependencyEdge[];
}

export interface PlannedSceneItem {
  item: DiagramSceneItem;
  visible: boolean;
  locked: boolean;
  highlighted: boolean;
  selected: boolean;
  stepEmphasis: 'none' | 'secondary' | 'primary';
  stepEmphasisColor?: DiagramColorToken;
  /** Color efectivo del objeto en el paso activo (base o temporal). */
  color: DiagramColorToken;
  label: string;
  interactive: boolean;
  stepValue?: number;
  stepShowLabel?: boolean;
  stepDashed?: boolean;
  /** Estilo efectivo tras fusionar el base con cualquier ajuste temporal del paso. */
  style: DiagramVisualStyle;
  layerOrder: number;
  visualOrder: number;
}

export function resolveStepSceneAppearance(
  item: DiagramSceneItem,
  objectState?: DiagramStepObjectState,
): Pick<PlannedSceneItem, 'color' | 'label' | 'stepShowLabel' | 'stepDashed' | 'style'> {
  return {
    color: objectState?.color ?? item.color,
    label: objectState?.label || item.label,
    stepShowLabel: objectState?.showLabel,
    stepDashed: objectState?.dashed,
    style: { ...item.style, ...objectState?.style },
  };
}

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
  spec: DiagramSpecV2,
  dependency: DiagramDependency,
): boolean {
  if (dependency.relation === 'construction') return true;
  const targetPoint = spec.points.find(point => point.id === dependency.targetId);
  if (dependency.relation === 'constraint') {
    return !targetPoint?.attractorIds?.includes(dependency.sourceId);
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

function resolveExpressionPoint(spec: DiagramSpecV2, point: DiagramPoint, visiting: Set<string>): Coordinates {
  const variables: Record<string, number> = {};
  for (const dependencyId of point.dependencies ?? []) {
    const coordinates = resolvePointCoordinates(spec, dependencyId, new Set(visiting));
    if (coordinates) {
      variables[`${dependencyId}.x`] = coordinates.x;
      variables[`${dependencyId}.y`] = coordinates.y;
    }
    const slider = spec.sliders.find(item => item.id === dependencyId);
    if (slider) variables[dependencyId] = slider.value;
  }
  try {
    return {
      x: evaluateMathExpression(point.xExpression!, variables),
      y: evaluateMathExpression(point.yExpression!, variables),
    };
  } catch {
    return { x: point.x, y: point.y };
  }
}

function resolveConstructedPoint(spec: DiagramSpecV2, derived: DiagramElement, visiting: Set<string>): Coordinates | undefined {
  if (derived.kind === 'intersection') {
    const first = linearSupportCarrier(spec, derived.refs[0], visiting);
    const second = linearSupportCarrier(spec, derived.refs[1], visiting);
    if (!first || !second) return undefined;
    const firstDx = first.b.x - first.a.x;
    const firstDy = first.b.y - first.a.y;
    const secondDx = second.b.x - second.a.x;
    const secondDy = second.b.y - second.a.y;
    const denominator = firstDx * secondDy - firstDy * secondDx;
    if (Math.abs(denominator) < 1e-10) return undefined;
    const offsetX = second.a.x - first.a.x;
    const offsetY = second.a.y - first.a.y;
    const parameter = (offsetX * secondDy - offsetY * secondDx) / denominator;
    return { x: first.a.x + parameter * firstDx, y: first.a.y + parameter * firstDy };
  }
  if (derived.kind === 'midpoint') {
    const a = resolvePointCoordinates(spec, derived.refs[0], visiting);
    const b = resolvePointCoordinates(spec, derived.refs[1], visiting);
    return a && b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : undefined;
  }
  if (derived.kind === 'perpendicularFoot') {
    const a = resolvePointCoordinates(spec, derived.refs[0], visiting);
    const b = resolvePointCoordinates(spec, derived.refs[1], visiting);
    const source = resolvePointCoordinates(spec, derived.refs[2], visiting);
    if (!a || !b || !source) return undefined;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lengthSquared = dx * dx + dy * dy || 1;
    const t = ((source.x - a.x) * dx + (source.y - a.y) * dy) / lengthSquared;
    return { x: a.x + dx * t, y: a.y + dy * t };
  }
  return undefined;
}

function resolveReflectedPoint(
  spec: DiagramSpecV2,
  direct: DiagramPoint,
  constraint: DiagramConstraint,
  visiting: Set<string>,
): Coordinates | undefined {
  const targetId = constraint.refs[0];
  const centerOrAxisId = constraint.refs[1];
  const sourceId = constraint.refs.length >= 3 ? constraint.refs[2] : targetId;

  let sourceCoords: Coordinates | undefined;
  if (sourceId === direct.id) {
    sourceCoords = { x: direct.x, y: direct.y };
  } else {
    sourceCoords = resolvePointCoordinates(spec, sourceId, visiting);
  }
  if (!sourceCoords) return undefined;

  const centerCoords = resolvePointCoordinates(spec, centerOrAxisId, visiting);
  if (centerCoords) {
    return {
      x: 2 * centerCoords.x - sourceCoords.x,
      y: 2 * centerCoords.y - sourceCoords.y,
    };
  }

  const carrier = linearSupportCarrier(spec, centerOrAxisId, visiting);
  if (carrier) {
    const dx = carrier.b.x - carrier.a.x;
    const dy = carrier.b.y - carrier.a.y;
    const lengthSquared = dx * dx + dy * dy || 1;
    const t = ((sourceCoords.x - carrier.a.x) * dx + (sourceCoords.y - carrier.a.y) * dy) / lengthSquared;
    const footX = carrier.a.x + t * dx;
    const footY = carrier.a.y + t * dy;
    return {
      x: 2 * footX - sourceCoords.x,
      y: 2 * footY - sourceCoords.y,
    };
  }

  return undefined;
}

export function resolvePointCoordinates(spec: DiagramSpecV2, id: string, visiting = new Set<string>()): Coordinates | undefined {
  const direct = spec.points.find(point => point.id === id);
  if (visiting.has(id)) return undefined;
  visiting.add(id);

  if (direct) {
    if (direct.constraint === 'constrained' && direct.constraintIds?.length) {
      const reflectionConstraint = spec.constraints?.find(c => (
        c.enabled
        && c.kind === 'reflection'
        && direct.constraintIds?.includes(c.id)
      ));
      if (reflectionConstraint) {
        const reflected = resolveReflectedPoint(spec, direct, reflectionConstraint, visiting);
        if (reflected) return reflected;
      }
    }
    if (direct.constraint === 'derived' && direct.xExpression && direct.yExpression) {
      return resolveExpressionPoint(spec, direct, visiting);
    }
    return { x: direct.x, y: direct.y };
  }

  const derived = spec.elements.find(element => element.id === id);
  return derived ? resolveConstructedPoint(spec, derived, visiting) : undefined;
}

function linearSupportCarrier(
  spec: DiagramSpecV2,
  id: string,
  visiting: Set<string>,
): { a: { x: number; y: number }; b: { x: number; y: number } } | undefined {
  const support = spec.elements.find(element => element.id === id);
  if (!support) return undefined;
  const first = resolvePointCoordinates(spec, support.refs[0], new Set(visiting));
  const second = resolvePointCoordinates(spec, support.refs[1], new Set(visiting));
  if (!first || !second) return undefined;
  if (support.kind === 'segment' || support.kind === 'line' || support.kind === 'ray') return { a: first, b: second };
  const through = resolvePointCoordinates(spec, support.refs[2], new Set(visiting));
  if (!through) return undefined;
  if (support.kind === 'parallel') {
    return { a: through, b: { x: through.x + second.x - first.x, y: through.y + second.y - first.y } };
  }
  if (support.kind === 'perpendicular') {
    return { a: through, b: { x: through.x - (second.y - first.y), y: through.y + second.x - first.x } };
  }
  if (support.kind === 'angleBisector') {
    const vertex = second;
    const firstDx = first.x - vertex.x;
    const firstDy = first.y - vertex.y;
    const secondDx = through.x - vertex.x;
    const secondDy = through.y - vertex.y;
    const firstLength = Math.hypot(firstDx, firstDy) || 1;
    const secondLength = Math.hypot(secondDx, secondDy) || 1;
    let directionX = firstDx / firstLength + secondDx / secondLength;
    let directionY = firstDy / firstLength + secondDy / secondLength;
    if (Math.hypot(directionX, directionY) < 1e-10) {
      directionX = -firstDy / firstLength;
      directionY = firstDx / firstLength;
    }
    return { a: vertex, b: { x: vertex.x + directionX, y: vertex.y + directionY } };
  }
  return undefined;
}

export function expressionVariables(spec: DiagramSpecV2): Record<string, number> {
  const variables: Record<string, number> = {};
  spec.points.forEach(point => {
    const coordinates = resolvePointCoordinates(spec, point.id);
    if (!coordinates) return;
    variables[`${point.id}.x`] = coordinates.x;
    variables[`${point.id}.y`] = coordinates.y;
  });
  spec.sliders.forEach(slider => {
    variables[slider.id] = slider.value;
  });
  spec.elements.forEach(element => {
    const coordinates = resolvePointCoordinates(spec, element.id);
    if (coordinates) {
      variables[`${element.id}.x`] = coordinates.x;
      variables[`${element.id}.y`] = coordinates.y;
    }
    if (element.refs.length >= 2) {
      const a = resolvePointCoordinates(spec, element.refs[0]);
      const b = resolvePointCoordinates(spec, element.refs[1]);
      if (a && b) variables[`${element.id}.length`] = Math.hypot(b.x - a.x, b.y - a.y);
    }
    if ((element.kind === 'angle' || element.kind === 'nonReflexAngle') && element.refs.length >= 3) {
      const first = resolvePointCoordinates(spec, element.refs[0]);
      const vertex = resolvePointCoordinates(spec, element.refs[1]);
      const second = resolvePointCoordinates(spec, element.refs[2]);
      const radians = first && vertex && second
        ? angleMeasureRadians(element.kind, first, vertex, second)
        : undefined;
      if (radians !== undefined) {
        variables[`${element.id}.value`] = radians;
        variables[`${element.id}.radians`] = radians;
        variables[`${element.id}.degrees`] = radians * 180 / Math.PI;
      }
    }
  });
  return variables;
}

/**
 * Mide los dos objetos angulares editables con la misma convención que el
 * renderer: el ángulo orientado pertenece a [0, 2π) y el no reflejo a [0, π].
 */
export function angleMeasureRadians(
  kind: 'angle' | 'nonReflexAngle',
  first: { x: number; y: number },
  vertex: { x: number; y: number },
  second: { x: number; y: number },
): number | undefined {
  const firstDx = first.x - vertex.x;
  const firstDy = first.y - vertex.y;
  const secondDx = second.x - vertex.x;
  const secondDy = second.y - vertex.y;
  const firstLength = Math.hypot(firstDx, firstDy);
  const secondLength = Math.hypot(secondDx, secondDy);
  if (firstLength < 1e-10 || secondLength < 1e-10) return undefined;
  const dot = firstDx * secondDx + firstDy * secondDy;
  if (kind === 'nonReflexAngle') {
    const cosine = Math.max(-1, Math.min(1, dot / (firstLength * secondLength)));
    return Math.acos(cosine);
  }
  const oriented = Math.atan2(firstDx * secondDy - firstDy * secondDx, dot);
  return oriented < 0 ? oriented + Math.PI * 2 : oriented;
}

export function supportElements(spec: DiagramSpecV2): DiagramElement[] {
  return spec.elements.filter(item => legacyElementCapabilities(item.kind).has('support'));
}

function projectToCircle(spec: DiagramSpecV2, support: DiagramElement, coordinates: Coordinates): Coordinates {
  const center = resolvePointCoordinates(spec, support.refs[0]);
  const edge = resolvePointCoordinates(spec, support.refs[1]);
  if (!center || !edge) return coordinates;
  const radius = Math.hypot(edge.x - center.x, edge.y - center.y) || 1;
  const dx = coordinates.x - center.x;
  const dy = coordinates.y - center.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: center.x + (dx / length) * radius, y: center.y + (dy / length) * radius };
}

function angleBisectorDirection(a: Coordinates, vertex: Coordinates, other: Coordinates | undefined): Coordinates | undefined {
  if (!other) return undefined;
  const ux = a.x - vertex.x;
  const uy = a.y - vertex.y;
  const wx = other.x - vertex.x;
  const wy = other.y - vertex.y;
  const uLength = Math.hypot(ux, uy) || 1;
  const wLength = Math.hypot(wx, wy) || 1;
  const sumX = ux / uLength + wx / wLength;
  const sumY = uy / uLength + wy / wLength;
  const sumLength = Math.hypot(sumX, sumY);
  return sumLength < 1e-6
    ? { x: -uy / uLength, y: ux / uLength }
    : { x: sumX / sumLength, y: sumY / sumLength };
}

function linearProjectionDirection(support: DiagramElement, a: Coordinates, b: Coordinates, through: Coordinates | undefined): Coordinates {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (support.kind === 'angleBisector') return angleBisectorDirection(a, b, through) ?? { x: dx, y: dy };
  if (support.kind === 'perpendicular') return { x: -dy, y: dx };
  return { x: dx, y: dy };
}

function activePointConstraints(spec: DiagramSpecV2, point: DiagramPoint): DiagramConstraint[] {
  return (point.constraintIds ?? [])
    .map(constraintId => (spec.constraints ?? []).find(item => item.id === constraintId && item.enabled))
    .filter((constraint): constraint is DiagramConstraint => Boolean(constraint));
}

/** Soporte de deslizamiento: `glider` directo o relación `on` en relaciones combinadas. */
export function onSupportTargetId(spec: DiagramSpecV2, point: DiagramPoint): string | undefined {
  if (point.constraint === 'glider' && point.gliderTarget) return point.gliderTarget;
  if (point.constraint === 'constrained') {
    const on = activePointConstraints(spec, point).find(constraint => (
      constraint.kind === 'on' && constraint.refs[0] === point.id
    ));
    if (on) return on.refs[1];
  }
  return undefined;
}

/** Punto cuya posición en el soporte mantiene JSXGraph sin re-resolución pasiva. */
function isJsxgraphOnSupportPoint(spec: DiagramSpecV2, point: DiagramPoint): boolean {
  if (!onSupportTargetId(spec, point)) return false;
  if (point.constraint === 'glider') return true;
  return point.constraint === 'constrained' && activePointConstraints(spec, point).length === 1;
}

function asGliderPoint(point: DiagramPoint, supportId: string): DiagramPoint {
  return { ...point, constraint: 'glider', gliderTarget: supportId };
}

export function projectPointToSupport(
  spec: DiagramSpecV2,
  point: DiagramPoint,
  coordinates: { x: number; y: number },
): { x: number; y: number } {
  if (!point.gliderTarget) return coordinates;
  const support = spec.elements.find(item => item.id === point.gliderTarget);
  if (!support) return coordinates;

  if (support.kind === 'circle') return projectToCircle(spec, support, coordinates);

  const a = resolvePointCoordinates(spec, support.refs[0]);
  const b = resolvePointCoordinates(spec, support.refs[1]);
  const through = resolvePointCoordinates(spec, support.refs[2]);
  const lineA = support.kind === 'perpendicular' || support.kind === 'parallel' ? through : a;
  if (!lineA || !a || !b) return coordinates;

  const angleVertex = support.kind === 'angleBisector' ? b : undefined;
  const direction = linearProjectionDirection(support, a, b, through);
  const origin = support.kind === 'angleBisector' && angleVertex ? angleVertex : lineA;
  const lengthSquared = direction.x * direction.x + direction.y * direction.y || 1;
  const t = ((coordinates.x - origin.x) * direction.x + (coordinates.y - origin.y) * direction.y) / lengthSquared;
  const projectedT = support.kind === 'ray' || support.kind === 'angleBisector' ? Math.max(0, t) : t;
  return { x: origin.x + direction.x * projectedT, y: origin.y + direction.y * projectedT };
}

function compareSceneItemOrder(left: DiagramSceneItem, right: DiagramSceneItem): number {
  return left.order - right.order || left.id.localeCompare(right.id);
}

function buildSceneItemVisualRanks(spec: DiagramSpecV2): Map<string, number> {
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

export function createScenePlan(spec: DiagramSpecV2, state: DiagramSceneState = {}): PlannedSceneItem[] {
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

export function createSceneConstructionPlan(spec: DiagramSpecV2): PlannedSceneItem[] {
  const scene = createScenePlan(spec);
  const itemIds = new Set(scene.map(entry => entry.item.id));
  const graphEdges = buildDependencyGraph(spec).edges.filter(dependency => dependencyDeterminesConstructionOrder(spec, dependency));
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

function boundsFromCoordinates(coordinates: Array<{ x: number; y: number }>): DiagramBounds | null {
  if (coordinates.length === 0) return null;
  const xs = coordinates.map(point => point.x);
  const ys = coordinates.map(point => point.y);
  return [Math.min(...xs), Math.max(...ys), Math.max(...xs), Math.min(...ys)];
}

function curveCoordinates(spec: DiagramSpecV2, element: DiagramElement): Coordinates[] {
  const samples = sampleCurveFromSpec(spec, element);
  return clampCurveCoordinatesForBounds(samples, spec.viewport.home);
}

function elementCoordinates(spec: DiagramSpecV2, element: DiagramElement): Array<{ x: number; y: number }> {
  if (element.kind === 'intersection') {
    const intersection = resolvePointCoordinates(spec, element.id);
    return intersection ? [intersection] : [];
  }
  const refs = element.refs.map(ref => resolvePointCoordinates(spec, ref)).filter((point): point is { x: number; y: number } => Boolean(point));
  if ((element.kind === 'functionCurve' || element.kind === 'parametricCurve') && element.properties?.domain) {
    return curveCoordinates(spec, element);
  }
  if (element.kind !== 'circle' || refs.length < 2) return refs;
  const [center, edge] = refs;
  const radius = Math.hypot(edge.x - center.x, edge.y - center.y);
  return [
    { x: center.x - radius, y: center.y - radius },
    { x: center.x + radius, y: center.y + radius },
  ];
}

export function contentBounds(spec: DiagramSpecV2, itemIds?: readonly string[]): DiagramBounds | null {
  const filter = itemIds ? new Set(itemIds) : null;
  const coordinates: Array<{ x: number; y: number }> = [];
  spec.points.forEach(point => {
    if (!filter || filter.has(point.id)) coordinates.push({ x: point.x, y: point.y });
  });
  spec.elements.forEach(element => {
    if (!filter || filter.has(element.id)) coordinates.push(...elementCoordinates(spec, element));
  });
  spec.sliders.forEach(slider => {
    if (!filter || filter.has(slider.id)) coordinates.push({ x: slider.x, y: slider.y }, { x: slider.x + 2.6, y: slider.y });
  });
  return boundsFromCoordinates(coordinates);
}

export function padBounds(bounds: DiagramBounds, padding: number): DiagramBounds {
  const [left, top, right, bottom] = bounds;
  const width = Math.max(right - left, 1);
  const height = Math.max(top - bottom, 1);
  return [left - width * padding, top + height * padding, right + width * padding, bottom - height * padding];
}

export function fitViewport(
  spec: DiagramSpecV2,
  itemIds?: readonly string[],
  padding = spec.viewport.padding,
): DiagramBounds {
  const bounds = contentBounds(spec, itemIds);
  return bounds ? padBounds(bounds, padding) : spec.viewport.home;
}

export function zoomViewport(spec: DiagramSpecV2, bounds: DiagramBounds, factor: number): DiagramBounds {
  const [left, top, right, bottom] = bounds;
  const centerX = (left + right) / 2;
  const centerY = (top + bottom) / 2;
  const homeWidth = spec.viewport.home[2] - spec.viewport.home[0];
  const currentWidth = right - left;
  const currentZoom = homeWidth / currentWidth;
  const nextZoom = Math.min(spec.viewport.maxZoom, Math.max(spec.viewport.minZoom, currentZoom * factor));
  const width = homeWidth / nextZoom;
  const aspect = (top - bottom) / Math.max(currentWidth, Number.EPSILON);
  const height = width * aspect;
  return [centerX - width / 2, centerY + height / 2, centerX + width / 2, centerY - height / 2];
}

export function panViewport(bounds: DiagramBounds, deltaX: number, deltaY: number): DiagramBounds {
  return [bounds[0] + deltaX, bounds[1] + deltaY, bounds[2] + deltaX, bounds[3] + deltaY];
}

export function boundsContain(container: DiagramBounds, contained: DiagramBounds): boolean {
  return contained[0] >= container[0]
    && contained[2] <= container[2]
    && contained[1] <= container[1]
    && contained[3] >= container[3];
}

export function offscreenItemIds(spec: DiagramSpecV2, bounds = spec.viewport.bounds): string[] {
  return [...spec.points, ...spec.elements, ...spec.sliders]
    .filter(item => {
      const itemBounds = contentBounds(spec, [item.id]);
      return itemBounds ? !boundsContain(bounds, itemBounds) : false;
    })
    .map(item => item.id);
}

export function recoverViewport(spec: DiagramSpecV2, selectedIds: readonly string[] = []): DiagramBounds {
  const selectedBounds = selectedIds.length > 0 ? contentBounds(spec, selectedIds) : null;
  if (selectedBounds && !boundsContain(spec.viewport.bounds, selectedBounds)) {
    return padBounds(selectedBounds, spec.viewport.padding);
  }
  const offscreen = offscreenItemIds(spec);
  return offscreen.length > 0 ? fitViewport(spec) : spec.viewport.bounds;
}

export function withViewportBounds(spec: DiagramSpecV2, bounds: DiagramBounds): DiagramSpecV2 {
  return { ...spec, viewport: { ...spec.viewport, bounds } };
}

/**
 * Rellena `constraint.side` en restricciones `sameSide` que aún no lo tienen.
 * El signo se congela en la geometría actual para que el semiplano sea
 * invariante cuando se mueven los puntos de frontera.
 */
export function materializeSameSideConstraints(spec: DiagramSpecV2): DiagramSpecV2 {
  if (!spec.constraints?.some(constraint => constraint.kind === 'sameSide' && constraint.side === undefined)) {
    return spec;
  }
  const constraints = spec.constraints.map(constraint => {
    if (constraint.kind !== 'sameSide' || constraint.side !== undefined || constraint.refs.length < 3) {
      return constraint;
    }
    const sidePoint = resolvePointCoordinates(spec, constraint.refs[0]);
    const lineA = resolvePointCoordinates(spec, constraint.refs[1]);
    const lineB = resolvePointCoordinates(spec, constraint.refs[2]);
    if (!sidePoint || !lineA || !lineB) return constraint;
    return { ...constraint, side: computeHalfPlaneSide(lineA, lineB, sidePoint) };
  });
  return { ...spec, constraints };
}

export function withMovedPoint(inputSpec: DiagramSpecV2 | DiagramSpecV3, pointId: string, x: number, y: number): DiagramSpecV2 {
  const spec = materializeSameSideConstraints(
    inputSpec.version === 3 ? projectDiagramSpecV3ToV2(inputSpec) : inputSpec,
  );
  const point = spec.points.find(item => item.id === pointId);
  if (!point || point.fixed || point.constraint === 'fixed' || point.constraint === 'derived') return spec;
  const constrained = constrainPointCoordinates(spec, point, { x, y });
  const moved = {
    ...spec,
    points: spec.points.map(item => item.id === pointId ? { ...item, ...constrained } : item),
  };
  return withResolvedPointConstraints(moved, { skipPointIds: [pointId] });
}

type Coordinates = { x: number; y: number };

function applyDistanceConstraint(spec: DiagramSpecV2, result: Coordinates, other: Coordinates, constraint: DiagramConstraint): Coordinates {
  const variables = expressionVariables(spec);
  const distance = constraint.value ?? (constraint.expression ? evaluateMathExpression(constraint.expression, variables) : 0);
  const dx = result.x - other.x;
  const dy = result.y - other.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: other.x + dx / length * distance, y: other.y + dy / length * distance };
}

function applyEqualLengthConstraint(spec: DiagramSpecV2, point: DiagramPoint, result: Coordinates, constraint: DiagramConstraint): Coordinates {
  if (constraint.refs.length < 3) return result;
  const anchor = resolvePointCoordinates(spec, constraint.refs[1]);
  const sourceSegment = spec.elements.find(element => element.id === constraint.refs[2] && element.kind === 'segment');
  const sourceA = sourceSegment ? resolvePointCoordinates(spec, sourceSegment.refs[0]) : undefined;
  const sourceB = sourceSegment ? resolvePointCoordinates(spec, sourceSegment.refs[1]) : undefined;
  if (!anchor || !sourceA || !sourceB) return result;
  const desiredLength = Math.hypot(sourceB.x - sourceA.x, sourceB.y - sourceA.y);
  const requestedDx = result.x - anchor.x;
  const requestedDy = result.y - anchor.y;
  const previousDx = point.x - anchor.x;
  const previousDy = point.y - anchor.y;
  const directionLength = Math.hypot(requestedDx, requestedDy);
  const fallbackLength = Math.hypot(previousDx, previousDy) || 1;
  const directionX = directionLength > 1e-10 ? requestedDx / directionLength : previousDx / fallbackLength;
  const directionY = directionLength > 1e-10 ? requestedDy / directionLength : previousDy / fallbackLength;
  return { x: anchor.x + directionX * desiredLength, y: anchor.y + directionY * desiredLength };
}

function applyEqualAngleConstraint(spec: DiagramSpecV2, point: DiagramPoint, result: Coordinates, constraint: DiagramConstraint): Coordinates {
  if (constraint.refs.length < 5) return result;
  const vertex = resolvePointCoordinates(spec, constraint.refs[1]);
  const fixedRayPoint = resolvePointCoordinates(spec, constraint.refs[2]);
  const sourceAngle = spec.elements.find(element => element.id === constraint.refs[3]);
  const targetAngle = spec.elements.find(element => element.id === constraint.refs[4]);
  const desiredAngle = sourceAngle ? angleMagnitude(spec, sourceAngle) : undefined;
  if (!vertex || !fixedRayPoint || !targetAngle || desiredAngle === undefined) return result;
  const fixedDx = fixedRayPoint.x - vertex.x;
  const fixedDy = fixedRayPoint.y - vertex.y;
  const fixedLength = Math.hypot(fixedDx, fixedDy);
  if (fixedLength < 1e-10) return result;
  const requestedDx = result.x - vertex.x;
  const requestedDy = result.y - vertex.y;
  const previousDx = point.x - vertex.x;
  const previousDy = point.y - vertex.y;
  const requestedLength = Math.hypot(requestedDx, requestedDy);
  const radius = requestedLength > 1e-10 ? requestedLength : Math.hypot(previousDx, previousDy);
  if (radius < 1e-10) return result;
  const fixedDirection = { x: fixedDx / fixedLength, y: fixedDy / fixedLength };
  const orientedRotation = targetAngle.refs[0] === point.id ? -desiredAngle : desiredAngle;
  let direction = rotateUnit(fixedDirection, orientedRotation);
  if (targetAngle.kind === 'nonReflexAngle') {
    const alternate = rotateUnit(fixedDirection, -orientedRotation);
    const requestedDirection = requestedLength > 1e-10
      ? { x: requestedDx / requestedLength, y: requestedDy / requestedLength }
      : { x: previousDx / radius, y: previousDy / radius };
    if (dot(alternate, requestedDirection) > dot(direction, requestedDirection)) direction = alternate;
  }
  return { x: vertex.x + direction.x * radius, y: vertex.y + direction.y * radius };
}

function applyMidpointConstraint(spec: DiagramSpecV2, result: Coordinates, constraint: DiagramConstraint): Coordinates {
  if (constraint.refs.length < 3) return result;
  const first = resolvePointCoordinates(spec, constraint.refs[1]);
  const second = resolvePointCoordinates(spec, constraint.refs[2]);
  return first && second ? { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 } : result;
}

function applyInsideDiskConstraint(spec: DiagramSpecV2, result: Coordinates, constraint: DiagramConstraint): Coordinates {
  if (constraint.refs.length < 3) return result;
  const center = resolvePointCoordinates(spec, constraint.refs[1]);
  const boundary = resolvePointCoordinates(spec, constraint.refs[2]);
  if (!center || !boundary) return result;
  const radius = Math.hypot(boundary.x - center.x, boundary.y - center.y) * 0.999;
  const dx = result.x - center.x;
  const dy = result.y - center.y;
  const length = Math.hypot(dx, dy);
  return length > radius ? { x: center.x + dx / length * radius, y: center.y + dy / length * radius } : result;
}

function linearSupportFrame(
  spec: DiagramSpecV2,
  support: DiagramElement,
): { origin: Coordinates; direction: Coordinates; minParameter: number } | undefined {
  const a = resolvePointCoordinates(spec, support.refs[0]);
  const b = resolvePointCoordinates(spec, support.refs[1]);
  const through = resolvePointCoordinates(spec, support.refs[2]);
  const lineA = support.kind === 'perpendicular' || support.kind === 'parallel' ? through : a;
  if (!lineA || !a || !b) return undefined;
  const direction = linearProjectionDirection(support, a, b, through);
  const origin = support.kind === 'angleBisector' ? b : lineA;
  const minParameter = support.kind === 'ray' || support.kind === 'angleBisector' ? 0 : -Infinity;
  return { origin, direction, minParameter };
}

function parameterOnLinearSupport(
  frame: { origin: Coordinates; direction: Coordinates },
  support: DiagramElement,
  coordinates: Coordinates,
): number {
  const lengthSquared = frame.direction.x * frame.direction.x + frame.direction.y * frame.direction.y || 1;
  const t = ((coordinates.x - frame.origin.x) * frame.direction.x + (coordinates.y - frame.origin.y) * frame.direction.y) / lengthSquared;
  if (support.kind === 'ray' || support.kind === 'angleBisector') return Math.max(0, t);
  return t;
}

function pointAtLinearSupportParameter(
  frame: { origin: Coordinates; direction: Coordinates },
  parameter: number,
): Coordinates {
  return {
    x: frame.origin.x + parameter * frame.direction.x,
    y: frame.origin.y + parameter * frame.direction.y,
  };
}

function normalizedLerp(a: Coordinates, b: Coordinates, t: number): Coordinates {
  const x = a.x + (b.x - a.x) * t;
  const y = a.y + (b.y - a.y) * t;
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}

const LINE_CARRIER_EPSILON = 1e-6;
const MAX_LINEAR_PROJECTION_STEP_ANGLE = Math.PI / 36; // ~5°

/**
 * Proyección estable de `position` sobre la recta que pasa por `origin` con
 * dirección `targetDirection`. Subdivide giros grandes en pasos pequeños para
 * evitar inversiones de signo y disparos de parámetro cuando el portador gira
 * mucho en un solo fotograma. Compartida por restricciones `parallel`/`perpendicular`.
 */
function stabilizedProjectionOnDirection(
  origin: Coordinates,
  targetDirection: Coordinates,
  position: Coordinates,
): Coordinates {
  const targetLengthSquared = targetDirection.x * targetDirection.x + targetDirection.y * targetDirection.y;
  const targetLength = Math.sqrt(targetLengthSquared);
  const previousVector = { x: position.x - origin.x, y: position.y - origin.y };
  const previousLength = Math.hypot(previousVector.x, previousVector.y);

  if (targetLength < LINE_CARRIER_EPSILON) {
    if (previousLength < LINE_CARRIER_EPSILON) return position;
    return { x: origin.x + previousVector.x, y: origin.y + previousVector.y };
  }

  if (previousLength < LINE_CARRIER_EPSILON) {
    return {
      x: origin.x + targetDirection.x / targetLength,
      y: origin.y + targetDirection.y / targetLength,
    };
  }

  const previousUnit = { x: previousVector.x / previousLength, y: previousVector.y / previousLength };
  const targetUnit = { x: targetDirection.x / targetLength, y: targetDirection.y / targetLength };
  const cosAngle = Math.max(-1, Math.min(1, previousUnit.x * targetUnit.x + previousUnit.y * targetUnit.y));
  const angle = Math.acos(cosAngle);
  const steps = Math.max(1, Math.ceil(angle / MAX_LINEAR_PROJECTION_STEP_ANGLE));

  let currentVector = previousVector;
  for (let step = 1; step <= steps; step += 1) {
    const stepUnit = step === steps ? targetUnit : normalizedLerp(previousUnit, targetUnit, step / steps);
    const stepDirection = { x: stepUnit.x * targetLength, y: stepUnit.y * targetLength };
    const amount = (currentVector.x * stepDirection.x + currentVector.y * stepDirection.y) / targetLengthSquared;
    currentVector = { x: amount * stepDirection.x, y: amount * stepDirection.y };
  }

  return { x: origin.x + currentVector.x, y: origin.y + currentVector.y };
}

function isPointInPersistedHalfPlane(
  lineA: Coordinates,
  lineB: Coordinates,
  side: 1 | -1,
  coordinates: Coordinates,
): boolean {
  return signedCross(lineA, lineB, coordinates) * side >= -1e-8;
}

/**
 * `sameSide` sobre un soporte lineal: el semiplano 2D solo puede mover el punto
 * a lo largo del soporte (no puede sacarlo del rayo/recta).
 * Si el arrastre pediría salir y el punto ya está dentro, se mantiene (como
 * `sameSide` solo impide cruzar).
 */
function clampOnSupportToSameSide(
  spec: DiagramSpecV2,
  supportId: string,
  sameSideConstraint: DiagramConstraint,
  point: DiagramPoint,
  onSupport: Coordinates,
): Coordinates {
  const support = spec.elements.find(element => element.id === supportId);
  if (!support) return onSupport;
  const frame = linearSupportFrame(spec, support);
  if (!frame) return onSupport;
  const baseA = resolvePointCoordinates(spec, sameSideConstraint.refs[1]);
  const baseB = resolvePointCoordinates(spec, sameSideConstraint.refs[2]);
  if (!baseA || !baseB) return onSupport;
  const side: 1 | -1 = sameSideConstraint.side ?? computeHalfPlaneSide(baseA, baseB, point);
  if (isPointInPersistedHalfPlane(baseA, baseB, side, onSupport)) return onSupport;
  if (isPointInPersistedHalfPlane(baseA, baseB, side, point)) {
    return projectPointToSupport(spec, asGliderPoint(point, supportId), point);
  }
  const requested = parameterOnLinearSupport(frame, support, onSupport);
  const bounded = frame.minParameter === -Infinity ? requested : Math.max(frame.minParameter, requested);
  return pointAtLinearSupportParameter(frame, clampLinearParameterToHalfPlane(
    frame.origin,
    frame.direction,
    baseA,
    baseB,
    side,
    bounded,
    frame.minParameter,
  ));
}

function sameSideAllowsPoint(
  spec: DiagramSpecV2,
  point: DiagramPoint,
  sameSideConstraint: DiagramConstraint,
  coordinates: Coordinates,
): boolean {
  const baseA = resolvePointCoordinates(spec, sameSideConstraint.refs[1]);
  const baseB = resolvePointCoordinates(spec, sameSideConstraint.refs[2]);
  if (!baseA || !baseB) return true;
  const side: 1 | -1 = sameSideConstraint.side ?? computeHalfPlaneSide(baseA, baseB, point);
  return isPointInPersistedHalfPlane(baseA, baseB, side, coordinates);
}

function applySameSideConstraint(spec: DiagramSpecV2, point: DiagramPoint, result: Coordinates, constraint: DiagramConstraint): Coordinates {
  if (constraint.refs.length < 3) return result;
  const baseA = resolvePointCoordinates(spec, constraint.refs[1]);
  const baseB = resolvePointCoordinates(spec, constraint.refs[2]);
  if (!baseA || !baseB) return result;

  // `constraint.side` se materializa al cargar o al primer movimiento. El
  // fallback desde la posición confirmada del punto solo cubre specs
  // legadas durante el arrastre del punto restringido.
  const side: 1 | -1 = constraint.side
    ?? computeHalfPlaneSide(baseA, baseB, point);

  return constrainToHalfPlaneWithSide(baseA, baseB, side, result);
}

function applyInsideAreaConstraint(spec: DiagramSpecV2, result: Coordinates, constraint: DiagramConstraint): Coordinates {
  if (constraint.refs.length < 2) return result;
  const area = spec.elements.find(element => element.id === constraint.refs[1]);
  if (!area) return result;
  const resolver = (model: DiagramSpecV2, id: string) => resolvePointCoordinates(model, id);
  return constrainPointForAreaMembership(spec, area, result, constraint.areaMembership ?? 'interior', resolver);
}

function applyLinearConstraint(spec: DiagramSpecV2, result: Coordinates, constraint: DiagramConstraint): Coordinates {
  if (constraint.refs.length < 3) return result;
  const baseA = resolvePointCoordinates(spec, constraint.refs[1]);
  const baseB = resolvePointCoordinates(spec, constraint.refs[2]);
  const origin = constraint.refs[3] ? resolvePointCoordinates(spec, constraint.refs[3]) : baseA;
  if (!baseA || !baseB || !origin) return result;
  const dx = baseB.x - baseA.x;
  const dy = baseB.y - baseA.y;
  const targetDirection = constraint.kind === 'perpendicular' ? { x: -dy, y: dx } : { x: dx, y: dy };
  return stabilizedProjectionOnDirection(origin, targetDirection, result);
}

function applyConstraint(spec: DiagramSpecV2, point: DiagramPoint, result: Coordinates, constraint: DiagramConstraint): Coordinates {
  const otherId = constraint.refs.find(ref => ref !== point.id);
  const other = otherId ? resolvePointCoordinates(spec, otherId) : undefined;
  switch (constraint.kind) {
    case 'fixed': return { x: point.x, y: point.y };
    case 'horizontal': return other ? { x: result.x, y: other.y } : result;
    case 'vertical': return other ? { x: other.x, y: result.y } : result;
    case 'coincident': return other ?? result;
    case 'on': return otherId ? projectPointToSupport(spec, { ...point, constraint: 'glider', gliderTarget: otherId }, result) : result;
    case 'distance': return other ? applyDistanceConstraint(spec, result, other, constraint) : result;
    case 'equalLength': return applyEqualLengthConstraint(spec, point, result, constraint);
    case 'equalAngle': return applyEqualAngleConstraint(spec, point, result, constraint);
    case 'midpoint': return applyMidpointConstraint(spec, result, constraint);
    case 'insideDisk': return applyInsideDiskConstraint(spec, result, constraint);
    case 'sameSide': return applySameSideConstraint(spec, point, result, constraint);
    case 'insideArea': return applyInsideAreaConstraint(spec, result, constraint);
    case 'reflection': return resolveReflectedPoint(spec, point, constraint, new Set()) ?? result;
    case 'perpendicular': case 'parallel': return applyLinearConstraint(spec, result, constraint);
    default: return result;
  }
}

export function constrainPointCoordinates(
  spec: DiagramSpecV2,
  point: DiagramPoint,
  coordinates: { x: number; y: number },
): { x: number; y: number } {
  const supportId = onSupportTargetId(spec, point);
  if (supportId && isJsxgraphOnSupportPoint(spec, point)) {
    return projectPointToSupport(spec, asGliderPoint(point, supportId), coordinates);
  }
  if (point.constraint === 'horizontal') return { x: coordinates.x, y: point.y };
  if (point.constraint === 'vertical') return { x: point.x, y: coordinates.y };
  const activeConstraints = activePointConstraints(spec, point);
  const onConstraint = activeConstraints.find(constraint => constraint.kind === 'on' && constraint.refs[0] === point.id);
  const sameSideConstraint = activeConstraints.find(constraint => constraint.kind === 'sameSide' && constraint.refs[0] === point.id);
  // Composición: `on` (como solo) y después `sameSide` a lo largo del soporte.
  if (onConstraint && sameSideConstraint) {
    let result = projectPointToSupport(spec, asGliderPoint(point, onConstraint.refs[1]), coordinates);
    result = clampOnSupportToSameSide(spec, onConstraint.refs[1], sameSideConstraint, point, result);
    for (const constraint of activeConstraints) {
      if (constraint.kind === 'on' || constraint.kind === 'sameSide') continue;
      result = applyConstraint(spec, point, result, constraint);
    }
    return result;
  }
  const equalLengthConstraint = activeConstraints.find(constraint => constraint.kind === 'equalLength' && constraint.refs[0] === point.id);
  const exactSupportLength = onConstraint && equalLengthConstraint
    ? pointOnLinearSupportAtEqualLength(spec, point, coordinates, onConstraint.refs[1], equalLengthConstraint)
    : undefined;
  let result = coordinates;
  if (exactSupportLength) result = exactSupportLength;
  for (const constraint of activeConstraints) {
    if (exactSupportLength && (constraint.id === onConstraint?.id || constraint.id === equalLengthConstraint?.id)) continue;
    result = applyConstraint(spec, point, result, constraint);
  }
  return result;
}

function angleMagnitude(spec: DiagramSpecV2, angle: DiagramElement): number | undefined {
  const first = resolvePointCoordinates(spec, angle.refs[0]);
  const vertex = resolvePointCoordinates(spec, angle.refs[1]);
  const second = resolvePointCoordinates(spec, angle.refs[2]);
  if (!first || !vertex || !second) return undefined;
  if (angle.kind !== 'angle' && angle.kind !== 'nonReflexAngle') return undefined;
  return angleMeasureRadians(angle.kind, first, vertex, second);
}

function rotateUnit(vector: { x: number; y: number }, angle: number): { x: number; y: number } {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  return {
    x: vector.x * cosine - vector.y * sine,
    y: vector.x * sine + vector.y * cosine,
  };
}

function dot(first: { x: number; y: number }, second: { x: number; y: number }): number {
  return first.x * second.x + first.y * second.y;
}

function pointOnLinearSupportAtEqualLength(
  spec: DiagramSpecV2,
  point: DiagramPoint,
  requested: { x: number; y: number },
  supportId: string,
  equalLengthConstraint: DiagramConstraint,
): { x: number; y: number } | undefined {
  const support = spec.elements.find(element => element.id === supportId);
  const sourceSegment = spec.elements.find(element => element.id === equalLengthConstraint.refs[2] && element.kind === 'segment');
  const anchor = resolvePointCoordinates(spec, equalLengthConstraint.refs[1]);
  const sourceA = sourceSegment ? resolvePointCoordinates(spec, sourceSegment.refs[0]) : undefined;
  const sourceB = sourceSegment ? resolvePointCoordinates(spec, sourceSegment.refs[1]) : undefined;
  if (!support || !anchor || !sourceA || !sourceB) return undefined;
  if (!['segment', 'line', 'ray', 'perpendicular', 'parallel', 'angleBisector'].includes(support.kind)) return undefined;

  const carrier = linearSupportCarrier(spec, supportId, new Set());
  if (!carrier) return undefined;
  const dx = carrier.b.x - carrier.a.x;
  const dy = carrier.b.y - carrier.a.y;
  const carrierLength = Math.hypot(dx, dy);
  if (carrierLength < 1e-10) return undefined;
  const unitX = dx / carrierLength;
  const unitY = dy / carrierLength;
  const offsetX = carrier.a.x - anchor.x;
  const offsetY = carrier.a.y - anchor.y;
  const projection = offsetX * unitX + offsetY * unitY;
  const desiredLength = Math.hypot(sourceB.x - sourceA.x, sourceB.y - sourceA.y);
  const discriminant = projection * projection
    - (offsetX * offsetX + offsetY * offsetY - desiredLength * desiredLength);
  if (discriminant < -1e-10) return undefined;
  const root = Math.sqrt(Math.max(0, discriminant));
  const candidates = [-projection - root, -projection + root].filter(parameter => {
    if (support.kind === 'segment') return parameter >= -1e-10 && parameter <= carrierLength + 1e-10;
    if (support.kind === 'ray' || support.kind === 'angleBisector') return parameter >= -1e-10;
    return true;
  });
  if (candidates.length === 0) return undefined;
  const requestedParameter = (requested.x - carrier.a.x) * unitX + (requested.y - carrier.a.y) * unitY;
  const previousParameter = (point.x - carrier.a.x) * unitX + (point.y - carrier.a.y) * unitY;
  const preferredParameter = Number.isFinite(requestedParameter) ? requestedParameter : previousParameter;
  const parameter = candidates.reduce((best, candidate) => (
    Math.abs(candidate - preferredParameter) < Math.abs(best - preferredParameter) ? candidate : best
  ));
  return {
    x: carrier.a.x + parameter * unitX,
    y: carrier.a.y + parameter * unitY,
  };
}

export function withResolvedPointConstraints(
  spec: DiagramSpecV2,
  options?: { skipPointIds?: readonly string[] },
): DiagramSpecV2 {
  const skipPointIds = new Set(options?.skipPointIds ?? []);
  let current = spec;
  const maximumPasses = Math.max(1, spec.points.length);
  for (let pass = 0; pass < maximumPasses; pass += 1) {
    let changed = false;
    for (const point of current.points) {
      if (skipPointIds.has(point.id)) continue;
      // Como `on` solo: el glider de JSXGraph mantiene el punto en el soporte.
      if (isJsxgraphOnSupportPoint(current, point)) continue;
      if (!point.constraintIds?.length) continue;

      const activeConstraints = activePointConstraints(current, point);
      const onConstraint = activeConstraints.find(constraint => (
        constraint.kind === 'on' && constraint.refs[0] === point.id
      ));
      const sameSideConstraint = activeConstraints.find(constraint => (
        constraint.kind === 'sameSide' && constraint.refs[0] === point.id
      ));

      let coordinates: Coordinates;
      if (onConstraint && sameSideConstraint) {
        // `on` como solo (no re-proyectar): el glider ya colocó el punto.
        // `sameSide` como solo: solo actuar si sale del semiplano, y sin
        // sacar el punto del soporte.
        if (sameSideAllowsPoint(current, point, sameSideConstraint, point)) continue;
        const onSupport = projectPointToSupport(
          current,
          asGliderPoint(point, onConstraint.refs[1]),
          point,
        );
        coordinates = clampOnSupportToSameSide(
          current,
          onConstraint.refs[1],
          sameSideConstraint,
          point,
          onSupport,
        );
        for (const constraint of activeConstraints) {
          if (constraint.kind === 'on' || constraint.kind === 'sameSide') continue;
          coordinates = applyConstraint(current, point, coordinates, constraint);
        }
      } else {
        coordinates = constrainPointCoordinates(current, point, { x: point.x, y: point.y });
      }

      if (Math.abs(coordinates.x - point.x) <= 1e-10 && Math.abs(coordinates.y - point.y) <= 1e-10) continue;
      current = {
        ...current,
        points: current.points.map(item => item.id === point.id ? { ...item, ...coordinates } : item),
      };
      changed = true;
    }
    if (!changed) break;
  }
  return current;
}

export function buildDependencyGraph(spec: DiagramSpecV2): DiagramDependencyGraph {
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
