/**
 * @fileoverview Store secundario para el modo Sandbox del grafo.
 * Permite al usuario jugar con la activación de axiomas de forma aislada
 * sin modificar el estado global principal de `graphStore`.
 */

import { create } from 'zustand';
import type { GraphStructure } from '@/entity/graphTypes';
import { evaluateActiveGraph } from '@/controller/store/graphUtils';
import graphStructureData from '@/database/graph_structure.json';

// Carga estática de la estructura computada en build-time
const staticGraphData = graphStructureData as GraphStructure;

/**
 * Estado que gestiona el entorno de pruebas interactivo (Sandbox) de sistemas axiomáticos.
 */
export interface GraphSandboxState {
  /** Diccionario de axiomas activados manualmente en el Sandbox */
  activeAxioms: Record<string, boolean>;
  /** Nodos que resultan lógicamente válidos a partir de `activeAxioms` */
  validNodes: Set<string>;
  /** Indica si el modo interactivo (Sandbox) está renderizándose en la UI */
  sandboxEnabled: boolean;

  /**
   * Enciende o apaga un axioma específico en el entorno de pruebas.
   * @param axiomId - Identificador del axioma a alternar.
   */
  toggleAxiom: (axiomId: string) => void;
  
  /**
   * Fija un conjunto exacto de axiomas activos.
   * @param axioms - Objeto con los IDs de axioma y su estado deseado.
   */
  setAxioms: (axioms: Record<string, boolean>) => void;
  
  /**
   * Carga predefinidamente los axiomas correspondientes a un Modelo matemático conocido.
   * @param modelId - Identificador del modelo (ej: Geometría de Poincare).
   * @param modelAxioms - Lista de axiomas que ese modelo satisface.
   */
  loadModel: (modelId: string, modelAxioms: string[]) => void;
  
  /** Activa o desactiva la visualización de este entorno Sandbox */
  toggleSandbox: () => void;
  
  /** Limpia completamente la selección de axiomas volviendo a un grafo vacío */
  clearSandbox: () => void;
}

/**
 * Store Zustand para el Sandbox Axiomático.
 * Utiliza utilidades algorítmicas de `graphUtils.ts` para resolver
 * dependencias en tiempo real de manera aislada al grafo principal.
 */
export const useGraphSandboxStore = create<GraphSandboxState>((set) => ({
  sandboxEnabled: false,
  activeAxioms: {},
  validNodes: new Set<string>(),

  toggleSandbox: () => set((state) => ({ sandboxEnabled: !state.sandboxEnabled })),

  toggleAxiom: (axiomId: string) => set((state) => {
    const newAxioms = { ...state.activeAxioms };
    if (newAxioms[axiomId]) {
      delete newAxioms[axiomId]; // Apagar
    } else {
      newAxioms[axiomId] = true; // Encender
    }
    // Re-evaluar causalidad topológica
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
