import { createContext, useContext, useState, ReactNode } from 'react';
import { useStore } from 'zustand';
import { createMathStore, MathStore, MathState } from '@/shared/lib/MathStore';

/** Contexto de React para inyectar el store Zustand en el árbol de componentes */
const MathContext = createContext<MathStore | null>(null);

/**
 * Proveedor del Contexto Matemático.
 */
export const MathProvider = ({ children }: { children: ReactNode }) => {
    const [store] = useState(() => createMathStore());

    return (
        <MathContext.Provider value={store}>
            {children}
        </MathContext.Provider>
    );
};

/**
 * Custom hook para acceder al estado matemático desde componentes hijos del MathProvider.
 */
export function useMathStore<T>(selector: (state: MathState) => T): T {
    const store = useContext(MathContext);
    if (!store) {
        throw new Error('useMathStore debe usarse dentro de un MathProvider');
    }
    return useStore(store, selector);
}
