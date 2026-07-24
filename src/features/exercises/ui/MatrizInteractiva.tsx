import React, { useState, useEffect } from 'react';
import { useExercise } from '@/features/exercises/ui/ExerciseContext';

interface MatrizInteractivaProps {
  id: string;
  pregunta?: string;
  /**
   * Matriz correcta esperada. Ej:
   * correct={[
   *   ["1", "0", "0"],
   *   ["0", "1", "0"],
   *   ["0", "0", "1"]
   * ]}
   */
  correct: string[][];
}

function normalizeStr(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, '').replace(',', '.');
}

/**
 * Componente para ejercicios de Álgebra Lineal. Muestra una cuadrícula (matriz)
 * donde el usuario puede introducir valores numéricos o expresiones celda por celda.
 * Permite validación individual y general contra la matriz correcta provista.
 */
export const MatrizInteractiva: React.FC<MatrizInteractivaProps> = ({ id, pregunta, correct }) => {
  const { register, answer, state } = useExercise();
  const qState = state.questions[id];

  const rows = correct.length;
  const cols = correct[0]?.length || 0;

  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: rows }, () => Array(cols).fill(''))
  );
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    register(id, 'matriz');
  }, [id, register]);

  const isCompleted = qState?.isCorrect === true;

  const handleCellChange = (r: number, c: number, val: string) => {
    if (isCompleted) return;
    const newGrid = [...grid];
    newGrid[r] = [...newGrid[r]];
    newGrid[r][c] = val;
    setGrid(newGrid);
  };

  const check = () => {
    if (isCompleted) return;

    let isAllCorrect = true;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (normalizeStr(grid[r][c]) !== normalizeStr(correct[r][c])) {
          isAllCorrect = false;
          break;
        }
      }
      if (!isAllCorrect) break;
    }

    answer(id, isAllCorrect);
    
    if (!isAllCorrect) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
    }
  };

  return (
    <div className={`my-8 p-8 font-serif elegant-panel relative transition-all duration-500 ${isCompleted ? 'bg-salvia/5 border-salvia/30' : ''}`} style={{ '--hover-accent': isCompleted ? 'var(--theme-salvia)' : 'var(--page-accent)' } as React.CSSProperties}>
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
      
      {pregunta && (
        <p className="text-base font-bold text-carbon mb-6 leading-relaxed flex items-center gap-2 relative z-30">
          {isCompleted && <span className="text-salvia">❦</span>}
          {pregunta}
        </p>
      )}

      <div className={`flex flex-col items-center gap-4 ${isShaking ? 'animate-shake' : ''}`}>
        
        {/* Renderizado de la matriz con corchetes */}
        <div className="relative flex items-center">
          {/* Corchete Izquierdo */}
          <div className={`border-l-2 border-y-2 w-3 absolute left-0 top-0 bottom-0 transition-colors ${isCompleted ? 'border-salvia' : 'border-carbon/70'}`} />
          
          <div className="grid gap-2 p-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {grid.map((row, r) =>
              row.map((val, c) => {
                return (
                  <input
                    key={`${r}-${c}`}
                    type="text"
                    value={isCompleted ? correct[r][c] : val}
                    onChange={e => handleCellChange(r, c, e.target.value)}
                    className={`w-14 h-12 text-center text-lg font-serif outline-none transition-all ${
                      isCompleted 
                        ? 'bg-transparent text-salvia font-bold border-none' 
                        : 'page-accent-focus bg-lienzo border-b-2 border-dashed border-carbon/40 text-carbon'
                    }`}
                  />
                );
              })
            )}
          </div>

          {/* Corchete Derecho */}
          <div className={`border-r-2 border-y-2 w-3 absolute right-0 top-0 bottom-0 transition-colors ${isCompleted ? 'border-salvia' : 'border-carbon/70'}`} />
        </div>

        {!isCompleted && (
          <button
            onClick={check}
            className="ac-btn ac-interactive page-accent-button mt-4 px-6 py-3 text-xs border border-carbon/30 text-carbon shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            Comprobar Matriz
          </button>
        )}
      </div>
    </div>
  );
};
