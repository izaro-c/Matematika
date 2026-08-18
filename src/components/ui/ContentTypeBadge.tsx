import React from 'react';
import { getContentPageAccent } from '@/design';
import { useI18n } from '@/i18n';

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
  metodo: '↦',
  modelo: '☙',
  'sistema-axiomatico': '⬡',
  'plan-de-estudio': '✚',
};

const TYPE_LABELS_BY_LANG: Record<string, Record<string, string>> = {
  eu: {
    axioma: 'Axioma',
    definicion: 'Definizioa',
    lema: 'Lema',
    teorema: 'Teorema',
    corolario: 'Korolarioa',
    demostracion: 'Frogapena',
    ejemplo: 'Adibidea',
    ejercicio: 'Ariketa',
    'caso-de-uso': 'Erabilera-kasua',
    matematico: 'Matematikaria',
    metodo: 'Metodoa',
    modelo: 'Eredua',
    'sistema-axiomatico': 'Sistema axiomatikoa',
    'plan-de-estudio': 'Ikasketa-plana',
  },
  es: {
    axioma: 'Axioma',
    definicion: 'Definición',
    lema: 'Lema',
    teorema: 'Teorema',
    corolario: 'Corolario',
    demostracion: 'Demostración',
    ejemplo: 'Ejemplo',
    ejercicio: 'Ejercicio',
    'caso-de-uso': 'Caso de uso',
    matematico: 'Matemático',
    metodo: 'Método',
    modelo: 'Modelo',
    'sistema-axiomatico': 'Sistema axiomático',
    'plan-de-estudio': 'Plan de estudio',
  },
};

import { CONTENT_TYPE_ALIASES } from '@/design/contentTypeColors';

const normalizeType = (type: string): string => {
  const raw = type.toLowerCase().trim().replace(/_/g, '-').replace(/\s+/g, '-');
  return CONTENT_TYPE_ALIASES[raw] ?? raw;
};

export const getContentTypeLabel = (type: string, lang: string = 'es'): string => {
  const normalized = normalizeType(type);
  const labels = TYPE_LABELS_BY_LANG[lang] || TYPE_LABELS_BY_LANG.es;
  if (labels[normalized]) return labels[normalized];

  const clean = normalized.replace(/-/g, ' ');
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};


interface ContentTypeBadgeProps {
  type: string;
  label?: string;
  className?: string;
}

export const ContentTypeBadge: React.FC<ContentTypeBadgeProps> = ({ type, label, className = '' }) => {
  const { lang } = useI18n();
  const normalizedType = normalizeType(type);
  const token = getContentPageAccent(normalizedType);
  const ornament = TYPE_ORNAMENTS[normalizedType] ?? '◆';

  const text = label ?? getContentTypeLabel(normalizedType, lang);

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
