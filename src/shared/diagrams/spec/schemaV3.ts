import { z } from 'zod';
import { DiagramExpressionError, extractMathExpressionIdentifiers, parseMathExpression } from './expressions';
import { diagramTemplateExpressions } from './infoPanels';
import { DiagramSpecValidationError } from './schema';
import { DIAGRAM_RENDERER_ID, DIAGRAM_SPEC_VERSION } from './types';
import type { DiagramObject, DiagramRelation, DiagramSpecV3, PointObject } from './v3';
import { objectReferences } from './v3Compatibility';
import { objectHasCapability } from './semantics';

const id = z.string().min(1).regex(/^[A-Za-z][A-Za-z0-9_-]*$/, 'Debe empezar por una letra y usar solo letras, números, _ o -.');
const number = z.number().finite();
const expression = z.string().min(1).superRefine((source, context) => {
  try { parseMathExpression(source); }
  catch (error) { context.addIssue({ code: 'custom', message: error instanceof DiagramExpressionError ? error.message : 'Expresión matemática no válida.' }); }
});
const color = z.enum(['carbon', 'terracota', 'salvia', 'pizarra', 'ocre', 'pavo', 'granada', 'musgo']);
const pair = z.tuple([id, id]);
const pointTriple = z.tuple([id, id, id]);
const selection = z.object({
  selectable: z.boolean(), highlightable: z.boolean().optional(), dimOthersOnHighlight: z.boolean().optional(),
  ariaLabel: z.string().min(1).optional(), role: z.enum(['primary', 'secondary', 'construction', 'annotation']).optional(),
}).strict();
const objectBase = {
  id, label: z.string().min(1), color, layerId: id, order: z.number().int(), visible: z.boolean(),
  visibleWhen: expression.optional(), locked: z.boolean(), groupIds: z.array(id), selection, target: z.boolean(), targetId: id.optional(),
};
const pointAppearance = z.object({
  size: number.min(0).max(30).optional(), labelVisible: z.boolean().optional(), labelOffset: z.tuple([number, number]).optional(),
  labelPosition: z.union([number, z.string()]).optional(), labelSize: number.min(6).max(72).optional(), opacity: number.min(0).max(1).optional(),
  highlightSize: number.min(0).max(40).optional(), preserveColorOnHighlight: z.boolean().optional(),
  highlightVisible: z.boolean().optional(),
}).strict();
const pathAppearance = z.object({
  dashed: z.boolean().optional(), strokeWidth: number.min(0).max(20).optional(), strokeOpacity: number.min(0).max(1).optional(),
  fillOpacity: number.min(0).max(1).optional(), labelVisible: z.boolean().optional(), labelOffset: z.tuple([number, number]).optional(),
  labelPosition: z.union([number, z.string()]).optional(), labelSize: number.min(6).max(72).optional(),
  highlightStrokeWidth: number.min(0).max(30).optional(), highlightFillOpacity: number.min(0).max(1).optional(),
  highlightVisible: z.boolean().optional(), preserveColorOnHighlight: z.boolean().optional(),
}).strict();
const pointDefinition = z.discriminatedUnion('type', [
  z.object({ type: z.literal('coordinates'), x: number, y: number }).strict(),
  z.object({ type: z.literal('expression'), x: expression, y: expression, fallback: z.tuple([number, number]) }).strict(),
  z.object({ type: z.literal('intersection'), supports: pair, restrictToSupports: z.boolean().optional() }).strict(),
  z.object({ type: z.literal('midpoint'), points: pair }).strict(),
  z.object({ type: z.literal('projection'), point: id, support: z.union([id, z.object({ points: pair }).strict()]) }).strict(),
]);
const mobility = z.discriminatedUnion('type', [
  z.object({ type: z.literal('free') }).strict(), z.object({ type: z.literal('fixed') }).strict(),
  z.object({ type: z.literal('axis-x'), coordinate: number }).strict(), z.object({ type: z.literal('axis-y'), coordinate: number }).strict(),
  z.object({ type: z.literal('on-support'), support: id }).strict(),
  z.object({ type: z.literal('constrained'), relationIds: z.array(id).min(1) }).strict(),
]);
const pointObject = z.object({
  ...objectBase, objectType: z.literal('point'), definition: pointDefinition, mobility,
  appearance: pointAppearance.optional(), interaction: z.object({
    snapToGrid: z.boolean().optional(), snapSize: number.positive().optional(), attractorIds: z.array(id).max(8).optional(),
    attractorDistance: number.positive().max(20).optional(), snatchDistance: number.positive().max(20).optional(),
  }).strict().optional(),
}).strict();
const linearConstruction = z.discriminatedUnion('type', [
  z.object({ type: z.literal('through-points'), points: pair }).strict(),
  z.object({ type: z.literal('perpendicular'), linePoints: pair, through: id }).strict(),
  z.object({ type: z.literal('parallel'), linePoints: pair, through: id }).strict(),
  z.object({ type: z.literal('angle-bisector'), points: pointTriple }).strict(),
]);
const pathGeometry = z.discriminatedUnion('type', [
  z.object({ type: z.literal('segment'), points: pair, construction: z.object({ type: z.literal('base-extension'), foot: id }).strict().optional() }).strict(),
  z.object({ type: z.literal('line'), construction: linearConstruction }).strict(),
  z.object({ type: z.literal('ray'), points: pair }).strict(),
  z.object({ type: z.literal('polygon'), points: z.tuple([id, id, id]).rest(id) }).strict(),
  z.object({ type: z.literal('circle'), center: id, point: id }).strict(),
  z.object({ type: z.literal('arc'), points: pointTriple, direction: z.enum(['clockwise', 'counterclockwise']) }).strict(),
  z.object({ type: z.literal('function'), expression, variable: id, domain: z.tuple([number, number]), samples: z.number().int().min(8).max(2048) }).strict(),
  z.object({ type: z.literal('parametric'), x: expression, y: expression, parameter: id, domain: z.tuple([number, number]), samples: z.number().int().min(8).max(2048) }).strict(),
  z.object({ type: z.literal('poincare-geodesic'), refs: z.tuple([id, id, id, id]) }).strict(),
  z.object({ type: z.literal('poincare-arc'), refs: z.tuple([id, id, id, id]) }).strict(),
  z.object({ type: z.literal('dimension'), points: pair, offset: number.optional() }).strict(),
]);
const pathObject = z.object({ ...objectBase, objectType: z.literal('path'), geometry: pathGeometry, appearance: pathAppearance.optional() }).strict();
const angleObject = z.object({
  ...objectBase, objectType: z.literal('angle'), points: pointTriple, sweep: z.enum(['directed', 'non-reflex']),
  direction: z.enum(['clockwise', 'counterclockwise']).optional(), marker: z.enum(['arc', 'square']), perpendicularRelationId: id.optional(),
  appearance: z.object({
    radius: number.positive().max(10).optional(), strokeWidth: number.min(0).max(20).optional(), strokeOpacity: number.min(0).max(1).optional(),
    fillOpacity: number.min(0).max(1).optional(), labelVisible: z.boolean().optional(), labelOffset: z.tuple([number, number]).optional(), labelPosition: z.union([number, z.string()]).optional(),
    labelSize: number.min(6).max(72).optional(), highlightStrokeWidth: number.min(0).max(30).optional(),
    highlightFillOpacity: number.min(0).max(1).optional(), highlightVisible: z.boolean().optional(), preserveColorOnHighlight: z.boolean().optional(),
  }).strict().optional(),
}).strict();
const regionObject = z.object({
  ...objectBase, objectType: z.literal('region'), geometry: z.discriminatedUnion('type', [
    z.object({ type: z.literal('area-decomposition'), points: z.tuple([id, id, id]).rest(id), rows: z.number().int().min(1).max(100).optional(), columns: z.number().int().min(1).max(100).optional() }).strict(),
    z.object({ type: z.literal('grid-region'), points: z.tuple([id, id, id, id]), rows: z.number().int().min(1).max(100), columns: z.number().int().min(1).max(100) }).strict(),
  ]), appearance: z.object({
    strokeWidth: number.min(0).max(20).optional(), strokeOpacity: number.min(0).max(1).optional(), fillOpacity: number.min(0).max(1).optional(),
    highlightFillOpacity: number.min(0).max(1).optional(), preserveColorOnHighlight: z.boolean().optional(),
  }).strict().optional(),
}).strict();
const markObject = z.object({
  ...objectBase, objectType: z.literal('mark'), variant: z.enum(['congruence', 'parallel', 'graduation']),
  anchor: z.discriminatedUnion('type', [z.object({ type: z.literal('between-points'), points: pair }).strict(), z.object({ type: z.literal('path'), path: id }).strict()]),
  count: z.number().int().min(1).max(12), height: number.positive().max(100).optional(), spacing: number.positive().max(100).optional(),
  spacingExpression: expression.optional(), subdivisions: z.number().int().min(0).max(10).optional(),
  appearance: z.object({ strokeWidth: number.min(0).max(20).optional(), strokeOpacity: number.min(0).max(1).optional(), preserveColorOnHighlight: z.boolean().optional() }).strict().optional(),
}).strict();
const textRule = z.object({ when: expression, text: z.string() }).strict();
const infoRule = z.object({ when: expression, text: z.string(), expression: expression.optional(), unit: z.string().max(32).optional(), precision: z.number().int().min(0).max(12).optional(), color: color.optional() }).strict();
const infoBlock = z.object({ id, title: z.string().min(1).optional(), text: z.string(), expression: expression.optional(), unit: z.string().max(32).optional(), precision: z.number().int().min(0).max(12).optional(), color: color.optional(), rules: z.array(infoRule).max(12).optional() }).strict();
const headerReading = z.object({
  id,
  sourceIds: z.array(id).min(1).max(8),
  presentation: z.enum(['label-value', 'equality', 'value']),
  label: z.string().optional(),
}).strict().superRefine((reading, context) => {
  if (reading.presentation === 'equality' && reading.sourceIds.length < 2) context.addIssue({
    code: 'custom', message: 'Una igualdad necesita al menos dos lecturas.', path: ['sourceIds'],
  });
  if (reading.presentation !== 'equality' && reading.sourceIds.length !== 1) context.addIssue({
    code: 'custom', message: 'Esta presentación necesita una única lectura.', path: ['sourceIds'],
  });
});
const header = z.object({
  readingsMode: z.enum(['automatic', 'custom', 'hidden']),
  readings: z.array(headerReading).max(12),
}).strict();
const annotationObject = z.object({
  ...objectBase, objectType: z.literal('annotation'), variant: z.enum(['text', 'formula', 'label', 'panel', 'measurement']),
  content: z.object({ text: z.string(), expression: expression.optional(), unit: z.string().max(32).optional(), precision: z.number().int().min(0).max(12).optional(), rules: z.array(textRule).max(12).optional(), title: z.string().min(1).optional(), blocks: z.array(infoBlock).min(1).max(12).optional(), layout: z.enum(['stack', 'columns']).optional() }).strict(),
  anchor: z.discriminatedUnion('type', [
    z.object({ type: z.literal('object'), object: id, parameter: number.min(0).max(1).optional(), offset: z.tuple([number, number]).optional() }).strict(),
    z.object({ type: z.literal('viewport'), position: z.tuple([number.min(0).max(1), number.min(0).max(1)]) }).strict(),
  ]),
  measurement: z.object({ refs: z.union([z.tuple([id]), pair]), mode: z.enum(['distance', 'value']) }).strict().optional(),
  appearance: z.object({ fontSize: number.min(6).max(72).optional(), opacity: number.min(0).max(1).optional(), preserveColorOnHighlight: z.boolean().optional() }).strict().optional(),
}).strict();
const controlObject = z.object({
  ...objectBase, objectType: z.literal('control'), variant: z.literal('slider'), position: z.tuple([number, number]),
  range: z.object({ min: number, max: number, maxExpression: expression.optional(), step: number.positive() }).strict(), value: number,
}).strict();
const diagramObject = z.discriminatedUnion('objectType', [pointObject, pathObject, angleObject, regionObject, markObject, annotationObject, controlObject]);
const relationBase = { id, label: z.string().min(1), enabled: z.boolean() };
const linearPair = z.union([pair, z.tuple([pair, pair])]);
const relation = z.discriminatedUnion('type', [
  z.object({ ...relationBase, type: z.literal('coincident'), points: pair }).strict(),
  z.object({ ...relationBase, type: z.literal('coordinate-equality'), axis: z.enum(['x', 'y']), points: pair }).strict(),
  z.object({ ...relationBase, type: z.literal('on-support'), point: id, support: id }).strict(),
  z.object({ ...relationBase, type: z.literal('distance'), points: pair, value: number.optional(), expression: expression.optional() }).strict(),
  z.object({ ...relationBase, type: z.literal('equal-length'), segments: pair, drivenPoint: id.optional() }).strict(),
  z.object({ ...relationBase, type: z.literal('equal-angle'), angles: pair, drivenPoint: id.optional() }).strict(),
  z.object({ ...relationBase, type: z.literal('perpendicular'), supports: linearPair }).strict(),
  z.object({ ...relationBase, type: z.literal('parallel'), supports: linearPair }).strict(),
  z.object({ ...relationBase, type: z.literal('inside-disk'), point: id, disk: z.union([id, z.object({ center: id, boundary: id }).strict()]) }).strict(),
  z.object({ ...relationBase, type: z.literal('same-half-plane'), points: pair, boundary: id }).strict(),
  z.object({ ...relationBase, type: z.literal('expression'), refs: z.array(id), expression, value: number.optional() }).strict(),
]);
const layer = z.object({ id, label: z.string().min(1), order: z.number().int(), visible: z.boolean(), locked: z.boolean() }).strict();
const group = z.object({ id, label: z.string().min(1), memberIds: z.array(id), visible: z.boolean(), locked: z.boolean(), selection, target: z.boolean().optional(), targetId: id.optional(), color: color.optional() }).strict();
const overlay = z.object({ visible: z.boolean(), title: z.string(), content: z.string(), expression: expression.optional(), unit: z.string().max(32).optional(), precision: z.number().int().min(0).max(12).optional(), position: z.enum(['top-left', 'top-right', 'bottom-left', 'bottom-right']).optional() }).strict();
const objectState = z.object({ visible: z.boolean().optional(), emphasis: z.enum(['none', 'secondary', 'primary']).optional(), emphasisColor: color.optional(), label: z.string().optional(), overlay: overlay.optional(), interactive: z.boolean().optional(), value: number.optional() }).strict();
const step = z.object({ id, label: z.string().min(1), description: z.string(), visibleTargets: z.array(id), durationMs: z.number().int().min(0).optional(), objectStates: z.record(id, objectState).optional() }).strict();

