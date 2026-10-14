import type { VisualDiagramModel } from '@/fixed-pages/editor/diagrams/model/types';
import { asGliderPoint, projectPointToSupport, withMovedPoint } from '@/diagrams/geometry';
import { movedTo, pointById, positionOf } from './diagramSpec';

export function distanceToSupport(
  spec: VisualDiagramModel,
  pointId: string,
  supportId: string,
  result: { x: number; y: number },
): number {
  const onSupport = projectPointToSupport(spec, asGliderPoint(pointById(spec, pointId), supportId), result);
  return Math.hypot(result.x - onSupport.x, result.y - onSupport.y);
}

export function rayParameter(
  spec: VisualDiagramModel,
  pointId: string,
  originId: string,
  directionId: string,
): number {
  const p = positionOf(spec, pointId);
  const origin = positionOf(spec, originId);
  const direction = positionOf(spec, directionId);
  const dx = direction.x - origin.x;
  const dy = direction.y - origin.y;
  const len = dx * dx + dy * dy || 1;
  return ((p.x - origin.x) * dx + (p.y - origin.y) * dy) / len;
}

/** Simula el glider JSXGraph: conserva el parámetro afín del punto sobre el rayo. */
export function placeGliderOnSupport(
  previous: VisualDiagramModel,
  next: VisualDiagramModel,
  pointId: string,
  originId: string,
  directionId: string,
): VisualDiagramModel {
  const pPrev = positionOf(previous, pointId);
  const origin0 = positionOf(previous, originId);
  const direction0 = positionOf(previous, directionId);
  const origin1 = positionOf(next, originId);
  const direction1 = positionOf(next, directionId);
  const dx0 = direction0.x - origin0.x;
  const dy0 = direction0.y - origin0.y;
  const len0 = dx0 * dx0 + dy0 * dy0 || 1;
  const t = Math.max(0, ((pPrev.x - origin0.x) * dx0 + (pPrev.y - origin0.y) * dy0) / len0);
  const dx1 = direction1.x - origin1.x;
  const dy1 = direction1.y - origin1.y;
  return movedTo(next, pointId, origin1.x + t * dx1, origin1.y + t * dy1);
}

/**
 * Como useBoardLifecycle: el glider actualiza el punto sobre el soporte nuevo;
 * el motor solo aplica restricciones adicionales si hace falta.
 */
export function moveSupportPoint(
  spec: VisualDiagramModel,
  draggedId: string,
  x: number,
  y: number,
  gliderId: string,
  originId: string,
  directionId: string,
): VisualDiagramModel {
  const drafted = movedTo(spec, draggedId, x, y);
  const withGlider = placeGliderOnSupport(spec, drafted, gliderId, originId, directionId);
  return withMovedPoint(withGlider, draggedId, x, y);
}
