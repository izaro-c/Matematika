import React from 'react';
import { DiagramRenderer } from '@/diagrams/public';
import { MathProviderBoundary } from '@/lib/page-context/MathStoreContext';
import type { VisualDiagramModel } from '../model/types';
import { DiagramViewportFrame } from './DiagramViewportFrame';

interface DiagramResponsivePreviewProps {
  model: VisualDiagramModel;
  pageType?: string;
  activeStepId?: string;
  highlightedId?: string;
}

export const DiagramResponsivePreview: React.FC<DiagramResponsivePreviewProps> = ({ model, pageType, activeStepId, highlightedId }) => (
  <DiagramViewportFrame title="Previsualización real" subtitle="Renderer de publicación · dimensiones CSS reales" pageType={pageType} testId="diagram-responsive-preview">
    <MathProviderBoundary>
      <DiagramRenderer spec={model} mode="runtime" activeStepId={activeStepId} highlightedIds={highlightedId ? [highlightedId] : []} />
    </MathProviderBoundary>
  </DiagramViewportFrame>
);

export default DiagramResponsivePreview;
