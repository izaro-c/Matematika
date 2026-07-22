import React, { useCallback } from 'react';
import { useDiagramStepSync } from '@/shared/lib/DiagramStepSyncContext';
import { ProofStepNumberBadge } from './ProofStepNumberBadge';

interface ProofStepLinkProps {
  /** Número 1-based del paso referenciado. */
  step: number;
}

/**
 * Enlace interno a otro paso de la misma demostración.
 * Muestra el número con el mismo estilo de enumeración y desplaza con scroll suave.
 */
export const ProofStepLink: React.FC<ProofStepLinkProps> = ({ step }) => {
  const stepSync = useDiagramStepSync();

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const target = document.getElementById(`proof-step-${step}`);
    if (!target) return;

    const proofSteps = Array.from(document.querySelectorAll<HTMLElement>('.proof-step'));
    const stepIndex = proofSteps.indexOf(target);

    if (stepSync && stepIndex >= 0) {
      stepSync.selectDiagramStep(stepIndex);
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [step, stepSync]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="proof-step-link inline-flex align-middle mx-0.5 -translate-y-px rounded-sm transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pavo"
      aria-label={`Ir al paso ${step}`}
      data-proof-step-link={step}
    >
      <ProofStepNumberBadge number={step} size="inline" />
    </button>
  );
};

ProofStepLink.displayName = 'ProofStepLink';
