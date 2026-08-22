import React, { useEffect } from 'react';
import { useExercise } from '@/content-pages/exercise/ui/ExerciseContext';
import { useStepBinding } from '@/components/ui/StepBinding';
import { PasoContext } from '@/content-pages/exercise/ui/PasoContext';
import { useI18n } from '@/i18n';
import { ProofStepNumberBadge } from '@/components/content/ProofStepNumberBadge';

interface PasoEjercicioProps {
  /** Identificador único del paso (para reportar hover/click al diagrama lateral) */
  id: string;
  /** Número correlativo del paso */
  numero: number;
  /** Título descriptivo del paso */
  titulo: string;
  /** IDs de las preguntas de este paso que el alumno debe resolver para completarlo */
  questionIds: string[];
  /** IDs de las preguntas de pasos anteriores que deben resolverse para desbloquear este paso */
  dependeDeQuestions?: string[];
  /** Preguntas, apoyos y resolución detallada del paso */
  children?: React.ReactNode;
}

export const PasoEjercicio: React.FC<PasoEjercicioProps> = ({
  id,
  numero,
  titulo,
  questionIds,
  dependeDeQuestions = [],
  children
}) => {
  const { state, register } = useExercise();
  const { setActiveStep } = useStepBinding();
  const { t } = useI18n();

  // Registrar todas las preguntas de este paso inmediatamente al montarse el componente
  useEffect(() => {
    questionIds.forEach(qId => {
      register(qId, 'pregunta');
    });
  }, [questionIds, register]);

  // Comprobar si el paso está desbloqueado (todas las dependencias están resueltas)
  const isUnlocked = dependeDeQuestions.every(
    qId => state.questions[qId]?.isCorrect === true || state.questions[qId]?.revealed === true
  );

  // Comprobar si el paso actual está completado (todas sus preguntas están resueltas o reveladas)
  const isCompleted = questionIds.length > 0 && questionIds.every(
    qId => state.questions[qId]?.isCorrect === true || state.questions[qId]?.revealed === true
  );

  // Reportar hover o click al estado matemático compartido con el diagrama lateral.
  const handleActivation = () => {
    if (isUnlocked) {
      setActiveStep(id);
    }
  };

  return (
    <PasoContext.Provider value={{ isCompleted }}>
      <div
        className={`my-16 font-serif transition-all duration-300${
          isCompleted
            ? 'border-canela/60'
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
          <h3 className={`font-sans font-semibold text-sm transition-colors ${
            isCompleted
              ? 'text-canela'
              : isUnlocked
                ? 'text-carbon'
                : 'text-carbon/30'
          }`}>
            {titulo}
            {!isUnlocked && <span className="ml-2 text-xs font-normal lowercase tracking-normal text-carbon/40 font-serif">({t('exercise', 'blocked')})</span>}
          </h3>
        </div>

        {/* Cuerpo del paso */}
        <div className="relative">
          {!isUnlocked ? (
            // Vista bloqueada
            <div className="p-5 border border-dashed border-carbon/20 bg-carbon/5 select-none rounded-none text-xs text-carbon/40 italic flex items-center gap-3">
              <span className="text-carbon/30 text-sm">❦</span>
              <span className="ac-label ac-label--xs">{t('exercise', 'stepBlocked')}</span>
            </div>
          ) : (
            // Vista activa/desbloqueada (mantenemos children totalmente interactivo para apoyar clicks en Apoyo)
            <div className="space-y-4">
              {children}

              {!isCompleted && (
                <div className="mt-4 p-4 border border-dashed border-ocre/20 bg-ocre/5 text-xs text-ocre/70 italic text-center rounded-none select-none">
                  {t('exercise', 'completeQuestionsAbove')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PasoContext.Provider>
  );
};
