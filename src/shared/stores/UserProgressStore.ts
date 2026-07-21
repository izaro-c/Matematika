import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Estado persistente para gamificación y progreso del usuario en Matematika.
 */
export interface UserProgressState {
  /** IDs de páginas matemáticas marcadas como completadas o leídas. */
  readConcepts: string[];
  /** IDs de ejercicios donde se ha conseguido un 100% de precisión */
  completedExercises: string[];
  /** IDs de casos de uso prácticos que han sido consultados */
  visitedUseCases: string[];
  /** IDs de perfiles biográficos de matemáticos que se han desbloqueado/visitado */
  discoveredMathematicians: string[];
  
  // -- Actions --
  /** Marca un concepto (Teorema, Definición) como asimilado */
  markAsRead: (id: string) => void;
  /** Elimina el marcado de un concepto */
  unmarkAsRead: (id: string) => void;
  /** Alterna el estado de asimilación de un concepto */
  toggleRead: (id: string) => void;
  /** Registra que un ejercicio fue resuelto de forma perfecta */
  markExerciseComplete: (id: string) => void;
  /** Registra la visita a un caso práctico en el mundo real */
  markUseCaseVisited: (id: string) => void;
  /** Desbloquea a un matemático histórico en la biblioteca personal */
  discoverMathematician: (id: string) => void;
  
  // -- Queries --
  /** Verifica si el usuario ha asimilado el ID provisto */
  isRead: (id: string) => boolean;
  /** Verifica si el ejercicio provisto fue completado */
  isExerciseComplete: (id: string) => boolean;
}

/**
 * Store persistente de Zustand (localStorage) para guardar el estado educativo
 * del usuario en todas las sesiones.
 */
export const useProgressStore = create<UserProgressState>()(
  persist(
    (set, get) => ({
      readConcepts: [],
      completedExercises: [],
      visitedUseCases: [],
      discoveredMathematicians: [],

      markAsRead: (id: string) => set((state) => {
        if (state.readConcepts.includes(id)) return state;
        return { readConcepts: [...state.readConcepts, id] };
      }),

      unmarkAsRead: (id: string) => set((state) => {
        return { readConcepts: state.readConcepts.filter(conceptId => conceptId !== id) };
      }),

      toggleRead: (id: string) => set((state) => {
        if (state.readConcepts.includes(id)) {
          return { readConcepts: state.readConcepts.filter(conceptId => conceptId !== id) };
        } else {
          return { readConcepts: [...state.readConcepts, id] };
        }
      }),

      markExerciseComplete: (id: string) => set((state) => {
        if (state.completedExercises.includes(id)) return state;
        return { completedExercises: [...state.completedExercises, id] };
      }),

      markUseCaseVisited: (id: string) => set((state) => {
        if (state.visitedUseCases.includes(id)) return state;
        return { visitedUseCases: [...state.visitedUseCases, id] };
      }),

      discoverMathematician: (id: string) => set((state) => {
        if (state.discoveredMathematicians.includes(id)) return state;
        return { discoveredMathematicians: [...state.discoveredMathematicians, id] };
      }),

      isRead: (id: string) => get().readConcepts.includes(id),
      isExerciseComplete: (id: string) => get().completedExercises.includes(id),
    }),
    {
      name: 'matematika-progress', // clave en localStorage
    }
  )
);
