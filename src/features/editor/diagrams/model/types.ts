export type TemplateKind =
  | 'triangulo-deformable'
  | 'cuadrilatero-clasificable'
  | 'circunferencia'
  | 'eje-cartesiano'
  | 'lugar-geometrico'
  | 'demostracion-pasos'
  | 'modelo-estatico';

export type ConstructionKind = 'mediatriz' | 'mediana' | 'altura' | 'bisectriz';
export type WorkbenchTab = 'visual' | 'source';
export type ColorToken = 'carbon' | 'terracota' | 'salvia' | 'pizarra' | 'ocre' | 'pavo' | 'granada' | 'musgo';

export type ElementKind =
  | 'segment'
  | 'line'
  | 'ray'
  | 'polygon'
  | 'circle'
  | 'midpoint'
  | 'perpendicularFoot'
  | 'baseExtension'
  | 'perpendicular'
  | 'parallel'
  | 'angleBisector'
  | 'angle'
  | 'rightAngle'
  | 'measurement'
  | 'text';

export type CanvasTool = 'select' | 'point' | ElementKind;
export type PointConstraint = 'free' | 'fixed' | 'horizontal' | 'vertical' | 'glider';

export interface RefSlot {
  label: string;
  value: string;
  index: number;
}

export type ConstructionRefKey = 'a' | 'b' | 'c';

export interface ConstructionSlot {
  key: ConstructionRefKey;
  label: string;
}

export interface VisualPoint {
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

export interface VisualElement {
  id: string;
  label: string;
  kind: ElementKind;
  refs: string[];
  color: ColorToken;
  target: boolean;
  dashed?: boolean;
  text?: string;
}

export interface VisualSlider {
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

export interface VisualStep {
  id: string;
  label: string;
  description: string;
  visibleTargets: string[];
}

export interface VisualDiagramModel {
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
