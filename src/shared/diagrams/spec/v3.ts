import type {
  DiagramBounds,
  DiagramColorToken,
  DiagramGroup,
  DiagramInfoPanelBlock,
  DiagramHeaderConfiguration,
  DiagramLayer,
  DiagramMode,
  DiagramSelectionMetadata,
  DiagramStep,
  DiagramTextRule,
  DiagramViewport,
  DiagramPoint,
  DiagramElement,
  DiagramSlider,
} from './types';
import { DIAGRAM_RENDERER_ID, DIAGRAM_SPEC_VERSION } from './types';

export type DiagramObjectType = 'point' | 'path' | 'angle' | 'region' | 'area' | 'mark' | 'annotation' | 'control';

export interface DiagramObjectBase {
  id: string;
  objectType: DiagramObjectType;
  label: string;
  color: DiagramColorToken;
  layerId: string;
  order: number;
  visible: boolean;
  visibleWhen?: string;
  locked: boolean;
  groupIds: string[];
  selection: DiagramSelectionMetadata;
  target: boolean;
  targetId?: string;
}

export type PointDefinition =
  | { type: 'coordinates'; x: number; y: number }
  | { type: 'expression'; x: string; y: string; fallback: [number, number] }
  | { type: 'intersection'; supports: [string, string]; restrictToSupports?: boolean }
  | { type: 'midpoint'; points: [string, string] }
  | { type: 'projection'; point: string; support: string | { points: [string, string] } };

export type PointMobility =
  | { type: 'free' }
  | { type: 'fixed' }
  | { type: 'axis-x'; coordinate: number }
  | { type: 'axis-y'; coordinate: number }
  | { type: 'on-support'; support: string }
  | { type: 'constrained'; relationIds: string[] };

export interface PointAppearance {
  size?: number;
  labelVisible?: boolean;
  labelOffset?: [number, number];
  labelPosition?: number | string;
  labelSize?: number;
  opacity?: number;
  highlightSize?: number;
  highlightVisible?: boolean;
  preserveColorOnHighlight?: boolean;
}

export interface PointInteraction {
  snapToGrid?: boolean;
  snapSize?: number;
  attractorIds?: string[];
  attractorDistance?: number;
  snatchDistance?: number;
}

export interface PointObject extends DiagramObjectBase {
  objectType: 'point';
  definition: PointDefinition;
  mobility: PointMobility;
  appearance?: PointAppearance;
  interaction?: PointInteraction;
}

export type LinearConstruction =
  | { type: 'through-points'; points: [string, string] }
  | { type: 'perpendicular'; linePoints: [string, string]; through: string }
  | { type: 'parallel'; linePoints: [string, string]; through: string }
  | { type: 'angle-bisector'; points: [string, string, string] };

export type PathGeometry =
  | { type: 'segment'; points: [string, string]; construction?: { type: 'base-extension'; foot: string } }
  | { type: 'line'; construction: LinearConstruction }
  | { type: 'ray'; points: [string, string] }
  | { type: 'polygon'; points: [string, string, string, ...string[]] }
  | { type: 'circle'; center: string; point: string }
  | { type: 'arc'; points: [string, string, string]; direction: 'clockwise' | 'counterclockwise' }
  | { type: 'function'; expression: string; variable: string; domain: [number, number]; samples: number; areaFill?: 'none' | 'interior' | 'half-plane'; areaSide?: string }
  | { type: 'parametric'; x: string; y: string; parameter: string; domain: [number, number]; samples: number; areaFill?: 'none' | 'interior' | 'half-plane'; areaSide?: string }
  | { type: 'poincare-geodesic'; refs: [string, string, string, string] }
  | { type: 'poincare-arc'; refs: [string, string, string, string] }
  | { type: 'dimension'; points: [string, string]; offset?: number };

export interface PathAppearance {
  dashed?: boolean;
  strokeWidth?: number;
  strokeOpacity?: number;
  fillOpacity?: number;
  labelVisible?: boolean;
  labelOffset?: [number, number];
  labelPosition?: number | string;
  labelSize?: number;
  highlightStrokeWidth?: number;
  highlightFillOpacity?: number;
  highlightVisible?: boolean;
  preserveColorOnHighlight?: boolean;
}

export interface PathObject extends DiagramObjectBase {
  objectType: 'path';
  geometry: PathGeometry;
  appearance?: PathAppearance;
}

export interface AngleObject extends DiagramObjectBase {
  objectType: 'angle';
  points: [string, string, string];
  sweep: 'directed' | 'non-reflex';
  direction?: 'clockwise' | 'counterclockwise';
  marker: 'arc' | 'square';
  perpendicularRelationId?: string;
  appearance?: {
    radius?: number;
    strokeWidth?: number;
    strokeOpacity?: number;
    fillOpacity?: number;
    labelVisible?: boolean;
    labelOffset?: [number, number];
    labelPosition?: number | string;
    labelSize?: number;
    highlightStrokeWidth?: number;
    highlightFillOpacity?: number;
    highlightVisible?: boolean;
    preserveColorOnHighlight?: boolean;
  };
}

