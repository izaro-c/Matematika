import React, { useEffect, useRef, useState } from 'react';
import { DiagramRenderer, withMovedPoint, withViewportBounds } from '@/shared/diagrams/public';
import { MathProvider } from '@/shared/lib/MathStoreContext';
import type { VisualDiagramModel, CanvasTool } from '@/features/editor/diagrams/model/types';
import {
  fromEditorV2,
  nextLayerItemOrder,
  nextPointId,
  point,
  toolReferenceCandidatesForSlot,
  updateElement,
  updateSlider,
} from '@/features/editor/diagrams/model';

export interface BoardHostProps {
  model: VisualDiagramModel;
  selectedIds: readonly string[];
  activeTool: CanvasTool;
  pendingRefs: string[];
  previewHighlightId?: string;
  errorHighlightedIds?: readonly string[];
  activeStepId?: string;
  onSelect: (ids: string[], additive?: boolean) => void;
  onModelEdit: (next: VisualDiagramModel, command?: { label?: string; mergeKey?: string }) => void;
  onChooseReferenceForTool: (refId: string) => boolean;
  onCompleteTool: () => void;
  className?: string;
}

const MIN_HOST_SIZE = 8;

export const BoardHost: React.FC<BoardHostProps> = ({
  model,
  selectedIds,
  activeTool,
  pendingRefs,
  previewHighlightId,
  errorHighlightedIds = [],
  activeStepId,
  onSelect,
  onModelEdit,
  onChooseReferenceForTool,
  onCompleteTool,
  className,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hasSize = size.w >= MIN_HOST_SIZE && size.h >= MIN_HOST_SIZE;
  const combinedSelectedIds = [...new Set([...selectedIds, ...pendingRefs])];

  return (
    <div ref={hostRef} className={`relative h-full w-full ${className ?? ''}`}>
      {hasSize ? (
        <MathProvider>
          <DiagramRenderer
            spec={model}
            mode="editor"
            viewportControls={false}
            stepControls={false}
            className="h-full w-full"
            selectedIds={combinedSelectedIds}
            highlightedIds={previewHighlightId ? [previewHighlightId] : []}
            errorHighlightedIds={errorHighlightedIds}
            activeStepId={activeStepId ?? ''}
            onSelectionChange={(id, intent) => {
              if (
                activeTool !== 'select'
                && activeTool !== 'point'
                && toolReferenceCandidatesForSlot(model, activeTool, pendingRefs.length).some(item => item.id === id)
              ) {
                onChooseReferenceForTool(id);
                return;
              }
              onSelect([id], activeTool === 'select' && intent?.additive === true);
            }}
            onPointMove={(id, x, y) => onModelEdit(
              fromEditorV2(withMovedPoint(model, id, Number(x.toFixed(2)), Number(y.toFixed(2)))),
              { label: `Mover ${id}` },
            )}
            onSliderChange={(id, value) => onModelEdit(
              updateSlider(model, id, { value: Number(value.toFixed(4)) }),
              { label: `Ajustar ${id}`, mergeKey: `slider:${id}` },
            )}
            onAnnotationMove={(id, placement) => {
              const annotation = model.elements.find(item => item.id === id);
              if (!annotation) return;
              onModelEdit(updateElement(model, id, {
                ...(placement.textOffset ? { style: { ...annotation.style, textOffset: placement.textOffset } } : {}),
                ...(placement.viewportPosition ? { properties: { ...annotation.properties, viewportPosition: placement.viewportPosition } } : {}),
              }), { label: `Mover ${id}`, mergeKey: `annotation:${id}` });
            }}
            onCanvasPointCreate={activeTool === 'point' ? (x, y) => {
              const snappedX = Math.round(x * 2) / 2;
              const snappedY = Math.round(y * 2) / 2;
              const id = nextPointId(model.points);
              onModelEdit({
                ...model,
                points: [...model.points, {
                  ...point(id, id.replace(/^p/, ''), snappedX, snappedY),
                  order: nextLayerItemOrder(model, 'geometry'),
                }],
                steps: model.steps.map(item => ({
                  ...item,
                  visibleTargets: item.visibleTargets.includes(id) ? item.visibleTargets : [...item.visibleTargets, id],
                  objectStates: item.objectStates?.[id]
                    ? { ...item.objectStates, [id]: { ...item.objectStates[id], visible: true } }
                    : item.objectStates,
                })),
              }, { label: `Añadir punto ${id}` });
              onSelect([id]);
              onCompleteTool();
            } : undefined}
            onViewportChange={(bounds, options) => {
              if (options?.persist || options?.persistHome) {
                onModelEdit(withViewportBounds(model, bounds), { label: 'Cambiar viewport', mergeKey: 'viewport' });
              }
            }}
          />
        </MathProvider>
      ) : (
        <div data-testid="v2-board-skeleton" className="h-full w-full" />
      )}
    </div>
  );
};
