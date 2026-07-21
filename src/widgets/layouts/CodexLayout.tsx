import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useMathStore } from '@/shared/lib/MathStoreContext';
import { DiagramStepSyncContext } from '@/shared/lib/DiagramStepSyncContext';
import { useDemonstrationHeaderClaim } from '@/shared/lib/DemonstrationHeaderContext';
import { db } from '@/entities/content';
import { Link, useLocation } from 'wouter';
import { TYPE_STYLES } from '@/shared/lib/constants';
import { getContentPageAccent } from '@/shared/design';
import { ContentHeader } from '@/widgets/content/ContentHeader';
import { MobileContentHeaderSeparator, MobileDiagramToolbar } from './MobileDiagramChrome';

interface CodexLayoutProps {
  /** Pasos de la demostración (columna de lectura). */
  children: React.ReactNode;
  /** El diagrama interactivo. */
  diagram?: React.ReactNode;
  /** Etiqueta descriptiva para accesibilidad. */
  diagramLabel?: string;
  className?: string;
}

/**
 * CodexLayout ("El Códice Dividido")
 * 
 * Layout especializado para Demostraciones.
 * - Sincroniza el paso activo en scroll mediante un detector geométrico centralizado adaptable.
 * - En móvil, el diagrama queda fijo arriba (38svh) y el texto scrollea debajo.
 * - En escritorio, ofrece una vista dividida con diagrama ampliado sin marcos y visor de justificaciones.
 */
