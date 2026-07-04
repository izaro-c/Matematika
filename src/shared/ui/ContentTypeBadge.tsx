import React from 'react';
import { getContentPageAccent } from '@/shared/design';

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
  const token = getContentPageAccent(type);
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
