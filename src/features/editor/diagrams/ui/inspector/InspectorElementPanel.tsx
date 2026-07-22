import React from 'react';
import type { VisualDiagramModel, VisualElement } from '../../model/types';
import { DiagramElementAppearanceEditor } from '../DiagramElementAppearanceEditor';
import { DiagramElementBehaviorEditor } from '../DiagramElementBehaviorEditor';
import { InspectorElementIdentitySection } from './InspectorElementIdentitySection';
import { InspectorElementRefsSection } from './InspectorElementRefsSection';
import { InspectorElementContentSection } from './InspectorElementContentSection';
import { InspectorElementKindGeometrySection } from './InspectorElementKindGeometrySection';
import type { InspectorHandlers } from './useInspectorHandlers';
import type { InspectorSection } from './inspectorUtils';

interface InspectorElementPanelProps {
  model: VisualDiagramModel;
  element: VisualElement;
  activeSection: InspectorSection;
  attachedLabel: VisualElement | undefined;
  handlers: InspectorHandlers;
  onModelEdit: (model: VisualDiagramModel) => void;
  onSelect: (id: string) => void;
  onAddElementLabel?: (elementId: string) => void;
}

export const InspectorElementPanel: React.FC<InspectorElementPanelProps> = ({
  model,
  element,
  activeSection,
  attachedLabel,
  handlers,
  onModelEdit,
  onSelect,
  onAddElementLabel,
}) => (
  <div className="space-y-3">
    <InspectorElementIdentitySection
      model={model}
      element={element}
      activeSection={activeSection}
      attachedLabel={attachedLabel}
      handlers={handlers}
      onModelEdit={onModelEdit}
      onSelect={onSelect}
      onAddElementLabel={onAddElementLabel}
    />

    <InspectorElementRefsSection
      model={model}
      element={element}
      activeSection={activeSection}
      handlers={handlers}
      onModelEdit={onModelEdit}
    />

    <InspectorElementContentSection
      model={model}
      element={element}
      activeSection={activeSection}
      handlers={handlers}
    />

    <InspectorElementKindGeometrySection
      model={model}
      element={element}
      activeSection={activeSection}
      handlers={handlers}
    />

    {activeSection === 'appearance' && <DiagramElementAppearanceEditor element={element} onElementChange={handlers.handleElementChange} onStyleChange={handlers.handleElementStyleChange} />}
    {activeSection === 'advanced' && <DiagramElementBehaviorEditor model={model} element={element} onElementChange={handlers.handleElementChange} onPropertiesChange={handlers.handleElementPropertiesChange} />}
  </div>
);
