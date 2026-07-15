import { GraphNode } from '../../lib/knowledgeGraphBuilder';
import { getKnowledgeGraphGroupPresentation } from '../../lib/graphUtils';
import { GraphSearchResults } from './GraphSearchResults';

interface GraphSearchProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: GraphNode[];
  onSearchSelect: (node: GraphNode) => void;
}

/**
 * Componente de Búsqueda para el Grafo de Conocimiento.
 *
 * Utiliza el estilo clásico de astrolabio (.elegant-panel) para una estética Arts & Crafts
 * cohesiva y unificada.
 */
export function GraphSearch({
  searchQuery,
  setSearchQuery,
  searchResults,
  onSearchSelect,
}: GraphSearchProps) {
  return (
    <div className="absolute top-24 md:top-8 left-1/2 -translate-x-1/2 z-50 w-[min(300px,calc(100vw-8rem))]">
      <div className="relative">
        <div className="elegant-panel flex items-center shadow-lg">
          <span className="pl-3 text-carbon/40 text-base select-none" aria-hidden="true">⌕</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar concepto…"
            aria-label="Buscar en el mapa de conexiones"
            className="graph-search-input min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-carbon outline-none placeholder:italic placeholder:text-carbon/35 font-serif"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="min-h-9 min-w-9 text-carbon/40 transition-colors hover:text-carbon focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-terracota"
              aria-label="Borrar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
        <GraphSearchResults
          items={searchResults.map(node => {
            const presentation = getKnowledgeGraphGroupPresentation(node.group);
            return {
              ...node,
              label: node.name,
              typeLabel: presentation.label,
              color: presentation.color,
            };
          })}
          onSelect={onSearchSelect}
        />
      </div>
    </div>
  );
}
export default GraphSearch;
