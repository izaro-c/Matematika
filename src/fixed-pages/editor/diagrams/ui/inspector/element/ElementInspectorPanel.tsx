import React from 'react';
import { elementKind } from '@/fixed-pages/editor/diagrams/model';
import { AccordionSection } from '../accordion';
import { InspectorHeader } from '../WorkbenchInspectorHeader';
import { PALETTE_TOKENS } from '../paletteTokens';
import type { ElementPanelProps } from '../types';
import {
  showsConstraintsSection,
  showsContentSection,
  showsCurveSection,
  showsMarksSection,
} from '../elementSections';
import { ElementConstraintsSection } from './sections/ElementConstraintsSection';
import { ElementContentSection } from './sections/ElementContentSection';
import { ElementCurveSection } from './sections/ElementCurveSection';
import { ElementIdentitySection } from './sections/ElementIdentitySection';
import { ElementMarksSection } from './sections/ElementMarksSection';
import { ElementStyleSection } from './sections/ElementStyleSection';
import { ElementVisibilitySection } from './sections/ElementVisibilitySection';
import { DiagramElementBehaviorEditor } from '@/fixed-pages/editor/diagrams/ui/DiagramElementBehaviorEditor';
import { useI18n } from '@/i18n';

export const ElementInspectorPanel: React.FC<ElementPanelProps & {
  openAccordion: Record<string, boolean>;
  onToggleAccordion: (sec: string) => void;
}> = (props) => {
  const { t } = useI18n();
  const { model, element, onDeleteSelected, openAccordion, onToggleAccordion } = props;
  const colorToken = PALETTE_TOKENS.find(c => c.id === element.color) || PALETTE_TOKENS[4];
  const kind = elementKind(element);

  return (
    <div className="p-3 space-y-2 text-xs font-serif text-carbon">
      <InspectorHeader
        title={`${kind}: ${element.id}`}
        colorClass={colorToken.bgClass}
        onDelete={() => onDeleteSelected(element.id)}
      />

      <AccordionSection sec="identity" title={t('editor.diagramInspector.identityAndEditableReferences')} isOpen={openAccordion.identity} onToggle={onToggleAccordion}>
        <ElementIdentitySection {...props} />
      </AccordionSection>

      {showsMarksSection(kind) && (
        <AccordionSection sec="marks_congruence" title={t('editor.diagramInspector.marksAndVisualAnnotations')} isOpen={openAccordion.marks_congruence} onToggle={onToggleAccordion}>
          <ElementMarksSection {...props} />
        </AccordionSection>
      )}

      {showsCurveSection(kind) && (
        <AccordionSection sec="geometry" title={t('editor.diagramInspector.curveSection')} isOpen={openAccordion.geometry} onToggle={onToggleAccordion}>
          <ElementCurveSection {...props} />
        </AccordionSection>
      )}

      {showsContentSection(kind) && (
        <AccordionSection sec="content" title={t('editor.diagramInspector.contentSection')} isOpen={openAccordion.content} onToggle={onToggleAccordion}>
          <ElementContentSection {...props} />
        </AccordionSection>
      )}

      <AccordionSection sec="style" title={t('editor.diagramInspector.styleSection')} isOpen={openAccordion.style} onToggle={onToggleAccordion}>
        <ElementStyleSection {...props} />
      </AccordionSection>

      <AccordionSection sec="visibility_selection" title={t('editor.diagramInspector.conditionalVisibilityAndSelection')} isOpen={openAccordion.visibility_selection} onToggle={onToggleAccordion}>
        <ElementVisibilitySection object={element} onUpdate={update => props.onUpdateElement(element.id, update)} />
        <DiagramElementBehaviorEditor
          model={model}
          element={element}
          onElementChange={updates => props.onUpdateElement(element.id, updates)}
        />
      </AccordionSection>

      {showsConstraintsSection(kind) && (
        <AccordionSection sec="constraints" title={t('editor.diagramInspector.geometricConstraints')} isOpen={openAccordion.constraints} onToggle={onToggleAccordion}>
          <ElementConstraintsSection {...props} />
        </AccordionSection>
      )}
    </div>
  );
};
