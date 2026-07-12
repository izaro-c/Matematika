import type { EditorDiagnostic, SourceRange } from '../document';
import type { DiffHunk } from './diffReview';

export interface EditorNavigationTarget {
  panel: 'visual' | 'code' | 'metadata' | 'diagram' | 'diff';
  sourceRange?: SourceRange;
  blockId?: string;
  keepDiagnosticsVisible: boolean;
}

export function navigationTargetForDiagnostic(diagnostic: EditorDiagnostic): EditorNavigationTarget {
  return {
    panel: diagnostic.panel ?? (diagnostic.blockId ? 'visual' : 'code'),
    sourceRange: diagnostic.sourceRange ?? diagnostic.location?.range,
    blockId: diagnostic.blockId,
    keepDiagnosticsVisible: true,
  };
}

export function navigationTargetForHunk(hunk: DiffHunk): EditorNavigationTarget {
  return {
    panel: 'diff',
    sourceRange: hunk.originalRange.start === hunk.originalRange.end ? hunk.candidateRange : hunk.originalRange,
    blockId: hunk.blockId,
    keepDiagnosticsVisible: true,
  };
}
