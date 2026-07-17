import { Suspense, useEffect, useId, useState, type ComponentType } from 'react';
import { getContentPageAccent } from '@/shared/design';
import { MobileContentHeaderSeparator, MobileDiagramToolbar } from './MobileDiagramChrome';

interface ContentLayoutProps {
  /** Índice, atribución y relaciones del contenido. */
  metadata?: React.ReactNode;
  /** Texto principal, limitado por el layout a una medida de lectura cómoda. */
  children: React.ReactNode;
  /** Simulación o diagrama que permanece montado al cambiar de breakpoint. */
  diagram?: React.ReactNode;
  /** Contenido posterior que puede utilizar un ancho editorial mayor. */
  secondary?: React.ReactNode;
  /** Describe la región interactiva para tecnologías de asistencia. */
  diagramLabel?: string;
  /** Elimina el espaciado de página cuando el tríptico vive dentro de otra vista. */
  embedded?: boolean;
  /** Tipo semántico que determina el acento editorial de la página. */
  pageType?: string;
  /** Proporción editorial. `balanced` concede al diagrama un área equivalente al texto. */
  variant?: 'reading' | 'balanced';
  className?: string;
}

/** Montaje uniforme de componentes gráficos perezosos dentro del layout editorial. */
export function ContentDiagram({ component: Diagram }: {
  component?: ComponentType<Record<string, unknown>> | null;
}) {
  if (!Diagram) return null;
  return (
    <div className="simulation-panel">
      <Suspense fallback={<div className="diagram-loading">Preparando visualización…</div>}>
        <Diagram />
      </Suspense>
    </div>
  );
}

/**
 * Layout editorial para contenido matemático.
 *
 * La posición de las zonas cambia exclusivamente con CSS. En particular, el
 * diagrama se renderiza una sola vez y conserva su ciclo de vida al cruzar los
 * breakpoints móvil, portátil y escritorio.
 */
export function ContentLayout({
  metadata,
  children,
  diagram,
  secondary,
  diagramLabel = 'Visualización interactiva',
  embedded = false,
  pageType,
  variant = 'reading',
  className = '',
}: ContentLayoutProps) {
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [isDiagramExpanded, setIsDiagramExpanded] = useState(true);
  const metadataId = useId();
  const diagramId = useId();
  const hasMetadata = metadata !== undefined && metadata !== null;
  const hasDiagram = diagram !== undefined && diagram !== null;

  useEffect(() => {
    if (!isMetadataOpen) return;

    const previousOverflow = document.body.style.overflow;
    const desktopQuery = window.matchMedia('(min-width: 1280px)');
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMetadataOpen(false);
    };
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMetadataOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    desktopQuery.addEventListener('change', closeAtDesktop);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
      desktopQuery.removeEventListener('change', closeAtDesktop);
    };
  }, [isMetadataOpen]);

  return (
    <div
      className={`content-layout ${pageType ? 'page-accent-scope' : ''} ${embedded ? 'content-layout--embedded' : ''} ${className}`}
      data-has-diagram={hasDiagram}
      data-has-metadata={hasMetadata}
      data-page-type={pageType}
      data-layout-variant={variant}
      style={pageType ? ({ '--page-accent': getContentPageAccent(pageType) } as React.CSSProperties) : undefined}
    >
      {!embedded && (
        <MobileContentHeaderSeparator
          hasDiagram={hasDiagram}
          isDiagramExpanded={isDiagramExpanded}
        />
      )}

      {hasMetadata && (
        <>
          <button
            type="button"
            className="content-metadata-trigger"
            aria-controls={metadataId}
            aria-expanded={isMetadataOpen}
            onClick={() => setIsMetadataOpen(true)}
          >
            <span aria-hidden>☰</span>
            <span className="content-metadata-trigger-label">Índice</span>
          </button>

          <button
            type="button"
            className={`content-metadata-backdrop ${isMetadataOpen ? 'is-open' : ''}`}
            aria-label="Cerrar índice"
            tabIndex={isMetadataOpen ? 0 : -1}
            onClick={() => setIsMetadataOpen(false)}
          />

          <aside
            id={metadataId}
            className={`content-metadata ${isMetadataOpen ? 'is-open' : ''}`}
            aria-label="Metadatos e índice"
          >
            <button
              type="button"
              className="content-metadata-close"
              aria-label="Cerrar índice"
              onClick={() => setIsMetadataOpen(false)}
            >
              <span aria-hidden>×</span>
            </button>
            {metadata}
          </aside>
        </>
      )}

      <div className="content-content">
        <section className="content-primary">
          <div className="content-reading" role={embedded ? undefined : 'main'}>
            {children}
          </div>

          {hasDiagram && (
            <aside
              className="content-diagram"
              aria-label={diagramLabel}
              data-mobile-collapsed={!isDiagramExpanded}
            >
              <div className="content-diagram-sticky">
                <div id={diagramId} className="content-diagram-surface">{diagram}</div>
                <MobileDiagramToolbar
                  diagramId={diagramId}
                  isExpanded={isDiagramExpanded}
                  onToggle={() => setIsDiagramExpanded((isExpanded) => !isExpanded)}
                />
              </div>
            </aside>
          )}
        </section>

        {secondary !== undefined && secondary !== null && (
          <section className="content-secondary" aria-label="Contenido relacionado">
            <div className="content-secondary-inner">{secondary}</div>
          </section>
        )}
      </div>
    </div>
  );
}
