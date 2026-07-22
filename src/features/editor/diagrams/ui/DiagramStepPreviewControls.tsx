import React from 'react';
import type { VisualStep } from '../model/types';

interface DiagramStepPreviewControlsProps {
  steps: readonly VisualStep[];
  activeStepId: string;
  onActiveStepChange: (stepId: string) => void;
  className?: string;
}

export const DiagramStepPreviewControls: React.FC<DiagramStepPreviewControlsProps> = ({
  steps,
  activeStepId,
  onActiveStepChange,
  className = '',
}) => {
  if (steps.length === 0) return null;

  const activeIndex = activeStepId
    ? Math.max(0, steps.findIndex(step => step.id === activeStepId))
    : -1;
  const activeStep = activeIndex >= 0 ? steps[activeIndex] : undefined;
  const showingAll = !activeStepId;

  const previous = () => {
    if (showingAll) {
      onActiveStepChange(steps[steps.length - 1].id);
      return;
    }
    if (activeIndex <= 0) return;
    onActiveStepChange(steps[activeIndex - 1].id);
  };

  const next = () => {
    if (showingAll) {
      onActiveStepChange(steps[0].id);
      return;
    }
    if (activeIndex >= steps.length - 1) return;
    onActiveStepChange(steps[activeIndex + 1].id);
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-2 rounded border border-carbon/15 bg-lienzo px-2 py-1.5 ${className}`.trim()}
      aria-label="Vista previa por pasos"
    >
      <button
        type="button"
        onClick={previous}
        disabled={!showingAll && activeIndex <= 0}
        className="flex size-8 items-center justify-center rounded border border-carbon/15 text-lg leading-none text-carbon transition-colors hover:bg-carbon/5 disabled:opacity-35"
        aria-label="Paso anterior"
        title="Paso anterior"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={next}
        disabled={!showingAll && activeIndex >= steps.length - 1}
        className="flex size-8 items-center justify-center rounded border border-carbon/15 text-lg leading-none text-carbon transition-colors hover:bg-carbon/5 disabled:opacity-35"
        aria-label="Paso siguiente"
        title="Paso siguiente"
      >
        ›
      </button>
      <span className="min-w-0 flex-1 truncate text-[11px] font-bold text-carbon" aria-live="polite">
        {showingAll
          ? 'Mostrando todos los objetos'
          : `Paso ${activeIndex + 1} de ${steps.length}: ${activeStep?.label ?? ''}`}
      </span>
      <button
        type="button"
        onClick={() => onActiveStepChange(showingAll ? steps[0].id : '')}
        className="shrink-0 rounded border border-carbon/15 px-2 py-1 text-[10px] font-bold text-carbon/70 transition-colors hover:bg-carbon/5"
        aria-label={showingAll ? 'Filtrar por paso' : 'Mostrar todos los objetos'}
        title={showingAll ? 'Filtrar por paso' : 'Mostrar todos los objetos'}
      >
        {showingAll ? 'Filtrar paso' : 'Mostrar todo'}
      </button>
    </div>
  );
};

export default DiagramStepPreviewControls;
