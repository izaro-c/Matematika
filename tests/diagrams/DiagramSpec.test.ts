import { describe, expect, it } from 'vitest';
import fixture from '../fixtures/diagrams/diagram-spec.json';
import {
  DiagramSpecLoadError,
  createDiagramSpec,
  loadDiagramSpec,
  parseDiagramSpecV3,
  type ControlObject,
  type DiagramSpec,
  type PointObject,
} from '@/diagrams/public';

function spec(): DiagramSpec {
  return structuredClone(fixture) as unknown as DiagramSpec;
}

function firstPoint(candidate: DiagramSpec): PointObject {
  return candidate.objects.find((object): object is PointObject => object.objectType === 'point')!;
}

describe('DiagramSpec v3 schema and loading', () => {
  it('validates the representative fixture without normalization loss', () => {
    const parsed = parseDiagramSpecV3(fixture);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data).toEqual(fixture);
    expect(parsed.data.layers.map(layer => layer.id)).toEqual(['construction', 'geometry', 'annotations']);
  });

  it('accepts an interactable object that opts out of visual highlighting', () => {
    const candidate = spec();
    firstPoint(candidate).selection.highlightable = false;
    const parsed = parseDiagramSpecV3(candidate);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.objects[0].selection).toMatchObject({ selectable: true, highlightable: false });
  });

  it('validates reactive slider maxima and reactive ruler spacing', () => {
    const candidate = spec();
    const control: ControlObject = {
      id: 'n', label: 'n', color: 'pavo', layerId: 'annotations', order: 90,
      visible: true, locked: false, groupIds: [], selection: { selectable: true, role: 'primary' },
      target: true, targetId: 'n', objectType: 'control', variant: 'slider', position: [0, -2],
      range: { min: 1, max: 8, maxExpression: 'floor(segAB.length)+2', step: 1 }, value: 2,
    };
    candidate.objects.push(control, {
      id: 'copyTicks', label: 'Separaciones', objectType: 'mark', variant: 'graduation', color: 'carbon',
      layerId: 'annotations', order: 91, visible: true, locked: false, groupIds: [],
      selection: { selectable: true, role: 'construction' }, target: false,
      anchor: { type: 'path', path: 'segAB' }, count: 1, spacing: 1, spacingExpression: 'abs(pB.x-pA.x)', subdivisions: 0,
    });

    const parsed = parseDiagramSpecV3(candidate);

    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const parsedControl = parsed.data.objects.find(object => object.id === 'n');
    expect(parsedControl?.objectType === 'control' && parsedControl.range.maxExpression).toBe('floor(segAB.length)+2');
    const ticks = parsed.data.objects.at(-1);
    expect(ticks?.objectType === 'mark' && ticks.spacingExpression).toBe('abs(pB.x-pA.x)');
  });

  it('returns precise paths for invalid references and layers', () => {
    const invalid = spec();
    const segment = invalid.objects.find(object => object.id === 'segAB');
    if (segment?.objectType === 'path' && segment.geometry.type === 'segment') segment.geometry.points[0] = 'missing';
    firstPoint(invalid).layerId = 'missing-layer';
    const parsed = parseDiagramSpecV3(invalid);
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    expect(parsed.error.message).toContain('missing-layer');
    expect(parsed.error.message).toContain('missing');
  });

  it('loads only DiagramSpec v3 and explains unsupported or future versions', () => {
    expect(loadDiagramSpec(fixture)).toEqual(fixture);
    expect(createDiagramSpec(fixture)).toEqual(fixture);
    expect(() => loadDiagramSpec({ ...fixture, version: 4 })).toThrowError(DiagramSpecLoadError);
    try {
      loadDiagramSpec({ ...fixture, version: 4 });
    } catch (error) {
      expect(error).toMatchObject({ code: 'future-version' });
      expect((error as Error).message).toContain('más reciente');
    }
    try {
      loadDiagramSpec({ ...fixture, version: 2 });
    } catch (error) {
      expect(error).toMatchObject({ code: 'unsupported-version' });
    }
    expect(() => loadDiagramSpec({ title: 'sin versión' })).toThrow(/solo se admite DiagramSpec v3/);
    expect(() => loadDiagramSpec([])).toThrow(/objeto JSON/);
  });

  it('validates EjercicioClasificacionTriangulosSpec cleanly against parseDiagramSpecV3 and tests exercise validation', async () => {
    const { AnguloSpec } = await import('@content/diagrams/Definiciones/Angulo');
    const { EjercicioClasificacionTriangulosSpec } = await import('@content/diagrams/Ejercicios/EjercicioClasificacionTriangulos');
    const { validateClasificacionTriangulos } = await import('@/content-pages/exercise/validators/canvasValidators');
    const { createDiagramSpec } = await import('@/diagrams/public');

    expect(() => createDiagramSpec(AnguloSpec)).not.toThrow();
    expect(() => createDiagramSpec(EjercicioClasificacionTriangulosSpec)).not.toThrow();

    // Initial position is misaligned -> validation returns false
    expect(validateClasificacionTriangulos(EjercicioClasificacionTriangulosSpec)).toBe(false);

    // Corrected position:
    // C1 (pR3) at (0, 2.5) -> Right angle at R1 (90°)
    // C2 (pA3) at (8, 3) -> All acute angles (< 90°)
    // C3 (pO3) at (11, 2) -> Obtuse angle at O1 (> 90°)
    const validSpec: typeof EjercicioClasificacionTriangulosSpec = {
      ...EjercicioClasificacionTriangulosSpec,
      objects: EjercicioClasificacionTriangulosSpec.objects.map((obj) => {
        if (obj.id === 'pR3' && obj.objectType === 'point') return { ...obj, definition: { type: 'coordinates', x: 0, y: 2.5 } };
        if (obj.id === 'pA3' && obj.objectType === 'point') return { ...obj, definition: { type: 'coordinates', x: 8, y: 3 } };
        if (obj.id === 'pO3' && obj.objectType === 'point') return { ...obj, definition: { type: 'coordinates', x: 11, y: 2 } };
        return obj;
      }),
    };
    expect(validateClasificacionTriangulos(validSpec)).toBe(true);

    // Partially valid position (only 2 out of 3 correct) -> returns false
    const partialSpec: typeof EjercicioClasificacionTriangulosSpec = {
      ...EjercicioClasificacionTriangulosSpec,
      objects: EjercicioClasificacionTriangulosSpec.objects.map((obj) => {
        if (obj.id === 'pR3' && obj.objectType === 'point') return { ...obj, definition: { type: 'coordinates', x: 0, y: 2.5 } };
        if (obj.id === 'pA3' && obj.objectType === 'point') return { ...obj, definition: { type: 'coordinates', x: 8, y: 3 } };
        return obj;
      }),
    };
    expect(validateClasificacionTriangulos(partialSpec)).toBe(false);
  });
});











