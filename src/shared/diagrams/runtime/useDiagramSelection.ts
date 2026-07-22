import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { DiagramPoint, DiagramSceneItem, DiagramSpecV2 } from '../spec';
import { useDiagramTargetRegistry } from '@/shared/lib/DiagramTargetRegistryContext';
import { useMathStore } from '@/shared/lib/MathStoreContext';
import type { DiagramHoverController } from './diagramHover';
import type { JxgElementAdapter, JxgElementMap } from './jsxgraphAdapter';

export type KeyboardAdjustmentKey = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'Home' | 'End';
export interface DiagramAnnotationPlacement {
  textOffset?: [number, number];
  viewportPosition?: [number, number];
}

export interface DiagramSelectionIntent {
  additive: boolean;
}

export interface UseDiagramSelectionOptions {
  spec: DiagramSpecV2;
  mode?: 'runtime' | 'editor' | 'preview';
  onSelectionChange?: (id: string, intent?: DiagramSelectionIntent) => void;
  onPointMove?: (id: string, x: number, y: number) => void;
  onSliderChange?: (id: string, value: number) => void;
  onAnnotationMove?: (id: string, placement: DiagramAnnotationPlacement) => void;
  onCanvasPointCreate?: (x: number, y: number) => void;
}

const handledPointerSelections = new WeakSet<object>();
let lastPointerSelectionAt = 0;

export function diagramPointerSelectionWasHandled(event: unknown): boolean {
  return Date.now() - lastPointerSelectionAt < 120
    || (typeof event === 'object' && event !== null && handledPointerSelections.has(event));
}

function attachTargetInteraction(
  node: HTMLElement | undefined,
  item: DiagramSceneItem,
  onTargetHighlight?: (target: string | null) => void,
): void {
  if (!node || !item.target) return;
  const target = item.targetId ?? item.id;
  node.setAttribute('data-diagram-target', target);
  node.setAttribute('tabindex', '0');
  if (item.selection.highlightable === false) return;
  node.addEventListener('mouseenter', () => onTargetHighlight?.(target));
  node.addEventListener('mouseleave', () => onTargetHighlight?.(null));
  node.addEventListener('focus', () => onTargetHighlight?.(target));
  node.addEventListener('blur', () => onTargetHighlight?.(null));
}

function attachKeyboardAdjustment(
  node: HTMLElement | undefined,
  item: DiagramSceneItem,
  onKeyboardAdjust?: (key: KeyboardAdjustmentKey, largeStep: boolean) => void,
): void {
  if (!node || !onKeyboardAdjust) return;
  node.setAttribute('tabindex', '0');
  node.setAttribute('aria-keyshortcuts', 'ArrowLeft ArrowRight ArrowUp ArrowDown Home End');
  if ('min' in item) {
    node.setAttribute('role', 'slider');
    node.setAttribute('aria-valuemin', String(item.min));
    node.setAttribute('aria-valuemax', String(item.max));
    node.setAttribute('aria-valuenow', String(item.value));
  } else {
    node.setAttribute('role', 'button');
    node.setAttribute('aria-roledescription', 'punto móvil del diagrama');
  }
  node.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    onKeyboardAdjust(event.key as KeyboardAdjustmentKey, event.shiftKey);
  });
}

export function attachSelection(
  element: JxgElementAdapter | undefined,
  item: DiagramSceneItem,
  mode: UseDiagramSelectionOptions['mode'],
  onSelectionChange?: (id: string, intent?: DiagramSelectionIntent) => void,
  onTargetHighlight?: (target: string | null) => void,
  onKeyboardAdjust?: (key: KeyboardAdjustmentKey, largeStep: boolean) => void,
) {
  if (!element) return;
  const node = element.rendNode as HTMLElement | undefined;
  node?.setAttribute('data-diagram-object-id', item.id);
  node?.setAttribute('data-diagram-highlightable', String(item.selection.highlightable !== false));
  node?.setAttribute('aria-label', item.selection.ariaLabel ?? item.label);
  if (item.style?.preserveColorOnHighlight) node?.setAttribute('data-diagram-preserve-color', 'true');
  if (item.selection.role) node?.setAttribute('data-selection-role', item.selection.role);
  attachTargetInteraction(node, item, onTargetHighlight);
  if (!item.selection.selectable) return;
  attachKeyboardAdjustment(node, item, onKeyboardAdjust);
  if (mode !== 'editor') return;
  node?.setAttribute('tabindex', '0');
  node?.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onSelectionChange?.(item.id, { additive: event.shiftKey });
  });
  const selectObject = (event?: Event) => onSelectionChange?.(item.id, { additive: Boolean(event && 'shiftKey' in event && event.shiftKey) });
  const directlyManipulable = 'constraint' in item
    || 'min' in item
    || ('kind' in item && ['text', 'label', 'formula', 'infoPanel', 'measurement'].includes(item.kind));
  const selectFromPointer = (event: Event) => {
    handledPointerSelections.add(event);
    lastPointerSelectionAt = Date.now();
    selectObject(event);
  };
  // Los objetos compuestos de JSXGraph (polígonos, ángulos y algunas marcas)
  // no siempre propagan su `down` sintético desde el nodo SVG que recibe el
  // puntero. El evento DOM garantiza la selección al primer contacto; el
  // evento de JSXGraph conserva el hit-test ampliado de rectas y curvas.
  if (node) {
    node.style.pointerEvents = 'all';
    node.style.cursor = 'pointer';
    if (directlyManipulable) node.addEventListener('pointerdown', selectFromPointer);
  }
  const borderNodes = (element.borders ?? [])
    .map(border => border.rendNode as HTMLElement | undefined)
    .filter((candidate): candidate is HTMLElement => Boolean(candidate));
  borderNodes.forEach(borderNode => {
    borderNode.setAttribute('data-diagram-part-of', item.id);
    borderNode.style.pointerEvents = 'all';
    borderNode.style.cursor = 'pointer';
  });
  element.on?.('down', event => {
    if (event && diagramPointerSelectionWasHandled(event)) return;
    selectObject(event);
  });
}

