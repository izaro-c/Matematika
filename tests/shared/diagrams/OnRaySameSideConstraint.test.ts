/**
 * Combinación `on` + `sameSide`: cada una se comporta como sola.
 * - `on`: el glider (JSXGraph) mantiene el punto en el rayo; el motor no lo re-proyecta.
 * - `sameSide`: solo actúa si el punto saldría del semiplano, y sin sacarlo del rayo.
 */
import { describe, expect, it } from 'vitest';
import { diagramConstraint, element, point } from '../../../src/features/editor/diagrams/model/diagramElements';
import {
  constrainPointCoordinates,
  projectPointToSupport,
  withMovedPoint,
} from '../../../src/shared/diagrams/spec/scene';
import { projectDiagramSpecV3ToV2 } from '../../../src/shared/diagrams/spec/v3Compatibility';
import type { VisualDiagramModel } from '../../../src/features/editor/diagrams/model/types';
import { DemoAnguloExternoSpec } from '@/widgets/diagrams/Demos/DemoAnguloExterno';

function demoAnguloExternoV2(): VisualDiagramModel {
  return projectDiagramSpecV3ToV2(DemoAnguloExternoSpec);
}

function rayOnSupportWithSameSideModel(): VisualDiagramModel {
  return {
    version: 2,
    renderer: 'matematika-diagram-renderer-v2',
    title: 'Ray + semiplano',
    componentId: 'on-ray-sameside-test',
    category: 'Demos',
    mode: 'simulation',
    axis: false,
    grid: false,
    viewport: { bounds: [-8, 8, 8, -8], home: [-8, 8, 8, -8], minZoom: 0.2, maxZoom: 8, padding: 0.1 },
    layers: [{ id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false }],
    groups: [],
    points: [
      point('pA', 'A', -2, 2),
      point('pB', 'B', 0, 0),
      point('pC', 'C', 3, 0),
      {
        ...point('pD', 'D', 2, 0.5, false, 'terracota', 'constrained'),
        constraintIds: ['onRay', 'sameSide'],
      },
    ],
    elements: [
      element('rayBC', 'Semirrecta', 'ray', ['pB', 'pC'], 'pavo'),
    ],
    sliders: [],
    steps: [{ id: 'initial', label: 'Inicio', description: '', visibleTargets: ['pA', 'pB', 'pC', 'pD', 'rayBC'], durationMs: 0 }],
    constraints: [
      diagramConstraint('onRay', 'Sobre semirrecta', 'on', ['pD', 'rayBC']),
      diagramConstraint('sameSide', 'Semiplano', 'sameSide', ['pD', 'pA', 'pC'], { side: 1 }),
    ],
    note: '',
    extensions: {},
  };
}

function distanceToRay(spec: VisualDiagramModel, pointId: string, result: { x: number; y: number }): number {
  const p = spec.points.find(item => item.id === pointId)!;
  const onRay = projectPointToSupport(spec, { ...p, constraint: 'glider', gliderTarget: 'rayBC' }, result);
  return Math.hypot(result.x - onRay.x, result.y - onRay.y);
}

/** Simula el glider JSXGraph: conserva el parámetro afín del punto sobre el rayo. */
function placeGliderOnRay(previous: VisualDiagramModel, next: VisualDiagramModel, pointId: string): VisualDiagramModel {
  const pPrev = previous.points.find(item => item.id === pointId)!;
  const pB0 = previous.points.find(item => item.id === 'pB')!;
  const pC0 = previous.points.find(item => item.id === 'pC')!;
  const pB1 = next.points.find(item => item.id === 'pB')!;
  const pC1 = next.points.find(item => item.id === 'pC')!;
  const dx0 = pC0.x - pB0.x;
  const dy0 = pC0.y - pB0.y;
  const len0 = dx0 * dx0 + dy0 * dy0 || 1;
  const t = Math.max(0, ((pPrev.x - pB0.x) * dx0 + (pPrev.y - pB0.y) * dy0) / len0);
  const dx1 = pC1.x - pB1.x;
  const dy1 = pC1.y - pB1.y;
  const glider = { x: pB1.x + t * dx1, y: pB1.y + t * dy1 };
  return {
    ...next,
    points: next.points.map(item => item.id === pointId ? { ...item, ...glider } : item),
  };
}

/**
 * Como useBoardLifecycle: el glider actualiza D sobre el rayo nuevo; el motor
 * solo aplica sameSide si hace falta.
 */
function moveSupportPoint(spec: VisualDiagramModel, pointId: string, x: number, y: number): VisualDiagramModel {
  const drafted = {
    ...spec,
    points: spec.points.map(item => item.id === pointId ? { ...item, x, y } : item),
  };
  const withGlider = placeGliderOnRay(spec, drafted, 'pD');
  return withMovedPoint(withGlider, pointId, x, y);
}

