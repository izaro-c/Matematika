import React, { useState, useRef, useLayoutEffect } from 'react';
import { useI18n } from '@/i18n';
import { db } from '@/data/content';
import { KatexText } from '@/components/ui/KatexText';
import { ConceptLink } from '@/components/ui/ConceptLink';


// ============================================================================
// Tipos e Interfaces
// ============================================================================

export interface SeccionPropiedadesProps {
  /** Título de la sección principal */
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export interface PropiedadesGrupoProps {
  /** Título temático del grupo */
  title: string;
  /** Estado de apertura del grupo (por defecto true) */
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export interface PropiedadItemProps {
  /** Identificador formal en la base de datos de axiomas / teoremas */
  id?: string;
  /** Alias retrocompatible de id */
  theoremId?: string;
  /** Título de la propiedad */
  title?: string;
  /** Fórmula matemática resumida */
  formula?: string;
  /** Alias de formula */
  summaryMath?: string;
  /** Modo de visualización de la fórmula: 'auto' (salta y centra si no cabe), 'inline' o 'block' */
  displayMode?: 'auto' | 'inline' | 'block';
  /** Estado inicial de apertura del detalle (por defecto false) */
  defaultOpen?: boolean;
  /** Enunciado o fórmula alternativa si no se usa children */
  statement?: string;
  /** Explicación detallada en MDX con ConceptLinks, KaTeX y VisualBinds */
  children?: React.ReactNode;
}

// ============================================================================
// Funciones auxiliares
// ============================================================================

function humanizeId(id: string): string {
  const clean = id
    .replace(/^teorema-/, '')
    .replace(/^lema-/, '')
    .replace(/^corolario-/, '')
    .replace(/^propiedad-/, '')
    .replace(/^axioma-/, '')
    .replace(/-/g, ' ');
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

// ============================================================================
// Componentes
// ============================================================================

/**
 * Contenedor principal de la sección de propiedades.
 */
export const SeccionPropiedades: React.FC<SeccionPropiedadesProps> = ({
  title,
  className = '',
  children,
}) => {
  const { t } = useI18n();
  const displayTitle = title || t('properties', 'title');

  return (
    <section className={`my-12 w-full ${className}`} aria-label={displayTitle}>
      <h3 className="page-accent-text text-2xl sm:text-3xl font-serif mt-10 mb-6 pb-2 border-b border-carbon/15 italic flex items-center justify-between">
        <span>{displayTitle}</span>
        <span className="opacity-30 not-italic text-lg font-serif select-none" aria-hidden="true">
          ❧
        </span>
      </h3>
      <div className="space-y-8">
        {children}
      </div>
    </section>
  );
};

/**
 * Grupo temático colapsable con cabecera de acento Arts & Crafts.
 */
export const PropiedadesGrupo: React.FC<PropiedadesGrupoProps> = ({
  title,
  defaultOpen = true,
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  return (
    <div className="my-6 first:mt-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="w-full flex items-center gap-2 mb-2 text-left group focus-visible:outline-none py-1.5 cursor-pointer"
      >
        <span
          className="page-accent-text text-xs opacity-75 group-hover:opacity-100 transition-opacity select-none"
          aria-hidden="true"
        >
          ✦
        </span>
        <h4 className="ac-eyebrow ac-eyebrow--sm ac-eyebrow--accent text-carbon/85 uppercase tracking-wider font-semibold select-none">
          {title}
        </h4>
        <div className="h-px bg-carbon/15 group-hover:bg-carbon/30 flex-grow ml-2 transition-colors" />
        <span
          className={`text-carbon/40 group-hover:text-carbon/80 text-[11px] font-sans font-semibold transition-transform duration-200 select-none ${
            isOpen ? 'rotate-0' : '-rotate-90'
          }`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {isOpen && (
        <ul className="pl-0 list-none space-y-1.5 [&>li]:before:hidden animate-page-enter">
          {children}
        </ul>
      )}
    </div>
  );
};

/**
 * Ítem de propiedad con resumen formal continuo, salto/centrado reactivo y desglose colapsable.
 */
export const PropiedadItem: React.FC<PropiedadItemProps> = ({
  id,
  theoremId,
  title,
  formula,
  summaryMath,
  displayMode = 'auto',
  defaultOpen = false,
  statement,
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [isWrapped, setIsWrapped] = useState<boolean>(displayMode === 'block');

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const formulaRef = useRef<HTMLSpanElement>(null);

  const { lang } = useI18n();

  const targetId = id || theoremId;
  const theorem = targetId ? db.getTheorem(targetId, lang) : undefined;
  const itemTitle = title || theorem?.title || (targetId ? humanizeId(targetId) : 'Propiedad');

  const displayFormula = formula || summaryMath;
  const contentText = statement || (typeof children === 'string' ? children : undefined);
  const fallbackText = theorem?.statement || theorem?.description || '';

  const hasExpandableContent = Boolean(children || contentText || fallbackText);

  // Detección reactiva de desbordamiento para salto y centrado dinámico
  useLayoutEffect(() => {
    if (displayMode === 'block') {
      setIsWrapped(true);
      return;
    }
    if (displayMode === 'inline') {
      setIsWrapped(false);
      return;
    }

    const container = containerRef.current;
    if (!container || !displayFormula) return;

    const calculateOverflow = () => {
      const containerWidth = container.offsetWidth;
      const titleWidth = titleRef.current?.offsetWidth || 0;
      const formulaWidth = formulaRef.current?.scrollWidth || 0;

      // Margen de seguridad para chevron, dos puntos y separaciones
      const totalInlineNeeded = titleWidth + formulaWidth + 36;
      setIsWrapped(totalInlineNeeded > containerWidth);
    };

    calculateOverflow();

    const resizeObserver = new ResizeObserver(() => {
      calculateOverflow();
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [displayFormula, itemTitle, displayMode]);

  return (
    <li className="group/item py-2.5 transition-colors">
      <div ref={containerRef} className="w-full text-base text-carbon leading-relaxed">
        {/* ── Modo 1: En una sola línea (Inline) ── */}
        {!isWrapped ? (
          <div className="flex items-baseline gap-2 min-w-0">
            {/* Indicador interactivo */}
            {hasExpandableContent ? (
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-label={isOpen ? 'Contraer justificación' : 'Expandir justificación'}
                className="text-carbon/40 group-hover/item:text-[var(--page-accent)] text-xs font-serif transition-colors cursor-pointer select-none w-3.5 text-left flex-shrink-0"
              >
                {isOpen ? '▾' : '▸'}
              </button>
            ) : (
              <span className="text-carbon/25 text-xs font-serif select-none w-3.5 text-left flex-shrink-0">
                ―
              </span>
            )}

            {/* Título */}
            <div ref={titleRef} className="font-serif font-semibold text-carbon flex-shrink-0">
              {targetId ? (
                <ConceptLink targetId={targetId}>
                  {itemTitle}
                </ConceptLink>
              ) : (
                <span
                  onClick={() => hasExpandableContent && setIsOpen((prev) => !prev)}
                  className={hasExpandableContent ? 'cursor-pointer hover:text-[var(--page-accent)] transition-colors' : ''}
                >
                  {itemTitle}
                </span>
              )}
            </div>

            {/* Separador y Fórmula */}
            {displayFormula && (
              <>
                <span className="text-carbon/40 font-serif select-none">:</span>
                <span
                  ref={formulaRef}
                  onClick={() => hasExpandableContent && setIsOpen((prev) => !prev)}
                  className={`font-serif text-ink-body whitespace-nowrap ${hasExpandableContent ? 'cursor-pointer' : ''}`}
                >
                  <KatexText text={`$${displayFormula.replace(/^\$|\$$/g, '')}$`} />
                </span>
              </>
            )}
          </div>
        ) : (
          /* ── Modo 2: Desbordado / Salto con Fórmula Centrada ── */
          <div className="flex flex-col gap-1.5">
            {/* Fila 1: Título */}
            <div className="flex items-baseline gap-2">
              {hasExpandableContent ? (
                <button
                  type="button"
                  onClick={() => setIsOpen((prev) => !prev)}
                  aria-expanded={isOpen}
                  aria-label={isOpen ? 'Contraer justificación' : 'Expandir justificación'}
                  className="text-carbon/40 group-hover/item:text-[var(--page-accent)] text-xs font-serif transition-colors cursor-pointer select-none w-3.5 text-left flex-shrink-0"
                >
                  {isOpen ? '▾' : '▸'}
                </button>
              ) : (
                <span className="text-carbon/25 text-xs font-serif select-none w-3.5 text-left flex-shrink-0">
                  ―
                </span>
              )}

              <div ref={titleRef} className="font-serif font-semibold text-carbon">
                {targetId ? (
                  <ConceptLink targetId={targetId}>
                    {itemTitle}
                  </ConceptLink>
                ) : (
                  <span
                    onClick={() => hasExpandableContent && setIsOpen((prev) => !prev)}
                    className={hasExpandableContent ? 'cursor-pointer hover:text-[var(--page-accent)] transition-colors' : ''}
                  >
                    {itemTitle}
                  </span>
                )}
              </div>
            </div>

            {/* Fila 2: Fórmula en bloque centrada */}
            {displayFormula && (
              <div
                onClick={() => hasExpandableContent && setIsOpen((prev) => !prev)}
                className={`w-full py-1 text-center font-serif text-ink-body overflow-x-auto ${
                  hasExpandableContent ? 'cursor-pointer hover:opacity-90' : ''
                }`}
              >
                <span ref={formulaRef} className="inline-block text-[1.03em]">
                  <KatexText text={`$${displayFormula.replace(/^\$|\$$/g, '')}$`} />
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Desglose explicativo colapsable ── */}
      {isOpen && hasExpandableContent && (
        <div className="mt-2.5 ml-5 pl-3.5 border-l border-carbon/15 text-[15px] sm:text-base text-ink-body font-serif leading-relaxed text-justify animate-page-enter">
          {children ? (
            children
          ) : contentText ? (
            <KatexText text={contentText} />
          ) : fallbackText ? (
            <KatexText text={fallbackText} />
          ) : null}
        </div>
      )}
    </li>
  );
};