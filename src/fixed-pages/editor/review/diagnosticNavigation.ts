import type { EditorDiagnostic, SourceRange } from '../document';

export interface EditorNavigationTarget {
  panel: 'visual' | 'code' | 'metadata' | 'diagram';
  sourceRange?: SourceRange;
  blockId?: string;
  keepDiagnosticsVisible: boolean;
}

export function navigationTargetForDiagnostic(diagnostic: EditorDiagnostic): EditorNavigationTarget {
  return {
    panel: diagnostic.panel ?? 'visual',
    sourceRange: diagnostic.sourceRange ?? diagnostic.location?.range,
    blockId: diagnostic.blockId,
    keepDiagnosticsVisible: true,
  };
}
