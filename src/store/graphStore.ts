import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { computeGraph } from '../workers/graph.worker';
import type { FlowNode, FlowEdge } from '../workers/graph.worker';
import type { ModelInfo, SystemInfo } from './graphTypes';
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
  systems: SystemInfo[];
  inactiveSystems: string[];
  axioms: string[];

  toggleAxiom: (axiomId: string) => void;
  toggleModel: (modelId: string) => void;
  toggleSystem: (systemId: string) => void;
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

      axioms: db.getAllAxioms().map(a => (a.id)),
      models: db.getAllModels().map(m => ({
        id: m.id,
        title: m.title,
        axioms: m.axioms_verified || [],
      })),
      inactiveModels: db.getAllModels().map(m => m.id),
      systems: db.getAllAxiomaticSystems().map(s => ({
        id: s.id,
        title: s.title,
        axioms: s.axiomas || [],
      })),
      inactiveSystems: db.getAllAxiomaticSystems().map(s => s.id),

      toggleAxiom: (axiomId: string) => {
        const state = get();
        const newDisabled = state.disabledAxioms.includes(axiomId)
          ? state.disabledAxioms.filter((id) => id !== axiomId)
          : [...state.disabledAxioms, axiomId];
        const allModelsOff = state.models.map(m => m.id);
        const allSystemsOff = state.systems.map(s => s.id);
        set({ disabledAxioms: newDisabled, inactiveModels: allModelsOff, inactiveSystems: allSystemsOff, isLoading: true });
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
        const allSystemsOff = state.systems.map(s => s.id);
        set({ inactiveModels: newInactive, inactiveSystems: allSystemsOff });

        const activeModels = state.models.filter(m => !newInactive.includes(m.id));
        const newDisabled = computeDisabledAxiomsFromModels(state.models.map(s => ({ id: s.id, title: s.title, axioms: s.axioms })), activeModels.map(m => m.id), state.axioms);
        set({ disabledAxioms: newDisabled, isLoading: true });
        computeGraph(newDisabled).then((result) =>
          set({ baseNodes: result.nodes, edges: result.edges, adjacency: result.adjacency, dependsOn: result.dependsOn, activeStates: result.activeStates, isLoading: false }),
        );
      },

      toggleSystem: (systemId: string) => {
        const state = get();
        const isActive = !state.inactiveSystems.includes(systemId);
        let newInactive: string[];
        if (isActive) {
          newInactive = state.systems.map(s => s.id);
        } else {
          newInactive = state.systems.filter(s => s.id !== systemId).map(s => s.id);
        }
        const allModelsOff = state.models.map(m => m.id);
        set({ inactiveSystems: newInactive, inactiveModels: allModelsOff });

        const activeSystems = state.systems.filter(s => !newInactive.includes(s.id));
        const newDisabled = computeDisabledAxiomsFromModels(
          state.systems.map(s => ({ id: s.id, title: s.title, axioms: s.axioms })),
          activeSystems.map(s => s.id),
          state.axioms,
        );
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
        inactiveSystems: state.inactiveSystems,
        disabledAxioms: state.disabledAxioms,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<GraphState> | undefined;
        if (!p?.inactiveModels || !Array.isArray(p.inactiveModels)) {
          return current;
        }
        const validModelIds = current.models.map(m => m.id);
        const inactiveModels = p.inactiveModels.filter((id: string) => validModelIds.includes(id));
        const validSystemIds = current.systems.map(s => s.id);
        const inactiveSystems = (p.inactiveSystems && Array.isArray(p.inactiveSystems))
          ? p.inactiveSystems.filter((id: string) => validSystemIds.includes(id))
          : current.inactiveSystems;

        let disabledAxioms: string[];
        const activeSystems = current.systems.filter(s => !inactiveSystems.includes(s.id));
        if (activeSystems.length > 0) {
          disabledAxioms = computeDisabledAxiomsFromModels(
            current.systems.map(s => ({ id: s.id, title: s.title, axioms: s.axioms })),
            activeSystems.map(s => s.id),
            current.axioms,
          );
        } else {
          const activeModels = current.models.filter(m => !inactiveModels.includes(m.id));
          disabledAxioms = computeDisabledAxiomsFromModels(current.models.map(s => ({ id: s.id, title: s.title, axioms: s.axioms })), activeModels.map(m => m.id), current.axioms);
        }
        return { ...current, inactiveModels, inactiveSystems, disabledAxioms };
      },
    }
  )
);
