import { useEffect, useState, useMemo, useRef } from 'react';
import Fuse from 'fuse.js';
import { useLocation } from 'wouter';
import { useNavigationStore } from '../../store/NavigationStore';
import { db } from '../../store/content';
import { dictionary } from '../../store/GlossaryStore';
import { useGlossaryStore } from '../../store/GlossaryStore';
import { mscNames } from '../../store/content/msc2020';
import { EmptyState } from '../ui/EmptyState';

type SearchResult = {
  id: string;
  type: 'teorema' | 'lección' | 'definición' | 'ejemplo' | 'ejercicio' | 'demo' | 'glosario' | 'matemático' | 'caso_uso' | 'axioma' | 'msc2020';
  title: string;
  subtitle?: string;
  href: string;
};

const TYPE_ICONS: Record<SearchResult['type'], string> = {
  teorema: 'T',
  lección: '§',
  definición: 'D',
  ejemplo: 'E',
  ejercicio: 'P',
  demo: '∴',
  glosario: 'Σ',
  matemático: '✦',
  caso_uso: '◈',
  axioma: ' A',
  msc2020: '⊞',
};

const buildIndex = (): SearchResult[] => {
  const index: SearchResult[] = [];

  for (const thm of db.theorems.values()) {
    index.push({
      id: `thm-${thm.id}`,
      type: 'teorema',
      title: thm.title,
      subtitle: thm.description,
      href: `/Matematika/teorema/${thm.slug}`,
    });
  }

  for (const lesson of db.lessons.values()) {
    index.push({
      id: `lesson-${lesson.id}`,
      type: 'lección',
      title: lesson.title || lesson.id,
      href: `/Matematika/${lesson.slug}`,
    });
  }

  for (const def of db.definitions.values()) {
    index.push({
      id: `def-${def.id}`,
      type: 'definición',
      title: def.title,
      subtitle: def.description,
      href: `/Matematika/definicion/${def.slug}`,
    });
  }

  for (const ex of db.examples.values()) {
    index.push({
      id: `ex-${ex.id}`,
      type: 'ejemplo',
      title: ex.title,
      subtitle: ex.description,
      href: `/Matematika/ejemplo/${ex.slug}`,
    });
  }

  for (const ez of db.exercises.values()) {
    index.push({
      id: `ez-${ez.id}`,
      type: 'ejercicio',
      title: ez.title,
      subtitle: ez.description,
      href: `/Matematika/ejercicio/${ez.slug}`,
    });
  }

  for (const demo of db.demos.values()) {
    index.push({
      id: `demo-${demo.id}`,
      type: 'demo',
      title: demo.title,
      subtitle: demo.description,
      href: `/Matematika/demo/${demo.slug}`,
    });
  }

  for (const bio of db.mathematicians.values()) {
    index.push({
      id: `bio-${bio.id}`,
      type: 'matemático',
      title: bio.name || bio.fullName,
      subtitle: bio.description,
      href: `/Matematika/bio/${bio.slug}`,
    });
  }

  for (const uc of db.usecases.values()) {
    index.push({
      id: `uc-${uc.id}`,
      type: 'caso_uso',
      title: uc.title,
      subtitle: uc.description,
      href: `/Matematika/caso/${uc.slug}`,
    });
  }

  for (const axm of db.axioms.values()) {
    index.push({
      id: `axm-${axm.id}`,
      type: 'axioma',
      title: axm.title,
      subtitle: axm.description,
      href: `/Matematika/axioma/${axm.slug}`,
    });
  }

  for (const [key, term] of Object.entries(dictionary)) {
    index.push({
      id: `glossary-${key}`,
      type: 'glosario',
      title: term.title,
      subtitle: term.definition.slice(0, 120),
      href: key,
    });
  }

  for (const [code, name] of Object.entries(mscNames)) {
    index.push({
      id: `msc-${code}`,
      type: 'msc2020',
      title: `${code} — ${name}`,
      subtitle: `Clasificación MSC2020`,
      href: '',
    });
  }

  return index;
};

const searchIndex = buildIndex();

const ALL_TYPES: SearchResult['type'][] = [
  'teorema', 'lección', 'definición', 'axioma',
  'ejemplo', 'ejercicio', 'demo', 'matemático', 'caso_uso', 'glosario', 'msc2020',
];

