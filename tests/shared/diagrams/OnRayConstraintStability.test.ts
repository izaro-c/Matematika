/**
 * Relación `on` sobre semirrecta vía relaciones geométricas combinadas.
 *
 * Debe comportarse igual que un `glider` directo: JSXGraph mantiene la posición
 * en el soporte cuando se mueven otros objetos. El motor de restricciones no
 * debe re-resolver pasivamente esos puntos (eso sobrescribía al glider).
 */
import { describe, expect, it } from 'vitest';
import { diagramConstraint, element, point } from '../../../src/features/editor/diagrams/model/diagramElements';
import {
  constrainPointCoordinates,
  onSupportTargetId,
  resolvePointCoordinates,
  withMovedPoint,
  withResolvedPointConstraints,
} from '../../../src/shared/diagrams/spec/scene';
import type { VisualDiagramModel } from '../../../src/features/editor/diagrams/model/types';

const C = { x: 0, y: 0 };
const DIR0 = { x: 3, y: 0 };
const D0 = { x: 5, y: 0 };

function rayOnSupportModel(): VisualDiagramModel {
  return {
    version: 2,
    renderer: 'matematika-diagram-renderer-v2',
    title: 'Punto sobre semirrecta (on)',
    componentId: 'on-ray-test',
    category: 'Demos',
    mode: 'simulation',
    axis: false,
    grid: false,
    viewport: { bounds: [-8, 8, 8, -8], home: [-8, 8, 8, -8], minZoom: 0.2, maxZoom: 8, padding: 0.1 },
    layers: [{ id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false }],
    groups: [],
    points: [
      point('pC', 'C', C.x, C.y),
      point('pDir', 'Dir', DIR0.x, DIR0.y),
      {
        ...point('pD', 'D', D0.x, D0.y, false, 'terracota', 'constrained'),
        constraintIds: ['onRay'],
      },
    ],
    elements: [
      element('rayCD', 'Semirrecta', 'ray', ['pC', 'pDir'], 'pavo'),
    ],
    sliders: [],
    steps: [{ id: 'initial', label: 'Inicio', description: '', visibleTargets: ['pC', 'pDir', 'pD', 'rayCD'], durationMs: 0 }],
    constraints: [
      diagramConstraint('onRay', 'Sobre semirrecta', 'on', ['pD', 'rayCD']),
    ],
    note: '',
    extensions: {},
  };
}

function gliderOnRayModel(): VisualDiagramModel {
  const base = rayOnSupportModel();
  const pD = base.points.find(item => item.id === 'pD')!;
  return {
    ...base,
    points: [
      ...base.points.filter(item => item.id !== 'pD'),
      { ...pD, constraint: 'glider', gliderTarget: 'rayCD', constraintIds: undefined },
    ],
    constraints: [],
  };
}

describe('restricción on sobre semirrecta (relaciones geométricas combinadas)', () => {
  it('expone el mismo soporte de deslizamiento que un glider directo', () => {
    const constrained = rayOnSupportModel().points.find(item => item.id === 'pD')!;
    const glider = gliderOnRayModel().points.find(item => item.id === 'pD')!;
    expect(onSupportTargetId(rayOnSupportModel(), constrained)).toBe('rayCD');
    expect(onSupportTargetId(gliderOnRayModel(), glider)).toBe('rayCD');
  });

  it('no re-resuelve pasivamente el punto (igual que un glider)', () => {
    const model = rayOnSupportModel();
    const before = resolvePointCoordinates(model, 'pD')!;
    const rotated = {
      ...model,
      points: model.points.map(item => item.id === 'pDir' ? { ...item, x: 0, y: 3 } : item),
    };
    const resolved = withResolvedPointConstraints(rotated);
    expect(resolvePointCoordinates(resolved, 'pD')).toEqual(before);
  });

  it('mantiene la posición viva del glider al mover el soporte (simula liveSpec)', () => {
    const model = rayOnSupportModel();
    const liveD = { x: 0, y: 5 / 3 * 3 };
    const liveSpec = {
      ...model,
      points: model.points.map(item => item.id === 'pD' ? { ...item, ...liveD } : item),
    };
    const next = withMovedPoint(liveSpec, 'pDir', 0, 3);
    expect(resolvePointCoordinates(next, 'pD')).toEqual(liveD);
  });

  it('sigue proyectando al arrastrar el propio punto restringido', () => {
    const model = rayOnSupportModel();
    const pD = model.points.find(item => item.id === 'pD')!;
    const projected = constrainPointCoordinates(model, pD, { x: 2, y: 4 });
    expect(projected.x).toBeCloseTo(2, 5);
    expect(projected.y).toBeCloseTo(0, 5);
  });

  it('un glider directo y una relación on única comparten la misma resolución activa', () => {
    const constrained = rayOnSupportModel().points.find(item => item.id === 'pD')!;
    const glider = gliderOnRayModel().points.find(item => item.id === 'pD')!;
    const coords = { x: 2, y: 4 };
    expect(constrainPointCoordinates(rayOnSupportModel(), constrained, coords))
      .toEqual(constrainPointCoordinates(gliderOnRayModel(), glider, coords));
  });
});
