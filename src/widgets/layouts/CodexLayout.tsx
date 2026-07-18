import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useMathStore } from '@/app/providers/MathStoreContext';
import { DiagramStepSyncContext } from '@/shared/lib/DiagramStepSyncContext';
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
  const [isDiagramExpanded, setIsDiagramExpanded] = useState(true);
  const diagramId = useId();
  const setVariable = useMathStore((state) => state.setVariable);
  const activeJustifications = useMathStore((state) => state.variables?.['activeJustifications']) as string[] | undefined;
  const [location] = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeDiagramStepIndex, setActiveDiagramStepIndex] = useState<number | null>(null);

  // Flag que bloquea el listener de scroll cuando el cambio de paso viene del diagrama,
  // para evitar el bucle: diagrama → store → scroll → store.
  const scrollLockRef = useRef(false);
  const scrollLockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const hasDiagram = !!diagram;

  const isDemoPage = location.startsWith('/demo/');
  const demoId = isDemoPage ? location.split('/')[2] : null;
  const demo = demoId ? db.getDemo(demoId) : null;

  const parentTheorem = demo?.parentTheorem ? db.getTheorem(demo.parentTheorem) : null;
  const breadcrumbs = parentTheorem
    ? [{ name: parentTheorem.title, href: `/teorema/${parentTheorem.id}` }]
    : [];

  const proofSteps = useCallback(
    () => rootRef.current?.querySelectorAll<HTMLElement>('.proof-step') ?? [],
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
    scrollLockRef.current = true;
    if (scrollLockTimer.current) clearTimeout(scrollLockTimer.current);
    scrollLockTimer.current = setTimeout(() => {
      scrollLockRef.current = false;
    }, 600);
    step.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [proofSteps, syncProofStepState]);

  const diagramStepSyncValue = useMemo(() => ({
    activeStepIndex: activeDiagramStepIndex,
    selectDiagramStep,
  }), [activeDiagramStepIndex, selectDiagramStep]);

  // Algoritmo de scrollytelling de precisión adaptable:
  // - En móvil enfoca el paso en el centro de la zona de lectura.
  // - En escritorio enfoca el paso en el centro vertical completo (50vh).
  // - Restablece el foco a 'default' si el usuario se sitúa al inicio (scrollY < 80).
  // - Respeta el flag scrollLockRef cuando el cambio viene del diagrama (no del scroll).
  useEffect(() => {
    const handleScroll = () => {
      // Ignorar scroll detectado mientras el diagrama controla la posición,
      // pero renovar el bloqueo para que se libere solo cuando el scroll termine realmente.
      if (scrollLockRef.current) {
        if (scrollLockTimer.current) clearTimeout(scrollLockTimer.current);
        scrollLockTimer.current = setTimeout(() => {
          scrollLockRef.current = false;
        }, 150);
        return;
      }

      // 1. Limpieza de foco si estamos arriba leyendo la introducción
      if (window.scrollY < 80) {
        setActiveDiagramStepIndex(null);
        setVariable('step', 'default');
        setVariable('activeJustifications', []);
        return;
      }

      const steps = proofSteps();
      if (steps.length === 0) return;

      // 2. Viewport Center Adaptable (Móvil vs Escritorio)
      const isMobile = window.innerWidth < 1024;
      // Si hay diagrama en móvil, el centro de lectura está en la parte inferior (después del diagrama).
      // Si no hay diagrama, el centro es simplemente la mitad de la pantalla.
      const viewportCenter = isMobile && hasDiagram && isDiagramExpanded
        ? (window.innerHeight * 0.46) + ((window.innerHeight * 0.54) / 2)
        : window.innerHeight / 2;

      let closestStep: HTMLElement | null = null;
      let closestStepIndex = -1;
      let minDistance = Infinity;

      const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 20;

      if (isAtBottom && steps.length > 0) {
        // Forzar el último paso si estamos al final absoluto de la página
        closestStep = steps[steps.length - 1];
        closestStepIndex = steps.length - 1;
      } else {
        steps.forEach((step, index) => {
          const rect = step.getBoundingClientRect();
          const stepCenter = rect.top + rect.height / 2;
          const distance = Math.abs(viewportCenter - stepCenter);

          if (distance < minDistance) {
            minDistance = distance;
            closestStep = step;
            closestStepIndex = index;
          }
        });
      }

      if (closestStep && closestStepIndex >= 0) {
        setActiveDiagramStepIndex(closestStepIndex);
        syncProofStepState(closestStep);
      }
    };

    const timer = setTimeout(handleScroll, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [hasDiagram, isDiagramExpanded, proofSteps, setVariable, syncProofStepState]);

  useEffect(() => () => {
    if (scrollLockTimer.current) clearTimeout(scrollLockTimer.current);
  }, []);

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
    if (!isDemoPage || !demo) return null;
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
      <div className="max-w-[80ch] mx-auto px-6 mobile-header-container">
        {renderHeader(true)}
      </div>

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
