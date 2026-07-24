/**
 * Combinación `on` + `sameSide`: cada una se comporta como sola.
 * - `on`: el glider (JSXGraph) mantiene el punto en el rayo; el motor no lo re-proyecta.
 * - `sameSide`: solo actúa si el punto saldría del semiplano, y sin sacarlo del rayo.
 */
import { describe, expect, it } from 'vitest';
import { diagramConstraint, element, point } from '../../../src/features/editor/diagrams/model/diagramElements';
import {
  constrainPointCoordinates,
  withMovedPoint,
} from '../../../src/shared/diagrams/spec/scene';
import { projectDiagramSpecV3ToV2 } from '../../../src/shared/diagrams/spec/v3Compatibility';
import type { VisualDiagramModel } from '../../../src/features/editor/diagrams/model/types';
import { DemoAnguloExternoSpec } from '@/widgets/diagrams/Demos/DemoAnguloExterno';
import {
  distanceToSupport,
  moveSupportPoint,
  placeGliderOnSupport,
  rayParameter,
} from '../../helpers/diagramRay';

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

describe('restricción on + sameSide sobre semirrecta', () => {
  it('mantiene el punto sobre el soporte al arrastrar', () => {
    const model = rayOnSupportWithSameSideModel();
    const pD = model.points.find(item => item.id === 'pD')!;
    const result = constrainPointCoordinates(model, pD, { x: 5, y: 2 });
    expect(distanceToSupport(model, 'pD', 'rayBC', result)).toBeLessThan(1e-8);
  });

  it('desliza a lo largo del rayo (parámetro monótono) hasta la frontera del semiplano', () => {
    const model = rayOnSupportWithSameSideModel();
    const pD = model.points.find(item => item.id === 'pD')!;
    const path = Array.from({ length: 12 }, (_, index) => ({ x: 1 + index * 0.25, y: 0.1 }));
    let previousT = 0;
    path.forEach((coords) => {
      const next = constrainPointCoordinates(model, pD, coords);
      expect(distanceToSupport(model, 'pD', 'rayBC', next)).toBeLessThan(1e-8);
      const frame = { origin: { x: 0, y: 0 }, direction: { x: 3, y: 0 } };
      const t = ((next.x - frame.origin.x) * frame.direction.x + (next.y - frame.origin.y) * frame.direction.y)
        / (frame.direction.x * frame.direction.x + frame.direction.y * frame.direction.y);
      expect(t).toBeGreaterThanOrEqual(previousT - 1e-8);
      previousT = t;
    });
  });

  it('reproduce el caso real de DemoAnguloExterno (pD sobre rayCaux)', () => {
    const v2 = demoAnguloExternoV2();
    const pD = v2.points.find(item => item.id === 'pD')!;
    const result = constrainPointCoordinates(v2, pD, { x: 6, y: 1 });
    expect(distanceToSupport(v2, 'pD', 'rayCaux', result)).toBeLessThan(1e-8);
  });

  it('no re-proyecta al girar el rayo si el punto sigue en el semiplano (como on solo)', () => {
    const v2 = demoAnguloExternoV2();
    const pC0 = v2.points.find(item => item.id === 'pC')!;
    const after = moveSupportPoint(v2, 'pC', pC0.x + 0.3, pC0.y - 0.2, 'pD', 'pC', 'paux');
    const drafted = {
      ...v2,
      points: v2.points.map(item => item.id === 'pC' ? { ...item, x: pC0.x + 0.3, y: pC0.y - 0.2 } : item),
    };
    const gliderD = placeGliderOnSupport(v2, drafted, 'pD', 'pC', 'paux').points.find(item => item.id === 'pD')!;
    const pD = after.points.find(item => item.id === 'pD')!;
    expect(pD.x).toBeCloseTo(gliderD.x, 8);
    expect(pD.y).toBeCloseTo(gliderD.y, 8);
    expect(distanceToSupport(after, 'pD', 'rayCaux', pD)).toBeLessThan(1e-8);
  });

  it('mantiene el parámetro del glider al mover pC o paux mientras el rayo lo permite', () => {
    let v2 = demoAnguloExternoV2();
    const initialT = rayParameter(v2, 'pD', 'pC', 'paux');
    const pC0 = v2.points.find(item => item.id === 'pC')!;

    const cPath = Array.from({ length: 12 }, (_, index) => ({
      x: pC0.x + index * 0.05,
      y: pC0.y - index * 0.02,
    }));
    for (const target of cPath) {
      v2 = moveSupportPoint(v2, 'pC', target.x, target.y, 'pD', 'pC', 'paux');
      const pD = v2.points.find(item => item.id === 'pD')!;
      expect(distanceToSupport(v2, 'pD', 'rayCaux', pD)).toBeLessThan(1e-8);
      expect(Math.abs(rayParameter(v2, 'pD', 'pC', 'paux') - initialT)).toBeLessThan(1e-5);
    }
  });

  it('clampa pD en C al arrastrarlo más allá del origen de su soporte (DemoAnguloExterno, pD)', () => {
    // pD no lleva restricción `sameSide`: su soporte real es `rayCaux`, una
    // semirrecta auxiliar con origen en C (no `rayBC`). Ese origen es lo que
    // garantiza B*C*D sin necesitar un semiplano adicional: arrastrar pD
    // "hacia atrás" lo clampa en C, el mínimo del parámetro del rayo.
    const v2 = demoAnguloExternoV2();
    const pC = v2.points.find(item => item.id === 'pC')!;
    const paux = v2.points.find(item => item.id === 'paux')!;
    const direction = { x: paux.x - pC.x, y: paux.y - pC.y };
    const behindC = { x: pC.x - direction.x * 0.2, y: pC.y - direction.y * 0.2 };
    const clamped = withMovedPoint(v2, 'pD', behindC.x, behindC.y);
    const pD = clamped.points.find(item => item.id === 'pD')!;
    expect(pD.x).toBeCloseTo(pC.x, 8);
    expect(pD.y).toBeCloseTo(pC.y, 8);
  });
});
