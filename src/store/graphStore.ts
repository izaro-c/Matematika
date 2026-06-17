import { create } from 'zustand';
import type { FlowNode, FlowEdge, WorkerInput, WorkerOutput } from '../workers/graph.worker';
import { db } from '../store/content';

// @ts-ignore - Vite worker import syntax
import GraphWorker from '../workers/graph.worker?worker';

interface ModelInfo {
  id: string;
  title: string;
  axioms: string[];
}

interface GraphState {
  /** Nodos con posiciones estables (nunca cambian en hover) */
  baseNodes: FlowNode[];
  edges: FlowEdge[];
  /** Lista de adyacencia bidireccional para BFS local en el componente */
  adjacency: Record<string, string[]>;
  activeStates: Record<string, boolean>;
  disabledAxioms: string[];
  isLoading: boolean;

  models: ModelInfo[];
  inactiveModels: string[];

  toggleAxiom: (axiomId: string) => void;
  toggleModel: (modelId: string) => void;
  initWorker: () => void;
  getAdjacency: () => Record<string, string[]>;
}

const worker = new GraphWorker();
let initialized = false;

// El worker actualiza el store directamente: no hay callback circular
worker.onmessage = (e: MessageEvent<WorkerOutput>) => {
  useGraphStore.setState({
    baseNodes: e.data.nodes,
    edges: e.data.edges,
    adjacency: e.data.adjacency,
    activeStates: e.data.activeStates,
    isLoading: false,
  });
};

export const useGraphStore = create<GraphState>((set, get) => ({
  baseNodes: [],
  edges: [],
  adjacency: {},
  activeStates: {},
  disabledAxioms: [],
  isLoading: true,
  
  models: db.getAllModels().map(m => ({
    id: m.id,
    title: m.title,
    axioms: m.axiomas || [],
  })),
  inactiveModels: db.getAllModels().map(m => m.id),

  toggleAxiom: (axiomId: string) => {
    const state = get();
    const newDisabled = state.disabledAxioms.includes(axiomId)
      ? state.disabledAxioms.filter((id) => id !== axiomId)
      : [...state.disabledAxioms, axiomId];
    set({ disabledAxioms: newDisabled, isLoading: true });
    worker.postMessage({ disabledAxioms: newDisabled } as WorkerInput);
  },

  toggleModel: (modelId: string) => {
    const state = get();
    const isActive = !state.inactiveModels.includes(modelId);
    let newInactive: string[];
    if (isActive) {
      // Model is currently active. Deactivate it (all models become inactive).
      newInactive = state.models.map(m => m.id);
    } else {
      // Activate this model and deactivate all others (only one active at a time).
      newInactive = state.models.filter(m => m.id !== modelId).map(m => m.id);
    }
    set({ inactiveModels: newInactive });

    // Recompute disabled axioms based on active models only if at least one model is active
    const activeModels = state.models.filter(m => !newInactive.includes(m.id));
    if (activeModels.length > 0) {
      const enabledAxioms = new Set<string>();
      activeModels.forEach(m => m.axioms.forEach(ax => enabledAxioms.add(ax)));
      const allAxioms = state.models.flatMap(m => m.axioms);
      const newDisabled = allAxioms.filter(ax => !enabledAxioms.has(ax));
      set({ disabledAxioms: newDisabled, isLoading: true });
      worker.postMessage({ disabledAxioms: newDisabled } as WorkerInput);
    } else {
      // No model active: allow free toggling of axioms
      set({ disabledAxioms: [], isLoading: true });
      worker.postMessage({ disabledAxioms: [] } as WorkerInput);
    }
  },

  initWorker: () => {
    if (initialized) return;
    initialized = true;
    worker.postMessage({ disabledAxioms: get().disabledAxioms } as WorkerInput);
  },

  getAdjacency: () => get().adjacency,
}));
