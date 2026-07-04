import React, { useEffect } from 'react';
import { useExercise } from '@/features/exercises/ui/ExerciseContext';

/**
 * Propiedades del Canvas Interactivo
 */
interface CanvasInteractivoProps {
  /** ID del ejercicio dentro del contexto */
  id: string;
  title?: string;
  children: React.ReactElement; // El componente hijo específico del diagrama
}

/**
 * Envoltorio (Wrapper) para ejercicios interactivos visuales (ej. gráficos JXG o Three.js).
 * Se encarga de inyectar las propiedades `onComplete` y `isCompleted` al hijo 
 * para poder enganchar componentes interactivos genéricos al `ExerciseContext`.
 */
export const CanvasInteractivo: React.FC<CanvasInteractivoProps> = ({ id, title, children }) => {
  const { register, answer, state } = useExercise();
  const qState = state.questions[id];

  useEffect(() => {
    register(id, 'canvas');
  }, [id, register]);

  const handleComplete = () => {
    answer(id, true);
  };

  const isCompleted = qState?.isCorrect === true;

  // Clonar el hijo para inyectarle el callback onComplete y el estado isCompleted
  const childWithProps = React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
    onComplete: handleComplete,
    isCompleted
  });

  return (
    <div className={`my-8 font-serif elegant-panel p-8 ${isCompleted ? 'bg-salvia/5 border-salvia/30' : ''}`} style={{ '--hover-accent': isCompleted ? 'var(--theme-salvia)' : 'var(--page-accent)' } as React.CSSProperties}>
      <h4 className="font-bold text-carbon mb-6 flex items-center justify-between z-30 relative text-lg">
        <span>{title || 'Lienzo Interactivo'}</span>
        {isCompleted && <span className="text-salvia font-serif text-base">❦ Objetivo cumplido</span>}
      </h4>
          <div className="relative">
            {childWithProps}
            
            {/* Overlay if completed to prevent further interaction, optional */}
            {isCompleted && (
              <div className="absolute inset-0 z-50 pointer-events-none border-2 border-salvia/20 rounded-none bg-salvia/[0.02]"></div>
            )}
          </div>
    </div>
  );
};
