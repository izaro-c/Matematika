import React, { useId, useMemo, useRef, useState } from 'react';
import { useI18n } from '@/i18n';
import { Modal } from '../primitives';
import { BLOCK_CATALOG_GROUPS, filterBlockCatalog, type BlockCatalogEntry } from './blockCatalog';

interface BlockCommandPaletteProps {
  open: boolean;
  entries: BlockCatalogEntry[];
  onClose: () => void;
  onInsert: (entry: BlockCatalogEntry) => void;
}

/** Paleta de bloques («/», Ctrl+/ o ＋ entre bloques): busca un tipo y lo inserta en el hueco elegido. */
export const BlockCommandPalette: React.FC<BlockCommandPaletteProps> = ({ open, entries, onClose, onInsert }) => {
  const { t } = useI18n();
  const listId = useId();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(() => filterBlockCatalog(entries, query, entry => t(`editor.${entry.label}`)), [entries, query, t]);
  const active = matches[Math.min(activeIndex, matches.length - 1)];
  const optionId = (entry: BlockCatalogEntry) => `${listId}-${entry.id}`;

  const close = () => {
    setQuery('');
    setActiveIndex(0);
    onClose();
  };
  const insert = (entry: BlockCatalogEntry) => {
    setQuery('');
    setActiveIndex(0);
    onInsert(entry);
  };

  const moveActive = (delta: number) => {
    if (matches.length === 0) return;
    const current = Math.min(activeIndex, matches.length - 1);
    const next = (current + delta + matches.length) % matches.length;
    setActiveIndex(next);
    document.getElementById(optionId(matches[next]))?.scrollIntoView?.({ block: 'nearest' });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); moveActive(1); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); moveActive(-1); }
    else if (event.key === 'Enter' && active) { event.preventDefault(); insert(active); }
  };

  // Una rúbrica antes de la primera opción de cada grupo; la búsqueda con resultados mezclados conserva el orden.
  const rows: React.ReactNode[] = [];
  matches.forEach((entry, index) => {
    if (!query.trim() && (index === 0 || matches[index - 1].group !== entry.group)) {
      rows.push(<li key={`group-${entry.group}`} role="presentation" className="ed-palette__group">{t(`editor.${BLOCK_CATALOG_GROUPS[entry.group]}`)}</li>);
    }
    rows.push(
      <li
        key={entry.id}
        id={optionId(entry)}
        role="option"
        aria-selected={entry === active}
        className="ed-row ed-palette__option"
        onMouseDown={event => event.preventDefault()}
        onMouseMove={() => setActiveIndex(index)}
        onClick={() => insert(entry)}
      >
        <span className="ed-palette__label">{t(`editor.${entry.label}`)}</span>
        <span className="ed-palette__syntax" aria-hidden="true">{entry.syntax}</span>
      </li>,
    );
  });

  return (
    <Modal open={open} onClose={close} title={t('editor.palette.title')} size="md" initialFocusRef={searchRef}>
      <input
        ref={searchRef}
        type="search"
        role="combobox"
        aria-expanded="true"
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active ? optionId(active) : undefined}
        aria-label={t('editor.palette.searchLabel')}
        placeholder={t('editor.palette.search')}
        value={query}
        onChange={event => { setQuery(event.target.value); setActiveIndex(0); }}
        onKeyDown={handleKeyDown}
        className="ed-control"
      />
      {matches.length > 0
        ? <ul id={listId} role="listbox" aria-label={t('editor.palette.title')} className="ed-palette__list">{rows}</ul>
        : <p id={listId} className="ed-palette__empty" role="status">{t('editor.palette.empty')}</p>}
    </Modal>
  );
};
