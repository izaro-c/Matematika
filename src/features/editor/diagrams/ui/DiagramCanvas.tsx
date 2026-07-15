import React from 'react';
import { DiagramRenderer, withMovedPoint, withViewportBounds } from '@/shared/diagrams/public';
import { MathProvider } from '@/shared/lib/MathStoreContext';
import type { VisualDiagramModel, CanvasTool } from '../model/types';
import { nextPointId, point, toolReferenceCandidates } from '../model/commands';

interface DiagramCanvasProps {
  model: VisualDiagramModel;
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
  <div className="shrink-0 overflow-hidden rounded border border-carbon/15 bg-lienzo">
    <div className="flex items-center justify-between border-b border-carbon/10 bg-carbon/5 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Lienzo visual · renderer compartido</p>
      <p className="text-[10px] text-carbon/45">Arrastre para mover o desplazar · rueda para zoom</p>
    </div>
    <MathProvider>
      <div className="h-[clamp(360px,48vh,520px)]">
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
      </div>
    </MathProvider>
  </div>
);

export default DiagramCanvas;
