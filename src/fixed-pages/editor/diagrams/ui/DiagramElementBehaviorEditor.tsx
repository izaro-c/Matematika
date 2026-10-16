import React from 'react';
import type { VisualDiagramModel, VisualElement } from '../model/types';
import { DiagramExpressionField } from './panels/DiagramExpressionField';
import { useI18n } from '@/i18n';

interface DiagramElementBehaviorEditorProps {
  model: VisualDiagramModel;
  element: VisualElement;
  onElementChange: (update: { visibleWhen?: string; target?: boolean }) => void;
}

export const DiagramElementBehaviorEditor: React.FC<DiagramElementBehaviorEditorProps> = ({ model, element, onElementChange }) => {
  const { t } = useI18n();
  return (
  <details className="rounded border border-carbon/10 p-2">
    <summary className="cursor-pointer text-xs font-bold text-carbon">{t('editor.diagramEditors.visibilityAndLinks')}</summary>
    <div className="mt-2 space-y-3">
      <DiagramExpressionField model={model} label={t('editor.diagramEditors.visibleWhen')} ariaLabel={t('editor.diagramEditors.visibilityCondition')} placeholder={t('editor.diagramEditors.emptyAlwaysVisible')} value={element.visibleWhen ?? ''} onChange={value => onElementChange({ visibleWhen: value || undefined })} optional help={t('editor.diagramEditors.visibilityConditionHelp')} />
      <label className="flex items-start gap-1.5 text-xs font-bold text-carbon">
        <input type="checkbox" checked={element.target} onChange={event => onElementChange({ target: event.target.checked })} />
        <span>{t('editor.diagramEditors.mdxLinkable')}<span className="mt-0.5 block text-[10px] font-normal leading-relaxed text-carbon/50">{t('editor.diagramEditors.linkableHint')}</span></span>
      </label>
    </div>
  </details>
);
};
