import React, { useEffect } from 'react';
import { useExercise } from './ExerciseContext';

interface CanvasInteractivoProps {
  id: string;
  title?: string;
  children: React.ReactElement; // El componente hijo específico del diagrama
}

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
  const childWithProps = React.cloneElement(children as React.ReactElement<any>, {
    onComplete: handleComplete,
    isCompleted
  });

  return (
    <div className="my-8 font-sans">
      <div className={`p-1 rounded-lg transition-colors duration-500 ${isCompleted ? 'bg-[#2a6a2a]' : 'bg-carbon/10'}`}>
        <div className="bg-lienzo rounded-md p-6">
          <h4 className="font-bold text-carbon mb-4 flex items-center justify-between">
            <span>{title || 'Lienzo Interactivo'}</span>
            {isCompleted && <span className="text-[#2a6a2a] text-sm">✓ Objetivo cumplido</span>}
          </h4>
          <div className="relative">
            {childWithProps}
            
            {/* Overlay if completed to prevent further interaction, optional */}
            {isCompleted && (
              <div className="absolute inset-0 z-50 pointer-events-none border-4 border-[#2a6a2a]/20 rounded-lg"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
