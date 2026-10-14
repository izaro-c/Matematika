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
import {
  DEFAULT_ANGLE_RADIUS,
  DEFAULT_RIGHT_ANGLE_RADIUS,
  annotationAnchorParameter,
  annotationAnchorRefs,
  annotationViewportPosition,
  isConstructedPoint,
  objectDashed,
  objectLabelVisible,
  objectStyle,
  projectionSupportPoints,
  type DiagramObject,
  type DiagramSpec,
} from '@/diagrams/model'
import {
  getDiagramScale,
  resolveAdaptivePointSize,
} from '@/diagrams/render/elements/diagramAdaptiveScale';
import {resolveAreaDisplayPolygons, curveActsAsArea, sampleCurveElement, type CurvePath} from '@/diagrams/geometry';
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

/** Escena que necesita la factoría de objetos JSXGraph. */
type BoardElementScene = Pick<DiagramSpec, 'objects' | 'relations' | 'viewport' | 'showLabels'>;

/**
 * Crea el objeto JSXGraph de cualquier objeto V3 salvo los puntos con posición
 * propia y los controles, que crea el ciclo de vida del tablero.
 */
export function createElement(
  board: any,
  elements: Record<string, any>,
  item: DiagramObject,
  theme: ThemeColors,
  layer: number,
  spec: BoardElementScene,
  liftedIntoHeader = false,
  editableAnnotation = false,
) {
  const style = objectStyle(item);
  const rendered = (ids: readonly string[]) => {
    const found = ids.map(id => elements[id]);
    return found.every(Boolean) ? found : null;
  };
  const highlightable = item.selection.highlightable !== false;
  const hoverColor = !highlightable || preservesOwnColorOnHighlight(style) ? theme[item.color] : theme.ocre;
  const defaultShowLabel = isConstructedPoint(item);
  const ownLabelVisible = objectLabelVisible(item);
  const labelVisible = spec.showLabels !== false && (ownLabelVisible !== undefined ? ownLabelVisible : defaultShowLabel);
  const labelOptions = {
    visible: labelVisible,
    strokeColor: theme[item.color],
    color: theme[item.color],
    ...(style?.labelSize !== undefined ? { fontSize: style.labelSize } : {}),
    ...nativeLabelPlacementOptions(style?.labelPosition, style?.labelOffset),
  };
  const dashed = objectDashed(item);
  const lineOptions = withDiagramHoverTransition({
    strokeColor: theme[item.color],
    highlightStrokeColor: hoverColor,
    strokeWidth: style?.strokeWidth ?? 2,
    highlightStrokeWidth: style?.highlightStrokeWidth ?? 3,
    strokeOpacity: style?.strokeOpacity ?? 1,
    dash: dashed ? 2 : 0,
    fixed: true,
    layer,
    name: renderKatexTextToHtml(item.label),
    ...(labelVisible ? { withLabel: true, label: labelOptions } : {}),
  });
  const pointOptions = () => withDiagramHoverTransition({
    name: renderKatexTextToHtml(item.label),
    size: resolveAdaptivePointSize(style?.pointSize ?? 4, getDiagramScale(board)),
    fillColor: theme[item.color],
    strokeColor: theme[item.color],
    highlightFillColor: hoverColor,
    highlightStrokeColor: hoverColor,
    label: { highlightStrokeColor: hoverColor },
    fixed: true,
    layer,
  }, 'point');
  const angleOptions = {
    ...lineOptions, fillColor: theme[item.color], highlightFillColor: hoverColor,
    fillOpacity: style?.fillOpacity ?? 0.1, highlightFillOpacity: style?.highlightFillOpacity ?? 0.28,
    fixed: true, layer,
  };

  switch (item.objectType) {
    case 'point': {
      const definition = item.definition;
      if (definition.type === 'intersection') {
        const supports = rendered(definition.supports);
        return supports ? createIntersection(board, [supports[0], supports[1]], 0, pointOptions(), theme) : null;
      }
      if (definition.type === 'midpoint') {
        const points = rendered(definition.points);
        return points ? createMidpoint(board, [points[0], points[1]], pointOptions(), theme) : null;
      }
      if (definition.type === 'projection') {
        const refs = rendered([...projectionSupportPoints(definition, spec.objects), definition.point]);
        return refs ? createPerpendicularFoot(board, [refs[0], refs[1], refs[2]], pointOptions(), theme) : null;
      }
      return null;
    }
    case 'path': {
      const geometry = item.geometry;
      switch (geometry.type) {
        case 'segment': {
          if (geometry.construction) {
            const refs = rendered([...geometry.points, geometry.construction.foot]);
            return refs ? createSegmentExtensionToFoot(board, [refs[0], refs[1], refs[2]], lineOptions, theme) : null;
          }
          const refs = rendered(geometry.points);
          return refs ? createSegment(board, [refs[0], refs[1]], lineOptions, theme) : null;
        }
        case 'line': {
          const construction = geometry.construction;
          if (construction.type === 'through-points') {
            const refs = rendered(construction.points);
            return refs ? createLine(board, [refs[0], refs[1]], lineOptions, theme) : null;
          }
          if (construction.type === 'angle-bisector') {
            const refs = rendered(construction.points);
            return refs ? createAngleBisectorRay(board, [refs[0], refs[1], refs[2]], lineOptions, theme) : null;
          }
          const refs = rendered([...construction.linePoints, construction.through]);
          if (!refs) return null;
          return construction.type === 'perpendicular'
            ? createPerpendicularLine(board, [refs[0], refs[1], refs[2]], lineOptions, theme)
            : createParallelLine(board, [refs[0], refs[1], refs[2]], lineOptions, theme);
        }
        case 'ray': {
          const refs = rendered(geometry.points);
          return refs ? createRay(board, [refs[0], refs[1]], lineOptions, theme) : null;
        }
        case 'polygon': {
          const refs = rendered(geometry.points);
          return refs ? createPolygon(board, refs, withDiagramHoverTransition({
            name: renderKatexTextToHtml(item.label),
            ...(labelVisible ? { withLabel: true, label: labelOptions } : {}),
            hasInnerPoints: true,
            fillColor: theme[item.color], highlightFillColor: hoverColor, fillOpacity: style?.fillOpacity ?? 0.1,
            highlightFillOpacity: style?.highlightFillOpacity ?? 0.24,
            fixed: true,
            borders: {
              strokeColor: theme[item.color],
              highlightStrokeColor: hoverColor,
              strokeWidth: style?.strokeWidth ?? 1.5,
              strokeOpacity: style?.strokeOpacity ?? 1,
              dash: dashed ? 2 : 0,
              fixed: true,
            },
            layer,
          }), theme) : null;
        }
        case 'circle': {
          const refs = rendered([geometry.center, geometry.point]);
          return refs ? createCircle(board, [refs[0], refs[1]], {
            ...lineOptions, fillColor: theme[item.color], fillOpacity: style?.fillOpacity ?? 0,
            highlightFillOpacity: style?.highlightFillOpacity ?? 0.2,
          }, theme) : null;
        }
        case 'arc': {
          const refs = rendered(geometry.points);
          if (!refs) return null;
          const directedRefs: [typeof refs[number], typeof refs[number], typeof refs[number]] = geometry.direction === 'clockwise'
            ? [refs[0], refs[2], refs[1]]
            : [refs[0], refs[1], refs[2]];
          return createArc(board, directedRefs, lineOptions, theme);
        }
        case 'function':
        case 'parametric': {
          if (geometry.type === 'function' ? !geometry.expression : !(geometry.x && geometry.y)) return null;
          const curvePath = item as CurvePath;
          const samples = sampleCurveElement(curvePath, liveVariables(elements, spec));
          const curve = geometry.type === 'function'
            ? createFunctionCurve(board, samples, lineOptions, theme)
            : createParametricCurve(board, samples, lineOptions, theme);
          if (!curveActsAsArea(curvePath)) return curve;
          return createCurveAreaElement(board, elements, curvePath, spec, curve, withDiagramHoverTransition({
            fillColor: theme[item.color],
            fillOpacity: style?.fillOpacity ?? 0.12,
            fixed: true,
            layer,
          }), theme);
        }
        case 'poincare-geodesic':
        case 'poincare-arc': {
          const refs = rendered(geometry.refs);
          if (!refs) return null;
          return geometry.type === 'poincare-geodesic'
            ? createPoincareGeodesic(board, [refs[0], refs[1], refs[2], refs[3]], lineOptions, theme)
            : createPoincareArc(board, [refs[0], refs[1], refs[2], refs[3]], lineOptions, theme);
        }
        case 'dimension': {
          const isLabelVisible = ownLabelVisible !== false;
          const refs = rendered(geometry.points);
          return refs ? createDimensionLine(
            board,
            [refs[0], refs[1]],
            () => (liftedIntoHeader || !isLabelVisible) ? '' : reactiveText(item, elements, spec) ?? measurementText(item, elements, spec),
            geometry.offset ?? 0.35,
            {
              ...lineOptions,
              fontSize: style?.labelSize,
              textOffset: style?.textOffset ?? style?.labelOffset,
              labelVisible: isLabelVisible && !liftedIntoHeader,
            },
            theme,
          ) : null;
        }
      }
      return null;
    }
    case 'angle': {
      const refs = rendered(item.points);
      if (!refs) return null;
      if (item.marker === 'square') return createRightAngleMarker(board, [refs[0], refs[1], refs[2]], {
        ...angleOptions, hasInnerPoints: true,
        size: style?.angleRadius ?? DEFAULT_RIGHT_ANGLE_RADIUS,
      }, theme);
      const radius = style?.angleRadius ?? DEFAULT_ANGLE_RADIUS;
      if (item.sweep === 'non-reflex') return createNonReflexAngle(board, [refs[0], refs[1], refs[2]], { ...angleOptions, radius }, theme);
      return createAngle(board, item.direction === 'clockwise'
        ? [refs[2], refs[1], refs[0]]
        : [refs[0], refs[1], refs[2]], { ...angleOptions, radius }, theme);
    }
    case 'mark': {
      const refs = refsFor(item, elements);
      if (item.variant === 'congruence') return refs.length >= 2 ? createCongruenceMark(
        board,
        [refs[0], refs[1]],
        item.count,
        { ...lineOptions, markHeight: style?.markHeight ?? 0.32 },
        theme,
      ) : null;
      if (item.variant === 'parallel') return refs.length >= 2 ? createParallelMark(
        board,
        [refs[0], refs[1]],
        item.count,
        { ...lineOptions, markHeight: style?.markHeight ?? 0.42 },
        theme,
      ) : null;
      return refs.length >= 1 ? createTicks(
        board,
        [refs[0], tickDistance(item, elements, spec)],
        { ...lineOptions, majorHeight: style?.markHeight ?? 10, minorTicks: item.subdivisions ?? 4 },
        theme,
      ) : null;
    }
    case 'region': {
      const refs = rendered(item.geometry.points);
      if (item.geometry.type === 'grid-region') return refs ? createGridOverlay(
        board,
        [refs[0], refs[1], refs[2], refs[3]],
        item.geometry.rows ?? 4,
        item.geometry.columns ?? 4,
        lineOptions,
        theme,
      ) : null;
      return refs ? createAreaDecomposition(
        board,
        refs,
        item.geometry.rows ?? 2,
        item.geometry.columns ?? 2,
        { ...withDiagramHoverTransition({ hasInnerPoints: true, fillColor: theme[item.color], fillOpacity: style?.fillOpacity ?? 0.1, borders: lineOptions, fixed: true, layer }) },
        theme,
      ) : null;
    }
    case 'area': {
      const resolveBounds = () => resolveBoardViewportBounds(board, spec.viewport.bounds);
      if (item.geometry.type === 'half-plane') {
        const refs = rendered([...item.geometry.boundary, item.geometry.side]);
        if (!refs) return null;
        return createHalfPlaneFill(
          board,
          [refs[0], refs[1]],
          refs[2],
          resolveBounds,
          withDiagramHoverTransition({
            fillColor: theme[item.color],
            fillOpacity: style?.fillOpacity ?? 0.12,
            fixed: true,
            layer,
          }),
          theme,
        );
      }
      if (refsFor(item, elements).length < 2) return null;
      const liveResolver = createLiveAreaPointResolver(elements);
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
          fillOpacity: style?.fillOpacity ?? 0.14,
          fixed: true,
          layer,
        }),
        theme,
      );
      if (fills.length === 0) return null;
      return createAreaIntersectionComposite(fills);
    }
    case 'annotation':
      break;
    default:
      return null;
  }

  const anchorRefs = annotationAnchorRefs(item);
  const anchor = anchorRefs[0] ? elements[anchorRefs[0]] : undefined;
  const anchorParameter = annotationAnchorParameter(item) ?? 0.5;
  const dynamicText = () => annotationTextHtml(item, elements, spec);
  const isPanel = item.variant === 'panel';
  const textOffset = style?.textOffset ?? style?.labelOffset ?? (item.variant === 'label' ? [0.04, 0.04] : [0.25, 0.35]);
  const viewportPosition = isPanel ? annotationViewportPosition(item) : undefined;
  const viewportPanelAnchor = viewportPosition ? viewportPanelAnchors(viewportPosition) : undefined;
  const resolveAnchorCoords = (): [number, number] => {
    if (anchorRefs.length >= 2) {
      const c1 = renderedCoordinates(elements[anchorRefs[0]]);
      const c2 = renderedCoordinates(elements[anchorRefs[1]]);
      if (c1 && c2) {
        return [c1[0] + (c2[0] - c1[0]) * anchorParameter, c1[1] + (c2[1] - c1[1]) * anchorParameter];
      }
    }
    return referencedLabelAnchor(anchorRefs[0], anchorParameter, elements, spec);
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
    color: isPanel ? theme.carbon : theme[item.color],
    fixed: !editableAnnotation,
    layer,
    ...(style?.labelSize !== undefined ? { fontSize: style.labelSize } : {}),
    ...(viewportPanelAnchor ?? {}),
    cssClass: item.variant === 'formula'
      ? 'font-diagram text-sm italic'
      : isPanel
        ? `JXGtext matematika-info-panel${viewportPanelAnchor?.anchorX === 'left' ? ' matematika-info-panel--side-column' : ''}`
        : 'font-diagram text-sm',
    ...(isPanel ? {
      highlightCssClass: `JXGtext matematika-info-panel${viewportPanelAnchor?.anchorX === 'left' ? ' matematika-info-panel--side-column' : ''}`,
      highlightStrokeColor: theme.carbon,
      highlightStrokeOpacity: 1,
    } : {}),
  }), theme) : null;
}
