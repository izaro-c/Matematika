import React from 'react';
import { Link } from 'wouter';
import { useI18n } from '@/i18n';
import { db } from '@/data/content';
import { KatexText } from '@/components/ui/KatexText';

interface SeccionPropiedadesProps {
  title?: string;
  children: React.ReactNode;
}

/**
 * Convierte un ID como "teorema-desigualdad-triangular" en un título legible como "Desigualdad triangular"
 */
function humanizeId(id: string): string {
  const clean = id
    .replace(/^teorema-/, '')
    .replace(/^lema-/, '')
    .replace(/^corolario-/, '')
    .replace(/^propiedad-/, '')
    .replace(/-/g, ' ');
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

/**
 * Contenedor principal para la sección de propiedades de un concepto.
 * Se integra naturalmente en la prosa editorial del artículo con tipografía Arts & Crafts.
 */
export const SeccionPropiedades: React.FC<SeccionPropiedadesProps> = ({ title, children }) => {
  const { t } = useI18n();
  const displayTitle = title || t('properties', 'title');

  return (
    <section className="my-10 w-full" aria-label={displayTitle}>
      <h3 className="page-accent-text text-3xl font-serif mt-10 mb-6 pb-2 border-b border-carbon/10 italic flex items-center justify-between">
        <span>{displayTitle}</span>
        <span className="opacity-30 not-italic text-lg font-serif select-none">❧</span>
      </h3>
      <div className="space-y-6">
        {children}
      </div>
    </section>
  );
};

interface PropiedadesGrupoProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Subgrupo temático para organizar propiedades según su rama o naturaleza
 * (ej. métricas, algebraicas, topológicas, congruencia).
 */
export const PropiedadesGrupo: React.FC<PropiedadesGrupoProps> = ({ title, children }) => {
  return (
    <div className="my-6 first:mt-2">
      <div className="flex items-center gap-2 mb-3">
        <span className="page-accent-text text-xs opacity-70">✦</span>
        <h4 className="ac-eyebrow ac-eyebrow--sm ac-eyebrow--accent text-carbon/85 uppercase tracking-wider font-semibold">
          {title}
        </h4>
        <div className="h-px bg-carbon/10 flex-grow ml-2" />
      </div>
      <ul className="space-y-3 pl-0 list-none">
        {children}
      </ul>
    </div>
  );
};

interface PropiedadItemProps {
  /** ID del teorema formal asociado en la base de datos (prop principal) */
  id?: string;
  /** Alias retrocompatible de id */
  theoremId?: string;
  /** Título explícito de la propiedad (si no se indica, se consulta del teorema o se humaniza el ID) */
  title?: string;
  /** Enunciado o fórmula matemática directa */
  statement?: string;
  /** Contenido libre en MDX */
  children?: React.ReactNode;
}

/**
 * Elemento individual de propiedad matemática integrado en la prosa.
 * Muestra el enunciado formal/simbólico en KaTeX y accesos contextuales sutiles al teorema y su demostración.
 */
export const PropiedadItem: React.FC<PropiedadItemProps> = ({
  id,
  theoremId,
  title,
  statement,
  children,
}) => {
  const { t, lang, getLocalizedPath } = useI18n();
  const targetId = id || theoremId;

  const theorem = targetId ? db.getTheorem(targetId, lang) : undefined;
  const itemTitle = title || theorem?.title || (targetId ? humanizeId(targetId) : 'Propiedad');
  const hasDemo = Boolean(theorem?.demos && theorem.demos.length > 0);
  const demoId = hasDemo && theorem?.demos ? theorem.demos[0] : undefined;

  const contentText = statement || (typeof children === 'string' ? children : undefined);
  const fallbackText = theorem?.statement || theorem?.description || '';

  const targetHref = theorem
    ? getLocalizedPath(`/teorema/${theorem.id}`)
    : targetId
      ? getLocalizedPath(`/construccion/${targetId}`)
      : undefined;

  return (
    <li className="relative pl-4 py-1 text-base text-carbon font-serif leading-relaxed">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        {/* Marcador tipográfico matemático */}
        <span className="page-accent-text opacity-70 select-none text-xs font-serif font-bold">―</span>

        {/* Título formal enlazado (o enlace a construcción si aún no existe) */}
        {targetHref ? (
          <Link
            href={targetHref}
            className={
              theorem
                ? "font-bold text-carbon hover:text-[var(--page-accent)] transition-colors border-b border-transparent hover:border-[var(--page-accent)]"
                : "font-bold text-carbon/70 hover:text-carbon border-b border-dashed border-carbon/30 transition-colors"
            }
            title={theorem ? theorem.title : t('construction', 'pendingTitle', { id: targetId || '' })}
          >
            {itemTitle}
          </Link>
        ) : (
          <span className="font-bold text-carbon">
            {itemTitle}
          </span>
        )}

        <span className="font-bold text-carbon/70 select-none">:</span>

        {/* Contenido / Fórmula simbólica matemática */}
        <span className="text-carbon/90 text-justify">
          {children ? (
            children
          ) : contentText ? (
            <KatexText text={contentText} />
          ) : fallbackText ? (
            <KatexText text={fallbackText} />
          ) : null}
        </span>

        {/* Enlace contextual sutil y directo a la demostración o teorema */}
        {hasDemo && demoId && (
          <Link
            href={getLocalizedPath(`/demo/${demoId}`)}
            className="text-carbon/40 hover:text-[var(--page-accent)] text-xs font-sans italic whitespace-nowrap pl-1.5 transition-colors select-none"
            title={t('properties', 'seeProof')}
          >
            [demo ❧]
          </Link>
        )}
      </div>
    </li>
  );
};
