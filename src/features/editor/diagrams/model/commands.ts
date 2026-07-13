import { normalizeContentId } from '../../lib/editorContracts';
import {
  DIAGRAM_RENDERER_ID,
  DIAGRAM_SPEC_VERSION,
  migrateDiagramSpec,
  projectPointToSupport,
  supportElements,
} from '../../../../shared/diagrams/spec';
import type {
  VisualDiagramModel, VisualPoint, VisualElement, VisualSlider, VisualStep,
  TemplateKind, ConstructionKind, ColorToken, ElementKind, PointConstraint,
  ConstructionRefKey, ConstructionSlot, CanvasTool
} from './types';

// Helper constructors
export function point(id: string, label: string, x: number, y: number, fixed = false, color: ColorToken = 'terracota', constraint: PointConstraint = fixed ? 'fixed' : 'free', gliderTarget?: string): VisualPoint {
  return {
    id, label, x, y, fixed, color, target: true, constraint, gliderTarget,
    layerId: 'geometry', order: 0, visible: true, locked: false, groupIds: [],
    selection: { selectable: true, role: 'primary', ariaLabel: `Punto ${label}` },
  };
}

export function element(id: string, label: string, kind: ElementKind, refs: string[], color: ColorToken, target = true, extra: Partial<VisualElement> = {}): VisualElement {
  return {
    id, label, kind, refs, color, target,
    layerId: 'geometry', order: 1000, visible: true, locked: false, groupIds: [],
    selection: { selectable: true, role: kind === 'text' || kind === 'measurement' ? 'annotation' : 'secondary', ariaLabel: label },
    ...extra,
  };
}

export function slider(id: string, label: string, x: number, y: number, value: number, color: ColorToken = 'pavo'): VisualSlider {
  return {
    id, label, x, y, min: 0, max: 10, value, step: 0.1, color, target: true,
    layerId: 'controls', order: 2000, visible: true, locked: false, groupIds: [],
    selection: { selectable: true, role: 'annotation', ariaLabel: label },
  };
}

export function step(id: string, label: string, description: string, visibleTargets: string[]): VisualStep {
  return { id, label, description, visibleTargets };
}

export const TEMPLATE_OPTIONS: Array<{ value: TemplateKind; label: string; description: string }> = [
  { value: 'triangulo-deformable', label: 'Triángulo deformable', description: 'Vértices arrastrables, lados, área y targets listos para texto interactivo.' },
  { value: 'cuadrilatero-clasificable', label: 'Cuadrilátero clasificable', description: 'Cuatro vértices, lados, diagonales opcionales y lectura visual de clases.' },
  { value: 'circunferencia', label: 'Circunferencia', description: 'Centro, punto sobre la circunferencia, radio y medición enlazable.' },
  { value: 'eje-cartesiano', label: 'Eje cartesiano', description: 'Plano con grid, punto de control y coordenadas dinámicas.' },
  { value: 'lugar-geometrico', label: 'Lugar geométrico', description: 'Puntos base, mediatriz y glider conceptual para propiedades equidistantes.' },
  { value: 'demostracion-pasos', label: 'Demostración por pasos', description: 'Construcción preparada para targets step1, step2 y step3.' },
  { value: 'modelo-estatico', label: 'Modelo estático', description: 'Estructura fija para modelos de incidencia o contraejemplos.' },
];

export const CONSTRUCTION_OPTIONS: Array<{ value: ConstructionKind; label: string; description: string; slots: ConstructionSlot[] }> = [
  {
    value: 'mediatriz',
    label: 'Mediatriz',
    description: 'Crea el punto medio y la perpendicular al segmento base.',
    slots: [
      { key: 'a', label: 'Extremo A' },
      { key: 'b', label: 'Extremo B' },
    ],
  },
  {
    value: 'mediana',
    label: 'Mediana',
    description: 'Crea el punto medio de la base y el segmento desde el vértice.',
    slots: [
      { key: 'a', label: 'Base A' },
      { key: 'b', label: 'Base B' },
      { key: 'c', label: 'Vértice' },
    ],
  },
  {
    value: 'altura',
    label: 'Altura',
    description: 'Crea la recta perpendicular a la base que pasa por el vértice.',
    slots: [
      { key: 'a', label: 'Base A' },
      { key: 'b', label: 'Base B' },
      { key: 'c', label: 'Vértice' },
    ],
  },
  {
    value: 'bisectriz',
    label: 'Bisectriz',
    description: 'Crea el ángulo visual y su bisectriz como semirrecta.',
    slots: [
      { key: 'a', label: 'Lado 1' },
      { key: 'b', label: 'Vértice' },
      { key: 'c', label: 'Lado 2' },
    ],
  },
];

