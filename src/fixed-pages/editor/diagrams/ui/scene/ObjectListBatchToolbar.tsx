import React from 'react';
import type { VisualDiagramModel } from '../../model/types';
import { setVisibilityInAllSteps } from '../stepMatrixUtils';

interface ObjectListBatchToolbarProps {
  model: VisualDiagramModel;
  selectedIds: readonly string[];
  onModelEdit: (model: VisualDiagramModel) => void;
  onClearSelection: () => void;
}

export const ObjectListBatchToolbar: React.FC<ObjectListBatchToolbarProps> = ({
  model,
  selectedIds,
  onModelEdit,
  onClearSelection,
}) => {
  if (selectedIds.length <= 1) return null;

  const handleShowInAllSteps = () => {
    let updated = model;
    for (const id of selectedIds) {
      updated = setVisibilityInAllSteps(updated, id, true);
    }
    onModelEdit(updated);
  };

  const handleHideInAllSteps = () => {
    let updated = model;
    for (const id of selectedIds) {
      updated = setVisibilityInAllSteps(updated, id, false);
    }
    onModelEdit(updated);
  };

  const handleToggleLock = () => {
    const pointsToToggle = new Set(selectedIds);
    const nextPoints = model.points.map(p =>
      pointsToToggle.has(p.id) ? { ...p, fixed: !p.fixed } : p
    );
    onModelEdit({ ...model, points: nextPoints });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-1.5 rounded-lg border border-pavo/20 bg-pavo/5 p-2 text-xs">
      <div className="flex items-center gap-1">
        <span className="font-bold text-pavo">{selectedIds.length} seleccionados</span>
        <button
          type="button"
          onClick={onClearSelection}
          className="text-[10px] text-carbon/50 underline hover:text-carbon"
        >
          Desmarcar
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {model.steps.length > 0 && (
          <>
            <button
              type="button"
              title="Mostrar los objetos seleccionados en todos los pasos del diagrama"
              onClick={handleShowInAllSteps}
              className="rounded border border-salvia/30 bg-lienzo px-2 py-1 text-[10px] font-bold text-musgo hover:bg-salvia/10"
            >
              👁️ Mostrar en todos
            </button>
            <button
              type="button"
              title="Ocultar los objetos seleccionados en todos los pasos del diagrama"
              onClick={handleHideInAllSteps}
              className="rounded border border-carbon/15 bg-lienzo px-2 py-1 text-[10px] font-bold text-carbon/60 hover:bg-carbon/5"
            >
              🙈 Ocultar en todos
            </button>
          </>
        )}
        <button
          type="button"
          title="Alternar bloqueo de arrastre para puntos seleccionados"
          onClick={handleToggleLock}
          className="rounded border border-carbon/15 bg-lienzo px-2 py-1 text-[10px] font-bold text-carbon/75 hover:bg-carbon/5"
        >
          🔒 Alternar bloqueo
        </button>
      </div>
    </div>
  );
};

export default ObjectListBatchToolbar;
