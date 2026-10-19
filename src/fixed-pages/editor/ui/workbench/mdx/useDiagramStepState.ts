import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DiagramStepSyncContextValue } from '@/lib/page-context/DiagramStepSyncContext';
import type { ProofStepData } from '@/fixed-pages/editor/session/parser';

interface Options {
  urlStep: string | null;
  setUrlStep: (step: string | null) => void;
}

/** Paso de diagrama activo en la página, sincronizado con `paso=` de la URL. */
export function useDiagramStepState({ urlStep, setUrlStep }: Options) {
  const [stepId, setStepId] = useState<string | null>('initial');
  const [stepIndex, setStepIndex] = useState<number | null>(null);

  const selectDiagramStep = useCallback((stepInput: number | string) => {
    if (typeof stepInput === 'number') {
      setStepIndex(stepInput);
      setStepId(null);
      return;
    }
    setStepId(stepInput);
    setStepIndex(null);
  }, []);

  const diagramStepSyncValue = useMemo<DiagramStepSyncContextValue>(() => ({
    activeStepIndex: stepIndex,
    activeStepId: stepId,
    selectDiagramStep,
  }), [stepId, stepIndex, selectDiagramStep]);

  const syncDemoStepToDiagram = useCallback((step: ProofStepData, index: number) => {
    if (step.diagramStep === 'initial') {
      setStepId('initial');
      setStepIndex(null);
      return;
    }
    if (step.diagramStep !== undefined && step.diagramStep !== '') {
      setStepId(String(step.diagramStep));
      setStepIndex(typeof step.diagramStep === 'number' ? step.diagramStep : null);
      return;
    }
    setStepId(null);
    setStepIndex(index);
  }, []);

  const encodedStep = stepIndex !== null
    ? String(stepIndex)
    : stepId && stepId !== 'initial' ? stepId : null;
  const lastUrlStepRef = useRef<string | null>(null);
  useEffect(() => {
    if (urlStep === lastUrlStepRef.current) return;
    lastUrlStepRef.current = urlStep;
    if (urlStep === encodedStep) return;
    if (urlStep === null) {
      setStepId('initial');
      setStepIndex(null);
    } else if (/^\d+$/.test(urlStep)) {
      setStepIndex(Number(urlStep));
      setStepId(null);
    } else {
      setStepId(urlStep);
      setStepIndex(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlStep]);
  useEffect(() => {
    if (encodedStep === lastUrlStepRef.current) return;
    lastUrlStepRef.current = encodedStep;
    setUrlStep(encodedStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encodedStep]);

  return { diagramStepSyncValue, syncDemoStepToDiagram };
}
