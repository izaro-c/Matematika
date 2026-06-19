import React from 'react';
import { Link } from 'wouter';
import { CONTENT_TYPE_CONFIG } from '../../config/constants';

export type CardAccent = 'terracota' | 'salvia' | 'pizarra' | 'ocre' | 'pavo' | 'granada' | 'musgo' | 'carbon';

interface ContentCardProps {
  href: string;
  title: string;
  description?: string;
  badge?: string;
  accent?: CardAccent;
  actionLabel?: string;
  layout?: 'default' | 'row';
  type?: string;
}

const accentStyles: Record<CardAccent, { hoverBorder: string; hoverText: string; text: string }> = {
  terracota: { hoverBorder: 'hover:border-terracota', hoverText: 'group-hover:text-terracota', text: 'text-terracota' },
  salvia:    { hoverBorder: 'hover:border-salvia',    hoverText: 'group-hover:text-salvia',    text: 'text-salvia' },
  pizarra:   { hoverBorder: 'hover:border-pizarra',   hoverText: 'group-hover:text-pizarra',   text: 'text-pizarra' },
  ocre:      { hoverBorder: 'hover:border-ocre',      hoverText: 'group-hover:text-ocre',      text: 'text-ocre' },
  pavo:      { hoverBorder: 'hover:border-pavo',      hoverText: 'group-hover:text-pavo',      text: 'text-pavo' },
  granada:   { hoverBorder: 'hover:border-granada',   hoverText: 'group-hover:text-granada',   text: 'text-granada' },
  musgo:     { hoverBorder: 'hover:border-musgo',     hoverText: 'group-hover:text-musgo',     text: 'text-musgo' },
  carbon:    { hoverBorder: 'hover:border-carbon',    hoverText: 'group-hover:text-carbon',    text: 'text-carbon' },
};

function typeToAccent(type: string): CardAccent {
  const map: Record<string, CardAccent> = {
    axioma: 'carbon', definicion: 'pizarra', lema: 'pizarra',
    teorema: 'salvia', corolario: 'terracota', demostracion: 'terracota',
    ejemplo: 'pizarra', ejercicio: 'musgo', caso_de_uso: 'terracota',
    matematico: 'ocre', leccion: 'pizarra',
  };
  return map[type] || 'terracota';
}

export const ContentCard: React.FC<ContentCardProps> = ({
  href,
  title,
  description,
  badge,
  accent,
  actionLabel,
  layout = 'default',
  type,
}) => {
  const cfg = type ? CONTENT_TYPE_CONFIG[type] : undefined;
  const resolvedAccent = accent || (type ? typeToAccent(type) : 'terracota');
  const resolvedBadge = badge ?? cfg?.labelSingular;
  const resolvedActionLabel = actionLabel ?? (cfg ? `Ver ${cfg.labelSingular.toLowerCase()}` : undefined);

  const style = accentStyles[resolvedAccent];

  if (layout === 'row') {
    return (
      <Link href={href}>
        <a className="flex justify-between items-center p-6 border border-carbon/20 bg-carbon/5 hover:bg-carbon hover:text-lienzo transition-all group">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-1">
              {resolvedBadge && (
                <span className="text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded font-sans font-bold shrink-0"
                  style={{ background: cfg?.nodeStyle.bg || '#333', color: cfg?.nodeStyle.text || '#fff' }}>
                  {resolvedBadge}
                </span>
              )}
              <h3 className="font-bold text-xl group-hover:text-lienzo transition-colors truncate">{title}</h3>
            </div>
            {description && <p className="text-sm opacity-70 mt-1 font-sans line-clamp-2">{description}</p>}
          </div>
          {resolvedActionLabel && (
            <span className="text-xs font-sans tracking-widest uppercase opacity-50 group-hover:opacity-100 shrink-0 ml-4">
              {resolvedActionLabel} &rarr;
            </span>
          )}
        </a>
      </Link>
    );
  }

  return (
    <Link href={href}>
      <a className={`flex flex-col p-6 border border-carbon/20 bg-carbon/5 ${style.hoverBorder} hover:shadow-md transition-all group`}>
        {resolvedBadge && (
          <span className="text-[10px] uppercase font-sans tracking-widest text-carbon/40 mb-2">
            {resolvedBadge}
          </span>
        )}
        <h3 className={`font-bold text-lg ${style.hoverText} transition-colors`}>{title}</h3>
        {description && <p className="text-sm opacity-70 mt-2 font-sans">{description}</p>}
        {resolvedActionLabel && (
          <span className={`text-xs font-sans tracking-widest uppercase ${style.text} opacity-60 group-hover:opacity-100 mt-4 transition-opacity`}>
            {resolvedActionLabel}
          </span>
        )}
      </a>
    </Link>
  );
};
