import { useMemo, useRef, useState } from 'react';
import type { DiagramDiagnostic } from '../source/generator';
import type { VisualDiagramModel } from '../model/types';
import type { DiagramState } from '@/fixed-pages/editor/diagrams/history/types';
import { buildTargets } from '../model/scene/selectors';
import { buildDiagramSaveCapability } from '../model/scene/savePresentation';
import {
  enrichDiagramDiagnostics,
  summarizeDiagnostics,
  fieldErrorsForObject,
  buildInspectorNavigationIntent,
  type EnrichedDiagramDiagnostic,
  type DiagramInspectorSection,
  type InspectorNavigationIntent,
} from './index';

type WorkbenchWorkspace = 'build' | 'steps' | 'targets' | 'check' | 'source';
type WorkbenchLeftPanel = 'objects' | 'organization' | 'diagram';
type WorkbenchMobilePane = 'scene' | 'canvas' | 'properties';

interface NavigateDiagnosticOptions {
  setWorkspace: (workspace: WorkbenchWorkspace) => void;
  setLeftPanel: (panel: WorkbenchLeftPanel) => void;
  setMobilePane: (pane: WorkbenchMobilePane) => void;
  selectOnly: (id: string) => void;
  setPreviewHighlightId: (id: string) => void;
}

export function useDiagramDiagnostics(
  diagnostics: readonly DiagramDiagnostic[],
  model: VisualDiagramModel | null,
  selectedId: string,
  state: DiagramState,
  previewHighlightId: string,
) {
  const [focusedDiagnosticId, setFocusedDiagnosticId] = useState('');
  const [diagnosticsAcknowledged, setDiagnosticsAcknowledged] = useState(false);
  const [inspectorSection, setInspectorSection] = useState<DiagramInspectorSection>('general');
  const [listFocusObjectId, setListFocusObjectId] = useState('');
  const [inspectorNavigation, setInspectorNavigation] = useState<InspectorNavigationIntent | null>(null);
  const navigationRevisionRef = useRef(0);

  const targets = useMemo(
    () => (model ? buildTargets(model) : []),
    [model],
  );

  const enrichedDiagnostics = useMemo(
    () => enrichDiagramDiagnostics(diagnostics, model, targets),
    [diagnostics, model, targets],
  );

  const diagnosticSummary = useMemo(
    () => summarizeDiagnostics(enrichedDiagnostics),
    [enrichedDiagnostics],
  );

  const errorObjectIds = useMemo(
    () => new Set(diagnosticSummary.objectIdsWithErrors),
    [diagnosticSummary.objectIdsWithErrors],
  );

  const passiveErrorHighlightIds = useMemo(
    () => diagnosticSummary.objectIdsWithErrors.filter(id => id !== previewHighlightId),
    [diagnosticSummary.objectIdsWithErrors, previewHighlightId],
  );

  const selectedFieldErrors = useMemo(
    () => fieldErrorsForObject(enrichedDiagnostics, selectedId),
    [enrichedDiagnostics, selectedId],
  );

  const saveCapability = useMemo(
    () => buildDiagramSaveCapability(state),
    [state],
  );

  const navigateToDiagnostic = (
    diagnostic: EnrichedDiagramDiagnostic,
    options: NavigateDiagnosticOptions,
  ) => {
    const location = diagnostic.location;
    const nextWorkspace = location.workspace === 'check' ? 'build' : location.workspace;
    const intent = buildInspectorNavigationIntent(diagnostic, navigationRevisionRef.current + 1);
    navigationRevisionRef.current = intent.revision;

    options.setWorkspace(nextWorkspace);
    setFocusedDiagnosticId(diagnostic.id);
    setDiagnosticsAcknowledged(true);
    options.setLeftPanel(intent.leftPanel);
    setInspectorSection(intent.section);
    setInspectorNavigation(intent);

    if (intent.objectId) {
      options.selectOnly(intent.objectId);
      options.setPreviewHighlightId(intent.objectId);
      setListFocusObjectId(intent.objectId);
      options.setMobilePane(nextWorkspace === 'steps' ? 'canvas' : 'properties');
    } else {
      options.setMobilePane('scene');
      setListFocusObjectId('');
    }
  };

  const openDiagnostics = (setWorkspace: (workspace: WorkbenchWorkspace) => void) => {
    const preferred = saveCapability.primaryDiagnosticId
      ? enrichedDiagnostics.find(item => item.id === saveCapability.primaryDiagnosticId)
      : undefined;
    const firstError = preferred ?? enrichedDiagnostics.find(item => item.severity === 'error');
    setFocusedDiagnosticId(firstError?.id ?? '');
    setDiagnosticsAcknowledged(true);
    setInspectorNavigation(null);
    setWorkspace('check');
  };

  const handleInspectorSectionChange = (section: DiagramInspectorSection) => {
    setInspectorSection(section);
    if (inspectorNavigation && section !== inspectorNavigation.section) {
      setInspectorNavigation(null);
    }
  };

  return {
    enrichedDiagnostics,
    diagnosticSummary,
    errorObjectIds,
    passiveErrorHighlightIds,
    selectedFieldErrors,
    saveCapability,
    focusedDiagnosticId,
    diagnosticsAcknowledged,
    inspectorSection,
    listFocusObjectId,
    inspectorNavigation,
    navigateToDiagnostic,
    openDiagnostics,
    handleInspectorSectionChange,
    acknowledgeDiagnostics: () => setDiagnosticsAcknowledged(true),
  };
}
