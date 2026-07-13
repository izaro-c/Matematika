import React, { useMemo, useState } from 'react';
import { MathBoard, type ThemeColors } from '../core/MathBoard';
import {
  createAngle,
  createAngleBisectorRay,
  createBaseExtensionToFoot,
  createCircle,
  createGlider,
  createLine,
  createMidpoint,
  createParallelLine,
  createPerpendicularFoot,
  createPerpendicularLine,
  createPoint,
  createPolygon,
  createRay,
  createRightAngleMarker,
  createSegment,
  createSlider,
  createText,
} from '../core/MathFactory';
import { DiagramInfoPanel, DiagramTitle } from '@/shared/ui/DiagramOverlay';
import {
  DIAGRAM_RENDERER_ID,
  createSceneConstructionPlan,
  createScenePlan,
  fitViewport,
  itemLayerNumber,
  offscreenItemIds,
  recoverViewport,
  sceneRevision,
  withViewportBounds,
  zoomViewport,
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

function createElement(board: any, elements: Record<string, any>, item: DiagramElement, theme: ThemeColors, layer: number) {
  const refs = refsFor(item, elements);
  const lineOptions = { strokeColor: theme[item.color], strokeWidth: 2.4, dash: item.dashed ? 2 : 0, layer };
  if (item.kind === 'segment') return refs.length >= 2 ? createSegment(board, [refs[0], refs[1]], lineOptions, theme) : null;
  if (item.kind === 'line') return refs.length >= 2 ? createLine(board, [refs[0], refs[1]], lineOptions, theme) : null;
  if (item.kind === 'ray') return refs.length >= 2 ? createRay(board, [refs[0], refs[1]], lineOptions, theme) : null;
  if (item.kind === 'polygon') return refs.length >= 3 ? createPolygon(board, refs, {
    fillColor: theme[item.color], fillOpacity: 0.16, borders: { strokeColor: theme[item.color], strokeWidth: 1.5 }, layer,
  }, theme) : null;
  if (item.kind === 'circle') return refs.length >= 2 ? createCircle(board, [refs[0], refs[1]], lineOptions, theme) : null;
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
    fillColor: theme[item.color], strokeColor: theme[item.color], layer,
  }, theme) : null;
  if (item.kind === 'rightAngle') return refs.length >= 3 ? createRightAngleMarker(board, [refs[0], refs[1], refs[2]], {
    fillColor: theme[item.color], strokeColor: theme[item.color], layer,
  }, theme) : null;
  const anchor = refs[0];
  return anchor ? createText(board, [() => anchor.X() + 0.25, () => anchor.Y() + 0.35, item.text || item.label], {
    color: theme[item.color], layer,
  }, theme) : null;
}

