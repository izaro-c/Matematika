import { useEffect, useId, useState } from 'react';

interface TriptychLayoutProps {
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
  className?: string;
}

/**
 * Layout editorial para contenido matemático.
 *
 * La posición de las zonas cambia exclusivamente con CSS. En particular, el
 * diagrama se renderiza una sola vez y conserva su ciclo de vida al cruzar los
 * breakpoints móvil, portátil y escritorio.
 */
export function TriptychLayout({
  metadata,
  children,
  diagram,
  secondary,
  diagramLabel = 'Visualización interactiva',
  embedded = false,
  className = '',
}: TriptychLayoutProps) {
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const metadataId = useId();
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
      className={`triptych-layout ${embedded ? 'triptych-layout--embedded' : ''} ${className}`}
      data-has-diagram={hasDiagram}
      data-has-metadata={hasMetadata}
    >
      {hasMetadata && (
        <>
          <button
            type="button"
            className="triptych-metadata-trigger"
            aria-controls={metadataId}
            aria-expanded={isMetadataOpen}
            onClick={() => setIsMetadataOpen(true)}
          >
            <span aria-hidden>☰</span>
            <span className="triptych-metadata-trigger-label">Índice</span>
          </button>

          <button
            type="button"
            className={`triptych-metadata-backdrop ${isMetadataOpen ? 'is-open' : ''}`}
            aria-label="Cerrar índice"
            tabIndex={isMetadataOpen ? 0 : -1}
            onClick={() => setIsMetadataOpen(false)}
          />

          <aside
            id={metadataId}
            className={`triptych-metadata ${isMetadataOpen ? 'is-open' : ''}`}
            aria-label="Metadatos e índice"
          >
            <button
              type="button"
              className="triptych-metadata-close"
              aria-label="Cerrar índice"
              onClick={() => setIsMetadataOpen(false)}
            >
              <span aria-hidden>×</span>
            </button>
            {metadata}
          </aside>
        </>
      )}

      <div className="triptych-content">
        <section className="triptych-primary">
          <div className="triptych-reading" role={embedded ? undefined : 'main'}>
            {children}
          </div>

          {hasDiagram && (
            <aside className="triptych-diagram" aria-label={diagramLabel}>
              <div className="triptych-diagram-sticky">
                <div className="triptych-diagram-surface">{diagram}</div>
              </div>
            </aside>
          )}
        </section>

        {secondary !== undefined && secondary !== null && (
          <section className="triptych-secondary" aria-label="Contenido relacionado">
            <div className="triptych-secondary-inner">{secondary}</div>
          </section>
        )}
      </div>
    </div>
  );
}
