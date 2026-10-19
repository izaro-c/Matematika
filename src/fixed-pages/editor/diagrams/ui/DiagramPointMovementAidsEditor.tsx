import React from 'react';
import type { PointInteraction } from '@/diagrams';
import type { VisualDiagramModel, VisualPoint } from '../model/types';
import { movementAttractorCreatesCycle, movementAttractors, pointSupportsMovementAids } from '../model/scene/pointMovement';
import { InspectorExpandableBlock } from './inspector/InspectorExpandableBlock';
import { useI18n } from '@/i18n';
import { IconButton } from '@/fixed-pages/editor/ui/primitives';

interface DiagramPointMovementAidsEditorProps {
  model: VisualDiagramModel;
  point: VisualPoint;
  onInteractionChange: (update: Partial<PointInteraction>) => void;
  onAttractorsChange: (attractorIds: string[]) => void;
}

const inspectorInputClass =
  'mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon';
const inspectorCheckboxClass =
  'rounded border-carbon/30 text-canela focus:ring-canela cursor-pointer';
const sectionLabelClass = 'block text-[11px] font-bold text-carbon/70 mb-0.5';

export const DiagramPointMovementAidsEditor: React.FC<DiagramPointMovementAidsEditorProps> = ({
  model,
  point,
  onInteractionChange,
  onAttractorsChange,
}) => {
  const { t } = useI18n();
  const interaction = point.interaction ?? {};
  const supportsMovementAids = pointSupportsMovementAids(point);
  const attractors = movementAttractors(model).filter(attractor => attractor.id !== point.id);
  const selectedAttractors = interaction.attractorIds ?? [];
  const defaultOpen = Boolean(interaction.snapToGrid || selectedAttractors.length > 0);
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
    <InspectorExpandableBlock title={t('editor.diagramEditors.snapAndMagnetism')} defaultOpen={defaultOpen}>
      <p className="text-[10px] leading-relaxed text-carbon/50">
        {t('editor.diagramEditors.snapHint')}
      </p>

      <div className="space-y-2">
        <span className={sectionLabelClass}>{t('editor.diagramEditors.gridSnap')}</span>
        <label className="flex items-center gap-1.5 text-xs font-bold text-carbon/80 cursor-pointer">
          <input
            type="checkbox"
            aria-label={t('editor.diagramEditors.snapToGrid')}
            checked={interaction.snapToGrid ?? false}
            onChange={event => onInteractionChange({ snapToGrid: event.target.checked })}
            className={`h-3.5 w-3.5 ${inspectorCheckboxClass}`}
          />
          {t('editor.diagramEditors.snapToGrid')}
        </label>
        {interaction.snapToGrid && (
          <label className={sectionLabelClass}>
            {t('editor.diagramEditors.cellSize')}
            <input
              type="number"
              min="0.01"
              max="10"
              step="0.25"
              aria-label={t('editor.diagramEditors.gridCellAria')}
              className={inspectorInputClass}
              value={interaction.snapSize ?? 0.5}
              onChange={event => onInteractionChange({ snapSize: Math.max(0.01, Number(event.target.value)) })}
            />
          </label>
        )}
      </div>

      <div className="space-y-2 pt-1 border-t border-carbon/10">
        <span className={sectionLabelClass}>{t('editor.diagramEditors.magnetismTowardsShapes')}</span>
        {selectedAttractors.length > 0 && (
          <ol className="space-y-1.5" aria-label={t('editor.diagramEditors.attractorPriorityOf', { label: point.label })}>
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
                    <IconButton size="sm" label={t('editor.diagramEditors.moveAttractorUp', { label: attractor?.label ?? attractorId })} disabled={index === 0} onClick={() => moveAttractor(attractorId, -1)}>
                      ↑
                    </IconButton>
                    <IconButton size="sm" label={t('editor.diagramEditors.moveAttractorDown', { label: attractor?.label ?? attractorId })} disabled={index === selectedAttractors.length - 1} onClick={() => moveAttractor(attractorId, 1)}>
                      ↓
                    </IconButton>
                  </span>
                </li>
              );
            })}
          </ol>
        )}
        <div className="max-h-40 space-y-1 overflow-y-auto">
          {attractors.map(element => {
            const checked = interaction.attractorIds?.includes(element.id) ?? false;
            const createsCycle = !checked && movementAttractorCreatesCycle(model, point.id, element.id);
            return (
              <label
                key={element.id}
                className={[
                  'flex items-center gap-1.5 rounded px-1.5 py-0.5 text-[10px]',
                  createsCycle
                    ? 'pointer-events-none cursor-not-allowed select-none bg-carbon/5 text-carbon/30'
                    : 'text-carbon cursor-pointer hover:bg-carbon/[0.03]',
                ].join(' ')}
              >
                <input
                  type="checkbox"
                  aria-label={t('editor.diagramEditors.useAsAttractor', { label: element.label })}
                  checked={checked}
                  disabled={createsCycle}
                  tabIndex={createsCycle ? -1 : undefined}
                  className={[
                    'h-3 w-3',
                    createsCycle
                      ? 'rounded border-carbon/15 accent-carbon/30 opacity-40 cursor-not-allowed'
                      : inspectorCheckboxClass,
                  ].join(' ')}
                  onChange={event =>
                    onAttractorsChange(
                      event.target.checked
                        ? [...(interaction.attractorIds ?? []), element.id]
                        : (interaction.attractorIds ?? []).filter(id => id !== element.id),
                    )
                  }
                />
                <span className={createsCycle ? 'font-normal' : undefined}>
                  <span className={createsCycle ? 'line-through decoration-carbon/20' : undefined}>
                    {element.label}{' '}
                    <span className={createsCycle ? 'font-mono text-carbon/25' : 'font-mono text-carbon/45'}>
                      ({element.id})
                    </span>
                  </span>
                  {createsCycle ? (
                    <span className="text-carbon/25"> {t('editor.diagramEditors.notAvailableCycle')}</span>
                  ) : null}
                </span>
              </label>
            );
          })}
        </div>
        {(interaction.attractorIds?.length ?? 0) > 0 && (
          <div className="grid grid-cols-2 gap-2">
            <label className={sectionLabelClass}>
              {t('editor.diagramEditors.attraction')}
              <input
                type="number"
                min="0.01"
                max="20"
                step="0.05"
                aria-label={t('editor.diagramEditors.attractionDistance')}
                className={inspectorInputClass}
                value={interaction.attractorDistance ?? 0.4}
                onChange={event =>
                  onInteractionChange({ attractorDistance: Math.max(0.01, Number(event.target.value)) })
                }
              />
            </label>
            <label className={sectionLabelClass}>
              {t('editor.diagramEditors.release')}
              <input
                type="number"
                min="0.01"
                max="20"
                step="0.05"
                aria-label={t('editor.diagramEditors.releaseDistance')}
                className={inspectorInputClass}
                value={interaction.snatchDistance ?? 0.6}
                onChange={event =>
                  onInteractionChange({ snatchDistance: Math.max(0.01, Number(event.target.value)) })
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
