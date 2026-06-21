import { useEffect, useRef } from 'react';
import { useLessonStore } from '@/controller/store/LessonStore';

/**
 * Propiedades para la sección de simulación
 */
interface SimSectionProps {
  /** El componente React que renderiza la simulación/gráfico (ej. un JSXGraph) */
  sim: React.ComponentType<Record<string, unknown>>;
  children: React.ReactNode;
}

/**
 * Componente contenedor que, al hacer scroll e interceptar el centro del viewport,
 * actualiza el LessonStore para cambiar el simulador activo en el layout principal.
 * Permite que diferentes párrafos activen distintos diagramas dinámicamente.
 */
export const SimSection: React.FC<SimSectionProps> = ({ sim, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const setActiveSimulation = useLessonStore((state) => state.setActiveSimulation);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Cuando la sección entra en el 50% de la pantalla, cambia el simulador
            setActiveSimulation(sim);
          }
        });
      },
      {
        root: null,
        rootMargin: '-30% 0px -40% 0px', // Gatillo centrado en la lectura (entre 30% top y 40% bottom)
        threshold: 0,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [sim, setActiveSimulation]);

  return (
    <div ref={ref} className="relative w-full">
      {/* Un sutil marcador visual en la izquierda ayuda a entender que es un bloque activo */}
      <div className="absolute left-[-2rem] top-0 bottom-0 w-[2px] bg-carbon/5 transition-colors group-hover:bg-salvia/30 rounded-full" />
      {children}
    </div>
  );
};
