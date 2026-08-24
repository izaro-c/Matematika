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
      className={`group`}
      pregunta={pregunta}
    >

      <div className={isShaking ? 'animate-shake' : ''}>
  {/* ========================================================= */}
  {/* 1. BANDEJA DE TIPOS SUELTOS (Elementos sin clasificar)    */}
  {/* ========================================================= */}
  {!isCompleted && unplacedItems.length > 0 && (
    <div
      className="mb-8 p-4 relative border-2 border-carbon/30 bg-carbon/[0.015] shadow-[inset_0_0_0_1px_rgba(40,30,20,0.06)]"
      onDrop={(e) => handleDrop(e, null)}
      onDragOver={handleDragOver}
    >
      {/* Encabezado editorial con filetes laterales */}
      <div className="flex items-center justify-center gap-3 mb-4 select-none">
        <span className="h-[1px] w-8 sm:w-16 bg-carbon/25" />
        <span className="text-[11px] font-serif uppercase tracking-[0.2em] font-semibold text-carbon/70">
          {t('exercise', 'elementsToClassify')}
        </span>
        <span className="h-[1px] w-8 sm:w-16 bg-carbon/25" />
      </div>

      {/* Rejilla de tipos móviles disponibles */}
      <div className="flex flex-wrap gap-2.5 justify-center items-center">
        {unplacedItems.map((item) => {
          const isSelected = selectedItem === item.id;
          const isDragging = dragItem === item.id;

          return (
            <div
              key={item.id}
              draggable
              tabIndex={0}
              role="button"
              onClick={() => setSelectedItem(isSelected ? null : item.id)}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedItem(isSelected ? null : item.id)}
              onDragStart={(e) => handleDragStart(e, item.id)}
              className={`group relative px-3.5 py-1.5 bg-lienzo border rounded-[1px] font-serif text-sm select-none transition-all duration-150 ${
                isSelected
                  ? 'border-carbon text-carbon -translate-y-0.5 shadow-[2px_3px_0px_rgba(40,30,20,0.45)] ring-1 ring-carbon/80'
                  : 'border-carbon/40 text-carbon/90 shadow-[1px_1.5px_0px_rgba(40,30,20,0.18)] hover:border-carbon/80 hover:-translate-y-[1px] hover:shadow-[1.5px_2px_0px_rgba(40,30,20,0.25)] cursor-grab active:cursor-grabbing active:translate-y-0 active:shadow-none'
              } ${isDragging ? 'opacity-30' : 'opacity-100'}`}
            >
              <KatexText text={item.content} />
            </div>
          );
        })}
      </div>
    </div>
  )}

  {/* ========================================================= */}
  {/* 2. MATRIZ DE CASILLEROS / CLASIFICADOR TIPOGRÁFICO        */}
  {/* ========================================================= */}
  <div
    className={`relative transition-all duration-500 border-2 p-1.5 shadow-[inset_0_0_0_1px_rgba(40,30,20,0.08)] ${
      isCompleted
        ? 'border-musgo bg-musgo/[0.03]'
        : 'border-carbon/60 bg-carbon/[0.02]'
    }`}
  >
    <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2">
      {safeBuckets.map((bucket) => {
        const bucketItems = safeItems.filter((item) => placedItems[item.id] === bucket.id);
        const isInteractive = Boolean(selectedItem && !isCompleted);

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
            className={`flex flex-col min-h-[180px] bg-lienzo border transition-all duration-200 ${
              isCompleted
                ? 'border-musgo/40 shadow-none'
                : isInteractive
                ? 'border-carbon/70 bg-carbon/[0.025] cursor-pointer ring-1 ring-carbon/30 shadow-[inset_0_0_8px_rgba(40,30,20,0.04)]'
                : 'border-carbon/30 shadow-[1px_1.5px_0px_rgba(40,30,20,0.08)]'
            }`}
          >
            {/* Cabecera del casillero con filete ornamental Arts & Crafts */}
            <div
              className={`px-3 pt-2 pb-2.5 text-center border-b transition-colors relative ${
                isCompleted
                  ? 'border-musgo/100 text-musgo'
                  : 'border-carbon/40 text-carbon'
              }`}
            >
              {/* Florón / Viñeta tipográfica ornamental */}
              <div className="w-24 mx-auto mb-1.5 select-none">
                <svg
                  viewBox="0 0 140 16"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-full h-auto transition-colors duration-300 ${
                    isCompleted ? 'text-musgo/70' : 'text-carbon/60'
                  }`}
                >
                  <path d="M70 2.5 C68.5 5 66.5 7 64 8 C67 8.5 69 10.5 70 13.5 C71 10.5 73 8.5 76 8 C73.5 7 71.5 5 70 2.5 Z" />
                  <circle cx="70" cy="8" r="1.1" fill="var(--color-lienzo, #fff)" />
                  <path d="M62 8 C52 7.8 44 4.2 34 4.2 C22 4.2 16 9.8 8 9.8 C5.5 9.8 3.5 9 1 7.5 C1 8.2 5 10.8 8.5 10.8 C17 10.8 23 5.2 34 5.2 C43.5 5.2 51.5 8.8 62 9 Z" />
                  <path d="M47 5.8 C45 3.2 41.5 2.2 38 2.5 C41 4 42.5 6.5 43.5 8.2 C45 7.2 46.2 6.5 47 5.8 Z" />
                  <path d="M26 4.8 C24 3 21 2.5 18 3 C20.5 4.2 21.8 6 22.5 7.5 C24 6.3 25.2 5.5 26 4.8 Z" />
                  <circle cx="2" cy="7.5" r="1.2" />
                  <path d="M78 8 C88 7.8 96 4.2 106 4.2 C118 4.2 124 9.8 132 9.8 C134.5 9.8 136.5 9 139 7.5 C139 8.2 135 10.8 131.5 10.8 C123 10.8 117 5.2 106 5.2 C96.5 5.2 88.5 8.8 78 9 Z" />
                  <path d="M93 5.8 C95 3.2 98.5 2.2 102 2.5 C99 4 97.5 6.5 96.5 8.2 C95 7.2 93.8 6.5 93 5.8 Z" />
                  <path d="M114 4.8 C116 3 119 2.5 122 3 C119.5 4.2 118.2 6 117.5 7.5 C116 6.3 114.8 5.5 114 4.8 Z" />
                  <circle cx="138" cy="7.5" r="1.2" />
                </svg>
              </div>

              <h4 className="text-xs font-serif font-bold uppercase my-0.5 tracking-[0.1em] select-none">
                {bucket.title}
              </h4>

              {isInteractive && (
                <span className="block font-serif italic text-[11px] text-carbon/60 mt-1 select-none">
                  — Tocar para asentar —
                </span>
              )}
            </div>

            {/* Receptáculo de fichas */}
            <div
              className={`flex-1 p-3 flex flex-col gap-2 items-center relative transition-colors ${
                dragItem ? 'bg-carbon/[0.02]' : 'bg-transparent'
              }`}
            >
              {bucketItems.length === 0 && !isCompleted && (
                <div className="my-auto py-4 text-[11px] font-serif italic text-carbon/30 select-none pointer-events-none text-center tracking-wide">
                  [ Vacante ]
                </div>
              )}

              {bucketItems.map((item) => {
                const isWrong =
                  isCorrect === false && placedItems[item.id] && item.bucketId !== bucket.id;

                let itemVisuals = 'border-carbon/40 bg-lienzo text-carbon shadow-[1px_1.5px_0px_rgba(40,30,20,0.18)] hover:border-carbon/80';
                
                if (isCompleted) {
                  itemVisuals = 'border-musgo/60 bg-musgo/[0.05] text-musgo shadow-[1px_1px_0px_rgba(46,74,44,0.15)] cursor-default';
                } else if (isWrong) {
                  itemVisuals = 'border-terracota bg-terracota/[0.05] text-terracota shadow-[1px_1.5px_0px_rgba(180,60,40,0.25)]';
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
                    title={!isCompleted ? 'Tocar o arrastrar para retirar' : undefined}
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    className={`group relative flex items-center justify-between w-full max-w-[220px] px-3 py-1.5 border rounded-[1px] transition-all duration-150 ${
                      !isCompleted
                        ? 'cursor-grab active:cursor-grabbing hover:-translate-y-[0.5px] active:translate-y-[1px] active:shadow-none'
                        : ''
                    } ${itemVisuals} ${dragItem === item.id ? 'opacity-30' : 'opacity-100'}`}
                  >
                    <div className="font-serif text-sm truncate">
                      <KatexText text={item.content} />
                    </div>

                    {!isCompleted && (
                      <button
                        type="button"
                        aria-label={t('exercise', 'removeClassifiedItem')}
                        className="ml-2 pl-1 text-carbon/40 group-hover:text-terracota text-xs font-serif transition-colors leading-none"
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
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
