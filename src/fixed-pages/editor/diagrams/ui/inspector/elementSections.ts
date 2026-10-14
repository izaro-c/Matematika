import type { DiagramConstructionKind } from '@/diagrams';
import { elementInspectorCapabilities } from '@/fixed-pages/editor/diagrams/model/elements/elementInspectorCapabilities';

const MARK_KINDS = new Set<DiagramConstructionKind>([
  'congruenceMark', 'parallelMark', 'measureTicks', 'perpendicularMark',
]);

/** Secciones del inspector por tipo de elemento. Basado en elementInspectorCapabilities. */
export function showsMarksSection(kind: DiagramConstructionKind): boolean {
  return kind === 'segment' || MARK_KINDS.has(kind);
}

export function showsCurveSection(kind: DiagramConstructionKind): boolean {
  return kind === 'functionCurve' || kind === 'parametricCurve';
}

const PANEL_OR_TEXT_KINDS = new Set<DiagramConstructionKind>([
  'infoPanel', 'text', 'label', 'formula', 'measurement', 'dimensionLine',
]);

export function showsContentSection(kind: DiagramConstructionKind): boolean {
  return PANEL_OR_TEXT_KINDS.has(kind);
}

export function showsFillOpacity(kind: DiagramConstructionKind, areaFill?: string): boolean {
  const cap = elementInspectorCapabilities(kind);
  return cap.fill || (showsCurveSection(kind) && !!areaFill && areaFill !== 'none');
}

export function showsStrokeControls(kind: DiagramConstructionKind): boolean {
  return elementInspectorCapabilities(kind).stroke;
}

export function showsAngleRadius(kind: DiagramConstructionKind): boolean {
  return elementInspectorCapabilities(kind).angleRadius;
}

export function showsDashed(kind: DiagramConstructionKind): boolean {
  return elementInspectorCapabilities(kind).dashed;
}

export function showsSegmentMarks(kind: DiagramConstructionKind): boolean {
  return kind === 'segment';
}

export function showsDirectMarkCount(kind: DiagramConstructionKind): boolean {
  return kind === 'congruenceMark' || kind === 'parallelMark';
}

export function showsMeasureTicksProps(kind: DiagramConstructionKind): boolean {
  return kind === 'measureTicks';
}

export function showsDimensionProps(kind: DiagramConstructionKind): boolean {
  return kind === 'dimensionLine';
}

export function showsMeasurementProps(kind: DiagramConstructionKind): boolean {
  return kind === 'measurement';
}

/** Scope de relaciones geométricas del elemento (null = no mostrar sección). */
export function constraintScopeForKind(kind: DiagramConstructionKind): 'segment' | 'angle' | null {
  if (kind === 'segment') return 'segment';
  if (kind === 'angle' || kind === 'nonReflexAngle') return 'angle';
  return null;
}

export function showsConstraintsSection(kind: DiagramConstructionKind): boolean {
  return constraintScopeForKind(kind) !== null;
}
