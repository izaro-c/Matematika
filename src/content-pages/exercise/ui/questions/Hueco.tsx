import React, { useState, useCallback } from 'react';
import { useI18n } from '@/i18n';
import { useExerciseQuestion } from '../../hooks/useExerciseQuestion';
import { useSubcomponents } from '../../hooks/useSubcomponents';
import { ExerciseCard } from '../shared/ExerciseCard';
import type { ErrorComunProps, ResolucionProps, BaseQuestionProps } from '../../types';

export interface HuecoProps extends BaseQuestionProps {
  /** Texto del enunciado si se utiliza como bloque independiente */
  pregunta?: string;
  /** Valor correcto esperado (número o expresión) */
  correct: string;
  /** Pista que se despliega tras intentos fallidos */
  pista?: string;
  /** Tolerancia numérica para respuestas aproximadas (default: 0.001) */
  tolerance?: number;
}

function normalizeStr(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, '').replace(',', '.');
}

function numericMatch(a: string, b: string, tol: number): boolean {
  const fa = parseFloat(a.replace(',', '.'));
  const fb = parseFloat(b.replace(',', '.'));
  return !isNaN(fa) && !isNaN(fb) && Math.abs(fa - fb) <= tol;
}

const HuecoErrorComun: React.FC<ErrorComunProps> = () => null;
HuecoErrorComun.displayName = 'HuecoErrorComun';

const HuecoResolucion: React.FC<ResolucionProps> = () => null;
HuecoResolucion.displayName = 'HuecoResolucion';

type HuecoComponent = React.FC<HuecoProps> & {
  ErrorComun: React.FC<ErrorComunProps>;
  Resolucion: React.FC<ResolucionProps>;
};

/**
 * Hueco — Ejercicio de rellenar huecos numéricos o algebraicos.
 */
export const Hueco: HuecoComponent = ({
  id,
  pregunta,
  correct,
  pista,
  tolerance = 0.001,
  children,
}) => {
  const { t } = useI18n();

  const {
    isCompleted,
    isCorrect,
    hasFailed,
    tries,
    userAnswer,
    isShaking,
    activeTab,
    setActiveTab,
    submitAnswer,
  } = useExerciseQuestion({ id, type: 'hueco' });

  const { errorComunData, resolucionData, otherChildren } = useSubcomponents(children);
  const [input, setInput] = useState<string>((userAnswer as string) ?? '');

  const check = useCallback(() => {
    if (!input.trim() || isCompleted) return;
    const ok = numericMatch(input, correct, tolerance) || normalizeStr(input) === normalizeStr(correct);
    submitAnswer(ok, input);
  }, [input, isCompleted, correct, tolerance, submitAnswer]);

  const showHint = tries >= 2 && !isCompleted && Boolean(pista);
  const showBookmarks = Boolean(errorComunData || (isCompleted && resolucionData));

  // Renderizado en línea si no tiene enunciado de bloque ni pestañas de error/resolución
  if (!pregunta && !errorComunData && !resolucionData) {
    if (isCompleted) {
      return (
        <span className="inline-block px-2 font-bold font-serif text-musgo transition-all duration-500">
          {input || (userAnswer as string)}
        </span>
      );
    }

    return (
      <span className="inline-flex flex-col items-start relative group">
        <span className="inline-flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && check()}
            className={`w-24 text-center bg-transparent border-b-2 border-dashed font-serif text-carbon outline-none transition-all ${
              isShaking ? 'border-terracota animate-shake text-terracota' : 'page-accent-focus border-carbon/40'
            }`}
          />
          {input.trim() && (
            <button
              onClick={check}
              className="page-accent-text ac-eyebrow ac-eyebrow--sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              ↵
            </button>
          )}
        </span>
        {showHint && (
          <span className="absolute top-full left-0 mt-1 w-48 p-2 bg-lienzo border border-carbon/20 shadow-md text-xs font-serif italic text-carbon/70 z-10">
            {pista}
          </span>
        )}
      </span>
    );
  }

  const feedbackClass = isCorrect === true
    ? 'border-musgo/40 bg-musgo/5'
    : isCorrect === false
      ? 'border-terracota/50 bg-terracota/5'
      : '';

  return (
    <ExerciseCard
      id={id}
      errorComunData={errorComunData}
      resolucionData={resolucionData}
      isCorrect={isCompleted}
      hasFailed={hasFailed}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      className={`transition-all duration-500 group ${feedbackClass}`}
    >
      {pregunta && (
        <p className={`text-base font-bold text-carbon mb-6 leading-relaxed relative z-30 ${showBookmarks ? 'pr-20 sm:pr-28' : ''}`}>
          {pregunta}
        </p>
      )}

      {isCompleted ? (
        <div className="text-2xl font-bold text-musgo text-center my-6 transition-all duration-500">
          {input || (userAnswer as string)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center my-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && check()}
            placeholder={t('exercise', 'answerPlaceholder')}
            className={`w-40 text-center text-xl bg-transparent border-b-2 border-dashed font-serif text-carbon outline-none transition-all py-1 ${
              isShaking ? 'border-terracota animate-shake text-terracota' : 'page-accent-focus border-carbon/40'
            }`}
          />
        </div>
      )}

      {!isCompleted && (
        <div className="mt-6 flex justify-end border-carbon/10 pt-5">
          <button
            onClick={check}
            disabled={!input.trim()}
            className="ac-btn ac-interactive page-accent-button px-6 py-3 text-xs border border-carbon/30 text-carbon transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {t('exercise', 'check')}
          </button>
        </div>
      )}

      {showHint && !isCompleted && (
        <div className="mt-4 pt-3 border-t border-carbon/10 text-sm text-carbon/60 italic font-serif flex gap-2 justify-center">
          <span className="page-accent-text">❦</span>
          <span>{pista}</span>
        </div>
      )}


      {isCompleted && resolucionData && (
        <div className="mt-4 pt-3 border-t border-musgo/20 text-xs font-sans text-musgo flex items-center justify-center">
          <button
            type="button"
            onClick={() => setActiveTab('resolucion')}
            className="text-xs text-musgo font-medium flex items-center gap-1 hover:underline cursor-pointer"
          >
            {t('exercise', 'resolutionExplained')} →
          </button>
        </div>
      )}

      {otherChildren.length > 0 && <div className="mt-4">{otherChildren}</div>}
    </ExerciseCard>
  );
};

Hueco.ErrorComun = HuecoErrorComun;
Hueco.Resolucion = HuecoResolucion;
