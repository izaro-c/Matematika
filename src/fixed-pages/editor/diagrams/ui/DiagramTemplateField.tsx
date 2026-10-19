import React, { useRef, useState } from 'react';
import { parseMathExpression } from '@/diagrams/public';
import type { VisualDiagramModel } from '../model/types';
import { DiagramExpressionField } from './panels/DiagramExpressionField';
import { useI18n } from '@/i18n';
import { Button, controlClassName } from '@/fixed-pages/editor/ui/primitives';

interface DiagramTemplateFieldProps {
  model: VisualDiagramModel;
  label: string;
  ariaLabel?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  richText?: boolean;
  formula?: boolean;
}

function safeUnit(value: string): string {
  return value.replace(/["{}|]/g, '').trim();
}

export const DiagramTemplateField: React.FC<DiagramTemplateFieldProps> = ({
  model,
  label,
  ariaLabel,
  value,
  onChange,
  placeholder,
  rows = 2,
  richText = false,
  formula = false,
}) => {
  const { t } = useI18n();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [calculationOpen, setCalculationOpen] = useState(false);
  const [expression, setExpression] = useState('');
  const [unit, setUnit] = useState('');
  const [precision, setPrecision] = useState(2);
  let expressionIsValid = false;
  try {
    parseMathExpression(expression);
    expressionIsValid = true;
  } catch {
    expressionIsValid = false;
  }

  const insert = (before: string, after = '', selectInserted = false) => {
    const input = textareaRef.current;
    const hasActiveSelection = input === document.activeElement;
    const start = hasActiveSelection && input ? input.selectionStart : value.length;
    const end = hasActiveSelection && input ? input.selectionEnd : value.length;
    const selected = value.slice(start, end);
    const replacement = `${before}${selected}${after}`;
    onChange(`${value.slice(0, start)}${replacement}${value.slice(end)}`);
    requestAnimationFrame(() => {
      const nextStart = start + before.length;
      const nextEnd = selectInserted ? nextStart + selected.length : start + replacement.length;
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(nextEnd, nextEnd);
    });
  };

  const insertCalculation = () => {
    if (!expressionIsValid) return;
    const normalizedUnit = safeUnit(unit);
    const unitOption = normalizedUnit ? ` | unit: "${normalizedUnit}"` : '';
    const token = `{= ${expression.trim()} | precision: ${precision}${unitOption}}`;
    insert(token);
    setCalculationOpen(false);
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-carbon">
        {label}
        <textarea
          ref={textareaRef}
          rows={rows}
          aria-label={ariaLabel ?? label}
          className={`${controlClassName} mt-1 resize-y ${formula ? 'font-mono' : ''}`}
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
          spellCheck={!formula}
        />
      </label>

      <div className="flex flex-wrap items-center gap-1.5">
        {richText && <>
          <Button size="sm" onClick={() => insert('**', '**', true)}>{t('editor.diagramEditors.bold')}</Button>
          <Button size="sm" onClick={() => insert('*', '*', true)}>{t('editor.diagramEditors.italic')}</Button>
          <Button size="sm" className="font-mono" onClick={() => insert('$', '$', true)}>{t('editor.diagramEditors.formula')}</Button>
          <select
            aria-label={t('editor.diagramEditors.textColorFor', { label })}
            className={controlClassName}
            value=""
            onChange={event => {
              if (event.target.value) insert(`[${event.target.value}:`, ']', true);
            }}
          >
            <option value="">{t('editor.diagramEditors.color')}</option>
            {['carbon', 'pavo', 'granada', 'ocre', 'canela', 'musgo', 'terracota', 'mora'].map(color => <option key={color} value={color}>{color}</option>)}
          </select>
        </>}
        <Button size="sm" aria-expanded={calculationOpen} onClick={() => setCalculationOpen(open => !open)}>
          {calculationOpen ? t('editor.diagramEditors.closeCalculation') : t('editor.diagramEditors.insertCalculation')}
        </Button>
        <span className="text-[9px] text-carbon/45">{t('editor.diagramEditors.youCanInsertSeveral')}</span>
      </div>
      {formula && <p className="text-[9px] leading-relaxed text-carbon/45">{t('editor.diagramEditors.richTextHint')}</p>}

      {calculationOpen && (
        <div className="space-y-2 border-t border-carbon/10 pt-2" aria-label={t('editor.diagramEditors.insertCalculationIn', { label })}>
          <DiagramExpressionField
            model={model}
            label={t('editor.diagramEditors.whatIsCalculated')}
            ariaLabel={t('editor.diagramEditors.expressionFor', { label })}
            value={expression}
            onChange={setExpression}
            placeholder={t('editor.diagramEditors.calculationPlaceholder')}
          />
          <div className="grid grid-cols-[minmax(0,1fr)_7rem] gap-2">
            <label className="text-[10px] font-bold text-carbon/60">{t('editor.diagramEditors.unit')}{' '}<span className="font-normal">{t('editor.diagramEditors.optional')}</span>
              <input aria-label={t('editor.diagramEditors.unitFor', { label })} className={`${controlClassName} mt-1`} value={unit} onChange={event => setUnit(event.target.value)} placeholder={t('editor.diagramEditors.cmM')} />
            </label>
            <label className="text-[10px] font-bold text-carbon/60">{t('editor.diagramEditors.decimals')}
              <input type="number" min="0" max="12" aria-label={t('editor.diagramEditors.decimalsFor', { label })} className={`${controlClassName} mt-1`} value={precision} onChange={event => setPrecision(Math.max(0, Math.min(12, Number(event.target.value))))} />
            </label>
          </div>
          <div className="flex items-center justify-between gap-2">
            <code className="min-w-0 truncate text-[9px] text-carbon/45">{expression.trim() ? `{= ${expression.trim()} …}` : t('editor.diagramEditors.calculationInsertHint')}</code>
            <Button size="sm" variant="primary" className="shrink-0" aria-label={t('editor.diagramEditors.insertCalculationIn', { label })} disabled={!expressionIsValid} onClick={insertCalculation}>{t('editor.diagramEditors.insertCalculationButton')}</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagramTemplateField;
