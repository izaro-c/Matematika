import { describe, expect, it } from 'vitest';
import {
  approveDiffReview,
  buildDiffReview,
  isApprovedDiffValid,
  isDiffReviewStale,
} from '../../../../src/features/editor/ux/diffReview';

const base = [
  '---',
  'id: test',
  'type: definicion',
  '---',
  '',
  '# Título',
  '',
  'Texto inicial.',
  '',
  '<Formula>x</Formula>',
].join('\n');

describe('safe diff review', () => {
  it('blocks source edits when expected ranges are absent', () => {
    const review = buildDiffReview({
      documentId: 'content/test.mdx',
      baseSource: base,
      candidateSource: base.replace('<Formula>x</Formula>', '<Formula>y</Formula>'),
      localRevision: 1,
      baseVersion: 'sha256:base',
    });

    expect(review.status).toBe('blocked');
    expect(review.blockingChangeCount).toBe(1);
    expect(review.changes[0]?.classification).toBe('unknown');
  });

  it('blocks edits outside authorized visual ranges', () => {
    const review = buildDiffReview({
      documentId: 'content/test.mdx',
      baseSource: base,
      candidateSource: base.replace('<Formula>x</Formula>', '<Formula>y</Formula>'),
      localRevision: 2,
      baseVersion: 'sha256:base',
      expectedRanges: [{
        start: base.indexOf('Texto inicial.'),
        end: base.indexOf('Texto inicial.') + 'Texto inicial.'.length,
        reason: 'Bloque de párrafo editado.',
        operationId: 'op-1',
      }],
    });

    expect(review.status).toBe('blocked');
    expect(review.changes[0]?.classification).toBe('outside-edited-range');
  });

  it('allows a hunk only when it is contained in a range tied to an operation', () => {
    const start = base.indexOf('inicial');
    const review = buildDiffReview({
      documentId: 'content/test.mdx',
      baseSource: base,
      candidateSource: base.replace('inicial', 'editado'),
      localRevision: 2,
      baseVersion: 'sha256:base',
      expectedRanges: [{ start, end: start + 'inicial'.length, reason: 'Texto editado.', operationId: 'op-1', blockId: 'block-1' }],
    });

    expect(review.status).toBe('reviewable');
    expect(review.hunks[0]).toMatchObject({ expected: true, operationId: 'op-1', blockId: 'block-1' });
    const approval = approveDiffReview(review);
    expect(approval).not.toBeNull();
    expect(isApprovedDiffValid(approval, review)).toBe(true);
  });

  it('rejects adjacent formatting not covered by the operation range', () => {
    const start = base.indexOf('<Formula>x</Formula>') + '<Formula>'.length;
    const review = buildDiffReview({
      documentId: 'content/test.mdx',
      baseSource: base,
      candidateSource: base.replace('<Formula>x</Formula>', '<Formula>y</Formula> '),
      localRevision: 2,
      baseVersion: 'sha256:base',
      expectedRanges: [{ start, end: start + 1, reason: 'Texto editado.', operationId: 'op-1' }],
    });

    expect(review.status).toBe('blocked');
    expect(review.hunks[0]?.classification).toBe('outside-edited-range');
    expect(approveDiffReview(review)).toBeNull();
  });

  it('invalidates a review when the local revision changes', () => {
    const review = buildDiffReview({
      documentId: 'content/test.mdx',
      baseSource: base,
      candidateSource: base.replace('Texto inicial.', 'Texto editado.'),
      localRevision: 1,
      baseVersion: 'sha256:base',
    });

    expect(isDiffReviewStale(review, 2, 'sha256:base')).toBe(true);
    expect(isDiffReviewStale(review, 1, 'sha256:base')).toBe(false);
  });
});
