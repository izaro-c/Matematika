import { useEffect, useState, type RefObject } from 'react';
import {
  createScenePlan,
  fitViewport,
  offscreenItemIds,
  type DiagramBounds,
  type DiagramSpecV2,
} from '../spec';

export function sameBounds(left: DiagramBounds, right: DiagramBounds): boolean {
  return left.length === right.length && left.every((val, index) => Math.abs(val - right[index]) <= 1e-7);
}

export interface UseDiagramViewportOptions {
  spec: DiagramSpecV2;
  mode?: 'runtime' | 'editor' | 'preview';
  effectiveStepId?: string;
  hasTopViewportPanel?: boolean;
  viewportControls?: boolean;
  showStepControls?: boolean;
  showToolbar?: boolean;
  onViewportChange?: (bounds: DiagramBounds) => void;
  rendererRef: RefObject<HTMLDivElement | null>;
  headerRef: RefObject<HTMLElement | null>;
  toolbarRef: RefObject<HTMLDivElement | null>;
}

export function renderedCoordinates(element: any, parameter?: number): [number, number] | null {
  if (!element || typeof element.X !== 'function' || typeof element.Y !== 'function') return null;
  try {
    const x = parameter === undefined ? element.X() : element.X(parameter);
    const y = parameter === undefined ? element.Y() : element.Y(parameter);
    return Number.isFinite(x) && Number.isFinite(y) ? [x, y] : null;
  } catch {
    return null;
  }
}

export function referencedLabelAnchor(
  referenceId: string,
  parameter: number,
  elements: Record<string, any>,
  spec: DiagramSpecV2,
): [number, number] {
  const referencedItem = [...spec.points, ...spec.elements, ...spec.sliders].find(item => item.id === referenceId);
  const rendered = elements[referenceId];
  if (!referencedItem || !('kind' in referencedItem)) return renderedCoordinates(rendered) ?? [0, 0];

  if (['poincareGeodesic', 'poincareArc', 'parametricCurve', 'functionCurve'].includes(referencedItem.kind)) {
    const domain = referencedItem.kind === 'poincareGeodesic' || referencedItem.kind === 'poincareArc'
      ? [0, 1]
      : referencedItem.properties?.domain ?? (referencedItem.kind === 'functionCurve' ? [-5, 5] : [0, Math.PI * 2]);
    const curveParameter = domain[0] + (domain[1] - domain[0]) * parameter;
    const curveCoordinates = renderedCoordinates(rendered, curveParameter);
    if (curveCoordinates) return curveCoordinates;
  }

  const referenceCoordinates = referencedItem.refs
    .map(id => renderedCoordinates(elements[id]))
    .filter((coordinates): coordinates is [number, number] => Boolean(coordinates));
  if (referencedItem.kind === 'circle' && referenceCoordinates.length >= 2) {
    const [center, boundary] = referenceCoordinates;
    const radius = Math.hypot(boundary[0] - center[0], boundary[1] - center[1]);
    const angle = Math.PI * 2 * parameter;
    return [center[0] + radius * Math.cos(angle), center[1] + radius * Math.sin(angle)];
  }
  if (['segment', 'line', 'ray'].includes(referencedItem.kind) && referenceCoordinates.length >= 2) {
    const [start, end] = referenceCoordinates;
    return [start[0] + (end[0] - start[0]) * parameter, start[1] + (end[1] - start[1]) * parameter];
  }
  if (['angle', 'nonReflexAngle', 'rightAngle', 'perpendicularMark'].includes(referencedItem.kind)) {
    const labelCoordinates = renderedCoordinates(rendered?.label);
    if (labelCoordinates) return labelCoordinates;

    if (referenceCoordinates.length >= 3) {
      const [pA, pO, pB] = referenceCoordinates;
      const a = Math.atan2(pA[1] - pO[1], pA[0] - pO[0]);
      const b = Math.atan2(pB[1] - pO[1], pB[0] - pO[0]);
      const diff = (b - a + 2 * Math.PI) % (2 * Math.PI);
      let midAngle = a + diff / 2;
      if (referencedItem.kind !== 'angle') {
        if (diff > Math.PI) midAngle += Math.PI;
      }
      const radius = (referencedItem.style?.angleRadius ?? 1) * 1.5;
      return [pO[0] + radius * Math.cos(midAngle), pO[1] + radius * Math.sin(midAngle)];
    }
  }

  if (referenceCoordinates.length > 0) {
    const total = referenceCoordinates.reduce(([x, y], coordinates) => [x + coordinates[0], y + coordinates[1]], [0, 0]);
    return [total[0] / referenceCoordinates.length, total[1] / referenceCoordinates.length];
  }
  return renderedCoordinates(rendered) ?? [0, 0];
}

export function viewportPositionCoordinates(
  board: any,
  position: [number, number],
  fallbackBounds: DiagramBounds,
): [number, number] {
  const [left, top, right, bottom] = board.getBoundingBox?.() ?? fallbackBounds;
  const width = board.__matematikaContainerSize?.width ?? board.canvasWidth ?? 1;
  const height = board.__matematikaContainerSize?.height ?? board.canvasHeight ?? 1;
  const safeArea = board.__matematikaViewportSafeArea ?? board.__matematikaSafeArea ?? {};
  const safeLeft = Math.max(0, safeArea.left ?? 0);
  const safeRight = Math.max(0, safeArea.right ?? 0);
  const safeTop = Math.max(0, safeArea.top ?? 0);
  const safeBottom = Math.max(0, safeArea.bottom ?? 0);
  const pixelX = safeLeft + Math.max(1, width - safeLeft - safeRight) * position[0];
  const pixelY = safeTop + Math.max(1, height - safeTop - safeBottom) * position[1];
  return [
    left + (right - left) * pixelX / width,
    top - (top - bottom) * pixelY / height,
  ];
}

