import React from 'react';
import { TextContentHelp } from '../../help';
import type { ElementPanelProps } from '../../types';
import { elementReferenceCandidates, handleRenameId, updateElementRef } from '../../utils';

/** Propiedades: id, label, refs */
export const ElementIdentitySection: React.FC<ElementPanelProps> = ({
  model,
  element,
  onUpdateElement,
  onUpdateModel,
  onSelectId,
}) => (
  <div className="space-y-3">
    <div>
      <label className="block text-[11px] font-bold text-carbon/75 tracking-tight">
        Identificador (ID)
        <input
          type="text"
          defaultValue={element.id}
          key={`id-input-${element.id}`}
          onBlur={e => handleRenameId(model, element.id, e.target.value, onUpdateModel, onSelectId)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleRenameId(model, element.id, e.currentTarget.value, onUpdateModel, onSelectId);
          }}
          className="mt-1 w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 font-mono text-xs font-bold text-carbon shadow-2xs transition-colors focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20"
        />
      </label>
    </div>

    <div>
      <label className="block text-[11px] font-bold text-carbon/75 tracking-tight">
        Etiqueta Visual (KaTeX)
        <input
          type="text"
          value={element.label || ''}
          onChange={e => onUpdateElement(element.id, { label: e.target.value })}
          placeholder="ej. $a$ o Segmento AB"
          className="mt-1 w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20 placeholder-carbon/30"
        />
      </label>
    </div>

    {element.refs && element.refs.length > 0 && (
      <div className="space-y-2 pt-2 border-t border-carbon/10">
        <label className="block text-[10px] font-bold text-salvia uppercase tracking-wider">
          Referencias del Elemento ({element.refs.length}):
        </label>
        <div className="space-y-2 rounded-lg border border-carbon/10 bg-lienzo/60 p-2.5 shadow-2xs">
          {element.refs.map((rId, idx) => {
            const candidates = elementReferenceCandidates(model, element.id, element.kind, idx);
            const options = candidates.some(c => c.id === rId)
              ? candidates
              : [{ id: rId, label: rId, type: '?' }, ...candidates];
            return (
              <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                <span className="font-mono font-bold text-salvia shrink-0 text-[11px]">Ref {idx + 1}:</span>
                <select
                  value={rId}
                  onChange={e => onUpdateElement(element.id, { refs: updateElementRef(element, idx, e.target.value) })}
                  className="flex-1 rounded-md border border-carbon/15 bg-lienzo px-2.5 py-1 text-xs font-mono font-bold text-carbon focus:border-salvia focus:outline-none"
                >
                  {options.map(cand => (
                    <option key={`${idx}-${cand.id}`} value={cand.id}>
                      {cand.label} ({cand.id}) - {cand.type}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>
    )}

    <TextContentHelp />
  </div>
);
