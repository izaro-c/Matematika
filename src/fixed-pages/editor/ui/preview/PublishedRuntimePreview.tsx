import React, { useRef } from 'react';
import { useModalFocus } from '@/fixed-pages/editor/ui/page/useModalFocus';
import type { Block } from '@/fixed-pages/editor/session/parser';
import type { DiagramTargetRegistry } from '@/fixed-pages/editor/session/editorTypes';
import { ContentLayout } from '@/components/layouts/ContentLayout';
import { ContentHeader } from '@/components/content/ContentHeader';
import { ContentBody } from '@/components/ui/ContentBody';
import { FadeIn } from '@/components/ui/FadeIn';
import { appPath } from '@/lib/routes';
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
  /** Si true, rellena el contenedor padre (vista Publicada del shell). */
  embedded?: boolean;
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
  embedded = false,
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useModalFocus<HTMLDivElement>(open && !embedded, onClose, closeRef);

  if (!open) return null;

  const noop = () => {};
  const pageType = String(metadata.type || 'concepto').toLowerCase();
  const title = String(metadata.title || metadata.name || 'Sin Título');
  const description = String(metadata.description || '');
  const statement = String(metadata.statement || '');
  const publishedHref = path ? appPath(path.startsWith('/') ? path : `/${path}`) : null;
  // Vista publicada real cuando hay ruta y no hay cambios locales pendientes.
  const useLiveRoute = Boolean(publishedHref) && !hasPendingChanges;

  const chrome = (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-carbon/15 px-4 bg-lienzo/95 backdrop-blur z-20">
      <div className="flex items-center space-x-2 min-w-0">
        <span className="h-2 w-2 rounded-full bg-salvia animate-pulse shrink-0" />
        <h2 id="published-preview-title" className="font-serif text-xs font-bold text-carbon">
          Publicada
        </h2>
        <span className="text-[10px] font-mono text-carbon/40 hidden sm:inline truncate">
          ({currentFile?.split('/').pop() ?? path ?? 'borrador'})
        </span>
        {hasPendingChanges && (
          <span className="rounded bg-ocre/10 px-2 py-0.5 text-[9px] font-bold text-ocre border border-ocre/20 shrink-0">
            Cambios locales (aún no en la página publicada)
          </span>
        )}
        {useLiveRoute && (
          <span className="rounded bg-musgo/10 px-2 py-0.5 text-[9px] font-bold text-musgo border border-musgo/20 shrink-0">
            Runtime publicado
          </span>
        )}
      </div>
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="rounded-md border border-carbon/15 bg-lienzo px-3 py-1 text-xs font-bold text-carbon/75 hover:bg-carbon/5 transition-colors cursor-pointer shrink-0"
      >
        ✕ Volver a edición
      </button>
    </header>
  );

  const body = useLiveRoute ? (
    <iframe
      title={`Vista publicada: ${title}`}
      src={publishedHref!}
      className="h-full w-full border-0 bg-lienzo"
    />
  ) : (
    <div className="h-full min-h-0 overflow-y-auto">
      <ContentLayout pageType={pageType} variant="balanced" embedded={true}>
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
  );

  if (embedded) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden bg-lienzo" aria-labelledby="published-preview-title">
        {chrome}
        <div className="min-h-0 flex-1">{body}</div>
      </div>
    );
  }

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex flex-col bg-lienzo overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="published-preview-title"
    >
      {chrome}
      <div className="min-h-0 flex-1">{body}</div>
    </div>
  );
};

export default PublishedRuntimePreview;
