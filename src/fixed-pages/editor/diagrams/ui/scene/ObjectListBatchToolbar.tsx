import { isPositionedPoint, pointIsImmovable } from '@/diagrams';
import { withPointMode } from '../../model/elements/pointModes';
import React from 'react';
import type { VisualDiagramModel } from '../../model/types';
import { setVisibilityInAllSteps } from '../stepMatrixUtils';
import { useI18n } from '@/i18n';

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
  const { t } = useI18n();
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
    const nextObjects = model.objects.map(object => {
      if (!pointsToToggle.has(object.id) || !isPositionedPoint(object)) return object;
      return withPointMode(object, pointIsImmovable(object) ? 'free' : 'fixed');
    });
    onModelEdit({ ...model, objects: nextObjects });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-1.5 rounded-lg border border-pavo/20 bg-pavo/5 p-2 text-xs">
      <div className="flex items-center gap-1">
        <span className="font-bold text-pavo">{t(selectedIds.length === 1 ? 'editor.diagramScene.selectedCountOne' : 'editor.diagramScene.selectedCountOther', { count: selectedIds.length })}</span>
        <button
          type="button"
          onClick={onClearSelection}
          className="text-[10px] text-carbon/50 underline hover:text-carbon"
        >
          {t('editor.diagramScene.deselect')}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {model.steps.length > 0 && (
          <>
            <button
              type="button"
              title={t('editor.diagramScene.showInAllTitle')}
              onClick={handleShowInAllSteps}
              className="rounded border border-canela/30 bg-lienzo px-2 py-1 text-[10px] font-bold text-musgo hover:bg-canela/10"
            >
              {t('editor.diagramScene.showInAll')}
            </button>
            <button
              type="button"
              title={t('editor.diagramScene.hideInAllTitle')}
              onClick={handleHideInAllSteps}
              className="rounded border border-carbon/15 bg-lienzo px-2 py-1 text-[10px] font-bold text-carbon/60 hover:bg-carbon/5"
            >
              {t('editor.diagramScene.hideInAll')}
            </button>
          </>
        )}
        <button
          type="button"
          title={t('editor.diagramScene.toggleLockTitle')}
          onClick={handleToggleLock}
          className="rounded border border-carbon/15 bg-lienzo px-2 py-1 text-[10px] font-bold text-carbon/75 hover:bg-carbon/5"
        >
          {t('editor.diagramScene.toggleLock')}
        </button>
      </div>
    </div>
  );
};

export default ObjectListBatchToolbar;
