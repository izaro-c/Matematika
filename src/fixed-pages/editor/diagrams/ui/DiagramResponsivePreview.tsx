import React from 'react';
import { DiagramRenderer } from '@/diagrams/public';
import { MathProviderBoundary } from '@/lib/page-context/MathStoreContext';
import type { VisualDiagramModel } from '../model/types';
import { DiagramViewportFrame } from './DiagramViewportFrame';
import { useI18n } from '@/i18n';

interface DiagramResponsivePreviewProps {
  model: VisualDiagramModel;
  pageType?: string;
  activeStepId?: string;
  highlightedId?: string;
}

export const DiagramResponsivePreview: React.FC<DiagramResponsivePreviewProps> = ({ model, pageType, activeStepId, highlightedId }) => {
  const { t } = useI18n();
  return (
  <DiagramViewportFrame title={t('editor.diagramEditors.realPreview')} subtitle={t('editor.diagramEditors.previewSubtitle')} pageType={pageType} testId="diagram-responsive-preview">
    <MathProviderBoundary>
      <DiagramRenderer spec={model} mode="runtime" activeStepId={activeStepId} highlightedIds={highlightedId ? [highlightedId] : []} />
    </MathProviderBoundary>
  </DiagramViewportFrame>
);
};

export default DiagramResponsivePreview;
