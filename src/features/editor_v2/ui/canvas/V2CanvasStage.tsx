import React, { useRef } from 'react';
import type { VisualDiagramModel, CanvasTool } from '@/features/editor/diagrams/model/types';
import { ReferencePickProvider } from '@/features/editor/diagrams/ui/relations';
import { V2WorkshopSurface } from './V2WorkshopSurface';
import { V2PublicationFrame } from './V2PublicationFrame';
import { V2BoardHost } from './V2BoardHost';
import { V2CanvasChrome } from './V2CanvasChrome';
import { isPublicationMode, type V2CanvasFrameMode } from './canvasFrameMode';
import { useFitScale } from './useFitScale';

export interface V2CanvasStageProps {
  model: VisualDiagramModel | null;
  selectedIds: readonly string[];
  activeTool: CanvasTool;
  pendingRefs: string[];
  frameMode: V2CanvasFrameMode;
  previewHighlightId?: string;
  stepPreviewActive?: boolean;
  activeStepIndex?: number | null;
  stepCount?: number;
  errorHighlightedIds?: readonly string[];
  showAllObjects?: boolean;
  pageType?: string;
  onToggleShowAllObjects?: () => void;
  onClearStepPreview?: () => void;
  onStepPrev?: () => void;
  onStepNext?: () => void;
  onSelect: (ids: string[], additive?: boolean) => void;
  onModelEdit: (next: VisualDiagramModel, command?: { label?: string; mergeKey?: string }) => void;
  onChooseReferenceForTool: (refId: string) => boolean;
  onCompleteTool: () => void;
  onCancelTool: () => void;
  onResetViewport: () => void;
  onToggleGrid: () => void;
  onToggleAxis: () => void;
}

export const V2CanvasStage: React.FC<V2CanvasStageProps> = ({
  model,
  selectedIds,
  activeTool,
  pendingRefs,
  frameMode,
  previewHighlightId,
  stepPreviewActive,
  activeStepIndex = null,
  stepCount = 0,
  errorHighlightedIds = [],
  showAllObjects = false,
  pageType,
  onToggleShowAllObjects,
  onClearStepPreview,
  onStepPrev,
  onStepNext,
  onSelect,
  onModelEdit,
  onChooseReferenceForTool,
  onCompleteTool,
  onCancelTool,
  onResetViewport,
  onToggleGrid,
  onToggleAxis,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const publication = isPublicationMode(frameMode);
  const scale = useFitScale(stageRef, frameRef, publication);

  if (!model) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-lienzo text-pizarra/60 font-serif italic">
        Cargando lienzo…
      </div>
    );
  }

  const activeStepId =
    showAllObjects || activeStepIndex === null || activeStepIndex === undefined
      ? ''
      : model.steps[activeStepIndex]?.id ?? '';

  const boardHost = (
    <V2BoardHost
      model={model}
      selectedIds={selectedIds}
      activeTool={activeTool}
      pendingRefs={pendingRefs}
      previewHighlightId={previewHighlightId}
      errorHighlightedIds={errorHighlightedIds}
      activeStepId={activeStepId}
      onSelect={onSelect}
      onModelEdit={onModelEdit}
      onChooseReferenceForTool={onChooseReferenceForTool}
      onCompleteTool={onCompleteTool}
    />
  );

  return (
    <ReferencePickProvider>
      <div ref={stageRef} className="relative flex-1 h-full w-full overflow-hidden select-none font-serif text-carbon">
        <V2WorkshopSurface>
          {publication ? (
            <div
              ref={frameRef}
              style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
            >
              <V2PublicationFrame mode={frameMode} title={model.title} pageType={pageType}>
                {boardHost}
              </V2PublicationFrame>
            </div>
          ) : (
            <div className="relative h-[calc(100%-2rem)] w-[calc(100%-2rem)] max-w-5xl overflow-hidden rounded-lg border border-carbon/15 bg-lienzo shadow-2xl">
              {boardHost}
            </div>
          )}
        </V2WorkshopSurface>

        <div className="pointer-events-none absolute inset-0">
          <V2CanvasChrome
            model={model}
            activeTool={activeTool}
            pendingRefs={pendingRefs}
            stepCount={stepCount}
            activeStepIndex={activeStepIndex}
            stepPreviewActive={stepPreviewActive}
            showAllObjects={showAllObjects}
            onCancelTool={onCancelTool}
            onChooseReferenceForTool={onChooseReferenceForTool}
            onCompleteTool={onCompleteTool}
            onStepPrev={onStepPrev}
            onStepNext={onStepNext}
            onClearStepPreview={onClearStepPreview}
            onToggleGrid={onToggleGrid}
            onToggleAxis={onToggleAxis}
            onResetViewport={onResetViewport}
            onToggleShowAllObjects={onToggleShowAllObjects}
          />
        </div>
      </div>
    </ReferencePickProvider>
  );
};