export const COLOR_OPTIONS: Array<{ value: ColorToken; label: string }> = [
  { value: 'carbon', label: 'Carbon' },
  { value: 'terracota', label: 'Terracota' },
  { value: 'salvia', label: 'Salvia' },
  { value: 'pizarra', label: 'Pizarra' },
  { value: 'ocre', label: 'Ocre' },
  { value: 'pavo', label: 'Pavo' },
  { value: 'granada', label: 'Granada' },
  { value: 'musgo', label: 'Musgo' },
];

export const KIND_LABELS: Record<ElementKind, string> = {
  segment: 'Segmento',
  line: 'Recta',
  ray: 'Semirrecta',
  polygon: 'Polígono',
  circle: 'Circunferencia',
  midpoint: 'Punto medio',
  perpendicularFoot: 'Pie perpendicular',
  baseExtension: 'Extensión de base',
  perpendicular: 'Perpendicular',
  parallel: 'Paralela',
  angleBisector: 'Bisectriz',
  angle: 'Ángulo',
  rightAngle: 'Ángulo recto',
  measurement: 'Medición',
  text: 'Etiqueta',
};

export function defaultCategory(metadataType: string): string {
  if (metadataType === 'definicion') return 'Definiciones';
  if (metadataType === 'axioma') return 'Axiomas';
  if (metadataType === 'modelo') return 'Models';
  if (metadataType === 'demostracion') return 'Demos';
  if (metadataType === 'ejercicio') return 'Ejercicios';
  return 'Teoremas';
}

export function defaultMode(metadataType: string): VisualDiagramModel['mode'] {
  return metadataType === 'modelo' ? 'diagram' : 'simulation';
}

