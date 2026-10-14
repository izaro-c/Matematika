import { DEFAULT_ANGLE_RADIUS, DEFAULT_RIGHT_ANGLE_RADIUS, objectKind, omitKeys, relationReferences, sceneReferences, withObjectStyle, type AngleObject, type ControlObject, type DiagramObject, type DiagramRelation, type DiagramSelectionMetadata, type DiagramStepObjectState, type DiagramVisualStyle, type PointObject, type PositionedPoint } from '@/diagrams';
import { DEFAULT_LAYER_ID } from '@/diagrams/constants';
import { nextLayerItemOrder } from '../scene/sceneOrdering';
import { DEFAULT_NEW_ELEMENT_ORDER } from '../../../constants';
import { withPointMode } from './pointModes';
import type {
  ColorToken,
  ElementKind,
  PointConstraint,
  VisualDiagramModel,
  VisualElement,
  VisualPoint,
  VisualSlider,
  VisualStep,
} from '../types';

export function point(id: string, label: string, x: number, y: number, fixed = false, color: ColorToken = 'terracota', constraint: PointConstraint = fixed ? 'fixed' : 'free', gliderTarget?: string): VisualPoint {
  const base: VisualPoint = {
    id, label, color, objectType: 'point', target: true, targetId: id,
    layerId: DEFAULT_LAYER_ID, order: 0, visible: true, locked: false, groupIds: [],
    selection: { selectable: true, role: 'primary', ariaLabel: `Punto ${label}` },
    definition: { type: 'coordinates', x, y },
    mobility: { type: 'free' },
    appearance: {
      labelVisible: true,
      size: 7,
      highlightSize: 10,
      preserveColorOnHighlight: true,
    },
  };
  return withPointMode(base, constraint, { gliderTarget });
}

function defaultElementStyle(kind: ElementKind): DiagramVisualStyle {
  if (kind === 'angle' || kind === 'nonReflexAngle') return { angleRadius: DEFAULT_ANGLE_RADIUS, preserveColorOnHighlight: true };
  if (kind === 'rightAngle' || kind === 'perpendicularMark') return { angleRadius: DEFAULT_RIGHT_ANGLE_RADIUS, preserveColorOnHighlight: true };
  if (kind === 'parallelMark') return { markHeight: 0.42, strokeWidth: 2, highlightStrokeWidth: 3, preserveColorOnHighlight: true };
  const lineKinds: ElementKind[] = ['segment', 'line', 'ray', 'perpendicular', 'parallel', 'angleBisector', 'poincareGeodesic', 'poincareArc'];
  if (lineKinds.includes(kind)) return { strokeWidth: 2.4, highlightStrokeWidth: 3, preserveColorOnHighlight: true };
  return { preserveColorOnHighlight: true };
}

/** Ajustes opcionales al construir un objeto con una herramienta. */
export interface ElementOptions {
  /** Texto de anotaciones o cotas. */
  text?: string;
  dashed?: boolean;
  showLabel?: boolean;
  style?: DiagramVisualStyle;
  layerId?: string;
  order?: number;
  visible?: boolean;
  selection?: DiagramSelectionMetadata;
}

type ObjectBase = Omit<PointObject, 'objectType' | 'definition' | 'mobility' | 'appearance' | 'interaction'>;

