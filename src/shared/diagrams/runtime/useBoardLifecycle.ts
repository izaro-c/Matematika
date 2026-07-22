import { useEffect, useLayoutEffect, useRef, type MutableRefObject } from 'react';
import JXG from 'jsxgraph';
import type { ThemeColors } from '../core/MathBoard';
import {
  createAngle,
  createAngleBisectorRay,
  createArc,
  createAreaDecomposition,
  createAreaIntersectionComposite,
  createAreaIntersectionFills,
  type AreaIntersectionComposite,
  createBaseExtensionToFoot,
  createCircle,
  createCongruenceMark,
  createDimensionLine,
  createFunctionCurve,
  createGlider,
  createGridOverlay,
  createHalfPlaneFill,
  createIntersection,
  createLine,
  createMidpoint,
  createNonReflexAngle,
  createParallelMark,
  createParallelLine,
  createParametricCurve,
  createCurveAreaComposite,
  createCurveAreaFills,
  type CurveAreaComposite,
  updateSampledCurve,
  updateStaticAreaPolygon,
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
  createTicks,
} from '../core/MathFactory';
import { renderKatexTextToHtml } from '@/shared/ui/KatexText';
import {
  DEFAULT_ANGLE_RADIUS,
  DEFAULT_RIGHT_ANGLE_RADIUS,
  createSceneConstructionPlan,
  createScenePlan,
  itemLayerNumber,
  withMovedPoint,
  evaluateMathExpression,
  type DiagramBounds,
  type DiagramElement,
  type DiagramSpecV2,
  resolveAreaDisplayPolygon,
  resolveAreaDisplayPolygons,
  type AreaPointResolver,
  curveActsAsArea,
  resolveCurveAreaPolygons,
  resolvePointCoordinates,
  sampleCurveElement,
} from '../spec';
import {
  attachLabelSelection,
  attachSelection,
  attachDiagramHoverHandlers,
  diagramPointerSelectionWasHandled,
  releaseAuthoredAttraction,
  releaseInactiveAttractions,
  suspendInactiveAttractors,
} from './useDiagramSelection';
import type { DiagramAnnotationPlacement, DiagramSelectionIntent } from './useDiagramSelection';
import {
  annotationTextHtml,
  conditionAllows,
  intersectionBelongsToSupports,
  liveVariables,
  measurementText,
  outsideBaseExtension,
  reactiveText,
  refsFor,
  sliderMaximum,
  tickDistance,
} from './diagramRuntimeUtils';
import {
  referencedLabelAnchor,
  viewportPanelAnchors,
  viewportPositionCoordinates,
} from './useDiagramViewport';
import {
  buildLineEmphasisAttributes,
  buildMarkEmphasisAttributes,
  buildPolygonEmphasisAttributes,
  createStepEmphasisAnimation,
  resolveStepEmphasisFillOpacity,
  resolveStepEmphasisAngleRadius,
  resolveStepEmphasisFontSize,
  resolveStepEmphasisPointFillOpacity,
  resolveStepEmphasisPointSize,
  resolveStepEmphasisSceneOpacity,
  resolveStepEmphasisTickHeights,
  syncMarkLayoutEmphasis,
  type StepEmphasisVisualState,
} from './stepEmphasisAnimation';
import {
  commitElementVisuals,
  createDiagramHoverController,
  diagramVisualTransitionKey,
  shouldAnimateDiagramVisuals,
  withDiagramHoverTransition,
  type DiagramHoverController,
} from './diagramHover';

export {
  conditionAllows,
  intersectionBelongsToSupports,
  liveVariables,
  outsideBaseExtension,
  refsFor,
  sliderMaximum,
  tickDistance,
};

function createLiveAreaPointResolver(
  elements: Record<string, any>,
): AreaPointResolver {
  return (model, id) => {
    const live = elements[id];
    if (live && typeof live.X === 'function') return { x: live.X(), y: live.Y() };
    const point = model.points.find(candidate => candidate.id === id);
    return point ? { x: point.x, y: point.y } : undefined;
  };
}

function resolveBoardViewportBounds(
  board: JXG.Board,
  fallbackBounds: [number, number, number, number],
): [number, number, number, number] {
  const bbox = board.getBoundingBox?.();
  if (bbox && bbox.length >= 4) return [bbox[0], bbox[1], bbox[2], bbox[3]];
  return fallbackBounds;
}

function applyRenderedStackLayer(element: any, layer: number) {
  if (!element?.setAttribute) return;
  if (element.__matematikaCurveArea) {
    element.__matematikaCurveArea.fills.forEach((fill: { setAttribute?: (attrs: { layer: number }) => void }) => {
      applyRenderedStackLayer(fill, layer);
    });
    applyRenderedStackLayer(element.__matematikaCurveArea.curve, layer + 1);
    return;
  }
  element.setAttribute({ layer });
  element.label?.setAttribute?.({ layer: layer + 1 });
  if (Array.isArray(element.borders)) {
    element.borders.forEach((border: { setAttribute?: (attrs: { layer: number }) => void }) => border?.setAttribute?.({ layer }));
  }
  ['point1', 'point2', 'center', 'arc', 'sector', 'ticks'].forEach(key => {
    const child = element[key];
    if (child?.setAttribute) child.setAttribute({ layer });
    if (Array.isArray(child)) child.forEach((item: { setAttribute?: (attrs: { layer: number }) => void }) => item?.setAttribute?.({ layer }));
  });
  if (Array.isArray(element.vertices)) {
    element.vertices.forEach((vertex: { setAttribute?: (attrs: { layer: number }) => void }) => vertex?.setAttribute?.({ layer }));
  }
  if (Array.isArray(element.elements)) {
    element.elements.forEach((child: { setAttribute?: (attrs: { layer: number }) => void }) => applyRenderedStackLayer(child, layer));
  }
}

function curveAreaSidePoint(
  spec: DiagramSpecV2,
  item: DiagramElement,
  elements: Record<string, any>,
): ReturnType<typeof resolvePointCoordinates> {
  const sideRef = item.refs.find(ref => Boolean(ref));
  if (!sideRef) return undefined;
  const live = elements[sideRef];
  if (live && typeof live.X === 'function') return { x: live.X(), y: live.Y() };
  return resolvePointCoordinates(spec, sideRef);
}

function resolveCurveAreaBounds(board: JXG.Board, spec: DiagramSpecV2): DiagramBounds {
  const bbox = board.getBoundingBox?.();
  if (bbox && bbox.length >= 4) {
    const [xMin, yMax, xMax, yMin] = bbox;
    if (xMax > xMin && yMax > yMin) return [xMin, yMax, xMax, yMin];
  }
  return spec.viewport.bounds;
}

function curveAreaUpdateSignature(
  spec: DiagramSpecV2,
  item: DiagramElement,
  elements: Record<string, any>,
  board: JXG.Board,
  variables: Record<string, number>,
): string {
  const side = curveAreaSidePoint(spec, item, elements);
  return JSON.stringify({
    side,
    bounds: resolveCurveAreaBounds(board, spec),
    variables,
    areaFill: item.properties?.areaFill,
    domain: item.properties?.domain,
    samples: item.properties?.samples,
    expression: item.properties?.expression,
    xExpression: item.properties?.xExpression,
    yExpression: item.properties?.yExpression,
    refs: item.refs,
  });
}

function updateCurveAreaFills(
  composite: CurveAreaComposite,
  spec: DiagramSpecV2,
  item: DiagramElement,
  elements: Record<string, any>,
  board: JXG.Board,
  variables: Record<string, number>,
): void {
  const areaState = composite.__matematikaCurveArea;
  if (!areaState) return;
  const signature = curveAreaUpdateSignature(spec, item, elements, board, variables);
  if (areaState.lastAreaSignature === signature) return;
  const polygons = resolveCurveAreaPolygons(
    item,
    sampleCurveElement(item, variables),
    curveAreaSidePoint(spec, item, elements),
    resolveCurveAreaBounds(board, spec),
    variables,
  );
  areaState.fills.forEach((fill, index) => {
    const polygon = polygons[index];
    if (polygon && polygon.length >= 3) updateStaticAreaPolygon(fill, polygon);
  });
  areaState.lastAreaSignature = signature;
}

function updateAreaIntersectionFills(
  composite: AreaIntersectionComposite,
  spec: DiagramSpecV2,
  item: DiagramElement,
  elements: Record<string, any>,
  board: JXG.Board,
): void {
  const areaState = composite.__matematikaAreaIntersection;
  if (!areaState) return;
  const liveResolver = createLiveAreaPointResolver(elements);
  const bounds = resolveCurveAreaBounds(board, spec);
  const signature = JSON.stringify({
    bounds,
    refs: item.refs,
    elements: spec.elements.map(element => ({
      id: element.id,
      kind: element.kind,
      refs: element.refs,
      properties: element.properties,
    })),
    points: spec.points.map(point => ({ id: point.id, x: point.x, y: point.y })),
    sliders: spec.sliders.map(slider => ({ id: slider.id, value: slider.value })),
  });
  if (areaState.lastSignature === signature) return;
  const polygons = resolveAreaDisplayPolygons(
    { ...spec, viewport: { ...spec.viewport, bounds } },
    item,
    liveResolver,
  );
  areaState.fills.forEach((fill, index) => {
    const polygon = polygons[index];
    if (polygon && polygon.length >= 3) updateStaticAreaPolygon(fill, polygon);
  });
  areaState.lastSignature = signature;
}

function createCurveAreaElement(
  board: JXG.Board,
  elements: Record<string, any>,
  item: DiagramElement,
  spec: DiagramSpecV2,
  curve: JXG.Curve,
  fillOptions: Record<string, unknown>,
  theme: ThemeColors,
) {
  const resolveArea = () => {
    const side = curveAreaSidePoint(spec, item, elements);
    const variables = liveVariables(elements, spec);
    const samples = sampleCurveElement(item, variables);
    return resolveCurveAreaPolygons(
      item,
      samples,
      side,
      resolveCurveAreaBounds(board, spec),
      variables,
    );
  };
  const fills = createCurveAreaFills(board, resolveArea, fillOptions, theme);
  return createCurveAreaComposite(fills, curve);
}

export function calculateLineLabelAnchor(element: any, t: number): any {
  if (!element.point1 || !element.point2) {
    return new JXG.Coords(JXG.COORDS_BY_USER, [0, 0], element.board);
  }

  const x1 = element.point1.X();
  const y1 = element.point1.Y();
  const x2 = element.point2.X();
  const y2 = element.point2.Y();

  let tEffective = t;

  if (element.elType === 'line' && element.board) {
    const margin = 20;
    const board = element.board;
    const cTL = new JXG.Coords(JXG.COORDS_BY_SCREEN, [margin, margin], board);
    const cBR = new JXG.Coords(
      JXG.COORDS_BY_SCREEN,
      [Math.max(margin, board.canvasWidth - margin), Math.max(margin, board.canvasHeight - margin)],
      board,
    );

    const minX = Math.min(cTL.usrCoords[1], cBR.usrCoords[1]);
    const maxX = Math.max(cTL.usrCoords[1], cBR.usrCoords[1]);
    const minY = Math.min(cTL.usrCoords[2], cBR.usrCoords[2]);
    const maxY = Math.max(cTL.usrCoords[2], cBR.usrCoords[2]);

    const dx = x2 - x1;
    const dy = y2 - y1;

    let tMin = -Infinity;
    let tMax = Infinity;

    if (Math.abs(dx) > 1e-9) {
      const t1 = (minX - x1) / dx;
      const t2 = (maxX - x1) / dx;
      tMin = Math.max(tMin, Math.min(t1, t2));
      tMax = Math.min(tMax, Math.max(t1, t2));
    }

    if (Math.abs(dy) > 1e-9) {
      const t1 = (minY - y1) / dy;
      const t2 = (maxY - y1) / dy;
      tMin = Math.max(tMin, Math.min(t1, t2));
      tMax = Math.min(tMax, Math.max(t1, t2));
    }

    if (isFinite(tMin) && isFinite(tMax)) {
      tEffective = tMin + t * (tMax - tMin);
    }
  }

  const x = x1 + tEffective * (x2 - x1);
  const y = y1 + tEffective * (y2 - y1);
  return new JXG.Coords(JXG.COORDS_BY_USER, [x, y], element.board);
}

export function nativeElementLabel(element: any): any | null {
  const label = element?.label;
  return label && label !== element && typeof label.setAttribute === 'function' ? label : null;
}

export function syncNativeElementLabel(
  element: any,
  state: { visible: boolean; color: string; highlightColor: string; opacity: number; text: string; fontSize?: number; labelPosition?: string | number; offset?: [number, number]; highlighted?: boolean },
) {
  const label = nativeElementLabel(element);
  if (!label) return;
  const previousCompassPosition = typeof element.__matematikaLabelPosition === 'string'
    ? element.__matematikaLabelPosition
    : undefined;
  const compassPosition = typeof state.labelPosition === 'string'
    ? state.labelPosition
    : state.labelPosition === undefined && previousCompassPosition
      ? 'urt'
      : undefined;
  const labelSignature = JSON.stringify({
    visible: state.visible && state.text.trim().length > 0,
    color: state.color,
    highlightColor: state.highlightColor,
    opacity: state.opacity,
    text: state.text,
    fontSize: state.fontSize,
    labelPosition: state.labelPosition,
    offset: state.offset,
    compassPosition,
    highlighted: Boolean(state.highlighted),
  });
  if (element.__matematikaLabelSignature === labelSignature) return;
  element.__matematikaLabelSignature = labelSignature;

  label.setText?.(renderKatexTextToHtml(state.text));
  const labelNode = label.rendNode as HTMLElement | undefined;
  labelNode?.style.setProperty('--diagram-label-highlight-color', state.highlightColor);
  if (state.highlighted) {
    labelNode?.classList.add('matematika-point-label--highlight');
  } else {
    labelNode?.classList.remove('matematika-point-label--highlight');
  }
  if (state.fontSize !== undefined) {
    (label.rendNode as HTMLElement | undefined)?.style.setProperty('font-size', `${state.fontSize}px`);
  }

  label.setAttribute({
    visible: state.visible && state.text.trim().length > 0,
    color: state.color,
    strokeColor: state.color,
    highlightStrokeColor: state.highlightColor,
    opacity: state.opacity,
    strokeOpacity: state.opacity,
    highlightStrokeOpacity: state.opacity,
    ...(state.fontSize !== undefined ? { fontSize: state.fontSize } : {}),
    ...(compassPosition ? { position: compassPosition } : {}),
    ...(state.offset !== undefined ? { offset: state.offset } : {}),
  });

  // JSXGraph reads native-label placement from the owning geometry as well as
  // from the generated Text node. Updating both is required for point labels,
  // and remembering the last explicit value lets “Automática” restore the
  // library default after a preset has already been selected.
  if (compassPosition) {
    element.setAttribute?.({
      label: {
        position: compassPosition,
        ...(state.offset !== undefined ? { offset: state.offset } : {}),
      },
    });
  }
  element.__matematikaLabelPosition = typeof state.labelPosition === 'string' ? state.labelPosition : undefined;

  if (state.labelPosition !== undefined && typeof state.labelPosition === 'number' && (element.elType === 'line' || element.elType === 'segment' || element.elType === 'arrow')) {
    const t = state.labelPosition;

    label.setAttribute({
      anchorX: 'center',
      anchorY: 'middle',
      offset: state.offset ?? [0, 0],
    });

    element.getLabelAnchor = () => calculateLineLabelAnchor(element, t);

    label.visProp.islabel = true;
    delete label.X;
    delete label.Y;
  }

  label.needsUpdate = true;
  if (label.update) label.update();
}

