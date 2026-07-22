import React from 'react';
import type { VisualDiagramModel, VisualElement } from '../model/types';
import { DiagramExpressionField } from './DiagramExpressionField';
import { DiagramTemplateField } from './DiagramTemplateField';

interface DiagramTextRulesEditorProps {
  model: VisualDiagramModel;
  element: VisualElement;
  onChange: (textRules: NonNullable<VisualElement['properties']>['textRules']) => void;
}

export const DiagramTextRulesEditor: React.FC<DiagramTextRulesEditorProps> = ({ model, element, onChange }) => {
  const rules = element.properties?.textRules ?? [];
  return (
    <section className="border-t border-carbon/10 pt-3" aria-label="Variantes condicionales del contenido">
      <div className="flex items-start justify-between gap-2">
        <div><h5 className="text-xs font-bold text-carbon">Variantes condicionales</h5><p className="mt-1 text-[9px] leading-relaxed text-carbon/50">La primera condición válida sustituye el contenido principal.</p></div>
        <span className="rounded-full bg-pavo/10 px-2 py-1 text-[9px] font-bold text-pavo">{rules.length}</span>
      </div>
      <div className="mt-2 divide-y divide-carbon/10">
        {rules.map((rule, index) => (
          <div key={`${element.id}-text-rule-${index}`} className="space-y-2 py-3">
            <div className="flex items-center justify-between"><strong className="text-[10px] text-carbon/60">Caso {index + 1}</strong><button type="button" aria-label={`Eliminar regla ${index + 1}`} className="min-h-8 px-1 text-[10px] font-bold text-granada" onClick={() => onChange(rules.filter((_, itemIndex) => itemIndex !== index))}>Eliminar</button></div>
            <DiagramExpressionField compact model={model} label={`Condición ${index + 1}`} ariaLabel={`Condición de texto ${index + 1}`} value={rule.when} onChange={value => onChange(rules.map((item, itemIndex) => itemIndex === index ? { ...item, when: value } : item))} />
            <DiagramTemplateField model={model} label="Contenido alternativo" ariaLabel={`Texto reactivo ${index + 1}`} value={rule.text} onChange={text => onChange(rules.map((item, itemIndex) => itemIndex === index ? { ...item, text } : item))} />
          </div>
        ))}
      </div>
      <button type="button" className="mt-2 min-h-10 w-full rounded bg-pavo/10 px-2 text-[10px] font-bold text-pavo hover:bg-pavo/15" onClick={() => onChange([...rules, { when: '1', text: element.text || element.label }])}>+ Añadir variante</button>
    </section>
  );
};
