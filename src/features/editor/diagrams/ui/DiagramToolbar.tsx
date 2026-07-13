import React from 'react';
import type { VisualDiagramModel, CanvasTool } from '../model/types';
import { KIND_LABELS, refsNeededForTool } from '../model/commands';

const TOOL_GROUPS: Array<{ label: string; tools: CanvasTool[] }> = [
  { label: 'Edición', tools: ['select', 'point'] },
  { label: 'Geometría', tools: ['segment', 'line', 'ray', 'polygon', 'circle', 'arc'] },
  { label: 'Curvas', tools: ['functionCurve', 'parametricCurve', 'poincareGeodesic', 'poincareArc'] },
  { label: 'Relaciones', tools: ['angle', 'perpendicularMark', 'congruenceMark', 'dimensionLine', 'measurement'] },
  { label: 'Explicación', tools: ['grid', 'areaDecomposition', 'label', 'formula', 'infoPanel'] },
];

function toolLabel(tool: CanvasTool): string {
  if (tool === 'select') return 'Seleccionar';
  if (tool === 'point') return 'Punto libre';
  return KIND_LABELS[tool];
}

interface DiagramToolbarProps {
  model: VisualDiagramModel;
  canvasTool: CanvasTool;
  syncStatus: string;
  onSetCanvasTool: (tool: CanvasTool) => void;
  onAddElement: (tool: Exclude<CanvasTool, 'select' | 'point'>) => void;
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
  onAddElement,
  onModelEdit,
  onAddSlider,
  onAddStep,
  onResolveDivergence,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-carbon/15 bg-carbon/5 p-3">
      <div className="flex flex-wrap items-end gap-3" aria-label="Herramientas agrupadas por propósito">
        {TOOL_GROUPS.map(group => (
          <fieldset key={group.label} className="flex flex-wrap gap-1 rounded border border-carbon/10 p-1">
            <legend className="px-1 text-[9px] font-bold uppercase tracking-wider text-carbon/45">{group.label}</legend>
            {group.tools.map(tool => {
              const required = refsNeededForTool(tool);
              const disabled = required > model.points.length;
              return (
                <button
                  key={tool}
                  type="button"
                  aria-label={toolLabel(tool)}
                  title={disabled ? `Requiere ${required} puntos` : toolLabel(tool)}
                  disabled={disabled}
                  className={`rounded px-2 py-1 text-[10px] font-bold transition-all disabled:opacity-35 ${canvasTool === tool ? 'bg-carbon text-lienzo' : 'bg-transparent text-carbon/75 hover:bg-carbon/10'}`}
                  onClick={() => {
                    if (required === 0 && tool !== 'select' && tool !== 'point') onAddElement(tool);
                    else onSetCanvasTool(tool);
                  }}
                >
                  {toolLabel(tool)}
                </button>
              );
            })}
          </fieldset>
        ))}
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
          Cuadrícula
        </label>
        <label className="flex items-center gap-1.5 text-xs text-carbon">
          <input
            type="checkbox"
            checked={model.axis}
            onChange={(e) => onModelEdit({ ...model, axis: e.target.checked })}
            className="rounded border-carbon/15 bg-lienzo"
          />
          Ejes
        </label>
      </div>

      <div className="h-4 w-px bg-carbon/15" />

      {/* Creators */}
      <div className="flex items-center gap-2">
        <button
          onClick={onAddSlider}
          className="rounded border border-carbon/15 bg-lienzo px-2.5 py-1 text-[11px] font-bold text-carbon hover:bg-carbon/5"
        >
          + Control
        </button>
        <button
          onClick={onAddStep}
          className="rounded border border-carbon/15 bg-lienzo px-2.5 py-1 text-[11px] font-bold text-carbon hover:bg-carbon/5"
        >
          + Paso
        </button>
      </div>

      {syncStatus === 'diverged' && (
        <div className="ml-auto flex items-center gap-2 rounded bg-granada/10 px-2 py-1">
          <span className="text-[10px] font-bold text-granada">DIVERGENCIA DETECTADA:</span>
          <button
            onClick={() => onResolveDivergence('visual')}
            className="rounded bg-salvia text-lienzo px-2 py-0.5 text-[10px] font-bold hover:bg-salvia/80"
          >
            Usar modelo visual exacto
          </button>
          <button
            onClick={() => onResolveDivergence('source')}
            className="rounded bg-pavo text-lienzo px-2 py-0.5 text-[10px] font-bold hover:bg-pavo/80"
          >
            Usar código
          </button>
        </div>
      )}
    </div>
  );
};
export default DiagramToolbar;