function constructionGeometry(base: ObjectBase, kind: ElementKind, refs: string[], options: ElementOptions): DiagramObject {
  const [a, b, c, d] = refs;
  const text = options.text;
  switch (kind) {
    case 'intersection':
      return { ...base, objectType: 'point', definition: { type: 'intersection', supports: [a, b], restrictToSupports: true }, mobility: { type: 'fixed' } };
    case 'midpoint':
      return { ...base, objectType: 'point', definition: { type: 'midpoint', points: [a, b] }, mobility: { type: 'fixed' } };
    case 'perpendicularFoot':
      return { ...base, objectType: 'point', definition: { type: 'projection', point: c ?? a, support: { points: [a, b] } }, mobility: { type: 'fixed' } };
    case 'segment':
      return { ...base, objectType: 'path', geometry: { type: 'segment', points: [a, b] } };
    case 'segmentExtension':
      return { ...base, objectType: 'path', geometry: { type: 'segment', points: [a, b], construction: { type: 'segment-extension', foot: c } } };
    case 'line':
      return { ...base, objectType: 'path', geometry: { type: 'line', construction: { type: 'through-points', points: [a, b] } } };
    case 'perpendicular':
    case 'parallel':
      return { ...base, objectType: 'path', geometry: { type: 'line', construction: { type: kind, linePoints: [a, b], through: c } } };
    case 'angleBisector':
      return { ...base, objectType: 'path', geometry: { type: 'line', construction: { type: 'angle-bisector', points: [a, b, c] } } };
    case 'ray':
      return { ...base, objectType: 'path', geometry: { type: 'ray', points: [a, b] } };
    case 'polygon':
      return { ...base, objectType: 'path', geometry: { type: 'polygon', points: refs as [string, string, string, ...string[]] } };
    case 'circle':
      return { ...base, objectType: 'path', geometry: { type: 'circle', center: a, point: b } };
    case 'arc':
      return { ...base, objectType: 'path', geometry: { type: 'arc', points: [a, b, c], direction: 'counterclockwise' } };
    case 'functionCurve':
      return { ...base, objectType: 'path', geometry: { type: 'function', expression: 'sin(x)', variable: 'x', domain: [-5, 5], samples: 64, areaFill: 'none', ...(a ? { areaSide: a } : {}) } };
    case 'parametricCurve':
      return { ...base, objectType: 'path', geometry: { type: 'parametric', x: '3*cos(t)', y: '2*sin(t)', parameter: 't', domain: [0, 2 * Math.PI], samples: 64, areaFill: 'none', ...(a ? { areaSide: a } : {}) } };
    case 'poincareGeodesic':
      return { ...base, objectType: 'path', geometry: { type: 'poincare-geodesic', refs: [a, b, c, d] } };
    case 'poincareArc':
      return { ...base, objectType: 'path', geometry: { type: 'poincare-arc', refs: [a, b, c, d] } };
    case 'dimensionLine':
      return { ...base, objectType: 'path', geometry: { type: 'dimension', points: [a, b], precision: 2, ...(text ? { text } : {}) } };
    case 'angle':
    case 'nonReflexAngle':
    case 'rightAngle':
    case 'perpendicularMark':
      return {
        ...base,
        objectType: 'angle',
        points: [a, b, c],
        sweep: kind === 'angle' ? 'directed' : 'non-reflex',
        marker: kind === 'rightAngle' || kind === 'perpendicularMark' ? 'square' : 'arc',
        ...(kind === 'rightAngle' || kind === 'perpendicularMark' ? { perpendicularRelationId: `${base.id}-perpendicular` } : {}),
      };
    case 'congruenceMark':
    case 'parallelMark':
      return { ...base, objectType: 'mark', variant: kind === 'parallelMark' ? 'parallel' : 'congruence', anchor: { type: 'between-points', points: [a, b] }, count: 1 };
    case 'measureTicks':
      return { ...base, objectType: 'mark', variant: 'graduation', anchor: { type: 'path', path: a }, count: 1, spacing: 2 };
    case 'grid':
      return { ...base, objectType: 'region', geometry: { type: 'grid-region', points: [a, b, c, d], rows: 4, columns: 4 } };
    case 'areaDecomposition':
      return { ...base, objectType: 'region', geometry: { type: 'area-decomposition', points: refs as [string, string, string, ...string[]], rows: 4, columns: 4 } };
    case 'halfPlane':
      return { ...base, objectType: 'area', geometry: { type: 'half-plane', boundary: [a, b], side: c } };
    case 'areaIntersection':
      return { ...base, objectType: 'area', geometry: { type: 'intersection', areas: refs as [string, string, ...string[]] } };
    case 'measurement':
      return {
        ...base,
        objectType: 'annotation',
        variant: 'measurement',
        content: { text: text ?? '', precision: 2 },
        anchor: { type: 'object', object: a },
        measurement: b ? { refs: [a, b], mode: 'distance' } : { refs: [a], mode: 'value' },
      };
    case 'infoPanel':
      return {
        ...base,
        objectType: 'annotation',
        variant: 'panel',
        content: {
          text: text ?? '',
          title: 'Información',
          layout: 'stack',
          blocks: [{ id: 'bloque-1', title: 'Lectura', text: 'Contenido por defecto', rules: [] }],
        },
        anchor: { type: 'viewport', position: [0.08, 0.22] },
      };
    case 'label':
      return { ...base, objectType: 'annotation', variant: 'label', content: { text: text ?? '' }, anchor: { type: 'object', object: a, parameter: 0.5 } };
    case 'text':
    case 'formula':
      return {
        ...base,
        objectType: 'annotation',
        variant: kind,
        content: { text: text ?? '' },
        anchor: a ? { type: 'object', object: a } : { type: 'viewport', position: [0.5, 0.5] },
      };
  }
}

