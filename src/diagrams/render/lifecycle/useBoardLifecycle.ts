/** ponytail: large module; split into named files under this folder when a change needs isolation. */
import { useEffect, useLayoutEffect, useRef, type MutableRefObject } from 'react';
import JXG from 'jsxgraph';
import type { ThemeColors } from '@/diagrams/jsxgraph/theme';
import { safeBoardUpdate, setExactPointPosition } from '@/diagrams/jsxgraph/MathUtils';
import {
  type AreaIntersectionComposite,
  createGlider,
  type CurveAreaComposite,
  updateSampledCurve,
  createPoint,
  createSlider,
} from '@/diagrams/jsxgraph/MathFactory';
import { applyBoardStackLayer } from '@/diagrams/jsxgraph/htmlTextLayer';
import { createDiagramButton, isDiagramButton } from '@/diagrams/render/elements/diagramButton';
import { renderKatexTextToHtml } from '@/components/ui/KatexText';
import {
  DEFAULT_RIGHT_ANGLE_RADIUS,
  annotationAnchorParameter,
  annotationAnchorRefs,
  annotationViewportPosition,
  evaluateMathExpression,
  findObject,
  isAnnotationObject,
  isControlObject,
  isPositionedPoint,
  objectConstructionReferences,
  objectDashed,
  objectKind,
  objectLabelVisible,
  objectStyle,
  pointIsImmovable,
  pointPosition,
  withPointPosition,
  type DiagramBounds,
  type DiagramSpec,
} from '@/diagrams/model'
import {createSceneConstructionPlan, createScenePlan, isCurveObject, itemLayerNumber, withMovedPoint, nextCandidatePointInDirection, curveActsAsArea, onSupportTargetId, sampleCurveElement} from '@/diagrams/geometry';
import {
  attachLabelSelection,
  attachSelection,
  attachDiagramHoverHandlers,
  diagramPointerSelectionWasHandled,
  releaseAuthoredAttraction,
  releaseInactiveAttractions,
  suspendInactiveAttractors,
} from '@/diagrams/render/interaction/useDiagramSelection';
import type { DiagramAnnotationPlacement, DiagramSelectionIntent } from '@/diagrams/render/interaction/useDiagramSelection';
import {
  annotationTextHtml,
  conditionAllows,
  intersectionBelongsToSupports,
  liveVariables,
  outsideSegmentExtension,
  refsFor,
  sliderMaximum,
  tickDistance,
} from '@/diagrams/render/diagramRuntimeUtils';
import { coordinatesToViewportPosition, referencedLabelAnchor } from '@/diagrams/render/interaction/diagramViewportAnchors';
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
} from '@/diagrams/render/stepEmphasisAnimation';
import {
  commitElementVisuals,
  createDiagramHoverController,
  diagramVisualTransitionKey,
  preservesOwnColorOnHighlight,
  shouldAnimateDiagramVisuals,
  withDiagramHoverTransition,
  type DiagramHoverController,
} from '@/diagrams/render/interaction/diagramHover';
import {
  buildVisualOrderById,
  installTopmostOnlyHitTesting,
  resolveCanvasSelectionHitId,
} from '@/diagrams/render/interaction/diagramTopmostHit';
import {
  updateAreaIntersectionFills,
  updateCurveAreaFills,
} from '@/diagrams/render/elements/boardElementHelpers';
import { createElement, nativeLabelPlacementOptions } from '@/diagrams/render/elements/createBoardElement';
import { applyDiagramAuthoredFontSize } from '@/diagrams/diagramTextScale';

export {
  conditionAllows,
  intersectionBelongsToSupports,
  liveVariables,
  outsideSegmentExtension,
  refsFor,
  sliderMaximum,
  tickDistance,
};


/** Punto → extremos del soporte `on`/glider (p. ej. D → [B, C] en rayo BC). */
function supportParentsByPointId(spec: DiagramSpec): Map<string, readonly string[]> {
  const parents = new Map<string, readonly string[]>();
  spec.objects.forEach(point => {
    if (!isPositionedPoint(point)) return;
    const supportId = onSupportTargetId(spec, point);
    if (!supportId) return;
    const support = findObject(spec, supportId);
    const refs = support && support.objectType !== 'point' ? objectConstructionReferences(support) : [];
    if (!refs.length) return;
    parents.set(point.id, refs);
  });
  return parents;
}

function pointLikeIdsFromSpec(spec: DiagramSpec): Set<string> {
  return new Set(spec.objects.filter(item => item.objectType === 'point').map(item => item.id));
}

function installDiagramHitTesting(
  spec: DiagramSpec,
  elements: Record<string, any>,
  plan: ReturnType<typeof createScenePlan>,
  getHoveredId?: () => string | null | undefined,
): void {
  const selectableIds = new Set(
    spec.objects
      .filter(item => item.selection.selectable)
      .map(item => item.id),
  );
  installTopmostOnlyHitTesting(
    elements,
    buildVisualOrderById(plan),
    supportParentsByPointId(spec),
    selectableIds,
    pointLikeIdsFromSpec(spec),
    getHoveredId,
  );
}


