import React from 'react';
import { useI18n } from '@/i18n';
import type { Block } from '@/fixed-pages/editor/session/parser';
import type { DiagramTargetRegistry } from '@/fixed-pages/editor/session/editorTypes';
import { DiagramRuntimePreview } from '../../diagrams/ui/DiagramRuntimePreview';
import { AccordionSection, useInspectorAccordion } from '../../diagrams/ui/inspector/accordion';
import { useMathStore } from '@/lib/page-context/MathStoreContext';

export interface PageDiagramLink {
  componentName: string;
  importSource?: string;
  path?: string;
  role: 'Simulation' | 'Diagram' | 'Inline' | 'Imported';
  targets?: DiagramTargetRegistry;
}

export interface MetadataPanelProps {
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
  removeBlock?: (id: string) => void;
  handleMetadataChange?: (key: string, value: unknown) => void;
}

const DIAGRAM_ACCORDION = {
  linked: true,
  targets: true,
  connections: true,
  semantic: true,
};

/** Diagramas tab body for the MDX inspector (linked diagrams, targets, connections). */
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
  removeBlock,
  handleMetadataChange,
}) => {
  const { t } = useI18n();
  const setVariable = useMathStore(state => state.setVariable);
  const { openAccordion, toggleAccordion } = useInspectorAccordion(DIAGRAM_ACCORDION);
  const [collapsedPreviews, setCollapsedPreviews] = React.useState<Record<string, boolean>>({});

  const syncMetadataOnAdd = () => {
    if (pageDiagramLinks.length === 0 && handleMetadataChange) {
      if ('hasSimulation' in metadata || metadata.type !== 'modelo') handleMetadataChange('hasSimulation', true);
      if ('hasDiagram' in metadata || metadata.type === 'modelo') handleMetadataChange('hasDiagram', true);
    }
  };

  const openBuilder = (blockId: string | null, index: number | null) => {
    syncMetadataOnAdd();
    setActiveDiagramBlockId(blockId);
    setActiveDiagramIndex(index);
    setDiagramBuilderOpen(true);
  };

  const handleDeleteDiagram = (link: PageDiagramLink) => {
    const block = blocks.find(item => item.type === 'diagram' && item.content === link.componentName);
    if (block && removeBlock) {
      removeBlock(block.id);
    }
    if (pageDiagramLinks.length <= 1 && handleMetadataChange) {
      if ('hasSimulation' in metadata || metadata.type !== 'modelo') handleMetadataChange('hasSimulation', false);
      if ('hasDiagram' in metadata || metadata.type === 'modelo') handleMetadataChange('hasDiagram', false);
    }
  };

  const togglePreview = (key: string) => {
    setCollapsedPreviews(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-1 space-y-3 overflow-y-auto bg-lienzo p-4">
      <div className="flex items-center justify-between border-b border-carbon/15 pb-3">
        <div>
          <h3 className="font-serif text-base font-bold text-carbon">{t('editor.diagramPanel.title')}</h3>
          <p className="text-xs italic text-carbon/50">{t('editor.diagramPanel.subtitle')}</p>
        </div>
        <span className="ac-label ac-label--sm ac-label--canela select-none uppercase tracking-wider">
          {t(pageDiagramLinks.length === 1 ? 'editor.diagramPanel.countOne' : 'editor.diagramPanel.countOther', { count: pageDiagramLinks.length })}
        </span>
      </div>

      <AccordionSection sec="linked" title={t('editor.diagramPanel.linked')} isOpen={openAccordion.linked} onToggle={toggleAccordion}>
        {pageDiagramLinks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-carbon/20 bg-carbon/5 p-4 text-center">
            <p className="text-xs italic text-carbon/60">{t('editor.diagramPanel.noLinked')}</p>
            {canMutateVisualStructure && (
              <button
                type="button"
                onClick={() => openBuilder(null, blocks.length)}
                className="mt-3 rounded-lg border border-canela/30 bg-canela/10 px-3 py-1.5 text-xs font-bold text-canela hover:bg-canela/20 transition-colors cursor-pointer"
              >
                {t('editor.diagramPanel.linkDiagram')}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {canMutateVisualStructure && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => openBuilder(null, blocks.length)}
                  className="rounded-lg border border-canela/30 bg-canela/10 px-2.5 py-1 text-xs font-bold text-canela hover:bg-canela/20 transition-colors cursor-pointer"
                >
                  {t('editor.diagramPanel.add')}
                </button>
              </div>
            )}
            {pageDiagramLinks.map((link, index) => {
              const cardKey = `${link.componentName}-${link.path || link.importSource}-${index}`;
              const isPreviewCollapsed = Boolean(collapsedPreviews[cardKey]);
              return (
                <div key={cardKey} className="rounded-xl border border-carbon/12 bg-lienzo/80 p-3.5 shadow-2xs space-y-3 transition-all hover:border-carbon/20">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-serif text-xs font-bold text-carbon">{link.componentName}</p>
                      <p className="mt-0.5 truncate font-mono text-[10px] text-carbon/50">{link.path || link.importSource || t('editor.diagramPanel.noFile')}</p>
                    </div>
                    <span className="ac-label ac-label--xs ac-label--canela shrink-0">{link.role}</span>
                  </div>

                  {canMutateVisualStructure && link.targets && link.targets.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-medium text-carbon/55 block">{t('editor.diagramPanel.linkableTargets')}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {link.targets.slice(0, 6).map(target => (
                          <button
                            key={target.qualifiedId ?? target.id}
                            type="button"
                            onClick={() => insertInteractiveTargetParagraph(target)}
                            className="inline-flex items-center gap-1 rounded-md border border-carbon/15 bg-lienzo px-2 py-0.5 font-mono text-[10px] text-carbon/70 hover:border-canela/40 hover:bg-canela/5 hover:text-canela transition-colors cursor-pointer shadow-2xs"
                            title={t('editor.diagramPanel.insertInteractiveText', { label: target.label ?? target.id })}
                          >
                            <span className="text-canela/70 font-sans font-bold">+</span>
                            <span>{target.id}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-carbon/10">
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        disabled={!link.path}
                        onClick={() => link.path && openFile(link.path)}
                        className="rounded-lg border border-carbon/15 bg-carbon/5 px-2.5 py-1 text-[11px] font-bold text-carbon/70 hover:bg-carbon/10 hover:text-carbon disabled:cursor-not-allowed disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        {t('editor.diagramPanel.open')}
                      </button>
                      {canMutateVisualStructure && (
                        <button
                          type="button"
                          onClick={() => handleDeleteDiagram(link)}
                          className="rounded-lg border border-granada/30 bg-granada/10 px-2.5 py-1 text-[11px] font-bold text-granada hover:bg-granada/20 transition-colors cursor-pointer"
                          title={t('editor.diagramPanel.removeFromDocument')}
                        >
                          {t('editor.diagramPanel.remove')}
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => togglePreview(cardKey)}
                      className="text-[10px] font-bold text-carbon/55 hover:text-carbon transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>{isPreviewCollapsed ? t('editor.diagramPanel.showPreview') : t('editor.diagramPanel.hidePreview')}</span>
                      <svg className={`w-3 h-3 transition-transform ${isPreviewCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {!isPreviewCollapsed && (
                    <div className="pt-1">
                      <DiagramRuntimePreview
                        filePath={link.path ?? link.importSource ?? null}
                        componentName={link.componentName}
                        height="280px"
                        viewportControls={false}
                        isolateMathStore={false}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </AccordionSection>

      <AccordionSection sec="targets" title={t('editor.diagramPanel.publishedTargets')} isOpen={openAccordion.targets} onToggle={toggleAccordion}>
        <div className="space-y-2" aria-label={t('editor.diagramPanel.targetBrowser')}>
          {diagramTargetsLoading && <span className="text-xs italic text-carbon/50">{t('editor.diagramPanel.analyzing')}</span>}
          {diagramTargetsError && (
            <div className="rounded-xl border border-granada/30 bg-granada/5 p-3 text-xs text-granada" role="alert">
              {diagramTargetsError}
            </div>
          )}
          {!diagramTargetsLoading && !diagramTargetsError && diagramTargets.length === 0 && (
            <p className="text-xs italic text-carbon/50">{t('editor.diagramPanel.noTargets')}</p>
          )}
          <div className="grid grid-cols-1 gap-1.5">
            {diagramTargets.map(target => (
              <button
                key={target.qualifiedId ?? target.id}
                type="button"
                onMouseEnter={() => setVariable('highlight', target.qualifiedId ?? target.id)}
                onMouseLeave={() => setVariable('highlight', null)}
                onFocus={() => setVariable('highlight', target.qualifiedId ?? target.id)}
                onBlur={() => setVariable('highlight', null)}
                onClick={() => setVariable('highlight', target.qualifiedId ?? target.id)}
                className="group flex items-center justify-between rounded-lg border border-carbon/15 bg-lienzo px-3 py-2 text-left hover:border-canela/40 hover:bg-canela/5 transition-all cursor-pointer shadow-2xs"
                aria-label={t('editor.diagramPanel.highlightTarget', { label: target.label ?? target.id })}
              >
                <span className="text-xs font-bold text-carbon group-hover:text-canela transition-colors">{target.label}</span>
                <span className="font-mono text-[10px] text-carbon/50 bg-carbon/5 px-1.5 py-0.5 rounded border border-carbon/10">{target.qualifiedId ?? target.id}</span>
              </button>
            ))}
          </div>
        </div>
      </AccordionSection>

      <AccordionSection sec="connections" title={t('editor.diagramPanel.connections')} isOpen={openAccordion.connections} onToggle={toggleAccordion}>
        <div className="space-y-2.5">
          {pageConnectionSummary.invalidConnections.length > 0 && (
            <div className="rounded-xl border border-granada/30 bg-granada/5 p-3 text-xs text-granada space-y-1" role="alert">
              <span className="font-bold uppercase tracking-wider text-[10px] text-granada block">{t('editor.diagramPanel.missingReferences')}</span>
              <p className="font-mono text-[11px]">{pageConnectionSummary.invalidConnections.map(item => item.target).join(', ')}</p>
            </div>
          )}
          {pageConnectionSummary.ambiguousConnections.length > 0 && (
            <div className="rounded-xl border border-ocre/30 bg-ocre/5 p-3 text-xs text-carbon space-y-1" role="status">
              <span className="font-bold uppercase tracking-wider text-[10px] text-ocre block">{t('editor.diagramPanel.ambiguity')}</span>
              <p className="text-xs text-carbon/80">{t('editor.diagramPanel.ambiguousTargets', { targets: pageConnectionSummary.ambiguousConnections.map(item => item.target).join(', '), format: 'diagrama:target' })}</p>
            </div>
          )}
          {pageConnectionSummary.connected.length > 0 ? (
            <div className="space-y-1.5">
              {pageConnectionSummary.connected.slice(0, 8).map((connection, index) => (
                <div key={`${connection.target}-${index}`} className="flex items-center justify-between gap-2 rounded-lg border border-carbon/10 bg-lienzo px-3 py-2 text-xs shadow-2xs">
                  <span className="truncate font-serif font-bold text-carbon">{connection.label || connection.target}</span>
                  <span className="shrink-0 font-mono text-[10px] font-medium text-canela bg-canela/10 px-2 py-0.5 rounded border border-canela/20">{connection.target}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs italic text-carbon/50">{t('editor.diagramPanel.noConnections')}</p>
          )}
          {canMutateVisualStructure && pageConnectionSummary.missingTargets.length > 0 && (
            <div className="pt-2 border-t border-carbon/10">
              <p className="text-xs font-medium text-carbon/70 mb-2">{t('editor.diagramPanel.unmentionedTargets')}</p>
              <div className="flex flex-wrap gap-1.5">
                {pageConnectionSummary.missingTargets.slice(0, 10).map(target => (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => insertInteractiveTargetParagraph(target)}
                    className="inline-flex items-center gap-1 rounded-md border border-carbon/15 bg-lienzo px-2 py-1 font-mono text-[10px] text-carbon/70 hover:border-canela/40 hover:bg-canela/5 hover:text-canela transition-colors cursor-pointer shadow-2xs"
                    title={t('editor.diagramPanel.insertInteractiveRef', { label: target.label ?? target.id })}
                  >
                    <span className="text-canela font-bold font-sans">+</span>
                    <span>{target.id}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </AccordionSection>

      <AccordionSection sec="semantic" title={t('editor.diagramPanel.semantic')} isOpen={openAccordion.semantic} onToggle={toggleAccordion}>
        <div className="rounded-xl border border-carbon/10 bg-lienzo/60 p-3.5 shadow-2xs space-y-2">
          <p className="text-xs leading-relaxed text-carbon/60">
            <code className="font-mono text-[10px] text-canela bg-canela/10 px-1 py-0.5 rounded">ConceptLink</code> · <code className="font-mono text-[10px] text-canela bg-canela/10 px-1 py-0.5 rounded">RefLink</code>
            <br />
            {t('editor.diagramPanel.semanticNote')}
          </p>
        </div>
      </AccordionSection>
    </div>
  );
};

export default MetadataPanel;
