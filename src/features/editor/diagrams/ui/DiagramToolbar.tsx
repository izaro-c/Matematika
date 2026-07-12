import React from 'react';
import type { VisualDiagramModel, CanvasTool } from '../model/types';

interface DiagramToolbarProps {
  model: VisualDiagramModel;
  canvasTool: CanvasTool;
  syncStatus: string;
  onSetCanvasTool: (tool: CanvasTool) => void;
  onModelEdit: (model: VisualDiagramModel) => void;
  onAddSlider: () => void;
  onAddStep: () => void;
  onResolveDivergence: (authority: 'visual' | 'source') => void;
}

export const DiagramToolbar: React.FC<DiagramToolbarProps> = ({
  model,
  canvasTool,
  syncStatus,
  onSetCanvasTool,
  onModelEdit,
  onAddSlider,
  onAddStep,
  onResolveDivergence,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-carbon/15 bg-carbon/5 p-3">
      {/* Tools */}
      <div className="flex items-center gap-1">
        <button
          className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${canvasTool === 'select' ? 'bg-carbon text-lienzo' : 'bg-transparent text-carbon/75 hover:bg-carbon/10'}`}
          onClick={() => onSetCanvasTool('select')}
        >
          Select
        </button>
        <button
          className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${canvasTool === 'point' ? 'bg-carbon text-lienzo' : 'bg-transparent text-carbon/75 hover:bg-carbon/10'}`}
          onClick={() => onSetCanvasTool('point')}
        >
          Point
        </button>
        <button
          className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${canvasTool === 'segment' ? 'bg-carbon text-lienzo' : 'bg-transparent text-carbon/75 hover:bg-carbon/10'}`}
          onClick={() => onSetCanvasTool('segment')}
        >
          Segment
        </button>
        <button
          className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${canvasTool === 'line' ? 'bg-carbon text-lienzo' : 'bg-transparent text-carbon/75 hover:bg-carbon/10'}`}
          onClick={() => onSetCanvasTool('line')}
        >
          Line
        </button>
        <button
          className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${canvasTool === 'circle' ? 'bg-carbon text-lienzo' : 'bg-transparent text-carbon/75 hover:bg-carbon/10'}`}
          onClick={() => onSetCanvasTool('circle')}
        >
          Circle
        </button>
        <button
          className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${canvasTool === 'polygon' ? 'bg-carbon text-lienzo' : 'bg-transparent text-carbon/75 hover:bg-carbon/10'}`}
          onClick={() => onSetCanvasTool('polygon')}
        >
          Polygon
        </button>
      </div>

      <div className="h-4 w-px bg-carbon/15" />

      {/* Grid & Axis */}
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1.5 text-xs text-carbon">
          <input
            type="checkbox"
            checked={model.grid}
            onChange={(e) => onModelEdit({ ...model, grid: e.target.checked })}
            className="rounded border-carbon/15 bg-lienzo"
          />
          Grid
        </label>
        <label className="flex items-center gap-1.5 text-xs text-carbon">
          <input
            type="checkbox"
            checked={model.axis}
            onChange={(e) => onModelEdit({ ...model, axis: e.target.checked })}
            className="rounded border-carbon/15 bg-lienzo"
          />
          Axis
        </label>
      </div>

      <div className="h-4 w-px bg-carbon/15" />

      {/* Creators */}
      <div className="flex items-center gap-2">
        <button
          onClick={onAddSlider}
          className="rounded border border-carbon/15 bg-lienzo px-2.5 py-1 text-[11px] font-bold text-carbon hover:bg-carbon/5"
        >
          + Slider
        </button>
        <button
          onClick={onAddStep}
          className="rounded border border-carbon/15 bg-lienzo px-2.5 py-1 text-[11px] font-bold text-carbon hover:bg-carbon/5"
        >
          + Step
        </button>
      </div>

      {syncStatus === 'diverged' && (
        <div className="ml-auto flex items-center gap-2 rounded bg-granada/10 px-2 py-1">
          <span className="text-[10px] font-bold text-granada">DIVERGENCIA DETECTADA:</span>
          <button
            onClick={() => onResolveDivergence('visual')}
            className="rounded bg-salvia text-lienzo px-2 py-0.5 text-[10px] font-bold hover:bg-salvia/80"
          >
            Usar Visual
          </button>
          <button
            onClick={() => onResolveDivergence('source')}
            className="rounded bg-pavo text-lienzo px-2 py-0.5 text-[10px] font-bold hover:bg-pavo/80"
          >
            Usar Fuente
          </button>
        </div>
      )}
    </div>
  );
};
export default DiagramToolbar;
