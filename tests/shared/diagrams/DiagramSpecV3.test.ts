import { describe, expect, it } from 'vitest';
import fixture from '../../fixtures/diagrams/diagram-spec-v2.json';
import {
  migrateDiagramSpec,
  parseDiagramSpecV3,
  projectDiagramSpecV3ToV2,
  referenceSlotsForLegacyKind,
  type DiagramElementKind,
  type DiagramSpecV3,
  type PointObject,
} from '../../../src/shared/diagrams/public';

function migrated(): DiagramSpecV3 {
  return structuredClone(migrateDiagramSpec(fixture).spec);
}

describe('DiagramSpec v3 semantic contract', () => {
  it('turns every constructed point into a PointObject usable by later paths', () => {
    const spec = migrated();
    const midpoint: PointObject = {
      ...spec.objects.find((object): object is PointObject => object.objectType === 'point')!,
      id: 'midAB', label: 'M', order: 100,
      definition: { type: 'midpoint', points: ['pA', 'pB'] },
      mobility: { type: 'fixed' },
    };
    spec.objects.push(midpoint, {
      ...spec.objects.find(object => object.objectType === 'path')!,
      id: 'fromMidpoint', label: 'Segmento desde M', order: 110, objectType: 'path',
      geometry: { type: 'segment', points: ['midAB', 'pA'] },
    });
    const parsed = parseDiagramSpecV3(spec);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const projected = projectDiagramSpecV3ToV2(parsed.data);
    expect(projected.elements.find(element => element.id === 'fromMidpoint')?.refs).toEqual(['midAB', 'pA']);
  });

  it('rejects incompatible reference capabilities and nonsensical properties', () => {
    const spec = migrated();
    const circle = spec.objects.find(object => object.objectType === 'path');
    expect(circle).toBeDefined();
    if (!circle || circle.objectType !== 'path') return;
    circle.geometry = { type: 'circle', center: 'pA', point: circle.id };
    expect(parseDiagramSpecV3(spec).success).toBe(false);

    const withGenericStyle = migrated() as unknown as { objects: Array<Record<string, unknown>> };
    withGenericStyle.objects[0].style = { strokeWidth: 99 };
    expect(parseDiagramSpecV3(withGenericStyle).success).toBe(false);
  });

  it('requires an explicit perpendicularity relation for square angle markers', () => {
    const spec = migrated();
    const point = spec.objects.find((object): object is PointObject => object.objectType === 'point')!;
    spec.objects.push({
      id: 'right', label: 'Recto', order: 500, objectType: 'angle',
      color: point.color, layerId: point.layerId, visible: true, locked: true,
      groupIds: [], selection: point.selection, target: false,
      points: ['pA', 'pB', 'pC'], sweep: 'non-reflex', marker: 'square',
    });
    const parsed = parseDiagramSpecV3(spec);
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.error.message).toContain('relación explícita de perpendicularidad');
  });

  it('migrates deterministically and persists neither dependencies nor opaque extensions', () => {
    const first = migrateDiagramSpec(fixture).spec;
    const second = migrateDiagramSpec(fixture).spec;
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    expect(JSON.stringify(first)).not.toContain('"dependencies"');
    expect(JSON.stringify(first)).not.toContain('"extensions"');
    expect(first.version).toBe(3);
  });

  it('defines typed slots for every legacy variant during the compatibility window', () => {
    const kinds: DiagramElementKind[] = [
      'segment', 'line', 'ray', 'polygon', 'circle', 'arc', 'functionCurve', 'parametricCurve', 'poincareGeodesic', 'poincareArc',
      'intersection', 'midpoint', 'perpendicularFoot', 'baseExtension', 'perpendicular', 'parallel', 'angleBisector', 'angle', 'nonReflexAngle',
      'rightAngle', 'congruenceMark', 'parallelMark', 'measureTicks', 'perpendicularMark', 'dimensionLine', 'measurement', 'grid',
      'areaDecomposition', 'text', 'label', 'formula', 'infoPanel',
    ];
    kinds.forEach(kind => expect(referenceSlotsForLegacyKind(kind), kind).toBeDefined());
  });
});
