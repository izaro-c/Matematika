import { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation } from 'wouter';
import { useNavigationStore } from '../../store/NavigationStore';
import { db } from '../../store/content';
import { dictionary } from '../../store/GlossaryStore';
import { useGlossaryStore } from '../../store/GlossaryStore';
import { EmptyState } from '../ui/EmptyState';

// ── Tipos ─────────────────────────────────────────────────────────────────────

type SearchResult = {
  id: string;
  type: 'teorema' | 'lección' | 'definición' | 'ejemplo' | 'ejercicio' | 'demo' | 'glosario' | 'matemático' | 'caso_uso' | 'axioma';
  title: string;
  subtitle?: string;
  href: string;
};

// ── Iconos por tipo ───────────────────────────────────────────────────────────

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
};

// ── Construcción del índice ───────────────────────────────────────────────────
// Se construye una única vez usando el ContentStore, que ya tiene los títulos
// correctos extraídos del frontmatter de cada MDX.

const buildIndex = (): SearchResult[] => {
  const index: SearchResult[] = [];

  // 1. Teoremas, Lemas y Corolarios
  for (const thm of db.theorems.values()) {
    const typeLabel = thm.type === 'lemma' ? 'lema' : thm.type === 'corollary' ? 'corolario' : 'teorema';
    index.push({
      id: `thm-${thm.id}`,
      type: 'teorema',
      title: thm.title,
      subtitle: thm.description,
      href: `/Matematika/teorema/${thm.slug}`,
    });
    void typeLabel;
  }

  // 2. Lecciones
  for (const lesson of db.lessons.values()) {
    index.push({
      id: `lesson-${lesson.id}`,
      type: 'lección',
      title: lesson.title || lesson.id,
      href: `/Matematika/${lesson.slug}`,
    });
  }

  // 3. Definiciones
  for (const def of db.definitions.values()) {
    index.push({
      id: `def-${def.id}`,
      type: 'definición',
      title: def.title,
      subtitle: def.description,
      href: `/Matematika/definicion/${def.slug}`,
    });
  }

  // 4. Ejemplos
  for (const ex of db.examples.values()) {
    index.push({
      id: `ex-${ex.id}`,
      type: 'ejemplo',
      title: ex.title,
      subtitle: ex.description,
      href: `/Matematika/ejemplo/${ex.slug}`,
    });
  }

  // 5. Ejercicios
  for (const ez of db.exercises.values()) {
    index.push({
      id: `ez-${ez.id}`,
      type: 'ejercicio',
      title: ez.title,
      subtitle: ez.description,
      href: `/Matematika/ejercicio/${ez.slug}`,
    });
  }

  // 6. Demostraciones
  for (const demo of db.demos.values()) {
    index.push({
      id: `demo-${demo.id}`,
      type: 'demo',
      title: demo.title,
      subtitle: demo.description,
      href: `/Matematika/demo/${demo.slug}`,
    });
  }

  // 7. Matemáticos
  for (const bio of db.mathematicians.values()) {
    index.push({
      id: `bio-${bio.id}`,
      type: 'matemático',
      title: bio.name || bio.fullName,
      subtitle: bio.description,
      href: `/Matematika/bio/${bio.slug}`,
    });
  }

  // 8. Casos de Uso
  for (const uc of db.usecases.values()) {
    index.push({
      id: `uc-${uc.id}`,
      type: 'caso_uso',
      title: uc.title,
      subtitle: uc.description,
      href: `/Matematika/caso/${uc.slug}`,
    });
  }

  // 9. Axiomas
  for (const axm of db.axioms.values()) {
    index.push({
      id: `axm-${axm.id}`,
      type: 'axioma',
      title: axm.title,
      subtitle: axm.description,
      href: `/Matematika/axioma/${axm.slug}`,
    });
  }

  // 10. Glosario de Símbolos
  for (const [key, term] of Object.entries(dictionary)) {
    index.push({
      id: `glossary-${key}`,
      type: 'glosario',
      title: term.title,
      subtitle: term.definition.slice(0, 80) + '…',
      href: key, // El glosario se abre en el panel, no navega
    });
  }

  return index;
};

const searchIndex = buildIndex();

/**
 * SearchOmnibar
 *
 * Barra de búsqueda global y omnisciente. 
 * Se abre pulsando Cmd+K o desde un botón. Construye un índice en memoria 
 * leyendo de `db` (ContentStore) y permite navegación rápida y accesible por teclado.
 */
export const SearchOmnibar = () => {
  const { isSearchOpen, closeSearch } = useNavigationStore();
  const [, setLocation] = useLocation();
  const { openTerm } = useGlossaryStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcuts: Cmd+K y Escape
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

  // Focus al abrir, limpiar al cerrar
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isSearchOpen]);

  // Normalización de texto para búsqueda acentuada
  const normalize = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = normalize(query);
    return searchIndex
      .filter(item => {
        const haystack = normalize(`${item.title} ${item.subtitle ?? ''} ${item.type}`);
        return haystack.includes(q);
      })
      .slice(0, 9);
  }, [query]);

  // Restablecer selección cuando cambian los resultados
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setSelectedIndex(0), [results]);

  // Navegación con teclado dentro de los resultados
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  const handleSelect = (item: SearchResult) => {
    closeSearch();
    if (item.type === 'glosario') {
      openTerm(item.href);
    } else {
      setLocation(item.href);
    }
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh]" onKeyDown={handleKeyDown}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-carbon/40 backdrop-blur-sm" onClick={closeSearch} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-lienzo shadow-2xl overflow-hidden flex flex-col font-sans"
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

        {/* Resultados */}
        {results.length > 0 && (
          <div ref={listRef} className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
            {results.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`w-full text-left px-5 py-3 flex items-center gap-4 transition-colors group
                  ${idx === selectedIndex
                    ? 'bg-carbon text-lienzo'
                    : 'hover:bg-carbon/5 text-carbon'
                  }`}
              >
                {/* Icono de tipo */}
                <span className={`w-8 h-8 shrink-0 flex items-center justify-center text-sm font-bold font-serif
                  rounded-sm border
                  ${idx === selectedIndex
                    ? 'border-lienzo/30 text-lienzo/70'
                    : 'border-carbon/15 text-carbon/40'
                  }`}>
                  {TYPE_ICONS[item.type]}
                </span>

                {/* Texto */}
                <div className="flex-1 min-w-0">
                  <div className={`font-serif font-bold text-base leading-tight truncate
                    ${idx === selectedIndex ? 'text-lienzo' : 'text-carbon'}`}>
                    {item.title}
                  </div>
                  {item.subtitle && (
                    <div className={`text-xs mt-0.5 leading-snug line-clamp-1
                      ${idx === selectedIndex ? 'text-lienzo/60' : 'text-carbon/45'}`}>
                      {item.subtitle}
                    </div>
                  )}
                </div>

                {/* Tipo badge */}
                <span className={`text-xs uppercase tracking-widest font-bold shrink-0
                  ${idx === selectedIndex ? 'text-lienzo/50' : 'text-carbon/30'}`}>
                  {item.type}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Estado vacío */}
        {query.trim() && results.length === 0 && (
          <EmptyState
            message={`Sin resultados para "${query}"`}
            icon="◎"
          />
        )}

        {/* Estado inicial */}
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
  );
};
