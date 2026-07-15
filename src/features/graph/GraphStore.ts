/**
 * @fileoverview Store global (Zustand) que gestiona el estado y la lógica del grafo de conocimiento.
 * Controla qué modelos matemáticos, sistemas axiomáticos o axiomas individuales están activos.
 * Delega el cálculo pesado de dependencias a un Web Worker (`computeGraph`).
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  isGraphWorkerStructure,
  normalizeGraphWorkerError,
} from './lib/graphWorkerContract';
import type {
  FlowEdge,
  FlowNode,
  GraphWorkerError,
} from './lib/graphWorkerContract';
import { graphWorkerClient } from './lib/graphWorkerClient';
import type { ModelInfo, SystemInfo } from '@/entities/graph/graphTypes';
import {
  disabledAxiomIdsFromActive,
  normalizeActiveAxiomIds,
  type SelectableAxiom,
} from '@/entities/graph/axiomSelection';
import { db } from '@/entities/content';
import graphStructureData from '@/entities/graph/graph_structure.json';

let graphInitialized = false;
let workerDisabledAxioms: string[] | null = null;
let initializationPromise: Promise<void> | null = null;
let evaluationInFlight = false;
let queuedDisabledAxioms: string[] | null = null;

const AXIOM_CATALOG: SelectableAxiom[] = db.getAllAxioms().map((axiom) => ({
  id: axiom.id,
  alternativeGroup: axiom.alternativeGroup,
}));
const MODEL_CATALOG: ModelInfo[] = db.getAllModels().map((model) => ({
  id: model.id,
  title: model.title,
  axioms: model.axioms_verified || [],
}));
const SYSTEM_CATALOG: SystemInfo[] = db.getAllAxiomaticSystems().map((system) => ({
  id: system.id,
  title: system.title,
  axioms: system.axiomas || [],
}));

function normalizedDisabledAxioms(
  requestedActiveAxiomIds: Iterable<string>,
  preferredAxiomId?: string,
): string[] {
  const active = normalizeActiveAxiomIds(
    AXIOM_CATALOG,
    requestedActiveAxiomIds,
    preferredAxiomId,
  );
  return disabledAxiomIdsFromActive(AXIOM_CATALOG, active);
}

function disabledAxiomsForFramework(framework: ModelInfo | SystemInfo): string[] {
  return normalizedDisabledAxioms(framework.axioms);
}

// La base neutral es independiente de cualquier rama matemática concreta:
// incluye los axiomas sin decisión alternativa y deja cada disyuntiva abierta.
const NEUTRAL_ACTIVE_AXIOM_IDS = AXIOM_CATALOG
  .filter((axiom) => !axiom.alternativeGroup)
  .map((axiom) => axiom.id);
const DEFAULT_DISABLED_AXIOMS = normalizedDisabledAxioms(NEUTRAL_ACTIVE_AXIOM_IDS);


/**
 * Interfaz que define el estado global del Grafo.
 */
export type GraphLoadStatus = 'loading' | 'success' | 'error';

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
  /** Estado explícito de la petición más reciente. */
  status: GraphLoadStatus;
  /** Error normalizado de la petición más reciente, si existe. */
  error: GraphWorkerError | null;

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

  /** Sustituye la selección axiomática por un conjunto explícito de axiomas activos. */
  setActiveAxioms: (axiomIds: string[]) => void;
  
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

type PersistedGraphState = Pick<
  GraphState,
  'inactiveModels' | 'inactiveSystems' | 'disabledAxioms'
>;

type GraphStoreSet = (partial: Partial<GraphState>) => void;
type GraphStoreGet = () => GraphState;

function sameAxiomSelection(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return false;
  const rightSet = new Set(right);
  return left.every((id) => rightSet.has(id));
}

function applyGraphError(set: GraphStoreSet, error: unknown): void {
  set({
    isLoading: false,
    status: 'error',
    error: normalizeGraphWorkerError(error, 'WORKER_ERROR'),
  });
}

function invalidateGraphSession(): void {
  graphInitialized = false;
  workerDisabledAxioms = null;
}

