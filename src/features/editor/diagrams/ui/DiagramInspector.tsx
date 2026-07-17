import React from 'react';
import type { VisualDiagramModel, VisualPoint, VisualElement, VisualSlider, VisualStep, ColorToken, PointConstraint } from '../model/types';
import { COLOR_OPTIONS, KIND_LABELS, toolReferenceCandidates, toolReferenceLabel } from '../model/commands';
import { cleanTargetId, renamePoint, renameElement, renameSlider } from '../model/commands';
import { updatePoint, updateElement, updateSlider, updateStep } from '../model/commands';
import { DEFAULT_ANGLE_RADIUS, DEFAULT_RIGHT_ANGLE_RADIUS, extractMathExpressionIdentifiers } from '@/shared/diagrams/public';
import { DiagramConstraintEditor } from './DiagramConstraintEditor';
import { constraintPresentation } from '../model/constraintOptions';
import { DiagramSceneControls } from './DiagramSceneControls';
import { SegmentLengthConstraintEditor } from './SegmentLengthConstraintEditor';
import { SegmentMarksEditor } from './SegmentMarksEditor';
import { AngleEqualityConstraintEditor } from './AngleEqualityConstraintEditor';

interface DiagramInspectorProps {
  model: VisualDiagramModel;
  selectedId: string;
  onSelect: (id: string) => void;
  onModelEdit: (model: VisualDiagramModel) => void;
  onDeleteSelected: () => void;
  onAddElementLabel?: (elementId: string) => void;
}

function sceneItemLabel(model: VisualDiagramModel, id: string): string {
  const item = [...model.points, ...model.elements, ...model.sliders].find(candidate => candidate.id === id);
  return item ? `${item.label} (${item.id})` : id;
}

function elementReferenceCandidates(model: VisualDiagramModel, element: VisualElement) {
  if (element.kind === 'intersection') return toolReferenceCandidates(model, 'intersection');
  if (element.kind === 'measureTicks') return toolReferenceCandidates(model, 'measureTicks');
  return [...model.points, ...model.elements.filter(candidate => candidate.id !== element.id)];
}

