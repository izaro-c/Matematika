import React, { useContext } from 'react';
import { PasoContext } from '@/features/exercises/ui/PasoContext';

interface ResolucionProps {
  children: React.ReactNode;
}

/**
 * Componente Resolucion: Muestra la explicación didáctica y la resolución detallada
 * del paso en el ejercicio. Consume el PasoContext para renderizarse y desplegarse
 * únicamente cuando el alumno ha respondido correctamente a todas las preguntas de dicho paso.
 */
export const Resolucion: React.FC<ResolucionProps> = ({ children }) => {
  const { isCompleted } = useContext(PasoContext);

  if (!isCompleted) return null;

  return (
    <div className="mt-6 p-5 bg-salvia/5 border border-salvia/20 animate-fade-in text-sm text-carbon/80 leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0">
      <div className="font-sans font-bold text-[10px] uppercase tracking-widest text-salvia/80 mb-2 flex items-center gap-2">
        <span>✦</span> Resolución explicada:
      </div>
      {children}
    </div>
  );
};
