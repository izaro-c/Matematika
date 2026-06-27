
import { GraphNode } from '../../lib/knowledgeGraphBuilder';

interface GraphSearchProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: GraphNode[];
  onSearchSelect: (node: GraphNode) => void;
  graphNodes: GraphNode[];
}

export function GraphSearch({
  searchQuery,
  setSearchQuery,
  searchResults,
  onSearchSelect,
}: GraphSearchProps) {
  // Ajustemos para que reciba directamente el onChange y delegue:
  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar concepto..."
          className="w-64 bg-lienzo border-2 border-carbon/80 px-4 py-2 text-carbon outline-none focus:border-terracota placeholder:text-carbon/40 italic shadow-lg"
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 mt-1 w-full bg-lienzo border-2 border-carbon/80 shadow-xl max-h-60 overflow-y-auto">
            {searchResults.map((node) => (
              <div
                key={node.id}
                className="px-4 py-2 hover:bg-carbon/5 cursor-pointer text-carbon text-sm border-b border-carbon/10 last:border-0"
                onClick={() => onSearchSelect(node)}
              >
                <div className="font-bold">{node.name}</div>
                <div className="text-xs text-carbon/60 italic capitalize">{node.group}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
