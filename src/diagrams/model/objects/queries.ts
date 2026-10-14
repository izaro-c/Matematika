import type {
  AngleObject,
  AnnotationObject,
  AreaObject,
  ControlObject,
  DiagramObject,
  DiagramSpecV3,
  MarkObject,
  PathObject,
  PointDefinition,
  PointObject,
  RegionObject,
} from '@/diagrams/model/schema/v3';

export type PointWithDefinition<T extends PointDefinition['type']> = PointObject & {
  definition: Extract<PointDefinition, { type: T }>;
};

/** Punto con posición propia: coordenadas libres o expresión con respaldo numérico. */
export type PositionedPoint = PointWithDefinition<'coordinates' | 'expression'>;
/** Punto calculado a partir de otros objetos (intersección, punto medio o proyección). */
export type ConstructedPoint = PointWithDefinition<'intersection' | 'midpoint' | 'projection'>;

export type ObjectIndex = ReadonlyMap<string, DiagramObject>;

type Coordinates = { x: number; y: number };

export function isPointObject(object: DiagramObject | undefined): object is PointObject {
  return object?.objectType === 'point';
}

export function isPositionedPoint(object: DiagramObject | undefined): object is PositionedPoint {
  return object?.objectType === 'point'
    && (object.definition.type === 'coordinates' || object.definition.type === 'expression');
}

export function isConstructedPoint(object: DiagramObject | undefined): object is ConstructedPoint {
  return object?.objectType === 'point'
    && (object.definition.type === 'intersection' || object.definition.type === 'midpoint' || object.definition.type === 'projection');
}

export function isExpressionPoint(object: DiagramObject | undefined): object is PointWithDefinition<'expression'> {
  return object?.objectType === 'point' && object.definition.type === 'expression';
}

export function isPathObject(object: DiagramObject | undefined): object is PathObject {
  return object?.objectType === 'path';
}

export function isAngleObject(object: DiagramObject | undefined): object is AngleObject {
  return object?.objectType === 'angle';
}

export function isRegionObject(object: DiagramObject | undefined): object is RegionObject {
  return object?.objectType === 'region';
}

export function isAreaObject(object: DiagramObject | undefined): object is AreaObject {
  return object?.objectType === 'area';
}

export function isMarkObject(object: DiagramObject | undefined): object is MarkObject {
  return object?.objectType === 'mark';
}

export function isAnnotationObject(object: DiagramObject | undefined): object is AnnotationObject {
  return object?.objectType === 'annotation';
}

export function isControlObject(object: DiagramObject | undefined): object is ControlObject {
  return object?.objectType === 'control';
}

export function isSliderControl(object: DiagramObject | undefined): object is ControlObject {
  return object?.objectType === 'control' && object.variant !== 'button';
}

export function isButtonControl(object: DiagramObject | undefined): object is ControlObject {
  return object?.objectType === 'control' && object.variant === 'button';
}

/** Objeto que se dibuja como punto (con posición propia o construido). */
export function isPointLike(object: DiagramObject | undefined): object is PointObject {
  return isPointObject(object);
}

export function objectIndex(spec: Pick<DiagramSpecV3, 'objects'>): Map<string, DiagramObject> {
  return new Map(spec.objects.map(object => [object.id, object]));
}

export function findObject(spec: Pick<DiagramSpecV3, 'objects'>, id: string | undefined): DiagramObject | undefined {
  return id === undefined ? undefined : spec.objects.find(object => object.id === id);
}

export function positionedPoints(spec: Pick<DiagramSpecV3, 'objects'>): PositionedPoint[] {
  return spec.objects.filter(isPositionedPoint);
}

export function controlObjects(spec: Pick<DiagramSpecV3, 'objects'>): ControlObject[] {
  return spec.objects.filter(isControlObject);
}

/** Posición persistida del punto: coordenadas, o el respaldo de una expresión. */
export function pointPosition(point: PointObject): Coordinates | undefined {
  if (point.definition.type === 'coordinates') return { x: point.definition.x, y: point.definition.y };
  if (point.definition.type === 'expression') return { x: point.definition.fallback[0], y: point.definition.fallback[1] };
  return undefined;
}

