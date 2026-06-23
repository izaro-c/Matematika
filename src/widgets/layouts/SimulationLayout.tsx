import React, { useEffect, useState, Suspense } from 'react';
import { useLessonStore } from '@/features/lessons/LessonStore';
import { EmptyState } from '@/shared/ui/EmptyState';

/**
 * Propiedades para el layout contenedor de simulaciones interactivas estáticas.
 */
interface SimulationLayoutProps {
  /** Contenido en la columna derecha de scroll libre (MDX) */
  children: React.ReactNode;
  /** Componente de simulación opcional a renderizar en la columna izquierda fija */
  simulationComponent?: React.ComponentType<Record<string, unknown>> | null;
  /** Si es true, divide la pantalla a la mitad aunque no haya simulación montada inicialmente */
  forceSplit?: boolean;
}

/**
 * Layout general para páginas que contienen una simulación y un bloque de texto adyacente.
 * Se integra con `useLessonStore` para permitir que el texto a la derecha
 * modifique qué simulación se visualiza en la columna de la izquierda durante el scroll/hover.
 */
export const SimulationLayout: React.FC<SimulationLayoutProps> = ({
  children,
  simulationComponent,
  forceSplit = false
}) => {
  const { activeSimulation, defaultSimulation, setDefaultSimulation, setActiveSimulation } = useLessonStore();
  const [currentSim, setCurrentSim] = useState<React.ComponentType<Record<string, unknown>> | null>(null);

  useEffect(() => {
    if (simulationComponent) {
      setDefaultSimulation(simulationComponent);
      setActiveSimulation(simulationComponent);
    } else {
      setDefaultSimulation(null);
      setActiveSimulation(null);
    }
    return () => {
      setDefaultSimulation(null);
      setActiveSimulation(null);
    };
  }, [simulationComponent, setDefaultSimulation, setActiveSimulation]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentSim(() => activeSimulation || defaultSimulation);
  }, [activeSimulation, defaultSimulation]);

  const hasSimulation = currentSim !== null || forceSplit;
  const ActiveSimComponent = currentSim;

  return (
    <div className={`h-screen overflow-hidden bg-transparent flex flex-col md:flex-row ${!hasSimulation ? 'md:justify-center' : ''}`}>
      {hasSimulation && (
        <div className="w-full md:w-[50%] lg:w-[60%] border-b md:border-b-0 md:border-r border-carbon/20 p-6 md:p-8 flex items-center justify-center relative bg-lienzo/50 min-h-[40vh] md:min-h-0 md:max-h-screen">
          {ActiveSimComponent ? (
            <div key={(ActiveSimComponent as { name?: string })?.name || 'simulation'} className="w-full h-full flex items-center justify-center animate-fade-in">
              <Suspense fallback={<div className="animate-pulse text-carbon/40 font-serif">Iniciando visualización...</div>}>
                <ActiveSimComponent />
              </Suspense>
            </div>
          ) : (
            <EmptyState message="No hay simulación activa." icon="⊡" />
          )}
        </div>
      )}
      <div className={`${hasSimulation ? 'w-full md:w-[50%] lg:w-[40%]' : 'w-full'} h-full overflow-y-auto relative scroll-smooth bg-lienzo`}>
        {children}
      </div>
    </div>
  );
};
