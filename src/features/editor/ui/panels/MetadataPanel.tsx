import React, { useState } from 'react';
import type { Block } from '../../core/parser';
import type { DiagramTargetRegistry, EditorValidationIssue, EditorValidationResult } from '../../core/editorTypes';
import { MetadataInspector } from '../components/MetadataInspector';
import { ValidationPanel } from '../components/ValidationPanel';
import { DiagramRuntimePreview } from '../../diagrams/ui/DiagramRuntimePreview';
import { useMathStore } from '@/shared/lib/MathStoreContext';

interface PageDiagramLink {
  componentName: string;
  importSource?: string;
  path?: string;
  role: 'Simulation' | 'Diagram' | 'Inline' | 'Imported';
  targets?: DiagramTargetRegistry;
}

interface MetadataPanelProps {
  metadata: Record<string, unknown>;
  canEditVisualMetadata: boolean;
  canMutateVisualStructure: boolean;
  handleMetadataChange: (key: string, value: unknown) => void;
  handleRemoveMetadataField: (key: string) => void;
  handleAddCustomMetadataField: (key: string) => void;
  validation: EditorValidationResult;
  blocks: Block[];
  openFile: (path: string) => void;
  pageDiagramLinks: PageDiagramLink[];
  pageConnectionSummary: {
    connected: Array<{ target: string; label: string; kind: string }>;
    missingTargets: Array<{ id: string; label?: string; color?: string; qualifiedId?: string }>;
    invalidConnections: Array<{ target: string; label: string; kind: string }>;
    ambiguousConnections: Array<{ target: string; label: string; kind: string }>;
  };
  diagramTargets: DiagramTargetRegistry;
  diagramTargetsLoading: boolean;
  diagramTargetsError: string | null;
  setActiveDiagramIndex: (index: number | null) => void;
  setActiveDiagramBlockId: (id: string | null) => void;
  setDiagramBuilderOpen: (open: boolean) => void;
  insertInteractiveTargetParagraph: (target: { id: string; label?: string; color?: string }) => void;
  onSelectIssue?: (issue: EditorValidationIssue) => void;
}

