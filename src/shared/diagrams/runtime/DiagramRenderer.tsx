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
import { StepNavigator } from '@/shared/ui/StepNavigator';
import { MathProviderBoundary, useMathStore } from '@/shared/lib/MathStoreContext';
import { useDiagramTargetRegistry } from '@/shared/lib/DiagramTargetRegistryContext';
import {
  DIAGRAM_RENDERER_ID,
  constrainPointCoordinates,
  createSceneConstructionPlan,
  createScenePlan,
  fitViewport,
  itemLayerNumber,
  offscreenItemIds,
  recoverViewport,
  sceneRevision,
  withViewportBounds,
  zoomViewport,
  evaluateMathExpression,
  evaluateStepOverlayContent,
  type DiagramBounds,
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
  const storeStep = useMathStore(state => state.variables?.[`step:${spec.componentId}`] ?? state.variables?.['step']);
  const stepId = activeStepId ?? (typeof storeStep === 'string' ? storeStep.replace(`${spec.componentId}:`, '') : '');
  const step = spec.steps.find(item => item.id === stepId);
  const overlays = Object.entries(step?.objectStates ?? {})
    .map(([objectId, state]) => ({ objectId, overlay: state.overlay }))
    .filter((entry): entry is { objectId: string; overlay: NonNullable<typeof entry.overlay> } => Boolean(entry.overlay?.visible));
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

function createElement(board: any, elements: Record<string, any>, item: DiagramElement, theme: ThemeColors, layer: number, spec: DiagramSpecV2) {
  const refs = refsFor(item, elements);
  const lineOptions = {
    strokeColor: theme[item.color],
    strokeWidth: item.style?.strokeWidth ?? 2.4,
    strokeOpacity: item.style?.strokeOpacity ?? 1,
    dash: item.dashed ? 2 : 0,
    layer,
  };
  if (item.kind === 'segment') return refs.length >= 2 ? createSegment(board, [refs[0], refs[1]], lineOptions, theme) : null;
  if (item.kind === 'line') return refs.length >= 2 ? createLine(board, [refs[0], refs[1]], lineOptions, theme) : null;
  if (item.kind === 'ray') return refs.length >= 2 ? createRay(board, [refs[0], refs[1]], lineOptions, theme) : null;
  if (item.kind === 'polygon') return refs.length >= 3 ? createPolygon(board, refs, {
    fillColor: theme[item.color], fillOpacity: item.style?.fillOpacity ?? 0.16,
    borders: { strokeColor: theme[item.color], strokeWidth: item.style?.strokeWidth ?? 1.5, strokeOpacity: item.style?.strokeOpacity ?? 1 }, layer,
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
    name: item.label, fillColor: theme[item.color], strokeColor: theme[item.color], layer,
  }, theme) : null;
  if (item.kind === 'perpendicularFoot') return refs.length >= 3 ? createPerpendicularFoot(board, [refs[0], refs[1], refs[2]], {
    name: item.label, fillColor: theme[item.color], strokeColor: theme[item.color], layer,
  }, theme) : null;
  if (item.kind === 'baseExtension') return refs.length >= 3 ? createBaseExtensionToFoot(board, [refs[0], refs[1], refs[2]], lineOptions, theme) : null;
  if (item.kind === 'perpendicular') return refs.length >= 3 ? createPerpendicularLine(board, [refs[0], refs[1], refs[2]], lineOptions, theme) : null;
  if (item.kind === 'parallel') return refs.length >= 3 ? createParallelLine(board, [refs[0], refs[1], refs[2]], lineOptions, theme) : null;
  if (item.kind === 'angleBisector') return refs.length >= 3 ? createAngleBisectorRay(board, [refs[0], refs[1], refs[2]], lineOptions, theme) : null;
  if (item.kind === 'angle') return refs.length >= 3 ? createAngle(board, [refs[0], refs[1], refs[2]], {
    fillColor: theme[item.color], strokeColor: theme[item.color], radius: item.style?.angleRadius, layer,
  }, theme) : null;
  if (item.kind === 'rightAngle') return refs.length >= 3 ? createRightAngleMarker(board, [refs[0], refs[1], refs[2]], {
    fillColor: theme[item.color], strokeColor: theme[item.color], size: item.style?.angleRadius, layer,
  }, theme) : null;
  if (item.kind === 'perpendicularMark') return refs.length >= 3 ? createRightAngleMarker(board, [refs[0], refs[1], refs[2]], {
    fillColor: theme[item.color], strokeColor: theme[item.color], size: item.style?.angleRadius, layer,
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
    () => measurementText(item, elements, spec),
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
    { fillColor: theme[item.color], fillOpacity: item.style?.fillOpacity ?? 0.16, borders: lineOptions, layer },
    theme,
  ) : null;
  const anchor = refs[0];
  const dynamicText = () => {
    const body = reactiveText(item, elements, spec) ?? (item.kind === 'measurement' || item.kind === 'dimensionLine' || item.properties?.expression
      ? measurementText(item, elements, spec)
      : item.text || item.label);
    return item.kind === 'infoPanel' && item.properties?.title
      ? `<strong>${item.properties.title}</strong><br/>${body}`
      : body;
  };
  const textOffset = item.style?.textOffset ?? [0.25, 0.35];
  return anchor ? createText(board, [() => anchor.X() + textOffset[0], () => anchor.Y() + textOffset[1], dynamicText], {
    color: theme[item.color],
    layer,
    cssClass: item.kind === 'formula'
      ? 'font-serif text-sm italic'
      : item.kind === 'infoPanel'
        ? 'rounded border border-carbon/15 bg-lienzo/95 p-2 font-serif text-sm shadow-sm'
        : 'font-serif text-sm',
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
  node?.setAttribute('aria-label', item.selection.ariaLabel ?? item.label);
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
  const setVariable = useMathStore(state => state.setVariable);
  const setTargetHighlight = useCallback((target: string | null) => {
    setVariable('highlight', target ? `${spec.componentId}:${target}` : null);
  }, [setVariable, spec.componentId]);
  const [liveSceneVariables, setLiveSceneVariables] = useState<Record<string, number>>(() => {
    try { return liveVariables({}, spec); } catch { return {}; }
  });
  const liveVariablesSignature = useRef('');
  const [viewportState, setViewportState] = useState({
    base: spec.viewport.bounds,
    current: spec.viewport.bounds,
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

  const runtimeSpec = bounds === spec.viewport.bounds ? spec : withViewportBounds(spec, bounds);
  const missingItems = offscreenItemIds(runtimeSpec, bounds);

  return (
    <div
      className={`relative min-h-[360px] h-full w-full overflow-hidden rounded border border-carbon/10 bg-lienzo ${className ?? ''}`}
      data-diagram-renderer={DIAGRAM_RENDERER_ID}
      data-diagram-mode={mode}
    >
      <MathBoard
        scopeId={spec.componentId}
        boundingbox={bounds}
        axis={spec.axis}
        grid={spec.grid}
        pan
        zoom
        revision={revision}
        ariaLabel={`${spec.title}. Diagrama matemático interactivo.`}
        className="relative min-h-[360px] w-full overflow-hidden"
        onBoundingBoxChange={(next) => {
          if (next.some((value, index) => Math.abs(value - bounds[index]) > 1e-7)) commitBounds(next);
        }}
        onInit={(board, elements, theme) => {
          if (mode === 'editor' && onCanvasPointCreate) {
            board.on('down', (event: unknown) => {
              const objects = board.getAllObjectsUnderMouse?.(event);
              if (Array.isArray(objects) && objects.length > 0) return;
              const coordinates = board.getUsrCoordsOfMouse?.(event);
              if (Array.isArray(coordinates) && coordinates.length >= 2) onCanvasPointCreate(coordinates[0], coordinates[1]);
            });
          }
          createSceneConstructionPlan(spec).forEach(entry => {
            const sceneItem = entry.item;
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
                  name: sceneItem.label,
                  fixed: true,
                  ...(sceneItem.style?.pointSize !== undefined ? { size: sceneItem.style.pointSize } : {}),
                  fillColor: theme[sceneItem.color],
                  strokeColor: theme[sceneItem.color],
                  ...(sceneItem.style?.labelOffset ? { label: { offset: sceneItem.style.labelOffset } } : {}),
                  layer: itemLayerNumber(spec, sceneItem),
                }, theme)
                : sceneItem.constraint === 'glider' && sceneItem.gliderTarget
                ? createGlider(board, [sceneItem.x, sceneItem.y, elements[sceneItem.gliderTarget]], {
                  name: sceneItem.label,
                  fixed: sceneItem.fixed || entry.locked,
                  ...(sceneItem.style?.pointSize !== undefined ? { size: sceneItem.style.pointSize } : {}),
                  fillColor: theme[sceneItem.color],
                  strokeColor: theme[sceneItem.color],
                  ...(sceneItem.style?.labelOffset ? { label: { offset: sceneItem.style.labelOffset } } : {}),
                  layer: itemLayerNumber(spec, sceneItem),
                }, theme)
                : createPoint(board, [sceneItem.x, sceneItem.y], {
                  name: sceneItem.label,
                  fixed: sceneItem.fixed || entry.locked,
                  ...(sceneItem.style?.pointSize !== undefined ? { size: sceneItem.style.pointSize } : {}),
                  fillColor: theme[sceneItem.color],
                  strokeColor: theme[sceneItem.color],
                  ...(sceneItem.style?.labelOffset ? { label: { offset: sceneItem.style.labelOffset } } : {}),
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
              if (!sceneItem.fixed && !entry.locked && sceneItem.constraint !== 'derived') item.on('up', () => onPointMove?.(sceneItem.id, item.X(), item.Y()));
            } else if ('kind' in sceneItem) {
              elements[sceneItem.id] = createElement(board, elements, sceneItem, theme, itemLayerNumber(spec, sceneItem), spec);
            } else {
              elements[sceneItem.id] = createSlider(board, [[sceneItem.x, sceneItem.y], [sceneItem.x + 2.6, sceneItem.y]], [sceneItem.min, sceneItem.value, sceneItem.max], {
                name: sceneItem.label,
                snapWidth: sceneItem.step,
                fillColor: theme[sceneItem.color],
                strokeColor: theme[sceneItem.color],
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
                onPointMove?.(sceneItem.id, element.X(), element.Y());
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
            attachSelection(element, sceneItem, mode, onSelectionChange, setTargetHighlight, keyboardAdjust);
          });
        }}
        onUpdate={(_board, elements, theme, isStep, isHL) => {
          const storeStep = spec.steps.find(step => isStep(step.id))?.id;
          const effectiveStep = activeStepId || storeStep;
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
            const sceneVisible = entry.visible || (externalActive && item.style?.highlightVisible === true);
            const conditionVisible = externalActive && item.style?.highlightVisible === true
              ? true
              : conditionAllows(item, elements, spec);
            const visible = sceneVisible && conditionVisible && (('kind' in item && item.kind === 'baseExtension')
              ? outsideBaseExtension(elements[item.refs[0]], elements[item.refs[1]], elements[item.refs[2]])
              : true);
            const base = { visible, fixed: entry.locked };
            if (element.__matematikaStepLabel !== entry.label) {
              element.setAttribute?.({ name: entry.label });
              element.__matematikaStepLabel = entry.label;
            }
            if ('constraint' in item || ('kind' in item && (item.kind === 'midpoint' || item.kind === 'perpendicularFoot'))) {
              element.setAttribute({
                ...base,
                size: active ? item.style?.highlightPointSize ?? 8.5 : item.style?.pointSize ?? 5,
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
                fillOpacity: active ? item.style?.highlightFillOpacity ?? 0.34 : (item.style?.fillOpacity ?? 0.16) * opacity,
              });
            } else if (item.kind === 'angle' || item.kind === 'rightAngle' || item.kind === 'perpendicularMark') {
              element.setAttribute({
                ...base, fillColor: color, strokeColor: color,
                fillOpacity: active ? item.style?.highlightFillOpacity ?? 0.45 : (item.style?.fillOpacity ?? 0.18) * opacity,
                strokeWidth: active ? item.style?.highlightStrokeWidth ?? 3 : item.style?.strokeWidth ?? 1.5,
              });
            } else if (item.kind === 'text' || item.kind === 'label' || item.kind === 'formula' || item.kind === 'infoPanel' || item.kind === 'measurement') {
              element.setAttribute({ ...base, color, opacity });
            } else if (item.kind === 'circle') {
              element.setAttribute({
                ...base,
                fillColor: theme[item.color],
                fillOpacity: (item.style?.fillOpacity ?? 0) * opacity,
                strokeColor: color,
                strokeOpacity: (item.style?.strokeOpacity ?? 1) * opacity,
                strokeWidth: externalActive
                  ? item.style?.highlightStrokeWidth ?? 4.8
                  : stepPrimary ? 4 : stepSecondary ? 3.2 : item.style?.strokeWidth ?? 2.4,
              });
            } else {
              element.setAttribute({
                ...base,
                strokeColor: color,
                strokeOpacity: (item.style?.strokeOpacity ?? 1) * opacity,
                strokeWidth: externalActive
                  ? item.style?.highlightStrokeWidth ?? 4.8
                  : stepPrimary ? 4 : stepSecondary ? 3.2 : item.style?.strokeWidth ?? 2.4,
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
        <DiagramTitle>{spec.title}</DiagramTitle>
        {spec.note && (
          <DiagramInfoPanel title="Exploración" position="bottom-right" className={spec.steps.length > 0 ? 'mb-14' : ''}>
            <span>{spec.note}</span>
          </DiagramInfoPanel>
        )}
        <StepOverlayPanels spec={spec} activeStepId={activeStepId} variables={liveSceneVariables} />
      </MathBoard>

      {(stepControls ?? mode === 'runtime') && spec.steps.length > 0 && (
        <StepNavigator steps={spec.steps} scopeId={spec.componentId} compact className="absolute bottom-2 left-2 right-2 z-30" />
      )}

      {viewportControls && (
        <div className="absolute right-2 top-2 z-20 flex items-center gap-1 rounded border border-carbon/15 bg-lienzo/95 p-1 shadow-sm" aria-label="Controles del viewport">
          <button type="button" className="rounded px-2 py-1 text-xs font-bold text-carbon hover:bg-carbon/5" aria-label="Acercar" onClick={() => commitBounds(zoomViewport(spec, bounds, 1.25))}>+</button>
          <button type="button" className="rounded px-2 py-1 text-xs font-bold text-carbon hover:bg-carbon/5" aria-label="Alejar" onClick={() => commitBounds(zoomViewport(spec, bounds, 0.8))}>−</button>
          <button type="button" className="rounded px-2 py-1 text-[10px] font-bold text-carbon hover:bg-carbon/5" aria-label="Ajustar todos los objetos al viewport" onClick={() => commitBounds(fitViewport(spec))}>Ajustar</button>
          <button
            type="button"
            className="rounded px-2 py-1 text-[10px] font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40"
            disabled={missingItems.length === 0}
            aria-label="Recuperar objetos fuera del viewport"
            title={missingItems.length > 0 ? `${missingItems.length} objeto(s) fuera de vista` : 'No hay objetos fuera de vista'}
            onClick={() => commitBounds(recoverViewport(runtimeSpec, selectedIds))}
          >
            Recuperar
          </button>
        </div>
      )}
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
