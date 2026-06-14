import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation } from 'wouter';
import { useNavigationStore } from '../store/NavigationStore';
import { dictionary } from '../store/GlossaryStore';
import { useGlossaryStore } from '../store/GlossaryStore';

// Tipos de resultados
type SearchResult = {
  id: string;
  type: 'leccion' | 'demo' | 'glosario' | 'biografia';
  title: string;
  subtitle?: string;
  slug: string; // url o id del glosario
};

// Indexación Estática de Vite
const rawLessons = import.meta.glob('../lessons/*.mdx', { query: '?raw', import: 'default', eager: true });
const rawDemos = import.meta.glob('../demonstrations/*.mdx', { query: '?raw', import: 'default', eager: true });
const rawBios = import.meta.glob('../biographies/*.mdx', { query: '?raw', import: 'default', eager: true });

const extractTitle = (rawContent: string, fallback: string): string => {
  if (typeof rawContent !== 'string') return fallback;
  const match = rawContent.match(/^#\s+(.+)$/m);
  return match ? match[1] : fallback;
};

// Construir el índice una sola vez al cargar la app
const buildIndex = (): SearchResult[] => {
  const index: SearchResult[] = [];

  // 1. Lecciones
  for (const path in rawLessons) {
    const slug = path.split('/').pop()?.replace('.mdx', '').toLowerCase() || '';
    const title = extractTitle(rawLessons[path] as string, slug);
    index.push({ id: `lesson-${slug}`, type: 'leccion', title, slug, subtitle: 'Lección Interactiva' });
  }

  // 2. Demostraciones
  for (const path in rawDemos) {
    const slug = path.split('/').pop()?.replace('.mdx', '').replace(/demo$/, '').toLowerCase() || '';
    const title = extractTitle(rawDemos[path] as string, slug);
    index.push({ id: `demo-${slug}`, type: 'demo', title, slug: `demo/${slug}`, subtitle: 'Demostración Visual' });
  }

  // 3. Biografías Históricas
  for (const path in rawBios) {
    const slug = path.split('/').pop()?.replace('.mdx', '').toLowerCase() || '';
    const title = extractTitle(rawBios[path] as string, slug);
    index.push({ id: `bio-${slug}`, type: 'biografia', title, slug: `bio/${slug}`, subtitle: 'Biografía Histórica' });
  }

  // 4. Glosario
  for (const [key, term] of Object.entries(dictionary)) {
    index.push({ 
      id: `glossary-${key}`, 
      type: 'glosario', 
      title: term.title, 
      slug: key, 
      subtitle: term.definition.slice(0, 60) + '...' 
    });
  }

  return index;
};

const searchIndex = buildIndex();

export const SearchOmnibar = () => {
  const { isSearchOpen, closeSearch } = useNavigationStore();
  const [, setLocation] = useLocation();
  const { setActiveTerm } = useGlossaryStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useNavigationStore.getState().toggleSearch();
      }
      if (e.key === 'Escape') {
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeSearch]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    return searchIndex.filter(item => {
      const searchStr = `${item.title} ${item.subtitle}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return searchStr.includes(lowerQuery);
    }).slice(0, 8); // Max 8 results
  }, [query]);

  const handleSelect = (item: SearchResult) => {
    closeSearch();
    if (item.type === 'glosario') {
      setActiveTerm(item.slug);
    } else {
      setLocation(`/${item.slug}`);
    }
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-carbon/40 backdrop-blur-sm" 
        onClick={closeSearch}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-lienzo rounded-2xl shadow-2xl overflow-hidden border border-carbon/10 flex flex-col font-sans">
        <div className="flex items-center p-4 border-b border-carbon/10 text-carbon/50">
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-xl text-carbon outline-none placeholder-carbon/30"
            placeholder="Buscar lecciones, teoremas o conceptos (Cmd+K)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={closeSearch} className="px-2 text-sm font-semibold opacity-50 hover:opacity-100">ESC</button>
        </div>

        {results.length > 0 && (
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {results.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`w-full text-left p-4 rounded-xl flex items-center justify-between group transition-colors
                  hover:bg-carbon hover:text-lienzo`}
              >
                <div>
                  <h3 className="text-lg font-serif font-bold group-hover:text-lienzo text-carbon">{item.title}</h3>
                  {item.subtitle && <p className="text-sm opacity-60 mt-1">{item.subtitle}</p>}
                </div>
                <div className="text-xs uppercase font-bold tracking-wider opacity-40 group-hover:opacity-80">
                  {item.type}
                </div>
              </button>
            ))}
          </div>
        )}
        
        {query.trim() !== '' && results.length === 0 && (
          <div className="p-12 text-center text-carbon/40 italic font-serif">
            No se encontraron teoremas ni conceptos para "{query}".
          </div>
        )}
        
        {!query.trim() && (
          <div className="p-8 text-center text-carbon/40 text-sm">
            Busca cualquier término para saltar a su lección o definición.
          </div>
        )}
      </div>
    </div>
  );
};
