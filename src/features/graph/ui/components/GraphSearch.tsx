import { GraphNode } from '../../lib/knowledgeGraphBuilder';

interface GraphSearchProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: GraphNode[];
  onSearchSelect: (node: GraphNode) => void;
  graphNodes: GraphNode[];
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
    <div className="absolute top-24 md:top-8 left-1/2 -translate-x-1/2 z-50">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar concepto..."
          className="w-64 elegant-panel px-4 py-2 text-carbon outline-none placeholder:text-carbon/30 italic font-serif shadow-lg"
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 mt-1 w-full elegant-panel shadow-2xl max-h-60 overflow-y-auto z-50">
            {searchResults.map((node) => (
              <div
                key={node.id}
                className="px-4 py-2 hover:bg-carbon/5 cursor-pointer text-carbon text-sm border-b border-carbon/10 last:border-0"
                onClick={() => onSearchSelect(node)}
              >
                <div className="font-bold font-serif">{node.name}</div>
                <div className="text-[10px] font-sans text-carbon/50 uppercase tracking-wider mt-0.5">{node.group}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default GraphSearch;