const TYPE_COLORS: Record<string, string> = {
  teorema: '#6b9e6b', lección: '#4a6070', definición: '#8b7355',
  axioma: '#1c1917', ejemplo: '#6b9e6b', ejercicio: '#b85c38',
  demo: '#4a6070', matemático: '#c9a87c', caso_uso: '#6b9e6b',
  glosario: '#8b7355', msc2020: '#4a6070',
};

export const SearchOmnibar = () => {
  const { isSearchOpen, closeSearch } = useNavigationStore();
  const [, setLocation] = useLocation();
  const { openTerm } = useGlossaryStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set(ALL_TYPES));
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

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isSearchOpen]);

  const fuse = useMemo(() => {
    const filtered = activeTypes.size < ALL_TYPES.length
      ? searchIndex.filter(item => activeTypes.has(item.type))
      : searchIndex;
    return new Fuse(filtered, {
      keys: [
        { name: 'title', weight: 2 },
        { name: 'subtitle', weight: 1 },
      ],
      threshold: 0.35,
      includeMatches: true,
      minMatchCharLength: 2,
    });
  }, [activeTypes]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).slice(0, 12);
  }, [query, fuse]);

  useEffect(() => setSelectedIndex(0), [results]);

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

  const toggleType = (type: string) => {
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

      <div className="relative w-full max-w-3xl bg-lienzo shadow-2xl overflow-hidden flex flex-col font-sans"
        style={{ border: '1px solid rgba(51,51,51,0.12)', borderRadius: '2px' }}>

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
          <kbd className="ml-3 px-2 py-1 text-xs font-sans text-carbon/40 border border-carbon/15 rounded shrink-0">ESC</kbd>
        </div>

        <div className="flex" style={{ minHeight: 200 }}>
          {/* Type filters sidebar */}
          <div className="w-36 shrink-0 border-r border-carbon/8 p-3 space-y-1">
            {ALL_TYPES.map(type => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`w-full text-left text-xs px-2 py-1 rounded transition-colors flex items-center gap-2 ${
                  activeTypes.has(type) ? 'text-carbon' : 'text-carbon/30'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-sm shrink-0 border"
                  style={{
                    background: activeTypes.has(type) ? TYPE_COLORS[type] || '#999' : 'transparent',
                    borderColor: TYPE_COLORS[type] || '#999',
                  }}
                />
                <span className="capitalize">{type.replace('_', ' ')}</span>
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="flex-1">
            {results.length > 0 && (
              <div ref={listRef} className="overflow-y-auto" style={{ maxHeight: '55vh' }}>
                {results.map(({ item, matches }, idx) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`w-full text-left px-5 py-3 flex items-center gap-4 transition-colors group border-b border-carbon/5 last:border-0
                      ${idx === selectedIndex
                        ? 'bg-carbon text-lienzo'
                        : 'hover:bg-carbon/5 text-carbon'
                      }`}
                  >
                    <span className={`w-8 h-8 shrink-0 flex items-center justify-center text-sm font-bold font-serif rounded-sm border ${
                      idx === selectedIndex
                        ? 'border-lienzo/30 text-lienzo/70'
                        : 'border-carbon/15 text-carbon/40'
                    }`}>
                      {TYPE_ICONS[item.type]}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className={`font-serif font-bold text-base leading-tight truncate ${
                        idx === selectedIndex ? 'text-lienzo' : 'text-carbon'
                      }`}>
                        {query.trim() && matches
                          ? highlightText(item.title, matches.filter(m => m.key === 'title'))
                          : item.title}
                      </div>
                      {item.subtitle && (
                        <div className={`text-xs mt-0.5 leading-snug line-clamp-1 ${
                          idx === selectedIndex ? 'text-lienzo/60' : 'text-carbon/45'
                        }`}>
                          {query.trim() && matches
                            ? highlightText(item.subtitle, matches.filter(m => m.key === 'subtitle'))
                            : item.subtitle}
                        </div>
                      )}
                    </div>

                    <span className={`text-xs uppercase tracking-widest font-bold shrink-0 ${
                      idx === selectedIndex ? 'text-lienzo/50' : 'text-carbon/30'
                    }`}>
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
                    className="px-3 py-1.5 text-xs font-sans border border-carbon/15 text-carbon/50 hover:border-carbon/40 hover:text-carbon transition-colors rounded-sm capitalize"
                  >
                    {TYPE_ICONS[type]} {type}s
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
