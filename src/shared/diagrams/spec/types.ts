export const DIAGRAM_SPEC_VERSION = 2 as const;
export const DIAGRAM_RENDERER_ID = 'matematika-diagram-renderer-v2' as const;

export type DiagramBounds = [number, number, number, number];

export type DiagramColorToken =
  | 'carbon'
  | 'terracota'
  | 'salvia'
  | 'pizarra'
  | 'ocre'
  | 'pavo'
  | 'granada'
  | 'musgo';

export type DiagramElementKind =
  | 'segment'
  | 'line'
  | 'ray'
  | 'polygon'
  | 'circle'
  | 'arc'
  | 'functionCurve'
  | 'parametricCurve'
  | 'poincareGeodesic'
  | 'poincareArc'
  | 'midpoint'
  | 'perpendicularFoot'
  | 'baseExtension'
  | 'perpendicular'
  | 'parallel'
  | 'angleBisector'
  | 'angle'
  | 'rightAngle'
  | 'congruenceMark'
  | 'perpendicularMark'
  | 'dimensionLine'
  | 'measurement'
  | 'grid'
  | 'areaDecomposition'
  | 'text'
  | 'label'
  | 'formula'
  | 'infoPanel';

export type DiagramPointConstraint = 'free' | 'fixed' | 'horizontal' | 'vertical' | 'glider' | 'derived' | 'constrained';
export type DiagramMode = 'simulation' | 'diagram' | 'inline';

export interface DiagramElementProperties {
  expression?: string;
  xExpression?: string;
  yExpression?: string;
  parameter?: string;
  domain?: [number, number];
  samples?: number;
  unit?: string;
  precision?: number;
  offset?: number;
  markCount?: number;
  rows?: number;
  columns?: number;
  title?: string;
  clockwise?: boolean;
}

export type DiagramConstraintKind =
  | 'fixed'
  | 'horizontal'
  | 'vertical'
  | 'coincident'
  | 'on'
  | 'distance'
  | 'perpendicular'
  | 'parallel'
  | 'insideDisk'
  | 'expression';

export interface DiagramConstraint {
  id: string;
  label: string;
  kind: DiagramConstraintKind;
  refs: string[];
  expression?: string;
  value?: number;
  enabled: boolean;
}

export interface DiagramDependency {
  sourceId: string;
  targetId: string;
  relation: 'construction' | 'expression' | 'constraint';
  constraintId?: string;
}

export interface DiagramSelectionMetadata {
  selectable: boolean;
  ariaLabel?: string;
  role?: 'primary' | 'secondary' | 'construction' | 'annotation';
}

export interface DiagramSceneItemBase {
  id: string;
  label: string;
  color: DiagramColorToken;
  layerId: string;
  order: number;
  visible: boolean;
  locked: boolean;
  groupIds: string[];
  selection: DiagramSelectionMetadata;
  /** Indica si el objeto se publica como target de InteractiveElement/MathStore. */
  target: boolean;
  extensions?: Record<string, unknown>;
}

export interface DiagramPoint extends DiagramSceneItemBase {
  x: number;
  y: number;
  fixed: boolean;
  constraint: DiagramPointConstraint;
  gliderTarget?: string;
  dependencies?: string[];
  xExpression?: string;
  yExpression?: string;
  constraintIds?: string[];
}

export interface DiagramElement extends DiagramSceneItemBase {
  kind: DiagramElementKind;
  refs: string[];
  dashed?: boolean;
  text?: string;
  properties?: DiagramElementProperties;
}

export interface DiagramSlider extends DiagramSceneItemBase {
  x: number;
  y: number;
  min: number;
  max: number;
  value: number;
  step: number;
}

export interface DiagramStep {
  id: string;
  label: string;
  description: string;
  visibleTargets: string[];
  extensions?: Record<string, unknown>;
}

export interface DiagramLayer {
  id: string;
  label: string;
  order: number;
  visible: boolean;
  locked: boolean;
  extensions?: Record<string, unknown>;
}

export interface DiagramGroup {
  id: string;
  label: string;
  memberIds: string[];
  visible: boolean;
  locked: boolean;
  selection: DiagramSelectionMetadata;
  extensions?: Record<string, unknown>;
}

export interface DiagramViewport {
  bounds: DiagramBounds;
  home: DiagramBounds;
  minZoom: number;
  maxZoom: number;
  padding: number;
}

export interface DiagramSpecV2 {
  version: typeof DIAGRAM_SPEC_VERSION;
  renderer: typeof DIAGRAM_RENDERER_ID;
  title: string;
  componentId: string;
  category: string;
  mode: DiagramMode;
  axis: boolean;
  grid: boolean;
  viewport: DiagramViewport;
  layers: DiagramLayer[];
  groups: DiagramGroup[];
  points: DiagramPoint[];
  elements: DiagramElement[];
  sliders: DiagramSlider[];
  steps: DiagramStep[];
  constraints?: DiagramConstraint[];
  dependencies?: DiagramDependency[];
  note: string;
  extensions: Record<string, unknown>;
}

export type DiagramSceneItem = DiagramPoint | DiagramElement | DiagramSlider;

export interface DiagramSceneState {
  activeStepId?: string;
  highlightedIds?: readonly string[];
  selectedIds?: readonly string[];
}
