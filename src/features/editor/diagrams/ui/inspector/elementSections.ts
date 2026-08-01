import type { DiagramElementKind } from '@/shared/diagrams/spec';
import { elementInspectorCapabilities } from '@/features/editor/diagrams/model/elementInspectorCapabilities';

const MARK_KINDS = new Set<DiagramElementKind>([
  'congruenceMark', 'parallelMark', 'measureTicks', 'perpendicularMark',
]);

/** Secciones del inspector V2 por tipo de elemento. Basado en elementInspectorCapabilities. */
export function showsMarksSection(kind: DiagramElementKind): boolean {
  return kind === 'segment' || MARK_KINDS.has(kind);
}

export function showsCurveSection(kind: DiagramElementKind): boolean {
  return kind === 'functionCurve' || kind === 'parametricCurve';
}

const PANEL_OR_TEXT_KINDS = new Set<DiagramElementKind>([
  'infoPanel', 'text', 'label', 'formula', 'measurement',
]);

export function showsContentSection(kind: DiagramElementKind): boolean {
  return PANEL_OR_TEXT_KINDS.has(kind);
}

export function showsFillOpacity(kind: DiagramElementKind, areaFill?: string): boolean {
  const cap = elementInspectorCapabilities(kind);
  return cap.fill || (showsCurveSection(kind) && !!areaFill && areaFill !== 'none');
}

export function showsStrokeControls(kind: DiagramElementKind): boolean {
  return elementInspectorCapabilities(kind).stroke;
}

export function showsAngleRadius(kind: DiagramElementKind): boolean {
  return elementInspectorCapabilities(kind).angleRadius;
}

export function showsDashed(kind: DiagramElementKind): boolean {
  return elementInspectorCapabilities(kind).dashed;
}

export function showsSegmentMarks(kind: DiagramElementKind): boolean {
  return kind === 'segment';
}

export function showsDirectMarkCount(kind: DiagramElementKind): boolean {
  return kind === 'congruenceMark' || kind === 'parallelMark';
}

export function showsMeasureTicksProps(kind: DiagramElementKind): boolean {
  return kind === 'measureTicks';
}

/** Scope de relaciones geométricas del elemento (null = no mostrar sección). */
export function constraintScopeForKind(kind: DiagramElementKind): 'segment' | 'angle' | null {
  if (kind === 'segment') return 'segment';
  if (kind === 'angle' || kind === 'nonReflexAngle') return 'angle';
  return null;
}

export function showsConstraintsSection(kind: DiagramElementKind): boolean {
  return constraintScopeForKind(kind) !== null;
}
