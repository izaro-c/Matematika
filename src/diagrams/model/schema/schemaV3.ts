import { z } from 'zod';
import { DiagramExpressionError, extractMathExpressionIdentifiers, parseMathExpression } from '@/diagrams/model/expressions/expressions';
import { diagramTemplateExpressions } from '@/diagrams/model/semantics/infoPanels';
import { DIAGRAM_RENDERER_ID, DIAGRAM_SPEC_VERSION } from '@/diagrams/model/schema/types';
import type { DiagramObject, DiagramRelation, DiagramSpecV3, PointObject } from '@/diagrams/model/schema/v3';
import { objectConstructionReferences, objectReferences } from '@/diagrams/model/objects/references';
import { objectHasCapability } from '@/diagrams/model/semantics/semantics';

export class DiagramSpecValidationError extends Error {
  readonly issues: z.core.$ZodIssue[];

  constructor(issues: z.core.$ZodIssue[]) {
    super(formatDiagramSpecIssues(issues));
    this.name = 'DiagramSpecValidationError';
    this.issues = issues;
  }
}

export function formatDiagramSpecIssues(issues: readonly z.core.$ZodIssue[]): string {
  return issues.map(issue => `${issue.path.length > 0 ? issue.path.join('.') : 'spec'}: ${issue.message}`).join('\n');
}

