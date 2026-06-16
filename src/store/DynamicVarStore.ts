import { create } from 'zustand';

interface DynamicVarState {
  vars: Record<string, number>;
  setVar: (name: string, value: number) => void;
  getVar: (name: string, fallback: number) => number;
  reset: () => void;
}

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
