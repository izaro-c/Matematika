import type { AreaMembership, DiagramElement, DiagramSpecV2 } from './types';
import {
  clipPolygonByHalfPlane,
  intersectPolygons,
  constrainToDisk,
  constrainToDiskBoundary,
  constrainToHalfPlane,
  constrainToLine,
  constrainToPolygon,
  constrainToPolygonBoundary,
  pointInDisk,
  pointInHalfPlane,
  pointInPolygon,
  pointOnDiskBoundary,
  pointOnLine,
  pointOnPolygonBoundary,
  polygonSignedArea,
  type Coordinates,
} from './areaGeometry';
import {
  curveActsAsArea,
  pointInCurveAreaPolygons,
  resolveCurveAreaPolygons,
  sampleCurveFromSpec,
} from './curveGeometry';

export type AreaPointResolver = (spec: DiagramSpecV2, id: string) => Coordinates | undefined;

function defaultResolvePoint(spec: DiagramSpecV2, id: string): Coordinates | undefined {
  const point = spec.points.find(item => item.id === id);
  return point ? { x: point.x, y: point.y } : undefined;
}

function curveVariablesFromResolver(
  spec: DiagramSpecV2,
  resolver: AreaPointResolver,
): Record<string, number> {
  const variables: Record<string, number> = {};
  spec.points.forEach(point => {
    const coordinates = resolver(spec, point.id);
    if (coordinates) {
      variables[`${point.id}.x`] = coordinates.x;
      variables[`${point.id}.y`] = coordinates.y;
    }
  });
  spec.sliders.forEach(slider => {
    variables[slider.id] = slider.value;
  });
  return variables;
}

function curveAreaPolygons(
  spec: DiagramSpecV2,
  element: DiagramElement,
  resolver: AreaPointResolver = defaultResolvePoint,
): Coordinates[][] {
  if (!curveActsAsArea(element)) return [];
  const variables = curveVariablesFromResolver(spec, resolver);
  const curvePoints = sampleCurveFromSpec(spec, element, variables);
  const sideRef = element.refs.find(ref => Boolean(ref));
  const side = sideRef ? resolveRef(spec, sideRef, resolver) : undefined;
  return resolveCurveAreaPolygons(element, curvePoints, side, spec.viewport.bounds, variables);
}

function constrainToCurveAreaPolygons(polygons: Coordinates[][], point: Coordinates): Coordinates {
  if (polygons.length === 0) return point;
  if (pointInCurveAreaPolygons(polygons, point)) return point;
  let best = point;
  let bestDistance = Number.POSITIVE_INFINITY;
  polygons.forEach(polygon => {
    if (polygon.length < 3) return;
    const candidate = constrainToPolygon(polygon, point);
    const distance = Math.hypot(candidate.x - point.x, candidate.y - point.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = candidate;
    }
  });
  return best;
}

function resolveRef(
  spec: DiagramSpecV2,
  id: string,
  resolver: AreaPointResolver = defaultResolvePoint,
): Coordinates | undefined {
  return resolver(spec, id);
}

export const AREA_ELEMENT_KINDS = new Set<DiagramElement['kind']>([
  'polygon',
  'circle',
  'halfPlane',
  'areaIntersection',
  'areaDecomposition',
  'grid',
]);

export function isAreaElement(element: DiagramElement): boolean {
  return AREA_ELEMENT_KINDS.has(element.kind) || curveActsAsArea(element);
}

export function viewportPolygon(bounds: DiagramSpecV2['viewport']['bounds']): Coordinates[] {
  const [xMin, yMax, xMax, yMin] = bounds;
  return [
    { x: xMin, y: yMax },
    { x: xMax, y: yMax },
    { x: xMax, y: yMin },
    { x: xMin, y: yMin },
  ];
}

function polygonVertices(
  spec: DiagramSpecV2,
  element: DiagramElement,
  resolver: AreaPointResolver = defaultResolvePoint,
): Coordinates[] | undefined {
  if (!['polygon', 'areaDecomposition', 'grid'].includes(element.kind)) return undefined;
  const vertices = element.refs
    .map(ref => resolveRef(spec, ref, resolver))
    .filter((coords): coords is Coordinates => Boolean(coords));
  return vertices.length >= 3 ? vertices : undefined;
}

function clipPolygonToConvexRegion(polygon: Coordinates[], vertices: Coordinates[]): Coordinates[] {
  if (vertices.length < 3) return polygon;
  const ordered = polygonSignedArea(vertices) < 0 ? [...vertices].reverse() : vertices;
  const centroid = ordered.reduce((accumulator, vertex) => ({
    x: accumulator.x + vertex.x / ordered.length,
    y: accumulator.y + vertex.y / ordered.length,
  }), { x: 0, y: 0 });
  let result = polygon;
  for (let index = 0; index < ordered.length; index += 1) {
    result = clipPolygonByHalfPlane(
      result,
      ordered[index],
      ordered[(index + 1) % ordered.length],
      centroid,
    );
    if (result.length === 0) return [];
  }
  return result;
}

