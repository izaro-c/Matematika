/** Duration aligned with `--diagram-visual-transition` in editorial-content.css. */
export const DIAGRAM_HOVER_TRANSITION_MS = 250;

const LINE_TRANSITION_PROPERTIES = [
  'fill',
  'fill-opacity',
  'stroke',
  'stroke-opacity',
  'stroke-width',
  'opacity',
  'rx',
  'ry',
  'r',
] as const;

const POINT_TRANSITION_PROPERTIES = [
  ...LINE_TRANSITION_PROPERTIES,
  'width',
  'height',
] as const;

export const diagramLineHoverTransition = {
  transitionDuration: DIAGRAM_HOVER_TRANSITION_MS,
  transitionProperties: [...LINE_TRANSITION_PROPERTIES],
};

export const diagramPointHoverTransition = {
  transitionDuration: DIAGRAM_HOVER_TRANSITION_MS,
  transitionProperties: [...POINT_TRANSITION_PROPERTIES],
};

/** Disable JSXGraph native highlight(); Matematika owns visual state. */
export const diagramNativeHighlightDisabled = { highlight: false } as const;

export function withDiagramHoverTransition<T extends Record<string, unknown>>(
  options: T,
  kind: 'line' | 'point' = 'line',
): T {
  const transition = kind === 'point' ? diagramPointHoverTransition : diagramLineHoverTransition;
  return { ...diagramNativeHighlightDisabled, ...transition, ...options };
}

export interface DiagramHoverController {
  isHovered: (id: string) => boolean;
  setHovered: (id: string, hovered: boolean, requestUpdate: () => void) => void;
  clearAll: (requestUpdate: () => void) => void;
}

export function createDiagramHoverController(): DiagramHoverController {
  const hoveredIds = new Set<string>();

  return {
    isHovered: (id: string) => hoveredIds.has(id),
    setHovered: (id: string, hovered: boolean, requestUpdate: () => void) => {
      const wasHovered = hoveredIds.has(id);
      if (hovered) {
        if (wasHovered) return;
        hoveredIds.add(id);
      } else {
        if (!wasHovered) return;
        hoveredIds.delete(id);
      }
      requestUpdate();
    },
    clearAll: (requestUpdate: () => void) => {
      if (hoveredIds.size === 0) return;
      hoveredIds.clear();
      requestUpdate();
    },
  };
}

export function diagramVisualTransitionKey(state: {
  hoverActive: boolean;
  externalActive: boolean;
  stepPrimary: boolean;
  stepSecondary: boolean;
  visible: boolean;
  dimmed: boolean;
}): string {
  return `${state.hoverActive}|${state.externalActive}|${state.stepPrimary}|${state.stepSecondary}|${state.visible}|${state.dimmed}`;
}

export function shouldAnimateDiagramVisuals(
  element: { __matematikaTransitionKey?: string } | undefined,
  transitionKey: string,
  pulseVisualsOnly: boolean,
): boolean {
  if (!element || pulseVisualsOnly) return false;
  const previousKey = element.__matematikaTransitionKey;
  if (previousKey === undefined || previousKey === transitionKey) return false;

  const parseTransitionKey = (key: string) => {
    const [hover, external, stepP, stepS, visible, dimmed] = key.split('|');
    return { hover, external, stepP, stepS, visible, dimmed };
  };
  const prev = parseTransitionKey(previousKey);
  const next = parseTransitionKey(transitionKey);
  return prev.external === next.external
    && prev.stepP === next.stepP
    && prev.stepS === next.stepS
    && prev.visible === next.visible
    && prev.dimmed === next.dimmed
    && prev.hover !== next.hover;
}

export interface DiagramAnimatedVisuals {
  size?: number;
  strokeWidth?: number;
  strokeOpacity?: number;
  fillOpacity?: number;
  strokeColor?: string;
  fillColor?: string;
  radius?: number;
  fontSize?: number;
  opacity?: number;
}

type DiagramVisualElement = {
  setAttribute?: (attrs: Record<string, unknown>) => void;
  fullUpdate?: () => unknown;
  borders?: DiagramVisualElement[];
  __matematikaDisplayed?: boolean;
  __matematikaVisualSignature?: string;
};

const HIDE_TIMERS = new WeakMap<DiagramVisualElement, ReturnType<typeof setTimeout>>();

const GEOMETRY_ATTR_KEYS = new Set([
  'radius',
  'ticksDistance',
  'majorHeight',
  'minorHeight',
  'dash',
  'fixed',
  'name',
  'fillColor',
  'strokeColor',
  'color',
  'borders',
]);

function clearScheduledHide(element: DiagramVisualElement) {
  const timer = HIDE_TIMERS.get(element);
  if (timer === undefined) return;
  clearTimeout(timer);
  HIDE_TIMERS.delete(element);
}

function scheduleHide(element: DiagramVisualElement) {
  clearScheduledHide(element);
  HIDE_TIMERS.set(element, setTimeout(() => {
    element.setAttribute?.({ visible: false });
    element.__matematikaDisplayed = false;
    HIDE_TIMERS.delete(element);
  }, DIAGRAM_HOVER_TRANSITION_MS + 24));
}

