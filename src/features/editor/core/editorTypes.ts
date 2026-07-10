import type { Block, ProofStepData } from './parser';

export type EditorMode = 'visual' | 'code';
export type DirtyState = 'clean' | 'draft' | 'dirty' | 'saving' | 'blocked';
export type EditorSeverity = 'error' | 'warning' | 'info';

export interface EditorValidationIssue {
  id: string;
  severity: EditorSeverity;
  area: 'metadata' | 'body' | 'block' | 'diagram' | 'proof' | 'source';
  message: string;
  blockId?: string;
}

export interface EditorValidationResult {
  issues: EditorValidationIssue[];
  canSave: boolean;
  errorCount: number;
  warningCount: number;
}

export interface DiagramTarget {
  id: string;
  label: string;
  color: string;
  kind: 'point' | 'segment' | 'polygon' | 'angle' | 'line' | 'measurement' | 'step' | 'slider' | 'other';
}

export type DiagramTargetRegistry = DiagramTarget[];

export interface DiagramSpec {
  componentName: string;
  category: string;
  path: string;
  importPath: string;
  source: string;
  targets: DiagramTargetRegistry;
  mode: 'simulation' | 'diagram' | 'inline';
  visualModel?: Record<string, unknown>;
}

export interface EditorDocument {
  path: string | null;
  metadata: Record<string, unknown>;
  imports: string;
  exports: string;
  blocks: Block[];
  rawBody: string;
  diagrams: DiagramSpec[];
  dirtyState: DirtyState;
  validation: EditorValidationResult;
}

export type EditorBlock = Block;
export type EditorProofStep = ProofStepData;
