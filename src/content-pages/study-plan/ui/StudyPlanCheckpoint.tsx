import React, { useContext, useEffect } from 'react';
import { useProgressStore } from '@/lib/stores/UserProgressStore';
import { StudyPlanContext } from '@/content-pages/study-plan/context/StudyPlanContext';
import { useExercise } from '@/lib/page-context/ExerciseContext';
import { useI18n } from '@/i18n';
import { Pregunta } from '@/content-pages/exercise/ui/questions/Pregunta';
import { ExerciseCardContext } from '@/content-pages/exercise/ui/shared/ExerciseCard';

export interface StudyPlanCheckpointProps {
  id: string;
  /** Enunciado opcional de la pregunta (si no se pasa componente hijo) */
  question?: string;
  /** Lista simplificada de opciones (modo legacy) */
  options?: string[];
  /** Índice de la opción correcta (modo legacy) */
  correctAnswer?: number;
  /** Explicación o justificación pedagógica desplegada al completar el checkpoint */
  explanation?: string;
  /** Componente(s) de pregunta modular(es) como hijos (Pregunta, Hueco, Clasificador, etc.) */
  children?: React.ReactNode;
}

export const StudyPlanCheckpoint: React.FC<StudyPlanCheckpointProps> = ({
  id,
  question,
  options,
  correctAnswer,
  explanation,
  children,
}) => {
  const { isExerciseComplete, markExerciseComplete } = useProgressStore();
  const { t } = useI18n();
  const context = useContext(StudyPlanContext);
  const exercise = useExercise();

  const isLocked = context?.isLocked ? context.isLocked(id) : false;
  const storeCompleted = isExerciseComplete(id);
  const qState = exercise.state.questions[id];
  const exerciseCompleted = qState?.isCorrect === true;

  const completed = storeCompleted || exerciseCompleted;

  // Registrar en UserProgressStore cuando se completa correctamente el ejercicio
  useEffect(() => {
    if (exerciseCompleted && !storeCompleted) {
      markExerciseComplete(id);
    }
  }, [exerciseCompleted, storeCompleted, id, markExerciseComplete]);

  const renderQuestionContent = () => {
    if (children) {
      return React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            id: (child.props as any).id || id,
          } as any);
        }
        return child;
      });
    }

    if (question && options && correctAnswer !== undefined) {
      return (
        <Pregunta
          id={id}
          question={question}
          options={options}
          correct={options[correctAnswer]}
        />
      );
    }

    return null;
  };

  // Renderizado en estado bloqueado (Niebla de Guerra)
  if (isLocked) {
    return (
      <div
        data-node-id={id}
        className="w-full border border-carbon/40 p-4 sm:p-6 my-6 sm:my-8 rounded-[2px] bg-carbon/[0.01] filter blur-[0.5px] opacity-70 select-none pointer-events-none shadow-sm"
      >
        {/* Cabecera del Checkpoint Bloqueado */}
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          <div
            className="w-6 h-6 border border-carbon/50 flex items-center justify-center font-bold text-xs opacity-40 shrink-0"
            aria-hidden="true"
          >
            <span>?</span>
          </div>
          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <div className="ac-label ac-label--xs ac-label--faint truncate leading-tight">
              {t('studyPlan', 'checkpointVerification')}
            </div>
            <h4 className="text-xs sm:text-sm italic font-serif text-carbon/40 truncate leading-snug mt-0.5">
              {t('studyPlan', 'checkpointPhaseHint')}
            </h4>
          </div>
        </div>

        {/* Contenido Bloqueado */}
        <ExerciseCardContext.Provider value={{ bare: true }}>
          <div className="pointer-events-none opacity-80">
            {renderQuestionContent()}
          </div>
        </ExerciseCardContext.Provider>
      </div>
    );
  }

  return (
    <div
      data-node-id={id}
      className={`w-full border-2 p-4 sm:p-6 my-6 sm:my-8 rounded-[2px] transition-all duration-500 shadow-sm ${
        completed
          ? 'bg-canela/5 border-canela/40'
          : 'bg-mora/[0.02] border-carbon/15'
      }`}
    >
      {/* Cabecera del Checkpoint Activo */}
      <div className="flex items-center gap-3 sm:gap-4 mb-4">
        <div
          className={`w-6 h-6 border flex items-center justify-center font-bold text-xs shrink-0 transition-transform duration-500 ${
            completed
              ? 'border-canela bg-canela text-lienzo rotate-45'
              : 'border-carbon/30 bg-transparent text-carbon/50 rotate-0'
          }`}
          aria-hidden="true"
        >
          <span className={completed ? '-rotate-45 block' : ''}>
            {completed ? '✓' : '?'}
          </span>
        </div>
        <div className="min-w-0 flex-1 flex flex-col justify-center">
          <div
            className={`ac-label ac-label--xs font-bold truncate leading-tight ${
              completed ? 'text-canela' : 'text-carbon/40'
            }`}
          >
            {t('studyPlan', 'checkpointVerification')}
          </div>
          <h4 className="text-xs sm:text-sm italic font-serif text-carbon/60 truncate leading-snug mt-0.5">
            {completed
              ? t('studyPlan', 'completed') || 'Comprobación completada'
              : t('studyPlan', 'checkpointAnswerHint')}
          </h4>
        </div>
      </div>

      {/* Contenido Modular de la Pregunta en modo Bare (sin tarjeta anidada) */}
      <ExerciseCardContext.Provider value={{ bare: true }}>
        <div className="my-2">{renderQuestionContent()}</div>
      </ExerciseCardContext.Provider>

      {/* Explicación y feedback pedagógico */}
      {completed && explanation && (
        <div className="mt-6 pt-5 border-t border-carbon/10 animate-fade-in">
          <div className="ac-label ac-label--xs ac-label--canela-soft mb-2 truncate">
            {t('studyPlan', 'pedagogicalJustification')}
          </div>
          <p className="text-xs sm:text-sm font-serif italic text-carbon/70 leading-relaxed break-words">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
};