const id = z.string().min(1).regex(/^[A-Za-z][A-Za-z0-9_-]*$/, 'Debe empezar por una letra y usar solo letras, números, _ o -.');
const number = z.number().finite();
const expression = z.string().min(1).superRefine((source, context) => {
  try { parseMathExpression(source); }
  catch (error) { context.addIssue({ code: 'custom', message: error instanceof DiagramExpressionError ? error.message : 'Expresión matemática no válida.' }); }
});
const color = z.enum(['carbon', 'terracota', 'canela', 'mora', 'ocre', 'pavo', 'granada', 'musgo']);
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
  dashed: z.boolean().optional(), arrow: z.enum(['start', 'end', 'both']).optional(), strokeWidth: number.min(0).max(20).optional(), strokeOpacity: number.min(0).max(1).optional(),
  fillOpacity: number.min(0).max(1).optional(), labelVisible: z.boolean().optional(), labelOffset: z.tuple([number, number]).optional(),
  textOffset: z.tuple([number, number]).optional(),
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
  z.object({ type: z.literal('on-points'), points: z.array(id).min(1).max(16) }).strict(),
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
  z.object({ type: z.literal('segment'), points: pair, construction: z.object({ type: z.literal('segment-extension'), foot: id }).strict().optional() }).strict(),
  z.object({ type: z.literal('line'), construction: linearConstruction }).strict(),
  z.object({ type: z.literal('ray'), points: pair }).strict(),
  z.object({ type: z.literal('polygon'), points: z.tuple([id, id, id]).rest(id) }).strict(),
  z.object({ type: z.literal('circle'), center: id, point: id }).strict(),
  z.object({ type: z.literal('arc'), points: pointTriple, direction: z.enum(['clockwise', 'counterclockwise']) }).strict(),
  z.object({ type: z.literal('function'), expression, variable: id, domain: z.tuple([number, number]), samples: z.number().int().min(8).max(2048), areaFill: z.enum(['none', 'interior', 'half-plane']).optional(), areaSide: id.optional() }).strict(),
  z.object({ type: z.literal('parametric'), x: expression, y: expression, parameter: id, domain: z.tuple([number, number]), samples: z.number().int().min(8).max(2048), areaFill: z.enum(['none', 'interior', 'half-plane']).optional(), areaSide: id.optional() }).strict(),
  z.object({ type: z.literal('poincare-geodesic'), refs: z.tuple([id, id, id, id]) }).strict(),
  z.object({ type: z.literal('poincare-arc'), refs: z.tuple([id, id, id, id]) }).strict(),
  z.object({ type: z.literal('dimension'), points: pair, offset: number.optional(), text: z.string().optional(), unit: z.string().max(32).optional(), precision: z.number().int().min(0).max(12).optional() }).strict(),
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
const areaObject = z.object({
  ...objectBase, objectType: z.literal('area'), geometry: z.discriminatedUnion('type', [
    z.object({ type: z.literal('half-plane'), boundary: pair, side: id }).strict(),
    z.object({ type: z.literal('intersection'), areas: z.tuple([id, id]).rest(id) }).strict(),
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
  content: z.object({ text: z.string(), expression: expression.optional(), unit: z.string().max(32).optional(), precision: z.number().int().min(0).max(12).optional(), rules: z.array(textRule).max(12).optional(), title: z.string().min(1).optional(), subtitle: z.string().min(1).optional(), blocks: z.array(infoBlock).min(1).max(12).optional(), layout: z.enum(['stack', 'columns']).optional() }).strict(),
  anchor: z.discriminatedUnion('type', [
    z.object({ type: z.literal('object'), object: id, parameter: number.min(0).max(1).optional(), offset: z.tuple([number, number]).optional() }).strict(),
    z.object({ type: z.literal('viewport'), position: z.tuple([number.min(0).max(1), number.min(0).max(1)]) }).strict(),
  ]),
  measurement: z.object({ refs: z.union([z.tuple([id]), pair]), mode: z.enum(['distance', 'value']) }).strict().optional(),
  appearance: z.object({ fontSize: number.min(6).max(72).optional(), opacity: number.min(0).max(1).optional(), labelVisible: z.boolean().optional(), preserveColorOnHighlight: z.boolean().optional() }).strict().optional(),
}).strict();
const controlAction = z.object({
  to: number, durationMs: number.int().min(0).max(60000), returnDurationMs: number.int().min(0).max(60000).optional(), easing: z.enum(['linear', 'ease-in', 'ease-out', 'ease-in-out']),
  behavior: z.enum(['toggle', 'restart']),
  effects: z.array(z.object({
    on: z.enum(['press', 'release', 'complete']), control: id, do: z.enum(['reset', 'play']),
    from: expression.optional(), when: expression.optional(),
  }).strict()).max(16).optional(),
}).strict();
const controlObject = z.object({
  ...objectBase, objectType: z.literal('control'), variant: z.enum(['slider', 'button']), position: z.tuple([number, number]),
  range: z.object({ min: number, max: number, maxExpression: expression.optional(), step: number.positive() }).strict(), value: number,
  width: number.positive().optional(),
  action: controlAction.optional(),
}).strict();
const diagramObject = z.discriminatedUnion('objectType', [pointObject, pathObject, angleObject, regionObject, areaObject, markObject, annotationObject, controlObject]);
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
  z.object({ ...relationBase, type: z.literal('same-half-plane'), points: pair, boundary: id, side: z.union([z.literal(1), z.literal(-1)]).optional() }).strict(),
  z.object({ ...relationBase, type: z.literal('inside-area'), point: id, area: id, membership: z.enum(['interior', 'boundary']).optional() }).strict(),
  z.object({ ...relationBase, type: z.literal('reflection'), refs: z.array(id).min(2).max(3), centerOrAxis: id.optional(), drivenPoint: id.optional() }).strict(),
  z.object({ ...relationBase, type: z.literal('expression'), refs: z.array(id), expression, value: number.optional() }).strict(),
]);
const layer = z.object({ id, label: z.string().min(1), order: z.number().int(), visible: z.boolean(), locked: z.boolean() }).strict();
const group = z.object({ id, label: z.string().min(1), memberIds: z.array(id), visible: z.boolean(), locked: z.boolean(), selection, target: z.boolean().optional(), targetId: id.optional(), color: color.optional() }).strict();
const overlay = z.object({ visible: z.boolean(), title: z.string(), content: z.string(), expression: expression.optional(), unit: z.string().max(32).optional(), precision: z.number().int().min(0).max(12).optional(), position: z.enum(['top-left', 'top-right', 'bottom-left', 'bottom-right']).optional() }).strict();
const stepVisualStyle = z.object({
  strokeWidth: number.min(0).max(20).optional(),
  strokeOpacity: number.min(0).max(1).optional(),
  fillOpacity: number.min(0).max(1).optional(),
  pointSize: number.min(0).max(30).optional(),
  labelSize: number.min(6).max(72).optional(),
  labelOffset: z.tuple([number, number]).optional(),
  angleRadius: number.positive().max(10).optional(),
  markHeight: number.positive().max(100).optional(),
}).strict();
const objectState = z.object({
  visible: z.boolean().optional(),
  emphasis: z.enum(['none', 'secondary', 'primary']).optional(),
  emphasisColor: color.optional(),
  color: color.optional(),
  label: z.string().optional(),
  showLabel: z.boolean().optional(),
  dashed: z.boolean().optional(),
  style: stepVisualStyle.optional(),
  overlay: overlay.optional(),
  interactive: z.boolean().optional(),
  value: number.optional(),
}).strict();
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

