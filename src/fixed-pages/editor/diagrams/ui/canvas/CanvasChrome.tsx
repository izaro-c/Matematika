import React from 'react';
import type { VisualDiagramModel, CanvasTool } from '@/fixed-pages/editor/diagrams/model/types';
import {
  refsNeededForTool,
  toolReferenceCandidatesForSlot,
  toolReferenceLabel,
  toolReferencePurpose,
  toolReferencesAreReady,
  KIND_LABELS,
} from '@/fixed-pages/editor/diagrams/model';
import { ToolDrawingIcon, IconClose, IconChevronLeft, IconChevronRight } from '../toolbar/WorkbenchIcons';

export interface CanvasChromeProps {
  model: VisualDiagramModel;
  activeTool: CanvasTool;
  pendingRefs: string[];
  stepCount: number;
  activeStepIndex: number | null;
  stepPreviewActive?: boolean;
  showAllObjects?: boolean;
  onCancelTool: () => void;
  onChooseReferenceForTool: (refId: string) => boolean;
  onCompleteTool: () => void;
  onStepPrev?: () => void;
  onStepNext?: () => void;
  onClearStepPreview?: () => void;
  onToggleGrid: () => void;
  onToggleAxis: () => void;
  onResetViewport: () => void;
  onToggleShowAllObjects?: () => void;
}

const dockShell =
  'bg-lienzo/95 backdrop-blur-md rounded-xl border border-carbon/15 shadow-md';

