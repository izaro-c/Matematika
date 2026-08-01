import React from 'react';
import type { ElementPanelProps } from '../../types';

/** Propiedades: visibleWhen, selection.selectable */
export const ElementVisibilitySection: React.FC<ElementPanelProps> = ({
  element,
  onUpdateElement,
}) => (
  <div className="p-2.5 space-y-2 bg-carbon/5 rounded-xl border border-carbon/10 shadow-2xs">
    <div>
      <label className="block text-[11px] font-bold text-carbon/70 mb-0.5">
        Visibilidad Condicionada (`visibleWhen`)
        <input
          type="text"
          value={element.visibleWhen || element.properties?.visibleWhen || ''}
          onChange={e => {
            const val = e.target.value || undefined;
            onUpdateElement(element.id, {
              visibleWhen: val,
              properties: { ...(element.properties || {}), visibleWhen: val },
            });
          }}
          placeholder="ej. step === 'step3' o sliderT < 0"
          className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs font-mono text-carbon"
        />
      </label>
    </div>

    <div className="flex items-center space-x-2 pt-1">
      <input
        type="checkbox"
        id={`selectable-elem-${element.id}`}
        checked={element.selection?.selectable !== false}
        onChange={e =>
          onUpdateElement(element.id, {
            selection: { ...(element.selection || { selectable: true }), selectable: e.target.checked },
          })
        }
        className="rounded border-carbon/30 text-salvia focus:ring-salvia cursor-pointer"
      />
      <label htmlFor={`selectable-elem-${element.id}`} className="text-xs text-carbon/80 cursor-pointer">
        Seleccionable en el lienzo
      </label>
    </div>
  </div>
);
