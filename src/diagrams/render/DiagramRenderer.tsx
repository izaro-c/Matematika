import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { MathBoard } from '@/diagrams/jsxgraph/MathBoard';
import { DiagramTitle } from '@/components/ui/DiagramOverlay';
import { StepNavigator } from '@/components/ui/StepNavigator';
import { MathProviderBoundary, useMathStore } from '@/lib/page-context/MathStoreContext';
import { matchesScopedDiagramTarget } from '@/lib/page-context/DiagramTargetRegistryContext';
import { useDiagramStepSync } from '@/lib/page-context/DiagramStepSyncContext';
import { useDiagramFigureNumber } from '@/lib/page-context/DiagramFigureContext';
import {DIAGRAM_RENDERER_ID, annotationViewportPosition, isControlObject, isPositionedPoint, localizeDiagramSpec, withPointPosition, type DiagramBounds, type DiagramObject, type DiagramSpec} from '@/diagrams/model'
import {createScenePlan, resolveDiagramScene, sceneGeometryRevision, sceneStackRevision, zoomViewport} from '@/diagrams/geometry';
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
  spec: DiagramSpec;
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
  const spec = useMemo(() => resolveDiagramScene(localizedInputSpec), [localizedInputSpec]);

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
  const figureNumber = useDiagramFigureNumber();

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

  const liveViewportSpec: DiagramSpec = useMemo(() => ({
    ...spec,
    objects: spec.objects.map(object => {
      if (isPositionedPoint(object)) {
        const x = liveSceneVariables[`${object.id}.x`];
        const y = liveSceneVariables[`${object.id}.y`];
        return Number.isFinite(x) && Number.isFinite(y) ? withPointPosition(object, { x, y }) : object;
      }
      if (isControlObject(object)) {
        const value = liveSceneVariables[object.id];
        return Number.isFinite(value) ? { ...object, value } : object;
      }
      return object;
    }),
  }), [liveSceneVariables, spec]);

  const allHeaderItems = useMemo(() => headerReadingItems(spec), [spec]);
  const allHeaderItemIds = useMemo(() => new Set(allHeaderItems.map(item => item.id)), [allHeaderItems]);

  const hasTopViewportPanel = useMemo(() => spec.objects.some(item => (
    item.objectType === 'annotation'
    && item.variant === 'panel'
    && annotationViewportPosition(item) !== undefined
    && (annotationViewportPosition(item)?.[1] ?? 0) <= 0.34
    && !allHeaderItemIds.has(item.id)
  )), [allHeaderItemIds, spec.objects]);

  const headerItems = useMemo(() => {
    const visibleIds = new Set(createScenePlan(spec, { activeStepId: effectiveStepId })
      .filter(entry => entry.visible)
      .map(entry => entry.item.id));
    return allHeaderItems.filter(item => visibleIds.has(item.id));
  }, [allHeaderItems, effectiveStepId, spec]);

  const allHeaderReadings = allHeaderItems
    .map(item => ({ item, text: headerReadingText(item, liveSceneVariables, spec) }))
    .filter((entry): entry is { item: DiagramObject; text: string } => Boolean(entry.text));
  const compactReadings = compactHeaderReadings(allHeaderReadings, spec);
  const visibleHeaderItemIds = new Set(headerItems.map(item => item.id));

  const rendererRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const showStepControls = (stepControls ?? true) && spec.steps.length > 1;
  const showToolbar = viewportControls || showStepControls;

  const isCompactMode = Boolean(className?.includes('!min-h-0'));
  const headerVisible = !effectiveHideHeader && spec.showHeader !== false;
  // El título va al pie de figura, bajo la lámina; el lienzo de edición y sus
  // miniaturas lo mantienen dentro (allí el pie quedaría bajo la barra del editor).
  const showCaption = headerVisible && !isCompactMode && mode !== 'editor' && Boolean(spec.title);
  const hasHeader = headerVisible && Boolean(
    (spec.title && !showCaption)
    || spec.note
    || ('readings' in spec && Array.isArray(spec.readings) && spec.readings.length > 0)
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
    // En lámina amplia la barra va bajo el dibujo; en lámina pequeña vuelve
    // dentro como raíles laterales para no robar altura al tablero.
    barOutsideBoard: true,
    hasHeader,
    onViewportChange,
    rendererRef: plateRef,
    layoutRef: rendererRef,
    headerRef,
    toolbarRef,
  });
  const toolbarInBoard = showToolbar && toolbarLayout === 'rails';

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
  const roundedClass = hasCustomRadius ? '' : 'rounded-sm';
  const minHeightClass = isCompactMode ? '!min-h-0 min-h-0' : 'min-h-[200px]';

  const toolbar = showToolbar ? (
    <div
      ref={toolbarRef}
      className="diagram-rubric-bar"
      data-diagram-toolbar
      data-diagram-toolbar-layout={toolbarInBoard ? 'rails' : 'bar'}
    >
      {viewportControls && (
        <div className="diagram-rubric-group" role="group" aria-label={t('diagram', 'viewportControls')}>
          <button
            type="button"
            className="diagram-rubric diagram-rubric--glyph"
            aria-label={t('diagram', 'zoomIn')}
            title={t('diagram', 'zoomInTitle')}
            onClick={() => commitCamera(zoomViewport(spec, bounds, 1.25))}
          >
            +
          </button>
          <button
            type="button"
            className="diagram-rubric diagram-rubric--glyph"
            aria-label={t('diagram', 'zoomOut')}
            title={t('diagram', 'zoomOutTitle')}
            onClick={() => commitCamera(zoomViewport(spec, bounds, 0.8))}
          >
            −
          </button>
          <button
            type="button"
            className="diagram-rubric"
            aria-label={t('diagram', 'fitView')}
            title={t('diagram', 'fitView')}
            onClick={() => fitAutoViewport()}
          >
            <span aria-hidden className="diagram-rubric__glyph">⌖</span>
            <span className="diagram-viewport-label">{t('diagram', 'fitView')}</span>
          </button>
          <button
            type="button"
            className="diagram-rubric diagram-viewport-secondary"
            disabled={missingItems.length === 0}
            aria-label={t('diagram', 'recoverViewLabel')}
            title={missingItems.length > 0
              ? t('diagram', 'recoverViewTitle', { n: missingItems.length })
              : t('diagram', 'recoverViewNone')}
            onClick={() => recoverVisibleViewport()}
          >
            {t('diagram', 'recoverView')}
          </button>
          <button
            type="button"
            className="diagram-rubric diagram-viewport-secondary"
            aria-label={t('diagram', 'homeViewLabel')}
            title={t('diagram', 'homeViewLabel')}
            onClick={() => resetToHome()}
          >
            {t('diagram', 'homeView')}
          </button>
        </div>
      )}
      {showStepControls && (
        <StepNavigator
          steps={spec.steps}
          scopeId={spec.componentId}
          compact
          className="ml-auto"
        />
      )}
    </div>
  ) : null;

  return (
    <figure
      ref={rendererRef}
      className={`relative m-0 flex ${minHeightClass} h-full w-full flex-col ${className ?? ''}`}
      data-diagram-renderer={DIAGRAM_RENDERER_ID}
      data-diagram-mode={mode}
      data-diagram-active-step={effectiveStepId}
      data-diagram-viewport-bounds={bounds.join(',')}
      data-diagram-layout={toolbarInBoard ? 'rails' : 'bar'}
      data-diagram-header-layout={headerLayout}
      style={{
        '--diagram-safe-top': `${viewportSafeArea.top}px`,
        '--diagram-safe-right': `${viewportSafeArea.right}px`,
        '--diagram-safe-bottom': `${viewportSafeArea.bottom}px`,
        '--diagram-safe-left': `${viewportSafeArea.left}px`,
        '--diagram-side-chrome': `${sideChromeWidth}px`,
        '--diagram-side-pad': `${sidePad}px`,
        '--diagram-panel-right': `${toolbarInBoard && showStepControls ? 52 : viewportSafeArea.right}px`,
      } as React.CSSProperties}
    >
      {/* Lámina: el tablero. El pie va debajo; la barra también, salvo en lámina
          pequeña, donde vuelve dentro como raíles laterales. */}
      <div ref={plateRef} className="relative min-h-0 w-full flex-1" data-diagram-plate>
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
          ariaLabel={`${spec.title}. ${t('common', 'interactiveDiagram')}.`}
          className={`relative w-full overflow-hidden ${roundedClass} font-diagram`}
          onBoundingBoxChange={(next) => {
            if (next.some((value, index) => Math.abs(value - bounds[index]) > 1e-7)) commitCamera(next);
          }}
          onInit={handleBoardInitAndReady}
          onUpdate={handleBoardUpdate}
        >
          {hasHeader && (
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
              {!showCaption && (
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
              )}
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
          {/* El editor pasa '' en la vista base: los paneles de paso muestran entonces el primero, como la página publicada. */}
          <DiagramKatexOverlay spec={spec} activeStepId={effectiveStepId || spec.steps[0]?.id} variables={liveSceneVariables} />
          {toolbarInBoard && toolbar}
        </MathBoard>
      </div>
      {showCaption && (
        <figcaption className="diagram-figure-caption font-diagram" data-diagram-caption>
          <span className="diagram-figure-caption__number">{t('diagram', 'figureNumber', { n: figureNumber })}</span>
          <span className="diagram-figure-caption__title">{spec.title}</span>
        </figcaption>
      )}
      {!toolbarInBoard && toolbar}
    </figure>
  );
};

export const DiagramRenderer: React.FC<DiagramRendererProps> = props => (
  <MathProviderBoundary>
    <DiagramRendererContent {...props} />
  </MathProviderBoundary>
);

DiagramRenderer.displayName = 'DiagramRenderer';

export default DiagramRenderer;
