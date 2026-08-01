import type { VisualDiagramModel } from '@/fixed-pages/editor/diagrams/model/types';
import { projectPointToSupport, withMovedPoint } from '@/diagrams/spec/scene';

export function distanceToSupport(
  spec: VisualDiagramModel,
  pointId: string,
  supportId: string,
  result: { x: number; y: number },
): number {
  const p = spec.points.find(item => item.id === pointId)!;
  const onSupport = projectPointToSupport(
    spec,
    { ...p, constraint: 'glider', gliderTarget: supportId },
    result,
  );
  return Math.hypot(result.x - onSupport.x, result.y - onSupport.y);
}

export function rayParameter(
  spec: VisualDiagramModel,
  pointId: string,
  originId: string,
  directionId: string,
): number {
  const p = spec.points.find(item => item.id === pointId)!;
  const origin = spec.points.find(item => item.id === originId)!;
  const direction = spec.points.find(item => item.id === directionId)!;
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
  const pPrev = previous.points.find(item => item.id === pointId)!;
  const origin0 = previous.points.find(item => item.id === originId)!;
  const direction0 = previous.points.find(item => item.id === directionId)!;
  const origin1 = next.points.find(item => item.id === originId)!;
  const direction1 = next.points.find(item => item.id === directionId)!;
  const dx0 = direction0.x - origin0.x;
  const dy0 = direction0.y - origin0.y;
  const len0 = dx0 * dx0 + dy0 * dy0 || 1;
  const t = Math.max(0, ((pPrev.x - origin0.x) * dx0 + (pPrev.y - origin0.y) * dy0) / len0);
  const dx1 = direction1.x - origin1.x;
  const dy1 = direction1.y - origin1.y;
  const glider = { x: origin1.x + t * dx1, y: origin1.y + t * dy1 };
  return {
    ...next,
    points: next.points.map(item => item.id === pointId ? { ...item, ...glider } : item),
  };
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
  const drafted = {
    ...spec,
    points: spec.points.map(item => item.id === draggedId ? { ...item, x, y } : item),
  };
  const withGlider = placeGliderOnSupport(spec, drafted, gliderId, originId, directionId);
  return withMovedPoint(withGlider, draggedId, x, y);
}