function applyRenderedStackLayer(element: any, layer: number) {
  if (!element) return;
  if (element.__matematikaCurveArea) {
    element.__matematikaCurveArea.fills.forEach((fill: unknown) => {
      applyRenderedStackLayer(fill, layer);
    });
    applyRenderedStackLayer(element.__matematikaCurveArea.curve, layer + 1);
    return;
  }
  applyBoardStackLayer(element, layer);
  if (element.label) applyBoardStackLayer(element.label, layer + 1);
  if (Array.isArray(element.borders)) {
    element.borders.forEach((border: unknown) => applyBoardStackLayer(border as Parameters<typeof applyBoardStackLayer>[0], layer));
  }
  ['point1', 'point2', 'center', 'arc', 'sector', 'ticks'].forEach(key => {
    const child = element[key];
    if (child && !Array.isArray(child)) applyBoardStackLayer(child, layer);
    if (Array.isArray(child)) child.forEach((item: unknown) => applyBoardStackLayer(item as Parameters<typeof applyBoardStackLayer>[0], layer));
  });
  if (Array.isArray(element.vertices)) {
    element.vertices.forEach((vertex: unknown) => applyBoardStackLayer(vertex as Parameters<typeof applyBoardStackLayer>[0], layer));
  }
  if (Array.isArray(element.elements)) {
    element.elements.forEach((child: unknown) => applyRenderedStackLayer(child, layer));
  }
}

export function calculateLineLabelAnchor(element: any, t: number): any {
  if (!element.point1 || !element.point2 || !element.board) {
    return new JXG.Coords(JXG.COORDS_BY_USER, [0, 0], element.board);
  }

  const p1Usr = element.point1.coords?.usrCoords ?? [1, element.point1.X(), element.point1.Y()];
  const p2Usr = element.point2.coords?.usrCoords ?? [1, element.point2.X(), element.point2.Y()];

  const isP2Ideal = Math.abs(p2Usr[0]) < 1e-9;
  const p2Normalized = isP2Ideal
    ? [1, p1Usr[1] + p2Usr[1], p1Usr[2] + p2Usr[2]]
    : p2Usr;

  const c1 = new JXG.Coords(JXG.COORDS_BY_USER, [p1Usr[1], p1Usr[2]], element.board);
  const c2 = new JXG.Coords(JXG.COORDS_BY_USER, [p2Normalized[1], p2Normalized[2]], element.board);

  const isInfiniteLine = (
    element.elType === 'line'
    || element.elType === 'parallel'
    || element.elType === 'perpendicular'
    || (typeof element.evalVisProp === 'function' && (Boolean(element.evalVisProp('straightfirst')) || Boolean(element.evalVisProp('straightlast'))))
  );

  const jxgGeometry = JXG?.Math?.Geometry as any;
  if (
    isInfiniteLine
    && typeof element.evalVisProp === 'function'
    && typeof jxgGeometry?.calcStraight === 'function'
  ) {
    jxgGeometry.calcStraight(element, c1, c2, 20);
  }

  const x1 = c1.usrCoords[1];
  const y1 = c1.usrCoords[2];
  const x2 = c2.usrCoords[1];
  const y2 = c2.usrCoords[2];

  const x = x1 + t * (x2 - x1);
  const y = y1 + t * (y2 - y1);
  return new JXG.Coords(JXG.COORDS_BY_USER, [x, y], element.board);
}

function nativeElementLabel(element: any): any | null {
  const label = element?.label;
  return label && label !== element && typeof label.setAttribute === 'function' ? label : null;
}

export function syncNativeElementLabel(
  element: any,
  state: { visible: boolean; color: string; highlightColor: string; opacity: number; text: string; fontSize?: number; labelPosition?: string | number; offset?: [number, number]; highlighted?: boolean },
) {
  const label = nativeElementLabel(element);
  if (!label) return;

  const visible = state.visible && state.text.trim().length > 0;
  const isLineParametric = typeof state.labelPosition === 'number'
    && (
      element.elType === 'line'
      || element.elType === 'parallel'
      || element.elType === 'perpendicular'
      || element.elType === 'segment'
      || element.elType === 'arrow'
      || (typeof element.evalVisProp === 'function' && (Boolean(element.evalVisProp('straightfirst')) || Boolean(element.evalVisProp('straightlast'))))
    );

  const visualSignature = JSON.stringify({
    visible,
    color: state.color,
    highlightColor: state.highlightColor,
    opacity: state.opacity,
    text: state.text,
    fontSize: state.fontSize,
    highlighted: Boolean(state.highlighted),
  });
  const layoutSignature = JSON.stringify({
    labelPosition: state.labelPosition,
    offset: state.offset,
    isLineParametric,
  });

  const visualChanged = element.__matematikaLabelVisualSignature !== visualSignature;
  const layoutChanged = element.__matematikaLabelLayoutSignature !== layoutSignature;
  if (!visualChanged && !layoutChanged) return;
  element.__matematikaLabelVisualSignature = visualSignature;
  element.__matematikaLabelLayoutSignature = layoutSignature;

  if (visualChanged) {
    label.setText?.(renderKatexTextToHtml(state.text));
    const labelNode = label.rendNode as HTMLElement | undefined;
    labelNode?.style.setProperty('--diagram-label-highlight-color', state.highlightColor);
    if (state.highlighted) {
      labelNode?.classList.add('matematika-point-label--highlight');
    } else {
      labelNode?.classList.remove('matematika-point-label--highlight');
    }
    label.setAttribute?.({
      visible,
      color: state.color,
      strokeColor: state.color,
      highlightStrokeColor: state.highlightColor,
      opacity: state.opacity,
      strokeOpacity: state.opacity,
      highlightStrokeOpacity: state.opacity,
      ...(state.fontSize !== undefined ? { fontSize: state.fontSize } : {}),
    });
    applyDiagramAuthoredFontSize(labelNode, state.fontSize);
  }

  if (layoutChanged) {
    if (!element.__matematikaOriginalGetLabelAnchor && typeof element.getLabelAnchor === 'function') {
      element.__matematikaOriginalGetLabelAnchor = element.getLabelAnchor;
    }

    if (isLineParametric) {
      const t = state.labelPosition as number;
      const finalOffset = state.offset ?? [0, 0];
      label.setAttribute?.({
        autoPosition: false,
        anchorX: 'center',
        anchorY: 'middle',
        offset: finalOffset,
      });
      if (label.visProp) {
        label.visProp.autoPosition = false;
        label.visProp.anchorx = 'center';
        label.visProp.anchory = 'middle';
        label.visProp.offset = [...finalOffset];
        if (label.visProp.islabel === undefined) label.visProp.islabel = true;
      }
      element.getLabelAnchor = () => calculateLineLabelAnchor(element, t);
      delete label.X;
      delete label.Y;
    } else {
      if (element.__matematikaOriginalGetLabelAnchor) {
        element.getLabelAnchor = element.__matematikaOriginalGetLabelAnchor;
      }
      const placement = nativeLabelPlacementOptions(state.labelPosition, state.offset);
      label.setAttribute?.(placement);
      element.setAttribute?.({ label: placement });
    }
  }

  element.__matematikaLabelPosition = typeof state.labelPosition === 'string' ? state.labelPosition : undefined;

  label.needsUpdate = true;
  if (label.update) label.update();
}