export function nativeElementLabel(element: JxgElementAdapter | undefined): JxgElementAdapter | null {
  const label = element?.label;
  return label && label !== element && typeof label.setAttribute === 'function' ? label : null;
}

export function attachLabelSelection(
  element: JxgElementAdapter | undefined,
  item: DiagramSceneItem,
  mode: UseDiagramSelectionOptions['mode'],
  onSelectionChange?: (id: string, intent?: DiagramSelectionIntent) => void,
  onTargetHighlight?: (target: string | null) => void,
) {
  const label = nativeElementLabel(element);
  if (!label) return;
  attachSelection(label, item, mode, onSelectionChange, onTargetHighlight);
  const node = label.rendNode as HTMLElement | undefined;
  node?.setAttribute('data-diagram-label-for', item.id);
  node?.removeAttribute('data-diagram-object-id');
  node?.removeAttribute('tabindex');
}

export function attachDiagramHoverHandlers(
  element: JxgElementAdapter | undefined,
  item: DiagramSceneItem,
  hover: DiagramHoverController,
  requestSceneUpdate: () => void,
) {
  if (!element || item.selection.highlightable === false) return;
  const label = nativeElementLabel(element);
  const activate = () => hover.setHovered(item.id, true, requestSceneUpdate);
  const deactivate = () => hover.setHovered(item.id, false, requestSceneUpdate);
  element.on?.('over', activate);
  element.on?.('out', deactivate);
  label?.on?.('over', activate);
  label?.on?.('out', deactivate);
}

export function releaseAuthoredAttraction(point: DiagramPoint, elements: JxgElementMap): boolean {
  const renderedPoint = elements[point.id];
  if (!renderedPoint || typeof renderedPoint.popSlideObject !== 'function') return false;
  const authoredAttractors = (point.attractorIds ?? []).map(id => elements[id]).filter(Boolean);
  if (authoredAttractors.length === 0) return false;
  let released = false;
  let remaining = authoredAttractors.length + 1;
  while (remaining > 0 && renderedPoint.slideObject && authoredAttractors.includes(renderedPoint.slideObject)) {
    renderedPoint.popSlideObject();
    released = true;
    remaining -= 1;
  }
  return released;
}

export function releaseInactiveAttractions(spec: DiagramSpecV2, elements: JxgElementMap, activePointId: string): boolean {
  return spec.points.reduce((released, point) => (
    point.id === activePointId ? released : releaseAuthoredAttraction(point, elements) || released
  ), false);
}

export function suspendInactiveAttractors(spec: DiagramSpecV2, elements: JxgElementMap, activePointId: string): () => void {
  const suspended = spec.points.flatMap(point => {
    const renderedPoint = elements[point.id];
    if (point.id === activePointId || !renderedPoint?.visProp) return [];
    const visualProperties = renderedPoint.visProp;
    const attractors = visualProperties.attractors;
    visualProperties.attractors = [];
    return [{ visualProperties, attractors }];
  });
  return () => suspended.forEach(({ visualProperties, attractors }) => {
    visualProperties.attractors = attractors;
  });
}

export function useDiagramSelection({
  spec,
  onSelectionChange,
  onPointMove,
  onSliderChange,
  onAnnotationMove,
  onCanvasPointCreate,
}: UseDiagramSelectionOptions) {
  const targetRegistry = useDiagramTargetRegistry();
  const interactionCallbacksRef = useRef({ onSelectionChange, onPointMove, onSliderChange, onAnnotationMove, onCanvasPointCreate });
  const localTargetHighlightRef = useRef<string | null>(null);

  useEffect(() => {
    interactionCallbacksRef.current = { onSelectionChange, onPointMove, onSliderChange, onAnnotationMove, onCanvasPointCreate };
  }, [onAnnotationMove, onCanvasPointCreate, onPointMove, onSelectionChange, onSliderChange]);

  const setVariable = useMathStore(state => state.setVariable);

  const setTargetHighlight = useCallback((target: string | null) => {
    localTargetHighlightRef.current = target;
    setVariable('highlight', target ? `${spec.componentId}:${target}` : null);
  }, [setVariable, spec.componentId]);

  const registeredTargets = useMemo(() => [
    ...[...spec.points, ...spec.elements, ...spec.sliders]
      .filter(item => item.target)
      .map(item => ({ targetId: item.targetId ?? item.id, objectId: item.id, label: item.label, kind: 'object' as const })),
    ...spec.groups.filter(group => group.target)
      .map(group => ({ targetId: group.targetId ?? group.id, objectId: group.id, label: group.label, kind: 'object' as const })),
    ...spec.steps.map(step => ({ targetId: step.id, objectId: step.id, label: step.label, kind: 'step' as const })),
  ], [spec.elements, spec.groups, spec.points, spec.sliders, spec.steps]);

  useEffect(() => {
    targetRegistry.register(spec.componentId, registeredTargets);
  }, [registeredTargets, spec.componentId, targetRegistry]);

  return {
    targetRegistry,
    interactionCallbacksRef,
    localTargetHighlightRef,
    setTargetHighlight,
  };
}
