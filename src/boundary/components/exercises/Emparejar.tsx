import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useExercise } from '@/boundary/components/exercises/ExerciseContext';
import { KatexText } from '@/boundary/components/ui/KatexText';

interface Pair {
  left: string;
  right: string;
}

/**
 * Propiedades de Emparejar
 */
interface EmparejarProps {
  id: string;
  pairs: Pair[];
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
 * Componente interactivo para ejercicios de emparejamiento lógico.
 *
 * Renderiza dos columnas de elementos. El usuario debe vincular pares de conceptos
 * (ej. 'Concepto' -> 'Definición') haciendo clic en ambos lados, y se dibujan
 * curvas SVG Bézier entre las opciones seleccionadas.
 * 
 * Baraja el lado derecho al azar y comunica el éxito al `ExerciseContext`.
 * 
 * Uso en MDX:
 * <Emparejar id="emp1" pairs={[ { left: 'A', right: 'B' } ]} />
 */
export const Emparejar: React.FC<EmparejarProps> = ({ id, pairs }) => {
  const { register, answer, state } = useExercise();
  const qState = state.questions[id];

  useEffect(() => {
    register(id, 'emparejar');
  }, [id, register]);

  const leftItems = useMemo(() => shuffle(pairs.map(p => p.left)), [pairs]);
  const rightItems = useMemo(() => shuffle(pairs.map(p => p.right)), [pairs]);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [errorPair, setErrorPair] = useState<[string, string] | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [lines, setLines] = useState<Array<{x1: number, y1: number, x2: number, y2: number, isMatched: boolean}>>([]);

  const updateLines = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines = [];

    // Dibujar líneas emparejadas
    for (const leftVal of matchedPairs) {
      const rightVal = pairs.find(p => p.left === leftVal)?.right;
      if (rightVal && leftRefs.current[leftVal] && rightRefs.current[rightVal]) {
        const lRect = leftRefs.current[leftVal]!.getBoundingClientRect();
        const rRect = rightRefs.current[rightVal]!.getBoundingClientRect();
        
        newLines.push({
          x1: lRect.right - containerRect.left,
          y1: lRect.top + lRect.height / 2 - containerRect.top,
          x2: rRect.left - containerRect.left,
          y2: rRect.top + rRect.height / 2 - containerRect.top,
          isMatched: true
        });
      }
    }

    // Dibujar línea temporal (si hay un seleccionado izq y der, o solo uno)
    // Para simplificar, solo dibujaremos la de error temporal
    if (errorPair && leftRefs.current[errorPair[0]] && rightRefs.current[errorPair[1]]) {
      const lRect = leftRefs.current[errorPair[0]]!.getBoundingClientRect();
      const rRect = rightRefs.current[errorPair[1]]!.getBoundingClientRect();
      newLines.push({
        x1: lRect.right - containerRect.left,
        y1: lRect.top + lRect.height / 2 - containerRect.top,
        x2: rRect.left - containerRect.left,
        y2: rRect.top + rRect.height / 2 - containerRect.top,
        isMatched: false
      });
    }

    setLines(newLines);
  };

  useEffect(() => {
    updateLines();
    window.addEventListener('resize', updateLines);
    return () => window.removeEventListener('resize', updateLines);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedPairs, errorPair, selectedLeft, selectedRight]);

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      const isMatch = pairs.some(p => p.left === selectedLeft && p.right === selectedRight);
      
