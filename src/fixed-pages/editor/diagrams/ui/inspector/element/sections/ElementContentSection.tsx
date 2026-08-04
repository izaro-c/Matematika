import React from 'react';
import type { ElementPanelProps } from '../../types';
import { DiagramTextRulesEditor } from '@/fixed-pages/editor/diagrams/ui/DiagramTextRulesEditor';
import { DiagramInfoPanelContentEditor } from '@/fixed-pages/editor/diagrams/ui/panels/DiagramInfoPanelContentEditor';
import { elementInspectorCapabilities } from '@/fixed-pages/editor/diagrams/model/elements/elementInspectorCapabilities';

/** Contenido: infoPanel usa el editor completo (bloques + variantes); resto texto/reglas. */
export const ElementContentSection: React.FC<ElementPanelProps> = ({
  model,
  element,
  onUpdateElement,
}) => {
  if (element.kind === 'infoPanel') {
    return (
      <div className="space-y-3">
        <DiagramInfoPanelContentEditor
          model={model}
          panel={element}
          onElementChange={update => onUpdateElement(element.id, update)}
          onTextChange={text => onUpdateElement(element.id, { text })}
          onPropertiesChange={properties =>
            onUpdateElement(element.id, {
              properties: { ...(element.properties || {}), ...properties },
            })
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
          Título / Texto
        </label>
        <input
          type="text"
          aria-label="Título o texto"
          value={element.properties?.title || element.text || element.label || ''}
          onChange={e =>
            onUpdateElement(element.id, {
              text: e.target.value,
              properties: { ...(element.properties || {}), title: e.target.value },
            })
          }
          className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 font-bold text-xs text-carbon shadow-2xs transition-colors focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20 placeholder-carbon/30"
          placeholder="Título o texto..."
        />
      </div>

      {elementInspectorCapabilities(element.kind).conditionalText && (
        <DiagramTextRulesEditor
          model={model}
          element={element}
          onChange={textRules =>
            onUpdateElement(element.id, {
              properties: { ...(element.properties || {}), textRules },
            })
          }
        />
      )}
    </div>
  );
};
