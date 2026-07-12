import type { VisualDiagramModel, CanvasTool } from '../model/types';
import type { DiagramDiagnostic } from '../source/generator';

export type DiagramSyncStatus =
  | 'synced'
  | 'visual-authoritative'
  | 'source-authoritative'
  | 'diverged'
  | 'invalid-source'
  | 'saving'
  | 'conflict';

export interface DiagramState {
  filePath: string | null;
  componentName: string;
  originalSource: string;
  currentSource: string;
  originalModel: VisualDiagramModel | null;
  currentModel: VisualDiagramModel | null;
  status: DiagramSyncStatus;
  diagnostics: DiagramDiagnostic[];
  selectedId: string;
  activeStepId: string;
  canvasTool: CanvasTool;
}

export type DiagramAction =
  | { type: 'LOAD_DIAGRAM'; filePath: string; componentName: string; source: string; model: VisualDiagramModel | null }
  | { type: 'VISUAL_EDIT'; model: VisualDiagramModel }
  | { type: 'SOURCE_EDIT'; source: string }
  | { type: 'SELECT_ELEMENT'; id: string }
  | { type: 'SET_CANVAS_TOOL'; tool: CanvasTool }
  | { type: 'SET_ACTIVE_STEP'; stepId: string }
  | { type: 'SET_STATUS'; status: DiagramSyncStatus }
  | { type: 'SET_DIAGNOSTICS'; diagnostics: DiagramDiagnostic[] }
  | { type: 'APPLY_PARSED_MODEL'; model: VisualDiagramModel; diagnostics: DiagramDiagnostic[] }
  | { type: 'PARSE_FAILED'; diagnostics: DiagramDiagnostic[] }
  | { type: 'RESOLVE_TO_VISUAL'; source: string }
  | { type: 'RESOLVE_TO_SOURCE'; model: VisualDiagramModel }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_SUCCESS'; source: string; model: VisualDiagramModel | null }
  | { type: 'SAVE_FAILURE'; error: string; isConflict?: boolean };
