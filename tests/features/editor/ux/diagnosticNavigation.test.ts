import { describe, expect, it } from 'vitest';
import {
  navigationTargetForDiagnostic,
  navigationTargetForHunk,
} from '../../../../src/features/editor/ux/diagnosticNavigation';

describe('editor diagnostic navigation', () => {
  it('navigates diagnostics with ranges to code safely', () => {
    expect(navigationTargetForDiagnostic({
      code: 'PARSE',
      severity: 'error',
      message: 'Parse error',
      sourceRange: { start: 4, end: 12 },
      panel: 'code',
    })).toEqual({
      panel: 'code',
      sourceRange: { start: 4, end: 12 },
      blockId: undefined,
      keepDiagnosticsVisible: true,
    });
  });

  it('navigates diagnostics with block ids to the visual panel', () => {
    expect(navigationTargetForDiagnostic({
      code: 'BLOCK',
      severity: 'warning',
      message: 'Block issue',
      blockId: 'block-2',
    })).toMatchObject({
      panel: 'visual',
      blockId: 'block-2',
      keepDiagnosticsVisible: true,
    });
  });

  it('navigates hunks back to their origin', () => {
    expect(navigationTargetForHunk({
      id: 'hunk-1',
      originalRange: { start: 10, end: 18 },
      candidateRange: { start: 10, end: 22 },
      originalText: 'anterior',
      candidateText: 'posterior',
      expected: true,
      operationId: 'op-1',
      blockId: 'block-1',
      reason: 'edit',
      classification: 'expected',
    })).toEqual({
      panel: 'diff',
      sourceRange: { start: 10, end: 18 },
      blockId: 'block-1',
      keepDiagnosticsVisible: true,
    });
  });
});
