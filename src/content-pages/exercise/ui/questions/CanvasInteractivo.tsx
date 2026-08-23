import React from 'react';
import { useI18n } from '@/i18n';
import { useExerciseQuestion } from '../../hooks/useExerciseQuestion';
import { useSubcomponents } from '../../hooks/useSubcomponents';
import { ExerciseCard } from '../shared/ExerciseCard';
import { QuestionFeedback } from '../shared/QuestionFeedback';
import type { ErrorComunProps, ResolucionProps, BaseQuestionProps } from '../../types';

export interface CanvasInteractivoProps extends BaseQuestionProps {
  /** Título del lienzo interactivo */
  title?: string;
  /** Componente hijo del diagrama que recibirá onComplete e isCompleted */
  children: React.ReactNode;
}

const CanvasInteractivoErrorComun: React.FC<ErrorComunProps> = () => null;
CanvasInteractivoErrorComun.displayName = 'CanvasInteractivoErrorComun';

const CanvasInteractivoResolucion: React.FC<ResolucionProps> = () => null;
CanvasInteractivoResolucion.displayName = 'CanvasInteractivoResolucion';

type CanvasInteractivoComponent = React.FC<CanvasInteractivoProps> & {
  ErrorComun: React.FC<ErrorComunProps>;
  Resolucion: React.FC<ResolucionProps>;
};

/**
 * CanvasInteractivo — Envoltorio estandarizado que conecta diagramas visuales con el motor de ejercicios
 * y la tarjeta con marcapáginas Arts & Crafts.
 */
export const CanvasInteractivo: CanvasInteractivoComponent = ({ id, title, children }) => {
  const { t } = useI18n();

  const {
    isCompleted,
    hasFailed,
    activeTab,
    setActiveTab,
    submitAnswer,
    tryAgain,
  } = useExerciseQuestion({
    id,
    type: 'canvas',
  });

  const { errorComunData, resolucionData, otherChildren } = useSubcomponents(children);

  const handleComplete = () => {
    submitAnswer(true);
  };

  const primaryChild = otherChildren[0] ?? (React.isValidElement(children) ? children : null);
  const childWithProps = React.isValidElement(primaryChild)
    ? React.cloneElement(
        primaryChild as React.ReactElement<{ onComplete?: () => void; isCompleted?: boolean }>,
        {
          onComplete: handleComplete,
          isCompleted,
        }
      )
    : primaryChild;

  const showBookmarks = Boolean(errorComunData || (isCompleted && resolucionData));

  return (
    <ExerciseCard
      id={id}
      errorComunData={errorComunData}
      resolucionData={resolucionData}
      isCorrect={isCompleted}
      hasFailed={hasFailed}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      className={`transition-all ${isCompleted ? 'bg-canela/5 border-canela/30' : ''}`}
    >
      <h4 className={`font-bold text-carbon mb-6 flex items-center justify-between z-30 relative text-lg leading-relaxed ${showBookmarks ? 'pr-20 sm:pr-28' : ''}`}>
        <span>
          {title || t('exercise', 'interactiveCanvas') || 'Lienzo Interactivo'}
        </span>
        {isCompleted && (
          <span className="text-canela font-serif text-base shrink-0 ml-2">
            ❦ {t('exercise', 'goalAchieved') || 'Objetivo cumplido'}
          </span>
        )}
      </h4>

      <div className="relative">
        {childWithProps}
        {isCompleted && (
          <div className="absolute inset-0 z-50 pointer-events-none border-2 border-canela/20 rounded-none bg-canela/[0.02]" />
        )}
      </div>

      <QuestionFeedback
        hasFailed={hasFailed}
        isSuccess={isCompleted}
        errorComunData={errorComunData}
        resolucionData={resolucionData}
        onTryAgain={tryAgain}
        onOpenError={() => setActiveTab('error')}
        onOpenResolucion={() => setActiveTab('resolucion')}
      />

      {otherChildren.length > 1 && <div className="mt-4">{otherChildren.slice(1)}</div>}
    </ExerciseCard>
  );
};

CanvasInteractivo.ErrorComun = CanvasInteractivoErrorComun;
CanvasInteractivo.Resolucion = CanvasInteractivoResolucion;