function addIssue(context: z.RefinementCtx, path: PropertyKey[], message: string): void {
  context.addIssue({ code: 'custom', path: path.map(String), message });
}

function expressionSources(object: DiagramObject): string[] {
  const sources = object.visibleWhen ? [object.visibleWhen] : [];
  if (object.objectType === 'point' && object.definition.type === 'expression') sources.push(object.definition.x, object.definition.y);
  if (object.objectType === 'path' && object.geometry.type === 'function') sources.push(object.geometry.expression);
  if (object.objectType === 'path' && object.geometry.type === 'parametric') sources.push(object.geometry.x, object.geometry.y);
  if (object.objectType === 'mark' && object.spacingExpression) sources.push(object.spacingExpression);
  if (object.objectType === 'annotation') {
    if (object.content.expression) sources.push(object.content.expression);
    diagramTemplateExpressions(object.content.text, object.content.expression).forEach(entry => sources.push(entry.expression));
    object.content.rules?.forEach(rule => {
      sources.push(rule.when);
      diagramTemplateExpressions(rule.text, object.content.expression).forEach(entry => sources.push(entry.expression));
    });
    object.content.blocks?.forEach(block => {
      if (block.expression) sources.push(block.expression);
      diagramTemplateExpressions(block.text, block.expression).forEach(entry => sources.push(entry.expression));
      block.rules?.forEach(rule => {
        sources.push(rule.when);
        if (rule.expression) sources.push(rule.expression);
        diagramTemplateExpressions(rule.text, rule.expression ?? block.expression).forEach(entry => sources.push(entry.expression));
      });
    });
  }
  if (object.objectType === 'control' && object.range.maxExpression) sources.push(object.range.maxExpression);
  return sources;
}