function buildAnimateHash(animated: DiagramAnimatedVisuals): Record<string, unknown> {
  const animateHash: Record<string, unknown> = {};
  if (animated.size !== undefined) animateHash.size = animated.size;
  if (animated.strokeWidth !== undefined) animateHash.strokeWidth = animated.strokeWidth;
  if (animated.strokeOpacity !== undefined) animateHash.strokeOpacity = animated.strokeOpacity;
  if (animated.fillOpacity !== undefined) animateHash.fillOpacity = animated.fillOpacity;
  if (animated.strokeColor !== undefined) animateHash.strokeColor = animated.strokeColor;
  if (animated.fillColor !== undefined) animateHash.fillColor = animated.fillColor;
  if (animated.opacity !== undefined) animateHash.opacity = animated.opacity;
  return animateHash;
}

function fadedVisualHash(animated: DiagramAnimatedVisuals): Record<string, unknown> {
  const hash = buildAnimateHash(animated);
  if (hash.strokeOpacity !== undefined) hash.strokeOpacity = 0;
  if (hash.fillOpacity !== undefined) hash.fillOpacity = 0;
  if (hash.opacity !== undefined) hash.opacity = 0;
  return hash;
}

function buildVisualSignature(
  staticAttrs: Record<string, unknown>,
  animated: DiagramAnimatedVisuals,
  borderAnimated: DiagramAnimatedVisuals | undefined,
  wantsVisible: boolean,
): string {
  return JSON.stringify({ staticAttrs, animated, borderAnimated, wantsVisible });
}

function needsGeometryUpdate(
  staticAttrs: Record<string, unknown>,
  animated: DiagramAnimatedVisuals,
): boolean {
  if (animated.radius !== undefined) return true;
  return Object.keys(staticAttrs).some(key => GEOMETRY_ATTR_KEYS.has(key));
}

function applyBorderVisuals(
  element: DiagramVisualElement,
  borderAnimated: DiagramAnimatedVisuals | undefined,
) {
  if (!borderAnimated) return;
  const borderHash: Record<string, unknown> = {};
  if (borderAnimated.strokeWidth !== undefined) borderHash.strokeWidth = borderAnimated.strokeWidth;
  if (borderAnimated.strokeOpacity !== undefined) borderHash.strokeOpacity = borderAnimated.strokeOpacity;
  if (borderAnimated.strokeColor !== undefined) borderHash.strokeColor = borderAnimated.strokeColor;
  if (Object.keys(borderHash).length === 0) return;
  element.borders?.forEach(border => border.setAttribute?.(borderHash));
}

export function commitElementVisuals(
  element: DiagramVisualElement | undefined,
  staticAttrs: Record<string, unknown>,
  animated: DiagramAnimatedVisuals,
  shouldAnimate: boolean,
  borderAnimated?: DiagramAnimatedVisuals,
) {
  if (!element) return;

  const wantsVisible = staticAttrs.visible !== false;
  const wasDisplayed = element.__matematikaDisplayed === true;
  const animateHash = buildAnimateHash(animated);
  const directAttrs: Record<string, unknown> = { ...staticAttrs };
  if (animated.radius !== undefined) directAttrs.radius = animated.radius;
  if (animated.fontSize !== undefined) directAttrs.fontSize = animated.fontSize;

  const signature = buildVisualSignature(staticAttrs, animated, borderAnimated, wantsVisible);
  if (!shouldAnimate && element.__matematikaVisualSignature === signature) return;

  if (wantsVisible) clearScheduledHide(element);

  if (!wantsVisible && wasDisplayed) {
    if (shouldAnimate) {
      element.setAttribute?.({
        ...directAttrs,
        visible: true,
        ...fadedVisualHash(animated),
      });
      applyBorderVisuals(element, {
        strokeWidth: borderAnimated?.strokeWidth,
        strokeOpacity: 0,
        strokeColor: borderAnimated?.strokeColor,
      });
      scheduleHide(element);
      element.__matematikaVisualSignature = signature;
      return;
    }
    element.setAttribute?.({ ...directAttrs, ...animateHash, visible: false });
    element.__matematikaDisplayed = false;
    element.__matematikaVisualSignature = signature;
    return;
  }

  if (wantsVisible && !wasDisplayed && shouldAnimate) {
    element.setAttribute?.({
      ...directAttrs,
      visible: true,
      ...fadedVisualHash(animated),
    });
    applyBorderVisuals(element, {
      strokeWidth: borderAnimated?.strokeWidth,
      strokeOpacity: 0,
      strokeColor: borderAnimated?.strokeColor,
    });
    element.__matematikaDisplayed = true;
    element.__matematikaVisualSignature = signature;
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(() => {
        element.setAttribute?.({ ...directAttrs, ...animateHash });
        applyBorderVisuals(element, borderAnimated);
      });
    } else {
      element.setAttribute?.({ ...directAttrs, ...animateHash });
      applyBorderVisuals(element, borderAnimated);
    }
    return;
  }

  const merged = { ...directAttrs, ...animateHash };
  element.setAttribute?.(merged);
  applyBorderVisuals(element, borderAnimated);
  if (needsGeometryUpdate(staticAttrs, animated)) element.fullUpdate?.();
  if (wantsVisible) element.__matematikaDisplayed = true;
  element.__matematikaVisualSignature = signature;
}
