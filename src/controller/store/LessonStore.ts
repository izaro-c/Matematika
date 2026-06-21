import { create } from 'zustand';
import React from 'react';

/**
 * Estado para sincronizar lecciones interactivas (MDX) con su panel de simulación en vivo.
 */
interface LessonState {
  /** Componente de simulación activo actualmente (inyectado dinámicamente) */
  activeSimulation: React.ComponentType<Record<string, unknown>> | null;
  /**
   * Actualiza la simulación en pantalla (ej: activada al hacer hover en texto).
   * @param sim - Componente React o `null` para quitar la simulación activa.
   */
  setActiveSimulation: (sim: React.ComponentType<Record<string, unknown>> | null) => void;
  
  /** Simulación base por si la lección no especifica una particular en este paso */
  defaultSimulation: React.ComponentType<Record<string, unknown>> | null;

  /**
   * Establece una simulación por defecto.
   * @param sim - Componente React o `null`.
   */
  setDefaultSimulation: (sim: React.ComponentType<Record<string, unknown>> | null) => void;
  
  /** Identificador de la sección o paso actual de la lección */
  activeStep: string | null;

  /**
   * Establece el paso o sección actual.
   * @param step - Identificador del paso o `null`.
   */
  setActiveStep: (step: string | null) => void;
}

/**
 * Store de Zustand para orquestar la interacción `split-screen` entre 
 * el texto MDX (Lección) y el entorno de visualización React.
 * 
 * @example
 * ```tsx
 * const { setActiveSimulation } = useLessonStore();
 * setActiveSimulation(MyVisualizer);
 * ```
 * 
 * @returns Un hook de Zustand que expone el estado definido en `LessonState`.
 */
export const useLessonStore = create<LessonState>((set) => ({
  activeSimulation: null,
  setActiveSimulation: (sim) => set({ activeSimulation: sim }),
  defaultSimulation: null,
  setDefaultSimulation: (sim) => set({ defaultSimulation: sim }),
  activeStep: null,
  setActiveStep: (step) => set({ activeStep: step }),
}));
