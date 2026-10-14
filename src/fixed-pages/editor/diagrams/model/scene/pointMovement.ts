import { buildDependencyGraph, dependencyDeterminesConstructionOrder, isPositionedPoint, objectKind, omitKeys, type DiagramObject } from '@/diagrams';
import { pointMode, pointModeSupportsMovementAids } from '../elements/pointModes';
import { modelElements, modelPoints } from './objectLists';
import type { VisualDiagramModel, VisualPoint } from '../types';

export type MovementAttractor = DiagramObject;

/** Indica si el punto admite ayudas durante el arrastre directo. */
export function pointSupportsMovementAids(point: VisualPoint): boolean {
  return pointModeSupportsMovementAids(pointMode(point));
}

const MOVEMENT_ATTRACTOR_KINDS = new Set<string>([
  'line', 'ray', 'segment', 'circle', 'functionCurve', 'parametricCurve',
  'perpendicular', 'parallel', 'angleBisector', 'intersection', 'midpoint', 'perpendicularFoot',
]);

export function isMovementAttractor(item: MovementAttractor): boolean {
  return isPositionedPoint(item) || MOVEMENT_ATTRACTOR_KINDS.has(objectKind(item));
}

/** Devuelve todos los destinos magnéticos en el mismo orden estable que usa el editor. */
export function movementAttractors(model: VisualDiagramModel): MovementAttractor[] {
  return [...modelPoints(model), ...modelElements(model)].filter(isMovementAttractor);
}

/** Detecta si añadir supportId → pointId cerraría un ciclo de construcción. */
export function movementAttractorCreatesCycle(model: VisualDiagramModel, pointId: string, supportId: string): boolean {
  const outgoing = new Map<string, string[]>();
  for (const edge of buildDependencyGraph(model).edges) {
    // Las restricciones geométricas acotan el arrastre de los puntos, pero no
    // convierten todos sus soportes en construcciones derivadas del punto.
    if (edge.constraintId) continue;
    if (!dependencyDeterminesConstructionOrder(model, edge)) continue;
    if (edge.sourceId === supportId && edge.targetId === pointId && edge.relation === 'constraint' && !edge.constraintId) continue;
    outgoing.set(edge.sourceId, [...(outgoing.get(edge.sourceId) ?? []), edge.targetId]);
  }
  const pending = [pointId];
  const visited = new Set<string>();
  while (pending.length > 0) {
    const current = pending.pop()!;
    if (current === supportId) return true;
    if (visited.has(current)) continue;
    visited.add(current);
    pending.push(...(outgoing.get(current) ?? []));
  }
  return false;
}

/** Actualiza magnetismo y sus aristas declarativas como una única mutación válida. */
/** Actualiza el magnetismo del punto; las aristas de dependencia se derivan del propio objeto. */
export function setPointAttractors(model: VisualDiagramModel, pointId: string, requestedIds: string[]): VisualDiagramModel {
  const point = modelPoints(model).find(item => item.id === pointId);
  if (!point) return model;
  const supportIds = new Set(movementAttractors(model).map(item => item.id));
  const nextIds = [...new Set(requestedIds)].filter(id => supportIds.has(id) && !movementAttractorCreatesCycle(model, pointId, id));
  const interaction = omitKeys(point.interaction ?? {}, 'attractorIds');
  const nextInteraction = nextIds.length ? { ...interaction, attractorIds: nextIds } : interaction;
  const pointWithoutInteraction = omitKeys(point, 'interaction');
  const nextPoint: VisualPoint = Object.keys(nextInteraction).length > 0
    ? { ...pointWithoutInteraction, interaction: nextInteraction }
    : pointWithoutInteraction;
  return {
    ...model,
    objects: model.objects.map(item => item.id === pointId ? nextPoint : item),
  };
}
