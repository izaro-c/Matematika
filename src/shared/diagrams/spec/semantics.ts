import type { DiagramElement, DiagramElementKind, DiagramPoint, DiagramSceneItem, DiagramSpecV2 } from './types';
import type { DiagramObject } from './v3';

export type DiagramCapability = 'point' | 'linear-support' | 'support' | 'segment' | 'circle' | 'angle' | 'path' | 'area' | 'measurable' | 'annotatable' | 'control';

export interface DiagramReferenceSlot {
  key: string;
  label: string;
  capability: DiagramCapability;
  optional?: boolean;
  repeatable?: boolean;
  /** Mínimo de slots repetibles exigidos además de los fijos (por defecto 2). */
  minimumRepeatable?: number;
}

const pointSlot = (key: string, label: string): DiagramReferenceSlot => ({ key, label, capability: 'point' });

const legacySlots: Record<DiagramElementKind, readonly DiagramReferenceSlot[]> = {
  segment: [pointSlot('start', 'Extremo inicial'), pointSlot('end', 'Extremo final')],
  line: [pointSlot('first', 'Primer punto'), pointSlot('second', 'Segundo punto')],
  ray: [pointSlot('origin', 'Origen'), pointSlot('direction', 'Punto de dirección')],
  polygon: [pointSlot('vertex-1', 'Primer vértice'), { ...pointSlot('vertex', 'Vértice'), repeatable: true, minimumRepeatable: 2 }],
  circle: [pointSlot('center', 'Centro'), pointSlot('radius-point', 'Punto de la circunferencia')],
  arc: [pointSlot('center', 'Centro'), pointSlot('start', 'Inicio'), pointSlot('end', 'Final')],
  functionCurve: [{ ...pointSlot('side', 'Punto del semiplano'), optional: true }],
  parametricCurve: [{ ...pointSlot('side', 'Punto del semiplano'), optional: true }],
  poincareGeodesic: [pointSlot('boundary-1', 'Primer punto de frontera'), pointSlot('boundary-2', 'Segundo punto de frontera'), pointSlot('start', 'Primer extremo'), pointSlot('end', 'Segundo extremo')],
  poincareArc: [pointSlot('boundary-1', 'Primer punto de frontera'), pointSlot('boundary-2', 'Segundo punto de frontera'), pointSlot('start', 'Inicio'), pointSlot('end', 'Final')],
  intersection: [{ key: 'support-1', label: 'Primer soporte', capability: 'linear-support' }, { key: 'support-2', label: 'Segundo soporte', capability: 'linear-support' }],
  midpoint: [pointSlot('first', 'Primer extremo'), pointSlot('second', 'Segundo extremo')],
  perpendicularFoot: [pointSlot('line-1', 'Primer punto de la base'), pointSlot('line-2', 'Segundo punto de la base'), pointSlot('point', 'Punto proyectado')],
  baseExtension: [pointSlot('start', 'Primer extremo'), pointSlot('end', 'Segundo extremo'), pointSlot('foot', 'Extremo de la prolongación')],
  perpendicular: [pointSlot('line-1', 'Primer punto de la recta'), pointSlot('line-2', 'Segundo punto de la recta'), pointSlot('through', 'Punto de paso')],
  parallel: [pointSlot('line-1', 'Primer punto de la recta'), pointSlot('line-2', 'Segundo punto de la recta'), pointSlot('through', 'Punto de paso')],
  angleBisector: [pointSlot('side-1', 'Punto del primer lado'), pointSlot('vertex', 'Vértice'), pointSlot('side-2', 'Punto del segundo lado')],
  angle: [pointSlot('side-1', 'Punto del primer lado'), pointSlot('vertex', 'Vértice'), pointSlot('side-2', 'Punto del segundo lado')],
  nonReflexAngle: [pointSlot('side-1', 'Punto del primer lado'), pointSlot('vertex', 'Vértice'), pointSlot('side-2', 'Punto del segundo lado')],
  rightAngle: [pointSlot('side-1', 'Punto del primer lado'), pointSlot('vertex', 'Vértice'), pointSlot('side-2', 'Punto del segundo lado')],
  congruenceMark: [pointSlot('start', 'Primer extremo'), pointSlot('end', 'Segundo extremo')],
  parallelMark: [pointSlot('start', 'Primer extremo'), pointSlot('end', 'Segundo extremo')],
  measureTicks: [{ key: 'segment', label: 'Segmento graduado', capability: 'segment' }],
  perpendicularMark: [pointSlot('side-1', 'Punto del primer lado'), pointSlot('vertex', 'Vértice'), pointSlot('side-2', 'Punto del segundo lado')],
  dimensionLine: [pointSlot('start', 'Primer extremo'), pointSlot('end', 'Segundo extremo')],
  measurement: [pointSlot('start', 'Primer punto'), pointSlot('end', 'Segundo punto')],
  grid: [pointSlot('corner-1', 'Primera esquina'), pointSlot('corner-2', 'Segunda esquina'), pointSlot('corner-3', 'Tercera esquina'), pointSlot('corner-4', 'Cuarta esquina')],
  areaDecomposition: [pointSlot('vertex-1', 'Primer vértice'), { ...pointSlot('vertex', 'Vértice'), repeatable: true, minimumRepeatable: 2 }],
  halfPlane: [pointSlot('boundary-1', 'Primer punto de la frontera'), pointSlot('boundary-2', 'Segundo punto de la frontera'), pointSlot('side', 'Punto del semiplano')],
  areaIntersection: [
    { key: 'area-1', label: 'Primera área', capability: 'area' },
    { key: 'area-2', label: 'Segunda área', capability: 'area' },
    { key: 'area', label: 'Área adicional', capability: 'area', repeatable: true, optional: true, minimumRepeatable: 0 },
  ],
  text: [{ key: 'anchor', label: 'Anclaje', capability: 'point' }],
  label: [{ key: 'anchor', label: 'Objeto etiquetado', capability: 'annotatable' }],
  formula: [{ key: 'anchor', label: 'Anclaje', capability: 'point' }],
  infoPanel: [{ key: 'anchor', label: 'Objeto de referencia', capability: 'annotatable', optional: true }],
};

