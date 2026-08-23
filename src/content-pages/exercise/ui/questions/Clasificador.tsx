import React, { useState, useMemo } from 'react';
import { KatexText } from '@/components/ui/KatexText';
import { useI18n } from '@/i18n';
import { useExerciseQuestion } from '../../hooks/useExerciseQuestion';
import { useSubcomponents } from '../../hooks/useSubcomponents';
import { ExerciseCard } from '../shared/ExerciseCard';
import { QuestionFeedback } from '../shared/QuestionFeedback';
import type { BucketDef, ItemDef, ErrorComunProps, ResolucionProps, BaseQuestionProps } from '../../types';

export interface ClasificadorProps extends BaseQuestionProps {
  /** Enunciado descriptivo de la clasificación */
  pregunta?: string;
  /** Categorías o contenedores destino */
  buckets: BucketDef[];
  /** Elementos a clasificar */
  items: ItemDef[];
}

const ClasificadorErrorComun: React.FC<ErrorComunProps> = () => null;
ClasificadorErrorComun.displayName = 'ClasificadorErrorComun';

const ClasificadorResolucion: React.FC<ResolucionProps> = () => null;
ClasificadorResolucion.displayName = 'ClasificadorResolucion';

type ClasificadorComponent = React.FC<ClasificadorProps> & {
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
 * Clasificador — Ejercicio de clasificación y agrupación lógica por arrastre (drag-and-drop).
 */
export const Clasificador: ClasificadorComponent = ({ id, pregunta, buckets = [], items = [], children }) => {
  const { t } = useI18n();

  const {
    isCompleted,
    isCorrect,
    hasFailed,
    userAnswer,
    isShaking,
    activeTab,
    setActiveTab,
    triggerShake,
    submitAnswer,
    tryAgain,
  } = useExerciseQuestion({ id, type: 'pregunta' });

  const { errorComunData, resolucionData, otherChildren } = useSubcomponents(children);

  const [placedItems, setPlacedItems] = useState<Record<string, string>>(
    (userAnswer as Record<string, string>) ?? {}
  );
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const shuffledItems = useMemo(() => shuffle(items ?? []), [items]);

  const handleDragStart = (_e: React.DragEvent<HTMLDivElement>, itemId: string) => {
    if (isCompleted) return;
    setDragItem(itemId);
  };

  const placeItem = (itemId: string, bucketId: string | null) => {
    if (isCompleted) return;
    setPlacedItems((prev) => {
      const next = { ...prev };
      if (bucketId === null) {
        delete next[itemId];
      } else {
        next[itemId] = bucketId;
      }
      return next;
    });
    setSelectedItem(null);
    setDragItem(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, bucketId: string | null) => {
    e.preventDefault();
    if (isCompleted || !dragItem) return;
    placeItem(dragItem, bucketId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const check = () => {
    if (isCompleted) return;

    const currentItems = items || [];
    if (Object.keys(placedItems).length !== currentItems.length) {
      triggerShake();
      return;
    }

    const allCorrect = currentItems.every((item) => placedItems[item.id] === item.bucketId);
    submitAnswer(allCorrect, placedItems);
  };

  const unplacedItems = shuffledItems.filter((item) => !placedItems[item.id]);
  const showResolutionBookmark = isCompleted && Boolean(resolucionData);
  const showBookmarks = Boolean(errorComunData || showResolutionBookmark);

  const safeBuckets = buckets || [];
  const safeItems = items || [];

  return (
    <ExerciseCard
      id={id}
      errorComunData={errorComunData}
      resolucionData={resolucionData}
      isCorrect={isCompleted}
      hasFailed={hasFailed}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      className={`group ${isCompleted ? 'bg-musgo/5 border-musgo/30' : ''}`}
    >
      <h4 className={`font-bold text-carbon mb-6 mt-2 text-lg z-30 relative leading-relaxed ${showBookmarks ? 'pr-20 sm:pr-28' : ''}`}>
        {isCompleted ? (
          <span className="text-musgo">❦ {t('exercise', 'classificationCompleted')}</span>
        ) : (
          <span>{pregunta || t('exercise', 'classifyElements')}</span>
        )}
      </h4>

      <div className={isShaking ? 'animate-shake' : ''}>
        {/* Zona de elementos sin clasificar */}
        {!isCompleted && unplacedItems.length > 0 && (
          <div
            className="mb-8 p-4 relative flex flex-col items-center border border-dashed border-carbon/20 bg-carbon/[0.02]"
            onDrop={(e) => handleDrop(e, null)}
            onDragOver={handleDragOver}
          >
            <div className="text-xs font-serif italic text-carbon/60 mb-3">
              {t('exercise', 'elementsToClassify')}
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {unplacedItems.map((item) => {
                const isSelected = selectedItem === item.id;
                return (
                  <div
                    key={item.id}
                    draggable
                    tabIndex={0}
                    role="button"
                    onClick={() => setSelectedItem(isSelected ? null : item.id)}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedItem(isSelected ? null : item.id)}
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    className={`px-3 py-1 bg-lienzo border cursor-grab active:cursor-grabbing transition-all ${
                      isSelected
                        ? 'border-carbon ring-2 ring-carbon shadow-md scale-105'
                        : 'border-carbon/40 hover:border-carbon/70'
                    } ${dragItem === item.id ? 'opacity-40' : 'opacity-100'}`}
                  >
                    <KatexText text={item.content} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Categorías / Contenedores */}
        <div
          className={`border-y-[3px] grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[1px] relative transition-colors duration-500 ${
            isCompleted ? 'border-musgo bg-musgo/30' : 'border-carbon/80 bg-carbon/30'
          }`}
        >
          {safeBuckets.map((bucket) => {
            const bucketItems = safeItems.filter((item) => placedItems[item.id] === bucket.id);

            return (
              <div
                key={bucket.id}
                onDrop={(e) => handleDrop(e, bucket.id)}
                onDragOver={handleDragOver}
                onClick={() => {
                  if (selectedItem) {
                    placeItem(selectedItem, bucket.id);
                  }
                }}
                className={`flex flex-col min-h-[160px] bg-lienzo transition-colors ${
                  selectedItem && !isCompleted ? 'cursor-pointer hover:bg-carbon/[0.04]' : ''
                }`}
              >
                <div
                  className={`py-3 text-center text-sm font-semibold ac-eyebrow border-b transition-colors ${
                    isCompleted ? 'text-musgo border-musgo/40' : 'text-carbon border-carbon/60'
                  }`}
                >
                  {bucket.title}
                  {selectedItem && !isCompleted && (
                    <span className="block text-[10px] font-normal text-carbon/50 mt-0.5">
                      (Tocar para colocar)
                    </span>
                  )}
                </div>

                <div
                  className={`flex-1 p-4 flex flex-col gap-2 relative items-center transition-colors ${
                    dragItem ? 'bg-carbon/[0.02]' : 'bg-transparent'
                  }`}
                >
                  {bucketItems.map((item) => {
                    const isWrong =
                      isCorrect === false && placedItems[item.id] && item.bucketId !== bucket.id;

                    let itemClass = 'border-carbon/40 cursor-grab active:cursor-grabbing hover:bg-carbon/[0.02]';
                    if (isCompleted) {
                      itemClass = 'border-musgo/40 bg-musgo/[0.02] text-musgo cursor-default';
                    } else if (isWrong) {
                      itemClass = 'border-terracota bg-terracota/[0.02] text-terracota';
                    }

                    return (
                      <div
                        key={item.id}
                        draggable={!isCompleted}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isCompleted) {
                            placeItem(item.id, null);
                          }
                        }}
                        title={!isCompleted ? 'Tocar o arrastrar para quitar' : undefined}
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        className={`px-3 py-1 bg-lienzo border transition-all ${itemClass} ${
                          dragItem === item.id ? 'opacity-40' : 'opacity-100'
                        }`}
                      >
                        <KatexText text={item.content} />
                        {!isCompleted && (
                          <span className="ml-2 text-carbon/40 hover:text-carbon text-xs font-sans">×</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {!isCompleted && (
          <div className="mt-8 flex justify-end border-carbon/10 pt-5">
            <button
              onClick={check}
              className="ac-btn ac-interactive page-accent-button px-6 py-3 text-xs border border-carbon/30 text-carbon transition-colors cursor-pointer"
            >
              {t('exercise', 'checkClassification')}
            </button>
          </div>
        )}
      </div>

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

Clasificador.ErrorComun = ClasificadorErrorComun;
Clasificador.Resolucion = ClasificadorResolucion;
