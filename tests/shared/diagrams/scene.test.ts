import { describe, expect, it } from 'vitest';
import v2Fixture from '../../fixtures/diagrams/diagram-spec-v2.json';
import {
  createScenePlan,
  createSceneConstructionPlan,
  fitViewport,
  migrateDiagramSpec,
  offscreenItemIds,
  projectDiagramSpecV3ToV2,
  recoverViewport,
  resolvePointCoordinates,
  zoomViewport,
} from '../../../src/shared/diagrams/public';
import { TrianguloSpec } from '../../../src/widgets/diagrams/Definiciones/Triangulo';

const spec = projectDiagramSpecV3ToV2(migrateDiagramSpec(v2Fixture).spec);

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
      const point = TrianguloSpec.points.find(item => item.id === pointId)!;
      const equilateralTarget = resolvePointCoordinates(TrianguloSpec, point.attractorIds![0])!;
      const [firstId, secondId] = oppositeVertices[pointId];
      const first = resolvePointCoordinates(TrianguloSpec, firstId)!;
      const second = resolvePointCoordinates(TrianguloSpec, secondId)!;
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
});
