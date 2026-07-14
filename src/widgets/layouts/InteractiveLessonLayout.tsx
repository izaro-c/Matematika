import React, { useEffect, Suspense } from 'react';
import { Link } from 'wouter';
import { useLessonStore } from '@/features/lessons/LessonStore';
import { db } from '@/entities/content';
import { getContentPageAccent } from '@/shared/design';

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
 * Gestiona el diseño de pantalla dividida de forma adaptable:
 * - En móvil, sitúa la simulación fija arriba (38svh) y la lectura debajo.
 * - En escritorio, divide la pantalla en panel izquierdo (60% simulación) y derecho (40% lectura con scroll).
 *
 * @param {InteractiveLessonLayoutProps} props - Propiedades del componente.
 * @returns {JSX.Element} El layout interactivo completo.
 */
export const InteractiveLessonLayout: React.FC<InteractiveLessonLayoutProps> = ({ id, Component, SimulationFallback }) => {
  const { activeSimulation, defaultSimulation, setDefaultSimulation, setActiveSimulation } = useLessonStore();
  const lesson = db.getLesson(id);
  const examples = db.getExamplesByTheorem(id);
  const exercises = db.getExercisesByTheorem(id);

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

  const currentSim = activeSimulation || defaultSimulation;
  const hasSimulation = currentSim !== null;
  const ActiveSimComponent = currentSim;

  return (
    <div
      className={`min-h-screen lg:h-screen lg:overflow-hidden bg-transparent flex flex-col lg:flex-row page-accent-scope ${!hasSimulation ? 'justify-center' : ''}`}
      data-page-type="leccion"
      style={{ '--page-accent': getContentPageAccent('leccion') } as React.CSSProperties}
    >
      {/* Panel de Simulación / Geometría interactiva */}
      {hasSimulation && ActiveSimComponent && (
        <div
          className="w-full lg:w-[60%] border-b lg:border-b-0 lg:border-r border-carbon/15 p-4 sm:p-6 lg:p-8 flex items-center justify-center relative bg-lienzo shrink-0 sticky lg:relative top-0 lg:top-auto z-40 lg:z-10 height-[38svh] lg:h-full shadow-md lg:shadow-none"
          style={{ height: '38svh', minHeight: '38svh' }}
        >
          {/* Animated wrapper for smooth transitions */}
          <div
            key={(ActiveSimComponent as { name?: string })?.name || (ActiveSimComponent as { displayName?: string })?.displayName || 'simulation'}
            className="w-full h-full flex items-center justify-center scale-animation overflow-hidden"
          >
            <Suspense fallback={<div className="animate-pulse text-carbon/40 font-serif">Cargando simulación...</div>}>
              <ActiveSimComponent />
            </Suspense>
          </div>
        </div>
      )}

      {/* Panel de Lectura / Exposición Teórica */}
      <div
        className={`w-full ${hasSimulation ? 'lg:w-[40%] lg:h-full lg:overflow-y-auto' : 'max-w-4xl'} p-6 sm:p-10 lg:p-12 xl:p-16 relative scroll-smooth text-carbon font-serif pb-32`}
      >
        {lesson && (
          <div className="mb-12 border-b border-carbon/10 pb-8">
            <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-4">
              <span className="text-xs uppercase tracking-widest font-sans font-bold text-carbon/40">
                Lección Interactiva
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {lesson.title || 'Lección'}
            </h1>
            {lesson.description && (
              <p className="text-lg text-carbon/70 italic border-l-4 border-carbon/20 pl-4 leading-relaxed">
                {lesson.description}
              </p>
            )}
          </div>
        )}
        <div className="prose prose-pizarra prose-lg max-w-none editorial-reading">
          <Suspense fallback={<div className="animate-pulse h-64 bg-carbon/5 rounded"></div>}>
            <Component />
          </Suspense>
        </div>

        {/* Ejemplos y Ejercicios */}
        {(examples.length > 0 || exercises.length > 0) && (
          <div className="mb-24 mt-24">
            <h2 className="text-2xl font-bold mb-8 border-b border-carbon/10 pb-4">
              Material Práctico
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {examples.map(ex => (
                <Link key={ex.slug} href={`/ejemplo/${ex.id}`}>
                  <a className="flex flex-col p-6 elegant-panel group" style={{ textDecoration: 'none' }}>
                    <span className="page-accent-group-hover text-[10px] uppercase font-sans tracking-widest text-carbon/50 mb-2 font-bold transition-colors">Ejemplo Resuelto</span>
                    <h3 className="page-accent-group-hover font-bold text-lg text-carbon transition-colors">{ex.title}</h3>
                    {ex.description && <p className="text-sm opacity-80 mt-2 font-sans">{ex.description}</p>}
                    <span className="page-accent-group-hover text-xs font-sans tracking-widest uppercase text-carbon/40 mt-4 transition-colors flex items-center gap-1 font-bold">
                      Ver Ejemplo <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </span>
                  </a>
                </Link>
              ))}
              {exercises.map(ex => (
                <Link key={ex.slug} href={`/ejercicio/${ex.id}`}>
                  <a className="flex flex-col p-6 elegant-panel group" style={{ '--hover-accent': 'var(--page-accent)', textDecoration: 'none' } as React.CSSProperties}>
                    <span className="page-accent-group-hover text-[10px] uppercase font-sans tracking-widest text-carbon/50 mb-2 font-bold transition-colors">Ejercicio Propuesto</span>
                    <h3 className="page-accent-group-hover font-bold text-lg text-carbon transition-colors">{ex.title}</h3>
                    {ex.description && <p className="text-sm opacity-80 mt-2 font-sans">{ex.description}</p>}
                    <span className="page-accent-group-hover text-xs font-sans tracking-widest uppercase text-carbon/40 mt-4 transition-colors flex items-center gap-1 font-bold">
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
export default InteractiveLessonLayout;
