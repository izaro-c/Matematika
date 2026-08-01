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
  <div className="p-2.5 space-y-2 bg-carbon/5 rounded-xl border border-carbon/10 shadow-2xs">
    <div>
      <label className="block text-[11px] font-bold text-carbon/70 mb-0.5">
        Identificador (ID)
        <input
          type="text"
          defaultValue={element.id}
          key={`id-input-${element.id}`}
          onBlur={e => handleRenameId(model, element.id, e.target.value, onUpdateModel, onSelectId)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleRenameId(model, element.id, e.currentTarget.value, onUpdateModel, onSelectId);
          }}
          className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs font-mono font-bold text-carbon"
        />
      </label>
    </div>

    <div>
      <label className="block text-[11px] font-bold text-carbon/70 mb-0.5">
        Etiqueta Visual (KaTeX)
        <input
          type="text"
          value={element.label || ''}
          onChange={e => onUpdateElement(element.id, { label: e.target.value })}
          placeholder="ej. $a$ o Segmento AB"
          className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon"
        />
      </label>
    </div>

    {element.refs && element.refs.length > 0 && (
      <div className="space-y-1.5 pt-1">
        <label className="block text-[11px] font-bold text-salvia uppercase tracking-wider">
          Referencias del Elemento ({element.refs.length}):
        </label>
        <div className="space-y-1 bg-lienzo p-2 rounded-lg border border-carbon/10">
          {element.refs.map((rId, idx) => {
            const candidates = elementReferenceCandidates(model, element.id, element.kind, idx);
            const options = candidates.some(c => c.id === rId)
              ? candidates
              : [{ id: rId, label: rId, type: '?' }, ...candidates];
            return (
              <div key={idx} className="flex items-center justify-between gap-1 text-[10px]">
                <span className="font-mono font-bold text-salvia shrink-0">Ref {idx + 1}:</span>
                <select
                  value={rId}
                  onChange={e => onUpdateElement(element.id, { refs: updateElementRef(element, idx, e.target.value) })}
                  className="flex-1 bg-carbon/5 border border-carbon/20 rounded px-1.5 py-0.5 text-xs text-carbon font-mono font-bold"
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
