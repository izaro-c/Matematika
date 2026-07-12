import { normalizeContentId } from '../../lib/editorContracts';
import type {
  VisualDiagramModel, VisualPoint, VisualElement, VisualSlider, VisualStep,
  TemplateKind, ConstructionKind, ColorToken, ElementKind, PointConstraint,
  ConstructionRefKey, ConstructionSlot, CanvasTool
} from './types';

// Helper constructors
export function point(id: string, label: string, x: number, y: number, fixed = false, color: ColorToken = 'terracota', constraint: PointConstraint = fixed ? 'fixed' : 'free', gliderTarget?: string): VisualPoint {
  return { id, label, x, y, fixed, color, target: true, constraint, gliderTarget };
}

export function element(id: string, label: string, kind: ElementKind, refs: string[], color: ColorToken, target = true, extra: Partial<VisualElement> = {}): VisualElement {
  return { id, label, kind, refs, color, target, ...extra };
}

export function slider(id: string, label: string, x: number, y: number, value: number, color: ColorToken = 'pavo'): VisualSlider {
  return { id, label, x, y, min: 0, max: 10, value, step: 0.1, color, target: true };
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
    title,
    componentId: normalizeContentId(title || 'diagrama-interactivo'),
    category: defaultCategory(metadataType),
    mode: defaultMode(metadataType),
    axis: false,
    grid: false,
    boundingBox: [-5, 5, 5, -5] as [number, number, number, number],
    sliders: [] as VisualSlider[],
    steps: [] as VisualStep[],
    note: 'Arrastre los puntos para explorar la figura.',
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

export function findPoint(model: VisualDiagramModel, id: string): VisualPoint | undefined {
  return model.points.find(item => item.id === id);
}

export function visualPointCoords(model: VisualDiagramModel, id: string): { x: number; y: number } | undefined {
  const direct = findPoint(model, id);
  if (direct) return { x: direct.x, y: direct.y };
  const derived = model.elements.find(item => item.id === id);
  if (!derived) return undefined;
  if (derived.kind === 'midpoint') {
    const a = visualPointCoords(model, derived.refs[0]);
    const b = visualPointCoords(model, derived.refs[1]);
    if (!a || !b) return undefined;
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  }
  if (derived.kind === 'perpendicularFoot') {
    const baseA = visualPointCoords(model, derived.refs[0]);
    const baseB = visualPointCoords(model, derived.refs[1]);
    const source = visualPointCoords(model, derived.refs[2]);
    if (!baseA || !baseB || !source) return undefined;
    const dx = baseB.x - baseA.x;
    const dy = baseB.y - baseA.y;
    const len2 = dx * dx + dy * dy || 1;
    const t = ((source.x - baseA.x) * dx + (source.y - baseA.y) * dy) / len2;
    return { x: baseA.x + dx * t, y: baseA.y + dy * t };
  }
  return undefined;
}

export function baseExtensionCoords(model: VisualDiagramModel, item: VisualElement): { start: { x: number; y: number }; end: { x: number; y: number } } | undefined {
  const baseA = visualPointCoords(model, item.refs[0]);
  const baseB = visualPointCoords(model, item.refs[1]);
  const foot = visualPointCoords(model, item.refs[2]);
  if (!baseA || !baseB || !foot) return undefined;
  const dx = baseB.x - baseA.x;
  const dy = baseB.y - baseA.y;
  const len2 = dx * dx + dy * dy;
  if (len2 < 1e-10) return undefined;
  const t = ((foot.x - baseA.x) * dx + (foot.y - baseA.y) * dy) / len2;
  if (t >= -0.001 && t <= 1.001) return undefined;
  return { start: t < 0 ? baseA : baseB, end: foot };
}

export function supportElements(model: VisualDiagramModel): VisualElement[] {
  return model.elements.filter(item => ['segment', 'line', 'ray', 'circle', 'perpendicular', 'parallel', 'angleBisector'].includes(item.kind));
}

export function projectPointToSupport(model: VisualDiagramModel, pointItem: VisualPoint, coords: { x: number; y: number }): { x: number; y: number } {
  if (pointItem.constraint !== 'glider' || !pointItem.gliderTarget) return coords;
  const support = model.elements.find(item => item.id === pointItem.gliderTarget);
  if (!support) return coords;

  if (support.kind === 'circle') {
    const center = visualPointCoords(model, support.refs[0]);
    const edge = visualPointCoords(model, support.refs[1]);
    if (!center || !edge) return coords;
    const radius = Math.hypot(edge.x - center.x, edge.y - center.y) || 1;
    const dx = coords.x - center.x;
    const dy = coords.y - center.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: center.x + (dx / len) * radius, y: center.y + (dy / len) * radius };
  }

  const a = visualPointCoords(model, support.refs[0]);
  const b = visualPointCoords(model, support.refs[1]);
  const through = visualPointCoords(model, support.refs[2]);
  const lineA = support.kind === 'perpendicular' || support.kind === 'parallel' ? through : a;
  const baseA = a;
  const baseB = b;
  if (!lineA || !baseA || !baseB) return coords;

  const dx = baseB.x - baseA.x;
  const dy = baseB.y - baseA.y;
  const angleLeg = support.kind === 'angleBisector' ? visualPointCoords(model, support.refs[0]) : undefined;
  const angleVertex = support.kind === 'angleBisector' ? visualPointCoords(model, support.refs[1]) : undefined;
  const angleOtherLeg = support.kind === 'angleBisector' ? visualPointCoords(model, support.refs[2]) : undefined;
  const angleDirection = angleLeg && angleVertex && angleOtherLeg
    ? (() => {
      const ux = angleLeg.x - angleVertex.x;
      const uy = angleLeg.y - angleVertex.y;
      const wx = angleOtherLeg.x - angleVertex.x;
      const wy = angleOtherLeg.y - angleVertex.y;
      const uLen = Math.hypot(ux, uy) || 1;
      const wLen = Math.hypot(wx, wy) || 1;
      const sumX = ux / uLen + wx / wLen;
      const sumY = uy / uLen + wy / wLen;
      const sumLen = Math.hypot(sumX, sumY);
      return sumLen < 1e-6 ? { x: -uy / uLen, y: ux / uLen } : { x: sumX / sumLen, y: sumY / sumLen };
    })()
    : undefined;
  const vx = support.kind === 'angleBisector' && angleDirection ? angleDirection.x : support.kind === 'perpendicular' ? -dy : dx;
  const vy = support.kind === 'angleBisector' && angleDirection ? angleDirection.y : support.kind === 'perpendicular' ? dx : dy;
  const origin = support.kind === 'angleBisector' && angleVertex ? angleVertex : lineA;
  const len2 = vx * vx + vy * vy || 1;
  const t = ((coords.x - origin.x) * vx + (coords.y - origin.y) * vy) / len2;
  const clampedT = support.kind === 'ray' || support.kind === 'angleBisector' ? Math.max(0, t) : t;
  return { x: origin.x + vx * clampedT, y: origin.y + vy * clampedT };
}

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
  };
}

