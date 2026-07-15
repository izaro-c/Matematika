/**
 * Paso.tsx — Paso de Solución para Ejemplos
 *
 * Permite mostrar la solución de un ejemplo de forma progresiva.
 * Cada paso puede revelarse individualmente haciendo clic en "Revelar paso".
 * Los pasos se revelan en orden: no se puede revelar el paso N sin haber
 * revelado el N-1.
 *
 * Uso:
 * <Paso numero={1} titulo="Identificar la matriz A">
 *   La matriz de coeficientes es A = ...
 * </Paso>
 */
import React, { useState } from 'react';
import { useStepBinding } from '@/shared/ui/StepBinding';

interface PasoProps {
  id?: string;
  numero?: number;
  titulo?: string;
  children: React.ReactNode;
  /** Si true, el paso se muestra directamente sin botón de revelar */
  visible?: boolean;
}

/**
 * Permite mostrar la solución de un ejemplo de forma progresiva.
 * Cada paso puede revelarse individualmente haciendo clic en "Revelar paso".
 * Los pasos se revelan en orden.
 */
export const Paso: React.FC<PasoProps> = ({ id, numero, titulo, children, visible = false }) => {
  const [revealed, setRevealed] = useState(visible);
  const { setActiveStep } = useStepBinding();
  const displayNum = numero;

  return (
    <div className="my-5 font-serif">
      {/* Cabecera del paso — siempre visible e interactiva */}
      <div 
        className="flex items-center gap-3 mb-2 cursor-pointer group select-none"
        onClick={() => {
          if (revealed) {
            setRevealed(false);
            setActiveStep(null);
          } else {
            setRevealed(true);
            if (id) setActiveStep(id);
          }
        }}
        onMouseEnter={() => {
          if (revealed && id) setActiveStep(id);
        }}
      >
        {displayNum !== undefined && (
          <div className="page-accent-group-border flex items-center justify-center w-7 h-7 bg-lienzo border border-carbon/30 rounded-none text-xs font-serif font-bold text-carbon/70 shrink-0 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all">
            {displayNum}
          </div>
        )}
        {titulo && (
          <h4 className="page-accent-group-hover text-sm font-bold text-carbon font-sans uppercase tracking-wider transition-colors flex items-center gap-2">
            {titulo}
            <span className="text-[9px] text-carbon/30 group-hover:text-carbon/60 transition-colors">
              {revealed ? '▲' : '▼'}
            </span>
          </h4>
        )}
      </div>

      {/* Contenido */}
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
            className="page-accent-button text-xs font-sans text-carbon/50 border border-carbon/20 bg-lienzo px-4 py-2 rounded-none transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2 group"
          >
            <span className="group-hover:scale-110 transition-transform">▷</span>
            Revelar paso
          </button>
        )}
      </div>
    </div>
  );
};
