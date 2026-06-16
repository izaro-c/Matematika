import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProgressState {
  readConcepts: string[]; // IDs de teoremas, definiciones, lecciones
  completedExercises: string[]; // IDs de ejercicios completados 100%
  visitedUseCases: string[]; // IDs de casos de uso vistos
  discoveredMathematicians: string[]; // IDs de matemáticos descubiertos
  
  // Actions
  markAsRead: (id: string) => void;
  unmarkAsRead: (id: string) => void;
  toggleRead: (id: string) => void;
  markExerciseComplete: (id: string) => void;
  markUseCaseVisited: (id: string) => void;
  discoverMathematician: (id: string) => void;
  
  // Queries
  isRead: (id: string) => boolean;
  isExerciseComplete: (id: string) => boolean;
}

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
