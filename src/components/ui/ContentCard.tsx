import React from 'react';
import { Link } from 'wouter';
import { ContentTypeBadge } from './ContentTypeBadge';

export type CardAccent = 'terracota' | 'salvia' | 'pizarra' | 'ocre' | 'pavo' | 'granada' | 'musgo' | 'carbon';

interface ContentCardProps {
  href: string;
  title: string;
  description?: string;
  type?: string;
  typeLabel?: string;
  badgeLabel?: string;
  accent?: CardAccent;
  actionLabel?: string;
  layout?: 'default' | 'row';
  domain?: string;
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
          className="group flex justify-between items-center gap-4 p-5 border bg-carbon/[0.02] hover:bg-carbon/[0.04] transition-all"
          style={{ borderColor: 'color-mix(in srgb, var(--theme-carbon) 12%, transparent)' }}
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
        className="group flex flex-col p-6 border bg-carbon/[0.02] hover:bg-carbon/[0.04] transition-all"
        style={{ borderColor: 'color-mix(in srgb, var(--theme-carbon) 12%, transparent)' }}
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