/**
 * Construye el objeto V3 que crea una herramienta a partir de sus referencias
 * en el orden de los huecos (`referenceSlotsForKind`).
 */
export function element(id: string, label: string, kind: ElementKind, refs: string[], color: ColorToken, target = true, options: ElementOptions = {}): VisualElement {
  const base: ObjectBase = {
    id, label, color, target, ...(target ? { targetId: id } : {}),
    layerId: options.layerId ?? DEFAULT_LAYER_ID,
    order: options.order ?? DEFAULT_NEW_ELEMENT_ORDER,
    visible: options.visible ?? true,
    locked: false,
    groupIds: [],
    selection: options.selection ?? { selectable: true, role: kind === 'text' || kind === 'measurement' ? 'annotation' : 'secondary', ariaLabel: label },
  };
  let object = constructionGeometry(base, kind, refs, options);
  object = withObjectStyle(object, { ...defaultElementStyle(kind), ...options.style });
  if (object.objectType === 'path' && options.dashed !== undefined) {
    object = { ...object, appearance: { ...object.appearance, dashed: options.dashed } };
  }
  if (options.showLabel !== undefined && object.objectType !== 'control' && object.objectType !== 'region' && object.objectType !== 'area' && object.objectType !== 'mark') {
    object = { ...object, appearance: { ...object.appearance, labelVisible: options.showLabel } } as DiagramObject;
  }
  return object as VisualElement;
}

/** Relación de perpendicularidad que documenta un marcador de ángulo recto. */
export function angleMarkerRelation(angle: AngleObject): DiagramRelation | null {
  if (angle.marker !== 'square' || !angle.perpendicularRelationId) return null;
  return {
    id: angle.perpendicularRelationId,
    label: `Perpendicularidad de ${angle.label}`,
    type: 'perpendicular',
    supports: [[angle.points[1], angle.points[0]], [angle.points[1], angle.points[2]]],
    enabled: true,
  };
}

/**
 * Añade objetos al modelo junto con las relaciones que exigen (marcadores de
 * ángulo recto). No duplica relaciones ya presentes.
 */
export function insertObjects(model: VisualDiagramModel, objects: readonly DiagramObject[]): VisualDiagramModel {
  const relationIds = new Set(model.relations.map(relation => relation.id));
  const markerRelations = objects.flatMap(object => {
    if (object.objectType !== 'angle') return [];
    const relation = angleMarkerRelation(object);
    if (!relation || relationIds.has(relation.id)) return [];
    relationIds.add(relation.id);
    return [relation];
  });
  return {
    ...model,
    objects: [...model.objects, ...objects],
    ...(markerRelations.length > 0 ? { relations: [...model.relations, ...markerRelations] } : {}),
  };
}

export function slider(id: string, label: string, x: number, y: number, value: number, color: ColorToken = 'pavo'): VisualSlider {
  return {
    id, label, color, objectType: 'control', variant: 'slider', target: true, targetId: id,
    position: [x, y], range: { min: 0, max: 10, step: 0.1 }, value,
    layerId: 'controls', order: 2000, visible: true, locked: false, groupIds: [],
    selection: { selectable: true, role: 'annotation', ariaLabel: label },
  };
}

export function step(id: string, label: string, description: string, visibleTargets: string[]): VisualStep {
  return {
    id,
    label,
    description,
    visibleTargets,
    durationMs: 1800,
    objectStates: Object.fromEntries(visibleTargets.map(targetId => [targetId, { visible: true, emphasis: 'none', interactive: true }])),
  };
}

