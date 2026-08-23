import React, { useState } from 'react';
import { useExercise } from '@/lib/page-context/ExerciseContext';
import { useI18n } from '@/i18n';
import type { ErrorComunProps } from '../../types';

/**
 * ErrorComun — Bloque desplegable de advertencia conceptual frecuente.
 *
 * Se destaca en color terracota y puede asociarse a una pregunta concreta para
 * desplegarse únicamente cuando el alumno yerra en dicha pregunta.
 */
export const ErrorComun: React.FC<ErrorComunProps> = ({ titulo, title, children, questionId }) => {
  const [open, setOpen] = useState(false);
  const { state } = useExercise();
  const { t } = useI18n();

  const displayTitle = titulo || title || '';

  if (questionId) {
    const qState = state.questions[questionId];
    const hasFailed = qState && qState.tries > 0 && qState.isCorrect === false;
    if (!hasFailed) return null;
  }

  return (
    <div
      className="my-8 font-serif elegant-panel transition-all duration-300 cursor-pointer select-none bg-terracota/5 border-terracota/30"
      style={{ '--hover-accent': 'var(--theme-terracota)' } as React.CSSProperties}
      onClick={() => setOpen((o) => !o)}
    >
      <div className="flex items-center gap-3 px-5 py-3">
        <span className="text-terracota font-bold text-base shrink-0" aria-hidden>
          {open ? '▾' : '▸'}
        </span>
        <span className="ac-label ac-label--sm ac-label--terracota-soft shrink-0">
          {t('exercise', 'commonError')}
        </span>
        <span className="text-sm font-semibold text-carbon leading-tight">{displayTitle}</span>
      </div>

      {open && (
        <div
          className="px-5 pb-5 pt-1 text-sm text-carbon/80 leading-relaxed border-t border-terracota/10"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      )}
    </div>
  );
};
