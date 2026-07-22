import React, { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { MathProviderBoundary, useMathStore } from '@/shared/lib/MathStoreContext';
import { useDiagramStepSync } from '@/shared/lib/DiagramStepSyncContext';
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
  editorMode?: boolean;
  className?: string;
}

const StepNavigatorContent: React.FC<StepNavigatorProps> = ({
  steps,
  scopeId = '',
  activeStepId,
  onStepChange,
  compact = false,
  editorMode = false,
  className = '',
}) => {
  const storeStep = useMathStore(state => state.variables?.[scopeId ? `step:${scopeId}` : 'step']);
  const setVariable = useMathStore(state => state.setVariable);
  const stepSync = useDiagramStepSync();
  const selectSynchronizedStep = stepSync?.selectDiagramStep;
  const synchronizedStepId = useMemo(() => {
    if (!stepSync) return undefined;
    if (stepSync.activeStepId) {
      if (stepSync.activeStepId === 'initial') return steps[0]?.id;
      const match = steps.find(s => s.id === stepSync.activeStepId);
      if (match) return match.id;
    }
    if (stepSync.activeStepIndex != null) {
      const hasInitialStep = steps[0]?.id === 'initial' || steps[0]?.id === 'enunciado' || steps[0]?.id === 'hipotesis';
      const mappedIndex = hasInitialStep ? stepSync.activeStepIndex + 1 : stepSync.activeStepIndex;
      return steps[mappedIndex]?.id ?? steps[steps.length - 1]?.id;
    }
    return undefined;
  }, [stepSync, steps]);

  const storeStepId = typeof storeStep === 'string' ? storeStep.replace(`${scopeId}:`, '') : '';
  const externalStepId = activeStepId ?? synchronizedStepId ?? storeStepId;
  const seed = useMemo(() => initialDiagramPlaybackState(steps, externalStepId), [steps, externalStepId]);
  const [playback, dispatch] = useReducer(diagramPlaybackReducer, seed);
  const lastPublishedStepIdRef = useRef('');
  const hasExternalStep = steps.some(step => step.id === externalStepId);

  // External reading changes select and pause. Changes published by this
  // navigator are already reflected in the reducer and must not stop playback.
  useEffect(() => {
    if (!hasExternalStep) return;
    if (externalStepId === playback.activeStepId) {
      if (lastPublishedStepIdRef.current === externalStepId) {
        lastPublishedStepIdRef.current = '';
      }
      return;
    }
    if (lastPublishedStepIdRef.current === externalStepId) {
      lastPublishedStepIdRef.current = '';
      return;
    }
    dispatch({ type: 'select', stepId: externalStepId });
  }, [externalStepId, hasExternalStep, playback.activeStepId]);

  const effectiveStepId = hasExternalStep
    ? externalStepId
    : playback.activeStepId;
  const activeIndex = Math.max(0, steps.findIndex(step => step.id === effectiveStepId));
  const activeStep = steps[activeIndex];

  const publishStep = useCallback((stepId: string) => {
    lastPublishedStepIdRef.current = stepId;
    const stepIndex = steps.findIndex(step => step.id === stepId);
    if (selectSynchronizedStep) {
      const hasInitialStep = steps[0]?.id === 'initial' || steps[0]?.id === 'enunciado' || steps[0]?.id === 'hipotesis';
      const proofStepIndex = hasInitialStep ? stepIndex - 1 : stepIndex;
      selectSynchronizedStep(proofStepIndex >= 0 ? proofStepIndex : stepId);
    }
    if (onStepChange) {
      onStepChange(stepId);
    } else if (!selectSynchronizedStep) {
      setVariable(scopeId ? `step:${scopeId}` : 'step', stepId);
    }
  }, [onStepChange, scopeId, selectSynchronizedStep, setVariable, steps]);

  const selectStep = (stepId: string) => {
    dispatch({ type: 'select', stepId });
    publishStep(stepId);
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
      publishStep(nextId);
    }, activeStep.durationMs ?? 1800);
    return () => window.clearTimeout(timer);
  }, [activeIndex, activeStep, playback.playing, publishStep, steps]);

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
        <button type="button" onClick={reset} className="flex size-8 items-center justify-center rounded-full border border-carbon/15 bg-lienzo/90 font-diagram text-sm text-carbon transition-colors hover:border-carbon/30 hover:bg-carbon/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pavo" aria-label="Reiniciar secuencia">↺</button>
        <button type="button" onClick={previous} disabled={activeIndex === 0} className="flex size-8 items-center justify-center rounded-full border border-carbon/15 bg-lienzo/90 font-diagram text-lg leading-none text-carbon transition-colors hover:border-carbon/30 hover:bg-carbon/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pavo disabled:opacity-35" aria-label="Paso anterior">‹</button>
        <button
          type="button"
          onClick={() => dispatch({ type: playback.playing ? 'pause' : 'play' })}
          className={`inline-flex h-8 items-center justify-center gap-2 rounded-full border border-carbon/15 bg-lienzo/90 font-diagram text-xs font-semibold text-carbon transition-colors hover:border-carbon/30 hover:bg-carbon/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pavo ${compact ? 'w-8 px-0 sm:w-auto sm:px-3' : 'px-3'}`}
          aria-label={playback.playing ? 'Pausar reproducción' : 'Reproducir secuencia'}
          aria-pressed={playback.playing}
        >
          <span aria-hidden className="text-[10px] text-pavo">{playback.playing ? 'Ⅱ' : '▶'}</span>
          <span className={compact ? 'hidden sm:inline' : ''}>{playback.playing ? 'Pausa' : 'Reproducir'}</span>
        </button>
        <button type="button" onClick={next} disabled={activeIndex === steps.length - 1} className="flex size-8 items-center justify-center rounded-full border border-carbon/15 bg-lienzo/90 font-diagram text-lg leading-none text-carbon transition-colors hover:border-carbon/30 hover:bg-carbon/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pavo disabled:opacity-35" aria-label="Paso siguiente">›</button>
        {!editorMode && (
        <span className={`${compact ? 'sr-only sm:not-sr-only' : ''} min-w-8 font-diagram text-[11px] tabular-nums text-carbon/60`} aria-live="polite">
          {activeIndex + 1} / {steps.length}{compact ? '' : ` · ${activeStep?.label ?? ''}`}
        </span>
        )}
      </div>
      {!compact && !editorMode && (
        <div className="mt-3 flex gap-1 overflow-x-auto border-t border-carbon/10 pt-3" role="list" aria-label="Línea temporal de pasos">
          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              role="listitem"
              onClick={() => selectStep(step.id)}
              aria-current={step.id === effectiveStepId ? 'step' : undefined}
              className={`min-w-24 border-l-2 px-2 py-1 text-left font-diagram text-[10px] transition-colors ${step.id === effectiveStepId ? 'border-terracota bg-terracota/5 text-carbon' : 'border-carbon/15 text-carbon/60 hover:bg-carbon/5'}`}
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