export function reindexSteps(steps: VisualStep[]): VisualStep[] {
  let stepCounter = 1;
  return steps.map((item, index) => {
    if (index === 0 && item.id === 'initial') {
      return { ...item, id: 'initial' };
    }
    return { ...item, id: `step${stepCounter++}` };
  });
}

export function toggleInitialStep(steps: VisualStep[], stepId: string): VisualStep[] {
  const targetIndex = steps.findIndex(s => s.id === stepId);
  if (targetIndex < 0) return steps;

  const targetStep = steps[targetIndex];
  const isCurrentlyInitial = targetStep.id === 'initial';

  let updatedSteps: VisualStep[];
  if (isCurrentlyInitial) {
    updatedSteps = steps.map(s => s.id === stepId ? { ...s, id: 'temp_step' } : s);
  } else {
    const withoutTarget = steps.filter(s => s.id !== stepId);
    updatedSteps = [{ ...targetStep, id: 'initial' }, ...withoutTarget];
  }

  return reindexSteps(updatedSteps);
}

export function duplicateStep(steps: VisualStep[], stepId: string): VisualStep[] {
  const index = steps.findIndex(item => item.id === stepId);
  if (index < 0) return steps;
  const source = steps[index];
  const copy: VisualStep = {
    ...source,
    id: `temp_copy`,
    label: `${source.label} (copia)`,
    visibleTargets: [...source.visibleTargets],
    objectStates: source.objectStates
      ? Object.fromEntries(Object.entries(source.objectStates).map(([objectId, state]) => [objectId, {
          ...state,
          overlay: state.overlay ? { ...state.overlay } : undefined,
        }]))
      : undefined,
    extensions: source.extensions ? { ...source.extensions } : undefined,
  };
  return reindexSteps([...steps.slice(0, index + 1), copy, ...steps.slice(index + 1)]);
}

export function removeStep(steps: VisualStep[], stepId: string): VisualStep[] {
  return reindexSteps(steps.filter(item => item.id !== stepId));
}

export function moveStep(steps: VisualStep[], stepId: string, direction: -1 | 1): VisualStep[] {
  const index = steps.findIndex(item => item.id === stepId);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= steps.length) return steps;
  const reordered = [...steps];
  [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
  return reindexSteps(reordered);
}

export function updateStepObjectState(steps: VisualStep[], stepId: string, objectId: string, update: Partial<DiagramStepObjectState>): VisualStep[] {
  return steps.map(item => {
    if (item.id !== stepId) return item;
    const previous = item.objectStates?.[objectId] ?? {
      visible: item.visibleTargets.includes(objectId),
      emphasis: 'none' as const,
      interactive: true,
    };
    const nextState = { ...previous, ...update };
    const visibleTargets = nextState.visible === false
      ? item.visibleTargets.filter(id => id !== objectId)
      : [...new Set([...item.visibleTargets, objectId])];
    return { ...item, visibleTargets, objectStates: { ...(item.objectStates ?? {}), [objectId]: nextState } };
  });
}

export function sanitizeDiagramId(raw: string, fallbackPrefix = 'id'): string {
  const normalized = raw
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  let cleaned = normalized
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  const prefix = fallbackPrefix.toLowerCase();
  if (!cleaned || !/^[a-z]/.test(cleaned)) {
    cleaned = cleaned ? `${prefix}_${cleaned}` : prefix;
  }

  if (!/^[a-z][a-z0-9_-]*$/.test(cleaned)) {
    cleaned = `${prefix}_${Date.now().toString(36).slice(-4)}`;
  }

  return cleaned;
}

export function generateUniqueDiagramId(
  candidateRaw: string,
  existingIds: Set<string> | Iterable<string>,
  fallbackPrefix: string,
): string {
  const baseId = sanitizeDiagramId(candidateRaw, fallbackPrefix);
  const idsSet = existingIds instanceof Set ? existingIds : new Set(existingIds);
  if (!idsSet.has(baseId)) {
    return baseId;
  }
  let counter = 2;
  while (idsSet.has(`${baseId}_${counter}`)) {
    counter += 1;
  }
  return `${baseId}_${counter}`;
}

