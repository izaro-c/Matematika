import React from 'react';
import type { Block } from '@/fixed-pages/editor/session/parser';
import type { DiagramTargetRegistry } from '@/fixed-pages/editor/session/editorTypes';
import { DiagramRuntimePreview } from '../../diagrams/ui/DiagramRuntimePreview';
import { AccordionSection, useInspectorAccordion } from '../../diagrams/ui/inspector/accordion';
import { useMathStore } from '@/lib/page-context/MathStoreContext';

interface PageDiagramLink {
  componentName: string;
  importSource?: string;
  path?: string;
  role: 'Simulation' | 'Diagram' | 'Inline' | 'Imported';
  targets?: DiagramTargetRegistry;
}

interface MetadataPanelProps {
  metadata: Record<string, unknown>;
  canMutateVisualStructure: boolean;
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
}

const DIAGRAM_ACCORDION = {
  linked: true,
  targets: true,
  connections: true,
  semantic: true,
};

/** Diagramas tab body for the MDX inspector (linked diagrams, targets, connections, lean). */
export const MetadataPanel: React.FC<MetadataPanelProps> = ({
  metadata,
  canMutateVisualStructure,
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
}) => {
  const setVariable = useMathStore(state => state.setVariable);
  const { openAccordion, toggleAccordion } = useInspectorAccordion(DIAGRAM_ACCORDION);

  const openBuilder = (blockId: string | null, index: number | null) => {
    setActiveDiagramBlockId(blockId);
    setActiveDiagramIndex(index);
    setDiagramBuilderOpen(true);
  };

  return (
    <div className="space-y-2 p-3 text-xs font-serif text-carbon">
      <AccordionSection sec="linked" title="Diagramas enlazados" isOpen={openAccordion.linked} onToggle={toggleAccordion}>
        {pageDiagramLinks.length === 0 ? (
          <div className="mt-2 rounded border border-dashed border-carbon/20 bg-carbon/5 p-3">
            <p className="text-xs italic text-carbon/55">Esta página aún no tiene diagramas enlazados.</p>
            {canMutateVisualStructure && (
              <button
                type="button"
                onClick={() => openBuilder(null, blocks.length)}
                className="mt-3 rounded bg-pavo px-3 py-1.5 text-[10px] font-bold text-lienzo cursor-pointer"
              >
                Vincular diagrama
              </button>
            )}
          </div>
        ) : (
          <div className="mt-2 space-y-2">
            {canMutateVisualStructure && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => openBuilder(null, blocks.length)}
                  className="rounded bg-pavo/10 px-2 py-1 text-[9px] font-bold text-pavo hover:bg-pavo/20 cursor-pointer"
                >
                  Añadir
                </button>
              </div>
            )}
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
                    Abrir diagrama
                  </button>
                  {canMutateVisualStructure && (
                    <button
                      type="button"
                      onClick={() => {
                        const block = blocks.find(item => item.type === 'diagram' && item.content === link.componentName);
                        openBuilder(block?.id ?? null, block ? null : blocks.length);
                      }}
                      className="rounded bg-salvia/10 px-2 py-1 text-[10px] font-bold text-salvia hover:bg-salvia/20 cursor-pointer"
                    >
                      Reemplazar
                    </button>
                  )}
                </div>
                <div className="mt-3">
                  <DiagramRuntimePreview
                    filePath={link.path ?? link.importSource ?? null}
                    componentName={link.componentName}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </AccordionSection>

      <AccordionSection sec="targets" title="Targets publicados" isOpen={openAccordion.targets} onToggle={toggleAccordion}>
        <div className="mt-2 rounded border border-carbon/10 bg-carbon/5 p-3" aria-label="Navegador de targets">
          {diagramTargetsLoading && <span className="text-[9px] text-carbon/45">Analizando…</span>}
          {diagramTargetsError && <p className="text-[10px] text-granada" role="alert">{diagramTargetsError}</p>}
          {!diagramTargetsLoading && diagramTargets.length === 0 && (
            <p className="text-[10px] italic text-carbon/45">El diagrama no publica targets editables o requiere modo código.</p>
          )}
          <div className="mt-2 flex flex-wrap gap-1">
            {diagramTargets.map(target => (
              <button
                key={target.qualifiedId ?? target.id}
                type="button"
                onMouseEnter={() => setVariable('highlight', target.qualifiedId ?? target.id)}
                onMouseLeave={() => setVariable('highlight', null)}
                onFocus={() => setVariable('highlight', target.qualifiedId ?? target.id)}
                onBlur={() => setVariable('highlight', null)}
                onClick={() => setVariable('highlight', target.qualifiedId ?? target.id)}
                className="rounded border border-carbon/10 bg-lienzo px-2 py-1 text-left hover:border-ocre/35 hover:bg-ocre/5 cursor-pointer"
                aria-label={`Resaltar target ${target.label}`}
              >
                <span className="block text-[10px] font-bold text-carbon">{target.label}</span>
                <span className="block font-mono text-[8px] text-carbon/45">{target.qualifiedId ?? target.id}</span>
              </button>
            ))}
          </div>
        </div>
      </AccordionSection>

      <AccordionSection sec="connections" title="Conexiones texto↔diagrama" isOpen={openAccordion.connections} onToggle={toggleAccordion}>
        <div className="mt-2 rounded border border-carbon/10 bg-carbon/5 p-3">
          {pageConnectionSummary.invalidConnections.length > 0 && (
            <div className="mb-2 rounded border border-granada/25 bg-granada/5 p-2 text-[10px] text-granada" role="alert">
              Referencias inexistentes: {pageConnectionSummary.invalidConnections.map(item => item.target).join(', ')}.
            </div>
          )}
          {pageConnectionSummary.ambiguousConnections.length > 0 && (
            <div className="mb-2 rounded border border-ocre/25 bg-ocre/5 p-2 text-[10px] text-carbon" role="status">
              Targets presentes en varios diagramas: {pageConnectionSummary.ambiguousConnections.map(item => item.target).join(', ')}. Use el formato diagrama:target.
            </div>
          )}
          {pageConnectionSummary.connected.length > 0 ? (
            <div className="space-y-1">
              {pageConnectionSummary.connected.slice(0, 8).map((connection, index) => (
                <div key={`${connection.target}-${index}`} className="flex items-center justify-between gap-2 rounded bg-lienzo px-2 py-1 text-[10px]">
                  <span className="truncate font-serif font-bold text-carbon">{connection.label || connection.target}</span>
                  <span className="shrink-0 font-mono text-[9px] text-salvia">{connection.target}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] italic text-carbon/50">Sin conexiones activas registradas.</p>
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
      </AccordionSection>

      <AccordionSection sec="semantic" title="Lean / semántica" isOpen={openAccordion.semantic} onToggle={toggleAccordion}>
        <div className="mt-2 space-y-2 rounded border border-carbon/15 bg-lienzo p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-carbon/70">ID Formalizado:</span>
            <span className="rounded border border-carbon/10 bg-carbon/5 px-2 py-0.5 font-mono font-bold">
              {(metadata.leanId as string) || 'Sin asignar'}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-carbon/70">
            Los enlaces ConceptLink / RefLink se insertan desde el editor de texto (atajo de enlazado semántico).
          </p>
        </div>
      </AccordionSection>
    </div>
  );
};

export default MetadataPanel;