export function createTemplateModel(kind: TemplateKind, title: string, metadataType: string): VisualDiagramModel {
  const base = {
    version: DIAGRAM_SPEC_VERSION,
    renderer: DIAGRAM_RENDERER_ID,
    title,
    componentId: normalizeContentId(title || 'diagrama-interactivo'),
    category: defaultCategory(metadataType),
    mode: defaultMode(metadataType),
    axis: false,
    grid: false,
    viewport: {
      bounds: [-5, 5, 5, -5] as [number, number, number, number],
      home: [-5, 5, 5, -5] as [number, number, number, number],
      minZoom: 0.2,
      maxZoom: 12,
      padding: 0.16,
    },
    layers: [
      { id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false },
      { id: 'controls', label: 'Controles', order: 1, visible: true, locked: false },
    ],
    groups: [],
    sliders: [] as VisualSlider[],
    steps: [] as VisualStep[],
    note: 'Arrastre los puntos para explorar la figura.',
    extensions: {},
  };

  if (kind === 'circunferencia') {
    return {
      ...base,
      points: [
        point('pO', 'O', 0, 0, true),
        point('pA', 'A', 2.4, 0, false),
      ],
      elements: [
        element('circle', 'Circunferencia', 'circle', ['pO', 'pA'], 'salvia'),
        element('segOA', 'Radio OA', 'segment', ['pO', 'pA'], 'pizarra'),
        element('measRadio', 'Radio', 'text', ['pO'], 'carbon', true, { text: 'r = OA' }),
      ],
    };
  }

  if (kind === 'eje-cartesiano') {
    return {
      ...base,
      axis: true,
      grid: true,
      points: [point('pP', 'P', 2, 2)],
      sliders: [slider('sliderT', 'Parámetro t', -4.2, -4.2, 2, 'pavo')],
      elements: [
        element('coordX', 'Coordenada x', 'text', ['pP'], 'pizarra', true, { text: 'x(P)' }),
        element('coordY', 'Coordenada y', 'text', ['pP'], 'salvia', true, { text: 'y(P)' }),
      ],
    };
  }

  if (kind === 'modelo-estatico') {
    return {
      ...base,
      mode: 'diagram',
      points: [
        point('pA', 'A', -2, -1, true),
        point('pB', 'B', 2, -0.6, true),
        point('pC', 'C', 0, 2.2, true),
      ],
      elements: [
        element('segAB', 'Recta AB del modelo', 'segment', ['pA', 'pB'], 'pizarra', true, { dashed: true }),
        element('segBC', 'Recta BC del modelo', 'segment', ['pB', 'pC'], 'pizarra', true, { dashed: true }),
        element('segCA', 'Recta CA del modelo', 'segment', ['pC', 'pA'], 'pizarra', true, { dashed: true }),
      ],
      note: 'Modelo fijo: los puntos no se arrastran en el producto final.',
    };
  }

  if (kind === 'cuadrilatero-clasificable') {
    return {
      ...base,
      points: [
        point('pA', 'A', -2.6, -1.5),
        point('pB', 'B', 2.2, -1.2),
        point('pC', 'C', 2.6, 1.7),
        point('pD', 'D', -1.8, 2),
      ],
      elements: [
        element('polyCuadrilatero', 'Cuadrilátero', 'polygon', ['pA', 'pB', 'pC', 'pD'], 'salvia'),
        element('segAB', 'Lado AB', 'segment', ['pA', 'pB'], 'carbon'),
        element('segBC', 'Lado BC', 'segment', ['pB', 'pC'], 'carbon'),
        element('segCD', 'Lado CD', 'segment', ['pC', 'pD'], 'carbon'),
        element('segDA', 'Lado DA', 'segment', ['pD', 'pA'], 'carbon'),
        element('diagAC', 'Diagonal AC', 'segment', ['pA', 'pC'], 'pavo', true, { dashed: true }),
      ],
    };
  }

  if (kind === 'lugar-geometrico') {
    return {
      ...base,
      points: [
        point('pA', 'A', -2, 0, true),
        point('pB', 'B', 2, 0, true),
        point('pP', 'P', 0, 2.2, false, 'ocre', 'glider', 'lineMediatriz'),
      ],
      elements: [
        element('segAB', 'Segmento AB', 'segment', ['pA', 'pB'], 'carbon'),
        element('midAB', 'Punto medio de AB', 'midpoint', ['pA', 'pB'], 'terracota'),
        element('lineMediatriz', 'Mediatriz de AB', 'perpendicular', ['pA', 'pB', 'midAB'], 'pavo', true, { dashed: true }),
        element('segPA', 'Distancia PA', 'segment', ['pP', 'pA'], 'salvia', true, { dashed: true }),
        element('segPB', 'Distancia PB', 'segment', ['pP', 'pB'], 'salvia', true, { dashed: true }),
        element('measEquidistancia', 'Equidistancia', 'text', ['pP'], 'carbon', true, { text: 'PA = PB' }),
      ],
      note: 'Arrastre P sobre la mediatriz para explorar el lugar de puntos equidistantes de A y B.',
    };
  }

  if (kind === 'demostracion-pasos') {
    return {
      ...base,
      points: [
        point('pA', 'A', -2.5, -1.6),
        point('pB', 'B', 2.5, -1.6),
        point('pC', 'C', -0.2, 2.2),
      ],
      elements: [
        element('step1Triangulo', 'Triángulo inicial', 'polygon', ['pA', 'pB', 'pC'], 'salvia'),
        element('segAB', 'Base AB', 'segment', ['pA', 'pB'], 'carbon'),
        element('step2Altura', 'Altura auxiliar', 'segment', ['pC', 'pA'], 'terracota', true, { dashed: true }),
        element('angleC', 'Ángulo C', 'angle', ['pA', 'pC', 'pB'], 'ocre'),
        element('step3Conclusion', 'Conclusión', 'text', ['pC'], 'musgo', true, { text: 'Paso final' }),
      ],
      steps: [
        step('step1', 'Paso 1', 'Presentar la figura inicial.', ['pA', 'pB', 'pC', 'step1Triangulo', 'segAB']),
        step('step2', 'Paso 2', 'Introducir la construcción auxiliar.', ['pA', 'pB', 'pC', 'step1Triangulo', 'segAB', 'step2Altura']),
        step('step3', 'Paso 3', 'Resaltar la conclusión.', ['pA', 'pB', 'pC', 'step1Triangulo', 'segAB', 'step2Altura', 'angleC', 'step3Conclusion']),
      ],
      note: 'Targets step1/step2/step3 preparados para ProofStep e InteractiveElement.',
    };
  }

  return {
    ...base,
    points: [
      point('pA', 'A', -2.4, -1.6),
      point('pB', 'B', 2.4, -1.4),
      point('pC', 'C', 0.2, 2.2),
    ],
    elements: [
      element('polyTriangulo', 'Triángulo', 'polygon', ['pA', 'pB', 'pC'], 'salvia'),
      element('segAB', 'Lado AB', 'segment', ['pA', 'pB'], 'carbon'),
      element('segBC', 'Lado BC', 'segment', ['pB', 'pC'], 'carbon'),
      element('segCA', 'Lado CA', 'segment', ['pC', 'pA'], 'carbon'),
      element('angleC', 'Ángulo C', 'angle', ['pA', 'pC', 'pB'], 'ocre'),
      element('measArea', 'Área', 'text', ['pC'], 'pizarra', true, { text: 'Área variable' }),
    ],
  };
}

