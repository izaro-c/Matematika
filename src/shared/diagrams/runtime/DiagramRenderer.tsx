import React, { useMemo, useRef, useState } from 'react';
import { MathBoard } from '../core/MathBoard';
import { DiagramTitle } from '@/shared/ui/DiagramOverlay';
import { StepNavigator } from '@/shared/ui/StepNavigator';
import { MathProviderBoundary, useMathStore } from '@/shared/lib/MathStoreContext';
import { useDiagramStepSync } from '@/shared/lib/DiagramStepSyncContext';
import {
  DIAGRAM_RENDERER_ID,
  createScenePlan,
  sceneRevision,
  withResolvedPointConstraints,
  zoomViewport,
  type DiagramBounds,
  type DiagramElement,
  type DiagramSpecV2,
} from '../spec';

import { useDiagramSelection } from './useDiagramSelection';
import { useDiagramViewport } from './useDiagramViewport';
import {
  DiagramKatexOverlay,
  ExplorationCue,
  compactHeaderReadings,
  headerReadingItems,
  headerReadingText,
  movableCueLabels,
} from './DiagramKatexOverlay';
import { liveVariables, useBoardLifecycle } from './useBoardLifecycle';

export interface DiagramRendererProps {
  spec: DiagramSpecV2;
  mode?: 'runtime' | 'editor' | 'preview';
  selectedIds?: readonly string[];
  highlightedIds?: readonly string[];
  activeStepId?: string;
  viewportControls?: boolean;
  className?: string;
  onSelectionChange?: (id: string) => void;
  onPointMove?: (id: string, x: number, y: number) => void;
  onCanvasPointCreate?: (x: number, y: number) => void;
  onViewportChange?: (bounds: DiagramBounds) => void;
  stepControls?: boolean;
}

