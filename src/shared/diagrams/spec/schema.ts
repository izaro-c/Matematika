import { z } from 'zod';
import {
  DIAGRAM_RENDERER_ID,
  DIAGRAM_SPEC_VERSION,
  type DiagramSpecV2,
} from './types';
import { DiagramExpressionError, extractMathExpressionIdentifiers, parseMathExpression } from './expressions';

const idSchema = z.string().min(1).regex(/^[A-Za-z][A-Za-z0-9_-]*$/, 'Debe empezar por una letra y usar solo letras, números, _ o -.');
const finiteNumber = z.number().finite();
const boundsSchema = z.tuple([finiteNumber, finiteNumber, finiteNumber, finiteNumber])
  .superRefine(([left, top, right, bottom], context) => {
    if (left >= right) context.addIssue({ code: 'custom', message: 'El límite izquierdo debe ser menor que el derecho.' });
    if (bottom >= top) context.addIssue({ code: 'custom', message: 'El límite inferior debe ser menor que el superior.' });
  });
const extensionsSchema = z.record(z.string(), z.unknown()).default({});
const optionalExtensionsSchema = z.record(z.string(), z.unknown()).optional();

export const diagramColorTokenSchema = z.enum([
  'carbon', 'terracota', 'salvia', 'pizarra', 'ocre', 'pavo', 'granada', 'musgo',
]);

export const diagramElementKindSchema = z.enum([
  'segment', 'line', 'ray', 'polygon', 'circle', 'arc', 'functionCurve', 'parametricCurve',
  'poincareGeodesic', 'poincareArc', 'intersection', 'midpoint', 'perpendicularFoot',
  'baseExtension', 'perpendicular', 'parallel', 'angleBisector', 'angle', 'nonReflexAngle',
  'rightAngle', 'congruenceMark', 'measureTicks', 'perpendicularMark', 'dimensionLine', 'measurement',
  'grid', 'areaDecomposition', 'text', 'label', 'formula', 'infoPanel',
]);

const expressionSchema = z.string().min(1).superRefine((source, context) => {
  try {
    parseMathExpression(source);
  } catch (error) {
    context.addIssue({ code: 'custom', message: error instanceof DiagramExpressionError ? error.message : 'Expresión matemática no válida.' });
  }
});

const elementPropertiesSchema = z.object({
  expression: expressionSchema.optional(),
  xExpression: expressionSchema.optional(),
  yExpression: expressionSchema.optional(),
  parameter: idSchema.optional(),
  domain: z.tuple([finiteNumber, finiteNumber]).optional(),
  samples: z.number().int().min(8).max(2048).optional(),
  unit: z.string().max(32).optional(),
  precision: z.number().int().min(0).max(12).optional(),
  offset: finiteNumber.optional(),
  markCount: z.number().int().min(1).max(4).optional(),
  tickDistance: finiteNumber.positive().max(100).optional(),
  tickDistanceExpression: expressionSchema.optional(),
  minorTickCount: z.number().int().min(0).max(10).optional(),
  rows: z.number().int().min(1).max(100).optional(),
  columns: z.number().int().min(1).max(100).optional(),
  title: z.string().min(1).optional(),
  anchorMode: z.enum(['reference', 'viewport']).optional(),
  viewportPosition: z.tuple([
    finiteNumber.min(0).max(1),
    finiteNumber.min(0).max(1),
  ]).optional(),
  anchorParameter: finiteNumber.min(0).max(1).optional(),
  clockwise: z.boolean().optional(),
  restrictToSupports: z.boolean().optional(),
  visibleWhen: expressionSchema.optional(),
  textRules: z.array(z.object({ when: expressionSchema, text: z.string() }).strict()).max(12).optional(),
}).strict().superRefine((properties, context) => {
  if (properties.domain && properties.domain[0] >= properties.domain[1]) {
    context.addIssue({ code: 'custom', message: 'El inicio del dominio debe ser menor que el final.', path: ['domain'] });
  }
});

const selectionSchema = z.object({
  selectable: z.boolean(),
  highlightable: z.boolean().optional(),
  dimOthersOnHighlight: z.boolean().optional(),
  ariaLabel: z.string().min(1).optional(),
  role: z.enum(['primary', 'secondary', 'construction', 'annotation']).optional(),
}).strict();

