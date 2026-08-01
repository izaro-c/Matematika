import React from 'react';
import type { VisualDiagramModel, VisualElement } from '../model/types';
import { DiagramExpressionField } from './DiagramExpressionField';

interface DiagramElementBehaviorEditorProps {
  model: VisualDiagramModel;
  element: VisualElement;
  onElementChange: (update: Partial<VisualElement>) => void;
  onPropertiesChange: (update: NonNullable<VisualElement['properties']>) => void;
}

export const DiagramElementBehaviorEditor: React.FC<DiagramElementBehaviorEditorProps> = ({ model, element, onElementChange, onPropertiesChange }) => (
  <details className="rounded border border-carbon/10 p-2">
    <summary className="cursor-pointer text-xs font-bold text-carbon">Visibilidad y enlaces</summary>
    <div className="mt-2 space-y-3">
      <DiagramExpressionField model={model} label="Visible cuando" ariaLabel="Condición de visibilidad" placeholder="Vacío = siempre visible" value={element.properties?.visibleWhen ?? ''} onChange={value => onPropertiesChange({ visibleWhen: value || undefined })} optional help="La expresión debe producir 1 para mostrar el objeto y 0 para ocultarlo." />
      <label className="flex items-start gap-1.5 text-xs font-bold text-carbon">
        <input type="checkbox" checked={element.target} onChange={event => onElementChange({ target: event.target.checked })} />
        <span>Enlazable desde MDX<span className="mt-0.5 block text-[10px] font-normal leading-relaxed text-carbon/50">Permite destacar este objeto desde el contenido matemático mediante su target público.</span></span>
      </label>
    </div>
  </details>
);
