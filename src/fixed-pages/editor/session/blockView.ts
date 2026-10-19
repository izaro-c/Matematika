import type { BlockContainer, ProjectedBlock } from '../document';
import type { Block, BlockType } from './parser';

/** Vista de bloques que consume la interfaz, a partir de la proyección del motor. */

function blockText(block: ProjectedBlock): string {
  if (block.kind !== 'editable') return block.source;
  if (block.data && typeof block.data === 'object' && 'text' in block.data) return String((block.data as { text: unknown }).text);
  return block.originalSource;
}

export function mapProjectedBlocks(projected: ProjectedBlock[], containers: BlockContainer[]): Block[] {
  return projected.map(block => ({
    id: block.id,
    type: block.kind === 'editable' ? block.blockType as BlockType : 'advancedMdx',
    content: blockText(block),
    metadata: block.kind === 'editable'
      ? { location: block.location, editRange: block.editRange, originalSource: block.originalSource, editable: true,
          ...(block.data && typeof block.data === 'object' && 'attributes' in block.data
            ? (block.data as { attributes?: Record<string, unknown> }).attributes : {}),
          ...(block.data && typeof block.data === 'object' && 'component' in block.data
            ? { component: (block.data as { component?: string }).component } : {}),
          ...(block.data && typeof block.data === 'object' && 'steps' in block.data
            ? { steps: (block.data as { steps?: unknown[] }).steps } : {}),
          ...(block.data && typeof block.data === 'object' && 'capitular' in block.data
            ? { capitular: (block.data as { capitular?: string }).capitular } : {}),
          ...(block.blockType === 'heading' && block.data && typeof block.data === 'object'
            ? { level: (block.data as { depth?: number }).depth } : {}),
          // Propagate diagramStep from StepSection parent container
          ...(() => {
            const parent = containers.find(c => c.id === block.parentId);
            if (parent?.name === 'StepSection' && parent.attributes?.step) {
              return { diagramStep: parent.attributes.step };
            }
            return {};
          })() }
      : { location: block.location, opaque: block.kind === 'opaque', preserved: block.kind === 'preserved', reason: block.reason, nodeType: block.nodeType }
  }));
}
