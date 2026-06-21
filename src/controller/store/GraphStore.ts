/**
 * @fileoverview Store global (Zustand) que gestiona el estado y la lógica del grafo de conocimiento.
 * Controla qué modelos matemáticos, sistemas axiomáticos o axiomas individuales están activos.
 * Delega el cálculo pesado de dependencias a un Web Worker (`computeGraph`).
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { computeGraph } from '@/controller/workers/graph.worker';
import type { FlowNode, FlowEdge } from '@/controller/workers/graph.worker';
import type { ModelInfo, SystemInfo } from '@/entity/graphTypes';
import { computeDisabledAxiomsFromModels } from '@/controller/store/graphUtils';
import { db } from '@/database/dao/content';

/**
 * Interfaz que define el estado global del Grafo.
 */
interface GraphState {
  /** Nodos renderizables por el motor gráfico. Tienen posiciones base estables (nunca cambian en hover). */
  baseNodes: FlowNode[];
  /** Aristas de dependencia (flechas) a renderizar en el motor gráfico. */
  edges: FlowEdge[];
  /** Lista de adyacencia (Hacia Adelante) para algoritmos de BFS/DFS locales en la UI. */
  adjacency: Record<string, string[]>;
  /** Mapa inverso de dependencias: Para cada nodo, lista de IDs de los que depende directamente. */
  dependsOn: Record<string, string[]>;
  /** Mapa que indica qué nodos son lógicamente válidos (`true`) en función del estado axiomático actual. */
  activeStates: Record<string, boolean>;
  /** Lista de identificadores de axiomas explícitamente desactivados. */
  disabledAxioms: string[];
  /** Bandera que indica si el Worker está computando un recálculo del grafo. */
  isLoading: boolean;

  /** Lista de modelos concretos cargados estáticamente de la base de datos. */
  models: ModelInfo[];
  /** IDs de los modelos explícitamente desactivados por el usuario. */
  inactiveModels: string[];
  /** Sistemas axiomáticos completos disponibles. */
  systems: SystemInfo[];
  /** IDs de los sistemas explícitamente desactivados por el usuario. */
  inactiveSystems: string[];
  /** Lista maestra de todos los IDs de axiomas existentes. */
  axioms: string[];

  /**
   * Alterna (Activa/Desactiva) un axioma individual.
   * Esto apaga automáticamente cualquier Modelo o Sistema que dependa de él.
   * @param axiomId - Identificador del axioma a alternar.
   */
  toggleAxiom: (axiomId: string) => void;
  
  /**
   * Alterna un modelo completo. 
   * Modifica automáticamente el estado de los axiomas subyacentes.
   * @param modelId - Identificador del modelo a alternar.
   */
  toggleModel: (modelId: string) => void;
  
  /**
   * Alterna un sistema axiomático entero.
   * Modifica automáticamente el estado de los axiomas subyacentes.
   * @param systemId - Identificador del sistema a alternar.
   */
  toggleSystem: (systemId: string) => void;
  
  /**
   * Inicializa el Web Worker para el cálculo asíncrono del layout inicial.
   */
  initWorker: () => void;
  
  /** Devuelve la lista de adyacencia directa en tiempo real. */
  getAdjacency: () => Record<string, string[]>;
  
  /** Devuelve el mapa de dependencias inversas en tiempo real. */
  getDependsOn: () => Record<string, string[]>;
}

// Bandera global para evitar inicializaciones duplicadas en StrictMode de React.
let initialized = false;

