import React, { useEffect, Suspense } from 'react';
import { useLessonStore } from '@/features/lessons/LessonStore';
import { EmptyState } from '@/shared/ui/EmptyState';
import { TriptychLayout } from '@/widgets/layouts/TriptychLayout';

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

  const ActiveSimComponent = activeSimulation || defaultSimulation || simulationComponent || null;
  const hasSimulation = ActiveSimComponent !== null || forceSplit;

  return (
    <TriptychLayout
      diagram={hasSimulation ? (
        <div className="simulation-panel">
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
      ) : undefined}
    >
      {children}
    </TriptychLayout>
  );
};
