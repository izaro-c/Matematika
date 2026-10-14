import type {
  ControlObject,
  DiagramColorToken,
  DiagramConstructionKind,
  DiagramObject,
  DiagramRelation,
  DiagramSpecV3,
  DiagramStep,
  PositionedPoint,
} from '@/diagrams';

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

export type ColorToken = DiagramColorToken;
/** Herramienta de construcción: clase de objeto que se crea a partir de referencias. */
export type ElementKind = DiagramConstructionKind;

export type CanvasTool = 'select' | 'point' | ElementKind;

/**
 * Modo de movilidad que el editor ofrece para un punto con posición propia.
 * Se traduce a `definition` + `mobility` de V3 (ver `pointMode`/`withPointMode`).
 */
export type PointConstraint = 'free' | 'fixed' | 'horizontal' | 'vertical' | 'glider' | 'derived' | 'constrained';

export type ConstructionRefKey = 'a' | 'b' | 'c';

export interface ConstructionSlot {
  key: ConstructionRefKey;
  label: string;
}

/** Punto con posición propia (coordenadas o expresión). */
export type VisualPoint = PositionedPoint;
/** Cualquier objeto que no es punto con posición propia ni control. */
export type VisualElement = Exclude<DiagramObject, ControlObject>;
export type VisualSlider = ControlObject;
export type VisualStep = DiagramStep;
export type VisualConstraint = DiagramRelation;

/** Modelo del workbench: la especificación V3 canónica, sin proyecciones intermedias. */
export type VisualDiagramModel = DiagramSpecV3;