export function cleanTargetId(value: string, fallback: string): string {
  return value.replace(/[^A-Za-z0-9_-]/g, '') || fallback;
}

export { projectPointToSupport, supportElements };

export function nextPointId(points: VisualPoint[]): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (const letter of letters) {
    if (!points.some(item => item.id === `p${letter}`)) return `p${letter}`;
  }
  return `p${points.length + 1}`;
}

export function nextSliderId(sliders: VisualSlider[]): string {
  let index = sliders.length + 1;
  while (sliders.some(item => item.id === `slider${index}`)) index += 1;
  return `slider${index}`;
}

export function nextStepId(steps: VisualStep[]): string {
  let index = steps.length + 1;
  while (steps.some(item => item.id === `step${index}`)) index += 1;
  return `step${index}`;
}

export function refsNeededForTool(tool: CanvasTool): number {
  if (tool === 'segment' || tool === 'line' || tool === 'ray' || tool === 'circle' || tool === 'midpoint') return 2;
  if (tool === 'polygon' || tool === 'perpendicularFoot' || tool === 'baseExtension' || tool === 'perpendicular' || tool === 'parallel' || tool === 'angleBisector' || tool === 'angle' || tool === 'rightAngle') return 3;
  if (tool === 'measurement' || tool === 'text') return 1;
  return 0;
}

export function generatedElementId(kind: ElementKind, refs: string[], existing: VisualElement[]): string {
  const suffix = refs.map(ref => ref.replace(/^p/, '')).join('');
  const base = kind === 'segment' ? `seg${suffix}`
    : kind === 'line' ? `line${suffix}`
      : kind === 'ray' ? `ray${suffix}`
        : kind === 'circle' ? `circle${suffix || existing.length + 1}`
          : kind === 'midpoint' ? `mid${suffix || existing.length + 1}`
            : kind === 'perpendicularFoot' ? `foot${suffix || existing.length + 1}`
              : kind === 'baseExtension' ? `ext${suffix || existing.length + 1}`
                : kind === 'perpendicular' ? `perp${suffix || existing.length + 1}`
                  : kind === 'parallel' ? `par${suffix || existing.length + 1}`
                    : kind === 'angleBisector' ? `bis${suffix || existing.length + 1}`
                      : kind === 'angle' ? `angle${suffix || existing.length + 1}`
                        : kind === 'rightAngle' ? `rightAngle${suffix || existing.length + 1}`
                          : `${kind}${existing.length + 1}`;
  let candidate = base;
  let index = 2;
  while (existing.some(item => item.id === candidate)) {
    candidate = `${base}_${index}`;
    index += 1;
  }
  return candidate;
}

export function elementColorForKind(kind: ElementKind): ColorToken {
  if (kind === 'polygon') return 'salvia';
  if (kind === 'midpoint') return 'terracota';
  if (kind === 'perpendicularFoot') return 'ocre';
  if (kind === 'baseExtension') return 'pizarra';
  if (kind === 'perpendicular' || kind === 'parallel' || kind === 'angleBisector') return 'pavo';
  if (kind === 'angle' || kind === 'rightAngle') return 'ocre';
  if (kind === 'line' || kind === 'ray') return 'pavo';
  if (kind === 'measurement') return 'pizarra';
  return 'carbon';
}

export function updatePoint(model: VisualDiagramModel, pointId: string, update: Partial<VisualPoint>): VisualDiagramModel {
  return {
    ...model,
    points: model.points.map(item => item.id === pointId ? { ...item, ...update } : item),
  };
}

export function updateElement(model: VisualDiagramModel, elementId: string, update: Partial<VisualElement>): VisualDiagramModel {
  return {
    ...model,
    elements: model.elements.map(item => item.id === elementId ? { ...item, ...update } : item),
  };
}

export function updateSlider(model: VisualDiagramModel, sliderId: string, update: Partial<VisualSlider>): VisualDiagramModel {
  return {
    ...model,
    sliders: model.sliders.map(item => item.id === sliderId ? { ...item, ...update } : item),
  };
}

