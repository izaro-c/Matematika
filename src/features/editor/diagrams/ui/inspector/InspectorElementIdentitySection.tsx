import React from 'react';
import type { VisualDiagramModel, VisualElement } from '../../model/types';
import { KIND_LABELS, cleanTargetId, renameElement, convertAngleKind, removeDiagramElements, updateElement } from '../../model';
import { legacyElementCapabilities } from '@/shared/diagrams/public';
import { elementInspectorCapabilities } from '../../model/elementInspectorCapabilities';
import { DiagramNativeLabelEditor } from '../DiagramNativeLabelEditor';
import type { InspectorHandlers } from './useInspectorHandlers';
import { labelCanMoveAlongPath } from './inspectorUtils';
import type { InspectorSection } from './inspectorUtils';

interface InspectorElementIdentitySectionProps {
  model: VisualDiagramModel;
  element: VisualElement;
  activeSection: InspectorSection;
  attachedLabel: VisualElement | undefined;
  handlers: InspectorHandlers;
  onModelEdit: (model: VisualDiagramModel) => void;
  onSelect: (id: string) => void;
  onAddElementLabel?: (elementId: string) => void;
}

export const InspectorElementIdentitySection: React.FC<InspectorElementIdentitySectionProps> = ({
  model,
  element: selectedElement,
  activeSection: activeInspectorSection,
  attachedLabel,
  handlers: { handleElementChange, handleElementStyleChange },
  onModelEdit,
  onSelect,
  onAddElementLabel,
}) => {
  const selectedElementCapabilities = elementInspectorCapabilities(selectedElement.kind);

  if (activeInspectorSection !== 'general') return null;

  return (
    <>
      <div>
        <label className="block text-xs font-bold text-carbon mb-1">ID interno del objeto</label>
        <input
          className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs"
          value={selectedElement.id}
          onChange={(e) => {
            const nextId = cleanTargetId(e.target.value, selectedElement.id);
            onModelEdit(renameElement(model, selectedElement.id, nextId));
            onSelect(nextId);
          }}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-carbon mb-1">Nombre en el editor</label>
        <input
          className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
          value={selectedElement.label}
          onChange={(e) => handleElementChange({ label: e.target.value })}
        />
        <span className="mt-1 block text-[10px] text-carbon/45">Admite LaTeX entre <code>$...$</code> o <code>$$...$$</code>.</span>
      </div>

      {(selectedElement.kind === 'angle' || selectedElement.kind === 'nonReflexAngle') ? (
        <div className="rounded border border-ocre/20 bg-ocre/5 p-2">
          <label className="block text-xs font-bold text-carbon">
            Tipo de ángulo
            <select
              aria-label="Tipo de ángulo"
              className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={selectedElement.kind}
              onChange={event => onModelEdit(convertAngleKind(model, selectedElement.id, event.target.value as 'angle' | 'nonReflexAngle'))}
            >
              <option value="angle">Ángulo orientado (hasta 360°)</option>
              <option value="nonReflexAngle">Ángulo no reflejo (hasta 180°)</option>
            </select>
          </label>
          <p className="mt-1 text-[10px] leading-relaxed text-carbon/50">Conserva el objeto, sus referencias, estilo y enlaces. Si participa en igualdades angulares, la red conectada cambia de tipo con él.</p>
        </div>
      ) : (
        <div>
          <p className="block text-xs font-bold text-carbon mb-1">Tipo: <span className="font-normal text-carbon/75">{KIND_LABELS[selectedElement.kind]}</span></p>
        </div>
      )}

      {selectedElementCapabilities?.content === 'none' && <DiagramNativeLabelEditor
        label={selectedElement.label}
        visible={selectedElement.showLabel ?? (legacyElementCapabilities(selectedElement.kind).has('point') || selectedElement.kind === 'angle' || selectedElement.kind === 'nonReflexAngle')}
        size={selectedElement.style?.labelSize ?? 16}
        offset={selectedElement.style?.labelOffset}
        position={selectedElement.style?.labelPosition}
        alongPath={labelCanMoveAlongPath(selectedElement.kind)}
        onVisibleChange={showLabel => handleElementChange({ showLabel })}
        onStyleChange={handleElementStyleChange}
      />}

      {selectedElementCapabilities?.attachedLabel && (
        <fieldset className="space-y-2 rounded border border-ocre/20 bg-ocre/5 p-2">
          <legend className="px-1 ac-label ac-label--sm ac-label--ocre">Etiqueta en el lienzo</legend>
          {attachedLabel ? (
            <>
              <label className="flex items-center gap-2 text-xs font-bold text-carbon">
                <input
                  type="checkbox"
                  aria-label={`Mostrar etiqueta de ${selectedElement.label}`}
                  checked={attachedLabel.visible}
                  onChange={(event) => onModelEdit(updateElement(model, attachedLabel.id, { visible: event.target.checked }))}
                />
                Mostrar junto al elemento
              </label>
              <div className="flex gap-2">
                <button type="button" className="flex-1 rounded border border-ocre/25 bg-lienzo px-2 py-1.5 text-xs font-bold text-ocre hover:bg-ocre/5" onClick={() => onSelect(attachedLabel.id)}>
                  Editar texto y posición
                </button>
                <button
                  type="button"
                  className="rounded border border-granada/25 bg-lienzo px-2.5 py-1.5 text-xs font-bold text-granada hover:bg-granada/5"
                  onClick={() => onModelEdit(removeDiagramElements(model, [attachedLabel.id]))}
                >
                  Eliminar
                </button>
              </div>
            </>
          ) : (
            <button type="button" disabled={!onAddElementLabel} className="w-full rounded bg-ocre px-2 py-1.5 text-xs font-bold text-lienzo disabled:opacity-40" onClick={() => onAddElementLabel?.(selectedElement.id)}>
              Añadir etiqueta a este elemento
            </button>
          )}
          <p className="text-[10px] leading-relaxed text-carbon/50">La etiqueta queda vinculada al objeto y lo sigue cuando cambia la geometría.</p>
        </fieldset>
      )}
    </>
  );
};
