import { create } from 'zustand';
import graphStructureData from './graph_structure.json';

export interface GraphNodeProof {
  id: string;
  dependencies: string[];
}

export interface GraphNode {
  type: string;
  proofs: GraphNodeProof[];
  directDependencies: string[];
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphStructure {
  topologicalOrder: string[];
  nodes: Record<string, GraphNode>;
}

const staticGraphData = graphStructureData as GraphStructure;

export interface GraphSandboxState {
  // Diccionario de axiomas activos: { "axioma-paralelas": true, ... }
  activeAxioms: Record<string, boolean>;
  
  // Set de nodos válidos dados los axiomas actuales
  validNodes: Set<string>;
  
  // Acciones
  toggleAxiom: (axiomId: string) => void;
  setAxioms: (axioms: Record<string, boolean>) => void;
  
  // Utilidad para cargar rápidamente todos los axiomas de un modelo predefinido
  loadModel: (modelId: string, modelAxioms: string[]) => void;
  
  // Si el sandbox está activado o no
  sandboxEnabled: boolean;
  toggleSandbox: () => void;
  
  // Limpia el sandbox (apaga todos los axiomas)
  clearSandbox: () => void;
}

/**
 * Función pura de podado rápido (Runtime O(V+E)).
 * Evalúa qué nodos son lógicamente válidos a partir de un conjunto de axiomas activos,
 * procesando los nodos en orden topológico pre-calculado.
 */
export function evaluateActiveGraph(
  activeAxioms: Record<string, boolean>,
  staticGraphData: GraphStructure
): Set<string> {
  const validNodes = new Set<string>();

  // Inyectar axiomas activos iniciales
  for (const [axiomId, isActive] of Object.entries(activeAxioms)) {
    if (isActive) {
      validNodes.add(axiomId);
    }
  }

  // Recorrer nodos en orden topológico garantizado
  for (const nodeId of staticGraphData.topologicalOrder) {
    if (validNodes.has(nodeId)) continue; // Ya es válido (ej. axioma)

    const node = staticGraphData.nodes[nodeId];
    if (!node) continue;

    const isTheoremLike = node.type === 'teorema' || node.type === 'theorem' || node.type === 'lemma' || node.type === 'corollary';
    
    // Nodos universales (definiciones, lecciones, etc sin demostraciones)
    if (!isTheoremLike && node.type !== 'axioma' && node.type !== 'modelo') {
      // Valid if all directDependencies are valid (or none)
      const allDepsValid = node.directDependencies.length === 0 ||
        node.directDependencies.every(depId => validNodes.has(depId));
      if (allDepsValid) validNodes.add(nodeId);
      continue;
    }

    if (isTheoremLike) {
      if (node.proofs && node.proofs.length > 0) {
        // Un teorema es válido si *al menos una* demostración es válida (OR)
        const hasValidProof = node.proofs.some(proof => {
          // Una demostración es válida si *todas* sus dependencias son válidas (AND)
          return proof.dependencies.every(depId => validNodes.has(depId));
        });
        if (hasValidProof) {
          validNodes.add(nodeId);
        }
      } else if (node.directDependencies.length === 0) {
        // Theorem with no proofs and no deps is treated as active
        validNodes.add(nodeId);
      }
    }
  }

  return validNodes;
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
