import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { MathBoard } from '@/diagrams/jsxgraph/MathBoard';
import { DiagramTitle } from '@/components/ui/DiagramOverlay';
import { StepNavigator } from '@/components/ui/StepNavigator';
import { MathProviderBoundary, useMathStore } from '@/lib/page-context/MathStoreContext';
import { useDiagramStepSync } from '@/lib/page-context/DiagramStepSyncContext';
import {DIAGRAM_RENDERER_ID, type DiagramBounds, type DiagramElement, type DiagramSpecV3, type DiagramSpecV2} from '@/diagrams/model'
import {createScenePlan, prepareSceneSpec, sceneGeometryRevision, sceneStackRevision, zoomViewport} from '@/diagrams/geometry';

import { useDiagramSelection } from '@/diagrams/render/interaction/useDiagramSelection';
import type { DiagramAnnotationPlacement, DiagramSelectionIntent } from '@/diagrams/render/interaction/useDiagramSelection';
import { useDiagramViewport } from '@/diagrams/render/interaction/useDiagramViewport';
import {
  DiagramKatexOverlay,
  ExplorationCue,
  compactHeaderReadings,
  headerReadingItems,
  headerReadingText,
  movableCueLabels,
} from '@/diagrams/render/DiagramKatexOverlay';
import { liveVariables, useBoardLifecycle } from '@/diagrams/render/lifecycle/useBoardLifecycle';
import { useDiagramPaintReport } from '@/components/ui/skeletons';
import { syncDiagramTextScale } from '@/diagrams/diagramTextScale';

export interface DiagramRendererProps {
  spec: DiagramSpecV2 | DiagramSpecV3;
  mode?: 'runtime' | 'editor' | 'preview';
  selectedIds?: readonly string[];
  highlightedIds?: readonly string[];
  errorHighlightedIds?: readonly string[];
  activeStepId?: string;
  viewportControls?: boolean;
  className?: string;
  hideHeader?: boolean;
  borderWidth?: number | string;
  borderRadius?: number | string;
  onSelectionChange?: (id: string, intent?: DiagramSelectionIntent) => void;
  onPointMove?: (id: string, x: number, y: number) => void;
  onSliderChange?: (id: string, value: number) => void;
  onAnnotationMove?: (id: string, placement: DiagramAnnotationPlacement) => void;
  onCanvasPointCreate?: (x: number, y: number) => void;
  onViewportChange?: (bounds: DiagramBounds, options?: { persist?: boolean; persistHome?: boolean }) => void;
  /** Aviso cuando el tablero ha construido la escena (para quitar skeleton). */
  onReady?: () => void;
  stepControls?: boolean;
}

