import type { VisualDiagramModel } from '../model/types';

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
