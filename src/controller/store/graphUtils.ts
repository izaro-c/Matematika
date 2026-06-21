/**
 * @fileoverview Utilidades algorítmicas puras para la manipulación y evaluación del grafo de dependencias lógico.
 */

import type { GraphStructure, ModelInfo } from '@/entity/graphTypes';

/**
 * Evalúa qué nodos son lógicamente válidos a partir de un conjunto de axiomas activos,
 * procesando los nodos en un orden topológico pre-calculado para asegurar la consistencia causal (O(V+E)).
 * 
 * Un nodo es válido si y solo si todas sus dependencias lógicas previas (directas o vía demostración) son válidas.
 *
 * @param activeAxioms - Diccionario de identificadores de axioma donde `true` indica que el axioma es asumido como verdadero.
 * @param staticGraphData - Estructura completa del grafo generada en build-time con el orden topológico y nodos.
 * @returns Un conjunto (Set) con los identificadores (slugs) de todos los nodos que resultan lógicamente válidos.
 */
export function evaluateActiveGraph(
  activeAxioms: Record<string, boolean>,
  staticGraphData: GraphStructure
): Set<string> {
  const validNodes = new Set<string>();

  // 1. Inicializamos los nodos válidos con los axiomas activos
  for (const [axiomId, isActive] of Object.entries(activeAxioms)) {
    if (isActive) {
      validNodes.add(axiomId);
    }
  }

  // 2. Evaluamos el resto de nodos siguiendo el orden topológico
  for (const nodeId of staticGraphData.topologicalOrder) {
    if (validNodes.has(nodeId)) continue; // Ya es válido

    const node = staticGraphData.nodes[nodeId];
    if (!node) continue; // Nodo no existe en metadata

    const isTheoremLike = node.type === 'teorema' || node.type === 'theorem' ||
      node.type === 'lema' || node.type === 'lemma' || node.type === 'corolario' || node.type === 'corollary';

    // Para definiciones u otros nodos no demostrables: son válidos si todas sus dependencias directas lo son.
    if (!isTheoremLike && node.type !== 'axioma' && node.type !== 'modelo') {
      const allDepsValid = node.directDependencies.length === 0 ||
        node.directDependencies.every(depId => validNodes.has(depId));
      if (allDepsValid) validNodes.add(nodeId);
      continue;
    }

    // Para teoremas: son válidos si al menos una de sus pruebas (demostraciones) tiene todas sus dependencias satisfechas.
    if (isTheoremLike) {
      if (node.proofs && node.proofs.length > 0) {
        const hasValidProof = node.proofs.some(proof =>
          proof.dependencies.every(depId => validNodes.has(depId)),
        );
        if (hasValidProof) {
          validNodes.add(nodeId);
        }
      } else if (node.directDependencies.length === 0) {
        // Teorema asumido sin prueba explícita ni dependencias (comportamiento laxo temporal o caso base)
        validNodes.add(nodeId);
      }
    }
  }

  return validNodes;
}

/**
 * Calcula qué axiomas deben desactivarse dado un conjunto activo de modelos concretos.
 * Si no hay modelos activos, retorna array vacío (ningún axioma desactivado).
 * 
 * Este comportamiento modela la lógica donde un modelo específico (ej. Geometría Hiperbólica)
 * restringe qué axiomas (ej. Paralelas de Euclides) son aplicables.
 *
 * @param models - Lista de todos los metadatos de los modelos disponibles.
 * @param activeModelIds - Array con los IDs de los modelos que están actualmente activos en la vista.
 * @param allAxioms - Array con los IDs de todos los axiomas existentes en el sistema.
 * @returns Array con los IDs de los axiomas que deben quedar deshabilitados (porque ningún modelo activo los satisface).
 */
export function computeDisabledAxiomsFromModels(
  models: ModelInfo[],
  activeModelIds: string[],
  allAxioms: string[],
): string[] {
  if (activeModelIds.length === 0) return [];

  const activeModels = models.filter(m => activeModelIds.includes(m.id));
  
  // Conjunto de axiomas satisfechos por la unión de todos los modelos activos
  const enabledAxioms = new Set<string>();
  activeModels.forEach(m => m.axioms.forEach(ax => enabledAxioms.add(ax)));
  
  // Si un axioma no pertenece al conjunto de satisfechos, debe desactivarse
  const disabledAxioms = allAxioms.filter(ax => (!enabledAxioms.has(ax)));
  return disabledAxioms;
}
