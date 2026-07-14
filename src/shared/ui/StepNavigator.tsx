import React, { useEffect, useMemo, useReducer } from 'react';
import { MathProviderBoundary, useMathStore } from '@/shared/lib/MathStoreContext';
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

const StepNavigatorContent: React.FC<StepNavigatorProps> = ({
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
      className={`${className}`}
      aria-label="Navegación de pasos del diagrama"
      data-step-navigator={scopeId || 'global'}
    >
      <div className="flex items-center justify-center gap-2">
        <button type="button" onClick={reset} className="flex size-8 items-center justify-center rounded-full border border-carbon/15 bg-lienzo/90 font-serif text-sm text-carbon transition-colors hover:border-carbon/30 hover:bg-carbon/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pavo" aria-label="Reiniciar secuencia">↺</button>
        <button type="button" onClick={previous} disabled={activeIndex === 0} className="flex size-8 items-center justify-center rounded-full border border-carbon/15 bg-lienzo/90 font-serif text-lg leading-none text-carbon transition-colors hover:border-carbon/30 hover:bg-carbon/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pavo disabled:opacity-35" aria-label="Paso anterior">‹</button>
        <button
          type="button"
          onClick={() => dispatch({ type: playback.playing ? 'pause' : 'play' })}
          className={`inline-flex h-8 items-center justify-center gap-2 rounded-full border border-carbon/15 bg-lienzo/90 font-serif text-xs font-semibold text-carbon transition-colors hover:border-carbon/30 hover:bg-carbon/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pavo ${compact ? 'w-8 px-0 sm:w-auto sm:px-3' : 'px-3'}`}
          aria-label={playback.playing ? 'Pausar reproducción' : 'Reproducir secuencia'}
          aria-pressed={playback.playing}
        >
          <span aria-hidden className="text-[10px] text-pavo">{playback.playing ? 'Ⅱ' : '▶'}</span>
          <span className={compact ? 'hidden sm:inline' : ''}>{playback.playing ? 'Pausa' : 'Reproducir'}</span>
        </button>
        <button type="button" onClick={next} disabled={activeIndex === steps.length - 1} className="flex size-8 items-center justify-center rounded-full border border-carbon/15 bg-lienzo/90 font-serif text-lg leading-none text-carbon transition-colors hover:border-carbon/30 hover:bg-carbon/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pavo disabled:opacity-35" aria-label="Paso siguiente">›</button>
        <span className={`${compact ? 'sr-only sm:not-sr-only' : ''} min-w-8 font-serif text-[11px] tabular-nums text-carbon/60`} aria-live="polite">
          {activeIndex + 1} / {steps.length}{compact ? '' : ` · ${activeStep?.label ?? ''}`}
        </span>
      </div>
      {!compact && (
        <div className="mt-3 flex gap-1 overflow-x-auto border-t border-carbon/10 pt-3" role="list" aria-label="Línea temporal de pasos">
          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              role="listitem"
              onClick={() => selectStep(step.id)}
              aria-current={step.id === effectiveStepId ? 'step' : undefined}
              className={`min-w-24 border-l-2 px-2 py-1 text-left font-serif text-[10px] transition-colors ${step.id === effectiveStepId ? 'border-terracota bg-terracota/5 text-carbon' : 'border-carbon/15 text-carbon/60 hover:bg-carbon/5'}`}
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

export const StepNavigator: React.FC<StepNavigatorProps> = props => (
  <MathProviderBoundary>
    <StepNavigatorContent {...props} />
  </MathProviderBoundary>
);

export default StepNavigator;
