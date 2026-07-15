import { useState } from 'react';
import { CONTENT_TYPE_CONFIG } from '@/shared/lib/constants';
import { getKnowledgeGraphLegendTypes } from '../../lib/graphUtils';
import { GraphExplorerLink } from './GraphExplorerLink';

interface GraphLegendProps {
  nodeGroups: Iterable<string>;
}

/**
 * Componente de la Leyenda del Grafo de Conocimiento.
 *
 * - En móvil, se presenta por defecto colapsado bajo un botón flotante redondo y elegante (ⓘ).
 * - En escritorio, se muestra expandido en la esquina inferior derecha.
 * - Utiliza el estilo astrolabio (.elegant-panel) para consistencia con el resto del proyecto.
 */
export function GraphLegend({ nodeGroups }: GraphLegendProps) {
  const [isOpen, setIsOpen] = useState(false);
  const legendTypes = getKnowledgeGraphLegendTypes(nodeGroups);

  return (
    <>
      {/* Botón flotante para móvil (oculto en escritorio) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden absolute bottom-6 right-6 z-50 elegant-panel rounded-full w-12 h-12 flex items-center justify-center cursor-pointer text-carbon shadow-lg active:scale-95 transition-transform"
        title="Leyenda del mapa"
        aria-label="Mostrar leyenda del mapa"
        aria-expanded={isOpen}
        aria-controls="graph-legend-panel"
      >
        <span className="font-serif italic font-bold text-lg select-none">ⓘ</span>
      </button>

      {/* Contenedor de la leyenda (adaptable) */}
      <div
        id="graph-legend-panel"
        className={`absolute bottom-20 right-6 lg:bottom-8 lg:right-8 z-50 p-4 shadow-2xl transition-all duration-300 elegant-panel
          ${isOpen ? 'block' : 'hidden lg:block'}`}
        style={{ minWidth: '220px' }}
      >
        <div className="relative">
          {/* Botón de cierre para móvil */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden absolute -top-1 -right-1 text-carbon/40 hover:text-carbon text-xs font-bold w-5 h-5 flex items-center justify-center border border-carbon/25 rounded-full"
            aria-label="Cerrar leyenda"
          >
            ×
          </button>

          <h4
            className="font-bold text-[10px] uppercase tracking-widest mb-4 text-carbon/50 text-center mt-1"
          >
            Leyenda
          </h4>

          <div className="flex flex-col gap-2.5 text-xs italic text-carbon/80 font-serif">
            {legendTypes.map((type) => {
              const config = CONTENT_TYPE_CONFIG[type];
              if (!config) return null;
              return (
                <div key={type} className="flex items-center gap-3">
                  <span
                    className="w-3.5 h-3.5 rounded-sm border border-carbon/30 block"
                    style={{ backgroundColor: config.graphColor }}
                  />
                  <span>{config.labelPlural}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-carbon/10">
            <GraphExplorerLink href="/axiomas" direction="forward">
              Dependencias axiomáticas
            </GraphExplorerLink>
          </div>
        </div>
      </div>
    </>
  );
}
export default GraphLegend;