export const DiagramInspector: React.FC<DiagramInspectorProps> = ({
  model,
  selectedId,
  onSelect,
  onModelEdit,
  onDeleteSelected,
  onAddElementLabel,
}) => {
  const selectedPoint = model.points.find(item => item.id === selectedId);
  const selectedElement = model.elements.find(item => item.id === selectedId);
  const selectedSlider = model.sliders.find(item => item.id === selectedId);
  const selectedStep = model.steps.find(item => item.id === selectedId);
  const selectedSceneItem = selectedPoint || selectedElement || selectedSlider;
  const attachedLabel = selectedElement?.kind === 'label'
    ? undefined
    : model.elements.find(item => item.kind === 'label' && item.refs[0] === selectedElement?.id);

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
    if (!('expression' in update) && !('xExpression' in update) && !('yExpression' in update) && !('tickDistanceExpression' in update) && !('visibleWhen' in update) && !('textRules' in update)) {
      onModelEdit(next);
      return;
    }
    const sources = new Set<string>();
    [
      properties.expression,
      properties.xExpression,
      properties.yExpression,
      properties.tickDistanceExpression,
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
    const next = updateSlider(model, selectedSlider.id, update);
    if (!('maxExpression' in update)) {
      onModelEdit(next);
      return;
    }
    const sources = new Set<string>();
    if (update.maxExpression) {
      try {
        extractMathExpressionIdentifiers(update.maxExpression).forEach(identifier => {
          const root = identifier.split('.')[0];
          if ([...model.points, ...model.elements, ...model.sliders].some(item => item.id === root)) sources.add(root);
        });
      } catch {
        // El schema compartido muestra el error sin descartar el texto editado.
      }
    }
    onModelEdit({
      ...next,
      dependencies: [
        ...(model.dependencies || []).filter(dependency => dependency.targetId !== selectedSlider.id || dependency.relation !== 'expression'),
        ...[...sources].map(sourceId => ({ sourceId, targetId: selectedSlider.id, relation: 'expression' as const })),
      ],
    });
  };

  const handleStepChange = (update: Partial<VisualStep>) => {
    if (!selectedStep) return;
    onModelEdit(updateStep(model, selectedStep.id, update));
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
            <span className="mt-1 block text-[10px] text-carbon/45">Admite LaTeX entre <code>$...$</code> o <code>$$...$$</code>.</span>
            <label className="mt-2 flex items-center gap-2 text-xs font-bold text-carbon">
              <input
                type="checkbox"
                aria-label="Mostrar etiqueta del punto en el lienzo"
                checked={selectedPoint.showLabel !== false}
                onChange={(event) => handlePointChange({ showLabel: event.target.checked })}
              />
              Mostrar etiqueta en el lienzo
            </label>
            <label className="mt-2 block text-xs font-bold text-carbon">
              Tamaño de la etiqueta
              <input
                type="number"
                min="6"
                max="72"
                step="1"
                aria-label="Tamaño de la etiqueta del punto"
                className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                value={selectedPoint.style?.labelSize ?? 19}
                onChange={(event) => handlePointStyleChange({ labelSize: Number(event.target.value) })}
              />
            </label>
            <span className="mt-1 block text-[10px] leading-relaxed text-carbon/45">El nombre se conserva para el editor, la accesibilidad y los enlaces aunque no se dibuje.</span>
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

          {['free', 'horizontal', 'vertical'].includes(selectedPoint.constraint) && (
            <div className="space-y-2 rounded border border-carbon/10 p-2">
              <label className="flex items-center gap-1.5 text-xs font-bold text-carbon">
                <input
                  type="checkbox"
                  aria-label="Ajuste a cuadrícula"
                  checked={selectedPoint.snapToGrid ?? false}
                  onChange={(e) => handlePointChange({ snapToGrid: e.target.checked || undefined })}
                />
                Ajuste a cuadrícula
              </label>
              {selectedPoint.snapToGrid && (
                <label className="block text-xs font-bold text-carbon">
                  Tamaño de celda
                  <input
                    type="number"
                    min="0.01"
                    max="10"
                    step="0.25"
                    aria-label="Tamaño de celda de ajuste"
                    className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                    value={selectedPoint.snapSize ?? 0.5}
                    onChange={(e) => handlePointChange({ snapSize: Math.max(0.01, Number(e.target.value)) })}
                  />
                </label>
              )}
            </div>
          )}

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
            <span className="mt-1 block text-[10px] text-carbon/45">Admite LaTeX entre <code>$...$</code> o <code>$$...$$</code>.</span>
          </div>

          <div>
            <p className="block text-xs font-bold text-carbon mb-1">Tipo: <span className="font-normal text-carbon/75">{KIND_LABELS[selectedElement.kind]}</span></p>
          </div>

          {selectedElement.kind !== 'label' && (
            <fieldset className="space-y-2 rounded border border-ocre/20 bg-ocre/5 p-2">
              <legend className="px-1 text-[10px] font-bold uppercase tracking-wider text-ocre">Etiqueta en el lienzo</legend>
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
                  <button type="button" className="w-full rounded border border-ocre/25 bg-lienzo px-2 py-1.5 text-xs font-bold text-ocre" onClick={() => onSelect(attachedLabel.id)}>
                    Editar texto y posición
                  </button>
                </>
              ) : (
                <button type="button" disabled={!onAddElementLabel} className="w-full rounded bg-ocre px-2 py-1.5 text-xs font-bold text-lienzo disabled:opacity-40" onClick={() => onAddElementLabel?.(selectedElement.id)}>
                  Añadir etiqueta a este elemento
                </button>
              )}
              <p className="text-[10px] leading-relaxed text-carbon/50">La etiqueta queda vinculada al objeto y lo sigue cuando cambia la geometría.</p>
            </fieldset>
          )}

          {selectedElement.refs.length > 0 && (
            <fieldset className="space-y-1 rounded border border-carbon/10 p-2">
              <legend className="px-1 text-[10px] font-bold uppercase tracking-wider text-carbon/45">Referencias geométricas</legend>
              {selectedElement.refs.map((ref, index) => {
                const referenceLabel = toolReferenceLabel(selectedElement.kind, index);
                return (
                  <label key={`${selectedElement.id}-ref-${index}`} className="block text-[10px] font-bold text-carbon/60">
                    {referenceLabel}
                    <select
                      aria-label={`${referenceLabel} de ${KIND_LABELS[selectedElement.kind]}`}
                      className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs"
                      value={ref}
                      onChange={(event) => handleElementChange({ refs: selectedElement.refs.map((value, refIndex) => refIndex === index ? event.target.value : value) })}
                    >
                      {elementReferenceCandidates(model, selectedElement).map(item => (
                        <option key={item.id} value={item.id}>{item.label} ({item.id})</option>
                      ))}
                    </select>
                  </label>
                );
              })}
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

          {selectedElement.kind === 'segment' && (
            <>
              <SegmentMarksEditor
                model={model}
                segment={selectedElement}
                onModelEdit={onModelEdit}
              />
              <SegmentLengthConstraintEditor
                key={selectedElement.id}
                model={model}
                segment={selectedElement}
                onModelEdit={onModelEdit}
              />
            </>
          )}

          {(selectedElement.kind === 'angle' || selectedElement.kind === 'nonReflexAngle') && (
            <AngleEqualityConstraintEditor
              key={selectedElement.id}
              model={model}
              angle={selectedElement}
              onModelEdit={onModelEdit}
            />
          )}

          {selectedElement.kind === 'intersection' && (
            <fieldset className="space-y-2 rounded border border-pavo/20 bg-pavo/5 p-2">
              <legend className="px-1 text-[10px] font-bold uppercase tracking-wider text-pavo">Intersección exacta</legend>
              <label className="flex items-start gap-1.5 text-xs font-bold text-carbon">
                <input
                  type="checkbox"
                  checked={selectedElement.properties?.restrictToSupports ?? true}
                  onChange={(event) => handleElementPropertiesChange({ restrictToSupports: event.target.checked })}
                />
                <span>Exigir pertenencia a los soportes finitos<span className="mt-0.5 block text-[10px] font-normal leading-relaxed text-carbon/50">Si un soporte es un segmento o una semirrecta, el punto se oculta cuando la intersección de sus rectas portadoras cae fuera.</span></span>
              </label>
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
              <span className="mt-1 block text-[10px] text-carbon/45">Puede mezclar texto y LaTeX, por ejemplo <code>{'$\\alpha + \\beta$'}</code>.</span>
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
              <span className="mt-1 block text-[10px] text-carbon/45">Puede mezclar texto y LaTeX, por ejemplo <code>{'$x^2$'}</code>.</span>
            </div>
          )}

          {selectedElement.kind === 'label' && (
            <fieldset className="space-y-3 rounded border border-ocre/20 bg-ocre/5 p-2">
              <legend className="px-1 text-[10px] font-bold uppercase tracking-wider text-ocre">Posición junto al elemento</legend>
              <label className="block text-xs font-bold text-carbon">
                Tamaño de la etiqueta
                <input
                  type="number"
                  min="6"
                  max="72"
                  step="1"
                  aria-label="Tamaño de la etiqueta vinculada"
                  className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                  value={selectedElement.style?.labelSize ?? 14}
                  onChange={(event) => handleElementStyleChange({ labelSize: Number(event.target.value) })}
                />
              </label>
              {model.elements.some(item => item.id === selectedElement.refs[0]) && (
                <label className="block text-xs font-bold text-carbon">
                  Posición sobre el elemento: {Math.round((selectedElement.properties?.anchorParameter ?? 0.5) * 100)}%
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    aria-label="Posición de la etiqueta sobre el elemento"
                    className="mt-1 w-full accent-ocre"
                    value={selectedElement.properties?.anchorParameter ?? 0.5}
                    onChange={(event) => handleElementPropertiesChange({ anchorMode: 'reference', anchorParameter: Number(event.target.value) })}
                  />
                </label>
              )}
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs font-bold text-carbon">
                  Separación X
                  <input
                    type="number"
                    step="0.01"
                    aria-label="Separación horizontal de la etiqueta"
                    className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                    value={selectedElement.style?.textOffset?.[0] ?? 0.04}
                    onChange={(event) => handleElementStyleChange({ textOffset: [Number(event.target.value), selectedElement.style?.textOffset?.[1] ?? 0.04] })}
                  />
                </label>
                <label className="text-xs font-bold text-carbon">
                  Separación Y
                  <input
                    type="number"
                    step="0.01"
                    aria-label="Separación vertical de la etiqueta"
                    className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                    value={selectedElement.style?.textOffset?.[1] ?? 0.04}
                    onChange={(event) => handleElementStyleChange({ textOffset: [selectedElement.style?.textOffset?.[0] ?? 0.04, Number(event.target.value)] })}
                  />
                </label>
              </div>
              <p className="text-[10px] leading-relaxed text-carbon/50">0% corresponde al inicio y 100% al final. Las separaciones permiten evitar solapes sin crear puntos auxiliares.</p>
            </fieldset>
          )}

          {selectedElement.kind === 'infoPanel' && (
            <fieldset className="space-y-2 rounded border border-carbon/10 p-2">
              <legend className="px-1 text-[10px] font-bold uppercase tracking-wider text-carbon/45">Posición del panel</legend>
              <label className="block text-xs font-bold text-carbon">
                Tipo de anclaje
                <select
                  aria-label="Tipo de anclaje del panel"
                  className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                  value={selectedElement.properties?.anchorMode ?? 'reference'}
                  onChange={(event) => {
                    const anchorMode = event.target.value as 'reference' | 'viewport';
                    handleElementChange({
                      refs: anchorMode === 'viewport'
                        ? []
                        : selectedElement.refs.length > 0 ? selectedElement.refs : model.points[0] ? [model.points[0].id] : [],
                      properties: {
                        ...selectedElement.properties,
                        anchorMode,
                        ...(anchorMode === 'viewport' && !selectedElement.properties?.viewportPosition
                          ? { viewportPosition: [0.08, 0.22] as [number, number] }
                          : {}),
                      },
                    });
                  }}
                >
                  <option value="reference">Referencia geométrica</option>
                  <option value="viewport">Posición relativa al lienzo</option>
                </select>
              </label>
              {(selectedElement.properties?.anchorMode ?? 'reference') === 'reference' && <label className="block text-xs font-bold text-carbon">
                Objeto al que acompaña
                <select aria-label="Objeto de referencia del panel" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.refs[0] ?? ''} onChange={event => handleElementChange({ refs: event.target.value ? [event.target.value] : [] })}>
                  <option value="">Seleccione un objeto…</option>
                  {[...model.points, ...model.elements.filter(item => item.id !== selectedElement.id), ...model.sliders].map(item => <option key={item.id} value={item.id}>{item.label} ({item.id})</option>)}
                </select>
                <span className="mt-1 block text-[10px] font-normal leading-relaxed text-carbon/45">El panel seguirá la posición del objeto cuando este se mueva.</span>
              </label>}
              {(selectedElement.properties?.anchorMode ?? 'reference') === 'viewport' && (
                <div className="space-y-2">
                  <button
                    type="button"
                    className="w-full rounded border border-carbon/15 bg-lienzo px-2 py-1.5 text-left text-xs font-semibold text-carbon transition-colors hover:border-ocre/60 hover:bg-ocre/5"
                    aria-label="Alinear panel con el título"
                    onClick={() => handleElementPropertiesChange({ viewportPosition: [0, 0] })}
                  >
                    Alinear con el título
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-xs font-bold text-carbon">
                      Horizontal (%)
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        aria-label="Posición horizontal del panel"
                        className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                        value={Math.round((selectedElement.properties?.viewportPosition?.[0] ?? 0.08) * 100)}
                        onChange={(event) => handleElementPropertiesChange({
                          viewportPosition: [Number(event.target.value) / 100, selectedElement.properties?.viewportPosition?.[1] ?? 0.22],
                        })}
                      />
                    </label>
                    <label className="text-xs font-bold text-carbon">
                      Vertical (%)
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        aria-label="Posición vertical del panel"
                        className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                        value={Math.round((selectedElement.properties?.viewportPosition?.[1] ?? 0.22) * 100)}
                        onChange={(event) => handleElementPropertiesChange({
                          viewportPosition: [selectedElement.properties?.viewportPosition?.[0] ?? 0.08, Number(event.target.value) / 100],
                        })}
                      />
                    </label>
                  </div>
                </div>
              )}
              <label className="block text-xs font-bold text-carbon">
                Título del panel
                <input
                  aria-label="Título del panel"
                  className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                  value={selectedElement.properties?.title ?? ''}
                  onChange={(event) => handleElementPropertiesChange({ title: event.target.value || undefined })}
                />
              </label>
            </fieldset>
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
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs font-bold text-carbon">Número de marcas<input type="number" min="1" max="4" aria-label="Número de marcas" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.markCount ?? 1} onChange={(event) => handleElementPropertiesChange({ markCount: Number(event.target.value) })} /></label>
              <label className="text-xs font-bold text-carbon">Altura<input type="number" min="0.05" max="100" step="0.05" aria-label="Altura de las marcas de congruencia" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.style?.markHeight ?? 0.32} onChange={(event) => handleElementStyleChange({ markHeight: Number(event.target.value) })} /></label>
            </div>
          )}

          {selectedElement.kind === 'measureTicks' && (
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs font-bold text-carbon">Separación<input type="number" min="0.05" max="100" step="0.05" aria-label="Separación entre marcas de medida" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.tickDistance ?? 2} onChange={(event) => handleElementPropertiesChange({ tickDistance: Number(event.target.value) })} /></label>
              <label className="text-xs font-bold text-carbon">Altura<input type="number" min="0.05" max="100" step="0.5" aria-label="Altura de las marcas de medida" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.style?.markHeight ?? 10} onChange={(event) => handleElementStyleChange({ markHeight: Number(event.target.value) })} /></label>
              <label className="col-span-2 text-xs font-bold text-carbon">Subdivisiones menores<input type="number" min="0" max="10" step="1" aria-label="Número de subdivisiones menores" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.minorTickCount ?? 4} onChange={(event) => handleElementPropertiesChange({ minorTickCount: Number(event.target.value) })} /></label>
              <label className="col-span-2 text-xs font-bold text-carbon">Separación dinámica<input aria-label="Expresión de separación entre marcas" placeholder="Vacío = usar separación fija" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs" value={selectedElement.properties?.tickDistanceExpression ?? ''} onChange={(event) => handleElementPropertiesChange({ tickDistanceExpression: event.target.value || undefined })} /></label>
            </div>
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
            {selectedElement.kind === 'intersection' && (
              <>
                <label className="text-xs font-bold text-carbon">Tamaño<input type="number" min="0" max="30" step="0.5" aria-label="Tamaño de la intersección" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.style?.pointSize ?? 4} onChange={(event) => handleElementStyleChange({ pointSize: Number(event.target.value) })} /></label>
                <label className="text-xs font-bold text-carbon">Tamaño resaltado<input type="number" min="0" max="40" step="0.5" aria-label="Tamaño resaltado de la intersección" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.style?.highlightPointSize ?? 7} onChange={(event) => handleElementStyleChange({ highlightPointSize: Number(event.target.value) })} /></label>
              </>
            )}
            {(selectedElement.kind === 'angle' || selectedElement.kind === 'nonReflexAngle' || selectedElement.kind === 'rightAngle' || selectedElement.kind === 'perpendicularMark') && (
              <label className="col-span-2 text-xs font-bold text-carbon">Radio de la marca<input type="number" min="0.05" max="10" step="0.05" aria-label="Radio de la marca angular" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.style?.angleRadius ?? (selectedElement.kind === 'angle' || selectedElement.kind === 'nonReflexAngle' ? DEFAULT_ANGLE_RADIUS : DEFAULT_RIGHT_ANGLE_RADIUS)} onChange={(event) => handleElementStyleChange({ angleRadius: Number(event.target.value) })} /></label>
            )}
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
            <span className="mt-1 block text-[10px] text-carbon/45">Admite LaTeX entre <code>$...$</code> o <code>$$...$$</code>.</span>
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

          <label className="block text-xs font-bold text-carbon">
            Máximo dinámico
            <input
              aria-label="Expresión del máximo dinámico del slider"
              placeholder="Vacío = usar máximo fijo"
              className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs"
              value={selectedSlider.maxExpression ?? ''}
              onChange={(event) => handleSliderChange({ maxExpression: event.target.value || undefined })}
            />
            <span className="mt-1 block text-[10px] font-normal leading-relaxed text-carbon/45">El máximo fijo se conserva como valor de respaldo si la expresión no puede evaluarse.</span>
          </label>

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
        <details className="mt-4 border-t border-carbon/10 pt-3">
          <summary className="cursor-pointer list-none text-[10px] font-bold uppercase tracking-widest text-carbon/45 [&::-webkit-details-marker]:hidden">
            Cómo se construye <span className="float-right font-mono font-normal">{model.constraints?.length ?? 0} relaciones ▾</span>
          </summary>
          <div className="mt-2 rounded border border-carbon/10 bg-carbon/[0.02] p-2">
            <p className="text-[10px] leading-relaxed text-carbon/55">Estas dependencias se generan automáticamente al construir objetos. Indican qué debe recalcularse cuando se mueve un punto; no son una segunda lista de objetos.</p>
            {(model.constraints?.length ?? 0) > 0 && (
              <ul className="mt-2 space-y-1.5">
                {model.constraints?.map(constraint => (
                  <li key={constraint.id} className="rounded bg-lienzo px-2 py-1.5 text-[10px] text-carbon/65">
                    <strong>{constraintPresentation(constraint.kind).label}</strong>: {constraint.refs.map(ref => sceneItemLabel(model, ref)).join(' → ')}
                    {!constraint.enabled && <span className="ml-1 text-carbon/40">(pausada)</span>}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-[9px] text-carbon/40">{model.dependencies?.length ?? 0} dependencias automáticas. Se editan cambiando las referencias del objeto o sus relaciones.</p>
          </div>
        </details>
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

      {selectedSceneItem && <DiagramSceneControls model={model} point={selectedPoint} element={selectedElement} slider={selectedSlider} onModelEdit={onModelEdit} />}

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
