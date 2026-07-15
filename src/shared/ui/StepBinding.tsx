import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { useMathStore } from '@/shared/lib/MathStoreContext';

function stepVariable(scopeId?: string): string {
  return scopeId ? `step:${scopeId}` : 'step';
}

/** Conecta cualquier bloque de texto con el estado de paso de su diagrama. */
export function useStepBinding(scopeId?: string) {
  const key = stepVariable(scopeId);
  const value = useMathStore((state) => state.variables[key]);
  const setVariable = useMathStore((state) => state.setVariable);
  const setActiveStep = useCallback((step: string | null) => {
    setVariable(key, step);
  }, [key, setVariable]);

  return {
    activeStep: typeof value === 'string' ? value : null,
    setActiveStep,
  };
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

interface StepSectionProps extends StepBindProps {
  as?: 'div' | 'section';
}

/** Activa un paso cuando una sección de lectura alcanza el centro de la vista. */
export function StepSection({ step, scopeId, children, className = '', as = 'section' }: StepSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { setActiveStep } = useStepBinding(scopeId);
  const Element = as;

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setActiveStep(step);
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [setActiveStep, step]);

  return (
    <Element ref={ref as never} data-step-section={step} className={className}>
      {children}
    </Element>
  );
}
