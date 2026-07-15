import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MathBoard, type ThemeColors } from '../core/MathBoard';
import {
  createAngle,
  createAngleBisectorRay,
  createArc,
  createAreaDecomposition,
  createBaseExtensionToFoot,
  createCircle,
  createCongruenceMark,
  createDimensionLine,
  createFunctionCurve,
  createGlider,
  createGridOverlay,
  createLine,
  createMidpoint,
  createParallelLine,
  createParametricCurve,
  createPerpendicularFoot,
  createPerpendicularLine,
  createPoincareArc,
  createPoincareGeodesic,
  createPoint,
  createPolygon,
  createRay,
  createRightAngleMarker,
  createSegment,
  createSlider,
  createText,
} from '../core/MathFactory';
import { DiagramInfoPanel, DiagramTitle } from '@/shared/ui/DiagramOverlay';
import { renderKatexTextToHtml } from '@/shared/ui/KatexText';
import { StepNavigator } from '@/shared/ui/StepNavigator';
import { MathProviderBoundary, useMathStore } from '@/shared/lib/MathStoreContext';
import { useDiagramTargetRegistry } from '@/shared/lib/DiagramTargetRegistryContext';
import {
  DIAGRAM_RENDERER_ID,
  DEFAULT_ANGLE_RADIUS,
  DEFAULT_RIGHT_ANGLE_RADIUS,
  constrainPointCoordinates,
  createSceneConstructionPlan,
  createScenePlan,
  fitViewport,
  itemLayerNumber,
  offscreenItemIds,
  sceneRevision,
  withViewportBounds,
  zoomViewport,
  evaluateMathExpression,
  evaluateStepOverlayContent,
  type DiagramBounds,
  type DiagramColorToken,
  type DiagramElement,
  type DiagramSceneItem,
  type DiagramSpecV2,
} from '../spec';

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

function outsideBaseExtension(baseA: any, baseB: any, foot: any): boolean {
  if (!baseA || !baseB || !foot) return false;
  const dx = baseB.X() - baseA.X();
  const dy = baseB.Y() - baseA.Y();
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared < 1e-10) return false;
  const t = ((foot.X() - baseA.X()) * dx + (foot.Y() - baseA.Y()) * dy) / lengthSquared;
  return t < -0.001 || t > 1.001;
}

function refsFor(item: DiagramElement, elements: Record<string, any>): any[] {
  return item.refs.map(ref => elements[ref]).filter(Boolean);
}

function liveVariables(elements: Record<string, any>, spec: DiagramSpecV2): Record<string, number> {
  const variables: Record<string, number> = {};
  spec.points.forEach(point => {
    const element = elements[point.id];
    if (!element) return;
    variables[`${point.id}.x`] = element.X();
    variables[`${point.id}.y`] = element.Y();
  });
  spec.sliders.forEach(slider => {
    const element = elements[slider.id];
    variables[slider.id] = element?.Value?.() ?? slider.value;
  });
  spec.elements.forEach(item => {
    const element = elements[item.id];
    if (element?.X && element?.Y) {
      variables[`${item.id}.x`] = element.X();
      variables[`${item.id}.y`] = element.Y();
    }
    if (item.refs.length < 2) return;
    const a = elements[item.refs[0]];
    const b = elements[item.refs[1]];
    if (a?.Dist && b) variables[`${item.id}.length`] = a.Dist(b);
  });
  return variables;
}

