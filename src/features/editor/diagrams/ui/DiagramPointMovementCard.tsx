import React from 'react';
import type { VisualPoint } from '../model/types';
import type { MovementAttractor } from '../model/pointMovement';

interface DiagramPointMovementCardProps {
  point: VisualPoint;
  attractors: MovementAttractor[];
  onSelect: () => void;
  onUpdate: (update: Partial<VisualPoint>, label: string) => void;
  onSetAttractors: (ids: string[]) => void;
}

function attractorPrompt(total: number, available: number): string {
  if (total === 0) return 'Primero añada un punto, una recta, un segmento o una curva';
  if (available === 0) return 'Todos los objetos compatibles están añadidos';
  return 'Elegir recta, segmento, circunferencia o curva…';
}

export const DiagramPointMovementCard: React.FC<DiagramPointMovementCardProps> = ({ point, attractors, onSelect, onUpdate, onSetAttractors }) => {
  const selectedAttractors = point.attractorIds ?? [];
  const availableAttractors = attractors.filter(attractor => !selectedAttractors.includes(attractor.id));
  const setPositiveNumber = (field: 'snapSize' | 'attractorDistance' | 'snatchDistance', value: string, label: string) => {
    onUpdate({ [field]: Math.max(0.01, Number(value)) }, label);
  };
  const moveAttractor = (attractorId: string, offset: -1 | 1) => {
    const index = selectedAttractors.indexOf(attractorId);
    const destination = index + offset;
    if (index < 0 || destination < 0 || destination >= selectedAttractors.length) return;
    const reordered = [...selectedAttractors];
    [reordered[index], reordered[destination]] = [reordered[destination], reordered[index]];
    onSetAttractors(reordered);
  };

  return <article className="rounded border border-carbon/10 bg-lienzo p-2">
    <button type="button" onClick={onSelect} className="w-full text-left">
      <span className="block break-words text-[10px] font-bold text-carbon">{point.label} <span className="font-mono font-normal text-carbon/40">({point.id})</span></span>
      <span className="text-[8px] text-carbon/40">Punto {point.constraint === 'free' ? 'libre' : point.constraint}</span>
    </button>
    <div className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 border-t border-carbon/5 pt-2">
      <label className="flex items-center gap-1 text-[9px] font-bold text-pavo"><input type="checkbox" aria-label={`Activar snap para ${point.label}`} checked={point.snapToGrid ?? false} onChange={event => onUpdate({ snapToGrid: event.target.checked || undefined }, `${event.target.checked ? 'Activar' : 'Desactivar'} snap de ${point.label}`)} />Snap</label>
      {point.snapToGrid
        ? <label className="text-[8px] font-bold text-carbon/45">Celda <input type="number" min="0.01" max="10" step="0.25" aria-label={`Tamaño de celda para ${point.label}`} className="ml-1 w-16 rounded border border-carbon/15 bg-lienzo p-1 text-[9px] text-carbon" value={point.snapSize ?? 0.5} onChange={event => setPositiveNumber('snapSize', event.target.value, `Cambiar tamaño de snap de ${point.label}`)} /></label>
        : <span className="text-[8px] text-carbon/35">Se mueve libremente entre celdas</span>}
    </div>
    <div className="mt-2 border-t border-carbon/5 pt-2">
      <label className="block text-[9px] font-bold text-ocre">Añadir objeto atractor
        <select aria-label={`Añadir atractor a ${point.label}`} className="mt-1 w-full rounded border border-ocre/20 bg-lienzo p-1.5 text-[9px] font-normal text-carbon" value="" disabled={availableAttractors.length === 0} onChange={event => {
          if (event.target.value) onSetAttractors([...selectedAttractors, event.target.value]);
        }}>
          <option value="">{attractorPrompt(attractors.length, availableAttractors.length)}</option>
          {availableAttractors.map(attractor => <option key={attractor.id} value={attractor.id}>{attractor.label} ({attractor.id})</option>)}
        </select>
      </label>
      {selectedAttractors.length > 0 && <ol className="mt-1.5 space-y-1" aria-label={`Prioridad de atractores de ${point.label}`}>
        {selectedAttractors.map((attractorId, index) => {
          const attractor = attractors.find(item => item.id === attractorId);
          return <li key={attractorId} className="flex items-center justify-between gap-1 rounded border border-ocre/15 bg-ocre/5 px-1.5 py-1 text-[8px] text-ocre">
            <span className="min-w-0 truncate">{index + 1}. {attractor?.label ?? attractorId}</span>
            <span className="flex shrink-0 gap-0.5">
              <button type="button" aria-label={`Subir atractor ${attractor?.label ?? attractorId} de ${point.label}`} disabled={index === 0} className="rounded border border-ocre/15 px-1 disabled:opacity-30" onClick={() => moveAttractor(attractorId, -1)}>↑</button>
              <button type="button" aria-label={`Bajar atractor ${attractor?.label ?? attractorId} de ${point.label}`} disabled={index === selectedAttractors.length - 1} className="rounded border border-ocre/15 px-1 disabled:opacity-30" onClick={() => moveAttractor(attractorId, 1)}>↓</button>
              <button type="button" aria-label={`Quitar atractor ${attractor?.label ?? attractorId} de ${point.label}`} className="rounded border border-ocre/15 px-1" onClick={() => onSetAttractors(selectedAttractors.filter(id => id !== attractorId))}>×</button>
            </span>
          </li>;
        })}
      </ol>}
      {selectedAttractors.length > 0 && <div className="mt-2 grid grid-cols-2 gap-2">
        <label className="text-[8px] font-bold text-carbon/45">Atracción<input type="number" min="0.01" max="20" step="0.05" aria-label={`Distancia de atracción para ${point.label}`} className="mt-0.5 w-full rounded border border-carbon/15 p-1 text-[9px] text-carbon" value={point.attractorDistance ?? 0.4} onChange={event => setPositiveNumber('attractorDistance', event.target.value, `Cambiar distancia de atracción de ${point.label}`)} /></label>
        <label className="text-[8px] font-bold text-carbon/45">Liberación<input type="number" min="0.01" max="20" step="0.05" aria-label={`Distancia de liberación para ${point.label}`} className="mt-0.5 w-full rounded border border-carbon/15 p-1 text-[9px] text-carbon" value={point.snatchDistance ?? 0.6} onChange={event => setPositiveNumber('snatchDistance', event.target.value, `Cambiar distancia de liberación de ${point.label}`)} /></label>
      </div>}
    </div>
  </article>;
};

export default DiagramPointMovementCard;
