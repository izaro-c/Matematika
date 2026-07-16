import type {
  DiagramBounds,
  DiagramElement,
  DiagramPoint,
  DiagramSceneItem,
  DiagramSceneState,
  DiagramSpecV2,
  DiagramStepOverlay,
} from './types';
import { evaluateMathExpression } from './expressions';

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
  label: string;
  interactive: boolean;
  stepValue?: number;
  layerOrder: number;
  visualOrder: number;
}

export function evaluateStepOverlayContent(overlay: DiagramStepOverlay, variables: Record<string, number>): string {
  if (!overlay.expression) return overlay.content;
  try {
    const evaluated = evaluateMathExpression(overlay.expression, variables);
    const suffix = overlay.unit ? ` ${overlay.unit}` : '';
    const value = `${evaluated.toFixed(overlay.precision ?? 2)}${suffix}`;
    return overlay.content.split('{value}').join(value);
  } catch {
    return overlay.content.split('{value}').join('valor no definido');
  }
}

export function resolvePointCoordinates(spec: DiagramSpecV2, id: string, visiting = new Set<string>()): { x: number; y: number } | undefined {
  const direct = spec.points.find(point => point.id === id);
  if (direct && direct.constraint !== 'derived') return { x: direct.x, y: direct.y };
  if (visiting.has(id)) return undefined;
  visiting.add(id);
  if (direct?.constraint === 'derived' && direct.xExpression && direct.yExpression) {
    const variables: Record<string, number> = {};
    for (const dependencyId of direct.dependencies ?? []) {
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
        x: evaluateMathExpression(direct.xExpression, variables),
        y: evaluateMathExpression(direct.yExpression, variables),
      };
    } catch {
      return { x: direct.x, y: direct.y };
    }
  }
  const derived = spec.elements.find(element => element.id === id);
  if (!derived) return undefined;
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
  });
  return variables;
}

export function supportElements(spec: DiagramSpecV2): DiagramElement[] {
  return spec.elements.filter(item => [
    'segment', 'line', 'ray', 'circle', 'arc', 'functionCurve', 'parametricCurve',
    'poincareGeodesic', 'poincareArc', 'perpendicular', 'parallel', 'angleBisector',
  ].includes(item.kind));
}

export function projectPointToSupport(
  spec: DiagramSpecV2,
  point: DiagramPoint,
  coordinates: { x: number; y: number },
): { x: number; y: number } {
  if (point.constraint !== 'glider' || !point.gliderTarget) return coordinates;
  const support = spec.elements.find(item => item.id === point.gliderTarget);
  if (!support) return coordinates;

  if (support.kind === 'circle') {
    const center = resolvePointCoordinates(spec, support.refs[0]);
    const edge = resolvePointCoordinates(spec, support.refs[1]);
    if (!center || !edge) return coordinates;
    const radius = Math.hypot(edge.x - center.x, edge.y - center.y) || 1;
    const dx = coordinates.x - center.x;
    const dy = coordinates.y - center.y;
    const length = Math.hypot(dx, dy) || 1;
    return { x: center.x + (dx / length) * radius, y: center.y + (dy / length) * radius };
  }

  const a = resolvePointCoordinates(spec, support.refs[0]);
  const b = resolvePointCoordinates(spec, support.refs[1]);
  const through = resolvePointCoordinates(spec, support.refs[2]);
  const lineA = support.kind === 'perpendicular' || support.kind === 'parallel' ? through : a;
  if (!lineA || !a || !b) return coordinates;

  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const angleLeg = support.kind === 'angleBisector' ? a : undefined;
  const angleVertex = support.kind === 'angleBisector' ? b : undefined;
  const angleOtherLeg = support.kind === 'angleBisector' ? through : undefined;
  const angleDirection = angleLeg && angleVertex && angleOtherLeg
    ? (() => {
      const ux = angleLeg.x - angleVertex.x;
      const uy = angleLeg.y - angleVertex.y;
      const wx = angleOtherLeg.x - angleVertex.x;
      const wy = angleOtherLeg.y - angleVertex.y;
      const uLength = Math.hypot(ux, uy) || 1;
      const wLength = Math.hypot(wx, wy) || 1;
      const sumX = ux / uLength + wx / wLength;
      const sumY = uy / uLength + wy / wLength;
      const sumLength = Math.hypot(sumX, sumY);
      return sumLength < 1e-6
        ? { x: -uy / uLength, y: ux / uLength }
        : { x: sumX / sumLength, y: sumY / sumLength };
    })()
    : undefined;
  const vx = support.kind === 'angleBisector' && angleDirection
    ? angleDirection.x
    : support.kind === 'perpendicular' ? -dy : dx;
  const vy = support.kind === 'angleBisector' && angleDirection
    ? angleDirection.y
    : support.kind === 'perpendicular' ? dx : dy;
  const origin = support.kind === 'angleBisector' && angleVertex ? angleVertex : lineA;
  const lengthSquared = vx * vx + vy * vy || 1;
  const t = ((coordinates.x - origin.x) * vx + (coordinates.y - origin.y) * vy) / lengthSquared;
  const projectedT = support.kind === 'ray' || support.kind === 'angleBisector' ? Math.max(0, t) : t;
  return { x: origin.x + vx * projectedT, y: origin.y + vy * projectedT };
}

