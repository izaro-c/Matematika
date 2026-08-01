import React, { useRef } from 'react';
import type { VisualDiagramModel, CanvasTool } from '@/fixed-pages/editor/diagrams/model/types';
import { ReferencePickProvider } from '@/fixed-pages/editor/diagrams/ui/relations';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { WorkshopSurface } from './WorkshopSurface';
import { PublicationFrame } from './PublicationFrame';
import { BoardHost } from './BoardHost';
import { CanvasChrome } from './CanvasChrome';
import { isPublicationMode, type CanvasFrameMode } from './canvasFrameMode';
import { useFitScale } from './useFitScale';

export interface CanvasStageProps {
  model: VisualDiagramModel | null;
  selectedIds: readonly string[];
  activeTool: CanvasTool;
  pendingRefs: string[];
  frameMode: CanvasFrameMode;
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

export const CanvasStage: React.FC<CanvasStageProps> = ({
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
  const scale = useFitScale(stageRef, frameRef, publication, frameMode);

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
    <ErrorBoundary
      fallback={(
        <div className="flex h-full w-full items-center justify-center p-6 font-serif text-carbon">
          <p className="border-l-4 border-granada pl-4 text-carbon/70 italic" role="alert">
            No se pudo renderizar el diagrama.
          </p>
        </div>
      )}
    >
      <BoardHost
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
    </ErrorBoundary>
  );

  return (
    <ReferencePickProvider>
      <div ref={stageRef} className="relative flex-1 h-full w-full overflow-hidden select-none font-serif text-carbon">
        <WorkshopSurface>
          {publication ? (
            <div
              ref={frameRef}
              style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
            >
              <PublicationFrame mode={frameMode} title={model.title} pageType={pageType}>
                {boardHost}
              </PublicationFrame>
            </div>
          ) : (
            <div className="relative h-[calc(100%-2rem)] w-[calc(100%-2rem)] max-w-5xl overflow-hidden rounded-lg border border-carbon/15 bg-lienzo shadow-2xl">
              {boardHost}
            </div>
          )}
        </WorkshopSurface>

        <div className="pointer-events-none absolute inset-0">
          <CanvasChrome
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
