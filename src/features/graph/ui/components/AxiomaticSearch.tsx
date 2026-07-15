import { useRef, useState } from 'react';
import { getNodeTypeColor } from '@/features/graph/lib/graphUtils';
import { GraphSearchResults } from './GraphSearchResults';

interface SearchResult {
  id: string;
  label: string;
  nodeType: string;
}

interface AxiomaticSearchProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: SearchResult[];
  onSelect: (id: string) => void;
}

export function AxiomaticSearch({
  searchQuery,
  setSearchQuery,
  searchResults,
  onSelect,
}: AxiomaticSearchProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="absolute top-24 md:top-8 left-1/2 -translate-x-1/2 z-30 w-[min(300px,calc(100vw-8rem))]">
      <div
        className="relative"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setSearchOpen(false);
          }
        }}
      >
        <div className="elegant-panel flex items-center shadow-lg">
          <span className="pl-3 text-carbon/40 text-base select-none" aria-hidden="true">⌕</span>
          <input
            ref={searchRef}
            type="search"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Buscar nodo axiomático…"
            aria-label="Buscar en las dependencias axiomáticas"
            className="graph-search-input min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-carbon font-serif placeholder:italic placeholder:text-carbon/35 outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
              className="min-h-9 min-w-9 text-carbon/40 transition-colors hover:text-carbon focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-terracota"
              aria-label="Borrar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
        {searchOpen && (
          <GraphSearchResults
            items={searchResults.map(result => ({
              ...result,
              typeLabel: result.nodeType,
              color: getNodeTypeColor(result.nodeType),
            }))}
            onSelect={(result) => {
              setSearchOpen(false);
              onSelect(result.id);
            }}
          />
        )}
      </div>
    </div>
  );
}
