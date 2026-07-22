import React, { useState } from 'react';
import type { VisualDiagramModel } from '../model/types';
import { DiagramSceneControls } from './DiagramSceneControls';
import { InspectorHeader } from './inspector/InspectorHeader';
import { InspectorPointPanel } from './inspector/InspectorPointPanel';
import { InspectorElementPanel } from './inspector/InspectorElementPanel';
import { InspectorSliderPanel } from './inspector/InspectorSliderPanel';
import { InspectorStepPanel } from './inspector/InspectorStepPanel';
import { InspectorRelatedLinks } from './inspector/InspectorRelatedLinks';
import { inspectorSelectionSummary } from './inspector/inspectorUtils';
import { useInspectorHandlers } from './inspector/useInspectorHandlers';

interface DiagramInspectorProps {
  model: VisualDiagramModel;
  selectedId: string;
  selectedIds?: readonly string[];
  onSelect: (id: string) => void;
  onModelEdit: (model: VisualDiagramModel) => void;
  onDeleteSelected: () => void;
  onAddElementLabel?: (elementId: string) => void;
  onCopySelection?: () => void;
}

export const DiagramInspector: React.FC<DiagramInspectorProps> = ({
  model,
  selectedId,
  selectedIds = [],
  onSelect,
  onModelEdit,
  onDeleteSelected,
  onAddElementLabel,
  onCopySelection,
}) => {
  const [inspectorSection, setInspectorSection] = useState<'general' | 'geometry' | 'appearance' | 'advanced'>('general');
  const selectedPoint = model.points.find(item => item.id === selectedId);
  const selectedElement = model.elements.find(item => item.id === selectedId);
  const selectedSlider = model.sliders.find(item => item.id === selectedId);
  const selectedStep = model.steps.find(item => item.id === selectedId);
  const activeInspectorSection = selectedStep ? 'general' : inspectorSection;
  const selectedSceneItem = selectedPoint || selectedElement || selectedSlider;
  const relatedConstraints = selectedSceneItem
    ? (model.constraints ?? []).filter(constraint => constraint.refs.includes(selectedSceneItem.id))
    : [];
  const relatedDependencies = selectedSceneItem
    ? (model.dependencies ?? []).filter(dependency => dependency.sourceId === selectedSceneItem.id || dependency.targetId === selectedSceneItem.id)
    : [];
  const attachedLabel = selectedElement?.kind === 'label'
    ? undefined
    : model.elements.find(item => item.kind === 'label' && item.refs[0] === selectedElement?.id);

  const hasSelection = selectedPoint || selectedElement || selectedSlider || selectedStep;
  const selectionSummary = inspectorSelectionSummary(selectedPoint, selectedElement, selectedSlider, selectedStep);

  const handlers = useInspectorHandlers({
    model,
    selectedPoint,
    selectedElement,
    selectedSlider,
    selectedStep,
    onModelEdit,
  });

  return (
    <section className="diagram-inspector h-full overflow-y-auto bg-lienzo px-3 pb-4 [&_details]:rounded-none [&_details]:border-x-0 [&_details]:border-b-0">
      <InspectorHeader
        selectionSummary={selectionSummary}
        selectedIds={selectedIds}
        hasSelection={Boolean(hasSelection)}
        selectedStep={Boolean(selectedStep)}
        activeInspectorSection={activeInspectorSection}
        inspectorSection={inspectorSection}
        onSectionChange={setInspectorSection}
        onCopySelection={onCopySelection}
      />

      {selectedPoint && (
        <InspectorPointPanel
          model={model}
          point={selectedPoint}
          activeSection={activeInspectorSection}
          handlers={handlers}
          onModelEdit={onModelEdit}
          onSelect={onSelect}
        />
      )}

      {selectedElement && (
        <InspectorElementPanel
          model={model}
          element={selectedElement}
          activeSection={activeInspectorSection}
          attachedLabel={attachedLabel}
          handlers={handlers}
          onModelEdit={onModelEdit}
          onSelect={onSelect}
          onAddElementLabel={onAddElementLabel}
        />
      )}

      {selectedSlider && (
        <InspectorSliderPanel
          model={model}
          slider={selectedSlider}
          activeSection={activeInspectorSection}
          handlers={handlers}
          onModelEdit={onModelEdit}
          onSelect={onSelect}
        />
      )}

      {selectedSceneItem && (
        <InspectorRelatedLinks
          model={model}
          activeSection={activeInspectorSection}
          relatedConstraints={relatedConstraints}
          relatedDependencies={relatedDependencies}
        />
      )}

      {selectedStep && (
        <InspectorStepPanel
          step={selectedStep}
          handlers={handlers}
        />
      )}

      {activeInspectorSection === 'advanced' && selectedSceneItem && <DiagramSceneControls model={model} point={selectedPoint} element={selectedElement} slider={selectedSlider} onModelEdit={onModelEdit} />}

      {hasSelection && (
        <button
          onClick={onDeleteSelected}
          className="mt-6 min-h-11 w-full rounded border border-granada/25 bg-granada/10 px-3 text-xs font-bold text-granada transition-all hover:bg-granada hover:text-lienzo"
        >
          Eliminar elemento
        </button>
      )}
    </section>
  );
};
export default DiagramInspector;
