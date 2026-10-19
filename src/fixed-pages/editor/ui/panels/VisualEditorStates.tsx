import React from 'react';
import { useI18n } from '@/i18n';
import { Button } from '../primitives';

/** Esqueleto de la página mientras se carga el documento. */
export const VisualEditorSkeleton: React.FC = () => {
  const { t } = useI18n();
  return (
    <div
      className="max-w-2xl mx-auto py-8 space-y-6 font-serif animate-pulse"
      role="status"
      aria-busy="true"
      aria-label={t('editor.visual.loadingDocument')}
    >
      <span className="sr-only">{t('editor.visual.loadingContent')}</span>
      {/* Header Skeleton */}
      <div className="pb-6 border-b border-carbon/15 space-y-3">
        <div className="h-5 w-20 rounded-full bg-canela/20" />
        <div className="h-8 w-3/4 rounded-lg bg-carbon/15 mt-2" />
        <div className="space-y-1.5 pt-1">
          <div className="h-4 w-full rounded bg-carbon/10" />
          <div className="h-4 w-5/6 rounded bg-carbon/10" />
        </div>
      </div>

      {/* Statement Box Skeleton */}
      <div className="p-4 border-l-4 border-ocre/40 bg-ocre/5 rounded-r space-y-2.5">
        <div className="h-3.5 w-28 rounded bg-ocre/20" />
        <div className="h-4 w-full rounded bg-carbon/10" />
        <div className="h-4 w-4/5 rounded bg-carbon/10" />
      </div>

      {/* Paragraph Skeletons */}
      <div className="space-y-4 pt-2">
        <div className="flex items-start gap-3">
          <div className="h-10 w-8 rounded bg-carbon/15 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-full rounded bg-carbon/10" />
            <div className="h-4 w-full rounded bg-carbon/10" />
            <div className="h-4 w-3/4 rounded bg-carbon/10" />
          </div>
        </div>

        <div className="space-y-2 pt-3">
          <div className="h-4 w-full rounded bg-carbon/10" />
          <div className="h-4 w-11/12 rounded bg-carbon/10" />
          <div className="h-4 w-2/3 rounded bg-carbon/10" />
        </div>
      </div>
    </div>
  );
};

interface VisualEditorEmptyProps {
  /** Cabecera de la página, que se muestra también sin bloques. */
  children?: React.ReactNode;
  canMutateVisualStructure: boolean;
  onAddParagraph: () => void;
}

/** Página sin bloques: invita a añadir el primer párrafo. */
export const VisualEditorEmpty: React.FC<VisualEditorEmptyProps> = ({ children, canMutateVisualStructure, onAddParagraph }) => {
  const { t } = useI18n();
  return (
    <div className="max-w-2xl mx-auto py-8">
      {children}
      <div className="flex flex-col items-center justify-center h-64 border border-dashed border-carbon/25 rounded-2xl p-8 text-center bg-carbon/5">
        <svg className="h-10 w-10 text-carbon/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <p className="mt-3 text-sm font-serif font-bold text-carbon">{t('editor.visual.emptyPageTitle')}</p>
        <p className="mt-1 text-xs text-carbon/60 max-w-sm">
          {t('editor.visual.emptyPageBody')}
        </p>
        <Button
          variant="primary"
          className="mt-4"
          disabled={!canMutateVisualStructure}
          onClick={onAddParagraph}
        >
          {t('editor.visual.addParagraph')}
        </Button>
      </div>
    </div>
  );
};
