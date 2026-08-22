import React, { useContext } from 'react';
import { PasoContext } from '@/content-pages/exercise/ui/PasoContext';
import { useI18n } from '@/i18n';

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
  const { t } = useI18n();

  if (!isCompleted) return null;

  return (
    <div className="mt-6 p-5 bg-canela/5 border border-canela/20 animate-fade-in text-sm text-carbon/80 leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0">
      <div className="ac-label ac-label--sm ac-label--canela-soft mb-2 flex items-center gap-2">
        <span>✦</span> {t('exercise', 'resolutionExplained')}
      </div>
      {children}
    </div>
  );
};
