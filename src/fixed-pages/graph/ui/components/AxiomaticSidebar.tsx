import { useState, useMemo, type CSSProperties, type KeyboardEvent } from 'react';
import { db } from '@/data/content';
import { useGraphStore } from '@/fixed-pages/graph/GraphStore';
import { GraphExplorerLink } from './GraphExplorerLink';
import { AxiomaticUniversePicker } from './AxiomaticUniversePicker';
import { AxiomaticAxiomPicker } from './AxiomaticAxiomPicker';
import { AxiomaticDisplayOptions } from './AxiomaticDisplayOptions';
import { useI18n } from '@/i18n';

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

/** Mismo lienzo que el grafo, el buscador y los botones; las casillas y la pestaña fija lo reutilizan. */
const PANEL_STYLE = {
  '--axiomatic-panel-bg': 'var(--theme-lienzo)',
} as CSSProperties;

const tabClass = (isActive: boolean) =>
  `ac-rubric -mb-px min-h-11 border-b-[1.5px] text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-terracota ${
    isActive
      ? 'border-terracota [--ac-rubric-color:var(--ink-text)]'
      : 'border-transparent [--ac-rubric-color:var(--ink-text-subtle)] hover:[--ac-rubric-color:var(--ink-text)]'
  }`;

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
  const { lang, t } = useI18n();
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

  const localizedSystems = useMemo(() => {
    return systems.map(s => ({
      ...s,
      title: db.getAxiomaticSystem(s.id, lang)?.title || s.title,
    }));
  }, [systems, lang]);

  const localizedModels = useMemo(() => {
    return models.map(m => ({
      ...m,
      title: db.getModel(m.id, lang)?.title || m.title,
    }));
  }, [models, lang]);

  const axiomPages = useMemo(() => db.getAllAxioms(lang), [lang]);
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
  const activeSystem = localizedSystems.find(system => !inactiveSystems.includes(system.id));
  const activeModel = localizedModels.find(model => !inactiveModels.includes(model.id));
  const activeContext = activeSystem?.title
    ?? activeModel?.title
    ?? (isNeutralBase ? t('graph', 'neutralBase') : t('graph', 'manualSelection'));

  // En reposo no se rotula nada: el estado solo aparece cuando reclama atención.
  let statusLabel: string | null = null;
  let statusColor = '';
  if (isLoading) {
    statusLabel = t('graph', 'recalculating');
    statusColor = 'text-ocre';
  }
  if (status === 'error') {
    statusLabel = t('graph', 'error');
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
      aria-label={t('graph', 'dependencyControlsAria')}
      style={PANEL_STYLE}
      className={isMobile
        ? 'fixed inset-x-0 bottom-0 top-24 z-50 flex w-full flex-col border-t border-carbon/15 bg-[var(--axiomatic-panel-bg)] shadow-2xl'
        : 'flex h-full w-[320px] shrink-0 flex-col border-r border-carbon/15 bg-[var(--axiomatic-panel-bg)]'}
    >
      {/* Franja fija bajo el logo flotante: así las pestañas fijas nunca quedan tapadas por él. */}
      {!isMobile && <div aria-hidden="true" className="h-20 shrink-0" />}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <header className={isMobile ? 'px-5 pb-5 pt-5' : 'px-5 pb-5 pt-4'}>
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl leading-tight text-ink">
                {t('graph', 'axiomaticDependencies')}
              </h1>
            </div>
            {isMobile && (
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label={t('graph', 'closeControlsAria')}
                className="flex size-11 shrink-0 items-center justify-center border border-carbon/15 text-lg text-carbon/55 transition-colors hover:border-carbon/30 hover:text-carbon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota"
              >
                <span aria-hidden="true">×</span>
              </button>
            )}
          </div>
          <p className="mt-1.5 font-serif text-sm italic leading-snug text-ink-muted">
            {t('graph', 'logicModificationDescription')}
          </p>
          <div className="mt-2 flex">
            <GraphExplorerLink href="/grafo" direction="back">
              {t('graph', 'generalConnectionMap')}
            </GraphExplorerLink>
          </div>
        </header>
  
        <section
          aria-live="polite"
          aria-label={t('graph', 'currentLogicStateAria')}
          className="border-t border-carbon/15 px-5 py-4"
        >
          <div className="flex items-baseline justify-between gap-3">
            <p className="min-w-0 truncate font-serif text-base font-semibold text-ink">
              <span className="sr-only">{t('graph', 'currentBase')}: </span>
              {activeContext}
            </p>
            {statusLabel && (
              <span className={`shrink-0 font-serif text-[13px] italic ${statusColor}`}>{statusLabel}</span>
            )}
          </div>
          {status === 'error' ? (
            <p role="alert" className="mt-1 font-serif text-[13px] italic leading-snug text-granada">
              {t('graph', 'recalculateError')}{error?.message ? `: ${error.message}` : '.'}
            </p>
          ) : (
            <p className="mt-0.5 font-serif text-[13px] italic text-ink-muted [font-variant-numeric:oldstyle-nums]">
              {t('graph', 'axiomsTally', { active: activeAxiomCount, total: axioms.length })}
              <span aria-hidden="true"> · </span>
              {t('graph', 'validNodesTally', { valid: validNodeCount, total: evaluatedNodeCount || '—' })}
            </p>
          )}
        </section>
  
        <div className="sticky top-0 z-10 flex gap-6 border-y border-carbon/15 bg-[var(--axiomatic-panel-bg)] px-5" role="tablist" aria-label={t('graph', 'controlsOrganizationAria')}>
          <button
            type="button"
            role="tab"
            id="axiomatic-logic-tab"
            aria-controls="axiomatic-logic-panel"
            aria-selected={activeView === 'logic'}
            tabIndex={activeView === 'logic' ? 0 : -1}
            onClick={() => setActiveView('logic')}
            onKeyDown={handleTabKeyDown}
            className={tabClass(activeView === 'logic')}
          >
            {t('graph', 'logicBase')}
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
            className={tabClass(activeView === 'display')}
          >
            {t('graph', 'viewAndReading')}
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
            systems={localizedSystems}
            inactiveSystems={inactiveSystems}
            onToggleSystem={toggleSystem}
            models={localizedModels}
            inactiveModels={inactiveModels}
            onToggleModel={toggleModel}
          />
  
          <hr className="my-6 border-carbon/15" />
  
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
      </div>
    </aside>
  );
}
