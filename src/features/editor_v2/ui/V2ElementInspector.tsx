import React from 'react';
import { useV2InspectorAccordion } from './inspector/accordion';
import { InspectorEmptyState } from './inspector/InspectorEmptyState';
import { V2ElementInspectorPanel } from './inspector/element/V2ElementInspectorPanel';
import { V2PointInspector } from './inspector/point/V2PointInspector';
import { V2SliderInspector } from './inspector/slider/V2SliderInspector';
import type { V2ElementInspectorProps } from './inspector/types';

export { PALETTE_TOKENS } from './inspector/paletteTokens';

export const V2ElementInspector: React.FC<V2ElementInspectorProps> = ({
  model,
  selectedId,
  onUpdatePoint,
  onUpdateElement,
  onUpdateSlider,
  onDeleteSelected,
  onUpdateModel,
  onSelectId,
}) => {
  const { openAccordion, toggleAccordion } = useV2InspectorAccordion();

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
    return <V2PointInspector {...sharedProps} point={pointObj} />;
  }

  if (elementObj) {
    return <V2ElementInspectorPanel {...sharedProps} element={elementObj} />;
  }

  if (sliderObj) {
    return <V2SliderInspector {...sharedProps} slider={sliderObj} />;
  }

  return <InspectorEmptyState />;
};
