import { useCallback, useEffect, useId, useMemo, useRef, useState, type ComponentType } from 'react';
import { getContentPageAccent } from '@/design';
import { DiagramSlot } from '@/components/ui/skeletons';
import { useMathStore } from '@/lib/page-context/MathStoreContext';
import { DiagramStepSyncContext } from '@/lib/page-context/DiagramStepSyncContext';
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
  /** Sin padding de página: el layout vive dentro de otra vista. */
  embedded?: boolean;
  /** Tipo de página (axioma, definición, …) → color `--page-accent`. */
  pageType?: string;
  /**
   * Variante editorial (`data-layout-variant`). En escritorio el diagrama
   * ocupa `--content-diagram-share` (ver `content-layout-columns.css`).
   */
  variant?: 'reading' | 'balanced';
  className?: string;
}

/** Diagrama perezoso dentro del layout de página de contenido. */
export function ContentDiagram({ component: Diagram }: {
  component?: ComponentType<Record<string, unknown>> | null;
}) {
  if (!Diagram) return null;
  return (
    <div className="simulation-panel">
      <DiagramSlot>
        <Diagram />
      </DiagramSlot>
    </div>
  );
}

/**
 * Layout de páginas de contenido (texto | diagrama | secundario | índice).
 *
 * Sincroniza el paso activo en scroll mediante un detector geométrico centralizado.
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
  const rootRef = useRef<HTMLDivElement>(null);
  
  const setVariable = useMathStore((state) => state.setVariable);
  const [activeDiagramStepIndex, setActiveDiagramStepIndex] = useState<number | null>(null);
  const [activeDiagramStepId, setActiveDiagramStepId] = useState<string | null>(null);
  const activeStepIndexRef = useRef<number | null>(-1);

  const hasMetadata = metadata !== undefined && metadata !== null;
  const hasDiagram = diagram !== undefined && diagram !== null;

  const proofSteps = useCallback(
    () => Array.from(rootRef.current?.querySelectorAll<HTMLElement>('.proof-step') ?? []),
    [],
  );

  const syncProofStepState = useCallback((step: HTMLElement | null) => {
    if (!step) {
      setActiveDiagramStepIndex(null);
      setActiveDiagramStepId('initial');
      setVariable('step', 'initial');
      setVariable('diagramKey', null);
      setVariable('highlight', null);
      return;
    }

    const targetValue = step.dataset.target;
    const diagramStepValue = step.dataset.diagramStep;
    const diagramKeyValue = step.dataset.diagramKey;

    if (diagramStepValue) {
      setActiveDiagramStepId(diagramStepValue);
    } else {
      setActiveDiagramStepId(null);
    }

    setVariable('diagramKey', diagramKeyValue || null);
    setVariable('highlight', null);

    if (targetValue) {
      try {
        setVariable('step', targetValue.startsWith('[') ? JSON.parse(targetValue) : targetValue);
      } catch {
        setVariable('step', targetValue);
      }
    }
  }, [setVariable]);

  const selectDiagramStep = useCallback((stepInput: number | string) => {
    const steps = proofSteps();
    if (typeof stepInput === 'number') {
      setActiveDiagramStepIndex(stepInput);
      activeStepIndexRef.current = stepInput;
      const step = steps[stepInput];
      if (step) {
        syncProofStepState(step);
      } else if (stepInput === 0 || stepInput === -1) {
        syncProofStepState(null);
      }
    } else {
      setActiveDiagramStepId(stepInput);
      const matchingIndex = steps.findIndex(s => s.dataset.diagramStep === stepInput);
      if (matchingIndex >= 0) {
        setActiveDiagramStepIndex(matchingIndex);
        activeStepIndexRef.current = matchingIndex;
        syncProofStepState(steps[matchingIndex]);
      } else {
        setVariable('step', stepInput);
      }
    }
  }, [proofSteps, syncProofStepState, setVariable]);

  const diagramStepSyncValue = useMemo(() => ({
    activeStepIndex: activeDiagramStepIndex,
    activeStepId: activeDiagramStepId,
    selectDiagramStep,
  }), [activeDiagramStepIndex, activeDiagramStepId, selectDiagramStep]);

  useEffect(() => {
    if (!hasDiagram) return;

    const activate = (index: number, steps: HTMLElement[]) => {
      if (index === -1) {
        if (activeStepIndexRef.current !== -1) {
          activeStepIndexRef.current = -1;
          setActiveDiagramStepIndex(null);
          syncProofStepState(null);
        }
        return;
      }

      if (index !== activeStepIndexRef.current) {
        activeStepIndexRef.current = index;
        setActiveDiagramStepIndex(index);
        syncProofStepState(steps[index]);
      }
    };

    const handleScroll = () => {
      const root = rootRef.current;
      if (!root) return;

      const steps = proofSteps();
      if (steps.length === 0) return;

      const activationLine = window.innerHeight * 0.35;

      const firstStepTop = steps[0].getBoundingClientRect().top;
      const lastStepBottom = steps[steps.length - 1].getBoundingClientRect().bottom;

      // Si el scroll está por encima del primer paso O por debajo del último paso, vuelve al diagrama inicial
      if (firstStepTop > activationLine || lastStepBottom < activationLine) {
        activate(-1, steps);
        return;
      }

      let activeIndex = -1;
      steps.forEach((step, index) => {
        const top = step.getBoundingClientRect().top;
        if (top <= activationLine) {
          activeIndex = index;
        }
      });

      activate(activeIndex, steps);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [hasDiagram, proofSteps, syncProofStepState]);

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
    <DiagramStepSyncContext.Provider value={diagramStepSyncValue}>
      <div
        ref={rootRef}
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
    </DiagramStepSyncContext.Provider>
  );
}