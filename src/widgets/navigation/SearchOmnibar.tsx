import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Fuse, { type FuseResult, type FuseResultMatch } from 'fuse.js';
import { useLocation } from 'wouter';
import {
  ALL_TYPES,
  SEARCH_FUSE_OPTIONS,
  SEARCH_INDEX,
  TYPE_COLORS,
  TYPE_ICONS,
  TYPE_LABELS,
  TYPE_RESULT_LABELS,
  useNavigationStore,
  type SearchResult,
  type SearchResultType,
} from '@/features/search/lib/searchApi';
import { useGlossaryStore } from '@/features/glossary/GlossaryStore';

type TypeFilter = SearchResultType | 'all';

const QUICK_FILTERS: SearchResultType[] = [
  'teorema',
  'definición',
  'lección',
  'matemático',
];

function highlightText(text: string, matches: readonly FuseResultMatch[]): React.ReactNode {
  const allIndices = matches.flatMap(match => match.indices).sort((a, b) => a[0] - b[0]);
  if (allIndices.length === 0) return text;

  const parts: React.ReactNode[] = [];
  let lastEnd = 0;
  for (const [start, end] of allIndices) {
    if (start > lastEnd) {
      parts.push(<span key={`t-${lastEnd}`}>{text.slice(lastEnd, start)}</span>);
    }
    parts.push(
      <mark key={`h-${start}`} className="bg-terracota/25 text-carbon font-bold">
        {text.slice(start, end + 1)}
      </mark>,
    );
    lastEnd = end + 1;
  }
  if (lastEnd < text.length) {
    parts.push(<span key={`t-${lastEnd}`}>{text.slice(lastEnd)}</span>);
  }
  return <>{parts}</>;
}

