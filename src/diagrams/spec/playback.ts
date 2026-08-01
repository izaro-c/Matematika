import type { DiagramStep } from './types';

export interface DiagramPlaybackState {
  activeStepId: string;
  playing: boolean;
}

export type DiagramPlaybackAction =
  | { type: 'select'; stepId: string }
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'previous'; steps: readonly DiagramStep[] }
  | { type: 'next'; steps: readonly DiagramStep[] }
  | { type: 'tick'; steps: readonly DiagramStep[] }
  | { type: 'reset'; steps: readonly DiagramStep[] };

export function initialDiagramPlaybackState(steps: readonly DiagramStep[], activeStepId = ''): DiagramPlaybackState {
  return {
    activeStepId: steps.some(step => step.id === activeStepId) ? activeStepId : (steps[0]?.id ?? ''),
    playing: false,
  };
}

function adjacentStepId(state: DiagramPlaybackState, steps: readonly DiagramStep[], delta: -1 | 1): string {
  if (steps.length === 0) return '';
  const currentIndex = Math.max(0, steps.findIndex(step => step.id === state.activeStepId));
  return steps[Math.min(steps.length - 1, Math.max(0, currentIndex + delta))].id;
}

export function diagramPlaybackReducer(state: DiagramPlaybackState, action: DiagramPlaybackAction): DiagramPlaybackState {
  if (action.type === 'select') return { activeStepId: action.stepId, playing: false };
  if (action.type === 'play') return { ...state, playing: true };
  if (action.type === 'pause') return { ...state, playing: false };
  if (action.type === 'reset') return initialDiagramPlaybackState(action.steps);
  if (action.type === 'previous') return { activeStepId: adjacentStepId(state, action.steps, -1), playing: false };
  if (action.type === 'next') return { activeStepId: adjacentStepId(state, action.steps, 1), playing: false };
  if (action.type === 'tick') {
    const index = action.steps.findIndex(step => step.id === state.activeStepId);
    if (index < 0) return initialDiagramPlaybackState(action.steps);
    if (index >= action.steps.length - 1) return { ...state, playing: false };
    return { activeStepId: action.steps[index + 1].id, playing: true };
  }
  return state;
}
