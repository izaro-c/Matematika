import { useCallback, type ReactNode } from 'react';
import { useMathStore } from '@/lib/page-context/MathStoreContext';
import { useDiagramStepSync } from '@/lib/page-context/DiagramStepSyncContext';

function stepVariable(scopeId?: string): string {
  return scopeId ? `step:${scopeId}` : 'step';
}

/** Hook público reexportado para compatibilidad con el resto del proyecto. */
export function useStepBinding(scopeId?: string) {
  const key = stepVariable(scopeId);
  const value = useMathStore((state) => state.variables?.[key]);
  const setVariable = useMathStore((state) => state.setVariable);
  const stepSync = useDiagramStepSync();

  const setActiveStep = useCallback(
    (step: string | null) => {
      setVariable(key, step);
      if (!scopeId) {
        setVariable('diagramKey', step);
        setVariable('highlight', null);
      }
      if (stepSync && step !== null) {
        stepSync.selectDiagramStep(step);
      }
    },
    [key, scopeId, setVariable, stepSync]
  );

  return {
    activeStep: typeof value === 'string' ? value : null,
    setActiveStep,
  };
}

interface StepSectionProps {
  step: string;
  scopeId?: string;
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article';
}

/**
 * StepSection
 *
 * Componente declarativo de sección de lectura.
 * Su visibilidad y sincronización de diagramas las orquesta de forma centralizada
 * el layout activo (ContentLayout o CodexLayout) mediante la clase .proof-step.
 */
export function StepSection({
  step,
  scopeId,
  children,
  className = '',
  as = 'section',
}: StepSectionProps) {
  const Element = as;

  return (
    <Element
      data-target={step}
      data-diagram-step={step}
      data-diagram-key={scopeId || step}
      data-justifications="[]"
      data-step-section={step}
      className={`proof-step ${className}`}
    >
      {children}
    </Element>
  );
}

interface StepBindProps {
  step: string;
  scopeId?: string;
  children: ReactNode;
  className?: string;
}

/** Control inline, accesible por teclado, para activar un paso visual. */
export function StepBind({ step, scopeId, children, className = '' }: StepBindProps) {
  const { activeStep, setActiveStep } = useStepBinding(scopeId);
  const isActive = activeStep === step;

  return (
    <button
      type="button"
      aria-pressed={isActive}
      data-step-bind={step}
      onPointerEnter={() => setActiveStep(step)}
      onPointerLeave={() => isActive && setActiveStep(null)}
      onFocus={() => setActiveStep(step)}
      onBlur={() => isActive && setActiveStep(null)}
      onClick={() => setActiveStep(isActive ? null : step)}
      className={`page-accent-link inline border-0 border-b-2 border-dashed bg-transparent p-0 font-inherit font-bold ${className}`}
    >
      {children}
    </button>
  );
}