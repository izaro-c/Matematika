import { create } from 'zustand';

/**
 * Estado global de la barra de navegación y búsqueda.
 */
interface NavigationState {
  /** Flag que indica si la barra de búsqueda global (Omnibar) está abierta */
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

/**
 * Store de Zustand para la orquestación UI de nivel superior (ej. búsqueda global Cmd+K).
 */
export const useNavigationStore = create<NavigationState>((set) => ({
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen }))
}));
