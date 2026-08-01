import { describe, expect, it } from 'vitest';
import { navigationTargetForDiagnostic } from '../../../../src/fixed-pages/editor/ux/diagnosticNavigation';

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
});
