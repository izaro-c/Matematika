import React, { useState } from 'react';
import type { VisualDiagramModel, VisualPoint } from '../model/types';
import { movementAttractorCreatesCycle, movementAttractors, pointSupportsMovementAids } from '../model/scene/pointMovement';
import { IconChevronDown, IconChevronRight } from './toolbar/WorkbenchIcons';

interface DiagramPointMovementAidsEditorProps {
  model: VisualDiagramModel;
  point: VisualPoint;
  onPointChange: (update: Partial<VisualPoint>) => void;
  onAttractorsChange: (attractorIds: string[]) => void;
}

const inspectorInputClass =
  'mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon';
const inspectorCheckboxClass =
  'rounded border-carbon/30 text-salvia focus:ring-salvia cursor-pointer';
const sectionLabelClass = 'block text-[11px] font-bold text-carbon/70 mb-0.5';

export const DiagramPointMovementAidsEditor: React.FC<DiagramPointMovementAidsEditorProps> = ({
  model,
  point,
  onPointChange,
  onAttractorsChange,
}) => {
  const [expanded, setExpanded] = useState(Boolean(point.snapToGrid || (point.attractorIds?.length ?? 0) > 0));
  const supportsMovementAids = pointSupportsMovementAids(point);
  const attractors = movementAttractors(model).filter(attractor => attractor.id !== point.id);
  const selectedAttractors = point.attractorIds ?? [];
  const moveAttractor = (attractorId: string, offset: -1 | 1) => {
    const index = selectedAttractors.indexOf(attractorId);
    const destination = index + offset;
    if (index < 0 || destination < 0 || destination >= selectedAttractors.length) return;
    const reordered = [...selectedAttractors];
    [reordered[index], reordered[destination]] = [reordered[destination], reordered[index]];
    onAttractorsChange(reordered);
  };

  if (!supportsMovementAids) return null;

  return (
    <div className="pt-2 border-t border-carbon/10 space-y-2">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded(open => !open)}
        className="flex w-full items-center justify-between py-1 text-xs font-bold text-carbon cursor-pointer"
      >
        <span>Snap y magnetismo</span>
        <span className="text-carbon/40">
          {expanded ? <IconChevronDown className="w-3 h-3" /> : <IconChevronRight className="w-3 h-3" />}
        </span>
      </button>

      {expanded && (
        <div className="space-y-2">
          <p className="text-[10px] leading-relaxed text-carbon/50">
            Ayudas opcionales durante el arrastre. No sustituyen a las relaciones geométricas.
          </p>

          <div className="space-y-2 pt-1 border-t border-carbon/10">
            <span className={sectionLabelClass}>Snap a cuadrícula</span>
            <label className="flex items-center gap-1.5 text-xs font-bold text-carbon/80 cursor-pointer">
              <input
                type="checkbox"
                aria-label="Ajuste a cuadrícula"
                checked={point.snapToGrid ?? false}
                onChange={event => onPointChange({ snapToGrid: event.target.checked })}
                className={`h-3.5 w-3.5 ${inspectorCheckboxClass}`}
              />
              Ajuste a cuadrícula
            </label>
            {point.snapToGrid && (
              <label className={sectionLabelClass}>
                Tamaño de celda
                <input
                  type="number"
                  min="0.01"
                  max="10"
                  step="0.25"
                  aria-label="Tamaño de celda para ajustar a la cuadrícula"
                  className={inspectorInputClass}
                  value={point.snapSize ?? 0.5}
                  onChange={event => onPointChange({ snapSize: Math.max(0.01, Number(event.target.value)) })}
                />
              </label>
            )}
          </div>

          <div className="space-y-2 pt-1 border-t border-carbon/10">
            <span className={sectionLabelClass}>Magnetismo hacia formas</span>
            {selectedAttractors.length > 0 && (
              <ol className="space-y-1.5" aria-label={`Prioridad de atractores de ${point.label}`}>
                {selectedAttractors.map((attractorId, index) => {
                  const attractor = attractors.find(item => item.id === attractorId);
                  return (
                    <li
                      key={attractorId}
                      className="flex items-center justify-between gap-2 rounded border border-carbon/10 bg-carbon/5 px-2 py-1.5 text-[10px] text-carbon"
                    >
                      <span className="min-w-0 truncate">
                        <strong>{index + 1}.</strong> {attractor?.label ?? attractorId}
                      </span>
                      <span className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          aria-label={`Subir atractor ${attractor?.label ?? attractorId}`}
                          disabled={index === 0}
                          className="rounded bg-lienzo border border-carbon/10 px-1.5 disabled:opacity-30 hover:bg-carbon/5 transition-colors"
                          onClick={() => moveAttractor(attractorId, -1)}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          aria-label={`Bajar atractor ${attractor?.label ?? attractorId}`}
                          disabled={index === selectedAttractors.length - 1}
                          className="rounded bg-lienzo border border-carbon/10 px-1.5 disabled:opacity-30 hover:bg-carbon/5 transition-colors"
                          onClick={() => moveAttractor(attractorId, 1)}
                        >
                          ↓
                        </button>
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
            <div className="max-h-40 space-y-1.5 overflow-y-auto rounded border border-carbon/10 p-2">
              {attractors.map(element => {
                const checked = point.attractorIds?.includes(element.id) ?? false;
                const createsCycle = !checked && movementAttractorCreatesCycle(model, point.id, element.id);
                return (
                  <label key={element.id} className="flex items-center gap-1.5 text-[10px] text-carbon">
                    <input
                      type="checkbox"
                      aria-label={`Usar ${element.label} como atractor`}
                      checked={checked}
                      disabled={createsCycle}
                      className={`h-3 w-3 ${inspectorCheckboxClass}`}
                      onChange={event =>
                        onAttractorsChange(
                          event.target.checked
                            ? [...(point.attractorIds ?? []), element.id]
                            : (point.attractorIds ?? []).filter(id => id !== element.id),
                        )
                      }
                    />
                    <span>
                      {element.label}{' '}
                      <span className="font-mono text-carbon/45">({element.id})</span>
                      {createsCycle ? ' · produciría un ciclo' : ''}
                    </span>
                  </label>
                );
              })}
            </div>
            {(point.attractorIds?.length ?? 0) > 0 && (
              <div className="grid grid-cols-2 gap-2">
                <label className={sectionLabelClass}>
                  Atracción
                  <input
                    type="number"
                    min="0.01"
                    max="20"
                    step="0.05"
                    aria-label="Distancia de atracción"
                    className={inspectorInputClass}
                    value={point.attractorDistance ?? 0.4}
                    onChange={event =>
                      onPointChange({ attractorDistance: Math.max(0.01, Number(event.target.value)) })
                    }
                  />
                </label>
                <label className={sectionLabelClass}>
                  Liberación
                  <input
                    type="number"
                    min="0.01"
                    max="20"
                    step="0.05"
                    aria-label="Distancia de liberación"
                    className={inspectorInputClass}
                    value={point.snatchDistance ?? 0.6}
                    onChange={event =>
                      onPointChange({ snatchDistance: Math.max(0.01, Number(event.target.value)) })
                    }
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagramPointMovementAidsEditor;
