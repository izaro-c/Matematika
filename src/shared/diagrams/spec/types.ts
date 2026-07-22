/** @deprecated Solo para leer fuentes históricas. */
export const DIAGRAM_SPEC_V2_VERSION = 2 as const;
/** @deprecated Solo para leer fuentes históricas. */
export const DIAGRAM_RENDERER_V2_ID = 'matematika-diagram-renderer-v2' as const;
export const DIAGRAM_SPEC_VERSION = 3 as const;
export const DIAGRAM_RENDERER_ID = 'matematika-diagram-renderer-v3' as const;
export const DEFAULT_ANGLE_RADIUS = 0.55;
export const DEFAULT_RIGHT_ANGLE_RADIUS = 0.45;

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
  | 'intersection'
  | 'midpoint'
  | 'perpendicularFoot'
  | 'baseExtension'
  | 'perpendicular'
  | 'parallel'
  | 'angleBisector'
  | 'angle'
  | 'nonReflexAngle'
  | 'rightAngle'
  | 'congruenceMark'
  | 'parallelMark'
  | 'measureTicks'
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

export interface DiagramTextRule {
  when: string;
  text: string;
}

export interface DiagramInfoPanelRule extends DiagramTextRule {
  /** Cálculo alternativo usado cuando esta variante es la primera que se cumple. */
  expression?: string;
  unit?: string;
  precision?: number;
  color?: DiagramColorToken;
}

export interface DiagramInfoPanelBlock {
  /** Identificador estable y local al panel; permite reordenar sin perder la edición. */
  id: string;
  title?: string;
  text: string;
  expression?: string;
  unit?: string;
  precision?: number;
  color?: DiagramColorToken;
  /** Se evalúan en orden y la primera condición verdadera sustituye el contenido base. */
  rules?: DiagramInfoPanelRule[];
}

export type DiagramHeaderReadingsMode = 'automatic' | 'custom' | 'hidden';
export type DiagramHeaderReadingPresentation = 'label-value' | 'equality' | 'value';

/** Una lectura declarativa situada bajo el título del diagrama. */
export interface DiagramHeaderReading {
  id: string;
  /** Anotaciones de medida, cotas o paneles con expresión que aportan el valor. */
  sourceIds: string[];
  /** Controla si se muestra nombre y valor, solo valor o una igualdad explícita. */
  presentation: DiagramHeaderReadingPresentation;
  /** Sustituye el texto situado antes del valor; vacío usa los nombres de las fuentes. */
  label?: string;
}

export interface DiagramHeaderConfiguration {
  readingsMode: DiagramHeaderReadingsMode;
  readings: DiagramHeaderReading[];
}

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
  /** Distancia entre graduaciones repetidas a lo largo de un segmento. */
  tickDistance?: number;
  /** Distancia reactiva entre graduaciones, calculada a partir de la escena. */
  tickDistanceExpression?: string;
  /** Subdivisiones menores entre dos graduaciones principales. */
  minorTickCount?: number;
  rows?: number;
  columns?: number;
  title?: string;
  /** Define si una anotación sigue un objeto geométrico o una posición estable del viewport. */
  anchorMode?: 'reference' | 'viewport';
  /** Posición normalizada [x, y] desde la esquina superior izquierda del viewport. */
  viewportPosition?: [number, number];
  /** Posición normalizada [0, 1] de una etiqueta a lo largo del objeto referenciado. */
  anchorParameter?: number;
  clockwise?: boolean;
  /** Oculta la intersección cuando cae fuera de un segmento o semirrecta referenciado. */
  restrictToSupports?: boolean;
  visibleWhen?: string;
  textRules?: DiagramTextRule[];
  /** Bloques reactivos independientes dentro de un único panel informativo. */
  infoPanelBlocks?: DiagramInfoPanelBlock[];
  /** Una columna prioriza lectura secuencial; dos columnas compactan paneles anchos. */
  infoPanelLayout?: 'stack' | 'columns';
}

export type DiagramConstraintKind =
  | 'fixed'
  | 'horizontal'
  | 'vertical'
  | 'coincident'
  | 'on'
  | 'distance'
  | 'equalLength'
  | 'equalAngle'
  | 'midpoint'
  | 'perpendicular'
  | 'parallel'
  | 'insideDisk'
  | 'sameSide'
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
  /**
   * Permite el énfasis visual iniciado dentro del lienzo por hover o foco.
   * Las referencias MDX y la selección explícita pueden resaltar el objeto
   * aunque esta interacción local esté desactivada.
   */
  highlightable?: boolean;
  /** Las referencias externas atenúan el resto de la escena; el hover local nunca lo hace. */
  dimOthersOnHighlight?: boolean;
  ariaLabel?: string;
  role?: 'primary' | 'secondary' | 'construction' | 'annotation';
}

