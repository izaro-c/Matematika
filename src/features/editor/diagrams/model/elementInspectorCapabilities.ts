import type { DiagramElementKind } from '../../../../shared/diagrams/spec';

export type ElementContentEditor = 'none' | 'text' | 'label' | 'formula' | 'measurement' | 'infoPanel';

export interface ElementInspectorCapabilities {
  content: ElementContentEditor;
  stroke: boolean;
  fill: boolean;
  dashed: boolean;
  pointSize: boolean;
  angleRadius: boolean;
  markHeight: boolean;
  fontSize: boolean;
  textOffset: boolean;
  attachedLabel: boolean;
  conditionalText: boolean;
}

const line = {
  content: 'none', stroke: true, fill: false, dashed: true, pointSize: false,
  angleRadius: false, markHeight: false, fontSize: false, attachedLabel: true,
  textOffset: false,
  conditionalText: false,
} as const satisfies ElementInspectorCapabilities;

const mark = {
  ...line, dashed: false, attachedLabel: true, markHeight: true,
} as const satisfies ElementInspectorCapabilities;

const annotation = (content: Exclude<ElementContentEditor, 'none'>): ElementInspectorCapabilities => ({
  content,
  stroke: false,
  fill: false,
  dashed: false,
  pointSize: false,
  angleRadius: false,
  markHeight: false,
  fontSize: true,
  textOffset: true,
  attachedLabel: false,
  conditionalText: true,
});

/**
 * Fuente de verdad exhaustiva para el inspector. Una propiedad solo debe
 * aparecer cuando el renderer la consume y tiene sentido para ese objeto.
 */
export const ELEMENT_INSPECTOR_CAPABILITIES = {
  segment: line,
  line,
  ray: line,
  polygon: { ...line, fill: true },
  circle: { ...line, fill: true },
  arc: line,
  functionCurve: line,
  parametricCurve: line,
  poincareGeodesic: line,
  poincareArc: line,
  intersection: { ...line, stroke: false, dashed: false, pointSize: true, fontSize: true, attachedLabel: true },
  midpoint: { ...line, stroke: false, dashed: false, pointSize: true, fontSize: true, attachedLabel: true },
  perpendicularFoot: { ...line, stroke: false, dashed: false, pointSize: true, fontSize: true, attachedLabel: true },
  baseExtension: line,
  perpendicular: line,
  parallel: line,
  angleBisector: line,
  angle: { ...line, fill: true, dashed: false, angleRadius: true },
  nonReflexAngle: { ...line, fill: true, dashed: false, angleRadius: true },
  rightAngle: { ...line, fill: true, dashed: false, angleRadius: true, attachedLabel: true },
  congruenceMark: mark,
  parallelMark: mark,
  measureTicks: mark,
  perpendicularMark: { ...mark, fill: true, angleRadius: true, markHeight: false },
  dimensionLine: { ...line, content: 'measurement', fontSize: true, attachedLabel: true, conditionalText: true },
  measurement: annotation('measurement'),
  grid: { ...line, attachedLabel: false },
  areaDecomposition: { ...line, fill: true },
  halfPlane: { ...line, fill: true, dashed: false, attachedLabel: false },
  areaIntersection: { ...line, fill: true, dashed: false, attachedLabel: false },
  text: annotation('text'),
  label: annotation('label'),
  formula: annotation('formula'),
  infoPanel: annotation('infoPanel'),
} satisfies Record<DiagramElementKind, ElementInspectorCapabilities>;

export function elementInspectorCapabilities(kind: DiagramElementKind): ElementInspectorCapabilities {
  return ELEMENT_INSPECTOR_CAPABILITIES[kind];
}