export function cleanTargetId(value: string, fallback: string): string {
  return value.trim().replace(/[^A-Za-z0-9_-]/g, '') || fallback;
}

export function nextPointId(objects: readonly DiagramObject[]): string {
  for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    if (!objects.some(item => item.id === `p${letter}`)) return `p${letter}`;
  }
  return `p${objects.filter(item => item.objectType === 'point').length + 1}`;
}

export { refsNeededForTool } from '../tools/referenceRules';

export function generatedElementId(kind: ElementKind, refs: string[], existing: readonly DiagramObject[]): string {
  const suffix = refs.map(ref => ref.replace(/^p/, '')).join('');
  const prefixes: Partial<Record<ElementKind, string>> = {
    segment: 'seg', line: 'line', ray: 'ray', circle: 'circle', arc: 'arc', intersection: 'int', midpoint: 'mid',
    halfPlane: 'half', areaIntersection: 'areaInt',
    perpendicularFoot: 'foot', segmentExtension: 'ext', perpendicular: 'perp', parallel: 'par',
    angleBisector: 'bis', angle: 'angle', nonReflexAngle: 'nonReflexAngle', rightAngle: 'rightAngle', parallelMark: 'parallelMark', measureTicks: 'ticks',
  };
  const base = `${prefixes[kind] ?? kind}${suffix || existing.length + 1}`;
  return uniqueElementId(base, existing);
}

export function elementColorForKind(kind: ElementKind): ColorToken {
  if (kind === 'polygon' || kind === 'areaDecomposition' || kind === 'grid' || kind === 'halfPlane' || kind === 'areaIntersection') return 'canela';
  if (kind === 'intersection' || kind === 'midpoint') return 'terracota';
  if (kind === 'measureTicks') return 'carbon';
  if (kind === 'perpendicularFoot' || kind === 'angle' || kind === 'nonReflexAngle' || kind === 'rightAngle' || kind === 'perpendicularMark' || kind === 'congruenceMark') return 'ocre';
  if (kind === 'parallelMark') return 'pavo';
  if (kind === 'segmentExtension' || kind === 'measurement' || kind === 'dimensionLine' || kind === 'formula' || kind === 'infoPanel') return 'mora';
  if (kind === 'perpendicular' || kind === 'parallel' || kind === 'angleBisector' || kind === 'line' || kind === 'ray' || kind === 'functionCurve' || kind === 'parametricCurve' || kind === 'poincareGeodesic' || kind === 'poincareArc') return 'pavo';
  return 'carbon';
}

type ObjectPatch = { [key: string]: unknown };

/** Aplica un parche superficial o una transformación a un objeto del modelo. */
export function updateObject(
  model: VisualDiagramModel,
  objectId: string,
  update: ObjectPatch | ((object: DiagramObject) => DiagramObject),
): VisualDiagramModel {
  return {
    ...model,
    objects: model.objects.map(item => {
      if (item.id !== objectId) return item;
      return typeof update === 'function' ? update(item) : { ...item, ...update } as DiagramObject;
    }),
  };
}

/** Actualiza un punto con posición propia. Para cambiar su movilidad usar `setPointMode`. */
export function updatePoint(model: VisualDiagramModel, pointId: string, update: Partial<PositionedPoint> | ((point: PositionedPoint) => PositionedPoint)): VisualDiagramModel {
  return updateObject(model, pointId, object => {
    if (object.objectType !== 'point') return object;
    const pointObject = object as PositionedPoint;
    return typeof update === 'function' ? update(pointObject) : { ...pointObject, ...update };
  });
}

export function updateElement(model: VisualDiagramModel, elementId: string, update: ObjectPatch | ((object: VisualElement) => VisualElement)): VisualDiagramModel {
  return updateObject(model, elementId, object => {
    if (object.objectType === 'control') return object;
    return typeof update === 'function' ? update(object) : { ...object, ...update } as DiagramObject;
  });
}

