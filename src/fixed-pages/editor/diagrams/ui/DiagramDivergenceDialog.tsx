import React from 'react';
import type { VisualDiagramModel } from '../model/types';
import { Button, Modal, controlClassName } from '@/fixed-pages/editor/ui/primitives';
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
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t('editor.diagramEditors.resolveDivergence')}
      size="lg"
      footer={
        <>
          <Button onClick={onClose}>{t('editor.diagramEditors.cancel')}</Button>
          <Button variant="primary" onClick={() => onResolve('source')}>{t('editor.diagramEditors.useSourceCode')}</Button>
          <Button variant="primary" onClick={() => onResolve('visual')}>{t('editor.diagramEditors.useVisualModel')}</Button>
        </>
      }
    >
      <p className="mb-4">{t('editor.diagramEditors.divergenceExplanation')}</p>
        <div className="grid min-h-0 gap-4 md:grid-cols-2">
          <section aria-label={t('editor.diagramEditors.visualModelPreview')} className="min-h-0 space-y-2">
            <h3 className="ed-field__label">{t('editor.diagramEditors.currentVisualModel')}</h3>
            <div className="min-h-[220px] overflow-hidden rounded border border-carbon/15">
              <DiagramResponsivePreview model={model} pageType={pageType} />
            </div>
          </section>
          <section className="min-h-0 space-y-2">
            <h3 id="diagram-divergence-source-title" className="ed-field__label">{t('editor.diagramEditors.currentSourceCode')}</h3>
            <textarea
              aria-labelledby="diagram-divergence-source-title"
              readOnly
              value={source}
              className={`${controlClassName} min-h-[220px] resize-none font-mono text-xs`}
            />
          </section>
        </div>

    </Modal>
  );
};

export default DiagramDivergenceDialog;
