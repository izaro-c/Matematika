import type { ThemeColors } from '@/diagrams/jsxgraph/theme';
import {
  createAngle,
  createAngleBisectorRay,
  createArc,
  createAreaDecomposition,
  createAreaIntersectionComposite,
  createAreaIntersectionFills,
  createSegmentExtensionToFoot,
  createCircle,
  createCongruenceMark,
  createDimensionLine,
  createFunctionCurve,
  createGridOverlay,
  createHalfPlaneFill,
  createIntersection,
  createLine,
  createMidpoint,
  createNonReflexAngle,
  createParallelMark,
  createParallelLine,
  createParametricCurve,
  createPerpendicularFoot,
  createPerpendicularLine,
  createPoincareArc,
  createPoincareGeodesic,
  createPolygon,
  createRay,
  createRightAngleMarker,
  createSegment,
  createText,
  createTicks,
} from '@/diagrams/jsxgraph/MathFactory';
import { renderKatexTextToHtml } from '@/components/ui/KatexText';
import {DEFAULT_ANGLE_RADIUS, DEFAULT_RIGHT_ANGLE_RADIUS, type DiagramElement, type DiagramSpecV2} from '@/diagrams/model'
import {
  getDiagramScale,
  resolveAdaptivePointSize,
} from '@/diagrams/render/elements/diagramAdaptiveScale';
import {resolveAreaDisplayPolygons, curveActsAsArea, sampleCurveElement} from '@/diagrams/geometry';
import {
  preservesOwnColorOnHighlight,
  withDiagramHoverTransition,
} from '@/diagrams/render/interaction/diagramHover';
import {
  annotationTextHtml,
  liveVariables,
  measurementText,
  reactiveText,
  refsFor,
  tickDistance,
} from '@/diagrams/render/diagramRuntimeUtils';
import {
  renderedCoordinates,
  referencedLabelAnchor,
  viewportPanelAnchors,
  viewportPositionCoordinates,
} from '@/diagrams/render/interaction/diagramViewportAnchors';
import {
  createCurveAreaElement,
  createLiveAreaPointResolver,
  resolveBoardViewportBounds,
} from '@/diagrams/render/elements/boardElementHelpers';

/** Isometric offsets for explicit inspector compass presets only. */
export const LABEL_GAP = 14;
const LABEL_GAP_DIAG = LABEL_GAP / Math.SQRT2;

export const COMPASS_LAYOUT: Record<string, {
  anchorX: 'left' | 'middle' | 'right';
  anchorY: 'top' | 'middle' | 'bottom';
  offset: [number, number];
}> = {
  rt:   { anchorX: 'left',   anchorY: 'middle', offset: [LABEL_GAP, 0] },
  urt:  { anchorX: 'left',   anchorY: 'bottom', offset: [LABEL_GAP_DIAG, LABEL_GAP_DIAG] },
  top:  { anchorX: 'middle', anchorY: 'bottom', offset: [0, LABEL_GAP] },
  ulft: { anchorX: 'right',  anchorY: 'bottom', offset: [-LABEL_GAP_DIAG, LABEL_GAP_DIAG] },
  lft:  { anchorX: 'right',  anchorY: 'middle', offset: [-LABEL_GAP, 0] },
  llft: { anchorX: 'right',  anchorY: 'top',    offset: [-LABEL_GAP_DIAG, -LABEL_GAP_DIAG] },
  bot:  { anchorX: 'middle', anchorY: 'top',    offset: [0, -LABEL_GAP] },
  lrt:  { anchorX: 'left',   anchorY: 'top',    offset: [LABEL_GAP_DIAG, -LABEL_GAP_DIAG] },
};

export const COMPASS_OFFSET: Record<string, [number, number]> = Object.fromEntries(
  Object.entries(COMPASS_LAYOUT).map(([k, v]) => [k, v.offset]),
);

