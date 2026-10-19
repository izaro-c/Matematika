import React, { useState } from 'react';
import { useI18n } from '@/i18n';
import { KatexText } from '@/components/ui/KatexText';
import { Callout, Card, controlClassName } from '@/fixed-pages/editor/ui/primitives';

interface FormulaBlockProps {
  id?: string;
  content: string;
  onChange: (newContent: string) => void;
}

export const FormulaBlock: React.FC<FormulaBlockProps> = ({ id, content, onChange }) => {
  const { t } = useI18n();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-1">
      <label className="block ac-label ac-label--xs ac-label--faint">{t('editor.blocks.formulaTitle')}</label>
      
      {isEditing ? (
        <Card className="flex flex-col gap-1.5">
          <input
            id={id}
            type="text"
            className={`${controlClassName} font-mono`}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsEditing(false);
              }
            }}
            placeholder={t('editor.blocks.formulaPlaceholder')}
            autoFocus
          />
          <span className="text-[10px] text-carbon/40 italic">{t('editor.blocks.formulaHint')}</span>
        </Card>
      ) : (
        <Callout tone="warning" className="flex justify-center items-center" onClick={() => setIsEditing(true)} title={t('editor.blocks.formulaEditTitle')}>
          {content.trim() ? (
            <KatexText text={content} className="text-sm text-carbon" />
          ) : (
            <span className="text-xs italic text-ocre/50">{t('editor.blocks.formulaEmpty')}</span>
          )}
        </Callout>
      )}
    </div>
  );
};
