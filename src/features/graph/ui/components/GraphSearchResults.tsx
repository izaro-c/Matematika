import type { CSSProperties } from 'react';

export interface GraphSearchResultItem {
  id: string;
  label: string;
  typeLabel: string;
  color: string;
}

interface GraphSearchResultsProps<T extends GraphSearchResultItem> {
  items: T[];
  onSelect: (item: T) => void;
}

/** Lista compartida de resultados para todos los exploradores de grafos. */
export function GraphSearchResults<T extends GraphSearchResultItem>({
  items,
  onSelect,
}: GraphSearchResultsProps<T>) {
  if (items.length === 0) return null;

  return (
    <div className="graph-search-results elegant-panel" role="listbox">
      {items.map(item => (
        <button
          key={item.id}
          type="button"
          className="graph-search-result"
          onClick={() => onSelect(item)}
          role="option"
          aria-selected="false"
        >
          <span
            className="graph-search-result__type"
            style={{ '--graph-result-color': item.color } as CSSProperties}
          >
            {item.typeLabel}
          </span>
          <span className="graph-search-result__label">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
