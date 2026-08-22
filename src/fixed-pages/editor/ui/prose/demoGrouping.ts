import type { Block } from '@/fixed-pages/editor/session/parser';
import type { ProofStepData } from '@/fixed-pages/editor/session/parser';

export type VisualGroup =
  | { kind: 'block'; block: Block }
  | { kind: 'demonstration'; blocks: Block[] };

/** Group consecutive ProofStep blocks into one canvas. */
export function groupVisualBlocks(blocks: Block[]): VisualGroup[] {
  const groups: VisualGroup[] = [];
  let i = 0;
  while (i < blocks.length) {
    const block = blocks[i];
    if (block.type === 'demonstration') {
      const demoBlocks: Block[] = [];
      while (i < blocks.length && blocks[i].type === 'demonstration') {
        demoBlocks.push(blocks[i]);
        i += 1;
      }
      groups.push({ kind: 'demonstration', blocks: demoBlocks });
      continue;
    }
    groups.push({ kind: 'block', block });
    i += 1;
  }
  return groups;
}

export function stepFromDemoBlock(block: Block): ProofStepData {
  const fromMeta = Array.isArray(block.metadata?.steps) ? block.metadata.steps[0] : undefined;
  if (fromMeta && typeof fromMeta === 'object') {
    const step = fromMeta as ProofStepData;
    return {
      ...step,
      body: typeof step.body === 'string' ? step.body : block.content,
      title: step.title ?? (typeof block.metadata?.title === 'string' ? block.metadata.title : ''),
      number: Number(step.number ?? block.metadata?.number ?? 1),
      target: step.target ?? block.metadata?.target,
      diagramStep: step.diagramStep ?? block.metadata?.diagramStep,
      diagramKey: step.diagramKey ?? (typeof block.metadata?.diagramKey === 'string' ? block.metadata.diagramKey : undefined),
    };
  }
  return {
    number: Number(block.metadata?.number ?? 1),
    title: typeof block.metadata?.title === 'string' ? block.metadata.title : '',
    target: block.metadata?.target as ProofStepData['target'],
    diagramStep: block.metadata?.diagramStep as ProofStepData['diagramStep'],
    diagramKey: typeof block.metadata?.diagramKey === 'string' ? block.metadata.diagramKey : undefined,
    body: block.content,
  };
}

export function proofStepUpdatePayload(step: ProofStepData): {
  content: string;
  metadata: Record<string, unknown>;
} {
  return {
    content: step.body ?? '',
    metadata: {
      number: step.number,
      title: step.title,
      target: step.target ?? '',
      diagramStep: step.diagramStep,
      diagramKey: step.diagramKey,
      steps: [step],
    },
  };
}

/** First letter for automatic capitular (letters only). */
export function autoCapitularLetter(text: string): string | undefined {
  const cleaned = text.replace(/^<Capitular\b[^>]*\/?>/i, '').trimStart();
  const match = cleaned.match(/^\p{L}/u);
  return match ? match[0].toUpperCase() : undefined;
}

/** Editor keeps the full paragraph; source stores Capitular + rest without duplicating the letter. */
export function splitCapitularContent(fullText: string): { letter?: string; content: string } {
  const letter = autoCapitularLetter(fullText);
  if (!letter) return { content: fullText };
  return { letter, content: fullText };
}

/** In-group 0-based index for a ProofStep (matches DemonstrationCanvas / diagram sync). */
export function demoStepIndexInGroup(blocks: Block[], blockId: string): number {
  for (const group of groupVisualBlocks(blocks)) {
    if (group.kind !== 'demonstration') continue;
    const index = group.blocks.findIndex(block => block.id === blockId);
    if (index >= 0) return index;
  }
  return -1;
}

/** Rewrite ProofStep number attrs to match order within each consecutive demo group (1-based). */
export function demosNeedingRenumber(blocks: Block[]): Array<{ blockId: string; step: ProofStepData }> {
  const updates: Array<{ blockId: string; step: ProofStepData }> = [];
  for (const group of groupVisualBlocks(blocks)) {
    if (group.kind !== 'demonstration') continue;
    group.blocks.forEach((block, index) => {
      const step = stepFromDemoBlock(block);
      const number = index + 1;
      if (step.number !== number) updates.push({ blockId: block.id, step: { ...step, number } });
    });
  }
  return updates;
}
