import { createContext } from 'react';

/**
 * Define la forma del Contexto del Plan de Estudio.
 */
export interface StudyPlanContextType {
  /** Registra un nodo/tarea (por id) junto con su referencia HTML para permitir scroll hacia él */
  registerTaskRef: (id: string, el: HTMLElement | null) => void;
}

/**
 * Contexto utilizado para coordinar la interfaz de los Planes de Estudio,
 * específicamente para gestionar las referencias DOM de los "StudyTasks" y
 * permitir animaciones o navegación programática.
 */
export const StudyPlanContext = createContext<StudyPlanContextType>({
  registerTaskRef: () => {},
});
