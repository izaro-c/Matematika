/**
 * ExerciseContext.tsx
 *
 * Contexto React que gestiona el estado de todas las preguntas dentro
 * de una página de ejercicio: respuestas, aciertos, intentos y revelaciones.
 * Cada ExercisePage monta su propio proveedor, por lo que el estado
 * es completamente local a la página activa.
 */
import React, { createContext, useContext, useReducer, useCallback } from 'react';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type QuestionType = 'hueco' | 'pregunta' | 'emparejar' | 'canvas' | 'matriz' | 'ordenacion';

export interface QuestionState {
  id: string;
  type: QuestionType;
  isCorrect: boolean | null; // null = sin responder
  tries: number;
  revealed: boolean;
}

interface ExerciseState {
  questions: Record<string, QuestionState>;
}

type Action =
  | { type: 'REGISTER'; id: string; qType: QuestionType }
  | { type: 'ANSWER'; id: string; isCorrect: boolean }
  | { type: 'REVEAL'; id: string }
  | { type: 'RESET' };

// ── Reducer ───────────────────────────────────────────────────────────────────

function reducer(state: ExerciseState, action: Action): ExerciseState {
  switch (action.type) {
    case 'REGISTER':
      // Idempotente: no sobreescribe si ya existe
      if (state.questions[action.id]) return state;
      return {
        ...state,
        questions: {
          ...state.questions,
          [action.id]: { id: action.id, type: action.qType, isCorrect: null, tries: 0, revealed: false },
        },
      };

    case 'ANSWER':
      return {
        ...state,
        questions: {
          ...state.questions,
          [action.id]: {
            ...(state.questions[action.id] ?? { id: action.id, type: 'hueco', revealed: false }),
            isCorrect: action.isCorrect,
            tries: (state.questions[action.id]?.tries ?? 0) + 1,
          },
        },
      };

    case 'REVEAL':
      return {
        ...state,
        questions: {
          ...state.questions,
          [action.id]: {
            ...(state.questions[action.id] ?? { id: action.id, type: 'hueco', isCorrect: null, tries: 0 }),
            revealed: true,
          },
        },
      };

    case 'RESET':
      return { questions: {} };

    default:
      return state;
  }
}

// ── Contexto ──────────────────────────────────────────────────────────────────

export interface ExerciseContextType {
  state: ExerciseState;
  register: (id: string, type: QuestionType) => void;
  answer: (id: string, isCorrect: boolean) => void;
  reveal: (id: string) => void;
  reset: () => void;
  /** Métricas de progreso calculadas en tiempo real */
  score: {
    correct: number;
    total: number;
    answered: number;
  };
}

const ExerciseContext = createContext<ExerciseContextType | null>(null);

/**
 * useExercise — hook para acceder al contexto desde cualquier componente hijo.
 * Retorna valores neutros si se usa fuera del proveedor (modo previsualización).
 */
export function useExercise(): ExerciseContextType {
  const ctx = useContext(ExerciseContext);
  if (!ctx) {
    // Fallback seguro para usos fuera de ExerciseProvider (e.g. MDXProvider global)
    return {
      state: { questions: {} },
      register: () => {},
      answer: () => {},
      reveal: () => {},
      reset: () => {},
      score: { correct: 0, total: 0, answered: 0 },
    };
  }
  return ctx;
}

// ── Proveedor ─────────────────────────────────────────────────────────────────

export const ExerciseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { questions: {} });

  const register = useCallback((id: string, type: QuestionType) => {
    dispatch({ type: 'REGISTER', id, qType: type });
  }, []);

  const answer = useCallback((id: string, isCorrect: boolean) => {
    dispatch({ type: 'ANSWER', id, isCorrect });
  }, []);

  const reveal = useCallback((id: string) => {
    dispatch({ type: 'REVEAL', id });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const qs = Object.values(state.questions);
  const score = {
    correct: qs.filter(q => q.isCorrect === true).length,
    total: qs.length,
    answered: qs.filter(q => q.isCorrect !== null || q.revealed).length,
  };

  return (
    <ExerciseContext.Provider value={{ state, register, answer, reveal, reset, score }}>
      {children}
    </ExerciseContext.Provider>
  );
};
