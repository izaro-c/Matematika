import { extractMathExpressionIdentifiers } from '@/diagrams/model/expressions/expressions';
import { diagramTemplateExpressions } from '@/diagrams/model/semantics/infoPanels';
import type { DiagramObject, PathObject, PointObject } from '@/diagrams/model/schema/v3';

export interface DiagramDependencyEdge {
  sourceId: string;
  targetId: string;
  relation: 'construction' | 'expression' | 'constraint';
  constraintId?: string;
}

export function pointDefinitionReferences(definition: PointObject['definition']): string[] {
  if (definition.type === 'intersection') return [...definition.supports];
  if (definition.type === 'midpoint') return [...definition.points];
  if (definition.type !== 'projection') return [];
  const support = typeof definition.support === 'string'
    ? [definition.support]
    : [...definition.support.points];
  return [definition.point, ...support];
}

function pathReferences(object: PathObject): string[] {
  const geometry = object.geometry;
  if (geometry.type === 'segment') {
    return [...geometry.points, ...(geometry.construction ? [geometry.construction.foot] : [])];
  }
  if (geometry.type === 'line') {
    const construction = geometry.construction;
    if (construction.type === 'through-points') return [...construction.points];
    if (construction.type === 'angle-bisector') return [...construction.points];
    return [...construction.linePoints, construction.through];
  }
  if ('points' in geometry) return [...geometry.points];
  if ('center' in geometry) return [geometry.center, geometry.point];
  if ('refs' in geometry) return [...geometry.refs];
  if (geometry.type === 'function' || geometry.type === 'parametric') {
    return geometry.areaSide ? [geometry.areaSide] : [];
  }
  return [];
}

/** Referencias de construcción de un objeto, en el orden geométrico de sus campos. */
export function objectConstructionReferences(object: DiagramObject): string[] {
  if (object.objectType === 'point') return pointDefinitionReferences(object.definition);
  if (object.objectType === 'path') return pathReferences(object);
  if (object.objectType === 'angle') return [...object.points];
  if (object.objectType === 'region') return [...object.geometry.points];
  if (object.objectType === 'area') {
    if (object.geometry.type === 'half-plane') return [...object.geometry.boundary, object.geometry.side];
    return [...object.geometry.areas];
  }
  if (object.objectType === 'mark') {
    return object.anchor.type === 'path' ? [object.anchor.path] : [...object.anchor.points];
  }
  if (object.objectType === 'annotation') {
    if (object.measurement?.refs) return [...object.measurement.refs];
    return object.anchor.type === 'object' ? [object.anchor.object] : [];
  }
  return [];
}

/** Todas las referencias directas a otros objetos (construcción, soporte y atractores). */
export function objectReferences(object: DiagramObject): string[] {
  if (object.objectType === 'point') {
    const mobilityRefs = object.mobility.type === 'on-support' ? [object.mobility.support] : [];
    return [...pointDefinitionReferences(object.definition), ...mobilityRefs, ...(object.interaction?.attractorIds ?? [])];
  }
  if (object.objectType === 'annotation') {
    const anchorRefs = object.anchor.type === 'object' ? [object.anchor.object] : [];
    return [...anchorRefs, ...(object.measurement?.refs ?? [])];
  }
  return objectConstructionReferences(object);
}

/** Expresiones reactivas de un objeto, incluidas las plantillas de texto. */
export function objectExpressions(object: DiagramObject): string[] {
  const expressions = object.visibleWhen ? [object.visibleWhen] : [];
  if (object.objectType === 'point' && object.definition.type === 'expression') expressions.push(object.definition.x, object.definition.y);
  if (object.objectType === 'path' && object.geometry.type === 'function') expressions.push(object.geometry.expression);
  if (object.objectType === 'path' && object.geometry.type === 'parametric') expressions.push(object.geometry.x, object.geometry.y);
  if (object.objectType === 'mark' && object.spacingExpression) expressions.push(object.spacingExpression);
  if (object.objectType === 'annotation') {
    expressions.push(...[
      object.content.expression,
      ...(object.content.rules ?? []).map(rule => rule.when),
      ...(object.content.blocks ?? []).flatMap(block => [block.expression, ...(block.rules ?? []).flatMap(rule => [rule.when, rule.expression])]),
    ].filter((value): value is string => Boolean(value)));
    expressions.push(...diagramTemplateExpressions(object.content.text, object.content.expression).map(entry => entry.expression));
    object.content.rules?.forEach(rule => expressions.push(...diagramTemplateExpressions(rule.text, object.content.expression).map(entry => entry.expression)));
    object.content.blocks?.forEach(block => {
      expressions.push(...diagramTemplateExpressions(block.text, block.expression).map(entry => entry.expression));
      block.rules?.forEach(rule => expressions.push(...diagramTemplateExpressions(rule.text, rule.expression ?? block.expression).map(entry => entry.expression)));
    });
  }
  if (object.objectType === 'control' && object.range.maxExpression) expressions.push(object.range.maxExpression);
  return expressions;
}

/** Identificadores raíz (sin `.x`, `.length`...) que lee una expresión; vacío si no es válida. */
export function expressionSourceIds(source: string | undefined): string[] {
  if (!source) return [];
  try {
    return extractMathExpressionIdentifiers(source).map(id => id.split('.')[0]);
  } catch {
    return [];
  }
}

/** Dependencias declarativas entre objetos: construcción, expresiones y atractores. */
export function diagramDependencies(objects: readonly DiagramObject[]): DiagramDependencyEdge[] {
  const ids = new Set(objects.map(object => object.id));
  const keys = new Set<string>();
  const dependencies: DiagramDependencyEdge[] = [];
  const add = (sourceId: string, targetId: string, relation: DiagramDependencyEdge['relation'], constraintId?: string) => {
    if (!ids.has(sourceId) || (sourceId === targetId && relation !== 'expression')) return;
    const key = `${sourceId}:${targetId}:${relation}:${constraintId ?? ''}`;
    if (keys.has(key)) return;
    keys.add(key);
    dependencies.push({ sourceId, targetId, relation, ...(constraintId ? { constraintId } : {}) });
  };
  objects.forEach(object => {
    if (object.objectType === 'point') {
      pointDefinitionReferences(object.definition).forEach(id => add(id, object.id, 'construction'));
    } else objectReferences(object).forEach(id => add(id, object.id, 'construction'));
    objectExpressions(object).forEach(source => expressionSourceIds(source).forEach(id => add(id, object.id, 'expression')));
    if (object.objectType === 'point') object.interaction?.attractorIds?.forEach(id => add(id, object.id, 'constraint'));
  });
  return dependencies;
}

/** Puntos que definen la recta de proyección de un pie de perpendicular. */
export function projectionSupportPoints(
  definition: Extract<PointObject['definition'], { type: 'projection' }>,
  objects: readonly DiagramObject[],
): [string, string] {
  if (typeof definition.support !== 'string') return definition.support.points;
  const support = objects.find(candidate => candidate.id === definition.support);
  if (support?.objectType === 'path' && (support.geometry.type === 'segment' || support.geometry.type === 'ray')) {
    return support.geometry.points;
  }
  if (support?.objectType === 'path' && support.geometry.type === 'line' && support.geometry.construction.type === 'through-points') {
    return support.geometry.construction.points;
  }
  return [definition.point, definition.point];
}
