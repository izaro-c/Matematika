import type { VisualDiagramModel, VisualPoint, VisualElement, VisualSlider } from '@/fixed-pages/editor/diagrams/model/types';

export interface InspectorCallbacks {
  onUpdatePoint: (id: string, updates: Partial<VisualPoint>) => void;
  onUpdateElement: (id: string, updates: Partial<VisualElement>) => void;
  onUpdateSlider: (id: string, updates: Partial<VisualSlider>) => void;
  onDeleteSelected: (id: string) => void;
  onUpdateModel?: (nextModel: VisualDiagramModel, label: string) => void;
  onSelectId?: (newId: string) => void;
}

export interface ElementInspectorProps extends InspectorCallbacks {
  model: VisualDiagramModel | null;
  selectedId: string;
}

export interface InspectorPanelProps extends InspectorCallbacks {
  model: VisualDiagramModel;
}

export interface ElementPanelProps extends InspectorPanelProps {
  element: VisualElement;
}

export interface PointPanelProps extends InspectorPanelProps {
  point: VisualPoint;
}

export interface SliderPanelProps extends InspectorPanelProps {
  slider: VisualSlider;
}
