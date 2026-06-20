import React, { useEffect, useState, Suspense } from 'react';
import { useLessonStore } from '../../store/LessonStore';
import { EmptyState } from '../ui/EmptyState';

interface SimulationLayoutProps {
  children: React.ReactNode;
  simulationComponent?: React.ComponentType<Record<string, unknown>> | null;
  forceSplit?: boolean;
}

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
