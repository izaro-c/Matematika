import React from 'react';
import { Link } from 'wouter';
import { ContentTypeBadge } from '@/components/ui/ContentTypeBadge';
import { VintageSeal, SealType } from '@/components/ui/VintageSeal';
import { getContentPageAccent } from '@/design';
import { useI18n } from '@/i18n';
import { useProgressStore } from '@/lib/stores/UserProgressStore';

/**
 * Paleta de colores temáticos para acentuar tarjetas.
 */
export type CardAccent = 'terracota' | 'salvia' | 'pizarra' | 'ocre' | 'pavo' | 'granada' | 'musgo' | 'carbon';

/**
 * Propiedades del componente genérico ContentCard.
 */
interface ContentCardProps {
  /** Enlace de destino al hacer click en la tarjeta */
  href: string;
  /** Título principal de la tarjeta */
  title: string;
  /** Subtítulo o resumen descriptivo opcional */
  description?: string;
  /** Categoría base del contenido (ej: 'teorema', 'ejercicio') */
  type?: string;
  /** Etiqueta formateada para mostrar (ej: 'Teorema Principal') */
  typeLabel?: string;
  /** Etiqueta secundaria o sufijo */
  badgeLabel?: string;
  /** Color de acento de la paleta temática */
  accent?: CardAccent;
  /** Texto del botón de acción en el hover (por defecto "Explorar ->") */
  actionLabel?: string;
  /** Disposición visual (bloque normal o fila compacta) */
  layout?: 'default' | 'row';
  /** Disciplina o dominio asociado (ej: 'Física') para mostrar metadatos adicionales */
  domain?: string;
  /** Icono o emoji representativo del dominio */
  domainIcon?: string;
  /** Si está formalizado y verificado con Lean 4 */
  leanVerified?: boolean;
  /** ID explícito para seguimiento de progreso */
  id?: string;
  /** Si está marcado como leído (sobrescribe store) */
  isRead?: boolean;
  /** Si está completado como ejercicio (sobrescribe store) */
  isCompleted?: boolean;
}

const ACCENT_TOKEN: Record<CardAccent, string> = {
  terracota: 'var(--theme-terracota)',
  salvia: 'var(--theme-salvia)',
  pizarra: 'var(--theme-pizarra)',
  ocre: 'var(--theme-ocre)',
  pavo: 'var(--theme-pavo)',
  granada: 'var(--theme-granada)',
  musgo: 'var(--theme-musgo)',
  carbon: 'var(--theme-carbon)',
};

export const ContentCard: React.FC<ContentCardProps> = ({
  href,
  title,
  description,
  type,
  typeLabel,
  badgeLabel,
  accent,
  actionLabel,
  layout = 'default',
  domain,
  domainIcon,
  leanVerified,
  id,
  isRead: propIsRead,
  isCompleted: propIsCompleted,
}) => {
  const { getLocalizedPath } = useI18n();
  const { isRead: checkRead, isExerciseComplete: checkExercise } = useProgressStore();
  const token = accent ? ACCENT_TOKEN[accent] : getContentPageAccent(type);
  const action = actionLabel ?? (type ? `Ver ${type}` : undefined);
  const localizedHref = getLocalizedPath(href);

  const derivedId = id ?? href.replace(/^\/[a-z]{2}\//, '').replace(/^\//, '').split('/').pop();
  const isCardRead = propIsRead ?? (derivedId ? checkRead(derivedId) : false);
  const isCardExerciseComplete = propIsCompleted ?? (derivedId ? checkExercise(derivedId) : false);

  let activeSealType: SealType | null = null;
  if (leanVerified) {
    activeSealType = 'lean';
  } else if (isCardExerciseComplete) {
    activeSealType = 'exercise';
  } else if (isCardRead) {
    activeSealType = 'read';
  }

  if (layout === 'row') {
    return (
      <Link
        href={localizedHref}
        className="group relative flex w-full min-w-0 justify-between items-center gap-4 p-5 elegant-panel"
        style={{ ['--hover-accent' as string]: token }}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-1.5">
            {type && <ContentTypeBadge type={type} label={badgeLabel ?? typeLabel} />}
            {domain && (
              <span className="inline-flex items-center gap-1 ac-eyebrow ac-eyebrow--sm text-ink-muted">
                {domainIcon && <span aria-hidden>{domainIcon}</span>}
                {domain}
              </span>
            )}
          </div>
          <h3 className="font-serif font-bold text-lg leading-snug text-ink line-clamp-2">{title}</h3>
          {description && (
            <p className="text-sm text-ink-muted mt-1 font-sans line-clamp-2">{description}</p>
          )}
        </div>

        {activeSealType && (
          <VintageSeal
            type={activeSealType}
            className="-right-5 -top-10"
          />
        )}

        {action && (
          <span
            className="hidden sm:inline ac-eyebrow font-bold shrink-0"
            style={{ color: token }}
          >
            {action} →
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href={localizedHref}
      className="group relative flex flex-col p-6 elegant-panel"
      style={{ ['--hover-accent' as string]: token }}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {type && <ContentTypeBadge type={type} label={badgeLabel ?? typeLabel} />}
          {domain && (
            <span
              className="ac-pill ac-pill-accent"
              style={{ ['--pill-accent' as string]: 'var(--theme-terracota)' }}
            >
              {domainIcon && <span className="ac-pill-ornament" aria-hidden>{domainIcon}</span>}
              {domain}
            </span>
          )}
        </div>

        {activeSealType && (
          <VintageSeal type={activeSealType} className="-right-5 -top-10"/>
        )}
      </div>

      <h3 className="font-serif font-bold text-xl leading-snug text-ink mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-ink-muted font-sans line-clamp-3 mb-6 flex-1 leading-relaxed">
          {description}
        </p>
      )}

      {action && (
        <span
          className="ac-eyebrow font-bold inline-flex items-center gap-1 mt-auto"
          style={{ color: token }}
        >
          {action} →
        </span>
      )}
    </Link>
  );
};

