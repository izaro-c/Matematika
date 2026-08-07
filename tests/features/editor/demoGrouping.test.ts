import { describe, expect, it } from 'vitest';
import { autoCapitularLetter, demoStepIndexInGroup, demosNeedingRenumber, groupVisualBlocks, stepFromDemoBlock } from '@/fixed-pages/editor/ui/prose/demoGrouping';
import type { Block } from '@/fixed-pages/editor/session/parser';

describe('demoGrouping', () => {
  it('groups consecutive demonstration blocks', () => {
    const blocks: Block[] = [
      { id: 'p1', type: 'paragraph', content: 'Intro' },
      { id: 'd1', type: 'demonstration', content: 'Body 1', metadata: { steps: [{ number: 1, title: 'A', body: 'Body 1' }] } },
      { id: 'd2', type: 'demonstration', content: 'Body 2', metadata: { steps: [{ number: 2, title: 'B', body: 'Body 2' }] } },
      { id: 'p2', type: 'paragraph', content: 'Outro' },
    ];
    const groups = groupVisualBlocks(blocks);
    expect(groups).toHaveLength(3);
    expect(groups[0]).toMatchObject({ kind: 'block' });
    expect(groups[1]).toMatchObject({ kind: 'demonstration' });
    if (groups[1].kind === 'demonstration') expect(groups[1].blocks).toHaveLength(2);
    expect(groups[2]).toMatchObject({ kind: 'block' });
  });

  it('reads step payload from projected block', () => {
    const step = stepFromDemoBlock({
      id: 'd1',
      type: 'demonstration',
      content: 'Por hipótesis.',
      metadata: { number: 1, title: 'Inicio', steps: [{ number: 1, title: 'Inicio', body: 'Por hipótesis.', target: 'segAB' }] },
    });
    expect(step).toMatchObject({ number: 1, title: 'Inicio', body: 'Por hipótesis.', target: 'segAB' });
  });

  it('derives capitular from first letter', () => {
    expect(autoCapitularLetter('enunciado')).toBe('E');
    expect(autoCapitularLetter('<Capitular letra="T" />exto')).toBe('E');
    expect(autoCapitularLetter('$$x$$')).toBeUndefined();
  });

  it('lists demos that need renumbering within each group', () => {
    const blocks: Block[] = [
      { id: 'd1', type: 'demonstration', content: 'a', metadata: { number: 3, title: 'A' } },
      { id: 'd2', type: 'demonstration', content: 'b', metadata: { number: 1, title: 'B' } },
      { id: 'p1', type: 'paragraph', content: 'gap' },
      { id: 'd3', type: 'demonstration', content: 'c', metadata: { number: 9, title: 'C' } },
      { id: 'd4', type: 'demonstration', content: 'd', metadata: { number: 1, title: 'D' } },
    ];
    expect(demosNeedingRenumber(blocks)).toEqual([
      expect.objectContaining({ blockId: 'd1', step: expect.objectContaining({ number: 1 }) }),
      expect.objectContaining({ blockId: 'd2', step: expect.objectContaining({ number: 2 }) }),
      expect.objectContaining({ blockId: 'd3', step: expect.objectContaining({ number: 1 }) }),
      expect.objectContaining({ blockId: 'd4', step: expect.objectContaining({ number: 2 }) }),
    ]);
  });

  it('resolves diagram sync index within the current demo group', () => {
    const blocks: Block[] = [
      { id: 'd1', type: 'demonstration', content: 'a', metadata: { number: 1 } },
      { id: 'd2', type: 'demonstration', content: 'b', metadata: { number: 2 } },
      { id: 'p1', type: 'paragraph', content: 'gap' },
      { id: 'd3', type: 'demonstration', content: 'c', metadata: { number: 1 } },
      { id: 'd4', type: 'demonstration', content: 'd', metadata: { number: 2 } },
    ];
    expect(demoStepIndexInGroup(blocks, 'd4')).toBe(1);
    expect(demoStepIndexInGroup(blocks, 'd1')).toBe(0);
    expect(demoStepIndexInGroup(blocks, 'missing')).toBe(-1);
  });
});
