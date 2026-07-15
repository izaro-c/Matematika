/**
 * Solucion.tsx — Bloque de Solución Oculta
 *
 * Muestra un botón "Ver Solución" que revela el contenido al hacer clic.
 * Se puede usar tanto en ejercicios como en ejemplos.
 */
import React, { useState } from 'react';
import { useStepBinding } from '@/shared/ui/StepBinding';

interface SolucionProps {
  children: React.ReactNode;
  /** Etiqueta del botón (por defecto "Ver Solución Completa") */
  label?: string;
}

/**
 * Componente principal para renderizar la solución detallada de un ejercicio.
 */
export const Solucion: React.FC<SolucionProps> = ({ children, label = 'Ver Solución Completa' }) => {
  const [revealed, setRevealed] = useState(false);
  const { setActiveStep } = useStepBinding();

  return (
    <div className="my-8 font-serif relative">
      {!revealed ? (
        <button
          onClick={() => {
            setRevealed(true);
            setActiveStep('Solucion');
          }}
          className="w-full flex items-center justify-center gap-3 py-4 elegant-panel text-carbon/60 hover:text-carbon text-[11px] font-sans uppercase tracking-widest group"
          style={{ '--hover-accent': 'var(--page-accent)' } as React.CSSProperties}
        >
          <span className="page-accent-text opacity-80 group-hover:opacity-100 transition-all">{label}</span>
        </button>
      ) : (
        <div 
          className="elegant-panel p-8 animate-fade-in relative"
        >
          {/* Ocultar arriba (opcional) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setRevealed(false);
              setActiveStep(null);
            }}
            className="page-accent-text-hover absolute top-4 right-4 text-[10px] font-sans uppercase tracking-widest text-carbon/30 transition-colors"
          >
            ✕ Cerrar
          </button>

          {/* Encabezado */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-carbon/50 text-[10px] font-sans uppercase tracking-widest border-b border-carbon/20 pb-1">
              Solución Detallada
            </span>
          </div>
          {/* Contenido */}
          <div className="text-sm text-carbon/80 leading-relaxed [&_strong]:text-carbon [&_p]:mb-4 [&_p:last-child]:mb-0">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
