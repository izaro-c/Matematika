import React, { useState } from 'react';

/**
 * Propiedades para un enlace del glosario
 */
interface GlossaryLinkProps {
  /** Título del término a mostrar en el tooltip */
  term: string;
  /** Breve descripción o definición del término */
  description?: string;
  children: React.ReactNode;
}

/**
 * Enlace de texto simple que, al pasar el cursor, despliega un Tooltip
 * elegante (popover) con la definición corta del término. No navega a otra página.
 * Ideal para pequeñas aclaraciones sin interrumpir la lectura.
 */
export const GlossaryLink: React.FC<GlossaryLinkProps> = ({ term, description, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="page-accent-hover font-bold text-carbon border-b border-carbon/40 border-dotted cursor-help px-[2px] transition-colors rounded-none">
        {children}
      </span>

      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 bg-lienzo border border-carbon/20 text-carbon rounded-none ac-elevation-float p-5 pointer-events-none transition-all animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="page-accent-text font-serif text-lg font-bold mb-3 border-b border-carbon/10 pb-2">{term}</div>
          <div className="leading-relaxed opacity-80 text-sm font-serif">
            {description || "Término fundamental."}
          </div>
          {/* Pequeño diamante de conexión */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-lienzo border-b border-r border-carbon/20 rotate-45 -translate-y-1/2"></div>
        </div>
      )}
    </span>
  );
};
