import { createContext, useContext, useState } from 'react';
import { createStore, useStore } from 'zustand';

/**
 * Interfaz que define la estructura del estado matemático.
 * 
 * Almacena variables y permite modificarlas, para que cualquier componente 
 * (ej. un slider o una gráfica) pueda leer o actualizar los valores globales
 * del contexto matemático de una lección particular.
 */
export interface MathState {
    variables: Record<string, number | number[] | string | string[] | null>;
    setVariable: (name: string, value: number | number[] | string | string[] | null) => void;
}

/**
 * Función fábrica para crear una instancia aislada del MathStore usando Zustand.
 * 
 * A diferencia de los stores globales, instanciamos un store por contexto 
 * para aislar las variables de cada lección de otras lecciones abiertas.
 */
const createMathStore = () => {
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
type MathStore = ReturnType<typeof createMathStore>;

/** Contexto de React para inyectar el store Zustand en el árbol de componentes */
const MathContext = createContext<MathStore | null>(null);

/**
 * Proveedor del Contexto Matemático.
 * 
 * Envuelve una sección de la aplicación (usualmente una lección interactiva) 
 * proporcionándole un store de Zustand completamente aislado para evitar colisión de variables.
 */
export const MathProvider = ({ children }: { children: React.ReactNode }) => {
    const [store] = useState(() => createMathStore());

    return (
        <MathContext.Provider value={store}>
            {children}
        </MathContext.Provider>
    );
};

/**
 * Custom hook para acceder al estado matemático desde componentes hijos del MathProvider.
 * 
 * Envuelve el hook `useStore` de Zustand para que consuma de la instancia que provee el Contexto
 * en lugar de una instancia global única.
 * 
 * @param selector Función para seleccionar qué parte del estado (o acciones) se requiere.
 * @returns La parte del estado seleccionada, fuertemente tipada.
 * @throws Error si se llama fuera de un MathProvider.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useMathStore<T>(selector: (state: MathState) => T): T {
    const store = useContext(MathContext);
    if (!store) {
        throw new Error('useMathStore debe usarse dentro de un MathProvider');
    }
    return useStore(store, selector);
}
