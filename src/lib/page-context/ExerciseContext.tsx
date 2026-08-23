import React, { createContext, useContext, useReducer, useCallback, useEffect, useState } from 'react';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type QuestionType = 'hueco' | 'pregunta' | 'emparejar' | 'canvas' | 'matriz' | 'ordenacion';

export interface QuestionState {
  id: string;
  type: QuestionType;
  isCorrect: boolean | null; // null = sin responder
  tries: number;
  revealed: boolean;
  userAnswer?: any;
}

interface ExerciseState {
  questions: Record<string, QuestionState>;
}

type Action =
  | { type: 'REGISTER'; id: string; qType: QuestionType }
  | { type: 'ANSWER'; id: string; isCorrect: boolean; userAnswer?: any }
  | { type: 'CLEAR_ANSWER'; id: string }
  | { type: 'REVEAL'; id: string }
  | { type: 'RESET' };

// ── Reducer ───────────────────────────────────────────────────────────────────

function reducer(state: ExerciseState, action: Action): ExerciseState {
  switch (action.type) {
    case 'REGISTER':
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
            userAnswer: action.userAnswer !== undefined ? action.userAnswer : state.questions[action.id]?.userAnswer,
          },
        },
      };

    case 'CLEAR_ANSWER':
      if (!state.questions[action.id]) return state;
      return {
        ...state,
        questions: {
          ...state.questions,
          [action.id]: {
            ...state.questions[action.id],
            isCorrect: null,
            userAnswer: undefined,
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

function getInitialState(exerciseId?: string): ExerciseState {
  if (!exerciseId || typeof window === 'undefined') return { questions: {} };
  try {
    const stored = localStorage.getItem(`matematika-exercise-${exerciseId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && parsed.questions) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return { questions: {} };
}

// ── Contexto ──────────────────────────────────────────────────────────────────

export interface ExerciseContextType {
  state: ExerciseState;
  register: (id: string, type: QuestionType) => void;
  answer: (id: string, isCorrect: boolean, userAnswer?: any) => void;
  clearAnswer: (id: string) => void;
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
// eslint-disable-next-line react-refresh/only-export-components
export function useExercise(): ExerciseContextType {
  const ctx = useContext(ExerciseContext);
  if (!ctx) {
    return {
      state: { questions: {} },
      register: () => {},
      answer: () => {},
      clearAnswer: () => {},
      reveal: () => {},
      reset: () => {},
      score: { correct: 0, total: 0, answered: 0 },
    };
  }
  return ctx;
}

// ── Proveedor ─────────────────────────────────────────────────────────────────

export interface ExerciseProviderProps {
  exerciseId?: string;
  children: React.ReactNode;
}

export const ExerciseProvider: React.FC<ExerciseProviderProps> = ({ exerciseId, children }) => {
  const [state, dispatch] = useReducer(reducer, exerciseId, getInitialState);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!exerciseId || typeof window === 'undefined') return;
    try {
      if (Object.keys(state.questions).length > 0) {
        localStorage.setItem(`matematika-exercise-${exerciseId}`, JSON.stringify(state));
      }
    } catch {
      // ignore
    }
  }, [exerciseId, state]);

  const register = useCallback((id: string, type: QuestionType) => {
    dispatch({ type: 'REGISTER', id, qType: type });
  }, []);

  const answer = useCallback((id: string, isCorrect: boolean, userAnswer?: any) => {
    dispatch({ type: 'ANSWER', id, isCorrect, userAnswer });
  }, []);

  const clearAnswer = useCallback((id: string) => {
    dispatch({ type: 'CLEAR_ANSWER', id });
  }, []);

  const reveal = useCallback((id: string) => {
    dispatch({ type: 'REVEAL', id });
  }, []);

  const reset = useCallback(() => {
    if (exerciseId && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`matematika-exercise-${exerciseId}`);
      } catch {
        // ignore
      }
    }
    dispatch({ type: 'RESET' });
    setResetKey((k: number) => k + 1);
  }, [exerciseId]);

  const qs = Object.values(state.questions);
  const score = {
    correct: qs.filter(q => q.isCorrect === true).length,
    total: qs.length,
    answered: qs.filter(q => q.isCorrect !== null || q.revealed).length,
  };

  return (
    <ExerciseContext.Provider value={{ state, register, answer, clearAnswer, reveal, reset, score }}>
      <React.Fragment key={resetKey}>
        {children}
      </React.Fragment>
    </ExerciseContext.Provider>
  );
};

