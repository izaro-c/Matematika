import { createContext, useContext } from 'react';

export interface DiagramStepSyncContextValue {
  activeStepIndex: number | null;
  selectDiagramStep: (stepIndex: number) => void;
}

/**
 * Connects a diagram sequence with the ordered reading steps that explain it.
 *
 * The index is intentionally independent from visual target IDs: a proof step
 * may highlight several objects while still corresponding to one diagram state.
 */
export const DiagramStepSyncContext = createContext<DiagramStepSyncContextValue | null>(null);

export function useDiagramStepSync(): DiagramStepSyncContextValue | null {
  return useContext(DiagramStepSyncContext);
}
