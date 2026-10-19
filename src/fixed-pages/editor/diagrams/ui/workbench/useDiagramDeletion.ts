import { useCallback, useState } from 'react';
import { deleteDiagramCascade } from '../../model';
import type { VisualDiagramModel } from '../../model/types';

interface Options {
  model: VisualDiagramModel | null;
  selectedIds: readonly string[];
  handleVisualEdit: (model: VisualDiagramModel, command: { label: string }) => void;
  selectMany: (ids: string[], primaryId?: string) => void;
  setStatusMessage: (message: string) => void;
}

/** Borrado con confirmación: pide los identificadores, los elimina en cascada y deja la selección restante. */
export function useDiagramDeletion({ model, selectedIds, handleVisualEdit, selectMany, setStatusMessage }: Options) {
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[] | null>(null);

  const requestDeleteIds = useCallback((ids: string[]) => {
    const unique = [...new Set(ids)].filter(Boolean);
    if (unique.length === 0) return;
    setPendingDeleteIds(unique);
  }, []);

  const handleDeleteSelected = useCallback(
    (id: string) => {
      requestDeleteIds([id]);
    },
    [requestDeleteIds],
  );

  const confirmDeleteIds = useCallback(() => {
    if (!model || !pendingDeleteIds?.length) {
      setPendingDeleteIds(null);
      return;
    }
    let nextModel = model;
    for (const id of pendingDeleteIds) {
      nextModel = deleteDiagramCascade(nextModel, id).model;
    }
    handleVisualEdit(nextModel, {
      label: pendingDeleteIds.length === 1
        ? `Eliminar ${pendingDeleteIds[0]}`
        : `Eliminar ${pendingDeleteIds.length} objetos`,
    });
    selectMany(selectedIds.filter(id => !pendingDeleteIds.includes(id)));
    setStatusMessage(
      pendingDeleteIds.length === 1
        ? `Eliminado ${pendingDeleteIds[0]}`
        : `Eliminados ${pendingDeleteIds.length} objetos`,
    );
    setPendingDeleteIds(null);
  }, [selectedIds, handleVisualEdit, model, pendingDeleteIds, selectMany, setStatusMessage]);

  return { pendingDeleteIds, setPendingDeleteIds, requestDeleteIds, handleDeleteSelected, confirmDeleteIds };
}