function clipPolygonToDisk(polygon: Coordinates[], center: Coordinates, boundary: Coordinates, samples = 32): Coordinates[] {
  const radius = Math.hypot(boundary.x - center.x, boundary.y - center.y);
  if (radius < 1e-12) return [];
  const circlePolygon = Array.from({ length: samples }, (_, index) => {
    const angle = (index / samples) * Math.PI * 2;
    return { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius };
  });
  return clipPolygonToConvexRegion(polygon, circlePolygon);
}

function intersectPolygonSets(
  subjects: readonly Coordinates[][],
  clips: readonly Coordinates[][],
): Coordinates[][] {
  const output: Coordinates[][] = [];
  subjects.forEach(subject => {
    clips.forEach(clip => {
      if (subject.length < 3 || clip.length < 3) return;
      const clipped = intersectPolygons(subject, clip);
      if (clipped.length >= 3) output.push(clipped);
    });
  });
  return output;
}

function clipSubjectToCurveAreaPolygons(
  polygon: Coordinates[],
  areas: readonly Coordinates[][],
): Coordinates[] {
  const parts = areas
    .filter(area => area.length >= 3)
    .map(area => intersectPolygons(polygon, area))
    .filter(part => part.length >= 3);
  if (parts.length === 0) return [];
  if (parts.length === 1) return parts[0];
  return parts.reduce((best, part) => (
    Math.abs(polygonSignedArea(part)) > Math.abs(polygonSignedArea(best)) ? part : best
  ));
}

export function resolveAreaElementPolygons(
  spec: DiagramSpecV2,
  element: DiagramElement,
  resolver: AreaPointResolver = defaultResolvePoint,
): Coordinates[][] {
  if (curveActsAsArea(element)) {
    return curveAreaPolygons(spec, element, resolver);
  }
  if (element.kind === 'halfPlane' && element.refs.length >= 3) {
    const lineA = resolveRef(spec, element.refs[0], resolver);
    const lineB = resolveRef(spec, element.refs[1], resolver);
    const side = resolveRef(spec, element.refs[2], resolver);
    if (!lineA || !lineB || !side) return [];
    const polygon = clipPolygonByHalfPlane(viewportPolygon(spec.viewport.bounds), lineA, lineB, side);
    return polygon.length >= 3 ? [polygon] : [];
  }
  if (element.kind === 'circle' && element.refs.length >= 2) {
    const center = resolveRef(spec, element.refs[0], resolver);
    const boundary = resolveRef(spec, element.refs[1], resolver);
    if (!center || !boundary) return [];
    const polygon = clipPolygonToDisk(viewportPolygon(spec.viewport.bounds), center, boundary);
    return polygon.length >= 3 ? [polygon] : [];
  }
  const vertices = polygonVertices(spec, element, resolver);
  if (vertices) {
    const polygon = clipPolygonToConvexRegion(viewportPolygon(spec.viewport.bounds), vertices);
    return polygon.length >= 3 ? [polygon] : [];
  }
  if (element.kind === 'areaIntersection') {
    return resolveAreaDisplayPolygons(spec, element, resolver);
  }
  return [];
}

export function resolveAreaDisplayPolygons(
  spec: DiagramSpecV2,
  element: DiagramElement,
  resolver: AreaPointResolver = defaultResolvePoint,
): Coordinates[][] {
  if (element.kind === 'areaIntersection') {
    const areas = element.refs
      .map(ref => spec.elements.find(item => item.id === ref))
      .filter((item): item is DiagramElement => Boolean(item));
    if (areas.length === 0) return [];
    let regions: Coordinates[][] = [viewportPolygon(spec.viewport.bounds)];
    for (const area of areas) {
      const areaPolygons = resolveAreaElementPolygons(spec, area, resolver);
      if (areaPolygons.length === 0) return [];
      regions = intersectPolygonSets(regions, areaPolygons);
      if (regions.length === 0) return [];
    }
    return regions;
  }
  return resolveAreaElementPolygons(spec, element, resolver);
}

