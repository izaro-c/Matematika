import React, { useEffect, useState, Suspense } from 'react';
import { useLessonStore } from '../../store/LessonStore';

interface SimulationLayoutProps {
  children: React.ReactNode;
  simulationComponent?: React.ComponentType<Record<string, unknown>> | null;
  /** Si es true, fuerza la pantalla dividida incluso si no hay simulationComponent inicialmente (para cargar dinámicamente). */
  forceSplit?: boolean;
}

/**
 * Layout genérico para páginas que requieren una simulación a la izquierda
 * y contenido a la derecha. Similar a `InteractiveLessonLayout` pero más ligero
 * y usado en demos/simuladores directos.
 */
export const SimulationLayout: React.FC<SimulationLayoutProps> = ({ 
  children, 
  simulationComponent,
  forceSplit = false
}) => {
  const { activeSimulation, defaultSimulation, setDefaultSimulation, setActiveSimulation } = useLessonStore();
  const [currentSim, setCurrentSim] = useState<React.ComponentType<Record<string, unknown>> | null>(null);

  // Initialize Simulation on mount
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
    <div className={`h-screen overflow-hidden bg-transparent flex ${!hasSimulation ? 'justify-center' : ''}`}>
      {hasSimulation && (
        <div className="w-full md:w-[50%] lg:w-[60%] border-r border-carbon/20 p-8 flex items-center justify-center relative bg-lienzo/50">
          {ActiveSimComponent ? (
             <div key={(ActiveSimComponent as { name?: string })?.name || 'simulation'} className="w-full h-full flex items-center justify-center animate-fade-in">
               <Suspense fallback={<div className="animate-pulse text-carbon/40 font-serif">Iniciando visualización...</div>}>
                 <ActiveSimComponent />
               </Suspense>
             </div>
          ) : (
            <div className="text-carbon/30 italic">No hay simulación activa.</div>
          )}
        </div>
      )}
      <div className={`${hasSimulation ? 'w-full md:w-[50%] lg:w-[40%]' : 'w-full'} h-full overflow-y-auto relative scroll-smooth bg-lienzo`}>
        {children}
      </div>
    </div>
  );
};
