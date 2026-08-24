import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { MathBoard } from '@/diagrams/jsxgraph/MathBoard';
import { DiagramTitle } from '@/components/ui/DiagramOverlay';
import { StepNavigator } from '@/components/ui/StepNavigator';
import { MathProviderBoundary, useMathStore } from '@/lib/page-context/MathStoreContext';
import { matchesScopedDiagramTarget } from '@/lib/page-context/DiagramTargetRegistryContext';
import { useDiagramStepSync } from '@/lib/page-context/DiagramStepSyncContext';
import {DIAGRAM_RENDERER_ID, type DiagramBounds, type DiagramElement, type DiagramSpecV3, type DiagramSpecV2, localizeDiagramSpec} from '@/diagrams/model'
import {createScenePlan, prepareSceneSpec, sceneGeometryRevision, sceneStackRevision, zoomViewport} from '@/diagrams/geometry';
import { useI18n } from '@/i18n';

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
import { useCanvasControl } from './CanvasControlContext';
import { syncDiagramTextScale } from '@/diagrams/diagramTextScale';

export interface DiagramRendererProps {
  spec: DiagramSpecV2 | DiagramSpecV3;
  lang?: string;
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
  interactive?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  isCompleted?: boolean;
}

const DiagramRendererContent: React.FC<DiagramRendererProps> = ({
  spec: inputSpec,
  lang: propLang,
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
  interactive = true,
  readOnly = false,
  disabled = false,
  isCompleted = false,
}) => {
  const canvasControl = useCanvasControl();
  const effectiveOnPointMove = onPointMove || canvasControl?.onPointMove;
  const effectiveHideHeader = hideHeader || canvasControl?.hideHeader;

  const reportPaint = useDiagramPaintReport();
  const readyNotifiedRef = useRef(false);
  const { lang: contextLang, t } = useI18n();
  const effectiveLang = propLang || contextLang;

  const effectiveInputSpec = (canvasControl?.isCompleted && canvasControl?.activeSpec) || inputSpec;
  const localizedInputSpec = useMemo(() => localizeDiagramSpec(effectiveInputSpec, effectiveLang), [effectiveInputSpec, effectiveLang]);
  const spec = useMemo(() => prepareSceneSpec(localizedInputSpec), [localizedInputSpec]);

  const isInteractionLocked = Boolean(readOnly || disabled || isCompleted || canvasControl?.isCompleted || interactive === false);

  const {
    interactionCallbacksRef,
    localTargetHighlightRef,
    setTargetHighlight,
  } = useDiagramSelection({
    spec,
    mode,
    readOnly: isInteractionLocked,
    onSelectionChange,
    onPointMove: effectiveOnPointMove,
    onSliderChange,
    onAnnotationMove,
    onCanvasPointCreate,
  });

  const scopedStoreStep = useMathStore(state => state.variables?.[`step:${spec.componentId}`]);
  const storeHighlight = useMathStore(state => state.variables?.[`highlight:${spec.componentId}`] ?? state.variables?.['highlight']);
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

  const hoveredStepId = useMemo(() => {
    if (!storeHighlight) return undefined;
    const match = spec.steps.find(s => matchesScopedDiagramTarget(storeHighlight, s.id, spec.componentId));
    return match?.id;
  }, [storeHighlight, spec.steps, spec.componentId]);

  const effectiveStepId = hoveredStepId
    ?? activeStepId
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

  const showStepControls = (stepControls ?? true) && spec.steps.length > 1;
  const showToolbar = viewportControls || showStepControls;

  const hasHeader = Boolean(
    !effectiveHideHeader &&
    spec.showHeader !== false &&
    (spec.title || spec.note || ('readings' in spec && Array.isArray(spec.readings) && spec.readings.length > 0))
  );

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
  } = useDiagramViewport({
    spec: liveViewportSpec,
    mode,
    effectiveStepId,
    hasTopViewportPanel,
    viewportControls,
    showStepControls,
    showToolbar,
    hasHeader,
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
    readOnly: isInteractionLocked,
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
        {!effectiveHideHeader && spec.showHeader !== false && (
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
                aria-label={t('diagram', 'dynamicReadings')}
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
            className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-2 p-3"
            data-diagram-toolbar
            data-diagram-toolbar-layout={toolbarLayout}
          >
            {viewportControls && (
              <div
                className={`pointer-events-auto flex items-stretch divide-carbon/10 overflow-hidden border border-carbon/15 bg-lienzo/90 backdrop-blur-[2px] ${
                  toolbarLayout === 'rails'
                    ? 'h-auto w-11 flex-col divide-y rounded-2xl'
                    : 'h-11 flex-row divide-x rounded-full'
                }`}
                role="group"
                aria-label={t('diagram', 'viewportControls')}
              >
                <button
                  type="button"
                  className="flex size-11 shrink-0 items-center justify-center font-diagram text-base leading-none text-carbon transition-colors hover:bg-carbon/5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-pavo"
                  aria-label={t('diagram', 'zoomIn')}
                  title={t('diagram', 'zoomInTitle')}
                  onClick={() => commitCamera(zoomViewport(spec, bounds, 1.25))}
                >
                  +
                </button>
                <button
                  type="button"
                  className="flex size-11 shrink-0 items-center justify-center font-diagram text-base leading-none text-carbon transition-colors hover:bg-carbon/5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-pavo"
                  aria-label={t('diagram', 'zoomOut')}
                  title={t('diagram', 'zoomOutTitle')}
                  onClick={() => commitCamera(zoomViewport(spec, bounds, 0.8))}
                >
                  −
                </button>
                <button
                  type="button"
                  className={`inline-flex h-11 shrink-0 items-center justify-center gap-1.5 font-diagram text-xs text-carbon transition-colors hover:bg-carbon/5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-pavo ${
                    toolbarLayout === 'rails' ? 'w-11 px-0' : 'min-w-11 px-2.5 sm:px-3'
                  }`}
                  aria-label={t('diagram', 'fitView')}
                  title={t('diagram', 'fitView')}
                  onClick={() => fitAutoViewport()}
                >
                  <span aria-hidden className="flex size-4 items-center justify-center text-sm leading-none">⌖</span>
                  {toolbarLayout !== 'rails' && <span className="diagram-viewport-label">{t('diagram', 'fitView')}</span>}
                </button>
                {toolbarLayout !== 'rails' && (
                  <>
                    <button
                      type="button"
                      className="diagram-viewport-secondary inline-flex h-11 items-center justify-center px-3 font-diagram text-xs text-carbon transition-colors hover:bg-carbon/5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-pavo disabled:opacity-35 disabled:cursor-not-allowed"
                      disabled={missingItems.length === 0}
                      aria-label="Recuperar objetos fuera del viewport"
                      title={missingItems.length > 0 ? `${missingItems.length} objeto(s) visible(s) fuera de vista` : 'No hay objetos visibles fuera de vista'}
                      onClick={() => recoverVisibleViewport()}
                    >
                      Recuperar
                    </button>
                    <button
                      type="button"
                      className="diagram-viewport-secondary inline-flex h-11 items-center justify-center px-3 font-diagram text-xs text-carbon transition-colors hover:bg-carbon/5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-pavo"
                      aria-label="Restablecer vista inicial"
                      title="Volver a la vista inicial guardada"
                      onClick={() => resetToHome()}
                    >
                      Inicio
                    </button>
                  </>
                )}
              </div>
            )}
            {showStepControls && (
              <StepNavigator
                steps={spec.steps}
                scopeId={spec.componentId}
                compact
                className="pointer-events-auto ml-auto"
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
