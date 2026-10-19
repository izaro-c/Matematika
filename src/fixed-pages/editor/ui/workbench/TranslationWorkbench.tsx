import React, { useMemo } from 'react';
import { useI18n } from '@/i18n';
import type { Block, BlockType } from '@/fixed-pages/editor/session/parser';
import { alignTranslationBlocks, type TranslationRowStatus } from '@/fixed-pages/editor/session/translationAlignment';
import { useDocumentVersionBlocks } from '@/fixed-pages/editor/session/useDocumentVersionBlocks';
import { renderFormattedText } from '../panels/InlineContentPreview';

/** Bloques de prosa que se traducen como texto; el resto se edita en la vista visual. */
const TEXT_BLOCK_TYPES: ReadonlySet<BlockType> = new Set(['paragraph', 'heading', 'list', 'note', 'citation']);

const STATUS_STYLE: Partial<Record<TranslationRowStatus, string>> = {
  untranslated: 'border-ocre/40 bg-ocre/10 text-ocre',
  missing: 'border-granada/35 bg-granada/10 text-granada',
  extra: 'border-pavo/35 bg-pavo/10 text-pavo',
};

const STATUS_KEY = {
  untranslated: 'editor.translation.statusUntranslated',
  missing: 'editor.translation.statusMissing',
  extra: 'editor.translation.statusExtra',
} as const;

interface TranslationWorkbenchProps {
  /** Bloques de la versión abierta (la traducción). */
  blocks: Block[];
  currentLang: string;
  originLang: string | null;
  originPath: string | null;
  /** Idiomas con versión que pueden hacer de original. */
  originOptions: string[];
  onOriginChange: (lang: string) => void;
  canEdit: boolean;
  updateBlock: (id: string, content: string, metadata?: Record<string, unknown>) => void;
  onEditVisually: (blockId: string) => void;
}

function BlockReading({ block }: { block: Block }) {
  const { t } = useI18n();
  if (TEXT_BLOCK_TYPES.has(block.type)) {
    const heading = block.type === 'heading';
    return (
      <div className={`whitespace-pre-wrap font-serif ${heading ? 'text-base font-bold' : 'text-sm leading-relaxed'} text-carbon/85`}>
        {renderFormattedText(block.content, block.id, undefined, t)}
      </div>
    );
  }
  return <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[11px] leading-snug text-carbon/65">{block.content}</pre>;
}

/**
 * Vista de traducción: el original a la izquierda (solo lectura) y la versión abierta a
 * la derecha, alineados por bloque. Avisa de los bloques sin traducir o que faltan.
 */
export const TranslationWorkbench: React.FC<TranslationWorkbenchProps> = ({
  blocks,
  currentLang,
  originLang,
  originPath,
  originOptions,
  onOriginChange,
  canEdit,
  updateBlock,
  onEditVisually,
}) => {
  const { t } = useI18n();
  const origin = useDocumentVersionBlocks(originPath);
  const alignment = useMemo(
    () => (origin.status === 'ready' ? alignTranslationBlocks(origin.blocks, blocks) : null),
    [blocks, origin],
  );

  if (!originLang || !originPath) {
    return <p className="p-6 font-serif text-sm italic text-carbon/60">{t('editor.translation.noOrigin')}</p>;
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-lienzo">
      <div className="grid shrink-0 grid-cols-2 gap-4 border-b border-carbon/15 px-4 py-2 font-serif text-xs text-carbon/70">
        <label className="flex items-center gap-2">
          <span className="font-bold">{t('editor.translation.original', { lang: originLang.toUpperCase() })}</span>
          {originOptions.length > 1 && (
            <select
              value={originLang}
              onChange={event => onOriginChange(event.target.value)}
              aria-label={t('editor.translation.originLanguage')}
              className="rounded border border-carbon/20 bg-lienzo px-1 py-0.5 text-[11px] uppercase"
            >
              {originOptions.map(lang => <option key={lang} value={lang}>{lang.toUpperCase()}</option>)}
            </select>
          )}
        </label>
        <span className="font-bold">{t('editor.translation.target', { lang: currentLang.toUpperCase() })}</span>
      </div>

      {alignment && (
        <div role="status" className={`shrink-0 border-b px-4 py-1.5 font-serif text-xs ${
          alignment.untranslated || alignment.missing ? 'border-ocre/30 bg-ocre/10 text-carbon/80' : 'border-musgo/25 bg-musgo/10 text-musgo'
        }`}>
          {alignment.untranslated === 0 && alignment.missing === 0
            ? t('editor.translation.allTranslated')
            : [
                alignment.untranslated === 1 ? t('editor.translation.untranslatedOne')
                  : alignment.untranslated > 1 ? t('editor.translation.untranslatedOther', { count: alignment.untranslated }) : null,
                alignment.missing === 1 ? t('editor.translation.missingOne')
                  : alignment.missing > 1 ? t('editor.translation.missingOther', { count: alignment.missing }) : null,
              ].filter(Boolean).join(' · ')}
          {!canEdit && <span className="ml-2 italic text-carbon/60">{t('editor.translation.readOnlyDocument')}</span>}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {origin.status === 'loading' && <p aria-busy="true" className="font-serif text-sm italic text-carbon/60">{t('editor.translation.loading')}</p>}
        {origin.status === 'error' && <p role="alert" className="font-serif text-sm text-granada">{t('editor.translation.loadError')}</p>}
        {alignment && (
          <ol className="space-y-2">
            {alignment.rows.map(row => {
              const target = row.target;
              const statusStyle = STATUS_STYLE[row.status];
              const editable = Boolean(canEdit && target && target.metadata?.editable && TEXT_BLOCK_TYPES.has(target.type));
              return (
                <li
                  key={row.key}
                  data-translation-status={row.status}
                  className={`grid grid-cols-2 gap-4 rounded border p-2 ${row.status === 'untranslated' ? 'border-ocre/35' : row.status === 'missing' ? 'border-granada/30' : 'border-carbon/10'}`}
                >
                  <div className="min-w-0 border-r border-carbon/10 pr-4">
                    {row.source ? <BlockReading block={row.source} /> : null}
                  </div>
                  <div className="min-w-0 space-y-1">
                    {statusStyle && STATUS_KEY[row.status as keyof typeof STATUS_KEY] && (
                      <span className={`inline-flex rounded border px-1.5 py-0.5 font-serif text-[10px] font-bold ${statusStyle}`}>
                        {t(STATUS_KEY[row.status as keyof typeof STATUS_KEY])}
                      </span>
                    )}
                    {target && editable ? (
                      <textarea
                        key={`${target.id}:${target.content}`}
                        defaultValue={target.content}
                        aria-label={t('editor.translation.blockText')}
                        rows={Math.max(2, target.content.split('\n').length + Math.floor(target.content.length / 80))}
                        onBlur={event => {
                          if (event.target.value !== target.content) updateBlock(target.id, event.target.value, target.metadata);
                        }}
                        className={`w-full resize-y rounded border border-carbon/15 bg-lienzo px-2 py-1 font-serif leading-relaxed text-carbon focus:border-canela focus:outline-none ${target.type === 'heading' ? 'text-base font-bold' : 'text-sm'}`}
                      />
                    ) : target ? (
                      <>
                        <BlockReading block={target} />
                        <button
                          type="button"
                          onClick={() => onEditVisually(target.id)}
                          title={t('editor.translation.readOnlyBlock')}
                          className="font-serif text-[11px] text-canela underline-offset-2 hover:underline"
                        >
                          {t('editor.translation.editVisually')}
                        </button>
                      </>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
};