function ensureGraphInitialized(
  set: GraphStoreSet,
  disabledAxioms: string[],
): Promise<void> {
  if (graphInitialized) return Promise.resolve();
  if (initializationPromise) return initializationPromise;

  set({ isLoading: true, status: 'loading', error: null });

  if (!isGraphWorkerStructure(graphStructureData)) {
    const error: GraphWorkerError = {
      code: 'INVALID_REQUEST',
      message: 'Invalid graph structure data',
    };
    applyGraphError(set, error);
    return Promise.reject(error);
  }

  const initializedAxioms = [...disabledAxioms];
  initializationPromise = graphWorkerClient.initialize(graphStructureData, initializedAxioms)
    .then((result) => {
      graphInitialized = true;
      workerDisabledAxioms = initializedAxioms;
      if (queuedDisabledAxioms && sameAxiomSelection(queuedDisabledAxioms, initializedAxioms)) {
        queuedDisabledAxioms = null;
      }
      set({
        baseNodes: result.nodes,
        edges: result.edges,
        adjacency: result.adjacency,
        dependsOn: result.dependsOn,
        activeStates: result.activeStates,
        isLoading: queuedDisabledAxioms !== null,
        status: queuedDisabledAxioms === null ? 'success' : 'loading',
        error: null,
      });
    })
    .catch((error: unknown) => {
      invalidateGraphSession();
      queuedDisabledAxioms = null;
      applyGraphError(set, error);
      throw error;
    })
    .finally(() => {
      initializationPromise = null;
    });

  return initializationPromise;
}

function flushQueuedEvaluation(set: GraphStoreSet, get: GraphStoreGet): void {
  if (!graphInitialized || evaluationInFlight || !queuedDisabledAxioms) return;

  if (workerDisabledAxioms && sameAxiomSelection(workerDisabledAxioms, queuedDisabledAxioms)) {
    queuedDisabledAxioms = null;
    set({ isLoading: false, status: 'success', error: null });
    return;
  }

  const disabledAxioms = queuedDisabledAxioms;
  queuedDisabledAxioms = null;
  evaluationInFlight = true;
  graphWorkerClient.evaluate(disabledAxioms)
    .then((result) => {
      workerDisabledAxioms = disabledAxioms;
      set({
        activeStates: {
          ...get().activeStates,
          ...result.changedActiveStates,
        },
        isLoading: queuedDisabledAxioms !== null,
        status: queuedDisabledAxioms === null ? 'success' : 'loading',
        error: null,
      });
    })
    .catch((error: unknown) => {
      invalidateGraphSession();
      queuedDisabledAxioms = null;
      applyGraphError(set, error);
    })
    .finally(() => {
      evaluationInFlight = false;
      flushQueuedEvaluation(set, get);
    });
}

