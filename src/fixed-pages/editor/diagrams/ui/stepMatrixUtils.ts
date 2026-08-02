import type { DiagramStepObjectState } from '@/diagrams';
import type { VisualDiagramModel, VisualStep } from '../model/types';

export type MatrixCellVisualState = 'hidden' | 'visible' | 'emphasis-secondary' | 'emphasis-primary';

export function resolveMatrixCellState(
  stepItem: VisualStep,
  objectId: string,
): { visible: boolean; emphasis: NonNullable<DiagramStepObjectState['emphasis']> } {
  const state = stepItem.objectStates?.[objectId];
  const visible = state?.visible ?? stepItem.visibleTargets.includes(objectId);
  const emphasis = state?.emphasis ?? 'none';
  return { visible, emphasis };
}

export function matrixCellVisualState(
  stepItem: VisualStep,
  objectId: string,
): MatrixCellVisualState {
  const { visible, emphasis } = resolveMatrixCellState(stepItem, objectId);
  if (!visible) return 'hidden';
  if (emphasis === 'primary') return 'emphasis-primary';
  if (emphasis === 'secondary') return 'emphasis-secondary';
  return 'visible';
}

export function nextMatrixCellState(current: MatrixCellVisualState): Partial<DiagramStepObjectState> {
  switch (current) {
    case 'hidden':
      return { visible: true, emphasis: 'none' };
    case 'visible':
      return { visible: true, emphasis: 'secondary' };
    case 'emphasis-secondary':
      return { visible: true, emphasis: 'primary' };
    case 'emphasis-primary':
      return { visible: false, emphasis: 'none' };
  }
}

export const MATRIX_CELL_LABELS: Record<MatrixCellVisualState, string> = {
  hidden: 'Oculto',
  visible: 'Visible',
  'emphasis-secondary': 'Resaltado suave',
  'emphasis-primary': 'Resaltado fuerte',
};

export function setVisibilityInAllSteps(
  model: VisualDiagramModel,
  objectId: string,
  visible: boolean,
): VisualDiagramModel {
  return {
    ...model,
    steps: model.steps.map(step => {
      const nextVisibleTargets = visible
        ? (step.visibleTargets.includes(objectId) ? step.visibleTargets : [...step.visibleTargets, objectId])
        : step.visibleTargets.filter(id => id !== objectId);

      const existingState = step.objectStates?.[objectId];
      const nextObjectStates = step.objectStates
        ? {
            ...step.objectStates,
            [objectId]: {
              ...(existingState ?? {}),
              visible,
            },
          }
        : undefined;

      return {
        ...step,
        visibleTargets: nextVisibleTargets,
        ...(nextObjectStates ? { objectStates: nextObjectStates } : {}),
      };
    }),
  };
}
