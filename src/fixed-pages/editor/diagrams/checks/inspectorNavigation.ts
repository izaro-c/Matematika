import type { EnrichedDiagramDiagnostic } from './types';
import type { DiagramInspectorSection, DiagramLeftPanel } from './types';

export interface InspectorNavigationIntent {
  revision: number;
  diagnosticId: string;
  objectId?: string;
  section: DiagramInspectorSection;
  fieldKey: string;
  leftPanel: DiagramLeftPanel;
}

export function buildInspectorNavigationIntent(
  diagnostic: EnrichedDiagramDiagnostic,
  revision: number,
): InspectorNavigationIntent {
  const { location } = diagnostic;
  const objectId = location.navigationObjectId ?? location.objectId;
  const fieldKey = location.fieldKey ?? location.field?.split('.')[0] ?? '';

  return {
    revision,
    diagnosticId: diagnostic.id,
    objectId,
    section: location.inspectorSection ?? 'general',
    fieldKey,
    leftPanel: location.leftPanel ?? 'diagram',
  };
}
