import { buildDependencyGraph, dependencyDeterminesConstructionOrder } from '../../../../shared/diagrams/spec';
import type { PointConstraint, VisualDiagramModel, VisualElement, VisualPoint } from './types';

export type MovementAttractor = VisualElement | VisualPoint;

const MOVEMENT_AID_CONSTRAINTS = new Set<PointConstraint>([
  'free',
  'horizontal',
  'vertical',
  'constrained',
]);

/** Indica si el punto admite ayudas durante el arrastre directo. */
export function pointSupportsMovementAids(point: Pick<VisualPoint, 'constraint'>): boolean {
  return MOVEMENT_AID_CONSTRAINTS.has(point.constraint);
}

const MOVEMENT_ATTRACTOR_KINDS = new Set<VisualElement['kind']>([
  'line', 'ray', 'segment', 'circle', 'functionCurve', 'parametricCurve',
  'perpendicular', 'parallel', 'angleBisector', 'intersection', 'midpoint', 'perpendicularFoot',
]);

export function isMovementAttractor(item: MovementAttractor): boolean {
  return 'constraint' in item || MOVEMENT_ATTRACTOR_KINDS.has(item.kind);
}

/** Devuelve todos los destinos magnéticos en el mismo orden estable que usa el editor. */
export function movementAttractors(model: VisualDiagramModel): MovementAttractor[] {
  return [...model.points, ...model.elements].filter(isMovementAttractor);
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
export function setPointAttractors(model: VisualDiagramModel, pointId: string, requestedIds: string[]): VisualDiagramModel {
  const point = model.points.find(item => item.id === pointId);
  if (!point) return model;
  const supportIds = new Set(movementAttractors(model).map(item => item.id));
  const nextIds = [...new Set(requestedIds)].filter(id => supportIds.has(id) && !movementAttractorCreatesCycle(model, pointId, id));
  const previousIds = new Set(point.attractorIds ?? []);
  const retainedDependencies = (model.dependencies ?? []).filter(dependency => !(
    dependency.targetId === pointId
    && dependency.relation === 'constraint'
    && !dependency.constraintId
    && previousIds.has(dependency.sourceId)
  ));
  const dependencyKeys = new Set(retainedDependencies.map(dependency => `${dependency.sourceId}:${dependency.targetId}:${dependency.relation}:${dependency.constraintId ?? ''}`));
  const addedDependencies = nextIds
    .map(sourceId => ({ sourceId, targetId: pointId, relation: 'constraint' as const }))
    .filter(dependency => !dependencyKeys.has(`${dependency.sourceId}:${dependency.targetId}:${dependency.relation}:`));
  return {
    ...model,
    points: model.points.map(item => item.id === pointId ? { ...item, attractorIds: nextIds.length ? nextIds : undefined } : item),
    dependencies: [...retainedDependencies, ...addedDependencies],
  };
}