interface ValidationIndex {
  objectMap: Map<string, DiagramObject>;
  layerIds: Set<string>;
  groupIds: Set<string>;
  relationMap: Map<string, DiagramRelation>;
  requirePoint: (ref: string, path: PropertyKey[]) => void;
  requireSupport: (ref: string, path: PropertyKey[]) => void;
}

function createValidationIndex(spec: DiagramSpecV3, context: z.RefinementCtx): ValidationIndex {
  const objectMap = new Map(spec.objects.map(object => [object.id, object]));
  const pointIds = new Set(spec.objects.filter(object => object.objectType === 'point').map(object => object.id));
  return {
    objectMap,
    layerIds: new Set(spec.layers.map(item => item.id)),
    groupIds: new Set(spec.groups.map(item => item.id)),
    relationMap: new Map(spec.relations.map(item => [item.id, item])),
    requirePoint: (ref, path) => {
      if (!pointIds.has(ref)) addIssue(context, path, `${ref} debe ser un punto.`);
    },
    requireSupport: (ref, path) => {
      const referenced = objectMap.get(ref);
      if (!referenced || !objectHasCapability(referenced, 'linear-support')) addIssue(context, path, `${ref} debe ser un soporte lineal.`);
    },
  };
}

function validateUniqueIds(spec: DiagramSpecV3, context: z.RefinementCtx): void {
  const allIds = [
    ...spec.layers.map(item => item.id), ...spec.groups.map(item => item.id),
    ...spec.objects.map(item => item.id), ...spec.relations.map(item => item.id), ...spec.steps.map(item => item.id),
  ];
  const seen = new Set<string>();
  allIds.forEach(value => {
    if (seen.has(value)) addIssue(context, [], `El ID ${value} está duplicado globalmente.`);
    seen.add(value);
  });
}