describe('restricción on + sameSide sobre semirrecta', () => {
  it('mantiene el punto sobre el soporte al arrastrar', () => {
    const model = rayOnSupportWithSameSideModel();
    const pD = model.points.find(item => item.id === 'pD')!;
    const result = constrainPointCoordinates(model, pD, { x: 5, y: 2 });
    expect(distanceToRay(model, 'pD', result)).toBeLessThan(1e-8);
  });

  it('desliza a lo largo del rayo (parámetro monótono) hasta la frontera del semiplano', () => {
    const model = rayOnSupportWithSameSideModel();
    const pD = model.points.find(item => item.id === 'pD')!;
    const path = Array.from({ length: 12 }, (_, index) => ({ x: 1 + index * 0.25, y: 0.1 }));
    let previousT = 0;
    path.forEach((coords) => {
      const next = constrainPointCoordinates(model, pD, coords);
      expect(distanceToRay(model, 'pD', next)).toBeLessThan(1e-8);
      const frame = { origin: { x: 0, y: 0 }, direction: { x: 3, y: 0 } };
      const t = ((next.x - frame.origin.x) * frame.direction.x + (next.y - frame.origin.y) * frame.direction.y)
        / (frame.direction.x * frame.direction.x + frame.direction.y * frame.direction.y);
      expect(t).toBeGreaterThanOrEqual(previousT - 1e-8);
      previousT = t;
    });
  });

  it('reproduce el caso real de DemoAnguloExterno (pD sobre rayBC)', () => {
    const v2 = demoAnguloExternoV2();
    const pD = v2.points.find(item => item.id === 'pD')!;
    const result = constrainPointCoordinates(v2, pD, { x: 6, y: 1 });
    const onRay = projectPointToSupport(v2, { ...pD, constraint: 'glider', gliderTarget: 'rayBC' }, result);
    expect(Math.hypot(result.x - onRay.x, result.y - onRay.y)).toBeLessThan(1e-8);
  });

  it('no re-proyecta al girar el rayo si el punto sigue en el semiplano (como on solo)', () => {
    const v2 = demoAnguloExternoV2();
    const pB0 = v2.points.find(item => item.id === 'pB')!;
    const after = moveSupportPoint(v2, 'pB', pB0.x + 0.3, pB0.y - 0.2);
    const drafted = {
      ...v2,
      points: v2.points.map(item => item.id === 'pB' ? { ...item, x: pB0.x + 0.3, y: pB0.y - 0.2 } : item),
    };
    const gliderD = placeGliderOnRay(v2, drafted, 'pD').points.find(item => item.id === 'pD')!;
    const pD = after.points.find(item => item.id === 'pD')!;
    expect(pD.x).toBeCloseTo(gliderD.x, 8);
    expect(pD.y).toBeCloseTo(gliderD.y, 8);
    expect(distanceToRay(after, 'pD', pD)).toBeLessThan(1e-8);
  });

  it('mantiene el parámetro del glider al mover pB o pC mientras el semiplano lo permite', () => {
    let v2 = demoAnguloExternoV2();
    const pD0 = v2.points.find(item => item.id === 'pD')!;
    const pB0 = v2.points.find(item => item.id === 'pB')!;
    const pC0 = v2.points.find(item => item.id === 'pC')!;
    const dx0 = pC0.x - pB0.x;
    const dy0 = pC0.y - pB0.y;
    const initialT = ((pD0.x - pB0.x) * dx0 + (pD0.y - pB0.y) * dy0) / (dx0 * dx0 + dy0 * dy0);

    const bPath = Array.from({ length: 12 }, (_, index) => ({
      x: pB0.x + index * 0.1,
      y: pB0.y - index * 0.06,
    }));
    for (const target of bPath) {
      v2 = moveSupportPoint(v2, 'pB', target.x, target.y);
      const pD = v2.points.find(item => item.id === 'pD')!;
      const pB = v2.points.find(item => item.id === 'pB')!;
      const pC = v2.points.find(item => item.id === 'pC')!;
      const dx = pC.x - pB.x;
      const dy = pC.y - pB.y;
      const t = ((pD.x - pB.x) * dx + (pD.y - pB.y) * dy) / (dx * dx + dy * dy);
      expect(distanceToRay(v2, 'pD', pD)).toBeLessThan(1e-8);
      expect(Math.abs(t - initialT)).toBeLessThan(1e-6);
    }
  });

  it('mantiene posición al arrastrar hacia el semiplano inválido (DemoAnguloExterno, pD)', () => {
    let v2 = demoAnguloExternoV2();
    const pD0 = v2.points.find(item => item.id === 'pD')!;
    v2 = withMovedPoint(v2, 'pD', pD0.x + 0.3, pD0.y + 0.4);
    const pD1 = v2.points.find(item => item.id === 'pD')!;
    const intoInvalid = withMovedPoint(v2, 'pD', pD1.x + 0.5, pD1.y - 2);
    const pD2 = intoInvalid.points.find(item => item.id === 'pD')!;
    expect(pD2.x).toBeCloseTo(pD1.x, 8);
    expect(pD2.y).toBeCloseTo(pD1.y, 8);
    expect(distanceToRay(intoInvalid, 'pD', pD2)).toBeLessThan(1e-8);
  });
});
