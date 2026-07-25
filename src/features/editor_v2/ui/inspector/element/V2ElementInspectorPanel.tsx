import React from 'react';
import { AccordionSection } from '../accordion';
import { InspectorHeader } from '../InspectorHeader';
import { PALETTE_TOKENS } from '../paletteTokens';
import type { V2ElementPanelProps } from '../types';
import {
  v2ShowsConstraintsSection,
  v2ShowsContentSection,
  v2ShowsCurveSection,
  v2ShowsMarksSection,
} from '../v2ElementSections';
import { V2ElementConstraintsSection } from './sections/V2ElementConstraintsSection';
import { V2ElementContentSection } from './sections/V2ElementContentSection';
import { V2ElementCurveSection } from './sections/V2ElementCurveSection';
import { V2ElementIdentitySection } from './sections/V2ElementIdentitySection';
import { V2ElementMarksSection } from './sections/V2ElementMarksSection';
import { V2ElementStyleSection } from './sections/V2ElementStyleSection';
import { V2ElementVisibilitySection } from './sections/V2ElementVisibilitySection';
import { DiagramElementBehaviorEditor } from '@/features/editor/diagrams/ui/DiagramElementBehaviorEditor';

export const V2ElementInspectorPanel: React.FC<V2ElementPanelProps & {
  openAccordion: Record<string, boolean>;
  onToggleAccordion: (sec: string) => void;
}> = (props) => {
  const { model, element, onDeleteSelected, openAccordion, onToggleAccordion } = props;
  const colorToken = PALETTE_TOKENS.find(c => c.id === element.color) || PALETTE_TOKENS[4];

  return (
    <div className="p-3 space-y-2 text-xs font-serif text-carbon">
      <InspectorHeader
        title={`${element.kind}: ${element.id}`}
        colorClass={colorToken.bgClass}
        onDelete={() => onDeleteSelected(element.id)}
      />

      <AccordionSection sec="identity" title="Identidad & Referencias Editables" isOpen={openAccordion.identity} onToggle={onToggleAccordion}>
        <V2ElementIdentitySection {...props} />
      </AccordionSection>

      {v2ShowsMarksSection(element.kind) && (
        <AccordionSection sec="marks_congruence" title="Marcas & Anotaciones Visuales" isOpen={openAccordion.marks_congruence} onToggle={onToggleAccordion}>
          <V2ElementMarksSection {...props} />
        </AccordionSection>
      )}

      {v2ShowsCurveSection(element.kind) && (
        <AccordionSection sec="geometry" title="Fórmula de la Curva, Dominio & Relleno de Área" isOpen={openAccordion.geometry} onToggle={onToggleAccordion}>
          <V2ElementCurveSection {...props} />
        </AccordionSection>
      )}

      {v2ShowsContentSection(element.kind) && (
        <AccordionSection sec="content" title="Contenido del Panel, Bloques & Posición" isOpen={openAccordion.content} onToggle={onToggleAccordion}>
          <V2ElementContentSection {...props} />
        </AccordionSection>
      )}

      <AccordionSection sec="style" title="Estilo, Grosor & Resaltado en Hover" isOpen={openAccordion.style} onToggle={onToggleAccordion}>
        <V2ElementStyleSection {...props} />
      </AccordionSection>

      <AccordionSection sec="visibility_selection" title="Visibilidad Condicionada & Selección" isOpen={openAccordion.visibility_selection} onToggle={onToggleAccordion}>
        <V2ElementVisibilitySection {...props} />
        <DiagramElementBehaviorEditor
          model={model}
          element={element}
          onElementChange={updates => props.onUpdateElement(element.id, updates)}
          onPropertiesChange={properties => props.onUpdateElement(element.id, { properties: { ...element.properties, ...properties } })}
        />
      </AccordionSection>

      {v2ShowsConstraintsSection(element.kind) && (
        <AccordionSection sec="constraints" title="Restricciones Geométricas" isOpen={openAccordion.constraints} onToggle={onToggleAccordion}>
          <V2ElementConstraintsSection {...props} />
        </AccordionSection>
      )}
    </div>
  );
};
