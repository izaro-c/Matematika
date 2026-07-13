import type {
  DiagramBounds,
  DiagramElement,
  DiagramPoint,
  DiagramSceneItem,
  DiagramSceneState,
  DiagramSpecV2,
} from './types';

export interface PlannedSceneItem {
  item: DiagramSceneItem;
  visible: boolean;
  locked: boolean;
  highlighted: boolean;
  selected: boolean;
  layerOrder: number;
  visualOrder: number;
}

export function resolvePointCoordinates(spec: DiagramSpecV2, id: string, visiting = new Set<string>()): { x: number; y: number } | undefined {
  const direct = spec.points.find(point => point.id === id);
  if (direct) return { x: direct.x, y: direct.y };
  if (visiting.has(id)) return undefined;
  visiting.add(id);
  const derived = spec.elements.find(element => element.id === id);
  if (!derived) return undefined;
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

export function supportElements(spec: DiagramSpecV2): DiagramElement[] {
  return spec.elements.filter(item => ['segment', 'line', 'ray', 'circle', 'perpendicular', 'parallel', 'angleBisector'].includes(item.kind));
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
  const layers = new Map(spec.layers.map(layer => [layer.id, layer]));
  const groups = new Map(spec.groups.map(group => [group.id, group]));

  return [...spec.points, ...spec.elements, ...spec.sliders]
    .map(item => {
      const layer = layers.get(item.layerId);
      const itemGroups = item.groupIds.map(id => groups.get(id)).filter(Boolean);
      const visible = item.visible
        && layer?.visible !== false
        && itemGroups.every(group => group?.visible !== false)
        && (!stepTargets || stepTargets.has(item.id));
      const locked = item.locked || layer?.locked === true || itemGroups.some(group => group?.locked === true);
      const layerOrder = layer?.order ?? 0;
      return {
        item,
        visible,
        locked,
        highlighted: highlighted.has(item.id),
        selected: selected.has(item.id) || itemGroups.some(group => selected.has(group?.id ?? '')),
        layerOrder,
        visualOrder: layerOrder * 100_000 + item.order,
      };
    })
    .sort((left, right) => left.visualOrder - right.visualOrder || left.item.id.localeCompare(right.item.id));
}

function creationDependencies(item: DiagramSceneItem): string[] {
  if ('constraint' in item) return item.constraint === 'glider' && item.gliderTarget ? [item.gliderTarget] : [];
  if ('kind' in item) return item.refs;
  return [];
}

export function createSceneConstructionPlan(spec: DiagramSpecV2): PlannedSceneItem[] {
  const pending = createScenePlan(spec);
  const itemIds = new Set(pending.map(entry => entry.item.id));
  const created = new Set<string>();
  const ordered: PlannedSceneItem[] = [];

  while (pending.length > 0) {
    const ready = pending.filter(entry => creationDependencies(entry.item).every(id => !itemIds.has(id) || created.has(id)));
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
  const refs = element.refs.map(ref => resolvePointCoordinates(spec, ref)).filter((point): point is { x: number; y: number } => Boolean(point));
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

export function fitViewport(spec: DiagramSpecV2, itemIds?: readonly string[]): DiagramBounds {
  const bounds = contentBounds(spec, itemIds);
  return bounds ? padBounds(bounds, spec.viewport.padding) : spec.viewport.home;
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
  return {
    ...spec,
    points: spec.points.map(point => point.id === pointId ? { ...point, x, y } : point),
  };
}

export function sceneRevision(spec: DiagramSpecV2): string {
  return JSON.stringify({
    points: spec.points,
    elements: spec.elements,
    sliders: spec.sliders,
    layers: spec.layers.map(({ id, order }) => [id, order]),
  });
}

export function itemLayerNumber(spec: DiagramSpecV2, item: DiagramSceneItem): number {
  const layerOrder = spec.layers.find(layer => layer.id === item.layerId)?.order ?? 0;
  return Math.max(0, Math.min(20, 5 + layerOrder * 3 + Math.trunc(item.order / 1000)));
}

export function isPointItem(item: DiagramSceneItem): item is DiagramPoint {
  return 'x' in item && 'constraint' in item && 'fixed' in item;
}