function requestGraphState(
  set: GraphStoreSet,
  get: GraphStoreGet,
  disabledAxioms: string[],
): void {
  queuedDisabledAxioms = [...disabledAxioms];
  set({ isLoading: true, status: 'loading', error: null });

  ensureGraphInitialized(set, disabledAxioms)
    .then(() => flushQueuedEvaluation(set, get))
    .catch(() => {
      // `ensureGraphInitialized` ya publica el error normalizado en el store.
    });
}

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
      // La base neutral no elige ninguna alternativa incompatible.
      disabledAxioms: DEFAULT_DISABLED_AXIOMS,
      isLoading: true,
      status: 'loading',
      error: null,

      // Carga inicial síncrona desde la "base de datos" (archivos MDX transformados)
      axioms: AXIOM_CATALOG.map((axiom) => axiom.id),
      models: MODEL_CATALOG,
      // Por defecto, todos los modelos inician apagados.
      inactiveModels: MODEL_CATALOG.map((model) => model.id),
      systems: SYSTEM_CATALOG,
      // Ningún sistema temático queda privilegiado como marco inicial.
      inactiveSystems: SYSTEM_CATALOG.map((system) => system.id),

      toggleAxiom: (axiomId: string) => {
        const state = get();
        if (!state.axioms.includes(axiomId)) return;

        const wasDisabled = state.disabledAxioms.includes(axiomId);
        const requestedActive = state.axioms.filter((id) => (
          id === axiomId ? wasDisabled : !state.disabledAxioms.includes(id)
        ));
        const newDisabled = normalizedDisabledAxioms(
          requestedActive,
          wasDisabled ? axiomId : undefined,
        );
          
        // Si tocamos un axioma individual, perdemos la "coherencia" de sistemas enteros, 
        // así que reseteamos los selectores visuales de modelos y sistemas a "desactivado".
        const allModelsOff = state.models.map(m => m.id);
        const allSystemsOff = state.systems.map(s => s.id);
        
        set({ disabledAxioms: newDisabled, inactiveModels: allModelsOff, inactiveSystems: allSystemsOff });
        
        requestGraphState(set, get, newDisabled);
      },

      setActiveAxioms: (axiomIds: string[]) => {
        const state = get();
        const newDisabled = normalizedDisabledAxioms(axiomIds);

        set({
          disabledAxioms: newDisabled,
          inactiveModels: state.models.map((model) => model.id),
          inactiveSystems: state.systems.map((system) => system.id),
        });
        requestGraphState(set, get, newDisabled);
      },

      toggleModel: (modelId: string) => {
        const state = get();
        const selectedModel = state.models.find((model) => model.id === modelId);
        if (!selectedModel) return;

        // Los menús seleccionan un marco; volver a elegirlo no vacía la base.
        const newInactive = state.models.filter((model) => model.id !== modelId).map((model) => model.id);
        const allSystemsOff = state.systems.map(s => s.id);
        const newDisabled = disabledAxiomsForFramework(selectedModel);

        set({
          inactiveModels: newInactive,
          inactiveSystems: allSystemsOff,
          disabledAxioms: newDisabled,
        });
        
        requestGraphState(set, get, newDisabled);
      },

      toggleSystem: (systemId: string) => {
        const state = get();
        const selectedSystem = state.systems.find((system) => system.id === systemId);
        if (!selectedSystem) return;

        const newInactive = state.systems.filter((system) => system.id !== systemId).map((system) => system.id);
        const allModelsOff = state.models.map(m => m.id);
        const newDisabled = disabledAxiomsForFramework(selectedSystem);

        set({
          inactiveSystems: newInactive,
          inactiveModels: allModelsOff,
          disabledAxioms: newDisabled,
        });
        
        requestGraphState(set, get, newDisabled);
      },

      initWorker: () => {
        requestGraphState(set, get, get().disabledAxioms);
      },

      getAdjacency: () => get().adjacency,
      getDependsOn: () => get().dependsOn,
    }),
    {
      name: 'graph-model-storage',
      version: 2,
      // La migración estructural se completa en `merge`, donde está disponible
      // el catálogo vigente para retirar alternativas contradictorias.
      migrate: (persisted): PersistedGraphState => {
        const legacy = persisted as Partial<PersistedGraphState> | undefined;
        return {
          inactiveModels: Array.isArray(legacy?.inactiveModels)
            ? legacy.inactiveModels
            : MODEL_CATALOG.map((model) => model.id),
          inactiveSystems: Array.isArray(legacy?.inactiveSystems)
            ? legacy.inactiveSystems
            : SYSTEM_CATALOG.map((system) => system.id),
          disabledAxioms: Array.isArray(legacy?.disabledAxioms)
            ? legacy.disabledAxioms
            : [],
        };
      },
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

        const activeSystem = current.systems.find((system) => !inactiveSystems.includes(system.id));
        const activeModel = current.models.find((model) => !inactiveModels.includes(model.id));

        let disabledAxioms: string[];
        let normalizedInactiveSystems: string[];
        let normalizedInactiveModels: string[];

        if (activeSystem) {
          disabledAxioms = disabledAxiomsForFramework(activeSystem);
          normalizedInactiveSystems = current.systems
            .filter((system) => system.id !== activeSystem.id)
            .map((system) => system.id);
          normalizedInactiveModels = current.models.map((model) => model.id);
        } else if (activeModel) {
          disabledAxioms = disabledAxiomsForFramework(activeModel);
          normalizedInactiveModels = current.models
            .filter((model) => model.id !== activeModel.id)
            .map((model) => model.id);
          normalizedInactiveSystems = current.systems.map((system) => system.id);
        } else {
          const persistedDisabled = Array.isArray(p.disabledAxioms)
            ? p.disabledAxioms.filter((id): id is string => typeof id === 'string')
            : current.disabledAxioms;
          const persistedDisabledSet = new Set(persistedDisabled);
          const requestedActive = current.axioms.filter((id) => !persistedDisabledSet.has(id));
          disabledAxioms = normalizedDisabledAxioms(requestedActive);

          // Una selección manual continúa siendo manual aunque coincida con un
          // sistema conocido: ningún dominio obtiene prioridad por migración.
          normalizedInactiveSystems = current.systems.map((system) => system.id);
          normalizedInactiveModels = current.models.map((model) => model.id);
        }

        return {
          ...current,
          inactiveModels: normalizedInactiveModels,
          inactiveSystems: normalizedInactiveSystems,
          disabledAxioms,
        };
      },
    }
  )
);