export const MetadataPanel: React.FC<MetadataPanelProps> = ({
  metadata,
  canEditVisualMetadata,
  canMutateVisualStructure,
  handleMetadataChange,
  handleRemoveMetadataField,
  handleAddCustomMetadataField,
  validation,
  blocks,
  openFile,
  pageDiagramLinks,
  pageConnectionSummary,
  diagramTargets,
  diagramTargetsLoading,
  diagramTargetsError,
  setActiveDiagramIndex,
  setActiveDiagramBlockId,
  setDiagramBuilderOpen,
  insertInteractiveTargetParagraph,
  onSelectIssue,
}) => {
  const setVariable = useMathStore(state => state.setVariable);
  const [section, setSection] = useState<'page' | 'diagrams' | 'validation'>('page');
  const renderPageDiagramPanel = () => {
    if (pageDiagramLinks.length === 0) {
      return (
        <section className="border-t border-carbon/15 p-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-carbon/55">Diagramas</h3>
          <div className="mt-3 rounded border border-dashed border-carbon/20 bg-carbon/5 p-3">
            <p className="text-xs italic text-carbon/55">Esta página aún no tiene diagramas enlazados.</p>
            <p className="mt-2 text-[10px] text-carbon/45">El constructor añade import, export publicado y metadatos mediante un único plan lossless revisable.</p>
            {canMutateVisualStructure && <button type="button" onClick={() => {
              setActiveDiagramIndex(blocks.length);
              setActiveDiagramBlockId(null);
              setDiagramBuilderOpen(true);
            }} className="mt-3 rounded bg-pavo px-3 py-1.5 text-[10px] font-bold text-lienzo">Vincular diagrama</button>}
          </div>
        </section>
      );
    }

    return (
      <section className="border-t border-carbon/15 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-carbon/55">Diagramas de esta página</h3>
          {canMutateVisualStructure && <button
            type="button"
            onClick={() => {
              setActiveDiagramIndex(blocks.length);
              setActiveDiagramBlockId(null);
              setDiagramBuilderOpen(true);
            }}
            className="rounded bg-pavo/10 px-2 py-1 text-[9px] font-bold text-pavo hover:bg-pavo/20 cursor-pointer"
          >
            Añadir
          </button>}
        </div>
        <div className="mt-3 space-y-2">
          {pageDiagramLinks.map((link, index) => (
            <div key={`${link.componentName}-${link.path || link.importSource}-${index}`} className="rounded border border-carbon/10 bg-carbon/5 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-serif text-xs font-bold text-carbon">{link.componentName}</p>
                  <p className="mt-1 truncate font-mono text-[9px] text-carbon/45">{link.path || link.importSource || 'Sin archivo detectado'}</p>
                </div>
                <span className="rounded bg-salvia/10 px-1.5 py-0.5 text-[9px] font-bold text-salvia">{link.role}</span>
              </div>
              {canMutateVisualStructure && link.targets && link.targets.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {link.targets.slice(0, 6).map(target => (
                    <button
                      key={target.qualifiedId ?? target.id}
                      type="button"
                      onClick={() => insertInteractiveTargetParagraph(target)}
                      className="rounded border border-carbon/10 bg-lienzo px-1.5 py-0.5 font-mono text-[9px] text-carbon/60 hover:border-salvia/30 hover:text-salvia cursor-pointer"
                      title={`Insertar texto interactivo para ${target.label}`}
                    >
                      {target.id}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={!link.path}
                  onClick={() => link.path && openFile(link.path)}
                  className="rounded border border-carbon/20 px-2 py-1 text-[10px] font-bold text-carbon/60 hover:bg-carbon/5 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                >
                  Abrir TSX
                </button>
                {canMutateVisualStructure && <button
                  type="button"
                  onClick={() => {
                    const block = blocks.find(item => item.type === 'diagram' && item.content === link.componentName);
                    setActiveDiagramBlockId(block?.id ?? null);
                    setActiveDiagramIndex(block ? null : blocks.length);
                    setDiagramBuilderOpen(true);
                  }}
                  className="rounded bg-salvia/10 px-2 py-1 text-[10px] font-bold text-salvia hover:bg-salvia/20 cursor-pointer"
                >
                  Reemplazar
                </button>}
              </div>
              {link.path && <div className="mt-3"><DiagramRuntimePreview filePath={link.path} componentName={link.componentName} /></div>}
            </div>
          ))}
        </div>
        <div className="mt-4 rounded border border-carbon/10 bg-carbon/5 p-3" aria-label="Navegador de targets">
          <div className="flex items-center justify-between"><h4 className="text-[10px] font-bold uppercase tracking-widest text-carbon/55">Targets publicados</h4>{diagramTargetsLoading && <span className="text-[9px] text-carbon/45">Analizando…</span>}</div>
          {diagramTargetsError && <p className="mt-2 text-[10px] text-granada" role="alert">{diagramTargetsError}</p>}
          {!diagramTargetsLoading && diagramTargets.length === 0 && <p className="mt-2 text-[10px] italic text-carbon/45">El diagrama no publica targets editables o requiere modo código.</p>}
          <div className="mt-2 flex flex-wrap gap-1">
            {diagramTargets.map(target => <button key={target.qualifiedId ?? target.id} type="button"
              onMouseEnter={() => setVariable('highlight', target.qualifiedId ?? target.id)} onMouseLeave={() => setVariable('highlight', null)}
              onFocus={() => setVariable('highlight', target.qualifiedId ?? target.id)} onBlur={() => setVariable('highlight', null)}
              onClick={() => setVariable('highlight', target.qualifiedId ?? target.id)}
              className="rounded border border-carbon/10 bg-lienzo px-2 py-1 text-left hover:border-ocre/35 hover:bg-ocre/5" aria-label={`Resaltar target ${target.label}`}>
              <span className="block text-[10px] font-bold text-carbon">{target.label}</span><span className="block font-mono text-[8px] text-carbon/45">{target.qualifiedId ?? target.id}</span>
            </button>)}
          </div>
        </div>
        {(pageConnectionSummary.connected.length > 0 || pageConnectionSummary.missingTargets.length > 0) && (
          <div className="mt-4 rounded border border-carbon/10 bg-carbon/5 p-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-carbon/55 select-none">Conexiones texto-diagrama</h4>
            {pageConnectionSummary.invalidConnections.length > 0 && (
              <div className="mt-2 rounded border border-granada/25 bg-granada/5 p-2 text-[10px] text-granada" role="alert">
                Referencias inexistentes: {pageConnectionSummary.invalidConnections.map(item => item.target).join(', ')}.
              </div>
            )}
            {pageConnectionSummary.ambiguousConnections.length > 0 && (
              <div className="mt-2 rounded border border-ocre/25 bg-ocre/5 p-2 text-[10px] text-carbon" role="status">
                Targets presentes en varios diagramas: {pageConnectionSummary.ambiguousConnections.map(item => item.target).join(', ')}. Use el formato diagrama:target.
              </div>
            )}
            {pageConnectionSummary.connected.length > 0 && (
              <div className="mt-2 space-y-1">
                {pageConnectionSummary.connected.slice(0, 8).map((connection, index) => (
                  <div key={`${connection.target}-${index}`} className="flex items-center justify-between gap-2 rounded bg-lienzo px-2 py-1 text-[10px]">
                    <span className="truncate font-serif font-bold text-carbon">{connection.label || connection.target}</span>
                    <span className="shrink-0 font-mono text-[9px] text-salvia">{connection.target}</span>
                  </div>
                ))}
              </div>
            )}
            {canMutateVisualStructure && pageConnectionSummary.missingTargets.length > 0 && (
              <div className="mt-3">
                <p className="text-[10px] italic text-carbon/50 select-none">Targets del diagrama aún sin mención conectada:</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {pageConnectionSummary.missingTargets.slice(0, 10).map(target => (
                    <button
                      key={target.id}
                      type="button"
                      onClick={() => insertInteractiveTargetParagraph(target)}
                      className="rounded border border-carbon/10 bg-lienzo px-1.5 py-0.5 font-mono text-[9px] text-carbon/60 hover:border-salvia/30 hover:text-salvia cursor-pointer"
                      title={`Insertar referencia interactiva para ${target.label}`}
                    >
                      {target.id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="h-full w-full bg-lienzo flex flex-col overflow-hidden">
      <div className="border-b border-carbon/15 bg-carbon/5 p-3 select-none">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-carbon/50">Inspector de la página</h3>
        <div className="mt-2 grid grid-cols-3 gap-1" role="tablist" aria-label="Secciones del inspector">
          {([
            ['page', 'Página', Object.keys(metadata).length],
            ['diagrams', 'Diagramas', pageDiagramLinks.length],
            ['validation', 'Validación', validation.errorCount + validation.warningCount],
          ] as const).map(([id, label, count]) => (
            <button key={id} type="button" role="tab" aria-selected={section === id} onClick={() => setSection(id)} className={`rounded px-2 py-1.5 text-[10px] font-bold ${section === id ? 'bg-carbon text-lienzo' : 'text-carbon/55 hover:bg-carbon/5'}`}>
              {label} <span className="font-mono text-[8px] opacity-60">{count}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {section === 'page' && <MetadataInspector
          metadata={metadata}
          disabled={!canEditVisualMetadata}
          onChange={handleMetadataChange}
          onRemove={handleRemoveMetadataField}
          onAddCustom={handleAddCustomMetadataField}
        />}
        {section === 'diagrams' && renderPageDiagramPanel()}
        {section === 'validation' && <ValidationPanel validation={validation} onSelectIssue={onSelectIssue} />}
      </div>
    </div>
  );
};
export default MetadataPanel;
