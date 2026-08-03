import React, { useState } from 'react';
import type { EditorValidationIssue, EditorValidationResult } from '@/fixed-pages/editor/session/editorTypes';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import type { EditorPersistenceStatus } from '@/fixed-pages/editor/save/editorPersistenceState';
import type { Block } from '@/fixed-pages/editor/session/parser';
import { MetadataPanel } from '../panels/MetadataPanel';
import { EditorDiagnosticsPanel } from '../panels/EditorDiagnosticsPanel';

export type InspectorTab = 'metadata' | 'semantic' | 'diagnostics';

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
}

export const MdxWorkbenchInspector: React.FC<MdxWorkbenchInspectorProps> = (props) => {
  const [activeTab, setActiveTab] = useState<InspectorTab>('metadata');

  const errorCount = props.validation.errorCount;
  const warningCount = props.validation.warningCount;

  return (
    <aside className="flex h-full w-full flex-col bg-lienzo border-l border-carbon/15 overflow-hidden select-none">
      {/* 1. Inspector Tab Header */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-carbon/15 bg-carbon/5 px-2">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => setActiveTab('metadata')}
            className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
              activeTab === 'metadata'
                ? 'bg-lienzo text-carbon shadow-xs border border-carbon/15'
                : 'text-carbon/60 hover:text-carbon'
            }`}
          >
            Metadatos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('semantic')}
            className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
              activeTab === 'semantic'
                ? 'bg-lienzo text-carbon shadow-xs border border-carbon/15'
                : 'text-carbon/60 hover:text-carbon'
            }`}
          >
            Conexiones
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('diagnostics')}
            className={`relative rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
              activeTab === 'diagnostics'
                ? 'bg-lienzo text-carbon shadow-xs border border-carbon/15'
                : 'text-carbon/60 hover:text-carbon'
            }`}
          >
            Diagnósticos
            {(errorCount > 0 || warningCount > 0) && (
              <span className={`ml-1.5 rounded-full px-1.5 py-0.2 text-[9px] text-lienzo ${
                errorCount > 0 ? 'bg-crimson' : 'bg-ocre'
              }`}>
                {errorCount || warningCount}
              </span>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={props.onClose}
          className="flex h-7 w-7 items-center justify-center rounded-md text-carbon/60 hover:bg-carbon/10 hover:text-carbon transition-colors"
          title="Ocultar Inspector"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 2. Tab Contents */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {activeTab === 'metadata' && (
          <MetadataPanel
            metadata={props.metadata}
            canEditVisualMetadata={props.canEditVisualMetadata}
            canMutateVisualStructure={props.canMutateVisualStructure}
            handleMetadataChange={props.handleMetadataChange}
            handleRemoveMetadataField={props.handleRemoveMetadataField}
            handleAddCustomMetadataField={props.handleAddCustomMetadataField}
            validation={props.validation}
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
            onSelectIssue={props.onSelectIssue}
          />
        )}

        {activeTab === 'semantic' && (
          <div className="space-y-4 text-xs text-carbon">
            <div className="rounded-lg border border-carbon/15 bg-carbon/5 p-3">
              <h4 className="font-serif font-bold text-sm text-carbon mb-1">Enlazado Semántico</h4>
              <p className="text-carbon/70 text-[11px] leading-relaxed">
                Inserta marcas de concepto (<code className="font-mono bg-lienzo px-1 py-0.5 rounded border border-carbon/10 text-salvia font-bold">&lt;ConceptLink /&gt;</code>) o referencias (<code className="font-mono bg-lienzo px-1 py-0.5 rounded border border-carbon/10 text-pavo font-bold">&lt;RefLink /&gt;</code>) directamente en el cuerpo MDX.
              </p>
            </div>

            <div className="rounded-lg border border-carbon/15 p-3 bg-lienzo space-y-2">
              <h5 className="font-bold text-carbon text-xs uppercase tracking-wider">Lean 4 / Formalización</h5>
              <div className="flex items-center justify-between text-xs">
                <span className="text-carbon/70">ID Formalizado:</span>
                <span className="font-mono bg-carbon/5 px-2 py-0.5 rounded border border-carbon/10 font-bold">
                  {(props.metadata.leanId as string) || 'Sin asignar'}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-carbon/15 p-3 bg-lienzo space-y-2">
              <h5 className="font-bold text-carbon text-xs uppercase tracking-wider">Conexiones del Documento</h5>
              {props.pageConnectionSummary?.connected?.length > 0 ? (
                <ul className="space-y-1.5">
                  {props.pageConnectionSummary.connected.map((conn: any, i: number) => (
                    <li key={i} className="flex items-center justify-between rounded border border-salvia/20 bg-salvia/5 px-2 py-1">
                      <span className="font-medium text-salvia truncate">{conn.label || conn.target}</span>
                      <span className="text-[10px] font-mono text-carbon/50 uppercase">{conn.kind}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-carbon/50 text-[11px] italic">Sin conexiones activas registradas.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <EditorDiagnosticsPanel
            currentFile={props.currentFile}
            resource={props.resource}
            validation={props.validation}
            persistenceStatus={props.persistenceStatus}
            persistenceLabel={props.persistenceLabel}
            level="basic"
            onSelectIssue={props.onSelectIssue || (() => {})}
            close={() => setActiveTab('metadata')}
          />
        )}
      </div>
    </aside>
  );
};
