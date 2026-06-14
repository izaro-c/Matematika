import React, { useEffect, useState } from 'react';
import { useLessonStore } from '../store/LessonStore';

interface InteractiveLessonLayoutProps {
  Component: React.ComponentType<any>;
  SimulationFallback: React.ComponentType<any> | null;
}

export const InteractiveLessonLayout: React.FC<InteractiveLessonLayoutProps> = ({ Component, SimulationFallback }) => {
  const { activeSimulation, defaultSimulation, setDefaultSimulation, setActiveSimulation } = useLessonStore();
  const [currentSim, setCurrentSim] = useState<React.ComponentType<any> | null>(null);

  // Initialize defaults on mount
  useEffect(() => {
    if (SimulationFallback) {
      setDefaultSimulation(SimulationFallback);
      setActiveSimulation(SimulationFallback);
    } else {
      setDefaultSimulation(null);
      setActiveSimulation(null);
    }
    
    // Cleanup on unmount
    return () => {
      setDefaultSimulation(null);
      setActiveSimulation(null);
    };
  }, [SimulationFallback, setDefaultSimulation, setActiveSimulation]);

  // Smooth transition for Simulation updates
  useEffect(() => {
    // We could add CSS transition logic here using an intermediate state, 
    // but for now, React will re-render the left panel.
    setCurrentSim(() => activeSimulation || defaultSimulation);
  }, [activeSimulation, defaultSimulation]);

  const hasSimulation = currentSim !== null;
  const ActiveSimComponent = currentSim;

  return (
    <div className={`h-screen overflow-hidden bg-transparent flex ${!hasSimulation ? 'justify-center' : ''}`}>
      {hasSimulation && ActiveSimComponent && (
        <div className="w-[60%] border-r border-carbon/20 p-8 flex items-center justify-center relative bg-lienzo/50">
          {/* Animated wrapper for smooth transitions */}
          <div key={(ActiveSimComponent as any)?.name || (ActiveSimComponent as any)?.displayName || 'simulation'} className="w-full h-full flex items-center justify-center animate-fade-in">
            <ActiveSimComponent />
          </div>
        </div>
      )}
      <div className={`${hasSimulation ? 'w-[40%]' : 'w-full max-w-4xl'} p-12 overflow-y-auto relative scroll-smooth`}>
        <div className="teoria-mdx">
          <Component />
        </div>
      </div>
    </div>
  );
};
