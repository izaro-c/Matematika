import React from 'react';
import { useProgressStore } from '@/controller/store/UserProgressStore';

/**
 * Propiedades del botón de lectura
 */
interface ReadingButtonProps {
  /** ID o slug del contenido que se marcará como completado */
  id: string;
}

/**
 * Botón grande al final de las lecciones/conceptos para marcar un elemento como "Leído" (completado).
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
        className={`group relative flex items-center justify-center gap-6 px-16 py-6 overflow-hidden transition-all duration-700 ease-out border-y ${
          alreadyRead 
            ? 'border-salvia/30 bg-salvia/5' 
            : 'border-carbon/10 bg-transparent hover:border-terracota/30 hover:bg-carbon/[0.02]'
        }`}
      >
        <div className={`flex items-center justify-center w-5 h-5 border transition-all duration-500 ${
          alreadyRead 
            ? 'border-salvia bg-transparent rotate-45' 
            : 'border-carbon/40 rotate-0 group-hover:rotate-45 group-hover:border-terracota'
        }`}>
          {alreadyRead && (
            <div className="w-3 h-3 bg-salvia scale-animation"></div>
          )}
        </div>
        
        <span className={`text-sm font-sans uppercase tracking-[0.3em] font-bold transition-colors duration-500 ${
          alreadyRead ? 'text-salvia' : 'text-carbon/60 group-hover:text-terracota'
        }`}>
          {alreadyRead ? 'Completado' : 'Marcar como Leído'}
        </span>
      </button>
    </div>
  );
};
