import React from 'react';
import type { VisualDiagramModel, VisualPoint } from '../model/types';
import { movementAttractorCreatesCycle, movementAttractors, pointSupportsMovementAids } from '../model/scene/pointMovement';
import { InspectorExpandableBlock } from './inspector/InspectorExpandableBlock';

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
  const supportsMovementAids = pointSupportsMovementAids(point);
  const attractors = movementAttractors(model).filter(attractor => attractor.id !== point.id);
  const selectedAttractors = point.attractorIds ?? [];
  const defaultOpen = Boolean(point.snapToGrid || selectedAttractors.length > 0);
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
    <InspectorExpandableBlock title="Snap y magnetismo" defaultOpen={defaultOpen}>
      <p className="text-[10px] leading-relaxed text-carbon/50">
        Ayudas opcionales durante el arrastre. No sustituyen a las relaciones geométricas.
      </p>

      <div className="space-y-2">
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
        <div className="max-h-40 space-y-1 overflow-y-auto">
          {attractors.map(element => {
            const checked = point.attractorIds?.includes(element.id) ?? false;
            const createsCycle = !checked && movementAttractorCreatesCycle(model, point.id, element.id);
            return (
              <label
                key={element.id}
                className={[
                  'flex items-center gap-1.5 text-[10px]',
                  createsCycle
                    ? 'opacity-40 cursor-not-allowed select-none text-carbon/40'
                    : 'text-carbon cursor-pointer',
                ].join(' ')}
              >
                <input
                  type="checkbox"
                  aria-label={`Usar ${element.label} como atractor`}
                  checked={checked}
                  disabled={createsCycle}
                  className={`h-3 w-3 ${inspectorCheckboxClass} disabled:cursor-not-allowed`}
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
                  {createsCycle ? (
                    <span className="text-carbon/35"> · produciría un ciclo</span>
                  ) : null}
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
    </InspectorExpandableBlock>
  );
};

export default DiagramPointMovementAidsEditor;