/** Explicit compass preset, or JSXGraph default (urt) for Automática — no custom auto-pick. */
export function nativeLabelPlacementOptions(
  labelPosition?: string | number,
  labelOffset?: [number, number],
): Record<string, unknown> {
  if (typeof labelPosition === 'string' && labelPosition) {
    const layout = COMPASS_LAYOUT[labelPosition] ?? COMPASS_LAYOUT.urt;
    return {
      autoPosition: false,
      position: labelPosition,
      anchorX: layout.anchorX,
      anchorY: layout.anchorY,
      offset: labelOffset ?? layout.offset,
    };
  }
  if (typeof labelPosition === 'number') {
    return {
      autoPosition: false,
      position: labelPosition,
      ...(labelOffset !== undefined ? { offset: labelOffset } : {}),
    };
  }
  // Automática: JSXGraph default — stable urt, no continuous autoPosition, no custom scorer.
  return {
    autoPosition: false,
    position: 'urt',
    ...(labelOffset !== undefined ? { offset: labelOffset } : {}),
  };
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
  const hoverColor = !highlightable || preservesOwnColorOnHighlight(item.style) ? theme[item.color] : theme.ocre;
  const defaultShowLabel = 'constraint' in item || ('kind' in item && ['intersection', 'midpoint', 'perpendicularFoot'].includes(item.kind));
  const labelVisible = spec.showLabels !== false && (item.showLabel !== undefined ? item.showLabel : defaultShowLabel);
  const labelOptions = {
    visible: labelVisible,
    strokeColor: theme[item.color],
    color: theme[item.color],
    ...(item.style?.labelSize !== undefined ? { fontSize: item.style.labelSize } : {}),
    ...nativeLabelPlacementOptions(item.style?.labelPosition, item.style?.labelOffset),
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
    borders: {
      strokeColor: theme[item.color],
      highlightStrokeColor: hoverColor,
      strokeWidth: item.style?.strokeWidth ?? 1.5,
      strokeOpacity: item.style?.strokeOpacity ?? 1,
      dash: item.dashed ? 2 : 0,
      fixed: true,
    },
    layer,
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
  const diagramScale = getDiagramScale(board);
  const adaptivePointSize = resolveAdaptivePointSize(item.style?.pointSize ?? 4, diagramScale);
  if (item.kind === 'intersection') return refs.length >= 2 ? createIntersection(board, [refs[0], refs[1]], 0, withDiagramHoverTransition({
    name: renderKatexTextToHtml(item.label),
    size: adaptivePointSize,
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
    size: adaptivePointSize,
    highlightFillColor: hoverColor, highlightStrokeColor: hoverColor,
    label: { highlightStrokeColor: hoverColor },
    fixed: true, layer,
  }, 'point'), theme) : null;
  if (item.kind === 'perpendicularFoot') return refs.length >= 3 ? createPerpendicularFoot(board, [refs[0], refs[1], refs[2]], withDiagramHoverTransition({
    name: renderKatexTextToHtml(item.label), fillColor: theme[item.color], strokeColor: theme[item.color],
    size: adaptivePointSize,
    highlightFillColor: hoverColor, highlightStrokeColor: hoverColor,
    label: { highlightStrokeColor: hoverColor },
    fixed: true, layer,
  }, 'point'), theme) : null;
  if (item.kind === 'segmentExtension') return refs.length >= 3 ? createSegmentExtensionToFoot(board, [refs[0], refs[1], refs[2]], lineOptions, theme) : null;
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
  if (item.kind === 'dimensionLine') {
    const isLabelVisible = item.showLabel !== false;
    return refs.length >= 2 ? createDimensionLine(
      board,
      [refs[0], refs[1]],
      () => (liftedIntoHeader || !isLabelVisible) ? '' : reactiveText(item, elements, spec) ?? measurementText(item, elements, spec),
      item.properties?.offset ?? 0.35,
      {
        ...lineOptions,
        fontSize: item.style?.labelSize,
        textOffset: item.style?.textOffset ?? item.style?.labelOffset,
        labelVisible: isLabelVisible && !liftedIntoHeader,
      },
      theme,
    ) : null;
  }
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
  const resolveAnchorCoords = (): [number, number] => {
    if (item.refs.length >= 2) {
      const p1 = elements[item.refs[0]];
      const p2 = elements[item.refs[1]];
      const c1 = renderedCoordinates(p1);
      const c2 = renderedCoordinates(p2);
      if (c1 && c2) {
        const t = item.properties?.anchorParameter ?? 0.5;
        return [c1[0] + (c2[0] - c1[0]) * t, c1[1] + (c2[1] - c1[1]) * t];
      }
    }
    return referencedLabelAnchor(item.refs[0], item.properties?.anchorParameter ?? 0.5, elements, spec);
  };
  const reactiveTextCoordinates: [() => number, () => number, () => string] | null = viewportPosition
    ? [
      () => viewportPositionCoordinates(board, viewportPosition, spec.viewport.bounds)[0],
      () => viewportPositionCoordinates(board, viewportPosition, spec.viewport.bounds)[1],
      dynamicText,
    ]
    : anchor
      ? [
        () => resolveAnchorCoords()[0] + textOffset[0],
        () => resolveAnchorCoords()[1] + textOffset[1],
        dynamicText,
      ]
      : null;
  const textCoordinates: [number | (() => number), number | (() => number), () => string] | null = reactiveTextCoordinates && editableAnnotation && !viewportPosition
    ? [reactiveTextCoordinates[0](), reactiveTextCoordinates[1](), dynamicText]
    : reactiveTextCoordinates;
  return textCoordinates ? createText(board, textCoordinates, withDiagramHoverTransition({
    // Info panels use DiagramInfoPanel chrome (carbon body); accent lives in block tokens.
    color: item.kind === 'infoPanel' ? theme.carbon : theme[item.color],
    fixed: !editableAnnotation,
    layer,
    ...(item.style?.labelSize !== undefined ? { fontSize: item.style.labelSize } : {}),
    ...(viewportPanelAnchor ?? {}),
    cssClass: item.kind === 'formula'
      ? 'font-diagram text-sm italic'
      : item.kind === 'infoPanel'
        ? `JXGtext matematika-info-panel${viewportPanelAnchor?.anchorX === 'left' ? ' matematika-info-panel--side-column' : ''}`
        : 'font-diagram text-sm',
    ...(item.kind === 'infoPanel' ? {
      highlightCssClass: `JXGtext matematika-info-panel${viewportPanelAnchor?.anchorX === 'left' ? ' matematika-info-panel--side-column' : ''}`,
      highlightStrokeColor: theme.carbon,
      highlightStrokeOpacity: 1,
    } : {}),
  }), theme) : null;
}