export function clipPolygonToAreaElement(
  spec: DiagramSpecV2,
  polygon: Coordinates[],
  element: DiagramElement,
  resolver: AreaPointResolver = defaultResolvePoint,
): Coordinates[] {
  if (curveActsAsArea(element)) {
    return clipSubjectToCurveAreaPolygons(polygon, curveAreaPolygons(spec, element, resolver));
  }
  if (element.kind === 'halfPlane' && element.refs.length >= 3) {
    const lineA = resolveRef(spec, element.refs[0], resolver);
    const lineB = resolveRef(spec, element.refs[1], resolver);
    const side = resolveRef(spec, element.refs[2], resolver);
    if (!lineA || !lineB || !side) return polygon;
    return clipPolygonByHalfPlane(polygon, lineA, lineB, side);
  }
  if (element.kind === 'circle' && element.refs.length >= 2) {
    const center = resolveRef(spec, element.refs[0], resolver);
    const boundary = resolveRef(spec, element.refs[1], resolver);
    if (!center || !boundary) return polygon;
    return clipPolygonToDisk(polygon, center, boundary);
  }
  const vertices = polygonVertices(spec, element, resolver);
  if (vertices) return clipPolygonToConvexRegion(polygon, vertices);
  if (element.kind === 'areaIntersection') {
    const regions = resolveAreaDisplayPolygons(spec, element, resolver);
    if (regions.length === 0) return [];
    if (regions.length === 1) return intersectPolygons(polygon, regions[0]);
    const parts = regions
      .map(region => intersectPolygons(polygon, region))
      .filter(part => part.length >= 3);
    if (parts.length === 0) return [];
    return parts.reduce((best, part) => (
      Math.abs(polygonSignedArea(part)) > Math.abs(polygonSignedArea(best)) ? part : best
    ));
  }
  return polygon;
}

export function resolveAreaDisplayPolygon(
  spec: DiagramSpecV2,
  element: DiagramElement,
  resolver: AreaPointResolver = defaultResolvePoint,
): Coordinates[] {
  const polygons = resolveAreaDisplayPolygons(spec, element, resolver);
  if (polygons.length === 0) return [];
  if (polygons.length === 1) return polygons[0];
  return polygons.reduce((best, polygon) => (
    Math.abs(polygonSignedArea(polygon)) > Math.abs(polygonSignedArea(best)) ? polygon : best
  ));
}

export function pointInsideAreaElement(
  spec: DiagramSpecV2,
  element: DiagramElement,
  point: Coordinates,
  resolver: AreaPointResolver = defaultResolvePoint,
): boolean {
  if (curveActsAsArea(element)) {
    return pointInCurveAreaPolygons(curveAreaPolygons(spec, element, resolver), point);
  }
  if (element.kind === 'halfPlane' && element.refs.length >= 3) {
    const lineA = resolveRef(spec, element.refs[0], resolver);
    const lineB = resolveRef(spec, element.refs[1], resolver);
    const side = resolveRef(spec, element.refs[2], resolver);
    return Boolean(lineA && lineB && side && pointInHalfPlane(lineA, lineB, side, point));
  }
  if (element.kind === 'circle' && element.refs.length >= 2) {
    const center = resolveRef(spec, element.refs[0], resolver);
    const boundary = resolveRef(spec, element.refs[1], resolver);
    return Boolean(center && boundary && pointInDisk(center, boundary, point));
  }
  const polygon = polygonVertices(spec, element, resolver);
  if (polygon) return pointInPolygon(polygon, point);
  if (element.kind === 'areaIntersection') {
    return element.refs.every(ref => {
      const area = spec.elements.find(item => item.id === ref);
      return area ? pointInsideAreaElement(spec, area, point, resolver) : false;
    });
  }
  return true;
}

export function constrainPointToAreaElement(
  spec: DiagramSpecV2,
  element: DiagramElement,
  point: Coordinates,
  resolver: AreaPointResolver = defaultResolvePoint,
): Coordinates {
  if (curveActsAsArea(element)) {
    return constrainToCurveAreaPolygons(curveAreaPolygons(spec, element, resolver), point);
  }
  if (element.kind === 'halfPlane' && element.refs.length >= 3) {
    const lineA = resolveRef(spec, element.refs[0], resolver);
    const lineB = resolveRef(spec, element.refs[1], resolver);
    const side = resolveRef(spec, element.refs[2], resolver);
    if (lineA && lineB && side) return constrainToHalfPlane(lineA, lineB, side, point);
    return point;
  }
  if (element.kind === 'circle' && element.refs.length >= 2) {
    const center = resolveRef(spec, element.refs[0], resolver);
    const boundary = resolveRef(spec, element.refs[1], resolver);
    if (center && boundary) return constrainToDisk(center, boundary, point);
    return point;
  }
  const polygon = polygonVertices(spec, element, resolver);
  if (polygon) return constrainToPolygon(polygon, point);
  if (element.kind === 'areaIntersection') {
    return element.refs.reduce((current, ref) => {
      const area = spec.elements.find(item => item.id === ref);
      return area ? constrainPointToAreaElement(spec, area, current, resolver) : current;
    }, point);
  }
  return point;
}

