import React from 'react';
import type { ElementPanelProps } from '../../types';

/** Propiedades: visibleWhen, selection.selectable */
export const ElementVisibilitySection: React.FC<ElementPanelProps> = ({
  element,
  onUpdateElement,
}) => (
  <div className="space-y-3">
    <div>
      <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
        Visibilidad Condicionada (<code className="font-mono text-[10px] text-salvia">visibleWhen</code>)
      </label>
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
        className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 font-mono text-xs text-carbon shadow-2xs transition-colors focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20 placeholder-carbon/30"
      />
    </div>

    <div className="flex items-center space-x-2 pt-1 border-t border-carbon/10">
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
      <label htmlFor={`selectable-elem-${element.id}`} className="text-xs font-bold text-carbon/80 cursor-pointer select-none">
        Seleccionable sobre el lienzo
      </label>
    </div>
  </div>
);
