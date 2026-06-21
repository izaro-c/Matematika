import { useEffect, useState, Suspense } from 'react';
import { Link } from 'wouter';
import { useLessonStore } from '@/controller/store/LessonStore';
import { db } from '@/database/dao/content';

/**
 * Propiedades de InteractiveLessonLayout.
 * @property {string} id - El ID de la lección para recuperar sus metadatos desde el ContentStore.
 * @property {React.ComponentType<any>} Component - El componente MDX principal de la lección.
 * @property {React.ComponentType<any> | null} SimulationFallback - Simulación o visualizador por defecto de la lección, si la tiene.
 */
interface InteractiveLessonLayoutProps {
  id: string;
  Component: React.ComponentType<Record<string, unknown>>;
  SimulationFallback: React.ComponentType<Record<string, unknown>> | null;
}

/**
 * Layout principal para Lecciones interactivas.
 * 
 * Gestiona el diseño de pantalla dividida. Si la lección define una simulación,
 * muestra la simulación en la parte izquierda y el texto MDX en la derecha.
 * Además gestiona el estado global de `LessonStore` para permitir que el texto
 * MDX cambie dinámicamente la simulación mostrada.
 * 
 * @param {InteractiveLessonLayoutProps} props - Propiedades del componente.
 * @returns {JSX.Element} El layout interactivo completo.
 */

export const InteractiveLessonLayout: React.FC<InteractiveLessonLayoutProps> = ({ id, Component, SimulationFallback }) => {
  const { activeSimulation, defaultSimulation, setDefaultSimulation, setActiveSimulation } = useLessonStore();
  const lesson = db.getLesson(id);
  const examples = db.getExamplesByTheorem(id);
  const exercises = db.getExercisesByTheorem(id);
  const [currentSim, setCurrentSim] = useState<React.ComponentType<Record<string, unknown>> | null>(null);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentSim(() => activeSimulation || defaultSimulation);
  }, [activeSimulation, defaultSimulation]);

  const hasSimulation = currentSim !== null;
  const ActiveSimComponent = currentSim;

  return (
    <div className={`h-screen overflow-hidden bg-transparent flex ${!hasSimulation ? 'justify-center' : ''}`}>
      {hasSimulation && ActiveSimComponent && (
        <div className="w-[60%] border-r-2 border-carbon p-8 flex items-center justify-center relative bg-lienzo">
          {/* Animated wrapper for smooth transitions */}
          <div key={(ActiveSimComponent as { name?: string })?.name || (ActiveSimComponent as { displayName?: string })?.displayName || 'simulation'} className="w-full h-full flex items-center justify-center animate-fade-in scale-animation">
            <Suspense fallback={<div className="animate-pulse text-carbon/40 font-serif">Cargando simulación...</div>}>
              <ActiveSimComponent />
            </Suspense>
          </div>
        </div>
      )}
      <div className={`${hasSimulation ? 'w-[40%]' : 'w-full max-w-4xl'} p-12 overflow-y-auto relative scroll-smooth text-carbon font-serif pb-32`}>
        {lesson && (
          <div className="mb-12 border-b border-carbon/10 pb-8">
            <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-4">
              <span className={`text-sm uppercase tracking-widest font-sans font-bold text-carbon/80`}>
                Lección Interactiva
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontVariant: 'small-caps' }}>
              {lesson.title || 'Lección'}
            </h1>
            {lesson.description && (
              <p className="text-lg text-carbon/70 italic border-l-4 border-carbon/20 pl-4 leading-relaxed">
                {lesson.description}
              </p>
            )}
          </div>
        )}
        <div className="prose prose-pizarra prose-lg max-w-none">
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
                  <a className="flex flex-col p-6 elegant-panel group">
                    <span className="text-[10px] uppercase font-sans tracking-widest text-carbon/50 group-hover:text-terracota mb-2 font-bold transition-colors">Ejemplo Resuelto</span>
                    <h3 className="font-bold text-lg text-carbon group-hover:text-terracota transition-colors">{ex.title}</h3>
                    {ex.description && <p className="text-sm opacity-80 mt-2 font-sans">{ex.description}</p>}
                    <span className="text-xs font-sans tracking-widest uppercase text-carbon/40 group-hover:text-terracota mt-4 transition-colors flex items-center gap-1 font-bold">
                      Ver Ejemplo <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </span>
                  </a>
                </Link>
              ))}
              {exercises.map(ex => (
                <Link key={ex.slug} href={`/ejercicio/${ex.id}`}>
                  <a className="flex flex-col p-6 elegant-panel group" style={{ '--hover-accent': 'var(--theme-salvia)' } as React.CSSProperties}>
                    <span className="text-[10px] uppercase font-sans tracking-widest text-carbon/50 group-hover:text-salvia mb-2 font-bold transition-colors">Ejercicio Propuesto</span>
                    <h3 className="font-bold text-lg text-carbon group-hover:text-salvia transition-colors">{ex.title}</h3>
                    {ex.description && <p className="text-sm opacity-80 mt-2 font-sans">{ex.description}</p>}
                    <span className="text-xs font-sans tracking-widest uppercase text-carbon/40 group-hover:text-salvia mt-4 transition-colors flex items-center gap-1 font-bold">
                      Practicar <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
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
