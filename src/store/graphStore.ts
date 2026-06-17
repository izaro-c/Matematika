import { create } from 'zustand';
import { computeGraph } from '../workers/graph.worker';
import type { FlowNode, FlowEdge } from '../workers/graph.worker';
import { db } from '../store/content';

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
  /** Para cada nodo, lista de IDs de los que depende directamente */
  dependsOn: Record<string, string[]>;
  activeStates: Record<string, boolean>;
  disabledAxioms: string[];
  isLoading: boolean;

  models: ModelInfo[];
  inactiveModels: string[];

  toggleAxiom: (axiomId: string) => void;
  toggleModel: (modelId: string) => void;
  initWorker: () => void;
  getAdjacency: () => Record<string, string[]>;
  getDependsOn: () => Record<string, string[]>;
}

let initialized = false;

export const useGraphStore = create<GraphState>((set, get) => ({
  baseNodes: [],
  edges: [],
  adjacency: {},
  dependsOn: {},
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
    computeGraph(newDisabled).then((result) =>
      set({ baseNodes: result.nodes, edges: result.edges, adjacency: result.adjacency, dependsOn: result.dependsOn, activeStates: result.activeStates, isLoading: false }),
    );
  },

  toggleModel: (modelId: string) => {
    const state = get();
    const isActive = !state.inactiveModels.includes(modelId);
    let newInactive: string[];
    if (isActive) {
      newInactive = state.models.map(m => m.id);
    } else {
      newInactive = state.models.filter(m => m.id !== modelId).map(m => m.id);
    }
    set({ inactiveModels: newInactive });

    const activeModels = state.models.filter(m => !newInactive.includes(m.id));
    if (activeModels.length > 0) {
      const enabledAxioms = new Set<string>();
      activeModels.forEach(m => m.axioms.forEach(ax => enabledAxioms.add(ax)));
      const allAxioms = state.models.flatMap(m => m.axioms);
      const newDisabled = allAxioms.filter(ax => !enabledAxioms.has(ax));
      set({ disabledAxioms: newDisabled, isLoading: true });
      computeGraph(newDisabled).then((result) =>
        set({ baseNodes: result.nodes, edges: result.edges, adjacency: result.adjacency, dependsOn: result.dependsOn, activeStates: result.activeStates, isLoading: false }),
      );
    } else {
      set({ disabledAxioms: [], isLoading: true });
      computeGraph([]).then((result) =>
        set({ baseNodes: result.nodes, edges: result.edges, adjacency: result.adjacency, dependsOn: result.dependsOn, activeStates: result.activeStates, isLoading: false }),
      );
    }
  },

  initWorker: () => {
    if (initialized) return;
    initialized = true;
    computeGraph(get().disabledAxioms).then((result) =>
      set({ baseNodes: result.nodes, edges: result.edges, adjacency: result.adjacency, dependsOn: result.dependsOn, activeStates: result.activeStates, isLoading: false }),
    );
  },

  getAdjacency: () => get().adjacency,
  getDependsOn: () => get().dependsOn,
}));