function pointOnSingleAreaBoundary(
  spec: DiagramSpecV2,
  element: DiagramElement,
  point: Coordinates,
  resolver: AreaPointResolver = defaultResolvePoint,
): boolean {
  if (curveActsAsArea(element)) {
    return curveAreaPolygons(spec, element, resolver).some(
      polygon => polygon.length >= 3 && pointOnPolygonBoundary(polygon, point),
    );
  }
  if (element.kind === 'halfPlane' && element.refs.length >= 3) {
    const lineA = resolveRef(spec, element.refs[0], resolver);
    const lineB = resolveRef(spec, element.refs[1], resolver);
    return Boolean(lineA && lineB && pointOnLine(lineA, lineB, point));
  }
  if (element.kind === 'circle' && element.refs.length >= 2) {
    const center = resolveRef(spec, element.refs[0], resolver);
    const boundary = resolveRef(spec, element.refs[1], resolver);
    return Boolean(center && boundary && pointOnDiskBoundary(center, boundary, point));
  }
  const polygon = polygonVertices(spec, element, resolver);
  if (polygon) return pointOnPolygonBoundary(polygon, point);
  return false;
}

function constrainToSingleAreaBoundary(
  spec: DiagramSpecV2,
  element: DiagramElement,
  point: Coordinates,
  resolver: AreaPointResolver = defaultResolvePoint,
): Coordinates {
  if (curveActsAsArea(element)) {
    const polygons = curveAreaPolygons(spec, element, resolver);
    if (polygons.length === 0) return point;
    let best = point;
    let bestDistance = Number.POSITIVE_INFINITY;
    polygons.forEach(polygon => {
      if (polygon.length < 3) return;
      const candidate = constrainToPolygonBoundary(polygon, point);
      const distance = Math.hypot(candidate.x - point.x, candidate.y - point.y);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = candidate;
      }
    });
    return best;
  }
  if (element.kind === 'halfPlane' && element.refs.length >= 3) {
    const lineA = resolveRef(spec, element.refs[0], resolver);
    const lineB = resolveRef(spec, element.refs[1], resolver);
    if (lineA && lineB) return constrainToLine(lineA, lineB, point);
    return point;
  }
  if (element.kind === 'circle' && element.refs.length >= 2) {
    const center = resolveRef(spec, element.refs[0], resolver);
    const boundary = resolveRef(spec, element.refs[1], resolver);
    if (center && boundary) return constrainToDiskBoundary(center, boundary, point);
    return point;
  }
  const polygon = polygonVertices(spec, element, resolver);
  if (polygon) return constrainToPolygonBoundary(polygon, point);
  return point;
}

export function pointOnAreaElementBoundary(
  spec: DiagramSpecV2,
  element: DiagramElement,
  point: Coordinates,
  resolver: AreaPointResolver = defaultResolvePoint,
): boolean {
  if (element.kind === 'areaIntersection') {
    if (!pointInsideAreaElement(spec, element, point, resolver)) return false;
    return element.refs.some(ref => {
      const area = spec.elements.find(item => item.id === ref);
      return area ? pointOnSingleAreaBoundary(spec, area, point, resolver) : false;
    });
  }
  return pointOnSingleAreaBoundary(spec, element, point, resolver);
}

export function constrainPointToAreaBoundary(
  spec: DiagramSpecV2,
  element: DiagramElement,
  point: Coordinates,
  resolver: AreaPointResolver = defaultResolvePoint,
): Coordinates {
  if (element.kind === 'areaIntersection') {
    let current = point;
    if (!pointInsideAreaElement(spec, element, current, resolver)) {
      current = constrainPointToAreaElement(spec, element, current, resolver);
    }
    if (pointOnAreaElementBoundary(spec, element, current, resolver)) return current;
    let best = current;
    let bestDistance = Number.POSITIVE_INFINITY;
    element.refs.forEach(ref => {
      const area = spec.elements.find(item => item.id === ref);
      if (!area) return;
      const candidate = constrainToSingleAreaBoundary(spec, area, current, resolver);
      if (!pointInsideAreaElement(spec, element, candidate, resolver)) return;
      const distance = Math.hypot(candidate.x - point.x, candidate.y - point.y);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = candidate;
      }
    });
    return best;
  }
  return constrainToSingleAreaBoundary(spec, element, point, resolver);
}

export function constrainPointForAreaMembership(
  spec: DiagramSpecV2,
  element: DiagramElement,
  point: Coordinates,
  membership: AreaMembership = 'interior',
  resolver: AreaPointResolver = defaultResolvePoint,
): Coordinates {
  if (membership === 'boundary') {
    if (pointOnAreaElementBoundary(spec, element, point, resolver)) return point;
    return constrainPointToAreaBoundary(spec, element, point, resolver);
  }
  if (pointInsideAreaElement(spec, element, point, resolver)) return point;
  return constrainPointToAreaElement(spec, element, point, resolver);
}
