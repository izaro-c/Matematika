import React from 'react';
import type { VisualDiagramModel } from '../model/types';
import { movementAttractorCreatesCycle, movementAttractors, pointSupportsMovementAids, setPointAttractors as updatePointAttractors } from '../model/pointMovement';
import { DiagramPointMovementCard } from './DiagramPointMovementCard';

interface EditCommand {
  label?: string;
}

interface DiagramMovementAidsPanelProps {
  model: VisualDiagramModel;
  onModelEdit: (model: VisualDiagramModel, command?: EditCommand) => void;
  onSelect: (id: string) => void;
}

export const DiagramMovementAidsPanel: React.FC<DiagramMovementAidsPanelProps> = ({ model, onModelEdit, onSelect }) => {
  const movablePoints = model.points.filter(pointSupportsMovementAids);
  const attractors = movementAttractors(model);
  const snappedPoints = movablePoints.filter(point => point.snapToGrid);
  const magneticPoints = movablePoints.filter(point => (point.attractorIds?.length ?? 0) > 0);
  const enableSnap = snappedPoints.length !== movablePoints.length;

  const setSnapForEveryPoint = () => onModelEdit({
    ...model,
    points: model.points.map(point => pointSupportsMovementAids(point)
      ? { ...point, snapToGrid: enableSnap || undefined, snapSize: enableSnap ? point.snapSize ?? 0.5 : point.snapSize }
      : point),
  }, { label: `${enableSnap ? 'Activar' : 'Desactivar'} ajuste a cuadrícula en puntos móviles` });

  const updatePoint = (pointId: string, update: Record<string, unknown>, label: string) => onModelEdit({
    ...model,
    points: model.points.map(point => point.id === pointId ? { ...point, ...update } : point),
  }, { label });

  const setPointAttractors = (pointId: string, nextIds: string[]) => {
    const point = model.points.find(item => item.id === pointId);
    if (!point) return;
    onModelEdit(updatePointAttractors(model, pointId, nextIds), { label: `Editar magnetismo de ${point.label}` });
  };

  if (movablePoints.length === 0) return null;

  return (
    <section aria-labelledby="movement-aids-title">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 id="movement-aids-title" className="text-[10px] font-bold uppercase tracking-widest text-pavo">Snap y magnetismo</h3>
          <p className="mt-1 text-[10px] leading-relaxed text-carbon/55">El snap aproxima a la cuadrícula. El imán solo ajusta el punto arrastrado y lo libera al soltarlo.</p>
        </div>
        <button type="button" disabled={movablePoints.length === 0} onClick={setSnapForEveryPoint} className="shrink-0 rounded border border-pavo/25 bg-lienzo px-2 py-1 text-[9px] font-bold text-pavo disabled:opacity-35">
          {enableSnap ? 'Activar snap en todos' : 'Desactivar snap en todos'}
        </button>
      </div>
      <p className="mt-2 text-[9px] font-mono text-carbon/45">{snappedPoints.length}/{movablePoints.length} con snap · {magneticPoints.length}/{movablePoints.length} con magnetismo</p>
      <div className="mt-2 max-h-96 space-y-2 overflow-y-auto pr-0.5">
          {movablePoints.map(point => <DiagramPointMovementCard
            key={point.id}
            point={point}
            attractors={attractors.filter(attractor => attractor.id !== point.id && (point.attractorIds?.includes(attractor.id) || !movementAttractorCreatesCycle(model, point.id, attractor.id)))}
            onSelect={() => onSelect(point.id)}
            onUpdate={(update, label) => updatePoint(point.id, update, label)}
            onSetAttractors={ids => setPointAttractors(point.id, ids)}
          />)}
      </div>
      <p className="mt-2 text-[9px] leading-relaxed text-carbon/45">Todos los ajustes se guardan por punto. Pulse su nombre solo si necesita abrir el resto de sus propiedades.</p>
    </section>
  );
};

export default DiagramMovementAidsPanel;
