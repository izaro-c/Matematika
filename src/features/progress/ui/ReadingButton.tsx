import React from 'react';
import { useProgressStore } from '@/features/progress/UserProgressStore';

/**
 * Propiedades del botón de lectura
 */
interface ReadingButtonProps {
  /** ID o slug del contenido que se marcará como completado */
  id: string;
}

/**
 * Botón al final del contenido para marcar un elemento como leído.
 * Actualiza el `UserProgressStore` global y muestra una animación de rotación en el rombo
 * cuando cambia de estado.
 */
export const ReadingButton: React.FC<ReadingButtonProps> = ({ id }) => {
  const { isRead, toggleRead } = useProgressStore();
  const alreadyRead = isRead(id);

  return (
    <div className="w-full flex justify-center my-16">
      <button
        onClick={() => toggleRead(id)}
        className={`group relative flex items-center justify-center gap-4 sm:gap-6 px-6 sm:px-16 py-5 sm:py-6 overflow-hidden transition-all duration-700 ease-out border-y ${
          alreadyRead 
            ? 'border-salvia/30 bg-salvia/5' 
            : 'page-accent-border-hover border-carbon/10 bg-transparent hover:bg-carbon/[0.02]'
        }`}
      >
        <div className={`flex items-center justify-center w-5 h-5 border transition-all duration-500 ${
          alreadyRead 
            ? 'border-salvia bg-transparent rotate-45' 
            : 'page-accent-group-border border-carbon/40 rotate-0 group-hover:rotate-45'
        }`}>
          {alreadyRead && (
            <div className="w-3 h-3 bg-salvia scale-animation"></div>
          )}
        </div>
        
        <span className={`whitespace-nowrap text-xs sm:text-sm font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold transition-colors duration-500 ${
          alreadyRead ? 'text-salvia' : 'page-accent-group-hover text-carbon/60'
        }`}>
          {alreadyRead ? 'Completado' : 'Marcar como Leído'}
        </span>
      </button>
    </div>
  );
};
