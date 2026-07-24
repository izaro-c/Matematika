import React from 'react';
import type { VisualDiagramModel, VisualPoint } from '../model/types';
import { movementAttractorCreatesCycle, movementAttractors, pointSupportsMovementAids } from '../model/pointMovement';

interface DiagramPointMovementAidsEditorProps {
  model: VisualDiagramModel;
  point: VisualPoint;
  onPointChange: (update: Partial<VisualPoint>) => void;
  onAttractorsChange: (attractorIds: string[]) => void;
}

export const DiagramPointMovementAidsEditor: React.FC<DiagramPointMovementAidsEditorProps> = ({
  model,
  point,
  onPointChange,
  onAttractorsChange,
}) => {
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

  // Las ayudas no tienen efecto sobre puntos fijos, derivados o ligados a un
  // soporte. Ocultarlas evita sugerir una capacidad incompatible.
  if (!supportsMovementAids) return null;

  return (
    <section className="space-y-3" aria-label="Snap y magnetismo del punto">
      <fieldset className="space-y-2 border-t border-carbon/10 pt-3">
        <legend className="px-1 ac-label ac-label--sm ac-label--pavo">Snap a cuadrícula</legend>
        <label className="flex items-center gap-1.5 text-xs font-bold text-carbon">
          <input
            type="checkbox"
            aria-label="Ajuste a cuadrícula"
            checked={point.snapToGrid ?? false}
            onChange={(event) => onPointChange({ snapToGrid: event.target.checked || undefined })}
          />
          Ajuste a cuadrícula
        </label>
        <p className="text-[10px] leading-relaxed text-carbon/50">Durante el arrastre, aproxima las coordenadas del punto a múltiplos del tamaño de celda.</p>
        {point.snapToGrid && (
          <label className="block text-xs font-bold text-carbon">
            Tamaño de celda
            <input
              type="number"
              min="0.01"
              max="10"
              step="0.25"
              aria-label="Tamaño de celda de ajuste"
              className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={point.snapSize ?? 0.5}
              onChange={(event) => onPointChange({ snapSize: Math.max(0.01, Number(event.target.value)) })}
            />
          </label>
        )}
      </fieldset>

      <fieldset className="border-t border-carbon/10 pt-3">
        <legend className="px-1 text-xs font-bold text-ocre">Magnetismo hacia formas notables</legend>
        <p className="mt-1 text-[10px] leading-relaxed text-carbon/50">Solo el punto que se arrastra se adapta temporalmente. Al soltarlo conserva la posición exacta y vuelve a ser libre.</p>
        {selectedAttractors.length > 0 && (
          <ol className="mt-2 space-y-1" aria-label={`Prioridad de atractores de ${point.label}`}>
            {selectedAttractors.map((attractorId, index) => {
              const attractor = attractors.find(item => item.id === attractorId);
              return (
                <li key={attractorId} className="flex items-center justify-between gap-2 rounded border border-ocre/15 bg-lienzo px-2 py-1 text-[10px] text-carbon">
                  <span className="min-w-0 truncate"><strong>{index + 1}.</strong> {attractor?.label ?? attractorId}</span>
                  <span className="flex shrink-0 gap-1">
                    <button type="button" aria-label={`Subir atractor ${attractor?.label ?? attractorId}`} disabled={index === 0} className="rounded border border-carbon/10 px-1 disabled:opacity-30" onClick={() => moveAttractor(attractorId, -1)}>↑</button>
                    <button type="button" aria-label={`Bajar atractor ${attractor?.label ?? attractorId}`} disabled={index === selectedAttractors.length - 1} className="rounded border border-carbon/10 px-1 disabled:opacity-30" onClick={() => moveAttractor(attractorId, 1)}>↓</button>
                  </span>
                </li>
              );
            })}
          </ol>
        )}
        <div className="mt-2 max-h-36 space-y-1 overflow-y-auto">
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
                  onChange={(event) => onAttractorsChange(event.target.checked
                    ? [...(point.attractorIds ?? []), element.id]
                    : (point.attractorIds ?? []).filter(id => id !== element.id))}
                />
                <span>{element.label} <span className="font-mono text-carbon/45">({element.id})</span>{createsCycle ? ' · produciría un ciclo' : ''}</span>
              </label>
            );
          })}
        </div>
        {attractors.length === 0 && (
          <p className="mt-2 rounded border border-dashed border-carbon/15 bg-lienzo p-2 text-[10px] text-carbon/50">Primero añada una recta, segmento, circunferencia o curva que pueda actuar como imán.</p>
        )}
        {(point.attractorIds?.length ?? 0) > 0 && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <label className="text-[10px] font-bold text-carbon">Distancia de atracción<input type="number" min="0.01" max="20" step="0.05" aria-label="Distancia de atracción" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={point.attractorDistance ?? 0.4} onChange={(event) => onPointChange({ attractorDistance: Math.max(0.01, Number(event.target.value)) })} /></label>
            <label className="text-[10px] font-bold text-carbon">Distancia de liberación<input type="number" min="0.01" max="20" step="0.05" aria-label="Distancia de liberación" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={point.snatchDistance ?? 0.6} onChange={(event) => onPointChange({ snatchDistance: Math.max(0.01, Number(event.target.value)) })} /></label>
          </div>
        )}
      </fieldset>
    </section>
  );
};

export default DiagramPointMovementAidsEditor;
