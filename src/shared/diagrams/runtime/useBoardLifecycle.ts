import type { MutableRefObject } from 'react';
import JXG from 'jsxgraph';
import type { ThemeColors } from '../core/MathBoard';
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
} from '../spec';
import {
  attachLabelSelection,
  attachSelection,
  diagramPointerSelectionWasHandled,
  releaseAuthoredAttraction,
  releaseInactiveAttractions,
  suspendInactiveAttractors,
  synchronizeElementAndLabelHover,
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

export {
  conditionAllows,
  intersectionBelongsToSupports,
  liveVariables,
  outsideBaseExtension,
  refsFor,
  sliderMaximum,
  tickDistance,
};

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
  state: { visible: boolean; color: string; highlightColor: string; opacity: number; text: string; fontSize?: number; labelPosition?: string | number; offset?: [number, number] },
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
  label.setText?.(renderKatexTextToHtml(state.text));
  (label.rendNode as HTMLElement | undefined)?.style.setProperty('--diagram-label-highlight-color', state.highlightColor);
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
  if (label.fullUpdate) label.fullUpdate();
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
    highlight: highlightable,
    ...(item.style?.labelSize !== undefined ? { fontSize: item.style.labelSize } : {}),
    ...(typeof item.style?.labelPosition === 'string' ? { position: item.style.labelPosition } : {}),
    ...(item.style?.labelOffset !== undefined ? { offset: item.style.labelOffset } : {}),
  };
  const lineOptions = {
    highlight: highlightable,
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
  };
  if (item.kind === 'segment') return refs.length >= 2 ? createSegment(board, [refs[0], refs[1]], lineOptions, theme) : null;
  if (item.kind === 'line') return refs.length >= 2 ? createLine(board, [refs[0], refs[1]], lineOptions, theme) : null;
  if (item.kind === 'ray') return refs.length >= 2 ? createRay(board, [refs[0], refs[1]], lineOptions, theme) : null;
  if (item.kind === 'polygon') return refs.length >= 3 ? createPolygon(board, refs, {
    highlight: highlightable,
    hasInnerPoints: true,
    fillColor: theme[item.color], highlightFillColor: hoverColor, fillOpacity: item.style?.fillOpacity ?? 0.1,
    highlightFillOpacity: item.style?.highlightFillOpacity ?? 0.24,
    fixed: true,
    borders: { highlight: highlightable, strokeColor: theme[item.color], strokeWidth: item.style?.strokeWidth ?? 1.5, strokeOpacity: item.style?.strokeOpacity ?? 1, dash: item.dashed ? 2 : 0, fixed: true }, layer,
  }, theme) : null;
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
    const domain = item.properties.domain ?? [-5, 5];
    const parameter = item.properties.parameter ?? 'x';
    const samples = item.properties.samples ?? 128;
    return createFunctionCurve(board, value => {
      try {
        return evaluateMathExpression(item.properties?.expression ?? '0', { ...liveVariables(elements, spec), [parameter]: value, x: value });
      } catch {
        return Number.NaN;
      }
    }, domain, { ...lineOptions, numberPointsHigh: samples, numberPointsLow: Math.min(samples, 64) }, theme);
  }
  if (item.kind === 'parametricCurve' && item.properties?.xExpression && item.properties.yExpression) {
    const domain = item.properties.domain ?? [0, Math.PI * 2];
    const parameter = item.properties.parameter ?? 't';
    const samples = item.properties.samples ?? 128;
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
      { ...lineOptions, numberPointsHigh: samples, numberPointsLow: Math.min(samples, 64) },
      theme,
    );
  }
  if (item.kind === 'poincareGeodesic') return refs.length >= 4 ? createPoincareGeodesic(board, [refs[0], refs[1], refs[2], refs[3]], lineOptions, theme) : null;
  if (item.kind === 'poincareArc') return refs.length >= 4 ? createPoincareArc(board, [refs[0], refs[1], refs[2], refs[3]], lineOptions, theme) : null;
  if (item.kind === 'intersection') return refs.length >= 2 ? createIntersection(board, [refs[0], refs[1]], 0, {
    highlight: highlightable,
    name: renderKatexTextToHtml(item.label),
    size: item.style?.pointSize ?? 4,
    fillColor: theme[item.color],
    strokeColor: theme[item.color],
    highlightFillColor: hoverColor,
    highlightStrokeColor: hoverColor,
    label: { highlight: highlightable, highlightStrokeColor: hoverColor },
    fixed: true,
    layer,
  }, theme) : null;
  if (item.kind === 'midpoint') return refs.length >= 2 ? createMidpoint(board, [refs[0], refs[1]], {
    highlight: highlightable,
    name: renderKatexTextToHtml(item.label), fillColor: theme[item.color], strokeColor: theme[item.color],
    size: item.style?.pointSize ?? 4,
    highlightFillColor: hoverColor, highlightStrokeColor: hoverColor,
    label: { highlight: highlightable, highlightStrokeColor: hoverColor },
    fixed: true, layer,
  }, theme) : null;
  if (item.kind === 'perpendicularFoot') return refs.length >= 3 ? createPerpendicularFoot(board, [refs[0], refs[1], refs[2]], {
    highlight: highlightable,
    name: renderKatexTextToHtml(item.label), fillColor: theme[item.color], strokeColor: theme[item.color],
    size: item.style?.pointSize ?? 4,
    highlightFillColor: hoverColor, highlightStrokeColor: hoverColor,
    label: { highlight: highlightable, highlightStrokeColor: hoverColor },
    fixed: true, layer,
  }, theme) : null;
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
    { highlight: highlightable, hasInnerPoints: true, fillColor: theme[item.color], fillOpacity: item.style?.fillOpacity ?? 0.1, borders: lineOptions, fixed: true, layer },
    theme,
  ) : null;
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
  return textCoordinates ? createText(board, textCoordinates, {
    highlight: highlightable,
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
  }, theme) : null;
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
  liveVariablesSignature: MutableRefObject<string>;
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
  liveVariablesSignature,
}: UseBoardLifecycleOptions) {
  const handleBoardInit = (board: any, elements: Record<string, any>, theme: ThemeColors) => {
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
        highlight: highlightable,
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
          ], {
            highlight: highlightable,
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
          }, theme)
          : gliderTarget
          ? createGlider(board, [sceneItem.x, sceneItem.y, elements[gliderTarget]], {
            highlight: highlightable,
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
          }, theme)
          : createPoint(board, [sceneItem.x, sceneItem.y], {
            highlight: highlightable,
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
          }, theme);
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
        elements[sceneItem.id] = createSlider(board, [[sceneItem.x, sceneItem.y], [sceneItem.x + 2.6, sceneItem.y]], [sceneItem.min, Math.min(sceneItem.value, maximum), maximum], {
          highlight: highlightable,
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
          label: { highlight: highlightable, highlightStrokeColor: hoverColor },
          fixed: directInteractionLocked,
          layer: itemLayerNumber(spec, sceneItem),
        }, theme);
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
      synchronizeElementAndLabelHover(element, sceneItem);
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

  const handleBoardUpdate = (_board: any, elements: Record<string, any>, theme: ThemeColors, isStep: (id: string) => boolean, isHL: (id: string) => boolean) => {
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
    plan.forEach(entry => {
      const item = entry.item;
      const element = elements[item.id];
      if (!element) return;
      const externalActive = entry.highlighted || entry.selected;
      const stepPrimary = !hasExternalHighlight && entry.stepEmphasis === 'primary';
      const stepSecondary = !hasExternalHighlight && entry.stepEmphasis === 'secondary';
      const active = externalActive || stepPrimary || stepSecondary;
      const opacity = externalActive || !shouldDimOthers ? 1 : 0.28;
      const color = externalActive && !item.style?.preserveColorOnHighlight
        ? theme.ocre
        : (stepPrimary || stepSecondary) && entry.stepEmphasisColor
          ? theme[entry.stepEmphasisColor]
          : theme[item.color];
      const sceneVisible = mode === 'editor' && externalActive
        ? true
        : entry.visible || (externalActive && item.style?.highlightVisible === true);
      const conditionVisible = mode === 'editor' && externalActive
        ? true
        : externalActive && item.style?.highlightVisible === true
        ? true
        : conditionAllows(item, elements, spec);
      const visible = sceneVisible && conditionVisible
        && (('kind' in item && item.kind === 'baseExtension')
          ? outsideBaseExtension(elements[item.refs[0]], elements[item.refs[1]], elements[item.refs[2]])
          : true)
        && (('kind' in item && item.kind === 'intersection')
          ? intersectionBelongsToSupports(item, element, elements, spec)
          : true);
      const base = {
        visible,
        fixed: 'kind' in item ? true : entry.locked || !item.selection.selectable,
      };
      const hoverColor = item.selection.highlightable === false || item.style?.preserveColorOnHighlight ? theme[item.color] : theme.ocre;
      const defaultShowLabel = 'constraint' in item || ('kind' in item && ['intersection', 'midpoint', 'perpendicularFoot', 'angle', 'nonReflexAngle'].includes(item.kind));
      const nativeLabelVisible = visible && spec.showLabels !== false
        && ('showLabel' in item && item.showLabel !== undefined ? item.showLabel : defaultShowLabel);
      syncNativeElementLabel(element, {
        visible: nativeLabelVisible,
        color,
        highlightColor: hoverColor,
        opacity,
        text: entry.label,
        fontSize: item.style?.labelSize,
        labelPosition: item.style?.labelPosition,
        offset: item.style?.labelOffset,
      });
      if (element.__matematikaStepLabel !== entry.label) {
        element.setAttribute?.({ name: renderKatexTextToHtml(entry.label) });
        element.__matematikaStepLabel = entry.label;
      }
      if ('constraint' in item || ('kind' in item && (item.kind === 'intersection' || item.kind === 'midpoint' || item.kind === 'perpendicularFoot'))) {
        element.setAttribute({
          ...base,
          size: active ? item.style?.highlightPointSize ?? 7 : item.style?.pointSize ?? 4,
          fillColor: color, strokeColor: color, fillOpacity: opacity,
        });
      } else if ('min' in item) {
        const maximum = sliderMaximum(item, elements, spec);
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
        element.setAttribute({ ...base, strokeColor: color, strokeOpacity: opacity });
      } else if (item.kind === 'polygon' || item.kind === 'areaDecomposition') {
        element.setAttribute({
          ...base, fillColor: color,
          fillOpacity: active ? item.style?.highlightFillOpacity ?? 0.24 : (item.style?.fillOpacity ?? 0.1) * opacity,
        });
      } else if (item.kind === 'angle' || item.kind === 'nonReflexAngle' || item.kind === 'rightAngle' || item.kind === 'perpendicularMark') {
        element.setAttribute({
          ...base, fillColor: color, strokeColor: color,
          fillOpacity: active ? item.style?.highlightFillOpacity ?? 0.28 : (item.style?.fillOpacity ?? 0.1) * opacity,
          strokeWidth: active ? item.style?.highlightStrokeWidth ?? 3 : item.style?.strokeWidth ?? 1.5,
        });
      } else if (item.kind === 'measureTicks') {
        element.setAttribute({
          ...base,
          ticksDistance: tickDistance(item, elements, spec),
          strokeColor: color,
          strokeOpacity: (item.style?.strokeOpacity ?? 1) * opacity,
          strokeWidth: externalActive ? item.style?.highlightStrokeWidth ?? 3.6 : item.style?.strokeWidth ?? 2,
        });
      } else if (item.kind === 'text' || item.kind === 'label' || item.kind === 'formula' || item.kind === 'infoPanel' || item.kind === 'measurement') {
        const liftedIntoHeader = mode === 'runtime' && allHeaderItemIds.has(item.id);
        const isAuthoredLabelHidden = item.kind === 'label' && spec.showLabels === false;
        element.setAttribute({ ...base, visible: base.visible && !liftedIntoHeader && !isAuthoredLabelHidden, color, opacity });
        if (item.kind !== 'label') {
          const textContent = annotationTextHtml(item, elements, spec);
          if (element.__matematikaLastText !== textContent) {
            if (typeof element.setText === 'function') {
              element.setText(textContent);
            }
            element.__matematikaLastText = textContent;
          }
        }
      } else if (item.kind === 'circle') {
        element.setAttribute({
          ...base,
          fillColor: theme[item.color],
          fillOpacity: externalActive
            ? item.style?.highlightFillOpacity ?? 0.2
            : (item.style?.fillOpacity ?? 0) * opacity,
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
  };

  return {
    handleBoardInit,
    handleBoardUpdate,
  };
}
