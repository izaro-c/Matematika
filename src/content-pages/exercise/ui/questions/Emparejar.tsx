import React, { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback } from 'react';
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
  /** Renderizado plano sin tarjeta contenedora ni pestañas */
  bare?: boolean;
}

const EmparejarErrorComun: React.FC<ErrorComunProps> = () => null;
EmparejarErrorComun.displayName = 'EmparejarErrorComun';

const EmparejarResolucion: React.FC<ResolucionProps> = () => null;
EmparejarResolucion.displayName = 'EmparejarResolucion';

type EmparejarComponent = React.FC<EmparejarProps> & {
  ErrorComun: React.FC<ErrorComunProps>;
  Resolucion: React.FC<ResolucionProps>;
};

interface BezierLine {
  leftVal: string;
  rightVal: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isError: boolean;
}

/** Baraja un array de forma determinista y segura */
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

/** Construye el mapa de correspondencia canónico a partir de los pares correctos */
function getCanonicalPairsMap(pairs: Pair[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const p of pairs || []) {
    if (p.left && p.right) map[p.left] = p.right;
  }
  return map;
}

/**
 * Emparejar — Ejercicio interactivo de correspondencia con curvas Bézier y corte manual.
 */
export const Emparejar: EmparejarComponent = ({ id, pregunta, pairs = [], bare, children }) => {
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

  // Columnas barajadas
  const [leftItems, setLeftItems] = useState<string[]>(() => shuffle((pairs || []).map((p) => p.left)));
  const [rightItems, setRightItems] = useState<string[]>(() => shuffle((pairs || []).map((p) => p.right)));

  // Conexiones activas del usuario { [left]: right }
  const [userPairs, setUserPairs] = useState<Record<string, string>>(() => {
    if (userAnswer && typeof userAnswer === 'object' && Object.keys(userAnswer).length > 0) {
      return userAnswer as Record<string, string>;
    }
    return isCompleted && pairs.length > 0 ? getCanonicalPairsMap(pairs) : {};
  });

  const [wrongPairs, setWrongPairs] = useState<string[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [lines, setLines] = useState<BezierLine[]>([]);
  const shuffleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sincronización de pares persistidos o completados tras hidratación
  useEffect(() => {
    if (userAnswer && typeof userAnswer === 'object' && Object.keys(userAnswer).length > 0) {
      setUserPairs((prev) => {
        const isSame =
          Object.keys(prev).length === Object.keys(userAnswer).length &&
          Object.entries(userAnswer).every(([k, v]) => prev[k] === v);
        return isSame ? prev : (userAnswer as Record<string, string>);
      });
    } else if (isCompleted && Object.keys(userPairs).length === 0 && pairs.length > 0) {
      setUserPairs(getCanonicalPairsMap(pairs));
    }
  }, [userAnswer, isCompleted, pairs, userPairs]);

  // Reiniciar estado si la prop `pairs` cambia estructuralmente
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

  // Recalculo geométrico de curvas Bézier relativas al contenedor
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
      if (lRect.width === 0 || rRect.width === 0) continue;

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

  // Observador de redimensionamiento y sincronización de trazado
  useLayoutEffect(() => {
    const sync = () => updateLines();

    sync();
    const frameId = requestAnimationFrame(sync);

    if (!containerRef.current) return () => cancelAnimationFrame(frameId);

    const ro = new ResizeObserver(() => requestAnimationFrame(sync));
    ro.observe(containerRef.current);
    window.addEventListener('resize', sync);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, [updateLines, userPairs, leftItems, rightItems, isCompleted, activeTab]);

  // Desconectar enlace izquierdo
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

  // Desconectar enlace derecho
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

  // Manejo de interacción de selección en columna izquierda
  const handleLeftClick = (item: string) => {
    if (isCompleted || isShuffling) return;
    if (userPairs[item]) return disconnectLeft(item);

    if (selectedRight) {
      setUserPairs((prev) => ({ ...prev, [item]: selectedRight }));
      setSelectedRight(null);
      setSelectedLeft(null);
      setWrongPairs([]);
      return;
    }
    setSelectedLeft(selectedLeft === item ? null : item);
  };

  // Manejo de interacción de selección en columna derecha
  const handleRightClick = (item: string) => {
    if (isCompleted || isShuffling) return;
    if (Object.values(userPairs).includes(item)) return disconnectRight(item);

    if (selectedLeft) {
      setUserPairs((prev) => ({ ...prev, [selectedLeft]: item }));
      setSelectedLeft(null);
      setSelectedRight(null);
      setWrongPairs([]);
      return;
    }
    setSelectedRight(selectedRight === item ? null : item);
  };

  // Validación de la respuesta
  const handleCheck = () => {
    if (isCompleted || isShuffling) return;
    const connectedCount = Object.keys(userPairs).length;

    if (connectedCount === 0) {
      triggerShake();
      return;
    }

    const wrongKeys: string[] = [];
    for (const [lVal, rVal] of Object.entries(userPairs)) {
      const isValid = pairs.some((p) => p.left === lVal && p.right === rVal);
      if (!isValid) wrongKeys.push(lVal);
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

  // Animación visual de barajado al reiniciar
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

  useEffect(() => {
    return () => {
      if (shuffleTimerRef.current) clearInterval(shuffleTimerRef.current);
    };
  }, []);

  const handleTryAgain = () => {
    tryAgain();
    startShuffleAnimation();
  };

  return (
    <ExerciseCard
      id={id}
      bare={bare}
      errorComunData={errorComunData}
      resolucionData={resolucionData}
      isCorrect={isCompleted}
      hasFailed={hasFailed}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      className=""
      pregunta={pregunta}
    >
      <div className="relative flex flex-col sm:flex-row gap-6 sm:gap-12 md:gap-16" ref={containerRef}>
        {/* Curvas Bézier SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
          {lines.map((line) => {
            const dx = Math.max(20, Math.abs(line.x2 - line.x1) * 0.4);
            const d = `M ${line.x1} ${line.y1} C ${line.x1 + dx} ${line.y1}, ${line.x2 - dx} ${line.y2}, ${line.x2} ${line.y2}`;

            return (
              <g key={`${line.leftVal}-${line.rightVal}`} className="group/line">
                {!isCompleted && !isShuffling && (
                  <path
                    d={d}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="20"
                    className="pointer-events-auto cursor-pointer"
                    onClick={() => disconnectLeft(line.leftVal)}
                  >
                    <title>{t('exercise', 'clickToCutConnection')}</title>
                  </path>
                )}
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
                  strokeWidth="2"
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