import React, { useState } from 'react';
import { useStepBinding } from '@/components/ui/StepBinding';
import { useI18n } from '@/i18n';

export interface PasoProps {
  /** Identificador único para enlace al diagrama */
  id?: string;
  /** Número correlativo del paso */
  numero?: number;
  /** Título del paso */
  titulo?: string;
  /** Si true, el paso se muestra directamente sin botón de desplegar */
  visible?: boolean;
  /** Contenido explicativo del paso */
  children: React.ReactNode;
}

/**
 * Paso — Paso de solución progresiva para ejemplos guiados.
 */
export const Paso: React.FC<PasoProps> = ({ id, numero, titulo, children, visible = false }) => {
  const { t } = useI18n();
  const [revealed, setRevealed] = useState(visible);
  const { setActiveStep } = useStepBinding();

  const toggle = () => {
    if (revealed) {
      setRevealed(false);
      setActiveStep(null);
    } else {
      setRevealed(true);
      if (id) setActiveStep(id);
    }
  };

  return (
    <div className="my-5 font-serif">
      {/* Cabecera del paso */}
      <div
        className="flex items-center gap-3 mb-2 cursor-pointer group select-none"
        onClick={toggle}
        onMouseEnter={() => {
          if (revealed && id) setActiveStep(id);
        }}
      >
        {numero !== undefined && (
          <div className="page-accent-group-border flex items-center justify-center w-7 h-7 bg-lienzo border border-carbon/30 rounded-none text-xs font-serif font-bold text-carbon/70 shrink-0 ac-inset-shadow-sm transition-all">
            {numero}
          </div>
        )}
        {titulo && (
          <h4 className="page-accent-group-hover text-sm font-semibold text-carbon font-sans transition-colors flex items-center gap-2">
            {titulo}
            <span className="text-[9px] text-carbon/30 group-hover:text-carbon/60 transition-colors">
              {revealed ? '▲' : '▼'}
            </span>
          </h4>
        )}
      </div>

      {/* Contenido desplegado o botón de revelar */}
      <div className="ml-10">
        {revealed ? (
          <div className="text-sm text-carbon/80 leading-relaxed border-l-2 border-carbon/15 pl-4 py-1 [&_p]:mb-2 [&_p:last-child]:mb-0 animate-fade-in">
            {children}
          </div>
        ) : (
          <button
            onClick={() => {
              setRevealed(true);
              if (id) setActiveStep(id);
            }}
            className="page-accent-button text-xs font-sans text-carbon/50 border border-carbon/20 bg-lienzo px-4 py-2 rounded-none transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2 group cursor-pointer"
          >
            <span className="group-hover:scale-110 transition-transform">▷</span>
            {t('exercise', 'revealStep')}
          </button>
        )}
      </div>
    </div>
  );
};
