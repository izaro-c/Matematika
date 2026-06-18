import React from 'react';
import { Link } from 'wouter';

interface ContentCardProps {
  href: string;
  title: string;
  description?: string;
  badge?: string;
  accent?: 'terracota' | 'green';
  actionLabel?: string;
  layout?: 'default' | 'row';
}

const accentStyles = {
  terracota: {
    hoverBorder: 'hover:border-terracota',
    hoverText: 'group-hover:text-terracota',
    text: 'text-terracota',
  },
  green: {
    hoverBorder: 'hover:border-[#2a6a2a]',
    hoverText: 'group-hover:text-[#2a6a2a]',
    text: 'text-[#2a6a2a]',
  },
};

export const ContentCard: React.FC<ContentCardProps> = ({
  href,
  title,
  description,
  badge,
  accent = 'terracota',
  actionLabel,
  layout = 'default',
}) => {
  const style = accentStyles[accent];

  if (layout === 'row') {
    return (
      <Link href={href}>
        <a className="flex justify-between items-center p-6 border border-carbon/20 bg-carbon/5 hover:bg-carbon hover:text-lienzo transition-all group">
          <div>
            <h3 className="font-bold text-xl group-hover:text-lienzo transition-colors">{title}</h3>
            {description && <p className="text-sm opacity-70 mt-2 font-sans">{description}</p>}
          </div>
          {actionLabel && (
            <span className="text-xs font-sans tracking-widest uppercase opacity-50 group-hover:opacity-100">
              {actionLabel}
            </span>
          )}
        </a>
      </Link>
    );
  }

  return (
    <Link href={href}>
      <a className={`flex flex-col p-6 border border-carbon/20 bg-carbon/5 ${style.hoverBorder} hover:shadow-md transition-all group`}>
        {badge && (
          <span className="text-[10px] uppercase font-sans tracking-widest text-carbon/40 mb-2">
            {badge}
          </span>
        )}
        <h3 className={`font-bold text-lg ${style.hoverText} transition-colors`}>{title}</h3>
        {description && <p className="text-sm opacity-70 mt-2 font-sans">{description}</p>}
        {actionLabel && (
          <span className={`text-xs font-sans tracking-widest uppercase ${style.text} opacity-60 group-hover:opacity-100 mt-4 transition-opacity`}>
            {actionLabel}
          </span>
        )}
      </a>
    </Link>
  );
};
