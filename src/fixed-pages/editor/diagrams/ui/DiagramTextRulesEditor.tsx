import React from 'react';
import type { DiagramObject, DiagramTextRule } from '@/diagrams';
import type { VisualDiagramModel } from '../model/types';
import { DiagramExpressionField } from './panels/DiagramExpressionField';
import { DiagramTemplateField } from './DiagramTemplateField';
import { useI18n } from '@/i18n';
import { Button } from '@/fixed-pages/editor/ui/primitives';

interface DiagramTextRulesEditorProps {
  model: VisualDiagramModel;
  element: DiagramObject;
  onChange: (textRules: DiagramTextRule[] | undefined) => void;
}

export const DiagramTextRulesEditor: React.FC<DiagramTextRulesEditorProps> = ({ model, element, onChange }) => {
  const { t } = useI18n();
  const rules = element.objectType === 'annotation' ? element.content.rules ?? [] : [];
  return (
    <section className="border-t border-carbon/10 pt-3" aria-label={t('editor.diagramEditors.contentVariantsTitle')}>
      <div className="flex items-start justify-between gap-2">
        <div><h5 className="text-xs font-bold text-carbon">{t('editor.diagramEditors.conditionalVariants')}</h5><p className="mt-1 text-[9px] leading-relaxed text-carbon/50">{t('editor.diagramEditors.firstValidCondition')}</p></div>
        <span className="rounded-full bg-pavo/10 px-2 py-1 text-[9px] font-bold text-pavo">{rules.length}</span>
      </div>
      <div className="mt-2 divide-y divide-carbon/10">
        {rules.map((rule, index) => (
          <div key={`${element.id}-text-rule-${index}`} className="space-y-2 py-3">
            <div className="flex items-center justify-between"><strong className="text-[10px] text-carbon/60">{t('editor.diagramEditors.caseN', { n: index + 1 })}</strong><Button size="sm" variant="danger" aria-label={t('editor.diagramEditors.deleteRuleN', { n: index + 1 })} onClick={() => onChange(rules.filter((_, itemIndex) => itemIndex !== index))}>{t('editor.diagramEditors.delete')}</Button></div>
            <DiagramExpressionField compact model={model} label={t('editor.diagramEditors.conditionN', { n: index + 1 })} ariaLabel={t('editor.diagramEditors.textConditionN', { n: index + 1 })} value={rule.when} onChange={value => onChange(rules.map((item, itemIndex) => itemIndex === index ? { ...item, when: value } : item))} />
            <DiagramTemplateField model={model} label={t('editor.diagramEditors.alternativeContent')} ariaLabel={t('editor.diagramEditors.reactiveTextN', { n: index + 1 })} value={rule.text} onChange={text => onChange(rules.map((item, itemIndex) => itemIndex === index ? { ...item, text } : item))} />
          </div>
        ))}
      </div>
      <Button size="sm" fullWidth className="mt-2" onClick={() => onChange([...rules, { when: '1', text: (element.objectType === 'annotation' ? element.content.text : '') || element.label }])}>{t('editor.diagramEditors.addVariant')}</Button>
    </section>
  );
};
