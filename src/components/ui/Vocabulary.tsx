import React from 'react';
import { Link } from 'wouter';
import { getContentPageAccent } from '@/design/pageAccents';

interface VocabSectionProps {
  heading: React.ReactNode;
  /** Tipo de contenido cuyo color lleva el encabezado y los filetes (ej. 'teorema', 'ejercicio') */
  accentType?: string;
  count?: number;
  id?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Sección de vocabulario: encabezado en el color del tipo, filete y recuento,
 * con sus voces debajo (la voz de /diccionario y de las páginas de rama).
 */
export const VocabSection: React.FC<VocabSectionProps> = ({ heading, accentType, count, id, className, children }) => (
  <section
    id={id}
    className={['ac-vocab', className].filter(Boolean).join(' ')}
    style={{ ['--type-acc' as string]: getContentPageAccent(accentType) }}
  >
    <div className="ac-vocab__head">
      <h2 className="ac-vocab__heading">{heading}</h2>
      <span className="ac-vocab__rule" aria-hidden="true" />
      {count !== undefined && <span className="ac-vocab__count ac-rubric">{count}</span>}
    </div>
    <dl className="ac-vocab__list">{children}</dl>
  </section>
);

interface VocabEntryProps {
  href: string;
  title: React.ReactNode;
  description?: string;
  read?: boolean;
  /** Nota en versalitas a la derecha de la voz (código de tomo, dominio…) */
  aside?: React.ReactNode;
  asideTitle?: string;
}

/** Voz del vocabulario: título en Fondamento, filete corto que se alarga al señalarla y descripción en cursiva. */
export const VocabEntry: React.FC<VocabEntryProps> = ({ href, title, description, read, aside, asideTitle }) => (
  <div className="ac-vocab__entry" data-read={read || undefined}>
    <dt>
      <Link href={href} className="ac-vocab__word">{title}</Link>
      {aside && <span className="ac-vocab__aside ac-rubric" title={asideTitle}>{aside}</span>}
    </dt>
    <span className="ac-vocab__line" aria-hidden="true" />
    {description && <dd>{description}</dd>}
  </div>
);