/** Referencias que fijan el orden de construcción de un objeto (no la presentación). */
function constructionSources(object: DiagramObject): string[] {
  const expressionRoots = (sources: Array<string | undefined>) => sources.flatMap(source => {
    if (!source) return [];
    try { return extractMathExpressionIdentifiers(source).map(identifier => identifier.split('.')[0]); }
    catch { return []; }
  });
  if (object.objectType === 'point') {
    const definition = object.definition;
    return [
      ...objectConstructionReferences(object),
      ...(object.mobility.type === 'on-support' ? [object.mobility.support] : []),
      ...(object.mobility.type === 'on-points' ? object.mobility.points : []),
      ...(definition.type === 'expression' ? expressionRoots([definition.x, definition.y]) : []),
    ];
  }
  if (object.objectType === 'control') return expressionRoots([object.range.maxExpression]);
  const expressions = object.objectType === 'path' && object.geometry.type === 'function'
    ? [object.geometry.expression]
    : object.objectType === 'path' && object.geometry.type === 'parametric'
      ? [object.geometry.x, object.geometry.y]
      : object.objectType === 'mark' ? [object.spacingExpression] : [];
  return [...objectConstructionReferences(object), ...expressionRoots(expressions)];
}

function validateConstructionCycles(spec: DiagramSpecV3, context: z.RefinementCtx): void {
  const ids = new Set(spec.objects.map(object => object.id));
  const sources = new Map(spec.objects.map(object => [
    object.id,
    constructionSources(object).filter(source => ids.has(source) && source !== object.id),
  ]));
  const state = new Map<string, 'visiting' | 'done'>();
  const reported = new Set<string>();
  const visit = (id: string, path: string[]): void => {
    if (state.get(id) === 'done') return;
    if (state.get(id) === 'visiting') {
      const cycle = [...path.slice(path.indexOf(id)), id];
      const key = [...new Set(cycle)].sort().join('|');
      if (!reported.has(key)) {
        reported.add(key);
        addIssue(context, ['objects', spec.objects.findIndex(object => object.id === id)], `La dependencia ${cycle.join(' → ')} forma un ciclo de construcción.`);
      }
      return;
    }
    state.set(id, 'visiting');
    (sources.get(id) ?? []).forEach(source => visit(source, [...path, id]));
    state.set(id, 'done');
  };
  spec.objects.forEach(object => visit(object.id, []));
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
  if (mobility.type === 'on-points') {
    mobility.points.forEach((ref, refIndex) => {
      if (ref === object.id) addIssue(context, ['objects', index, 'mobility', 'points', refIndex], 'Un punto no puede saltar a sí mismo.');
      else validation.requirePoint(ref, ['objects', index, 'mobility', 'points', refIndex]);
    });
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
  if (object.objectType === 'area') {
    if (object.geometry.type === 'intersection') {
      object.geometry.areas.forEach((ref, refIndex) => {
        const target = validation.objectMap.get(ref);
        if (target?.objectType !== 'area' && target?.objectType !== 'region') {
          addIssue(context, ['objects', index, 'geometry', 'areas', refIndex], `${ref} debe ser un área.`);
        }
      });
    } else {
      objectReferences(object).forEach((ref, refIndex) => validation.requirePoint(ref, ['objects', index, refIndex]));
    }
  }
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
  if (object.objectType === 'control') validateControlObject(object, index, validation, context);
  validateExpressionSources(object, index, validation, context);
}

function validateControlObject(object: Extract<DiagramObject, { objectType: 'control' }>, index: number, validation: ValidationIndex, context: z.RefinementCtx): void {
  if (object.variant === 'slider') {
    if (object.action) addIssue(context, ['objects', index, 'action'], 'Solo un control botón admite action.');
    return;
  }
  if (!object.action) {
    addIssue(context, ['objects', index, 'action'], 'Un control botón necesita action.');
    return;
  }
  if (object.action.to < object.range.min || object.action.to > object.range.max) {
    addIssue(context, ['objects', index, 'action', 'to'], 'action.to debe estar dentro de [min, max].');
  }
  object.action.effects?.forEach((effect, effectIndex) => {
    const path = ['objects', index, 'action', 'effects', effectIndex];
    const target = validation.objectMap.get(effect.control);
    if (target?.objectType !== 'control') addIssue(context, [...path, 'control'], `${effect.control} debe ser un control.`);
    if (effect.do === 'play' && target?.objectType === 'control' && target.variant !== 'button') addIssue(context, [...path, 'do'], `${effect.control} debe ser un botón para poder animarse.`);
    if (effect.on === 'release' && object.action?.behavior !== 'toggle') addIssue(context, [...path, 'on'], 'release solo existe en botones toggle.');
    [effect.from, effect.when].forEach(source => {
      if (!source) return;
      try {
        extractMathExpressionIdentifiers(source).forEach(identifier => {
          if (!validation.objectMap.has(identifier.split('.')[0])) addIssue(context, path, `La variable ${identifier} no corresponde a un objeto.`);
        });
      } catch { /* el esquema de expresión ya informa del error */ }
    });
  });
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
  if (item.type === 'equal-angle') {
    item.angles.forEach((ref, refIndex) => {
      if (validation.objectMap.get(ref)?.objectType !== 'angle') addIssue(context, ['relations', index, 'angles', refIndex], `${ref} debe ser un ángulo.`);
    });
    const [first, second] = item.angles.map(ref => validation.objectMap.get(ref));
    if (first?.objectType === 'angle' && second?.objectType === 'angle' && first.sweep !== second.sweep) {
      addIssue(context, ['relations', index, 'angles'], 'La igualdad de amplitudes necesita dos ángulos del mismo tipo.');
    }
  }
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
  if (item.type === 'inside-area') {
    validation.requirePoint(item.point, ['relations', index, 'point']);
    const area = validation.objectMap.get(item.area);
    const isPathArea = area?.objectType === 'path' && (area.geometry.type === 'polygon' || area.geometry.type === 'circle');
    if (area?.objectType !== 'area' && area?.objectType !== 'region' && !isPathArea) {
      addIssue(context, ['relations', index, 'area'], `${item.area} debe ser un área.`);
    }
  }
  if (item.type === 'same-half-plane') {
    item.points.forEach((ref, refIndex) => validation.requirePoint(ref, ['relations', index, 'points', refIndex]));
    validation.requirePoint(item.boundary, ['relations', index, 'boundary']);
  }
  if (item.type === 'perpendicular' || item.type === 'parallel') validateLinearRelation(item, index, validation);
}

export const diagramSpecV3Schema = z.object({
  version: z.literal(DIAGRAM_SPEC_VERSION), renderer: z.literal(DIAGRAM_RENDERER_ID), title: z.string().min(1), componentId: id,
  category: z.string().min(1), mode: z.enum(['simulation', 'diagram', 'inline']), axis: z.boolean(), grid: z.boolean(), showLabels: z.boolean().optional(), showHeader: z.boolean().optional(),
  header: header.optional(),
  viewport: z.object({ bounds: z.tuple([number, number, number, number]), home: z.tuple([number, number, number, number]), minZoom: number.positive(), maxZoom: number.positive(), padding: number.min(0).max(0.5) }).strict(),
  layers: z.array(layer).min(1), groups: z.array(group), objects: z.array(diagramObject).min(1), relations: z.array(relation), steps: z.array(step), note: z.string(),
  translations: z.record(z.string(), z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    note: z.string().optional(),
    description: z.string().optional(),
    steps: z.record(z.string(), z.union([z.string(), z.object({ label: z.string().optional(), description: z.string().optional(), overlays: z.record(z.string(), z.object({ title: z.string().optional(), content: z.string().optional() }).strict()).optional() })])).optional(),
    labels: z.record(z.string(), z.string()).optional(),
    annotations: z.record(z.string(), z.string()).optional(),
    titles: z.record(z.string(), z.string()).optional(),
    subtitles: z.record(z.string(), z.string()).optional(),
    texts: z.record(z.string(), z.string()).optional(),
    descriptions: z.record(z.string(), z.string()).optional(),
    ariaLabels: z.record(z.string(), z.string()).optional(),
    rules: z.record(z.string(), z.array(z.string())).optional(),
    blocks: z.record(z.string(), z.record(z.string(), z.object({ title: z.string().optional(), text: z.string().optional(), rules: z.array(z.string()).optional() }).strict())).optional(),
  })).optional(),
}).strict().superRefine((spec, context) => {
  const current = spec as DiagramSpecV3;
  validateUniqueIds(current, context);
  validatePublicIds(current, context);
  validateConstructionCycles(current, context);
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
  current.steps.forEach((item, index) => Object.entries(item.objectStates ?? {}).forEach(([objectId, state]) => {
    const overlay = state.overlay;
    if (!overlay) return;
    const sources = [
      ...(overlay.expression ? [overlay.expression] : []),
      ...diagramTemplateExpressions(overlay.content, overlay.expression).map(entry => entry.expression),
    ];
    sources.forEach(source => {
      try {
        extractMathExpressionIdentifiers(source).forEach(identifier => {
          if (!validation.objectMap.has(identifier.split('.')[0])) {
            addIssue(context, ['steps', index, 'objectStates', objectId, 'overlay', 'expression'], `La expresión ${identifier} del paso ${item.id} no corresponde a un objeto.`);
          }
        });
      } catch { /* El campo de expresión ya contiene el diagnóstico sintáctico. */ }
    });
  }));
  current.relations.forEach((item, index) => validateRelation(item, index, validation, context));
});

export function parseDiagramSpecV3(value: unknown): { success: true; data: DiagramSpecV3 } | { success: false; error: DiagramSpecValidationError } {
  const result = diagramSpecV3Schema.safeParse(value);
  if (result.success) return { success: true, data: result.data as DiagramSpecV3 };
  return { success: false, error: new DiagramSpecValidationError(result.error.issues) };
}
