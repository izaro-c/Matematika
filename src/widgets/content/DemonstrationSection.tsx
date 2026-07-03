import React, { useMemo } from 'react';
import { useMathStore } from '@/app/providers/MathStoreContext';
import { TriptychLayout } from '@/widgets/layouts/TriptychLayout';

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
 * Implementa scrollytelling con una única instancia del diagrama. El layout
 * reposiciona esa instancia con CSS sin portales ni ramas por breakpoint.
 * 
 * Admite múltiples diagramas (`diagrams`) que transicionan según el estado `highlight` actual.
 */
export const DemonstrationSection: React.FC<DemonstrationSectionProps> = ({ diagram, diagrams, children }) => {
  const step = useMathStore(state => state.variables?.['step']);
  
  const renderedDiagram = useMemo(() => {
    const stepStr = typeof step === 'string' ? step : null;

    if (diagrams) {
      // Find the currently active diagram, fallback to the first one if step doesn't match
      const keys = Object.keys(diagrams);
      const activeKey = stepStr && diagrams[stepStr] ? stepStr : keys[0];
      
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
  }, [diagram, diagrams, step]);

  const hasDiagram = diagram !== undefined || (diagrams !== undefined && Object.keys(diagrams).length > 0);

  return (
    <TriptychLayout
      embedded
      diagram={hasDiagram ? renderedDiagram : undefined}
      diagramLabel="Diagrama de la demostración"
      className="demonstration-triptych"
    >
      <div className="prose prose-pizarra prose-lg max-w-none w-full">
        {children}
      </div>
    </TriptychLayout>
  );
};
