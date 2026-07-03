import React, { useMemo } from 'react';
import { Link } from 'wouter';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';
import type { Crumb } from '@/shared/ui/Breadcrumbs';
import { ContentTypeBadge } from '@/shared/ui/ContentTypeBadge';
import { ModelBadgeList } from '@/features/graph/ui/ModelBadge';
import { db } from '@/entities/content';

/**
 * Propiedades de cabecera estandarizada para contenido matemático.
 */
interface ContentHeaderProps {
  /** Tipo base (ej: 'axioma', 'lema', 'modelo') que rige el color e icono por defecto */
  type: string;
  /** Nombre formateado para el tipo (ej: "Lema Previo") */
  typeLabel?: string;
  /** Título prominente de la página */
  title: string;
  /** Párrafo corto o resumen introductorio */
  description?: string;
  /** Ruta de navegación jerárquica desde la raíz (ej: Matemáticas > Álgebra > ...) */
  breadcrumbs?: Crumb[];
  /** IDs o slugs de los matemáticos acreditados como autores */
  authors?: string[];
  /** Etiquetas MSC2020 u otras etiquetas clasificatorias */
  tags?: string[];
  /** Sobrescribe el color temático automático */
  color?: string;
  /** Identificador único para integraciones de gamificación o trazabilidad */
  nodeId?: string;
  /** Slot reservado a la derecha para herramientas (ej: botón de visualización 3D) */
  rightSlot?: React.ReactNode;
  /** Slot para insignias adicionales debajo del título */
  badgesSlot?: React.ReactNode;
  /** Objeto para renderizar un botón explícito de retroceso o concepto padre */
  backLink?: { href: string; label: string };
  /** Contenido arbitrario inyectado bajo la cabecera */
  children?: React.ReactNode;
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({
  type,
  typeLabel,
  title,
  description,
  breadcrumbs = [],
  authors = [],
  color,
  nodeId,
  rightSlot,
  badgesSlot,
  backLink,
  children,
}) => {
  const accentToken = color ?? 'var(--theme-carbon)';

  const renderedAuthors = useMemo(() => {
    if (!authors || authors.length === 0) return null;

    const authList = authors
      .map((authId) => {
        const mathematician = db.getMathematicianById(authId);
        if (!mathematician) return null;
        return (
          <Link
            key={authId}
            href={`/bio/${authId}`}
            className="hover:text-terracota border-b border-dashed border-carbon/20 hover:border-terracota/40 transition-colors"
          >
            {mathematician.name}
          </Link>
        );
      })
      .filter(Boolean);

    if (authList.length === 0) return null;

    return authList.reduce((prev, curr, idx) => {
      if (idx === 0) return [curr];
      if (idx === authList.length - 1) return [...prev, ' y ', curr];
      return [...prev, ', ', curr];
    }, [] as React.ReactNode[]);
  }, [authors]);

  return (
    <header className="mb-12 md:mb-16 relative flex flex-col items-center text-center">
      
      {/* Elementos de navegación a la izquierda */}
      <div className="w-full flex flex-col items-start gap-4 mb-8">
        {backLink && (
          <Link
            href={backLink.href}
            className="ac-pill"
            style={{ textDecoration: 'none' }}
          >
            <span className="ac-pill-ornament" aria-hidden>←</span>
            <span className="ac-pill-serif">{backLink.label}</span>
          </Link>
        )}
        
        {breadcrumbs.length > 0 && (
          <Breadcrumbs crumbs={breadcrumbs} />
        )}
      </div>

      {/* Tipo e Insignias */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
        <ContentTypeBadge type={type} label={typeLabel} />
        {badgesSlot}
        {nodeId && <ModelBadgeList nodeId={nodeId} />}
      </div>

      {/* Título Principal (Arts & Crafts Serif) */}
      <h1
        className="font-serif text-5xl md:text-6xl lg:text-7xl mb-6 text-carbon/90"
        style={{ color: accentToken, letterSpacing: '-0.02em', lineHeight: '1.1' }}
      >
        {title}
      </h1>

      {/* Byline de Autores */}
      {renderedAuthors && (
        <div className="font-serif italic text-lg text-carbon/60 mb-8 flex items-center gap-4 before:content-[''] before:h-px before:w-12 before:bg-carbon/20 after:content-[''] after:h-px after:w-12 after:bg-carbon/20">
          Por {renderedAuthors}
        </div>
      )}

      {/* Descripción / Resumen */}
      {description && (
        <p className="font-serif text-xl md:text-2xl text-carbon/75 italic leading-relaxed max-w-[45ch]">
          {description}
        </p>
      )}

      {rightSlot && (
        <div className="mt-8">{rightSlot}</div>
      )}

      {children}

      {/* Divisor Ornamental Final */}
      <div className="w-32 h-px bg-carbon/20 mt-12 mb-4 mx-auto" />
      <div className="w-16 h-px bg-carbon/20 mx-auto" />
    </header>
  );
};
