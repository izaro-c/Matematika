import { create } from 'zustand';
export { dictionary, texSymbolMap } from '@/shared/lib/glossaryDictionary';
export type { GlossaryEntry, GlossaryCategory } from '@/shared/lib/glossaryDictionary';

/**
 * GlossaryState - Estado global de Zustand para el Glosario y Fórmulas
 */
export interface GlossaryState {
  activeTerms: string[] | null;
  activeFormulaTerms: string[] | null;
  displayMode: 'sidebar' | 'modal';
  openTerm: (termId: string | string[]) => void;
  openFormulaTerms: (termIds: string[]) => void;
  closeTerm: () => void;
  toggleDisplayMode: () => void;
}

/**
 * Hook global de Zustand para acceder al estado del Glosario interactivo.
 * Controla qué término o fórmulas están seleccionadas para mostrarse en la UI.
 */
export const useGlossaryStore = create<GlossaryState>((set) => ({
  activeTerms: null,
  activeFormulaTerms: null,
  displayMode: 'sidebar',
  openTerm: (termId) => set({ activeTerms: Array.isArray(termId) ? termId : [termId], activeFormulaTerms: null }),
  openFormulaTerms: (termIds) => set({ activeFormulaTerms: termIds, activeTerms: null }),
  closeTerm: () => set({ activeTerms: null, activeFormulaTerms: null }),
  toggleDisplayMode: () => set((state) => ({ displayMode: state.displayMode === 'sidebar' ? 'modal' : 'sidebar' }))
}));
