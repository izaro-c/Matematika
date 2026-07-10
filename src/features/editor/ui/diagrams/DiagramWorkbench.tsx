import React, { useEffect, useMemo, useState } from 'react';
import { normalizeContentId } from '@/features/editor/lib/editorContracts';
import type { DiagramSpec, DiagramTarget, DiagramTargetRegistry } from '@/features/editor/core/editorTypes';

interface DiagramWorkbenchProps {
  isOpen: boolean;
  currentFile: string | null;
  metadataType: string;
  initialModel?: Record<string, unknown> | null;
  initialSource?: string;
  onClose: () => void;
  onConfirm: (spec: DiagramSpec) => void;
}

type TemplateKind =
  | 'triangulo-deformable'
  | 'cuadrilatero-clasificable'
  | 'circunferencia'
  | 'eje-cartesiano'
  | 'lugar-geometrico'
  | 'demostracion-pasos'
  | 'modelo-estatico';

type ConstructionKind = 'mediatriz' | 'mediana' | 'altura' | 'bisectriz';
type WorkbenchTab = 'visual' | 'source';
type ColorToken = 'carbon' | 'terracota' | 'salvia' | 'pizarra' | 'ocre' | 'pavo' | 'granada' | 'musgo';
type ElementKind = 'segment' | 'line' | 'ray' | 'polygon' | 'circle' | 'midpoint' | 'perpendicularFoot' | 'baseExtension' | 'perpendicular' | 'parallel' | 'angleBisector' | 'angle' | 'rightAngle' | 'measurement' | 'text';
type CanvasTool = 'select' | 'point' | ElementKind;
type PointConstraint = 'free' | 'fixed' | 'horizontal' | 'vertical' | 'glider';
type RefSlot = { label: string; value: string; index: number };
type ConstructionRefKey = 'a' | 'b' | 'c';
type ConstructionSlot = { key: ConstructionRefKey; label: string };

interface VisualPoint {
  id: string;
  label: string;
  x: number;
  y: number;
  color: ColorToken;
  fixed: boolean;
  target: boolean;
  constraint?: PointConstraint;
  gliderTarget?: string;
}

interface VisualElement {
  id: string;
  label: string;
  kind: ElementKind;
  refs: string[];
  color: ColorToken;
  target: boolean;
  dashed?: boolean;
  text?: string;
}

interface VisualSlider {
  id: string;
  label: string;
  x: number;
  y: number;
  min: number;
  max: number;
  value: number;
  step: number;
  color: ColorToken;
  target: boolean;
}

interface VisualStep {
  id: string;
  label: string;
  description: string;
  visibleTargets: string[];
}

interface VisualDiagramModel {
  title: string;
  componentId: string;
  category: string;
  mode: 'simulation' | 'diagram' | 'inline';
  axis: boolean;
  grid: boolean;
  boundingBox: [number, number, number, number];
  points: VisualPoint[];
  elements: VisualElement[];
  sliders: VisualSlider[];
  steps: VisualStep[];
  note: string;
}

const TEMPLATE_OPTIONS: Array<{ value: TemplateKind; label: string; description: string }> = [
  { value: 'triangulo-deformable', label: 'Triángulo deformable', description: 'Vértices arrastrables, lados, área y targets listos para texto interactivo.' },
  { value: 'cuadrilatero-clasificable', label: 'Cuadrilátero clasificable', description: 'Cuatro vértices, lados, diagonales opcionales y lectura visual de clases.' },
  { value: 'circunferencia', label: 'Circunferencia', description: 'Centro, punto sobre la circunferencia, radio y medición enlazable.' },
  { value: 'eje-cartesiano', label: 'Eje cartesiano', description: 'Plano con grid, punto de control y coordenadas dinámicas.' },
  { value: 'lugar-geometrico', label: 'Lugar geométrico', description: 'Puntos base, mediatriz y glider conceptual para propiedades equidistantes.' },
  { value: 'demostracion-pasos', label: 'Demostración por pasos', description: 'Construcción preparada para targets step1, step2 y step3.' },
  { value: 'modelo-estatico', label: 'Modelo estático', description: 'Estructura fija para modelos de incidencia o contraejemplos.' },
];

