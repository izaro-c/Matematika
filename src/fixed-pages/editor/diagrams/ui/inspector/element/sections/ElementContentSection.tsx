import React from 'react';
import type { ElementPanelProps } from '../../types';
import { DiagramTextRulesEditor } from '@/fixed-pages/editor/diagrams/ui/DiagramTextRulesEditor';
import { DiagramInfoPanelContentEditor } from '@/fixed-pages/editor/diagrams/ui/DiagramInfoPanelContentEditor';
import { elementInspectorCapabilities } from '@/fixed-pages/editor/diagrams/model/elementInspectorCapabilities';

/** Contenido: infoPanel usa el editor completo (bloques + variantes); resto texto/reglas. */
export const ElementContentSection: React.FC<ElementPanelProps> = ({
  model,
  element,
  onUpdateElement,
}) => {
  if (element.kind === 'infoPanel') {
    return (
      <div className="p-2.5 space-y-2 bg-carbon/5 rounded-xl border border-carbon/10 shadow-2xs">
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
    <div className="p-2.5 space-y-2 bg-carbon/5 rounded-xl border border-carbon/10 shadow-2xs">
      <div>
        <label className="block text-[11px] font-bold text-carbon/70 mb-0.5">
          Título / Texto
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
            className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon font-bold"
            placeholder="Título o texto..."
          />
        </label>
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