function validatePublicIds(spec: DiagramSpecV3, context: z.RefinementCtx): void {
  const entries = [
    ...spec.objects.filter(object => object.target).map(object => [object.targetId ?? object.id, object.id] as const),
    ...spec.groups.filter(item => item.target).map(item => [item.targetId ?? item.id, item.id] as const),
    ...spec.steps.map(item => [item.id, item.id] as const),
  ];
  const publicIds = new Map<string, string>();
  entries.forEach(([publicId, owner]) => {
    const previous = publicIds.get(publicId);
    if (previous) addIssue(context, [], `El target público ${publicId} está duplicado en ${previous} y ${owner}.`);
    else publicIds.set(publicId, owner);
  });
}

function validatePointObject(object: PointObject, index: number, validation: ValidationIndex, context: z.RefinementCtx): void {
  const { definition, mobility } = object;
  if (definition.type === 'midpoint') definition.points.forEach((ref, refIndex) => validation.requirePoint(ref, ['objects', index, 'definition', 'points', refIndex]));
  if (definition.type === 'intersection') definition.supports.forEach((ref, refIndex) => validation.requireSupport(ref, ['objects', index, 'definition', 'supports', refIndex]));
  if (definition.type === 'projection') {
    validation.requirePoint(definition.point, ['objects', index, 'definition', 'point']);
    if (typeof definition.support === 'string') validation.requireSupport(definition.support, ['objects', index, 'definition', 'support']);
    else definition.support.points.forEach((ref, refIndex) => validation.requirePoint(ref, ['objects', index, 'definition', 'support', 'points', refIndex]));
  }
  if (mobility.type === 'on-support') {
    const support = validation.objectMap.get(mobility.support);
    if (!support || !objectHasCapability(support, 'support')) addIssue(context, ['objects', index, 'mobility', 'support'], `${mobility.support} no admite pertenencia.`);
  }
  if (definition.type !== 'coordinates' && mobility.type !== 'fixed') {
    addIssue(context, ['objects', index, 'mobility'], 'Un punto construido debe tener movilidad fixed.');
  }
}

