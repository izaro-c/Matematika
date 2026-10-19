import React from 'react';
import { useI18n } from '@/i18n';
import type { DiagramTargetRegistry } from '@/fixed-pages/editor/session/editorTypes';
import { Button } from '../primitives';

interface StepAssignmentBarProps {
  stepTargets: DiagramTargetRegistry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBlockIds: string[];
  onClearSelection: () => void;
  /** `null` quita la asignación. */
  onAssign: (stepId: string | null) => void;
}

/** Barra para asignar un paso del diagrama a varios bloques de la página. */
export const StepAssignmentBar: React.FC<StepAssignmentBarProps> = ({
  stepTargets,
  open,
  onOpenChange,
  selectedBlockIds,
  onClearSelection,
  onAssign,
}) => {
  const { t } = useI18n();
  return (
    <div className="flex items-center justify-between rounded border border-terracota/25 bg-terracota/5 p-2.5 font-sans text-xs text-carbon">
      <div className="flex items-center gap-2">
        <span className="font-bold text-terracota">{t('editor.visual.diagramSteps')}</span>
        <Button
          size="sm"
          aria-pressed={open}
          onClick={() => {
            onOpenChange(!open);
            if (open) onClearSelection();
          }}
        >
          {open ? t('editor.visual.cancelSelection') : t('editor.visual.assignStepToBlocks')}
        </Button>
      </div>

      {open && selectedBlockIds.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-carbon/60">{t(selectedBlockIds.length === 1 ? 'editor.visual.selectedOne' : 'editor.visual.selectedOther', { count: selectedBlockIds.length })}</span>
          <select
            defaultValue=""
            onChange={(e) => {
              onAssign(e.target.value || null);
              onClearSelection();
              onOpenChange(false);
            }}
            className="rounded border border-terracota/30 bg-lienzo px-2 py-1 font-mono text-[11px] text-carbon outline-none"
          >
            <option value="">{t('editor.visual.selectStep')}</option>
            {stepTargets.map(target => (
              <option key={target.id} value={target.id}>✦ {target.label || target.id}</option>
            ))}
            <option value="">{t('editor.visual.removeAssignment')}</option>
          </select>
        </div>
      )}
    </div>
  );
};
