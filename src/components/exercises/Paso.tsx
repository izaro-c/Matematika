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
import { useLessonStore } from '../../store/LessonStore';

interface PasoProps {
  id?: string;
  numero?: number;
  titulo?: string;
  children: React.ReactNode;
  /** Si true, el paso se muestra directamente sin botón de revelar */
  visible?: boolean;
}

export const Paso: React.FC<PasoProps> = ({ id, numero, titulo, children, visible = false }) => {
  const [revealed, setRevealed] = useState(visible);
  const { setActiveStep } = useLessonStore();
  const displayId = numero || id;

  return (
    <div className="my-5 font-serif">
      {/* Cabecera del paso — siempre visible */}
      <div 
        className="flex items-center gap-3 mb-2 cursor-pointer group"
        onClick={() => {
          if (revealed && displayId) setActiveStep(displayId.toString());
        }}
        onMouseEnter={() => {
          if (revealed && displayId) setActiveStep(displayId.toString());
        }}
      >
        {displayId && (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-carbon/8 border border-carbon/20 text-xs font-mono font-bold text-carbon/60 shrink-0 group-hover:border-carbon/50 transition-colors">
            {displayId}
          </div>
        )}
        {titulo && (
          <h4 className="text-sm font-bold text-carbon font-sans uppercase tracking-wider group-hover:text-terracota transition-colors">
            {titulo}
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
              if (displayId) setActiveStep(displayId.toString());
            }}
            className="text-xs font-sans text-carbon/40 hover:text-carbon border border-dashed border-carbon/20 hover:border-carbon/40 px-4 py-2 rounded transition-all flex items-center gap-2 group"
          >
            <span className="group-hover:scale-110 transition-transform">▷</span>
            Revelar paso
          </button>
        )}
      </div>
    </div>
  );
};
