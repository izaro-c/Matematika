import React from 'react';
import { AccordionSection } from '../accordion';
import { InspectorHeader } from '../InspectorHeader';
import { PALETTE_TOKENS } from '../paletteTokens';
import type { V2SliderPanelProps } from '../types';
import { handleRenameId } from '../utils';
import { parseOptionalNumber } from '../../editorV2Selection';

export const V2SliderInspector: React.FC<V2SliderPanelProps & {
  openAccordion: Record<string, boolean>;
  onToggleAccordion: (sec: string) => void;
}> = ({
  model,
  slider,
  onUpdateSlider,
  onDeleteSelected,
  onUpdateModel,
  onSelectId,
  openAccordion,
  onToggleAccordion,
}) => {
  const colorToken = PALETTE_TOKENS.find(c => c.id === slider.color) || PALETTE_TOKENS[5];

  return (
    <div className="p-3 space-y-2 text-xs font-serif text-carbon">
      <InspectorHeader
        title={`Deslizador: ${slider.id}`}
        colorClass={colorToken.bgClass}
        onDelete={() => onDeleteSelected(slider.id)}
      />

      <AccordionSection sec="identity" title="Identidad & Nombre" isOpen={openAccordion.identity} onToggle={onToggleAccordion}>
        <div className="p-2.5 space-y-2 bg-carbon/5 rounded-xl border border-carbon/10 shadow-2xs">
          <div>
            <label className="block text-[11px] font-bold text-carbon/70 mb-0.5">
              Identificador (ID)
              <input
                type="text"
                defaultValue={slider.id}
                key={`id-input-${slider.id}`}
                onBlur={e => handleRenameId(model, slider.id, e.target.value, onUpdateModel, onSelectId)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleRenameId(model, slider.id, e.currentTarget.value, onUpdateModel, onSelectId);
                }}
                className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs font-mono font-bold text-carbon"
              />
            </label>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-carbon/70 mb-0.5">
              Nombre del Parámetro
              <input
                type="text"
                value={slider.label || ''}
                onChange={e => onUpdateSlider(slider.id, { label: e.target.value })}
                placeholder="ej. Parámetro k"
                className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon"
              />
            </label>
          </div>
        </div>
      </AccordionSection>

      <AccordionSection sec="geometry" title="Valor & Rango Numérico" isOpen={openAccordion.geometry} onToggle={onToggleAccordion}>
        <div className="p-2.5 space-y-2 bg-carbon/5 rounded-xl border border-carbon/10 shadow-2xs">
          <div>
            <label className="block text-[11px] font-bold text-carbon/70 mb-0.5">
              Valor Actual: {slider.value}
            </label>
            <input
              type="range"
              min={slider.min ?? -10}
              max={slider.max ?? 10}
              step={slider.step ?? 0.1}
              value={slider.value ?? 0}
              onChange={e => onUpdateSlider(slider.id, { value: parseOptionalNumber(e.target.value, slider.value ?? 0) })}
              className="w-full cursor-pointer accent-salvia"
            />
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <div>
              <label className="block text-[10px] font-medium text-carbon/70 mb-0.5">
                Mínimo
                <input
                  type="number"
                  value={slider.min ?? -5}
                  onChange={e => onUpdateSlider(slider.id, { min: parseOptionalNumber(e.target.value, slider.min ?? -5) })}
                  className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-1.5 py-0.5 text-xs text-carbon"
                />
              </label>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-carbon/70 mb-0.5">
                Máximo
                <input
                  type="number"
                  value={slider.max ?? 5}
                  onChange={e => onUpdateSlider(slider.id, { max: parseOptionalNumber(e.target.value, slider.max ?? 5) })}
                  className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-1.5 py-0.5 text-xs text-carbon"
                />
              </label>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-carbon/70 mb-0.5">
                Paso
                <input
                  type="number"
                  step="0.01"
                  value={slider.step ?? 0.1}
                  onChange={e => onUpdateSlider(slider.id, { step: parseOptionalNumber(e.target.value, slider.step ?? 0.1) })}
                  className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-1.5 py-0.5 text-xs text-carbon"
                />
              </label>
            </div>
          </div>
        </div>
      </AccordionSection>
    </div>
  );
};