function validateExpressionSources(object: DiagramObject, index: number, validation: ValidationIndex, context: z.RefinementCtx): void {
  expressionSources(object).forEach(source => {
    try {
      extractMathExpressionIdentifiers(source).forEach(identifier => {
        const root = identifier.split('.')[0];
        if (!validation.objectMap.has(root) && root !== 'x' && root !== 't') {
          addIssue(context, ['objects', index], `La variable ${identifier} no corresponde a un objeto.`);
        }
      });
    } catch { /* El campo de expresión ya contiene el diagnóstico sintáctico. */ }
  });
}

function validateObject(object: DiagramObject, index: number, validation: ValidationIndex, context: z.RefinementCtx): void {
  if (!validation.layerIds.has(object.layerId)) addIssue(context, ['objects', index, 'layerId'], `La capa ${object.layerId} no existe.`);
  object.groupIds.forEach(groupId => {
    if (!validation.groupIds.has(groupId)) addIssue(context, ['objects', index, 'groupIds'], `El grupo ${groupId} no existe.`);
  });
  objectReferences(object).forEach(ref => {
    if (!validation.objectMap.has(ref)) addIssue(context, ['objects', index], `${object.id} referencia el objeto inexistente ${ref}.`);
  });
  if (object.objectType === 'point') validatePointObject(object, index, validation, context);
  if (object.objectType === 'path') objectReferences(object).forEach((ref, refIndex) => validation.requirePoint(ref, ['objects', index, 'geometry', refIndex]));
  if (object.objectType === 'angle' || object.objectType === 'region') objectReferences(object).forEach((ref, refIndex) => validation.requirePoint(ref, ['objects', index, refIndex]));
  if (object.objectType === 'mark' && object.anchor.type === 'between-points') {
    object.anchor.points.forEach((ref, refIndex) => validation.requirePoint(ref, ['objects', index, 'anchor', 'points', refIndex]));
  }
  if (object.objectType === 'mark' && object.anchor.type === 'path' && validation.objectMap.get(object.anchor.path)?.objectType !== 'path') {
    addIssue(context, ['objects', index, 'anchor', 'path'], `${object.anchor.path} debe ser un trazado.`);
  }
  if (object.objectType === 'angle' && object.marker === 'square') {
    const perpendicular = object.perpendicularRelationId ? validation.relationMap.get(object.perpendicularRelationId) : undefined;
    if (perpendicular?.type !== 'perpendicular') addIssue(context, ['objects', index, 'perpendicularRelationId'], 'Un marcador cuadrado exige una relación explícita de perpendicularidad.');
  }
  validateExpressionSources(object, index, validation, context);
}

