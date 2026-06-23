/**
 * @fileoverview Store secundario para el modo Sandbox del grafo.
 * Permite al usuario jugar con la activación de axiomas de forma aislada
 * sin modificar el estado global principal de `graphStore`.
 */

import { create } from 'zustand';
import type { GraphStructure } from '@/entities/graph/graphTypes';
import { Grafo } from '@/entities/graph/Grafo';
import graphStructureData from '@/entities/graph/graph_structure.json';

const staticGraphData = graphStructureData as GraphStructure;
const grafo = Grafo.from(staticGraphData);

export interface GraphSandboxState {
  activeAxioms: Record<string, boolean>;
  validNodes: Set<string>;
  sandboxEnabled: boolean;

  toggleAxiom: (axiomId: string) => void;
  setAxioms: (axioms: Record<string, boolean>) => void;
  loadModel: (modelId: string, modelAxioms: string[]) => void;
  toggleSandbox: () => void;
  clearSandbox: () => void;
}

export const useGraphSandboxStore = create<GraphSandboxState>((set) => ({
  sandboxEnabled: false,
  activeAxioms: {},
  validNodes: new Set<string>(),

  toggleSandbox: () => set((state) => ({ sandboxEnabled: !state.sandboxEnabled })),

  toggleAxiom: (axiomId: string) =>
    set((state) => {
      const newAxioms = { ...state.activeAxioms };
      if (newAxioms[axiomId]) {
        delete newAxioms[axiomId];
      } else {
        newAxioms[axiomId] = true;
      }
      const newValidNodes = grafo.evaluate(newAxioms);
      return { activeAxioms: newAxioms, validNodes: newValidNodes };
    }),

  setAxioms: (axioms: Record<string, boolean>) => {
    const newValidNodes = grafo.evaluate(axioms);
    set({ activeAxioms: axioms, validNodes: newValidNodes });
  },

  loadModel: (_modelId: string, modelAxioms: string[]) => {
    const newAxioms: Record<string, boolean> = {};
    for (const axiom of modelAxioms) {
      newAxioms[axiom] = true;
    }
    const newValidNodes = grafo.evaluate(newAxioms);
    set({ activeAxioms: newAxioms, validNodes: newValidNodes });
  },

  clearSandbox: () => {
    const newValidNodes = grafo.evaluate({});
    set({ activeAxioms: {}, validNodes: newValidNodes });
  },
}));
