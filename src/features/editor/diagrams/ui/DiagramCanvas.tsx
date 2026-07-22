import React from 'react';
import { DiagramRenderer, withMovedPoint, withViewportBounds } from '@/shared/diagrams/public';
import { MathProvider } from '@/shared/lib/MathStoreContext';
import type { VisualDiagramModel, CanvasTool } from '../model/types';
import { nextPointId, point, toolReferenceCandidatesForSlot, updateElement, updateSlider } from '../model/commands';
import { DiagramViewportFrame } from './DiagramViewportFrame';

interface DiagramCanvasProps {
  model: VisualDiagramModel;
  pageType?: string;
  selectedId: string;
  selectedIds?: readonly string[];
  canvasTool: CanvasTool;
  pendingRefs: string[];
  previewHighlightId: string;
  previewStepId: string;
  onSelect: (id: string, additive?: boolean) => void;
  onModelEdit: (model: VisualDiagramModel, command?: { label?: string; mergeKey?: string }) => void;
  onChooseReferenceForTool: (referenceId: string) => boolean;
  onCompleteTool: () => void;
}

export const DiagramCanvas: React.FC<DiagramCanvasProps> = ({
  model,
  pageType,
  selectedId,
  selectedIds = [],
  canvasTool,
  pendingRefs,
  previewHighlightId,
  previewStepId,
  onSelect,
  onModelEdit,
  onChooseReferenceForTool,
  onCompleteTool,
}) => (
  <DiagramViewportFrame title="Lienzo visual" subtitle="Espacio flexible de edición · arrastre para mover · rueda para zoom" pageType={pageType} testId="diagram-editor-canvas" editing>
    <MathProvider>
      <DiagramRenderer
        spec={model}
        mode="editor"
        selectedIds={[...new Set([...selectedIds, selectedId, ...pendingRefs].filter(Boolean))]}
        highlightedIds={previewHighlightId ? [previewHighlightId] : []}
        activeStepId={previewStepId || undefined}
        onSelectionChange={(id, intent) => {
          if (canvasTool !== 'select' && canvasTool !== 'point' && toolReferenceCandidatesForSlot(model, canvasTool, pendingRefs.length).some(item => item.id === id)) {
            onChooseReferenceForTool(id);
          }
          onSelect(id, canvasTool === 'select' && intent?.additive === true);
        }}
        onPointMove={(id, x, y) => onModelEdit(
          withMovedPoint(model, id, Number(x.toFixed(2)), Number(y.toFixed(2))),
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
        onCanvasPointCreate={canvasTool === 'point' ? (x, y) => {
          const snappedX = Math.round(x * 2) / 2;
          const snappedY = Math.round(y * 2) / 2;
          const id = nextPointId(model.points);
          onModelEdit({
            ...model,
            points: [...model.points, {
              ...point(id, id.replace(/^p/, ''), snappedX, snappedY),
              order: Math.max(0, ...[...model.points, ...model.elements].filter(item => item.layerId === 'geometry').map(item => item.order)) + 1000,
            }],
            steps: model.steps.map(item => ({
              ...item,
              visibleTargets: item.visibleTargets.includes(id) ? item.visibleTargets : [...item.visibleTargets, id],
              objectStates: item.objectStates?.[id]
                ? { ...item.objectStates, [id]: { ...item.objectStates[id], visible: true } }
                : item.objectStates,
            })),
          }, { label: `Añadir punto ${id}` });
          onSelect(id);
          onCompleteTool();
        } : undefined}
        onViewportChange={(bounds, options) => {
          if (options?.persist || options?.persistHome) {
            onModelEdit(withViewportBounds(model, bounds), { label: 'Cambiar viewport', mergeKey: 'viewport' });
          }
        }}
      />
    </MathProvider>
  </DiagramViewportFrame>
);

export default DiagramCanvas;
