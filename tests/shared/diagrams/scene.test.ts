import { describe, expect, it } from 'vitest';
import v2Fixture from '../../fixtures/diagrams/diagram-spec-v2.json';
import {
  createScenePlan,
  createSceneConstructionPlan,
  fitViewport,
  migrateDiagramSpec,
  offscreenItemIds,
  recoverViewport,
  zoomViewport,
} from '../../../src/shared/diagrams/public';

const spec = migrateDiagramSpec(v2Fixture).spec;

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

  it('treats a point with the fixed constraint as immovable scene state', () => {
    const fixedSpec = {
      ...spec,
      points: spec.points.map((point, index) => index === 0 ? { ...point, fixed: false, constraint: 'fixed' as const } : point),
    };
    const fixedPoint = createScenePlan(fixedSpec).find(entry => entry.item.id === fixedSpec.points[0].id);
    expect(fixedPoint?.locked).toBe(true);
  });
});
