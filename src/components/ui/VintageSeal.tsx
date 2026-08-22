import React from 'react';
import { useI18n } from '@/i18n';

export type SealType = 'exercise' | 'read';
export type SealSize = 'sm' | 'md' | 'lg';

export interface VintageSealProps {
  /** Tipo de sello: 'exercise' (resuelto), 'read' (asimilado) */
  type?: SealType;
  /** Tamaño del sello: 'sm' (6rem), 'md' (8rem, default), 'lg' (9.5rem) */
  size?: SealSize;
  /** Si debe reproducir la animación física de estampación */
  animated?: boolean;
  /** Clases CSS adicionales */
  className?: string;
  /** Título personalizado opcional para anular el de i18n */
  customTitle?: string;
  /** Subtítulo personalizado opcional para anular el de i18n */
  customSubtitle?: string;
}

const TYPE_CONFIG: Record<
  SealType,
  {
    colorClass: string;
    glyph: string;
    i18nKey: 'exercise' | 'read';
  }
> = {
  exercise: {
    colorClass: 'vintage-seal--canela',
    glyph: '✓',
    i18nKey: 'exercise',
  },
  read: {
    colorClass: 'vintage-seal--terracota',
    glyph: '❦',
    i18nKey: 'read',
  },
};

const SIZE_CLASSES: Record<SealSize, string> = {
  sm: 'vintage-seal--sm',
  md: '',
  lg: 'vintage-seal--lg',
};

/**
 * Sello vintage de tinta estilo Arts & Crafts para progreso.
 */
export const VintageSeal: React.FC<VintageSealProps> = ({
  type = 'read',
  size = 'md',
  animated = false,
  className = '',
  customTitle,
  customSubtitle,
}) => {
  const { currentLanguage } = useI18n();
  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.read;
  const sealI18n = currentLanguage.dictionary.metadata.seals?.[config.i18nKey];

  const titleText = customTitle ?? sealI18n?.title ?? 'CONCEPTO';
  const subtitleText = customSubtitle ?? sealI18n?.subtitle ?? 'ASIMILADO';
  const ariaLabel = sealI18n?.ariaLabel ?? `${titleText} ${subtitleText}`;

  const sizeClass = SIZE_CLASSES[size] ?? '';
  const animatedClass = animated ? 'vintage-seal--animated' : '';

  return (
    <div
      className={`vintage-seal absolute z-30 ${config.colorClass} ${sizeClass} ${animatedClass} ${className}`.trim()}
      title={ariaLabel}
      role="status"
      aria-label={ariaLabel}
    >
      <div className="vintage-seal__ring">
        <span className="vintage-seal__glyph" aria-hidden="true">
          {config.glyph}
        </span>
        <span className="vintage-seal__core">{titleText}</span>
        <span className="vintage-seal__sub">{subtitleText}</span>
      </div>
    </div>
  );
};
