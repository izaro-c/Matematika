import { describe, expect, it } from 'vitest';
import legacyFixture from '../../fixtures/diagrams/diagram-spec-v1.json';
import v2Fixture from '../../fixtures/diagrams/diagram-spec-v2.json';
import {
  DiagramSpecMigrationError,
  migrateDiagramSpec,
  parseDiagramSpecV2,
} from '../../../src/shared/diagrams/public';

describe('DiagramSpec v2 schema and migrations', () => {
  it('validates the representative v2 fixture without normalization loss', () => {
    const parsed = parseDiagramSpecV2(v2Fixture);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data).toEqual(v2Fixture);
    expect(parsed.data.layers.map(layer => layer.id)).toEqual(['construction', 'geometry', 'annotations']);
  });

  it('migrates an unversioned v1 scene explicitly and preserves its geometry', () => {
    const result = migrateDiagramSpec(legacyFixture);
    expect(result.migratedFrom).toBe(1);
    expect(result.spec.version).toBe(2);
    expect(result.spec.viewport.bounds).toEqual(legacyFixture.boundingBox);
    expect(result.spec.points.map(point => [point.id, point.x, point.y])).toEqual(
      legacyFixture.points.map(point => [point.id, point.x, point.y]),
    );
    expect(result.warnings[0]).toContain('no se reescribe');
  });

  it('returns precise paths for invalid references and layers', () => {
    const invalid = structuredClone(v2Fixture);
    invalid.elements[0].refs[0] = 'missing';
    invalid.points[0].layerId = 'missing-layer';
    const parsed = parseDiagramSpecV2(invalid);
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    expect(parsed.error.message).toContain('missing-layer');
    expect(parsed.error.message).toContain('missing');
  });

  it('rejects duplicate layers and inconsistent bidirectional group membership', () => {
    const invalid = structuredClone(v2Fixture);
    invalid.layers.push({ ...invalid.layers[0] });
    invalid.groups[0].memberIds = invalid.groups[0].memberIds.filter(id => id !== 'pA');
    const parsed = parseDiagramSpecV2(invalid);
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    expect(parsed.error.message).toContain('layers.3.id');
    expect(parsed.error.message).toContain('pA declara el grupo triangle-group');
  });

  it('rejects dependency cycles that cannot be constructed topologically', () => {
    const invalid = structuredClone(v2Fixture);
    invalid.elements[0].refs[0] = invalid.elements[0].id;
    const parsed = parseDiagramSpecV2(invalid);
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    expect(parsed.error.message).toContain('forma un ciclo');
  });

  it('distinguishes future and unsupported versions with understandable errors', () => {
    expect(() => migrateDiagramSpec({ ...v2Fixture, version: 3 })).toThrowError(DiagramSpecMigrationError);
    try {
      migrateDiagramSpec({ ...v2Fixture, version: 3 });
    } catch (error) {
      expect(error).toMatchObject({ code: 'future-version' });
      expect((error as Error).message).toContain('más reciente');
    }
    expect(() => migrateDiagramSpec({ ...v2Fixture, version: 0 })).toThrow(/no tiene una ruta/);
  });
});
