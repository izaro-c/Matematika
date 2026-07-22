import React from 'react';
import type { VisualDiagramModel, VisualSlider, ColorToken } from '../../model/types';
import { COLOR_OPTIONS, cleanTargetId, renameSlider } from '../../model';
import { DiagramExpressionField } from '../DiagramExpressionField';
import type { InspectorHandlers } from './useInspectorHandlers';
import type { InspectorSection } from './inspectorUtils';

interface InspectorSliderPanelProps {
  model: VisualDiagramModel;
  slider: VisualSlider;
  activeSection: InspectorSection;
  handlers: Pick<InspectorHandlers, 'handleSliderChange'>;
  onModelEdit: (model: VisualDiagramModel) => void;
  onSelect: (id: string) => void;
}

export const InspectorSliderPanel: React.FC<InspectorSliderPanelProps> = ({
  model,
  slider: selectedSlider,
  activeSection: activeInspectorSection,
  handlers: { handleSliderChange },
  onModelEdit,
  onSelect,
}) => (
  <div className="space-y-3">
    {activeInspectorSection === 'general' && <>
    <div>
      <label className="block text-xs font-bold text-carbon mb-1">ID interno del objeto</label>
      <input
        className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs"
        value={selectedSlider.id}
        onChange={(e) => {
          const nextId = cleanTargetId(e.target.value, selectedSlider.id);
          onModelEdit(renameSlider(model, selectedSlider.id, nextId));
          onSelect(nextId);
        }}
      />
    </div>

    <div>
      <label className="block text-xs font-bold text-carbon mb-1">Etiqueta</label>
      <input
        className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
        value={selectedSlider.label}
        onChange={(e) => handleSliderChange({ label: e.target.value })}
      />
      <span className="mt-1 block text-[10px] text-carbon/45">Admite LaTeX entre <code>$...$</code> o <code>$$...$$</code>.</span>
    </div>
    </>}

    {activeInspectorSection === 'geometry' && <>
    <div className="grid grid-cols-3 gap-1">
      <div>
        <label className="block text-[10px] font-bold text-carbon mb-1">Mínimo</label>
        <input
          type="number"
          className="w-full rounded border border-carbon/15 bg-lienzo p-1 text-xs"
          value={selectedSlider.min}
          onChange={(e) => handleSliderChange({ min: Number(e.target.value) })}
        />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-carbon mb-1">Valor</label>
        <input
          type="number"
          step={selectedSlider.step}
          className="w-full rounded border border-carbon/15 bg-lienzo p-1 text-xs"
          value={selectedSlider.value}
          onChange={(e) => handleSliderChange({ value: Number(e.target.value) })}
        />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-carbon mb-1">Máximo</label>
        <input
          type="number"
          className="w-full rounded border border-carbon/15 bg-lienzo p-1 text-xs"
          value={selectedSlider.max}
          onChange={(e) => handleSliderChange({ max: Number(e.target.value) })}
        />
      </div>
    </div>

    <DiagramExpressionField model={model} label="Expresión del máximo dinámico" ariaLabel="Expresión del máximo dinámico del slider" value={selectedSlider.maxExpression ?? ''} onChange={value => handleSliderChange({ maxExpression: value || undefined })} placeholder="Vacío = usar máximo fijo" optional help="El máximo fijo se conserva como respaldo si la expresión todavía no puede evaluarse." />
    </>}

    {activeInspectorSection === 'advanced' && (
    <DiagramExpressionField
      model={model}
      label="Visible cuando"
      ariaLabel="Condición de visibilidad del slider"
      value={selectedSlider.visibleWhen ?? ''}
      onChange={value => handleSliderChange({ visibleWhen: value || undefined })}
      placeholder="Vacío = siempre visible"
      optional
      help="La condición se reevalúa mientras cambia la construcción. Un resultado cero oculta el control."
    />
    )}

    {activeInspectorSection === 'appearance' && (
    <div>
      <label className="block text-xs font-bold text-carbon mb-1">Color</label>
      <select
        className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
        value={selectedSlider.color}
        onChange={(e) => handleSliderChange({ color: e.target.value as ColorToken })}
      >
        {COLOR_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
    )}
  </div>
);
