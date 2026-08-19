import React from 'react';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';

export type EditorLanguageBadgeMode = 'global' | 'document' | 'diagram';

export interface EditorLanguageBadgesProps {
  /**
   * Modo de visualización e interacción:
   * - 'global': selección general de idioma de la app/editor.
   * - 'document': versiones del documento MDX (existentes y +Crear traducción).
   * - 'diagram': previsualización/edición de variantes del diagrama.
   */
  mode?: EditorLanguageBadgeMode;
  /** Código del idioma activo (ej: 'es', 'eu', 'en') */
  activeLang: string;
  /** Callback al seleccionar un idioma existente */
  onSelectLang?: (langCode: string) => void;
  /** Lista de códigos de idioma disponibles/traducidos para el documento */
  availableLangs?: string[];
  /** Callback al solicitar la creación de una nueva traducción */
  onCreateTranslation?: (langCode: string) => void;
  /** Tamaño del contenedor e items */
  size?: 'default' | 'compact';
  /** Clases adicionales para el contenedor */
  className?: string;
  /** Etiqueta de accesibilidad para el grupo */
  'aria-label'?: string;
}

export const EditorLanguageBadges: React.FC<EditorLanguageBadgesProps> = ({
  mode = 'global',
  activeLang,
  onSelectLang,
  availableLangs,
  onCreateTranslation,
  size = 'default',
  className = '',
  'aria-label': ariaLabel = 'Idioma de edición',
}) => {
  const isCompact = size === 'compact';

  const containerBase = isCompact
    ? 'inline-flex h-6 items-center gap-0.5 rounded-md border border-carbon/15 bg-carbon/5 p-0.5'
    : 'inline-flex h-8 items-center gap-1 rounded-lg border border-carbon/15 bg-carbon/5 p-1 max-w-[260px] overflow-x-auto';

  const activeItemStyle = isCompact
    ? 'inline-flex h-5 items-center justify-center rounded px-1.5 text-[8px] font-bold bg-salvia text-lienzo uppercase tracking-wider shrink-0 select-none shadow-2xs'
    : 'inline-flex h-6 items-center justify-center rounded-md bg-salvia px-2 text-[10px] font-bold text-lienzo uppercase tracking-wider shrink-0 select-none shadow-2xs';

  const switchItemStyle = isCompact
    ? 'inline-flex h-5 items-center justify-center rounded px-1.5 text-[8px] font-bold uppercase tracking-wider text-carbon/70 hover:bg-salvia/15 hover:text-salvia transition-colors cursor-pointer shrink-0 select-none'
    : 'inline-flex h-6 items-center justify-center rounded-md px-2 text-[10px] font-bold uppercase tracking-wider text-carbon/65 hover:bg-salvia/15 hover:text-salvia transition-colors cursor-pointer shrink-0 select-none';

  const createItemStyle = isCompact
    ? 'inline-flex h-5 items-center justify-center rounded border border-dashed border-carbon/25 px-1 text-[8px] font-mono text-carbon/40 hover:border-salvia hover:bg-salvia/10 hover:text-salvia cursor-pointer shrink-0 select-none transition-colors'
    : 'inline-flex h-6 items-center justify-center rounded-md border border-dashed border-carbon/30 px-1.5 text-[10px] font-mono font-medium text-carbon/50 hover:border-salvia hover:bg-salvia/10 hover:text-salvia cursor-pointer shrink-0 select-none transition-colors';

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`${containerBase} ${className}`}
    >
      {SUPPORTED_LANGUAGES.map(lang => {
        const isActive = (activeLang || 'es').toLowerCase() === lang.code.toLowerCase();

        if (mode === 'global') {
          if (isActive) {
            return (
              <span
                key={lang.code}
                className={activeItemStyle}
                title={`Idioma activo: ${lang.name}`}
              >
                {lang.code.toUpperCase()}
              </span>
            );
          }
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onSelectLang?.(lang.code)}
              className={switchItemStyle}
              title={`Cambiar idioma a ${lang.name}`}
            >
              {lang.code.toUpperCase()}
            </button>
          );
        }

        if (mode === 'document') {
          const exists = availableLangs ? availableLangs.includes(lang.code) : true;

          if (isActive) {
            return (
              <span
                key={lang.code}
                className={activeItemStyle}
                title={`Idioma activo: ${lang.name}`}
              >
                {lang.code.toUpperCase()}
              </span>
            );
          }

          if (exists) {
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => onSelectLang?.(lang.code)}
                className={switchItemStyle}
                title={`Cambiar a ${lang.name}`}
              >
                {lang.code.toUpperCase()}
              </button>
            );
          }

          if (onCreateTranslation) {
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => onCreateTranslation(lang.code)}
                className={createItemStyle}
                title={`Crear traducción en ${lang.name} (${lang.code.toUpperCase()})`}
              >
                +{lang.code.toUpperCase()}
              </button>
            );
          }

          return null;
        }

        if (mode === 'diagram') {
          if (isActive) {
            return (
              <span
                key={lang.code}
                className={activeItemStyle}
                title={`Visualizando en ${lang.name}`}
              >
                {lang.code.toUpperCase()}
              </span>
            );
          }

          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onSelectLang?.(lang.code)}
              className={switchItemStyle}
              title={`Editar/Visualizar en ${lang.name}`}
            >
              {lang.code.toUpperCase()}
            </button>
          );
        }

        return null;
      })}
    </div>
  );
};

export default EditorLanguageBadges;
