import { useRef, useState } from 'react';
import { getNodeTypeColor } from '@/features/graph/lib/graphUtils';

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
    <div className="absolute top-24 md:top-3 left-1/2 -translate-x-1/2 z-30 w-[min(300px,calc(100%-3rem))]">
      <div className="relative">
        <div className="flex items-center bg-lienzo border border-carbon/30 shadow-sm">
          <span className="pl-3 text-carbon/40 text-base select-none">⌕</span>
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
            placeholder="Buscar nodo…"
            className="flex-1 bg-transparent px-3 py-2 text-sm text-carbon font-serif placeholder:italic placeholder:text-carbon/35 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
              className="pr-3 text-carbon/40 hover:text-carbon text-sm"
            >
              ✕
            </button>
          )}
        </div>
        {searchOpen && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-lienzo border border-carbon/30 border-t-0 shadow-lg max-h-56 overflow-y-auto z-50">
            {searchResults.map((r) => (
              <button
                key={r.id}
                onMouseDown={() => { setSearchOpen(false); onSelect(r.id); }}
                className="w-full text-left px-4 py-2.5 hover:bg-carbon/5 border-b border-carbon/8 last:border-0 flex items-center gap-3"
              >
                <span className="text-[8px] uppercase tracking-widest shrink-0 px-1.5 py-0.5 rounded border font-sans font-bold"
                  style={{
                    background: `color-mix(in srgb, ${getNodeTypeColor(r.nodeType)} 14%, var(--theme-lienzo))`,
                    borderColor: getNodeTypeColor(r.nodeType),
                    color: getNodeTypeColor(r.nodeType),
                  }}>
                  {r.nodeType}
                </span>
                <span className="font-serif text-sm text-carbon capitalize">{r.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
