import React, { useState } from 'react';
import { VintageSeal } from '@/components/ui/VintageSeal';
import { useProgressStore } from '@/lib/stores/UserProgressStore';
import { useI18n } from '@/i18n';

/**
 * Propiedades del botón de lectura
 */
interface ReadingButtonProps {
  /** ID o slug del contenido que se marcará como completado */
  id: string;
}

/**
 * Botón al final del contenido para marcar un elemento como leído.
 * Actualiza el `UserProgressStore` global, muestra el sello vintage animado
 * y una transición de rombo de tinta.
 */
export const ReadingButton: React.FC<ReadingButtonProps> = ({ id }) => {
  const { t } = useI18n();
  const { isRead, toggleRead } = useProgressStore();
  const alreadyRead = isRead(id);
  const [justStamped, setJustStamped] = useState(false);

  const handleToggle = () => {
    if (!alreadyRead) {
      setJustStamped(true);
    } else {
      setJustStamped(false);
    }
    toggleRead(id);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center mt-8 mb-12 gap-5">

      <button
        onClick={handleToggle}
        aria-pressed={alreadyRead}
        className={`group relative flex items-center justify-center gap-4 sm:gap-6 px-6 sm:px-16 py-5 sm:py-6 transition-all duration-700 ease-out border-y ${
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
            {t('content', 'markAsRead')}
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1.5px] bg-current opacity-80 transition-transform duration-500 ease-out origin-left pointer-events-none ${
                alreadyRead ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
                  
          </span>
          
        </span>
        {alreadyRead && (
          <VintageSeal type="read" size="sm" animated={justStamped} className="-right-20 rotate-6" />
        )}
      </button>
    </div>
  );
};

