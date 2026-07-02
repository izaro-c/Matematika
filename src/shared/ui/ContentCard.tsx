import React from 'react';
import { Link } from 'wouter';
import { ContentTypeBadge } from '@/shared/ui/ContentTypeBadge';

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

const TYPE_TO_ACCENT: Record<string, CardAccent> = {
  axioma: 'carbon',
  definicion: 'pizarra',
  lema: 'pizarra',
  teorema: 'salvia',
  corolario: 'terracota',
  demostracion: 'terracota',
  ejemplo: 'pizarra',
  ejercicio: 'musgo',
  'caso-de-uso': 'terracota',
  matematico: 'ocre',
  leccion: 'pizarra',
  modelo: 'pavo',
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
}) => {
  const resolvedAccent = accent || (type ? TYPE_TO_ACCENT[type] : 'terracota');
  const token = ACCENT_TOKEN[resolvedAccent];
  const action = actionLabel ?? (type ? `Ver ${type}` : undefined);

  if (layout === 'row') {
    return (
      <Link href={href}>
        <a
          className="group flex justify-between items-center gap-4 p-5 elegant-panel"
          style={{ ['--hover-accent' as string]: token }}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-1.5">
              {type && <ContentTypeBadge type={type} label={badgeLabel ?? typeLabel} />}
              {domain && (
                <span className="inline-flex items-center gap-1 text-[10px] font-sans uppercase tracking-widest text-carbon/50">
                  {domainIcon && <span aria-hidden>{domainIcon}</span>}
                  {domain}
                </span>
              )}
            </div>
            <h3 className="font-serif font-bold text-lg text-carbon truncate">{title}</h3>
            {description && (
              <p className="text-sm text-carbon/60 mt-1 font-sans line-clamp-2">{description}</p>
            )}
          </div>
          {action && (
            <span
              className="text-xs font-sans tracking-widest uppercase font-bold opacity-50 group-hover:opacity-100 shrink-0 transition-opacity"
              style={{ color: token }}
            >
              {action} →
            </span>
          )}
        </a>
      </Link>
    );
  }

  return (
    <Link href={href}>
      <a
        className="group flex flex-col p-6 elegant-panel"
        style={{ ['--hover-accent' as string]: token }}
      >
        <div className="flex items-center gap-2 mb-3">
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
        <h3
          className="font-serif font-bold text-lg text-carbon transition-colors"
          style={{ ['--hover-color' as string]: token }}
        >
          <span className="group-hover:[color:var(--hover-color)] transition-colors">{title}</span>
        </h3>
        {description && (
          <p className="text-sm text-carbon/60 mt-2 font-sans">{description}</p>
        )}
        {action && (
          <span
            className="text-xs font-sans tracking-widest uppercase font-bold opacity-60 group-hover:opacity-100 mt-4 transition-opacity"
            style={{ color: token }}
          >
            {action} →
          </span>
        )}
      </a>
    </Link>
  );
};
