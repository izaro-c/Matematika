import type { DiagramObject, DiagramRelation, PointObject } from '@/diagrams/model/schema/v3';

type IdMap = (id: string) => string;

/** Copia superficial sin las claves indicadas. */
export function omitKeys<T extends object, K extends PropertyKey>(value: T, ...keys: K[]): Omit<T, K> {
  const copy = { ...value } as Record<PropertyKey, unknown>;
  keys.forEach(key => delete copy[key]);
  return copy as Omit<T, K>;
}

function mapPair(pair: readonly [string, string], map: IdMap): [string, string] {
  return [map(pair[0]), map(pair[1])];
}

function mapPointDefinition(definition: PointObject['definition'], map: IdMap): PointObject['definition'] {
  switch (definition.type) {
    case 'intersection': return { ...definition, supports: mapPair(definition.supports, map) };
    case 'midpoint': return { ...definition, points: mapPair(definition.points, map) };
    case 'projection': return {
      ...definition,
      point: map(definition.point),
      support: typeof definition.support === 'string' ? map(definition.support) : { points: mapPair(definition.support.points, map) },
    };
    default: return definition;
  }
}

/** Sustituye todas las referencias a otros objetos o relaciones de un objeto. */
export function mapObjectReferences<T extends DiagramObject>(object: T, map: IdMap): T {
  const base = { ...object, layerId: map(object.layerId), groupIds: object.groupIds.map(map), ...(object.targetId ? { targetId: map(object.targetId) } : {}) };
  switch (base.objectType) {
    case 'point': {
      const mobility = base.mobility.type === 'on-support'
        ? { ...base.mobility, support: map(base.mobility.support) }
        : base.mobility.type === 'on-points'
          ? { ...base.mobility, points: base.mobility.points.map(map) }
          : base.mobility.type === 'constrained'
            ? { ...base.mobility, relationIds: base.mobility.relationIds.map(map) }
            : base.mobility;
      return {
        ...base,
        definition: mapPointDefinition(base.definition, map),
        mobility,
        ...(base.interaction?.attractorIds ? { interaction: { ...base.interaction, attractorIds: base.interaction.attractorIds.map(map) } } : {}),
      } as T;
    }
    case 'path': {
      const geometry = base.geometry;
      let next: typeof geometry;
      switch (geometry.type) {
        case 'segment':
          next = { ...geometry, points: mapPair(geometry.points, map), ...(geometry.construction ? { construction: { ...geometry.construction, foot: map(geometry.construction.foot) } } : {}) };
          break;
        case 'line': {
          const construction = geometry.construction;
          next = {
            ...geometry,
            construction: construction.type === 'through-points'
              ? { ...construction, points: mapPair(construction.points, map) }
              : construction.type === 'angle-bisector'
                ? { ...construction, points: construction.points.map(map) as [string, string, string] }
                : { ...construction, linePoints: mapPair(construction.linePoints, map), through: map(construction.through) },
          };
          break;
        }
        case 'ray': next = { ...geometry, points: mapPair(geometry.points, map) }; break;
        case 'polygon': next = { ...geometry, points: geometry.points.map(map) as [string, string, string, ...string[]] }; break;
        case 'circle': next = { ...geometry, center: map(geometry.center), point: map(geometry.point) }; break;
        case 'arc': next = { ...geometry, points: geometry.points.map(map) as [string, string, string] }; break;
        case 'function':
        case 'parametric':
          next = geometry.areaSide ? { ...geometry, areaSide: map(geometry.areaSide) } : geometry;
          break;
        case 'poincare-geodesic':
        case 'poincare-arc':
          next = { ...geometry, refs: geometry.refs.map(map) as [string, string, string, string] };
          break;
        case 'dimension': next = { ...geometry, points: mapPair(geometry.points, map) }; break;
      }
      return { ...base, geometry: next } as T;
    }
    case 'angle':
      return {
        ...base,
        points: base.points.map(map) as [string, string, string],
        ...(base.perpendicularRelationId ? { perpendicularRelationId: map(base.perpendicularRelationId) } : {}),
      } as T;
    case 'region':
      return { ...base, geometry: { ...base.geometry, points: base.geometry.points.map(map) } } as T;
    case 'area':
      return {
        ...base,
        geometry: base.geometry.type === 'half-plane'
          ? { ...base.geometry, boundary: mapPair(base.geometry.boundary, map), side: map(base.geometry.side) }
          : { ...base.geometry, areas: base.geometry.areas.map(map) as [string, string, ...string[]] },
      } as T;
    case 'mark':
      return {
        ...base,
        anchor: base.anchor.type === 'path' ? { ...base.anchor, path: map(base.anchor.path) } : { ...base.anchor, points: mapPair(base.anchor.points, map) },
      } as T;
    case 'annotation':
      return {
        ...base,
        anchor: base.anchor.type === 'object' ? { ...base.anchor, object: map(base.anchor.object) } : base.anchor,
        ...(base.measurement ? { measurement: { ...base.measurement, refs: base.measurement.refs.map(map) as [string, string] | [string] } } : {}),
      } as T;
    case 'control':
      return {
        ...base,
        ...(base.action?.effects ? { action: { ...base.action, effects: base.action.effects.map(effect => ({ ...effect, control: map(effect.control) })) } } : {}),
      } as T;
  }
}