export function createElement(
  board: any,
  elements: Record<string, any>,
  item: DiagramElement,
  theme: ThemeColors,
  layer: number,
  spec: DiagramSpecV2,
  liftedIntoHeader = false,
  editableAnnotation = false,
) {
  const refs = refsFor(item, elements);
  const highlightable = item.selection.highlightable !== false;
  const hoverColor = !highlightable || item.style?.preserveColorOnHighlight ? theme[item.color] : theme.ocre;
  const defaultShowLabel = 'constraint' in item || ('kind' in item && ['intersection', 'midpoint', 'perpendicularFoot', 'angle', 'nonReflexAngle'].includes(item.kind));
  const labelVisible = spec.showLabels !== false && (item.showLabel !== undefined ? item.showLabel : defaultShowLabel);
  const labelOptions = {
    visible: labelVisible,
    ...(item.style?.labelSize !== undefined ? { fontSize: item.style.labelSize } : {}),
    ...(typeof item.style?.labelPosition === 'string' ? { position: item.style.labelPosition } : {}),
    ...(item.style?.labelOffset !== undefined ? { offset: item.style.labelOffset } : {}),
  };
  const lineOptions = withDiagramHoverTransition({
    strokeColor: theme[item.color],
    highlightStrokeColor: hoverColor,
    strokeWidth: item.style?.strokeWidth ?? 2,
    highlightStrokeWidth: item.style?.highlightStrokeWidth ?? 3,
    strokeOpacity: item.style?.strokeOpacity ?? 1,
    dash: item.dashed ? 2 : 0,
    fixed: true,
    layer,
    name: renderKatexTextToHtml(item.label),
    ...(labelVisible ? { withLabel: true, label: labelOptions } : {}),
  });
  if (item.kind === 'segment') return refs.length >= 2 ? createSegment(board, [refs[0], refs[1]], lineOptions, theme) : null;
  if (item.kind === 'line') return refs.length >= 2 ? createLine(board, [refs[0], refs[1]], lineOptions, theme) : null;
  if (item.kind === 'ray') return refs.length >= 2 ? createRay(board, [refs[0], refs[1]], lineOptions, theme) : null;
  if (item.kind === 'polygon') return refs.length >= 3 ? createPolygon(board, refs, withDiagramHoverTransition({
    hasInnerPoints: true,
    fillColor: theme[item.color], highlightFillColor: hoverColor, fillOpacity: item.style?.fillOpacity ?? 0.1,
    highlightFillOpacity: item.style?.highlightFillOpacity ?? 0.24,
    fixed: true,
    borders: { strokeColor: theme[item.color], strokeWidth: item.style?.strokeWidth ?? 1.5, strokeOpacity: item.style?.strokeOpacity ?? 1, dash: item.dashed ? 2 : 0, fixed: true }, layer,
  }), theme) : null;
  if (item.kind === 'circle') return refs.length >= 2 ? createCircle(board, [refs[0], refs[1]], {
    ...lineOptions, fillColor: theme[item.color], fillOpacity: item.style?.fillOpacity ?? 0,
    highlightFillOpacity: item.style?.highlightFillOpacity ?? 0.2,
  }, theme) : null;
  if (item.kind === 'arc') {
    if (refs.length < 3) return null;
    const directedRefs: [typeof refs[number], typeof refs[number], typeof refs[number]] = item.properties?.clockwise
      ? [refs[0], refs[2], refs[1]]
      : [refs[0], refs[1], refs[2]];
    return createArc(board, directedRefs, lineOptions, theme);
  }
  if (item.kind === 'functionCurve' && item.properties?.expression) {
    const samples = sampleCurveElement(item, liveVariables(elements, spec));
    const curve = createFunctionCurve(board, samples, lineOptions, theme);
    if (!curveActsAsArea(item)) return curve;
    return createCurveAreaElement(board, elements, item, spec, curve, withDiagramHoverTransition({
      fillColor: theme[item.color],
      fillOpacity: item.style?.fillOpacity ?? 0.12,
      fixed: true,
      layer,
    }), theme);
  }
  if (item.kind === 'parametricCurve' && item.properties?.xExpression && item.properties?.yExpression) {
    const samples = sampleCurveElement(item, liveVariables(elements, spec));
    const curve = createParametricCurve(board, samples, lineOptions, theme);
    if (!curveActsAsArea(item)) return curve;
    return createCurveAreaElement(board, elements, item, spec, curve, withDiagramHoverTransition({
      fillColor: theme[item.color],
      fillOpacity: item.style?.fillOpacity ?? 0.12,
      fixed: true,
      layer,
    }), theme);
  }
  if (item.kind === 'poincareGeodesic') return refs.length >= 4 ? createPoincareGeodesic(board, [refs[0], refs[1], refs[2], refs[3]], lineOptions, theme) : null;
  if (item.kind === 'poincareArc') return refs.length >= 4 ? createPoincareArc(board, [refs[0], refs[1], refs[2], refs[3]], lineOptions, theme) : null;
  if (item.kind === 'intersection') return refs.length >= 2 ? createIntersection(board, [refs[0], refs[1]], 0, withDiagramHoverTransition({
    name: renderKatexTextToHtml(item.label),
    size: item.style?.pointSize ?? 4,
    fillColor: theme[item.color],
    strokeColor: theme[item.color],
    highlightFillColor: hoverColor,
    highlightStrokeColor: hoverColor,
    label: { highlightStrokeColor: hoverColor },
    fixed: true,
    layer,
  }, 'point'), theme) : null;
  if (item.kind === 'midpoint') return refs.length >= 2 ? createMidpoint(board, [refs[0], refs[1]], withDiagramHoverTransition({
    name: renderKatexTextToHtml(item.label), fillColor: theme[item.color], strokeColor: theme[item.color],
    size: item.style?.pointSize ?? 4,
    highlightFillColor: hoverColor, highlightStrokeColor: hoverColor,
    label: { highlightStrokeColor: hoverColor },
    fixed: true, layer,
  }, 'point'), theme) : null;
  if (item.kind === 'perpendicularFoot') return refs.length >= 3 ? createPerpendicularFoot(board, [refs[0], refs[1], refs[2]], withDiagramHoverTransition({
    name: renderKatexTextToHtml(item.label), fillColor: theme[item.color], strokeColor: theme[item.color],
    size: item.style?.pointSize ?? 4,
    highlightFillColor: hoverColor, highlightStrokeColor: hoverColor,
    label: { highlightStrokeColor: hoverColor },
    fixed: true, layer,
  }, 'point'), theme) : null;
  if (item.kind === 'baseExtension') return refs.length >= 3 ? createBaseExtensionToFoot(board, [refs[0], refs[1], refs[2]], lineOptions, theme) : null;
  if (item.kind === 'perpendicular') return refs.length >= 3 ? createPerpendicularLine(board, [refs[0], refs[1], refs[2]], lineOptions, theme) : null;
  if (item.kind === 'parallel') return refs.length >= 3 ? createParallelLine(board, [refs[0], refs[1], refs[2]], lineOptions, theme) : null;
  if (item.kind === 'angleBisector') return refs.length >= 3 ? createAngleBisectorRay(board, [refs[0], refs[1], refs[2]], lineOptions, theme) : null;
  if (item.kind === 'angle') return refs.length >= 3 ? createAngle(board, item.properties?.clockwise
    ? [refs[2], refs[1], refs[0]]
    : [refs[0], refs[1], refs[2]], {
    ...lineOptions, fillColor: theme[item.color], highlightFillColor: hoverColor,
    fillOpacity: item.style?.fillOpacity ?? 0.1, highlightFillOpacity: item.style?.highlightFillOpacity ?? 0.28,
    radius: item.style?.angleRadius ?? DEFAULT_ANGLE_RADIUS, fixed: true, layer,
  }, theme) : null;
  if (item.kind === 'nonReflexAngle') return refs.length >= 3 ? createNonReflexAngle(board, [refs[0], refs[1], refs[2]], {
    ...lineOptions, fillColor: theme[item.color], highlightFillColor: hoverColor,
    fillOpacity: item.style?.fillOpacity ?? 0.1, highlightFillOpacity: item.style?.highlightFillOpacity ?? 0.28,
    radius: item.style?.angleRadius ?? DEFAULT_ANGLE_RADIUS, fixed: true, layer,
  }, theme) : null;
  if (item.kind === 'rightAngle') return refs.length >= 3 ? createRightAngleMarker(board, [refs[0], refs[1], refs[2]], {
    ...lineOptions, hasInnerPoints: true, fillColor: theme[item.color], highlightFillColor: hoverColor,
    fillOpacity: item.style?.fillOpacity ?? 0.1, highlightFillOpacity: item.style?.highlightFillOpacity ?? 0.28,
    size: item.style?.angleRadius ?? DEFAULT_RIGHT_ANGLE_RADIUS, fixed: true, layer,
  }, theme) : null;
  if (item.kind === 'perpendicularMark') return refs.length >= 3 ? createRightAngleMarker(board, [refs[0], refs[1], refs[2]], {
    ...lineOptions, hasInnerPoints: true, fillColor: theme[item.color], highlightFillColor: hoverColor,
    fillOpacity: item.style?.fillOpacity ?? 0.1, highlightFillOpacity: item.style?.highlightFillOpacity ?? 0.28,
    size: item.style?.angleRadius ?? DEFAULT_RIGHT_ANGLE_RADIUS, fixed: true, layer,
  }, theme) : null;
  if (item.kind === 'congruenceMark') return refs.length >= 2 ? createCongruenceMark(
    board,
    [refs[0], refs[1]],
    item.properties?.markCount ?? 1,
    { ...lineOptions, markHeight: item.style?.markHeight ?? 0.32 },
    theme,
  ) : null;
  if (item.kind === 'parallelMark') return refs.length >= 2 ? createParallelMark(
    board,
    [refs[0], refs[1]],
    item.properties?.markCount ?? 1,
    { ...lineOptions, markHeight: item.style?.markHeight ?? 0.42 },
    theme,
  ) : null;
  if (item.kind === 'measureTicks') return refs.length >= 1 ? createTicks(
    board,
    [refs[0], tickDistance(item, elements, spec)],
    { ...lineOptions, majorHeight: item.style?.markHeight ?? 10, minorTicks: item.properties?.minorTickCount ?? 4 },
    theme,
  ) : null;
  if (item.kind === 'dimensionLine') return refs.length >= 2 ? createDimensionLine(
    board,
    [refs[0], refs[1]],
    () => liftedIntoHeader ? '' : reactiveText(item, elements, spec) ?? measurementText(item, elements, spec),
    item.properties?.offset ?? 0.35,
    { ...lineOptions, fontSize: item.style?.labelSize },
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
    { ...withDiagramHoverTransition({ hasInnerPoints: true, fillColor: theme[item.color], fillOpacity: item.style?.fillOpacity ?? 0.1, borders: lineOptions, fixed: true, layer }) },
    theme,
  ) : null;
  if (item.kind === 'halfPlane' && refs.length >= 3) {
    const resolveBounds = () => resolveBoardViewportBounds(board, spec.viewport.bounds);
    return createHalfPlaneFill(
      board,
      [refs[0], refs[1]],
      refs[2],
      resolveBounds,
      withDiagramHoverTransition({
        fillColor: theme[item.color],
        fillOpacity: item.style?.fillOpacity ?? 0.12,
        fixed: true,
        layer,
      }),
      theme,
    );
  }
  if (item.kind === 'areaIntersection' && refs.length >= 2) {
    const liveResolver = createLiveAreaPointResolver(elements);
    const resolveBounds = () => resolveBoardViewportBounds(board, spec.viewport.bounds);
    const resolvePolygons = () => resolveAreaDisplayPolygons(
      { ...spec, viewport: { ...spec.viewport, bounds: resolveBounds() } },
      item,
      liveResolver,
    );
    const fills = createAreaIntersectionFills(
      board,
      resolvePolygons,
      withDiagramHoverTransition({
        fillColor: theme[item.color],
        fillOpacity: item.style?.fillOpacity ?? 0.14,
        fixed: true,
        layer,
      }),
      theme,
    );
    if (fills.length === 0) return null;
    return createAreaIntersectionComposite(fills);
  }
  const anchor = refs[0];
  const dynamicText = () => annotationTextHtml(item, elements, spec);
  const textOffset = item.style?.textOffset ?? (item.kind === 'label' ? [0.04, 0.04] : [0.25, 0.35]);
  const viewportPosition = item.kind === 'infoPanel' && item.properties?.anchorMode === 'viewport'
    ? item.properties.viewportPosition
    : undefined;
  const viewportPanelAnchor = viewportPosition ? viewportPanelAnchors(viewportPosition) : undefined;
  const reactiveTextCoordinates: [() => number, () => number, () => string] | null = viewportPosition
    ? [
      () => viewportPositionCoordinates(board, viewportPosition, spec.viewport.bounds)[0],
      () => viewportPositionCoordinates(board, viewportPosition, spec.viewport.bounds)[1],
      dynamicText,
    ]
    : anchor
      ? [
        () => referencedLabelAnchor(item.refs[0], item.properties?.anchorParameter ?? 0.5, elements, spec)[0] + textOffset[0],
        () => referencedLabelAnchor(item.refs[0], item.properties?.anchorParameter ?? 0.5, elements, spec)[1] + textOffset[1],
        dynamicText,
      ]
      : null;
  const textCoordinates: [number | (() => number), number | (() => number), () => string] | null = reactiveTextCoordinates && editableAnnotation
    ? [reactiveTextCoordinates[0](), reactiveTextCoordinates[1](), dynamicText]
    : reactiveTextCoordinates;
  return textCoordinates ? createText(board, textCoordinates, withDiagramHoverTransition({
    color: theme[item.color],
    fixed: !editableAnnotation,
    layer,
    ...(item.style?.labelSize !== undefined ? { fontSize: item.style.labelSize } : {}),
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
  }), theme) : null;
}

