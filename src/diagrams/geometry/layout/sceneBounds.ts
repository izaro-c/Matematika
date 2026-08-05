import type {
  DiagramBounds,
  DiagramElement,
  DiagramSpecV2,
  DiagramViewport,
} from '@/diagrams/model/schema/types';
import type { DiagramSpecV3 } from '@/diagrams/model/schema/v3';
import type { DiagramSceneBag } from '@/diagrams/geometry/layout/sceneTypes';
import {
  clampCurveCoordinatesForBounds,
  sampleCurveFromSpec,
} from '@/diagrams/geometry/curves/curveGeometry';
import { resolvePointCoordinates } from '@/diagrams/geometry/coordinates/sceneCoordinates';
import { prepareSceneSpec } from '@/diagrams/geometry/coordinates/scenePointMotion';

function boundsFromCoordinates(coordinates: Array<{ x: number; y: number }>): DiagramBounds | null {
  if (coordinates.length === 0) return null;
  const xs = coordinates.map(point => point.x);
  const ys = coordinates.map(point => point.y);
  return [Math.min(...xs), Math.max(...ys), Math.max(...xs), Math.min(...ys)];
}

function curveCoordinates(spec: DiagramSceneBag, element: DiagramElement): Array<{ x: number; y: number }> {
  const samples = sampleCurveFromSpec(spec as DiagramSpecV2, element);
  return clampCurveCoordinatesForBounds(samples, spec.viewport.home);
}

function elementCoordinates(spec: DiagramSceneBag, element: DiagramElement): Array<{ x: number; y: number }> {
  if (element.kind === 'intersection') {
    const point = spec.points.find(p => p.id === element.id);
    if (point && point.visible === false) return [];
    const intersection = resolvePointCoordinates(spec, element.id);
    return intersection ? [intersection] : [];
  }
  const refs = element.refs
    .filter(ref => {
      const point = spec.points.find(p => p.id === ref);
      return !point || point.visible !== false;
    })
    .map(ref => resolvePointCoordinates(spec, ref))
    .filter((point): point is { x: number; y: number } => Boolean(point));

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

export function contentBounds(input: DiagramSpecV2 | DiagramSpecV3, itemIds?: readonly string[]): DiagramBounds | null {
  const spec = input.version === 3 ? prepareSceneSpec(input) : input;
  const filter = itemIds ? new Set(itemIds) : null;
  const coordinates: Array<{ x: number; y: number }> = [];
  spec.points.forEach(point => {
    if ((!filter || filter.has(point.id)) && point.visible !== false) {
      coordinates.push({ x: point.x, y: point.y });
    }
  });
  spec.elements.forEach(element => {
    if ((!filter || filter.has(element.id)) && element.visible !== false) {
      coordinates.push(...elementCoordinates(spec, element));
    }
  });
  spec.sliders.forEach(slider => {
    if ((!filter || filter.has(slider.id)) && slider.visible !== false) {
      coordinates.push({ x: slider.x, y: slider.y }, { x: slider.x + 2.6, y: slider.y });
    }
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
  input: DiagramSpecV2 | DiagramSpecV3,
  itemIds?: readonly string[],
  padding?: number,
): DiagramBounds {
  const spec = input.version === 3 ? prepareSceneSpec(input) : input;
  const bounds = contentBounds(spec, itemIds);
  return bounds ? padBounds(bounds, padding ?? spec.viewport.padding) : spec.viewport.home;
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

export function withViewportBounds<T extends DiagramSceneBag & { viewport: DiagramViewport }>(spec: T, bounds: DiagramBounds): T {
  return { ...spec, viewport: { ...spec.viewport, bounds } };
}
