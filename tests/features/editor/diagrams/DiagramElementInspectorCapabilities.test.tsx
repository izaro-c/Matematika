import { describe, expect, it } from 'vitest';
import type { DiagramElementKind } from '../../../../src/shared/diagrams/public';
import { ELEMENT_INSPECTOR_CAPABILITIES, elementInspectorCapabilities } from '../../../../src/features/editor/diagrams/model/elementInspectorCapabilities';

const ALL_KINDS: DiagramElementKind[] = [
  'segment', 'line', 'ray', 'polygon', 'circle', 'arc', 'functionCurve', 'parametricCurve',
  'poincareGeodesic', 'poincareArc', 'intersection', 'midpoint', 'perpendicularFoot',
  'baseExtension', 'perpendicular', 'parallel', 'angleBisector', 'angle', 'nonReflexAngle',
  'rightAngle', 'congruenceMark', 'parallelMark', 'measureTicks', 'perpendicularMark',
  'dimensionLine', 'measurement', 'grid', 'areaDecomposition', 'halfPlane', 'areaIntersection', 'text', 'label', 'formula',
  'infoPanel',
];

const FILL_KINDS = new Set<DiagramElementKind>(['polygon', 'circle', 'angle', 'nonReflexAngle', 'rightAngle', 'perpendicularMark', 'areaDecomposition', 'halfPlane', 'areaIntersection']);
const POINT_KINDS = new Set<DiagramElementKind>(['intersection', 'midpoint', 'perpendicularFoot']);
const ANNOTATION_KINDS = new Set<DiagramElementKind>(['dimensionLine', 'measurement', 'text', 'label', 'formula', 'infoPanel']);
const TEXT_OFFSET_KINDS = new Set<DiagramElementKind>(['measurement', 'text', 'label', 'formula', 'infoPanel']);
const NON_STROKE_KINDS = new Set<DiagramElementKind>([...POINT_KINDS, 'measurement', 'text', 'label', 'formula', 'infoPanel']);
const DASHED_KINDS = new Set<DiagramElementKind>([
  'segment', 'line', 'ray', 'polygon', 'circle', 'arc', 'functionCurve', 'parametricCurve',
  'poincareGeodesic', 'poincareArc', 'baseExtension', 'perpendicular', 'parallel',
  'angleBisector', 'dimensionLine', 'grid', 'areaDecomposition',
]);

describe('element inspector capability matrix', () => {
  it('is exhaustive and keeps every kind behind an explicit typed capability entry', () => {
    expect(Object.keys(ELEMENT_INSPECTOR_CAPABILITIES).sort()).toEqual([...ALL_KINDS].sort());
  });

  it.each(ALL_KINDS)('declares appearance capabilities for %s', kind => {
    const caps = elementInspectorCapabilities(kind);
    expect(caps.fill).toBe(FILL_KINDS.has(kind));
    expect(caps.stroke).toBe(!NON_STROKE_KINDS.has(kind));
    expect(caps.dashed).toBe(DASHED_KINDS.has(kind));
    expect(caps.pointSize).toBe(POINT_KINDS.has(kind));
    expect(caps.fontSize).toBe(ANNOTATION_KINDS.has(kind) || POINT_KINDS.has(kind));
    expect(caps.textOffset).toBe(TEXT_OFFSET_KINDS.has(kind));
  });

  it('declares textOffset for labels', () => {
    expect(elementInspectorCapabilities('label').textOffset).toBe(true);
  });
});
