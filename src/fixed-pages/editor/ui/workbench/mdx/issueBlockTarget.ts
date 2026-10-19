import type { Block } from '@/fixed-pages/editor/session/parser';
import type { EditorValidationIssue } from '@/fixed-pages/editor/session/editorTypes';

/** Bloque al que apunta un aviso: por `blockId`, por posición en el texto o, a falta de ambos, el primero. */
export function findBlockIdForIssue(
  issue: EditorValidationIssue,
  blocks: Block[],
  rawBody: string,
): string | undefined {
  let targetBlockId = issue.blockId;

  if (!targetBlockId && issue.sourceRange && blocks.length > 0) {
    let currentOffset = 0;
    for (const block of blocks) {
      if (!block.content) continue;
      const pos = rawBody.indexOf(block.content, currentOffset);
      if (pos !== -1) {
        const blockEnd = pos + block.content.length;
        if (issue.sourceRange.start >= pos && issue.sourceRange.start <= blockEnd) {
          targetBlockId = block.id;
          break;
        }
        currentOffset = pos;
      }
    }
    if (!targetBlockId) {
      let closestBlock: Block | null = null;
      let minDistance = Infinity;
      currentOffset = 0;
      for (const block of blocks) {
        if (!block.content) continue;
        const pos = rawBody.indexOf(block.content, currentOffset);
        if (pos !== -1) {
          const dist = Math.abs(pos - issue.sourceRange.start);
          if (dist < minDistance) {
            minDistance = dist;
            closestBlock = block;
          }
          currentOffset = pos;
        }
      }
      targetBlockId = closestBlock?.id ?? blocks[0]?.id;
    }
  }

  if (!targetBlockId && blocks.length > 0) {
    targetBlockId = blocks[0].id;
  }

  return targetBlockId;
}
