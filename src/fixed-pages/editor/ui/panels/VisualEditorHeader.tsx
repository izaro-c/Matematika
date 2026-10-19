import React from 'react';
import { useI18n } from '@/i18n';
import { resolvePublicOrExternalAsset } from '@/lib/routes';
import { LATEX_SYMBOLS } from './visualEditorPresets';
import { Button, controlClassName, inlineFieldClassName } from '@/fixed-pages/editor/ui/primitives';

function insertSymbol(textareaId: string, code: string) {
  const el = document.getElementById(textareaId) as HTMLTextAreaElement | null;
  if (!el) return;
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? start;
  el.setRangeText(code, start, end, 'end');
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.focus();
}

interface VisualEditorHeaderProps {
  metadata: Record<string, unknown>;
  isReadOnly: boolean;
  canEditVisualMetadata: boolean;
  handleMetadataChange: (key: string, value: unknown) => void;
}

/** Cabecera de la página en la vista visual: título, descripción, ficha de matemático y enunciado formal. */
export const VisualEditorHeader: React.FC<VisualEditorHeaderProps> = ({
  metadata,
  isReadOnly,
  canEditVisualMetadata,
  handleMetadataChange,
}) => {
  const { t } = useI18n();
  const showStatement = ['teorema', 'lema', 'corolario', 'definicion', 'axioma'].includes(String(metadata.type));
  const isMathematician = metadata.type === 'matematico';
  return (
    <div className="mb-8 pb-6 border-b border-carbon/15 space-y-4">
      <div>
        <span className="ac-label ac-label--sm ac-label--canela select-none">
          {String(metadata.type || t('editor.metadata.defaultType'))}
        </span>
        <textarea
          value={String(metadata.title || '')}
          disabled={isReadOnly || !canEditVisualMetadata}
          onChange={(e) => handleMetadataChange('title', e.target.value)}
          className={`${inlineFieldClassName} font-serif font-bold text-3xl text-carbon mt-1 resize-none placeholder-carbon/20`}
          placeholder={t('editor.visual.conceptTitlePlaceholder')}
          rows={1}
          style={{ height: 'auto' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
        />
        <textarea
          value={String(metadata.description || '')}
          disabled={isReadOnly || !canEditVisualMetadata}
          onChange={(e) => handleMetadataChange('description', e.target.value)}
          className={`${inlineFieldClassName} font-serif italic text-base text-carbon/70 mt-2 resize-none placeholder-carbon/30`}
          placeholder={t('editor.visual.conceptDescriptionPlaceholder')}
          rows={2}
          style={{ height: 'auto' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
        />
      </div>

      {isMathematician && <section className="grid gap-4 rounded border border-canela/20 bg-canela/5 p-4 sm:grid-cols-[7rem_1fr]" aria-label={t('editor.visual.mathematicianCard')}>
        <div className="overflow-hidden rounded border border-carbon/10 bg-lienzo">
          {metadata.image ? <img src={resolvePublicOrExternalAsset(String(metadata.image))} alt="" className="aspect-[4/5] h-full w-full object-cover" /> : <div className="flex aspect-[4/5] items-center justify-center font-serif text-3xl text-carbon/25">∑</div>}
        </div>
        <div className="grid content-start gap-3 sm:grid-cols-2">
          <label className="text-[10px] font-bold text-carbon/55 sm:col-span-2">{t('editor.visual.fullName')}<input value={String(metadata.name || metadata.title || '')} onChange={event => handleMetadataChange('name', event.target.value)} className={`${controlClassName} mt-1`} /></label>
          <label className="text-[10px] font-bold text-carbon/55">{t('editor.visual.birth')}<input type="number" value={Number(metadata.birthYear || 0)} onChange={event => handleMetadataChange('birthYear', Number(event.target.value))} className={`${controlClassName} mt-1`} /></label>
          <label className="text-[10px] font-bold text-carbon/55">{t('editor.visual.death')}<input type="number" value={Number(metadata.deathYear || 0)} onChange={event => handleMetadataChange('deathYear', Number(event.target.value))} className={`${controlClassName} mt-1`} /></label>
          <label className="text-[10px] font-bold text-carbon/55 sm:col-span-2">{t('editor.visual.placeOrTradition')}<input value={String(metadata.country || '')} onChange={event => handleMetadataChange('country', event.target.value)} className={`${controlClassName} mt-1`} /></label>
          <label className="text-[10px] font-bold text-carbon/55 sm:col-span-2">{t('editor.visual.imagePath')}<input value={String(metadata.image || '')} onChange={event => handleMetadataChange('image', event.target.value)} className={`${controlClassName} mt-1 font-mono`} /></label>
        </div>
      </section>}

      {showStatement && (
        <div className="p-4 border-l-4 border-ocre/50 bg-ocre/5 rounded-r space-y-2">
          <div className="flex justify-between items-center select-none">
            <div className="ac-label ac-label--xs ac-label--ocre-soft">{t('editor.visual.formalStatement')}</div>
            <div className="flex gap-1 items-center">
              <span className="ac-label ac-label--2xs ac-label--faint mr-1">{t('editor.visual.insert')}</span>
              {LATEX_SYMBOLS.map(sym => (
                <Button size="sm" className="font-mono" key={sym.label} onClick={() => insertSymbol('statement-editor', sym.code)}>
                  {sym.label}
                </Button>
              ))}
            </div>
          </div>
          <textarea
            id="statement-editor"
            disabled={!canEditVisualMetadata}
            value={String(metadata.statement || '')}
            onChange={(e) => handleMetadataChange('statement', e.target.value)}
            className={`${inlineFieldClassName} font-serif text-sm text-carbon leading-relaxed resize-none placeholder-carbon/30`}
            placeholder={t('editor.visual.statementPlaceholder')}
            rows={2}
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
        </div>
      )}
    </div>
  );
};
