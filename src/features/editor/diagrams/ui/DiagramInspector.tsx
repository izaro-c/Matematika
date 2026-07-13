import React from 'react';
import type { VisualDiagramModel, VisualPoint, VisualElement, VisualSlider, VisualStep, ColorToken, PointConstraint } from '../model/types';
import { COLOR_OPTIONS, KIND_LABELS } from '../model/commands';
import { cleanTargetId, renamePoint, renameElement, renameSlider } from '../model/commands';
import { updatePoint, updateElement, updateSlider, updateStep } from '../model/commands';
import { extractMathExpressionIdentifiers } from '@/shared/diagrams/public';

interface DiagramInspectorProps {
  model: VisualDiagramModel;
  selectedId: string;
  onSelect: (id: string) => void;
  onModelEdit: (model: VisualDiagramModel) => void;
  onDeleteSelected: () => void;
}

export const DiagramInspector: React.FC<DiagramInspectorProps> = ({
  model,
  selectedId,
  onSelect,
  onModelEdit,
  onDeleteSelected,
}) => {
  const selectedPoint = model.points.find(item => item.id === selectedId);
  const selectedElement = model.elements.find(item => item.id === selectedId);
  const selectedSlider = model.sliders.find(item => item.id === selectedId);
  const selectedStep = model.steps.find(item => item.id === selectedId);
  const selectedSceneItem = selectedPoint || selectedElement || selectedSlider;

  const hasSelection = selectedPoint || selectedElement || selectedSlider || selectedStep;

  const handlePointChange = (update: Partial<VisualPoint>) => {
    if (!selectedPoint) return;
    const next = updatePoint(model, selectedPoint.id, update);
    if (!update.dependencies) {
      onModelEdit(next);
      return;
    }
    onModelEdit({
      ...next,
      dependencies: [
        ...(model.dependencies || []).filter(dependency => dependency.targetId !== selectedPoint.id || dependency.relation !== 'expression'),
        ...update.dependencies.map(sourceId => ({ sourceId, targetId: selectedPoint.id, relation: 'expression' as const })),
      ],
    });
  };

  const handleElementChange = (update: Partial<VisualElement>) => {
    if (!selectedElement) return;
    const next = updateElement(model, selectedElement.id, update);
    if (!update.refs) {
      onModelEdit(next);
      return;
    }
    onModelEdit({
      ...next,
      dependencies: [
        ...(model.dependencies || []).filter(dependency => dependency.targetId !== selectedElement.id || dependency.relation !== 'construction'),
        ...update.refs.map(sourceId => ({ sourceId, targetId: selectedElement.id, relation: 'construction' as const })),
      ],
    });
  };

  const handleElementPropertiesChange = (update: NonNullable<VisualElement['properties']>) => {
    if (!selectedElement) return;
    const properties = { ...selectedElement.properties, ...update };
    const next = updateElement(model, selectedElement.id, { properties });
    if (!('expression' in update) && !('xExpression' in update) && !('yExpression' in update) && !('visibleWhen' in update) && !('textRules' in update)) {
      onModelEdit(next);
      return;
    }
    const sources = new Set<string>();
    [
      properties.expression,
      properties.xExpression,
      properties.yExpression,
      properties.visibleWhen,
      ...(properties.textRules?.map(rule => rule.when) ?? []),
    ].filter((source): source is string => Boolean(source)).forEach(source => {
      try {
        extractMathExpressionIdentifiers(source).forEach(identifier => {
          const root = identifier.split('.')[0];
          if ([...model.points, ...model.elements, ...model.sliders].some(item => item.id === root)) sources.add(root);
        });
      } catch {
        // The shared schema reports the syntax error without discarding the edited text.
      }
    });
    onModelEdit({
      ...next,
      dependencies: [
        ...(model.dependencies || []).filter(dependency => dependency.targetId !== selectedElement.id || dependency.relation !== 'expression'),
        ...[...sources].map(sourceId => ({ sourceId, targetId: selectedElement.id, relation: 'expression' as const })),
      ],
    });
  };

  const handlePointStyleChange = (update: NonNullable<VisualPoint['style']>) => {
    if (selectedPoint) handlePointChange({ style: { ...selectedPoint.style, ...update } });
  };

  const handleElementStyleChange = (update: NonNullable<VisualElement['style']>) => {
    if (selectedElement) handleElementChange({ style: { ...selectedElement.style, ...update } });
  };

  const handleSliderChange = (update: Partial<VisualSlider>) => {
    if (!selectedSlider) return;
    onModelEdit(updateSlider(model, selectedSlider.id, update));
  };

  const handleStepChange = (update: Partial<VisualStep>) => {
    if (!selectedStep) return;
    onModelEdit(updateStep(model, selectedStep.id, update));
  };

  const handleConstraintRefsChange = (constraintId: string, refs: string[]) => {
    onModelEdit({
      ...model,
      constraints: model.constraints?.map(constraint => constraint.id === constraintId ? { ...constraint, refs } : constraint),
      dependencies: [
        ...(model.dependencies || []).filter(dependency => dependency.constraintId !== constraintId),
        ...refs.slice(1).map(sourceId => ({ sourceId, targetId: refs[0], relation: 'constraint' as const, constraintId })),
      ],
    });
  };

  const handleSceneItemChange = (update: Pick<VisualPoint, 'layerId' | 'order' | 'visible' | 'locked' | 'selection'> | Partial<Pick<VisualPoint, 'layerId' | 'order' | 'visible' | 'locked' | 'selection'>>) => {
    if (selectedPoint) handlePointChange(update);
    else if (selectedElement) handleElementChange(update);
    else if (selectedSlider) handleSliderChange(update);
  };

  return (
    <section className="rounded border border-carbon/10 bg-lienzo p-3 h-full overflow-y-auto">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-carbon/45 border-b border-carbon/10 pb-1 mb-3">Propiedades</h4>
      
      {!hasSelection && (
        <p className="text-xs italic text-carbon/55">Seleccione un punto, elemento o slider en el lienzo.</p>
      )}

      {selectedPoint && (
        <div className="space-y-3">
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
            <label className="block text-xs font-bold text-carbon mb-1">Etiqueta</label>
            <input
              className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={selectedPoint.label}
              onChange={(e) => handlePointChange({ label: e.target.value })}
            />
          </div>

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
            <label className="block text-xs font-bold text-carbon mb-1">Restricción</label>
            <select
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
              <option value="constrained">Restringido por relaciones</option>
            </select>
          </div>

          {selectedPoint.constraint === 'glider' && (
            <div>
              <label className="block text-xs font-bold text-carbon mb-1">Elemento base</label>
              <select
                className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs font-mono"
                value={selectedPoint.gliderTarget || ''}
                onChange={(e) => handlePointChange({ gliderTarget: e.target.value })}
              >
                <option value="">Seleccione elemento...</option>
                {model.elements.map(el => (
                  <option key={el.id} value={el.id}>{el.id} ({KIND_LABELS[el.kind]})</option>
                ))}
              </select>
            </div>
          )}

          {selectedPoint.constraint === 'derived' && (
            <div className="space-y-2 rounded border border-pavo/20 bg-pavo/5 p-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-pavo">Coordenadas derivadas</p>
              <label className="block text-xs font-bold text-carbon">
                Expresión x
                <input
                  aria-label="Expresión x derivada"
                  className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs"
                  value={selectedPoint.xExpression || ''}
                  onChange={(event) => handlePointChange({ xExpression: event.target.value })}
                />
              </label>
              <label className="block text-xs font-bold text-carbon">
                Expresión y
                <input
                  aria-label="Expresión y derivada"
                  className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs"
                  value={selectedPoint.yExpression || ''}
                  onChange={(event) => handlePointChange({ yExpression: event.target.value })}
                />
              </label>
              <fieldset>
                <legend className="text-xs font-bold text-carbon">Dependencias</legend>
                {model.points.filter(point => point.id !== selectedPoint.id).map(point => (
                  <label key={point.id} className="mt-1 flex items-center gap-1.5 text-xs text-carbon">
                    <input
                      type="checkbox"
                      checked={(selectedPoint.dependencies || []).includes(point.id)}
                      onChange={(event) => handlePointChange({
                        dependencies: event.target.checked
                          ? [...(selectedPoint.dependencies || []), point.id]
                          : (selectedPoint.dependencies || []).filter(id => id !== point.id),
                      })}
                    />
                    {point.label} <span className="font-mono text-carbon/45">{point.id}</span>
                  </label>
                ))}
              </fieldset>
            </div>
          )}

          {selectedPoint.constraint === 'constrained' && (
            <div className="space-y-2 rounded border border-pavo/20 bg-pavo/5 p-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-pavo">Restricciones activas</p>
              {(model.constraints || []).map(constraint => (
                <label key={constraint.id} className="flex items-center gap-1.5 text-xs text-carbon">
                  <input
                    type="checkbox"
                    checked={(selectedPoint.constraintIds || []).includes(constraint.id)}
                    onChange={(event) => handlePointChange({
                      constraintIds: event.target.checked
                        ? [...(selectedPoint.constraintIds || []), constraint.id]
                        : (selectedPoint.constraintIds || []).filter(id => id !== constraint.id),
                    })}
                  />
                  {constraint.label}
                </label>
              ))}
              <button
                type="button"
                className="w-full rounded border border-pavo/25 bg-lienzo px-2 py-1 text-xs font-bold text-pavo"
                onClick={() => {
                  const anchor = model.points.find(point => point.id !== selectedPoint.id);
                  if (!anchor) return;
                  const id = `constraint${(model.constraints || []).length + 1}`;
                  onModelEdit({
                    ...model,
                    constraints: [...(model.constraints || []), { id, label: `Horizontal con ${anchor.label}`, kind: 'horizontal', refs: [selectedPoint.id, anchor.id], enabled: true }],
                    dependencies: [...(model.dependencies || []), { sourceId: anchor.id, targetId: selectedPoint.id, relation: 'constraint', constraintId: id }],
                    points: model.points.map(point => point.id === selectedPoint.id
                      ? { ...point, constraintIds: [...(point.constraintIds || []), id] }
                      : point),
                  });
                }}
              >
                + Restricción horizontal
              </button>
            </div>
          )}

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
            <label className="text-xs font-bold text-carbon">Tamaño<input type="number" min="0" max="30" step="0.5" aria-label="Tamaño del punto" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedPoint.style?.pointSize ?? 5} onChange={(event) => handlePointStyleChange({ pointSize: Number(event.target.value) })} /></label>
            <label className="text-xs font-bold text-carbon">Tamaño resaltado<input type="number" min="0" max="40" step="0.5" aria-label="Tamaño resaltado del punto" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedPoint.style?.highlightPointSize ?? 8.5} onChange={(event) => handlePointStyleChange({ highlightPointSize: Number(event.target.value) })} /></label>
            <label className="col-span-2 flex items-center gap-1.5 text-xs font-bold text-carbon"><input type="checkbox" checked={selectedPoint.style?.preserveColorOnHighlight ?? false} onChange={(event) => handlePointStyleChange({ preserveColorOnHighlight: event.target.checked })} />Conservar color al resaltar</label>
          </div>

          <label className="flex items-center gap-1.5 text-xs font-bold text-carbon">
            <input
              type="checkbox"
              checked={selectedPoint.target}
              onChange={(e) => handlePointChange({ target: e.target.checked })}
              className="rounded border-carbon/15 bg-lienzo"
            />
            ¿Se puede enlazar desde MDX?
          </label>
        </div>
      )}

      {selectedElement && (
        <div className="space-y-3">
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
            <label className="block text-xs font-bold text-carbon mb-1">Etiqueta</label>
            <input
              className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={selectedElement.label}
              onChange={(e) => handleElementChange({ label: e.target.value })}
            />
          </div>

          <div>
            <p className="block text-xs font-bold text-carbon mb-1">Tipo: <span className="font-normal text-carbon/75">{KIND_LABELS[selectedElement.kind]}</span></p>
          </div>

          {selectedElement.refs.length > 0 && (
            <fieldset className="space-y-1 rounded border border-carbon/10 p-2">
              <legend className="px-1 text-[10px] font-bold uppercase tracking-wider text-carbon/45">Referencias geométricas</legend>
              {selectedElement.refs.map((ref, index) => (
                <select
                  key={`${selectedElement.id}-ref-${index}`}
                  aria-label={`Referencia ${index + 1}`}
                  className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs"
                  value={ref}
                  onChange={(event) => handleElementChange({ refs: selectedElement.refs.map((value, refIndex) => refIndex === index ? event.target.value : value) })}
                >
                  {[...model.points, ...model.elements.filter(element => element.id !== selectedElement.id)].map(item => (
                    <option key={item.id} value={item.id}>{item.label} ({item.id})</option>
                  ))}
                </select>
              ))}
              {(selectedElement.kind === 'polygon' || selectedElement.kind === 'areaDecomposition') && (
                <div className="flex gap-1 pt-1">
                  <button
                    type="button"
                    className="flex-1 rounded border border-carbon/15 px-2 py-1 text-[10px] font-bold"
                    onClick={() => {
                      const candidate = model.points.find(point => !selectedElement.refs.includes(point.id));
                      if (candidate) handleElementChange({ refs: [...selectedElement.refs, candidate.id] });
                    }}
                  >
                    + Vértice
                  </button>
                  <button
                    type="button"
                    disabled={selectedElement.refs.length <= 3}
                    className="flex-1 rounded border border-carbon/15 px-2 py-1 text-[10px] font-bold disabled:opacity-35"
                    onClick={() => handleElementChange({ refs: selectedElement.refs.slice(0, -1) })}
                  >
                    − Último vértice
                  </button>
                </div>
              )}
            </fieldset>
          )}

          {(selectedElement.kind === 'text' || selectedElement.kind === 'measurement') && (
            <div>
              <label className="block text-xs font-bold text-carbon mb-1">Contenido de texto</label>
              <input
                className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                value={selectedElement.text || ''}
                onChange={(e) => handleElementChange({ text: e.target.value })}
              />
            </div>
          )}

          {(['label', 'formula', 'infoPanel', 'dimensionLine'].includes(selectedElement.kind)) && (
            <div>
              <label className="block text-xs font-bold text-carbon mb-1">Contenido; use {'{value}'} para el valor reactivo</label>
              <input
                className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                value={selectedElement.text || ''}
                onChange={(event) => handleElementChange({ text: event.target.value })}
              />
            </div>
          )}

          {selectedElement.kind === 'functionCurve' && (
            <label className="block text-xs font-bold text-carbon">
              f(x)
              <input aria-label="Expresión de función" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs" value={selectedElement.properties?.expression || ''} onChange={(event) => handleElementPropertiesChange({ expression: event.target.value })} />
            </label>
          )}

          {selectedElement.kind === 'parametricCurve' && (
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs font-bold text-carbon">x(t)<input aria-label="Expresión paramétrica x" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs" value={selectedElement.properties?.xExpression || ''} onChange={(event) => handleElementPropertiesChange({ xExpression: event.target.value })} /></label>
              <label className="text-xs font-bold text-carbon">y(t)<input aria-label="Expresión paramétrica y" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs" value={selectedElement.properties?.yExpression || ''} onChange={(event) => handleElementPropertiesChange({ yExpression: event.target.value })} /></label>
            </div>
          )}

          {(['functionCurve', 'parametricCurve'].includes(selectedElement.kind)) && (
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs font-bold text-carbon">Dominio mínimo<input type="number" aria-label="Dominio mínimo" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.domain?.[0] ?? -5} onChange={(event) => handleElementPropertiesChange({ domain: [Number(event.target.value), selectedElement.properties?.domain?.[1] ?? 5] })} /></label>
              <label className="text-xs font-bold text-carbon">Dominio máximo<input type="number" aria-label="Dominio máximo" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.domain?.[1] ?? 5} onChange={(event) => handleElementPropertiesChange({ domain: [selectedElement.properties?.domain?.[0] ?? -5, Number(event.target.value)] })} /></label>
            </div>
          )}

          {(['measurement', 'dimensionLine', 'formula', 'infoPanel'].includes(selectedElement.kind)) && (
            <div className="space-y-2 rounded border border-carbon/10 p-2">
              <label className="block text-xs font-bold text-carbon">Expresión segura<input aria-label="Expresión de valor" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs" value={selectedElement.properties?.expression || ''} onChange={(event) => handleElementPropertiesChange({ expression: event.target.value || undefined })} /></label>
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs font-bold text-carbon">Unidad<input aria-label="Unidad" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.unit || ''} onChange={(event) => handleElementPropertiesChange({ unit: event.target.value })} /></label>
                <label className="text-xs font-bold text-carbon">Decimales<input type="number" min="0" max="12" aria-label="Decimales" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.precision ?? 2} onChange={(event) => handleElementPropertiesChange({ precision: Number(event.target.value) })} /></label>
              </div>
            </div>
          )}

          {selectedElement.kind === 'congruenceMark' && (
            <label className="block text-xs font-bold text-carbon">Número de marcas<input type="number" min="1" max="4" aria-label="Número de marcas" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.markCount ?? 1} onChange={(event) => handleElementPropertiesChange({ markCount: Number(event.target.value) })} /></label>
          )}

          {(['grid', 'areaDecomposition'].includes(selectedElement.kind)) && (
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs font-bold text-carbon">Filas<input type="number" min="1" max="100" aria-label="Filas" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.rows ?? 4} onChange={(event) => handleElementPropertiesChange({ rows: Number(event.target.value) })} /></label>
              <label className="text-xs font-bold text-carbon">Columnas<input type="number" min="1" max="100" aria-label="Columnas" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.columns ?? 4} onChange={(event) => handleElementPropertiesChange({ columns: Number(event.target.value) })} /></label>
            </div>
          )}

          <label className="block text-xs font-bold text-carbon">Visible cuando<input aria-label="Condición de visibilidad" placeholder="Expresión segura; vacío = siempre" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs" value={selectedElement.properties?.visibleWhen ?? ''} onChange={(event) => handleElementPropertiesChange({ visibleWhen: event.target.value || undefined })} /></label>

          {(['text', 'label', 'formula', 'infoPanel'].includes(selectedElement.kind)) && (
            <div className="space-y-2 rounded border border-carbon/10 p-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-carbon/45">Texto condicional</p>
              {(selectedElement.properties?.textRules ?? []).map((rule, index) => (
                <div key={`${selectedElement.id}-text-rule-${index}`} className="grid grid-cols-[1fr_1fr_auto] gap-1">
                  <input aria-label={`Condición de texto ${index + 1}`} className="rounded border border-carbon/15 bg-lienzo p-1 font-mono text-[10px]" value={rule.when} onChange={(event) => handleElementPropertiesChange({ textRules: selectedElement.properties?.textRules?.map((item, itemIndex) => itemIndex === index ? { ...item, when: event.target.value } : item) })} />
                  <input aria-label={`Texto reactivo ${index + 1}`} className="rounded border border-carbon/15 bg-lienzo p-1 text-[10px]" value={rule.text} onChange={(event) => handleElementPropertiesChange({ textRules: selectedElement.properties?.textRules?.map((item, itemIndex) => itemIndex === index ? { ...item, text: event.target.value } : item) })} />
                  <button type="button" aria-label={`Eliminar regla ${index + 1}`} className="rounded border border-granada/20 px-1 text-granada" onClick={() => handleElementPropertiesChange({ textRules: selectedElement.properties?.textRules?.filter((_, itemIndex) => itemIndex !== index) })}>×</button>
                </div>
              ))}
              <button type="button" className="w-full rounded border border-carbon/15 px-2 py-1 text-[10px] font-bold" onClick={() => handleElementPropertiesChange({ textRules: [...(selectedElement.properties?.textRules ?? []), { when: '1', text: selectedElement.text || selectedElement.label }] })}>+ Regla de texto</button>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-carbon mb-1">Color</label>
            <select
              className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={selectedElement.color}
              onChange={(e) => handleElementChange({ color: e.target.value as ColorToken })}
            >
              {COLOR_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded border border-carbon/10 p-2">
            <label className="text-xs font-bold text-carbon">Grosor<input type="number" min="0" max="20" step="0.1" aria-label="Grosor del elemento" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.style?.strokeWidth ?? 2.4} onChange={(event) => handleElementStyleChange({ strokeWidth: Number(event.target.value) })} /></label>
            <label className="text-xs font-bold text-carbon">Grosor resaltado<input type="number" min="0" max="30" step="0.1" aria-label="Grosor resaltado del elemento" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.style?.highlightStrokeWidth ?? 4.8} onChange={(event) => handleElementStyleChange({ highlightStrokeWidth: Number(event.target.value) })} /></label>
            <label className="text-xs font-bold text-carbon">Relleno<input type="number" min="0" max="1" step="0.01" aria-label="Opacidad de relleno" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.style?.fillOpacity ?? 0.16} onChange={(event) => handleElementStyleChange({ fillOpacity: Number(event.target.value) })} /></label>
            <label className="text-xs font-bold text-carbon">Relleno resaltado<input type="number" min="0" max="1" step="0.01" aria-label="Opacidad de relleno resaltado" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.style?.highlightFillOpacity ?? 0.34} onChange={(event) => handleElementStyleChange({ highlightFillOpacity: Number(event.target.value) })} /></label>
            <label className="col-span-2 flex items-center gap-1.5 text-xs font-bold text-carbon"><input type="checkbox" checked={selectedElement.style?.preserveColorOnHighlight ?? false} onChange={(event) => handleElementStyleChange({ preserveColorOnHighlight: event.target.checked })} />Conservar color al resaltar</label>
          </div>

          <label className="flex items-center gap-1.5 text-xs font-bold text-carbon">
            <input
              type="checkbox"
              checked={selectedElement.dashed || false}
              onChange={(e) => handleElementChange({ dashed: e.target.checked })}
              className="rounded border-carbon/15 bg-lienzo"
            />
            ¿Línea discontinua?
          </label>

          <label className="flex items-center gap-1.5 text-xs font-bold text-carbon">
            <input
              type="checkbox"
              checked={selectedElement.target}
              onChange={(e) => handleElementChange({ target: e.target.checked })}
              className="rounded border-carbon/15 bg-lienzo"
            />
            ¿Se puede enlazar desde MDX?
          </label>
        </div>
      )}

      {selectedSlider && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-carbon mb-1">ID interno del objeto</label>
            <input
              className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs"
              value={selectedSlider.id}
              onChange={(e) => {
                const nextId = cleanTargetId(e.target.value, selectedSlider.id);
                onModelEdit(renameSlider(model, selectedSlider.id, nextId));
                onSelect(nextId);
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-carbon mb-1">Etiqueta</label>
            <input
              className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={selectedSlider.label}
              onChange={(e) => handleSliderChange({ label: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-1">
            <div>
              <label className="block text-[10px] font-bold text-carbon mb-1">Mínimo</label>
              <input
                type="number"
                className="w-full rounded border border-carbon/15 bg-lienzo p-1 text-xs"
                value={selectedSlider.min}
                onChange={(e) => handleSliderChange({ min: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-carbon mb-1">Valor</label>
              <input
                type="number"
                step={selectedSlider.step}
                className="w-full rounded border border-carbon/15 bg-lienzo p-1 text-xs"
                value={selectedSlider.value}
                onChange={(e) => handleSliderChange({ value: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-carbon mb-1">Máximo</label>
              <input
                type="number"
                className="w-full rounded border border-carbon/15 bg-lienzo p-1 text-xs"
                value={selectedSlider.max}
                onChange={(e) => handleSliderChange({ max: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-carbon mb-1">Color</label>
            <select
              className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={selectedSlider.color}
              onChange={(e) => handleSliderChange({ color: e.target.value as ColorToken })}
            >
              {COLOR_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {(model.constraints?.length || model.dependencies?.length) ? (
        <div className="mt-4 border-t border-carbon/10 pt-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Grafo de dependencias y restricciones</p>
          <p className="mt-1 text-[10px] text-carbon/55">{model.dependencies?.length ?? 0} aristas explícitas · {model.constraints?.length ?? 0} restricciones</p>
          <ul className="mt-2 space-y-1 text-[10px] text-carbon/70">
            {model.dependencies?.slice(0, 8).map((dependency, index) => <li key={`${dependency.sourceId}-${dependency.targetId}-${index}`} className="font-mono">{dependency.sourceId} → {dependency.targetId}</li>)}
          </ul>
          <div className="mt-2 space-y-2">
            {model.constraints?.map(constraint => (
              <div key={constraint.id} className="rounded border border-carbon/10 p-2">
                <input
                  aria-label={`Nombre de ${constraint.id}`}
                  className="w-full bg-transparent text-xs font-bold text-carbon"
                  value={constraint.label}
                  onChange={(event) => onModelEdit({ ...model, constraints: model.constraints?.map(item => item.id === constraint.id ? { ...item, label: event.target.value } : item) })}
                />
                <div className="mt-1 grid grid-cols-[1fr_auto] gap-1">
                  <select
                    aria-label={`Tipo de ${constraint.id}`}
                    className="rounded border border-carbon/15 bg-lienzo p-1 text-[10px]"
                    value={constraint.kind}
                    onChange={(event) => onModelEdit({ ...model, constraints: model.constraints?.map(item => item.id === constraint.id ? { ...item, kind: event.target.value as typeof constraint.kind } : item) })}
                  >
                    <option value="fixed">Fijo</option><option value="horizontal">Horizontal</option><option value="vertical">Vertical</option>
                    <option value="coincident">Coincidente</option><option value="on">Sobre objeto</option><option value="distance">Distancia fija</option>
                    <option value="perpendicular">Perpendicular</option><option value="parallel">Paralela</option><option value="insideDisk">Dentro del disco</option><option value="sameSide">Mismo semiplano</option><option value="expression">Expresión</option>
                  </select>
                  <label className="flex items-center gap-1 text-[10px]"><input type="checkbox" checked={constraint.enabled} onChange={(event) => onModelEdit({ ...model, constraints: model.constraints?.map(item => item.id === constraint.id ? { ...item, enabled: event.target.checked } : item) })} />Activa</label>
                </div>
                <div className="mt-1 space-y-1">
                  {constraint.refs.map((ref, index) => (
                    <select
                      key={`${constraint.id}-ref-${index}`}
                      aria-label={`Referencia ${index + 1} de ${constraint.id}`}
                      className="w-full rounded border border-carbon/15 bg-lienzo p-1 font-mono text-[10px]"
                      value={ref}
                      onChange={(event) => handleConstraintRefsChange(constraint.id, constraint.refs.map((value, refIndex) => refIndex === index ? event.target.value : value))}
                    >
                      {[...model.points, ...model.elements].map(item => <option key={item.id} value={item.id}>{item.id}</option>)}
                    </select>
                  ))}
                  <button
                    type="button"
                    className="w-full rounded border border-carbon/15 px-1 py-0.5 text-[10px]"
                    onClick={() => {
                      const candidate = [...model.points, ...model.elements].find(item => !constraint.refs.includes(item.id));
                      if (candidate) handleConstraintRefsChange(constraint.id, [...constraint.refs, candidate.id]);
                    }}
                  >+ Referencia</button>
                </div>
                {(constraint.kind === 'distance' || constraint.kind === 'expression') && (
                  <input
                    aria-label={`Expresión de ${constraint.id}`}
                    className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1 font-mono text-[10px]"
                    placeholder="Expresión matemática segura"
                    value={constraint.expression || ''}
                    onChange={(event) => onModelEdit({ ...model, constraints: model.constraints?.map(item => item.id === constraint.id ? { ...item, expression: event.target.value || undefined } : item) })}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {selectedStep && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-carbon mb-1">Etiqueta</label>
            <input
              className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={selectedStep.label}
              onChange={(e) => handleStepChange({ label: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-carbon mb-1">Descripción</label>
            <textarea
              className="w-full h-16 rounded border border-carbon/15 bg-lienzo p-1.5 text-xs resize-none"
              value={selectedStep.description}
              onChange={(e) => handleStepChange({ description: e.target.value })}
            />
          </div>
        </div>
      )}

      {selectedSceneItem && (
        <div className="mt-4 space-y-3 border-t border-carbon/10 pt-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Escena y selección</p>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-carbon">
              <input type="checkbox" checked={selectedSceneItem.visible} onChange={(event) => handleSceneItemChange({ visible: event.target.checked })} />
              Visible
            </label>
            <label className="flex items-center gap-1.5 text-xs font-bold text-carbon">
              <input type="checkbox" checked={selectedSceneItem.locked} onChange={(event) => handleSceneItemChange({ locked: event.target.checked })} />
              Bloqueado
            </label>
            <label className="flex items-center gap-1.5 text-xs font-bold text-carbon">
              <input
                type="checkbox"
                checked={selectedSceneItem.selection.selectable}
                onChange={(event) => handleSceneItemChange({ selection: { ...selectedSceneItem.selection, selectable: event.target.checked } })}
              />
              Seleccionable
            </label>
          </div>
          <div>
            <label className="block text-xs font-bold text-carbon mb-1">Capa</label>
            <select
              className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={selectedSceneItem.layerId}
              onChange={(event) => handleSceneItemChange({ layerId: event.target.value })}
            >
              {model.layers.slice().sort((a, b) => a.order - b.order).map(layer => <option key={layer.id} value={layer.id}>{layer.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-carbon mb-1">Orden visual</label>
            <input
              type="number"
              className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs font-mono"
              value={selectedSceneItem.order}
              onChange={(event) => handleSceneItemChange({ order: Number(event.target.value) })}
            />
          </div>
          {model.groups.length > 0 && (
            <fieldset className="space-y-1">
              <legend className="text-xs font-bold text-carbon">Grupos</legend>
              {model.groups.map(group => (
                <label key={group.id} className="flex items-center gap-1.5 text-xs text-carbon">
                  <input
                    type="checkbox"
                    checked={selectedSceneItem.groupIds.includes(group.id)}
                    onChange={(event) => {
                      const nextGroupIds = event.target.checked
                        ? [...selectedSceneItem.groupIds, group.id]
                        : selectedSceneItem.groupIds.filter(id => id !== group.id);
                      const nextGroups = model.groups.map(item => item.id === group.id
                        ? { ...item, memberIds: event.target.checked ? [...new Set([...item.memberIds, selectedSceneItem.id])] : item.memberIds.filter(id => id !== selectedSceneItem.id) }
                        : item);
                      if (selectedPoint) onModelEdit({ ...updatePoint(model, selectedPoint.id, { groupIds: nextGroupIds }), groups: nextGroups });
                      else if (selectedElement) onModelEdit({ ...updateElement(model, selectedElement.id, { groupIds: nextGroupIds }), groups: nextGroups });
                      else if (selectedSlider) onModelEdit({ ...updateSlider(model, selectedSlider.id, { groupIds: nextGroupIds }), groups: nextGroups });
                    }}
                  />
                  {group.label}
                </label>
              ))}
            </fieldset>
          )}
        </div>
      )}

      {hasSelection && (
        <button
          onClick={onDeleteSelected}
          className="mt-6 w-full rounded bg-granada/10 border border-granada/25 hover:bg-granada text-granada hover:text-lienzo transition-all py-1.5 text-xs font-bold"
        >
          Eliminar elemento
        </button>
      )}
    </section>
  );
};
export default DiagramInspector;
