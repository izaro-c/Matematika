import { describe, expect, it } from 'vitest';
import fixture from '../fixtures/diagrams/diagram-spec.json';
import {
  diagramConstructionKinds,
  objectConstructionReferences,
  parseDiagramSpecV3,
  referenceSlotsForKind,
  type DiagramSpecV3,
  type PointObject} from '@/diagrams/public';

function migrated(): DiagramSpecV3 {
  return structuredClone(fixture) as DiagramSpecV3;
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
    const fromMidpoint = parsed.data.objects.find(object => object.id === 'fromMidpoint')!;
    expect(objectConstructionReferences(fromMidpoint)).toEqual(['midAB', 'pA']);
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

  it('persists neither dependencies nor opaque extensions', () => {
    expect(JSON.stringify(fixture)).not.toContain('"dependencies"');
    expect(JSON.stringify(fixture)).not.toContain('"extensions"');
    expect(fixture.version).toBe(3);
  });

  it('defines typed reference slots for every construction kind', () => {
    diagramConstructionKinds.forEach(kind => expect(referenceSlotsForKind(kind).length, kind).toBeGreaterThan(0));
  });
});
