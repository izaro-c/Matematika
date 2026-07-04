import { useEffect, useState, useMemo, useRef } from 'react';
import Fuse from 'fuse.js';
import { useLocation } from 'wouter';
import {
  ALL_TYPES,
  SEARCH_FUSE_OPTIONS,
  SEARCH_INDEX,
  TYPE_COLORS,
  TYPE_ICONS,
  useNavigationStore,
  type SearchResult,
  type SearchResultType,
} from '@/features/search/lib/searchApi';
import { useGlossaryStore } from '@/features/glossary/GlossaryStore';
import { EmptyState } from '@/shared/ui/EmptyState';

export const SearchOmnibar = () => {
  const { isSearchOpen, closeSearch } = useNavigationStore();
  const [, setLocation] = useLocation();
  const { openTerm } = useGlossaryStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTypes, setActiveTypes] = useState<Set<SearchResultType>>(new Set(ALL_TYPES));
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useNavigationStore.getState().toggleSearch();
      }
      if (e.key === 'Escape') closeSearch();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeSearch]);

  const [prevIsOpen, setPrevIsOpen] = useState(isSearchOpen);
  if (isSearchOpen !== prevIsOpen) {
    setPrevIsOpen(isSearchOpen);
    if (!isSearchOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  const fuse = useMemo(() => {
    const filtered = activeTypes.size < ALL_TYPES.length
      ? SEARCH_INDEX.filter(item => activeTypes.has(item.type))
      : SEARCH_INDEX;
    return new Fuse(filtered, SEARCH_FUSE_OPTIONS);
  }, [activeTypes]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).slice(0, 12);
  }, [query, fuse]);

  const [prevResults, setPrevResults] = useState(results);
  if (results !== prevResults) {
    setPrevResults(results);
    setSelectedIndex(0);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex].item);
    }
  };

  const handleSelect = (item: SearchResult) => {
    closeSearch();
    if (item.type === 'glosario') {
      openTerm(item.href);
    } else if (item.type === 'msc2020') {
      return;
    } else {
      setLocation(item.href);
    }
  };

  const toggleType = (type: SearchResultType) => {
    setActiveTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  function highlightText(text: string, matches: ReadonlyArray<{ indices: ReadonlyArray<[number, number]> }>): React.ReactNode {
    if (!matches || matches.length === 0) return text;
    const allIndices = matches.flatMap(m => m.indices).sort((a, b) => a[0] - b[0]);
    if (allIndices.length === 0) return text;
    const parts: React.ReactNode[] = [];
    let lastEnd = 0;
    for (const [start, end] of allIndices) {
      if (start > lastEnd) {
        parts.push(<span key={`t-${lastEnd}`}>{text.slice(lastEnd, start)}</span>);
      }
      parts.push(<span key={`h-${start}`} className="bg-terracota/30 text-carbon font-bold">{text.slice(start, end + 1)}</span>);
      lastEnd = end + 1;
    }
    if (lastEnd < text.length) {
      parts.push(<span key={`t-${lastEnd}`}>{text.slice(lastEnd)}</span>);
    }
    return <>{parts}</>;
  }

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[8vh]" onKeyDown={handleKeyDown}>
      <div className="absolute inset-0 bg-carbon/40 backdrop-blur-sm" onClick={closeSearch} />

      <div className="relative w-[calc(100%-2rem)] sm:w-full max-w-3xl bg-lienzo shadow-2xl overflow-hidden flex flex-col font-sans"
        style={{ border: '1px solid var(--theme-carbon)', borderRadius: '2px', outline: '1px solid color-mix(in srgb, var(--theme-carbon) 15%, transparent)', outlineOffset: '-4px' }}>

        {/* Input */}
        <div className="flex items-center px-5 py-4 border-b border-carbon/10">
          <svg className="w-5 h-5 mr-3 text-carbon/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-lg text-carbon outline-none placeholder-carbon/30 font-serif"
            placeholder="Buscar teoremas, definiciones, matemáticos…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <kbd className="ml-3 px-2 py-1 text-[10px] font-sans font-bold tracking-widest uppercase text-carbon/40 border border-carbon/15 rounded-sm shrink-0 shadow-sm">ESC</kbd>
        </div>

        <div className="flex flex-col sm:flex-row" style={{ minHeight: 200 }}>
          {/* Type filters - Scroll horizontal en móvil, sidebar en escritorio */}
          <div className="w-full sm:w-32 shrink-0 border-b sm:border-b-0 sm:border-r border-carbon/8 p-3 flex sm:flex-col gap-2 overflow-x-auto sm:overflow-x-visible">
            {ALL_TYPES.map(type => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`text-left text-xs px-2.5 py-1.5 rounded-sm transition-colors flex items-center gap-2 shrink-0 sm:w-full
                  ${activeTypes.has(type) ? 'text-carbon bg-carbon/5' : 'text-carbon/40 hover:bg-carbon/5'}`}
              >
                <span
                  className="w-2 h-2 rounded-sm shrink-0 border"
                  style={{
                    background: activeTypes.has(type) ? TYPE_COLORS[type] || 'var(--theme-pizarra)' : 'transparent',
                    borderColor: TYPE_COLORS[type] || 'var(--theme-pizarra)',
                  }}
                />
                <span className="capitalize font-medium whitespace-nowrap">{type.replace('_', ' ')}</span>
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="flex-1">
            {results.length > 0 && (
              <div ref={listRef} className="overflow-y-auto overflow-x-hidden w-full flex flex-col" style={{ maxHeight: '55vh' }}>
                {results.map(({ item, matches }, idx) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    style={idx === selectedIndex ? { borderLeftColor: TYPE_COLORS[item.type] } : undefined}
                    className={`w-full text-left px-5 py-3 flex items-center gap-4 transition-colors group border-b border-carbon/5 last:border-0 border-l-[3px]
                      ${idx === selectedIndex
                        ? 'bg-carbon/5'
                        : 'border-l-transparent hover:bg-carbon/5 text-carbon'
                      }`}
                  >
                    {/* Icono estructural */}
                    <span
                      style={idx === selectedIndex ? {
                        borderColor: `color-mix(in srgb, ${TYPE_COLORS[item.type]} 30%, transparent)`,
                        color: TYPE_COLORS[item.type],
                        backgroundColor: `color-mix(in srgb, ${TYPE_COLORS[item.type]} 5%, transparent)`,
                      } : undefined}
                      className={`w-8 h-8 shrink-0 flex items-center justify-center text-sm font-bold font-serif rounded-sm border transition-colors ${idx === selectedIndex
                        ? ''
                        : 'border-carbon/15 text-carbon/40'
                      }`}
                    >
                      {TYPE_ICONS[item.type]}
                    </span>

                    {/* Contenedor central - Se ha añadido explícitamente overflow-hidden para garantizar que el truncamiento actúe como un sumidero espacial absoluto */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div
                        style={idx === selectedIndex ? { color: TYPE_COLORS[item.type] } : undefined}
                        className={`font-serif font-bold text-base leading-tight truncate transition-colors ${idx === selectedIndex ? '' : 'text-carbon'
                        }`}
                      >
                        {query.trim() && matches
                          ? highlightText(item.title, matches.filter(m => m.key === 'title'))
                          : item.title}
                      </div>
                      {item.subtitle && (
                        <div className={`text-xs mt-0.5 leading-snug line-clamp-1 transition-colors ${idx === selectedIndex ? 'text-carbon/70' : 'text-carbon/45'
                          }`}>
                          {query.trim() && matches
                            ? highlightText(item.subtitle, matches.filter(m => m.key === 'subtitle'))
                            : item.subtitle}
                        </div>
                      )}
                    </div>

                    {/* Elemento terminal - Inmune a la compresión (w-max shrink-0) */}
                    <span
                      style={idx === selectedIndex ? { color: TYPE_COLORS[item.type] } : undefined}
                      className={`text-[10px] flex uppercase tracking-widest font-bold w-max shrink-0 whitespace-nowrap transition-colors ${idx === selectedIndex ? 'opacity-70' : 'text-carbon/30'
                      }`}
                    >
                      {item.type}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {query.trim() && results.length === 0 && (
              <EmptyState message={`Sin resultados para "${query}"`} icon="◎" />
            )}

            {!query.trim() && (
              <div className="px-5 py-6 flex flex-wrap gap-2">
                {(['teorema', 'lección', 'definición', 'matemático'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setQuery(type === 'lección' ? '' : type)}
                    className="ac-pill cursor-pointer hover:bg-carbon/5"
                  >
                    <span className="ac-pill-ornament">{TYPE_ICONS[type]}</span>
                    <span>{type}s</span>
                  </button>
                ))}
                <span className="ml-auto text-xs text-carbon/30 self-center">↑↓ navegar · ↵ abrir</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
