import { createContext, useContext, useRef } from 'react';
import { createStore, useStore } from 'zustand';

// 1. Aquí definimos QUÉ datos va a guardar nuestro store matemático.
export interface MathState {
    variables: Record<string, number | number[] | string | null>;
    setVariable: (name: string, value: number | number[] | string | null) => void;
}

// 2. Creamos la "fábrica" del store.
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

type MathStore = ReturnType<typeof createMathStore>;

// 3. Creamos el Contexto de React.
const MathContext = createContext<MathStore | null>(null);

// 4. EL PROVIDER: Instancia un Store NUEVO usando useRef.
export const MathProvider = ({ children }: { children: React.ReactNode }) => {
    const storeRef = useRef<MathStore>(null);

    if (!storeRef.current) {
        storeRef.current = createMathStore();
    }

    return (
        <MathContext.Provider value={storeRef.current}>
            {children}
        </MathContext.Provider>
    );
};

// 5. CUSTOM HOOK
export function useMathStore<T>(selector: (state: MathState) => T): T {
    const store = useContext(MathContext);
    if (!store) {
        throw new Error('useMathStore debe usarse dentro de un MathProvider');
    }
    return useStore(store, selector);
}