const visualStyleSchema = z.object({
  strokeWidth: finiteNumber.min(0).max(20).optional(),
  strokeOpacity: finiteNumber.min(0).max(1).optional(),
  fillOpacity: finiteNumber.min(0).max(1).optional(),
  pointSize: finiteNumber.min(0).max(30).optional(),
  angleRadius: finiteNumber.positive().max(10).optional(),
  markHeight: finiteNumber.positive().max(100).optional(),
  labelOffset: z.tuple([finiteNumber, finiteNumber]).optional(),
  textOffset: z.tuple([finiteNumber, finiteNumber]).optional(),
  labelSize: finiteNumber.min(6).max(72).optional(),
  highlightStrokeWidth: finiteNumber.min(0).max(30).optional(),
  highlightFillOpacity: finiteNumber.min(0).max(1).optional(),
  highlightPointSize: finiteNumber.min(0).max(40).optional(),
  highlightVisible: z.boolean().optional(),
  preserveColorOnHighlight: z.boolean().optional(),
}).strict();

const sceneBaseShape = {
  id: idSchema,
  label: z.string().min(1),
  color: diagramColorTokenSchema,
  layerId: idSchema,
  order: z.number().int(),
  visible: z.boolean(),
  locked: z.boolean(),
  groupIds: z.array(idSchema),
  selection: selectionSchema,
  target: z.boolean(),
  targetId: idSchema.optional(),
  style: visualStyleSchema.optional(),
  extensions: optionalExtensionsSchema,
};

const pointSchema = z.object({
  ...sceneBaseShape,
  x: finiteNumber,
  y: finiteNumber,
  showLabel: z.boolean().optional(),
  fixed: z.boolean(),
  constraint: z.enum(['free', 'fixed', 'horizontal', 'vertical', 'glider', 'derived', 'constrained']),
  gliderTarget: idSchema.optional(),
  dependencies: z.array(idSchema).optional(),
  xExpression: expressionSchema.optional(),
  yExpression: expressionSchema.optional(),
  constraintIds: z.array(idSchema).optional(),
  snapToGrid: z.boolean().optional(),
  snapSize: z.number().positive().finite().optional(),
}).strict();


const elementSchema = z.object({
  ...sceneBaseShape,
  kind: diagramElementKindSchema,
  refs: z.array(idSchema),
  dashed: z.boolean().optional(),
  text: z.string().optional(),
  properties: elementPropertiesSchema.optional(),
}).strict();

const constraintSchema = z.object({
  id: idSchema,
  label: z.string().min(1),
  kind: z.enum(['fixed', 'horizontal', 'vertical', 'coincident', 'on', 'distance', 'equalLength', 'equalAngle', 'midpoint', 'perpendicular', 'parallel', 'insideDisk', 'sameSide', 'expression']),
  refs: z.array(idSchema),
  expression: expressionSchema.optional(),
  value: finiteNumber.optional(),
  enabled: z.boolean(),
}).strict();

const dependencySchema = z.object({
  sourceId: idSchema,
  targetId: idSchema,
  relation: z.enum(['construction', 'expression', 'constraint']),
  constraintId: idSchema.optional(),
}).strict();

const sliderSchema = z.object({
  ...sceneBaseShape,
  x: finiteNumber,
  y: finiteNumber,
  min: finiteNumber,
  max: finiteNumber,
  maxExpression: expressionSchema.optional(),
  value: finiteNumber,
  step: finiteNumber.positive(),
}).strict().superRefine((slider, context) => {
  if (slider.max <= slider.min) context.addIssue({ code: 'custom', message: 'max debe ser mayor que min.', path: ['max'] });
  if (slider.value < slider.min || slider.value > slider.max) context.addIssue({ code: 'custom', message: 'value debe estar dentro de [min, max].', path: ['value'] });
});

const stepOverlaySchema = z.object({
  visible: z.boolean(),
  title: z.string(),
  content: z.string(),
  expression: expressionSchema.optional(),
  unit: z.string().max(32).optional(),
  precision: z.number().int().min(0).max(12).optional(),
  position: z.enum(['top-left', 'top-right', 'bottom-left', 'bottom-right']).optional(),
}).strict();