export interface RegionObject extends DiagramObjectBase {
  objectType: 'region';
  geometry:
    | { type: 'area-decomposition'; points: [string, string, string, ...string[]]; rows?: number; columns?: number }
    | { type: 'grid-region'; points: [string, string, string, string]; rows: number; columns: number };
  appearance?: {
    strokeWidth?: number;
    strokeOpacity?: number;
    fillOpacity?: number;
    highlightFillOpacity?: number;
    preserveColorOnHighlight?: boolean;
  };
}

export interface AreaObject extends DiagramObjectBase {
  objectType: 'area';
  geometry:
    | { type: 'half-plane'; boundary: [string, string]; side: string }
    | { type: 'intersection'; areas: [string, string, ...string[]] };
  appearance?: {
    strokeWidth?: number;
    strokeOpacity?: number;
    fillOpacity?: number;
    highlightFillOpacity?: number;
    preserveColorOnHighlight?: boolean;
  };
}

export interface MarkObject extends DiagramObjectBase {
  objectType: 'mark';
  variant: 'congruence' | 'parallel' | 'graduation';
  anchor:
    | { type: 'between-points'; points: [string, string] }
    | { type: 'path'; path: string };
  count: number;
  height?: number;
  spacing?: number;
  spacingExpression?: string;
  subdivisions?: number;
  appearance?: {
    strokeWidth?: number;
    strokeOpacity?: number;
    preserveColorOnHighlight?: boolean;
  };
}

export type AnnotationAnchor =
  | { type: 'object'; object: string; parameter?: number; offset?: [number, number] }
  | { type: 'viewport'; position: [number, number] };

export interface AnnotationObject extends DiagramObjectBase {
  objectType: 'annotation';
  variant: 'text' | 'formula' | 'label' | 'panel' | 'measurement';
  content: {
    text: string;
    expression?: string;
    unit?: string;
    precision?: number;
    rules?: DiagramTextRule[];
    title?: string;
    blocks?: DiagramInfoPanelBlock[];
    layout?: 'stack' | 'columns';
  };
  anchor: AnnotationAnchor;
  measurement?: { refs: [string, string] | [string]; mode: 'distance' | 'value' };
  appearance?: {
    fontSize?: number;
    opacity?: number;
    preserveColorOnHighlight?: boolean;
  };
}

export interface ControlObject extends DiagramObjectBase {
  objectType: 'control';
  variant: 'slider';
  position: [number, number];
  range: { min: number; max: number; maxExpression?: string; step: number };
  value: number;
}

export type DiagramObject = PointObject | PathObject | AngleObject | RegionObject | AreaObject | MarkObject | AnnotationObject | ControlObject;

export type DiagramRelation =
  | { id: string; label: string; type: 'coincident'; points: [string, string]; enabled: boolean }
  | { id: string; label: string; type: 'coordinate-equality'; axis: 'x' | 'y'; points: [string, string]; enabled: boolean }
  | { id: string; label: string; type: 'on-support'; point: string; support: string; enabled: boolean }
  | { id: string; label: string; type: 'distance'; points: [string, string]; value?: number; expression?: string; enabled: boolean }
  | { id: string; label: string; type: 'equal-length'; segments: [string, string]; drivenPoint?: string; enabled: boolean }
  | { id: string; label: string; type: 'equal-angle'; angles: [string, string]; drivenPoint?: string; enabled: boolean }
  | { id: string; label: string; type: 'perpendicular'; supports: [string, string] | [[string, string], [string, string]]; enabled: boolean }
  | { id: string; label: string; type: 'parallel'; supports: [string, string] | [[string, string], [string, string]]; enabled: boolean }
  | { id: string; label: string; type: 'inside-disk'; point: string; disk: string | { center: string; boundary: string }; enabled: boolean }
  | { id: string; label: string; type: 'same-half-plane'; points: [string, string]; boundary: string; enabled: boolean }
  | { id: string; label: string; type: 'inside-area'; point: string; area: string; membership?: 'interior' | 'boundary'; enabled: boolean }
  | { id: string; label: string; type: 'reflection'; refs: string[]; centerOrAxis?: string; drivenPoint?: string; enabled: boolean }
  | { id: string; label: string; type: 'expression'; refs: string[]; expression: string; value?: number; enabled: boolean };

export interface DiagramSpecV3 {
  version: typeof DIAGRAM_SPEC_VERSION;
  renderer: typeof DIAGRAM_RENDERER_ID;
  title: string;
  componentId: string;
  category: string;
  mode: DiagramMode;
  axis: boolean;
  grid: boolean;
  showLabels?: boolean;
  header?: DiagramHeaderConfiguration;
  viewport: DiagramViewport;
  layers: DiagramLayer[];
  groups: DiagramGroup[];
  objects: DiagramObject[];
  relations: DiagramRelation[];
  steps: DiagramStep[];
  note: string;
}

/** Vistas no enumerables para consumidores v2 durante la ventana de deprecación. */
export interface DiagramSpecLegacyViews {
  readonly points: readonly DiagramPoint[];
  readonly elements: readonly DiagramElement[];
  readonly sliders: readonly DiagramSlider[];
  readonly extensions: Readonly<Record<string, never>>;
}

export type DiagramSpec = DiagramSpecV3 & DiagramSpecLegacyViews;

export function isPointObject(object: DiagramObject): object is PointObject {
  return object.objectType === 'point';
}

export function diagramBounds(value: DiagramBounds): DiagramBounds {
  return [...value];
}