/**
 * Zustand Store para el grafo, persistido en LocalStorage.
 */
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

      // Carga inicial síncrona desde la "base de datos" (archivos MDX transformados)
      axioms: db.getAllAxioms().map(a => (a.id)),
      models: db.getAllModels().map(m => ({
        id: m.id,
        title: m.title,
        axioms: m.axioms_verified || [],
      })),
      // Por defecto, todos los modelos inician apagados.
      inactiveModels: db.getAllModels().map(m => m.id),
      systems: db.getAllAxiomaticSystems().map(s => ({
        id: s.id,
        title: s.title,
        axioms: s.axiomas || [],
      })),
      // Por defecto, todos los sistemas inician apagados.
      inactiveSystems: db.getAllAxiomaticSystems().map(s => s.id),

      toggleAxiom: (axiomId: string) => {
        const state = get();
        // Calculamos la nueva lista de axiomas desactivados
        const newDisabled = state.disabledAxioms.includes(axiomId)
          ? state.disabledAxioms.filter((id) => id !== axiomId)
          : [...state.disabledAxioms, axiomId];
          
        // Si tocamos un axioma individual, perdemos la "coherencia" de sistemas enteros, 
        // así que reseteamos los selectores visuales de modelos y sistemas a "desactivado".
        const allModelsOff = state.models.map(m => m.id);
        const allSystemsOff = state.systems.map(s => s.id);
        
        set({ disabledAxioms: newDisabled, inactiveModels: allModelsOff, inactiveSystems: allSystemsOff, isLoading: true });
        
        // Recalculamos el layout topológico en el WebWorker
        computeGraph(newDisabled).then((result) =>
          set({ baseNodes: result.nodes, edges: result.edges, adjacency: result.adjacency, dependsOn: result.dependsOn, activeStates: result.activeStates, isLoading: false }),
        );
      },

      toggleModel: (modelId: string) => {
        const state = get();
        const isActive = !state.inactiveModels.includes(modelId);
        let newInactive: string[];
        
        // Comportamiento XOR para modelos: Solo uno puede estar encendido a la vez para evitar contradicciones lógicas.
        if (isActive) {
          newInactive = state.models.map(m => m.id); // Apaga todos
        } else {
          newInactive = state.models.filter(m => m.id !== modelId).map(m => m.id); // Apaga todos menos el seleccionado
        }
        
        // Al encender un modelo, apagamos sistemas abstractos
        const allSystemsOff = state.systems.map(s => s.id);
        set({ inactiveModels: newInactive, inactiveSystems: allSystemsOff });

        // Calculamos qué axiomas debemos apagar basados en el modelo encendido
        const activeModels = state.models.filter(m => !newInactive.includes(m.id));
        const newDisabled = computeDisabledAxiomsFromModels(
          state.models.map(s => ({ id: s.id, title: s.title, axioms: s.axioms })), 
          activeModels.map(m => m.id), 
          state.axioms
        );
        
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
          // Corrección de bug sintáctico previo
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
        // La inicialización usa el estado actual persistido
        computeGraph(get().disabledAxioms).then((result) =>
          set({ baseNodes: result.nodes, edges: result.edges, adjacency: result.adjacency, dependsOn: result.dependsOn, activeStates: result.activeStates, isLoading: false }),
        );
      },

      getAdjacency: () => get().adjacency,
      getDependsOn: () => get().dependsOn,
    }),
    {
      name: 'graph-model-storage',
      // Solo persistimos las decisiones de alto nivel del usuario, el grafo en sí se recalcula
      partialize: (state) => ({
        inactiveModels: state.inactiveModels,
        inactiveSystems: state.inactiveSystems,
        disabledAxioms: state.disabledAxioms,
      }),
      // Lógica de re-hidratación de estado seguro si el content index cambia tras un build
      merge: (persisted, current) => {
        const p = persisted as Partial<GraphState> | undefined;
        if (!p?.inactiveModels || !Array.isArray(p.inactiveModels)) {
          return current;
        }
        
        // Filtramos para asegurar que no hidratamos IDs fantasmas que ya no existen en los archivos MDX
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
          disabledAxioms = computeDisabledAxiomsFromModels(
            current.models.map(s => ({ id: s.id, title: s.title, axioms: s.axioms })), 
            activeModels.map(m => m.id), 
            current.axioms
          );
        }
        
        return { ...current, inactiveModels, inactiveSystems, disabledAxioms };
      },
    }
  )
);
