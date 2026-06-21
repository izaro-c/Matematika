import React from 'react';
import { useLessonStore } from '@/controller/store/LessonStore';

/**
 * Propiedades del enlace de resaltado.
 */
interface HighlightLinkProps {
  /** ID del paso o estado en el simulador que debe activarse */
  target: string;
  children: React.ReactNode;
}

/**
 * Enlace interactivo que, al ser sobrevolado o clicado, envía un estado 
 * al `LessonStore` para cambiar lo que se muestra en un simulador visual cercano.
 * Muy útil para vincular texto MDX con cambios de estado en un lienzo (Canvas).
 */
export const HighlightLink: React.FC<HighlightLinkProps> = ({ target, children }) => {
  const { setActiveStep } = useLessonStore();

  return (
    <span 
      onClick={() => setActiveStep(target)}
      onMouseEnter={() => setActiveStep(target)}
      onMouseLeave={() => setActiveStep(null)}
      className="cursor-pointer border-b-2 border-salvia bg-salvia/20 hover:bg-salvia/40 transition-colors rounded-none px-[4px] py-[2px] font-bold text-carbon shadow-sm"
      title="Resaltar en el simulador"
    >
      {children}
    </span>
  );
};
