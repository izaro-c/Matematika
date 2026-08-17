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
    'sistema-axiomatico': 'Sistema Axiomatikoa',
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
    'sistema-axiomatico': 'Sistema Axiomático',
    'plan-de-estudio': 'Plan de estudio',
  },
};

interface ContentTypeBadgeProps {
  type: string;
  label?: string;
  className?: string;
}

export const ContentTypeBadge: React.FC<ContentTypeBadgeProps> = ({ type, label, className = '' }) => {
  const { lang } = useI18n();
  const token = getContentPageAccent(type);
  const ornament = TYPE_ORNAMENTS[type] ?? '◆';

  const normalized = type.toLowerCase().replace(/_/g, '-');
  const labels = TYPE_LABELS_BY_LANG[lang] || TYPE_LABELS_BY_LANG.es;
  const localizedLabel = labels[normalized] || labels[type];

  const text = label ?? localizedLabel ?? type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ');

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
