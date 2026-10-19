import React, { useState } from 'react';
import type { DiagramTargetRegistry } from '@/fixed-pages/editor/session/editorTypes';
import type { Block } from '@/fixed-pages/editor/session/parser';
import { MetadataPanel } from '../panels/MetadataPanel';
import { MetadataInspector } from '../components/MetadataInspector';
import { WorkbenchAsideTabs } from './WorkbenchAsideTabs';
import { IconButton } from '../primitives';
import { useI18n } from '@/i18n';

import type { MetadataPanelProps, PageDiagramLink } from '../panels/MetadataPanel';

/** Los avisos no son una pestaña: van en el panel inferior del esquema (`DiagnosticsDock`). */
export type InspectorTab = 'page' | 'diagrams';

interface MdxWorkbenchInspectorProps {
  metadata: Record<string, unknown>;
  canEditVisualMetadata: boolean;
  canMutateVisualStructure: boolean;
  handleMetadataChange: (key: string, value: unknown) => void;
  handleRemoveMetadataField: (key: string) => void;
  handleAddCustomMetadataField: (key: string) => void;
  removeBlock?: (id: string) => void;
  blocks: Block[];
  openFile: (path: string) => void;
  pageDiagramLinks: PageDiagramLink[];
  pageConnectionSummary: MetadataPanelProps['pageConnectionSummary'];
  diagramTargets: DiagramTargetRegistry;
  diagramTargetsLoading: boolean;
  diagramTargetsError: string | null;
  setActiveDiagramIndex: (index: number | null) => void;
  setActiveDiagramBlockId: (id: string | null) => void;
  setDiagramBuilderOpen: (open: boolean) => void;
  insertInteractiveTargetParagraph: (target: { id: string; label?: string; color?: string }) => void;
  onClose: () => void;
  activeTab?: InspectorTab;
  onActiveTabChange?: (tab: InspectorTab) => void;
}

export const MdxWorkbenchInspector: React.FC<MdxWorkbenchInspectorProps> = (props) => {
  const [uncontrolledTab, setUncontrolledTab] = useState<InspectorTab>('page');
  const controlled = props.activeTab !== undefined && props.onActiveTabChange !== undefined;
  const activeTab = controlled ? props.activeTab! : uncontrolledTab;
  const setActiveTab = controlled ? props.onActiveTabChange! : setUncontrolledTab;

  const { t } = useI18n();

  return (
    <WorkbenchAsideTabs
      className="bg-lienzo select-none"
      aria-label={t('editor.mdx.inspectorAriaLabel')}
      tabs={[
        { id: 'page', label: t('editor.mdx.pageTab') },
        { id: 'diagrams', label: t('editor.mdx.diagramsTab') },
      ]}
      activeTab={activeTab}
      onTabChange={id => setActiveTab(id as InspectorTab)}
      trailing={
        <IconButton size="sm" label={t('editor.mdx.hideDetails')} onClick={props.onClose}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </IconButton>
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
          removeBlock={props.removeBlock}
          handleMetadataChange={props.handleMetadataChange}
        />
      )}
    </WorkbenchAsideTabs>
  );
};
