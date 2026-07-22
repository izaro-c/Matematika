import type { VisualDiagramModel, VisualPoint, VisualElement, VisualSlider, VisualStep } from '../../model/types';
import { setPointAttractors, updatePoint, updateElement, updateSlider, updateStep } from '../../model';
import { diagramTemplateExpressions, extractMathExpressionIdentifiers } from '@/shared/diagrams/public';

export function expressionDependencySources(model: VisualDiagramModel, expressions: Array<string | undefined>): string[] {
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

interface UseInspectorHandlersParams {
  model: VisualDiagramModel;
  selectedPoint: VisualPoint | undefined;
  selectedElement: VisualElement | undefined;
  selectedSlider: VisualSlider | undefined;
  selectedStep: VisualStep | undefined;
  onModelEdit: (model: VisualDiagramModel) => void;
}

export function useInspectorHandlers({
  model,
  selectedPoint,
  selectedElement,
  selectedSlider,
  selectedStep,
  onModelEdit,
}: UseInspectorHandlersParams) {
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

  return {
    handlePointChange,
    handlePointAttractorsChange,
    handleElementChange,
    handleElementPropertiesChange,
    handlePointStyleChange,
    handleElementStyleChange,
    handleSliderChange,
    handleStepChange,
  };
}

export type InspectorHandlers = ReturnType<typeof useInspectorHandlers>;
