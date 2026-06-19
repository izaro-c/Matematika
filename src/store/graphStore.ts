import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { computeGraph } from '../workers/graph.worker';
import type { FlowNode, FlowEdge } from '../workers/graph.worker';
import type { ModelInfo } from './graphTypes';
import { computeDisabledAxiomsFromModels } from './graphUtils';
import { db } from '../store/content';

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

export const useGraphStore = create<GraphState>()(
  persist(
    (set, get) => ({
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
        const newDisabled = computeDisabledAxiomsFromModels(state.models, activeModels.map(m => m.id));
        set({ disabledAxioms: newDisabled, isLoading: true });
        computeGraph(newDisabled).then((result) =>
          set({ baseNodes: result.nodes, edges: result.edges, adjacency: result.adjacency, dependsOn: result.dependsOn, activeStates: result.activeStates, isLoading: false }),
        );
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
    }),
    {
      name: 'graph-model-storage',
      partialize: (state) => ({
        inactiveModels: state.inactiveModels,
        disabledAxioms: state.disabledAxioms,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<GraphState> | undefined;
        if (!p?.inactiveModels || !Array.isArray(p.inactiveModels)) {
          return current;
        }
        const validIds = current.models.map(m => m.id);
        const inactiveModels = p.inactiveModels.filter((id: string) => validIds.includes(id));
        const activeModels = current.models.filter(m => !inactiveModels.includes(m.id));
        const disabledAxioms = computeDisabledAxiomsFromModels(
          current.models, activeModels.map(m => m.id)
        );
        return { ...current, inactiveModels, disabledAxioms };
      },
    }
  )
);
