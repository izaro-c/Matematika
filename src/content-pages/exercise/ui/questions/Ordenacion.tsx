import React, { useState, useEffect, useMemo } from 'react';
import { KatexText } from '@/components/ui/KatexText';
import { useI18n } from '@/i18n';
import { useExerciseQuestion } from '../../hooks/useExerciseQuestion';
import { useSubcomponents } from '../../hooks/useSubcomponents';
import { ExerciseCard } from '../shared/ExerciseCard';
import { QuestionFeedback } from '../shared/QuestionFeedback';
import type { ErrorComunProps, ResolucionProps, BaseQuestionProps } from '../../types';

export interface OrdenacionProps extends BaseQuestionProps {
  /** Enunciado opcional */
  pregunta?: string;
  /** Pasos en el orden canónico correcto */
  pasos: string[];
}

const OrdenacionErrorComun: React.FC<ErrorComunProps> = () => null;
OrdenacionErrorComun.displayName = 'OrdenacionErrorComun';

const OrdenacionResolucion: React.FC<ResolucionProps> = () => null;
OrdenacionResolucion.displayName = 'OrdenacionResolucion';

type OrdenacionComponent = React.FC<OrdenacionProps> & {
  ErrorComun: React.FC<ErrorComunProps>;
  Resolucion: React.FC<ResolucionProps>;
};

function shuffle<T>(array: T[]): T[] {
  if (!array || !Array.isArray(array)) return [];
  const arr = [...array];
  const buf = new Uint32Array(arr.length);
  crypto.getRandomValues(buf);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = buf[i] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Ordenacion — Ejercicio interactivo para ordenar secuencialmente deducciones o pasos matemáticos.
 */
export const Ordenacion: OrdenacionComponent = ({ id, pregunta, pasos = [], children }) => {
  const { t } = useI18n();

  const {
    isCompleted,
    hasFailed,
    isShaking,
    activeTab,
    setActiveTab,
    submitAnswer,
    tryAgain,
  } = useExerciseQuestion({ id, type: 'ordenacion' });

  const { errorComunData, resolucionData, otherChildren } = useSubcomponents(children);

  const initialOrder = useMemo(() => {
    if (!pasos || !Array.isArray(pasos) || pasos.length <= 1) return pasos ?? [];
    let shuffled = shuffle(pasos);
    let attempts = 0;
    while (JSON.stringify(shuffled) === JSON.stringify(pasos) && attempts < 10) {
      shuffled = shuffle(pasos);
      attempts++;
    }
    return shuffled;
  }, [pasos]);

  const [currentOrder, setCurrentOrder] = useState<string[]>(initialOrder);
  const [dragItemIndex, setDragItemIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isCompleted) {
      setCurrentOrder(pasos);
    }
  }, [isCompleted, pasos]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (isCompleted) return;
    setDragItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
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

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (isCompleted || toIndex < 0 || toIndex >= currentOrder.length) return;
    const newOrder = [...currentOrder];
    const item = newOrder[fromIndex];
    newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, item);
    setCurrentOrder(newOrder);
  };

  const checkOrder = () => {
    if (isCompleted) return;
    const isSuccess = JSON.stringify(currentOrder) === JSON.stringify(pasos);
    submitAnswer(isSuccess, currentOrder);
  };

  if (currentOrder.length === 0) return null;

  const showResolutionBookmark = isCompleted && Boolean(resolucionData);
  const showBookmarks = Boolean(errorComunData || showResolutionBookmark);

  return (
    <ExerciseCard
      id={id}
      errorComunData={errorComunData}
      resolucionData={resolucionData}
      isCorrect={isCompleted}
      hasFailed={hasFailed}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      className={isCompleted ? 'bg-canela/5 border-canela/30' : ''}
    >
      <h4 className={`font-bold text-carbon mb-6 mt-2 text-lg z-30 relative leading-relaxed ${showBookmarks ? 'pr-20 sm:pr-28' : ''}`}>
        {isCompleted ? (
          <span className="text-canela">❦ {t('exercise', 'sortingCompleted')}</span>
        ) : (
          <span>{pregunta || t('exercise', 'sortSteps')}</span>
        )}
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
              className={`flex items-center gap-3 sm:gap-4 bg-lienzo border border-carbon/20 p-3 sm:p-4 rounded-none transition-all duration-300 ${
                isCompleted
                  ? 'border-canela/40 bg-canela/10 cursor-default'
                  : 'page-accent-button hover:shadow-md hover:-translate-y-0.5 cursor-grab active:cursor-grabbing shadow-sm'
              } ${isDragging ? 'opacity-40 scale-[0.98] border-dashed border-carbon/40' : 'opacity-100'}`}
            >
              {!isCompleted && (
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveItem(index, index - 1)}
                    aria-label="Mover arriba"
                    className="w-5 h-5 flex items-center justify-center text-[10px] text-carbon/40 hover:text-carbon disabled:opacity-20 cursor-pointer disabled:cursor-default"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={index === currentOrder.length - 1}
                    onClick={() => moveItem(index, index + 1)}
                    aria-label="Mover abajo"
                    className="w-5 h-5 flex items-center justify-center text-[10px] text-carbon/40 hover:text-carbon disabled:opacity-20 cursor-pointer disabled:cursor-default"
                  >
                    ▼
                  </button>
                </div>
              )}

              <div className="w-6 h-6 shrink-0 border border-carbon/20 rounded-full flex items-center justify-center text-xs font-mono text-carbon/60 bg-lienzo">
                {index + 1}
              </div>

              <div className="flex-1 text-[15px] text-carbon">
                <KatexText text={paso} />
              </div>
            </div>
          );
        })}
      </div>

      {!isCompleted && (
        <div className="mt-6 flex justify-end border-carbon/10 pt-5">
          <button
            onClick={checkOrder}
            className="ac-btn ac-interactive page-accent-button px-6 py-3 text-xs border border-carbon/30 text-carbon transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          >
            {t('exercise', 'checkOrder')}
          </button>
        </div>
      )}

      <QuestionFeedback
        hasFailed={hasFailed}
        isSuccess={isCompleted}
        errorComunData={errorComunData}
        resolucionData={resolucionData}
        onTryAgain={tryAgain}
        onOpenError={() => setActiveTab('error')}
        onOpenResolucion={() => setActiveTab('resolucion')}
      />

      {otherChildren.length > 0 && <div className="mt-4">{otherChildren}</div>}
    </ExerciseCard>
  );
};

Ordenacion.ErrorComun = OrdenacionErrorComun;
Ordenacion.Resolucion = OrdenacionResolucion;
