import React, { useState } from 'react';
import type { VisualDiagramModel, VisualPoint, VisualElement, VisualSlider, VisualStep, ColorToken, PointConstraint } from '../model/types';
import { COLOR_OPTIONS, KIND_LABELS, convertAngleKind, toolReferenceCandidatesForSlot, toolReferenceLabel } from '../model/commands';
import { cleanTargetId, renamePoint, renameElement, renameSlider } from '../model/commands';
import { removeDiagramElements, setPointAttractors, updatePoint, updateElement, updateSlider, updateStep } from '../model/commands';
import { diagramTemplateExpressions, extractMathExpressionIdentifiers, legacyElementCapabilities, legacyReferenceCandidates } from '@/shared/diagrams/public';
import { DiagramConstraintEditor } from './DiagramConstraintEditor';
import { constraintPresentation } from '../model/constraintOptions';
import { DiagramSceneControls } from './DiagramSceneControls';
import { SegmentLengthConstraintEditor } from './SegmentLengthConstraintEditor';
import { SegmentMarksEditor } from './SegmentMarksEditor';
import { AngleEqualityConstraintEditor } from './AngleEqualityConstraintEditor';
import { DiagramExpressionField } from './DiagramExpressionField';
import { DiagramTemplateField } from './DiagramTemplateField';
import { DiagramElementAppearanceEditor } from './DiagramElementAppearanceEditor';
import { DiagramElementBehaviorEditor } from './DiagramElementBehaviorEditor';
import { DiagramTextRulesEditor } from './DiagramTextRulesEditor';
import { DiagramAnnotationPositionEditor } from './DiagramAnnotationPositionEditor';
import { DiagramInfoPanelContentEditor } from './DiagramInfoPanelContentEditor';
import { DiagramPointMovementAidsEditor } from './DiagramPointMovementAidsEditor';
import { elementInspectorCapabilities } from '../model/elementInspectorCapabilities';
import { DiagramNativeLabelEditor } from './DiagramNativeLabelEditor';

interface DiagramInspectorProps {
  model: VisualDiagramModel;
  selectedId: string;
  selectedIds?: readonly string[];
  onSelect: (id: string) => void;
  onModelEdit: (model: VisualDiagramModel) => void;
  onDeleteSelected: () => void;
  onAddElementLabel?: (elementId: string) => void;
  onCopySelection?: () => void;
}

function sceneItemLabel(model: VisualDiagramModel, id: string): string {
  const item = [...model.points, ...model.elements, ...model.sliders].find(candidate => candidate.id === id);
  return item ? `${item.label} (${item.id})` : id;
}

