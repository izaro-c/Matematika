import type { DiagramObject, DiagramRelation, DiagramSpecV3, PointObject } from '@/diagrams/model/schema/v3';
import { pointRelationIds, segmentEndpoints } from '@/diagrams/model/objects/queries';

export type RelationOf<T extends DiagramRelation['type']> = Extract<DiagramRelation, { type: T }>;

/**
 * Relaciones de perpendicularidad que solo documentan un marcador de ángulo
 * recto. No restringen puntos en tiempo de ejecución ni se editan por separado.
 */
export function angleMarkerRelationIds(spec: Pick<DiagramSpecV3, 'objects'>): Set<string> {
  return new Set(spec.objects.flatMap(object => (
    object.objectType === 'angle' && object.marker === 'square' && object.perpendicularRelationId
      ? [object.perpendicularRelationId]
      : []
  )));
}

/** Relaciones que participan en el motor de restricciones (excluye las de marcadores). */
export function sceneRelations(spec: Pick<DiagramSpecV3, 'objects' | 'relations'>): DiagramRelation[] {
  const markers = angleMarkerRelationIds(spec);
  return markers.size === 0 ? spec.relations : spec.relations.filter(relation => !markers.has(relation.id));
}

/** Relaciones activas asociadas a un punto restringido, en el orden de su movilidad. */
export function pointActiveRelations(spec: Pick<DiagramSpecV3, 'objects' | 'relations'>, point: PointObject): DiagramRelation[] {
  const relations = sceneRelations(spec);
  return pointRelationIds(point)
    .map(relationId => relations.find(relation => relation.id === relationId && relation.enabled))
    .filter((relation): relation is DiagramRelation => Boolean(relation));
}

export interface EqualLengthRoles {
  driven: string;
  anchor: string;
  /** Segmento cuya longitud se copia. */
  source: string;
}

export function equalLengthRoles(relation: RelationOf<'equal-length'>, objects: readonly DiagramObject[]): EqualLengthRoles {
  const endpoints = segmentEndpoints(objects.find(object => object.id === relation.segments[0])) ?? relation.segments;
  const driven = relation.drivenPoint ?? endpoints[0];
  const anchor = endpoints.find(id => id !== driven) ?? endpoints[1];
  return { driven, anchor, source: relation.segments[1] };
}

export interface EqualAngleRoles {
  driven: string;
  vertex: string;
  /** Punto del lado que no se mueve en el ángulo objetivo. */
  fixed: string;
  /** Ángulo cuya amplitud se copia. */
  source: string;
  /** Ángulo que se ajusta moviendo `driven`. */
  target: string;
}

export function equalAngleRoles(relation: RelationOf<'equal-angle'>, objects: readonly DiagramObject[]): EqualAngleRoles {
  const target = objects.find(object => object.id === relation.angles[0]);
  const targetAngle = target?.objectType === 'angle' ? target : undefined;
  const driven = relation.drivenPoint ?? targetAngle?.points[0] ?? relation.angles[0];
  const vertex = targetAngle?.points[1] ?? driven;
  const fixed = targetAngle?.points.find(point => point !== driven && point !== vertex) ?? driven;
  return { driven, vertex, fixed, source: relation.angles[1], target: relation.angles[0] };
}

export interface LinearRelationRoles {
  driven: string;
  /** Recta base `a → b`: el punto se proyecta sobre la paralela/perpendicular por `a`. */
  a: string;
  b: string;
}

/** Roles de `perpendicular`/`parallel` cuando se expresan con pares de puntos. */
export function linearRelationRoles(relation: RelationOf<'perpendicular' | 'parallel'>): LinearRelationRoles | undefined {
  if (typeof relation.supports[0] === 'string') return undefined;
  const [first, second] = relation.supports as [[string, string], [string, string]];
  return { driven: first[0], a: first[1], b: second[1] };
}

export interface SameSideRoles {
  point: string;
  lineA: string;
  lineB: string;
}

