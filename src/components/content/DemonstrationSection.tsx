import React, { useMemo } from 'react';
import { useMathStore } from '../../store/MathStoreContext';

/**
 * Propiedades para el componente DemonstrationSection.
 * @property {React.ReactNode} diagram - El componente visual (JSXGraph/ThreeJS) único.
 * @property {Record<string, React.ReactNode>} diagrams - Mapa de diagramas por cada "paso" (highlight id).
 * @property {React.ReactNode} children - El texto o contenido markdown (pasos de la demostración) que escrolea en la derecha.
 */
interface DemonstrationSectionProps {
  diagram?: React.ReactNode;
  diagrams?: Record<string, React.ReactNode>;
  children: React.ReactNode;
}

/**
 * Componente layout para demostraciones interactivas.
 * 
 * Implementa un diseño de pantalla dividida ("Split Screen").
 * La columna izquierda mantiene un diagrama interactivo fijado (sticky),
 * mientras que la columna derecha permite hacer scroll por el texto de la demostración.
 * 
 * Admite múltiples diagramas (`diagrams`) que transicionan según el estado `highlight` actual.
 */
export const DemonstrationSection: React.FC<DemonstrationSectionProps> = ({ diagram, diagrams, children }) => {
  const highlight = useMathStore(state => state.variables?.['highlight']);
  
  const renderedDiagram = useMemo(() => {
    const highlightStr = typeof highlight === 'string' ? highlight : null;

    if (diagrams) {
      // Find the currently active diagram, fallback to the first one if highlight doesn't match
      const keys = Object.keys(diagrams);
      const activeKey = highlightStr && diagrams[highlightStr] ? highlightStr : keys[0];
      
      return (
        <div className="relative w-full h-full">
          {keys.map((key) => {
            const isActive = key === activeKey;
            return (
              <div 
                key={key}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
              >
                {diagrams[key]}
              </div>
            );
          })}
        </div>
      );
    }
    return diagram;
  }, [diagram, diagrams, highlight]);

  return (
    <div className="w-full flex flex-col md:flex-row min-h-[85vh]">
      {/* Columna Izquierda: Diagrama (Sticky) */}
      <div className="w-full md:w-[50%] relative bg-lienzo">
        <div className="sticky top-[10vh] h-[80vh] p-8 flex items-center justify-center">
          {renderedDiagram}
        </div>
      </div>
      
      {/* Columna Derecha: Texto (Scrolly) */}
      <div className="w-full md:w-[50%] p-8 md:p-16 flex flex-col justify-start relative">
        <div className="prose prose-pizarra prose-lg max-w-prose mx-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
};
