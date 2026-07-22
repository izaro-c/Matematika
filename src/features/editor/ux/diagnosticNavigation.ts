import type { EditorDiagnostic, SourceRange } from '../document';

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