const stepObjectStateSchema = z.object({
  visible: z.boolean().optional(),
  emphasis: z.enum(['none', 'secondary', 'primary']).optional(),
  label: z.string().optional(),
  overlay: stepOverlaySchema.optional(),
  interactive: z.boolean().optional(),
  value: finiteNumber.optional(),
}).strict();

const stepSchema = z.object({
  id: idSchema,
  label: z.string().min(1),
  description: z.string(),
  visibleTargets: z.array(idSchema),
  durationMs: z.number().int().min(200).max(60_000).optional(),
  objectStates: z.record(idSchema, stepObjectStateSchema).optional(),
  extensions: optionalExtensionsSchema,
}).strict();

const layerSchema = z.object({
  id: idSchema,
  label: z.string().min(1),
  order: z.number().int(),
  visible: z.boolean(),
  locked: z.boolean(),
  extensions: optionalExtensionsSchema,
}).strict();

const groupSchema = z.object({
  id: idSchema,
  label: z.string().min(1),
  memberIds: z.array(idSchema),
  visible: z.boolean(),
  locked: z.boolean(),
  selection: selectionSchema,
  target: z.boolean().optional(),
  targetId: idSchema.optional(),
  color: diagramColorTokenSchema.optional(),
  extensions: optionalExtensionsSchema,
}).strict();

const minimumRefs: Record<string, number> = {
  segment: 2, line: 2, ray: 2, polygon: 3, circle: 2, arc: 3,
  functionCurve: 0, parametricCurve: 0, poincareGeodesic: 4, poincareArc: 4, intersection: 2, midpoint: 2,
  perpendicularFoot: 3, baseExtension: 3, perpendicular: 3, parallel: 3,
  angleBisector: 3, angle: 3, nonReflexAngle: 3, rightAngle: 3, congruenceMark: 2, measureTicks: 1,
  perpendicularMark: 3, dimensionLine: 2, measurement: 1, grid: 4,
  areaDecomposition: 3, text: 1, label: 1, formula: 1, infoPanel: 1,
};