const DiagramRendererContent: React.FC<DiagramRendererProps> = ({
  spec: inputSpec,
  mode = 'runtime',
  selectedIds = [],
  highlightedIds = [],
  activeStepId,
  viewportControls = true,
  className,
  onSelectionChange,
  onPointMove,
  onCanvasPointCreate,
  onViewportChange,
  stepControls,
}) => {
  const spec = useMemo(() => withResolvedPointConstraints(inputSpec), [inputSpec]);

  const {
    interactionCallbacksRef,
    localTargetHighlightRef,
    setTargetHighlight,
  } = useDiagramSelection({
    spec,
    mode,
    onSelectionChange,
    onPointMove,
    onCanvasPointCreate,
  });

  const scopedStoreStep = useMathStore(state => state.variables?.[`step:${spec.componentId}`]);
  const stepSync = useDiagramStepSync();
  const synchronizedStepId = stepSync?.activeStepIndex == null
    ? undefined
    : spec.steps[stepSync.activeStepIndex]?.id;
  const effectiveStepId = activeStepId
    ?? synchronizedStepId
    ?? ((typeof scopedStoreStep === 'string' ? scopedStoreStep.replace(`${spec.componentId}:`, '') : '') || spec.steps[0]?.id);

  const [liveSceneVariables, setLiveSceneVariables] = useState<Record<string, number>>(() => {
    try { return liveVariables({}, spec); } catch { return {}; }
  });
  const liveVariablesSignature = useRef('');

  const liveViewportSpec: DiagramSpecV2 = useMemo(() => ({
    ...spec,
    points: spec.points.map(point => {
      const x = liveSceneVariables[`${point.id}.x`];
      const y = liveSceneVariables[`${point.id}.y`];
      return Number.isFinite(x) && Number.isFinite(y) ? { ...point, x, y } : point;
    }),
    sliders: spec.sliders.map(slider => {
      const value = liveSceneVariables[slider.id];
      return Number.isFinite(value) ? { ...slider, value } : slider;
    }),
  }), [liveSceneVariables, spec]);

  const allHeaderItems = useMemo(() => headerReadingItems(spec), [spec]);
  const allHeaderItemIds = useMemo(() => new Set(allHeaderItems.map(item => item.id)), [allHeaderItems]);

  const hasTopViewportPanel = useMemo(() => spec.elements.some(item => (
    item.kind === 'infoPanel'
    && item.properties?.anchorMode === 'viewport'
    && (item.properties.viewportPosition?.[1] ?? 0) <= 0.34
    && !allHeaderItemIds.has(item.id)
  )), [allHeaderItemIds, spec.elements]);

  const headerItems = useMemo(() => {
    const visibleIds = new Set(createScenePlan(spec, { activeStepId: effectiveStepId })
      .filter(entry => entry.visible)
      .map(entry => entry.item.id));
    return allHeaderItems.filter(item => visibleIds.has(item.id));
  }, [allHeaderItems, effectiveStepId, spec]);

  const allHeaderReadings = allHeaderItems
    .map(item => ({ item, text: headerReadingText(item, liveSceneVariables) }))
    .filter((entry): entry is { item: DiagramElement; text: string } => Boolean(entry.text));
  const compactReadings = compactHeaderReadings(allHeaderReadings);
  const visibleHeaderItemIds = new Set(headerItems.map(item => item.id));

  const rendererRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const showStepControls = (stepControls ?? mode === 'runtime') && spec.steps.length > 0;
  const showToolbar = viewportControls || showStepControls;

  const {
    bounds,
    commitBounds,
    fitRelevantViewport,
    missingItems,
    safeArea,
    viewportSafeArea,
    toolbarLayout,
    viewportMenuOpen,
    setViewportMenuOpen,
  } = useDiagramViewport({
    spec: liveViewportSpec,
    mode,
    effectiveStepId,
    hasTopViewportPanel,
    viewportControls,
    showStepControls,
    showToolbar,
    onViewportChange,
    rendererRef,
    headerRef,
    toolbarRef,
  });

  const revision = useMemo(() => sceneRevision(spec), [spec]);

  const { handleBoardInit, handleBoardUpdate } = useBoardLifecycle({
    spec,
    mode,
    selectedIds,
    highlightedIds,
    effectiveStepId,
    bounds,
    interactionCallbacksRef,
    setTargetHighlight,
    localTargetHighlightRef,
    allHeaderItemIds,
    setLiveSceneVariables,
    liveVariablesSignature,
  });

  return (
    <div
      ref={rendererRef}
      className={`relative min-h-[360px] h-full w-full overflow-hidden rounded-[20px] ${className ?? ''}`}
      data-diagram-renderer={DIAGRAM_RENDERER_ID}
      data-diagram-mode={mode}
      data-diagram-active-step={effectiveStepId}
      data-diagram-viewport-bounds={bounds.join(',')}
      data-diagram-layout={toolbarLayout}
      style={{
        '--diagram-safe-top': `${viewportSafeArea.top}px`,
        '--diagram-safe-right': `${viewportSafeArea.right}px`,
        '--diagram-safe-bottom': `${viewportSafeArea.bottom}px`,
        '--diagram-safe-left': `${viewportSafeArea.left}px`,
        '--diagram-panel-right': `${toolbarLayout === 'rails' && showStepControls ? 52 : viewportSafeArea.right}px`,
      } as React.CSSProperties}
    >
      <MathBoard
        scopeId={spec.componentId}
        boundingbox={bounds}
        axis={spec.axis}
        grid={spec.grid}
        pan
        zoom
        revision={revision}
        safeArea={safeArea}
        viewportSafeArea={viewportSafeArea}
        ariaLabel={`${spec.title}. Diagrama matemático interactivo.`}
        className="relative min-h-[360px] h-full w-full overflow-hidden rounded-[20px] font-diagram"
        onBoundingBoxChange={(next) => {
          if (next.some((value, index) => Math.abs(value - bounds[index]) > 1e-7)) commitBounds(next);
        }}
        onInit={handleBoardInit}
        onUpdate={handleBoardUpdate}
      >
        <header ref={headerRef} className="pointer-events-none absolute inset-x-0 top-0 z-20 px-5 pt-5 sm:px-8 sm:pt-6" data-diagram-header>
          {spec.note && (
            <p className="mb-3 max-w-[44rem] font-diagram text-sm italic leading-snug text-carbon/65">
              <ExplorationCue labels={movableCueLabels(spec)}>{spec.note}</ExplorationCue>
            </p>
          )}
          <DiagramTitle layout="inline">{spec.title}</DiagramTitle>
          {compactReadings.length > 0 && (
            <output className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-diagram text-base italic text-carbon/80" aria-live="polite" aria-label="Lecturas dinámicas del diagrama">
              {compactReadings.map(({ id, itemIds, text }, index) => {
                const visible = itemIds.some(itemId => visibleHeaderItemIds.has(itemId));
                return (
                  <React.Fragment key={id}>
                    {index > 0 && <span className={`text-ocre/55 ${visible ? '' : 'invisible'}`} aria-hidden>·</span>}
                    <span className={visible ? '' : 'invisible'} aria-hidden={visible ? undefined : true}>{text}</span>
                  </React.Fragment>
                );
              })}
            </output>
          )}
        </header>
        <DiagramKatexOverlay spec={spec} activeStepId={effectiveStepId} variables={liveSceneVariables} />
        {showToolbar && (
          <div
            ref={toolbarRef}
            className="absolute inset-x-0 bottom-0 z-30 grid grid-cols-[auto_1fr] items-center gap-2 px-3 pb-3 pt-2"
            data-diagram-toolbar
            data-diagram-toolbar-layout={toolbarLayout}
          >
            {viewportControls && (
              <>
                <div className="flex h-9 items-stretch justify-self-start divide-x divide-carbon/10 overflow-hidden rounded-full border border-carbon/15 bg-lienzo/90 backdrop-blur-[2px]" role="group" aria-label="Controles del viewport">
                  <button type="button" className="w-9 font-diagram text-base text-carbon transition-colors hover:bg-carbon/5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-pavo" aria-label="Acercar" onClick={() => commitBounds(zoomViewport(spec, bounds, 1.25))}>+</button>
                  <button type="button" className="w-9 font-diagram text-base text-carbon transition-colors hover:bg-carbon/5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-pavo" aria-label="Alejar" onClick={() => commitBounds(zoomViewport(spec, bounds, 0.8))}>−</button>
                  <button type="button" className="diagram-viewport-secondary px-2.5 font-diagram text-[11px] text-carbon transition-colors hover:bg-carbon/5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-pavo" aria-label="Ajustar todos los objetos al viewport" title="Reencuadrar para mostrar todos los objetos visibles" onClick={() => commitBounds(fitRelevantViewport())}>Ajustar</button>
                  <button
                    type="button"
                    className="diagram-viewport-secondary px-2.5 font-diagram text-[11px] text-carbon transition-colors hover:bg-carbon/5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-pavo disabled:opacity-35"
                    disabled={missingItems.length === 0}
                    aria-label="Recuperar objetos fuera del viewport"
                    title={missingItems.length > 0 ? `${missingItems.length} objeto(s) visible(s) fuera de vista` : 'No hay objetos visibles fuera de vista'}
                    onClick={() => commitBounds(fitRelevantViewport())}
                  >
                    Recuperar
                  </button>
                  {toolbarLayout === 'rails' && (
                    <button
                      type="button"
                      className="w-9 font-diagram text-base text-carbon transition-colors hover:bg-carbon/5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-pavo"
                      aria-label="Opciones de encuadre"
                      aria-expanded={viewportMenuOpen}
                      title="Ajustar o recuperar el encuadre"
                      onClick={() => setViewportMenuOpen(open => !open)}
                    >
                      ⌖
                    </button>
                  )}
                </div>
                {toolbarLayout === 'rails' && viewportMenuOpen && (
                  <div className="absolute bottom-2 left-14 z-40 min-w-40 overflow-hidden rounded-xl border border-carbon/15 bg-lienzo/95 p-1 font-diagram text-xs text-carbon shadow-lg backdrop-blur-[3px]" role="menu" aria-label="Opciones de encuadre">
                    <button
                      type="button"
                      className="block w-full rounded-lg px-3 py-2 text-left hover:bg-carbon/5 focus-visible:outline-2 focus-visible:outline-pavo"
                      role="menuitem"
                      onClick={() => { commitBounds(fitRelevantViewport()); setViewportMenuOpen(false); }}
                    >
                      Ajustar al contenido
                    </button>
                    <button
                      type="button"
                      className="block w-full rounded-lg px-3 py-2 text-left hover:bg-carbon/5 focus-visible:outline-2 focus-visible:outline-pavo disabled:opacity-35"
                      role="menuitem"
                      disabled={missingItems.length === 0}
                      onClick={() => { commitBounds(fitRelevantViewport()); setViewportMenuOpen(false); }}
                    >
                      Recuperar fuera de vista
                    </button>
                  </div>
                )}
              </>
            )}
            {showStepControls && (
              <StepNavigator
                steps={spec.steps}
                scopeId={spec.componentId}
                compact
                className="col-start-2 justify-self-end"
              />
            )}
          </div>
        )}
      </MathBoard>
    </div>
  );
};

export const DiagramRenderer: React.FC<DiagramRendererProps> = props => (
  <MathProviderBoundary>
    <DiagramRendererContent {...props} />
  </MathProviderBoundary>
);

DiagramRenderer.displayName = 'DiagramRenderer';

export default DiagramRenderer;
