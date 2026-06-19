import { create } from 'zustand';
import type { GraphStructure } from './graphTypes';
import { evaluateActiveGraph } from './graphUtils';
import graphStructureData from './graph_structure.json';

const staticGraphData = graphStructureData as GraphStructure;

export interface GraphSandboxState {
  activeAxioms: Record<string, boolean>;
  validNodes: Set<string>;
  toggleAxiom: (axiomId: string) => void;
  setAxioms: (axioms: Record<string, boolean>) => void;
  loadModel: (modelId: string, modelAxioms: string[]) => void;
  sandboxEnabled: boolean;
  toggleSandbox: () => void;
  clearSandbox: () => void;
}

export const useGraphSandboxStore = create<GraphSandboxState>((set) => ({
  sandboxEnabled: false,
  activeAxioms: {},
  validNodes: new Set<string>(),

  toggleSandbox: () => set((state) => ({ sandboxEnabled: !state.sandboxEnabled })),

  toggleAxiom: (axiomId: string) => set((state) => {
    const newAxioms = { ...state.activeAxioms };
    if (newAxioms[axiomId]) {
      delete newAxioms[axiomId];
    } else {
      newAxioms[axiomId] = true;
    }
    const newValidNodes = evaluateActiveGraph(newAxioms, staticGraphData);
    return { activeAxioms: newAxioms, validNodes: newValidNodes };
  }),

  setAxioms: (axioms: Record<string, boolean>) => {
    const newValidNodes = evaluateActiveGraph(axioms, staticGraphData);
    set({ activeAxioms: axioms, validNodes: newValidNodes });
  },

  loadModel: (_modelId: string, modelAxioms: string[]) => {
    const newAxioms: Record<string, boolean> = {};
    modelAxioms.forEach(axiom => {
      newAxioms[axiom] = true;
    });
    const newValidNodes = evaluateActiveGraph(newAxioms, staticGraphData);
    set({ activeAxioms: newAxioms, validNodes: newValidNodes });
  },

  clearSandbox: () => {
    const newValidNodes = evaluateActiveGraph({}, staticGraphData);
    set({ activeAxioms: {}, validNodes: newValidNodes });
  }
}));
