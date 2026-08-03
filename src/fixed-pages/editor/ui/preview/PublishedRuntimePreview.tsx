import React, { useRef } from 'react';
import { useModalFocus } from '@/fixed-pages/editor/ui/page/useModalFocus';
import type { Block } from '@/fixed-pages/editor/session/parser';
import type { DiagramTargetRegistry } from '@/fixed-pages/editor/session/editorTypes';
import { ContentLayout } from '@/components/layouts/ContentLayout';
import { ContentHeader } from '@/components/content/ContentHeader';
import { ContentBody } from '@/components/ui/ContentBody';
import { FadeIn } from '@/components/ui/FadeIn';
import { VisualEditorBlock } from '../panels/VisualEditorBlock';

interface PublishedRuntimePreviewProps {
  open: boolean;
  path?: string | null;
  hasPendingChanges?: boolean;
  revision?: number;
  onClose: () => void;
  blocks?: Block[];
  metadata?: Record<string, unknown>;
  diagramTargets?: DiagramTargetRegistry;
  currentFile?: string | null;
}

export const PublishedRuntimePreview: React.FC<PublishedRuntimePreviewProps> = ({
  open,
  path,
  hasPendingChanges = false,
  onClose,
  blocks = [],
  metadata = {},
  diagramTargets = [],
  currentFile,
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useModalFocus<HTMLDivElement>(open, onClose, closeRef);

  if (!open) return null;

  const noop = () => {};
  const pageType = String(metadata.type || 'concepto').toLowerCase();
  const title = String(metadata.title || metadata.name || 'Sin Título');
  const description = String(metadata.description || '');
  const statement = String(metadata.statement || '');

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex flex-col bg-lienzo overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="published-preview-title"
    >
      {/* Dynamic Header Toolbar */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-carbon/15 px-4 bg-lienzo/95 backdrop-blur z-20">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-salvia animate-pulse" />
          <h2 id="published-preview-title" className="font-serif text-xs font-bold text-carbon">
            Previsualización Publicada
          </h2>
          <span className="text-[10px] font-mono text-carbon/40 hidden sm:inline">
            ({currentFile?.split('/').pop() ?? path ?? 'borrador.mdx'})
          </span>
          {hasPendingChanges && (
            <span className="rounded bg-salvia/10 px-2 py-0.5 text-[9px] font-bold text-salvia border border-salvia/20">
              ● Cambios locales en tiempo real
            </span>
          )}
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="rounded-md border border-carbon/15 bg-lienzo px-3 py-1 text-xs font-bold text-carbon/75 hover:bg-carbon/5 transition-colors cursor-pointer"
        >
          ✕ Volver al editor
        </button>
      </header>

      {/* Main Reader View Container */}
      <div className="flex-1 h-full min-h-0 overflow-y-auto">
        <ContentLayout
          pageType={pageType}
          variant="balanced"
          embedded={true}
        >
          <div className="bg-transparent text-carbon font-serif pb-16">
            <FadeIn className="w-full pt-4">
              <ContentHeader
                type={pageType}
                title={title}
                description={description}
                authors={Array.isArray(metadata.authors) ? (metadata.authors as string[]) : []}
                tags={Array.isArray(metadata.tags) ? (metadata.tags as string[]) : []}
                nodeId={String(metadata.id || '')}
              />

              {statement && (
                <div className="my-6 p-5 border-l-4 border-ocre bg-ocre/5 rounded-r shadow-xs">
                  <span className="ac-label ac-label--xs ac-label--ocre-soft mb-2 block select-none">
                    Enunciado Formal
                  </span>
                  <p className="font-serif text-base leading-relaxed text-carbon">{statement}</p>
                </div>
              )}

              <section className="mt-8 mb-8">
                <ContentBody variant="default">
                  <div className="space-y-6">
                    {blocks.map((block, index) => (
                      <VisualEditorBlock
                        key={block.id}
                        block={block}
                        blocks={blocks}
                        index={index}
                        isReadOnly={true}
                        canMutateVisualStructure={false}
                        editingBlockId={null}
                        setEditingBlockId={noop}
                        addBlock={noop}
                        moveBlock={noop}
                        duplicateBlock={noop}
                        removeBlock={noop}
                        updateBlock={noop}
                        handleTextareaSelect={noop}
                        handleEditLink={noop}
                        renderInlineToolbar={() => null}
                        setActiveDiagramIndex={noop}
                        setActiveDiagramBlockId={noop}
                        setDiagramBuilderOpen={noop}
                        diagramTargets={diagramTargets}
                      />
                    ))}
                  </div>
                </ContentBody>
              </section>
            </FadeIn>
          </div>
        </ContentLayout>
      </div>
    </div>
  );
};

export default PublishedRuntimePreview;
