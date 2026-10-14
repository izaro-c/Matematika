import {
  equalAngleRoles,
  equalLengthRoles,
  insideDiskRoles,
  linearRelationRoles,
  objectConstructionReferences,
  objectKind,
  relationParticipants,
  type AreaMembership,
  type DiagramObject,
  type DiagramRelation,
} from '@/diagrams';

/**
 * Intención de relación que ofrece el editor. Cada intención se guarda como
 * una relación V3 (`buildRelation`) salvo `fixed` y `midpoint`, que cambian la
 * movilidad o la definición del punto (ver `applyRelationIntent`).
 */
export type RelationIntent =
  | 'fixed'
  | 'horizontal'
  | 'vertical'
  | 'coincident'
  | 'on'
  | 'distance'
  | 'equalLength'
  | 'equalAngle'
  | 'midpoint'
  | 'perpendicular'
  | 'parallel'
  | 'insideDisk'
  | 'sameSide'
  | 'insideArea'
  | 'reflection'
  | 'expression';

/** Datos numéricos o simbólicos que acompañan a algunas intenciones. */
export interface RelationExtras {
  value?: number;
  expression?: string;
  side?: 1 | -1;
  areaMembership?: AreaMembership;
}

export function relationIntent(relation: DiagramRelation): RelationIntent {
  switch (relation.type) {
    case 'coordinate-equality': return relation.axis === 'y' ? 'horizontal' : 'vertical';
    case 'on-support': return 'on';
    case 'equal-length': return 'equalLength';
    case 'equal-angle': return 'equalAngle';
    case 'inside-disk': return 'insideDisk';
    case 'same-half-plane': return 'sameSide';
    case 'inside-area': return 'insideArea';
    default: return relation.type;
  }
}

/**
 * Referencias de la relación en el orden de los huecos del editor: el punto
 * restringido primero y después sus referencias.
 */
export function relationSlotRefs(relation: DiagramRelation, objects: readonly DiagramObject[]): string[] {
  switch (relation.type) {
    case 'coincident':
    case 'coordinate-equality':
    case 'distance':
      return [...relation.points];
    case 'on-support': return [relation.point, relation.support];
    case 'equal-length': {
      const roles = equalLengthRoles(relation, objects);
      return [roles.driven, roles.anchor, roles.source];
    }
    case 'equal-angle': {
      const roles = equalAngleRoles(relation, objects);
      return [roles.driven, roles.vertex, roles.fixed, roles.source, roles.target];
    }
    case 'perpendicular':
    case 'parallel': {
      const roles = linearRelationRoles(relation);
      return roles ? [roles.driven, roles.a, roles.b] : [...relation.supports as [string, string]];
    }
    case 'inside-disk': {
      if (typeof relation.disk === 'string') return [relation.point, relation.disk, relation.disk];
      const roles = insideDiskRoles(relation, objects);
      return [roles.point, roles.center, roles.boundary];
    }
    case 'same-half-plane': return [...relation.points, relation.boundary];
    case 'inside-area': return [relation.point, relation.area];
    case 'reflection':
    case 'expression':
      return [...relation.refs];
  }
}

export function relationExtras(relation: DiagramRelation): RelationExtras {
  return {
    ...('value' in relation && relation.value !== undefined ? { value: relation.value } : {}),
    ...('expression' in relation && relation.expression ? { expression: relation.expression } : {}),
    ...(relation.type === 'same-half-plane' && relation.side !== undefined ? { side: relation.side } : {}),
    ...(relation.type === 'inside-area' && relation.membership ? { areaMembership: relation.membership } : {}),
  };
}

/** Punto que restringe la relación. */
export function relationSubjectId(relation: DiagramRelation, objects: readonly DiagramObject[]): string | undefined {
  return relationParticipants(relation, objects).target;
}

function segmentThrough(objects: readonly DiagramObject[], first: string, second: string): string | undefined {
  return objects.find(object => {
    if (objectKind(object) !== 'segment') return false;
    const refs = objectConstructionReferences(object);
    return refs.includes(first) && refs.includes(second);
  })?.id;
}

/**
 * Construye la relación V3 de una intención a partir de sus huecos ordenados.
 * Devuelve `null` para `fixed` y `midpoint`, que no son relaciones en V3.
 */
export function buildRelation(
  intent: RelationIntent,
  id: string,
  label: string,
  refs: readonly string[],
  objects: readonly DiagramObject[],
  extras: RelationExtras = {},
  enabled = true,
): DiagramRelation | null {
  const base = { id, label, enabled };
  const [first, second, third, fourth, fifth] = refs;
  switch (intent) {
    case 'fixed':
    case 'midpoint':
      return null;
    case 'horizontal':
    case 'vertical':
      return { ...base, type: 'coordinate-equality', axis: intent === 'horizontal' ? 'y' : 'x', points: [first, second] };
    case 'coincident':
      return { ...base, type: 'coincident', points: [first, second] };
    case 'on':
      return { ...base, type: 'on-support', point: first, support: second };
    case 'distance':
      return {
        ...base,
        type: 'distance',
        points: [first, second],
        ...(extras.value !== undefined ? { value: extras.value } : {}),
        ...(extras.expression ? { expression: extras.expression } : {}),
      };
    case 'equalLength':
      return { ...base, type: 'equal-length', segments: [segmentThrough(objects, first, second) ?? second, third], drivenPoint: first };
    case 'equalAngle':
      return { ...base, type: 'equal-angle', angles: [fifth, fourth], drivenPoint: first };
    case 'perpendicular':
    case 'parallel':
      return { ...base, type: intent, supports: [[first, second], [first, third]] };
    case 'insideDisk':
      return { ...base, type: 'inside-disk', point: first, disk: { center: second, boundary: third } };
    case 'sameSide':
      return { ...base, type: 'same-half-plane', points: [first, second], boundary: third, ...(extras.side !== undefined ? { side: extras.side } : {}) };
    case 'insideArea':
      return {
        ...base,
        type: 'inside-area',
        point: first,
        area: second,
        ...(extras.areaMembership && extras.areaMembership !== 'interior' ? { membership: extras.areaMembership } : {}),
      };
    case 'reflection':
      return { ...base, type: 'reflection', refs: [...refs] };
    case 'expression':
      return { ...base, type: 'expression', refs: [...refs], expression: extras.expression ?? '0', ...(extras.value !== undefined ? { value: extras.value } : {}) };
  }
}

/**
 * Forma editable de una relación: intención y huecos ordenados. Es el estado de
 * los formularios del editor; se guarda siempre como relación V3 (`draftToRelation`).
 */
export interface RelationDraft extends RelationExtras {
  id: string;
  label: string;
  kind: RelationIntent;
  refs: string[];
  enabled: boolean;
}

export function relationDraft(relation: DiagramRelation, objects: readonly DiagramObject[]): RelationDraft {
  return {
    id: relation.id,
    label: relation.label,
    kind: relationIntent(relation),
    refs: relationSlotRefs(relation, objects),
    enabled: relation.enabled,
    ...relationExtras(relation),
  };
}

export function draftToRelation(draft: RelationDraft, objects: readonly DiagramObject[]): DiagramRelation | null {
  return buildRelation(draft.kind, draft.id, draft.label, draft.refs, objects, draft, draft.enabled);
}