const DiagramRendererContent: React.FC<DiagramRendererProps> = ({
  spec: inputSpec,
  mode = 'runtime',
  selectedIds = [],
  highlightedIds = [],
  errorHighlightedIds = [],
  activeStepId,
  viewportControls = true,
  className,
  hideHeader = false,
  borderWidth,
  borderRadius,
  onSelectionChange,
  onPointMove,
  onSliderChange,
  onAnnotationMove,
  onCanvasPointCreate,
  onViewportChange,
  onReady,
  stepControls,
}) => {
  const reportPaint = useDiagramPaintReport();
  const readyNotifiedRef = useRef(false);
  const spec = useMemo(() => prepareSceneSpec(inputSpec), [inputSpec]);

  const {
    interactionCallbacksRef,
    localTargetHighlightRef,
    setTargetHighlight,
  } = useDiagramSelection({
    spec,
    mode,
    onSelectionChange,
    onPointMove,
    onSliderChange,
    onAnnotationMove,
    onCanvasPointCreate,
  });

  const scopedStoreStep = useMathStore(state => state.variables?.[`step:${spec.componentId}`]);
  const stepSync = useDiagramStepSync();

  const synchronizedStepId = useMemo(() => {
    if (!stepSync) return undefined;
    if (stepSync.activeStepId) {
      if (stepSync.activeStepId === 'initial') {
        return spec.steps[0]?.id;
      }
      const match = spec.steps.find(s => s.id === stepSync.activeStepId);
      if (match) return match.id;
    }
    if (stepSync.activeStepIndex != null) {
      const hasInitialStep = spec.steps[0]?.id === 'initial' || spec.steps[0]?.id === 'enunciado' || spec.steps[0]?.id === 'hipotesis';
      const mappedIndex = hasInitialStep ? stepSync.activeStepIndex + 1 : stepSync.activeStepIndex;
      return spec.steps[mappedIndex]?.id ?? spec.steps[spec.steps.length - 1]?.id;
    }
    return undefined;
  }, [stepSync, spec.steps]);

  const effectiveStepId = activeStepId
    ?? synchronizedStepId
    ?? ((typeof scopedStoreStep === 'string' ? scopedStoreStep.replace(`${spec.componentId}:`, '') : '') || spec.steps[0]?.id);

  const [liveSceneVariables, setLiveSceneVariables] = useState<Record<string, number>>(() => {
    try { return liveVariables({}, spec); } catch { return {}; }
  });
  const liveVariablesSignatureRef = useRef('');

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
  const compactReadings = compactHeaderReadings(allHeaderReadings, spec);
  const visibleHeaderItemIds = new Set(headerItems.map(item => item.id));

  const rendererRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const showStepControls = (stepControls ?? mode === 'runtime') && spec.steps.length > 1;
  const showToolbar = viewportControls || showStepControls;

  const {
    bounds,
    commitCamera,
    fitAutoViewport,
    recoverVisibleViewport,
    resetToHome,
    missingItems,
    safeArea,
    viewportSafeArea,
    toolbarLayout,
    headerLayout,
    sideChromeWidth,
    sidePad,
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
    hasHeader: !hideHeader,
    onViewportChange,
    rendererRef,
    headerRef,
    toolbarRef,
  });

  const geometryRevision = useMemo(() => sceneGeometryRevision(spec), [spec]);
  const stackRevision = useMemo(() => sceneStackRevision(spec), [spec]);

  const { handleBoardInit, handleBoardUpdate } = useBoardLifecycle({
    spec,
    mode,
    selectedIds,
    highlightedIds,
    errorHighlightedIds,
    effectiveStepId,
    bounds,
    interactionCallbacksRef,
    setTargetHighlight,
    localTargetHighlightRef,
    allHeaderItemIds,
    setLiveSceneVariables,
    liveVariablesSignatureRef,
  });

  const notifyReady = () => {
    if (readyNotifiedRef.current) return;
    readyNotifiedRef.current = true;
    onReady?.();
    reportPaint?.();
  };

  useEffect(() => {
    readyNotifiedRef.current = false;
  }, [spec.componentId, geometryRevision]);

  useLayoutEffect(() => {
    const element = rendererRef.current;
    if (!element) return;
    syncDiagramTextScale(element);
    const observer = new ResizeObserver(() => syncDiagramTextScale(element));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const handleBoardInitAndReady = (board: Parameters<typeof handleBoardInit>[0], elements: Parameters<typeof handleBoardInit>[1], theme: Parameters<typeof handleBoardInit>[2]) => {
    handleBoardInit(board, elements, theme);
    requestAnimationFrame(() => {
      requestAnimationFrame(notifyReady);
    });
  };

  const hasCustomRadius = borderRadius !== undefined;
  const roundedClass = hasCustomRadius ? '' : 'rounded-[20px]';
  const isCompactMode = Boolean(className?.includes('!min-h-0'));
  const minHeightClass = isCompactMode ? '!min-h-0 min-h-0' : 'min-h-[360px]';

  return (
    <div
      ref={rendererRef}
      className={`relative ${minHeightClass} h-full w-full overflow-hidden ${roundedClass} ${className ?? ''}`}
      data-diagram-renderer={DIAGRAM_RENDERER_ID}
      data-diagram-mode={mode}
      data-diagram-active-step={effectiveStepId}
      data-diagram-viewport-bounds={bounds.join(',')}
      data-diagram-layout={toolbarLayout}
      data-diagram-header-layout={headerLayout}
      style={{
        '--diagram-safe-top': `${viewportSafeArea.top}px`,
        '--diagram-safe-right': `${viewportSafeArea.right}px`,
        '--diagram-safe-bottom': `${viewportSafeArea.bottom}px`,
        '--diagram-safe-left': `${viewportSafeArea.left}px`,
        '--diagram-side-chrome': `${sideChromeWidth}px`,
        '--diagram-side-pad': `${sidePad}px`,
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
        borderWidth={borderWidth}
        borderRadius={borderRadius}
        revision={geometryRevision}
        stackRevision={stackRevision}
        safeArea={safeArea}
        viewportSafeArea={viewportSafeArea}
        ariaLabel={`${spec.title}. Diagrama matemático interactivo.`}
        className={`relative h-full w-full overflow-hidden ${roundedClass} font-diagram ${className?.includes('!min-h-0') ? '!min-h-0' : 'min-h-[360px]'}`}
        onBoundingBoxChange={(next) => {
          if (next.some((value, index) => Math.abs(value - bounds[index]) > 1e-7)) commitCamera(next);
        }}
        onInit={handleBoardInitAndReady}
        onUpdate={handleBoardUpdate}
      >
        {!hideHeader && (
          <header
            ref={headerRef}
            className={`pointer-events-none absolute z-20 ${
              headerLayout === 'side'
                ? 'top-0 left-0 flex flex-col gap-1 pt-3 sm:pt-4'
                : isCompactMode
                  ? 'inset-x-0 top-0 px-3 pt-2.5 space-y-0.5 max-w-[calc(100%-3rem)]'
                  : 'inset-x-0 top-0 px-3.5 pt-3.5 sm:px-6 sm:pt-5'
            }`}
            data-diagram-header
          >
            {spec.note && (
              <p
                className={`font-diagram italic text-carbon/65 diagram-header-note ${
                  headerLayout === 'side'
                    ? 'mb-0 leading-snug'
                    : isCompactMode
                      ? 'hidden sm:block leading-tight max-w-[20rem] mb-0.5'
                      : 'mb-2 max-w-[44rem] leading-snug'
                }`}
                style={{ '--diagram-authored-font-size': isCompactMode ? '11px' : '14px' } as React.CSSProperties}
              >
                <ExplorationCue labels={movableCueLabels(spec)}>{spec.note}</ExplorationCue>
              </p>
            )}
            <DiagramTitle
              layout="inline"
              fontSize={isCompactMode ? 14 : 24}
              className={
                headerLayout === 'side'
                  ? 'font-bold text-carbon/95 block'
                  : isCompactMode
                    ? 'font-bold text-carbon/95 truncate block max-w-[22rem]'
                    : undefined
              }
            >
              {spec.title}
            </DiagramTitle>
            {compactReadings.length > 0 && (
              <output
                className={`flex flex-wrap items-baseline gap-x-2 font-diagram italic text-carbon/80 diagram-header-readings ${
                  headerLayout === 'side' ? 'mt-1 gap-y-1' : isCompactMode ? 'mt-0.5' : 'mt-1 gap-y-0.5'
                }`}
                style={{ '--diagram-authored-font-size': isCompactMode ? '11px' : '16px' } as React.CSSProperties}
                aria-live="polite"
                aria-label="Lecturas dinámicas del diagrama"
              >
                {compactReadings.map(({ id, itemIds, text, visibility }, index) => {
                  const visible = visibility === 'all'
                    ? itemIds.every(itemId => visibleHeaderItemIds.has(itemId))
                    : itemIds.some(itemId => visibleHeaderItemIds.has(itemId));
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
        )}
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
                <div className="flex h-11 items-stretch justify-self-start divide-x divide-carbon/10 overflow-hidden rounded-full border border-carbon/15 bg-lienzo/90 backdrop-blur-[2px]" role="group" aria-label="Controles del viewport">
                  <button type="button" className="min-w-11 px-2 font-diagram text-base text-carbon transition-colors hover:bg-carbon/5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-pavo" aria-label="Acercar" onClick={() => commitCamera(zoomViewport(spec, bounds, 1.25))}>+</button>
                  <button type="button" className="min-w-11 px-2 font-diagram text-base text-carbon transition-colors hover:bg-carbon/5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-pavo" aria-label="Alejar" onClick={() => commitCamera(zoomViewport(spec, bounds, 0.8))}>−</button>
                  <button type="button" className="diagram-viewport-secondary px-3 font-diagram text-xs text-carbon transition-colors hover:bg-carbon/5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-pavo" aria-label="Ajustar automáticamente al contenido visible en todos los pasos" title="Reencuadrar para mostrar todos los objetos visibles en algún paso" onClick={() => fitAutoViewport()}>Ajustar</button>
                  <button
                    type="button"
                    className="diagram-viewport-secondary px-3 font-diagram text-xs text-carbon transition-colors hover:bg-carbon/5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-pavo disabled:opacity-35"
                    disabled={missingItems.length === 0}
                    aria-label="Recuperar objetos fuera del viewport"
                    title={missingItems.length > 0 ? `${missingItems.length} objeto(s) visible(s) fuera de vista` : 'No hay objetos visibles fuera de vista'}
                    onClick={() => recoverVisibleViewport()}
                  >
                    Recuperar
                  </button>
                  <button type="button" className="diagram-viewport-secondary px-3 font-diagram text-xs text-carbon transition-colors hover:bg-carbon/5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-pavo" aria-label="Restablecer vista inicial" title="Volver a la vista inicial guardada" onClick={() => resetToHome()}>Inicio</button>
                  {toolbarLayout === 'rails' && (
                    <button
                      type="button"
                      className="min-w-11 px-2 font-diagram text-base text-carbon transition-colors hover:bg-carbon/5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-pavo"
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
                      onClick={() => { fitAutoViewport(); setViewportMenuOpen(false); }}
                    >
                      Ajustar al contenido
                    </button>
                    <button
                      type="button"
                      className="block w-full rounded-lg px-3 py-2 text-left hover:bg-carbon/5 focus-visible:outline-2 focus-visible:outline-pavo disabled:opacity-35"
                      role="menuitem"
                      disabled={missingItems.length === 0}
                      onClick={() => { recoverVisibleViewport(); setViewportMenuOpen(false); }}
                    >
                      Recuperar fuera de vista
                    </button>
                    <button
                      type="button"
                      className="block w-full rounded-lg px-3 py-2 text-left hover:bg-carbon/5 focus-visible:outline-2 focus-visible:outline-pavo"
                      role="menuitem"
                      onClick={() => { resetToHome(); setViewportMenuOpen(false); }}
                    >
                      Restablecer vista
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
