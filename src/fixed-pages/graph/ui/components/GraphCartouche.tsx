import { useId, useState, type CSSProperties, type MouseEvent } from 'react';
import { CONTENT_TYPE_CONFIG, getContentTypeLabel } from '@/lib/theme/constants';
import { useI18n } from '@/i18n';
import type { GraphNode } from '../../lib/knowledgeGraphBuilder';
import { GraphExplorerLink } from './GraphExplorerLink';

export interface GraphLegendEntry {
  type: string;
  count: number;
}

interface GraphCartoucheProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResults: GraphNode[];
  /** `clickedAt` es el `timeStamp` del clic: el círculo de pluma se cuenta desde ahí. */
  onSearchSelect: (node: GraphNode, clickedAt: number) => void;
  legend: GraphLegendEntry[];
  /** Tipo resaltado en el lienzo (por hover o fijado). */
  focusType: string | null;
  pinnedType: string | null;
  onHoverType: (type: string | null) => void;
  onTogglePin: (type: string) => void;
}

const canHover = () => window.matchMedia('(hover: hover)').matches;

/**
 * Cartela del grafo visual: título, búsqueda subrayada y leyenda impresa con puntos guía
 * y recuentos. Cada entrada de la leyenda resalta su tipo en el lienzo (hover en escritorio,
 * toque para fijarlo). En móvil la leyenda se pliega bajo el rótulo «Leyenda».
 */
export function GraphCartouche({
  searchQuery,
  onSearchChange,
  searchResults,
  onSearchSelect,
  legend,
  focusType,
  pinnedType,
  onHoverType,
  onTogglePin,
}: GraphCartoucheProps) {
  const { lang, t } = useI18n();
  const [legendOpen, setLegendOpen] = useState(false);
  const foldId = useId();

  return (
    <aside className={`graph-cartouche ${legendOpen ? 'is-open' : ''}`}>
      <h1 className="graph-cartouche__title">{t('navigation', 'graph')}</h1>

      <label className="graph-cartouche-search">
        <span className="sr-only">{t('graph', 'searchMapAria')}</span>
        <span className="graph-cartouche-search__glyph" aria-hidden="true">⌕</span>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('graph', 'searchConceptPlaceholder')}
          className="graph-search-input"
        />
        {searchResults.length > 0 && (
          <ul className="graph-cartouche-search__results">
            {searchResults.map(node => (
              <li key={node.id}>
                <button type="button" onClick={(e: MouseEvent) => onSearchSelect(node, e.timeStamp)}>{node.name}</button>
              </li>
            ))}
          </ul>
        )}
      </label>

      <button
        type="button"
        className="graph-cartouche__toggle ac-rubric"
        aria-expanded={legendOpen}
        aria-controls={foldId}
        onClick={() => setLegendOpen(open => !open)}
      >
        <span className="ac-ink-underline">{t('graph', 'legendHeading')}</span>
        <span className="graph-cartouche__chevron" aria-hidden="true">▸</span>
      </button>

      <div id={foldId} className="graph-cartouche__fold">
        <div className="graph-cartouche__fold-inner">
          <ul className={`graph-key ${focusType ? 'has-focus' : ''}`}>
            {legend.map(({ type, count }, index) => {
              const config = CONTENT_TYPE_CONFIG[type];
              if (!config) return null;
              return (
                <li
                  key={type}
                  className={`graph-key__item ${focusType === type ? 'is-focus' : ''}`}
                  style={{ '--i': index } as CSSProperties}
                >
                  <button
                    type="button"
                    className="graph-key__btn"
                    aria-pressed={pinnedType === type}
                    onMouseEnter={() => canHover() && onHoverType(type)}
                    onMouseLeave={() => onHoverType(null)}
                    onFocus={() => canHover() && onHoverType(type)}
                    onBlur={() => onHoverType(null)}
                    onClick={() => onTogglePin(type)}
                  >
                    <span className="graph-key__swatch" style={{ backgroundColor: config.graphColor }} aria-hidden="true" />
                    <span className="graph-key__label">{getContentTypeLabel(type, 'plural', lang)}</span>
                    <span className="graph-key__dots" aria-hidden="true" />
                    <span className="graph-key__count">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="graph-cartouche__link mt-2 flex" style={{ '--i': legend.length } as CSSProperties}>
            <GraphExplorerLink href="/axiomas" direction="forward">
              {t('graph', 'axiomaticDependencies')}
            </GraphExplorerLink>
          </div>
        </div>
      </div>
    </aside>
  );
}
