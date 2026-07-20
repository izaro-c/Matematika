import React from 'react';
import { DiagramRenderer } from '@/shared/diagrams/public';
import { MathProvider } from '@/shared/lib/MathStoreContext';
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
    <MathProvider>
      <DiagramRenderer spec={model} mode="runtime" activeStepId={activeStepId || undefined} highlightedIds={highlightedId ? [highlightedId] : []} />
    </MathProvider>
  </DiagramViewportFrame>
);

export default DiagramResponsivePreview;
