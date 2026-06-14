import { create } from 'zustand';
import React from 'react';

interface LessonState {
  activeSimulation: React.ComponentType<any> | null;
  setActiveSimulation: (sim: React.ComponentType<any> | null) => void;
  defaultSimulation: React.ComponentType<any> | null;
  setDefaultSimulation: (sim: React.ComponentType<any> | null) => void;
}

export const useLessonStore = create<LessonState>((set) => ({
  activeSimulation: null,
  setActiveSimulation: (sim) => set({ activeSimulation: sim }),
  defaultSimulation: null,
  setDefaultSimulation: (sim) => set({ defaultSimulation: sim }),
}));
