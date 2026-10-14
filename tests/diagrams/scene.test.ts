import { describe, expect, it } from 'vitest';
import fixture from '../fixtures/diagrams/diagram-spec.json';
import {
  createScenePlan,
  createSceneConstructionPlan,
  fitViewport,
  offscreenItemIds,
  recoverViewport,
  resolveDiagramScene,
  resolvePointCoordinates,
  zoomViewport,
  type DiagramObject,
  type DiagramSpec,
  type PointObject,
} from '@/diagrams/public';
import { element, point, withPointMode } from '@/fixed-pages/editor/diagrams/model';
import { TrianguloSpec } from '../../content/diagrams/Definiciones/Triangulo';
import { CuadrilateroSpec } from '../../content/diagrams/Definiciones/Cuadrilatero';
import { findById } from '../helpers/diagramSpec';

const spec = resolveDiagramScene(fixture as unknown as DiagramSpec);
const triangulo = TrianguloSpec;

function withObjects(objects: DiagramObject[]): DiagramSpec {
  return { ...spec, objects: [...spec.objects, ...objects] };
}

describe('shared diagram scene semantics', () => {
  it('combines layer order, steps, visibility, lock and selection deterministically', () => {
    const plan = createScenePlan(spec, { activeStepId: 'step1', selectedIds: ['triangle-group'], highlightedIds: ['segAB'] });
    expect(plan.map(entry => entry.item.id).indexOf('segAB')).toBeLessThan(plan.map(entry => entry.item.id).indexOf('polyABC'));
    expect(plan.find(entry => entry.item.id === 'segAB')).toMatchObject({ locked: true, highlighted: true, visible: true });
    expect(plan.find(entry => entry.item.id === 'polyABC')?.selected).toBe(true);
    expect(plan.find(entry => entry.item.id === 'pFar')?.visible).toBe(false);
  });

  it('lets explicit references and selection override the local hover opt-out', () => {
    const target = spec.objects.find(object => object.objectType === 'point' && object.groupIds.includes('triangle-group'))!;
    const quietSpec = {
      ...spec,
      objects: spec.objects.map(object => object.id === target.id
        ? { ...object, selection: { ...object.selection, highlightable: false } }
        : object),
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
    const derivedSpec = withObjects([
      { ...element('lineAfterMidpoint', 'Perpendicular por el punto medio', 'perpendicular', ['pA', 'pB', 'midAB'], 'pavo'), order: -10 },
      { ...element('midAB', 'Punto medio AB', 'midpoint', ['pA', 'pB'], 'terracota'), order: 100 },
    ]);
    const visualIds = createScenePlan(derivedSpec).map(entry => entry.item.id);
    const constructionIds = createSceneConstructionPlan(derivedSpec).map(entry => entry.item.id);
    expect(visualIds.indexOf('lineAfterMidpoint')).toBeLessThan(visualIds.indexOf('midAB'));
    expect(constructionIds.indexOf('midAB')).toBeLessThan(constructionIds.indexOf('lineAfterMidpoint'));
  });

  it('keeps reciprocal drag attractors out of the construction order', () => {
    const reciprocalSpec: DiagramSpec = {
      ...spec,
      objects: [
        ...spec.objects.map(object => {
          if (object.id === 'pA' && object.objectType === 'point') return { ...object, interaction: { attractorIds: ['lineAfterMidpoint'] } };
          if (object.id === 'pB' && object.objectType === 'point') return { ...object, interaction: { attractorIds: ['segCA'] } };
          return object;
        }),
        { ...element('midAB', 'Punto medio AB', 'midpoint', ['pA', 'pB'], 'terracota'), order: 100 },
        { ...element('lineAfterMidpoint', 'Mediatriz AB', 'perpendicular', ['pA', 'pB', 'midAB'], 'pavo'), order: -10 },
        { ...element('segCA', 'Segmento CA', 'segment', ['pC', 'pA'], 'carbon'), order: 90 },
      ],
    };

    const constructionIds = createSceneConstructionPlan(reciprocalSpec).map(entry => entry.item.id);

    expect(constructionIds.indexOf('midAB')).toBeLessThan(constructionIds.indexOf('lineAfterMidpoint'));
    expect(new Set(constructionIds).size).toBe(constructionIds.length);
    expect(constructionIds).toHaveLength(reciprocalSpec.objects.length);
  });

  it('computes exact equilateral magnetic targets for every triangle vertex', () => {
    const oppositeVertices: Record<string, [string, string]> = {
      A: ['B', 'C'],
      B: ['A', 'C'],
      C: ['A', 'B'],
    };
    for (const pointId of ['A', 'B', 'C']) {
      const vertex = findById<PointObject>(triangulo, pointId);
      const equilateralTarget = resolvePointCoordinates(triangulo, vertex.interaction!.attractorIds![0])!;
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
      objects: spec.objects.map(object => object.id === 'pA' && object.objectType === 'point' ? withPointMode(object as never, 'fixed') : object),
    };
    const fixedPoint = createScenePlan(fixedSpec).find(entry => entry.item.id === 'pA');
    expect(fixedPoint?.locked).toBe(true);
  });

  it('orders items by within-layer rank instead of raw order magnitudes', () => {
    const layeredSpec = {
      ...spec,
      objects: spec.objects.map((object, index) => ({ ...object, order: (index + 1) * 100_000 })),
    };
    const plan = createScenePlan(layeredSpec);
    const geometryLayerOrder = layeredSpec.layers.find(layer => layer.id === 'geometry')?.order ?? 0;
    const geometryItems = plan.filter(entry => entry.item.layerId === 'geometry');
    expect(geometryItems.every((entry, index, items) => index === 0 || entry.visualOrder >= items[index - 1].visualOrder)).toBe(true);
    expect(geometryItems.at(-1)?.visualOrder).toBeLessThan((geometryLayerOrder + 1) * 10_000);
  });

  it('excludes invisible reference points from bounds calculations', () => {
    const specWithInvisibleAux: DiagramSpec = {
      ...spec,
      objects: [
        point('pA', 'A', 0, 0),
        { ...point('pAux', 'Aux', 50, 100), visible: false },
        element('rayA', 'Rayo', 'ray', ['pA', 'pAux'], 'carbon'),
      ],
    };
    const bounds = fitViewport(specWithInvisibleAux);
    expect(bounds[1]).toBeLessThan(50);
    expect(bounds[2]).toBeLessThan(50);
  });

  it('constructs points before dependent segments and polygon in Cuadrilatero with mutual constraints', () => {
    const constructionIds = createSceneConstructionPlan(CuadrilateroSpec).map(entry => entry.item.id);
    const indexC = constructionIds.indexOf('C');
    const indexD = constructionIds.indexOf('D');
    const indexBC = constructionIds.indexOf('BC');
    const indexCD = constructionIds.indexOf('CD');
    const indexDA = constructionIds.indexOf('DA');
    const indexPoligono = constructionIds.indexOf('poligono');

    expect(indexC).toBeGreaterThanOrEqual(0);
    expect(indexD).toBeGreaterThanOrEqual(0);
    expect(indexBC).toBeGreaterThan(indexC);
    expect(indexCD).toBeGreaterThan(indexC);
    expect(indexCD).toBeGreaterThan(indexD);
    expect(indexDA).toBeGreaterThan(indexD);
    expect(indexPoligono).toBeGreaterThan(indexC);
    expect(indexPoligono).toBeGreaterThan(indexD);
  });
});