/** Devuelve el punto con una nueva posición persistida; los puntos construidos no cambian. */
export function withPointPosition<T extends PointObject>(point: T, coordinates: Coordinates): T {
  if (point.definition.type === 'coordinates') {
    return { ...point, definition: { ...point.definition, x: coordinates.x, y: coordinates.y } };
  }
  if (point.definition.type === 'expression') {
    return { ...point, definition: { ...point.definition, fallback: [coordinates.x, coordinates.y] } };
  }
  return point;
}

/** Un punto no se arrastra si es fijo, se calcula por expresión o se construye desde otros objetos. */
export function pointIsImmovable(point: PointObject): boolean {
  return point.mobility.type === 'fixed' || point.definition.type !== 'coordinates';
}

/** Soporte sobre el que desliza un punto con movilidad `on-support`. */
export function pointGliderSupportId(point: PointObject): string | undefined {
  return point.mobility.type === 'on-support' ? point.mobility.support : undefined;
}

export function pointRelationIds(point: PointObject): string[] {
  return point.mobility.type === 'constrained' ? point.mobility.relationIds : [];
}

export function objectLabelVisible(object: DiagramObject): boolean | undefined {
  if (object.objectType === 'control') return undefined;
  if (object.objectType === 'region' || object.objectType === 'area' || object.objectType === 'mark') return undefined;
  return object.appearance?.labelVisible;
}

export function objectDashed(object: DiagramObject): boolean {
  return object.objectType === 'path' && object.appearance?.dashed === true;
}

/** Texto visible de una anotación o de una cota. */
export function objectText(object: DiagramObject): string | undefined {
  if (object.objectType === 'annotation') return object.content.text;
  if (object.objectType === 'path' && object.geometry.type === 'dimension') return object.geometry.text;
  return undefined;
}

/** Puntos que delimitan el anclaje de una anotación: los medidos o el objeto anclado. */
export function annotationAnchorRefs(annotation: AnnotationObject): string[] {
  if (annotation.measurement?.refs) return [...annotation.measurement.refs];
  return annotation.anchor.type === 'object' ? [annotation.anchor.object] : [];
}

export function annotationAnchorParameter(annotation: AnnotationObject): number | undefined {
  return annotation.anchor.type === 'object' ? annotation.anchor.parameter : undefined;
}

export function annotationViewportPosition(annotation: AnnotationObject): [number, number] | undefined {
  return annotation.anchor.type === 'viewport' ? annotation.anchor.position : undefined;
}

/** Extremos de la recta que soporta un objeto lineal simple (segmento, recta por dos puntos o semirrecta). */
export function simpleLinearPoints(object: DiagramObject | undefined): [string, string] | undefined {
  if (object?.objectType !== 'path') return undefined;
  const geometry = object.geometry;
  if (geometry.type === 'segment' || geometry.type === 'ray') return geometry.points;
  if (geometry.type === 'line' && geometry.construction.type === 'through-points') return geometry.construction.points;
  return undefined;
}

/** Segmento simple (sin prolongación construida). */
export function isPlainSegment(object: DiagramObject | undefined): object is PathObject & { geometry: { type: 'segment'; points: [string, string] } } {
  return object?.objectType === 'path' && object.geometry.type === 'segment' && !object.geometry.construction;
}

export function segmentEndpoints(object: DiagramObject | undefined): [string, string] | undefined {
  if (!isPlainSegment(object)) return undefined;
  const [first, second] = object.geometry.points;
  return first && second ? [first, second] : undefined;
}

export function isCurvePath(object: DiagramObject | undefined): object is PathObject & { geometry: { type: 'function' | 'parametric' } } {
  return object?.objectType === 'path' && (object.geometry.type === 'function' || object.geometry.type === 'parametric');
}

export function isMeasurableAngle(object: DiagramObject | undefined): object is AngleObject {
  return object?.objectType === 'angle' && object.marker === 'arc';
}

export function angleSweep(angle: AngleObject): 'angle' | 'nonReflexAngle' {
  return angle.sweep === 'directed' ? 'angle' : 'nonReflexAngle';
}

export function angleIsClockwise(angle: AngleObject): boolean {
  return angle.direction === 'clockwise';
}
