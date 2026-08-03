import React from 'react';
import { useProgressStore } from '@/lib/stores/UserProgressStore';

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
 * cuando cambia de estado. El label usa un slot de ancho fijo (ambos textos apilados)
 * para que marcar/desmarcar no mueva el layout.
 */
export const ReadingButton: React.FC<ReadingButtonProps> = ({ id }) => {
  const { isRead, toggleRead } = useProgressStore();
  const alreadyRead = isRead(id);

  return (
    <div className="w-full flex justify-center mt-8 mb-12">
      <button
        onClick={() => toggleRead(id)}
        aria-pressed={alreadyRead}
        className={`group relative flex items-center justify-center gap-4 sm:gap-6 px-6 sm:px-16 py-5 sm:py-6 overflow-hidden transition-all duration-700 ease-out border-y ${
          alreadyRead
            ? 'page-accent-read-button'
            : 'page-accent-border-hover border-carbon/10 bg-transparent hover:bg-carbon/[0.02]'
        }`}
      >
        <div
          className={`flex items-center justify-center w-5 h-5 border transition-all duration-500 ${
            alreadyRead
              ? 'page-accent-border bg-transparent rotate-45'
              : 'page-accent-group-border border-carbon/40 rotate-0 group-hover:rotate-45'
          }`}
        >
          {alreadyRead && (
            <div className="w-3 h-3 page-accent-bg scale-animation" />
          )}
        </div>

        <span
          className={`relative ac-eyebrow text-xs sm:text-sm transition-colors duration-500 ${
            alreadyRead ? 'page-accent-text' : 'page-accent-group-hover text-carbon/60'
          }`}
        >
          <span className="relative inline-block">
            Marcar como Leído
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1.5px] bg-current opacity-80 transition-transform duration-500 ease-out origin-left pointer-events-none ${
                alreadyRead ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </span>
        </span>
      </button>
    </div>
  );
};