      if (isMatch) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMatchedPairs(prev => [...prev, selectedLeft]);
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        setErrorPair([selectedLeft, selectedRight]);
        answer(id, false);
        
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setErrorPair(null);
        }, 800);
      }
    }
  }, [selectedLeft, selectedRight, pairs, id, answer]);

  useEffect(() => {
    if (matchedPairs.length === pairs.length && pairs.length > 0) {
      answer(id, true);
    }
  }, [matchedPairs.length, pairs.length, id, answer]);

  useEffect(() => {
    if (qState?.isCorrect === null && matchedPairs.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMatchedPairs([]);
      setSelectedLeft(null);
      setSelectedRight(null);
      setErrorPair(null);
    }
  }, [qState?.isCorrect, matchedPairs.length]);

  const isCompleted = qState?.isCorrect === true;

  return (
    <div className="my-8 font-serif">
      <div 
        className={`p-8 elegant-panel relative group ${isCompleted ? 'bg-salvia/5 border-salvia/30' : ''}`}
        style={{ '--hover-accent': isCompleted ? 'var(--theme-salvia)' : 'var(--theme-carbon)' } as React.CSSProperties}
      >
        <h4 className="font-bold text-carbon mb-8 mt-2 flex items-center gap-3 text-lg z-30 relative">
          {isCompleted ? <span className="text-salvia">❦ Completado</span> : <span>Une los conceptos correspondientes</span>}
        </h4>

        <div className="relative flex gap-16" ref={containerRef}>
          {/* SVG Overlay para las líneas */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
            {lines.map((line, i) => {
              // Curva Bezier para la línea
              const cx1 = line.x1 + 40;
              const cy1 = line.y1;
              const cx2 = line.x2 - 40;
              const cy2 = line.y2;
              
              return (
                <path
                  key={i}
                  d={`M ${line.x1} ${line.y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${line.x2} ${line.y2}`}
                  fill="none"
                  stroke={line.isMatched ? "var(--theme-salvia)" : "var(--theme-terracota)"}
                  strokeWidth={line.isMatched ? "2" : "2"}
                  strokeDasharray={line.isMatched ? "none" : "4 4"}
                  className="transition-all duration-300 drop-shadow-sm"
                />
              );
            })}
          </svg>

          {/* Columna Izquierda */}
          <div className="flex-1 flex flex-col gap-4 z-20">
            {leftItems.map(item => {
              const isMatched = matchedPairs.includes(item);
              const isSelected = selectedLeft === item;
              const isError = errorPair && errorPair[0] === item;

              let btnClass = "px-5 py-4 border rounded-none text-left transition-all duration-300 relative ";
              if (isMatched) btnClass += "bg-salvia/10 border-salvia/40 text-salvia cursor-default shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]";
              else if (isError) btnClass += "bg-terracota/5 border-terracota/60 text-terracota animate-shake";
              else if (isSelected) btnClass += "bg-carbon/10 border-carbon text-carbon transform scale-[1.02] shadow-md z-30";
              else btnClass += "bg-transparent border-carbon/20 hover:border-carbon/50 hover:bg-carbon/[0.02] cursor-pointer text-carbon hover:-translate-y-0.5 hover:shadow-sm";

              return (
                <button
                  key={item}
                  ref={el => { leftRefs.current[item] = el; }}
                  disabled={isMatched || isCompleted}
                  onClick={() => !isSelected ? setSelectedLeft(item) : setSelectedLeft(null)}
                  className={btnClass}
                >
                  <KatexText text={item} />
                  {/* Conector */}
                  <div className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full border-2 ${isMatched ? 'border-salvia bg-lienzo' : isSelected ? 'border-carbon bg-carbon' : 'border-carbon/30 bg-lienzo'}`} />
                </button>
              );
            })}
          </div>

          {/* Columna Derecha */}
          <div className="flex-1 flex flex-col gap-4 z-20">
            {rightItems.map(item => {
              const itsLeftPair = pairs.find(p => p.right === item)?.left;
              const isMatched = itsLeftPair && matchedPairs.includes(itsLeftPair);
              const isSelected = selectedRight === item;
              const isError = errorPair && errorPair[1] === item;

              let btnClass = "px-5 py-4 border rounded-none text-left transition-all duration-300 relative ";
              if (isMatched) btnClass += "bg-salvia/10 border-salvia/40 text-salvia cursor-default shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]";
              else if (isError) btnClass += "bg-terracota/5 border-terracota/60 text-terracota animate-shake";
              else if (isSelected) btnClass += "bg-carbon/10 border-carbon text-carbon transform scale-[1.02] shadow-md z-30";
              else btnClass += "bg-transparent border-carbon/20 hover:border-carbon/50 hover:bg-carbon/[0.02] cursor-pointer text-carbon hover:-translate-y-0.5 hover:shadow-sm";

              return (
                <button
                  key={item}
                  ref={el => { rightRefs.current[item] = el; }}
                  disabled={isMatched || isCompleted}
                  onClick={() => !isSelected ? setSelectedRight(item) : setSelectedRight(null)}
                  className={btnClass}
                >
                  {/* Conector */}
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 ${isMatched ? 'border-salvia bg-lienzo' : isSelected ? 'border-carbon bg-carbon' : 'border-carbon/30 bg-lienzo'}`} />
                  <KatexText text={item} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
