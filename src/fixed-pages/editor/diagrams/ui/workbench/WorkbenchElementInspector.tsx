import React from 'react';
import { useInspectorAccordion } from '../inspector/accordion';
import { InspectorEmptyState } from '../inspector/InspectorEmptyState';
import { ElementInspectorPanel } from '../inspector/element/ElementInspectorPanel';
import { PointInspector } from '../inspector/point/PointInspector';
import { SliderInspector } from '../inspector/slider/SliderInspector';
import type { ElementInspectorProps } from '../inspector/types';
import { isControlObject, isPositionedPoint } from '@/diagrams';
import { isModelElement } from '../../model/scene/objectLists';

export { PALETTE_TOKENS } from '../inspector/paletteTokens';

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

  const selected = model.objects.find(object => object.id === selectedId);
  const pointObj = isPositionedPoint(selected) ? selected : undefined;
  const sliderObj = isControlObject(selected) ? selected : undefined;
  const elementObj = isModelElement(selected) ? selected : undefined;

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
