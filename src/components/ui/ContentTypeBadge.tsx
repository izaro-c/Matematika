import React from 'react';

const TYPE_TOKENS: Record<string, string> = {
  axioma: 'var(--theme-carbon)',
  definicion: 'var(--theme-pizarra)',
  lema: 'var(--theme-pizarra)',
  teorema: 'var(--theme-salvia)',
  corolario: 'var(--theme-terracota)',
  demostracion: 'var(--theme-terracota)',
  ejemplo: 'var(--theme-pizarra)',
  ejercicio: 'var(--theme-musgo)',
  'caso-de-uso': 'var(--theme-terracota)',
  matematico: 'var(--theme-ocre)',
  leccion: 'var(--theme-pizarra)',
  modelo: 'var(--theme-pavo)',
  'sistema-axiomatico': 'var(--theme-pavo)',
  'plan-de-estudio': 'var(--theme-pavo)',
};

const TYPE_ORNAMENTS: Record<string, string> = {
  axioma: '◈',
  definicion: '◆',
  lema: '◇',
  teorema: '✦',
  corolario: '◇',
  demostracion: '❧',
  ejemplo: '▸',
  ejercicio: '✎',
  'caso-de-uso': '◎',
  matematico: '❦',
  leccion: '📖',
  modelo: '☙',
  'sistema-axiomatico': '⬡',
  'plan-de-estudio': '✚',
};

interface ContentTypeBadgeProps {
  type: string;
  label?: string;
  className?: string;
}

export const ContentTypeBadge: React.FC<ContentTypeBadgeProps> = ({ type, label, className = '' }) => {
  const token = TYPE_TOKENS[type] ?? 'var(--theme-carbon)';
  const ornament = TYPE_ORNAMENTS[type] ?? '◆';
  const text = label ?? type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ');

  return (
    <span
      className={`ac-pill ac-pill-accent ${className}`}
      style={{ ['--pill-accent' as string]: token }}
    >
      <span className="ac-pill-ornament" aria-hidden>{ornament}</span>
      {text}
    </span>
  );
};