export function updateSlider(model: VisualDiagramModel, sliderId: string, update: Partial<ControlObject> | ((control: ControlObject) => ControlObject)): VisualDiagramModel {
  return updateObject(model, sliderId, object => {
    if (object.objectType !== 'control') return object;
    return typeof update === 'function' ? update(object) : { ...object, ...update };
  });
}

export function updateStep(model: VisualDiagramModel, stepId: string, update: Partial<VisualStep>): VisualDiagramModel {
  return { ...model, steps: model.steps.map(item => item.id === stepId ? { ...item, ...update } : item) };
}

export function pointNameFromRef(ref: string): string {
  return ref.replace(/^p/, '') || ref;
}

export function refsMatch(left: string[], right: string[], unordered = false): boolean {
  if (left.length !== right.length) return false;
  return unordered ? left.every(ref => right.includes(ref)) : left.every((ref, index) => ref === right[index]);
}

export function reusableElement(objects: readonly DiagramObject[], kind: ElementKind, refs: string[], unordered = false): DiagramObject | undefined {
  return objects.find(item => objectKind(item) === kind && refsMatch(sceneReferences({ objects }, item), refs, unordered));
}

export function uniqueElementId(base: string, elements: readonly DiagramObject[]): string {
  const cleanBase = cleanTargetId(base, `element${elements.length + 1}`);
  let candidate = cleanBase;
  let index = 2;
  while (elements.some(item => item.id === candidate)) candidate = `${cleanBase}_${index++}`;
  return candidate;
}

export function addLabelToElement(model: VisualDiagramModel, sourceId: string): { model: VisualDiagramModel; labelId: string } {
  const source = model.objects.find(item => item.id === sourceId && item.objectType !== 'control' && !(item.objectType === 'annotation' && item.variant === 'label'));
  if (!source || (source.objectType === 'point' && (source.definition.type === 'coordinates' || source.definition.type === 'expression'))) {
    return { model, labelId: sourceId };
  }
  const existing = model.objects.find(item => item.objectType === 'annotation' && item.variant === 'label' && item.anchor.type === 'object' && item.anchor.object === sourceId);
  if (existing) return { model, labelId: existing.id };

  const labelId = uniqueElementId(`label-${sourceId}`, model.objects);
  const annotationLayer = model.layers.find(layer => /anot/i.test(`${layer.id} ${layer.label}`))?.id ?? source.layerId;
  const labelElement = element(labelId, `Etiqueta de ${source.label}`, 'label', [sourceId], source.color, false, {
    layerId: annotationLayer,
    order: nextLayerItemOrder(model, annotationLayer),
    selection: {
      selectable: true,
      highlightable: true,
      dimOthersOnHighlight: false,
      ariaLabel: `Etiqueta de ${source.label}`,
      role: 'annotation',
    },
    style: { textOffset: [0.04, 0.04], labelSize: 14, preserveColorOnHighlight: true },
    text: source.label,
  });
  return {
    labelId,
    model: {
      ...model,
      objects: [...model.objects, labelElement],
      steps: model.steps.map(item => ({
        ...item,
        visibleTargets: item.visibleTargets.includes(labelId) ? item.visibleTargets : [...item.visibleTargets, labelId],
      })),
    },
  };
}

/** Elimina objetos y todas sus referencias editoriales sin dejar una spec parcial. */
export function removeDiagramElements(model: VisualDiagramModel, elementIds: Iterable<string>): VisualDiagramModel {
  const removedIds = new Set(elementIds);
  if (removedIds.size === 0) return model;
  const markerRelationIds = new Set(model.objects.flatMap(object => (
    removedIds.has(object.id) && object.objectType === 'angle' && object.perpendicularRelationId ? [object.perpendicularRelationId] : []
  )));
  const removedRelationIds = new Set(model.relations
    .filter(relation => markerRelationIds.has(relation.id) || relationReferences(relation).some(ref => removedIds.has(ref)))
    .map(relation => relation.id));
  return {
    ...model,
    objects: model.objects
      .filter(object => !removedIds.has(object.id))
      .map(object => {
        if (object.objectType !== 'point' || object.mobility.type !== 'constrained') return object;
        const relationIds = object.mobility.relationIds.filter(id => !removedRelationIds.has(id));
        if (relationIds.length === object.mobility.relationIds.length) return object;
        return relationIds.length > 0
          ? { ...object, mobility: { type: 'constrained', relationIds } }
          : { ...object, mobility: { type: 'free' } };
      }),
    relations: model.relations.filter(relation => !removedRelationIds.has(relation.id)),
    steps: model.steps.map(item => ({
      ...item,
      visibleTargets: item.visibleTargets.filter(id => !removedIds.has(id)),
      objectStates: item.objectStates
        ? Object.fromEntries(Object.entries(item.objectStates).filter(([id]) => !removedIds.has(id)))
        : undefined,
    })),
    groups: model.groups.map(group => ({ ...group, memberIds: group.memberIds.filter(id => !removedIds.has(id)) })),
  };
}

