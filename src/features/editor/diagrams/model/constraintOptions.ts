import type { VisualConstraint, VisualDiagramModel } from './types';

export interface ConstraintPresentation {
  label: string;
  description: string;
  refs: number;
}

export const CONSTRAINT_OPTIONS: Array<ConstraintPresentation & { value: VisualConstraint['kind'] }> = [
  { value: 'fixed', label: 'Posición fija', description: 'El punto no puede moverse.', refs: 1 },
  { value: 'horizontal', label: 'A la misma altura', description: 'Conserva la misma coordenada y que otro punto.', refs: 2 },
  { value: 'vertical', label: 'En la misma vertical', description: 'Conserva la misma coordenada x que otro punto.', refs: 2 },
  { value: 'coincident', label: 'Coincidir con un punto', description: 'Ocupa exactamente la posición de otro punto.', refs: 2 },
  { value: 'on', label: 'Sobre un objeto', description: 'Solo puede desplazarse sobre una recta, segmento, arco o circunferencia.', refs: 2 },
  { value: 'distance', label: 'A distancia fija', description: 'Mantiene una distancia numérica respecto de otro punto.', refs: 2 },
  { value: 'perpendicular', label: 'Sobre una perpendicular', description: 'Se mueve sobre la perpendicular a una dirección dada.', refs: 3 },
  { value: 'parallel', label: 'Sobre una paralela', description: 'Se mueve sobre una paralela a una dirección dada.', refs: 3 },
  { value: 'insideDisk', label: 'Dentro de un disco', description: 'No puede salir del disco definido por centro y borde.', refs: 3 },
  { value: 'sameSide', label: 'En el mismo semiplano', description: 'No puede cruzar la recta definida por dos puntos.', refs: 3 },
];

const SUPPORT_KINDS = new Set(['segment', 'line', 'ray', 'circle', 'arc', 'functionCurve', 'parametricCurve', 'perpendicular', 'parallel', 'angleBisector']);

export function constraintPresentation(kind: VisualConstraint['kind']): ConstraintPresentation {
  const configured = CONSTRAINT_OPTIONS.find(option => option.value === kind);
  if (configured) return configured;
  return {
    label: kind === 'expression' ? 'Relación por expresión' : kind,
    description: 'Relación avanzada conservada por el modelo.',
    refs: kind === 'expression' ? 1 : 2,
  };
}

export function defaultConstraintRefs(model: VisualDiagramModel, kind: VisualConstraint['kind'], targetId: string): string[] {
  if (!targetId) return [];
  const presentation = constraintPresentation(kind);
  if (presentation.refs === 1) return [targetId];
  if (kind === 'on') {
    const support = model.elements.find(item => SUPPORT_KINDS.has(item.kind));
    return support ? [targetId, support.id] : [targetId];
  }
  const otherPoints = model.points.filter(item => item.id !== targetId).map(item => item.id);
  return [targetId, ...otherPoints.slice(0, presentation.refs - 1)];
}

export function withConstraintDependencies(model: VisualDiagramModel, constraintId: string, refs: string[]): VisualDiagramModel {
  return {
    ...model,
    dependencies: [
      ...(model.dependencies || []).filter(dependency => dependency.constraintId !== constraintId),
      ...refs.slice(1).map(sourceId => ({ sourceId, targetId: refs[0], relation: 'constraint' as const, constraintId })),
    ],
  };
}