function attachSelection(element: any, item: DiagramSceneItem, mode: DiagramRendererProps['mode'], onSelectionChange?: (id: string) => void) {
  if (!element) return;
  const node = element.rendNode as HTMLElement | undefined;
  node?.setAttribute('aria-label', item.selection.ariaLabel ?? item.label);
  if (item.selection.role) node?.setAttribute('data-selection-role', item.selection.role);
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

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({
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
}) => {
  const [viewportState, setViewportState] = useState({
    base: spec.viewport.bounds,
    current: spec.viewport.bounds,
  });
  const bounds = sameBounds(viewportState.base, spec.viewport.bounds)
    ? viewportState.current
    : spec.viewport.bounds;
  const revision = useMemo(() => sceneRevision(spec), [spec]);

  const commitBounds = (next: DiagramBounds) => {
    setViewportState({ base: spec.viewport.bounds, current: next });
    onViewportChange?.(next);
  };

  const runtimeSpec = bounds === spec.viewport.bounds ? spec : withViewportBounds(spec, bounds);
  const missingItems = offscreenItemIds(runtimeSpec, bounds);

  return (
    <div
      className={`relative min-h-[360px] overflow-hidden rounded border border-carbon/10 bg-lienzo ${className ?? ''}`}
      data-diagram-renderer={DIAGRAM_RENDERER_ID}
      data-diagram-mode={mode}
    >
      <MathBoard
        boundingbox={bounds}
        axis={spec.axis}
        grid={spec.grid}
        pan
        zoom
        revision={revision}
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
              const item = sceneItem.constraint === 'glider' && sceneItem.gliderTarget
                ? createGlider(board, [sceneItem.x, sceneItem.y, elements[sceneItem.gliderTarget]], {
                  name: sceneItem.label,
                  fixed: sceneItem.fixed || entry.locked,
                  fillColor: theme[sceneItem.color],
                  strokeColor: theme[sceneItem.color],
                  layer: itemLayerNumber(spec, sceneItem),
                }, theme)
                : createPoint(board, [sceneItem.x, sceneItem.y], {
                  name: sceneItem.label,
                  fixed: sceneItem.fixed || entry.locked,
                  fillColor: theme[sceneItem.color],
                  strokeColor: theme[sceneItem.color],
                  layer: itemLayerNumber(spec, sceneItem),
                }, theme);
              elements[sceneItem.id] = item;
              if (sceneItem.constraint === 'horizontal' && !sceneItem.fixed) item.on('drag', () => item.moveTo([item.X(), sceneItem.y], 0));
              if (sceneItem.constraint === 'vertical' && !sceneItem.fixed) item.on('drag', () => item.moveTo([sceneItem.x, item.Y()], 0));
              if (!sceneItem.fixed && !entry.locked) item.on('up', () => onPointMove?.(sceneItem.id, item.X(), item.Y()));
            } else if ('kind' in sceneItem) {
              elements[sceneItem.id] = createElement(board, elements, sceneItem, theme, itemLayerNumber(spec, sceneItem));
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
            attachSelection(elements[sceneItem.id], sceneItem, mode, onSelectionChange);
          });
        }}
        onUpdate={(_board, elements, theme, isStep, isHL) => {
          const storeStep = spec.steps.find(step => isStep(step.id))?.id;
          const effectiveStep = activeStepId || storeStep;
          const effectiveHighlights = new Set([
            ...highlightedIds,
            ...[...spec.points, ...spec.elements, ...spec.sliders].filter(item => isHL(item.id)).map(item => item.id),
          ]);
          const plan = createScenePlan(spec, {
            activeStepId: effectiveStep,
            highlightedIds: [...effectiveHighlights],
            selectedIds,
          });
          const anyEmphasis = plan.some(entry => entry.highlighted || entry.selected);
          plan.forEach(entry => {
            const item = entry.item;
            const element = elements[item.id];
            if (!element) return;
            const active = entry.highlighted || entry.selected;
            const opacity = active || !anyEmphasis ? 1 : 0.28;
            const color = active ? theme.ocre : theme[item.color];
            const visible = entry.visible && (('kind' in item && item.kind === 'baseExtension')
              ? outsideBaseExtension(elements[item.refs[0]], elements[item.refs[1]], elements[item.refs[2]])
              : true);
            const base = { visible, layer: itemLayerNumber(spec, item), opacity };
            if ('constraint' in item) {
              element.setAttribute({ ...base, size: active ? 8.5 : 5, fillColor: color, strokeColor: color, fillOpacity: opacity });
            } else if ('min' in item) {
              element.setAttribute({ ...base, strokeColor: color });
            } else if (item.kind === 'polygon') {
              element.setAttribute({ ...base, fillColor: color, fillOpacity: active ? 0.34 : 0.16 * opacity });
            } else if (item.kind === 'angle' || item.kind === 'rightAngle') {
              element.setAttribute({ ...base, fillColor: color, strokeColor: color, fillOpacity: active ? 0.45 : 0.18 * opacity, strokeWidth: active ? 3 : 1.5 });
            } else if (item.kind === 'midpoint' || item.kind === 'perpendicularFoot') {
              element.setAttribute({ ...base, size: active ? 8.5 : 5, fillColor: color, strokeColor: color, fillOpacity: opacity });
            } else if (item.kind === 'text' || item.kind === 'measurement') {
              element.setAttribute({ ...base, color });
            } else {
              element.setAttribute({ ...base, strokeColor: color, strokeOpacity: opacity, strokeWidth: active ? 4.8 : 2.4 });
            }
          });
        }}
      >
        <DiagramTitle>{spec.title}</DiagramTitle>
        {spec.note && (
          <DiagramInfoPanel title="Exploración" position="bottom-right">
            <span>{spec.note}</span>
          </DiagramInfoPanel>
        )}
      </MathBoard>

      {viewportControls && (
        <div className="absolute right-2 top-2 z-20 flex items-center gap-1 rounded border border-carbon/15 bg-lienzo/95 p-1 shadow-sm" aria-label="Controles del viewport">
          <button type="button" className="rounded px-2 py-1 text-xs font-bold text-carbon hover:bg-carbon/5" aria-label="Acercar" onClick={() => commitBounds(zoomViewport(spec, bounds, 1.25))}>+</button>
          <button type="button" className="rounded px-2 py-1 text-xs font-bold text-carbon hover:bg-carbon/5" aria-label="Alejar" onClick={() => commitBounds(zoomViewport(spec, bounds, 0.8))}>−</button>
          <button type="button" className="rounded px-2 py-1 text-[10px] font-bold text-carbon hover:bg-carbon/5" onClick={() => commitBounds(fitViewport(spec))}>Ajustar</button>
          <button
            type="button"
            className="rounded px-2 py-1 text-[10px] font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40"
            disabled={missingItems.length === 0}
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

DiagramRenderer.displayName = 'DiagramRenderer';

export default DiagramRenderer;