export interface DiagramVisualStyle {
  strokeWidth?: number;
  strokeOpacity?: number;
  fillOpacity?: number;
  pointSize?: number;
  angleRadius?: number;
  /** Altura visual de rayas de congruencia o graduaciones de medida. */
  markHeight?: number;
  labelOffset?: [number, number];
  labelPosition?: number | string;
  textOffset?: [number, number];
  /** Tamaño tipográfico en píxeles para etiquetas nativas o vinculadas. */
  labelSize?: number;
  highlightStrokeWidth?: number;
  highlightFillOpacity?: number;
  highlightPointSize?: number;
  /** Permite revelar una construcción oculta cuando su target recibe énfasis. */
  highlightVisible?: boolean;
  /** Conserva el color semántico del objeto cuando recibe énfasis desde MDX. */
  preserveColorOnHighlight?: boolean;
}

export interface DiagramSceneItemBase {
  id: string;
  label: string;
  color: DiagramColorToken;
  layerId: string;
  order: number;
  visible: boolean;
  /** Condición declarativa de visibilidad compartida por todas las familias. */
  visibleWhen?: string;
  locked: boolean;
  groupIds: string[];
  selection: DiagramSelectionMetadata;
  /** Indica si el objeto se publica como target de InteractiveElement/MathStore. */
  target: boolean;
  /** ID público estable. Permite renombrar el objeto interno sin romper MDX. */
  targetId?: string;
  style?: DiagramVisualStyle;
  extensions?: Record<string, unknown>;
}

export interface DiagramPoint extends DiagramSceneItemBase {
  x: number;
  y: number;
  /** Conserva el nombre semántico del punto, pero permite ocultar su etiqueta nativa. */
  showLabel?: boolean;
  fixed: boolean;
  constraint: DiagramPointConstraint;
  gliderTarget?: string;
  dependencies?: string[];
  xExpression?: string;
  yExpression?: string;
  constraintIds?: string[];
  /** Activa el ajuste a la cuadrícula al arrastrar un punto móvil, incluidas las combinaciones de restricciones. */
  snapToGrid?: boolean;
  /** Tamaño de celda de la cuadrícula de ajuste, en unidades del sistema de coordenadas. Por defecto 0.5. */
  snapSize?: number;
  /** Objetos geométricos ordenados que atraen temporalmente al punto durante su arrastre. */
  attractorIds?: string[];
  /** Distancia, en unidades del tablero, a partir de la que comienza la atracción. */
  attractorDistance?: number;
  /** Distancia necesaria para separarse del atractor durante el mismo arrastre. */
  snatchDistance?: number;
}

export interface DiagramElement extends DiagramSceneItemBase {
  kind: DiagramElementKind;
  refs: string[];
  dashed?: boolean;
  text?: string;
  properties?: DiagramElementProperties;
  /** Permite ocultar la etiqueta nativa sin eliminar el nombre semántico del elemento. */
  showLabel?: boolean;
}

export interface DiagramSlider extends DiagramSceneItemBase {
  x: number;
  y: number;
  min: number;
  max: number;
  /** Límite superior reactivo; `max` se conserva como fallback editable. */
  maxExpression?: string;
  value: number;
  step: number;
}

export type DiagramStepEmphasis = 'none' | 'secondary' | 'primary';

export type DiagramOverlayPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface DiagramStepOverlay {
  visible: boolean;
  title: string;
  content: string;
  expression?: string;
  unit?: string;
  precision?: number;
  position?: DiagramOverlayPosition;
}

export interface DiagramStepObjectState {
  visible?: boolean;
  emphasis?: DiagramStepEmphasis;
  /** Conserva el color del objeto si se omite; permite un acento explícito por paso. */
  emphasisColor?: DiagramColorToken;
  label?: string;
  overlay?: DiagramStepOverlay;
  interactive?: boolean;
  /** Valor temporal de sliders; no modifica el valor persistente base. */
  value?: number;
}

export interface DiagramStep {
  id: string;
  label: string;
  description: string;
  visibleTargets: string[];
  durationMs?: number;
  objectStates?: Record<string, DiagramStepObjectState>;
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
  /** Un target de grupo resalta todos sus miembros con un único ID público. */
  target?: boolean;
  targetId?: string;
  color?: DiagramColorToken;
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
  version: typeof DIAGRAM_SPEC_V2_VERSION;
  renderer: typeof DIAGRAM_RENDERER_V2_ID;
  title: string;
  componentId: string;
  category: string;
  mode: DiagramMode;
  axis: boolean;
  grid: boolean;
  /** Permite ocultar en conjunto las etiquetas sin eliminar sus objetos editables. */
  showLabels?: boolean;
  /** Configuración explícita de las lecturas situadas bajo el título. */
  header?: DiagramHeaderConfiguration;
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