export function updateStep(model: VisualDiagramModel, stepId: string, update: Partial<VisualStep>): VisualDiagramModel {
  return {
    ...model,
    steps: model.steps.map(item => item.id === stepId ? { ...item, ...update } : item),
  };
}

export function pointNameFromRef(ref: string): string {
  return ref.replace(/^p/, '') || ref;
}

export function refsMatch(left: string[], right: string[], unordered = false): boolean {
  if (left.length !== right.length) return false;
  if (!unordered) return left.every((ref, index) => ref === right[index]);
  return left.every(ref => right.includes(ref));
}

export function reusableElement(elements: VisualElement[], kind: ElementKind, refs: string[], unordered = false): VisualElement | undefined {
  return elements.find(item => item.kind === kind && refsMatch(item.refs, refs, unordered));
}

export function uniqueElementId(base: string, elements: VisualElement[]): string {
  const cleanBase = cleanTargetId(base, `element${elements.length + 1}`);
  let candidate = cleanBase;
  let index = 2;
  while (elements.some(item => item.id === candidate)) {
    candidate = `${cleanBase}_${index}`;
    index += 1;
  }
  return candidate;
}

export function constructionOption(kind: ConstructionKind) {
  return CONSTRUCTION_OPTIONS.find(item => item.value === kind) || CONSTRUCTION_OPTIONS[0];
}

export function defaultConstructionRefs(points: VisualPoint[]): Record<ConstructionRefKey, string> {
  const pts = points || [];
  return {
    a: pts[0]?.id || '',
    b: pts[1]?.id || pts[0]?.id || '',
    c: pts[2]?.id || pts[0]?.id || '',
  };
}

export function normalizeConstructionRefs(points: VisualPoint[], refs: Record<ConstructionRefKey, string>): Record<ConstructionRefKey, string> {
  const pts = points || [];
  const pointIds = new Set(pts.map(item => item.id));
  const defaults = defaultConstructionRefs(pts);
  const safeRefs = refs || {};
  return {
    a: pointIds.has(safeRefs.a) ? safeRefs.a : defaults.a,
    b: pointIds.has(safeRefs.b) ? safeRefs.b : defaults.b,
    c: pointIds.has(safeRefs.c) ? safeRefs.c : defaults.c,
  };
}

export function validConstructionRefs(kind: ConstructionKind, refs: Record<ConstructionRefKey, string>): boolean {
  const slots = constructionOption(kind).slots;
  const values = slots.map(slot => refs[slot.key]).filter(Boolean);
  return values.length === slots.length && new Set(values).size === values.length;
}

export function appendTargetsToSteps(steps: VisualStep[], targetIds: string[]): VisualStep[] {
  if (targetIds.length === 0) return steps;
  return steps.map(item => ({
    ...item,
    visibleTargets: Array.from(new Set([...item.visibleTargets, ...targetIds])),
  }));
}

