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
import { InspectorFieldError, inspectorFieldClass } from './InspectorFieldError';

interface InspectorPointPanelProps {
  model: VisualDiagramModel;
  point: VisualPoint;
  activeSection: InspectorSection;
  handlers: InspectorHandlers;
  onModelEdit: (model: VisualDiagramModel) => void;
  onSelect: (id: string) => void;
  fieldErrors?: Map<string, string>;
  focusedFieldKey?: string;
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
  fieldErrors,
  focusedFieldKey = '',
}) => {
  const idError = fieldErrors?.get('id');
  const labelError = fieldErrors?.get('label');
  const xError = fieldErrors?.get('x');
  const yError = fieldErrors?.get('y');
  const constraintError = fieldErrors?.get('constraint');
  const gliderTargetError = fieldErrors?.get('gliderTarget');
  const constraintsError = fieldErrors?.get('constraints');
  const xExpressionError = fieldErrors?.get('xExpression');
  const yExpressionError = fieldErrors?.get('yExpression');
  const dependenciesError = fieldErrors?.get('dependencies');
  const visibleWhenError = fieldErrors?.get('visibleWhen');
  const targetError = fieldErrors?.get('target');
  const colorError = fieldErrors?.get('color');

  return (
  <div className="space-y-3">
    {activeInspectorSection === 'general' && <div data-inspector-section="general" className="space-y-3">
    <div data-inspector-field="id" className={`rounded p-1 ${inspectorFieldClass(Boolean(idError), focusedFieldKey === 'id')}`}>
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
      <InspectorFieldError message={idError} focused={focusedFieldKey === 'id'} />
    </div>

    <div data-inspector-field="label" className={`rounded p-1 ${inspectorFieldClass(Boolean(labelError), focusedFieldKey === 'label')}`}>
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
      <InspectorFieldError message={labelError} focused={focusedFieldKey === 'label'} />
    </div>
    </div>}

    {activeInspectorSection === 'geometry' && <div data-inspector-section="geometry" className="space-y-3">
    <div className="grid grid-cols-2 gap-2">
      <div data-inspector-field="x" className={`rounded p-1 ${inspectorFieldClass(Boolean(xError), focusedFieldKey === 'x')}`}>
        <label className="block text-xs font-bold text-carbon mb-1">Coordenada X</label>
        <input
          type="number"
          step="0.5"
          className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
          value={selectedPoint.x}
          onChange={(e) => handlePointChange({ x: Number(e.target.value) })}
        />
        <InspectorFieldError message={xError} focused={focusedFieldKey === 'x'} />
      </div>
      <div data-inspector-field="y" className={`rounded p-1 ${inspectorFieldClass(Boolean(yError), focusedFieldKey === 'y')}`}>
        <label className="block text-xs font-bold text-carbon mb-1">Coordenada Y</label>
        <input
          type="number"
          step="0.5"
          className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
          value={selectedPoint.y}
          onChange={(e) => handlePointChange({ y: Number(e.target.value) })}
        />
        <InspectorFieldError message={yError} focused={focusedFieldKey === 'y'} />
      </div>
    </div>

    <div data-inspector-field="constraint" className={`rounded p-1 ${inspectorFieldClass(Boolean(constraintError), focusedFieldKey === 'constraint')}`}>
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
      <InspectorFieldError message={constraintError} focused={focusedFieldKey === 'constraint'} />
    </div>

    <DiagramPointMovementAidsEditor
      model={model}
      point={selectedPoint}
      onPointChange={handlePointChange}
      onAttractorsChange={handlePointAttractorsChange}
    />

    {selectedPoint.constraint === 'glider' && (

      <div data-inspector-field="gliderTarget" className={`rounded p-1 ${inspectorFieldClass(Boolean(gliderTargetError), focusedFieldKey === 'gliderTarget')}`}>
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
        <InspectorFieldError message={gliderTargetError} focused={focusedFieldKey === 'gliderTarget'} />
      </div>
    )}

    {selectedPoint.constraint === 'derived' && (
      <div
        className={`space-y-2 rounded border p-2 ${
          inspectorFieldClass(
            Boolean(xExpressionError || yExpressionError || dependenciesError),
            focusedFieldKey === 'xExpression'
              || focusedFieldKey === 'yExpression'
              || focusedFieldKey === 'dependencies',
          ) || 'border-pavo/20 bg-pavo/5'
        }`}
      >
        <p className="ac-label ac-label--sm ac-label--pavo">Coordenadas derivadas</p>
        <div data-inspector-field="xExpression" className={`rounded p-1 ${inspectorFieldClass(Boolean(xExpressionError), focusedFieldKey === 'xExpression')}`}>
          <DiagramExpressionField model={model} label="Expresión x" ariaLabel="Expresión x derivada" value={selectedPoint.xExpression || ''} onChange={value => handlePointChange({ xExpression: value })} help="Puede combinar coordenadas de otros puntos, longitudes y controles para calcular la coordenada horizontal." />
          <InspectorFieldError message={xExpressionError} focused={focusedFieldKey === 'xExpression'} />
        </div>
        <div data-inspector-field="yExpression" className={`rounded p-1 ${inspectorFieldClass(Boolean(yExpressionError), focusedFieldKey === 'yExpression')}`}>
          <DiagramExpressionField model={model} label="Expresión y" ariaLabel="Expresión y derivada" value={selectedPoint.yExpression || ''} onChange={value => handlePointChange({ yExpression: value })} help="Puede combinar coordenadas de otros puntos, longitudes y controles para calcular la coordenada vertical." />
          <InspectorFieldError message={yExpressionError} focused={focusedFieldKey === 'yExpression'} />
        </div>
        <fieldset data-inspector-field="dependencies" className={`rounded p-1 ${inspectorFieldClass(Boolean(dependenciesError), focusedFieldKey === 'dependencies')}`}>
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
          <InspectorFieldError message={dependenciesError} focused={focusedFieldKey === 'dependencies'} />
        </fieldset>
      </div>
    )}

    {selectedPoint.constraint === 'constrained' && (
      <div data-inspector-field="constraints" className={`rounded border p-2 ${inspectorFieldClass(Boolean(constraintsError), focusedFieldKey === 'constraints') || 'border-transparent'}`}>
        <InspectorFieldError message={constraintsError} focused={focusedFieldKey === 'constraints'} />
        <DiagramConstraintEditor model={model} point={selectedPoint} onModelEdit={onModelEdit} />
      </div>
    )}
    </div>}

    {activeInspectorSection === 'advanced' && (
    <div data-inspector-section="advanced" className="space-y-3">
    <div data-inspector-field="visibleWhen" className={`rounded p-1 ${inspectorFieldClass(Boolean(visibleWhenError), focusedFieldKey === 'visibleWhen')}`}>
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
    <InspectorFieldError message={visibleWhenError} focused={focusedFieldKey === 'visibleWhen'} />
    </div>
    <label data-inspector-field="target" className={`flex items-center gap-1.5 rounded p-1 text-xs font-bold text-carbon ${inspectorFieldClass(Boolean(targetError), focusedFieldKey === 'target')}`}>
      <input
        type="checkbox"
        checked={selectedPoint.target}
        onChange={(e) => handlePointChange({ target: e.target.checked })}
        className="rounded border-carbon/15 bg-lienzo"
      />
      ¿Se puede enlazar desde MDX?
      <InspectorFieldError message={targetError} focused={focusedFieldKey === 'target'} />
    </label>
    </div>
    )}

    {activeInspectorSection === 'appearance' && <div data-inspector-section="appearance" className="space-y-3">
    <div data-inspector-field="color" className={`rounded p-1 ${inspectorFieldClass(Boolean(colorError), focusedFieldKey === 'color')}`}>
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
      <InspectorFieldError message={colorError} focused={focusedFieldKey === 'color'} />
    </div>

    <div className="grid grid-cols-2 gap-2 rounded border border-carbon/10 p-2">
      <label className="text-xs font-bold text-carbon">Tamaño<input type="number" min="0" max="30" step="0.5" aria-label="Tamaño del punto" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedPoint.style?.pointSize ?? 7} onChange={(event) => handlePointStyleChange({ pointSize: Number(event.target.value) })} /></label>
      <label className="text-xs font-bold text-carbon">Tamaño resaltado<input type="number" min="0" max="40" step="0.5" aria-label="Tamaño resaltado del punto" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedPoint.style?.highlightPointSize ?? 10} onChange={(event) => handlePointStyleChange({ highlightPointSize: Number(event.target.value) })} /></label>
      <label className="col-span-2 flex items-center gap-1.5 text-xs font-bold text-carbon"><input type="checkbox" checked={selectedPoint.style?.preserveColorOnHighlight ?? true} onChange={(event) => handlePointStyleChange({ preserveColorOnHighlight: event.target.checked })} />Conservar color al resaltar</label>
    </div>
    </div>}
  </div>
  );
};
