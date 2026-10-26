import JXG from 'jsxgraph';
import type { ThemeColors } from '@/diagrams/jsxgraph/theme';
import {
  createCurveAreaComposite,
  createCurveAreaFills,
  type CurveAreaComposite,
  type AreaIntersectionComposite,
  updateStaticAreaPolygon,
} from '@/diagrams/jsxgraph/MathFactory';
import {findObject, isPositionedPoint, pointPosition, type DiagramBounds, type DiagramObject, type DiagramSpec} from '@/diagrams/model'
import {resolveAreaDisplayPolygons, resolveCurveAreaPolygons, resolvePointCoordinates, sampleCurveElement, type AreaPointResolver, type CurvePath} from '@/diagrams/geometry';

type BoardScene = Pick<DiagramSpec, 'objects' | 'relations' | 'viewport'>;
type RedrawableElement = { prepareUpdate(): RedrawableElement; update(): RedrawableElement; updateRenderer(): RedrawableElement };
import { liveVariables } from '@/diagrams/render/diagramRuntimeUtils';

export function createLiveAreaPointResolver(
  elements: Record<string, any>,
): AreaPointResolver {
  return (model, id) => {
    const live = elements[id];
    if (live && typeof live.X === 'function') return { x: live.X(), y: live.Y() };
    const point = findObject(model, id);
    return isPositionedPoint(point) ? pointPosition(point) : undefined;
  };
}
export function resolveBoardViewportBounds(
  board: JXG.Board,
  fallbackBounds: [number, number, number, number],
): [number, number, number, number] {
  const bbox = board.getBoundingBox?.();
  if (bbox && bbox.length >= 4) return [bbox[0], bbox[1], bbox[2], bbox[3]];
  return fallbackBounds;
}
function curveAreaSidePoint(
  spec: BoardScene,
  item: CurvePath,
  elements: Record<string, any>,
): ReturnType<typeof resolvePointCoordinates> {
  const sideRef = item.geometry.areaSide;
  if (!sideRef) return undefined;
  const live = elements[sideRef];
  if (live && typeof live.X === 'function') return { x: live.X(), y: live.Y() };
  return resolvePointCoordinates(spec, sideRef);
}

function resolveCurveAreaBounds(board: JXG.Board, spec: Pick<DiagramSpec, 'viewport'>): DiagramBounds {
  const bbox = board.getBoundingBox?.();
  if (bbox && bbox.length >= 4) {
    const [xMin, yMax, xMax, yMin] = bbox;
    if (xMax > xMin && yMax > yMin) return [xMin, yMax, xMax, yMin];
  }
  return spec.viewport.bounds;
}

function curveAreaUpdateSignature(
  spec: BoardScene,
  item: CurvePath,
  elements: Record<string, any>,
  board: JXG.Board,
  variables: Record<string, number>,
): string {
  const side = curveAreaSidePoint(spec, item, elements);
  return JSON.stringify({
    side,
    bounds: resolveCurveAreaBounds(board, spec),
    variables,
    geometry: item.geometry,
  });
}

export function updateCurveAreaFills(
  composite: CurveAreaComposite,
  spec: BoardScene,
  item: CurvePath,
  elements: Record<string, any>,
  board: JXG.Board,
  variables: Record<string, number>,
): void {
  const areaState = composite.__matematikaCurveArea;
  if (!areaState) return;
  const signature = curveAreaUpdateSignature(spec, item, elements, board, variables);
  if (areaState.lastAreaSignature === signature) return;
  const polygons = resolveCurveAreaPolygons(
    item,
    sampleCurveElement(item, variables),
    curveAreaSidePoint(spec, item, elements),
    resolveCurveAreaBounds(board, spec),
    variables,
  );
  areaState.fills.forEach((fill, index) => {
    const polygon = polygons[index];
    if (polygon && polygon.length >= 3) updateStaticAreaPolygon(fill, polygon);
  });
  areaState.lastAreaSignature = signature;
}

export function updateAreaIntersectionFills(
  composite: AreaIntersectionComposite,
  spec: BoardScene,
  item: DiagramObject,
  elements: Record<string, any>,
  board: JXG.Board,
): void {
  const areaState = composite.__matematikaAreaIntersection;
  if (!areaState) return;
  const liveResolver = createLiveAreaPointResolver(elements);
  const bounds = resolveCurveAreaBounds(board, spec);
  // The polygons depend on live point positions, not only on the spec, so they are part of the signature.
  const polygons = resolveAreaDisplayPolygons(
    { ...spec, viewport: { ...spec.viewport, bounds } },
    item,
    liveResolver,
  );
  const signature = JSON.stringify({ bounds, polygons });
  if (areaState.lastSignature === signature) return;
  areaState.fills.forEach((fill, index) => {
    const polygon = polygons[index];
    if (polygon && polygon.length >= 3) {
      updateStaticAreaPolygon(fill, polygon);
      return;
    }
    // No piece left for this fill (e.g. disjoint areas): collapse it onto a point so it disappears.
    const anchor = fill.vertices?.[0];
    if (anchor) {
      const collapsed = { x: anchor.X(), y: anchor.Y() };
      updateStaticAreaPolygon(fill, [collapsed, collapsed, collapsed]);
    }
  });
  // This runs inside the board's own update, after the fills were drawn, so they are redrawn here
  // instead of waiting for the next update (which never comes once a drag ends).
  areaState.fills.forEach(fill => {
    [fill, ...(fill.borders ?? [])].forEach(element => (element as unknown as RedrawableElement).prepareUpdate().update().updateRenderer());
  });
  areaState.lastSignature = signature;
}

export function createCurveAreaElement(
  board: JXG.Board,
  elements: Record<string, any>,
  item: CurvePath,
  spec: BoardScene,
  curve: JXG.Curve,
  fillOptions: Record<string, unknown>,
  theme: ThemeColors,
) {
  const resolveArea = () => {
    const side = curveAreaSidePoint(spec, item, elements);
    const variables = liveVariables(elements, spec);
    const samples = sampleCurveElement(item, variables);
    return resolveCurveAreaPolygons(
      item,
      samples,
      side,
      resolveCurveAreaBounds(board, spec),
      variables,
    );
  };
  const fills = createCurveAreaFills(board, resolveArea, fillOptions, theme);
  return createCurveAreaComposite(fills, curve);
}

