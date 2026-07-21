import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { DiagramPoint, DiagramSceneItem, DiagramSpecV2 } from '../spec';
import { useDiagramTargetRegistry } from '@/shared/lib/DiagramTargetRegistryContext';
import { useMathStore } from '@/shared/lib/MathStoreContext';

export type KeyboardAdjustmentKey = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'Home' | 'End';

export interface UseDiagramSelectionOptions {
  spec: DiagramSpecV2;
  mode?: 'runtime' | 'editor' | 'preview';
  onSelectionChange?: (id: string) => void;
  onPointMove?: (id: string, x: number, y: number) => void;
  onCanvasPointCreate?: (x: number, y: number) => void;
}

export function attachSelection(
  element: any,
  item: DiagramSceneItem,
  mode: UseDiagramSelectionOptions['mode'],
  onSelectionChange?: (id: string) => void,
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
  if (item.target) {
    const target = item.targetId ?? item.id;
    node?.setAttribute('data-diagram-target', target);
    node?.setAttribute('tabindex', '0');
    if (item.selection.highlightable !== false) {
      node?.addEventListener('mouseenter', () => onTargetHighlight?.(target));
      node?.addEventListener('mouseleave', () => onTargetHighlight?.(null));
      node?.addEventListener('focus', () => onTargetHighlight?.(target));
      node?.addEventListener('blur', () => onTargetHighlight?.(null));
    }
  }
  if (!item.selection.selectable) return;
  if (onKeyboardAdjust) {
    node?.setAttribute('tabindex', '0');
    node?.setAttribute('aria-keyshortcuts', 'ArrowLeft ArrowRight ArrowUp ArrowDown Home End');
    if ('min' in item) {
      node?.setAttribute('role', 'slider');
      node?.setAttribute('aria-valuemin', String(item.min));
      node?.setAttribute('aria-valuemax', String(item.max));
      node?.setAttribute('aria-valuenow', String(item.value));
    } else {
      node?.setAttribute('role', 'button');
      node?.setAttribute('aria-roledescription', 'punto móvil del diagrama');
    }
    node?.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      onKeyboardAdjust(event.key as KeyboardAdjustmentKey, event.shiftKey);
    });
  }
  if (mode !== 'editor') return;
  node?.setAttribute('tabindex', '0');
  node?.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onSelectionChange?.(item.id);
  });
  element.on?.('down', () => onSelectionChange?.(item.id));
}

export function nativeElementLabel(element: any): any | null {
  const label = element?.label;
  return label && label !== element && typeof label.setAttribute === 'function' ? label : null;
}

export function attachLabelSelection(
  element: any,
  item: DiagramSceneItem,
  mode: UseDiagramSelectionOptions['mode'],
  onSelectionChange?: (id: string) => void,
  onTargetHighlight?: (target: string | null) => void,
) {
  const label = nativeElementLabel(element);
  if (!label) return;
  attachSelection(label, item, mode, onSelectionChange, onTargetHighlight);
  const node = label.rendNode as HTMLElement | undefined;
  node?.setAttribute('data-diagram-label-for', item.id);
  node?.removeAttribute('tabindex');
}

export function synchronizeElementAndLabelHover(element: any, item: DiagramSceneItem) {
  if (item.selection.highlightable === false) return;
  const label = nativeElementLabel(element);
  if (!label) return;
  const labelNode = label.rendNode as HTMLElement | undefined;
  const pointLike = 'constraint' in item
    || ('kind' in item && (item.kind === 'intersection' || item.kind === 'midpoint' || item.kind === 'perpendicularFoot'));
  const highlightPair = () => {
    if (pointLike) element.setAttribute?.({ size: item.style?.highlightPointSize ?? 6 });
    element.highlight?.();
    label.highlight?.();
    labelNode?.classList.add('matematika-point-label--highlight');
    labelNode?.style.setProperty('transform', 'scale(1.12)', 'important');
  };
  const restorePair = () => {
    if (pointLike) element.setAttribute?.({ size: item.style?.pointSize ?? 4 });
    element.noHighlight?.();
    label.noHighlight?.();
    labelNode?.classList.remove('matematika-point-label--highlight');
    labelNode?.style.removeProperty('transform');
  };
  element.on?.('over', highlightPair);
  element.on?.('out', restorePair);
  label.on?.('over', highlightPair);
  label.on?.('out', restorePair);
}

export function releaseAuthoredAttraction(point: DiagramPoint, elements: Record<string, any>): boolean {
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

export function releaseInactiveAttractions(spec: DiagramSpecV2, elements: Record<string, any>, activePointId: string): boolean {
  return spec.points.reduce((released, point) => (
    point.id === activePointId ? released : releaseAuthoredAttraction(point, elements) || released
  ), false);
}

export function suspendInactiveAttractors(spec: DiagramSpecV2, elements: Record<string, any>, activePointId: string): () => void {
  const suspended = spec.points.flatMap(point => {
    const renderedPoint = elements[point.id];
    if (point.id === activePointId || !renderedPoint?.visProp) return [];
    const attractors = renderedPoint.visProp.attractors;
    renderedPoint.visProp.attractors = [];
    return [{ renderedPoint, attractors }];
  });
  return () => suspended.forEach(({ renderedPoint, attractors }) => {
    renderedPoint.visProp.attractors = attractors;
  });
}

export function useDiagramSelection({
  spec,
  onSelectionChange,
  onPointMove,
  onCanvasPointCreate,
}: UseDiagramSelectionOptions) {
  const targetRegistry = useDiagramTargetRegistry();
  const interactionCallbacksRef = useRef({ onSelectionChange, onPointMove, onCanvasPointCreate });
  const localTargetHighlightRef = useRef<string | null>(null);

  useEffect(() => {
    interactionCallbacksRef.current = { onSelectionChange, onPointMove, onCanvasPointCreate };
  }, [onCanvasPointCreate, onPointMove, onSelectionChange]);

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
  ], [spec.elements, spec.points, spec.sliders, spec.steps]);

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