export interface UseBoardLifecycleOptions {
  spec: DiagramSpecV2;
  mode?: 'runtime' | 'editor' | 'preview';
  selectedIds?: readonly string[];
  highlightedIds?: readonly string[];
  effectiveStepId?: string;
  bounds: DiagramBounds;
  interactionCallbacksRef: MutableRefObject<{
    onSelectionChange?: (id: string, intent?: DiagramSelectionIntent) => void;
    onPointMove?: (id: string, x: number, y: number) => void;
    onSliderChange?: (id: string, value: number) => void;
    onAnnotationMove?: (id: string, placement: DiagramAnnotationPlacement) => void;
    onCanvasPointCreate?: (x: number, y: number) => void;
  }>;
  setTargetHighlight: (target: string | null) => void;
  localTargetHighlightRef: MutableRefObject<string | null>;
  allHeaderItemIds: Set<string>;
  setLiveSceneVariables: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  liveVariablesSignatureRef: MutableRefObject<string>;
}

export function useBoardLifecycle({
  spec,
  mode = 'runtime',
  selectedIds = [],
  highlightedIds = [],
  effectiveStepId,
  bounds,
  interactionCallbacksRef,
  setTargetHighlight,
  localTargetHighlightRef,
  allHeaderItemIds,
  setLiveSceneVariables,
  liveVariablesSignatureRef,
}: UseBoardLifecycleOptions) {
  const stepEmphasisAnimationRef = useRef(createStepEmphasisAnimation());
  const hoverControllerRef = useRef<DiagramHoverController>(createDiagramHoverController());
  const emphasisPulseOnlyRef = useRef(false);
  const emphasisSceneCacheRef = useRef<{
    board: { update?: () => void };
    elements: Record<string, any>;
    theme: ThemeColors;
    plan: ReturnType<typeof createScenePlan>;
    hasExternalHighlight: boolean;
    shouldDimOthers: boolean;
  } | null>(null);
  const applyPulseFromCacheRef = useRef<() => void>(() => {});
  const lastStackLayoutRef = useRef('');

  const handleBoardInit = (board: any, elements: Record<string, any>, theme: ThemeColors) => {
    hoverControllerRef.current = createDiagramHoverController();
    board.dehighlightAll?.();
    const hoverController = hoverControllerRef.current;
    const requestSceneUpdate = () => {
      if (!board.inUpdate) board.update();
    };
    const boardContainer = board.containerObj ?? board.renderer?.container;
    boardContainer?.addEventListener('mouseleave', () => hoverController.clearAll(requestSceneUpdate));
    if (mode === 'editor') {
      board.on('down', (event: unknown) => {
        const objects = board.getAllObjectsUnderMouse?.(event);
        if (!diagramPointerSelectionWasHandled(event) && Array.isArray(objects)) {
          const selectableIds = new Set([...spec.points, ...spec.elements, ...spec.sliders]
            .filter(item => item.selection.selectable)
            .map(item => item.id));
          const pointerEvent = event as { target?: EventTarget | null; shiftKey?: boolean };
          const pointerTarget = pointerEvent.target instanceof Element ? pointerEvent.target : null;
          const targetNode = pointerTarget?.closest('[data-diagram-object-id], [data-diagram-part-of]');
          const targetId = targetNode?.getAttribute('data-diagram-object-id') ?? targetNode?.getAttribute('data-diagram-part-of');
          const hitIds = objects.flatMap(hit => {
            const match = Object.entries(elements).find(([, rendered]) => (
              rendered === hit
              || rendered?.label === hit
              || rendered?.borders?.includes(hit)
            ));
            return match && selectableIds.has(match[0]) ? [match[0]] : [];
          });
          const pointLikeIds = new Set([
            ...spec.points.map(point => point.id),
            ...spec.elements.filter(item => ['intersection', 'midpoint', 'perpendicularFoot'].includes(item.kind)).map(item => item.id),
          ]);
          const pointHitId = hitIds.find(id => pointLikeIds.has(id));
          const selectedHitId = pointHitId
            ?? (targetId && selectableIds.has(targetId) ? targetId : undefined)
            ?? hitIds[hitIds.length - 1];
          if (selectedHitId) {
            interactionCallbacksRef.current.onSelectionChange?.(selectedHitId, { additive: pointerEvent.shiftKey === true });
            return;
          }
        }
        const createPointAt = interactionCallbacksRef.current.onCanvasPointCreate;
        if (!createPointAt) return;
        if (Array.isArray(objects) && objects.length > 0) return;
        const coordinates = board.getUsrCoordsOfMouse?.(event);
        if (Array.isArray(coordinates) && coordinates.length >= 2) createPointAt(coordinates[0], coordinates[1]);
      });
    }
    createSceneConstructionPlan(spec).forEach(entry => {
      const sceneItem = entry.item;
      const directInteractionLocked = entry.locked || !sceneItem.selection.selectable;
      const highlightable = sceneItem.selection.highlightable !== false;
      const hoverColor = !highlightable || sceneItem.style?.preserveColorOnHighlight ? theme[sceneItem.color] : theme.ocre;
      const pointLabelOptions = {
        visible: spec.showLabels !== false && (!('showLabel' in sceneItem) || sceneItem.showLabel !== false),
        ...('constraint' in sceneItem && sceneItem.style?.labelSize !== undefined ? { fontSize: sceneItem.style.labelSize } : {}),
        ...('constraint' in sceneItem && typeof sceneItem.style?.labelPosition === 'string' ? { position: sceneItem.style.labelPosition } : {}),
        ...(sceneItem.style?.labelOffset ? { offset: sceneItem.style.labelOffset } : {}),
        highlightStrokeColor: hoverColor,
      };
      if ('constraint' in sceneItem) {
        const onConstraint = sceneItem.constraint === 'constrained'
          ? (spec.constraints ?? []).find(constraint => (
            constraint.enabled
            && constraint.kind === 'on'
            && constraint.refs[0] === sceneItem.id
            && elements[constraint.refs[1]]
          ))
          : undefined;
        const gliderTarget = sceneItem.constraint === 'glider'
          ? sceneItem.gliderTarget
          : onConstraint?.refs[1];
        const attractors = sceneItem.attractorIds?.map(id => elements[id]).filter(Boolean) ?? [];
        const attractionOptions = !directInteractionLocked
          ? {
            attractors,
            attractorDistance: sceneItem.attractorDistance ?? 0.4,
            snatchDistance: sceneItem.snatchDistance ?? 0.6,
          }
          : {};
        const item = sceneItem.constraint === 'derived' && sceneItem.xExpression && sceneItem.yExpression
          ? createPoint(board, [
            () => {
              try { return evaluateMathExpression(sceneItem.xExpression ?? '0', liveVariables(elements, spec)); } catch { return sceneItem.x; }
            },
            () => {
              try { return evaluateMathExpression(sceneItem.yExpression ?? '0', liveVariables(elements, spec)); } catch { return sceneItem.y; }
            },
          ], withDiagramHoverTransition({
            name: renderKatexTextToHtml(sceneItem.label),
            fixed: true,
            ...(sceneItem.style?.pointSize !== undefined ? { size: sceneItem.style.pointSize } : {}),
            ...(sceneItem.style?.highlightPointSize !== undefined ? { highlightSize: sceneItem.style.highlightPointSize } : {}),
            fillColor: theme[sceneItem.color],
            strokeColor: theme[sceneItem.color],
            highlightFillColor: hoverColor,
            highlightStrokeColor: hoverColor,
            label: pointLabelOptions,
            layer: itemLayerNumber(spec, sceneItem),
          }, 'point'), theme)
          : gliderTarget
          ? createGlider(board, [sceneItem.x, sceneItem.y, elements[gliderTarget]], withDiagramHoverTransition({
            name: renderKatexTextToHtml(sceneItem.label),
            fixed: directInteractionLocked,
            ...(sceneItem.style?.pointSize !== undefined ? { size: sceneItem.style.pointSize } : {}),
            ...(sceneItem.style?.highlightPointSize !== undefined ? { highlightSize: sceneItem.style.highlightPointSize } : {}),
            fillColor: theme[sceneItem.color],
            strokeColor: theme[sceneItem.color],
            highlightFillColor: hoverColor,
            highlightStrokeColor: hoverColor,
            label: pointLabelOptions,
            layer: itemLayerNumber(spec, sceneItem),
          }, 'point'), theme)
          : createPoint(board, [sceneItem.x, sceneItem.y], withDiagramHoverTransition({
            name: renderKatexTextToHtml(sceneItem.label),
            fixed: directInteractionLocked,
            ...(sceneItem.style?.pointSize !== undefined ? { size: sceneItem.style.pointSize } : {}),
            ...(sceneItem.style?.highlightPointSize !== undefined ? { highlightSize: sceneItem.style.highlightPointSize } : {}),
            fillColor: theme[sceneItem.color],
            strokeColor: theme[sceneItem.color],
            highlightFillColor: hoverColor,
            highlightStrokeColor: hoverColor,
            label: pointLabelOptions,
            layer: itemLayerNumber(spec, sceneItem),
            ...attractionOptions,
            ...(sceneItem.snapToGrid && !directInteractionLocked ? {
              snapToGrid: true,
              snapSizeX: sceneItem.snapSize ?? 0.5,
              snapSizeY: sceneItem.snapSize ?? 0.5,
            } : {}),
          }, 'point'), theme);
        elements[sceneItem.id] = item;
        if (!directInteractionLocked && sceneItem.constraint !== 'derived') {
          let enforcing = false;
          item.on('drag', () => {
            if (enforcing) return;
            releaseInactiveAttractions(spec, elements, sceneItem.id);
            const liveSpec: DiagramSpecV2 = {
              ...spec,
              points: spec.points.map(point => elements[point.id]
                ? { ...point, x: elements[point.id].X(), y: elements[point.id].Y() }
                : point),
              sliders: spec.sliders.map(slider => elements[slider.id]?.Value
                ? { ...slider, value: elements[slider.id].Value() }
                : slider),
            };
            const nextSpec = withMovedPoint(liveSpec, sceneItem.id, item.X(), item.Y());
            enforcing = true;
            const restoreInactiveAttractors = suspendInactiveAttractors(spec, elements, sceneItem.id);
            try {
              nextSpec.points.forEach(nextPoint => {
                const renderedPoint = elements[nextPoint.id];
                if (!renderedPoint) return;
                if (Math.abs(nextPoint.x - renderedPoint.X()) <= 1e-8 && Math.abs(nextPoint.y - renderedPoint.Y()) <= 1e-8) return;
                renderedPoint.moveTo([nextPoint.x, nextPoint.y], 0);
              });
            } finally {
              restoreInactiveAttractors();
              enforcing = false;
            }
          });
        }
        if (!directInteractionLocked && sceneItem.constraint !== 'derived') item.on('up', () => {
          const finalX = item.X();
          const finalY = item.Y();
          const released = releaseAuthoredAttraction(sceneItem, elements);
          const releasedOthers = releaseInactiveAttractions(spec, elements, sceneItem.id);
          if (released || releasedOthers) board.update();
          interactionCallbacksRef.current.onPointMove?.(sceneItem.id, finalX, finalY);
        });
      } else if ('kind' in sceneItem) {
        elements[sceneItem.id] = createElement(
          board,
          elements,
          sceneItem,
          theme,
          itemLayerNumber(spec, sceneItem),
          spec,
          mode === 'runtime' && allHeaderItemIds.has(sceneItem.id),
          mode === 'editor' && !directInteractionLocked && ['text', 'label', 'formula', 'infoPanel', 'measurement'].includes(sceneItem.kind),
        );
        if (!directInteractionLocked && ['text', 'label', 'formula', 'infoPanel', 'measurement'].includes(sceneItem.kind)) {
          elements[sceneItem.id]?.on?.('up', () => {
            const rendered = elements[sceneItem.id];
            const x = rendered?.X?.();
            const y = rendered?.Y?.();
            if (!Number.isFinite(x) || !Number.isFinite(y)) return;
            if (sceneItem.kind === 'infoPanel' && sceneItem.properties?.anchorMode === 'viewport') {
              const width = bounds[2] - bounds[0];
              const height = bounds[1] - bounds[3];
              const clamp = (value: number) => Math.max(0, Math.min(1, value));
              interactionCallbacksRef.current.onAnnotationMove?.(sceneItem.id, {
                viewportPosition: [clamp((x - bounds[0]) / width), clamp((bounds[1] - y) / height)],
              });
              return;
            }
            const anchor = referencedLabelAnchor(sceneItem.refs[0], sceneItem.properties?.anchorParameter ?? 0.5, elements, spec);
            interactionCallbacksRef.current.onAnnotationMove?.(sceneItem.id, {
              textOffset: [x - anchor[0], y - anchor[1]],
            });
          });
        }
      } else {
        const maximum = sliderMaximum(sceneItem, elements, spec);
        elements[sceneItem.id] = createSlider(board, [[sceneItem.x, sceneItem.y], [sceneItem.x + 2.6, sceneItem.y]], [sceneItem.min, Math.min(sceneItem.value, maximum), maximum], withDiagramHoverTransition({
          name: renderKatexTextToHtml(sceneItem.label),
          snapWidth: sceneItem.step,
          fillColor: theme[sceneItem.color],
          strokeColor: theme[sceneItem.color],
          highlightFillColor: hoverColor,
          highlightStrokeColor: hoverColor,
          ...(!highlightable ? {
            baseline: { highlight: false, strokeColor: theme.pizarra, strokeWidth: 2 },
            highline: { highlight: false, strokeColor: theme.terracota, strokeWidth: 3 },
            point1: { highlight: false },
            point2: { highlight: false },
          } : {}),
          label: { highlightStrokeColor: hoverColor },
          fixed: directInteractionLocked,
          layer: itemLayerNumber(spec, sceneItem),
        }), theme);
        if (!directInteractionLocked) elements[sceneItem.id]?.on?.('up', () => {
          interactionCallbacksRef.current.onSliderChange?.(sceneItem.id, elements[sceneItem.id].Value());
        });
      }
      const element = elements[sceneItem.id];
      const keyboardAdjust = 'constraint' in sceneItem && !directInteractionLocked && sceneItem.constraint !== 'derived'
        ? (key: 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'Home' | 'End', largeStep: boolean) => {
          if (key === 'Home' || key === 'End') return;
          releaseInactiveAttractions(spec, elements, sceneItem.id);
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
          const nextSpec = withMovedPoint(liveSpec, sceneItem.id, requested.x, requested.y);
          const restoreInactiveAttractors = suspendInactiveAttractors(spec, elements, sceneItem.id);
          try {
            nextSpec.points.forEach(nextPoint => {
              const renderedPoint = elements[nextPoint.id];
              if (!renderedPoint) return;
              renderedPoint.moveTo([nextPoint.x, nextPoint.y], 0);
            });
          } finally {
            restoreInactiveAttractors();
          }
          releaseAuthoredAttraction(sceneItem, elements);
          board.update();
          interactionCallbacksRef.current.onPointMove?.(sceneItem.id, element.X(), element.Y());
          const node = element.rendNode as HTMLElement | undefined;
          node?.setAttribute('aria-label', `${sceneItem.selection.ariaLabel ?? sceneItem.label}: x ${element.X().toFixed(2)}, y ${element.Y().toFixed(2)}`);
        }
        : 'min' in sceneItem && !directInteractionLocked
          ? (key: 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'Home' | 'End', largeStep: boolean) => {
            const delta = sceneItem.step * (largeStep ? 10 : 1);
            const current = element.Value?.() ?? sceneItem.value;
            const maximum = sliderMaximum(sceneItem, elements, spec);
            const next = key === 'Home'
              ? sceneItem.min
              : key === 'End'
                ? maximum
                : Math.min(maximum, Math.max(sceneItem.min, current + (key === 'ArrowLeft' || key === 'ArrowDown' ? -delta : delta)));
            element.setValue?.(next);
            board.update();
            interactionCallbacksRef.current.onSliderChange?.(sceneItem.id, next);
            const node = element.rendNode as HTMLElement | undefined;
            node?.setAttribute('aria-valuemax', String(maximum));
            node?.setAttribute('aria-valuenow', String(next));
            node?.setAttribute('aria-label', `${sceneItem.selection.ariaLabel ?? sceneItem.label}: ${next}`);
          }
          : undefined;
      attachSelection(
        element,
        sceneItem,
        mode,
        (id, intent) => interactionCallbacksRef.current.onSelectionChange?.(id, intent),
        setTargetHighlight,
        keyboardAdjust,
      );
      if ('min' in sceneItem && sceneItem.maxExpression) {
        element.rendNode?.setAttribute('aria-valuemax', String(sliderMaximum(sceneItem, elements, spec)));
      }
      attachLabelSelection(
        element,
        sceneItem,
        mode,
        (id, intent) => interactionCallbacksRef.current.onSelectionChange?.(id, intent),
        setTargetHighlight,
      );
      attachDiagramHoverHandlers(element, sceneItem, hoverController, requestSceneUpdate);
    });

    spec.points.forEach(point => {
      const element = elements[point.id];
      if (!element) return;
      const directInteractionLocked = point.locked || !point.selection.selectable;
      if (directInteractionLocked) {
        if (element.visProp) {
          element.visProp.attractors = [];
        }
        return;
      }
      const attractors = point.attractorIds?.map(id => elements[id]).filter(Boolean) ?? [];
      element.setAttribute({
        attractorDistance: point.attractorDistance ?? 0.4,
        snatchDistance: point.snatchDistance ?? 0.6,
      });
      if (element.visProp) {
        element.visProp.attractors = attractors;
      }
    });
  };

  const applyEntrySceneVisuals = (
    entry: ReturnType<typeof createScenePlan>[number],
    item: ReturnType<typeof createScenePlan>[number]['item'],
    element: any,
    sceneElements: Record<string, any>,
    sceneTheme: ThemeColors,
    sceneHasExternalHighlight: boolean,
    sceneShouldDimOthers: boolean,
    primaryPulseAmount: number,
    options: { pulseVisualsOnly?: boolean } = {},
  ) => {
    const hoverController = hoverControllerRef.current;
    const hoverActive = hoverController.isHovered(item.id);
    const externalActive = entry.highlighted || entry.selected;
    const stepPrimary = !sceneHasExternalHighlight && entry.stepEmphasis === 'primary';
    const stepSecondary = !sceneHasExternalHighlight && entry.stepEmphasis === 'secondary';
    const sceneHighlighted = externalActive || stepPrimary || stepSecondary;
    const active = sceneHighlighted || hoverActive;
    const emphasisState: StepEmphasisVisualState = {
      hoverActive,
      externalActive,
      stepPrimary,
      stepSecondary,
      active,
      pulseAmount: primaryPulseAmount,
    };
    const sceneStyle = entry.style;
    const effectiveDashed = entry.stepDashed ?? ('dashed' in item ? Boolean(item.dashed) : false);
    const opacity = externalActive || !sceneShouldDimOthers ? 1 : 0.28;
    const hoverOnly = hoverActive && !sceneHighlighted;
    const color = (externalActive || hoverOnly) && !sceneStyle?.preserveColorOnHighlight
      ? sceneTheme.ocre
      : (stepPrimary || stepSecondary) && entry.stepEmphasisColor
        ? sceneTheme[entry.stepEmphasisColor]
        : sceneTheme[entry.color];
    const sceneVisible = mode === 'editor' && externalActive
      ? true
      : entry.visible || (externalActive && sceneStyle?.highlightVisible === true);
    const conditionVisible = mode === 'editor' && externalActive
      ? true
      : externalActive && sceneStyle?.highlightVisible === true
      ? true
      : conditionAllows(item, sceneElements, spec);
    const visible = sceneVisible && conditionVisible
      && (('kind' in item && item.kind === 'baseExtension')
        ? outsideBaseExtension(sceneElements[item.refs[0]], sceneElements[item.refs[1]], sceneElements[item.refs[2]])
        : true)
      && (('kind' in item && item.kind === 'intersection')
        ? intersectionBelongsToSupports(item, element, sceneElements, spec)
        : true);
    const base = {
      visible,
      fixed: 'kind' in item ? true : entry.locked || !item.selection.selectable,
    };
    const hoverColor = item.selection.highlightable === false || sceneStyle?.preserveColorOnHighlight ? sceneTheme[entry.color] : sceneTheme.ocre;
    const defaultShowLabel = 'constraint' in item || ('kind' in item && ['intersection', 'midpoint', 'perpendicularFoot', 'angle', 'nonReflexAngle'].includes(item.kind));
    const nativeLabelVisible = visible && spec.showLabels !== false
      && (entry.stepShowLabel !== undefined
        ? entry.stepShowLabel
        : ('showLabel' in item && item.showLabel !== undefined ? item.showLabel : defaultShowLabel));
    const dimmed = opacity < 1;
    const transitionKey = diagramVisualTransitionKey({
      hoverActive,
      externalActive,
      stepPrimary,
      stepSecondary,
      visible,
      dimmed,
    });
    const shouldAnimate = shouldAnimateDiagramVisuals(element, transitionKey, Boolean(options.pulseVisualsOnly));
    element.__matematikaTransitionKey = transitionKey;
    if (!options.pulseVisualsOnly) {
      syncNativeElementLabel(element, {
        visible: nativeLabelVisible,
        color,
        highlightColor: hoverColor,
        opacity,
        text: entry.label,
        fontSize: sceneStyle?.labelSize,
        labelPosition: sceneStyle?.labelPosition,
        offset: sceneStyle?.labelOffset,
        highlighted: active,
      });
      if (element.__matematikaStepLabel !== entry.label) {
        element.setAttribute?.({ name: renderKatexTextToHtml(entry.label) });
        element.__matematikaStepLabel = entry.label;
      }
    }
    if ('constraint' in item || ('kind' in item && (item.kind === 'intersection' || item.kind === 'midpoint' || item.kind === 'perpendicularFoot'))) {
      commitElementVisuals(element, base, {
        size: resolveStepEmphasisPointSize(sceneStyle, emphasisState),
        fillColor: color,
        strokeColor: color,
        fillOpacity: resolveStepEmphasisPointFillOpacity(opacity, emphasisState),
      }, shouldAnimate);
    } else if ('min' in item) {
      const maximum = sliderMaximum(item, sceneElements, spec);
      if (element.__matematikaMaximum !== maximum) {
        const current = element.Value?.() ?? item.value;
        element.setMax?.(maximum);
        element.setValue?.(Math.min(maximum, Math.max(item.min, current)));
        element.__matematikaMaximum = maximum;
      }
      if (entry.stepValue !== undefined && element.__matematikaStepValue !== entry.stepValue) {
        element.setValue?.(Math.min(maximum, entry.stepValue));
        element.__matematikaStepValue = entry.stepValue;
      } else if (entry.stepValue === undefined && element.__matematikaStepValue !== undefined) {
        element.setValue?.(Math.min(maximum, item.value));
        delete element.__matematikaStepValue;
      }
      element.rendNode?.setAttribute('aria-valuemax', String(maximum));
      element.rendNode?.setAttribute('aria-valuenow', String(element.Value?.() ?? item.value));
      const sliderLine = buildLineEmphasisAttributes(color, sceneStyle, emphasisState, opacity, {
        normal: 2,
        primary: 3,
        highlight: 3.4,
        secondary: 2.6,
      });
      commitElementVisuals(element, { ...base, dash: effectiveDashed ? 2 : 0 }, sliderLine, shouldAnimate);
    } else if ((item.kind === 'functionCurve' || item.kind === 'parametricCurve') && curveActsAsArea(item)) {
      const composite = element as CurveAreaComposite;
      const fills = composite.__matematikaCurveArea?.fills
        ?? (Array.isArray(composite.elements)
          ? composite.elements.slice(0, -1)
          : []);
      const curve = composite.__matematikaCurveArea?.curve
        ?? (Array.isArray(composite.elements) ? composite.elements[composite.elements.length - 1] : undefined);
      const polygonAttrs = buildPolygonEmphasisAttributes(color, sceneStyle, emphasisState, opacity, {
        fill: { normal: 0.1, highlight: 0.24 },
        stroke: { normal: 1.5, primary: 2.4, highlight: 3.2, secondary: 2 },
      });
      fills.forEach(fill => {
        commitElementVisuals(
          fill,
          {
            ...base,
            fillColor: polygonAttrs.fillColor,
            borders: { visible: false, strokeOpacity: 0 },
          },
          { fillOpacity: polygonAttrs.fillOpacity },
          shouldAnimate,
        );
      });
      const lineAttrs = buildLineEmphasisAttributes(color, sceneStyle, emphasisState, opacity, {
        normal: 2,
        primary: 3.2,
        highlight: 3.6,
        secondary: 2.6,
      });
      commitElementVisuals(curve, { ...base, dash: effectiveDashed ? 2 : 0 }, lineAttrs, shouldAnimate);
    } else if (item.kind === 'polygon' || item.kind === 'areaDecomposition' || item.kind === 'halfPlane' || item.kind === 'areaIntersection') {
      const polygonAttrs = buildPolygonEmphasisAttributes(color, sceneStyle, emphasisState, opacity, {
        fill: { normal: 0.1, highlight: 0.24 },
        stroke: { normal: 1.5, primary: 2.4, highlight: 3.2, secondary: 2 },
      });
      const dashedBorder = { ...polygonAttrs.borderAttrs, dash: effectiveDashed ? 2 : 0 };
      commitElementVisuals(
        element,
        {
          ...base,
          fillColor: polygonAttrs.fillColor,
          borders: { ...polygonAttrs.borders, dash: effectiveDashed ? 2 : 0 },
        },
        { fillOpacity: polygonAttrs.fillOpacity },
        shouldAnimate,
        {
          strokeWidth: dashedBorder.strokeWidth as number | undefined,
          strokeOpacity: dashedBorder.strokeOpacity as number | undefined,
          strokeColor: dashedBorder.strokeColor as string | undefined,
        },
      );
    } else if (item.kind === 'angle' || item.kind === 'nonReflexAngle' || item.kind === 'rightAngle' || item.kind === 'perpendicularMark') {
      const isPolygonAngle = item.kind === 'rightAngle' || item.kind === 'perpendicularMark';
      if (isPolygonAngle) {
        const polygonAttrs = buildPolygonEmphasisAttributes(color, sceneStyle, emphasisState, opacity, {
          fill: { normal: 0.1, highlight: 0.28 },
          stroke: { normal: 1.5, primary: 2.6, highlight: 3.2, secondary: 2.2 },
        });
        const angleSize = resolveStepEmphasisAngleRadius(sceneStyle, emphasisState, DEFAULT_RIGHT_ANGLE_RADIUS);
        const dashedBorder = { ...polygonAttrs.borderAttrs, dash: effectiveDashed ? 2 : 0 };
        commitElementVisuals(
          element,
          {
            ...base,
            fillColor: polygonAttrs.fillColor,
            borders: { ...polygonAttrs.borders, dash: effectiveDashed ? 2 : 0 },
          },
          { fillOpacity: polygonAttrs.fillOpacity, radius: angleSize },
          shouldAnimate,
          {
            strokeWidth: dashedBorder.strokeWidth as number | undefined,
            strokeOpacity: dashedBorder.strokeOpacity as number | undefined,
            strokeColor: dashedBorder.strokeColor as string | undefined,
          },
        );
      } else {
        const angleLine = buildLineEmphasisAttributes(color, sceneStyle, emphasisState, opacity, {
          normal: 1.5,
          primary: 3,
          highlight: 3.6,
          secondary: 2.6,
        });
        commitElementVisuals(
          element,
          { ...base, dash: effectiveDashed ? 2 : 0 },
          {
            ...angleLine,
            fillColor: color,
            fillOpacity: resolveStepEmphasisFillOpacity(sceneStyle, emphasisState, opacity, {
              normal: 0.1,
              highlight: 0.28,
            }),
            radius: resolveStepEmphasisAngleRadius(sceneStyle, emphasisState, DEFAULT_ANGLE_RADIUS),
          },
          shouldAnimate,
        );
      }
    } else if (item.kind === 'measureTicks') {
      const tickHeights = resolveStepEmphasisTickHeights(sceneStyle, emphasisState, sceneStyle?.markHeight ?? 10);
      const markAttrs = buildMarkEmphasisAttributes(color, sceneStyle, emphasisState, opacity);
      commitElementVisuals(
        element,
        {
          ...base,
          ticksDistance: tickDistance(item, sceneElements, spec),
          ...tickHeights,
          dash: effectiveDashed ? 2 : 0,
        },
        {
          strokeWidth: markAttrs.strokeWidth as number | undefined,
          strokeOpacity: markAttrs.strokeOpacity as number | undefined,
          strokeColor: markAttrs.strokeColor as string | undefined,
        },
        shouldAnimate,
      );
    } else if (item.kind === 'congruenceMark' || item.kind === 'parallelMark') {
      const defaultHeight = item.style?.markHeight ?? (item.kind === 'parallelMark' ? 0.42 : 0.32);
      syncMarkLayoutEmphasis(element, sceneStyle, emphasisState, defaultHeight);
      const markAttrs = buildMarkEmphasisAttributes(color, sceneStyle, emphasisState, opacity);
      commitElementVisuals(
        element,
        { ...base, dash: effectiveDashed ? 2 : 0 },
        {
          strokeWidth: markAttrs.strokeWidth as number | undefined,
          strokeOpacity: markAttrs.strokeOpacity as number | undefined,
          strokeColor: markAttrs.strokeColor as string | undefined,
        },
        shouldAnimate,
      );
    } else if (item.kind === 'dimensionLine') {
      const markAttrs = buildMarkEmphasisAttributes(color, sceneStyle, emphasisState, opacity);
      commitElementVisuals(
        element,
        { ...base, dash: effectiveDashed ? 2 : 0 },
        {
          ...markAttrs,
          fontSize: resolveStepEmphasisFontSize(sceneStyle, emphasisState, sceneStyle?.labelSize),
        },
        shouldAnimate,
      );
    } else if (item.kind === 'grid') {
      const gridLine = buildLineEmphasisAttributes(color, sceneStyle, emphasisState, opacity, {
        normal: 0.8,
        primary: 2,
        highlight: 2.8,
        secondary: 1.2,
      });
      commitElementVisuals(element, { ...base, dash: effectiveDashed ? 2 : 0 }, gridLine, shouldAnimate);
    } else if (item.kind === 'text' || item.kind === 'label' || item.kind === 'formula' || item.kind === 'infoPanel' || item.kind === 'measurement') {
      const liftedIntoHeader = mode === 'runtime' && allHeaderItemIds.has(item.id);
      const isAuthoredLabelHidden = item.kind === 'label' && spec.showLabels === false;
      const sceneOpacity = resolveStepEmphasisSceneOpacity(emphasisState, opacity);
      const annotationVisible = entry.stepShowLabel !== undefined
        ? entry.stepShowLabel
        : base.visible && !liftedIntoHeader && !isAuthoredLabelHidden;
      const fontSize = resolveStepEmphasisFontSize(sceneStyle, emphasisState, sceneStyle?.labelSize);
      commitElementVisuals(
        element,
        { ...base, visible: annotationVisible, color },
        { opacity: sceneOpacity, fontSize },
        shouldAnimate,
      );
      if (item.kind !== 'label') {
        const textContent = annotationTextHtml(item, sceneElements, spec);
        if (element.__matematikaLastText !== textContent) {
          if (typeof element.setText === 'function') {
            element.setText(textContent);
          }
          element.__matematikaLastText = textContent;
        }
      }
    } else if (item.kind === 'circle') {
      const polygonAttrs = buildPolygonEmphasisAttributes(sceneTheme[entry.color], sceneStyle, emphasisState, opacity, {
        fill: { normal: 0, highlight: 0.2 },
        stroke: { normal: 2, primary: 3.2, highlight: 3.6, secondary: 2.6 },
      });
      commitElementVisuals(
        element,
        { ...base, fillColor: sceneTheme[entry.color], strokeColor: color, dash: effectiveDashed ? 2 : 0 },
        {
          fillOpacity: polygonAttrs.fillOpacity,
          strokeOpacity: polygonAttrs.borders.strokeOpacity as number | undefined,
          strokeWidth: polygonAttrs.borders.strokeWidth as number | undefined,
        },
        shouldAnimate,
      );
    } else {
      const lineAttrs = buildLineEmphasisAttributes(color, sceneStyle, emphasisState, opacity, {
        normal: 2,
        primary: 3.2,
        highlight: 3.6,
        secondary: 2.6,
      });
      commitElementVisuals(element, { ...base, dash: effectiveDashed ? 2 : 0 }, lineAttrs, shouldAnimate);
    }
  };

  useLayoutEffect(() => {
    applyPulseFromCacheRef.current = () => {
      const cache = emphasisSceneCacheRef.current;
      if (!cache) return;
      const primaryPulseAmount = stepEmphasisAnimationRef.current.getPulseAmount();
      cache.plan.forEach(entry => {
        if (cache.hasExternalHighlight || entry.stepEmphasis !== 'primary' || !entry.visible) return;
        const item = entry.item;
        const element = cache.elements[item.id];
        if (!element) return;
        applyEntrySceneVisuals(
          entry, item, element, cache.elements, cache.theme, cache.hasExternalHighlight, cache.shouldDimOthers, primaryPulseAmount,
          { pulseVisualsOnly: true },
        );
      });
      emphasisPulseOnlyRef.current = true;
      cache.board.update?.();
      emphasisPulseOnlyRef.current = false;
    };
  });

  useEffect(() => {
    const animation = stepEmphasisAnimationRef.current;
    animation.setOnPulse(() => applyPulseFromCacheRef.current());
    return () => {
      animation.setOnPulse(null);
      animation.dispose();
    };
  }, []);

  const handleBoardUpdate = (_board: any, elements: Record<string, any>, theme: ThemeColors, isStep: (id: string) => boolean, isHL: (id: string) => boolean) => {
    if (emphasisPulseOnlyRef.current) {
      return;
    }

    const storeStep = spec.steps.find(step => isStep(step.id))?.id;
    const effectiveStep = effectiveStepId || storeStep;
    const items = [...spec.points, ...spec.elements, ...spec.sliders];
    const highlightSources = [...items, ...spec.groups];
    const propHighlights = highlightSources
      .filter(item => highlightedIds.includes(item.id) || highlightedIds.includes(item.targetId ?? item.id))
      .map(item => item.id);
    const storeHighlights = highlightSources
      .filter(item => isHL(item.targetId ?? item.id))
      .map(item => item.id);
    const externalStoreHighlights = storeHighlights.filter(id => {
      const source = highlightSources.find(item => item.id === id);
      return (source?.targetId ?? source?.id) !== localTargetHighlightRef.current;
    });
    const effectiveHighlights = new Set([...propHighlights, ...storeHighlights]);
    const externalHighlightSources = new Set([...propHighlights, ...externalStoreHighlights]);
    const plan = createScenePlan(spec, {
      activeStepId: effectiveStep,
      highlightedIds: [...effectiveHighlights],
      selectedIds,
    });
    const externalHighlightRequestsDimming = plan.some(entry => entry.highlighted)
      && [...externalHighlightSources].some(id => {
        const source = highlightSources.find(item => item.id === id);
        return source?.selection.dimOthersOnHighlight !== false;
      });
    const shouldDimOthers = plan.some(entry => entry.selected) || externalHighlightRequestsDimming;
    const hasExternalHighlight = plan.some(entry => entry.highlighted);
    const hasPrimaryStepEmphasis = !hasExternalHighlight
      && plan.some(entry => entry.stepEmphasis === 'primary' && entry.visible);

    stepEmphasisAnimationRef.current.setBoard(_board);
    stepEmphasisAnimationRef.current.setActive(hasPrimaryStepEmphasis);
    emphasisSceneCacheRef.current = {
      board: _board,
      elements,
      theme,
      plan,
      hasExternalHighlight,
      shouldDimOthers,
    };
    const primaryPulseAmount = stepEmphasisAnimationRef.current.getPulseAmount();
    const stackLayoutKey = plan.map(entry => `${entry.item.id}:${entry.item.layerId}:${entry.visualOrder}`).join('|');
    if (stackLayoutKey !== lastStackLayoutRef.current) {
      lastStackLayoutRef.current = stackLayoutKey;
      const stackCount = plan.length;
      plan.forEach((entry, index) => {
        const layerNum = stackCount <= 1 ? 10 : Math.round(index * 20 / (stackCount - 1));
        applyRenderedStackLayer(elements[entry.item.id], layerNum);
      });
    }
    plan.forEach(entry => {
      const item = entry.item;
      const element = elements[item.id];
      if (!element) return;
      applyEntrySceneVisuals(
        entry, item, element, elements, theme, hasExternalHighlight, shouldDimOthers, primaryPulseAmount,
      );
    });

    const nextLiveVariables = liveVariables(elements, spec);
    const signature = JSON.stringify(nextLiveVariables);
    if (signature !== liveVariablesSignatureRef.current) {
      spec.elements.forEach(sceneItem => {
        if (sceneItem.kind !== 'functionCurve' && sceneItem.kind !== 'parametricCurve') return;
        const rendered = elements[sceneItem.id];
        if (!rendered) return;
        const samples = sampleCurveElement(sceneItem, nextLiveVariables);
        const curve = (rendered as CurveAreaComposite).__matematikaCurveArea?.curve
          ?? (Array.isArray(rendered.elements)
            ? rendered.elements[rendered.elements.length - 1]
            : rendered);
        updateSampledCurve(curve, samples);
      });
      liveVariablesSignatureRef.current = signature;
      setLiveSceneVariables(nextLiveVariables);
    }

    spec.elements.forEach(sceneItem => {
      if (sceneItem.kind !== 'functionCurve' && sceneItem.kind !== 'parametricCurve') return;
      if (!curveActsAsArea(sceneItem)) return;
      const rendered = elements[sceneItem.id] as CurveAreaComposite;
      if (!rendered) return;
      updateCurveAreaFills(rendered, spec, sceneItem, elements, _board, nextLiveVariables);
    });

    spec.elements.forEach(sceneItem => {
      if (sceneItem.kind !== 'areaIntersection') return;
      const rendered = elements[sceneItem.id] as AreaIntersectionComposite;
      if (!rendered?.__matematikaAreaIntersection) return;
      updateAreaIntersectionFills(rendered, spec, sceneItem, elements, _board);
    });
  };

  return {
    handleBoardInit,
    handleBoardUpdate,
  };
}