export function renameElement(model: VisualDiagramModel, oldId: string, newIdRaw: string): VisualDiagramModel {
  const newId = cleanTargetId(newIdRaw, oldId);
  if (newId !== oldId && model.elements.some(item => item.id === newId)) return model;
  return {
    ...model,
    elements: model.elements.map(item => item.id === oldId ? { ...item, id: newId } : item),
    steps: model.steps.map(item => ({
      ...item,
      visibleTargets: item.visibleTargets.map(target => target === oldId ? newId : target),
    })),
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
  };
}

// Normalizers
function isColorToken(value: unknown): value is ColorToken {
  return COLOR_OPTIONS.some(option => option.value === value);
}

function isElementKind(value: unknown): value is ElementKind {
  return typeof value === 'string' && value in KIND_LABELS;
}

function isPointConstraint(value: unknown): value is PointConstraint {
  return value === 'free' || value === 'fixed' || value === 'horizontal' || value === 'vertical' || value === 'glider';
}

function toNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function normalizePoint(value: unknown): VisualPoint | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  const id = typeof record.id === 'string' ? cleanTargetId(record.id, '') : '';
  if (!id) return null;
  return {
    id,
    label: typeof record.label === 'string' ? record.label : id.replace(/^p/, ''),
    x: toNumber(record.x, 0),
    y: toNumber(record.y, 0),
    color: isColorToken(record.color) ? record.color : 'terracota',
    fixed: record.fixed === true,
    target: record.target !== false,
    constraint: isPointConstraint(record.constraint) ? record.constraint : record.fixed === true ? 'fixed' : 'free',
    gliderTarget: typeof record.gliderTarget === 'string' ? record.gliderTarget : undefined,
  };
}

