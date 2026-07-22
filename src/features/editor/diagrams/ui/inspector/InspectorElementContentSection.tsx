import React from 'react';
import type { VisualDiagramModel, VisualElement } from '../../model/types';
import { DiagramInfoPanelContentEditor } from '../DiagramInfoPanelContentEditor';
import { DiagramTemplateField } from '../DiagramTemplateField';
import { DiagramExpressionField } from '../DiagramExpressionField';
import { DiagramTextRulesEditor } from '../DiagramTextRulesEditor';
import type { InspectorHandlers } from './useInspectorHandlers';
import type { InspectorSection } from './inspectorUtils';

interface InspectorElementContentSectionProps {
  model: VisualDiagramModel;
  element: VisualElement;
  activeSection: InspectorSection;
  handlers: InspectorHandlers;
}

export const InspectorElementContentSection: React.FC<InspectorElementContentSectionProps> = ({
  model,
  element: selectedElement,
  activeSection: activeInspectorSection,
  handlers: { handleElementChange, handleElementPropertiesChange },
}) => {
  if (activeInspectorSection !== 'general') return null;

  return (
    <>
      {selectedElement.kind === 'infoPanel' && (
        <DiagramInfoPanelContentEditor
          model={model}
          panel={selectedElement}
          onElementChange={handleElementChange}
          onTextChange={text => handleElementChange({ text })}
          onPropertiesChange={handleElementPropertiesChange}
        />
      )}

      {(selectedElement.kind === 'measurement' || selectedElement.kind === 'dimensionLine') && (
        <section className="space-y-3" aria-label="Contenido y valor de medida">
          <div><h5 className="text-xs font-bold text-carbon">Contenido de la medida</h5><p className="mt-1 text-[10px] text-carbon/45">Escriba el texto e inserte uno o varios cálculos donde deban aparecer.</p></div>

          <DiagramTemplateField
            model={model}
            label="Texto visible"
            value={selectedElement.text || ''}
            onChange={text => handleElementChange({ text })}
            placeholder={`${selectedElement.label}: {= ${selectedElement.id}.length | precision: 2}`}
          />

          {selectedElement.kind === 'dimensionLine' && (
            <label className="block text-xs font-bold text-carbon">
              Separación de la cota
              <input type="number" min="-10" max="10" step="0.05" aria-label="Separación de la línea de cota" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.offset ?? 0.35} onChange={event => handleElementPropertiesChange({ offset: Number(event.target.value) })} />
              <span className="mt-1 block text-[10px] font-normal leading-relaxed text-carbon/45">Desplaza la línea de cota respecto al segmento medido.</span>
            </label>
          )}

          <details className="border-t border-carbon/10 pt-2" open={Boolean(selectedElement.properties?.expression)}>
            <summary className="min-h-9 cursor-pointer py-2 text-[10px] font-bold text-carbon/55">Compatibilidad con {'{value}'}</summary>
            <div className="space-y-2 pb-2">
              <p className="text-[9px] leading-relaxed text-carbon/45">Solo es necesario para textos antiguos que todavía usan <code>{'{value}'}</code>. Los cálculos insertados llevan su propio formato.</p>
              <DiagramExpressionField compact model={model} label="Cálculo heredado" ariaLabel="Fórmula de medida" value={selectedElement.properties?.expression || ''} onChange={value => handleElementPropertiesChange({ expression: value || undefined })} placeholder="Vacío = medir distancia automáticamente" optional />
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs font-bold text-carbon">
                Unidad
                <input
                  aria-label="Unidad"
                  className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                  value={selectedElement.properties?.unit || ''}
                  onChange={(event) => handleElementPropertiesChange({ unit: event.target.value })}
                  placeholder="Ej. cm"
                />
              </label>
              <label className="text-xs font-bold text-carbon">
                Decimales
                <input
                  type="number"
                  min="0"
                  max="12"
                  aria-label="Decimales"
                  className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                  value={selectedElement.properties?.precision ?? 2}
                  onChange={(event) => handleElementPropertiesChange({ precision: Number(event.target.value) })}
                />
              </label>
            </div>
            </div>
          </details>
          <DiagramTextRulesEditor model={model} element={selectedElement} onChange={textRules => handleElementPropertiesChange({ textRules })} />
        </section>
      )}

      {selectedElement.kind === 'formula' && (
        <section className="space-y-3" aria-label="Fórmula KaTeX y valor">
          <div><h5 className="text-xs font-bold text-carbon">Fórmula visible</h5><p className="mt-1 text-[10px] text-carbon/45">Escriba primero lo que se verá; el valor dinámico es opcional.</p></div>

          <DiagramTemplateField formula model={model} label="Fórmula visible (KaTeX)" value={selectedElement.text || ''} onChange={value => handleElementChange({ text: value })} placeholder="Ej. a^2 + b^2 = c^2" />

          <details className="border-t border-carbon/10 pt-2" open={Boolean(selectedElement.properties?.expression)}>
            <summary className="min-h-9 cursor-pointer py-2 text-[10px] font-bold text-carbon/55">Compatibilidad con {'{value}'}</summary>
            <div className="space-y-2 pb-2">
            <DiagramExpressionField compact model={model} label="Cálculo heredado" value={selectedElement.properties?.expression || ''} onChange={value => handleElementPropertiesChange({ expression: value || undefined })} optional />
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs font-bold text-carbon">
                Unidad
                <input
                  aria-label="Unidad"
                  className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                  value={selectedElement.properties?.unit || ''}
                  onChange={(event) => handleElementPropertiesChange({ unit: event.target.value })}
                />
              </label>
              <label className="text-xs font-bold text-carbon">
                Decimales
                <input
                  type="number"
                  min="0"
                  max="12"
                  aria-label="Decimales"
                  className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                  value={selectedElement.properties?.precision ?? 2}
                  onChange={(event) => handleElementPropertiesChange({ precision: Number(event.target.value) })}
                />
              </label>
            </div>
            </div>
          </details>
          <DiagramTextRulesEditor model={model} element={selectedElement} onChange={textRules => handleElementPropertiesChange({ textRules })} />
        </section>
      )}

      {selectedElement.kind === 'text' && (
        <section className="space-y-3" aria-label="Contenido de texto">
          <DiagramTemplateField richText model={model} label="Contenido" value={selectedElement.text || ''} onChange={text => handleElementChange({ text })} placeholder="Introduce el texto…" rows={3} />
          <DiagramTextRulesEditor model={model} element={selectedElement} onChange={textRules => handleElementPropertiesChange({ textRules })} />
        </section>
      )}

      {selectedElement.kind === 'label' && (
        <section className="space-y-3" aria-label="Contenido de la etiqueta">
          <DiagramTemplateField formula model={model} label="Texto visible" value={selectedElement.text || ''} onChange={text => handleElementChange({ text })} placeholder={selectedElement.label} />
          <DiagramTextRulesEditor model={model} element={selectedElement} onChange={textRules => handleElementPropertiesChange({ textRules })} />
        </section>
      )}
    </>
  );
};
