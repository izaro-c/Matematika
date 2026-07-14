import type { ColorToken, ConstructionKind, ConstructionSlot, ElementKind, TemplateKind, VisualDiagramModel } from './types';

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
  { value: 'mediatriz', label: 'Mediatriz', description: 'Crea el punto medio y la perpendicular al segmento base.', slots: [{ key: 'a', label: 'Extremo A' }, { key: 'b', label: 'Extremo B' }] },
  { value: 'mediana', label: 'Mediana', description: 'Crea el punto medio de la base y el segmento desde el vértice.', slots: [{ key: 'a', label: 'Base A' }, { key: 'b', label: 'Base B' }, { key: 'c', label: 'Vértice' }] },
  { value: 'altura', label: 'Altura', description: 'Crea la recta perpendicular a la base que pasa por el vértice.', slots: [{ key: 'a', label: 'Base A' }, { key: 'b', label: 'Base B' }, { key: 'c', label: 'Vértice' }] },
  { value: 'bisectriz', label: 'Bisectriz', description: 'Crea el ángulo visual y su bisectriz como semirrecta.', slots: [{ key: 'a', label: 'Lado 1' }, { key: 'b', label: 'Vértice' }, { key: 'c', label: 'Lado 2' }] },
];

export const COLOR_OPTIONS: Array<{ value: ColorToken; label: string }> = [
  { value: 'carbon', label: 'Carbon' }, { value: 'terracota', label: 'Terracota' },
  { value: 'salvia', label: 'Salvia' }, { value: 'pizarra', label: 'Pizarra' },
  { value: 'ocre', label: 'Ocre' }, { value: 'pavo', label: 'Pavo' },
  { value: 'granada', label: 'Granada' }, { value: 'musgo', label: 'Musgo' },
];

export const KIND_LABELS: Record<ElementKind, string> = {
  segment: 'Segmento', line: 'Recta', ray: 'Semirrecta', polygon: 'Polígono', circle: 'Circunferencia', arc: 'Arco de circunferencia',
  functionCurve: 'Gráfica de función', parametricCurve: 'Curva paramétrica', poincareGeodesic: 'Geodésica de Poincaré', poincareArc: 'Arco de Poincaré',
  midpoint: 'Punto medio', perpendicularFoot: 'Pie perpendicular', baseExtension: 'Extensión de base', perpendicular: 'Perpendicular', parallel: 'Paralela',
  angleBisector: 'Bisectriz', angle: 'Ángulo', rightAngle: 'Ángulo recto', congruenceMark: 'Marca de congruencia', perpendicularMark: 'Marca de perpendicularidad',
  dimensionLine: 'Línea de cota', measurement: 'Medición', grid: 'Cuadrícula geométrica', areaDecomposition: 'Descomposición de área',
  text: 'Etiqueta', label: 'Etiqueta matemática', formula: 'Fórmula', infoPanel: 'Panel informativo',
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