/** `same-half-plane`: `points[0]` no cruza la recta `points[1]`–`boundary`. */
export function sameSideRoles(relation: RelationOf<'same-half-plane'>): SameSideRoles {
  return { point: relation.points[0], lineA: relation.points[1], lineB: relation.boundary };
}

export interface DiskRoles {
  point: string;
  center: string;
  boundary: string;
}

export function insideDiskRoles(relation: RelationOf<'inside-disk'>, objects: readonly DiagramObject[]): DiskRoles {
  if (typeof relation.disk !== 'string') return { point: relation.point, center: relation.disk.center, boundary: relation.disk.boundary };
  const disk = objects.find(object => object.id === relation.disk);
  if (disk?.objectType === 'path' && disk.geometry.type === 'circle') {
    return { point: relation.point, center: disk.geometry.center, boundary: disk.geometry.point };
  }
  return { point: relation.point, center: relation.disk, boundary: relation.disk };
}

/**
 * Punto restringido por la relación y referencias de las que depende. Es la
 * lectura que usan el grafo de dependencias y el motor de restricciones.
 */
export function relationParticipants(
  relation: DiagramRelation,
  objects: readonly DiagramObject[],
): { target: string | undefined; sources: string[] } {
  switch (relation.type) {
    case 'coincident':
    case 'coordinate-equality':
    case 'distance':
      return { target: relation.points[0], sources: [relation.points[1]] };
    case 'on-support':
      return { target: relation.point, sources: [relation.support] };
    case 'equal-length': {
      const roles = equalLengthRoles(relation, objects);
      return { target: roles.driven, sources: [roles.anchor, roles.source] };
    }
    case 'equal-angle': {
      const roles = equalAngleRoles(relation, objects);
      return { target: roles.driven, sources: [roles.vertex, roles.fixed, roles.source] };
    }
    case 'perpendicular':
    case 'parallel': {
      const roles = linearRelationRoles(relation);
      if (roles) return { target: roles.driven, sources: [roles.a, roles.b] };
      const [first, second] = relation.supports as [string, string];
      return { target: first, sources: [second] };
    }
    case 'inside-disk': {
      const roles = insideDiskRoles(relation, objects);
      return { target: roles.point, sources: [roles.center, roles.boundary] };
    }
    case 'same-half-plane':
      return { target: relation.points[0], sources: [relation.points[1], relation.boundary] };
    case 'inside-area':
      return { target: relation.point, sources: [relation.area] };
    case 'reflection':
    case 'expression':
      return { target: relation.refs[0], sources: relation.refs.slice(1) };
  }
}

/** Todas las referencias de una relación, sin orden semántico (renombrados, borrados). */
export function relationReferences(relation: DiagramRelation): string[] {
  switch (relation.type) {
    case 'coincident':
    case 'coordinate-equality':
    case 'distance':
      return [...relation.points];
    case 'on-support': return [relation.point, relation.support];
    case 'equal-length': return [...relation.segments, ...(relation.drivenPoint ? [relation.drivenPoint] : [])];
    case 'equal-angle': return [...relation.angles, ...(relation.drivenPoint ? [relation.drivenPoint] : [])];
    case 'perpendicular':
    case 'parallel':
      return (relation.supports as Array<string | [string, string]>).flatMap(support => typeof support === 'string' ? [support] : [...support]);
    case 'inside-disk': return [relation.point, ...(typeof relation.disk === 'string' ? [relation.disk] : [relation.disk.center, relation.disk.boundary])];
    case 'same-half-plane': return [...relation.points, relation.boundary];
    case 'inside-area': return [relation.point, relation.area];
    case 'reflection':
      return [...relation.refs, ...(relation.centerOrAxis ? [relation.centerOrAxis] : []), ...(relation.drivenPoint ? [relation.drivenPoint] : [])];
    case 'expression': return [...relation.refs];
  }
}
