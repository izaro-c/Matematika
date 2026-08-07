/**
 * Camera + chrome orchestration for DiagramRenderer.
 *
 * - Camera bounds (fit / home / persist) live here.
 * - Safe-area math is pure in {@link ./diagramSafeArea}; this hook only measures DOM.
 * - Label / panel anchors live in {@link ./diagramViewportAnchors}.
 */

import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { type DiagramBounds, type DiagramSpecV2 } from '@/diagrams/model';
import {
  computeAutoFitBounds,
  fitVisibleItemsAtStep,
  offscreenVisibleItemIds,
  resolveHomeViewport,
  resolveInitialCamera,
  normalizeViewportBounds,
  type ViewportChangeOptions,
} from '@/diagrams/geometry';
import {
  computeDiagramSafeAreas,
  DIAGRAM_CHROME,
  initialDiagramSafeAreas,
  sameInsets,
  type DiagramHeaderLayout,
  type DiagramInsets,
  type DiagramToolbarLayout,
} from '@/diagrams/render/interaction/diagramSafeArea';

export type {
  DiagramChromeMetrics,
  DiagramHeaderLayout,
  DiagramInsets,
  DiagramSafeAreaOptions,
  DiagramSafeAreas,
  DiagramToolbarLayout,
} from '@/diagrams/render/interaction/diagramSafeArea';
export {
  computeDiagramSafeAreas,
  DIAGRAM_CHROME,
  initialDiagramSafeAreas,
  preferSideHeader,
  sameInsets,
  sideChromeWidthPx,
} from '@/diagrams/render/interaction/diagramSafeArea';
export {
  renderedCoordinates,
  referencedLabelAnchor,
  viewportPanelAnchors,
  viewportPositionCoordinates,
  coordinatesToViewportPosition,
} from '@/diagrams/render/interaction/diagramViewportAnchors';

export interface UseDiagramViewportOptions {
  spec: DiagramSpecV2;
  mode?: 'runtime' | 'editor' | 'preview';
  effectiveStepId?: string;
  hasTopViewportPanel?: boolean;
  viewportControls?: boolean;
  showStepControls?: boolean;
  showToolbar?: boolean;
  hasHeader?: boolean;
  onViewportChange?: (bounds: DiagramBounds, options?: ViewportChangeOptions) => void;
  rendererRef: RefObject<HTMLDivElement | null>;
  headerRef: RefObject<HTMLElement | null>;
  toolbarRef: RefObject<HTMLDivElement | null>;
}

function measureVisibleHeaderContentBottom(
  root: DOMRect | undefined,
  header: HTMLElement | null,
  hasHeader = true,
): number {
  if (!hasHeader || !header) return 0;
  const children = [...(header.children ?? [])];
  const visible = children.filter(child => (
    child.tagName !== 'OUTPUT' || Boolean(child.querySelector('span:not(.invisible)'))
  ));
  if (root && visible.length > 0) {
    return Math.max(
      ...visible.map(child => child.getBoundingClientRect().bottom - root.top),
      0,
    );
  }
  return header.getBoundingClientRect().height;
}

function readSmUp(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(min-width: 640px)').matches;
}