export const CodexLayout: React.FC<CodexLayoutProps> = ({
  children,
  diagram,
  diagramLabel = 'Diagrama interactivo de la demostración',
  className = '',
}) => {
  const shouldRenderHeader = useDemonstrationHeaderClaim();
  const [isDiagramExpanded, setIsDiagramExpanded] = useState(true);
  const diagramId = useId();
  const setVariable = useMathStore((state) => state.setVariable);
  const activeJustifications = useMathStore((state) => state.variables?.['activeJustifications']) as string[] | undefined;
  const [location] = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeDiagramStepIndex, setActiveDiagramStepIndex] = useState<number | null>(null);

  const hasDiagram = !!diagram;

  const isDemoPage = location.startsWith('/demo/');
  const demoId = isDemoPage ? location.split('/')[2] : null;
  const demo = demoId ? db.getDemo(demoId) : null;

  const parentTheorem = demo?.parentTheorem ? db.getTheorem(demo.parentTheorem) : null;
  const breadcrumbs = parentTheorem
    ? [{ name: parentTheorem.title, href: `/teorema/${parentTheorem.id}` }]
    : [];

  const proofSteps = useCallback(
    () => Array.from(rootRef.current?.querySelectorAll<HTMLElement>('.proof-step') ?? []),
    [],
  );

  const syncProofStepState = useCallback((step: HTMLElement) => {
    const targetValue = step.dataset.target;
    const justificationsValue = step.dataset.justifications;

    if (targetValue) {
      try {
        setVariable('step', targetValue.startsWith('[') ? JSON.parse(targetValue) : targetValue);
      } catch {
        setVariable('step', targetValue);
      }
    }

    if (justificationsValue) {
      try {
        setVariable('activeJustifications', JSON.parse(justificationsValue));
      } catch {
        setVariable('activeJustifications', []);
      }
    }
  }, [setVariable]);

  const selectDiagramStep = useCallback((stepIndex: number) => {
    const step = proofSteps()[stepIndex];
    setActiveDiagramStepIndex(stepIndex);
    if (!step) return;

    syncProofStepState(step);
  }, [proofSteps, syncProofStepState]);

  const diagramStepSyncValue = useMemo(() => ({
    activeStepIndex: activeDiagramStepIndex,
    selectDiagramStep,
  }), [activeDiagramStepIndex, selectDiagramStep]);

  // Scrollytelling: el scroll desplaza el texto libremente.
  // El diagrama refleja el paso activo con una transición ligera al cambiar.
  //
  // Algoritmo de umbral de entrada:
  // - Al montar: activar el primer paso de esta sección si ninguno está activo aún.
  // - En scroll: un paso se activa cuando su borde SUPERIOR cruza el umbral (35% del viewport).
  //   El activo es el ÚLTIMO que lo ha cruzado. Solo se opera si algún paso ha cruzado el umbral;
  //   si ninguno lo ha cruzado, esta sección no interfiere con la sección activa.
  useEffect(() => {
    const activate = (index: number, steps: HTMLElement[]) => {
      const currentActiveIndex = steps.findIndex(s => s.classList.contains('is-active'));
      if (index !== currentActiveIndex) {
        setActiveDiagramStepIndex(index);
        syncProofStepState(steps[index]);
      }
    };

    // Inicialización: en el primer frame de pintura, activar el paso 0 de esta sección
    // si aún no hay ningún paso activo en el documento. Esto garantiza que la primera
    // sección visible siempre muestra su estado inicial.
    const initRafId = requestAnimationFrame(() => {
      const steps = proofSteps();
      if (steps.length === 0) return;
      const anyActive = document.querySelector('.proof-step.is-active');
      if (!anyActive) {
        activate(0, steps);
      }
    });

    const handleScroll = () => {
      const root = rootRef.current;
      if (!root) return;

      const rootRect = root.getBoundingClientRect();
      // No actuar si esta sección está completamente fuera de pantalla.
      if (rootRect.bottom < 0 || rootRect.top > window.innerHeight) return;

      const steps = proofSteps();
      if (steps.length === 0) return;

      // Línea de activación:
      // En móvil con diagrama, el área de texto empieza por debajo del diagrama fijo (~46% viewport).
      // En escritorio, el 35% desde arriba: el paso anterior se ha leído en su mayoría cuando
      // el siguiente encabezado alcanza esa posición.
      const isMobile = window.innerWidth < 1024;
      const activationLine = isMobile && hasDiagram && isDiagramExpanded
        ? window.innerHeight * 0.46
        : window.innerHeight * 0.35;

      const documentHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        document.body.offsetHeight,
      );
      const isAtPageEnd = window.scrollY + window.innerHeight >= documentHeight - 2;

      if (isAtPageEnd) {
        activate(steps.length - 1, steps);
        return;
      }

      // El paso activo es el ÚLTIMO cuyo borde superior está por encima de la línea.
      let activeIndex = -1;
      steps.forEach((step, index) => {
        const top = step.getBoundingClientRect().top;
        if (top <= activationLine) {
          activeIndex = index;
        }
      });

      // Si ningún paso de esta sección ha cruzado el umbral, no interferir.
      // (Evita que la segunda sección active su paso 0 nada más entrar en pantalla.)
      if (activeIndex === -1) return;

      activate(activeIndex, steps);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(initRafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [hasDiagram, isDiagramExpanded, proofSteps, syncProofStepState]);

  const renderedJustifications = () => {
    if (!activeJustifications || activeJustifications.length === 0) {
      return <p className="m-0 text-xs italic text-carbon/50 font-serif">Por hipótesis o inferencia lógica elemental.</p>;
    }

    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {activeJustifications.map((id) => {
          const theorem = db.getTheorem(id);
          const definition = db.getDefinition(id);
          const concept = theorem || definition;
          
          if (!concept) return null;
          
          const conceptType = theorem ? (theorem.type || 'teorema') : 'definicion';
          const typeStyle = TYPE_STYLES[conceptType];
          const badgeText = typeStyle?.badge ?? 'CONCEPTO';
          const badgeColor = typeStyle?.bg ?? 'var(--theme-pizarra)';

          const prefix = definition ? 'definicion' : 'teorema';

          return (
            <Link
              key={id}
              href={`/${prefix}/${id}`}
              className="page-accent-hover inline-flex items-center gap-2 px-2.5 py-1 text-xs border border-carbon/15 rounded bg-lienzo transition-all text-carbon"
              style={{ textDecoration: 'none' }}
            >
              <span
                className="px-1 text-[8px] font-sans font-bold rounded text-white"
                style={{ backgroundColor: badgeColor }}
              >
                {badgeText}
              </span>
              <span className="font-serif italic font-semibold">{concept.title}</span>
            </Link>
          );
        })}
      </div>
    );
  };

  const renderHeader = (isMobile: boolean) => {
    if (!shouldRenderHeader || !isDemoPage || !demo) return null;
    return (
      <div className={`pt-4 pb-4 ${isMobile ? 'lg:hidden mb-6' : 'hidden lg:block'}`}>
        <ContentHeader
          type="demostracion"
          typeLabel="Demostración"
          title={demo.title}
          description={demo.description}
          breadcrumbs={breadcrumbs}
          authors={demo.authors || []}
          nodeId={demo.id}
          backLink={parentTheorem ? {
            href: `/teorema/${parentTheorem.id}`,
            label: `← ${parentTheorem.title}`,
          } : undefined}
          badgesSlot={demo.proofMethod ? (
            <Link
              href={`/metodo/${demo.proofMethod}`}
              className="ac-pill ac-pill-accent"
              style={{ ['--pill-accent' as string]: 'var(--page-accent)' }}
            >
              <span className="ac-pill-ornament" aria-hidden>❧</span>
              {db.getMethod(demo.proofMethod)?.title ?? demo.proofMethod.replace(/^metodo-/, '')}
            </Link>
          ) : undefined}
        />
      </div>
    );
  };

  return (
    <DiagramStepSyncContext.Provider value={diagramStepSyncValue}>
      <div
        ref={rootRef}
        className={`codex-layout page-accent-scope is-focus-mode ${!hasDiagram ? 'has-no-diagram' : ''} ${className}`}
        data-page-type="demostracion"
        style={{ '--page-accent': getContentPageAccent('demostracion') } as React.CSSProperties}
      >
      <MobileContentHeaderSeparator
        hasDiagram={hasDiagram}
        isDiagramExpanded={isDiagramExpanded}
      />

      {/* Cabecera en móviles: antes del grid para que no quede aplastada por el diagrama sticky */}
      {shouldRenderHeader && isDemoPage && demo && (
        <div className="max-w-[80ch] mx-auto px-6 mobile-header-container">
          {renderHeader(true)}
        </div>
      )}

      <div className={`codex-content ${!hasDiagram ? 'is-single-column' : ''}`}>
        {/* Columna del Diagrama (va primero en el DOM para móvil, pero ordenado por CSS grid en escritorio) */}
        {hasDiagram && (
          <aside 
            className="codex-diagram" 
            aria-label={diagramLabel}
            data-mobile-collapsed={!isDiagramExpanded}
          >
            <div className="codex-diagram-sticky">
              <div id={diagramId} className="codex-diagram-surface">
                {diagram}
              </div>
              <MobileDiagramToolbar
                diagramId={diagramId}
                isExpanded={isDiagramExpanded}
                onToggle={() => setIsDiagramExpanded((isExpanded) => !isExpanded)}
              />

              {/* Panel de Justificaciones Activas */}
              <div className="codex-justifications">
                <h4>Justificaciones del Paso</h4>
                {renderedJustifications()}
              </div>
            </div>
          </aside>
        )}

        {/* Columna de Lectura (Pasos de Demostración) */}
        <main className="codex-reading">
          {renderHeader(false)}
          {children}
        </main>
      </div>
      </div>
    </DiagramStepSyncContext.Provider>
  );
};
export default CodexLayout;
