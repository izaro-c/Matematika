import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { KatexText } from '@/components/ui/KatexText';
import { useI18n } from '@/i18n';
import { useExerciseQuestion } from '../../hooks/useExerciseQuestion';
import { useSubcomponents } from '../../hooks/useSubcomponents';
import { ExerciseCard } from '../shared/ExerciseCard';
import { QuestionFeedback } from '../shared/QuestionFeedback';
import type { Pair, ErrorComunProps, ResolucionProps, BaseQuestionProps } from '../../types';

export interface EmparejarProps extends BaseQuestionProps {
  /** Enunciado opcional de la pregunta */
  pregunta?: string;
  /** Lista de pares correspondientes { left, right } */
  pairs: Pair[];
}

const EmparejarErrorComun: React.FC<ErrorComunProps> = () => null;
EmparejarErrorComun.displayName = 'EmparejarErrorComun';

const EmparejarResolucion: React.FC<ResolucionProps> = () => null;
EmparejarResolucion.displayName = 'EmparejarResolucion';

type EmparejarComponent = React.FC<EmparejarProps> & {
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

interface BezierLine {
  leftVal: string;
  rightVal: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isError: boolean;
}

/**
 * Emparejar — Ejercicio interactivo de correspondencia con conexiones Bézier,
 * corte de enlaces manual y comprobación bajo demanda.
 */
export const Emparejar: EmparejarComponent = ({ id, pregunta, pairs = [], children }) => {
  const { t } = useI18n();

  const {
    isCompleted,
    hasFailed,
    userAnswer,
    activeTab,
    setActiveTab,
    triggerShake,
    submitAnswer,
    tryAgain,
  } = useExerciseQuestion({ id, type: 'emparejar' });

  const { errorComunData, resolucionData, otherChildren } = useSubcomponents(children);

  // Elementos barajados en ambas columnas
  const [leftItems, setLeftItems] = useState<string[]>(() => shuffle((pairs || []).map((p) => p.left)));
  const [rightItems, setRightItems] = useState<string[]>(() => shuffle((pairs || []).map((p) => p.right)));

  // Conexiones actuales establecidas por el usuario: { [leftVal]: rightVal }
  const [userPairs, setUserPairs] = useState<Record<string, string>>(() => {
    if (userAnswer && typeof userAnswer === 'object') {
      return userAnswer as Record<string, string>;
    }
    return {};
  });

  // Claves de pares que fallaron la última comprobación
  const [wrongPairs, setWrongPairs] = useState<string[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);

  // Selección activa para enlazar
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [lines, setLines] = useState<BezierLine[]>([]);
  const shuffleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Evita re-barajados accidentales cuando el padre pasa una nueva referencia de `pairs`
  const pairsKey = useMemo(() => (pairs || []).map((p) => `${p.left}:::${p.right}`).join('|||'), [pairs]);
  const prevPairsKeyRef = useRef(pairsKey);

  useEffect(() => {
    if (prevPairsKeyRef.current !== pairsKey) {
      prevPairsKeyRef.current = pairsKey;
      const safePairs = pairs || [];
      setLeftItems(shuffle(safePairs.map((p) => p.left)));
      setRightItems(shuffle(safePairs.map((p) => p.right)));
      setUserPairs({});
      setSelectedLeft(null);
      setSelectedRight(null);
      setWrongPairs([]);
      setLines([]);
    }
  }, [pairsKey, pairs]);

  // Recalcula las coordenadas relativas de las curvas Bézier
  const updateLines = useCallback(() => {
    if (!containerRef.current) return;
    const cr = containerRef.current.getBoundingClientRect();
    if (!cr.width && !cr.height) return;

    const newLines: BezierLine[] = [];
    for (const [leftVal, rightVal] of Object.entries(userPairs)) {
      const lEl = leftRefs.current[leftVal];
      const rEl = rightRefs.current[rightVal];
      if (!lEl || !rEl) continue;

      const lRect = lEl.getBoundingClientRect();
      const rRect = rEl.getBoundingClientRect();

      newLines.push({
        leftVal,
        rightVal,
        x1: lRect.right - cr.left,
        y1: lRect.top + lRect.height / 2 - cr.top,
        x2: rRect.left - cr.left,
        y2: rRect.top + rRect.height / 2 - cr.top,
        isError: wrongPairs.includes(leftVal),
      });
    }

    setLines(newLines);
  }, [userPairs, wrongPairs]);

  // Sincroniza líneas ante cambios de elementos, conexiones y redimensionamiento
  useEffect(() => {
    updateLines();
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => updateLines());
    ro.observe(containerRef.current);
    window.addEventListener('resize', updateLines);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateLines);
    };
  }, [updateLines, userPairs, leftItems, rightItems]);

  // Cortar conexión de un elemento (izquierdo o derecho)
  const disconnectLeft = (leftVal: string) => {
    if (isCompleted || isShuffling) return;
    setUserPairs((prev) => {
      const next = { ...prev };
      delete next[leftVal];
      return next;
    });
    setWrongPairs((prev) => prev.filter((k) => k !== leftVal));
    if (selectedLeft === leftVal) setSelectedLeft(null);
  };

  const disconnectRight = (rightVal: string) => {
    if (isCompleted || isShuffling) return;
    setUserPairs((prev) => {
      const next = { ...prev };
      for (const [l, r] of Object.entries(next)) {
        if (r === rightVal) delete next[l];
      }
      return next;
    });
    setWrongPairs((prev) => {
      const wrongLeft = Object.keys(userPairs).find((l) => userPairs[l] === rightVal);
      return wrongLeft ? prev.filter((k) => k !== wrongLeft) : prev;
    });
    if (selectedRight === rightVal) setSelectedRight(null);
  };

  // Click en elemento izquierdo
  const handleLeftClick = (item: string) => {
    if (isCompleted || isShuffling) return;

    // Si ya está conectado, clicarlo corta la conexión
    if (userPairs[item]) {
      disconnectLeft(item);
      return;
    }

    // Si ya había seleccionado un derecho, los conecta directamente
    if (selectedRight) {
      setUserPairs((prev) => ({ ...prev, [item]: selectedRight }));
      setSelectedRight(null);
      setSelectedLeft(null);
      setWrongPairs([]);
      return;
    }

    setSelectedLeft(selectedLeft === item ? null : item);
  };

  // Click en elemento derecho
  const handleRightClick = (item: string) => {
    if (isCompleted || isShuffling) return;

    // Si ya está conectado, clicarlo corta la conexión
    const isConnected = Object.values(userPairs).includes(item);
    if (isConnected) {
      disconnectRight(item);
      return;
    }

    // Si ya había seleccionado un izquierdo, los conecta directamente
    if (selectedLeft) {
      setUserPairs((prev) => ({ ...prev, [selectedLeft]: item }));
      setSelectedLeft(null);
      setSelectedRight(null);
      setWrongPairs([]);
      return;
    }

    setSelectedRight(selectedRight === item ? null : item);
  };

  // Comprobar respuestas (Botón Egiaztatu / Comprobar)
  const handleCheck = () => {
    if (isCompleted || isShuffling) return;

    const connectedCount = Object.keys(userPairs).length;
    if (connectedCount === 0) {
      triggerShake();
      return;
    }

    const wrongKeys: string[] = [];
    for (const [lVal, rVal] of Object.entries(userPairs)) {
      const matches = pairs.some((p) => p.left === lVal && p.right === rVal);
      if (!matches) {
        wrongKeys.push(lVal);
      }
    }

    const isAllCorrect = connectedCount === pairs.length && wrongKeys.length === 0;

    if (isAllCorrect) {
      setWrongPairs([]);
      submitAnswer(true, userPairs);
    } else {
      setWrongPairs(wrongKeys);
      submitAnswer(false);
    }
  };

  // Animación de barajado fluido en ráfaga rápida
  const startShuffleAnimation = useCallback(() => {
    if (shuffleTimerRef.current) clearInterval(shuffleTimerRef.current);
    setIsShuffling(true);
    setUserPairs({});
    setSelectedLeft(null);
    setSelectedRight(null);
    setWrongPairs([]);
    setLines([]);

    let count = 0;
    const maxTicks = 12;
    const safePairs = pairs || [];
    shuffleTimerRef.current = setInterval(() => {
      count++;
      setLeftItems(shuffle(safePairs.map((p) => p.left)));
      setRightItems(shuffle(safePairs.map((p) => p.right)));

      if (count >= maxTicks) {
        if (shuffleTimerRef.current) clearInterval(shuffleTimerRef.current);
        shuffleTimerRef.current = null;
        setIsShuffling(false);
      }
    }, 45);
  }, [pairs]);

  // Limpieza de temporizadores
  useEffect(() => {
    return () => {
      if (shuffleTimerRef.current) clearInterval(shuffleTimerRef.current);
    };
  }, []);

  // Reintentar (Saiatu berriro / Intentar de nuevo)
  const handleTryAgain = () => {
    tryAgain();
    startShuffleAnimation();
  };

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
      className={isCompleted ? 'bg-musgo/5 border-musgo/30' : ''}
    >
      <h4 className={`font-bold text-carbon mb-8 mt-2 text-lg z-30 relative leading-relaxed ${showBookmarks ? 'pr-20 sm:pr-28' : ''}`}>
        {isCompleted ? (
          <span className="text-musgo">❦ {t('exercise', 'completed')}</span>
        ) : (
          <span>{pregunta || t('exercise', 'matchConcepts')}</span>
        )}
      </h4>

      <div className="relative flex flex-col sm:flex-row gap-6 sm:gap-12 md:gap-16" ref={containerRef}>
        {/* Curvas Bézier de conexión y área de corte interactivo */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
          {lines.map((line) => {
            const dx = Math.max(20, Math.abs(line.x2 - line.x1) * 0.4);
            const d = `M ${line.x1} ${line.y1} C ${line.x1 + dx} ${line.y1}, ${line.x2 - dx} ${line.y2}, ${line.x2} ${line.y2}`;

            return (
              <g key={`${line.leftVal}-${line.rightVal}`} className="group/line">
                {/* Zona de impacto ampliada para cortar la línea con un clic */}
                {!isCompleted && !isShuffling && (
                  <path
                    d={d}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="20"
                    className="pointer-events-auto cursor-pointer"
                    onClick={() => disconnectLeft(line.leftVal)}
                  >
                    <title>Clic para cortar conexión</title>
                  </path>
                )}
                {/* Línea visible de conexión */}
                <path
                  d={d}
                  fill="none"
                  stroke={
                    isCompleted
                      ? 'var(--theme-musgo)'
                      : line.isError
                        ? 'var(--theme-terracota)'
                        : 'var(--theme-carbon)'
                  }
                  strokeWidth={'2'}
                  strokeDasharray={line.isError ? '4 4' : 'none'}
                  className={`transition-all duration-300 drop-shadow-sm ${
                    !isCompleted && !isShuffling
                      ? 'pointer-events-auto cursor-pointer group-hover/line:stroke-terracota group-hover/line:stroke-[3px]'
                      : 'pointer-events-none'
                  }`}
                  onClick={() => !isCompleted && !isShuffling && disconnectLeft(line.leftVal)}
                />
              </g>
            );
          })}
        </svg>

        {/* Columna Izquierda */}
        <div className="flex-1 flex flex-col gap-4 z-20">
          {leftItems.map((item) => {
            const isConnected = Boolean(userPairs[item]);
            const isSelected = selectedLeft === item;
            const isError = wrongPairs.includes(item);

            let btnClass = 'px-5 py-4 border rounded-none text-left transition-all duration-300 relative ';
            if (isCompleted) btnClass += 'bg-musgo/10 border-musgo/40 text-musgo cursor-default ac-inset-shadow';
            else if (isError) btnClass += 'bg-terracota/5 border-terracota/60 text-terracota animate-shake cursor-pointer';
            else if (isSelected) btnClass += 'bg-carbon/10 border-carbon text-carbon transform scale-[1.02] shadow-md z-30';
            else if (isConnected) btnClass += 'bg-carbon/5 border-carbon/50 text-carbon hover:border-terracota/60 cursor-pointer';
            else btnClass += 'page-accent-button bg-transparent border-carbon/20 cursor-pointer text-carbon hover:-translate-y-0.5 hover:shadow-sm';

            let dotClass = 'border-carbon/30 bg-lienzo';
            if (isCompleted) dotClass = 'border-musgo bg-lienzo';
            else if (isError) dotClass = 'border-terracota bg-terracota';
            else if (isSelected || isConnected) dotClass = 'border-carbon bg-carbon';

            return (
              <button
                key={item}
                ref={(el) => {
                  leftRefs.current[item] = el;
                }}
                disabled={isCompleted || isShuffling}
                onClick={() => handleLeftClick(item)}
                title={isConnected && !isCompleted ? 'Clic para cortar conexión' : undefined}
                className={btnClass}
              >
                <KatexText text={item} />
                <div className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full border-2 ${dotClass}`} />
              </button>
            );
          })}
        </div>

        {/* Columna Derecha */}
        <div className="flex-1 flex flex-col gap-4 z-20">
          {rightItems.map((item) => {
            const isConnected = Object.values(userPairs).includes(item);
            const isSelected = selectedRight === item;
            const connectedLeft = Object.keys(userPairs).find((l) => userPairs[l] === item);
            const isError = connectedLeft ? wrongPairs.includes(connectedLeft) : false;

            let btnClass = 'px-5 py-4 border rounded-none text-left transition-all duration-300 relative ';
            if (isCompleted) btnClass += 'bg-musgo/10 border-musgo/40 text-musgo cursor-default ac-inset-shadow';
            else if (isError) btnClass += 'bg-terracota/5 border-terracota/60 text-terracota animate-shake cursor-pointer';
            else if (isSelected) btnClass += 'bg-carbon/10 border-carbon text-carbon transform scale-[1.02] shadow-md z-30';
            else if (isConnected) btnClass += 'bg-carbon/5 border-carbon/50 text-carbon hover:border-terracota/60 cursor-pointer';
            else btnClass += 'page-accent-button bg-transparent border-carbon/20 cursor-pointer text-carbon hover:-translate-y-0.5 hover:shadow-sm';

            let dotClass = 'border-carbon/30 bg-lienzo';
            if (isCompleted) dotClass = 'border-musgo bg-lienzo';
            else if (isError) dotClass = 'border-terracota bg-terracota';
            else if (isSelected || isConnected) dotClass = 'border-carbon bg-carbon';

            return (
              <button
                key={item}
                ref={(el) => {
                  rightRefs.current[item] = el;
                }}
                disabled={isCompleted || isShuffling}
                onClick={() => handleRightClick(item)}
                title={isConnected && !isCompleted ? 'Clic para cortar conexión' : undefined}
                className={btnClass}
              >
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 ${dotClass}`} />
                <KatexText text={item} />
              </button>
            );
          })}
        </div>
      </div>

      {!isCompleted && (
        <div className="mt-8 flex justify-end border-carbon/10 pt-5">
          <button
            type="button"
            onClick={handleCheck}
            disabled={isShuffling || Object.keys(userPairs).length === 0}
            className="ac-btn ac-interactive page-accent-button px-6 py-3 text-xs border border-carbon/30 text-carbon transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer disabled:opacity-30 disabled:cursor-default"
          >
            {t('exercise', 'check')}
          </button>
        </div>
      )}

      <QuestionFeedback
        hasFailed={hasFailed}
        isSuccess={isCompleted}
        errorComunData={errorComunData}
        resolucionData={resolucionData}
        onTryAgain={handleTryAgain}
        onOpenError={() => setActiveTab('error')}
        onOpenResolucion={() => setActiveTab('resolucion')}
      />

      {otherChildren.length > 0 && <div className="mt-4">{otherChildren}</div>}
    </ExerciseCard>
  );
};

Emparejar.ErrorComun = EmparejarErrorComun;
Emparejar.Resolucion = EmparejarResolucion;
