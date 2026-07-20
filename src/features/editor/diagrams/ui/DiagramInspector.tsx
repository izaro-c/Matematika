import React from 'react';
import type { VisualDiagramModel, VisualPoint, VisualElement, VisualSlider, VisualStep, ColorToken, PointConstraint } from '../model/types';
import { COLOR_OPTIONS, KIND_LABELS, convertAngleKind, toolReferenceCandidates, toolReferenceLabel } from '../model/commands';
import { cleanTargetId, renamePoint, renameElement, renameSlider } from '../model/commands';
import { removeDiagramElements, setPointAttractors, updatePoint, updateElement, updateSlider, updateStep } from '../model/commands';
import { extractMathExpressionIdentifiers } from '@/shared/diagrams/public';
import { DiagramConstraintEditor } from './DiagramConstraintEditor';
import { constraintPresentation } from '../model/constraintOptions';
import { DiagramSceneControls } from './DiagramSceneControls';
import { SegmentLengthConstraintEditor } from './SegmentLengthConstraintEditor';
import { SegmentMarksEditor } from './SegmentMarksEditor';
import { AngleEqualityConstraintEditor } from './AngleEqualityConstraintEditor';
import { DiagramExpressionField, DiagramFormulaField } from './DiagramExpressionField';
import { DiagramElementAppearanceEditor } from './DiagramElementAppearanceEditor';
import { DiagramElementBehaviorEditor } from './DiagramElementBehaviorEditor';
import { DiagramTextRulesEditor } from './DiagramTextRulesEditor';
import { DiagramAnnotationPositionEditor } from './DiagramAnnotationPositionEditor';
import { DiagramInfoPanelContentEditor } from './DiagramInfoPanelContentEditor';
import { DiagramPointMovementAidsEditor } from './DiagramPointMovementAidsEditor';
import { elementInspectorCapabilities } from '../model/elementInspectorCapabilities';

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
  if (element.kind === 'congruenceMark' || element.kind === 'parallelMark') return model.points;
  return [...model.points, ...model.elements.filter(candidate => candidate.id !== element.id)];
}

function expressionDependencySources(model: VisualDiagramModel, expressions: Array<string | undefined>): string[] {
  const sceneIds = new Set([...model.points, ...model.elements, ...model.sliders].map(item => item.id));
  const sources = new Set<string>();
  for (const source of expressions) {
    if (!source) continue;
    try {
      for (const identifier of extractMathExpressionIdentifiers(source)) {
        const root = identifier.split('.')[0];
        if (sceneIds.has(root)) sources.add(root);
      }
    } catch {
      // El schema compartido muestra el error sin descartar el texto editado.
    }
  }
  return [...sources];
}



