export type DiagramDiagnosticWorkspace = 'build' | 'steps' | 'targets' | 'check' | 'source';
export type DiagramInspectorSection = 'general' | 'geometry' | 'appearance' | 'advanced';
export type DiagramLeftPanel = 'objects' | 'organization' | 'diagram';

export type DiagramDiagnosticCollection =
  | 'points'
  | 'elements'
  | 'sliders'
  | 'constraints'
  | 'steps'
  | 'groups'
  | 'layers'
  | 'objects';

export interface DiagramDiagnosticLocation {
  workspace: DiagramDiagnosticWorkspace;
  objectId?: string;
  navigationObjectId?: string;
  field?: string;
  fieldKey?: string;
  inspectorSection?: DiagramInspectorSection;
  leftPanel?: DiagramLeftPanel;
  collection?: DiagramDiagnosticCollection;
  index?: number;
  constraintId?: string;
}

export interface EnrichedDiagramDiagnostic {
  id: string;
  severity: 'error' | 'warning' | 'info';
  code: string;
  title: string;
  message: string;
  hint: string;
  location: DiagramDiagnosticLocation;
  rawMessage?: string;
}

export interface DiagnosticSummary {
  errorCount: number;
  warningCount: number;
  infoCount: number;
  objectIdsWithErrors: string[];
  objectIdsWithWarnings: string[];
}
