import React, { useEffect } from 'react';
import { useExercise } from '@/lib/page-context/ExerciseContext';
import { useStepBinding } from '@/components/ui/StepBinding';
import { ProofStepNumberBadge } from '@/components/content/ProofStepNumberBadge';
import { PasoContext } from './PasoContext';

export interface ExerciseStepProps {
  /** Identificador único del paso (para sincronización con el diagrama lateral) */
  id: string;
  /** Número correlativo del paso */
  numero: number;
  /** Título descriptivo del paso */
  titulo: string;
  /** IDs de las preguntas de este paso requeridas para completarlo */
  questionIds: string[];
  /** IDs de preguntas previas necesarias para desbloquear este paso */
  dependeDeQuestions?: string[];
  /** Contenido interactivo, preguntas y resoluciones */
  children?: React.ReactNode;
}

/**
 * ExerciseStep — Paso secuencial interactivo para ejercicios con control de desbloqueo,
 * dependencias lógicas y sincronización con el diagrama visual.
 */
export const ExerciseStep: React.FC<ExerciseStepProps> = ({
  id,
  numero,
  titulo,
  questionIds,
  dependeDeQuestions = [],
  children,
}) => {
  const { state, register } = useExercise();
  const { setActiveStep } = useStepBinding();

  // Registrar las preguntas asociadas a este paso
  useEffect(() => {
    questionIds.forEach((qId) => {
      register(qId, 'pregunta');
    });
  }, [questionIds, register]);

  const isUnlocked = dependeDeQuestions.every(
    (qId) => state.questions[qId]?.isCorrect === true || state.questions[qId]?.revealed === true
  );

  const isCompleted =
    questionIds.length > 0 &&
    questionIds.every(
      (qId) => state.questions[qId]?.isCorrect === true || state.questions[qId]?.revealed === true
    );

  const handleActivation = () => {
    if (isUnlocked) {
      setActiveStep(id);
    }
  };

  return (
    <PasoContext.Provider value={{ isCompleted }}>
      <div
        className={`my-16 font-serif transition-all duration-300 ${
          isCompleted
            ? 'border-musgo/60'
            : isUnlocked
              ? 'border-ocre/60'
              : 'border-carbon/10'
        }`}
        onMouseEnter={handleActivation}
        onClick={handleActivation}
      >
        {/* Cabecera del paso */}
        <div className="flex items-center gap-3 mb-4 select-none">
          <ProofStepNumberBadge
            number={numero}
            size="compact"
            status={isCompleted ? 'completed' : isUnlocked ? 'default' : 'locked'}
          />
          <h3
            className={`font-sans font-semibold text-sm transition-colors ${
              isCompleted
                ? 'text-musgo'
                : isUnlocked
                  ? 'text-carbon'
                  : 'text-carbon/30'
            }`}
          >
            {titulo}
          </h3>
        </div>

        {/* Cuerpo del paso */}
        <div className="relative">
          {!isUnlocked ? (
            <div>
            </div>
          ) : (
            <div className="space-y-4">
              {children}
            </div>
          )}
        </div>
      </div>
    </PasoContext.Provider>
  );
};
