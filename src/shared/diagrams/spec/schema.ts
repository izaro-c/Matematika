import { z } from 'zod';
import {
  DIAGRAM_RENDERER_ID,
  DIAGRAM_SPEC_VERSION,
  type DiagramSpecV2,
} from './types';

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
  'segment', 'line', 'ray', 'polygon', 'circle', 'midpoint', 'perpendicularFoot',
  'baseExtension', 'perpendicular', 'parallel', 'angleBisector', 'angle',
  'rightAngle', 'measurement', 'text',
]);

const selectionSchema = z.object({
  selectable: z.boolean(),
  ariaLabel: z.string().min(1).optional(),
  role: z.enum(['primary', 'secondary', 'construction', 'annotation']).optional(),
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
  extensions: optionalExtensionsSchema,
};

const pointSchema = z.object({
  ...sceneBaseShape,
  x: finiteNumber,
  y: finiteNumber,
  fixed: z.boolean(),
  constraint: z.enum(['free', 'fixed', 'horizontal', 'vertical', 'glider']),
  gliderTarget: idSchema.optional(),
}).strict();

const elementSchema = z.object({
  ...sceneBaseShape,
  kind: diagramElementKindSchema,
  refs: z.array(idSchema),
  dashed: z.boolean().optional(),
  text: z.string().optional(),
}).strict();

const sliderSchema = z.object({
  ...sceneBaseShape,
  x: finiteNumber,
  y: finiteNumber,
  min: finiteNumber,
  max: finiteNumber,
  value: finiteNumber,
  step: finiteNumber.positive(),
}).strict().superRefine((slider, context) => {
  if (slider.max <= slider.min) context.addIssue({ code: 'custom', message: 'max debe ser mayor que min.', path: ['max'] });
  if (slider.value < slider.min || slider.value > slider.max) context.addIssue({ code: 'custom', message: 'value debe estar dentro de [min, max].', path: ['value'] });
});

const stepSchema = z.object({
  id: idSchema,
  label: z.string().min(1),
  description: z.string(),
  visibleTargets: z.array(idSchema),
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
  extensions: optionalExtensionsSchema,
}).strict();

const minimumRefs: Record<string, number> = {
  segment: 2, line: 2, ray: 2, polygon: 3, circle: 2, midpoint: 2,
  perpendicularFoot: 3, baseExtension: 3, perpendicular: 3, parallel: 3,
  angleBisector: 3, angle: 3, rightAngle: 3, measurement: 1, text: 1,
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
  note: z.string(),
  extensions: extensionsSchema,
}).strict().superRefine((spec, context) => {
  const items = [...spec.points, ...spec.elements, ...spec.sliders];
  const allIds = [...items.map(item => item.id), ...spec.steps.map(step => step.id), ...spec.groups.map(group => group.id)];
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
  const referenceIds = new Set([...spec.points.map(item => item.id), ...spec.elements.map(item => item.id)]);
  const layerIds = new Set(spec.layers.map(layer => layer.id));
  const groupIds = new Set(spec.groups.map(group => group.id));

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
    const required = minimumRefs[element.kind] ?? 1;
    if (element.refs.length < required) context.addIssue({ code: 'custom', message: `${element.id} necesita al menos ${required} referencias.`, path: ['elements', index, 'refs'] });
    element.refs.forEach(ref => {
      if (!referenceIds.has(ref)) context.addIssue({ code: 'custom', message: `${element.id} referencia el objeto inexistente ${ref}.`, path: ['elements', index, 'refs'] });
    });
  });

  spec.points.forEach((point, index) => {
    if (point.constraint === 'glider' && (!point.gliderTarget || !referenceIds.has(point.gliderTarget))) {
      context.addIssue({ code: 'custom', message: `El glider ${point.id} necesita un soporte existente.`, path: ['points', index, 'gliderTarget'] });
    }
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

  const dependencyMap = new Map<string, string[]>([
    ...spec.points.map(point => [point.id, point.constraint === 'glider' && point.gliderTarget ? [point.gliderTarget] : []] as const),
    ...spec.elements.map(element => [element.id, element.refs] as const),
    ...spec.sliders.map(slider => [slider.id, [] as string[]] as const),
  ]);
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
