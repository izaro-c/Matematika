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
 * Clasificador.tsx
 * 
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
    <div className={`my-8 border border-carbon/15 p-6 shadow-sm transition-all duration-500 font-serif ${isCompleted ? 'bg-[#f0faf0]/50 border-[#2a6a2a]/30' : 'bg-[#fdfbf7]'}`}>
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
      
      <h4 className="font-bold text-carbon mb-6 flex items-center gap-3 text-lg">
        {isCompleted ? <span className="text-[#2a6a2a]">❦ Clasificación Completada</span> : <span>{pregunta || 'Clasifica los siguientes elementos:'}</span>}
      </h4>

      <div className={`${isShaking ? 'animate-shake' : ''}`}>
        
        {/* Zona de Ítems sin asignar */}
        {!isCompleted && unplacedItems.length > 0 && (
          <div 
            className="mb-8 p-4 bg-carbon/[0.03] border border-carbon/10 border-dashed rounded-sm min-h-[80px]"
            onDrop={(e) => handleDrop(e, null)}
            onDragOver={handleDragOver}
          >
            <div className="text-xs uppercase tracking-widest font-sans text-carbon/40 mb-3 text-center">Arrastra las etiquetas a las categorías</div>
            <div className="flex flex-wrap gap-3 justify-center">
              {unplacedItems.map(item => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  className={`px-4 py-2 bg-white border border-carbon/20 shadow-sm cursor-grab active:cursor-grabbing hover:border-carbon/50 transition-all ${dragItem === item.id ? 'opacity-40' : 'opacity-100'}`}
                >
                  <KatexText text={item.content} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cubos (Categorías) */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))` }}>
          {buckets.map(bucket => {
            const bucketItems = items.filter(item => placedItems[item.id] === bucket.id);

            return (
              <div 
                key={bucket.id}
                onDrop={(e) => handleDrop(e, bucket.id)}
                onDragOver={handleDragOver}
                className={`flex flex-col bg-white border border-carbon/15 rounded-sm overflow-hidden transition-all duration-300 min-h-[160px] ${isCompleted ? 'border-[#2a6a2a]/30' : 'hover:border-carbon/30'}`}
              >
                {/* Cabecera del Cubo */}
                <div className={`p-3 text-center text-sm font-bold uppercase tracking-widest font-sans border-b ${isCompleted ? 'bg-[#2a6a2a]/5 text-[#2a6a2a] border-[#2a6a2a]/20' : 'bg-carbon/5 text-carbon/70 border-carbon/10'}`}>
                  {bucket.title}
                </div>

                {/* Zona de caída */}
                <div className="flex-1 p-4 flex flex-col gap-2 relative bg-carbon/[0.01]">
                  {bucketItems.map(item => {
                    const isWrong = qState?.isCorrect === false && placedItems[item.id] && item.bucketId !== bucket.id;
                    
                    return (
                      <div
                        key={item.id}
                        draggable={!isCompleted}
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        className={`px-3 py-2 bg-white border shadow-sm text-center transition-all ${
                          isCompleted ? 'border-[#2a6a2a]/40 text-[#1a4a1a]' : 
                          isWrong ? 'border-terracota/60 text-terracota' :
                          'border-carbon/20 cursor-grab active:cursor-grabbing hover:border-carbon/50'
                        } ${dragItem === item.id ? 'opacity-40' : 'opacity-100'}`}
                      >
                        <KatexText text={item.content} />
                      </div>
                    );
                  })}
                  {!isCompleted && bucketItems.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-carbon/20 italic font-serif">
                      Suelta aquí...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {!isCompleted && (
          <div className="mt-8 flex justify-end border-t border-carbon/10 pt-5">
            <button
              onClick={check}
              className="px-6 py-2 text-xs font-sans uppercase tracking-widest border border-carbon/40 text-carbon/80 hover:border-carbon hover:text-carbon hover:bg-carbon/5 transition-all shadow-sm"
            >
              Comprobar Clasificación
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