export function useDiagramViewport({
  spec,
  mode = 'runtime',
  effectiveStepId,
  hasTopViewportPanel = false,
  viewportControls = true,
  showStepControls = false,
  showToolbar = true,
  hasHeader = true,
  onViewportChange,
  rendererRef,
  headerRef,
  toolbarRef,
}: UseDiagramViewportOptions) {
  const configuredBounds = useMemo(() => resolveInitialCamera(spec), [spec.viewport.bounds, spec.viewport.home]);
  const configuredBoundsKey = configuredBounds.join(',');
  const [cameraBounds, setCameraBounds] = useState<DiagramBounds>(configuredBounds);
  const lastConfiguredKeyRef = useRef(configuredBoundsKey);

  useEffect(() => {
    if (lastConfiguredKeyRef.current !== configuredBoundsKey) {
      lastConfiguredKeyRef.current = configuredBoundsKey;
      setCameraBounds(configuredBounds);
    }
  }, [configuredBounds, configuredBoundsKey]);

  const commitCamera = (next: DiagramBounds, options?: ViewportChangeOptions) => {
    const normalized = normalizeViewportBounds(next);
    if (!normalized) return;
    setCameraBounds(normalized);
    if (options?.persist || options?.persistHome) {
      onViewportChange?.(normalized, options);
    }
  };

  const fitAutoViewport = () => {
    const next = computeAutoFitBounds(spec, spec.viewport.padding);
    if (next) commitCamera(next, { persist: mode === 'editor' });
    return next;
  };

  const recoverVisibleViewport = () => {
    const next = fitVisibleItemsAtStep(spec, effectiveStepId, spec.viewport.padding);
    if (next) commitCamera(next);
    return next;
  };

  const resetToHome = () => {
    commitCamera(resolveHomeViewport(spec));
  };

  const missingItems = offscreenVisibleItemIds(spec, cameraBounds, effectiveStepId);

  const initialAreas = initialDiagramSafeAreas(showToolbar, hasHeader);
  const [safeArea, setSafeArea] = useState<DiagramInsets>(initialAreas.safeArea);
  const [viewportSafeArea, setViewportSafeArea] = useState<DiagramInsets>(initialAreas.viewportSafeArea);
  const [toolbarLayout, setToolbarLayout] = useState<DiagramToolbarLayout>('bar');
  const [headerLayout, setHeaderLayout] = useState<DiagramHeaderLayout>(initialAreas.headerLayout);
  const [sideChromeWidth, setSideChromeWidth] = useState(initialAreas.sideChromeWidth);
  const [sidePad, setSidePad] = useState(initialAreas.sidePad);
  const [viewportMenuOpen, setViewportMenuOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const updateSafeArea = () => {
      const root = rendererRef.current;
      const rootBounds = root?.getBoundingClientRect();
      const header = headerRef.current;
      const toolbar = toolbarRef.current;
      const next = computeDiagramSafeAreas(
        {
          rootWidth: rootBounds?.width ?? 0,
          rootHeight: rootBounds?.height ?? 0,
          visibleHeaderContentBottom: measureVisibleHeaderContentBottom(rootBounds, header, hasHeader),
          headerHeight: hasHeader ? (header?.getBoundingClientRect().height ?? DIAGRAM_CHROME.headerFallbackHeight) : 0,
          toolbarHeight: toolbar?.getBoundingClientRect().height
            ?? (showToolbar ? DIAGRAM_CHROME.toolbarFallbackHeight : 0),
          isSmUp: readSmUp(),
        },
        { showToolbar, showStepControls, viewportControls, hasTopViewportPanel, hasHeader },
      );
      setToolbarLayout(current => current === next.toolbarLayout ? current : next.toolbarLayout);
      setHeaderLayout(current => current === next.headerLayout ? current : next.headerLayout);
      setSideChromeWidth(current => current === next.sideChromeWidth ? current : next.sideChromeWidth);
      setSidePad(current => current === next.sidePad ? current : next.sidePad);
      setViewportSafeArea(current => sameInsets(current, next.viewportSafeArea) ? current : next.viewportSafeArea);
      setSafeArea(current => sameInsets(current, next.safeArea) ? current : next.safeArea);
    };

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => updateSafeArea());
    updateSafeArea();
    if (headerRef.current) resizeObserver?.observe(headerRef.current);
    if (toolbarRef.current) resizeObserver?.observe(toolbarRef.current);
    if (rendererRef.current) resizeObserver?.observe(rendererRef.current);

    const rendererNode = rendererRef.current;
    const mutationObserver = typeof MutationObserver === 'undefined' || !rendererNode
      ? null
      : new MutationObserver(updateSafeArea);
    if (rendererNode) mutationObserver?.observe(rendererNode, { childList: true, subtree: true });

    const frameId = typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function'
      ? window.requestAnimationFrame(() => updateSafeArea())
      : null;
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) updateSafeArea();
      }).catch(() => {
        // Ignore font loading errors
      });
    }

    return () => {
      cancelled = true;
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [effectiveStepId, hasHeader, hasTopViewportPanel, headerRef, rendererRef, showStepControls, showToolbar, spec.componentId, toolbarRef, viewportControls]);

  return {
    bounds: cameraBounds,
    configuredBounds,
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
  };
}
