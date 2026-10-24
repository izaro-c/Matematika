/**
 * Movilidad `on-points`: el punto solo ocupa la posición de uno de sus
 * candidatos (salta al más cercano al arrastrarlo; el teclado los recorre).
 * Se prueba sobre el diagrama sagital de biyección, que la usa en cada punta.
 */
import { describe, expect, it } from 'vitest';
import {
  constrainPointCoordinates,
  nextCandidatePointInDirection,
  withMovedPoint,
} from '@/diagrams/geometry/layout/scene';
import { parseDiagramSpecV3, type DiagramSpecV3, type PointObject } from '@/diagrams/public';
import { pointMode, withPointMode } from '../../src/fixed-pages/editor/diagrams/model';
import { BiyeccionSagitalSpec } from '@content/diagrams/Definiciones/BiyeccionSagital';

function spec(): DiagramSpecV3 {
  return structuredClone(BiyeccionSagitalSpec) as DiagramSpecV3;
}

function pointById(scene: DiagramSpecV3, id: string): PointObject & { definition: { type: 'coordinates'; x: number; y: number } } {
  const found = scene.objects.find(object => object.id === id);
  if (found?.objectType !== 'point' || found.definition.type !== 'coordinates') throw new Error(`Falta el punto ${id}`);
  return found as PointObject & { definition: { type: 'coordinates'; x: number; y: number } };
}

function coordinatesOf(scene: DiagramSpecV3, id: string) {
  const { x, y } = pointById(scene, id).definition;
  return { x, y };
}

describe('movilidad on-points', () => {
  it('lleva el punto arrastrado al candidato más cercano', () => {
    const scene = spec();
    const target = coordinatesOf(scene, 'f1Llega1');
    const result = constrainPointCoordinates(scene, pointById(scene, 'hf1'), { x: target.x + 0.3, y: target.y + 0.2 });
    expect(result).toEqual(target);
  });

  it('salta al punto de reposo cuando se suelta cerca del origen', () => {
    const moved = withMovedPoint(spec(), 'hf1', -1.9, 0.9);
    expect(coordinatesOf(moved, 'hf1')).toEqual(coordinatesOf(moved, 'f1Reposo'));
  });

  it('recorre los candidatos con el teclado en la dirección pedida', () => {
    const scene = spec();
    const head = pointById(scene, 'hf1');
    expect(nextCandidatePointInDirection(scene, head, { x: 0, y: 1 })).toEqual(coordinatesOf(scene, 'f1Llega1'));
    expect(nextCandidatePointInDirection(scene, head, { x: -1, y: 0 })).toEqual(coordinatesOf(scene, 'f1Reposo'));
    expect(nextCandidatePointInDirection(scene, pointById(scene, 'hf3'), { x: 0, y: -1 })).toBeUndefined();
  });

  it('valida que los candidatos sean otros puntos del diagrama', () => {
    const scene = spec();
    expect(parseDiagramSpecV3(scene).success).toBe(true);
    const head = pointById(scene, 'hf1');
    head.mobility = { type: 'on-points', points: ['hf1'] };
    expect(parseDiagramSpecV3(scene).success).toBe(false);
    head.mobility = { type: 'on-points', points: ['noExiste'] };
    expect(parseDiagramSpecV3(scene).success).toBe(false);
  });

  it('el editor lo presenta como modo discreto y lo conserva', () => {
    const head = pointById(spec(), 'hf1');
    expect(pointMode(head)).toBe('discrete');
    const narrowed = withPointMode(head, 'discrete', { candidatePointIds: ['f1Llega2', 'f1Reposo'] });
    expect(narrowed.mobility).toEqual({ type: 'on-points', points: ['f1Llega2', 'f1Reposo'] });
    expect(withPointMode(head, 'discrete', { candidatePointIds: [] }).mobility).toEqual({ type: 'free' });
  });
});

describe('puntas de flecha en segmentos', () => {
  it('acepta start, end y both y rechaza otros valores', () => {
    const scene = spec();
    const arrow = scene.objects.find(object => object.id === 'flechaf1');
    if (arrow?.objectType !== 'path') throw new Error('Falta la flecha');
    expect(arrow.appearance?.arrow).toBe('end');
    for (const value of ['start', 'both'] as const) {
      arrow.appearance = { ...arrow.appearance, arrow: value };
      expect(parseDiagramSpecV3(scene).success).toBe(true);
    }
    arrow.appearance = { ...arrow.appearance, arrow: 'middle' as never };
    expect(parseDiagramSpecV3(scene).success).toBe(false);
  });
});
