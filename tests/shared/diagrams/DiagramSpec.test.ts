import { describe, expect, it } from 'vitest';
import legacyFixture from '../../fixtures/diagrams/diagram-spec-v1.json';
import v2Fixture from '../../fixtures/diagrams/diagram-spec-v2.json';
import {
  DiagramSpecMigrationError,
  migrateDiagramSpec,
  parseDiagramSpecV2,
  type DiagramSpecV2,
} from '../../../src/shared/diagrams/public';

describe('DiagramSpec v2 schema and migrations', () => {
  it('validates the representative v2 fixture without normalization loss', () => {
    const parsed = parseDiagramSpecV2(v2Fixture);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data).toEqual(v2Fixture);
    expect(parsed.data.layers.map(layer => layer.id)).toEqual(['construction', 'geometry', 'annotations']);
  });

  it('accepts an interactable scene item that opts out of visual highlighting', () => {
    const candidate = structuredClone(v2Fixture);
    candidate.points[0].selection.highlightable = false;
    const parsed = parseDiagramSpecV2(candidate);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.points[0].selection).toMatchObject({ selectable: true, highlightable: false });
  });

  it('validates reactive slider maxima and reactive ruler spacing with explicit dependencies', () => {
    const candidate = structuredClone(v2Fixture) as unknown as DiagramSpecV2;
    candidate.sliders.push({
      id: 'n', label: 'n', color: 'pavo', layerId: 'annotations', order: 90,
      visible: true, locked: false, groupIds: [], selection: { selectable: true, role: 'primary' },
      target: true, targetId: 'n', x: 0, y: -2, min: 1, max: 8,
      maxExpression: 'floor(segAB.length)+2', value: 2, step: 1,
    });
    candidate.elements.push({
      id: 'copyTicks', label: 'Separaciones', kind: 'measureTicks', refs: ['segAB'], color: 'carbon',
      layerId: 'annotations', order: 91, visible: true, locked: false, groupIds: [],
      selection: { selectable: true, role: 'construction' }, target: false,
      properties: { tickDistance: 1, tickDistanceExpression: 'abs(pB.x-pA.x)', minorTickCount: 0 },
    });
    candidate.dependencies = [
      ...(candidate.dependencies ?? []),
      { sourceId: 'segAB', targetId: 'n', relation: 'expression' },
      { sourceId: 'segAB', targetId: 'copyTicks', relation: 'construction' },
      { sourceId: 'pA', targetId: 'copyTicks', relation: 'expression' },
      { sourceId: 'pB', targetId: 'copyTicks', relation: 'expression' },
    ];

    const parsed = parseDiagramSpecV2(candidate);

    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.sliders[0].maxExpression).toBe('floor(segAB.length)+2');
    expect(parsed.data.elements.at(-1)?.properties?.tickDistanceExpression).toBe('abs(pB.x-pA.x)');
    expect(parsed.data.elements.at(-1)?.properties?.minorTickCount).toBe(0);
  });

  it('accepts additive MDX highlighting for objects and groups without changing the default', () => {
    const candidate = structuredClone(v2Fixture);
    candidate.points[0].selection.dimOthersOnHighlight = false;
    candidate.groups[0].selection.dimOthersOnHighlight = false;
    const parsed = parseDiagramSpecV2(candidate);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.points[0].selection.dimOthersOnHighlight).toBe(false);
    expect(parsed.data.groups[0].selection.dimOthersOnHighlight).toBe(false);
    expect(parsed.data.points[1].selection.dimOthersOnHighlight).toBeUndefined();
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

  it('rejects points marked as fixed while using a movable constraint', () => {
    const invalid = structuredClone(v2Fixture);
    invalid.points[0].fixed = true;
    invalid.points[0].constraint = 'glider';
    invalid.points[0].gliderTarget = invalid.elements[0].id;

    const parsed = parseDiagramSpecV2(invalid);

    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.error.message).toContain('restricción móvil');
  });

  it('accepts viewport-relative information panels without a geometric reference', () => {
    const candidate = structuredClone(v2Fixture);
    candidate.elements.push({
      id: 'viewport-panel', label: 'Panel fijo', kind: 'infoPanel', refs: [], color: 'carbon',
      layerId: 'annotations', order: 99, visible: true, locked: false, groupIds: [],
      selection: { selectable: true, role: 'annotation' }, target: false, text: 'Lectura estable',
      properties: { anchorMode: 'viewport', viewportPosition: [0.1, 0.2], title: 'Información' },
    });
    const parsed = parseDiagramSpecV2(candidate);
    expect(parsed.success).toBe(true);
  });

  it('accepts labels attached directly to an element and an optional global visibility switch', () => {
    const candidate = structuredClone(v2Fixture) as unknown as DiagramSpecV2;
    candidate.showLabels = false;
    candidate.elements.push({
      id: 'label-segAB', label: 'Etiqueta de Base AB', kind: 'label', refs: ['segAB'], color: 'carbon',
      layerId: 'annotations', order: 99, visible: true, locked: false, groupIds: [],
      selection: { selectable: true, role: 'annotation' }, target: false, text: 'l',
      style: { textOffset: [0.04, 0.04], labelSize: 18 },
      properties: { anchorMode: 'reference', anchorParameter: 0.25 },
    });

    const parsed = parseDiagramSpecV2(candidate);

    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.showLabels).toBe(false);
    expect(parsed.data.elements.at(-1)?.properties?.anchorParameter).toBe(0.25);
    expect(parsed.data.elements.at(-1)?.style?.labelSize).toBe(18);
  });

  it('rejects label positions outside the normalized element range', () => {
    const candidate = structuredClone(v2Fixture) as unknown as DiagramSpecV2;
    candidate.elements.push({
      id: 'label-segAB', label: 'Etiqueta de Base AB', kind: 'label', refs: ['segAB'], color: 'carbon',
      layerId: 'annotations', order: 99, visible: true, locked: false, groupIds: [],
      selection: { selectable: true, role: 'annotation' }, target: false, text: 'l',
      properties: { anchorMode: 'reference', anchorParameter: 1.2 },
    });

    const parsed = parseDiagramSpecV2(candidate);

    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.error.message).toContain('anchorParameter');
  });

  it('accepts an optional visibility choice for each point label', () => {
    const candidate = structuredClone(v2Fixture) as unknown as DiagramSpecV2;
    candidate.points[0].showLabel = false;

    const parsed = parseDiagramSpecV2(candidate);

    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.points[0].showLabel).toBe(false);
  });

  it('validates editable point attractors with an explicit construction dependency', () => {
    const candidate = structuredClone(v2Fixture) as unknown as DiagramSpecV2;
    const point = candidate.points.find(item => item.id === 'pC')!;
    point.attractorIds = ['segAB'];
    point.attractorDistance = 0.4;
    point.snatchDistance = 0.6;
    candidate.dependencies = [{ sourceId: 'segAB', targetId: 'pC', relation: 'constraint' }];

    const parsed = parseDiagramSpecV2(candidate);

    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.points.find(item => item.id === 'pC')).toMatchObject({
      attractorIds: ['segAB'],
      attractorDistance: 0.4,
      snatchDistance: 0.6,
    });
  });

  it('requires normalized coordinates for viewport-relative information panels', () => {
    const candidate = structuredClone(v2Fixture);
    candidate.elements.push({
      id: 'viewport-panel', label: 'Panel fijo', kind: 'infoPanel', refs: [], color: 'carbon',
      layerId: 'annotations', order: 99, visible: true, locked: false, groupIds: [],
      selection: { selectable: true, role: 'annotation' }, target: false, text: 'Lectura estable',
      properties: { anchorMode: 'viewport' },
    });
    const parsed = parseDiagramSpecV2(candidate);
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.error.message).toContain('viewportPosition');
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
