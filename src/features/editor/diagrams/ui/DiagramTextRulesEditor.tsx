import React from 'react';
import type { VisualDiagramModel, VisualElement } from '../model/types';
import { DiagramExpressionField } from './DiagramExpressionField';

interface DiagramTextRulesEditorProps {
  model: VisualDiagramModel;
  element: VisualElement;
  onChange: (textRules: NonNullable<VisualElement['properties']>['textRules']) => void;
}

export const DiagramTextRulesEditor: React.FC<DiagramTextRulesEditorProps> = ({ model, element, onChange }) => {
  const rules = element.properties?.textRules ?? [];
  return (
    <details className="rounded border border-pavo/20 bg-pavo/5 p-2" open={rules.length > 0}>
      <summary className="cursor-pointer text-xs font-bold text-pavo">Variantes condicionales del contenido</summary>
      <p className="mt-1 text-[9px] leading-relaxed text-carbon/50">Sustituyen el contenido principal cuando la primera condición válida produce 1. Se prueban de arriba abajo.</p>
      <div className="mt-2 space-y-2">
        {rules.map((rule, index) => (
          <div key={`${element.id}-text-rule-${index}`} className="space-y-1 rounded border border-carbon/10 bg-lienzo p-2">
            <DiagramExpressionField compact model={model} label={`Condición ${index + 1}`} ariaLabel={`Condición de texto ${index + 1}`} value={rule.when} onChange={value => onChange(rules.map((item, itemIndex) => itemIndex === index ? { ...item, when: value } : item))} />
            <div className="flex gap-1">
              <input aria-label={`Texto reactivo ${index + 1}`} className="min-w-0 flex-1 rounded border border-carbon/15 bg-lienzo p-1 text-[10px]" value={rule.text} onChange={event => onChange(rules.map((item, itemIndex) => itemIndex === index ? { ...item, text: event.target.value } : item))} />
              <button type="button" aria-label={`Eliminar regla ${index + 1}`} className="rounded border border-granada/20 px-2 text-granada" onClick={() => onChange(rules.filter((_, itemIndex) => itemIndex !== index))}>×</button>
            </div>
          </div>
        ))}
        <button type="button" className="w-full rounded border border-pavo/25 bg-lienzo px-2 py-1 text-[10px] font-bold text-pavo" onClick={() => onChange([...rules, { when: '1', text: element.text || element.label }])}>+ Añadir variante</button>
      </div>
    </details>
  );
};
