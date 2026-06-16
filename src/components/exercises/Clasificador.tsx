import React, { useState, useEffect, useMemo } from 'react';
import { useExercise } from './ExerciseContext';
import { KatexText } from '../ui/KatexText';

interface BucketDef {
  id: string;
  title: string;
}

interface ItemDef {
  id: string;
  content: string;
  bucketId: string;
}

interface ClasificadorProps {
  id: string;
  pregunta?: string;
  buckets: BucketDef[];
  items: ItemDef[];
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
 * Un componente donde el estudiante arrastra "etiquetas" matemáticas a diferentes "cubos" (categorías).
 * Por ejemplo: Arrastrar ecuaciones a "Lineales" o "Cuadráticas".
 */
export const Clasificador: React.FC<ClasificadorProps> = ({ id, pregunta, buckets, items }) => {
  const { register, answer, state } = useExercise();
  const qState = state.questions[id];

  const [placedItems, setPlacedItems] = useState<Record<string, string>>({}); // itemId -> bucketId
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Mezclar los ítems en el montaje
  const shuffledItems = useMemo(() => shuffle(items), [items]);

  useEffect(() => {
    register(id, 'pregunta'); // Usamos 'pregunta' genérico
  }, [id, register]);

  const isCompleted = qState?.isCorrect === true;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemId: string) => {
    if (isCompleted) return;
    setDragItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, bucketId: string | null) => {
    e.preventDefault();
    if (isCompleted || !dragItem) return;

    setPlacedItems(prev => {
      const newPlaced = { ...prev };
      if (bucketId === null) {
        delete newPlaced[dragItem];
      } else {
        newPlaced[dragItem] = bucketId;
      }
      return newPlaced;
    });
    setDragItem(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const check = () => {
    if (isCompleted) return;

    // Verificar si todos están colocados
    if (Object.keys(placedItems).length !== items.length) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      return;
    }

    let allCorrect = true;
    for (const item of items) {
      if (placedItems[item.id] !== item.bucketId) {
        allCorrect = false;
        break;
      }
    }

    answer(id, allCorrect);
    
    if (!allCorrect) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
    }
  };

  // Ítems que aún no tienen cubo (bucketId === null)
  const unplacedItems = shuffledItems.filter(item => !placedItems[item.id]);

  return (
    <div className={`my-8 p-8 elegant-panel relative font-serif group ${isCompleted ? 'bg-salvia/5 border-salvia/30' : ''}`} style={{ '--hover-accent': isCompleted ? 'var(--theme-salvia)' : 'var(--theme-carbon)' } as React.CSSProperties}>
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
        {isCompleted ? <span className="text-salvia">❦ Clasificación Completada</span> : <span>{pregunta || 'Clasifica los siguientes elementos:'}</span>}
      </h4>

      <div className={`${isShaking ? 'animate-shake' : ''}`}>
        
        {/* Zona de Ítems sin asignar */}
        {!isCompleted && unplacedItems.length > 0 && (
          <div 
            className="mb-8 p-4 relative flex flex-col items-center"
            onDrop={(e) => handleDrop(e, null)}
            onDragOver={handleDragOver}
          >
            <div className="text-xs font-serif italic text-carbon/60 mb-3">
              Elementos a clasificar:
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {unplacedItems.map(item => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  className={`px-3 py-1 bg-lienzo border border-carbon/40 cursor-grab active:cursor-grabbing transition-opacity ${dragItem === item.id ? 'opacity-40' : 'opacity-100'}`}
                >
                  <KatexText text={item.content} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cubos (Categorías) - Estilo Tabla Clásica (Escalable) */}
        <div className={`border-y-[3px] grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[1px] relative transition-colors duration-500 ${isCompleted ? 'border-salvia bg-salvia/30' : 'border-carbon/80 bg-carbon/30'}`}>
          {buckets.map((bucket) => {
            const bucketItems = items.filter(item => placedItems[item.id] === bucket.id);

            return (
              <div 
                key={bucket.id}
                onDrop={(e) => handleDrop(e, bucket.id)}
                onDragOver={handleDragOver}
                className="flex flex-col min-h-[160px] bg-lienzo"
              >
                {/* Cabecera del Cubo */}
                <div className={`py-3 text-center text-sm font-bold uppercase tracking-widest font-sans border-b transition-colors ${isCompleted ? 'text-salvia border-salvia/40' : 'text-carbon border-carbon/60'}`}>
                  {bucket.title}
                </div>

                {/* Zona de caída */}
                <div className={`flex-1 p-4 flex flex-col gap-2 relative items-center transition-colors ${dragItem ? 'bg-carbon/[0.02]' : 'bg-transparent'}`}>
                  {bucketItems.map(item => {
                    const isWrong = qState?.isCorrect === false && placedItems[item.id] && item.bucketId !== bucket.id;
                    
                    return (
                      <div
                        key={item.id}
                        draggable={!isCompleted}
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        className={`px-3 py-1 bg-lienzo border transition-colors ${
                          isCompleted ? 'border-salvia/40 bg-salvia/[0.02] text-salvia cursor-default' : 
                          isWrong ? 'border-terracota bg-terracota/[0.02] text-terracota' :
                          'border-carbon/40 cursor-grab active:cursor-grabbing hover:bg-carbon/[0.02]'
                        } ${dragItem === item.id ? 'opacity-40' : 'opacity-100'}`}
                      >
                        <KatexText text={item.content} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {!isCompleted && (
          <div className="mt-8 flex justify-end border-t border-carbon/10 pt-5">
            <button
              onClick={check}
              className="px-6 py-3 text-xs font-sans uppercase tracking-widest border border-carbon/30 text-carbon hover:border-carbon hover:bg-carbon/[0.02] transition-colors"
            >
              Comprobar Clasificación
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
