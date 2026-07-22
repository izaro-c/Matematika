import React, { useRef, useState } from 'react';
import { parseMathExpression } from '@/shared/diagrams/public';
import type { VisualDiagramModel } from '../model/types';
import { DiagramExpressionField } from './DiagramExpressionField';

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
          className={`mt-1 w-full resize-y rounded border border-carbon/15 bg-lienzo p-2 text-xs leading-relaxed focus:border-pavo focus:outline-none focus:ring-2 focus:ring-pavo/20 ${formula ? 'font-mono' : ''}`}
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
          spellCheck={!formula}
        />
      </label>

      <div className="flex flex-wrap items-center gap-1.5">
        {richText && <>
          <button type="button" className="min-h-8 rounded px-2 text-[10px] font-bold text-carbon/65 hover:bg-carbon/5" onClick={() => insert('**', '**', true)}>Negrita</button>
          <button type="button" className="min-h-8 rounded px-2 text-[10px] italic text-carbon/65 hover:bg-carbon/5" onClick={() => insert('*', '*', true)}>Cursiva</button>
          <button type="button" className="min-h-8 rounded px-2 text-[10px] font-mono text-carbon/65 hover:bg-carbon/5" onClick={() => insert('$', '$', true)}>Fórmula</button>
          <select
            aria-label={`Color de texto para ${label}`}
            className="min-h-8 rounded border-0 bg-carbon/5 px-1 text-[10px] text-carbon/65"
            value=""
            onChange={event => {
              if (event.target.value) insert(`[${event.target.value}:`, ']', true);
            }}
          >
            <option value="">Color…</option>
            {['carbon', 'pavo', 'granada', 'ocre', 'salvia', 'musgo', 'terracota', 'pizarra'].map(color => <option key={color} value={color}>{color}</option>)}
          </select>
        </>}
        <button
          type="button"
          aria-expanded={calculationOpen}
          className="min-h-8 rounded bg-pavo/10 px-2 text-[10px] font-bold text-pavo hover:bg-pavo/15"
          onClick={() => setCalculationOpen(open => !open)}
        >
          {calculationOpen ? 'Cerrar cálculo' : '+ Insertar cálculo'}
        </button>
        <span className="text-[9px] text-carbon/45">Puede insertar varios.</span>
      </div>
      {formula && <p className="text-[9px] leading-relaxed text-carbon/45">Admite KaTeX; las llaves de fracciones y subíndices se conservan. Los valores dinámicos se añaden con «Insertar cálculo».</p>}

      {calculationOpen && (
        <div className="space-y-2 border-t border-carbon/10 pt-2" aria-label={`Insertar cálculo en ${label}`}>
          <DiagramExpressionField
            model={model}
            label="Qué se calcula"
            ariaLabel={`Expresión para ${label}`}
            value={expression}
            onChange={setExpression}
            placeholder="Ej. segAB.length / 2"
          />
          <div className="grid grid-cols-[minmax(0,1fr)_7rem] gap-2">
            <label className="text-[10px] font-bold text-carbon/60">Unidad <span className="font-normal">(opcional)</span>
              <input aria-label={`Unidad para ${label}`} className="mt-1 min-h-10 w-full rounded border border-carbon/15 bg-lienzo px-2 text-xs" value={unit} onChange={event => setUnit(event.target.value)} placeholder="cm, °, m²…" />
            </label>
            <label className="text-[10px] font-bold text-carbon/60">Decimales
              <input type="number" min="0" max="12" aria-label={`Decimales para ${label}`} className="mt-1 min-h-10 w-full rounded border border-carbon/15 bg-lienzo px-2 text-xs" value={precision} onChange={event => setPrecision(Math.max(0, Math.min(12, Number(event.target.value))))} />
            </label>
          </div>
          <div className="flex items-center justify-between gap-2">
            <code className="min-w-0 truncate text-[9px] text-carbon/45">{expression.trim() ? `{= ${expression.trim()} …}` : 'El cálculo se insertará en el cursor'}</code>
            <button type="button" aria-label={`Insertar cálculo en ${label}`} disabled={!expressionIsValid} className="min-h-10 shrink-0 rounded bg-pavo px-3 text-[10px] font-bold text-lienzo disabled:opacity-35" onClick={insertCalculation}>Insertar cálculo</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagramTemplateField;