function elementReferenceCandidates(model: VisualDiagramModel, element: VisualElement, index: number) {
  return toolReferenceCandidatesForSlot(model, element.kind, index).filter(candidate => candidate.id !== element.id);
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

function elementExpressionSources(element: VisualElement): Array<string | undefined> {
  const properties = element.properties;
  return [
    properties?.expression,
    properties?.xExpression,
    properties?.yExpression,
    properties?.tickDistanceExpression,
    properties?.visibleWhen,
    ...diagramTemplateExpressions(element.text ?? '', properties?.expression).map(entry => entry.expression),
    ...(properties?.textRules?.flatMap(rule => [
      rule.when,
      ...diagramTemplateExpressions(rule.text, properties.expression).map(entry => entry.expression),
    ]) ?? []),
    ...(properties?.infoPanelBlocks?.flatMap(block => [
      block.expression,
      ...diagramTemplateExpressions(block.text, block.expression).map(entry => entry.expression),
      ...(block.rules?.flatMap(rule => [
        rule.when,
        rule.expression,
        ...diagramTemplateExpressions(rule.text, rule.expression ?? block.expression).map(entry => entry.expression),
      ]) ?? []),
    ]) ?? []),
  ];
}



function curveParameter(element: VisualElement): string {
  return element.properties?.parameter ?? (element.kind === 'functionCurve' ? 'x' : 't');
}

function labelCanMoveAlongPath(kind: VisualElement['kind']): boolean {
  return ['segment', 'line', 'ray', 'baseExtension', 'perpendicular', 'parallel', 'angleBisector', 'dimensionLine'].includes(kind);
}

interface InspectorSelectionSummary {
  type: string;
  label: string;
  id: string;
}

function inspectorSelectionSummary(
  point: VisualPoint | undefined,
  element: VisualElement | undefined,
  slider: VisualSlider | undefined,
  step: VisualStep | undefined,
): InspectorSelectionSummary | null {
  if (point) return { type: 'Punto', label: point.label, id: point.id };
  if (element) {
    const family = legacyElementCapabilities(element.kind).has('point') ? 'Punto construido' : KIND_LABELS[element.kind];
    return { type: family, label: element.label, id: element.id };
  }
  if (slider) return { type: 'Control', label: slider.label, id: slider.id };
  if (step) return { type: 'Paso', label: step.label, id: step.id };
  return null;
}

export const DiagramInspector: React.FC<DiagramInspectorProps> = ({
  model,
  selectedId,
  selectedIds = [],
  onSelect,
  onModelEdit,
  onDeleteSelected,
  onAddElementLabel,
  onCopySelection,
}) => {
  const [inspectorSection, setInspectorSection] = useState<'general' | 'geometry' | 'appearance' | 'advanced'>('general');
  const selectedPoint = model.points.find(item => item.id === selectedId);
  const selectedElement = model.elements.find(item => item.id === selectedId);
  const selectedSlider = model.sliders.find(item => item.id === selectedId);
  const selectedStep = model.steps.find(item => item.id === selectedId);
  const activeInspectorSection = selectedStep ? 'general' : inspectorSection;
  const selectedSceneItem = selectedPoint || selectedElement || selectedSlider;
  const relatedConstraints = selectedSceneItem
    ? (model.constraints ?? []).filter(constraint => constraint.refs.includes(selectedSceneItem.id))
    : [];
  const relatedDependencies = selectedSceneItem
    ? (model.dependencies ?? []).filter(dependency => dependency.sourceId === selectedSceneItem.id || dependency.targetId === selectedSceneItem.id)
    : [];
  const selectedElementCapabilities = selectedElement ? elementInspectorCapabilities(selectedElement.kind) : undefined;
  const attachedLabel = selectedElement?.kind === 'label'
    ? undefined
    : model.elements.find(item => item.kind === 'label' && item.refs[0] === selectedElement?.id);

  const hasSelection = selectedPoint || selectedElement || selectedSlider || selectedStep;
  const selectionSummary = inspectorSelectionSummary(selectedPoint, selectedElement, selectedSlider, selectedStep);

  const handlePointChange = (update: Partial<VisualPoint>) => {
    if (!selectedPoint) return;
    const next = updatePoint(model, selectedPoint.id, update);
    const expressionChanged = 'xExpression' in update || 'yExpression' in update || 'visibleWhen' in update;
    if (!update.dependencies && !expressionChanged) {
      onModelEdit(next);
      return;
    }
    const nextPoint = next.points.find(point => point.id === selectedPoint.id) ?? selectedPoint;
    const sources = update.dependencies ?? expressionDependencySources(model, [nextPoint.xExpression, nextPoint.yExpression, nextPoint.visibleWhen]);
    onModelEdit({
      ...next,
      dependencies: [
        ...(model.dependencies || []).filter(dependency => dependency.targetId !== selectedPoint.id || dependency.relation !== 'expression'),
        ...sources.map(sourceId => ({ sourceId, targetId: selectedPoint.id, relation: 'expression' as const })),
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
    if (!update.refs && !('text' in update)) {
      onModelEdit(next);
      return;
    }
    const nextElement = next.elements.find(element => element.id === selectedElement.id) ?? selectedElement;
    const expressionSources = expressionDependencySources(model, elementExpressionSources(nextElement));
    onModelEdit({
      ...next,
      dependencies: [
        ...(model.dependencies || []).filter(dependency => dependency.targetId !== selectedElement.id || (dependency.relation !== 'construction' && dependency.relation !== 'expression')),
        ...nextElement.refs.map(sourceId => ({ sourceId, targetId: selectedElement.id, relation: 'construction' as const })),
        ...expressionSources.map(sourceId => ({ sourceId, targetId: selectedElement.id, relation: 'expression' as const })),
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
    const nextElement = next.elements.find(element => element.id === selectedElement.id) ?? { ...selectedElement, properties };
    const sources = expressionDependencySources(model, elementExpressionSources(nextElement));
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
    if (!('maxExpression' in update) && !('visibleWhen' in update)) {
      onModelEdit(next);
      return;
    }
    const sources = new Set<string>();
    for (const expression of [next.sliders.find(slider => slider.id === selectedSlider.id)?.maxExpression, next.sliders.find(slider => slider.id === selectedSlider.id)?.visibleWhen]) {
      if (!expression) continue;
      try {
        extractMathExpressionIdentifiers(expression).forEach(identifier => {
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
    <section className="diagram-inspector h-full overflow-y-auto bg-lienzo px-3 pb-4 [&_fieldset]:rounded-none [&_fieldset]:border-x-0 [&_fieldset]:border-b-0 [&_fieldset]:bg-transparent [&_details]:rounded-none [&_details]:border-x-0 [&_details]:border-b-0">
      <header className="sticky top-0 z-20 mb-3 border-b border-carbon/10 bg-lienzo py-3">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Propiedades</h4>
        {selectionSummary && <div className="mt-1 min-w-0">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-carbon">{selectionSummary.label}</p><p className="truncate text-[10px] text-carbon/50">{selectionSummary.type} · <code>{selectionSummary.id}</code>{selectedIds.length > 1 ? ` · ${selectedIds.length} seleccionados` : ''}</p></div>
            {selectedIds.length > 1 && <button type="button" className="min-h-9 rounded bg-carbon px-2 text-[10px] font-bold text-lienzo" onClick={onCopySelection}>Copiar {selectedIds.length}</button>}
          </div>
        </div>}
      </header>

      {hasSelection && <nav className="sticky top-[4.6rem] z-10 mb-3 flex gap-1 overflow-x-auto border-b border-carbon/10 bg-lienzo pb-2" aria-label="Secciones de propiedades">
        {([
          ['general', 'Esencial'],
          ...(!selectedStep ? [['geometry', 'Geometría']] : []),
          ...(!selectedStep ? [['appearance', 'Estilo']] : []),
          ...(!selectedStep ? [['advanced', 'Interacción']] : []),
        ] as Array<[typeof inspectorSection, string]>).map(([id, label]) => <button key={id} type="button" aria-current={activeInspectorSection === id ? 'page' : undefined} onClick={() => setInspectorSection(id)} className={`min-h-9 whitespace-nowrap rounded px-2 text-[10px] font-bold ${activeInspectorSection === id ? 'bg-carbon text-lienzo' : 'text-carbon/55 hover:bg-carbon/5'}`}>{label}</button>)}
      </nav>}
      
      {!hasSelection && (
        <div className="rounded border border-dashed border-carbon/20 bg-carbon/[0.02] p-4 text-center">
          <p className="text-sm font-bold text-carbon/70">Seleccione un objeto</p>
          <p className="mt-1 text-xs leading-relaxed text-carbon/50">Puede hacerlo en el lienzo o en el árbol de escena. Aquí aparecerán únicamente las propiedades compatibles con su tipo.</p>
        </div>
      )}

      {selectedPoint && (
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
      )}

      {selectedElement && (
        <div className="space-y-3">
          {activeInspectorSection === 'general' && <>
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
          </>}

          {activeInspectorSection === 'geometry' && <>
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
                      {elementReferenceCandidates(model, selectedElement, index).map(item => (
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
          </>}

          {activeInspectorSection === 'general' && <>
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
            <section className="space-y-3" aria-label="Contenido y valor de medida">
              <div><h5 className="text-xs font-bold text-carbon">Contenido de la medida</h5><p className="mt-1 text-[10px] text-carbon/45">Escriba el texto e inserte uno o varios cálculos donde deban aparecer.</p></div>

              <DiagramTemplateField
                model={model}
                label="Texto visible"
                value={selectedElement.text || ''}
                onChange={text => handleElementChange({ text })}
                placeholder={`${selectedElement.label}: {= ${selectedElement.id}.length | precision: 2}`}
              />

              {selectedElement.kind === 'dimensionLine' && (
                <label className="block text-xs font-bold text-carbon">
                  Separación de la cota
                  <input type="number" min="-10" max="10" step="0.05" aria-label="Separación de la línea de cota" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.offset ?? 0.35} onChange={event => handleElementPropertiesChange({ offset: Number(event.target.value) })} />
                  <span className="mt-1 block text-[10px] font-normal leading-relaxed text-carbon/45">Desplaza la línea de cota respecto al segmento medido.</span>
                </label>
              )}

              <details className="border-t border-carbon/10 pt-2" open={Boolean(selectedElement.properties?.expression)}>
                <summary className="min-h-9 cursor-pointer py-2 text-[10px] font-bold text-carbon/55">Compatibilidad con {'{value}'}</summary>
                <div className="space-y-2 pb-2">
                  <p className="text-[9px] leading-relaxed text-carbon/45">Solo es necesario para textos antiguos que todavía usan <code>{'{value}'}</code>. Los cálculos insertados llevan su propio formato.</p>
                  <DiagramExpressionField compact model={model} label="Cálculo heredado" ariaLabel="Fórmula de medida" value={selectedElement.properties?.expression || ''} onChange={value => handleElementPropertiesChange({ expression: value || undefined })} placeholder="Vacío = medir distancia automáticamente" optional />
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
                </div>
              </details>
              <DiagramTextRulesEditor model={model} element={selectedElement} onChange={textRules => handleElementPropertiesChange({ textRules })} />
            </section>
          )}

          {selectedElement.kind === 'formula' && (
            <section className="space-y-3" aria-label="Fórmula KaTeX y valor">
              <div><h5 className="text-xs font-bold text-carbon">Fórmula visible</h5><p className="mt-1 text-[10px] text-carbon/45">Escriba primero lo que se verá; el valor dinámico es opcional.</p></div>

              <DiagramTemplateField formula model={model} label="Fórmula visible (KaTeX)" value={selectedElement.text || ''} onChange={value => handleElementChange({ text: value })} placeholder="Ej. a^2 + b^2 = c^2" />

              <details className="border-t border-carbon/10 pt-2" open={Boolean(selectedElement.properties?.expression)}>
                <summary className="min-h-9 cursor-pointer py-2 text-[10px] font-bold text-carbon/55">Compatibilidad con {'{value}'}</summary>
                <div className="space-y-2 pb-2">
                <DiagramExpressionField compact model={model} label="Cálculo heredado" value={selectedElement.properties?.expression || ''} onChange={value => handleElementPropertiesChange({ expression: value || undefined })} optional />
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
                </div>
              </details>
              <DiagramTextRulesEditor model={model} element={selectedElement} onChange={textRules => handleElementPropertiesChange({ textRules })} />
            </section>
          )}

          {selectedElement.kind === 'text' && (
            <section className="space-y-3" aria-label="Contenido de texto">
              <DiagramTemplateField richText model={model} label="Contenido" value={selectedElement.text || ''} onChange={text => handleElementChange({ text })} placeholder="Introduce el texto…" rows={3} />
              <DiagramTextRulesEditor model={model} element={selectedElement} onChange={textRules => handleElementPropertiesChange({ textRules })} />
            </section>
          )}

          {selectedElement.kind === 'label' && (
            <section className="space-y-3" aria-label="Contenido de la etiqueta">
              <DiagramTemplateField formula model={model} label="Texto visible" value={selectedElement.text || ''} onChange={text => handleElementChange({ text })} placeholder={selectedElement.label} />
              <DiagramTextRulesEditor model={model} element={selectedElement} onChange={textRules => handleElementPropertiesChange({ textRules })} />
            </section>
          )}
          </>}

          {activeInspectorSection === 'geometry' && <>
          {selectedElement.kind === 'label' && (
            <section className="space-y-3" aria-label="Posición junto al elemento">
              <h5 className="text-xs font-bold text-carbon">Posición junto al elemento</h5>
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
            </section>
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
          </>}

          {activeInspectorSection === 'appearance' && <DiagramElementAppearanceEditor element={selectedElement} onElementChange={handleElementChange} onStyleChange={handleElementStyleChange} />}
          {activeInspectorSection === 'advanced' && <DiagramElementBehaviorEditor model={model} element={selectedElement} onElementChange={handleElementChange} onPropertiesChange={handleElementPropertiesChange} />}
        </div>
      )}

      {selectedSlider && (
        <div className="space-y-3">
          {activeInspectorSection === 'general' && <>
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
          </>}

          {activeInspectorSection === 'geometry' && <>
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
          </>}

          {activeInspectorSection === 'advanced' && (
          <DiagramExpressionField
            model={model}
            label="Visible cuando"
            ariaLabel="Condición de visibilidad del slider"
            value={selectedSlider.visibleWhen ?? ''}
            onChange={value => handleSliderChange({ visibleWhen: value || undefined })}
            placeholder="Vacío = siempre visible"
            optional
            help="La condición se reevalúa mientras cambia la construcción. Un resultado cero oculta el control."
          />
          )}

          {activeInspectorSection === 'appearance' && (
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
          )}
        </div>
      )}

      {activeInspectorSection === 'advanced' && selectedSceneItem && (relatedConstraints.length > 0 || relatedDependencies.length > 0) ? (
        <details className="mt-4 border-t border-carbon/10 pt-3">
          <summary className="cursor-pointer list-none text-[10px] font-bold uppercase tracking-widest text-carbon/45 [&::-webkit-details-marker]:hidden">
            Enlaces de construcción <span className="float-right font-mono font-normal">{relatedConstraints.length + relatedDependencies.length} enlaces ▾</span>
          </summary>
          <div className="mt-2 border-l-2 border-carbon/10 pl-3">
            <p className="text-[10px] leading-relaxed text-carbon/55">Solo se muestran las relaciones que afectan al objeto seleccionado. Las dependencias se actualizan al cambiar sus referencias.</p>
            {relatedConstraints.length > 0 && (
              <ul className="mt-2 space-y-1.5">
                {relatedConstraints.map(constraint => (
                  <li key={constraint.id} className="py-1 text-[10px] text-carbon/65">
                    <strong>{constraintPresentation(constraint.kind).label}</strong>: {constraint.refs.map(ref => sceneItemLabel(model, ref)).join(' → ')}
                    {!constraint.enabled && <span className="ml-1 text-carbon/40">(pausada)</span>}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-[9px] text-carbon/40">{relatedDependencies.length} dependencias automáticas relacionadas.</p>
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

      {activeInspectorSection === 'advanced' && selectedSceneItem && <DiagramSceneControls model={model} point={selectedPoint} element={selectedElement} slider={selectedSlider} onModelEdit={onModelEdit} />}

      {hasSelection && (
        <button
          onClick={onDeleteSelected}
          className="mt-6 min-h-11 w-full rounded border border-granada/25 bg-granada/10 px-3 text-xs font-bold text-granada transition-all hover:bg-granada hover:text-lienzo"
        >
          Eliminar elemento
        </button>
      )}
    </section>
  );
};
export default DiagramInspector;
