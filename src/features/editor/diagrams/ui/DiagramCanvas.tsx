import React from 'react';
import { DiagramRenderer, withMovedPoint, withViewportBounds } from '@/shared/diagrams/public';
import { MathProvider } from '@/shared/lib/MathStoreContext';
import type { VisualDiagramModel, CanvasTool } from '../model/types';
import { nextPointId, point, toolReferenceCandidates } from '../model/commands';
import { DiagramViewportFrame } from './DiagramViewportFrame';

interface DiagramCanvasProps {
  model: VisualDiagramModel;
  pageType?: string;
  selectedId: string;
  canvasTool: CanvasTool;
  pendingRefs: string[];
  previewHighlightId: string;
  previewStepId: string;
  onSelect: (id: string) => void;
  onModelEdit: (model: VisualDiagramModel, command?: { label?: string; mergeKey?: string }) => void;
  onChooseReferenceForTool: (referenceId: string) => boolean;
  onCompleteTool: () => void;
}

export const DiagramCanvas: React.FC<DiagramCanvasProps> = ({
  model,
  pageType,
  selectedId,
  canvasTool,
  pendingRefs,
  previewHighlightId,
  previewStepId,
  onSelect,
  onModelEdit,
  onChooseReferenceForTool,
  onCompleteTool,
}) => (
  <DiagramViewportFrame title="Lienzo visual" subtitle="Renderer compartido · arrastre para mover o desplazar · rueda para zoom" pageType={pageType} testId="diagram-editor-canvas">
    <MathProvider>
      <DiagramRenderer
        spec={model}
        mode="editor"
        selectedIds={[selectedId, ...pendingRefs].filter(Boolean)}
        highlightedIds={previewHighlightId ? [previewHighlightId] : []}
        activeStepId={previewStepId || undefined}
        onSelectionChange={(id) => {
          if (canvasTool !== 'select' && canvasTool !== 'point' && toolReferenceCandidates(model, canvasTool).some(item => item.id === id)) {
            onChooseReferenceForTool(id);
          }
          onSelect(id);
        }}
        onPointMove={(id, x, y) => onModelEdit(
          withMovedPoint(model, id, Number(x.toFixed(2)), Number(y.toFixed(2))),
          { label: `Mover ${id}` },
        )}
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
        onViewportChange={(bounds) => onModelEdit(withViewportBounds(model, bounds), { label: 'Cambiar viewport', mergeKey: 'viewport' })}
      />
    </MathProvider>
  </DiagramViewportFrame>
);

export default DiagramCanvas;