export function applyGuidedConstruction(model: VisualDiagramModel, kind: ConstructionKind, refs: Record<ConstructionRefKey, string>): { model: VisualDiagramModel; selectedId: string } {
  const a = refs.a;
  const b = refs.b;
  const c = refs.c;
  const elements = [...model.elements];
  const addedTargetIds: string[] = [];
  let selectedId = model.elements[0]?.id || model.points[0]?.id || '';

  const addOrReuse = (
    baseId: string,
    label: string,
    elementKind: ElementKind,
    elementRefs: string[],
    color: ColorToken,
    unordered = false,
    extra: Partial<VisualElement> = {},
  ) => {
    const existing = reusableElement(elements, elementKind, elementRefs, unordered);
    if (existing) {
      selectedId = existing.id;
      return existing.id;
    }
    const id = uniqueElementId(baseId, elements);
    elements.push(element(id, label, elementKind, elementRefs, color, true, extra));
    addedTargetIds.push(id);
    selectedId = id;
    return id;
  };

  if (kind === 'mediatriz') {
    const pair = `${pointNameFromRef(a)}${pointNameFromRef(b)}`;
    const midpointId = addOrReuse(`mid${pair}`, `Punto medio de ${pair}`, 'midpoint', [a, b], 'terracota', true);
    addOrReuse(`lineMediatriz${pair}`, `Mediatriz de ${pair}`, 'perpendicular', [a, b, midpointId], 'pavo', false, { dashed: true });
  }

  if (kind === 'mediana') {
    const pair = `${pointNameFromRef(a)}${pointNameFromRef(b)}`;
    const vertex = pointNameFromRef(c);
    const midpointId = addOrReuse(`mid${pair}`, `Punto medio de ${pair}`, 'midpoint', [a, b], 'terracota', true);
    addOrReuse(`segMediana${vertex}${pair}`, `Mediana desde ${vertex} a ${pair}`, 'segment', [c, midpointId], 'salvia', true);
  }

  if (kind === 'altura') {
    const pair = `${pointNameFromRef(a)}${pointNameFromRef(b)}`;
    const vertex = pointNameFromRef(c);
    const footId = addOrReuse(`foot${vertex}${pair}`, `Pie de altura ${vertex}${pair}`, 'perpendicularFoot', [a, b, c], 'ocre');
    addOrReuse(`extAltura${vertex}${pair}`, `Extensión de base ${pair}`, 'baseExtension', [a, b, footId], 'pizarra', false, { dashed: true });
    addOrReuse(`lineAltura${vertex}${pair}`, `Recta de altura desde ${vertex}`, 'perpendicular', [a, b, c], 'pavo', false, { dashed: true });
    addOrReuse(`segAltura${vertex}${pair}`, `Altura desde ${vertex} a ${pair}`, 'segment', [c, footId], 'terracota', true);
    addOrReuse(`rightAngleAltura${vertex}${pair}`, `Ángulo recto de la altura`, 'rightAngle', [a, footId, c], 'ocre');
  }

  if (kind === 'bisectriz') {
    const triple = `${pointNameFromRef(a)}${pointNameFromRef(b)}${pointNameFromRef(c)}`;
    addOrReuse(`angle${triple}`, `Ángulo ${triple}`, 'angle', [a, b, c], 'ocre');
    addOrReuse(`bis${triple}`, `Bisectriz de ${triple}`, 'angleBisector', [a, b, c], 'pavo', false, { dashed: true });
  }

  return {
    model: {
      ...model,
      elements,
      steps: appendTargetsToSteps(model.steps, addedTargetIds),
    },
    selectedId,
  };
}

export function renamePoint(model: VisualDiagramModel, oldId: string, newIdRaw: string): VisualDiagramModel {
  const newId = cleanTargetId(newIdRaw, oldId);
  if (newId !== oldId && model.points.some(item => item.id === newId)) return model;
  return {
    ...model,
    points: model.points.map(item => item.id === oldId ? { ...item, id: newId } : item),
    elements: model.elements.map(item => ({
      ...item,
      refs: item.refs.map(ref => ref === oldId ? newId : ref),
    })),
    steps: model.steps.map(item => ({
      ...item,
      visibleTargets: item.visibleTargets.map(target => target === oldId ? newId : target),
    })),
    groups: model.groups.map(group => ({ ...group, memberIds: group.memberIds.map(id => id === oldId ? newId : id) })),
  };
}

export function renameElement(model: VisualDiagramModel, oldId: string, newIdRaw: string): VisualDiagramModel {
  const newId = cleanTargetId(newIdRaw, oldId);
  if (newId !== oldId && model.elements.some(item => item.id === newId)) return model;
  return {
    ...model,
    points: model.points.map(item => item.gliderTarget === oldId ? { ...item, gliderTarget: newId } : item),
    elements: model.elements.map(item => ({
      ...(item.id === oldId ? { ...item, id: newId } : item),
      refs: item.refs.map(ref => ref === oldId ? newId : ref),
    })),
    steps: model.steps.map(item => ({
      ...item,
      visibleTargets: item.visibleTargets.map(target => target === oldId ? newId : target),
    })),
    groups: model.groups.map(group => ({ ...group, memberIds: group.memberIds.map(id => id === oldId ? newId : id) })),
  };
}

export function renameSlider(model: VisualDiagramModel, oldId: string, newIdRaw: string): VisualDiagramModel {
  const newId = cleanTargetId(newIdRaw, oldId);
  if (newId !== oldId && model.sliders.some(item => item.id === newId)) return model;
  return {
    ...model,
    sliders: model.sliders.map(item => item.id === oldId ? { ...item, id: newId } : item),
    steps: model.steps.map(item => ({
      ...item,
      visibleTargets: item.visibleTargets.map(target => target === oldId ? newId : target),
    })),
    groups: model.groups.map(group => ({ ...group, memberIds: group.memberIds.map(id => id === oldId ? newId : id) })),
  };
}

export function normalizeVisualModel(value: unknown, _metadataType: string): VisualDiagramModel | null {
  try {
    return migrateDiagramSpec(value).spec;
  } catch {
    return null;
  }
}
