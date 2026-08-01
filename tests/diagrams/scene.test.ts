import { describe, expect, it } from 'vitest';
import v2Fixture from '../fixtures/diagrams/diagram-spec-v2.json';
import { prepareSceneSpec,
  createScenePlan,
  createSceneConstructionPlan,
  fitViewport,
  migrateDiagramSpec,
  offscreenItemIds,
  recoverViewport,
  resolvePointCoordinates,
  zoomViewport} from '@/diagrams/public';
import { toWorkingSceneV2 } from '@/diagrams/spec/v3Compatibility';
import { TrianguloSpec } from '../../content/diagrams/Definiciones/Triangulo';

const spec = prepareSceneSpec(migrateDiagramSpec(v2Fixture).spec);
const triangulo = toWorkingSceneV2(TrianguloSpec);

describe('shared diagram scene semantics', () => {
  it('combines layer order, steps, visibility, lock and selection deterministically', () => {
    const plan = createScenePlan(spec, { activeStepId: 'step1', selectedIds: ['triangle-group'], highlightedIds: ['segAB'] });
    expect(plan.map(entry => entry.item.id).indexOf('segAB')).toBeLessThan(plan.map(entry => entry.item.id).indexOf('polyABC'));
    expect(plan.find(entry => entry.item.id === 'segAB')).toMatchObject({ locked: true, highlighted: true, visible: true });
    expect(plan.find(entry => entry.item.id === 'polyABC')?.selected).toBe(true);
    expect(plan.find(entry => entry.item.id === 'pFar')?.visible).toBe(false);
  });

  it('lets explicit references and selection override the local hover opt-out', () => {
    const target = spec.points.find(point => point.groupIds.includes('triangle-group'))!;
    const quietSpec = {
      ...spec,
      points: spec.points.map(point => point.id === target.id
        ? { ...point, selection: { ...point.selection, highlightable: false } }
        : point),
    };
    const plan = createScenePlan(quietSpec, {
      selectedIds: [target.id],
      highlightedIds: [target.id, 'triangle-group'],
    });
    expect(plan.find(entry => entry.item.id === target.id)).toMatchObject({ highlighted: true, selected: true });
  });

  it('fits, zooms and recovers objects outside the persisted viewport', () => {
    expect(offscreenItemIds(spec)).toContain('pFar');
    const fitted = fitViewport(spec);
    expect(fitted[2]).toBeGreaterThan(12);
    const zoomed = zoomViewport(spec, spec.viewport.bounds, 2);
    expect(zoomed[2] - zoomed[0]).toBeLessThan(spec.viewport.bounds[2] - spec.viewport.bounds[0]);
    expect(recoverViewport(spec, ['pFar'])).toEqual(fitViewport(spec, ['pFar']));
  });

  it('separates topological construction order from visual layer order', () => {
    const derivedSpec = {
      ...spec,
      elements: [
        ...spec.elements,
        {
          ...spec.elements[0],
          id: 'lineAfterMidpoint',
          label: 'Perpendicular por el punto medio',
          kind: 'perpendicular' as const,
          refs: ['pA', 'pB', 'midAB'],
          order: -10,
          groupIds: [],
        },
        {
          ...spec.elements[0],
          id: 'midAB',
          label: 'Punto medio AB',
          kind: 'midpoint' as const,
          refs: ['pA', 'pB'],
          order: 100,
          groupIds: [],
        },
      ],
    };
    const visualIds = createScenePlan(derivedSpec).map(entry => entry.item.id);
    const constructionIds = createSceneConstructionPlan(derivedSpec).map(entry => entry.item.id);
    expect(visualIds.indexOf('lineAfterMidpoint')).toBeLessThan(visualIds.indexOf('midAB'));
    expect(constructionIds.indexOf('midAB')).toBeLessThan(constructionIds.indexOf('lineAfterMidpoint'));
  });

  it('keeps reciprocal drag attractors out of the construction order', () => {
    const segment = spec.elements.find(item => item.id === 'segAB')!;
    const reciprocalSpec = {
      ...spec,
      points: spec.points.map(point => {
        if (point.id === 'pA') return { ...point, attractorIds: ['lineAfterMidpoint'] };
        if (point.id === 'pB') return { ...point, attractorIds: ['segCA'] };
        return point;
      }),
      elements: [
        ...spec.elements,
        { ...segment, id: 'midAB', label: 'Punto medio AB', kind: 'midpoint' as const, refs: ['pA', 'pB'], order: 100 },
        { ...segment, id: 'lineAfterMidpoint', label: 'Mediatriz AB', kind: 'perpendicular' as const, refs: ['pA', 'pB', 'midAB'], order: -10 },
        { ...segment, id: 'segCA', label: 'Segmento CA', refs: ['pC', 'pA'], order: 90 },
      ],
      dependencies: [
        { sourceId: 'lineAfterMidpoint', targetId: 'pA', relation: 'constraint' as const },
        { sourceId: 'segCA', targetId: 'pB', relation: 'constraint' as const },
      ],
    };

    const constructionIds = createSceneConstructionPlan(reciprocalSpec).map(entry => entry.item.id);

    expect(constructionIds.indexOf('midAB')).toBeLessThan(constructionIds.indexOf('lineAfterMidpoint'));
    expect(new Set(constructionIds).size).toBe(constructionIds.length);
    expect(constructionIds).toHaveLength(reciprocalSpec.points.length + reciprocalSpec.elements.length + reciprocalSpec.sliders.length);
  });

  it('computes exact equilateral magnetic targets for every triangle vertex', () => {
    const oppositeVertices: Record<string, [string, string]> = {
      A: ['B', 'C'],
      B: ['A', 'C'],
      C: ['A', 'B'],
    };
    for (const pointId of ['A', 'B', 'C']) {
      const point = triangulo.points.find(item => item.id === pointId)!;
      const equilateralTarget = resolvePointCoordinates(triangulo, point.attractorIds![0])!;
      const [firstId, secondId] = oppositeVertices[pointId];
      const first = resolvePointCoordinates(triangulo, firstId)!;
      const second = resolvePointCoordinates(triangulo, secondId)!;
      const targetToFirst = Math.hypot(equilateralTarget.x - first.x, equilateralTarget.y - first.y);
      const targetToSecond = Math.hypot(equilateralTarget.x - second.x, equilateralTarget.y - second.y);
      const oppositeSide = Math.hypot(second.x - first.x, second.y - first.y);
      expect(targetToFirst).toBeCloseTo(oppositeSide, 10);
      expect(targetToSecond).toBeCloseTo(oppositeSide, 10);
    }
  });

  it('treats a point with the fixed constraint as immovable scene state', () => {
    const fixedSpec = {
      ...spec,
      points: spec.points.map((point, index) => index === 0 ? { ...point, fixed: false, constraint: 'fixed' as const } : point),
    };
    const fixedPoint = createScenePlan(fixedSpec).find(entry => entry.item.id === fixedSpec.points[0].id);
    expect(fixedPoint?.locked).toBe(true);
  });

  it('orders items by within-layer rank instead of raw order magnitudes', () => {
    const layeredSpec = {
      ...spec,
      points: spec.points.map((point, index) => ({ ...point, order: (index + 1) * 100_000 })),
      elements: spec.elements.map((element, index) => ({ ...element, order: (index + 1) * 100_000 })),
    };
    const plan = createScenePlan(layeredSpec);
    const geometryLayerOrder = layeredSpec.layers.find(layer => layer.id === 'geometry')?.order ?? 0;
    const geometryItems = plan.filter(entry => entry.item.layerId === 'geometry');
    expect(geometryItems.every((entry, index, items) => index === 0 || entry.visualOrder >= items[index - 1].visualOrder)).toBe(true);
    expect(geometryItems.at(-1)?.visualOrder).toBeLessThan((geometryLayerOrder + 1) * 10_000);
  });
});
