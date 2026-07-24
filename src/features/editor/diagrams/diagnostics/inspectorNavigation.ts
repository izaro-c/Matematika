import type { EnrichedDiagramDiagnostic } from './enrichDiagnostics';
import {
  resolveInspectorSection,
  resolveLeftPanel,
  type DiagramInspectorSection,
  type DiagramLeftPanel,
} from './enrichDiagnostics';

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
  const location = diagnostic.location;
  const objectId = location.navigationObjectId ?? location.objectId;
  const fieldKey = location.fieldKey ?? location.field?.split('.')[0] ?? '';
  const section = location.inspectorSection
    ?? resolveInspectorSection(location.field ?? fieldKey, location.collection);

  return {
    revision,
    diagnosticId: diagnostic.id,
    objectId,
    section,
    fieldKey,
    leftPanel: location.leftPanel ?? resolveLeftPanel({
      navigationObjectId: location.navigationObjectId,
      objectId: location.objectId,
      field: location.field,
      collection: location.collection,
    }),
  };
}
