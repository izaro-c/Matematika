import React, { useRef, useState } from 'react';
import { useI18n } from '@/i18n';
import { useModalFocus } from '@/fixed-pages/editor/ui/page/useModalFocus';
import { Button } from '../primitives';
import type { BlockPreset } from './visualEditorPresets';

interface BlockCommandPaletteProps {
  open: boolean;
  presets: BlockPreset[];
  onClose: () => void;
  onInsert: (preset: BlockPreset) => void;
}

/** Paleta de bloques (Ctrl+/): busca un tipo de bloque y lo inserta junto a la selección. */
export const BlockCommandPalette: React.FC<BlockCommandPaletteProps> = ({ open, presets, onClose, onInsert }) => {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const dialogRef = useModalFocus<HTMLDivElement>(open, onClose, searchRef);

  if (!open) return null;

  const handleInsert = (preset: BlockPreset) => {
    onInsert(preset);
    setQuery('');
  };

  return (
    <div className="absolute inset-0 z-40 flex items-start justify-center bg-carbon/20 p-4 pt-[10vh]" role="presentation">
      <div ref={dialogRef} className="w-full max-w-lg rounded border border-carbon/20 bg-lienzo p-3 shadow-xl" role="dialog" aria-modal="true" aria-label={t('editor.visual.insertBlock')}>
        <div className="flex items-center gap-2">
          <input ref={searchRef} value={query} onChange={event => setQuery(event.target.value)} placeholder={t('editor.visual.searchBlock')} aria-label={t('editor.visual.searchBlockType')} className="min-w-0 flex-1 rounded border border-carbon/15 bg-carbon/5 px-3 py-2 text-sm text-carbon outline-none focus:border-canela" />
          <Button variant="quiet" size="sm" onClick={onClose}>{t('editor.visual.escape')}</Button>
        </div>
        <div className="mt-3 grid max-h-80 gap-2 overflow-y-auto sm:grid-cols-2">
          {presets
            .filter(preset => `${preset.label} ${preset.type}`.toLowerCase().includes(query.toLowerCase()))
            .map(preset => <button key={`${preset.label}-${preset.type}`} type="button" onClick={() => handleInsert(preset)} className="rounded border border-carbon/10 bg-carbon/5 p-3 text-left hover:border-canela/30 hover:bg-canela/5">
              <span className="block font-serif text-xs font-bold text-carbon">{preset.label}</span><span className="mt-1 block text-[9px] text-carbon/45">{preset.type}</span>
            </button>)}
        </div>
      </div>
    </div>
  );
};