const CONSTRUCTION_OPTIONS: Array<{ value: ConstructionKind; label: string; description: string; slots: ConstructionSlot[] }> = [
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

const COLOR_OPTIONS: Array<{ value: ColorToken; label: string }> = [
  { value: 'carbon', label: 'Carbon' },
  { value: 'terracota', label: 'Terracota' },
  { value: 'salvia', label: 'Salvia' },
  { value: 'pizarra', label: 'Pizarra' },
  { value: 'ocre', label: 'Ocre' },
  { value: 'pavo', label: 'Pavo' },
  { value: 'granada', label: 'Granada' },
  { value: 'musgo', label: 'Musgo' },
];

function safeColorToken(value: string): ColorToken {
  return COLOR_OPTIONS.some(option => option.value === value) ? value as ColorToken : 'terracota';
}

function targetText(target: DiagramTarget): string {
  return target.label.replace(/^Punto\s+/i, '').trim() || target.id;
}

function safeMdxText(value: string): string {
  return value.replace(/[<>{}]/g, '').trim() || 'texto';
}

function interactiveElementSnippet(target: DiagramTarget): string {
  const color = safeColorToken(target.color);
  return `<InteractiveElement target="${target.id}" color="${color}">${safeMdxText(targetText(target))}</InteractiveElement>`;
}

function conceptHighlightSnippet(target: DiagramTarget): string {
  const color = safeColorToken(target.color);
  return `<ConceptLink targetId="concepto-id" highlightTarget="${target.id}" highlightColor="${color}">${safeMdxText(targetText(target))}</ConceptLink>`;
}

const KIND_LABELS: Record<ElementKind, string> = {
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

const DRAWING_TOOLS: Array<{ value: CanvasTool; label: string; hint: string }> = [
  { value: 'select', label: 'Seleccionar', hint: 'Mover puntos y editar propiedades.' },
  { value: 'point', label: 'Punto', hint: 'Clic en el lienzo para colocar un punto.' },
  { value: 'segment', label: 'Segmento', hint: 'Seleccione dos puntos.' },
  { value: 'line', label: 'Recta', hint: 'Seleccione dos puntos.' },
  { value: 'ray', label: 'Semirrecta', hint: 'Seleccione origen y dirección.' },
  { value: 'polygon', label: 'Triángulo', hint: 'Seleccione tres puntos.' },
  { value: 'circle', label: 'Circunf.', hint: 'Seleccione centro y punto de radio.' },
  { value: 'midpoint', label: 'P. medio', hint: 'Seleccione los extremos del segmento.' },
  { value: 'perpendicularFoot', label: 'Pie perp.', hint: 'Seleccione base A, base B y punto proyectado.' },
  { value: 'perpendicular', label: 'Perp.', hint: 'Seleccione base A, base B y punto de paso.' },
  { value: 'parallel', label: 'Paralela', hint: 'Seleccione base A, base B y punto de paso.' },
  { value: 'angleBisector', label: 'Bisectriz', hint: 'Seleccione lado, vértice y lado.' },
  { value: 'angle', label: 'Ángulo', hint: 'Seleccione lado, vértice y lado.' },
  { value: 'rightAngle', label: 'Recto', hint: 'Seleccione lado, vértice y lado.' },
  { value: 'measurement', label: 'Medición', hint: 'Seleccione un punto ancla.' },
  { value: 'text', label: 'Etiqueta', hint: 'Seleccione un punto ancla.' },
];

const MODEL_START = '/* @matematika-diagram-model';
const MODEL_END = '*/';

function toPascalCase(value: string): string {
  const normalized = normalizeContentId(value || 'diagrama-editor');
  return normalized
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function defaultCategory(metadataType: string): string {
  if (metadataType === 'definicion') return 'Definiciones';
  if (metadataType === 'axioma') return 'Axiomas';
  if (metadataType === 'modelo') return 'Models';
  if (metadataType === 'demostracion') return 'Demos';
  if (metadataType === 'ejercicio') return 'Ejercicios';
  return 'Teoremas';
}

function defaultMode(metadataType: string): VisualDiagramModel['mode'] {
  return metadataType === 'modelo' ? 'diagram' : 'simulation';
}

function relativeImportPath(currentFile: string | null, diagramPath: string): string {
  if (!currentFile) return `../../../${diagramPath.replace(/\.tsx$/, '')}`;
  const fromDirDepth = currentFile.split('/').length - 1;
  const prefix = Array(fromDirDepth).fill('..').join('/') || '.';
  return `${prefix}/${diagramPath.replace(/\.tsx$/, '')}`;
}

function point(id: string, label: string, x: number, y: number, fixed = false, color: ColorToken = 'terracota', constraint: PointConstraint = fixed ? 'fixed' : 'free', gliderTarget?: string): VisualPoint {
  return { id, label, x, y, fixed, color, target: true, constraint, gliderTarget };
}

function element(id: string, label: string, kind: ElementKind, refs: string[], color: ColorToken, target = true, extra: Partial<VisualElement> = {}): VisualElement {
  return { id, label, kind, refs, color, target, ...extra };
}

function slider(id: string, label: string, x: number, y: number, value: number, color: ColorToken = 'pavo'): VisualSlider {
  return { id, label, x, y, min: 0, max: 10, value, step: 0.1, color, target: true };
}

function step(id: string, label: string, description: string, visibleTargets: string[]): VisualStep {
  return { id, label, description, visibleTargets };
}

function createTemplateModel(kind: TemplateKind, title: string, metadataType: string): VisualDiagramModel {
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

function targetKind(kind: ElementKind): DiagramTarget['kind'] {
  if (kind === 'segment' || kind === 'baseExtension') return 'segment';
  if (kind === 'line' || kind === 'ray' || kind === 'perpendicular' || kind === 'parallel' || kind === 'angleBisector') return 'line';
  if (kind === 'polygon') return 'polygon';
  if (kind === 'midpoint' || kind === 'perpendicularFoot') return 'point';
  if (kind === 'angle' || kind === 'rightAngle') return 'angle';
  if (kind === 'circle') return 'other';
  return 'measurement';
}

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

function normalizeVisualModel(value: unknown, metadataType: string): VisualDiagramModel | null {
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

function parseEmbeddedModel(source?: string, metadataType = ''): VisualDiagramModel | null {
  if (!source) return null;
  const start = source.indexOf(MODEL_START);
  if (start === -1) return null;
  const jsonStart = start + MODEL_START.length;
  const end = source.indexOf(MODEL_END, jsonStart);
  if (end === -1) return null;
  try {
    return normalizeVisualModel(JSON.parse(source.slice(jsonStart, end).trim()), metadataType);
  } catch {
    return null;
  }
}

function serializeModel(model: VisualDiagramModel): string {
  return JSON.stringify(model, null, 2);
}

function refSlotsFor(item: VisualElement): RefSlot[] {
  if (item.kind === 'segment' || item.kind === 'line' || item.kind === 'ray') return [0, 1].map(index => ({ index, value: item.refs[index] || '', label: index === 0 ? 'Inicio' : 'Dirección' }));
  if (item.kind === 'circle') return [0, 1].map(index => ({ index, value: item.refs[index] || '', label: index === 0 ? 'Centro' : 'Radio' }));
  if (item.kind === 'midpoint') return [0, 1].map(index => ({ index, value: item.refs[index] || '', label: index === 0 ? 'Extremo 1' : 'Extremo 2' }));
  if (item.kind === 'perpendicularFoot') return [0, 1, 2].map(index => ({ index, value: item.refs[index] || '', label: index === 2 ? 'Punto proyectado' : `Base ${index + 1}` }));
  if (item.kind === 'baseExtension') return [0, 1, 2].map(index => ({ index, value: item.refs[index] || '', label: index === 2 ? 'Pie de altura' : `Base ${index + 1}` }));
  if (item.kind === 'perpendicular' || item.kind === 'parallel') return [0, 1, 2].map(index => ({ index, value: item.refs[index] || '', label: index === 2 ? 'Pasa por' : `Base ${index + 1}` }));
  if (item.kind === 'angleBisector') return [0, 1, 2].map(index => ({ index, value: item.refs[index] || '', label: index === 1 ? 'Vértice' : `Lado ${index === 0 ? 1 : 2}` }));
  if (item.kind === 'angle' || item.kind === 'rightAngle') return [0, 1, 2].map(index => ({ index, value: item.refs[index] || '', label: index === 1 ? 'Vértice' : `Punto ${index + 1}` }));
  if (item.kind === 'text' || item.kind === 'measurement') return [{ index: 0, value: item.refs[0] || '', label: 'Ancla' }];
  return item.refs.map((value, index) => ({ index, value, label: `Vértice ${index + 1}` }));
}

function buildTargets(model: VisualDiagramModel): DiagramTargetRegistry {
  const pointTargets = model.points
    .filter(item => item.target)
    .map(item => ({ id: item.id, label: `Punto ${item.label}`, color: item.color, kind: 'point' as const }));
  const elementTargets = model.elements
    .filter(item => item.target)
    .map(item => ({ id: item.id, label: item.label, color: item.color, kind: targetKind(item.kind) }));
  const sliderTargets = model.sliders
    .filter(item => item.target)
    .map(item => ({ id: item.id, label: item.label, color: item.color, kind: 'slider' as const }));
  const stepTargets = model.steps
    .map(item => ({ id: item.id, label: item.label, color: 'ocre', kind: 'step' as const }));
  return [...pointTargets, ...elementTargets, ...sliderTargets, ...stepTargets];
}

function quote(value: string): string {
  return JSON.stringify(value);
}

function buildSource(model: VisualDiagramModel, componentName: string): string {
  const axis = model.axis ? '\n      axis' : '';
  const grid = model.grid ? '\n      grid' : '';
  const helpers = new Set(['createPoint']);
  const gliderPoints = model.points.filter(item => item.constraint === 'glider' && item.gliderTarget);
  if (gliderPoints.length > 0) helpers.add('createGlider');
  if (model.sliders.length > 0) helpers.add('createSlider');
  model.elements.forEach(item => {
    if (item.kind === 'segment') helpers.add('createSegment');
    if (item.kind === 'line') helpers.add('createLine');
    if (item.kind === 'ray') helpers.add('createRay');
    if (item.kind === 'polygon') helpers.add('createPolygon');
    if (item.kind === 'circle') helpers.add('createCircle');
    if (item.kind === 'midpoint') helpers.add('createMidpoint');
    if (item.kind === 'perpendicularFoot') helpers.add('createPerpendicularFoot');
    if (item.kind === 'baseExtension') helpers.add('createBaseExtensionToFoot');
    if (item.kind === 'perpendicular') helpers.add('createPerpendicularLine');
    if (item.kind === 'parallel') helpers.add('createParallelLine');
    if (item.kind === 'angleBisector') helpers.add('createAngleBisectorRay');
    if (item.kind === 'angle') helpers.add('createAngle');
    if (item.kind === 'rightAngle') helpers.add('createRightAngleMarker');
    if (item.kind === 'text' || item.kind === 'measurement') helpers.add('createText');
  });
  const helperImports = Array.from(helpers).sort().join(', ');
  const pointLines = model.points.filter(item => item.constraint !== 'glider').map(item => {
    const options = [
      `name: ${quote(item.label)}`,
      item.fixed ? 'fixed: true' : '',
      `fillColor: theme.${item.color}`,
      `strokeColor: theme.${item.color}`,
    ].filter(Boolean).join(', ');
    return `        els[${quote(item.id)}] = createPoint(board, [${item.x.toFixed(2)}, ${item.y.toFixed(2)}], { ${options} }, theme);`;
  });
  const constraintLines = model.points.filter(item => item.constraint !== 'glider').map(item => {
    if (item.constraint === 'horizontal' && !item.fixed) {
      return `        els[${quote(item.id)}].on('drag', () => els[${quote(item.id)}].moveTo([els[${quote(item.id)}].X(), ${item.y.toFixed(2)}], 0));`;
    }
    if (item.constraint === 'vertical' && !item.fixed) {
      return `        els[${quote(item.id)}].on('drag', () => els[${quote(item.id)}].moveTo([${item.x.toFixed(2)}, els[${quote(item.id)}].Y()], 0));`;
    }
    return '';
  }).filter(Boolean);

  const gliderPointIds = new Set(gliderPoints.map(item => item.id));
  const createElementLine = (item: VisualElement) => {
    const refs = item.refs.map(ref => `els[${quote(ref)}]`).join(', ');
    if (item.kind === 'segment') {
      if (item.refs.length < 2) return '';
      return `        els[${quote(item.id)}] = createSegment(board, [${refs}], { strokeColor: theme.${item.color}, strokeWidth: 2.4${item.dashed ? ', dash: 2' : ''} }, theme);`;
    }
    if (item.kind === 'line') {
      if (item.refs.length < 2) return '';
      return `        els[${quote(item.id)}] = createLine(board, [${refs}], { strokeColor: theme.${item.color}, strokeWidth: 2.2${item.dashed ? ', dash: 2' : ''} }, theme);`;
    }
    if (item.kind === 'ray') {
      if (item.refs.length < 2) return '';
      return `        els[${quote(item.id)}] = createRay(board, [${refs}], { strokeColor: theme.${item.color}, strokeWidth: 2.2${item.dashed ? ', dash: 2' : ''} }, theme);`;
    }
    if (item.kind === 'polygon') {
      if (item.refs.length < 3) return '';
      return `        els[${quote(item.id)}] = createPolygon(board, [${refs}], { fillColor: theme.${item.color}, fillOpacity: 0.16, borders: { strokeColor: theme.${item.color}, strokeWidth: 1.5 } }, theme);`;
    }
    if (item.kind === 'circle') {
      if (item.refs.length < 2) return '';
      return `        els[${quote(item.id)}] = createCircle(board, [${refs}], { strokeColor: theme.${item.color}, strokeWidth: 2.5 }, theme);`;
    }
    if (item.kind === 'midpoint') {
      if (item.refs.length < 2) return '';
      return `        els[${quote(item.id)}] = createMidpoint(board, [${refs}], { name: ${quote(item.label)}, fillColor: theme.${item.color}, strokeColor: theme.${item.color} }, theme);`;
    }
    if (item.kind === 'perpendicularFoot') {
      if (item.refs.length < 3) return '';
      return `        els[${quote(item.id)}] = createPerpendicularFoot(board, [${refs}], { name: ${quote(item.label)}, fillColor: theme.${item.color}, strokeColor: theme.${item.color} }, theme);`;
    }
    if (item.kind === 'baseExtension') {
      if (item.refs.length < 3) return '';
      return `        els[${quote(item.id)}] = createBaseExtensionToFoot(board, [${refs}], { strokeColor: theme.${item.color}, strokeWidth: 1.7, dash: 2 }, theme);`;
    }
    if (item.kind === 'perpendicular') {
      if (item.refs.length < 3) return '';
      return `        els[${quote(item.id)}] = createPerpendicularLine(board, [${refs}], { strokeColor: theme.${item.color}, strokeWidth: 2.2${item.dashed === false ? ', dash: 0' : item.dashed ? ', dash: 2' : ''} }, theme);`;
    }
    if (item.kind === 'parallel') {
      if (item.refs.length < 3) return '';
      return `        els[${quote(item.id)}] = createParallelLine(board, [${refs}], { strokeColor: theme.${item.color}, strokeWidth: 2.2${item.dashed === false ? ', dash: 0' : item.dashed ? ', dash: 2' : ''} }, theme);`;
    }
    if (item.kind === 'angleBisector') {
      if (item.refs.length < 3) return '';
      return `        els[${quote(item.id)}] = createAngleBisectorRay(board, [${refs}], { strokeColor: theme.${item.color}, strokeWidth: 2.2${item.dashed === false ? ', dash: 0' : item.dashed ? ', dash: 2' : ''} }, theme);`;
    }
    if (item.kind === 'angle') {
      if (item.refs.length < 3) return '';
      return `        els[${quote(item.id)}] = createAngle(board, [${refs}], { fillColor: theme.${item.color}, strokeColor: theme.${item.color} }, theme);`;
    }
    if (item.kind === 'rightAngle') {
      if (item.refs.length < 3) return '';
      return `        els[${quote(item.id)}] = createRightAngleMarker(board, [${refs}], { fillColor: theme.${item.color}, strokeColor: theme.${item.color} }, theme);`;
    }
    const anchor = item.refs[0] || model.points[0]?.id;
    if (!anchor) return '';
    return `        els[${quote(item.id)}] = createText(board, [() => els[${quote(anchor)}].X() + 0.25, () => els[${quote(anchor)}].Y() + 0.35, ${quote(item.text || item.label)}], { color: theme.${item.color} }, theme);`;
  };
  const baseElementLines = model.elements
    .filter(item => !item.refs.some(ref => gliderPointIds.has(ref)))
    .map(createElementLine)
    .filter(Boolean);
  const gliderLines = gliderPoints.map(item => {
    const options = [
      `name: ${quote(item.label)}`,
      `fillColor: theme.${item.color}`,
      `strokeColor: theme.${item.color}`,
    ].join(', ');
    return `        els[${quote(item.id)}] = createGlider(board, [${item.x.toFixed(2)}, ${item.y.toFixed(2)}, els[${quote(item.gliderTarget || '')}]], { ${options} }, theme);`;
  });
  const dependentElementLines = model.elements
    .filter(item => item.refs.some(ref => gliderPointIds.has(ref)))
    .map(createElementLine)
    .filter(Boolean);

  const sliderLines = model.sliders.map(item => `        els[${quote(item.id)}] = createSlider(board, [[${item.x.toFixed(2)}, ${item.y.toFixed(2)}], [${(item.x + 2.6).toFixed(2)}, ${item.y.toFixed(2)}]], [${item.min}, ${item.value}, ${item.max}], { name: ${quote(item.label)}, snapWidth: ${item.step}, fillColor: theme.${item.color}, strokeColor: theme.${item.color} }, theme);`);
  const stepTargetMap = model.steps.reduce<Record<string, string[]>>((acc, item) => {
    acc[item.id] = item.visibleTargets;
    return acc;
  }, {});
  const generatedTargetIds = [
    ...model.points.filter(item => item.target).map(item => item.id),
    ...model.elements.filter(item => item.target).map(item => item.id),
    ...model.sliders.filter(item => item.target).map(item => item.id),
    ...model.steps.map(item => item.id),
  ];
  const hasBaseExtensions = model.elements.some(item => item.kind === 'baseExtension');
  const updateLines = [
    ...model.points.map(item => `        els[${quote(item.id)}]?.setAttribute({ visible: visibleInStep(${quote(item.id)}), size: isHL(${quote(item.id)}) ? 8.5 : 5, fillColor: isHL(${quote(item.id)}) ? theme.ocre : theme.${item.color}, strokeColor: isHL(${quote(item.id)}) ? theme.ocre : theme.${item.color}, fillOpacity: emphasis(${quote(item.id)}) });`),
    ...model.elements.map(item => {
      if (item.kind === 'polygon') return `        els[${quote(item.id)}]?.setAttribute({ visible: visibleInStep(${quote(item.id)}), fillOpacity: isHL(${quote(item.id)}) ? 0.34 : 0.16 * emphasis(${quote(item.id)}) });`;
      if (item.kind === 'baseExtension') return `        els[${quote(item.id)}]?.setAttribute({ visible: visibleInStep(${quote(item.id)}) && outsideBaseExtension(els[${quote(item.refs[0] || '')}], els[${quote(item.refs[1] || '')}], els[${quote(item.refs[2] || '')}]), strokeOpacity: emphasis(${quote(item.id)}), strokeWidth: isHL(${quote(item.id)}) ? 4.2 : 1.7, strokeColor: isHL(${quote(item.id)}) ? theme.ocre : theme.${item.color} });`;
      if (item.kind === 'circle' || item.kind === 'segment' || item.kind === 'line' || item.kind === 'ray' || item.kind === 'perpendicular' || item.kind === 'parallel' || item.kind === 'angleBisector') return `        els[${quote(item.id)}]?.setAttribute({ visible: visibleInStep(${quote(item.id)}), strokeOpacity: emphasis(${quote(item.id)}), strokeWidth: isHL(${quote(item.id)}) ? 4.8 : 2.4, strokeColor: isHL(${quote(item.id)}) ? theme.ocre : theme.${item.color} });`;
      if (item.kind === 'midpoint' || item.kind === 'perpendicularFoot') return `        els[${quote(item.id)}]?.setAttribute({ visible: visibleInStep(${quote(item.id)}), size: isHL(${quote(item.id)}) ? 8.5 : 5, fillColor: isHL(${quote(item.id)}) ? theme.ocre : theme.${item.color}, strokeColor: isHL(${quote(item.id)}) ? theme.ocre : theme.${item.color}, fillOpacity: emphasis(${quote(item.id)}) });`;
      if (item.kind === 'angle' || item.kind === 'rightAngle') return `        els[${quote(item.id)}]?.setAttribute({ visible: visibleInStep(${quote(item.id)}), fillOpacity: isHL(${quote(item.id)}) ? 0.45 : 0.18 * emphasis(${quote(item.id)}), strokeWidth: isHL(${quote(item.id)}) ? 3 : 1.5 });`;
      return `        els[${quote(item.id)}]?.setAttribute({ visible: visibleInStep(${quote(item.id)}), color: isHL(${quote(item.id)}) ? theme.ocre : theme.${item.color}, opacity: emphasis(${quote(item.id)}) });`;
    }),
    ...model.sliders.map(item => `        els[${quote(item.id)}]?.setAttribute({ visible: visibleInStep(${quote(item.id)}), strokeColor: isHL(${quote(item.id)}) ? theme.ocre : theme.${item.color}, opacity: emphasis(${quote(item.id)}) });`),
  ];

  return `import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import { ${helperImports} } from '@/shared/diagrams/core/MathFactory';
import { DiagramInfoPanel, DiagramTitle } from '@/shared/ui/DiagramOverlay';

${MODEL_START}
${serializeModel(model)}
${MODEL_END}

export const ${componentName} = () => {
  return (
    <MathBoard
      boundingbox={[${model.boundingBox.join(', ')}]}${axis}${grid}
      onInit={(board, els, theme) => {
${[...pointLines, ...constraintLines, ...baseElementLines, ...gliderLines, ...dependentElementLines, ...sliderLines].join('\n')}
      }}
      onUpdate={(_board, els, theme, isStep, isHL) => {
        const stepTargets: Record<string, string[]> = ${JSON.stringify(stepTargetMap, null, 10)};
        const activeSteps = Object.keys(stepTargets).filter(isStep);
        const hasActiveStep = activeSteps.length > 0;
        const visibleInStep = (id: string) => !hasActiveStep || activeSteps.some(stepId => stepTargets[stepId]?.includes(id));
        const targetIds = ${JSON.stringify(generatedTargetIds)};
        const anyHighlight = targetIds.some(isHL);
        const emphasis = (id: string) => isHL(id) ? 1 : anyHighlight ? 0.28 : 1;
${hasBaseExtensions ? `        const outsideBaseExtension = (baseA: any, baseB: any, foot: any) => {
          if (!baseA || !baseB || !foot) return false;
          const dx = baseB.X() - baseA.X();
          const dy = baseB.Y() - baseA.Y();
          const len2 = dx * dx + dy * dy;
          if (len2 < 1e-10) return false;
          const t = ((foot.X() - baseA.X()) * dx + (foot.Y() - baseA.Y()) * dy) / len2;
          return t < -0.001 || t > 1.001;
        };
` : ''}${updateLines.join('\n')}
${updateLines.join('\n')}
      }}
    >
      <DiagramTitle>{${quote(model.title)}}</DiagramTitle>
      <DiagramInfoPanel title="Exploración" position="bottom-right">
        <span>{${quote(model.note)}}</span>
      </DiagramInfoPanel>
    </MathBoard>
  );
};
`;
}

function findPoint(model: VisualDiagramModel, id: string): VisualPoint | undefined {
  return model.points.find(item => item.id === id);
}

function visualPointCoords(model: VisualDiagramModel, id: string): { x: number; y: number } | undefined {
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

function baseExtensionCoords(model: VisualDiagramModel, item: VisualElement): { start: { x: number; y: number }; end: { x: number; y: number } } | undefined {
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

function supportElements(model: VisualDiagramModel): VisualElement[] {
  return model.elements.filter(item => ['segment', 'line', 'ray', 'circle', 'perpendicular', 'parallel', 'angleBisector'].includes(item.kind));
}

function projectPointToSupport(model: VisualDiagramModel, pointItem: VisualPoint, coords: { x: number; y: number }): { x: number; y: number } {
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

function nextPointId(points: VisualPoint[]): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (const letter of letters) {
    if (!points.some(item => item.id === `p${letter}`)) return `p${letter}`;
  }
  return `p${points.length + 1}`;
}

function nextSliderId(sliders: VisualSlider[]): string {
  let index = sliders.length + 1;
  while (sliders.some(item => item.id === `slider${index}`)) index += 1;
  return `slider${index}`;
}

function nextStepId(steps: VisualStep[]): string {
  let index = steps.length + 1;
  while (steps.some(item => item.id === `step${index}`)) index += 1;
  return `step${index}`;
}

function refsNeededForTool(tool: CanvasTool): number {
  if (tool === 'segment' || tool === 'line' || tool === 'ray' || tool === 'circle' || tool === 'midpoint') return 2;
  if (tool === 'polygon' || tool === 'perpendicularFoot' || tool === 'baseExtension' || tool === 'perpendicular' || tool === 'parallel' || tool === 'angleBisector' || tool === 'angle' || tool === 'rightAngle') return 3;
  if (tool === 'measurement' || tool === 'text') return 1;
  return 0;
}

function generatedElementId(kind: ElementKind, refs: string[], existing: VisualElement[]): string {
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

function elementColorForKind(kind: ElementKind): ColorToken {
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

function updatePoint(model: VisualDiagramModel, pointId: string, update: Partial<VisualPoint>): VisualDiagramModel {
  return {
    ...model,
    points: model.points.map(item => item.id === pointId ? { ...item, ...update } : item),
  };
}

function updateElement(model: VisualDiagramModel, elementId: string, update: Partial<VisualElement>): VisualDiagramModel {
  return {
    ...model,
    elements: model.elements.map(item => item.id === elementId ? { ...item, ...update } : item),
  };
}

function updateSlider(model: VisualDiagramModel, sliderId: string, update: Partial<VisualSlider>): VisualDiagramModel {
  return {
    ...model,
    sliders: model.sliders.map(item => item.id === sliderId ? { ...item, ...update } : item),
  };
}

function updateStep(model: VisualDiagramModel, stepId: string, update: Partial<VisualStep>): VisualDiagramModel {
  return {
    ...model,
    steps: model.steps.map(item => item.id === stepId ? { ...item, ...update } : item),
  };
}

function cleanTargetId(value: string, fallback: string): string {
  return value.replace(/[^A-Za-z0-9_-]/g, '') || fallback;
}

function pointNameFromRef(ref: string): string {
  return ref.replace(/^p/, '') || ref;
}

function refsMatch(left: string[], right: string[], unordered = false): boolean {
  if (left.length !== right.length) return false;
  if (!unordered) return left.every((ref, index) => ref === right[index]);
  return left.every(ref => right.includes(ref));
}

function reusableElement(elements: VisualElement[], kind: ElementKind, refs: string[], unordered = false): VisualElement | undefined {
  return elements.find(item => item.kind === kind && refsMatch(item.refs, refs, unordered));
}

function uniqueElementId(base: string, elements: VisualElement[]): string {
  const cleanBase = cleanTargetId(base, `element${elements.length + 1}`);
  let candidate = cleanBase;
  let index = 2;
  while (elements.some(item => item.id === candidate)) {
    candidate = `${cleanBase}_${index}`;
    index += 1;
  }
  return candidate;
}

function constructionOption(kind: ConstructionKind) {
  return CONSTRUCTION_OPTIONS.find(item => item.value === kind) || CONSTRUCTION_OPTIONS[0];
}

function defaultConstructionRefs(points: VisualPoint[]): Record<ConstructionRefKey, string> {
  return {
    a: points[0]?.id || '',
    b: points[1]?.id || points[0]?.id || '',
    c: points[2]?.id || points[0]?.id || '',
  };
}

function normalizeConstructionRefs(points: VisualPoint[], refs: Record<ConstructionRefKey, string>): Record<ConstructionRefKey, string> {
  const pointIds = new Set(points.map(item => item.id));
  const defaults = defaultConstructionRefs(points);
  return {
    a: pointIds.has(refs.a) ? refs.a : defaults.a,
    b: pointIds.has(refs.b) ? refs.b : defaults.b,
    c: pointIds.has(refs.c) ? refs.c : defaults.c,
  };
}

function validConstructionRefs(kind: ConstructionKind, refs: Record<ConstructionRefKey, string>): boolean {
  const slots = constructionOption(kind).slots;
  const values = slots.map(slot => refs[slot.key]).filter(Boolean);
  return values.length === slots.length && new Set(values).size === values.length;
}

function appendTargetsToSteps(steps: VisualStep[], targetIds: string[]): VisualStep[] {
  if (targetIds.length === 0) return steps;
  return steps.map(item => ({
    ...item,
    visibleTargets: Array.from(new Set([...item.visibleTargets, ...targetIds])),
  }));
}

function applyGuidedConstruction(model: VisualDiagramModel, kind: ConstructionKind, refs: Record<ConstructionRefKey, string>): { model: VisualDiagramModel; selectedId: string } {
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

function renamePoint(model: VisualDiagramModel, oldId: string, newIdRaw: string): VisualDiagramModel {
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

function renameElement(model: VisualDiagramModel, oldId: string, newIdRaw: string): VisualDiagramModel {
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

function renameSlider(model: VisualDiagramModel, oldId: string, newIdRaw: string): VisualDiagramModel {
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

export const DiagramWorkbench: React.FC<DiagramWorkbenchProps> = ({
  isOpen,
  currentFile,
  metadataType,
  initialModel,
  initialSource,
  onClose,
  onConfirm,
}) => {
  const [template, setTemplate] = useState<TemplateKind>('triangulo-deformable');
  const [tab, setTab] = useState<WorkbenchTab>('visual');
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState('pA');
  const [draggingPointId, setDraggingPointId] = useState<string | null>(null);
  const [sourceTouched, setSourceTouched] = useState(false);
  const [previewHighlightId, setPreviewHighlightId] = useState('');
  const [previewStepId, setPreviewStepId] = useState('');
  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [copiedSnippet, setCopiedSnippet] = useState('');
  const [canvasTool, setCanvasTool] = useState<CanvasTool>('select');
  const [pendingRefs, setPendingRefs] = useState<string[]>([]);
  const [constructionKind, setConstructionKind] = useState<ConstructionKind>('mediatriz');
  const [constructionRefs, setConstructionRefs] = useState<Record<ConstructionRefKey, string>>({ a: 'pA', b: 'pB', c: 'pC' });
  const [model, setModel] = useState<VisualDiagramModel>(() => createTemplateModel('triangulo-deformable', 'Diagrama interactivo', metadataType));

  const componentName = useMemo(() => toPascalCase(model.componentId), [model.componentId]);
  const targetPath = `shared/diagrams/${model.category}/${componentName}.tsx`;
  const targets = useMemo(() => buildTargets(model), [model]);
  const generatedSource = useMemo(() => buildSource(model, componentName), [model, componentName]);
  const [sourceDraft, setSourceDraft] = useState(generatedSource);
  const selectedPoint = findPoint(model, selectedId);
  const selectedElement = model.elements.find(item => item.id === selectedId);
  const selectedSlider = model.sliders.find(item => item.id === selectedId);
  const selectedStep = model.steps.find(item => item.id === selectedId);
  const activeTarget = targets.find(item => item.id === selectedTargetId)
    ?? targets.find(item => item.id === previewHighlightId)
    ?? targets.find(item => item.id === selectedId)
    ?? targets[0];
  const selectedTool = DRAWING_TOOLS.find(item => item.value === canvasTool) || DRAWING_TOOLS[0];
  const selectedConstruction = constructionOption(constructionKind);
  const normalizedConstructionRefs = normalizeConstructionRefs(model.points, constructionRefs);
  const constructionReady = validConstructionRefs(constructionKind, normalizedConstructionRefs);
  const pendingHint = canvasTool === 'select' || canvasTool === 'point'
    ? selectedTool.hint
    : `${selectedTool.hint} ${pendingRefs.length}/${refsNeededForTool(canvasTool)} seleccionados.`;
  const visiblePreviewTargets = selectedStep
    ? selectedStep.visibleTargets
    : previewStepId
      ? model.steps.find(item => item.id === previewStepId)?.visibleTargets || []
      : [];

  useEffect(() => {
    if (!isOpen) return;
    const restored = normalizeVisualModel(initialModel, metadataType)
      ?? parseEmbeddedModel(initialSource, metadataType)
      ?? createTemplateModel('triangulo-deformable', 'Diagrama interactivo', metadataType);
    setModel(restored);
    setSelectedId(restored.points[0]?.id || restored.elements[0]?.id || '');
    setCanvasTool('select');
    setPendingRefs([]);
    setSelectedTargetId('');
    setCopiedSnippet('');
    setConstructionRefs(defaultConstructionRefs(restored.points));
    setSourceTouched(Boolean(initialSource && !parseEmbeddedModel(initialSource, metadataType) && initialSource.trim()));
    setSourceDraft(initialSource?.trim() || buildSource(restored, toPascalCase(restored.componentId)));
  }, [initialModel, initialSource, isOpen, metadataType]);

  useEffect(() => {
    if (!sourceTouched) setSourceDraft(generatedSource);
  }, [generatedSource, sourceTouched]);

  if (!isOpen) return null;

  const setTemplateModel = (nextTemplate: TemplateKind) => {
    setTemplate(nextTemplate);
    const nextModel = createTemplateModel(nextTemplate, model.title, metadataType);
    setModel({
      ...nextModel,
      componentId: model.componentId,
      category: model.category,
      mode: model.mode,
    });
    setSelectedId(nextModel.points[0]?.id || '');
    setConstructionRefs(defaultConstructionRefs(nextModel.points));
    setSourceTouched(false);
  };

  const toSvg = (x: number, y: number) => {
    const [minX, maxY, maxX, minY] = model.boundingBox;
    return {
      x: ((x - minX) / (maxX - minX)) * 720,
      y: ((maxY - y) / (maxY - minY)) * 480,
    };
  };

  const fromSvgEvent = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const localX = ((event.clientX - rect.left) / rect.width) * 720;
    const localY = ((event.clientY - rect.top) / rect.height) * 480;
    const [minX, maxY, maxX, minY] = model.boundingBox;
    const rawX = minX + (localX / 720) * (maxX - minX);
    const rawY = maxY - (localY / 480) * (maxY - minY);
    const x = snapToGrid ? Math.round(rawX * 2) / 2 : rawX;
    const y = snapToGrid ? Math.round(rawY * 2) / 2 : rawY;
    return { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) };
  };

  const addPointAt = (coords = { x: 0, y: 0 }) => {
    const id = nextPointId(model.points);
    const label = id.replace(/^p/, '') || `${model.points.length + 1}`;
    setModel(prev => ({
      ...prev,
      points: [...prev.points, point(id, label, coords.x, coords.y)],
    }));
    setSelectedId(id);
    setSourceTouched(false);
  };

  const addPoint = () => addPointAt();

  const addGliderPoint = () => {
    const support = supportElements(model)[0];
    if (!support) return;
    const id = nextPointId(model.points);
    const label = id.replace(/^p/, '') || `${model.points.length + 1}`;
    const initial = visualPointCoords(model, support.refs[0]) || { x: 0, y: 0 };
    const nextPoint = point(id, label, initial.x, initial.y, false, 'ocre', 'glider', support.id);
    const projected = projectPointToSupport(model, nextPoint, initial);
    setModel(prev => ({
      ...prev,
      points: [...prev.points, { ...nextPoint, ...projected }],
    }));
    setSelectedId(id);
    setSourceTouched(false);
  };

  const createElementFromRefs = (kind: ElementKind, refs: string[]) => {
    const id = generatedElementId(kind, refs, model.elements);
    const newElement = element(
      id,
      KIND_LABELS[kind],
      kind,
      refs,
      elementColorForKind(kind),
      true,
      kind === 'text' ? { text: 'Etiqueta' } : kind === 'measurement' ? { text: 'Medición' } : {},
    );
    setModel(prev => ({ ...prev, elements: [...prev.elements, newElement] }));
    setSelectedId(newElement.id);
    setSourceTouched(false);
  };

  const addElement = (kind: ElementKind) => {
    const refs = model.points.map(item => item.id);
    const elementRefs = kind === 'segment' || kind === 'line' || kind === 'ray' || kind === 'circle' || kind === 'midpoint'
      ? refs.slice(0, 2)
      : kind === 'perpendicularFoot' || kind === 'baseExtension' || kind === 'perpendicular' || kind === 'parallel' || kind === 'angleBisector' || kind === 'angle' || kind === 'rightAngle'
        ? refs.slice(0, 3)
        : kind === 'polygon'
          ? refs.slice(0, Math.max(3, Math.min(refs.length, 4)))
        : refs.slice(0, 1);
    createElementFromRefs(kind, elementRefs);
  };

  const createGuidedConstruction = () => {
    if (!constructionReady) return;
    const result = applyGuidedConstruction(model, constructionKind, normalizedConstructionRefs);
    setModel(result.model);
    setSelectedId(result.selectedId);
    setCanvasTool('select');
    setPendingRefs([]);
    setPreviewHighlightId(result.selectedId);
    setSourceTouched(false);
  };

  const choosePointForTool = (pointId: string) => {
    if (canvasTool === 'select' || canvasTool === 'point') return false;
    const needed = refsNeededForTool(canvasTool);
    if (needed === 0) return false;
    const nextRefs = [...pendingRefs, pointId].slice(0, needed);
    if (nextRefs.length === needed) {
      createElementFromRefs(canvasTool, nextRefs);
      setPendingRefs([]);
    } else {
      setPendingRefs(nextRefs);
      setSelectedId(pointId);
    }
    return true;
  };

  const addSlider = () => {
    const id = nextSliderId(model.sliders);
    const newSlider = slider(id, `Control ${model.sliders.length + 1}`, -4, -4 + model.sliders.length * 0.45, 1);
    setModel(prev => ({ ...prev, sliders: [...prev.sliders, newSlider] }));
    setSelectedId(newSlider.id);
    setSourceTouched(false);
  };

  const addStep = () => {
    const id = nextStepId(model.steps);
    const visibleTargets = [
      ...model.points.map(item => item.id),
      ...model.elements.map(item => item.id),
      ...model.sliders.map(item => item.id),
    ];
    const newStep = step(id, `Paso ${model.steps.length + 1}`, 'Describa qué construcción o idea se ve en este paso.', visibleTargets);
    setModel(prev => ({ ...prev, steps: [...prev.steps, newStep] }));
    setSelectedId(newStep.id);
    setPreviewStepId(newStep.id);
    setSourceTouched(false);
  };

  const selectTarget = (target: DiagramTarget) => {
    setSelectedTargetId(target.id);
    setPreviewHighlightId(target.id);
    setSelectedId(target.id);
    if (target.kind === 'step') setPreviewStepId(target.id);
  };

  const copySnippet = async (key: string, value: string) => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedSnippet(key);
      window.setTimeout(() => setCopiedSnippet(''), 1300);
    } catch {
      setCopiedSnippet('');
    }
  };

  const updateElementRef = (elementId: string, index: number, value: string) => {
    setModel(prev => {
      const current = prev.elements.find(item => item.id === elementId);
      if (!current) return prev;
      const refs = [...current.refs];
      refs[index] = value;
      return updateElement(prev, elementId, { refs });
    });
    setSourceTouched(false);
  };

  const addPolygonRef = (elementId: string) => {
    const fallback = model.points[0]?.id;
    if (!fallback) return;
    setModel(prev => updateElement(prev, elementId, {
      refs: [...(prev.elements.find(item => item.id === elementId)?.refs || []), fallback],
    }));
    setSourceTouched(false);
  };

  const removePolygonRef = (elementId: string, index: number) => {
    setModel(prev => {
      const current = prev.elements.find(item => item.id === elementId);
      if (!current || current.refs.length <= 3) return prev;
      return updateElement(prev, elementId, {
        refs: current.refs.filter((_, refIndex) => refIndex !== index),
      });
    });
    setSourceTouched(false);
  };

  const deleteSelected = () => {
    if (selectedPoint) {
      setModel(prev => ({
        ...prev,
        points: prev.points.filter(item => item.id !== selectedPoint.id),
        elements: prev.elements.filter(item => !item.refs.includes(selectedPoint.id)),
        steps: prev.steps.map(item => ({
          ...item,
          visibleTargets: item.visibleTargets.filter(target => target !== selectedPoint.id),
        })),
      }));
      setSelectedId(model.points.find(item => item.id !== selectedPoint.id)?.id || model.elements[0]?.id || model.sliders[0]?.id || '');
    } else if (selectedElement) {
      setModel(prev => ({
        ...prev,
        elements: prev.elements.filter(item => item.id !== selectedElement.id),
        steps: prev.steps.map(item => ({
          ...item,
          visibleTargets: item.visibleTargets.filter(target => target !== selectedElement.id),
        })),
      }));
      setSelectedId(model.points[0]?.id || model.sliders[0]?.id || '');
    } else if (selectedSlider) {
      setModel(prev => ({
        ...prev,
        sliders: prev.sliders.filter(item => item.id !== selectedSlider.id),
        steps: prev.steps.map(item => ({
          ...item,
          visibleTargets: item.visibleTargets.filter(target => target !== selectedSlider.id),
        })),
      }));
      setSelectedId(model.points[0]?.id || model.elements[0]?.id || '');
    } else if (selectedStep) {
      setModel(prev => ({ ...prev, steps: prev.steps.filter(item => item.id !== selectedStep.id) }));
      setSelectedId(model.points[0]?.id || model.elements[0]?.id || model.sliders[0]?.id || '');
      if (previewStepId === selectedStep.id) setPreviewStepId('');
    }
    setSourceTouched(false);
  };

  const handleConfirm = async () => {
    setSaving(true);
    const source = sourceTouched ? sourceDraft : generatedSource;
    const visualModel = parseEmbeddedModel(source, metadataType) ?? model;
    const importPath = relativeImportPath(currentFile, targetPath);
    const spec: DiagramSpec = {
      componentName,
      category: model.category,
      path: targetPath,
      importPath,
      source,
      targets: buildTargets(visualModel),
      mode: visualModel.mode,
      visualModel: visualModel as unknown as Record<string, unknown>,
    };

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: targetPath, content: source }),
      });
      if (!response.ok) throw new Error(await response.text());
      onConfirm(spec);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const stepTargetOptions = [
    ...model.points.map(item => ({ id: item.id, label: `Punto ${item.label}` })),
    ...model.elements.map(item => ({ id: item.id, label: item.label })),
    ...model.sliders.map(item => ({ id: item.id, label: item.label })),
  ];
  const pointRefOptions = [
    ...model.points.map(item => ({ id: item.id, label: `Punto ${item.label}` })),
    ...model.elements
      .filter(item => item.kind === 'midpoint' || item.kind === 'perpendicularFoot')
      .map(item => ({ id: item.id, label: item.label })),
  ];
  const gliderSupportOptions = supportElements(model).map(item => ({ id: item.id, label: `${item.label} · ${KIND_LABELS[item.kind]}` }));

  const isVisibleInPreview = (id: string) => visiblePreviewTargets.length === 0 || visiblePreviewTargets.includes(id);
  const previewEmphasis = (id: string) => {
    if (!previewHighlightId) return 1;
    return previewHighlightId === id ? 1 : 0.22;
  };

  const renderElementPreview = (item: VisualElement) => {
    const selected = selectedId === item.id;
    const highlighted = previewHighlightId === item.id;
    const color = `var(--theme-${selected || highlighted ? 'ocre' : item.color})`;
    if (!isVisibleInPreview(item.id)) return null;
    if (item.kind === 'line' || item.kind === 'ray') {
      const a = visualPointCoords(model, item.refs[0]);
      const b = visualPointCoords(model, item.refs[1]);
      if (!a || !b) return null;
      const pa = toSvg(a.x, a.y);
      const pb = toSvg(b.x, b.y);
      const dx = pb.x - pa.x;
      const dy = pb.y - pa.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      const start = item.kind === 'line'
        ? { x: pa.x - ux * 900, y: pa.y - uy * 900 }
        : pa;
      const end = { x: pa.x + ux * 900, y: pa.y + uy * 900 };
      return (
        <g key={item.id}>
          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke={color}
            opacity={previewEmphasis(item.id)}
            strokeWidth={selected ? 4 : 2.5}
            strokeDasharray={item.dashed ? '8 7' : undefined}
            className="cursor-pointer transition-all"
            onPointerDown={(event) => {
              event.stopPropagation();
              setSelectedId(item.id);
            }}
          />
          {item.kind === 'ray' && (
            <path
              d={`M ${end.x - ux * 16 - uy * 6} ${end.y - uy * 16 + ux * 6} L ${end.x} ${end.y} L ${end.x - ux * 16 + uy * 6} ${end.y - uy * 16 - ux * 6}`}
              fill="none"
              stroke={color}
              strokeWidth={selected ? 4 : 2.5}
              strokeLinecap="round"
            />
          )}
        </g>
      );
    }
    if (item.kind === 'baseExtension') {
      const extension = baseExtensionCoords(model, item);
      if (!extension) return null;
      const start = toSvg(extension.start.x, extension.start.y);
      const end = toSvg(extension.end.x, extension.end.y);
      return (
        <line
          key={item.id}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke={color}
          opacity={previewEmphasis(item.id)}
          strokeWidth={selected ? 4 : 2.5}
          strokeDasharray="8 7"
          className="cursor-pointer transition-all"
          onPointerDown={(event) => {
            event.stopPropagation();
            setSelectedId(item.id);
          }}
        />
      );
    }
    if (item.kind === 'segment') {
      const a = visualPointCoords(model, item.refs[0]);
      const b = visualPointCoords(model, item.refs[1]);
      if (!a || !b) return null;
      const pa = toSvg(a.x, a.y);
      const pb = toSvg(b.x, b.y);
      return (
        <line
          key={item.id}
          x1={pa.x}
          y1={pa.y}
          x2={pb.x}
          y2={pb.y}
          stroke={color}
          opacity={previewEmphasis(item.id)}
          strokeWidth={selected ? 5 : 3}
          strokeDasharray={item.dashed ? '8 7' : undefined}
          className="cursor-pointer transition-all"
          onPointerDown={(event) => {
            event.stopPropagation();
            setSelectedId(item.id);
          }}
        />
      );
    }
    if (item.kind === 'polygon') {
      const points = item.refs.map(ref => visualPointCoords(model, ref)).filter(Boolean) as Array<{ x: number; y: number }>;
      if (points.length < 3) return null;
      const d = points.map(itemPoint => {
        const p = toSvg(itemPoint.x, itemPoint.y);
        return `${p.x},${p.y}`;
      }).join(' ');
      return (
        <polygon
          key={item.id}
          points={d}
          fill={`var(--theme-${item.color})`}
          fillOpacity={(selected || highlighted ? 0.32 : 0.16) * previewEmphasis(item.id)}
          stroke={color}
          opacity={previewEmphasis(item.id)}
          strokeWidth={selected ? 3 : 1.5}
          className="cursor-pointer transition-all"
          onPointerDown={(event) => {
            event.stopPropagation();
            setSelectedId(item.id);
          }}
        />
      );
    }
    if (item.kind === 'circle') {
      const center = visualPointCoords(model, item.refs[0]);
      const edge = visualPointCoords(model, item.refs[1]);
      if (!center || !edge) return null;
      const c = toSvg(center.x, center.y);
      const e = toSvg(edge.x, edge.y);
      const radius = Math.hypot(e.x - c.x, e.y - c.y);
      return (
        <circle
          key={item.id}
          cx={c.x}
          cy={c.y}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={selected ? 5 : 3}
          className="cursor-pointer transition-all"
          onPointerDown={(event) => {
            event.stopPropagation();
            setSelectedId(item.id);
          }}
        />
      );
    }
    if (item.kind === 'midpoint' || item.kind === 'perpendicularFoot') {
      const coords = visualPointCoords(model, item.id);
      if (!coords) return null;
      const p = toSvg(coords.x, coords.y);
      return (
        <g
          key={item.id}
          className="cursor-pointer"
          onPointerDown={(event) => {
            event.stopPropagation();
            setSelectedId(item.id);
          }}
        >
          <circle
            cx={p.x}
            cy={p.y}
            r={selected || highlighted ? 10 : 7}
            fill={color}
            stroke="var(--theme-lienzo)"
            strokeWidth={3}
            opacity={previewEmphasis(item.id)}
            className="transition-all"
          />
          <text x={p.x + 12} y={p.y - 12} fill="var(--theme-carbon)" className="select-none font-serif text-sm font-bold italic">{item.label}</text>
        </g>
      );
    }
    if (item.kind === 'perpendicular' || item.kind === 'parallel') {
      const baseA = visualPointCoords(model, item.refs[0]);
      const baseB = visualPointCoords(model, item.refs[1]);
      const through = visualPointCoords(model, item.refs[2]);
      if (!baseA || !baseB || !through) return null;
      const pa = toSvg(baseA.x, baseA.y);
      const pb = toSvg(baseB.x, baseB.y);
      const pc = toSvg(through.x, through.y);
      const dx = pb.x - pa.x;
      const dy = pb.y - pa.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = item.kind === 'parallel' ? dx / len : -dy / len;
      const uy = item.kind === 'parallel' ? dy / len : dx / len;
      const start = { x: pc.x - ux * 900, y: pc.y - uy * 900 };
      const end = { x: pc.x + ux * 900, y: pc.y + uy * 900 };
      return (
        <line
          key={item.id}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke={color}
          opacity={previewEmphasis(item.id)}
          strokeWidth={selected ? 4 : 2.5}
          strokeDasharray={item.dashed === false ? undefined : '8 7'}
          className="cursor-pointer transition-all"
          onPointerDown={(event) => {
            event.stopPropagation();
            setSelectedId(item.id);
          }}
        />
      );
    }
    if (item.kind === 'angleBisector') {
      const legA = visualPointCoords(model, item.refs[0]);
      const vertex = visualPointCoords(model, item.refs[1]);
      const legB = visualPointCoords(model, item.refs[2]);
      if (!legA || !vertex || !legB) return null;
      const ux = legA.x - vertex.x;
      const uy = legA.y - vertex.y;
      const vx = legB.x - vertex.x;
      const vy = legB.y - vertex.y;
      const uLen = Math.hypot(ux, uy) || 1;
      const vLen = Math.hypot(vx, vy) || 1;
      const sumX = ux / uLen + vx / vLen;
      const sumY = uy / uLen + vy / vLen;
      const sumLen = Math.hypot(sumX, sumY);
      const dir = sumLen < 1e-6
        ? { x: -uy / uLen, y: ux / uLen }
        : { x: sumX / sumLen, y: sumY / sumLen };
      const start = toSvg(vertex.x, vertex.y);
      const end = toSvg(vertex.x + dir.x * 16, vertex.y + dir.y * 16);
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const len = Math.hypot(dx, dy) || 1;
      const sx = dx / len;
      const sy = dy / len;
      return (
        <g key={item.id}>
          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke={color}
            opacity={previewEmphasis(item.id)}
            strokeWidth={selected ? 4 : 2.5}
            strokeDasharray={item.dashed === false ? undefined : '8 7'}
            className="cursor-pointer transition-all"
            onPointerDown={(event) => {
              event.stopPropagation();
              setSelectedId(item.id);
            }}
          />
          <path
            d={`M ${end.x - sx * 16 - sy * 6} ${end.y - sy * 16 + sx * 6} L ${end.x} ${end.y} L ${end.x - sx * 16 + sy * 6} ${end.y - sy * 16 - sx * 6}`}
            fill="none"
            stroke={color}
            strokeWidth={selected ? 4 : 2.5}
            strokeLinecap="round"
            opacity={previewEmphasis(item.id)}
          />
        </g>
      );
    }
    if (item.kind === 'angle') {
      const vertex = visualPointCoords(model, item.refs[1]);
      if (!vertex) return null;
      const p = toSvg(vertex.x, vertex.y);
      return (
        <circle
          key={item.id}
          cx={p.x}
          cy={p.y}
          r={selected ? 34 : 28}
          fill={`var(--theme-${item.color})`}
          fillOpacity={selected ? 0.34 : 0.18}
          stroke={color}
          strokeWidth={selected ? 3 : 1.5}
          className="cursor-pointer transition-all"
          onPointerDown={(event) => {
            event.stopPropagation();
            setSelectedId(item.id);
          }}
        />
      );
    }
    if (item.kind === 'rightAngle') {
      const legA = visualPointCoords(model, item.refs[0]);
      const vertex = visualPointCoords(model, item.refs[1]);
      const legB = visualPointCoords(model, item.refs[2]);
      if (!legA || !vertex || !legB) return null;
      const p = toSvg(vertex.x, vertex.y);
      const a = toSvg(legA.x, legA.y);
      const b = toSvg(legB.x, legB.y);
      const unit = (target: { x: number; y: number }) => {
        const dx = target.x - p.x;
        const dy = target.y - p.y;
        const len = Math.hypot(dx, dy) || 1;
        return { x: dx / len, y: dy / len };
      };
      const ua = unit(a);
      const ub = unit(b);
      const size = selected ? 34 : 28;
      const points = [
        p,
        { x: p.x + ua.x * size, y: p.y + ua.y * size },
        { x: p.x + (ua.x + ub.x) * size, y: p.y + (ua.y + ub.y) * size },
        { x: p.x + ub.x * size, y: p.y + ub.y * size },
      ].map(pointItem => `${pointItem.x},${pointItem.y}`).join(' ');
      return (
        <polygon
          key={item.id}
          points={points}
          fill={`var(--theme-${item.color})`}
          fillOpacity={selected || highlighted ? 0.34 : 0.18}
          stroke={color}
          strokeWidth={selected ? 3 : 1.5}
          className="cursor-pointer transition-all"
          onPointerDown={(event) => {
            event.stopPropagation();
            setSelectedId(item.id);
          }}
        />
      );
    }
    const anchor = visualPointCoords(model, item.refs[0]);
    if (!anchor) return null;
    const p = toSvg(anchor.x, anchor.y);
    return (
      <text
        key={item.id}
        x={p.x + 18}
        y={p.y - 18}
        fill={color}
        opacity={previewEmphasis(item.id)}
        className="cursor-pointer select-none font-serif text-sm font-bold"
        onPointerDown={(event) => {
          event.stopPropagation();
          setSelectedId(item.id);
        }}
      >
        {item.text || item.label}
      </text>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/50 p-3 backdrop-blur-sm">
      <div className="flex max-h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded border border-carbon/15 bg-lienzo shadow-xl">
        <div className="flex items-center justify-between gap-4 border-b border-carbon/15 bg-carbon/5 p-4">
          <div className="min-w-0">
            <h3 className="font-serif text-base font-bold text-carbon">Taller visual de diagramas</h3>
            <p className="mt-1 truncate text-xs italic text-carbon/55">Cree geometría arrastrando puntos; el TSX canónico se mantiene disponible para edición avanzada.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded border border-carbon/15 bg-lienzo p-1">
              {(['visual', 'source'] as WorkbenchTab[]).map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={`rounded px-3 py-1.5 text-[11px] font-bold ${tab === item ? 'bg-carbon text-lienzo' : 'text-carbon/55 hover:bg-carbon/5'}`}
                >
                  {item === 'visual' ? 'Visual' : 'Código TSX'}
                </button>
              ))}
            </div>
            <button type="button" onClick={onClose} className="px-3 py-2 text-xs font-bold text-carbon/45 hover:text-carbon">Cerrar</button>
          </div>
        </div>

        {tab === 'visual' ? (
          <div className="grid min-h-0 flex-1 grid-cols-[280px_minmax(0,1fr)_300px] overflow-hidden">
            <aside className="space-y-4 overflow-y-auto border-r border-carbon/15 bg-carbon/5 p-4">
              <label className="grid gap-1 text-xs font-bold text-carbon">
                Plantilla
                <select className="rounded border border-carbon/15 bg-lienzo p-2" value={template} onChange={(event) => setTemplateModel(event.target.value as TemplateKind)}>
                  {TEMPLATE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <p className="text-xs italic text-carbon/55">{TEMPLATE_OPTIONS.find(option => option.value === template)?.description}</p>

              <div className="grid gap-2">
                <label className="grid gap-1 text-xs font-bold text-carbon">
                  Título visible
                  <input className="rounded border border-carbon/15 bg-lienzo p-2" value={model.title} onChange={(event) => {
                    setModel(prev => ({ ...prev, title: event.target.value }));
                    setSourceTouched(false);
                  }} />
                </label>
                <label className="grid gap-1 text-xs font-bold text-carbon">
                  ID del componente
                  <input className="rounded border border-carbon/15 bg-lienzo p-2 font-mono" value={model.componentId} onChange={(event) => {
                    setModel(prev => ({ ...prev, componentId: normalizeContentId(event.target.value) }));
                    setSourceTouched(false);
                  }} />
                </label>
                <label className="grid gap-1 text-xs font-bold text-carbon">
                  Categoría
                  <input className="rounded border border-carbon/15 bg-lienzo p-2" value={model.category} onChange={(event) => {
                    setModel(prev => ({ ...prev, category: event.target.value.replace(/[^A-Za-z0-9_-]/g, '') || defaultCategory(metadataType) }));
                    setSourceTouched(false);
                  }} />
                </label>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Dibujar en lienzo</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {DRAWING_TOOLS.map(tool => (
                    <button
                      key={tool.value}
                      type="button"
                      onClick={() => {
                        setCanvasTool(tool.value);
                        setPendingRefs([]);
                      }}
                      className={`rounded border px-2 py-2 text-xs font-bold transition-colors ${canvasTool === tool.value ? 'border-salvia/50 bg-salvia/15 text-carbon' : 'border-carbon/15 bg-lienzo text-carbon hover:bg-carbon/5'}`}
                    >
                      {tool.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 rounded border border-carbon/10 bg-lienzo p-2 text-[10px] italic text-carbon/55">{pendingHint}</p>
                {pendingRefs.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setPendingRefs([])}
                    className="mt-2 rounded bg-carbon/5 px-2 py-1 text-[10px] font-bold text-carbon/55 hover:bg-carbon/10"
                  >
                    Cancelar selección de puntos
                  </button>
                )}
              </div>

              <div className="rounded border border-pavo/20 bg-pavo/5 p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Construcciones guiadas</p>
                <label className="mt-2 grid gap-1 text-xs font-bold text-carbon">
                  Construcción
                  <select
                    className="rounded border border-carbon/15 bg-lienzo p-2"
                    value={constructionKind}
                    onChange={(event) => setConstructionKind(event.target.value as ConstructionKind)}
                  >
                    {CONSTRUCTION_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
                <p className="mt-2 text-[10px] italic text-carbon/55">{selectedConstruction.description}</p>
                <div className="mt-2 space-y-2">
                  {selectedConstruction.slots.map((slot, index) => (
                    <label key={slot.key} className="grid gap-1 text-xs font-bold text-carbon">
                      {slot.label}
                      <select
                        className="rounded border border-carbon/15 bg-lienzo p-2"
                        value={normalizedConstructionRefs[slot.key] || model.points[index]?.id || ''}
                        onChange={(event) => setConstructionRefs(prev => ({ ...prev, [slot.key]: event.target.value }))}
                      >
                        <option value="">Seleccionar punto</option>
                        {model.points.map(item => (
                          <option key={item.id} value={item.id}>Punto {item.label} · {item.id}</option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={createGuidedConstruction}
                  disabled={!constructionReady}
                  className="mt-3 w-full rounded bg-pavo px-3 py-2 text-xs font-bold text-lienzo hover:bg-pavo/90 disabled:opacity-40"
                >
                  Crear {selectedConstruction.label.toLowerCase()}
                </button>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Añadir rápido</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button type="button" onClick={addPoint} className="rounded border border-carbon/15 bg-lienzo px-2 py-2 text-xs font-bold text-carbon hover:bg-carbon/5">Punto</button>
                  <button type="button" onClick={() => addElement('segment')} disabled={model.points.length < 2} className="rounded border border-carbon/15 bg-lienzo px-2 py-2 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Segmento</button>
                  <button type="button" onClick={() => addElement('line')} disabled={model.points.length < 2} className="rounded border border-carbon/15 bg-lienzo px-2 py-2 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Recta</button>
                  <button type="button" onClick={() => addElement('ray')} disabled={model.points.length < 2} className="rounded border border-carbon/15 bg-lienzo px-2 py-2 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Semirrecta</button>
                  <button type="button" onClick={() => addElement('polygon')} disabled={model.points.length < 3} className="rounded border border-carbon/15 bg-lienzo px-2 py-2 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Polígono</button>
                  <button type="button" onClick={() => addElement('circle')} disabled={model.points.length < 2} className="rounded border border-carbon/15 bg-lienzo px-2 py-2 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Circunf.</button>
                  <button type="button" onClick={() => addElement('midpoint')} disabled={model.points.length < 2} className="rounded border border-carbon/15 bg-lienzo px-2 py-2 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">P. medio</button>
                  <button type="button" onClick={() => addElement('perpendicularFoot')} disabled={model.points.length < 3} className="rounded border border-carbon/15 bg-lienzo px-2 py-2 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Pie perp.</button>
                  <button type="button" onClick={() => addElement('perpendicular')} disabled={model.points.length < 3} className="rounded border border-carbon/15 bg-lienzo px-2 py-2 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Perp.</button>
                  <button type="button" onClick={() => addElement('parallel')} disabled={model.points.length < 3} className="rounded border border-carbon/15 bg-lienzo px-2 py-2 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Paralela</button>
                  <button type="button" onClick={() => addElement('angleBisector')} disabled={model.points.length < 3} className="rounded border border-carbon/15 bg-lienzo px-2 py-2 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Bisectriz</button>
                  <button type="button" onClick={() => addElement('angle')} disabled={model.points.length < 3} className="rounded border border-carbon/15 bg-lienzo px-2 py-2 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Ángulo</button>
                  <button type="button" onClick={() => addElement('rightAngle')} disabled={model.points.length < 3} className="rounded border border-carbon/15 bg-lienzo px-2 py-2 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Recto</button>
                  <button type="button" onClick={() => addElement('measurement')} disabled={model.points.length < 1} className="rounded border border-carbon/15 bg-lienzo px-2 py-2 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Medición</button>
                  <button type="button" onClick={() => addElement('text')} disabled={model.points.length < 1} className="rounded border border-carbon/15 bg-lienzo px-2 py-2 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Etiqueta</button>
                  <button type="button" onClick={addGliderPoint} disabled={supportElements(model).length < 1} className="rounded border border-carbon/15 bg-lienzo px-2 py-2 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Glider</button>
                  <button type="button" onClick={addSlider} className="rounded border border-carbon/15 bg-lienzo px-2 py-2 text-xs font-bold text-carbon hover:bg-carbon/5">Slider</button>
                  <button type="button" onClick={addStep} className="rounded border border-carbon/15 bg-lienzo px-2 py-2 text-xs font-bold text-carbon hover:bg-carbon/5">Paso</button>
                </div>
              </div>

              <div className="space-y-2 rounded border border-carbon/10 bg-lienzo p-3">
                <label className="flex items-center justify-between gap-3 text-xs font-bold text-carbon">
                  Ajustar a cuadrícula
                  <input type="checkbox" checked={snapToGrid} onChange={(event) => setSnapToGrid(event.target.checked)} />
                </label>
                <label className="flex items-center justify-between gap-3 text-xs font-bold text-carbon">
                  Ejes
                  <input type="checkbox" checked={model.axis} onChange={(event) => {
                    setModel(prev => ({ ...prev, axis: event.target.checked }));
                    setSourceTouched(false);
                  }} />
                </label>
                <label className="flex items-center justify-between gap-3 text-xs font-bold text-carbon">
                  Grid
                  <input type="checkbox" checked={model.grid} onChange={(event) => {
                    setModel(prev => ({ ...prev, grid: event.target.checked }));
                    setSourceTouched(false);
                  }} />
                </label>
              </div>

              <div className="rounded border border-carbon/10 bg-lienzo p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Preview de conexión</p>
                <label className="mt-2 grid gap-1 text-xs font-bold text-carbon">
                  Hover desde texto
                  <select className="rounded border border-carbon/15 bg-lienzo p-2" value={previewHighlightId} onChange={(event) => setPreviewHighlightId(event.target.value)}>
                    <option value="">Sin hover</option>
                    {targets.map(target => <option key={target.id} value={target.id}>{target.label} · {target.id}</option>)}
                  </select>
                </label>
                <label className="mt-2 grid gap-1 text-xs font-bold text-carbon">
                  Paso activo
                  <select className="rounded border border-carbon/15 bg-lienzo p-2" value={previewStepId} onChange={(event) => setPreviewStepId(event.target.value)}>
                    <option value="">Mostrar todo</option>
                    {model.steps.map(item => <option key={item.id} value={item.id}>{item.label} · {item.id}</option>)}
                  </select>
                </label>
              </div>

              <div className="rounded border border-carbon/10 bg-lienzo p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Encuadre</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(['izq', 'arr', 'der', 'abj'] as const).map((label, index) => (
                    <label key={label} className="grid gap-1 text-[10px] font-bold uppercase tracking-widest text-carbon/45">
                      {label}
                      <input
                        type="number"
                        step="0.5"
                        className="rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs text-carbon"
                        value={model.boundingBox[index]}
                        onChange={(event) => {
                          const value = Number(event.target.value);
                          setModel(prev => {
                            const next = [...prev.boundingBox] as [number, number, number, number];
                            next[index] = Number.isFinite(value) ? value : prev.boundingBox[index];
                            return { ...prev, boundingBox: next };
                          });
                          setSourceTouched(false);
                        }}
                      />
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setModel(prev => ({ ...prev, boundingBox: [-5, 5, 5, -5] }));
                    setSourceTouched(false);
                  }}
                  className="mt-2 rounded bg-carbon/5 px-2 py-1 text-[10px] font-bold text-carbon/55 hover:bg-carbon/10"
                >
                  Restablecer vista
                </button>
              </div>
            </aside>

            <main className="min-w-0 overflow-y-auto p-5">
              <div className="mb-3 rounded border border-carbon/10 bg-carbon/5 p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Salida</p>
                <p className="mt-1 truncate font-mono text-xs text-carbon">{targetPath}</p>
                <p className="mt-1 truncate font-mono text-[11px] text-carbon/60">import {'{'} {componentName} {'}'} from '{relativeImportPath(currentFile, targetPath)}';</p>
              </div>

              <div className="overflow-hidden rounded border border-carbon/15 bg-lienzo">
                <div className="flex items-center justify-between border-b border-carbon/10 bg-carbon/5 px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Lienzo visual</p>
                  <p className="text-[10px] text-carbon/45">Arrastre puntos · clic para seleccionar</p>
                </div>
                <svg
                  viewBox="0 0 720 480"
                  className="block aspect-[3/2] w-full touch-none bg-lienzo"
                  role="img"
                  aria-label={`Editor visual del diagrama ${model.title}`}
                  onPointerMove={(event) => {
                    if (!draggingPointId) return;
                    const next = fromSvgEvent(event);
                    setModel(prev => {
                      const current = prev.points.find(item => item.id === draggingPointId);
                      if (!current) return prev;
                      const constrained = current.constraint === 'horizontal'
                        ? { x: next.x, y: current.y }
                        : current.constraint === 'vertical'
                          ? { x: current.x, y: next.y }
                          : current.constraint === 'glider'
                            ? projectPointToSupport(prev, current, next)
                            : next;
                      return updatePoint(prev, draggingPointId, constrained);
                    });
                    setSourceTouched(false);
                  }}
                  onPointerUp={() => setDraggingPointId(null)}
                  onPointerLeave={() => setDraggingPointId(null)}
                  onPointerDown={(event) => {
                    if (canvasTool === 'point') {
                      addPointAt(fromSvgEvent(event));
                      return;
                    }
                    setSelectedId('');
                  }}
                >
                  {model.grid && Array.from({ length: 11 }, (_, index) => index - 5).map(value => {
                    const a = toSvg(value, -5);
                    const b = toSvg(value, 5);
                    const c = toSvg(-5, value);
                    const d = toSvg(5, value);
                    return (
                      <g key={value} opacity={0.22}>
                        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--theme-carbon)" strokeWidth={1} />
                        <line x1={c.x} y1={c.y} x2={d.x} y2={d.y} stroke="var(--theme-carbon)" strokeWidth={1} />
                      </g>
                    );
                  })}
                  {model.axis && (
                    <g opacity={0.45}>
                      <line x1={toSvg(-5, 0).x} y1={toSvg(-5, 0).y} x2={toSvg(5, 0).x} y2={toSvg(5, 0).y} stroke="var(--theme-carbon)" strokeWidth={1.5} />
                      <line x1={toSvg(0, -5).x} y1={toSvg(0, -5).y} x2={toSvg(0, 5).x} y2={toSvg(0, 5).y} stroke="var(--theme-carbon)" strokeWidth={1.5} />
                    </g>
                  )}
                  {model.elements.map(renderElementPreview)}
                  {model.sliders.map(item => {
                    const p = toSvg(item.x, item.y);
                    const selected = selectedId === item.id;
                    const highlighted = previewHighlightId === item.id;
                    if (!isVisibleInPreview(item.id)) return null;
                    return (
                      <g
                        key={item.id}
                        className="cursor-pointer"
                        opacity={previewEmphasis(item.id)}
                        onPointerDown={(event) => {
                          event.stopPropagation();
                          setSelectedId(item.id);
                        }}
                      >
                        <line x1={p.x} y1={p.y} x2={p.x + 150} y2={p.y} stroke={`var(--theme-${item.color})`} strokeWidth={selected || highlighted ? 5 : 3} strokeLinecap="round" />
                        <circle cx={p.x + 150 * ((item.value - item.min) / Math.max(0.01, item.max - item.min))} cy={p.y} r={selected || highlighted ? 9 : 7} fill={`var(--theme-${selected || highlighted ? 'ocre' : item.color})`} stroke="var(--theme-lienzo)" strokeWidth={3} />
                        <text x={p.x} y={p.y - 13} fill="var(--theme-carbon)" className="select-none font-serif text-xs font-bold">{item.label}: {item.value}</text>
                      </g>
                    );
                  })}
                  {model.points.map(item => {
                    if (!isVisibleInPreview(item.id)) return null;
                    const p = toSvg(item.x, item.y);
                    const selected = selectedId === item.id;
                    const highlighted = previewHighlightId === item.id;
                    const pending = pendingRefs.includes(item.id);
                    return (
                      <g key={item.id} className="cursor-grab" onPointerDown={(event) => {
                        event.stopPropagation();
                        if (choosePointForTool(item.id)) return;
                        setSelectedId(item.id);
                        if (!item.fixed) {
                          setDraggingPointId(item.id);
                          event.currentTarget.setPointerCapture(event.pointerId);
                        }
                      }}>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={selected || highlighted || pending ? 10 : 7}
                          fill={`var(--theme-${selected || highlighted || pending ? 'ocre' : item.color})`}
                          stroke="var(--theme-lienzo)"
                          strokeWidth={3}
                          opacity={previewEmphasis(item.id)}
                          className="transition-all"
                        />
                        <text x={p.x + 12} y={p.y - 12} fill="var(--theme-carbon)" className="select-none font-serif text-lg font-bold italic">{item.label}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </main>

            <aside className="min-w-0 overflow-y-auto border-l border-carbon/15 bg-carbon/5 p-4">
              <section className="rounded border border-carbon/10 bg-lienzo p-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Propiedades</h4>
                {!selectedPoint && !selectedElement && !selectedSlider && !selectedStep && <p className="mt-3 text-xs italic text-carbon/55">Seleccione un punto, elemento, slider o paso.</p>}
                {selectedPoint && (
                  <div className="mt-3 space-y-2">
                    <label className="grid gap-1 text-xs font-bold text-carbon">Target<input className="rounded border border-carbon/15 bg-lienzo p-2 font-mono" value={selectedPoint.id} onChange={(event) => {
                      const nextId = cleanTargetId(event.target.value, selectedPoint.id);
                      setModel(prev => renamePoint(prev, selectedPoint.id, nextId));
                      setSelectedId(nextId);
                      setSourceTouched(false);
                    }} /></label>
                    <label className="grid gap-1 text-xs font-bold text-carbon">Etiqueta<input className="rounded border border-carbon/15 bg-lienzo p-2" value={selectedPoint.label} onChange={(event) => {
                      setModel(prev => updatePoint(prev, selectedPoint.id, { label: event.target.value }));
                      setSourceTouched(false);
                    }} /></label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="grid gap-1 text-xs font-bold text-carbon">x<input type="number" step="0.1" className="rounded border border-carbon/15 bg-lienzo p-2" value={selectedPoint.x} onChange={(event) => {
                        setModel(prev => updatePoint(prev, selectedPoint.id, { x: Number(event.target.value) }));
                        setSourceTouched(false);
                      }} /></label>
                      <label className="grid gap-1 text-xs font-bold text-carbon">y<input type="number" step="0.1" className="rounded border border-carbon/15 bg-lienzo p-2" value={selectedPoint.y} onChange={(event) => {
                        setModel(prev => updatePoint(prev, selectedPoint.id, { y: Number(event.target.value) }));
                        setSourceTouched(false);
                      }} /></label>
                    </div>
                    <label className="grid gap-1 text-xs font-bold text-carbon">Color<select className="rounded border border-carbon/15 bg-lienzo p-2" value={selectedPoint.color} onChange={(event) => {
                      setModel(prev => updatePoint(prev, selectedPoint.id, { color: event.target.value as ColorToken }));
                      setSourceTouched(false);
                    }}>{COLOR_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
                    <label className="grid gap-1 text-xs font-bold text-carbon">Restricción<select className="rounded border border-carbon/15 bg-lienzo p-2" value={selectedPoint.constraint || (selectedPoint.fixed ? 'fixed' : 'free')} onChange={(event) => {
                      const constraint = event.target.value as PointConstraint;
                      setModel(prev => {
                        const support = constraint === 'glider'
                          ? selectedPoint.gliderTarget || supportElements(prev)[0]?.id
                          : selectedPoint.gliderTarget;
                        const projected = constraint === 'glider' && support
                          ? projectPointToSupport(prev, { ...selectedPoint, constraint, gliderTarget: support }, { x: selectedPoint.x, y: selectedPoint.y })
                          : { x: selectedPoint.x, y: selectedPoint.y };
                        return updatePoint(prev, selectedPoint.id, {
                          constraint,
                          fixed: constraint === 'fixed',
                          gliderTarget: constraint === 'glider' ? support : undefined,
                          ...projected,
                        });
                      });
                      setSourceTouched(false);
                    }}>
                      <option value="free">Libre</option>
                      <option value="fixed">Fijo</option>
                      <option value="horizontal">Solo horizontal</option>
                      <option value="vertical">Solo vertical</option>
                      <option value="glider">Sobre recta/circunferencia</option>
                    </select></label>
                    {selectedPoint.constraint === 'glider' && (
                      <label className="grid gap-1 text-xs font-bold text-carbon">
                        Soporte del glider
                        <select
                          className="rounded border border-carbon/15 bg-lienzo p-2"
                          value={selectedPoint.gliderTarget || ''}
                          onChange={(event) => {
                            setModel(prev => {
                              const current = prev.points.find(item => item.id === selectedPoint.id);
                              if (!current) return prev;
                              const projected = projectPointToSupport(prev, { ...current, gliderTarget: event.target.value, constraint: 'glider' }, { x: current.x, y: current.y });
                              return updatePoint(prev, selectedPoint.id, { gliderTarget: event.target.value, ...projected });
                            });
                            setSourceTouched(false);
                          }}
                        >
                          <option value="">Seleccionar soporte</option>
                          {gliderSupportOptions.map(option => (
                            <option key={option.id} value={option.id}>{option.label}</option>
                          ))}
                        </select>
                      </label>
                    )}
                    <label className="flex items-center justify-between text-xs font-bold text-carbon">Fijo en producto final<input type="checkbox" checked={selectedPoint.fixed} onChange={(event) => {
                      setModel(prev => updatePoint(prev, selectedPoint.id, { fixed: event.target.checked, constraint: event.target.checked ? 'fixed' : selectedPoint.constraint === 'fixed' ? 'free' : selectedPoint.constraint }));
                      setSourceTouched(false);
                    }} /></label>
                    <label className="flex items-center justify-between text-xs font-bold text-carbon">Enlazable desde texto<input type="checkbox" checked={selectedPoint.target} onChange={(event) => {
                      setModel(prev => updatePoint(prev, selectedPoint.id, { target: event.target.checked }));
                      setSourceTouched(false);
                    }} /></label>
                  </div>
                )}
                {selectedElement && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-bold text-carbon">{KIND_LABELS[selectedElement.kind]}</p>
                    <label className="grid gap-1 text-xs font-bold text-carbon">Target<input className="rounded border border-carbon/15 bg-lienzo p-2 font-mono" value={selectedElement.id} onChange={(event) => {
                      const nextId = cleanTargetId(event.target.value, selectedElement.id);
                      setModel(prev => renameElement(prev, selectedElement.id, nextId));
                      setSelectedId(nextId);
                      setSourceTouched(false);
                    }} /></label>
                    <label className="grid gap-1 text-xs font-bold text-carbon">Nombre<input className="rounded border border-carbon/15 bg-lienzo p-2" value={selectedElement.label} onChange={(event) => {
                      setModel(prev => updateElement(prev, selectedElement.id, { label: event.target.value }));
                      setSourceTouched(false);
                    }} /></label>
                    {(selectedElement.kind === 'text' || selectedElement.kind === 'measurement') && <label className="grid gap-1 text-xs font-bold text-carbon">Texto<input className="rounded border border-carbon/15 bg-lienzo p-2" value={selectedElement.text || ''} onChange={(event) => {
                      setModel(prev => updateElement(prev, selectedElement.id, { text: event.target.value }));
                      setSourceTouched(false);
                    }} /></label>}
                    <label className="grid gap-1 text-xs font-bold text-carbon">Color<select className="rounded border border-carbon/15 bg-lienzo p-2" value={selectedElement.color} onChange={(event) => {
                      setModel(prev => updateElement(prev, selectedElement.id, { color: event.target.value as ColorToken }));
                      setSourceTouched(false);
                    }}>{COLOR_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
                    <div className="rounded border border-carbon/10 bg-carbon/5 p-2">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-carbon/45">Puntos usados</p>
                        {selectedElement.kind === 'polygon' && (
                          <button
                            type="button"
                            onClick={() => addPolygonRef(selectedElement.id)}
                            className="rounded bg-pavo/10 px-2 py-0.5 text-[9px] font-bold text-pavo hover:bg-pavo/20"
                          >
                            Añadir vértice
                          </button>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        {refSlotsFor(selectedElement).map(slot => (
                          <div key={`${selectedElement.id}-${slot.index}`} className="grid grid-cols-[70px_minmax(0,1fr)_auto] items-center gap-1">
                            <span className="text-[10px] font-bold text-carbon/45">{slot.label}</span>
                            <select
                              className="min-w-0 rounded border border-carbon/15 bg-lienzo p-1.5 text-xs text-carbon"
                              value={slot.value}
                              onChange={(event) => updateElementRef(selectedElement.id, slot.index, event.target.value)}
                            >
                              <option value="">Sin punto</option>
                              {pointRefOptions.map(item => (
                                <option key={item.id} value={item.id}>{item.label} · {item.id}</option>
                              ))}
                            </select>
                            {selectedElement.kind === 'polygon' && selectedElement.refs.length > 3 ? (
                              <button
                                type="button"
                                onClick={() => removePolygonRef(selectedElement.id, slot.index)}
                                className="rounded px-1.5 py-1 text-[9px] font-bold text-granada hover:bg-granada/10"
                              >
                                Quitar
                              </button>
                            ) : <span className="w-10" />}
                          </div>
                        ))}
                      </div>
                    </div>
                    <label className="flex items-center justify-between text-xs font-bold text-carbon">Línea discontinua<input type="checkbox" checked={selectedElement.dashed !== false && ['perpendicular', 'parallel', 'angleBisector'].includes(selectedElement.kind) ? true : Boolean(selectedElement.dashed)} disabled={!['segment', 'line', 'ray', 'perpendicular', 'parallel', 'angleBisector'].includes(selectedElement.kind)} onChange={(event) => {
                      setModel(prev => updateElement(prev, selectedElement.id, { dashed: event.target.checked }));
                      setSourceTouched(false);
                    }} /></label>
                    <label className="flex items-center justify-between text-xs font-bold text-carbon">Enlazable desde texto<input type="checkbox" checked={selectedElement.target} onChange={(event) => {
                      setModel(prev => updateElement(prev, selectedElement.id, { target: event.target.checked }));
                      setSourceTouched(false);
                    }} /></label>
                  </div>
                )}
                {selectedSlider && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-bold text-carbon">Slider</p>
                    <label className="grid gap-1 text-xs font-bold text-carbon">Target<input className="rounded border border-carbon/15 bg-lienzo p-2 font-mono" value={selectedSlider.id} onChange={(event) => {
                      const nextId = cleanTargetId(event.target.value, selectedSlider.id);
                      setModel(prev => renameSlider(prev, selectedSlider.id, nextId));
                      setSelectedId(nextId);
                      setSourceTouched(false);
                    }} /></label>
                    <label className="grid gap-1 text-xs font-bold text-carbon">Nombre<input className="rounded border border-carbon/15 bg-lienzo p-2" value={selectedSlider.label} onChange={(event) => {
                      setModel(prev => updateSlider(prev, selectedSlider.id, { label: event.target.value }));
                      setSourceTouched(false);
                    }} /></label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="grid gap-1 text-xs font-bold text-carbon">x<input type="number" step="0.1" className="rounded border border-carbon/15 bg-lienzo p-2" value={selectedSlider.x} onChange={(event) => {
                        setModel(prev => updateSlider(prev, selectedSlider.id, { x: Number(event.target.value) }));
                        setSourceTouched(false);
                      }} /></label>
                      <label className="grid gap-1 text-xs font-bold text-carbon">y<input type="number" step="0.1" className="rounded border border-carbon/15 bg-lienzo p-2" value={selectedSlider.y} onChange={(event) => {
                        setModel(prev => updateSlider(prev, selectedSlider.id, { y: Number(event.target.value) }));
                        setSourceTouched(false);
                      }} /></label>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <label className="grid gap-1 text-xs font-bold text-carbon">Min<input type="number" step="0.1" className="rounded border border-carbon/15 bg-lienzo p-2" value={selectedSlider.min} onChange={(event) => {
                        setModel(prev => updateSlider(prev, selectedSlider.id, { min: Number(event.target.value) }));
                        setSourceTouched(false);
                      }} /></label>
                      <label className="grid gap-1 text-xs font-bold text-carbon">Valor<input type="number" step={selectedSlider.step} className="rounded border border-carbon/15 bg-lienzo p-2" value={selectedSlider.value} onChange={(event) => {
                        setModel(prev => updateSlider(prev, selectedSlider.id, { value: Number(event.target.value) }));
                        setSourceTouched(false);
                      }} /></label>
                      <label className="grid gap-1 text-xs font-bold text-carbon">Max<input type="number" step="0.1" className="rounded border border-carbon/15 bg-lienzo p-2" value={selectedSlider.max} onChange={(event) => {
                        setModel(prev => updateSlider(prev, selectedSlider.id, { max: Number(event.target.value) }));
                        setSourceTouched(false);
                      }} /></label>
                    </div>
                    <label className="grid gap-1 text-xs font-bold text-carbon">Color<select className="rounded border border-carbon/15 bg-lienzo p-2" value={selectedSlider.color} onChange={(event) => {
                      setModel(prev => updateSlider(prev, selectedSlider.id, { color: event.target.value as ColorToken }));
                      setSourceTouched(false);
                    }}>{COLOR_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
                    <label className="flex items-center justify-between text-xs font-bold text-carbon">Enlazable desde texto<input type="checkbox" checked={selectedSlider.target} onChange={(event) => {
                      setModel(prev => updateSlider(prev, selectedSlider.id, { target: event.target.checked }));
                      setSourceTouched(false);
                    }} /></label>
                  </div>
                )}
                {selectedStep && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-bold text-carbon">Paso de demostración</p>
                    <label className="grid gap-1 text-xs font-bold text-carbon">Target del paso<input className="rounded border border-carbon/15 bg-lienzo p-2 font-mono" value={selectedStep.id} onChange={(event) => {
                      const nextId = cleanTargetId(event.target.value, selectedStep.id);
                      setModel(prev => ({
                        ...prev,
                        steps: prev.steps.map(item => item.id === selectedStep.id ? { ...item, id: nextId } : item),
                      }));
                      setSelectedId(nextId);
                      setPreviewStepId(nextId);
                      setSourceTouched(false);
                    }} /></label>
                    <label className="grid gap-1 text-xs font-bold text-carbon">Título<input className="rounded border border-carbon/15 bg-lienzo p-2" value={selectedStep.label} onChange={(event) => {
                      setModel(prev => updateStep(prev, selectedStep.id, { label: event.target.value }));
                      setSourceTouched(false);
                    }} /></label>
                    <label className="grid gap-1 text-xs font-bold text-carbon">Descripción<textarea className="min-h-16 rounded border border-carbon/15 bg-lienzo p-2 text-xs" value={selectedStep.description} onChange={(event) => {
                      setModel(prev => updateStep(prev, selectedStep.id, { description: event.target.value }));
                      setSourceTouched(false);
                    }} /></label>
                    <div className="rounded border border-carbon/10 bg-carbon/5 p-2">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-carbon/45">Visible en este paso</p>
                      <div className="mt-2 max-h-40 space-y-1 overflow-y-auto">
                        {stepTargetOptions.map(option => {
                          const checked = selectedStep.visibleTargets.includes(option.id);
                          return (
                            <label key={option.id} className="flex items-center gap-2 rounded bg-lienzo px-2 py-1 text-xs text-carbon">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(event) => {
                                  setModel(prev => {
                                    const current = prev.steps.find(item => item.id === selectedStep.id);
                                    if (!current) return prev;
                                    const visibleTargets = event.target.checked
                                      ? [...new Set([...current.visibleTargets, option.id])]
                                      : current.visibleTargets.filter(target => target !== option.id);
                                    return updateStep(prev, selectedStep.id, { visibleTargets });
                                  });
                                  setSourceTouched(false);
                                }}
                              />
                              <span className="min-w-0 truncate"><span className="font-mono">{option.id}</span> · {option.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                {(selectedPoint || selectedElement || selectedSlider || selectedStep) && (
                  <button type="button" onClick={deleteSelected} className="mt-3 rounded border border-granada/30 px-3 py-2 text-xs font-bold text-granada hover:bg-granada/10">Eliminar seleccionado</button>
                )}
              </section>

              <section className="mt-4 rounded border border-carbon/10 bg-lienzo p-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Targets enlazables</h4>
                  <span className="rounded bg-carbon/5 px-2 py-0.5 font-mono text-[10px] font-bold text-carbon/45">{targets.length}</span>
                </div>
                <div className="mt-3 max-h-52 space-y-1 overflow-y-auto">
                  {targets.map(target => {
                    const active = activeTarget?.id === target.id;
                    return (
                      <button
                        key={target.id}
                        type="button"
                        onClick={() => selectTarget(target)}
                        onMouseEnter={() => setPreviewHighlightId(target.id)}
                        className={`grid w-full grid-cols-[14px_minmax(0,1fr)] items-start gap-2 rounded border px-2 py-1.5 text-left transition-colors ${active ? 'border-ocre/50 bg-ocre/10' : 'border-carbon/10 bg-carbon/5 hover:border-salvia/30 hover:bg-salvia/5'}`}
                      >
                        <span className="mt-0.5 h-3.5 w-3.5 rounded-full border border-carbon/10" style={{ backgroundColor: `var(--theme-${safeColorToken(target.color)})` }} />
                        <span className="min-w-0">
                          <span className="block truncate text-[11px] font-bold text-carbon">{target.label}</span>
                          <span className="block truncate font-mono text-[10px] text-carbon/45">{target.id} · {target.kind}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                {activeTarget && (
                  <div className="mt-3 rounded border border-salvia/25 bg-salvia/5 p-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-carbon">{activeTarget.label}</p>
                        <p className="truncate font-mono text-[10px] text-carbon/45">{activeTarget.id}</p>
                      </div>
                      <span className="rounded bg-carbon/5 px-2 py-0.5 text-[10px] font-bold text-carbon/55">{activeTarget.kind}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewHighlightId(activeTarget.id)}
                      className="mt-2 w-full rounded bg-ocre/15 px-2 py-1.5 text-[10px] font-bold text-carbon hover:bg-ocre/25"
                    >
                      Resaltar en el lienzo
                    </button>
                    <div className="mt-3 space-y-2">
                      <div className="rounded border border-carbon/10 bg-lienzo p-2">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-carbon/45">Texto interactivo</p>
                          <button
                            type="button"
                            onClick={() => void copySnippet(`interactive:${activeTarget.id}`, interactiveElementSnippet(activeTarget))}
                            className="rounded bg-carbon/5 px-2 py-0.5 text-[9px] font-bold text-carbon/55 hover:bg-carbon/10"
                          >
                            {copiedSnippet === `interactive:${activeTarget.id}` ? 'Copiado' : 'Copiar'}
                          </button>
                        </div>
                        <code className="block whitespace-pre-wrap break-all font-mono text-[9px] leading-relaxed text-carbon/60">{interactiveElementSnippet(activeTarget)}</code>
                      </div>
                      <div className="rounded border border-carbon/10 bg-lienzo p-2">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-carbon/45">Concepto + diagrama</p>
                          <button
                            type="button"
                            onClick={() => void copySnippet(`concept:${activeTarget.id}`, conceptHighlightSnippet(activeTarget))}
                            className="rounded bg-carbon/5 px-2 py-0.5 text-[9px] font-bold text-carbon/55 hover:bg-carbon/10"
                          >
                            {copiedSnippet === `concept:${activeTarget.id}` ? 'Copiado' : 'Copiar'}
                          </button>
                        </div>
                        <code className="block whitespace-pre-wrap break-all font-mono text-[9px] leading-relaxed text-carbon/60">{conceptHighlightSnippet(activeTarget)}</code>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              <section className="mt-4 rounded border border-carbon/10 bg-lienzo p-3">
                <label className="grid gap-1 text-xs font-bold text-carbon">
                  Nota del panel
                  <textarea className="min-h-20 rounded border border-carbon/15 bg-lienzo p-2 text-xs" value={model.note} onChange={(event) => {
                    setModel(prev => ({ ...prev, note: event.target.value }));
                    setSourceTouched(false);
                  }} />
                </label>
              </section>
            </aside>
          </div>
        ) : (
          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_320px] overflow-hidden">
            <div className="min-w-0 p-4">
              <textarea
                className="h-full min-h-[62vh] w-full resize-none rounded border border-carbon/15 bg-carbon/[0.03] p-4 font-mono text-xs leading-relaxed text-carbon outline-none focus:border-salvia"
                value={sourceDraft}
                onChange={(event) => {
                  setSourceDraft(event.target.value);
                  setSourceTouched(true);
                }}
                spellCheck={false}
              />
            </div>
            <aside className="space-y-4 overflow-y-auto border-l border-carbon/15 bg-carbon/5 p-4">
              <div className="rounded border border-carbon/10 bg-lienzo p-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Modo avanzado</h4>
                <p className="mt-2 text-xs italic text-carbon/60">Los cambios aquí se guardan como fuente TSX. El modelo visual no interpreta ediciones manuales complejas.</p>
                {sourceTouched && <p className="mt-2 rounded border border-ocre/30 bg-ocre/10 p-2 text-xs text-carbon">La fuente fue editada manualmente.</p>}
                <button
                  type="button"
                  onClick={() => {
                    setSourceDraft(generatedSource);
                    setSourceTouched(false);
                  }}
                  className="mt-3 rounded bg-pavo/10 px-3 py-2 text-xs font-bold text-pavo hover:bg-pavo/20"
                >
                  Regenerar desde visual
                </button>
              </div>
              <div className="rounded border border-carbon/10 bg-lienzo p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Garantías visuales</p>
                <ul className="mt-2 space-y-1 text-xs text-carbon/70">
                  <li>Usa MathBoard y MathFactory.</li>
                  <li>Usa tokens Arts & Crafts, sin hex arbitrarios.</li>
                  <li>Expone targets para InteractiveElement.</li>
                  <li>Permite TSX manual para casos especiales.</li>
                </ul>
              </div>
            </aside>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-carbon/15 bg-carbon/5 p-4">
          <p className="truncate text-xs text-carbon/55">{targets.length} targets enlazables · {sourceTouched ? 'fuente avanzada activa' : 'fuente sincronizada con el lienzo'}</p>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-carbon/60 hover:text-carbon">Cancelar</button>
            <button
              type="button"
              disabled={saving || !componentName || model.points.length === 0}
              onClick={handleConfirm}
              className="rounded bg-salvia px-5 py-2 text-xs font-bold text-lienzo shadow-sm transition-colors hover:bg-salvia/80 disabled:opacity-40"
            >
              {saving ? 'Creando...' : 'Crear y enlazar diagrama'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
