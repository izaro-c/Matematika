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
import { DiagramFormField, diagramInputClassName } from '../primitives/DiagramFormField';

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
    <DiagramFormField
      label="ID interno del objeto"
      error={idError}
      focused={focusedFieldKey === 'id'}
      className="data-inspector-field-id"
    >
      <input
        className={`font-mono ${diagramInputClassName}`}
        value={selectedPoint.id}
        onChange={(e) => {
          const nextId = cleanTargetId(e.target.value, selectedPoint.id);
          onModelEdit(renamePoint(model, selectedPoint.id, nextId));
          onSelect(nextId);
        }}
      />
    </DiagramFormField>

    <DiagramFormField
      label="Etiqueta del punto"
      help={<span>Admite LaTeX entre <code>$...$</code> o <code>$$...$$</code>.</span>}
      error={labelError}
      focused={focusedFieldKey === 'label'}
      className="data-inspector-field-label"
    >
      <input
        className={diagramInputClassName}
        value={selectedPoint.label}
        onChange={(e) => handlePointChange({ label: e.target.value })}
      />
      <div className="mt-2">
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
    </DiagramFormField>
    </div>}

    {activeInspectorSection === 'geometry' && <div data-inspector-section="geometry" className="space-y-4">
      <fieldset className="space-y-3">
        <legend className="mb-2 text-[10px] font-bold uppercase tracking-wider text-carbon/50">1. Posición</legend>
        <div className="grid grid-cols-2 gap-2">
      <DiagramFormField label="Coordenada X" error={xError} focused={focusedFieldKey === 'x'}>
        <input
          type="number"
          step="0.5"
          className={diagramInputClassName}
          value={selectedPoint.x}
          onChange={(e) => handlePointChange({ x: Number(e.target.value) })}
        />
      </DiagramFormField>
      <DiagramFormField label="Coordenada Y" error={yError} focused={focusedFieldKey === 'y'}>
        <input
          type="number"
          step="0.5"
          className={diagramInputClassName}
          value={selectedPoint.y}
          onChange={(e) => handlePointChange({ y: Number(e.target.value) })}
        />
      </DiagramFormField>
    </div>
    </fieldset>

    <fieldset className="space-y-3 border-t border-carbon/10 pt-3">
      <legend className="mb-2 text-[10px] font-bold uppercase tracking-wider text-carbon/50">2. Comportamiento</legend>

    <DiagramFormField
      label="Movimiento del punto"
      error={constraintError}
      focused={focusedFieldKey === 'constraint'}
      help={
        <>
          {selectedPoint.constraint === 'free' && 'Se puede mover en cualquier dirección.'}
          {(selectedPoint.constraint === 'constrained' || isLegacyGuidedMode) && 'Combina relaciones: movimiento horizontal o vertical, sobre un objeto, mismo semiplano, etc.'}
          {selectedPoint.constraint === 'derived' && 'La posición se obtiene de fórmulas; no se arrastra.'}
          {selectedPoint.constraint === 'fixed' && 'No se puede arrastrar. Use este modo en lugar de añadir «posición fija» en relaciones.'}
        </>
      }
    >
      <select
        aria-label="Restricción del punto"
        className={diagramInputClassName}
        value={selectedPoint.constraint === 'constrained' || isLegacyGuidedMode ? 'constrained' : (selectedPoint.constraint || 'free')}
        onChange={(e) => handleMovementChange(e.target.value as PointConstraint)}
      >
        <option value="free">Libre</option>
        <option value="constrained">Relaciones geométricas</option>
        <option value="derived">Calculado por expresiones</option>
        <option value="fixed">Fijo</option>
      </select>
    </DiagramFormField>

    {showRelations && (
      <DiagramFormField
        error={constraintsError}
        focused={focusedFieldKey === 'constraints'}
        className="p-0 border-0"
      >
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
        {!isLegacyGuidedMode && (
          <DiagramRelationsSection
            model={model}
            point={selectedPoint}
            scope="point"
            onModelEdit={onModelEdit}
          />
        )}
      </DiagramFormField>
    )}

    {selectedPoint.constraint === 'derived' && (
      <DiagramFormField
        error={xExpressionError || yExpressionError ? 'Error en expresiones' : undefined}
        focused={focusedFieldKey === 'xExpression' || focusedFieldKey === 'yExpression'}
        className="p-0 border-0"
      >
        <DiagramDerivedPositionEditor
          model={model}
          point={selectedPoint}
          onPointChange={handlePointChange}
          xExpressionError={xExpressionError}
          yExpressionError={yExpressionError}
        />
      </DiagramFormField>
    )}

    {showMovementAids && (
      <DiagramPointMovementAidsEditor
        model={model}
        point={selectedPoint}
        onPointChange={handlePointChange}
        onAttractorsChange={handlePointAttractorsChange}
      />
    )}
    </fieldset>
    </div>}

    {activeInspectorSection === 'advanced' && (
    <div data-inspector-section="advanced" className="space-y-3">
    <DiagramFormField error={visibleWhenError} focused={focusedFieldKey === 'visibleWhen'} className="p-0 border-0">
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
    </DiagramFormField>
    <DiagramFormField error={targetError} focused={focusedFieldKey === 'target'}>
      <label className="flex items-center gap-1.5 text-xs font-bold text-carbon">
        <input
          type="checkbox"
          checked={selectedPoint.target}
          onChange={(e) => handlePointChange({ target: e.target.checked })}
          className="h-3.5 w-3.5 rounded border-carbon/20 bg-lienzo accent-pavo cursor-pointer"
        />
        ¿Se puede enlazar desde MDX?
      </label>
    </DiagramFormField>
    </div>
    )}

    {activeInspectorSection === 'appearance' && <div data-inspector-section="appearance" className="space-y-3">
    <DiagramFormField label="Color" error={colorError} focused={focusedFieldKey === 'color'}>
      <select
        className={diagramInputClassName}
        value={selectedPoint.color}
        onChange={(e) => handlePointChange({ color: e.target.value as ColorToken })}
      >
        {COLOR_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </DiagramFormField>

    <div className="grid grid-cols-2 gap-2 rounded border border-carbon/10 p-2">
      <label className="text-[10px] font-bold text-carbon/70 uppercase tracking-wider block mb-1">Tamaño<input type="number" min="0" max="30" step="0.5" aria-label="Tamaño del punto" className={`mt-1 ${diagramInputClassName}`} value={selectedPoint.style?.pointSize ?? 7} onChange={(event) => handlePointStyleChange({ pointSize: Number(event.target.value) })} /></label>
      <label className="text-[10px] font-bold text-carbon/70 uppercase tracking-wider block mb-1">Tamaño resaltado<input type="number" min="0" max="40" step="0.5" aria-label="Tamaño resaltado del punto" className={`mt-1 ${diagramInputClassName}`} value={selectedPoint.style?.highlightPointSize ?? 10} onChange={(event) => handlePointStyleChange({ highlightPointSize: Number(event.target.value) })} /></label>
      <label className="col-span-2 flex items-center gap-1.5 text-xs font-bold text-carbon"><input type="checkbox" checked={selectedPoint.style?.preserveColorOnHighlight ?? true} onChange={(event) => handlePointStyleChange({ preserveColorOnHighlight: event.target.checked })} />Conservar color al resaltar</label>
    </div>
    </div>}
  </div>
  );
};
