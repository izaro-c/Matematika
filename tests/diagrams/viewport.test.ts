import { describe, expect, it } from 'vitest';
import fixture from '../fixtures/diagrams/diagram-spec.json';
import {computeAutoFitBounds,
  fitVisibleItemsAtStep,
  normalizeViewportBounds,
  offscreenVisibleItemIds,
  resolveHomeViewport,
  resolveInitialCamera,
  unionBounds,
  type DiagramSpec,
  type PointObject} from '@/diagrams/public';

const baseSpec = fixture as DiagramSpec;

function makeSpec(overrides: Partial<DiagramSpec> = {}): DiagramSpec {
  return { ...baseSpec, ...overrides };
}

function pointSpec(id: string, x: number, y: number, visible = true): PointObject {
  return {
    id,
    label: id,
    objectType: 'point',
    definition: { type: 'coordinates', x, y },
    mobility: { type: 'free' },
    color: 'terracota',
    layerId: 'geometry',
    order: 10,
    visible,
    locked: false,
    groupIds: [],
    target: false,
    selection: { selectable: true, ariaLabel: id, role: 'primary' },
  };
}

describe('diagram viewport semantics', () => {
  it('normalizes and converts viewport limits', () => {
    expect(normalizeViewportBounds([-2, 2, 2, -2])).toEqual([-2, 2, 2, -2]);
    expect(normalizeViewportBounds([2, 2, -2, -2])).toBeNull();
  });

  it('uses configured bounds as camera authority and home as reset target', () => {
    const spec = makeSpec({
      viewport: {
        bounds: [-2, 2, 2, -2],
        home: [-5, 5, 5, -5],
        minZoom: 0.2,
        maxZoom: 12,
        padding: 0.16,
      },
    });
    expect(resolveInitialCamera(spec)).toEqual([-2, 2, 2, -2]);
    expect(resolveHomeViewport(spec)).toEqual([-5, 5, 5, -5]);
  });

  it('does not include offscreen items that are never visible in any step', () => {
    const spec = makeSpec({
      viewport: { ...baseSpec.viewport, bounds: [-2, 2, 2, -2], padding: 0.1 },
      objects: [
        pointSpec('pNear', 0, 0, true),
        pointSpec('pFarHidden', 50, 50, true),
        pointSpec('pLater', 4, 4, false),
      ],
      steps: [
        { id: 'step1', label: 'Paso 1', description: 'Base', visibleTargets: ['pNear'] },
        { id: 'step2', label: 'Paso 2', description: 'Aparece pLater', visibleTargets: ['pNear', 'pLater'], objectStates: { pLater: { visible: true } } },
      ],
    });

    const fitted = computeAutoFitBounds(spec, 0);
    expect(fitted).not.toBeNull();
    expect(fitted![0]).toBeLessThanOrEqual(0);
    expect(fitted![2]).toBeGreaterThanOrEqual(4);
    expect(fitted![2]).toBeLessThan(20);
  });

  it('includes elements visible only in an intermediate step', () => {
    const spec = makeSpec({
      objects: [pointSpec('pA', 0, 0), pointSpec('pMid', 6, 0, false)],
      steps: [
        { id: 's1', label: '1', description: 'A', visibleTargets: ['pA'] },
        { id: 's2', label: '2', description: 'Mid', visibleTargets: ['pA', 'pMid'], objectStates: { pMid: { visible: true } } },
        { id: 's3', label: '3', description: 'A again', visibleTargets: ['pA'] },
      ],
    });
    const fitted = computeAutoFitBounds(spec, 0);
    expect(fitted![2]).toBeGreaterThanOrEqual(6);
  });

  it('ignores permanently hidden layers and groups', () => {
    const hiddenLayerSpec = makeSpec({
      layers: [
        { id: 'hidden', label: 'Oculta', order: 0, visible: false, locked: false },
        { id: 'geometry', label: 'Geometría', order: 1, visible: true, locked: false },
      ],
      objects: [
        { ...pointSpec('pHiddenLayer', 20, 20), layerId: 'hidden' },
        pointSpec('pVisible', 0, 0),
      ],
      steps: [{ id: 's1', label: '1', description: 'x', visibleTargets: ['pHiddenLayer', 'pVisible'] }],
    });
    const fitted = computeAutoFitBounds(hiddenLayerSpec, 0);
    expect(fitted![2]).toBeLessThan(5);

    const hiddenGroupSpec = makeSpec({
      groups: [{
        id: 'hidden-group',
        label: 'Oculto',
        memberIds: ['pGrouped'],
        visible: false,
        locked: false,
        selection: { selectable: true, ariaLabel: 'g', role: 'primary' },
      }],
      objects: [
        { ...pointSpec('pGrouped', 30, 30), groupIds: ['hidden-group'] },
        pointSpec('pVisible', 0, 0),
      ],
      steps: [{ id: 's1', label: '1', description: 'x', visibleTargets: ['pGrouped', 'pVisible'] }],
    });
    expect(computeAutoFitBounds(hiddenGroupSpec, 0)![2]).toBeLessThan(5);
  });

  it('respects explicit step visibility overrides over base visibility', () => {
    const spec = makeSpec({
      objects: [pointSpec('pBaseHidden', 3, 3, false)],
      steps: [{
        id: 's1',
        label: '1',
        description: 'show',
        visibleTargets: ['pBaseHidden'],
        objectStates: { pBaseHidden: { visible: true } },
      }],
    });
    const fitted = computeAutoFitBounds(spec, 0);
    expect(fitted).not.toBeNull();
    expect(fitted![2]).toBeGreaterThanOrEqual(3);
  });

  it('returns null auto-fit when no element is visible', () => {
    const spec = makeSpec({
      objects: [pointSpec('pHidden', 0, 0, false)],
      steps: [{ id: 's1', label: '1', description: 'x', visibleTargets: [] }],
    });
    expect(computeAutoFitBounds(spec)).toBeNull();
  });

  it('applies padding once to the global union', () => {
    const bounds = unionBounds([[-1, 1, 1, -1], [2, 4, 4, 2]]);
    expect(bounds).toEqual([-1, 4, 4, -1]);
    const spec = makeSpec({
      objects: [pointSpec('pA', -1, 0), pointSpec('pB', 3, 3)],
      steps: [
        { id: 's1', label: '1', description: 'A', visibleTargets: ['pA'] },
        { id: 's2', label: '2', description: 'B', visibleTargets: ['pB'] },
      ],
      viewport: { ...baseSpec.viewport, padding: 0.1 },
    });
    const fitted = computeAutoFitBounds(spec);
    expect(fitted![0]).toBeCloseTo(-1.4, 5);
    expect(fitted![2]).toBeCloseTo(3.4, 5);
  });

  it('detects only currently visible offscreen items for recovery', () => {
    const spec = makeSpec({
      viewport: { ...baseSpec.viewport, bounds: [-2, 2, 2, -2] },
      objects: [pointSpec('pNear', 0, 0), pointSpec('pFar', 20, 20)],
      steps: [
        { id: 's1', label: '1', description: 'near', visibleTargets: ['pNear'] },
        { id: 's2', label: '2', description: 'far', visibleTargets: ['pFar'] },
      ],
    });
    expect(offscreenVisibleItemIds(spec, [-2, 2, 2, -2], 's1')).toEqual([]);
    expect(offscreenVisibleItemIds(spec, [-2, 2, 2, -2], 's2')).toContain('pFar');
    const recovered = fitVisibleItemsAtStep(spec, 's2', 0);
    expect(recovered![2]).toBeGreaterThanOrEqual(20);
  });

  it('regression: far hidden auxiliary is ignored while later visible element is included', () => {
    const spec = makeSpec({
      viewport: { bounds: [-2, 2, 2, -2], home: [-2, 2, 2, -2], minZoom: 0.2, maxZoom: 12, padding: 0.1 },
      objects: [
        pointSpec('pMain', 0, 0, true),
        pointSpec('pAuxFar', 50, 50, true),
        pointSpec('pLater', 3, 3, false),
      ],
      steps: [
        { id: 'initial', label: 'Inicio', description: 'Principal', visibleTargets: ['pMain'], objectStates: { pAuxFar: { visible: false } } },
        { id: 'reveal', label: 'Revelar', description: 'Aparece pLater', visibleTargets: ['pMain', 'pLater'], objectStates: { pLater: { visible: true }, pAuxFar: { visible: false } } },
      ],
    });

    const fitted = computeAutoFitBounds(spec, 0);
    expect(fitted).not.toBeNull();
    expect(fitted![2]).toBeGreaterThanOrEqual(3);
    expect(fitted![2]).toBeLessThan(10);
  });
});
