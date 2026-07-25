import type { VisualDiagramModel, VisualPoint, VisualElement, VisualSlider } from '@/features/editor/diagrams/model/types';

export interface V2InspectorCallbacks {
  onUpdatePoint: (id: string, updates: Partial<VisualPoint>) => void;
  onUpdateElement: (id: string, updates: Partial<VisualElement>) => void;
  onUpdateSlider: (id: string, updates: Partial<VisualSlider>) => void;
  onDeleteSelected: (id: string) => void;
  onUpdateModel?: (nextModel: VisualDiagramModel, label: string) => void;
  onSelectId?: (newId: string) => void;
}

export interface V2ElementInspectorProps extends V2InspectorCallbacks {
  model: VisualDiagramModel | null;
  selectedId: string;
}

export interface V2InspectorPanelProps extends V2InspectorCallbacks {
  model: VisualDiagramModel;
}

export interface V2ElementPanelProps extends V2InspectorPanelProps {
  element: VisualElement;
}

export interface V2PointPanelProps extends V2InspectorPanelProps {
  point: VisualPoint;
}

export interface V2SliderPanelProps extends V2InspectorPanelProps {
  slider: VisualSlider;
}
