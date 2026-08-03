import React, { useState } from 'react';
import type { EditorValidationIssue, EditorValidationResult } from '@/fixed-pages/editor/session/editorTypes';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import type { EditorPersistenceStatus } from '@/fixed-pages/editor/save/editorPersistenceState';
import type { Block } from '@/fixed-pages/editor/session/parser';
import { MetadataPanel } from '../panels/MetadataPanel';
import { EditorDiagnosticsPanel } from '../panels/EditorDiagnosticsPanel';
import { MetadataInspector } from '../components/MetadataInspector';
import { WorkbenchAsideTabs } from './WorkbenchAsideTabs';

export type InspectorTab = 'page' | 'diagrams' | 'avisos';

interface MdxWorkbenchInspectorProps {
  currentFile: string | null;
  resource?: FileNode;
  metadata: Record<string, unknown>;
  canEditVisualMetadata: boolean;
  canMutateVisualStructure: boolean;
  handleMetadataChange: (key: string, value: unknown) => void;
  handleRemoveMetadataField: (key: string) => void;
  handleAddCustomMetadataField: (key: string) => void;
  validation: EditorValidationResult;
  persistenceStatus: EditorPersistenceStatus;
  persistenceLabel: string;
  blocks: Block[];
  openFile: (path: string) => void;
  pageDiagramLinks: any[];
  pageConnectionSummary: any;
  diagramTargets: any;
  diagramTargetsLoading: boolean;
  diagramTargetsError: string | null;
  setActiveDiagramIndex: (index: number | null) => void;
  setActiveDiagramBlockId: (id: string | null) => void;
  setDiagramBuilderOpen: (open: boolean) => void;
  insertInteractiveTargetParagraph: (target: { id: string; label?: string; color?: string }) => void;
  onSelectIssue?: (issue: EditorValidationIssue) => void;
  onClose: () => void;
  activeTab?: InspectorTab;
  onActiveTabChange?: (tab: InspectorTab) => void;
}

export const MdxWorkbenchInspector: React.FC<MdxWorkbenchInspectorProps> = (props) => {
  const [uncontrolledTab, setUncontrolledTab] = useState<InspectorTab>('page');
  const controlled = props.activeTab !== undefined && props.onActiveTabChange !== undefined;
  const activeTab = controlled ? props.activeTab! : uncontrolledTab;
  const setActiveTab = controlled ? props.onActiveTabChange! : setUncontrolledTab;
  const errorCount = props.validation.errorCount;

  return (
    <WorkbenchAsideTabs
      className="bg-lienzo select-none"
      aria-label="Secciones del inspector de página"
      tabs={[
        { id: 'page', label: 'Página' },
        { id: 'diagrams', label: 'Diagramas' },
        {
          id: 'avisos',
          label: 'Avisos',
          endAdornment: errorCount > 0 ? (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-granada animate-pulse" />
          ) : props.validation.warningCount > 0 ? (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-ocre" />
          ) : undefined,
        },
      ]}
      activeTab={activeTab}
      onTabChange={id => setActiveTab(id as InspectorTab)}
      trailing={
        <button
          type="button"
          onClick={props.onClose}
          className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-carbon/60 hover:bg-carbon/10 hover:text-carbon transition-colors cursor-pointer"
          title="Ocultar detalles"
          aria-label="Ocultar detalles"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      }
    >
      {activeTab === 'page' && (
        <MetadataInspector
          metadata={props.metadata}
          disabled={!props.canEditVisualMetadata}
          onChange={props.handleMetadataChange}
          onRemove={props.handleRemoveMetadataField}
          onAddCustom={props.handleAddCustomMetadataField}
        />
      )}

      {activeTab === 'diagrams' && (
        <MetadataPanel
          metadata={props.metadata}
          canMutateVisualStructure={props.canMutateVisualStructure}
          blocks={props.blocks}
          openFile={props.openFile}
          pageDiagramLinks={props.pageDiagramLinks}
          pageConnectionSummary={props.pageConnectionSummary}
          diagramTargets={props.diagramTargets}
          diagramTargetsLoading={props.diagramTargetsLoading}
          diagramTargetsError={props.diagramTargetsError}
          setActiveDiagramIndex={props.setActiveDiagramIndex}
          setActiveDiagramBlockId={props.setActiveDiagramBlockId}
          setDiagramBuilderOpen={props.setDiagramBuilderOpen}
          insertInteractiveTargetParagraph={props.insertInteractiveTargetParagraph}
        />
      )}

      {activeTab === 'avisos' && (
        <EditorDiagnosticsPanel
          currentFile={props.currentFile}
          resource={props.resource}
          validation={props.validation}
          persistenceStatus={props.persistenceStatus}
          persistenceLabel={props.persistenceLabel}
          level="basic"
          embedded
          onSelectIssue={props.onSelectIssue || (() => {})}
          close={() => setActiveTab('page')}
        />
      )}
    </WorkbenchAsideTabs>
  );
};
