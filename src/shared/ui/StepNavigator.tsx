import React, { useEffect, useMemo, useReducer } from 'react';
import { useMathStore } from '@/shared/lib/MathStoreContext';
import {
  diagramPlaybackReducer,
  initialDiagramPlaybackState,
  type DiagramStep,
} from '@/shared/diagrams/spec';

interface StepNavigatorProps {
  steps: readonly DiagramStep[];
  scopeId?: string;
  activeStepId?: string;
  onStepChange?: (stepId: string) => void;
  compact?: boolean;
  className?: string;
}

export const StepNavigator: React.FC<StepNavigatorProps> = ({
  steps,
  scopeId = '',
  activeStepId,
  onStepChange,
  compact = false,
  className = '',
}) => {
  const storeStep = useMathStore(state => state.variables?.[scopeId ? `step:${scopeId}` : 'step']);
  const setVariable = useMathStore(state => state.setVariable);
  const externalStepId = activeStepId ?? (typeof storeStep === 'string' ? storeStep.replace(`${scopeId}:`, '') : '');
  const seed = useMemo(() => initialDiagramPlaybackState(steps, externalStepId), [steps, externalStepId]);
  const [playback, dispatch] = useReducer(diagramPlaybackReducer, seed);

  const storeStepId = typeof storeStep === 'string' ? storeStep.replace(`${scopeId}:`, '') : '';
  const effectiveStepId = activeStepId ?? (steps.some(step => step.id === storeStepId) ? storeStepId : playback.activeStepId);
  const activeIndex = Math.max(0, steps.findIndex(step => step.id === effectiveStepId));
  const activeStep = steps[activeIndex];

  const selectStep = (stepId: string) => {
    dispatch({ type: 'select', stepId });
    if (onStepChange) onStepChange(stepId);
    else setVariable(scopeId ? `step:${scopeId}` : 'step', stepId);
  };

  useEffect(() => {
    if (!playback.playing || !activeStep || steps.length < 2) return undefined;
    const timer = window.setTimeout(() => {
      const nextIndex = Math.min(steps.length - 1, activeIndex + 1);
      if (nextIndex === activeIndex) {
        dispatch({ type: 'pause' });
        return;
      }
      const nextId = steps[nextIndex].id;
      dispatch({ type: 'tick', steps });
      if (onStepChange) onStepChange(nextId);
      else setVariable(scopeId ? `step:${scopeId}` : 'step', nextId);
    }, activeStep.durationMs ?? 1800);
    return () => window.clearTimeout(timer);
  }, [activeIndex, activeStep, onStepChange, playback.playing, scopeId, setVariable, steps]);

  if (steps.length === 0) return null;

  const previous = () => selectStep(steps[Math.max(0, activeIndex - 1)].id);
  const next = () => selectStep(steps[Math.min(steps.length - 1, activeIndex + 1)].id);
  const reset = () => selectStep(steps[0].id);

  return (
    <nav
      className={`rounded border border-carbon/15 bg-lienzo/95 p-2 shadow-sm ${className}`}
      aria-label="Navegación de pasos del diagrama"
      data-step-navigator={scopeId || 'global'}
    >
      <div className="flex items-center gap-1">
        <button type="button" onClick={reset} className="rounded px-2 py-1 text-xs font-bold text-carbon hover:bg-carbon/5" aria-label="Reiniciar secuencia">↺</button>
        <button type="button" onClick={previous} disabled={activeIndex === 0} className="rounded px-2 py-1 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-35" aria-label="Paso anterior">←</button>
        <button
          type="button"
          onClick={() => dispatch({ type: playback.playing ? 'pause' : 'play' })}
          className="rounded bg-pavo px-2 py-1 text-xs font-bold text-lienzo"
          aria-label={playback.playing ? 'Pausar reproducción' : 'Reproducir secuencia'}
          aria-pressed={playback.playing}
        >
          {playback.playing ? 'Pausa' : 'Reproducir'}
        </button>
        <button type="button" onClick={next} disabled={activeIndex === steps.length - 1} className="rounded px-2 py-1 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-35" aria-label="Paso siguiente">→</button>
        <span className="ml-auto text-[10px] font-semibold text-carbon/60" aria-live="polite">
          {activeIndex + 1} / {steps.length}{compact ? '' : ` · ${activeStep?.label ?? ''}`}
        </span>
      </div>
      {!compact && (
        <div className="mt-2 flex gap-1 overflow-x-auto" role="list" aria-label="Línea temporal de pasos">
          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              role="listitem"
              onClick={() => selectStep(step.id)}
              aria-current={step.id === effectiveStepId ? 'step' : undefined}
              className={`min-w-24 rounded border px-2 py-1 text-left text-[10px] ${step.id === effectiveStepId ? 'border-terracota bg-terracota/10 text-carbon' : 'border-carbon/10 text-carbon/60'}`}
            >
              <span className="block font-bold">{index + 1}. {step.label}</span>
              <span className="block truncate font-mono text-[9px] opacity-60">{step.id}</span>
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default StepNavigator;
