import type { ElementKind } from '../model/types';
import type { PublishedDiagramLayout } from '../model/scene/publishedDiagramLayout';

/**
 * Translation keys for labels that the model still stores as Spanish strings
 * (`KIND_LABELS`, `PUBLISHED_LAYOUT_LABELS`). The model keeps its strings for
 * undo-history labels; whatever the user reads goes through these keys.
 */
type Translate = (...args: [string] | [string, Record<string, string | number>]) => string;

const KIND_LABEL_KEYS: Record<ElementKind, string> = {
  segment: 'editor.diagramOptions.kindSegment',
  line: 'editor.diagramOptions.kindLine',
  ray: 'editor.diagramOptions.kindRay',
  polygon: 'editor.diagramOptions.kindPolygon',
  circle: 'editor.diagramOptions.kindCircle',
  arc: 'editor.diagramOptions.kindArc',
  functionCurve: 'editor.diagramOptions.kindFunctionCurve',
  parametricCurve: 'editor.diagramOptions.kindParametricCurve',
  poincareGeodesic: 'editor.diagramOptions.kindPoincareGeodesic',
  poincareArc: 'editor.diagramOptions.kindPoincareArc',
  intersection: 'editor.diagramOptions.kindIntersection',
  midpoint: 'editor.diagramOptions.kindMidpoint',
  perpendicularFoot: 'editor.diagramOptions.kindPerpendicularFoot',
  segmentExtension: 'editor.diagramOptions.kindSegmentExtension',
  perpendicular: 'editor.diagramOptions.kindPerpendicular',
  parallel: 'editor.diagramOptions.kindParallel',
  angleBisector: 'editor.diagramOptions.kindAngleBisector',
  angle: 'editor.diagramOptions.kindAngle',
  nonReflexAngle: 'editor.diagramOptions.kindNonReflexAngle',
  rightAngle: 'editor.diagramOptions.kindRightAngle',
  congruenceMark: 'editor.diagramOptions.kindCongruenceMark',
  parallelMark: 'editor.diagramOptions.kindParallelMark',
  measureTicks: 'editor.diagramOptions.kindMeasureTicks',
  perpendicularMark: 'editor.diagramOptions.kindPerpendicularMark',
  dimensionLine: 'editor.diagramOptions.kindDimensionLine',
  measurement: 'editor.diagramOptions.kindMeasurement',
  grid: 'editor.diagramOptions.kindGrid',
  areaDecomposition: 'editor.diagramOptions.kindAreaDecomposition',
  halfPlane: 'editor.diagramOptions.kindHalfPlane',
  areaIntersection: 'editor.diagramOptions.kindAreaIntersection',
  text: 'editor.diagramOptions.kindText',
  label: 'editor.diagramOptions.kindLabel',
  formula: 'editor.diagramOptions.kindFormula',
  infoPanel: 'editor.diagramOptions.kindInfoPanel',
};

const LAYOUT_LABEL_KEYS: Record<PublishedDiagramLayout, string> = {
  standard: 'editor.diagramOptions.layoutStandard',
  theorem: 'editor.diagramOptions.layoutTheorem',
  balanced: 'editor.diagramOptions.layoutBalanced',
  demonstration: 'editor.diagramOptions.layoutDemonstration',
};

export function kindLabel(t: Translate, kind: string): string {
  const key = (KIND_LABEL_KEYS as Record<string, string | undefined>)[kind];
  return key ? t(key) : kind;
}

export function layoutLabel(t: Translate, layout: PublishedDiagramLayout): string {
  return t(LAYOUT_LABEL_KEYS[layout]);
}

export function objectTypeLabel(t: Translate, type: string): string {
  if (type === 'point') return t('editor.diagramOptions.typePoint');
  if (type === 'slider') return t('editor.diagramOptions.typeSlider');
  return kindLabel(t, type);
}
