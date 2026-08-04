import React from 'react';
import { AccordionSection } from '../accordion';
import { InspectorHeader } from '../WorkbenchInspectorHeader';
import { PALETTE_TOKENS } from '../paletteTokens';
import type { SliderPanelProps } from '../types';
import { handleRenameId } from '../utils';
import { parseOptionalNumber } from '../../workbenchSelection';

export const SliderInspector: React.FC<SliderPanelProps & {
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
    <div className="p-3 space-y-3 text-xs font-serif text-carbon">
      <InspectorHeader
        title={`Deslizador: ${slider.id}`}
        colorClass={colorToken.bgClass}
        onDelete={() => onDeleteSelected(slider.id)}
      />

      <AccordionSection sec="identity" title="Identidad & Nombre" isOpen={openAccordion.identity} onToggle={onToggleAccordion}>
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
              Identificador (ID)
            </label>
            <input
              type="text"
              defaultValue={slider.id}
              key={`id-input-${slider.id}`}
              onBlur={e => handleRenameId(model, slider.id, e.target.value, onUpdateModel, onSelectId)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleRenameId(model, slider.id, e.currentTarget.value, onUpdateModel, onSelectId);
              }}
              className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 font-mono text-xs font-bold text-carbon shadow-2xs transition-colors focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
              Nombre del Parámetro
            </label>
            <input
              type="text"
              value={slider.label || ''}
              onChange={e => onUpdateSlider(slider.id, { label: e.target.value })}
              placeholder="ej. Parámetro k"
              className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20 placeholder-carbon/30"
            />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection sec="geometry" title="Valor & Rango Numérico" isOpen={openAccordion.geometry} onToggle={onToggleAccordion}>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-carbon/75 tracking-tight">Valor Actual</label>
              <span className="font-mono text-xs font-bold text-salvia bg-salvia/10 px-2 py-0.5 rounded border border-salvia/20">{slider.value}</span>
            </div>
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

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-carbon/10">
            <div>
              <label className="block text-[10px] font-bold text-carbon/75 tracking-tight mb-1">
                Mínimo
              </label>
              <input
                type="number"
                value={slider.min ?? -5}
                onChange={e => onUpdateSlider(slider.id, { min: parseOptionalNumber(e.target.value, slider.min ?? -5) })}
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-2.5 py-1 text-xs text-carbon shadow-2xs transition-colors focus:border-salvia focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-carbon/75 tracking-tight mb-1">
                Máximo
              </label>
              <input
                type="number"
                value={slider.max ?? 5}
                onChange={e => onUpdateSlider(slider.id, { max: parseOptionalNumber(e.target.value, slider.max ?? 5) })}
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-2.5 py-1 text-xs text-carbon shadow-2xs transition-colors focus:border-salvia focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-carbon/75 tracking-tight mb-1">
                Paso
              </label>
              <input
                type="number"
                step="0.01"
                value={slider.step ?? 0.1}
                onChange={e => onUpdateSlider(slider.id, { step: parseOptionalNumber(e.target.value, slider.step ?? 0.1) })}
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-2.5 py-1 text-xs text-carbon shadow-2xs transition-colors focus:border-salvia focus:outline-none"
              />
            </div>
          </div>
        </div>
      </AccordionSection>
    </div>
  );
};
