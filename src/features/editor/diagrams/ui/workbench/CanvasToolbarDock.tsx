import React from 'react';
import type { VisualDiagramModel, CanvasTool } from '../../model/types';
import { DiagramToolbar } from '../DiagramToolbar';

interface CanvasToolbarDockProps {
  model: VisualDiagramModel;
  canvasTool: CanvasTool;
  syncStatus: string;
  currentSource?: string;
  pageType?: string;
  onSetCanvasTool: (tool: CanvasTool) => void;
  onAddElement: (tool: Exclude<CanvasTool, 'select' | 'point'>) => void;
  onModelEdit: (model: VisualDiagramModel) => void;
  onAddSlider: () => void;
  onAddGliderPoint: (supportId?: string) => void;
  onAddAllLabels?: () => void;
  onRemoveAllLabels?: () => void;
  onResolveDivergence: (authority: 'visual' | 'source') => void;
  guidedConstructions?: React.ReactNode;
}

export const CanvasToolbarDock: React.FC<CanvasToolbarDockProps> = (props) => {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-carbon/15 bg-carbon/[0.02] px-3 py-2">
      <DiagramToolbar {...props} />
    </div>
  );
};

export default CanvasToolbarDock;