function normalizeElement(value: unknown): VisualElement | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  const id = typeof record.id === 'string' ? cleanTargetId(record.id, '') : '';
  if (!id || !isElementKind(record.kind)) return null;
  return {
    id,
    label: typeof record.label === 'string' ? record.label : KIND_LABELS[record.kind],
    kind: record.kind,
    refs: Array.isArray(record.refs) ? record.refs.filter((ref): ref is string => typeof ref === 'string') : [],
    color: isColorToken(record.color) ? record.color : 'carbon',
    target: record.target !== false,
    dashed: record.dashed === true,
    text: typeof record.text === 'string' ? record.text : undefined,
  };
}

function normalizeSlider(value: unknown): VisualSlider | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  const id = typeof record.id === 'string' ? cleanTargetId(record.id, '') : '';
  if (!id) return null;
  const min = toNumber(record.min, 0);
  const max = Math.max(min + 0.1, toNumber(record.max, 10));
  return {
    id,
    label: typeof record.label === 'string' ? record.label : id,
    x: toNumber(record.x, -4),
    y: toNumber(record.y, -4),
    min,
    max,
    value: Math.min(max, Math.max(min, toNumber(record.value, min))),
    step: Math.max(0.01, toNumber(record.step, 0.1)),
    color: isColorToken(record.color) ? record.color : 'pavo',
    target: record.target !== false,
  };
}

function normalizeStep(value: unknown): VisualStep | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  const id = typeof record.id === 'string' ? cleanTargetId(record.id, '') : '';
  if (!id) return null;
  return {
    id,
    label: typeof record.label === 'string' ? record.label : id,
    description: typeof record.description === 'string' ? record.description : '',
    visibleTargets: Array.isArray(record.visibleTargets)
      ? record.visibleTargets.filter((target): target is string => typeof target === 'string')
      : [],
  };
}

export function normalizeVisualModel(value: unknown, metadataType: string): VisualDiagramModel | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  const points = Array.isArray(record.points) ? record.points.map(normalizePoint).filter(Boolean) as VisualPoint[] : [];
  if (points.length === 0) return null;
  const elements = Array.isArray(record.elements) ? record.elements.map(normalizeElement).filter(Boolean) as VisualElement[] : [];
  const sliders = Array.isArray(record.sliders) ? record.sliders.map(normalizeSlider).filter(Boolean) as VisualSlider[] : [];
  const steps = Array.isArray(record.steps) ? record.steps.map(normalizeStep).filter(Boolean) as VisualStep[] : [];
  const fallback = createTemplateModel('triangulo-deformable', 'Diagrama interactivo', metadataType);
  const box = Array.isArray(record.boundingBox) && record.boundingBox.length === 4
    ? record.boundingBox.map((item, index) => toNumber(item, fallback.boundingBox[index])) as [number, number, number, number]
    : fallback.boundingBox;
  const mode = record.mode === 'diagram' || record.mode === 'inline' || record.mode === 'simulation'
    ? record.mode
    : defaultMode(metadataType);

  return {
    title: typeof record.title === 'string' ? record.title : fallback.title,
    componentId: typeof record.componentId === 'string' ? normalizeContentId(record.componentId) : fallback.componentId,
    category: typeof record.category === 'string' ? record.category.replace(/[^A-Za-z0-9_-]/g, '') || fallback.category : fallback.category,
    mode,
    axis: record.axis === true,
    grid: record.grid === true,
    boundingBox: box,
    points,
    elements,
    sliders,
    steps,
    note: typeof record.note === 'string' ? record.note : fallback.note,
  };
}
