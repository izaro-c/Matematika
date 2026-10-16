import React, { useRef } from 'react';
import type { VisualDiagramModel } from '../model/types';
import { useModalFocus } from '@/fixed-pages/editor/ui/page/useModalFocus';
import { DiagramButton } from './primitives';
import { DiagramResponsivePreview } from './DiagramResponsivePreview';
import { useI18n } from '@/i18n';

export interface DiagramDivergenceDialogProps {
  isOpen: boolean;
  model: VisualDiagramModel;
  source: string;
  pageType?: string;
  onResolve: (authority: 'visual' | 'source') => void;
  onClose: () => void;
}

export const DiagramDivergenceDialog: React.FC<DiagramDivergenceDialogProps> = ({
  isOpen,
  model,
  source,
  pageType,
  onResolve,
  onClose,
}) => {
  const { t } = useI18n();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useModalFocus<HTMLElement>(isOpen, onClose, cancelRef);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-carbon/30 p-4" role="presentation">
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="diagram-divergence-title"
        aria-describedby="diagram-divergence-description"
        className="flex max-h-[min(900px,95vh)] w-full max-w-5xl flex-col overflow-hidden rounded border border-carbon/20 bg-lienzo shadow-xl"
      >
        <header className="border-b border-carbon/15 bg-granada/5 p-4">
          <h2 id="diagram-divergence-title" className="font-serif text-lg font-bold text-carbon">{t('editor.diagramEditors.resolveDivergence')}</h2>
          <p id="diagram-divergence-description" className="mt-1 text-sm leading-relaxed text-carbon/70">
            {t('editor.diagramEditors.divergenceExplanation')}
          </p>
        </header>

        <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto p-4 md:grid-cols-2">
          <section aria-label={t('editor.diagramEditors.visualModelPreview')} className="min-h-0 space-y-2">
            <h3 className="ac-label ac-label--sm">{t('editor.diagramEditors.currentVisualModel')}</h3>
            <div className="min-h-[220px] overflow-hidden rounded border border-carbon/15">
              <DiagramResponsivePreview model={model} pageType={pageType} />
            </div>
          </section>
          <section className="min-h-0 space-y-2">
            <h3 id="diagram-divergence-source-title" className="ac-label ac-label--sm">{t('editor.diagramEditors.currentSourceCode')}</h3>
            <textarea
              aria-labelledby="diagram-divergence-source-title"
              readOnly
              value={source}
              className="min-h-[220px] w-full resize-none rounded border border-carbon/15 bg-carbon/[0.03] p-3 font-mono text-[11px] leading-relaxed text-carbon"
            />
          </section>
        </div>

        <footer className="flex flex-wrap justify-end gap-2 border-t border-carbon/15 bg-carbon/5 p-4">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            className="min-h-11 rounded border border-carbon/20 px-3 text-xs font-bold text-carbon hover:bg-carbon/5"
          >
            {t('editor.diagramEditors.cancel')}
          </button>
          <DiagramButton type="button" variant="primary" onClick={() => onResolve('source')}>{t('editor.diagramEditors.useSourceCode')}</DiagramButton>
          <DiagramButton type="button" variant="primary" onClick={() => onResolve('visual')}>{t('editor.diagramEditors.useVisualModel')}</DiagramButton>
        </footer>
      </section>
    </div>
  );
};

export default DiagramDivergenceDialog;
