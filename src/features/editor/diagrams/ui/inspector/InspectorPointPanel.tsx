import React from 'react';
import type { VisualDiagramModel, VisualPoint, ColorToken, PointConstraint } from '../../model/types';
import { COLOR_OPTIONS, cleanTargetId, renamePoint } from '../../model';
import { ensureConstrainedMode, migrateLegacyPointToConstrained } from '../../model/constraintOptions';
import { DiagramRelationsSection } from '../relations';
import { DiagramDerivedPositionEditor } from '../DiagramDerivedPositionEditor';
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
  const constraintsError = fieldErrors?.get('constraints');
  const xExpressionError = fieldErrors?.get('xExpression');
  const yExpressionError = fieldErrors?.get('yExpression');
  const visibleWhenError = fieldErrors?.get('visibleWhen');
  const targetError = fieldErrors?.get('target');
  const colorError = fieldErrors?.get('color');

  const isLegacyGuidedMode = ['horizontal', 'vertical', 'glider'].includes(selectedPoint.constraint);
  const showRelations = selectedPoint.constraint === 'constrained' || isLegacyGuidedMode;
  const showMovementAids = ['free', 'constrained'].includes(selectedPoint.constraint);

  const handleMovementChange = (nextConstraint: PointConstraint) => {
    if (nextConstraint === 'constrained') {
      onModelEdit(ensureConstrainedMode(model, selectedPoint.id));
      return;
    }
    handlePointChange({ constraint: nextConstraint });
  };

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
        value={selectedPoint.constraint === 'constrained' || isLegacyGuidedMode ? 'constrained' : (selectedPoint.constraint || 'free')}
        onChange={(e) => handleMovementChange(e.target.value as PointConstraint)}
      >
        <option value="free">Libre</option>
        <option value="constrained">Relaciones geométricas</option>
        <option value="derived">Calculado por expresiones</option>
        <option value="fixed">Fijo</option>
      </select>
      <p className="mt-1 text-[10px] leading-relaxed text-carbon/50">
        {selectedPoint.constraint === 'free' && 'Se puede mover en cualquier dirección.'}
        {(selectedPoint.constraint === 'constrained' || isLegacyGuidedMode) && 'Combina relaciones: movimiento horizontal o vertical, sobre un objeto, mismo semiplano, etc.'}
        {selectedPoint.constraint === 'derived' && 'La posición se obtiene de fórmulas; no se arrastra.'}
        {selectedPoint.constraint === 'fixed' && 'No se puede arrastrar. Use este modo en lugar de añadir «posición fija» en relaciones.'}
      </p>
      <InspectorFieldError message={constraintError} focused={focusedFieldKey === 'constraint'} />
    </div>

    {showRelations && (
      <div data-inspector-field="constraints" className={inspectorFieldClass(Boolean(constraintsError), focusedFieldKey === 'constraints')}>
        {isLegacyGuidedMode && (
          <div className="mb-3 rounded border border-ocre/25 bg-ocre/10 p-2">
            <p className="text-[10px] leading-relaxed text-ocre">
              Este punto usa un modo de movimiento antiguo que no se puede combinar con otras relaciones.
            </p>
            <button
              type="button"
              className="mt-2 min-h-11 w-full rounded border border-ocre/30 bg-lienzo px-2 text-[10px] font-bold text-ocre"
              onClick={() => onModelEdit(migrateLegacyPointToConstrained(model, selectedPoint.id))}
            >
              Convertir a relaciones combinables
            </button>
          </div>
        )}
        <InspectorFieldError message={constraintsError} focused={focusedFieldKey === 'constraints'} />
        {!isLegacyGuidedMode && (
          <DiagramRelationsSection
            model={model}
            point={selectedPoint}
            scope="point"
            onModelEdit={onModelEdit}
          />
        )}
      </div>
    )}

    {selectedPoint.constraint === 'derived' && (
      <div
        data-inspector-field="derived"
        className={inspectorFieldClass(
          Boolean(xExpressionError || yExpressionError),
          focusedFieldKey === 'xExpression' || focusedFieldKey === 'yExpression',
        )}
      >
        <DiagramDerivedPositionEditor
          model={model}
          point={selectedPoint}
          onPointChange={handlePointChange}
          xExpressionError={xExpressionError}
          yExpressionError={yExpressionError}
        />
      </div>
    )}

    {showMovementAids && (
      <DiagramPointMovementAidsEditor
        model={model}
        point={selectedPoint}
        onPointChange={handlePointChange}
        onAttractorsChange={handlePointAttractorsChange}
      />
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
