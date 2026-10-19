import { isPositionedPoint, pointIsImmovable } from '@/diagrams';
import { withPointMode } from '../../model/elements/pointModes';
import React from 'react';
import type { VisualDiagramModel } from '../../model/types';
import { setVisibilityInAllSteps } from '../stepMatrixUtils';
import { useI18n } from '@/i18n';
import { Button, Callout } from '@/fixed-pages/editor/ui/primitives';

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
    <Callout className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
      <div className="flex items-center gap-1">
        <span className="font-bold text-pavo">{t(selectedIds.length === 1 ? 'editor.diagramScene.selectedCountOne' : 'editor.diagramScene.selectedCountOther', { count: selectedIds.length })}</span>
        <Button size="sm" variant="quiet" onClick={onClearSelection}>
          {t('editor.diagramScene.deselect')}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {model.steps.length > 0 && (
          <>
            <Button size="sm" title={t('editor.diagramScene.showInAllTitle')} onClick={handleShowInAllSteps}>
              {t('editor.diagramScene.showInAll')}
            </Button>
            <Button size="sm" title={t('editor.diagramScene.hideInAllTitle')} onClick={handleHideInAllSteps}>
              {t('editor.diagramScene.hideInAll')}
            </Button>
          </>
        )}
        <Button size="sm" title={t('editor.diagramScene.toggleLockTitle')} onClick={handleToggleLock}>
          {t('editor.diagramScene.toggleLock')}
        </Button>
      </div>
    </Callout>
  );
};

export default ObjectListBatchToolbar;
