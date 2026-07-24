import { useState, type KeyboardEvent } from 'react';
import { db } from '@/entities/content';
import { useGraphStore } from '@/features/graph/GraphStore';
import { GraphExplorerLink } from './GraphExplorerLink';
import { AxiomaticUniversePicker } from './AxiomaticUniversePicker';
import { AxiomaticAxiomPicker } from './AxiomaticAxiomPicker';
import { AxiomaticDisplayOptions } from './AxiomaticDisplayOptions';

interface AxiomaticSidebarProps {
  isMobile: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  visibleTypes: Set<string>;
  toggleType: (type: string) => void;
  typeLabel: Record<string, string>;
  typeColors: Record<string, string>;
}

type SidebarView = 'logic' | 'display';

export function AxiomaticSidebar({
  isMobile,
  sidebarOpen,
  setSidebarOpen,
  visibleTypes,
  toggleType,
  typeLabel,
  typeColors,
}: AxiomaticSidebarProps) {
  const [activeView, setActiveView] = useState<SidebarView>('logic');
  const {
    systems,
    inactiveSystems,
    toggleSystem,
    models,
    inactiveModels,
    toggleModel,
    axioms,
    disabledAxioms,
    activeStates,
    isLoading,
    status,
    error,
    toggleAxiom,
    setActiveAxioms,
  } = useGraphStore();

  const axiomPages = db.getAllAxioms();
  const disabledAxiomIds = new Set(disabledAxioms);
  const activeAxiomCount = axioms.length - disabledAxioms.length;
  const neutralAxiomIds = axiomPages
    .filter((axiom) => !axiom.alternativeGroup)
    .map((axiom) => axiom.id);
  const neutralAxiomIdSet = new Set(neutralAxiomIds);
  const isNeutralBase = activeAxiomCount === neutralAxiomIds.length
    && axioms.every((id) => disabledAxiomIds.has(id) || neutralAxiomIdSet.has(id));
  const validNodeCount = Object.values(activeStates).filter(Boolean).length;
  const evaluatedNodeCount = Object.keys(activeStates).length;
  const activeSystem = systems.find(system => !inactiveSystems.includes(system.id));
  const activeModel = models.find(model => !inactiveModels.includes(model.id));
  const activeContext = activeSystem?.title
    ?? activeModel?.title
    ?? (isNeutralBase ? 'Base neutral' : 'Selección manual');

  let statusLabel = 'Actualizado';
  let statusColor = 'text-musgo';
  if (isLoading) {
    statusLabel = 'Recalculando…';
    statusColor = 'text-ocre';
  }
  if (status === 'error') {
    statusLabel = 'Error';
    statusColor = 'text-granada';
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextView = event.key === 'ArrowLeft' || event.key === 'Home' ? 'logic' : 'display';
    setActiveView(nextView);
    document.getElementById(`axiomatic-${nextView}-tab`)?.focus();
  };

  if (isMobile && !sidebarOpen) return null;

  return (
    <aside
      aria-label="Controles del grafo de dependencias"
      className={isMobile
        ? 'fixed inset-x-0 bottom-0 top-24 z-50 w-full overflow-y-auto overscroll-contain border-t border-carbon/15 bg-lienzo shadow-2xl'
        : 'h-full w-[320px] shrink-0 overflow-y-auto overscroll-contain border-r border-carbon/15 bg-lienzo/95'}
    >
      <header className={isMobile ? 'px-5 pb-4 pt-5' : 'px-5 pb-4 pt-24'}>
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="ac-label ac-label--xs ac-label--terracota">
              Explorador lógico
            </p>
            <h1 className="mt-1 font-serif text-xl leading-tight tracking-tight text-carbon">
              Dependencias axiomáticas
            </h1>
          </div>
          {isMobile && (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Cerrar controles del grafo"
              className="flex size-11 shrink-0 items-center justify-center border border-carbon/15 text-lg text-carbon/55 transition-colors hover:border-carbon/30 hover:text-carbon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota"
            >
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>
        <p className="mt-2 max-w-[32ch] font-sans text-[11px] leading-relaxed text-carbon/60">
          Se modifica la base lógica y se observa qué resultados permanecen válidos.
        </p>
        <div className="mt-3 border-t border-carbon/10 pt-1">
          <GraphExplorerLink href="/grafo" direction="back">
            Mapa general de conexiones
          </GraphExplorerLink>
        </div>
      </header>

      <section
        aria-live="polite"
        aria-label="Estado lógico actual"
        className="border-y border-carbon/15 bg-carbon/[0.025] px-5 py-3.5"
      >
        <div className="flex items-baseline justify-between gap-3">
          <div className="min-w-0">
            <p className="ac-label ac-label--2xs">
              Base actual
            </p>
            <p className="mt-0.5 truncate font-serif text-sm font-semibold text-carbon">
              {activeContext}
            </p>
          </div>
          <span className={`shrink-0 font-sans text-[9px] ${statusColor}`}>{statusLabel}</span>
        </div>

        {status === 'error' ? (
          <p role="alert" className="mt-2 font-sans text-[10px] leading-relaxed text-granada">
            No se pudo recalcular la validez{error?.message ? `: ${error.message}` : '.'}
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-2 divide-x divide-carbon/10">
            <div className="pr-3">
              <span className="block font-serif text-lg leading-none text-carbon tabular-nums">{activeAxiomCount}</span>
              <span className="mt-1 block font-sans text-[9px] text-carbon/55">de {axioms.length} axiomas</span>
            </div>
            <div className="pl-3">
              <span className="block font-serif text-lg leading-none text-carbon tabular-nums">{validNodeCount}</span>
              <span className="mt-1 block font-sans text-[9px] text-carbon/55">de {evaluatedNodeCount || '—'} nodos válidos</span>
            </div>
          </div>
        )}
      </section>

      <div className="sticky top-0 z-10 grid grid-cols-2 border-b border-carbon/15 bg-lienzo/95 px-5 pt-2 backdrop-blur-sm" role="tablist" aria-label="Organización de controles">
        <button
          type="button"
          role="tab"
          id="axiomatic-logic-tab"
          aria-controls="axiomatic-logic-panel"
          aria-selected={activeView === 'logic'}
          tabIndex={activeView === 'logic' ? 0 : -1}
          onClick={() => setActiveView('logic')}
          onKeyDown={handleTabKeyDown}
          className={`min-h-11 border-b-2 px-2 font-serif text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-terracota ${
            activeView === 'logic'
              ? 'border-terracota text-carbon'
              : 'border-transparent text-carbon/50 hover:text-carbon'
          }`}
        >
          Base lógica
        </button>
        <button
          type="button"
          role="tab"
          id="axiomatic-display-tab"
          aria-controls="axiomatic-display-panel"
          aria-selected={activeView === 'display'}
          tabIndex={activeView === 'display' ? 0 : -1}
          onClick={() => setActiveView('display')}
          onKeyDown={handleTabKeyDown}
          className={`min-h-11 border-b-2 px-2 font-serif text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-terracota ${
            activeView === 'display'
              ? 'border-terracota text-carbon'
              : 'border-transparent text-carbon/50 hover:text-carbon'
          }`}
        >
          Vista y lectura
        </button>
      </div>

      <div
        id="axiomatic-logic-panel"
        role="tabpanel"
        aria-labelledby="axiomatic-logic-tab"
        hidden={activeView !== 'logic'}
        className="px-5 py-5"
      >
        <AxiomaticUniversePicker
          systems={systems}
          inactiveSystems={inactiveSystems}
          onToggleSystem={toggleSystem}
          models={models}
          inactiveModels={inactiveModels}
          onToggleModel={toggleModel}
        />

        <div className="my-5 border-t border-carbon/10" />

        <AxiomaticAxiomPicker
          axioms={axiomPages}
          disabledAxioms={disabledAxiomIds}
          baselineAxiomIds={neutralAxiomIds}
          onToggle={toggleAxiom}
          onRestoreBaseline={() => setActiveAxioms(neutralAxiomIds)}
          onDeactivateAll={() => setActiveAxioms([])}
        />
      </div>

      <div
        id="axiomatic-display-panel"
        role="tabpanel"
        aria-labelledby="axiomatic-display-tab"
        hidden={activeView !== 'display'}
        className="px-5 py-5"
      >
        <AxiomaticDisplayOptions
          visibleTypes={visibleTypes}
          onToggleType={toggleType}
          typeLabel={typeLabel}
          typeColors={typeColors}
        />
      </div>
    </aside>
  );
}