export function viewportPanelAnchors(position: [number, number]): { anchorX: 'left' | 'middle' | 'right'; anchorY: 'top' | 'middle' | 'bottom' } {
  const [x, y] = position;
  return {
    anchorX: x < 0.34 ? 'left' : x > 0.66 ? 'right' : 'middle',
    anchorY: y < 0.34 ? 'top' : y > 0.66 ? 'bottom' : 'middle',
  };
}

export function useDiagramViewport({
  spec,
  mode = 'runtime',
  effectiveStepId,
  hasTopViewportPanel = false,
  viewportControls = true,
  showStepControls = false,
  showToolbar = true,
  onViewportChange,
  rendererRef,
  headerRef,
  toolbarRef,
}: UseDiagramViewportOptions) {
  const runtimeSequenceTargets = mode === 'runtime'
    ? [...new Set(spec.steps.flatMap(step => step.visibleTargets ?? []))]
    : [];
  const initialViewportBounds = runtimeSequenceTargets.length > 0
    ? fitViewport(spec, runtimeSequenceTargets, Math.min(spec.viewport.padding, 0.06))
    : spec.viewport.bounds;
  const [viewportState, setViewportState] = useState({
    base: spec.viewport.bounds,
    current: initialViewportBounds,
  });
  const bounds = sameBounds(viewportState.base, spec.viewport.bounds)
    ? viewportState.current
    : spec.viewport.bounds;

  const commitBounds = (next: DiagramBounds) => {
    setViewportState({ base: spec.viewport.bounds, current: next });
    onViewportChange?.(next);
  };

  const liveViewportSpec = spec;
  const viewportItemIds = runtimeSequenceTargets.length > 0
    ? runtimeSequenceTargets
    : createScenePlan(liveViewportSpec, { activeStepId: effectiveStepId })
      .filter(entry => entry.visible)
      .map(entry => entry.item.id);
  const viewportItemIdSet = new Set(viewportItemIds);
  const fitRelevantViewport = () => fitViewport(
    liveViewportSpec,
    viewportItemIds,
    Math.min(spec.viewport.padding, 0.06),
  );
  const runtimeSpec = {
    ...liveViewportSpec,
    viewport: { ...liveViewportSpec.viewport, bounds },
  };
  const missingItems = offscreenItemIds(runtimeSpec, bounds).filter(id => viewportItemIdSet.has(id));

  const [safeArea, setSafeArea] = useState({ top: 150, right: 20, bottom: showToolbar ? 68 : 20, left: 20 });
  const [viewportSafeArea, setViewportSafeArea] = useState({ top: 150, right: 20, bottom: showToolbar ? 68 : 20, left: 20 });
  const [toolbarLayout, setToolbarLayout] = useState<'bar' | 'rails'>('bar');
  const [viewportMenuOpen, setViewportMenuOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => updateSafeArea());
    const updateSafeArea = () => {
      const rootBounds = rendererRef.current?.getBoundingClientRect();
      const headerChildren = [...(headerRef.current?.children ?? [])];
      const visibleHeaderChildren = headerChildren.filter(child => (
        child.tagName !== 'OUTPUT' || Boolean(child.querySelector('span:not(.invisible)'))
      ));
      const visibleHeaderContentBottom = rootBounds && visibleHeaderChildren.length > 0
        ? Math.max(
          ...visibleHeaderChildren.map(child => child.getBoundingClientRect().bottom - rootBounds.top),
          0,
        )
        : headerRef.current?.getBoundingClientRect().height ?? 130;
      const viewportHeaderBottom = Math.ceil(visibleHeaderContentBottom) + 10;
      const stableHeaderBottom = Math.ceil(headerRef.current?.getBoundingClientRect().height ?? 130) + 10;
      const bottom = Math.ceil(toolbarRef.current?.getBoundingClientRect().height ?? (showToolbar ? 56 : 0)) + (showToolbar ? 8 : 20);
      const useRails = Boolean(showToolbar && rootBounds && (rootBounds.width < 480 || rootBounds.height < 400));
      const headerInset = typeof window !== 'undefined'
        && typeof window.matchMedia === 'function'
        && window.matchMedia('(min-width: 640px)').matches ? 32 : 20;
      setToolbarLayout(current => current === (useRails ? 'rails' : 'bar') ? current : (useRails ? 'rails' : 'bar'));
      const viewportArea = {
        top: viewportHeaderBottom,
        right: headerInset,
        bottom: useRails ? 16 : bottom,
        left: headerInset,
      };
      const geometryBaseArea = useRails
        ? {
          top: stableHeaderBottom + (hasTopViewportPanel ? 84 : 0),
          right: showStepControls ? 52 : 16,
          bottom: 16,
          left: viewportControls ? 52 : 16,
        }
        : { ...viewportArea, top: stableHeaderBottom + (hasTopViewportPanel ? 84 : 0) };
      const geometryArea = geometryBaseArea;
      const sameArea = (current: typeof geometryArea, next: typeof geometryArea) => (
        current.top === next.top && current.right === next.right && current.bottom === next.bottom && current.left === next.left
      );
      setViewportSafeArea(current => sameArea(current, viewportArea) ? current : viewportArea);
      setSafeArea(current => sameArea(current, geometryArea) ? current : geometryArea);
    };
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
  }, [effectiveStepId, hasTopViewportPanel, headerRef, rendererRef, showStepControls, showToolbar, spec.componentId, toolbarRef, viewportControls]);

  return {
    bounds,
    commitBounds,
    fitRelevantViewport,
    missingItems,
    safeArea,
    viewportSafeArea,
    toolbarLayout,
    viewportMenuOpen,
    setViewportMenuOpen,
  };
}
