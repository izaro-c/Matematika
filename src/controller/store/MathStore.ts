import { createStore } from 'zustand';

/**
 * Interfaz que define la estructura del estado matemático.
 */
export interface MathState {
    variables: Record<string, number | number[] | string | string[] | null>;
    setVariable: (name: string, value: number | number[] | string | string[] | null) => void;
}

/**
 * Función fábrica para crear una instancia aislada del MathStore usando Zustand.
 */
export const createMathStore = () => {
    return createStore<MathState>()((set) => ({
        variables: {},
        setVariable: (name, value) => set((state) => ({
            variables: {
                ...state.variables,
                [name]: value
            }
        })),
    }));
};

/** Tipo inferido para el store creado por la fábrica */
export type MathStore = ReturnType<typeof createMathStore>;
