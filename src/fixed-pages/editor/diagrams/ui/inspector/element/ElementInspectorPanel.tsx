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

export const ElementInspectorPanel: React.FC<ElementPanelProps & {
  openAccordion: Record<string, boolean>;
  onToggleAccordion: (sec: string) => void;
}> = (props) => {
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

      <AccordionSection sec="identity" title="Identidad & Referencias Editables" isOpen={openAccordion.identity} onToggle={onToggleAccordion}>
        <ElementIdentitySection {...props} />
      </AccordionSection>

      {showsMarksSection(kind) && (
        <AccordionSection sec="marks_congruence" title="Marcas & Anotaciones Visuales" isOpen={openAccordion.marks_congruence} onToggle={onToggleAccordion}>
          <ElementMarksSection {...props} />
        </AccordionSection>
      )}

      {showsCurveSection(kind) && (
        <AccordionSection sec="geometry" title="Fórmula de la Curva, Dominio & Relleno de Área" isOpen={openAccordion.geometry} onToggle={onToggleAccordion}>
          <ElementCurveSection {...props} />
        </AccordionSection>
      )}

      {showsContentSection(kind) && (
        <AccordionSection sec="content" title="Contenido del Panel, Bloques & Posición" isOpen={openAccordion.content} onToggle={onToggleAccordion}>
          <ElementContentSection {...props} />
        </AccordionSection>
      )}

      <AccordionSection sec="style" title="Estilo, Grosor & Resaltado en Hover" isOpen={openAccordion.style} onToggle={onToggleAccordion}>
        <ElementStyleSection {...props} />
      </AccordionSection>

      <AccordionSection sec="visibility_selection" title="Visibilidad Condicionada & Selección" isOpen={openAccordion.visibility_selection} onToggle={onToggleAccordion}>
        <ElementVisibilitySection object={element} onUpdate={update => props.onUpdateElement(element.id, update)} />
        <DiagramElementBehaviorEditor
          model={model}
          element={element}
          onElementChange={updates => props.onUpdateElement(element.id, updates)}
        />
      </AccordionSection>

      {showsConstraintsSection(kind) && (
        <AccordionSection sec="constraints" title="Restricciones Geométricas" isOpen={openAccordion.constraints} onToggle={onToggleAccordion}>
          <ElementConstraintsSection {...props} />
        </AccordionSection>
      )}
    </div>
  );
};