type ResolvedDragCoords = Map<string, { x: number; y: number }>;

/**
 * Durante un arrastre, el punto arrastrado encadena la última posición resuelta
 * (restricciones 1D continuas). Los puntos sobre un soporte (glider / `on`) que
 * no se están arrastrando usan siempre la posición viva de JSXGraph: el glider
 * ya los mantiene en el soporte y una coordenada resuelta obsoleta los haría
 * deslizar al re-proyectarse.
 */
function buildLiveDragSpec(
  spec: DiagramSpec,
  elements: Record<string, JXG.GeometryElement | undefined>,
  draggedPointId: string,
  resolvedCoords: ResolvedDragCoords,
): DiagramSpec {
  return {
    ...spec,
    objects: spec.objects.map(object => {
      if (isControlObject(object)) {
        const rendered = elements[object.id] as JXG.Slider | undefined;
        return rendered?.Value ? { ...object, value: rendered.Value() } : object;
      }
      if (!isPositionedPoint(object)) return object;
      const rendered = elements[object.id] as JXG.Point | undefined;
      if (object.id !== draggedPointId && onSupportTargetId(spec, object) && rendered) {
        return withPointPosition(object, { x: rendered.X(), y: rendered.Y() });
      }
      const resolved = resolvedCoords.get(object.id);
      if (resolved) return withPointPosition(object, resolved);
      return rendered ? withPointPosition(object, { x: rendered.X(), y: rendered.Y() }) : object;
    }),
  };
}

/** Posiciones de los puntos con posición propia de una escena resuelta. */
function positionedCoordinates(spec: DiagramSpec): Array<{ id: string; x: number; y: number }> {
  return spec.objects.flatMap(object => {
    if (!isPositionedPoint(object)) return [];
    const position = pointPosition(object)!;
    return [{ id: object.id, x: position.x, y: position.y }];
  });
}

export interface UseBoardLifecycleOptions {
  spec: DiagramSpec;
  mode?: 'runtime' | 'editor' | 'preview';
  selectedIds?: readonly string[];
  highlightedIds?: readonly string[];
  errorHighlightedIds?: readonly string[];
  effectiveStepId?: string;
  bounds: DiagramBounds;
  readOnly?: boolean;
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
  errorHighlightedIds = [],
  effectiveStepId,
  bounds,
  readOnly = false,
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
  const specRef = useRef(spec);
  useLayoutEffect(() => {
    specRef.current = spec;
  }, [spec]);
  const highlightedIdsRef = useRef(highlightedIds);
  useLayoutEffect(() => {
    highlightedIdsRef.current = highlightedIds;
  }, [highlightedIds]);
  const errorHighlightedIdsRef = useRef(errorHighlightedIds);
  useLayoutEffect(() => {
    errorHighlightedIdsRef.current = errorHighlightedIds;
  }, [errorHighlightedIds]);

