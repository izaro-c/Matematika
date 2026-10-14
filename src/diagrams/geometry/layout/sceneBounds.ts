import type {
  DiagramBounds,
  DiagramViewport,
} from '@/diagrams/model/schema/types';
import type { DiagramObject, DiagramSpec } from '@/diagrams/model/schema/v3';
import { isControlObject, isPositionedPoint, pointPosition, findObject } from '@/diagrams/model/objects/queries';
import {
  clampCurveCoordinatesForBounds,
  isCurveObject,
  sampleCurveFromSpec,
} from '@/diagrams/geometry/curves/curveGeometry';
import { resolvePointCoordinates, sceneReferences } from '@/diagrams/geometry/coordinates/sceneCoordinates';
import { resolveDiagramScene } from '@/diagrams/geometry/coordinates/scenePointMotion';

type BoundsScene = Pick<DiagramSpec, 'objects' | 'relations' | 'viewport'>;

function boundsFromCoordinates(coordinates: Array<{ x: number; y: number }>): DiagramBounds | null {
  if (coordinates.length === 0) return null;
  const xs = coordinates.map(point => point.x);
  const ys = coordinates.map(point => point.y);
  return [Math.min(...xs), Math.max(...ys), Math.max(...xs), Math.min(...ys)];
}

function curveCoordinates(spec: BoundsScene, element: DiagramObject): Array<{ x: number; y: number }> {
  const samples = sampleCurveFromSpec(spec, element);
  return clampCurveCoordinatesForBounds(samples, spec.viewport.home);
}

function elementCoordinates(spec: BoundsScene, element: DiagramObject): Array<{ x: number; y: number }> {
  if (element.objectType === 'point' && element.definition.type === 'intersection') {
    const intersection = resolvePointCoordinates(spec, element.id);
    return intersection ? [intersection] : [];
  }
  const refs = sceneReferences(spec, element)
    .filter(ref => {
      const point = findObject(spec, ref);
      return !isPositionedPoint(point) || point.visible !== false;
    })
    .map(ref => resolvePointCoordinates(spec, ref))
    .filter((point): point is { x: number; y: number } => Boolean(point));

  if (isCurveObject(element)) return curveCoordinates(spec, element);
  if (!(element.objectType === 'path' && element.geometry.type === 'circle') || refs.length < 2) return refs;
  const [center, edge] = refs;
  const radius = Math.hypot(edge.x - center.x, edge.y - center.y);
  return [
    { x: center.x - radius, y: center.y - radius },
    { x: center.x + radius, y: center.y + radius },
  ];
}

/** Encuadre de una escena ya resuelta (sin volver a aplicar restricciones). */
export function resolvedSceneContentBounds(spec: BoundsScene, itemIds?: readonly string[]): DiagramBounds | null {
  const filter = itemIds ? new Set(itemIds) : null;
  const coordinates: Array<{ x: number; y: number }> = [];
  spec.objects.forEach(object => {
    if ((filter && !filter.has(object.id)) || object.visible === false) return;
    if (isPositionedPoint(object)) coordinates.push(pointPosition(object)!);
    else if (isControlObject(object)) {
      coordinates.push({ x: object.position[0], y: object.position[1] }, { x: object.position[0] + 2.6, y: object.position[1] });
    } else coordinates.push(...elementCoordinates(spec, object));
  });
  return boundsFromCoordinates(coordinates);
}

export function contentBounds(input: BoundsScene, itemIds?: readonly string[]): DiagramBounds | null {
  return resolvedSceneContentBounds(resolveDiagramScene(input), itemIds);
}

export function padBounds(bounds: DiagramBounds, padding: number): DiagramBounds {
  const [left, top, right, bottom] = bounds;
  const width = Math.max(right - left, 1);
  const height = Math.max(top - bottom, 1);
  return [left - width * padding, top + height * padding, right + width * padding, bottom - height * padding];
}

export function fitViewport(
  input: BoundsScene,
  itemIds?: readonly string[],
  padding?: number,
): DiagramBounds {
  const spec = resolveDiagramScene(input);
  const bounds = resolvedSceneContentBounds(spec, itemIds);
  return bounds ? padBounds(bounds, padding ?? spec.viewport.padding) : spec.viewport.home;
}

export function zoomViewport(spec: Pick<DiagramSpec, 'viewport'>, bounds: DiagramBounds, factor: number): DiagramBounds {
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

export function offscreenItemIds(input: BoundsScene, bounds = input.viewport.bounds): string[] {
  const spec = resolveDiagramScene(input);
  return spec.objects
    .filter(item => {
      const itemBounds = resolvedSceneContentBounds(spec, [item.id]);
      return itemBounds ? !boundsContain(bounds, itemBounds) : false;
    })
    .map(item => item.id);
}

export function recoverViewport(input: BoundsScene, selectedIds: readonly string[] = []): DiagramBounds {
  const spec = resolveDiagramScene(input);
  const selectedBounds = selectedIds.length > 0 ? resolvedSceneContentBounds(spec, selectedIds) : null;
  if (selectedBounds && !boundsContain(spec.viewport.bounds, selectedBounds)) {
    return padBounds(selectedBounds, spec.viewport.padding);
  }
  const offscreen = offscreenItemIds(spec);
  return offscreen.length > 0 ? fitViewport(spec) : spec.viewport.bounds;
}

export function withViewportBounds<T extends { viewport: DiagramViewport }>(spec: T, bounds: DiagramBounds): T {
  return { ...spec, viewport: { ...spec.viewport, bounds } };
}
