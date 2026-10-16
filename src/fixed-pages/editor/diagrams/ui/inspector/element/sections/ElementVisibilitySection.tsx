import React from 'react';
import type { DiagramObject } from '@/diagrams';
import { useI18n } from '@/i18n';
import { renderRichText } from '@/fixed-pages/editor/diagrams/ui/primitives/richText';

interface ElementVisibilitySectionProps {
  object: DiagramObject;
  onUpdate: (update: { visibleWhen?: string; selection?: DiagramObject['selection'] }) => void;
}

/** Propiedades: visibleWhen, selection.selectable */
export const ElementVisibilitySection: React.FC<ElementVisibilitySectionProps> = ({
  object,
  onUpdate,
}) => {
  const { t } = useI18n();
  return (
  <div className="space-y-3">
    <div>
      <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
        {renderRichText(t('editor.diagramInspector.conditionalVisibility'), { code: c => <code className="font-mono text-[10px] text-canela">{c}</code> })}
      </label>
      <input
        type="text"
        value={object.visibleWhen || ''}
        onChange={e => onUpdate({ visibleWhen: e.target.value || undefined })}
        placeholder={t('editor.diagramInspector.visibleWhenExample')}
        className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 font-mono text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20 placeholder-carbon/30"
      />
    </div>

    <div className="flex items-center space-x-2 pt-1 border-t border-carbon/10">
      <input
        type="checkbox"
        id={`selectable-elem-${object.id}`}
        checked={object.selection?.selectable !== false}
        onChange={e => onUpdate({ selection: { ...(object.selection || { selectable: true }), selectable: e.target.checked } })}
        className="rounded border-carbon/30 text-canela focus:ring-canela cursor-pointer"
      />
      <label htmlFor={`selectable-elem-${object.id}`} className="text-xs font-bold text-carbon/80 cursor-pointer select-none">
        {t('editor.diagramInspector.selectableOnTheCanvas')}
      </label>
    </div>
  </div>
);
};