function validateLinearRelation(relation: Extract<DiagramRelation, { type: 'perpendicular' | 'parallel' }>, index: number, validation: ValidationIndex): void {
  if (typeof relation.supports[0] === 'string') {
    (relation.supports as [string, string]).forEach((ref, refIndex) => validation.requireSupport(ref, ['relations', index, 'supports', refIndex]));
    return;
  }
  (relation.supports as [[string, string], [string, string]]).flat()
    .forEach((ref, refIndex) => validation.requirePoint(ref, ['relations', index, 'supports', refIndex]));
}

function validateRelation(item: DiagramRelation, index: number, validation: ValidationIndex, context: z.RefinementCtx): void {
  if (item.type === 'coincident' || item.type === 'coordinate-equality' || item.type === 'distance') {
    item.points.forEach((ref, refIndex) => validation.requirePoint(ref, ['relations', index, 'points', refIndex]));
  }
  if (item.type === 'on-support') {
    validation.requirePoint(item.point, ['relations', index, 'point']);
    validation.requireSupport(item.support, ['relations', index, 'support']);
  }
  if (item.type === 'equal-length') item.segments.forEach((ref, refIndex) => {
    const object = validation.objectMap.get(ref);
    if (object?.objectType !== 'path' || object.geometry.type !== 'segment') addIssue(context, ['relations', index, 'segments', refIndex], `${ref} debe ser un segmento.`);
  });
  if (item.type === 'equal-angle') item.angles.forEach((ref, refIndex) => {
    if (validation.objectMap.get(ref)?.objectType !== 'angle') addIssue(context, ['relations', index, 'angles', refIndex], `${ref} debe ser un ángulo.`);
  });
  if (item.type === 'inside-disk') {
    validation.requirePoint(item.point, ['relations', index, 'point']);
    if (typeof item.disk === 'string') {
      const circle = validation.objectMap.get(item.disk);
      if (circle?.objectType !== 'path' || circle.geometry.type !== 'circle') addIssue(context, ['relations', index, 'disk'], `${item.disk} debe ser un círculo.`);
    } else {
      validation.requirePoint(item.disk.center, ['relations', index, 'disk', 'center']);
      validation.requirePoint(item.disk.boundary, ['relations', index, 'disk', 'boundary']);
    }
  }
  if (item.type === 'perpendicular' || item.type === 'parallel') validateLinearRelation(item, index, validation);
}

