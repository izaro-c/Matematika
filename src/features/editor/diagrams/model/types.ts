export type TemplateKind =
  | 'lienzo-inicial'
  | 'triangulo-deformable'
  | 'cuadrilatero-clasificable'
  | 'circunferencia'
  | 'eje-cartesiano'
  | 'lugar-geometrico'
  | 'demostracion-pasos'
  | 'modelo-estatico';

export type ConstructionKind = 'mediatriz' | 'mediana' | 'altura' | 'bisectriz';
export type WorkbenchTab = 'visual' | 'source';
import type {
  DiagramColorToken,
  DiagramElement,
  DiagramElementKind,
  DiagramPoint,
  DiagramPointConstraint,
  DiagramSlider,
  DiagramSpecV2,
  DiagramStep,
  DiagramConstraint,
  DiagramDependency,
} from '../../../../shared/diagrams/spec';

export type ColorToken = DiagramColorToken;
export type ElementKind = DiagramElementKind;

export type CanvasTool = 'select' | 'point' | ElementKind;
export type PointConstraint = DiagramPointConstraint;

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

export type VisualPoint = DiagramPoint;
export type VisualElement = DiagramElement;
export type VisualSlider = DiagramSlider;
export type VisualStep = DiagramStep;
export type VisualConstraint = DiagramConstraint;
export type VisualDependency = DiagramDependency;
export type VisualDiagramModel = DiagramSpecV2;