export const diagramSpecV2Schema = z.object({
  version: z.literal(DIAGRAM_SPEC_VERSION),
  renderer: z.literal(DIAGRAM_RENDERER_ID),
  title: z.string().min(1),
  componentId: idSchema,
  category: z.string().min(1),
  mode: z.enum(['simulation', 'diagram', 'inline']),
  axis: z.boolean(),
  grid: z.boolean(),
  showLabels: z.boolean().optional(),
  viewport: z.object({
    bounds: boundsSchema,
    home: boundsSchema,
    minZoom: finiteNumber.positive(),
    maxZoom: finiteNumber.positive(),
    padding: finiteNumber.min(0).max(0.5),
  }).strict().superRefine((viewport, context) => {
    if (viewport.minZoom > viewport.maxZoom) context.addIssue({ code: 'custom', message: 'minZoom no puede superar maxZoom.', path: ['minZoom'] });
  }),
  layers: z.array(layerSchema).min(1),
  groups: z.array(groupSchema),
  points: z.array(pointSchema).min(1),
  elements: z.array(elementSchema),
  sliders: z.array(sliderSchema),
  steps: z.array(stepSchema),
  constraints: z.array(constraintSchema).optional(),
  dependencies: z.array(dependencySchema).optional(),
  note: z.string(),
  extensions: extensionsSchema,
}).strict().superRefine((spec, context) => {
  const items = [...spec.points, ...spec.elements, ...spec.sliders];
  const allIds = [...items.map(item => item.id), ...spec.steps.map(step => step.id), ...spec.groups.map(group => group.id), ...(spec.constraints ?? []).map(constraint => constraint.id)];
  const seen = new Set<string>();
  for (const id of allIds) {
    if (seen.has(id)) context.addIssue({ code: 'custom', message: `El ID ${id} está duplicado.` });
    seen.add(id);
  }
  const seenLayers = new Set<string>();
  spec.layers.forEach((layer, index) => {
    if (seenLayers.has(layer.id)) context.addIssue({ code: 'custom', message: `La capa ${layer.id} está duplicada.`, path: ['layers', index, 'id'] });
    seenLayers.add(layer.id);
  });

  const itemIds = new Set(items.map(item => item.id));
  const referenceIds = new Set([...spec.points.map(item => item.id), ...spec.elements.map(item => item.id), ...spec.sliders.map(item => item.id)]);
  const layerIds = new Set(spec.layers.map(layer => layer.id));
  const groupIds = new Set(spec.groups.map(group => group.id));

  const publicTargetIds = new Map<string, string>();
  items.filter(item => item.target).forEach(item => {
    const publicId = item.targetId ?? item.id;
    const previous = publicTargetIds.get(publicId);
    if (previous) {
      context.addIssue({ code: 'custom', message: `El target público ${publicId} está duplicado en ${previous} y ${item.id}.` });
    } else {
      publicTargetIds.set(publicId, item.id);
    }
  });
  spec.groups.filter(group => group.target).forEach(group => {
    const publicId = group.targetId ?? group.id;
    const previous = publicTargetIds.get(publicId);
    if (previous) context.addIssue({ code: 'custom', message: `El target público ${publicId} está duplicado en ${previous} y el grupo ${group.id}.` });
    else publicTargetIds.set(publicId, group.id);
  });
  spec.steps.forEach(step => {
    const previous = publicTargetIds.get(step.id);
    if (previous) context.addIssue({ code: 'custom', message: `El target público ${step.id} está duplicado en ${previous} y el paso ${step.id}.` });
    else publicTargetIds.set(step.id, step.id);
  });

  items.forEach((item, index) => {
    if (!layerIds.has(item.layerId)) context.addIssue({ code: 'custom', message: `La capa ${item.layerId} de ${item.id} no existe.`, path: ['scene', index, 'layerId'] });
    item.groupIds.forEach(groupId => {
      if (!groupIds.has(groupId)) context.addIssue({ code: 'custom', message: `El grupo ${groupId} de ${item.id} no existe.` });
      const group = spec.groups.find(candidate => candidate.id === groupId);
      if (group && !group.memberIds.includes(item.id)) {
        context.addIssue({ code: 'custom', message: `${item.id} declara el grupo ${groupId}, pero el grupo no contiene el objeto.` });
      }
    });
  });

  spec.elements.forEach((element, index) => {
    const viewportAnchoredPanel = element.kind === 'infoPanel' && element.properties?.anchorMode === 'viewport';
    const required = viewportAnchoredPanel ? 0 : minimumRefs[element.kind] ?? 1;
    if (element.refs.length < required) context.addIssue({ code: 'custom', message: `${element.id} necesita al menos ${required} referencias.`, path: ['elements', index, 'refs'] });
    element.refs.forEach(ref => {
      if (!referenceIds.has(ref)) context.addIssue({ code: 'custom', message: `${element.id} referencia el objeto inexistente ${ref}.`, path: ['elements', index, 'refs'] });
    });
    if (element.kind === 'intersection') {
      const linearSupportKinds = new Set(['segment', 'line', 'ray', 'perpendicular', 'parallel', 'angleBisector']);
      if (element.refs.length !== 2) {
        context.addIssue({ code: 'custom', message: `${element.id} necesita exactamente dos soportes lineales.`, path: ['elements', index, 'refs'] });
      }
      element.refs.forEach((ref, refIndex) => {
        const support = spec.elements.find(candidate => candidate.id === ref);
        if (!support || !linearSupportKinds.has(support.kind)) {
          context.addIssue({
            code: 'custom',
            message: `${element.id} solo admite rectas, segmentos, semirrectas, perpendiculares, paralelas o bisectrices como soportes.`,
            path: ['elements', index, 'refs', refIndex],
          });
        }
      });
    }
    if (element.kind === 'measureTicks') {
      const segment = spec.elements.find(candidate => candidate.id === element.refs[0]);
      if (element.refs.length !== 1 || segment?.kind !== 'segment') {
        context.addIssue({
          code: 'custom',
          message: `${element.id} necesita exactamente un segmento como referencia.`,
          path: ['elements', index, 'refs'],
        });
      }
    }
    if (element.kind === 'functionCurve' && !element.properties?.expression) {
      context.addIssue({ code: 'custom', message: `${element.id} necesita properties.expression.`, path: ['elements', index, 'properties', 'expression'] });
    }
    if (element.kind === 'parametricCurve' && (!element.properties?.xExpression || !element.properties.yExpression)) {
      context.addIssue({ code: 'custom', message: `${element.id} necesita expresiones x e y.`, path: ['elements', index, 'properties'] });
    }
    if (element.kind !== 'label' && element.properties?.anchorParameter !== undefined) {
      context.addIssue({
        code: 'custom',
        message: `${element.id} solo puede usar properties.anchorParameter si es una etiqueta.`,
        path: ['elements', index, 'properties', 'anchorParameter'],
      });
    }
    if (viewportAnchoredPanel && !element.properties?.viewportPosition) {
      context.addIssue({ code: 'custom', message: `${element.id} necesita properties.viewportPosition.`, path: ['elements', index, 'properties', 'viewportPosition'] });
    }
  });
  spec.points.forEach((point, index) => {
    if (point.fixed && point.constraint !== 'fixed' && point.constraint !== 'derived') {
      context.addIssue({
        code: 'custom',
        message: `${point.id} está marcado como fijo y a la vez usa una restricción móvil (${point.constraint}).`,
        path: ['points', index, 'fixed'],
      });
    }
    if (point.constraint === 'glider' && (!point.gliderTarget || !referenceIds.has(point.gliderTarget))) {
      context.addIssue({ code: 'custom', message: `El glider ${point.id} necesita un soporte existente.`, path: ['points', index, 'gliderTarget'] });
    }
    if (point.constraint === 'derived' && (!point.xExpression || !point.yExpression || !point.dependencies?.length)) {
      context.addIssue({ code: 'custom', message: `El punto derivado ${point.id} necesita expresiones x/y y dependencias explícitas.`, path: ['points', index] });
    }
    if (point.constraint === 'constrained' && !point.constraintIds?.length) {
      context.addIssue({ code: 'custom', message: `El punto restringido ${point.id} necesita al menos una restricción.`, path: ['points', index, 'constraintIds'] });
    }
    point.dependencies?.forEach(dependency => {
      if (!referenceIds.has(dependency)) context.addIssue({ code: 'custom', message: `${point.id} depende de ${dependency}, que no existe.`, path: ['points', index, 'dependencies'] });
    });
  });

  spec.steps.forEach((step, index) => {
    const stateIds = Object.keys(step.objectStates ?? {});
    const referencedIds = [...step.visibleTargets, ...stateIds];
    referencedIds.forEach(target => {
      if (!itemIds.has(target)) {
        context.addIssue({ code: 'custom', message: `El paso ${step.id} referencia el objeto inexistente ${target}.`, path: ['steps', index] });
      }
    });
    if (new Set(step.visibleTargets).size !== step.visibleTargets.length) {
      context.addIssue({ code: 'custom', message: `El paso ${step.id} repite objetos visibles.`, path: ['steps', index, 'visibleTargets'] });
    }
    Object.entries(step.objectStates ?? {}).forEach(([targetId, state]) => {
      const slider = spec.sliders.find(item => item.id === targetId);
      if (state.value !== undefined && !slider) {
        context.addIssue({ code: 'custom', message: `Solo un slider puede recibir value temporal; ${targetId} no lo es.`, path: ['steps', index, 'objectStates', targetId, 'value'] });
      }
      if (slider && state.value !== undefined && (state.value < slider.min || state.value > slider.max)) {
        context.addIssue({ code: 'custom', message: `El valor temporal de ${targetId} queda fuera de [${slider.min}, ${slider.max}].`, path: ['steps', index, 'objectStates', targetId, 'value'] });
      }
    });
  });

  const constraintIds = new Set((spec.constraints ?? []).map(constraint => constraint.id));
  spec.points.forEach((point, index) => point.constraintIds?.forEach(constraintId => {
    if (!constraintIds.has(constraintId)) context.addIssue({ code: 'custom', message: `${point.id} usa la restricción inexistente ${constraintId}.`, path: ['points', index, 'constraintIds'] });
  }));

  const expressionEntries: Array<{ source: string; path: Array<string | number>; parameter?: string; targetId?: string }> = [];
  spec.points.forEach((point, index) => {
    if (point.xExpression) expressionEntries.push({ source: point.xExpression, path: ['points', index, 'xExpression'], targetId: point.id });
    if (point.yExpression) expressionEntries.push({ source: point.yExpression, path: ['points', index, 'yExpression'], targetId: point.id });
  });
  spec.elements.forEach((element, index) => {
    const properties = element.properties;
    if (!properties) return;
    if (properties.expression) expressionEntries.push({ source: properties.expression, path: ['elements', index, 'properties', 'expression'], parameter: properties.parameter, targetId: element.id });
    if (properties.xExpression) expressionEntries.push({ source: properties.xExpression, path: ['elements', index, 'properties', 'xExpression'], parameter: properties.parameter, targetId: element.id });
    if (properties.yExpression) expressionEntries.push({ source: properties.yExpression, path: ['elements', index, 'properties', 'yExpression'], parameter: properties.parameter, targetId: element.id });
    if (properties.tickDistanceExpression) expressionEntries.push({ source: properties.tickDistanceExpression, path: ['elements', index, 'properties', 'tickDistanceExpression'], targetId: element.id });
    if (properties.visibleWhen) expressionEntries.push({ source: properties.visibleWhen, path: ['elements', index, 'properties', 'visibleWhen'], targetId: element.id });
    properties.textRules?.forEach((rule, ruleIndex) => expressionEntries.push({ source: rule.when, path: ['elements', index, 'properties', 'textRules', ruleIndex, 'when'], targetId: element.id }));
  });
  spec.sliders.forEach((slider, index) => {
    if (slider.maxExpression) expressionEntries.push({ source: slider.maxExpression, path: ['sliders', index, 'maxExpression'], targetId: slider.id });
  });
  spec.steps.forEach((step, stepIndex) => {
    Object.entries(step.objectStates ?? {}).forEach(([objectId, state]) => {
      if (state.overlay?.expression) expressionEntries.push({
        source: state.overlay.expression,
        path: ['steps', stepIndex, 'objectStates', objectId, 'overlay', 'expression'],
      });
    });
  });
  (spec.constraints ?? []).forEach((constraint, index) => {
    const requiredRefs = constraint.kind === 'fixed' || constraint.kind === 'expression'
      ? 1
      : constraint.kind === 'equalAngle'
        ? 5
        : constraint.kind === 'equalLength' || constraint.kind === 'midpoint'
        || constraint.kind === 'perpendicular' || constraint.kind === 'parallel'
        || constraint.kind === 'insideDisk' || constraint.kind === 'sameSide'
        ? 3
        : 2;
    if (constraint.refs.length < requiredRefs) context.addIssue({ code: 'custom', message: `${constraint.id} necesita al menos ${requiredRefs} referencias.`, path: ['constraints', index, 'refs'] });
    constraint.refs.forEach(ref => {
      if (!referenceIds.has(ref)) context.addIssue({ code: 'custom', message: `${constraint.id} referencia ${ref}, que no existe.`, path: ['constraints', index, 'refs'] });
    });
    if ((constraint.kind === 'distance' || constraint.kind === 'expression') && constraint.value === undefined && !constraint.expression) {
      context.addIssue({ code: 'custom', message: `${constraint.id} necesita value o expression.`, path: ['constraints', index] });
    }
    if (constraint.kind === 'equalLength') {
      const [targetPointId, anchorPointId, sourceSegmentId] = constraint.refs;
      const sourceSegment = spec.elements.find(element => element.id === sourceSegmentId);
      const targetSegment = spec.elements.find(element => (
        element.kind === 'segment'
        && element.refs.includes(targetPointId)
        && element.refs.includes(anchorPointId)
      ));
      if (!spec.points.some(point => point.id === targetPointId) || !spec.points.some(point => point.id === anchorPointId)) {
        context.addIssue({ code: 'custom', message: `${constraint.id} necesita un extremo móvil y un extremo ancla que sean puntos.`, path: ['constraints', index, 'refs'] });
      }
      if (!sourceSegment || sourceSegment.kind !== 'segment') {
        context.addIssue({ code: 'custom', message: `${constraint.id} necesita un segmento de referencia.`, path: ['constraints', index, 'refs', 2] });
      }
      if (!targetSegment) {
        context.addIssue({ code: 'custom', message: `${constraint.id} necesita que los dos primeros puntos formen un segmento existente.`, path: ['constraints', index, 'refs'] });
      } else if (targetSegment.id === sourceSegmentId) {
        context.addIssue({ code: 'custom', message: `${constraint.id} debe relacionar dos segmentos distintos.`, path: ['constraints', index, 'refs', 2] });
      }
      const assignedPoint = spec.points.find(point => point.id === targetPointId);
      if (!assignedPoint?.constraintIds?.includes(constraint.id)) {
        context.addIssue({ code: 'custom', message: `${constraint.id} debe estar asignada al extremo móvil ${targetPointId}.`, path: ['constraints', index] });
      }
    }
    if (constraint.kind === 'equalAngle') {
      const [targetPointId, vertexPointId, fixedRayPointId, sourceAngleId, targetAngleId] = constraint.refs;
      const sourceAngle = spec.elements.find(element => element.id === sourceAngleId);
      const targetAngle = spec.elements.find(element => element.id === targetAngleId);
      if (![targetPointId, vertexPointId, fixedRayPointId].every(id => spec.points.some(point => point.id === id))) {
        context.addIssue({ code: 'custom', message: `${constraint.id} necesita un lado móvil, un vértice y un lado fijo definidos por puntos.`, path: ['constraints', index, 'refs'] });
      }
      if (!targetAngle || (targetAngle.kind !== 'angle' && targetAngle.kind !== 'nonReflexAngle')) {
        context.addIssue({ code: 'custom', message: `${constraint.id} necesita que los tres primeros puntos formen un ángulo editable existente.`, path: ['constraints', index, 'refs'] });
      } else if (
        targetAngle.refs[1] !== vertexPointId
        || !targetAngle.refs.includes(targetPointId)
        || !targetAngle.refs.includes(fixedRayPointId)
      ) {
        context.addIssue({ code: 'custom', message: `${constraint.id} no coincide con los puntos del ángulo que se ajustará.`, path: ['constraints', index, 'refs'] });
      }
      if (!sourceAngle || (sourceAngle.kind !== 'angle' && sourceAngle.kind !== 'nonReflexAngle')) {
        context.addIssue({ code: 'custom', message: `${constraint.id} necesita un ángulo de referencia.`, path: ['constraints', index, 'refs', 3] });
      } else if (targetAngle?.id === sourceAngle.id) {
        context.addIssue({ code: 'custom', message: `${constraint.id} debe relacionar dos ángulos distintos.`, path: ['constraints', index, 'refs', 3] });
      } else if (targetAngle && targetAngle.kind !== sourceAngle.kind) {
        context.addIssue({ code: 'custom', message: `${constraint.id} debe relacionar ángulos del mismo tipo.`, path: ['constraints', index, 'refs', 3] });
      }
      const assignedPoint = spec.points.find(point => point.id === targetPointId);
      if (!assignedPoint?.constraintIds?.includes(constraint.id)) {
        context.addIssue({ code: 'custom', message: `${constraint.id} debe estar asignada al extremo móvil ${targetPointId}.`, path: ['constraints', index] });
      }
    }
    if (constraint.kind === 'midpoint') {
      const [targetPointId, firstEndpointId, secondEndpointId] = constraint.refs;
      if (![targetPointId, firstEndpointId, secondEndpointId].every(id => spec.points.some(point => point.id === id))) {
        context.addIssue({ code: 'custom', message: `${constraint.id} solo admite puntos como referencias.`, path: ['constraints', index, 'refs'] });
      }
      if (firstEndpointId === secondEndpointId || targetPointId === firstEndpointId || targetPointId === secondEndpointId) {
        context.addIssue({ code: 'custom', message: `${constraint.id} necesita tres puntos distintos.`, path: ['constraints', index, 'refs'] });
      }
      const assignedPoint = spec.points.find(point => point.id === targetPointId);
      if (!assignedPoint?.constraintIds?.includes(constraint.id)) {
        context.addIssue({ code: 'custom', message: `${constraint.id} debe estar asignada al punto medio ${targetPointId}.`, path: ['constraints', index] });
      }
    }
    if (constraint.expression) expressionEntries.push({ source: constraint.expression, path: ['constraints', index, 'expression'] });
  });
  expressionEntries.forEach(entry => {
    try {
      extractMathExpressionIdentifiers(entry.source).forEach(identifier => {
        const root = identifier.split('.')[0];
        if (!referenceIds.has(root) && root !== entry.parameter && root !== 'x' && root !== 't') {
          context.addIssue({ code: 'custom', message: `La variable ${identifier} no corresponde a un objeto de la escena.`, path: entry.path });
        } else if (entry.targetId && referenceIds.has(root) && !(spec.dependencies ?? []).some(dependency => dependency.sourceId === root && dependency.targetId === entry.targetId)) {
          context.addIssue({ code: 'custom', message: `La dependencia ${root} → ${entry.targetId} debe declararse explícitamente.`, path: entry.path });
        }
      });
    } catch {
      // expressionSchema already reports syntax errors with the precise field path.
    }
  });

  const dependencyKeys = new Set<string>();
  (spec.dependencies ?? []).forEach((dependency, index) => {
    if (!referenceIds.has(dependency.sourceId)) context.addIssue({ code: 'custom', message: `La dependencia parte de ${dependency.sourceId}, que no existe.`, path: ['dependencies', index, 'sourceId'] });
    if (!referenceIds.has(dependency.targetId)) context.addIssue({ code: 'custom', message: `La dependencia termina en ${dependency.targetId}, que no existe.`, path: ['dependencies', index, 'targetId'] });
    if (dependency.constraintId && !constraintIds.has(dependency.constraintId)) context.addIssue({ code: 'custom', message: `La dependencia usa la restricción inexistente ${dependency.constraintId}.`, path: ['dependencies', index, 'constraintId'] });
    const key = `${dependency.sourceId}:${dependency.targetId}:${dependency.relation}:${dependency.constraintId ?? ''}`;
    if (dependencyKeys.has(key)) context.addIssue({ code: 'custom', message: 'La arista de dependencia está duplicada.', path: ['dependencies', index] });
    dependencyKeys.add(key);
  });

  spec.steps.forEach((step, index) => step.visibleTargets.forEach(target => {
    if (!itemIds.has(target)) context.addIssue({ code: 'custom', message: `El paso ${step.id} referencia ${target}, que no existe.`, path: ['steps', index, 'visibleTargets'] });
  }));

  spec.groups.forEach((group, index) => group.memberIds.forEach(memberId => {
    if (!itemIds.has(memberId)) context.addIssue({ code: 'custom', message: `El grupo ${group.id} contiene ${memberId}, que no existe.`, path: ['groups', index, 'memberIds'] });
    const member = items.find(item => item.id === memberId);
    if (member && !member.groupIds.includes(group.id)) {
      context.addIssue({ code: 'custom', message: `El grupo ${group.id} contiene ${memberId}, pero el objeto no declara el grupo.`, path: ['groups', index, 'memberIds'] });
    }
  }));

  const dependencyMap = new Map<string, readonly string[]>([
    ...spec.points.map(point => [point.id, [
      ...(point.constraint === 'glider' && point.gliderTarget ? [point.gliderTarget] : []),
      ...(point.dependencies ?? []),
    ]] as const),
    ...spec.elements.map(element => [element.id, [...element.refs]] as const),
    ...spec.sliders.map(slider => [slider.id, [] as string[]] as const),
  ]);
  (spec.dependencies ?? []).forEach(dependency => {
    if (!dependencyMap.has(dependency.targetId)) return;
    dependencyMap.set(dependency.targetId, [...(dependencyMap.get(dependency.targetId) ?? []), dependency.sourceId]);
  });
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const visit = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    const cyclic = (dependencyMap.get(id) ?? []).some(dependency => dependencyMap.has(dependency) && visit(dependency));
    visiting.delete(id);
    visited.add(id);
    return cyclic;
  };
  for (const id of dependencyMap.keys()) {
    if (visit(id)) {
      context.addIssue({ code: 'custom', message: `La dependencia de ${id} forma un ciclo y no admite un orden de construcción.` });
      break;
    }
  }
});

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

export function parseDiagramSpecV2(value: unknown): { success: true; data: DiagramSpecV2 } | { success: false; error: DiagramSpecValidationError } {
  const result = diagramSpecV2Schema.safeParse(value);
  if (result.success) return { success: true, data: result.data as DiagramSpecV2 };
  return { success: false, error: new DiagramSpecValidationError(result.error.issues) };
}

export function createDiagramSpec(value: unknown): DiagramSpecV2 {
  const parsed = parseDiagramSpecV2(value);
  if (!parsed.success) throw parsed.error;
  return parsed.data;
}