function StepOverlayPanels({
  spec,
  activeStepId,
  variables,
}: {
  spec: DiagramSpecV2;
  activeStepId?: string;
  variables: Record<string, number>;
}) {
  const storeStep = useMathStore(state => state.variables?.[`step:${spec.componentId}`]);
  const stepId = activeStepId
    ?? ((typeof storeStep === 'string' ? storeStep.replace(`${spec.componentId}:`, '') : '') || spec.steps[0]?.id);
  const step = spec.steps.find(item => item.id === stepId);
  const overlays = Object.entries(step?.objectStates ?? {})
    .map(([objectId, state]) => ({ objectId, overlay: state.overlay }))
    .filter((entry): entry is { objectId: string; overlay: NonNullable<typeof entry.overlay> } => (
      Boolean(entry.overlay?.visible)
      && !headerReadingItems(spec).some(item => item.id === entry.objectId)
    ));
  if (overlays.length === 0) return null;
  const grouped = new Map<string, typeof overlays>();
  overlays.forEach(entry => {
    const position = entry.overlay.position ?? 'bottom-right';
    grouped.set(position, [...(grouped.get(position) ?? []), entry]);
  });
  return <>{[...grouped.entries()].map(([position, entries]) => (
    <DiagramInfoPanel key={position} title={step?.label ?? 'Información del paso'} position={position as 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'}>
      <div className="space-y-2" aria-live="polite">
        {entries.map(({ objectId, overlay }) => {
          return (
            <div key={objectId} data-step-overlay={objectId}>
              {overlay.title && <strong className="block">{overlay.title}</strong>}
              <span>{evaluateStepOverlayContent(overlay, variables)}</span>
            </div>
          );
        })}
      </div>
    </DiagramInfoPanel>
  ))}</>;
}

function evaluatedValue(item: DiagramElement, elements: Record<string, any>, spec: DiagramSpecV2): number | undefined {
  const expression = item.properties?.expression;
  try {
    if (expression) return evaluateMathExpression(expression, liveVariables(elements, spec));
    const refs = refsFor(item, elements);
    if (refs.length >= 2 && refs[0]?.Dist) return refs[0].Dist(refs[1]);
    return undefined;
  } catch {
    return undefined;
  }
}

function measurementText(item: DiagramElement, elements: Record<string, any>, spec: DiagramSpecV2): string {
  const value = evaluatedValue(item, elements, spec);
  if (value === undefined) return item.text || `${item.label}: valor no definido`;
  const precision = item.properties?.precision ?? 2;
  const unit = item.properties?.unit ? ` ${item.properties.unit}` : '';
  const content = `${value.toFixed(precision)}${unit}`;
  return (item.text || `${item.label}: {value}`).split('{value}').join(content);
}

function headerReadingItems(spec: DiagramSpecV2): DiagramElement[] {
  const dynamicPanels = spec.elements.filter(item => item.kind === 'infoPanel' && item.properties?.expression);
  if (dynamicPanels.length > 0) return dynamicPanels;
  return spec.elements
    .filter(item => (item.kind === 'measurement' || item.kind === 'dimensionLine') && (item.properties?.expression || item.refs.length >= 2))
    .slice(0, 4);
}

function headerReadingText(item: DiagramElement, variables: Record<string, number>): string | null {
  let value: number | undefined;
  try {
    if (item.properties?.expression) {
      value = evaluateMathExpression(item.properties.expression, variables);
    } else if (item.refs.length >= 2) {
      const [a, b] = item.refs;
      const ax = variables[`${a}.x`];
      const ay = variables[`${a}.y`];
      const bx = variables[`${b}.x`];
      const by = variables[`${b}.y`];
      if ([ax, ay, bx, by].every(Number.isFinite)) value = Math.hypot(bx - ax, by - ay);
    }
  } catch {
    return null;
  }
  if (value === undefined || !Number.isFinite(value)) return null;
  const precision = item.properties?.precision ?? 2;
  const unit = item.properties?.unit ? ` ${item.properties.unit}` : '';
  return (item.text || `${item.label}: {value}`).split('{value}').join(`${value.toFixed(precision)}${unit}`);
}

interface MovableCueLabel {
  label: string;
  color: DiagramColorToken;
}

function movableCueLabels(spec: DiagramSpecV2): MovableCueLabel[] {
  const labels = new Map<string, DiagramColorToken>();
  [
    ...spec.points.filter(point => !point.fixed && !point.locked && point.constraint !== 'derived'),
    ...spec.sliders.filter(slider => !slider.locked),
  ].forEach(item => {
    const label = item.label.trim();
    if (label && !labels.has(label)) labels.set(label, item.color);
  });
  return [...labels].map(([label, color]) => ({ label, color }))
    .sort((left, right) => right.label.length - left.label.length);
}

function cueLabelRanges(text: string, labels: readonly MovableCueLabel[]): Array<{ start: number; end: number; color: DiagramColorToken }> {
  const ranges: Array<{ start: number; end: number; color: DiagramColorToken }> = [];
  const isWordCharacter = (character: string | undefined) => Boolean(character && /[\p{L}\p{N}_]/u.test(character));

  labels.forEach(({ label, color }) => {
    let offset = 0;
    while (offset < text.length) {
      const start = text.indexOf(label, offset);
      if (start < 0) break;
      const end = start + label.length;
      const overlaps = ranges.some(range => start < range.end && end > range.start);
      if (!overlaps && !isWordCharacter(text[start - 1]) && !isWordCharacter(text[end])) {
        ranges.push({ start, end, color });
      }
      offset = end;
    }
  });

  return ranges.sort((left, right) => left.start - right.start);
}

function ExplorationCue({ children, labels }: { children: string; labels: readonly MovableCueLabel[] }) {
  const ranges = cueLabelRanges(children, labels);
  if (ranges.length === 0) return <>{children}</>;

  const fragments: React.ReactNode[] = [];
  let offset = 0;
  ranges.forEach(({ start, end, color }) => {
    if (start > offset) fragments.push(children.slice(offset, start));
    fragments.push(
      <strong
        key={`${start}-${end}`}
        className="font-semibold"
        style={{ color: `var(--theme-${color})` }}
        data-interactive-label={children.slice(start, end)}
        data-interactive-color={color}
      >
        {children.slice(start, end)}
      </strong>,
    );
    offset = end;
  });
  if (offset < children.length) fragments.push(children.slice(offset));
  return <>{fragments}</>;
}

function compactHeaderReadings(entries: Array<{ item: DiagramElement; text: string }>): Array<{ id: string; itemIds: string[]; text: string }> {
  const compacted: Array<{ id: string; itemIds: string[]; text: string }> = [];
  for (let index = 0; index < entries.length; index += 1) {
    const current = entries[index];
    const next = entries[index + 1];
    if (current.item.kind === 'dimensionLine' && next?.item.kind === 'dimensionLine') {
      const currentParts = current.text.split('=');
      const nextParts = next.text.split('=');
      const currentValue = currentParts.slice(1).join('=').trim();
      const nextValue = nextParts.slice(1).join('=').trim();
      if (currentValue && currentValue === nextValue) {
        compacted.push({
          id: `${current.item.id}-${next.item.id}`,
          itemIds: [current.item.id, next.item.id],
          text: `${currentParts[0].trim()} = ${nextParts[0].trim()} = ${currentValue}`,
        });
        index += 1;
        continue;
      }
    }
    compacted.push({ id: current.item.id, itemIds: [current.item.id], text: current.text });
  }
  return compacted;
}

function reactiveText(item: DiagramElement, elements: Record<string, any>, spec: DiagramSpecV2): string | undefined {
  const variables = liveVariables(elements, spec);
  const rule = item.properties?.textRules?.find(candidate => {
    try { return evaluateMathExpression(candidate.when, variables) !== 0; } catch { return false; }
  });
  return rule?.text;
}

function conditionAllows(item: DiagramSceneItem, elements: Record<string, any>, spec: DiagramSpecV2): boolean {
  if (!('kind' in item) || !item.properties?.visibleWhen) return true;
  try { return evaluateMathExpression(item.properties.visibleWhen, liveVariables(elements, spec)) !== 0; } catch { return false; }
}

function viewportPositionCoordinates(
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

function viewportPanelAnchors(position: [number, number]): { anchorX: 'left' | 'middle' | 'right'; anchorY: 'top' | 'middle' | 'bottom' } {
  const [x, y] = position;
  return {
    anchorX: x < 0.34 ? 'left' : x > 0.66 ? 'right' : 'middle',
    anchorY: y < 0.34 ? 'top' : y > 0.66 ? 'bottom' : 'middle',
  };
}

function createElement(
  board: any,
  elements: Record<string, any>,
  item: DiagramElement,
  theme: ThemeColors,
  layer: number,
  spec: DiagramSpecV2,
  liftedIntoHeader = false,
) {
  const refs = refsFor(item, elements);
  const hoverColor = item.style?.preserveColorOnHighlight ? theme[item.color] : theme.ocre;
  const lineOptions = {
    strokeColor: theme[item.color],
    highlightStrokeColor: hoverColor,
    strokeWidth: item.style?.strokeWidth ?? 2,
    strokeOpacity: item.style?.strokeOpacity ?? 1,
    dash: item.dashed ? 2 : 0,
    layer,
  };
  if (item.kind === 'segment') return refs.length >= 2 ? createSegment(board, [refs[0], refs[1]], lineOptions, theme) : null;
  if (item.kind === 'line') return refs.length >= 2 ? createLine(board, [refs[0], refs[1]], lineOptions, theme) : null;
  if (item.kind === 'ray') return refs.length >= 2 ? createRay(board, [refs[0], refs[1]], lineOptions, theme) : null;
  if (item.kind === 'polygon') return refs.length >= 3 ? createPolygon(board, refs, {
    fillColor: theme[item.color], highlightFillColor: hoverColor, fillOpacity: item.style?.fillOpacity ?? 0.1,
    borders: { strokeColor: theme[item.color], strokeWidth: item.style?.strokeWidth ?? 1.5, strokeOpacity: item.style?.strokeOpacity ?? 1, dash: item.dashed ? 2 : 0 }, layer,
  }, theme) : null;
  if (item.kind === 'circle') return refs.length >= 2 ? createCircle(board, [refs[0], refs[1]], {
    ...lineOptions, fillColor: theme[item.color], fillOpacity: item.style?.fillOpacity ?? 0,
  }, theme) : null;
  if (item.kind === 'arc') return refs.length >= 3 ? createArc(board, [refs[0], refs[1], refs[2]], lineOptions, theme) : null;
  if (item.kind === 'functionCurve' && item.properties?.expression) {
    const domain = item.properties.domain ?? [-5, 5];
    const parameter = item.properties.parameter ?? 'x';
    return createFunctionCurve(board, value => {
      try {
        return evaluateMathExpression(item.properties?.expression ?? '0', { ...liveVariables(elements, spec), [parameter]: value, x: value });
      } catch {
        return Number.NaN;
      }
    }, domain, lineOptions, theme);
  }
  if (item.kind === 'parametricCurve' && item.properties?.xExpression && item.properties.yExpression) {
    const domain = item.properties.domain ?? [0, Math.PI * 2];
    const parameter = item.properties.parameter ?? 't';
    const variables = (value: number) => ({ ...liveVariables(elements, spec), [parameter]: value, t: value });
    return createParametricCurve(
      board,
      value => {
        try { return evaluateMathExpression(item.properties?.xExpression ?? '0', variables(value)); } catch { return Number.NaN; }
      },
      value => {
        try { return evaluateMathExpression(item.properties?.yExpression ?? '0', variables(value)); } catch { return Number.NaN; }
      },
      domain,
      lineOptions,
      theme,
    );
  }
  if (item.kind === 'poincareGeodesic') return refs.length >= 4 ? createPoincareGeodesic(board, [refs[0], refs[1], refs[2], refs[3]], lineOptions, theme) : null;
  if (item.kind === 'poincareArc') return refs.length >= 4 ? createPoincareArc(board, [refs[0], refs[1], refs[2], refs[3]], lineOptions, theme) : null;
  if (item.kind === 'midpoint') return refs.length >= 2 ? createMidpoint(board, [refs[0], refs[1]], {
    name: renderKatexTextToHtml(item.label), fillColor: theme[item.color], strokeColor: theme[item.color],
    highlightFillColor: hoverColor, highlightStrokeColor: hoverColor,
    label: { highlightColor: hoverColor, highlightStrokeColor: hoverColor }, layer,
  }, theme) : null;
  if (item.kind === 'perpendicularFoot') return refs.length >= 3 ? createPerpendicularFoot(board, [refs[0], refs[1], refs[2]], {
    name: renderKatexTextToHtml(item.label), fillColor: theme[item.color], strokeColor: theme[item.color],
    highlightFillColor: hoverColor, highlightStrokeColor: hoverColor,
    label: { highlightColor: hoverColor, highlightStrokeColor: hoverColor }, layer,
  }, theme) : null;
  if (item.kind === 'baseExtension') return refs.length >= 3 ? createBaseExtensionToFoot(board, [refs[0], refs[1], refs[2]], lineOptions, theme) : null;
  if (item.kind === 'perpendicular') return refs.length >= 3 ? createPerpendicularLine(board, [refs[0], refs[1], refs[2]], lineOptions, theme) : null;
  if (item.kind === 'parallel') return refs.length >= 3 ? createParallelLine(board, [refs[0], refs[1], refs[2]], lineOptions, theme) : null;
  if (item.kind === 'angleBisector') return refs.length >= 3 ? createAngleBisectorRay(board, [refs[0], refs[1], refs[2]], lineOptions, theme) : null;
  if (item.kind === 'angle') return refs.length >= 3 ? createAngle(board, [refs[0], refs[1], refs[2]], {
    fillColor: theme[item.color], strokeColor: theme[item.color], radius: item.style?.angleRadius ?? DEFAULT_ANGLE_RADIUS, layer,
  }, theme) : null;
  if (item.kind === 'rightAngle') return refs.length >= 3 ? createRightAngleMarker(board, [refs[0], refs[1], refs[2]], {
    fillColor: theme[item.color], strokeColor: theme[item.color], size: item.style?.angleRadius ?? DEFAULT_RIGHT_ANGLE_RADIUS, layer,
  }, theme) : null;
  if (item.kind === 'perpendicularMark') return refs.length >= 3 ? createRightAngleMarker(board, [refs[0], refs[1], refs[2]], {
    fillColor: theme[item.color], strokeColor: theme[item.color], size: item.style?.angleRadius ?? DEFAULT_RIGHT_ANGLE_RADIUS, layer,
  }, theme) : null;
  if (item.kind === 'congruenceMark') return refs.length >= 2 ? createCongruenceMark(
    board,
    [refs[0], refs[1]],
    item.properties?.markCount ?? 1,
    lineOptions,
    theme,
  ) : null;
  if (item.kind === 'dimensionLine') return refs.length >= 2 ? createDimensionLine(
    board,
    [refs[0], refs[1]],
    () => liftedIntoHeader ? '' : measurementText(item, elements, spec),
    item.properties?.offset ?? 0.35,
    lineOptions,
    theme,
  ) : null;
  if (item.kind === 'grid') return refs.length >= 4 ? createGridOverlay(
    board,
    [refs[0], refs[1], refs[2], refs[3]],
    item.properties?.rows ?? 4,
    item.properties?.columns ?? 4,
    lineOptions,
    theme,
  ) : null;
  if (item.kind === 'areaDecomposition') return refs.length >= 3 ? createAreaDecomposition(
    board,
    refs,
    item.properties?.rows ?? 2,
    item.properties?.columns ?? 2,
    { fillColor: theme[item.color], fillOpacity: item.style?.fillOpacity ?? 0.1, borders: lineOptions, layer },
    theme,
  ) : null;
  const anchor = refs[0];
  const dynamicText = () => {
    const body = reactiveText(item, elements, spec) ?? (item.kind === 'measurement' || item.kind === 'dimensionLine' || item.properties?.expression
      ? measurementText(item, elements, spec)
      : item.text || item.label);
    return item.kind === 'infoPanel' && item.properties?.title
      ? `<strong>${renderKatexTextToHtml(item.properties.title)}</strong><br/>${renderKatexTextToHtml(body)}`
      : renderKatexTextToHtml(body);
  };
  const textOffset = item.style?.textOffset ?? [0.25, 0.35];
  const viewportPosition = item.kind === 'infoPanel' && item.properties?.anchorMode === 'viewport'
    ? item.properties.viewportPosition
    : undefined;
  const viewportPanelAnchor = viewportPosition ? viewportPanelAnchors(viewportPosition) : undefined;
  const textCoordinates: [() => number, () => number, () => string] | null = viewportPosition
    ? [
      () => viewportPositionCoordinates(board, viewportPosition, spec.viewport.bounds)[0],
      () => viewportPositionCoordinates(board, viewportPosition, spec.viewport.bounds)[1],
      dynamicText,
    ]
    : anchor
      ? [() => anchor.X() + textOffset[0], () => anchor.Y() + textOffset[1], dynamicText]
      : null;
  return textCoordinates ? createText(board, textCoordinates, {
    color: theme[item.color],
    layer,
    ...(viewportPanelAnchor ?? {}),
    cssClass: item.kind === 'formula'
      ? 'font-diagram text-sm italic'
      : item.kind === 'infoPanel'
        ? 'JXGtext matematika-info-panel'
        : 'font-diagram text-sm',
    ...(item.kind === 'infoPanel' ? {
      highlightCssClass: 'JXGtext matematika-info-panel',
      highlightStrokeColor: theme[item.color],
      highlightStrokeOpacity: 1,
    } : {}),
  }, theme) : null;
}

type KeyboardAdjustmentKey = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'Home' | 'End';

function attachSelection(
  element: any,
  item: DiagramSceneItem,
  mode: DiagramRendererProps['mode'],
  onSelectionChange?: (id: string) => void,
  onTargetHighlight?: (target: string | null) => void,
  onKeyboardAdjust?: (key: KeyboardAdjustmentKey, largeStep: boolean) => void,
) {
  if (!element) return;
  const node = element.rendNode as HTMLElement | undefined;
  node?.setAttribute('data-diagram-object-id', item.id);
  node?.setAttribute('aria-label', item.selection.ariaLabel ?? item.label);
  if (item.style?.preserveColorOnHighlight) node?.setAttribute('data-diagram-preserve-color', 'true');
  if (item.selection.role) node?.setAttribute('data-selection-role', item.selection.role);
  if (item.target) {
    const target = item.targetId ?? item.id;
    node?.setAttribute('tabindex', '0');
    node?.setAttribute('data-diagram-target', target);
    node?.addEventListener('mouseenter', () => onTargetHighlight?.(target));
    node?.addEventListener('mouseleave', () => onTargetHighlight?.(null));
    node?.addEventListener('focus', () => onTargetHighlight?.(target));
    node?.addEventListener('blur', () => onTargetHighlight?.(null));
  }
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
  if (mode !== 'editor' || !item.selection.selectable) return;
  node?.setAttribute('tabindex', '0');
  node?.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onSelectionChange?.(item.id);
  });
  element.on?.('down', () => onSelectionChange?.(item.id));
}

