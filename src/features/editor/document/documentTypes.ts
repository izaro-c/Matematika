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
  sourceRange?: SourceRange;
  blockId?: string;
  panel?: 'visual' | 'code' | 'metadata' | 'diagram' | 'diff';
  nodeType?: string;
  operationId?: string;
}

export interface SourceEdit {
  blockId: string;
  range: SourceRange;
  expectedSource: string;
  replacement: string;
  operationId: string;
  reason?: string;
}

export interface MetadataPropertyProjection {
  key: string;
  propertyRange: SourceRange;
  valueRange: SourceRange;
}

export interface MetadataProjection {
  status: 'missing' | 'readable' | 'unsupported';
  value: Record<string, unknown> | null;
  objectRange?: SourceRange;
  properties: MetadataPropertyProjection[];
  schemaValid: boolean;
  schemaName?: string;
}

export interface BlockContainer {
  id: string;
  kind: 'root' | 'jsx-container';
  name?: string;
  contentRange: SourceRange;
}

export interface OpaqueBlock {
  kind: 'opaque';
  id: string;
  source: string;
  location: SourceLocation;
  reason: string;
  nodeType?: string;
  parentId: string;
}

/**
 * Syntax understood by the parser and preserved byte-for-byte, but without a
 * registered visual mutation contract. It is deliberately not called opaque:
 * opaque is reserved for syntax that the structural engine does not know.
 */
export interface PreservedBlock {
  kind: 'preserved';
  id: string;
  source: string;
  location: SourceLocation;
  reason: string;
  nodeType?: string;
  parentId: string;
}

export interface EditableBlock {
  kind: 'editable';
  id: string;
  blockType: string;
  originalSource: string;
  location: SourceLocation;
  editRange: SourceRange;
  data: unknown;
  parentId: string;
}

export type ProjectedBlock = EditableBlock | PreservedBlock | OpaqueBlock;

export interface EditorDocument {
  source: string;
  sourceFingerprint: string;
  ast: unknown;
  envelope: {
    metadataRange?: SourceRange;
    importRanges: SourceRange[];
    exportRanges: SourceRange[];
  };
  metadata: MetadataProjection;
  bodyRange: SourceRange;
  containers: BlockContainer[];
  bodyBlocks: ProjectedBlock[];
  diagnostics: EditorDiagnostic[];
  compatibility: VisualCompatibility;
  compatibilityReasons: string[];
}

export type StructuralOperationKind =
  | 'replace-block'
  | 'update-block'
  | 'insert-block'
  | 'delete-block'
  | 'duplicate-block'
  | 'move-block'
  | 'update-metadata'
  | 'bind-diagram';

export interface MutationPreview {
  title: string;
  summary: string;
  originalSnippet: string;
  candidateSnippet: string;
  affectedRange: SourceRange;
}

export interface DocumentMutationPlan {
  operationId: string;
  kind: StructuralOperationKind;
  baseFingerprint: string;
  edits: SourceEdit[];
  preview: MutationPreview;
}

/** Temporary alias for consumers being migrated from the phase-2 prototype. */
export type EditorDocumentWithLegacyBlocks = EditorDocument & { blocks?: never };

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
