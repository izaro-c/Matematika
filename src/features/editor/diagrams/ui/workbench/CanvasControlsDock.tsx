import React from 'react';
import type { VisualDiagramModel } from '../../model/types';
import { DiagramStepPreviewControls } from '../DiagramStepPreviewControls';

interface CanvasControlsDockProps {
  model: VisualDiagramModel;
  canvasDisplay: 'edit' | 'preview';
  showAllObjects: boolean;
  activeStepId: string;
  onCanvasDisplayChange: (display: 'edit' | 'preview') => void;
  onToggleShowAllObjects: (showAll: boolean) => void;
  onActiveStepChange: (stepId: string) => void;
  onModelEdit: (model: VisualDiagramModel) => void;
}

export const CanvasControlsDock: React.FC<CanvasControlsDockProps> = ({
  model,
  canvasDisplay,
  showAllObjects,
  activeStepId,
  onCanvasDisplayChange,
  onToggleShowAllObjects,
  onActiveStepChange,
  onModelEdit,
}) => {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-carbon/15 bg-lienzo/95 px-3 py-2 text-xs shadow-sm backdrop-blur-xs">
      <div className="flex flex-wrap items-center gap-2">
        {/* Visual Mode Selector */}
        <div className="flex items-center gap-1 rounded-lg border border-carbon/15 bg-carbon/[0.03] p-0.5" role="tablist" aria-label="Modo de visualización">
          <button
            type="button"
            role="tab"
            aria-selected={canvasDisplay === 'edit'}
            onClick={() => onCanvasDisplayChange('edit')}
            className={`min-h-8 rounded-md px-2.5 text-[11px] font-bold transition-all ${
              canvasDisplay === 'edit' ? 'bg-carbon text-lienzo shadow-xs' : 'text-carbon/65 hover:text-carbon'
            }`}
          >
            Edición
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={canvasDisplay === 'preview'}
            onClick={() => onCanvasDisplayChange('preview')}
            className={`min-h-8 rounded-md px-2.5 text-[11px] font-bold transition-all ${
              canvasDisplay === 'preview' ? 'bg-pavo text-lienzo shadow-xs' : 'text-carbon/65 hover:text-carbon'
            }`}
          >
            Previsualizar
          </button>
        </div>

        {/* Show All Objects Toggle */}
        <button
          type="button"
          aria-pressed={showAllObjects}
          title={showAllObjects ? 'Mostrando todos los objetos del diagrama en el lienzo' : 'Filtrando objetos por el paso activo'}
          onClick={() => onToggleShowAllObjects(!showAllObjects)}
          className={`flex min-h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-bold transition-all ${
            showAllObjects
              ? 'border-pavo/30 bg-pavo/10 text-pavo shadow-xs'
              : 'border-carbon/15 bg-lienzo text-carbon/70 hover:bg-carbon/5'
          }`}
        >
          <span>{showAllObjects ? '👁️ Mostrar todos los objetos' : '👁️ Solo paso activo'}</span>
        </button>

        {/* Grid and Axis Quick Toggles */}
        <div className="flex items-center gap-1 rounded-lg border border-carbon/15 bg-lienzo p-1">
          <label className="flex items-center gap-1 text-[11px] font-bold text-carbon/75 cursor-pointer px-1">
            <input
              type="checkbox"
              checked={model.grid}
              onChange={e => onModelEdit({ ...model, grid: e.target.checked })}
              className="rounded accent-pavo"
            />
            Rejilla
          </label>
          <label className="flex items-center gap-1 text-[11px] font-bold text-carbon/75 cursor-pointer px-1">
            <input
              type="checkbox"
              checked={model.axis}
              onChange={e => onModelEdit({ ...model, axis: e.target.checked })}
              className="rounded accent-pavo"
            />
            Ejes
          </label>
        </div>
      </div>

      {/* Step Navigation Controls if model has steps */}
      {model.steps.length > 0 && (
        <div className="flex items-center gap-2">
          <DiagramStepPreviewControls
            steps={model.steps}
            activeStepId={activeStepId}
            onActiveStepChange={onActiveStepChange}
            className="min-w-0"
          />
        </div>
      )}
    </div>
  );
};

export default CanvasControlsDock;
