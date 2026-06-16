import { useEffect, useState, Suspense } from 'react';
import { Link } from 'wouter';
import { useLessonStore } from '../store/LessonStore';
import { db } from '../store/ContentStore';

interface InteractiveLessonLayoutProps {
  id: string;
  Component: React.ComponentType<any>;
  SimulationFallback: React.ComponentType<any> | null;
}

export const InteractiveLessonLayout: React.FC<InteractiveLessonLayoutProps> = ({ id, Component, SimulationFallback }) => {
  const { activeSimulation, defaultSimulation, setDefaultSimulation, setActiveSimulation } = useLessonStore();
  const examples = db.getExamplesByTheorem(id);
  const exercises = db.getExercisesByTheorem(id);
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
            <Suspense fallback={<div className="animate-pulse text-carbon/40 font-serif">Cargando simulación...</div>}>
              <ActiveSimComponent />
            </Suspense>
          </div>
        </div>
      )}
      <div className={`${hasSimulation ? 'w-[40%]' : 'w-full max-w-4xl'} p-12 overflow-y-auto relative scroll-smooth`}>
        <div className="teoria-mdx">
          <Suspense fallback={<div className="animate-pulse h-64 bg-carbon/5 rounded"></div>}>
            <Component />
          </Suspense>
        </div>

        {/* Ejemplos y Ejercicios */}
        {(examples.length > 0 || exercises.length > 0) && (
          <div className="mb-24 mt-24">
            <h2 className="text-2xl font-bold mb-8 border-b border-carbon/10 pb-4" style={{ fontVariant: 'small-caps' }}>
              Material Práctico
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {examples.map(ex => (
                <Link key={ex.slug} href={`/ejemplo/${ex.id}`}>
                  <a className="flex flex-col p-6 border border-carbon/20 bg-carbon/5 hover:border-terracota hover:shadow-md transition-all group">
                    <span className="text-[10px] uppercase font-sans tracking-widest text-carbon/40 mb-2">Ejemplo Resuelto</span>
                    <h3 className="font-bold text-lg group-hover:text-terracota transition-colors">{ex.title}</h3>
                    {ex.description && <p className="text-sm opacity-70 mt-2 font-sans">{ex.description}</p>}
                    <span className="text-xs font-sans tracking-widest uppercase text-terracota opacity-60 group-hover:opacity-100 mt-4 transition-opacity">
                      Ver Ejemplo &rarr;
                    </span>
                  </a>
                </Link>
              ))}
              {exercises.map(ex => (
                <Link key={ex.slug} href={`/ejercicio/${ex.id}`}>
                  <a className="flex flex-col p-6 border border-carbon/20 bg-carbon/5 hover:border-[#2a6a2a] hover:shadow-md transition-all group">
                    <span className="text-[10px] uppercase font-sans tracking-widest text-carbon/40 mb-2">Ejercicio Propuesto</span>
                    <h3 className="font-bold text-lg group-hover:text-[#2a6a2a] transition-colors">{ex.title}</h3>
                    {ex.description && <p className="text-sm opacity-70 mt-2 font-sans">{ex.description}</p>}
                    <span className="text-xs font-sans tracking-widest uppercase text-[#2a6a2a] opacity-60 group-hover:opacity-100 mt-4 transition-opacity">
                      Practicar &rarr;
                    </span>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
