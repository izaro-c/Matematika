import { useState, useEffect, useCallback } from 'react';
import { useExercise } from '@/lib/page-context/ExerciseContext';
import { EXERCISE_SHAKE_MS } from '../constants';
import type { QuestionType, ExerciseCardTab } from '../types';

export interface UseExerciseQuestionOptions {
  id: string;
  type: QuestionType;
}

export interface UseExerciseQuestionResult {
  /** Estado bruto de la pregunta en el ExerciseContext */
  state: ReturnType<typeof useExercise>['state'];
  /** Si la pregunta ha sido contestada correctamente o revelada */
  isCompleted: boolean;
  /** Si la pregunta ha sido contestada correctamente */
  isCorrect: boolean | null;
  /** Si la solución ha sido revelada tras agotar intentos */
  isRevealed: boolean;
  /** Si el último intento fue fallido */
  hasFailed: boolean;
  /** Número de intentos realizados */
  tries: number;
  /** Respuesta guardada del usuario */
  userAnswer: unknown;
  /** Estado de vibración/error visual */
  isShaking: boolean;
  /** Pestaña activa en la tarjeta (pregunta, error, resolucion) */
  activeTab: ExerciseCardTab;
  /** Cambiar pestaña activa */
  setActiveTab: (tab: ExerciseCardTab) => void;
  /** Disparar animación de error/sacudida */
  triggerShake: () => void;
  /** Registrar respuesta en el contexto */
  submitAnswer: (isCorrect: boolean, answerValue?: unknown) => void;
  /** Revelar solución */
  revealSolution: () => void;
  /** Reintentar la pregunta */
  tryAgain: () => void;
}

/**
 * Hook universal que centraliza la interacción de cualquier tipo de ejercicio
 * con el motor de estado y contexto de la página.
 */
export function useExerciseQuestion({ id, type }: UseExerciseQuestionOptions): UseExerciseQuestionResult {
  const { state, register, answer, clearAnswer, reveal } = useExercise();
  const qState = state.questions[id];

  const [activeTab, setActiveTab] = useState<ExerciseCardTab>('pregunta');
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    register(id, type);
  }, [id, type, register]);

  const isCompleted = qState?.isCorrect === true || qState?.revealed === true;
  const isCorrect = qState?.isCorrect ?? null;
  const isRevealed = qState?.revealed ?? false;
  const tries = qState?.tries ?? 0;
  const hasFailed = tries > 0 && isCorrect === false;
  const userAnswer = qState?.userAnswer;

  const triggerShake = useCallback(() => {
    setIsShaking(true);
    const timer = setTimeout(() => setIsShaking(false), EXERCISE_SHAKE_MS);
    return () => clearTimeout(timer);
  }, []);

  const submitAnswer = useCallback(
    (correct: boolean, answerValue?: unknown) => {
      answer(id, correct, answerValue);
      if (!correct) {
        triggerShake();
      }
    },
    [id, answer, triggerShake]
  );

  const revealSolution = useCallback(() => {
    reveal(id);
  }, [id, reveal]);

  const tryAgain = useCallback(() => {
    clearAnswer(id);
    if (activeTab !== 'pregunta') {
      setActiveTab('pregunta');
    }
  }, [id, clearAnswer, activeTab]);

  return {
    state,
    isCompleted,
    isCorrect,
    isRevealed,
    hasFailed,
    tries,
    userAnswer,
    isShaking,
    activeTab,
    setActiveTab,
    triggerShake,
    submitAnswer,
    revealSolution,
    tryAgain,
  };
}
