import React from 'react';
import { useInspectorAccordion } from './inspector/accordion';
import { InspectorEmptyState } from './inspector/InspectorEmptyState';
import { ElementInspectorPanel } from './inspector/element/ElementInspectorPanel';
import { PointInspector } from './inspector/point/PointInspector';
import { SliderInspector } from './inspector/slider/SliderInspector';
import type { ElementInspectorProps } from './inspector/types';

export { PALETTE_TOKENS } from './inspector/paletteTokens';

export const WorkbenchElementInspector: React.FC<ElementInspectorProps> = ({
  model,
  selectedId,
  onUpdatePoint,
  onUpdateElement,
  onUpdateSlider,
  onDeleteSelected,
  onUpdateModel,
  onSelectId,
}) => {
  const { openAccordion, toggleAccordion } = useInspectorAccordion();

  if (!model || !selectedId) {
    return <InspectorEmptyState />;
  }

  const pointObj = model.points.find(p => p.id === selectedId);
  const elementObj = model.elements.find(e => e.id === selectedId);
  const sliderObj = model.sliders.find(s => s.id === selectedId);

  const sharedProps = {
    model,
    onUpdatePoint,
    onUpdateElement,
    onUpdateSlider,
    onDeleteSelected,
    onUpdateModel,
    onSelectId,
    openAccordion,
    onToggleAccordion: toggleAccordion,
  };

  if (pointObj) {
    return <PointInspector {...sharedProps} point={pointObj} />;
  }

  if (elementObj) {
    return <ElementInspectorPanel {...sharedProps} element={elementObj} />;
  }

  if (sliderObj) {
    return <SliderInspector {...sharedProps} slider={sliderObj} />;
  }

  return <InspectorEmptyState />;
};
