import type { VisualDiagramModel, VisualPoint, VisualElement, VisualSlider } from '@/fixed-pages/editor/diagrams/model/types';

/** Parche superficial o transformación de un punto con posición propia. */
export type PointUpdate = Partial<VisualPoint> | ((point: VisualPoint) => VisualPoint);
/** Parche superficial o transformación de un objeto del inspector de elementos. */
export type ElementUpdate = { [key: string]: unknown } | ((element: VisualElement) => VisualElement);
/** Parche superficial o transformación de un control. */
export type SliderUpdate = Partial<VisualSlider> | ((slider: VisualSlider) => VisualSlider);

export interface InspectorCallbacks {
  onUpdatePoint: (id: string, updates: PointUpdate) => void;
  onUpdateElement: (id: string, updates: ElementUpdate) => void;
  onUpdateSlider: (id: string, updates: SliderUpdate) => void;
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