export const diagramSpecV3Schema = z.object({
  version: z.literal(DIAGRAM_SPEC_VERSION), renderer: z.literal(DIAGRAM_RENDERER_ID), title: z.string().min(1), componentId: id,
  category: z.string().min(1), mode: z.enum(['simulation', 'diagram', 'inline']), axis: z.boolean(), grid: z.boolean(), showLabels: z.boolean().optional(),
  header: header.optional(),
  viewport: z.object({ bounds: z.tuple([number, number, number, number]), home: z.tuple([number, number, number, number]), minZoom: number.positive(), maxZoom: number.positive(), padding: number.min(0).max(0.5) }).strict(),
  layers: z.array(layer).min(1), groups: z.array(group), objects: z.array(diagramObject).min(1), relations: z.array(relation), steps: z.array(step), note: z.string(),
}).strict().superRefine((spec, context) => {
  const current = spec as DiagramSpecV3;
  validateUniqueIds(current, context);
  validatePublicIds(current, context);
  const validation = createValidationIndex(current, context);
  const readableIds = new Set(current.objects.filter(object => (
    (object.objectType === 'path' && object.geometry.type === 'dimension')
    || (object.objectType === 'annotation' && (object.variant === 'measurement' || (object.variant === 'panel' && Boolean(object.content.expression))))
  )).map(object => object.id));
  current.header?.readings.forEach((reading, readingIndex) => reading.sourceIds.forEach((sourceId, sourceIndex) => {
    if (!readableIds.has(sourceId)) addIssue(context, ['header', 'readings', readingIndex, 'sourceIds', sourceIndex], `${sourceId} no es una medida disponible para la cabecera.`);
  }));
  current.objects.forEach((object, index) => validateObject(object, index, validation, context));
  current.groups.forEach((group, index) => group.memberIds.forEach(memberId => {
    if (!validation.objectMap.has(memberId)) addIssue(context, ['groups', index, 'memberIds'], `El grupo ${group.id} contiene ${memberId}, que no existe.`);
  }));
  current.steps.forEach((item, index) => [...item.visibleTargets, ...Object.keys(item.objectStates ?? {})].forEach(target => {
    if (!validation.objectMap.has(target)) addIssue(context, ['steps', index], `El paso ${item.id} referencia ${target}, que no existe.`);
  }));
  current.relations.forEach((item, index) => validateRelation(item, index, validation, context));
});

export function parseDiagramSpecV3(value: unknown): { success: true; data: DiagramSpecV3 } | { success: false; error: DiagramSpecValidationError } {
  const result = diagramSpecV3Schema.safeParse(value);
  if (result.success) return { success: true, data: result.data as DiagramSpecV3 };
  return { success: false, error: new DiagramSpecValidationError(result.error.issues) };
}
