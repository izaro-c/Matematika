import React from 'react';
import type { VisualDiagramModel } from '../model/types';
import type { DiagramInspectorSection } from '../diagnostics/types';
import type { InspectorNavigationIntent } from '../diagnostics/inspectorNavigation';
import { DiagramSceneControls } from './DiagramSceneControls';
import { InspectorHeader } from './inspector/InspectorHeader';
import { InspectorPointPanel } from './inspector/InspectorPointPanel';
import { InspectorElementPanel } from './inspector/InspectorElementPanel';
import { InspectorSliderPanel } from './inspector/InspectorSliderPanel';
import { InspectorStepPanel } from './inspector/InspectorStepPanel';
import { InspectorRelatedLinks } from './inspector/InspectorRelatedLinks';
import { inspectorSelectionSummary } from './inspector/inspectorUtils';
import { useInspectorHandlers } from './inspector/useInspectorHandlers';
import { useInspectorFieldScroll } from './inspector/useInspectorFieldScroll';

interface DiagramInspectorProps {
  model: VisualDiagramModel;
  selectedId: string;
  selectedIds?: readonly string[];
  onSelect: (id: string) => void;
  onModelEdit: (model: VisualDiagramModel) => void;
  onDeleteSelected: () => void;
  onAddElementLabel?: (elementId: string) => void;
  onCopySelection?: () => void;
  fieldErrors?: Map<string, string>;
  navigation?: InspectorNavigationIntent | null;
  inspectorSection?: DiagramInspectorSection;
  onInspectorSectionChange?: (section: DiagramInspectorSection) => void;
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
  fieldErrors,
  navigation,
  inspectorSection,
  onInspectorSectionChange,
}) => {
  const inspectorRef = React.useRef<HTMLElement>(null);
  const [localInspectorSection, setLocalInspectorSection] = React.useState<DiagramInspectorSection>('general');
  const activeSection = inspectorSection ?? localInspectorSection;
  const setInspectorSection = onInspectorSectionChange ?? setLocalInspectorSection;

  React.useEffect(() => {
    if (!navigation) return;
    setInspectorSection(navigation.section);
    // Only re-apply when a new navigation intent arrives (revision), not when the user changes tabs.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setInspectorSection identity changes each parent render
  }, [navigation?.revision]);

  const selectedPoint = model.points.find(item => item.id === selectedId);
  const selectedElement = model.elements.find(item => item.id === selectedId);
  const selectedSlider = model.sliders.find(item => item.id === selectedId);
  const selectedStep = model.steps.find(item => item.id === selectedId);
  const activeInspectorSection = selectedStep ? 'general' : activeSection;
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

  const focusedFieldKey = navigation?.fieldKey ?? '';

  const handlers = useInspectorHandlers({
    model,
    selectedPoint,
    selectedElement,
    selectedSlider,
    selectedStep,
    onModelEdit,
  });

  useInspectorFieldScroll(inspectorRef, navigation, activeInspectorSection, selectedId);

  return (
    <section
      ref={inspectorRef}
      className="diagram-inspector h-full overflow-y-auto bg-lienzo px-3 pb-4 [&_details]:rounded-none [&_details]:border-x-0 [&_details]:border-b-0"
    >
      <InspectorHeader
        selectionSummary={selectionSummary}
        selectedIds={selectedIds}
        hasSelection={Boolean(hasSelection)}
        selectedStep={Boolean(selectedStep)}
        activeInspectorSection={activeInspectorSection}
        inspectorSection={activeSection}
        onSectionChange={setInspectorSection}
        onCopySelection={onCopySelection}
        sectionErrors={fieldErrors}
        focusedFieldKey={focusedFieldKey}
      />

      {selectedPoint && (
        <InspectorPointPanel
          model={model}
          point={selectedPoint}
          activeSection={activeInspectorSection}
          handlers={handlers}
          onModelEdit={onModelEdit}
          onSelect={onSelect}
          fieldErrors={fieldErrors}
          focusedFieldKey={focusedFieldKey}
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
          fieldErrors={fieldErrors}
          focusedFieldKey={focusedFieldKey}
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
          fieldErrors={fieldErrors}
          focusedFieldKey={focusedFieldKey}
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