function curveParameter(element: VisualElement): string {
  return element.properties?.parameter ?? (element.kind === 'functionCurve' ? 'x' : 't');
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
  const selectedElementCapabilities = selectedElement ? elementInspectorCapabilities(selectedElement.kind) : undefined;
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

  const handlePointAttractorsChange = (attractorIds: string[]) => {
    if (!selectedPoint) return;
    onModelEdit(setPointAttractors(model, selectedPoint.id, attractorIds));
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
    for (const key in properties) {
      if (properties[key as keyof typeof properties] === undefined) {
        delete properties[key as keyof typeof properties];
      }
    }
    const next = updateElement(model, selectedElement.id, { properties });
    if (!('expression' in update) && !('xExpression' in update) && !('yExpression' in update) && !('tickDistanceExpression' in update) && !('visibleWhen' in update) && !('textRules' in update) && !('infoPanelBlocks' in update)) {
      onModelEdit(next);
      return;
    }
    const sources = expressionDependencySources(model, [
      properties.expression,
      properties.xExpression,
      properties.yExpression,
      properties.tickDistanceExpression,
      properties.visibleWhen,
      ...(properties.textRules?.map(rule => rule.when) ?? []),
      ...(properties.infoPanelBlocks?.flatMap(block => [
        block.expression,
        ...(block.rules?.flatMap(rule => [rule.when, rule.expression]) ?? []),
      ]) ?? []),
    ]);
    onModelEdit({
      ...next,
      dependencies: [
        ...(model.dependencies || []).filter(dependency => dependency.targetId !== selectedElement.id || dependency.relation !== 'expression'),
        ...sources.map(sourceId => ({ sourceId, targetId: selectedElement.id, relation: 'expression' as const })),
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
            <label className="block text-xs font-bold text-carbon mb-1">Etiqueta del punto</label>
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
                {model.elements.map(el => (
                  <option key={el.id} value={el.id}>{el.id} ({KIND_LABELS[el.kind]})</option>
                ))}
              </select>
            </div>
          )}

          {selectedPoint.constraint === 'derived' && (
            <div className="space-y-2 rounded border border-pavo/20 bg-pavo/5 p-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-pavo">Coordenadas derivadas</p>
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
            <label className="block text-xs font-bold text-carbon mb-1">Nombre en el editor</label>
            <input
              className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={selectedElement.label}
              onChange={(e) => handleElementChange({ label: e.target.value })}
            />
            <span className="mt-1 block text-[10px] text-carbon/45">Admite LaTeX entre <code>$...$</code> o <code>$$...$$</code>.</span>
            <label className="mt-2 flex items-center gap-2 text-xs font-bold text-carbon">
              <input
                type="checkbox"
                aria-label="Mostrar etiqueta en el lienzo"
                checked={selectedElement.showLabel !== false}
                onChange={(event) => handleElementChange({ showLabel: event.target.checked })}
              />
              Mostrar etiqueta en el lienzo
            </label>
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

          {selectedElementCapabilities?.attachedLabel && (
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

          {selectedElement.refs.length > 0 && selectedElement.kind !== 'infoPanel' && selectedElement.kind !== 'label' && (
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
            <div className="space-y-3 rounded border border-carbon/10 p-3 bg-carbon/5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-carbon/50">Contenido y Valor de Medida</p>

              <label className="block text-xs font-bold text-carbon">
                Plantilla del texto
                <input
                  className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                  value={selectedElement.text || ''}
                  onChange={(event) => handleElementChange({ text: event.target.value })}
                  placeholder={`${selectedElement.label}: {value}`}
                />
                <span className="mt-1 block text-[10px] text-carbon/45 leading-relaxed">
                  Use <code>{'{value}'}</code> para mostrar el resultado medido o calculado.
                </span>
              </label>

              {selectedElement.kind === 'dimensionLine' && (
                <label className="block text-xs font-bold text-carbon">
                  Separación de la cota
                  <input type="number" min="-10" max="10" step="0.05" aria-label="Separación de la línea de cota" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.offset ?? 0.35} onChange={event => handleElementPropertiesChange({ offset: Number(event.target.value) })} />
                  <span className="mt-1 block text-[10px] font-normal leading-relaxed text-carbon/45">Desplaza la línea de cota respecto al segmento medido.</span>
                </label>
              )}

              <fieldset className="space-y-2 rounded border border-carbon/15 p-2 bg-lienzo/40">
                <legend className="px-1 text-[10px] font-bold uppercase tracking-wider text-carbon/50">Cálculo de la medida</legend>
                <DiagramExpressionField model={model} label="Fórmula matemática alternativa" ariaLabel="Fórmula de medida" value={selectedElement.properties?.expression || ''} onChange={value => handleElementPropertiesChange({ expression: value || undefined })} placeholder="Vacío = medir distancia automáticamente" optional />
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
              </fieldset>
              <DiagramTextRulesEditor model={model} element={selectedElement} onChange={textRules => handleElementPropertiesChange({ textRules })} />
            </div>
          )}

          {selectedElement.kind === 'formula' && (
            <div className="space-y-3 rounded border border-carbon/10 p-3 bg-carbon/5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-carbon/50">Fórmula KaTeX y Valor</p>

              <DiagramFormulaField label="Fórmula visible (KaTeX)" value={selectedElement.text || ''} onChange={value => handleElementChange({ text: value })} placeholder="Ej. a^2 + b^2 = c^2 o a = {value}" />

              <fieldset className="space-y-2 rounded border border-carbon/15 p-2 bg-lienzo/40">
                <legend className="px-1 text-[10px] font-bold uppercase tracking-wider text-carbon/50">Fórmula de {'{value}'} (Opcional)</legend>
                <DiagramExpressionField model={model} label="Fórmula matemática" value={selectedElement.properties?.expression || ''} onChange={value => handleElementPropertiesChange({ expression: value || undefined })} optional help="Calcula el número que sustituirá a {value} en la fórmula visible." />
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
              </fieldset>
              <DiagramTextRulesEditor model={model} element={selectedElement} onChange={textRules => handleElementPropertiesChange({ textRules })} />
            </div>
          )}

          {selectedElement.kind === 'text' && (
            <div className="space-y-3 rounded border border-carbon/10 bg-carbon/5 p-3">
              <label className="block text-xs font-bold text-carbon mb-1">Contenido de texto</label>
              <input
                className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                value={selectedElement.text || ''}
                onChange={(e) => handleElementChange({ text: e.target.value })}
                placeholder="Introduce el texto..."
              />
              <span className="mt-1 block text-[10px] text-carbon/45">
                Admite texto y LaTeX (ej. <code>{'$\\alpha + \\beta$'}</code>). Puedes usar llaves (ej. <code>{'{a.x}'}</code>) para variables reactivas.
              </span>
              <DiagramTextRulesEditor model={model} element={selectedElement} onChange={textRules => handleElementPropertiesChange({ textRules })} />
            </div>
          )}

          {selectedElement.kind === 'label' && (
            <div className="space-y-3 rounded border border-carbon/10 bg-carbon/5 p-3">
              <label className="block text-xs font-bold text-carbon mb-1">Contenido de la etiqueta</label>
              <input
                className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                value={selectedElement.text || ''}
                onChange={(e) => handleElementChange({ text: e.target.value })}
                placeholder={selectedElement.label}
              />
              <span className="mt-1 block text-[10px] text-carbon/45">
                Texto de la etiqueta junto al elemento. Admite LaTeX (ej. <code>{'$A$'}</code>).
              </span>
              <DiagramTextRulesEditor model={model} element={selectedElement} onChange={textRules => handleElementPropertiesChange({ textRules })} />
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

          <DiagramAnnotationPositionEditor element={selectedElement} onStyleChange={handleElementStyleChange} />



          {selectedElement.kind === 'functionCurve' && (
            <DiagramExpressionField model={model} label="f(x)" ariaLabel="Expresión de función" value={selectedElement.properties?.expression || ''} onChange={value => handleElementPropertiesChange({ expression: value })} parameter={selectedElement.properties?.parameter ?? 'x'} help="x representa cada punto del dominio; también pueden usarse controles y valores de la escena." />
          )}

          {selectedElement.kind === 'parametricCurve' && (
            <div className="space-y-2">
              <DiagramExpressionField model={model} label="x(t)" ariaLabel="Expresión paramétrica x" value={selectedElement.properties?.xExpression || ''} onChange={value => handleElementPropertiesChange({ xExpression: value })} parameter={selectedElement.properties?.parameter ?? 't'} />
              <DiagramExpressionField model={model} label="y(t)" ariaLabel="Expresión paramétrica y" value={selectedElement.properties?.yExpression || ''} onChange={value => handleElementPropertiesChange({ yExpression: value })} parameter={selectedElement.properties?.parameter ?? 't'} />
            </div>
          )}

          {(['functionCurve', 'parametricCurve'].includes(selectedElement.kind)) && (
            <fieldset className="grid grid-cols-2 gap-2 rounded border border-carbon/10 p-2">
              <legend className="px-1 text-[10px] font-bold uppercase tracking-wider text-carbon/45">Dominio y muestreo</legend>
              <label className="text-xs font-bold text-carbon">Dominio mínimo<input type="number" aria-label="Dominio mínimo" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.domain?.[0] ?? -5} onChange={(event) => handleElementPropertiesChange({ domain: [Number(event.target.value), selectedElement.properties?.domain?.[1] ?? 5] })} /></label>
              <label className="text-xs font-bold text-carbon">Dominio máximo<input type="number" aria-label="Dominio máximo" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.domain?.[1] ?? 5} onChange={(event) => handleElementPropertiesChange({ domain: [selectedElement.properties?.domain?.[0] ?? -5, Number(event.target.value)] })} /></label>
              <label className="text-xs font-bold text-carbon">Variable<input aria-label="Variable de la curva" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs" value={curveParameter(selectedElement)} onChange={event => handleElementPropertiesChange({ parameter: event.target.value || curveParameter(selectedElement) })} /></label>
              <label className="text-xs font-bold text-carbon">Muestras<input type="number" min="8" max="512" step="8" aria-label="Número de muestras de la curva" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.samples ?? 128} onChange={event => handleElementPropertiesChange({ samples: Number(event.target.value) })} /></label>
              <p className="col-span-2 text-[10px] leading-relaxed text-carbon/45">La variable debe coincidir con la usada en la expresión. Más muestras mejoran la estimación de la escena, con mayor coste de cálculo.</p>
            </fieldset>
          )}

          {/* El contenido, expresión y formato de valor ya se han agrupado en la sección superior para estos elementos */}

          {(selectedElement.kind === 'congruenceMark' || selectedElement.kind === 'parallelMark') && (
            <label className="block text-xs font-bold text-carbon">Número de marcas<input type="number" min="1" max="4" aria-label="Número de marcas" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.markCount ?? 1} onChange={(event) => handleElementPropertiesChange({ markCount: Number(event.target.value) })} /></label>
          )}

          {selectedElement.kind === 'measureTicks' && (
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs font-bold text-carbon">Separación<input type="number" min="0.05" max="100" step="0.05" aria-label="Separación entre marcas de medida" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.tickDistance ?? 2} onChange={(event) => handleElementPropertiesChange({ tickDistance: Number(event.target.value) })} /></label>
              <label className="col-span-2 text-xs font-bold text-carbon">Subdivisiones menores<input type="number" min="0" max="10" step="1" aria-label="Número de subdivisiones menores" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.minorTickCount ?? 4} onChange={(event) => handleElementPropertiesChange({ minorTickCount: Number(event.target.value) })} /></label>
              <div className="col-span-2"><DiagramExpressionField model={model} label="Separación dinámica" ariaLabel="Expresión de separación entre marcas" placeholder="Vacío = usar separación fija" value={selectedElement.properties?.tickDistanceExpression ?? ''} onChange={value => handleElementPropertiesChange({ tickDistanceExpression: value || undefined })} optional /></div>
            </div>
          )}

          {(['grid', 'areaDecomposition'].includes(selectedElement.kind)) && (
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs font-bold text-carbon">Filas<input type="number" min="1" max="100" aria-label="Filas" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.rows ?? 4} onChange={(event) => handleElementPropertiesChange({ rows: Number(event.target.value) })} /></label>
              <label className="text-xs font-bold text-carbon">Columnas<input type="number" min="1" max="100" aria-label="Columnas" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.columns ?? 4} onChange={(event) => handleElementPropertiesChange({ columns: Number(event.target.value) })} /></label>
            </div>
          )}

          <DiagramElementAppearanceEditor element={selectedElement} onElementChange={handleElementChange} onStyleChange={handleElementStyleChange} />
          <DiagramElementBehaviorEditor model={model} element={selectedElement} onElementChange={handleElementChange} onPropertiesChange={handleElementPropertiesChange} />
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

          <DiagramExpressionField model={model} label="Expresión del máximo dinámico" ariaLabel="Expresión del máximo dinámico del slider" value={selectedSlider.maxExpression ?? ''} onChange={value => handleSliderChange({ maxExpression: value || undefined })} placeholder="Vacío = usar máximo fijo" optional help="El máximo fijo se conserva como respaldo si la expresión todavía no puede evaluarse." />

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
