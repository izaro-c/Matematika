import React, { useState } from 'react';
import { useStepBinding } from '@/components/ui/StepBinding';
import { KatexText } from '@/components/ui/KatexText';
import { useExerciseQuestion } from '../../hooks/useExerciseQuestion';
import { useSubcomponents } from '../../hooks/useSubcomponents';
import { ExerciseCard } from '../shared/ExerciseCard';
import { QuestionFeedback } from '../shared/QuestionFeedback';
import type { Opcion, ErrorComunProps, ResolucionProps, BaseQuestionProps } from '../../types';

export interface PreguntaProps extends BaseQuestionProps {
  /** Enunciado de la pregunta */
  texto?: string;
  question?: string;
  /** Valor identificador de la opción correcta */
  correct?: string;
  answer?: string;
  /** Lista de opciones estructuradas */
  opciones?: Opcion[];
  /** Lista simplificada de opciones (strings) */
  options?: string[];
}

const PreguntaErrorComun: React.FC<ErrorComunProps> = () => null;
PreguntaErrorComun.displayName = 'PreguntaErrorComun';

const PreguntaResolucion: React.FC<ResolucionProps> = () => null;
PreguntaResolucion.displayName = 'PreguntaResolucion';

function shuffle<T>(array: T[]): T[] {
  if (!array || !Array.isArray(array)) return [];
  const arr = [...array];
  const buf = new Uint32Array(arr.length);
  crypto.getRandomValues(buf);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = buf[i] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type PreguntaComponent = React.FC<PreguntaProps> & {
  ErrorComun: React.FC<ErrorComunProps>;
  Resolucion: React.FC<ResolucionProps>;
};

/**
 * Pregunta — Pregunta de opción múltiple / opción única.
 */
export const Pregunta: PreguntaComponent = ({
  id,
  texto,
  question,
  correct,
  answer: answerAlias,
  opciones,
  options,
  children,
}) => {
  const { setActiveStep } = useStepBinding();

  const {
    isCorrect,
    hasFailed,
    userAnswer,
    activeTab,
    setActiveTab,
    submitAnswer,
    tryAgain,
  } = useExerciseQuestion({ id, type: 'pregunta' });

  const { errorComunData, resolucionData, otherChildren } = useSubcomponents(children);

  const [selected, setSelected] = useState<string | null>((userAnswer as string) ?? null);

  const displayTexto = texto || question || '';
  const correctAnswer = correct || answerAlias || '';

  const [displayOpciones] = useState<Opcion[]>(() => {
    const raw = opciones || options?.map((opt) => ({ value: opt, texto: opt })) || [];
    return shuffle(raw);
  });

  const isAnswered = selected !== null;
  const isQuestionCorrect = selected === correctAnswer || isCorrect === true;
  const showResolutionBookmark = isQuestionCorrect && Boolean(resolucionData);
  const showBookmarks = Boolean(errorComunData || showResolutionBookmark);

  const handleSelect = (value: string) => {
    setActiveStep(id);
    if (isAnswered) return;
    setSelected(value);
    submitAnswer(value === correctAnswer, value);
  };

  const handleTryAgain = () => {
    setSelected(null);
    tryAgain();
  };

  const selectedOpcion = displayOpciones.find((o) => o.value === selected);

  return (
    <ExerciseCard
      id={id}
      errorComunData={errorComunData}
      resolucionData={resolucionData}
      isCorrect={isQuestionCorrect}
      hasFailed={hasFailed}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {displayTexto && (
        <div className={`text-base font-bold text-carbon mb-5 leading-relaxed ${showBookmarks ? 'pr-20 sm:pr-28' : ''}`}>
          <KatexText text={displayTexto} />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {displayOpciones.map((opt, index) => {
          const letter = String.fromCharCode(65 + index);
          const isThisSelected = selected === opt.value;
          const isThisCorrect = opt.value === correctAnswer;
          const showSuccess = isAnswered && isThisCorrect && isQuestionCorrect;
          const showFailure = isAnswered && isThisSelected && !isThisCorrect;

          let btnClass = 'page-accent-button border-carbon/30 cursor-pointer hover:-translate-y-0.5 hover:shadow-sm';
          let badgeClass = 'border-carbon/40 text-carbon/60 bg-transparent';
          let badgeChar = letter;

          if (showSuccess) {
            btnClass = 'border-musgo bg-musgo/10 text-musgo ac-inset-shadow';
            badgeClass = 'border-musgo bg-musgo text-lienzo';
            badgeChar = '✓';
          } else if (showFailure) {
            btnClass = 'border-terracota bg-terracota/5 text-terracota';
            badgeClass = 'border-terracota bg-terracota text-lienzo';
            badgeChar = '✗';
          } else if (isThisSelected) {
            btnClass = 'border-carbon/50 bg-carbon/5';
          } else if (isAnswered) {
            btnClass = 'border-carbon/10 text-carbon/40 cursor-not-allowed opacity-60';
          }

          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              disabled={isAnswered}
              className={`text-left px-5 py-3 border rounded-none text-[15px] font-serif transition-all duration-300 flex items-center gap-4 ${btnClass}`}
            >
              <span
                className={`inline-flex items-center justify-center w-7 h-7 rounded-none border font-serif text-xs shrink-0 transition-all duration-300 ${badgeClass}`}
              >
                {badgeChar}
              </span>
              <span className="flex-1">
                <KatexText text={opt.texto} />
              </span>
            </button>
          );
        })}
      </div>

      <QuestionFeedback
        hasFailed={hasFailed}
        isSuccess={isQuestionCorrect}
        errorComunData={errorComunData}
        resolucionData={resolucionData}
        feedbackMessage={selectedOpcion?.feedback}
        onTryAgain={handleTryAgain}
        onOpenError={() => setActiveTab('error')}
        onOpenResolucion={() => setActiveTab('resolucion')}
      />

      {otherChildren.length > 0 && <div className="mt-4">{otherChildren}</div>}
    </ExerciseCard>
  );
};

Pregunta.ErrorComun = PreguntaErrorComun;
Pregunta.Resolucion = PreguntaResolucion;
