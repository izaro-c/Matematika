/**
 * Relación `on` sobre semirrecta vía relaciones geométricas combinadas.
 *
 * Debe comportarse igual que un `glider` directo: JSXGraph mantiene la posición
 * en el soporte cuando se mueven otros objetos. El motor de restricciones no
 * debe re-resolver pasivamente esos puntos (eso sobrescribía al glider).
 */
import { describe, expect, it } from 'vitest';
import { element, point, withPointMode } from '../../src/fixed-pages/editor/diagrams/model';
import { movedTo, pointById, relationFor, sceneSpec } from '../helpers/diagramSpec';
import {
  constrainPointCoordinates,
  onSupportTargetId,
  resolvePointCoordinates,
  withMovedPoint,
  withResolvedPointConstraints,
} from '@/diagrams/geometry/layout/scene';
import type { VisualDiagramModel } from '../../src/fixed-pages/editor/diagrams/model/types';

const C = { x: 0, y: 0 };
const DIR0 = { x: 3, y: 0 };
const D0 = { x: 5, y: 0 };

function rayOnSupportModel(): VisualDiagramModel {
  return sceneSpec({
    title: 'Punto sobre semirrecta (on)',
    componentId: 'on-ray-test',
    viewport: { bounds: [-8, 8, 8, -8], home: [-8, 8, 8, -8], minZoom: 0.2, maxZoom: 8, padding: 0.1 },
    objects: [
      point('pC', 'C', C.x, C.y),
      point('pDir', 'Dir', DIR0.x, DIR0.y),
      withPointMode(point('pD', 'D', D0.x, D0.y), 'constrained', { relationIds: ['onRay'] }),
      element('rayCD', 'Semirrecta', 'ray', ['pC', 'pDir'], 'pavo'),
    ],
    steps: [{ id: 'initial', label: 'Inicio', description: '', visibleTargets: ['pC', 'pDir', 'pD', 'rayCD'], durationMs: 0 }],
    relations: [relationFor('on', 'onRay', 'Sobre semirrecta', ['pD', 'rayCD'])],
  });
}

function gliderOnRayModel(): VisualDiagramModel {
  const base = rayOnSupportModel();
  return {
    ...base,
    objects: base.objects.map(item => item.id === 'pD' ? withPointMode(pointById(base, 'pD'), 'glider', { gliderTarget: 'rayCD' }) : item),
    relations: [],
  };
}

describe('restricción on sobre semirrecta (relaciones geométricas combinadas)', () => {
  it('expone el mismo soporte de deslizamiento que un glider directo', () => {
    const constrained = pointById(rayOnSupportModel(), 'pD');
    const glider = pointById(gliderOnRayModel(), 'pD');
    expect(onSupportTargetId(rayOnSupportModel(), constrained)).toBe('rayCD');
    expect(onSupportTargetId(gliderOnRayModel(), glider)).toBe('rayCD');
  });

  it('no re-resuelve pasivamente el punto (igual que un glider)', () => {
    const model = rayOnSupportModel();
    const before = resolvePointCoordinates(model, 'pD')!;
    const rotated = movedTo(model, 'pDir', 0, 3);
    const resolved = withResolvedPointConstraints(rotated);
    expect(resolvePointCoordinates(resolved, 'pD')).toEqual(before);
  });

  it('mantiene la posición viva del glider al mover el soporte (simula liveSpec)', () => {
    const model = rayOnSupportModel();
    const liveD = { x: 0, y: 5 / 3 * 3 };
    const liveSpec = movedTo(model, 'pD', liveD.x, liveD.y);
    const next = withMovedPoint(liveSpec, 'pDir', 0, 3);
    expect(resolvePointCoordinates(next, 'pD')).toEqual(liveD);
  });

  it('sigue proyectando al arrastrar el propio punto restringido', () => {
    const model = rayOnSupportModel();
    const pD = pointById(model, 'pD');
    const projected = constrainPointCoordinates(model, pD, { x: 2, y: 4 });
    expect(projected.x).toBeCloseTo(2, 5);
    expect(projected.y).toBeCloseTo(0, 5);
  });

  it('un glider directo y una relación on única comparten la misma resolución activa', () => {
    const constrained = pointById(rayOnSupportModel(), 'pD');
    const glider = pointById(gliderOnRayModel(), 'pD');
    const coords = { x: 2, y: 4 };
    expect(constrainPointCoordinates(rayOnSupportModel(), constrained, coords))
      .toEqual(constrainPointCoordinates(gliderOnRayModel(), glider, coords));
  });
});