function nativeElementLabel(element: any): any | null {
  const label = element?.label;
  return label && label !== element && typeof label.setAttribute === 'function' ? label : null;
}

function attachLabelSelection(
  element: any,
  item: DiagramSceneItem,
  mode: DiagramRendererProps['mode'],
  onSelectionChange?: (id: string) => void,
  onTargetHighlight?: (target: string | null) => void,
) {
  const label = nativeElementLabel(element);
  if (!label) return;
  attachSelection(label, item, mode, onSelectionChange, onTargetHighlight);
  const node = label.rendNode as HTMLElement | undefined;
  node?.setAttribute('data-diagram-label-for', item.id);
  // The geometric object remains the single keyboard stop; its label mirrors
  // pointer interaction without duplicating the same control in the tab order.
  node?.removeAttribute('tabindex');
}

function synchronizeElementAndLabelHover(element: any, item: DiagramSceneItem) {
  const label = nativeElementLabel(element);
  if (!label) return;
  const labelNode = label.rendNode as HTMLElement | undefined;
  const pointLike = 'constraint' in item
    || ('kind' in item && (item.kind === 'midpoint' || item.kind === 'perpendicularFoot'));
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

function syncNativeElementLabel(
  element: any,
  state: { visible: boolean; color: string; highlightColor: string; opacity: number; text: string },
) {
  const label = nativeElementLabel(element);
  if (!label) return;
  label.setText?.(renderKatexTextToHtml(state.text));
  (label.rendNode as HTMLElement | undefined)?.style.setProperty('--diagram-label-highlight-color', state.highlightColor);
  label.setAttribute({
    visible: state.visible && state.text.trim().length > 0,
    color: state.color,
    strokeColor: state.color,
    highlightColor: state.highlightColor,
    highlightStrokeColor: state.highlightColor,
    opacity: state.opacity,
    strokeOpacity: state.opacity,
    highlightStrokeOpacity: state.opacity,
  });
}

function sameBounds(left: DiagramBounds, right: DiagramBounds): boolean {
  return left.every((value, index) => Math.abs(value - right[index]) <= 1e-8);
}

const DiagramRendererContent: React.FC<DiagramRendererProps> = ({
  spec,
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
  const targetRegistry = useDiagramTargetRegistry();
  const interactionCallbacksRef = useRef({ onSelectionChange, onPointMove, onCanvasPointCreate });
  useEffect(() => {
    interactionCallbacksRef.current = { onSelectionChange, onPointMove, onCanvasPointCreate };
  }, [onCanvasPointCreate, onPointMove, onSelectionChange]);
  const setVariable = useMathStore(state => state.setVariable);
  const setTargetHighlight = useCallback((target: string | null) => {
    setVariable('highlight', target ? `${spec.componentId}:${target}` : null);
  }, [setVariable, spec.componentId]);
  const scopedStoreStep = useMathStore(state => state.variables?.[`step:${spec.componentId}`]);
  const effectiveStepId = activeStepId
    ?? ((typeof scopedStoreStep === 'string' ? scopedStoreStep.replace(`${spec.componentId}:`, '') : '') || spec.steps[0]?.id);
  const [liveSceneVariables, setLiveSceneVariables] = useState<Record<string, number>>(() => {
    try { return liveVariables({}, spec); } catch { return {}; }
  });
  const liveVariablesSignature = useRef('');
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
  const revision = useMemo(() => sceneRevision(spec), [spec]);
  const registeredTargets = useMemo(() => [
    ...[...spec.points, ...spec.elements, ...spec.sliders]
      .filter(item => item.target)
      .map(item => ({ targetId: item.targetId ?? item.id, objectId: item.id, label: item.label, kind: 'object' as const })),
    ...spec.groups.filter(group => group.target)
      .map(group => ({ targetId: group.targetId ?? group.id, objectId: group.id, label: group.label, kind: 'object' as const })),
    ...spec.steps.map(step => ({ targetId: step.id, objectId: step.id, label: step.label, kind: 'step' as const })),
  ], [spec.elements, spec.points, spec.sliders, spec.steps]);

  useEffect(() => targetRegistry.register(spec.componentId, registeredTargets), [registeredTargets, spec.componentId, targetRegistry]);

  const commitBounds = (next: DiagramBounds) => {
    setViewportState({ base: spec.viewport.bounds, current: next });
    onViewportChange?.(next);
  };

  const liveViewportSpec: DiagramSpecV2 = {
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
  };
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
  const runtimeSpec = withViewportBounds(liveViewportSpec, bounds);
  const missingItems = offscreenItemIds(runtimeSpec, bounds).filter(id => viewportItemIdSet.has(id));
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
  const headerItemIds = useMemo(() => new Set(headerItems.map(item => item.id)), [headerItems]);
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
      void document.fonts.ready.then(() => {
        if (!cancelled) updateSafeArea();
      });
    }
    return () => {
      cancelled = true;
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [effectiveStepId, hasTopViewportPanel, showStepControls, showToolbar, spec.componentId, viewportControls]);

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
          onInit={(board, elements, theme) => {
          if (mode === 'editor') {
            board.on('down', (event: unknown) => {
              const createPointAt = interactionCallbacksRef.current.onCanvasPointCreate;
              if (!createPointAt) return;
              const objects = board.getAllObjectsUnderMouse?.(event);
              if (Array.isArray(objects) && objects.length > 0) return;
              const coordinates = board.getUsrCoordsOfMouse?.(event);
              if (Array.isArray(coordinates) && coordinates.length >= 2) createPointAt(coordinates[0], coordinates[1]);
            });
          }
          createSceneConstructionPlan(spec).forEach(entry => {
            const sceneItem = entry.item;
            const hoverColor = sceneItem.style?.preserveColorOnHighlight ? theme[sceneItem.color] : theme.ocre;
            const pointLabelOptions = {
              ...(sceneItem.style?.labelOffset ? { offset: sceneItem.style.labelOffset } : {}),
              highlightColor: hoverColor,
              highlightStrokeColor: hoverColor,
            };
            if ('constraint' in sceneItem) {
              const item = sceneItem.constraint === 'derived' && sceneItem.xExpression && sceneItem.yExpression
                ? createPoint(board, [
                  () => {
                    try { return evaluateMathExpression(sceneItem.xExpression ?? '0', liveVariables(elements, spec)); } catch { return sceneItem.x; }
                  },
                  () => {
                    try { return evaluateMathExpression(sceneItem.yExpression ?? '0', liveVariables(elements, spec)); } catch { return sceneItem.y; }
                  },
                ], {
                  name: renderKatexTextToHtml(sceneItem.label),
                  fixed: true,
                  ...(sceneItem.style?.pointSize !== undefined ? { size: sceneItem.style.pointSize } : {}),
                  fillColor: theme[sceneItem.color],
                  strokeColor: theme[sceneItem.color],
                  highlightFillColor: hoverColor,
                  highlightStrokeColor: hoverColor,
                  label: pointLabelOptions,
                  layer: itemLayerNumber(spec, sceneItem),
                }, theme)
                : sceneItem.constraint === 'glider' && sceneItem.gliderTarget
                ? createGlider(board, [sceneItem.x, sceneItem.y, elements[sceneItem.gliderTarget]], {
                  name: renderKatexTextToHtml(sceneItem.label),
                  fixed: sceneItem.fixed || entry.locked,
                  ...(sceneItem.style?.pointSize !== undefined ? { size: sceneItem.style.pointSize } : {}),
                  fillColor: theme[sceneItem.color],
                  strokeColor: theme[sceneItem.color],
                  highlightFillColor: hoverColor,
                  highlightStrokeColor: hoverColor,
                  label: pointLabelOptions,
                  layer: itemLayerNumber(spec, sceneItem),
                }, theme)
                : createPoint(board, [sceneItem.x, sceneItem.y], {
                  name: renderKatexTextToHtml(sceneItem.label),
                  fixed: sceneItem.fixed || entry.locked,
                  ...(sceneItem.style?.pointSize !== undefined ? { size: sceneItem.style.pointSize } : {}),
                  fillColor: theme[sceneItem.color],
                  strokeColor: theme[sceneItem.color],
                  highlightFillColor: hoverColor,
                  highlightStrokeColor: hoverColor,
                  label: pointLabelOptions,
                  layer: itemLayerNumber(spec, sceneItem),
                }, theme);
              elements[sceneItem.id] = item;
              if (!sceneItem.fixed && !entry.locked && sceneItem.constraint !== 'derived' && sceneItem.constraint !== 'glider') {
                let enforcing = false;
                item.on('drag', () => {
                  if (enforcing) return;
                  const liveSpec: DiagramSpecV2 = {
                    ...spec,
                    points: spec.points.map(point => elements[point.id]
                      ? { ...point, x: elements[point.id].X(), y: elements[point.id].Y() }
                      : point),
                    sliders: spec.sliders.map(slider => elements[slider.id]?.Value
                      ? { ...slider, value: elements[slider.id].Value() }
                      : slider),
                  };
                  const next = constrainPointCoordinates(liveSpec, sceneItem, { x: item.X(), y: item.Y() });
                  if (Math.abs(next.x - item.X()) > 1e-8 || Math.abs(next.y - item.Y()) > 1e-8) {
                    enforcing = true;
                    item.moveTo([next.x, next.y], 0);
                    enforcing = false;
                  }
                });
              }
              if (!sceneItem.fixed && !entry.locked && sceneItem.constraint !== 'derived') item.on('up', () => interactionCallbacksRef.current.onPointMove?.(sceneItem.id, item.X(), item.Y()));
            } else if ('kind' in sceneItem) {
              elements[sceneItem.id] = createElement(
                board,
                elements,
                sceneItem,
                theme,
                itemLayerNumber(spec, sceneItem),
                spec,
                mode === 'runtime' && allHeaderItemIds.has(sceneItem.id),
              );
            } else {
              elements[sceneItem.id] = createSlider(board, [[sceneItem.x, sceneItem.y], [sceneItem.x + 2.6, sceneItem.y]], [sceneItem.min, sceneItem.value, sceneItem.max], {
                name: renderKatexTextToHtml(sceneItem.label),
                snapWidth: sceneItem.step,
                fillColor: theme[sceneItem.color],
                strokeColor: theme[sceneItem.color],
                highlightFillColor: hoverColor,
                highlightStrokeColor: hoverColor,
                label: { highlightColor: hoverColor, highlightStrokeColor: hoverColor },
                fixed: entry.locked,
                layer: itemLayerNumber(spec, sceneItem),
              }, theme);
            }
            const element = elements[sceneItem.id];
            const keyboardAdjust = 'constraint' in sceneItem && !sceneItem.fixed && !entry.locked && sceneItem.constraint !== 'derived'
              ? (key: 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'Home' | 'End', largeStep: boolean) => {
                if (key === 'Home' || key === 'End') return;
                const step = (bounds[2] - bounds[0]) / (largeStep ? 20 : 100);
                const dx = key === 'ArrowLeft' ? -step : key === 'ArrowRight' ? step : 0;
                const dy = key === 'ArrowDown' ? -step : key === 'ArrowUp' ? step : 0;
                const requested = { x: element.X() + dx, y: element.Y() + dy };
                const liveSpec: DiagramSpecV2 = {
                  ...spec,
                  points: spec.points.map(point => elements[point.id]
                    ? { ...point, x: elements[point.id].X(), y: elements[point.id].Y() }
                    : point),
                  sliders: spec.sliders.map(slider => elements[slider.id]?.Value
                    ? { ...slider, value: elements[slider.id].Value() }
                    : slider),
                };
                const next = sceneItem.constraint === 'glider'
                  ? requested
                  : constrainPointCoordinates(liveSpec, sceneItem, requested);
                element.moveTo([next.x, next.y], 0);
                board.update();
                interactionCallbacksRef.current.onPointMove?.(sceneItem.id, element.X(), element.Y());
                const node = element.rendNode as HTMLElement | undefined;
                node?.setAttribute('aria-label', `${sceneItem.selection.ariaLabel ?? sceneItem.label}: x ${element.X().toFixed(2)}, y ${element.Y().toFixed(2)}`);
              }
              : 'min' in sceneItem && !entry.locked
                ? (key: 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'Home' | 'End', largeStep: boolean) => {
                  const delta = sceneItem.step * (largeStep ? 10 : 1);
                  const current = element.Value?.() ?? sceneItem.value;
                  const next = key === 'Home'
                    ? sceneItem.min
                    : key === 'End'
                      ? sceneItem.max
                      : Math.min(sceneItem.max, Math.max(sceneItem.min, current + (key === 'ArrowLeft' || key === 'ArrowDown' ? -delta : delta)));
                  element.setValue?.(next);
                  board.update();
                  const node = element.rendNode as HTMLElement | undefined;
                  node?.setAttribute('aria-valuenow', String(next));
                  node?.setAttribute('aria-label', `${sceneItem.selection.ariaLabel ?? sceneItem.label}: ${next}`);
                }
                : undefined;
            attachSelection(
              element,
              sceneItem,
              mode,
              id => interactionCallbacksRef.current.onSelectionChange?.(id),
              setTargetHighlight,
              keyboardAdjust,
            );
            attachLabelSelection(
              element,
              sceneItem,
              mode,
              id => interactionCallbacksRef.current.onSelectionChange?.(id),
              setTargetHighlight,
            );
            synchronizeElementAndLabelHover(element, sceneItem);
          });
        }}
          onUpdate={(_board, elements, theme, isStep, isHL) => {
          const storeStep = spec.steps.find(step => isStep(step.id))?.id;
          const effectiveStep = effectiveStepId || storeStep;
          const items = [...spec.points, ...spec.elements, ...spec.sliders];
          const effectiveHighlights = new Set([
            ...items.filter(item => highlightedIds.includes(item.id) || highlightedIds.includes(item.targetId ?? item.id)).map(item => item.id),
            ...items.filter(item => isHL(item.targetId ?? item.id)).map(item => item.id),
            ...spec.groups.filter(group => isHL(group.targetId ?? group.id)).map(group => group.id),
          ]);
          const plan = createScenePlan(spec, {
            activeStepId: effectiveStep,
            highlightedIds: [...effectiveHighlights],
            selectedIds,
          });
          const anyExternalEmphasis = plan.some(entry => entry.highlighted || entry.selected);
          plan.forEach(entry => {
            const item = entry.item;
            const element = elements[item.id];
            if (!element) return;
            const externalActive = entry.highlighted || entry.selected;
            const stepPrimary = entry.stepEmphasis === 'primary';
            const stepSecondary = entry.stepEmphasis === 'secondary';
            const active = externalActive || stepPrimary || stepSecondary;
            const opacity = externalActive || !anyExternalEmphasis ? 1 : 0.28;
            const color = externalActive && !item.style?.preserveColorOnHighlight
              ? theme.ocre
              : stepPrimary ? theme.terracota : stepSecondary ? theme.pavo : theme[item.color];
            // Authoring previews must always reveal the object being inspected,
            // even when the active step, its group or its base visibility hides it.
            // Runtime publication keeps the explicit highlightVisible contract.
            const sceneVisible = mode === 'editor' && externalActive
              ? true
              : entry.visible || (externalActive && item.style?.highlightVisible === true);
            const conditionVisible = mode === 'editor' && externalActive
              ? true
              : externalActive && item.style?.highlightVisible === true
              ? true
              : conditionAllows(item, elements, spec);
            const visible = sceneVisible && conditionVisible && (('kind' in item && item.kind === 'baseExtension')
              ? outsideBaseExtension(elements[item.refs[0]], elements[item.refs[1]], elements[item.refs[2]])
              : true);
            const base = { visible, fixed: entry.locked };
            const hoverColor = item.style?.preserveColorOnHighlight ? theme[item.color] : theme.ocre;
            syncNativeElementLabel(element, { visible, color, highlightColor: hoverColor, opacity, text: entry.label });
            if (element.__matematikaStepLabel !== entry.label) {
              element.setAttribute?.({ name: renderKatexTextToHtml(entry.label) });
              element.__matematikaStepLabel = entry.label;
            }
            if ('constraint' in item || ('kind' in item && (item.kind === 'midpoint' || item.kind === 'perpendicularFoot'))) {
              element.setAttribute({
                ...base,
                size: active ? item.style?.highlightPointSize ?? 7 : item.style?.pointSize ?? 4,
                fillColor: color, strokeColor: color, fillOpacity: opacity,
              });
            } else if ('min' in item) {
              if (entry.stepValue !== undefined && element.__matematikaStepValue !== entry.stepValue) {
                element.setValue?.(entry.stepValue);
                element.__matematikaStepValue = entry.stepValue;
              } else if (entry.stepValue === undefined && element.__matematikaStepValue !== undefined) {
                element.setValue?.(item.value);
                delete element.__matematikaStepValue;
              }
              element.setAttribute({ ...base, strokeColor: color, strokeOpacity: opacity });
            } else if (item.kind === 'polygon' || item.kind === 'areaDecomposition') {
              element.setAttribute({
                ...base, fillColor: color,
                fillOpacity: active ? item.style?.highlightFillOpacity ?? 0.24 : (item.style?.fillOpacity ?? 0.1) * opacity,
              });
            } else if (item.kind === 'angle' || item.kind === 'rightAngle' || item.kind === 'perpendicularMark') {
              element.setAttribute({
                ...base, fillColor: color, strokeColor: color,
                fillOpacity: active ? item.style?.highlightFillOpacity ?? 0.28 : (item.style?.fillOpacity ?? 0.1) * opacity,
                strokeWidth: active ? item.style?.highlightStrokeWidth ?? 3 : item.style?.strokeWidth ?? 1.5,
              });
            } else if (item.kind === 'text' || item.kind === 'label' || item.kind === 'formula' || item.kind === 'infoPanel' || item.kind === 'measurement') {
              const liftedIntoHeader = mode === 'runtime' && headerItemIds.has(item.id);
              element.setAttribute({ ...base, visible: base.visible && !liftedIntoHeader, color, opacity });
            } else if (item.kind === 'circle') {
              element.setAttribute({
                ...base,
                fillColor: theme[item.color],
                fillOpacity: (item.style?.fillOpacity ?? 0) * opacity,
                strokeColor: color,
                strokeOpacity: (item.style?.strokeOpacity ?? 1) * opacity,
                strokeWidth: externalActive
                  ? item.style?.highlightStrokeWidth ?? 3.6
                  : stepPrimary ? 3.2 : stepSecondary ? 2.6 : item.style?.strokeWidth ?? 2,
              });
            } else {
              element.setAttribute({
                ...base,
                strokeColor: color,
                strokeOpacity: (item.style?.strokeOpacity ?? 1) * opacity,
                strokeWidth: externalActive
                  ? item.style?.highlightStrokeWidth ?? 3.6
                  : stepPrimary ? 3.2 : stepSecondary ? 2.6 : item.style?.strokeWidth ?? 2,
              });
            }
          });
          const nextLiveVariables = liveVariables(elements, spec);
          const signature = JSON.stringify(nextLiveVariables);
          if (signature !== liveVariablesSignature.current) {
            liveVariablesSignature.current = signature;
            setLiveSceneVariables(nextLiveVariables);
          }
          }}
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
          <StepOverlayPanels spec={spec} activeStepId={effectiveStepId} variables={liveSceneVariables} />
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
