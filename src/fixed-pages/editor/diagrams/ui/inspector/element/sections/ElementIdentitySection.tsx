import React from 'react';
import { TextContentHelp } from '../../help';
import type { ElementPanelProps } from '../../types';
import { objectKind } from '@/diagrams';
import { elementReferenceCandidates, elementRefs, handleRenameId, updateElementRef } from '../../utils';
import { useI18n } from '@/i18n';
import { objectTypeLabel } from '@/fixed-pages/editor/diagrams/ui/diagramLabels';
import { Card, controlClassName } from '@/fixed-pages/editor/ui/primitives';

/** Propiedades: id, label, refs */
export const ElementIdentitySection: React.FC<ElementPanelProps> = ({
  model,
  element,
  onUpdateElement,
  onUpdateModel,
  onSelectId,
}) => {
  const { t } = useI18n();
  const refs = elementRefs(model, element);
  const kind = objectKind(element);
  return (
  <div className="space-y-3">
    <div>
      <label className="block text-[11px] font-bold text-carbon/75 tracking-tight">
        {t('editor.diagramInspector.identifierId')}
        <input
          type="text"
          defaultValue={element.id}
          key={`id-input-${element.id}`}
          onBlur={e => handleRenameId(model, element.id, e.target.value, onUpdateModel, onSelectId)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleRenameId(model, element.id, e.currentTarget.value, onUpdateModel, onSelectId);
          }}
          className={`${controlClassName} mt-1 font-mono`}
        />
      </label>
    </div>

    <div>
      <label className="block text-[11px] font-bold text-carbon/75 tracking-tight">
        {t('editor.diagramInspector.visualLabelKatex')}
        <input
          type="text"
          value={element.label || ''}
          onChange={e => onUpdateElement(element.id, { label: e.target.value })}
          placeholder={t('editor.diagramInspector.labelExample')}
          className={`${controlClassName} mt-1`}
        />
      </label>
    </div>

    {refs.length > 0 && (
      <div className="space-y-2 pt-2 border-t border-carbon/10">
        <label className="block text-[10px] font-bold text-canela uppercase tracking-wider">
          {t('editor.diagramInspector.elementReferencesCount', { count: refs.length })}
        </label>
        <Card className="space-y-2">
          {refs.map((rId, idx) => {
            const candidates = elementReferenceCandidates(model, element.id, kind, idx);
            const options = candidates.some(c => c.id === rId)
              ? candidates
              : [{ id: rId, label: rId, type: '?' }, ...candidates];
            return (
              <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                <span className="font-mono font-bold text-canela shrink-0 text-[11px]">{t('editor.diagramInspector.refN', { n: idx + 1 })}</span>
                <select
                  value={rId}
                  onChange={e => {
                    const refId = e.target.value;
                    onUpdateElement(element.id, current => updateElementRef(model, current, idx, refId));
                  }}
                  className={`${controlClassName} flex-1 font-mono`}
                >
                  {options.map(cand => (
                    <option key={`${idx}-${cand.id}`} value={cand.id}>
                      {cand.label} ({cand.id}) - {objectTypeLabel(t, cand.type)}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </Card>
      </div>
    )}

    <TextContentHelp />
  </div>
  );
};