export const SearchOmnibar = () => {
  const { isSearchOpen, closeSearch } = useNavigationStore();
  const { openTerm } = useGlossaryStore();
  const [location, setLocation] = useLocation();
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<TypeFilter>('all');
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const typeMenuRef = useRef<HTMLDivElement>(null);
  const typeTriggerRef = useRef<HTMLButtonElement>(null);
  const isEditor = location === '/editor';

  const availableTypes = useMemo(
    () => ALL_TYPES.filter(type => !isEditor || (type !== 'glosario' && type !== 'msc2020')),
    [isEditor],
  );

  const availableIndex = useMemo(
    () => isEditor
      ? SEARCH_INDEX.filter(item => item.type !== 'glosario' && item.type !== 'msc2020')
      : SEARCH_INDEX,
    [isEditor],
  );

  const filteredIndex = useMemo(
    () => selectedType === 'all'
      ? availableIndex
      : availableIndex.filter(item => item.type === selectedType),
    [availableIndex, selectedType],
  );

  const fuse = useMemo(
    () => new Fuse(filteredIndex, SEARCH_FUSE_OPTIONS),
    [filteredIndex],
  );

  const allResults = useMemo<FuseResult<SearchResult>[]>(() => {
    if (query.trim()) return fuse.search(query.trim());
    if (selectedType === 'all') return [];
    return filteredIndex.map((item, refIndex) => ({ item, refIndex }));
  }, [filteredIndex, fuse, query, selectedType]);
  const results = allResults.slice(0, 12);

  const resetAndClose = useCallback(() => {
    setQuery('');
    setSelectedType('all');
    setIsTypeMenuOpen(false);
    setSelectedIndex(0);
    closeSearch();
  }, [closeSearch]);

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (useNavigationStore.getState().isSearchOpen) resetAndClose();
        else useNavigationStore.getState().openSearch();
      }
      if (event.key === 'Escape') {
        if (isTypeMenuOpen) {
          event.preventDefault();
          setIsTypeMenuOpen(false);
          typeTriggerRef.current?.focus();
        } else {
          resetAndClose();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isTypeMenuOpen, resetAndClose]);

  useEffect(() => {
    if (!isTypeMenuOpen) return undefined;

    const closeTypeMenu = (event: PointerEvent) => {
      if (!typeMenuRef.current?.contains(event.target as Node)) {
        setIsTypeMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', closeTypeMenu);
    return () => document.removeEventListener('pointerdown', closeTypeMenu);
  }, [isTypeMenuOpen]);

  useEffect(() => {
    if (!isSearchOpen) return undefined;

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(focusTimer);
  }, [isSearchOpen]);

  useEffect(() => {
    const selectedOption = listRef.current?.querySelector<HTMLElement>(
      `[data-result-index="${selectedIndex}"]`,
    );
    selectedOption?.scrollIntoView?.({ block: 'nearest' });
  }, [selectedIndex]);

  const handleSelect = (item: SearchResult) => {
    if (!item.href) return;

    resetAndClose();
    if (item.type === 'glosario') {
      openTerm(item.href);
    } else if (isEditor) {
      window.dispatchEvent(new CustomEvent('editor-open-concept', { detail: { href: item.href } }));
    } else {
      setLocation(item.href);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown' && results.length > 0) {
      event.preventDefault();
      setSelectedIndex(index => Math.min(index + 1, results.length - 1));
    } else if (event.key === 'ArrowUp' && results.length > 0) {
      event.preventDefault();
      setSelectedIndex(index => Math.max(index - 1, 0));
    } else if (event.key === 'Enter' && results[selectedIndex]) {
      event.preventDefault();
      handleSelect(results[selectedIndex].item);
    }
  };

  const changeType = (type: TypeFilter) => {
    setSelectedType(type);
    setIsTypeMenuOpen(false);
    setSelectedIndex(0);
    inputRef.current?.focus();
  };

  const focusTypeOption = (index: number) => {
    const options = typeMenuRef.current?.querySelectorAll<HTMLElement>('[role="option"]');
    options?.[index]?.focus();
  };

  const handleTypeOptionKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusTypeOption(Math.min(index + 1, availableTypes.length));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusTypeOption(Math.max(index - 1, 0));
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusTypeOption(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusTypeOption(availableTypes.length);
    }
  };

  if (!isSearchOpen) return null;

  const hasSearch = query.trim().length > 0;
  const hasResults = results.length > 0;
  const showIntroduction = !hasSearch && selectedType === 'all';
  const resultNoun = allResults.length === 1 ? 'resultado' : 'resultados';
  const resultSummary = allResults.length > results.length
    ? `${results.length} de ${allResults.length} resultados`
    : `${allResults.length} ${resultNoun}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center sm:px-4 sm:pt-[8vh]"
      onKeyDown={handleKeyDown}
    >
      <div className="absolute inset-0 bg-carbon/45 backdrop-blur-sm" onClick={resetAndClose} aria-hidden="true" />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-title"
        className="relative flex h-[100dvh] w-full flex-col overflow-hidden border-carbon/30 bg-lienzo font-sans shadow-parchment outline-carbon/15 sm:h-auto sm:max-h-[84vh] sm:max-w-2xl sm:overflow-visible sm:rounded-[2px] sm:border sm:outline sm:outline-1 sm:outline-offset-[-5px]"
      >
        <h2 id="search-title" className="sr-only">Buscar en Matematika</h2>
        <div className="flex min-h-16 items-center border-b border-carbon/15 px-4 sm:px-5">
          <svg className="mr-3 h-5 w-5 shrink-0 text-terracota/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            role="searchbox"
            aria-label="Buscar contenido matemático"
            aria-controls="search-results"
            aria-activedescendant={hasResults ? `search-result-${selectedIndex}` : undefined}
            className="min-w-0 flex-1 bg-transparent font-serif text-xl text-carbon outline-none placeholder:text-carbon/35"
            placeholder={isEditor ? 'Buscar una página para editar…' : 'Buscar en Matematika…'}
            value={query}
            onChange={event => {
              setQuery(event.target.value);
              setSelectedIndex(0);
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
              }}
              className="ml-2 min-h-11 px-2 text-sm text-carbon/50 transition-colors hover:text-carbon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota"
              aria-label="Borrar búsqueda"
            >
              Borrar
            </button>
          )}
          <button
            type="button"
            onClick={resetAndClose}
            className="ml-2 flex min-h-11 min-w-11 items-center justify-center rounded-[2px] border border-carbon/20 font-serif text-xs font-bold tracking-wider text-carbon/55 outline outline-1 outline-offset-[-4px] outline-carbon/10 transition-colors hover:border-terracota/60 hover:text-terracota focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota"
            aria-label="Cerrar buscador"
          >
            ESC
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-carbon/15 bg-carbon/[0.025] px-4 py-3 sm:px-5">
          <label htmlFor="search-type" className="text-[10px] font-bold uppercase tracking-[0.18em] text-carbon/50">
            Catálogo
          </label>
          <div ref={typeMenuRef} className="relative">
            <button
              ref={typeTriggerRef}
              id="search-type"
              type="button"
              aria-label="Tipo de contenido"
              aria-haspopup="listbox"
              aria-expanded={isTypeMenuOpen}
              onClick={() => setIsTypeMenuOpen(open => !open)}
              onKeyDown={event => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  setIsTypeMenuOpen(true);
                  window.requestAnimationFrame(() => focusTypeOption(
                    selectedType === 'all' ? 0 : availableTypes.indexOf(selectedType) + 1,
                  ));
                }
              }}
              className="flex min-h-11 min-w-52 items-center gap-2 rounded-[2px] border border-carbon/25 bg-lienzo py-2 pl-3 pr-3 font-serif text-base font-semibold text-carbon outline outline-1 outline-offset-[-4px] outline-carbon/10 transition-colors hover:border-terracota/50 focus-visible:border-terracota focus-visible:ring-2 focus-visible:ring-terracota/20"
            >
              <span
                className="w-5 text-center"
                style={{ color: selectedType === 'all' ? 'var(--theme-terracota)' : TYPE_COLORS[selectedType] }}
                aria-hidden="true"
              >
                {selectedType === 'all' ? '✦' : TYPE_ICONS[selectedType]}
              </span>
              <span className="flex-1 text-left">
                {selectedType === 'all' ? 'Todo el contenido' : TYPE_LABELS[selectedType]}
              </span>
              <span className={`text-xs text-carbon/45 transition-transform ${isTypeMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true">
                ▾
              </span>
            </button>

            {isTypeMenuOpen && (
              <div
                role="listbox"
                aria-label="Tipos de contenido"
                className="fixed left-4 right-4 top-[8rem] z-30 max-h-[calc(100dvh-9rem)] overflow-y-auto overscroll-contain rounded-[2px] border border-carbon/30 bg-lienzo p-2 shadow-parchment outline outline-1 outline-offset-[-5px] outline-carbon/15 [scrollbar-gutter:stable] sm:absolute sm:left-0 sm:right-auto sm:top-[calc(100%+0.5rem)] sm:grid sm:w-[24rem] sm:grid-cols-2 sm:gap-1"
              >
                <button
                  type="button"
                  role="option"
                  aria-selected={selectedType === 'all'}
                  onClick={() => changeType('all')}
                  onKeyDown={event => handleTypeOptionKeyDown(event, 0)}
                  className={`flex min-h-11 w-full items-center gap-3 border-l-2 px-3 py-2 text-left font-serif text-sm transition-colors sm:col-span-2 ${
                    selectedType === 'all'
                      ? 'border-l-terracota bg-terracota/[0.07] text-carbon'
                      : 'border-l-transparent text-carbon/70 hover:bg-carbon/[0.04] hover:text-carbon'
                  }`}
                >
                  <span className="w-5 text-center text-terracota" aria-hidden="true">✦</span>
                  <span className="flex-1 font-semibold">Todo el contenido</span>
                  {selectedType === 'all' && <span className="text-terracota" aria-hidden="true">✓</span>}
                </button>

                {availableTypes.map((type, index) => (
                  <button
                    key={type}
                    type="button"
                    role="option"
                    aria-selected={selectedType === type}
                    onClick={() => changeType(type)}
                    onKeyDown={event => handleTypeOptionKeyDown(event, index + 1)}
                    style={{ borderLeftColor: selectedType === type ? TYPE_COLORS[type] : undefined }}
                    className={`flex min-h-11 w-full items-center gap-3 border-l-2 px-3 py-2 text-left font-serif text-sm transition-colors ${
                      selectedType === type
                        ? 'bg-carbon/[0.055] text-carbon'
                        : 'border-l-transparent text-carbon/70 hover:bg-carbon/[0.04] hover:text-carbon'
                    }`}
                  >
                    <span className="w-5 text-center" style={{ color: TYPE_COLORS[type] }} aria-hidden="true">
                      {TYPE_ICONS[type]}
                    </span>
                    <span className="flex-1 font-semibold">{TYPE_LABELS[type]}</span>
                    {selectedType === type && <span style={{ color: TYPE_COLORS[type] }} aria-hidden="true">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          {(hasSearch || selectedType !== 'all') && (
            <span className="ml-auto text-xs tabular-nums text-carbon/45" role="status" aria-live="polite">
              {resultSummary}
            </span>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto sm:min-h-60">
          {hasResults && (
            <div id="search-results" ref={listRef} role="listbox" aria-label="Resultados de búsqueda">
              {results.map(({ item, matches }, index) => {
                const isSelected = index === selectedIndex;
                const isNavigable = Boolean(item.href);
                const titleMatches = matches?.filter(match => match.key === 'title') ?? [];
                const subtitleMatches = matches?.filter(match => match.key === 'subtitle') ?? [];

                return (
                  <button
                    id={`search-result-${index}`}
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={!isNavigable}
                    data-result-index={index}
                    data-result-type={item.type}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => handleSelect(item)}
                    style={isSelected ? { borderLeftColor: TYPE_COLORS[item.type] } : undefined}
                    className={`flex min-h-16 w-full items-start gap-3 border-b border-l-[3px] border-b-carbon/10 px-4 py-3 text-left transition-colors last:border-b-0 sm:gap-4 sm:px-5 ${
                      isSelected ? 'bg-carbon/[0.055]' : 'border-l-transparent hover:bg-carbon/[0.035]'
                    } ${isNavigable ? 'text-carbon' : 'cursor-default text-carbon/55'}`}
                  >
                    <span
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] border font-serif text-sm font-bold outline outline-1 outline-offset-[-4px] outline-carbon/10"
                      style={{
                        borderColor: `color-mix(in srgb, ${TYPE_COLORS[item.type]} 35%, transparent)`,
                        color: TYPE_COLORS[item.type],
                        backgroundColor: `color-mix(in srgb, ${TYPE_COLORS[item.type]} 7%, transparent)`,
                      }}
                      aria-hidden="true"
                    >
                      {TYPE_ICONS[item.type]}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 font-serif text-base font-bold leading-snug">
                        {titleMatches.length > 0 ? highlightText(item.title, titleMatches) : item.title}
                      </span>
                      {item.subtitle && (
                        <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-carbon/55">
                          {subtitleMatches.length > 0 ? highlightText(item.subtitle, subtitleMatches) : item.subtitle}
                        </span>
                      )}
                    </span>

                    <span className="mt-1 hidden shrink-0 text-[10px] font-bold uppercase tracking-[0.16em] text-carbon/40 sm:block">
                      {isNavigable ? TYPE_RESULT_LABELS[item.type] : 'Sin página propia'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {!hasResults && (hasSearch || selectedType !== 'all') && (
            <div className="flex min-h-60 flex-col items-center justify-center px-6 py-12 text-center">
              <span className="mb-3 font-serif text-3xl text-carbon/20" aria-hidden="true">◎</span>
              <p className="font-title text-lg text-carbon/65">No se encontraron resultados</p>
              <p className="mt-1 max-w-sm text-sm leading-relaxed text-carbon/45">
                Prueba con menos palabras o selecciona «Todo el contenido» para ampliar la búsqueda.
              </p>
            </div>
          )}

          {showIntroduction && (
            <div className="px-5 py-8 sm:px-8 sm:py-10">
              <div className="mb-2 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-terracota/80">
                <span className="h-px w-8 bg-terracota/45" aria-hidden="true" />
                Índice general
              </div>
              <p className="font-title text-2xl text-carbon">Explora la red matemática</p>
              <p className="mt-2 max-w-lg font-serif text-base leading-relaxed text-carbon/55">
                Busca por título o por idea, o comienza por un tipo de contenido.
              </p>
              <div className="mt-6 flex flex-wrap gap-2" aria-label="Explorar por tipo">
                {QUICK_FILTERS.filter(type => availableTypes.includes(type)).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => changeType(type)}
                    className="elegant-panel flex min-h-11 items-center gap-2 rounded-[2px] px-4 py-2 font-serif text-base font-semibold text-carbon/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota"
                    style={{ '--hover-accent': TYPE_COLORS[type] } as React.CSSProperties}
                  >
                    <span style={{ color: TYPE_COLORS[type] }} aria-hidden="true">{TYPE_ICONS[type]}</span>
                    {TYPE_LABELS[type]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="hidden border-t border-carbon/15 px-5 py-2.5 text-xs text-carbon/40 sm:flex sm:items-center sm:justify-between">
          <span><kbd className="font-sans font-bold">↑↓</kbd> recorrer <span className="mx-2">·</span> <kbd className="font-sans font-bold">↵</kbd> abrir</span>
          <span className="font-serif italic">Matematika · índice de contenidos</span>
        </div>
      </section>
    </div>
  );
};
