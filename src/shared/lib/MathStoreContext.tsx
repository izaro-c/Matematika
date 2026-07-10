import { createContext, useContext, useState, type ReactNode } from 'react';
import { useStore } from 'zustand';
import { createMathStore, type MathState, type MathStore } from './MathStore';

const MathContext = createContext<MathStore | null>(null);

export const MathProvider = ({ children }: { children: ReactNode }) => {
  const [store] = useState(() => createMathStore());

  return (
    <MathContext.Provider value={store}>
      {children}
    </MathContext.Provider>
  );
};

export function useMathStore<T>(selector: (state: MathState) => T): T {
  const store = useContext(MathContext);
  if (!store) {
    throw new Error('useMathStore debe usarse dentro de un MathProvider');
  }
  return useStore(store, selector);
}
