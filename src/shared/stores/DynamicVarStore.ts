import { create } from 'zustand';

/**
 * Estado que maneja variables dinámicas matemáticas que pueden ser evaluadas
 * en simulaciones o gráficas en tiempo real.
 */
interface DynamicVarState {
  /** Diccionario de variables globales por su nombre */
  vars: Record<string, number>;
  /** Establece o actualiza el valor de una variable */
  setVar: (name: string, value: number) => void;
  /** Obtiene el valor de una variable, o un fallback si no existe */
  getVar: (name: string, fallback: number) => number;
  /** Limpia todas las variables dinámicas */
  reset: () => void;
}

/**
 * Store global de Zustand para almacenar variables interactivas (ej. sliders de funciones).
 * Permite que componentes separados modifiquen un valor que afecta simulaciones JSXGraph.
 */
export const useDynamicVarStore = create<DynamicVarState>((set, get) => ({
  vars: {},
  setVar: (name, value) =>
    set((state) => ({
      vars: { ...state.vars, [name]: value },
    })),
  getVar: (name, fallback) => {
    const val = get().vars[name];
    return val !== undefined ? val : fallback;
  },
  reset: () => set({ vars: {} }),
}));
