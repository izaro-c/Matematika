export type VisualCompatibility =
  | 'fully-editable'
  | 'partially-editable'
  | 'read-only'
  | 'unsupported';

export interface SourceRange {
  start: number;
  end: number;
}

export interface SourceLocation {
  range: SourceRange;
  startLine?: number;
  startColumn?: number;
  endLine?: number;
  endColumn?: number;
}

export interface EditorDiagnostic {
  code: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  location?: SourceLocation;
  nodeType?: string;
  operationId?: string;
}

export interface SourceEdit {
  range: SourceRange;
  expectedSource: string;
  replacement: string;
  operationId: string;
  reason?: string;
}

export interface OpaqueBlock {
  kind: 'opaque';
  id: string;
  source: string;
  location: SourceLocation;
  reason: string;
  nodeType?: string;
}

export interface EditableBlock {
  kind: 'editable';
  id: string;
  blockType: string;
  originalSource: string;
  location: SourceLocation;
  data: unknown;
}

export type ProjectedBlock = EditableBlock | OpaqueBlock;

export interface EditorDocument {
  source: string;
  sourceHash: string;
  ast: unknown;
  blocks: ProjectedBlock[];
  diagnostics: EditorDiagnostic[];
  compatibility: VisualCompatibility;
}

export interface SourceEditResult {
  success: boolean;
  output?: string;
  error?: string;
}

export interface VisualCapabilities {
  canViewVisual: boolean;
  canEditSafeBlocks: boolean;
  canApplyVisualChanges: boolean;
  canSwitchFromCodeToVisual: boolean;
}
