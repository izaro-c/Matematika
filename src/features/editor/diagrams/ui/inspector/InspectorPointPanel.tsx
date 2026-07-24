import React from 'react';
import type { VisualDiagramModel, VisualPoint, ColorToken, PointConstraint } from '../../model/types';
import { COLOR_OPTIONS, KIND_LABELS, cleanTargetId, renamePoint } from '../../model';
import { legacyReferenceCandidates } from '@/shared/diagrams/public';
import { DiagramConstraintEditor } from '../DiagramConstraintEditor';
import { DiagramExpressionField } from '../DiagramExpressionField';
import { DiagramNativeLabelEditor } from '../DiagramNativeLabelEditor';
import { DiagramPointMovementAidsEditor } from '../DiagramPointMovementAidsEditor';
import type { InspectorHandlers } from './useInspectorHandlers';
import type { InspectorSection } from './inspectorUtils';

interface InspectorPointPanelProps {
  model: VisualDiagramModel;
  point: VisualPoint;
  activeSection: InspectorSection;
  handlers: InspectorHandlers;
  onModelEdit: (model: VisualDiagramModel) => void;
  onSelect: (id: string) => void;
}

export const InspectorPointPanel: React.FC<InspectorPointPanelProps> = ({
  model,
  point: selectedPoint,
  activeSection: activeInspectorSection,
  handlers: {
    handlePointChange,
    handlePointAttractorsChange,
    handlePointStyleChange,
  },
  onModelEdit,
  onSelect,
}) => (
  <div className="space-y-3">
    {activeInspectorSection === 'general' && <>
    <div>
      <label className="block text-xs font-bold text-carbon mb-1">ID interno del objeto</label>
      <input
        className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs"
        value={selectedPoint.id}
        onChange={(e) => {
          const nextId = cleanTargetId(e.target.value, selectedPoint.id);
          onModelEdit(renamePoint(model, selectedPoint.id, nextId));
          onSelect(nextId);
        }}
      />
    </div>

    <div>
      <label className="block text-xs font-bold text-carbon mb-1">Etiqueta del punto</label>
      <input
        className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
        value={selectedPoint.label}
        onChange={(e) => handlePointChange({ label: e.target.value })}
      />
      <span className="mt-1 block text-[10px] text-carbon/45">Admite LaTeX entre <code>$...$</code> o <code>$$...$$</code>.</span>
      <DiagramNativeLabelEditor
        label={selectedPoint.label}
        visible={selectedPoint.showLabel !== false}
        size={selectedPoint.style?.labelSize ?? 19}
        offset={selectedPoint.style?.labelOffset}
        position={selectedPoint.style?.labelPosition}
        onVisibleChange={showLabel => handlePointChange({ showLabel })}
        onStyleChange={handlePointStyleChange}
      />
    </div>
    </>}

    {activeInspectorSection === 'geometry' && <>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="block text-xs font-bold text-carbon mb-1">Coordenada X</label>
        <input
          type="number"
          step="0.5"
          className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
          value={selectedPoint.x}
          onChange={(e) => handlePointChange({ x: Number(e.target.value) })}
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-carbon mb-1">Coordenada Y</label>
        <input
          type="number"
          step="0.5"
          className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
          value={selectedPoint.y}
          onChange={(e) => handlePointChange({ y: Number(e.target.value) })}
        />
      </div>
    </div>

    <div>
      <label className="block text-xs font-bold text-carbon mb-1">Movimiento del punto</label>
      <select
        aria-label="Restricción del punto"
        className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
        value={selectedPoint.constraint || 'free'}
        onChange={(e) => handlePointChange({ constraint: e.target.value as PointConstraint })}
      >
        <option value="free">Libre</option>
        <option value="fixed">Fijo</option>
        <option value="horizontal">Horizontal</option>
        <option value="vertical">Vertical</option>
        <option value="glider">Punto sobre elemento</option>
        <option value="derived">Derivado por expresiones</option>
        <option value="constrained">Combinar relaciones geométricas</option>
      </select>
      <p className="mt-1 text-[10px] leading-relaxed text-carbon/50">
        {selectedPoint.constraint === 'free' && 'Se puede mover en cualquier dirección.'}
        {selectedPoint.constraint === 'fixed' && 'Su posición forma parte de la construcción y no se puede arrastrar.'}
        {selectedPoint.constraint === 'horizontal' && 'Solo cambia su coordenada x; permanece en su altura actual.'}
        {selectedPoint.constraint === 'vertical' && 'Solo cambia su coordenada y; permanece en su vertical actual.'}
        {selectedPoint.constraint === 'glider' && 'Se mueve únicamente sobre el objeto base elegido.'}
        {selectedPoint.constraint === 'derived' && 'La posición se calcula; no se arrastra directamente.'}
        {selectedPoint.constraint === 'constrained' && 'Combina relaciones geométricas editables con otros objetos. Para igualar dos segmentos, resulta más directo seleccionar el segmento en el lienzo.'}
      </p>
    </div>

    <DiagramPointMovementAidsEditor
      model={model}
      point={selectedPoint}
      onPointChange={handlePointChange}
      onAttractorsChange={handlePointAttractorsChange}
    />

    {selectedPoint.constraint === 'glider' && (

      <div>
        <label className="block text-xs font-bold text-carbon mb-1">Elemento base</label>
        <select
          className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs font-mono"
          value={selectedPoint.gliderTarget || ''}
          onChange={(e) => handlePointChange({ gliderTarget: e.target.value })}
        >
          <option value="">Seleccione elemento...</option>
          {legacyReferenceCandidates(model, 'support').map(el => (
            <option key={el.id} value={el.id}>{el.id} ({'kind' in el ? KIND_LABELS[el.kind] : el.label})</option>
          ))}
        </select>
      </div>
    )}

    {selectedPoint.constraint === 'derived' && (
      <div className="space-y-2 rounded border border-pavo/20 bg-pavo/5 p-2">
        <p className="ac-label ac-label--sm ac-label--pavo">Coordenadas derivadas</p>
        <DiagramExpressionField model={model} label="Expresión x" ariaLabel="Expresión x derivada" value={selectedPoint.xExpression || ''} onChange={value => handlePointChange({ xExpression: value })} help="Puede combinar coordenadas de otros puntos, longitudes y controles para calcular la coordenada horizontal." />
        <DiagramExpressionField model={model} label="Expresión y" ariaLabel="Expresión y derivada" value={selectedPoint.yExpression || ''} onChange={value => handlePointChange({ yExpression: value })} help="Puede combinar coordenadas de otros puntos, longitudes y controles para calcular la coordenada vertical." />
        <fieldset>
          <legend className="text-xs font-bold text-carbon">Dependencias</legend>
          {[...model.points, ...model.elements, ...model.sliders].filter(item => item.id !== selectedPoint.id).map(item => (
            <label key={item.id} className="mt-1 flex items-center gap-1.5 text-xs text-carbon">
              <input
                type="checkbox"
                checked={(selectedPoint.dependencies || []).includes(item.id)}
                onChange={(event) => handlePointChange({
                  dependencies: event.target.checked
                    ? [...(selectedPoint.dependencies || []), item.id]
                    : (selectedPoint.dependencies || []).filter(id => id !== item.id),
                })}
              />
              {item.label} <span className="font-mono text-carbon/45">{item.id}</span>
            </label>
          ))}
        </fieldset>
      </div>
    )}

    {selectedPoint.constraint === 'constrained' && <DiagramConstraintEditor model={model} point={selectedPoint} onModelEdit={onModelEdit} />}
    </>}

    {activeInspectorSection === 'advanced' && (
    <DiagramExpressionField
      model={model}
      label="Visible cuando"
      ariaLabel="Condición de visibilidad del punto"
      value={selectedPoint.visibleWhen ?? ''}
      onChange={value => handlePointChange({ visibleWhen: value || undefined })}
      placeholder="Vacío = siempre visible"
      optional
      help="La condición se reevalúa mientras cambia la construcción. Un resultado cero oculta el punto."
    />
    )}

    {activeInspectorSection === 'appearance' && <>
    <div>
      <label className="block text-xs font-bold text-carbon mb-1">Color</label>
      <select
        className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
        value={selectedPoint.color}
        onChange={(e) => handlePointChange({ color: e.target.value as ColorToken })}
      >
        {COLOR_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>

    <div className="grid grid-cols-2 gap-2 rounded border border-carbon/10 p-2">
      <label className="text-xs font-bold text-carbon">Tamaño<input type="number" min="0" max="30" step="0.5" aria-label="Tamaño del punto" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedPoint.style?.pointSize ?? 7} onChange={(event) => handlePointStyleChange({ pointSize: Number(event.target.value) })} /></label>
      <label className="text-xs font-bold text-carbon">Tamaño resaltado<input type="number" min="0" max="40" step="0.5" aria-label="Tamaño resaltado del punto" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedPoint.style?.highlightPointSize ?? 10} onChange={(event) => handlePointStyleChange({ highlightPointSize: Number(event.target.value) })} /></label>
      <label className="col-span-2 flex items-center gap-1.5 text-xs font-bold text-carbon"><input type="checkbox" checked={selectedPoint.style?.preserveColorOnHighlight ?? true} onChange={(event) => handlePointStyleChange({ preserveColorOnHighlight: event.target.checked })} />Conservar color al resaltar</label>
    </div>
    </>}

    {activeInspectorSection === 'advanced' && (
    <label className="flex items-center gap-1.5 text-xs font-bold text-carbon">
      <input
        type="checkbox"
        checked={selectedPoint.target}
        onChange={(e) => handlePointChange({ target: e.target.checked })}
        className="rounded border-carbon/15 bg-lienzo"
      />
      ¿Se puede enlazar desde MDX?
    </label>
    )}
  </div>
);