  const handleBoardInit = (board: any, elements: Record<string, any>, theme: ThemeColors) => {
    const resolvedDragCoordsRef: ResolvedDragCoords = new Map();
    hoverControllerRef.current = createDiagramHoverController();
    board.dehighlightAll?.();
    const hoverController = hoverControllerRef.current;
    const requestSceneUpdate = () => safeBoardUpdate(board);
    const boardContainer = board.containerObj ?? board.renderer?.container;
    boardContainer?.addEventListener('mouseleave', () => hoverController.clearAll(requestSceneUpdate));
    if (mode === 'editor') {
      board.on('down', (event: unknown) => {
        const objects = board.getAllObjectsUnderMouse?.(event);
        if (!diagramPointerSelectionWasHandled(event) && Array.isArray(objects)) {
          const liveSpec = specRef.current;
          const selectableIds = new Set(liveSpec.objects
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
            return match ? [match[0]] : [];
          });
          const selectedHitId = resolveCanvasSelectionHitId({
            hitIds,
            selectableIds,
            visualOrderById: buildVisualOrderById(createScenePlan(liveSpec)),
            supportParentsByPointId: supportParentsByPointId(liveSpec),
            pointLikeIds: pointLikeIdsFromSpec(liveSpec),
            hoveredId: hoverController.getHoveredId(),
            targetId,
          });
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
      const directInteractionLocked = readOnly || entry.locked || !sceneItem.selection.selectable;
      const highlightable = sceneItem.selection.highlightable !== false;
      const sceneStyle = objectStyle(sceneItem);
      const hoverColor = !highlightable || preservesOwnColorOnHighlight(sceneStyle) ? theme[sceneItem.color] : theme.ocre;
      const pointLabelOptions = {
        visible: spec.showLabels !== false && objectLabelVisible(sceneItem) !== false,
        ...(isPositionedPoint(sceneItem) && sceneStyle?.labelSize !== undefined ? { fontSize: sceneStyle.labelSize } : {}),
        ...(isPositionedPoint(sceneItem)
          ? nativeLabelPlacementOptions(sceneStyle?.labelPosition, sceneStyle?.labelOffset)
          : {}),
        highlightStrokeColor: hoverColor,
      };
      if (isPositionedPoint(sceneItem)) {
        const position = pointPosition(sceneItem)!;
        const derivedDefinition = sceneItem.definition.type === 'expression' ? sceneItem.definition : undefined;
        const interaction = sceneItem.interaction;
        const authoredPointSize = sceneStyle?.pointSize ?? 4;
        const authoredHighlightPointSize = sceneStyle?.highlightPointSize ?? 6;
        const gliderTarget = onSupportTargetId(spec, sceneItem);
        const attractors = interaction?.attractorIds?.map(id => elements[id]).filter(Boolean) ?? [];
        const attractionOptions = !directInteractionLocked
          ? {
            attractors,
            attractorDistance: interaction?.attractorDistance ?? 0.4,
            snatchDistance: interaction?.snatchDistance ?? 0.6,
          }
          : {};
        const item = derivedDefinition
          ? createPoint(board, [
            () => {
              try { return evaluateMathExpression(derivedDefinition.x, liveVariables(elements, spec)); } catch { return position.x; }
            },
            () => {
              try { return evaluateMathExpression(derivedDefinition.y, liveVariables(elements, spec)); } catch { return position.y; }
            },
          ], withDiagramHoverTransition({
            name: renderKatexTextToHtml(sceneItem.label),
            fixed: true,
            size: authoredPointSize,
            highlightSize: authoredHighlightPointSize,
            fillColor: theme[sceneItem.color],
            strokeColor: theme[sceneItem.color],
            highlightFillColor: hoverColor,
            highlightStrokeColor: hoverColor,
            label: pointLabelOptions,
            layer: itemLayerNumber(spec, sceneItem),
          }, 'point'), theme)
          : gliderTarget && elements[gliderTarget]
          ? createGlider(board, [position.x, position.y, elements[gliderTarget]], withDiagramHoverTransition({
            name: renderKatexTextToHtml(sceneItem.label),
            fixed: directInteractionLocked,
            size: authoredPointSize,
            highlightSize: authoredHighlightPointSize,
            fillColor: theme[sceneItem.color],
            strokeColor: theme[sceneItem.color],
            highlightFillColor: hoverColor,
            highlightStrokeColor: hoverColor,
            label: pointLabelOptions,
            layer: itemLayerNumber(spec, sceneItem),
          }, 'point'), theme)
          : createPoint(board, [position.x, position.y], withDiagramHoverTransition({
            name: renderKatexTextToHtml(sceneItem.label),
            fixed: directInteractionLocked,
            size: authoredPointSize,
            highlightSize: authoredHighlightPointSize,
            fillColor: theme[sceneItem.color],
            strokeColor: theme[sceneItem.color],
            highlightFillColor: hoverColor,
            highlightStrokeColor: hoverColor,
            label: pointLabelOptions,
            layer: itemLayerNumber(spec, sceneItem),
            ...attractionOptions,
            ...(interaction?.snapToGrid && !directInteractionLocked ? {
              snapToGrid: true,
              snapSizeX: interaction.snapSize ?? 0.5,
              snapSizeY: interaction.snapSize ?? 0.5,
            } : {}),
          }, 'point'), theme);
        elements[sceneItem.id] = item;
        if (!directInteractionLocked && !derivedDefinition) {
          let enforcing = false;
          item.on('drag', () => {
            if (enforcing) return;
            releaseInactiveAttractions(spec, elements, sceneItem.id);
            // El punto arrastrado encadena la última posición resuelta (si existe) para
            // que las restricciones 1D (on + sameSide) avancen de forma continua
            // fotograma a fotograma. Los demás puntos usan la última posición
            // resuelta por el motor de restricciones cuando existe; si no, la de
            // JSXGraph (varios puntos arrastrados a la vez en el mismo gesto).
            const liveSpec = buildLiveDragSpec(spec, elements, sceneItem.id, resolvedDragCoordsRef);
            const nextSpec = withMovedPoint(liveSpec, sceneItem.id, item.X(), item.Y());
            const nextPoints = positionedCoordinates(nextSpec);
            nextPoints.forEach(point => {
              resolvedDragCoordsRef.set(point.id, { x: point.x, y: point.y });
            });
            enforcing = true;
            const restoreInactiveAttractors = suspendInactiveAttractors(spec, elements, sceneItem.id);
            try {
              // Cada punto se reposiciona sin disparar su propio board.update()
              // (JXG.Point#moveTo con time=0 llama a board.update() internamente);
              // una única reconciliación al final evita repetir el trabajo por
              // cada punto afectado en el mismo fotograma de arrastre.
              // Se usa `setExactPointPosition` (no `setPosition` directo): esta
              // coordenada ya es el resultado RESUELTO del motor de
              // restricciones, y `setPosition` reaplicaría snapToGrid/attractToGrid
              // sobre ella, pudiendo redondearla de vuelta al lado equivocado de
              // un límite (p. ej. deshaciendo el recorte de sameSide).
              let anyMoved = false;
              nextPoints.forEach(nextPoint => {
                const renderedPoint = elements[nextPoint.id];
                if (!renderedPoint) return;
                if (Math.abs(nextPoint.x - renderedPoint.X()) <= 1e-8 && Math.abs(nextPoint.y - renderedPoint.Y()) <= 1e-8) return;
                setExactPointPosition(renderedPoint, JXG.COORDS_BY_USER, [nextPoint.x, nextPoint.y]);
                anyMoved = true;
              });
              if (anyMoved) safeBoardUpdate(board);
            } finally {
              restoreInactiveAttractors();
              enforcing = false;
            }
          });
        }
        if (!directInteractionLocked && !derivedDefinition) item.on('up', () => {
          resolvedDragCoordsRef.clear();
          const finalX = item.X();
          const finalY = item.Y();
          const released = releaseAuthoredAttraction(sceneItem, elements);
          const releasedOthers = releaseInactiveAttractions(spec, elements, sceneItem.id);
          if (released || releasedOthers) safeBoardUpdate(board);
          interactionCallbacksRef.current.onPointMove?.(sceneItem.id, finalX, finalY);
        });
      } else if (!isControlObject(sceneItem)) {
        const annotation = isAnnotationObject(sceneItem) ? sceneItem : undefined;
        elements[sceneItem.id] = createElement(
          board,
          elements,
          sceneItem,
          theme,
          itemLayerNumber(spec, sceneItem),
          spec,
          mode === 'runtime' && allHeaderItemIds.has(sceneItem.id),
          mode === 'editor' && !directInteractionLocked && Boolean(annotation),
        );
        if (!directInteractionLocked && annotation) {
          elements[sceneItem.id]?.on?.('up', () => {
            const rendered = elements[sceneItem.id];
            const x = rendered?.X?.();
            const y = rendered?.Y?.();
            if (!Number.isFinite(x) || !Number.isFinite(y)) return;
            if (annotation.variant === 'panel' && annotationViewportPosition(annotation)) {
              interactionCallbacksRef.current.onAnnotationMove?.(sceneItem.id, {
                viewportPosition: coordinatesToViewportPosition(board, [x, y], bounds),
              });
              return;
            }
            const anchor = referencedLabelAnchor(annotationAnchorRefs(annotation)[0], annotationAnchorParameter(annotation) ?? 0.5, elements, spec);
            interactionCallbacksRef.current.onAnnotationMove?.(sceneItem.id, {
              textOffset: [x - anchor[0], y - anchor[1]],
            });
          });
        }
      } else if (sceneItem.variant === 'button') {
        elements[sceneItem.id] = createDiagramButton(board, sceneItem, {
          labelHtml: renderKatexTextToHtml(sceneItem.label),
          valueLabelsHtml: sceneItem.action?.valueLabels?.map(text => renderKatexTextToHtml(text)),
          theme,
          disabled: directInteractionLocked,
          layer: itemLayerNumber(spec, sceneItem),
          runEffect: effect => {
            const evaluate = (source: string) => evaluateMathExpression(source, liveVariables(elements, spec));
            try {
              if (effect.when && evaluate(effect.when) === 0) return;
              const control = elements[effect.control];
              if (effect.do === 'play') {
                if (isDiagramButton(control)) control.play(effect.from ? evaluate(effect.from) : undefined);
              } else if (isDiagramButton(control)) control.resetValue();
              else {
                const initialControl = findObject(spec, effect.control);
                const initial = isControlObject(initialControl) ? initialControl.value : undefined;
                if (initial !== undefined) control?.setValue?.(initial);
              }
              safeBoardUpdate(board);
            } catch {
              // Una expresión inválida no debe bloquear la pulsación; el esquema ya la señala.
            }
          },
        });
      } else {
        const maximum = sliderMaximum(sceneItem, elements, spec);
        const sliderWidth = sceneItem.width ?? 2.6;
        const [sliderX, sliderY] = sceneItem.position;
        elements[sceneItem.id] = createSlider(board, [[sliderX, sliderY], [sliderX + sliderWidth, sliderY]], [sceneItem.range.min, Math.min(sceneItem.value, maximum), maximum], withDiagramHoverTransition({
          name: renderKatexTextToHtml(sceneItem.label),
          snapWidth: sceneItem.range.step,
          fillColor: theme[sceneItem.color],
          strokeColor: theme[sceneItem.color],
          highlightFillColor: hoverColor,
          highlightStrokeColor: hoverColor,
          ...(!highlightable ? {
            baseline: { highlight: false, strokeColor: theme.mora, strokeWidth: 2 },
            highline: { highlight: false, strokeColor: theme.terracota, strokeWidth: 3 },
            point1: { highlight: false },
            point2: { highlight: false },
          } : {}),
          label: { highlightStrokeColor: hoverColor },
          fixed: directInteractionLocked,
          layer: itemLayerNumber(spec, sceneItem),
        }), theme);
        if (!directInteractionLocked) {
          const notifySliderChange = () => {
            interactionCallbacksRef.current.onSliderChange?.(sceneItem.id, elements[sceneItem.id].Value());
          };
          elements[sceneItem.id]?.on?.('drag', notifySliderChange);
          elements[sceneItem.id]?.on?.('up', notifySliderChange);
        }
      }
      const element = elements[sceneItem.id];
      const keyboardAdjust = isPositionedPoint(sceneItem) && !directInteractionLocked && sceneItem.definition.type !== 'expression'
        ? (key: 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'Home' | 'End', largeStep: boolean) => {
          if (key === 'Home' || key === 'End') return;
          releaseInactiveAttractions(spec, elements, sceneItem.id);
          const step = (bounds[2] - bounds[0]) / (largeStep ? 20 : 100);
          const dx = key === 'ArrowLeft' ? -step : key === 'ArrowRight' ? step : 0;
          const dy = key === 'ArrowDown' ? -step : key === 'ArrowUp' ? step : 0;
          const liveSpec = buildLiveDragSpec(spec, elements, sceneItem.id, resolvedDragCoordsRef);
          // Con posiciones discretas (`on-points`) cada pulsación salta al candidato siguiente.
          const livePoint = liveSpec.objects.find(object => object.id === sceneItem.id);
          const requested = (isPositionedPoint(livePoint) ? nextCandidatePointInDirection(liveSpec, livePoint, { x: dx, y: dy }) : undefined)
            ?? { x: element.X() + dx, y: element.Y() + dy };
          const nextSpec = withMovedPoint(liveSpec, sceneItem.id, requested.x, requested.y);
          const nextPoints = positionedCoordinates(nextSpec);
          nextPoints.forEach(point => {
            resolvedDragCoordsRef.set(point.id, { x: point.x, y: point.y });
          });
          const restoreInactiveAttractors = suspendInactiveAttractors(spec, elements, sceneItem.id);
          try {
            // Mismo patrón que el manejador de arrastre: reposicionar sin
            // disparar un board.update() por punto, reconciliar una sola vez,
            // y usar `setExactPointPosition` para que snapToGrid/attractToGrid
            // no redondeen la coordenada ya resuelta por las restricciones.
            nextPoints.forEach(nextPoint => {
              const renderedPoint = elements[nextPoint.id];
              if (!renderedPoint) return;
              setExactPointPosition(renderedPoint, JXG.COORDS_BY_USER, [nextPoint.x, nextPoint.y]);
            });
          } finally {
            restoreInactiveAttractors();
          }
          releaseAuthoredAttraction(sceneItem, elements);
          safeBoardUpdate(board);
          interactionCallbacksRef.current.onPointMove?.(sceneItem.id, element.X(), element.Y());
          const node = element.rendNode as HTMLElement | undefined;
          node?.setAttribute('aria-label', `${sceneItem.selection.ariaLabel ?? sceneItem.label}: x ${element.X().toFixed(2)}, y ${element.Y().toFixed(2)}`);
        }
        : isControlObject(sceneItem) && !directInteractionLocked && sceneItem.variant !== 'button'
          ? (key: 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'Home' | 'End', largeStep: boolean) => {
            const delta = sceneItem.range.step * (largeStep ? 10 : 1);
            const current = element.Value?.() ?? sceneItem.value;
            const maximum = sliderMaximum(sceneItem, elements, spec);
            const next = key === 'Home'
              ? sceneItem.range.min
              : key === 'End'
                ? maximum
                : Math.min(maximum, Math.max(sceneItem.range.min, current + (key === 'ArrowLeft' || key === 'ArrowDown' ? -delta : delta)));
            element.setValue?.(next);
            safeBoardUpdate(board);
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
      if (isControlObject(sceneItem) && sceneItem.range.maxExpression) {
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

    spec.objects.forEach(point => {
      if (!isPositionedPoint(point)) return;
      const element = elements[point.id];
      if (!element) return;
      const directInteractionLocked = readOnly || point.locked || !point.selection.selectable;
      if (directInteractionLocked) {
        if (element.visProp) {
          element.visProp.attractors = [];
        }
        return;
      }
      const attractors = point.interaction?.attractorIds?.map(id => elements[id]).filter(Boolean) ?? [];
      element.setAttribute({
        attractorDistance: point.interaction?.attractorDistance ?? 0.4,
        snatchDistance: point.interaction?.snatchDistance ?? 0.6,
      });
      if (element.visProp) {
        element.visProp.attractors = attractors;
      }
    });

    // Hit preferido: cima del apilado, o glider dependiente si solapa con un extremo.
    installDiagramHitTesting(spec, elements, createScenePlan(spec), () => hoverControllerRef.current.getHoveredId());
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
    options: { pulseVisualsOnly?: boolean; durationMs?: number } = {},
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
    const kind = objectKind(item);
    const effectiveDashed = entry.stepDashed ?? objectDashed(item);
    const opacity = externalActive || !sceneShouldDimOthers ? 1 : 0.28;
    const hoverOnly = hoverActive && !sceneHighlighted;
    const primaryHighlight = highlightedIdsRef.current.includes(item.id)
      || highlightedIdsRef.current.includes(item.targetId ?? item.id);
    const errorHighlight = !primaryHighlight && (
      errorHighlightedIdsRef.current.includes(item.id)
      || errorHighlightedIdsRef.current.includes(item.targetId ?? item.id)
    );
    const highlightColor = primaryHighlight
      ? sceneTheme.ocre
      : errorHighlight
        ? sceneTheme.granada
        : sceneTheme.ocre;
    const color = externalActive
      ? (sceneStyle?.preserveColorOnHighlight === true ? sceneTheme[entry.color] : highlightColor)
      : hoverOnly && !preservesOwnColorOnHighlight(sceneStyle)
        ? highlightColor
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
      && ((item.objectType === 'path' && item.geometry.type === 'segment' && item.geometry.construction)
        ? outsideSegmentExtension(sceneElements[item.geometry.points[0]], sceneElements[item.geometry.points[1]], sceneElements[item.geometry.construction.foot])
        : true)
      && (kind === 'intersection'
        ? intersectionBelongsToSupports(item, element, sceneElements, spec)
        : true);
    const base = {
      visible,
      fixed: isPositionedPoint(item) || isControlObject(item) ? entry.locked || !item.selection.selectable : true,
    };
    const hoverColor = item.selection.highlightable === false || preservesOwnColorOnHighlight(sceneStyle) ? sceneTheme[entry.color] : sceneTheme.ocre;
    const selectable = item.selection.selectable !== false;
    const rendNode = element.rendNode as HTMLElement | undefined;
    rendNode?.setAttribute('data-diagram-selectable', String(selectable));
    if (rendNode) {
      // Fuera del editor, un punto que el alumno puede arrastrar se anuncia con la mano de agarre.
      const draggable = isPositionedPoint(item) && !base.fixed && !pointIsImmovable(item);
      rendNode.style.cursor = mode === 'editor' ? (selectable ? 'pointer' : '') : (draggable ? 'grab' : '');
    }
    element.borders?.forEach((border: { rendNode?: HTMLElement }) => {
      border.rendNode?.setAttribute('data-diagram-selectable', String(selectable));
      if (border.rendNode) border.rendNode.style.cursor = selectable && mode === 'editor' ? 'pointer' : '';
    });
    const defaultShowLabel = item.objectType === 'point';
    const ownLabelVisible = objectLabelVisible(item);
    const nativeLabelVisible = visible && spec.showLabels !== false
      && (entry.stepShowLabel !== undefined
        ? entry.stepShowLabel
        : (ownLabelVisible !== undefined ? ownLabelVisible : defaultShowLabel));
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
    if (item.objectType === 'point') {
      // Opacidad propia del punto: atenúa relleno y trazo. Con 0 queda un asa
      // invisible (p. ej. sobre una punta de flecha) que reaparece al pasar el ratón.
      const ownOpacity = item.appearance?.opacity;
      commitElementVisuals(element, base, {
        size: resolveStepEmphasisPointSize(sceneStyle, emphasisState),
        fillColor: color,
        strokeColor: color,
        fillOpacity: resolveStepEmphasisPointFillOpacity(opacity * (ownOpacity ?? 1), emphasisState),
        ...(ownOpacity !== undefined ? { strokeOpacity: opacity * ownOpacity } : {}),
      }, shouldAnimate);
    } else if (item.objectType === 'control' && isDiagramButton(element)) {
      if (entry.stepValue !== undefined && element.__matematikaStepValue !== entry.stepValue) {
        const animated = typeof options.durationMs === 'number' && options.durationMs > 0;
        if (animated) element.animateTo(entry.stepValue);
        else element.setValue(entry.stepValue);
        element.__matematikaStepValue = entry.stepValue;
      } else if (entry.stepValue === undefined && element.__matematikaStepValue !== undefined) {
        element.resetValue();
        delete element.__matematikaStepValue;
      }
      if (element.__matematikaVisible !== base.visible) {
        element.setAttribute?.({ visible: base.visible });
        element.__matematikaVisible = base.visible;
      }
      if (element.rendNode) element.rendNode.style.opacity = String(opacity);
    } else if (item.objectType === 'control') {
      const maximum = sliderMaximum(item, sceneElements, spec);
      if (element.__matematikaMaximum !== maximum) {
        const current = element.Value?.() ?? item.value;
        element.setMax?.(maximum);
        element.setValue?.(Math.min(maximum, Math.max(item.range.min, current)));
        element.__matematikaMaximum = maximum;
      }
      const currentStepDuration = options.durationMs;
      if (entry.stepValue !== undefined && element.__matematikaStepValue !== entry.stepValue) {
        const targetVal = Math.min(maximum, entry.stepValue);
        const shouldSmoothAnimate = typeof currentStepDuration === 'number' && currentStepDuration > 0
          && element.point1 && element.point2 && typeof element.moveTo === 'function';
        if (shouldSmoothAnimate) {
          const p1 = element.point1;
          const p2 = element.point2;
          const min = typeof element._smin === 'number' ? element._smin : item.range.min;
          const max = typeof element._smax === 'number' ? element._smax : maximum;
          const ratio = max > min ? Math.max(0, Math.min(1, (targetVal - min) / (max - min))) : 0;
          const targetX = p1.X() + ratio * (p2.X() - p1.X());
          const targetY = p1.Y() + ratio * (p2.Y() - p1.Y());
          element.moveTo([targetX, targetY], currentStepDuration);
        } else {
          element.setValue?.(targetVal);
        }
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
    } else if (curveActsAsArea(item)) {
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
    } else if (kind === 'polygon' || kind === 'areaDecomposition' || kind === 'halfPlane' || kind === 'areaIntersection') {
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
    } else if (item.objectType === 'angle') {
      const isPolygonAngle = item.marker === 'square';
      if (isPolygonAngle) {
        const polygonAttrs = buildPolygonEmphasisAttributes(color, sceneStyle, emphasisState, opacity, {
          fill: { normal: 0.1, highlight: 0.28 },
          stroke: { normal: 1.5, primary: 2.6, highlight: 3.2, secondary: 2.2 },
        });
        const angleSize = (sceneStyle?.angleRadius !== undefined || emphasisState.stepPrimary)
          ? resolveStepEmphasisAngleRadius(sceneStyle, emphasisState, DEFAULT_RIGHT_ANGLE_RADIUS)
          : undefined;
        const dashedBorder = { ...polygonAttrs.borderAttrs, dash: effectiveDashed ? 2 : 0 };
        commitElementVisuals(
          element,
          {
            ...base,
            fillColor: polygonAttrs.fillColor,
            borders: { ...polygonAttrs.borders, dash: effectiveDashed ? 2 : 0 },
          },
          { fillOpacity: polygonAttrs.fillOpacity, ...(angleSize !== undefined ? { radius: angleSize } : {}) },
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
          },
          shouldAnimate,
        );
      }
    } else if (item.objectType === 'mark' && item.variant === 'graduation') {
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
    } else if (item.objectType === 'mark') {
      const defaultHeight = objectStyle(item)?.markHeight ?? (item.variant === 'parallel' ? 0.42 : 0.32);
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
    } else if (kind === 'dimensionLine') {
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
    } else if (kind === 'grid') {
      const gridLine = buildLineEmphasisAttributes(color, sceneStyle, emphasisState, opacity, {
        normal: 0.8,
        primary: 2,
        highlight: 2.8,
        secondary: 1.2,
      });
      commitElementVisuals(element, { ...base, dash: effectiveDashed ? 2 : 0 }, gridLine, shouldAnimate);
    } else if (item.objectType === 'annotation') {
      const liftedIntoHeader = mode === 'runtime' && allHeaderItemIds.has(item.id);
      const isAuthoredLabelHidden = item.variant === 'label' && spec.showLabels === false;
      const sceneOpacity = resolveStepEmphasisSceneOpacity(emphasisState, opacity);
      const annotationVisible = entry.stepShowLabel !== undefined
        ? entry.stepShowLabel
        : base.visible && !liftedIntoHeader && !isAuthoredLabelHidden;
      const fontSize = resolveStepEmphasisFontSize(sceneStyle, emphasisState, sceneStyle?.labelSize);
      commitElementVisuals(
        element,
        { ...base, visible: annotationVisible, color },
        { opacity: sceneOpacity, ...(fontSize !== undefined ? { fontSize } : {}) },
        shouldAnimate,
      );
      if (item.variant !== 'label') {
        const textContent = annotationTextHtml(item, sceneElements, spec);
        if (element.__matematikaLastText !== textContent) {
          if (typeof element.setText === 'function') {
            element.setText(textContent);
          }
          element.__matematikaLastText = textContent;
        }
      }
    } else if (kind === 'circle') {
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
    const effectiveStep = effectiveStepId ?? storeStep;
    const items = spec.objects;
    const highlightSources = [...items, ...spec.groups];
    const propHighlights = highlightSources
      .filter(item => highlightedIds.includes(item.id) || highlightedIds.includes(item.targetId ?? item.id))
      .map(item => item.id);
    const errorHighlights = highlightSources
      .filter(item => errorHighlightedIds.includes(item.id) || errorHighlightedIds.includes(item.targetId ?? item.id))
      .map(item => item.id);
    const storeHighlights = highlightSources
      .filter(item => isHL(item.targetId ?? item.id))
      .map(item => item.id);
    const externalStoreHighlights = storeHighlights.filter(id => {
      const source = highlightSources.find(item => item.id === id);
      return (source?.targetId ?? source?.id) !== localTargetHighlightRef.current;
    });
    const effectiveHighlights = new Set([...propHighlights, ...storeHighlights, ...errorHighlights]);
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
    const stackLayoutKey = plan.map(entry => `${entry.item.id}:${entry.item.layerId}:${entry.visualOrder}:${entry.item.selection.selectable ? 1 : 0}`).join('|');
    if (stackLayoutKey !== lastStackLayoutRef.current) {
      lastStackLayoutRef.current = stackLayoutKey;
      const stackCount = plan.length;
      plan.forEach((entry, index) => {
        const layerNum = stackCount <= 1 ? 10 : Math.round(index * 20 / (stackCount - 1));
        applyRenderedStackLayer(elements[entry.item.id], layerNum);
      });
      installDiagramHitTesting(spec, elements, plan, () => hoverControllerRef.current.getHoveredId());
    }
    const activeStepObj = spec.steps.find(step => step.id === effectiveStep);
    const durationMs = activeStepObj?.durationMs ?? 600;
    plan.forEach(entry => {
      const item = entry.item;
      const element = elements[item.id];
      if (!element) return;
      applyEntrySceneVisuals(
        entry, item, element, elements, theme, hasExternalHighlight, shouldDimOthers, primaryPulseAmount,
        { durationMs },
      );
    });

    const nextLiveVariables = liveVariables(elements, spec);
    const signature = JSON.stringify(nextLiveVariables);
    if (signature !== liveVariablesSignatureRef.current) {
      spec.objects.forEach(sceneItem => {
        if (!isCurveObject(sceneItem)) return;
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

    spec.objects.forEach(sceneItem => {
      if (!curveActsAsArea(sceneItem)) return;
      const rendered = elements[sceneItem.id] as CurveAreaComposite;
      if (!rendered) return;
      updateCurveAreaFills(rendered, spec, sceneItem, elements, _board, nextLiveVariables);
    });

    spec.objects.forEach(sceneItem => {
      if (objectKind(sceneItem) !== 'areaIntersection') return;
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
