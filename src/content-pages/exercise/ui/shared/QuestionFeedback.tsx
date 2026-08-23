import React from 'react';
import { KatexText } from '@/components/ui/KatexText';
import { useI18n } from '@/i18n';
import type { ErrorComunData, ResolucionData } from '../../types';

export interface QuestionFeedbackProps {
  /** Indica si el último intento falló */
  hasFailed: boolean;
  /** Indica si la pregunta se ha completado con éxito */
  isSuccess: boolean;
  /** Datos del error común si fueron provistos como subcomponente */
  errorComunData?: ErrorComunData | null;
  /** Datos de la resolución explicada si fueron provistos */
  resolucionData?: ResolucionData | null;
  /** Mensaje de feedback específico (admite sintaxis LaTeX) */
  feedbackMessage?: string;
  /** Callback para reintentar la pregunta */
  onTryAgain?: () => void;
  /** Callback para cambiar a la pestaña de error común */
  onOpenError?: () => void;
  /** Callback para cambiar a la pestaña de resolución */
  onOpenResolucion?: () => void;
}

/**
 * QuestionFeedback — Barra estandarizada de retroalimentación didáctica Arts & Crafts
 * para todos los componentes de ejercicios.
 */
export const QuestionFeedback: React.FC<QuestionFeedbackProps> = ({
  hasFailed,
  isSuccess,
  errorComunData,
  resolucionData,
  feedbackMessage,
  onTryAgain,
  onOpenError,
  onOpenResolucion,
}) => {
  const { t } = useI18n();

  return (
    <>
      {/* Panel de fallo y sugerencias */}
      {hasFailed && (
        <div
          role="alert"
          aria-live="polite"
          className="mt-5 pt-4 border-t border-carbon/15 text-sm text-carbon/60 italic font-serif flex flex-col gap-3 animate-fade-in"
        >
          <div className="flex gap-3 items-start">
            <span className="text-terracota text-lg leading-none">❦</span>
            <div>
              {feedbackMessage ? (
                <KatexText text={feedbackMessage} />
              ) : (
                <span>{t('exercise', 'incorrectFeedback')}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2">
            {onTryAgain && (
              <button
                type="button"
                onClick={onTryAgain}
                className="ac-btn ac-btn-ghost ac-interactive px-4 py-2 text-[10px] text-carbon/60 flex items-center gap-2 cursor-pointer"
              >
                <span>❧</span> {t('exercise', 'tryAgain')}
              </button>
            )}

            {errorComunData && onOpenError && (
              <button
                type="button"
                onClick={onOpenError}
                className="text-xs text-terracota font-sans font-medium flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <span>❦</span> {t('exercise', 'commonError')} →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Enlace rápido a resolución detallada */}
      {isSuccess && resolucionData && onOpenResolucion && (
        <div className="mt-4 pt-3 border-t border-musgo/20 text-xs font-sans text-musgo flex items-center justify-between">
          <button
            type="button"
            onClick={onOpenResolucion}
            className="text-xs text-musgo font-medium flex items-center gap-1 hover:underline cursor-pointer"
          >
            {t('exercise', 'resolutionExplained')} →
          </button>
        </div>
      )}
    </>
  );
};