export function createScenePlan(spec: DiagramSpecV2, state: DiagramSceneState = {}): PlannedSceneItem[] {
  const highlighted = new Set(state.highlightedIds ?? []);
  const selected = new Set(state.selectedIds ?? []);
  const activeStep = state.activeStepId ? spec.steps.find(step => step.id === state.activeStepId) : undefined;
  const stepTargets = activeStep ? new Set(activeStep.visibleTargets) : null;
  const objectStates = activeStep?.objectStates ?? {};
  const layers = new Map(spec.layers.map(layer => [layer.id, layer]));
  const groups = new Map(spec.groups.map(group => [group.id, group]));

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
      const highlightable = item.selection.highlightable !== false;
      const highlightedByGroup = itemGroups.some(group => group?.selection.highlightable !== false && highlighted.has(group?.id ?? ''));
      const selectedByGroup = itemGroups.some(group => group?.selection.highlightable !== false && selected.has(group?.id ?? ''));
      return {
        item,
        visible,
        locked,
        highlighted: highlightable && (highlighted.has(item.id) || highlightedByGroup),
        selected: highlightable && (selected.has(item.id) || selectedByGroup),
        stepEmphasis: objectState?.emphasis ?? 'none',
        label: objectState?.label || item.label,
        interactive,
        stepValue: objectState?.value,
        layerOrder,
        visualOrder: layerOrder * 100_000 + item.order,
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
  const pending = createScenePlan(spec);
  const itemIds = new Set(pending.map(entry => entry.item.id));
  const created = new Set<string>();
  const ordered: PlannedSceneItem[] = [];

  while (pending.length > 0) {
    const ready = pending.filter(entry => {
      const explicitSources = (spec.dependencies ?? [])
        .filter(dependency => dependency.targetId === entry.item.id)
        .map(dependency => dependency.sourceId);
      return [...creationDependencies(entry.item), ...explicitSources].every(id => !itemIds.has(id) || created.has(id));
    });
    if (ready.length === 0) return [...ordered, ...pending];
    ready.forEach(entry => {
      ordered.push(entry);
      created.add(entry.item.id);
      pending.splice(pending.indexOf(entry), 1);
    });
  }
  return ordered;
}

function boundsFromCoordinates(coordinates: Array<{ x: number; y: number }>): DiagramBounds | null {
  if (coordinates.length === 0) return null;
  const xs = coordinates.map(point => point.x);
  const ys = coordinates.map(point => point.y);
  return [Math.min(...xs), Math.max(...ys), Math.max(...xs), Math.min(...ys)];
}

function elementCoordinates(spec: DiagramSpecV2, element: DiagramElement): Array<{ x: number; y: number }> {
  if (element.kind === 'intersection') {
    const intersection = resolvePointCoordinates(spec, element.id);
    return intersection ? [intersection] : [];
  }
  const refs = element.refs.map(ref => resolvePointCoordinates(spec, ref)).filter((point): point is { x: number; y: number } => Boolean(point));
  if ((element.kind === 'functionCurve' || element.kind === 'parametricCurve') && element.properties?.domain) {
    const variables = expressionVariables(spec);
    const [minimum, maximum] = element.properties.domain;
    const samples = Math.min(64, element.properties.samples ?? 32);
    const parameter = element.properties.parameter ?? (element.kind === 'functionCurve' ? 'x' : 't');
    const coordinates: Array<{ x: number; y: number }> = [];
    for (let index = 0; index <= samples; index += 1) {
      const value = minimum + (maximum - minimum) * index / samples;
      try {
        if (element.kind === 'functionCurve' && element.properties.expression) {
          coordinates.push({ x: value, y: evaluateMathExpression(element.properties.expression, { ...variables, [parameter]: value, x: value }) });
        } else if (element.properties.xExpression && element.properties.yExpression) {
          coordinates.push({
            x: evaluateMathExpression(element.properties.xExpression, { ...variables, [parameter]: value, t: value }),
            y: evaluateMathExpression(element.properties.yExpression, { ...variables, [parameter]: value, t: value }),
          });
        }
      } catch {
        // Invalid samples are omitted; schema validation reports invalid expressions.
      }
    }
    return coordinates;
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

export function withMovedPoint(spec: DiagramSpecV2, pointId: string, x: number, y: number): DiagramSpecV2 {
  const point = spec.points.find(item => item.id === pointId);
  if (!point || point.fixed || point.constraint === 'fixed' || point.constraint === 'derived') return spec;
  const constrained = constrainPointCoordinates(spec, point, { x, y });
  return withResolvedPointConstraints({
    ...spec,
    points: spec.points.map(item => item.id === pointId ? { ...item, ...constrained } : item),
  });
}

export function constrainPointCoordinates(
  spec: DiagramSpecV2,
  point: DiagramPoint,
  coordinates: { x: number; y: number },
): { x: number; y: number } {
  if (point.constraint === 'glider') return projectPointToSupport(spec, point, coordinates);
  if (point.constraint === 'horizontal') return { x: coordinates.x, y: point.y };
  if (point.constraint === 'vertical') return { x: point.x, y: coordinates.y };
  let result = coordinates;
  for (const constraintId of point.constraintIds ?? []) {
    const constraint = (spec.constraints ?? []).find(item => item.id === constraintId && item.enabled);
    if (!constraint) continue;
    const otherId = constraint.refs.find(ref => ref !== point.id);
    const other = otherId ? resolvePointCoordinates(spec, otherId) : undefined;
    if (constraint.kind === 'fixed') result = { x: point.x, y: point.y };
    else if (constraint.kind === 'horizontal' && other) result = { x: result.x, y: other.y };
    else if (constraint.kind === 'vertical' && other) result = { x: other.x, y: result.y };
    else if (constraint.kind === 'coincident' && other) result = other;
    else if (constraint.kind === 'on' && otherId) result = projectPointToSupport(spec, { ...point, constraint: 'glider', gliderTarget: otherId }, result);
    else if (constraint.kind === 'distance' && other) {
      const variables = expressionVariables(spec);
      const distance = constraint.value ?? (constraint.expression ? evaluateMathExpression(constraint.expression, variables) : 0);
      const dx = result.x - other.x;
      const dy = result.y - other.y;
      const length = Math.hypot(dx, dy) || 1;
      result = { x: other.x + dx / length * distance, y: other.y + dy / length * distance };
    } else if (constraint.kind === 'equalLength' && constraint.refs.length >= 3) {
      const anchor = resolvePointCoordinates(spec, constraint.refs[1]);
      const sourceSegment = spec.elements.find(element => element.id === constraint.refs[2] && element.kind === 'segment');
      const sourceA = sourceSegment ? resolvePointCoordinates(spec, sourceSegment.refs[0]) : undefined;
      const sourceB = sourceSegment ? resolvePointCoordinates(spec, sourceSegment.refs[1]) : undefined;
      if (!anchor || !sourceA || !sourceB) continue;
      const desiredLength = Math.hypot(sourceB.x - sourceA.x, sourceB.y - sourceA.y);
      const requestedDx = result.x - anchor.x;
      const requestedDy = result.y - anchor.y;
      const previousDx = point.x - anchor.x;
      const previousDy = point.y - anchor.y;
      const directionLength = Math.hypot(requestedDx, requestedDy);
      const fallbackLength = Math.hypot(previousDx, previousDy) || 1;
      const directionX = directionLength > 1e-10 ? requestedDx / directionLength : previousDx / fallbackLength;
      const directionY = directionLength > 1e-10 ? requestedDy / directionLength : previousDy / fallbackLength;
      result = {
        x: anchor.x + directionX * desiredLength,
        y: anchor.y + directionY * desiredLength,
      };
    } else if (constraint.kind === 'midpoint' && constraint.refs.length >= 3) {
      const firstEndpoint = resolvePointCoordinates(spec, constraint.refs[1]);
      const secondEndpoint = resolvePointCoordinates(spec, constraint.refs[2]);
      if (!firstEndpoint || !secondEndpoint) continue;
      result = {
        x: (firstEndpoint.x + secondEndpoint.x) / 2,
        y: (firstEndpoint.y + secondEndpoint.y) / 2,
      };
    } else if (constraint.kind === 'insideDisk' && constraint.refs.length >= 3) {
      const center = resolvePointCoordinates(spec, constraint.refs[1]);
      const boundary = resolvePointCoordinates(spec, constraint.refs[2]);
      if (!center || !boundary) continue;
      const radius = Math.hypot(boundary.x - center.x, boundary.y - center.y) * 0.999;
      const dx = result.x - center.x;
      const dy = result.y - center.y;
      const length = Math.hypot(dx, dy);
      if (length > radius) result = { x: center.x + dx / length * radius, y: center.y + dy / length * radius };
    } else if (constraint.kind === 'sameSide' && constraint.refs.length >= 3) {
      const baseA = resolvePointCoordinates(spec, constraint.refs[1]);
      const baseB = resolvePointCoordinates(spec, constraint.refs[2]);
      if (!baseA || !baseB) continue;
      const dx = baseB.x - baseA.x;
      const dy = baseB.y - baseA.y;
      const length = Math.hypot(dx, dy) || 1;
      const initialCross = dx * (point.y - baseA.y) - dy * (point.x - baseA.x);
      const currentCross = dx * (result.y - baseA.y) - dy * (result.x - baseA.x);
      const side = Math.sign(initialCross) || 1;
      if (currentCross * side <= 0.01) {
        const projection = ((result.x - baseA.x) * dx + (result.y - baseA.y) * dy) / (length * length);
        const normalX = -dy / length * side;
        const normalY = dx / length * side;
        result = {
          x: baseA.x + projection * dx + normalX * 0.05,
          y: baseA.y + projection * dy + normalY * 0.05,
        };
      }
    } else if ((constraint.kind === 'perpendicular' || constraint.kind === 'parallel') && constraint.refs.length >= 3) {
      const baseA = resolvePointCoordinates(spec, constraint.refs[1]);
      const baseB = resolvePointCoordinates(spec, constraint.refs[2]);
      const origin = constraint.refs[3] ? resolvePointCoordinates(spec, constraint.refs[3]) : baseA;
      if (!baseA || !baseB || !origin) continue;
      const dx = baseB.x - baseA.x;
      const dy = baseB.y - baseA.y;
      const vx = constraint.kind === 'perpendicular' ? -dy : dx;
      const vy = constraint.kind === 'perpendicular' ? dx : dy;
      const lengthSquared = vx * vx + vy * vy || 1;
      const amount = ((result.x - origin.x) * vx + (result.y - origin.y) * vy) / lengthSquared;
      result = { x: origin.x + amount * vx, y: origin.y + amount * vy };
    }
  }
  return result;
}

export function withResolvedPointConstraints(spec: DiagramSpecV2): DiagramSpecV2 {
  let current = spec;
  const maximumPasses = Math.max(1, spec.points.length);
  for (let pass = 0; pass < maximumPasses; pass += 1) {
    let changed = false;
    for (const point of current.points) {
      if (!point.constraintIds?.length) continue;
      const coordinates = constrainPointCoordinates(current, point, { x: point.x, y: point.y });
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
    constraint.refs.slice(1).forEach(sourceId => edges.push({ sourceId, targetId, relation: 'constraint', constraintId: constraint.id }));
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
    constraints: spec.constraints,
    dependencies: spec.dependencies,
  });
}

export function itemLayerNumber(spec: DiagramSpecV2, item: DiagramSceneItem): number {
  const layerOrder = spec.layers.find(layer => layer.id === item.layerId)?.order ?? 0;
  return Math.max(0, Math.min(20, 5 + layerOrder * 3 + Math.trunc(item.order / 1000)));
}

export function isPointItem(item: DiagramSceneItem): item is DiagramPoint {
  return 'x' in item && 'constraint' in item && 'fixed' in item;
}
