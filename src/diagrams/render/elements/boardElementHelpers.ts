import JXG from 'jsxgraph';
import type { ThemeColors } from '@/diagrams/jsxgraph/theme';
import {
  createCurveAreaComposite,
  createCurveAreaFills,
  type CurveAreaComposite,
  type AreaIntersectionComposite,
  updateStaticAreaPolygon,
} from '@/diagrams/jsxgraph/MathFactory';
import {type DiagramBounds, type DiagramElement, type DiagramSpecV2} from '@/diagrams/model'
import {resolveAreaDisplayPolygons, resolveCurveAreaPolygons, resolvePointCoordinates, sampleCurveElement, type AreaPointResolver} from '@/diagrams/geometry';
import { liveVariables } from '@/diagrams/render/diagramRuntimeUtils';

export function createLiveAreaPointResolver(
  elements: Record<string, any>,
): AreaPointResolver {
  return (model, id) => {
    const live = elements[id];
    if (live && typeof live.X === 'function') return { x: live.X(), y: live.Y() };
    const point = model.points.find(candidate => candidate.id === id);
    return point ? { x: point.x, y: point.y } : undefined;
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
  spec: DiagramSpecV2,
  item: DiagramElement,
  elements: Record<string, any>,
): ReturnType<typeof resolvePointCoordinates> {
  const sideRef = item.refs.find(ref => Boolean(ref));
  if (!sideRef) return undefined;
  const live = elements[sideRef];
  if (live && typeof live.X === 'function') return { x: live.X(), y: live.Y() };
  return resolvePointCoordinates(spec, sideRef);
}

function resolveCurveAreaBounds(board: JXG.Board, spec: DiagramSpecV2): DiagramBounds {
  const bbox = board.getBoundingBox?.();
  if (bbox && bbox.length >= 4) {
    const [xMin, yMax, xMax, yMin] = bbox;
    if (xMax > xMin && yMax > yMin) return [xMin, yMax, xMax, yMin];
  }
  return spec.viewport.bounds;
}

function curveAreaUpdateSignature(
  spec: DiagramSpecV2,
  item: DiagramElement,
  elements: Record<string, any>,
  board: JXG.Board,
  variables: Record<string, number>,
): string {
  const side = curveAreaSidePoint(spec, item, elements);
  return JSON.stringify({
    side,
    bounds: resolveCurveAreaBounds(board, spec),
    variables,
    areaFill: item.properties?.areaFill,
    domain: item.properties?.domain,
    samples: item.properties?.samples,
    expression: item.properties?.expression,
    xExpression: item.properties?.xExpression,
    yExpression: item.properties?.yExpression,
    refs: item.refs,
  });
}

export function updateCurveAreaFills(
  composite: CurveAreaComposite,
  spec: DiagramSpecV2,
  item: DiagramElement,
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
  spec: DiagramSpecV2,
  item: DiagramElement,
  elements: Record<string, any>,
  board: JXG.Board,
): void {
  const areaState = composite.__matematikaAreaIntersection;
  if (!areaState) return;
  const liveResolver = createLiveAreaPointResolver(elements);
  const bounds = resolveCurveAreaBounds(board, spec);
  const signature = JSON.stringify({
    bounds,
    refs: item.refs,
    elements: spec.elements.map(element => ({
      id: element.id,
      kind: element.kind,
      refs: element.refs,
      properties: element.properties,
    })),
    points: spec.points.map(point => ({ id: point.id, x: point.x, y: point.y })),
    sliders: spec.sliders.map(slider => ({ id: slider.id, value: slider.value })),
  });
  if (areaState.lastSignature === signature) return;
  const polygons = resolveAreaDisplayPolygons(
    { ...spec, viewport: { ...spec.viewport, bounds } },
    item,
    liveResolver,
  );
  areaState.fills.forEach((fill, index) => {
    const polygon = polygons[index];
    if (polygon && polygon.length >= 3) updateStaticAreaPolygon(fill, polygon);
  });
  areaState.lastSignature = signature;
}

export function createCurveAreaElement(
  board: JXG.Board,
  elements: Record<string, any>,
  item: DiagramElement,
  spec: DiagramSpecV2,
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

