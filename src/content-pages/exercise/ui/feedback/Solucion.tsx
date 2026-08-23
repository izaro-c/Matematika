import React, { useState } from 'react';
import { useStepBinding } from '@/components/ui/StepBinding';
import { useI18n } from '@/i18n';

export interface SolucionProps {
  /** Etiqueta personalizada del botón */
  label?: string;
  /** Contenido de la solución completa */
  children: React.ReactNode;
}

/**
 * Solucion — Bloque desplegable de solución completa para ejercicios y ejemplos.
 */
export const Solucion: React.FC<SolucionProps> = ({ children, label }) => {
  const { t } = useI18n();
  const [revealed, setRevealed] = useState(false);
  const { setActiveStep } = useStepBinding();
  const buttonLabel = label ?? t('exercise', 'viewFullSolution');

  return (
    <div className="my-8 font-serif relative">
      {!revealed ? (
        <button
          onClick={() => {
            setRevealed(true);
            setActiveStep('Solucion');
          }}
          className="w-full flex items-center justify-center gap-3 py-4 elegant-panel ac-eyebrow text-carbon/60 hover:text-carbon group cursor-pointer"
          style={{ '--hover-accent': 'var(--page-accent)' } as React.CSSProperties}
        >
          <span className="page-accent-text opacity-80 group-hover:opacity-100 transition-all">
            {buttonLabel}
          </span>
        </button>
      ) : (
        <div className="elegant-panel p-8 animate-fade-in relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setRevealed(false);
              setActiveStep(null);
            }}
            className="page-accent-text-hover absolute top-4 right-4 ac-eyebrow ac-eyebrow--sm text-carbon/30 transition-colors cursor-pointer"
          >
            ✕ {t('common', 'close')}
          </button>

          <div className="flex items-center gap-2 mb-6">
            <span className="text-carbon/50 ac-eyebrow ac-eyebrow--sm border-b border-carbon/20 pb-1">
              {t('exercise', 'detailedSolution')}
            </span>
          </div>

          <div className="text-sm text-carbon/80 leading-relaxed [&_strong]:text-carbon [&_p]:mb-4 [&_p:last-child]:mb-0">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
