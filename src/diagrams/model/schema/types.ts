import type { DiagramPaletteColorId } from '@/design';

export const DEFAULT_ANGLE_RADIUS = 0.55;
export const DEFAULT_RIGHT_ANGLE_RADIUS = 0.45;

/** Límites de zoom y margen por defecto del viewport. */
export const DEFAULT_VIEWPORT_MIN_ZOOM = 0.2;
export const DEFAULT_VIEWPORT_MAX_ZOOM = 12;
export const DEFAULT_VIEWPORT_PADDING = 0.16;

export const DEFAULT_LAYER_ID = 'geometry';
export const DEFAULT_CURVE_SAMPLES = 64;

export const DIAGRAM_SPEC_VERSION = 3 as const;
export const DIAGRAM_RENDERER_ID = 'matematika-diagram-renderer-v3' as const;

export type DiagramBounds = [number, number, number, number];

/** Alineado con pigmentos de `shared/design` (sin lienzo). */
export type DiagramColorToken = DiagramPaletteColorId;

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

/** Pertinencia a un área: interior cerrado o frontera topológica. */
export type AreaMembership = 'interior' | 'boundary';

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

export type DiagramControlVariant = 'slider' | 'button';

export type DiagramControlEasing = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

/**
 * Animación temporal de un control botón. Al pulsarlo, su valor viaja hacia `to`
 * durante `durationMs`; las expresiones que leen el control se recalculan en cada fotograma.
 * - `toggle`: una segunda pulsación devuelve el valor a `min` con la misma animación.
 * - `restart`: cada pulsación reinicia el valor en `min` y vuelve a animar hasta `to`.
 */
export interface DiagramControlAction {
  to: number;
  durationMs: number;
  /** Duración del viaje de vuelta a `min` (desactivar un `toggle`); por defecto `durationMs`. */
  returnDurationMs?: number;
  easing: DiagramControlEasing;
  behavior: 'toggle' | 'restart';
  /** Efectos sobre otros controles encadenados a las pulsaciones de este botón. */
  effects?: DiagramControlEffect[];
}

/**
 * Efecto de un botón sobre otro control.
 * - `on`: `press` (pulsación que lleva el valor hacia `to`), `release` (pulsación que lo
 *   devuelve a `min` en un botón `toggle`) o `complete` (la animación alcanza `to`).
 * - `do`: `reset` devuelve el control a su valor inicial; `play` lo anima desde `from`
 *   (expresión, por defecto su mínimo) hasta su propio destino.
 * - `when`: condición opcional evaluada con los valores vivos del diagrama.
 */
export interface DiagramControlEffect {
  on: 'press' | 'release' | 'complete';
  control: string;
  do: 'reset' | 'play';
  from?: string;
  when?: string;
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

/** Estilo visual que puede sobrescribirse temporalmente en un paso concreto. */
export type DiagramStepVisualStyle = Pick<
  DiagramVisualStyle,
  'strokeWidth' | 'strokeOpacity' | 'fillOpacity' | 'pointSize' | 'labelSize' | 'labelOffset' | 'angleRadius' | 'markHeight'
>;

export interface DiagramStepObjectState {
  visible?: boolean;
  emphasis?: DiagramStepEmphasis;
  /** Conserva el color del objeto si se omite; permite un acento explícito por paso. */
  emphasisColor?: DiagramColorToken;
  /** Sustituye el color base del objeto durante este paso. */
  color?: DiagramColorToken;
  /** Sustituye la etiqueta del objeto durante este paso. */
  label?: string;
  /** Controla si la etiqueta nativa se muestra durante este paso. */
  showLabel?: boolean;
  /** Sustituye el trazo discontinuo del objeto durante este paso. */
  dashed?: boolean;
  /** Ajustes visuales temporales que se fusionan con el estilo base del objeto. */
  style?: DiagramStepVisualStyle;
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

/** Traducción de un paso; `overlays` se indexa por id del objeto que porta el panel. */
export interface DiagramStepTranslation {
  label?: string;
  description?: string;
  overlays?: Record<string, { title?: string; content?: string }>;
}

/** Traducción de un bloque de panel; `rules` se alinea por índice con `block.rules` ("" = texto base). */
export interface DiagramPanelBlockTranslation {
  title?: string;
  text?: string;
  rules?: string[];
}

export interface DiagramTranslation {
  title?: string;
  subtitle?: string;
  note?: string;
  description?: string;
  steps?: Record<string, string | DiagramStepTranslation>;
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
  titles?: Record<string, string>;
  subtitles?: Record<string, string>;
  texts?: Record<string, string>;
  descriptions?: Record<string, string>;
  /** Etiquetas accesibles (`selection.ariaLabel`) por id de objeto. */
  ariaLabels?: Record<string, string>;
  /** Textos de las variantes condicionales (`content.rules`) por id de objeto, alineados por índice ("" = texto base). */
  rules?: Record<string, string[]>;
  /** Bloques de paneles informativos por id de objeto y id de bloque. */
  blocks?: Record<string, Record<string, DiagramPanelBlockTranslation>>;
}

export interface DiagramSceneState {
  activeStepId?: string;
  highlightedIds?: readonly string[];
  selectedIds?: readonly string[];
}
