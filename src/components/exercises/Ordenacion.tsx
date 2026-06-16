import React, { useState, useEffect } from 'react';
import { useExercise } from './ExerciseContext';
import { KatexText } from '../ui/KatexText';

interface OrdenacionProps {
  id: string;
  pasos: string[]; // Los pasos en el orden correcto
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Componente que permite al estudiante ordenar lógicamente una serie de pasos matemáticos.
 * Utiliza un array de strings (pasos) que internamente se desordenan.
 * El estudiante usa botones (drag and drop en este caso) para subir o bajar el orden de cada paso.
 */
export const Ordenacion: React.FC<OrdenacionProps> = ({ id, pasos }) => {
  const { register, answer, state } = useExercise();
  const qState = state.questions[id];

  const [currentOrder, setCurrentOrder] = useState<string[]>([]);
  const [isShaking, setIsShaking] = useState(false);
  const [dragItemIndex, setDragItemIndex] = useState<number | null>(null);

  useEffect(() => {
    register(id, 'ordenacion');
    if (pasos.length > 0) {
      let shuffled = shuffle(pasos);
      while (pasos.length > 1 && JSON.stringify(shuffled) === JSON.stringify(pasos)) {
        shuffled = shuffle(pasos);
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentOrder(shuffled);
    }
  }, [id, register, pasos]); 

  const isCompleted = qState?.isCorrect === true;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (isCompleted) return;
    setDragItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Fix for Firefox: data must be set to drag
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragEnter = (_e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (isCompleted || dragItemIndex === null || dragItemIndex === index) return;
    const newOrder = [...currentOrder];
    const draggedItem = newOrder[dragItemIndex];
    newOrder.splice(dragItemIndex, 1);
    newOrder.splice(index, 0, draggedItem);
    
    setDragItemIndex(index);
    setCurrentOrder(newOrder);
  };

  const handleDragEnd = () => {
    setDragItemIndex(null);
  };

  const checkOrder = () => {
    if (isCompleted) return;
    const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(pasos);
    answer(id, isCorrect);
    if (!isCorrect) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
    }
  };

  if (currentOrder.length === 0) return null;

  return (
    <div className="my-8 font-serif">
      <div 
        className={`p-8 elegant-panel relative group ${isCompleted ? 'bg-salvia/5 border-salvia/30' : ''}`}
        style={{ '--hover-accent': isCompleted ? 'var(--theme-salvia)' : 'var(--theme-carbon)' } as React.CSSProperties}
      >
         <style>
          {`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-4px); }
              75% { transform: translateX(4px); }
            }
            .animate-shake { animation: shake 0.4s ease-in-out; }
          `}
        </style>
        <h4 className="font-bold text-carbon mb-6 mt-2 flex items-center gap-3 text-lg z-30 relative">
          {isCompleted ? <span className="text-salvia">❦ Ordenación Completada</span> : <span>Ordena los pasos de la demostración lógica</span>}
        </h4>

        <div className={`flex flex-col gap-3 ${isShaking ? 'animate-shake' : ''}`}>
          {currentOrder.map((paso, index) => {
            const isDragging = dragItemIndex === index;

            return (
              <div 
                  key={paso} 
                  draggable={!isCompleted}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className={`flex items-center gap-4 bg-lienzo border border-carbon/20 p-4 rounded-none transition-all duration-300 ${
                    isCompleted ? 'border-salvia/40 bg-salvia/10 cursor-default' : 'hover:border-carbon/50 hover:shadow-md hover:-translate-y-0.5 cursor-grab active:cursor-grabbing shadow-sm'
                  } ${isDragging ? 'opacity-40 scale-[0.98] border-dashed border-carbon/40' : 'opacity-100'}`}
                >
                {/* Agarre Drag */}
                {!isCompleted && (
                  <div className="shrink-0 text-carbon/30 flex flex-col gap-0.5 px-1 py-2" title="Arrastrar">
                    <div className="w-1 h-1 bg-current rounded-full" />
                    <div className="w-1 h-1 bg-current rounded-full" />
                    <div className="w-1 h-1 bg-current rounded-full" />
                  </div>
                )}
                
                {/* Número fijo (para mostrar el slot) */}
                <div className="w-6 h-6 shrink-0 border border-carbon/20 rounded-full flex items-center justify-center text-xs font-mono text-carbon/60 bg-[#F8F6F1]">
                  {index + 1}
                </div>

                {/* Contenido (El paso en sí) */}
                <div className="flex-1 text-[15px] text-carbon pointer-events-none">
                  <KatexText text={paso} />
                </div>
              </div>
            );
          })}
        </div>

        {!isCompleted && (
          <div className="mt-6 flex justify-end border-t border-carbon/10 pt-5">
            <button
              onClick={checkOrder}
              className="px-6 py-3 text-xs font-sans uppercase tracking-widest border border-carbon/30 text-carbon hover:border-carbon hover:bg-carbon/[0.02] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              Comprobar Orden
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