export const CanvasChrome: React.FC<CanvasChromeProps> = ({
  model,
  activeTool,
  pendingRefs,
  stepCount,
  activeStepIndex,
  stepPreviewActive,
  showAllObjects = false,
  onCancelTool,
  onChooseReferenceForTool,
  onCompleteTool,
  onStepPrev,
  onStepNext,
  onClearStepPreview,
  onToggleGrid,
  onToggleAxis,
  onResetViewport,
  onToggleShowAllObjects,
}) => {
  const requiredRefs = refsNeededForTool(activeTool);
  const isReferenceToolActive = activeTool !== 'select' && activeTool !== 'point' && requiredRefs > 0;
  const showToolAssist = activeTool !== 'select';
  const currentSlotIndex = pendingRefs.length;
  const currentSlotCandidates = isReferenceToolActive
    ? toolReferenceCandidatesForSlot(model, activeTool, currentSlotIndex)
    : [];
  const nextLabel = isReferenceToolActive ? toolReferenceLabel(activeTool, currentSlotIndex) : '';
  const nextPurpose = isReferenceToolActive ? toolReferencePurpose(activeTool, currentSlotIndex) : '';
  const hasSteps = stepCount > 0;
  const stepLabel =
    activeStepIndex !== null && activeStepIndex !== undefined
      ? model.steps[activeStepIndex]?.label || `Paso ${activeStepIndex + 1}`
      : 'Todos los pasos';

  return (
    <>
      {showToolAssist && (
        <div className="absolute top-3 left-3 z-30 flex flex-col gap-2 max-w-sm pointer-events-auto">
          <div className={`flex items-start gap-2.5 px-3 py-2 ${dockShell}`}>
            <div className="mt-0.5 text-canela shrink-0">
              <ToolDrawingIcon tool={activeTool} className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-carbon leading-snug">
                {activeTool === 'point'
                  ? 'Clic en el lienzo para colocar el punto'
                  : `Creando ${KIND_LABELS[activeTool] || activeTool}`}
              </p>
              {isReferenceToolActive && (
                <p className="text-[10px] text-canela font-medium mt-0.5">
                  {pendingRefs.length + 1}/{requiredRefs}: {nextLabel}
                  {nextPurpose ? ` · ${nextPurpose}` : ''}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onCancelTool}
              className="ml-auto shrink-0 p-1 text-carbon/40 hover:text-granada hover:bg-granada/10 rounded"
              title="Cancelar herramienta"
            >
              <IconClose className="w-3.5 h-3.5" />
            </button>
          </div>

          {isReferenceToolActive && (
            <div className={`p-3 space-y-2 border-canela/30 ${dockShell}`}>
              {pendingRefs.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {pendingRefs.map((rId, idx) => (
                    <span
                      key={`${rId}-${idx}`}
                      className="bg-canela/15 text-canela px-1.5 py-0.5 rounded font-mono font-bold text-[10px]"
                    >
                      {rId}
                    </span>
                  ))}
                </div>
              )}
              {currentSlotCandidates.length === 0 ? (
                <p className="text-[11px] text-granada italic">
                  No hay objetos compatibles para esta referencia.
                </p>
              ) : (
                <select
                  onChange={e => {
                    if (e.target.value) onChooseReferenceForTool(e.target.value);
                  }}
                  value=""
                  className="w-full bg-carbon/5 border border-carbon/20 rounded-lg px-2 py-1.5 text-xs text-carbon"
                >
                  <option value="" disabled>
                    -- {nextLabel} --
                  </option>
                  {currentSlotCandidates.map(cand => (
                    <option key={cand.id} value={cand.id}>
                      {cand.label || cand.id} ({cand.id})
                    </option>
                  ))}
                </select>
              )}
              {(activeTool === 'polygon' || activeTool === 'areaIntersection') && (
                <button
                  type="button"
                  disabled={!toolReferencesAreReady(activeTool, pendingRefs)}
                  onClick={onCompleteTool}
                  className="w-full rounded-lg bg-pavo px-3 py-1.5 text-[11px] font-bold text-lienzo hover:bg-pavo/90 disabled:opacity-40"
                >
                  Crear {KIND_LABELS[activeTool] || activeTool}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {hasSteps && (
        <div className={`absolute top-3 right-3 z-30 flex items-center gap-1 p-1 pointer-events-auto ${dockShell}`}>
          <button
            type="button"
            onClick={onStepPrev}
            disabled={activeStepIndex === 0}
            className="p-1.5 rounded-lg text-carbon/70 hover:bg-carbon/5 disabled:opacity-30 cursor-pointer"
            title="Paso anterior"
            aria-label="Paso anterior"
          >
            <IconChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-2 min-w-[7rem] text-center">
            <p className="text-[10px] font-bold text-carbon truncate">{stepLabel}</p>
            <p className="text-[9px] text-carbon/50 font-mono">
              {activeStepIndex === null || activeStepIndex === undefined
                ? 'vista completa'
                : `${activeStepIndex + 1} / ${stepCount}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onStepNext}
            disabled={activeStepIndex === stepCount - 1}
            className="p-1.5 rounded-lg text-carbon/70 hover:bg-carbon/5 disabled:opacity-30 cursor-pointer"
            title="Paso siguiente"
            aria-label="Paso siguiente"
          >
            <IconChevronRight className="w-4 h-4" />
          </button>
          {stepPreviewActive && onClearStepPreview && (
            <button
              type="button"
              onClick={onClearStepPreview}
              className="ml-0.5 px-2 py-1 text-[10px] font-bold text-granada hover:bg-granada/10 rounded-lg"
            >
              Todos
            </button>
          )}
        </div>
      )}

      <div
        className={`absolute bottom-3 left-3 z-30 flex items-center gap-0.5 p-1 pointer-events-auto ${dockShell}`}
      >
        <button
          type="button"
          onClick={onToggleGrid}
          className={`px-2.5 py-1 text-[11px] font-medium rounded-lg cursor-pointer ${
            model.grid ? 'bg-canela/15 text-canela font-bold' : 'text-carbon/60 hover:bg-carbon/5'
          }`}
        >
          Rejilla
        </button>
        <button
          type="button"
          onClick={onToggleAxis}
          className={`px-2.5 py-1 text-[11px] font-medium rounded-lg cursor-pointer ${
            model.axis ? 'bg-canela/15 text-canela font-bold' : 'text-carbon/60 hover:bg-carbon/5'
          }`}
        >
          Ejes
        </button>
        <button
          type="button"
          onClick={onResetViewport}
          className="px-2.5 py-1 text-[11px] font-medium text-carbon/70 hover:bg-carbon/5 rounded-lg cursor-pointer"
        >
          Centrar
        </button>
        {onToggleShowAllObjects && hasSteps && (
          <button
            type="button"
            onClick={onToggleShowAllObjects}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg cursor-pointer ${
              showAllObjects ? 'bg-canela/15 text-canela font-bold' : 'text-carbon/60 hover:bg-carbon/5'
            }`}
            title="Ignorar filtro de paso"
          >
            {showAllObjects ? 'Sin filtro' : 'Filtrar'}
          </button>
        )}
      </div>
    </>
  );
};