export function referenceSlotsForLegacyKind(kind: DiagramElementKind): readonly DiagramReferenceSlot[] {
  return legacySlots[kind] ?? [];
}

export function legacyElementCapabilities(kind: DiagramElementKind): ReadonlySet<DiagramCapability> {
  const capabilities = new Set<DiagramCapability>(['annotatable']);
  if (['intersection', 'midpoint', 'perpendicularFoot'].includes(kind)) capabilities.add('point');
  if (['segment', 'line', 'ray', 'perpendicular', 'parallel', 'angleBisector'].includes(kind)) capabilities.add('linear-support');
  if (['segment', 'line', 'ray', 'circle', 'arc', 'functionCurve', 'parametricCurve', 'perpendicular', 'parallel', 'angleBisector', 'poincareGeodesic', 'poincareArc'].includes(kind)) capabilities.add('support');
  if (['segment', 'line', 'ray', 'circle', 'arc', 'functionCurve', 'parametricCurve', 'polygon', 'dimensionLine', 'perpendicular', 'parallel', 'angleBisector'].includes(kind)) capabilities.add('path');
  if (kind === 'segment') capabilities.add('segment');
  if (kind === 'circle') capabilities.add('circle');
  if (['angle', 'nonReflexAngle', 'rightAngle', 'perpendicularMark'].includes(kind)) capabilities.add('angle');
  if (['grid', 'areaDecomposition', 'halfPlane', 'areaIntersection'].includes(kind)) capabilities.add('area');
  if (kind === 'polygon' || kind === 'circle') capabilities.add('area');
  if (['functionCurve', 'parametricCurve'].includes(kind)) capabilities.add('area');
  if (['segment', 'circle', 'angle', 'nonReflexAngle', 'measurement'].includes(kind)) capabilities.add('measurable');
  return capabilities;
}

export function legacyItemHasCapability(item: DiagramSceneItem, capability: DiagramCapability): boolean {
  if (!('kind' in item)) {
    if ('min' in item) return capability === 'control' || capability === 'measurable' || capability === 'annotatable';
    return capability === 'point' || capability === 'measurable' || capability === 'annotatable';
  }
  return legacyElementCapabilities(item.kind).has(capability);
}

export function legacyReferenceCandidates(model: DiagramSpecV2, capability: DiagramCapability): Array<DiagramPoint | DiagramElement | DiagramSpecV2['sliders'][number]> {
  return [...model.points, ...model.elements, ...model.sliders].filter(item => legacyItemHasCapability(item, capability));
}

export function objectCapabilities(object: DiagramObject): ReadonlySet<DiagramCapability> {
  const capabilities = new Set<DiagramCapability>(['annotatable']);
  if (object.objectType === 'point') capabilities.add('point');
  if (object.objectType === 'path') {
    capabilities.add('path'); capabilities.add('support');
    if (['segment', 'line', 'ray'].includes(object.geometry.type)) capabilities.add('linear-support');
    if (object.geometry.type === 'segment') capabilities.add('segment');
    if (object.geometry.type === 'circle') capabilities.add('circle');
    if (object.geometry.type === 'polygon' || object.geometry.type === 'circle') capabilities.add('area');
    if (['segment', 'circle'].includes(object.geometry.type)) capabilities.add('measurable');
  }
  if (object.objectType === 'angle') { capabilities.add('angle'); capabilities.add('measurable'); }
  if (object.objectType === 'region' || object.objectType === 'area') capabilities.add('area');
  if (object.objectType === 'control') { capabilities.add('control'); capabilities.add('measurable'); }
  return capabilities;
}

export function objectHasCapability(object: DiagramObject, capability: DiagramCapability): boolean {
  return objectCapabilities(object).has(capability);
}

export function isPoint(object: DiagramObject): boolean { return objectHasCapability(object, 'point'); }
export function isLinearSupport(object: DiagramObject): boolean { return objectHasCapability(object, 'linear-support'); }
export function isMeasurable(object: DiagramObject): boolean { return objectHasCapability(object, 'measurable'); }