/**
 * Inversa de `sceneReferences`: escribe referencias ordenadas (en el orden de
 * los huecos de su herramienta) en los campos tipados del objeto.
 */
export function withSceneReferences<T extends DiagramObject>(object: T, refs: readonly string[]): T {
  const [a, b, c, d] = refs;
  const value = object as DiagramObject;
  switch (value.objectType) {
    case 'point': {
      const definition = value.definition;
      if (definition.type === 'intersection') return { ...value, definition: { ...definition, supports: [a, b] } } as T;
      if (definition.type === 'midpoint') return { ...value, definition: { ...definition, points: [a, b] } } as T;
      if (definition.type === 'projection') return { ...value, definition: { ...definition, point: c ?? definition.point, support: { points: [a, b] } } } as T;
      return object;
    }
    case 'path': {
      const geometry = value.geometry;
      switch (geometry.type) {
        case 'segment':
          return { ...value, geometry: { ...geometry, points: [a, b], ...(geometry.construction ? { construction: { ...geometry.construction, foot: c } } : {}) } } as T;
        case 'line': {
          const construction = geometry.construction;
          if (construction.type === 'through-points') return { ...value, geometry: { ...geometry, construction: { ...construction, points: [a, b] } } } as T;
          if (construction.type === 'angle-bisector') return { ...value, geometry: { ...geometry, construction: { ...construction, points: [a, b, c] } } } as T;
          return { ...value, geometry: { ...geometry, construction: { ...construction, linePoints: [a, b], through: c } } } as T;
        }
        case 'ray': return { ...value, geometry: { ...geometry, points: [a, b] } } as T;
        case 'polygon': return { ...value, geometry: { ...geometry, points: [...refs] as [string, string, string, ...string[]] } } as T;
        case 'circle': return { ...value, geometry: { ...geometry, center: a, point: b } } as T;
        case 'arc': return { ...value, geometry: { ...geometry, points: [a, b, c] } } as T;
        case 'function':
        case 'parametric': {
          const rest = omitKeys(geometry, 'areaSide');
          return { ...value, geometry: a ? { ...rest, areaSide: a } : rest } as T;
        }
        case 'poincare-geodesic':
        case 'poincare-arc':
          return { ...value, geometry: { ...geometry, refs: [a, b, c, d] } } as T;
        case 'dimension': return { ...value, geometry: { ...geometry, points: [a, b] } } as T;
      }
      return object;
    }
    case 'angle': return { ...value, points: [a, b, c] } as T;
    case 'region': return { ...value, geometry: { ...value.geometry, points: [...refs] } } as T;
    case 'area':
      return {
        ...value,
        geometry: value.geometry.type === 'half-plane'
          ? { ...value.geometry, boundary: [a, b], side: c }
          : { ...value.geometry, areas: [...refs] as [string, string, ...string[]] },
      } as T;
    case 'mark':
      return { ...value, anchor: value.anchor.type === 'path' ? { ...value.anchor, path: a } : { ...value.anchor, points: [a, b] } } as T;
    case 'annotation': {
      const anchor = value.anchor.type === 'object' ? { ...value.anchor, object: a } : value.anchor;
      if (value.measurement) {
        return { ...value, anchor, measurement: { ...value.measurement, refs: b ? [a, b] : [a] } } as T;
      }
      return { ...value, anchor } as T;
    }
    case 'control':
      return object;
  }
}
