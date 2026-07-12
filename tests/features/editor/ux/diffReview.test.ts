import { describe, expect, it } from 'vitest';
import { buildDiffReview, isDiffReviewStale } from '../../../../src/features/editor/ux/diffReview';

const base = [
  '---',
  'id: test',
  'type: definicion',
  '---',
  '',
  '# Título',
  '',
  'Texto inicial.',
].join('\n');

describe('safe diff review', () => {
  it('classifies manual source edits as reviewable expected changes', () => {
    const review = buildDiffReview({
      baseSource: base,
      candidateSource: base.replace('Texto inicial.', 'Texto editado.'),
      localRevision: 1,
      baseVersion: 'sha256:base',
    });

    expect(review.status).toBe('reviewable');
    expect(review.blockingChangeCount).toBe(0);
    expect(review.changes[0]?.classification).toBe('expected');
  });

  it('blocks edits outside authorized visual ranges', () => {
    const review = buildDiffReview({
      baseSource: base,
      candidateSource: base.replace('id: test', 'id: otro'),
      localRevision: 2,
      baseVersion: 'sha256:base',
      expectedRanges: [{ start: base.indexOf('Texto inicial.'), end: base.length, reason: 'Bloque de párrafo editado.' }],
    });

    expect(review.status).toBe('blocked');
    expect(review.changes[0]?.classification).toBe('outside-edited-range');
  });

  it('invalidates a review when the local revision changes', () => {
    const review = buildDiffReview({
      baseSource: base,
      candidateSource: base.replace('Texto inicial.', 'Texto editado.'),
      localRevision: 1,
      baseVersion: 'sha256:base',
    });

    expect(isDiffReviewStale(review, 2, 'sha256:base')).toBe(true);
    expect(isDiffReviewStale(review, 1, 'sha256:base')).toBe(false);
  });
});
