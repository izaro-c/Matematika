import type { DiagramObject, PathObject } from '@/diagrams/model/schema/v3';

/**
 * Clasificación fina de los objetos V3 según su construcción. No es un formato
 * persistido: se deriva de `objectType` y de la geometría/definición de cada
 * objeto y sirve para herramientas del editor, etiquetas y capacidades.
 */
export const diagramConstructionKinds = [
  'segment', 'line', 'ray', 'polygon', 'circle', 'arc', 'functionCurve', 'parametricCurve',
  'poincareGeodesic', 'poincareArc', 'intersection', 'midpoint', 'perpendicularFoot',
  'segmentExtension', 'perpendicular', 'parallel', 'angleBisector', 'angle', 'nonReflexAngle',
  'rightAngle', 'congruenceMark', 'parallelMark', 'measureTicks', 'perpendicularMark', 'dimensionLine', 'measurement',
  'grid', 'areaDecomposition', 'halfPlane', 'areaIntersection', 'text', 'label', 'formula', 'infoPanel',
] as const;

export type DiagramConstructionKind = typeof diagramConstructionKinds[number];

/** `point` y `control` cubren los puntos con posición propia y los controles. */
export type DiagramObjectKind = 'point' | 'control' | DiagramConstructionKind;

export const constructedPointKinds = ['intersection', 'midpoint', 'perpendicularFoot'] as const satisfies readonly DiagramConstructionKind[];
export const annotationKinds = ['text', 'label', 'formula', 'infoPanel', 'measurement'] as const satisfies readonly DiagramConstructionKind[];
export const linearSupportKinds = ['segment', 'line', 'ray', 'perpendicular', 'parallel', 'angleBisector'] as const satisfies readonly DiagramConstructionKind[];

export function isConstructionKind(value: string): value is DiagramConstructionKind {
  return (diagramConstructionKinds as readonly string[]).includes(value);
}

function pathKind(geometry: PathObject['geometry']): DiagramObjectKind {
  switch (geometry.type) {
    case 'segment': return geometry.construction ? 'segmentExtension' : 'segment';
    case 'line':
      if (geometry.construction.type === 'perpendicular') return 'perpendicular';
      if (geometry.construction.type === 'parallel') return 'parallel';
      if (geometry.construction.type === 'angle-bisector') return 'angleBisector';
      return 'line';
    case 'ray': return 'ray';
    case 'polygon': return 'polygon';
    case 'circle': return 'circle';
    case 'arc': return 'arc';
    case 'function': return 'functionCurve';
    case 'parametric': return 'parametricCurve';
    case 'poincare-geodesic': return 'poincareGeodesic';
    case 'poincare-arc': return 'poincareArc';
    case 'dimension': return 'dimensionLine';
  }
}

export function objectKind(object: DiagramObject): DiagramObjectKind {
  switch (object.objectType) {
    case 'point':
      if (object.definition.type === 'intersection') return 'intersection';
      if (object.definition.type === 'midpoint') return 'midpoint';
      if (object.definition.type === 'projection') return 'perpendicularFoot';
      return 'point';
    case 'control':
      return 'control';
    case 'path':
      return pathKind(object.geometry);
    case 'angle':
      if (object.marker === 'square') return 'rightAngle';
      return object.sweep === 'directed' ? 'angle' : 'nonReflexAngle';
    case 'mark':
      if (object.variant === 'congruence') return 'congruenceMark';
      if (object.variant === 'parallel') return 'parallelMark';
      return 'measureTicks';
    case 'annotation':
      return object.variant === 'panel' ? 'infoPanel' : object.variant;
    case 'region':
      return object.geometry.type === 'grid-region' ? 'grid' : 'areaDecomposition';
    case 'area':
      return object.geometry.type === 'half-plane' ? 'halfPlane' : 'areaIntersection';
  }
}

export function isAnnotationKind(kind: DiagramObjectKind): boolean {
  return (annotationKinds as readonly string[]).includes(kind);
}