/** Sustituye las referencias de una relación (y su propio id). */
export function mapRelationReferences(relation: DiagramRelation, map: IdMap): DiagramRelation {
  const base = { ...relation, id: map(relation.id) };
  switch (base.type) {
    case 'coincident':
    case 'coordinate-equality':
    case 'distance':
      return { ...base, points: mapPair(base.points, map) };
    case 'on-support': return { ...base, point: map(base.point), support: map(base.support) };
    case 'equal-length': return { ...base, segments: mapPair(base.segments, map), ...(base.drivenPoint ? { drivenPoint: map(base.drivenPoint) } : {}) };
    case 'equal-angle': return { ...base, angles: mapPair(base.angles, map), ...(base.drivenPoint ? { drivenPoint: map(base.drivenPoint) } : {}) };
    case 'perpendicular':
    case 'parallel':
      return {
        ...base,
        supports: (typeof base.supports[0] === 'string'
          ? mapPair(base.supports as [string, string], map)
          : (base.supports as [[string, string], [string, string]]).map(pair => mapPair(pair, map))) as typeof base.supports,
      };
    case 'inside-disk':
      return { ...base, point: map(base.point), disk: typeof base.disk === 'string' ? map(base.disk) : { center: map(base.disk.center), boundary: map(base.disk.boundary) } };
    case 'same-half-plane': return { ...base, points: mapPair(base.points, map), boundary: map(base.boundary) };
    case 'inside-area': return { ...base, point: map(base.point), area: map(base.area) };
    case 'reflection':
      return {
        ...base,
        refs: base.refs.map(map),
        ...(base.centerOrAxis ? { centerOrAxis: map(base.centerOrAxis) } : {}),
        ...(base.drivenPoint ? { drivenPoint: map(base.drivenPoint) } : {}),
      };
    case 'expression': return { ...base, refs: base.refs.map(map) };
  }
}

type TextMap = (source: string) => string;

/**
 * Transforma las expresiones (`mapExpression`) y las plantillas de texto
 * (`mapTemplate`) de un objeto, incluidas reglas y bloques de paneles.
 */
export function mapObjectExpressions<T extends DiagramObject>(object: T, mapExpression: TextMap, mapTemplate: TextMap): T {
  const optional = (source: string | undefined) => source === undefined ? undefined : mapExpression(source);
  const base = { ...object, ...(object.visibleWhen ? { visibleWhen: mapExpression(object.visibleWhen) } : {}) };
  switch (base.objectType) {
    case 'point':
      return (base.definition.type === 'expression'
        ? { ...base, definition: { ...base.definition, x: mapExpression(base.definition.x), y: mapExpression(base.definition.y) } }
        : base) as T;
    case 'path':
      if (base.geometry.type === 'function') return { ...base, geometry: { ...base.geometry, expression: mapExpression(base.geometry.expression) } } as T;
      if (base.geometry.type === 'parametric') return { ...base, geometry: { ...base.geometry, x: mapExpression(base.geometry.x), y: mapExpression(base.geometry.y) } } as T;
      if (base.geometry.type === 'dimension' && base.geometry.text) return { ...base, geometry: { ...base.geometry, text: mapTemplate(base.geometry.text) } } as T;
      return base as T;
    case 'mark':
      return (base.spacingExpression ? { ...base, spacingExpression: mapExpression(base.spacingExpression) } : base) as T;
    case 'annotation': {
      const content = base.content;
      return {
        ...base,
        content: {
          ...content,
          text: mapTemplate(content.text),
          ...(content.expression ? { expression: mapExpression(content.expression) } : {}),
          ...(content.rules ? { rules: content.rules.map(rule => ({ ...rule, when: mapExpression(rule.when), text: mapTemplate(rule.text) })) } : {}),
          ...(content.blocks ? {
            blocks: content.blocks.map(block => ({
              ...block,
              text: mapTemplate(block.text),
              ...(block.expression ? { expression: mapExpression(block.expression) } : {}),
              ...(block.rules ? {
                rules: block.rules.map(rule => ({
                  ...rule,
                  when: mapExpression(rule.when),
                  text: mapTemplate(rule.text),
                  ...(rule.expression ? { expression: optional(rule.expression) } : {}),
                })),
              } : {}),
            })),
          } : {}),
        },
      } as T;
    }
    case 'control':
      return {
        ...base,
        ...(base.range.maxExpression ? { range: { ...base.range, maxExpression: mapExpression(base.range.maxExpression) } } : {}),
        ...(base.action?.effects ? {
          action: {
            ...base.action,
            effects: base.action.effects.map(effect => ({
              ...effect,
              ...(effect.from ? { from: mapExpression(effect.from) } : {}),
              ...(effect.when ? { when: mapExpression(effect.when) } : {}),
            })),
          },
        } : {}),
      } as T;
    default:
      return base as T;
  }
}
