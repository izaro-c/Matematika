import type { GraphStructure, ModelInfo } from './graphTypes';

/**
 * Evalúa qué nodos son lógicamente válidos a partir de un conjunto de axiomas activos,
 * procesando los nodos en orden topológico pre-calculado (Runtime O(V+E)).
 */
export function evaluateActiveGraph(
  activeAxioms: Record<string, boolean>,
  staticGraphData: GraphStructure
): Set<string> {
  const validNodes = new Set<string>();

  for (const [axiomId, isActive] of Object.entries(activeAxioms)) {
    if (isActive) {
      validNodes.add(axiomId);
    }
  }

  for (const nodeId of staticGraphData.topologicalOrder) {
    if (validNodes.has(nodeId)) continue;

    const node = staticGraphData.nodes[nodeId];
    if (!node) continue;

    const isTheoremLike = node.type === 'teorema' || node.type === 'theorem' || node.type === 'lema' || node.type === 'lemma' || node.type === 'corolario' || node.type === 'corollary';

    if (!isTheoremLike && node.type !== 'axioma' && node.type !== 'modelo') {
      const allDepsValid = node.directDependencies.length === 0 ||
        node.directDependencies.every(depId => validNodes.has(depId));
      if (allDepsValid) validNodes.add(nodeId);
      continue;
    }

    if (isTheoremLike) {
      if (node.proofs && node.proofs.length > 0) {
        const hasValidProof = node.proofs.some(proof =>
          proof.dependencies.every(depId => validNodes.has(depId)),
        );
        if (hasValidProof) {
          validNodes.add(nodeId);
        }
      } else if (node.directDependencies.length === 0) {
        validNodes.add(nodeId);
      }
    }
  }

  return validNodes;
}

/**
 * Calcula qué axiomas deben desactivarse dado un conjunto activo de modelos.
 * Si no hay modelos activos, retorna array vacío (ningún axioma desactivado).
 */
export function computeDisabledAxiomsFromModels(
  models: ModelInfo[],
  activeModelIds: string[],
  allAxioms: string[],
): string[] {
  if (activeModelIds.length === 0) return [];

  const activeModels = models.filter(m => activeModelIds.includes(m.id));
  const enabledAxioms = new Set<string>();
  activeModels.forEach(m => m.axioms.forEach(ax => enabledAxioms.add(ax)));
  const disabledAxioms = allAxioms.filter(ax => (!enabledAxioms.has(ax)));
  return disabledAxioms;
}
