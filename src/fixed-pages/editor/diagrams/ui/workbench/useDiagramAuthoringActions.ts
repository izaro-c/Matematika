import { useCallback, useState } from 'react';
import {
  refsNeededForTool,
  toolReferencesAreReady,
  addToolReference,
  KIND_LABELS,
  refsForKind,
  generatedElementId,
  elementColorForKind,
  insertObjects,
  modelPoints,
  modelSliders,
  modelElements,
  element,
  nextLayerItemOrder,
  point,
  nextPointId,
  supportElements,
  projectPointToSupport,
} from '../../model';
import type { CanvasTool, ElementKind, VisualDiagramModel, VisualSlider, VisualStep } from '../../model/types';
import { withPointPosition } from '@/diagrams';
import { makeVisibleInEveryStep } from './useWorkbenchActions';

const ANNOTATION_KINDS = new Set(['infoPanel', 'text', 'label', 'formula']);

function ensureLayer(
  model: VisualDiagramModel,
  layerId: string,
  label: string,
  order: number,
): VisualDiagramModel {
  if (model.layers.some(layer => layer.id === layerId)) return model;
  return {
    ...model,
    layers: [...model.layers, { id: layerId, label, order, visible: true, locked: false }],
  };
}

interface Options {
  model: VisualDiagramModel | null;
  activeTool: CanvasTool;
  handleVisualEdit: (model: VisualDiagramModel, command: { label: string }) => void;
  selectMany: (ids: string[], primaryId?: string) => void;
  setCanvasTool: (tool: CanvasTool) => void;
  setActiveStep: (stepId: string) => void;
  setActiveStepIndex: (index: number | null) => void;
  showProperties: () => void;
  showSteps: () => void;
}

/** Herramientas que añaden objetos al diagrama: elementos con referencias, deslizadores, puntos deslizantes y pasos. */
export function useDiagramAuthoringActions({
  model,
  activeTool,
  handleVisualEdit,
  selectMany,
  setCanvasTool,
  setActiveStep,
  setActiveStepIndex,
  showProperties,
  showSteps,
}: Options) {
  const [pendingRefs, setPendingRefs] = useState<string[]>([]);

  const handleAddElementWithRefs = useCallback(
    (kind: ElementKind, explicitRefs: string[]) => {
      if (!model) return;
      const elementRefs = refsForKind(kind, explicitRefs);
      const newId = generatedElementId(kind, elementRefs, model.objects);
      const isAnnotation = ANNOTATION_KINDS.has(kind);
      const layerId = isAnnotation ? 'annotations' : 'geometry';

      const workingModel = isAnnotation
        ? ensureLayer(model, 'annotations', 'Anotaciones & Texto', 20)
        : model;

      const baseElement = element(
        newId,
        KIND_LABELS[kind] || kind,
        kind,
        elementRefs,
        elementColorForKind(kind),
        kind !== 'label',
        {
          text: kind === 'infoPanel'
            ? 'Explicación del teorema o propiedad matemática en KaTeX: $a^2 + b^2 = c^2$'
            : kind === 'text' || kind === 'label' || kind === 'formula' ? 'Texto explicativo $A$' : undefined,
        }
      );
      const configuredElement = baseElement.objectType === 'annotation' && baseElement.variant === 'panel'
        ? { ...baseElement, content: { ...baseElement.content, title: 'Panel Informativo' }, anchor: { type: 'viewport' as const, position: [0.08, 0.22] as [number, number] } }
        : baseElement;
      const nextElement = {
        ...configuredElement,
        layerId,
        order: nextLayerItemOrder(workingModel, layerId),
      };
      const nextModel = makeVisibleInEveryStep(insertObjects(workingModel, [nextElement]), newId);

      handleVisualEdit(nextModel, { label: `Añadir ${KIND_LABELS[kind] || kind}` });
      selectMany([newId]);
      showProperties();
    },
    [handleVisualEdit, model, selectMany, showProperties]
  );

  const handleSelectTool = useCallback(
    (tool: CanvasTool) => {
      if (tool !== 'select' && tool !== 'point' && refsNeededForTool(tool) === 0) {
        handleAddElementWithRefs(tool as ElementKind, []);
        setCanvasTool('select');
        setPendingRefs([]);
        return;
      }
      setCanvasTool(tool);
      setPendingRefs([]);
    },
    [handleAddElementWithRefs, setCanvasTool]
  );

  const handleChooseReferenceForTool = useCallback(
    (refId: string): boolean => {
      if (activeTool === 'select' || activeTool === 'point' || refsNeededForTool(activeTool) === 0) {
        return false;
      }
      const nextRefs = addToolReference(activeTool, pendingRefs, refId);
      const isOpenEnded = activeTool === 'polygon' || activeTool === 'areaIntersection';
      if (!isOpenEnded && nextRefs.every(Boolean) && toolReferencesAreReady(activeTool, nextRefs)) {
        handleAddElementWithRefs(activeTool as ElementKind, nextRefs);
        setPendingRefs([]);
        setCanvasTool('select');
      } else {
        setPendingRefs(nextRefs);
        selectMany([refId]);
      }
      return true;
    },
    [activeTool, handleAddElementWithRefs, pendingRefs, selectMany, setCanvasTool]
  );

  const handleCompleteTool = useCallback(() => {
    if (
      (activeTool === 'polygon' || activeTool === 'areaIntersection')
      && toolReferencesAreReady(activeTool, pendingRefs)
    ) {
      handleAddElementWithRefs(activeTool, pendingRefs);
      setPendingRefs([]);
      setCanvasTool('select');
    }
  }, [activeTool, handleAddElementWithRefs, pendingRefs, setCanvasTool]);

  const handleCancelTool = useCallback(() => {
    setCanvasTool('select');
    setPendingRefs([]);
  }, [setCanvasTool]);

  const handleAddSliderClick = useCallback(() => {
    if (!model) return;
    const newId = `slider${Date.now().toString(36).slice(-3)}`;
    const newSlider: VisualSlider = {
      id: newId,
      objectType: 'control',
      variant: 'slider',
      label: 'Parámetro k',
      position: [-4, -4],
      range: { min: -5, max: 5, step: 0.1 },
      value: 1,
      color: 'pavo',
      layerId: 'controls',
      order: nextLayerItemOrder(model, 'controls'),
      visible: true,
      locked: false,
      groupIds: [],
      target: true,
      selection: { selectable: true, role: 'annotation' },
    };
    handleVisualEdit(
      makeVisibleInEveryStep(insertObjects(model, [newSlider]), newId),
      { label: 'Añadir deslizador' },
    );
    selectMany([newId]);
    showProperties();
  }, [handleVisualEdit, model, selectMany, showProperties]);

  const handleAddGliderPoint = useCallback(
    (supportId?: string) => {
      if (!model) return;
      const candidates = supportElements(model);
      const support = candidates.find(item => item.id === supportId) ?? candidates[0];
      if (!support) return;
      const id = nextPointId(model.objects);
      const nextPoint = {
        ...point(id, id.replace(/^p/, ''), 0, 0, false, 'ocre', 'glider', support.id),
        order: nextLayerItemOrder(model, 'geometry'),
      };
      const projected = projectPointToSupport(model, nextPoint, { x: 0, y: 0 });
      handleVisualEdit(
        makeVisibleInEveryStep(
          insertObjects(model, [withPointPosition(nextPoint, projected)]),
          id,
        ),
        { label: `Añadir punto sobre ${support.id}` },
      );
      selectMany([id]);
      showProperties();
      setCanvasTool('select');
    },
    [handleVisualEdit, model, selectMany, setCanvasTool, showProperties],
  );

  const handleAddStepClick = useCallback(() => {
    if (!model) return;
    const nextIdx = (model.steps || []).length + 1;
    const allObjectIds = [
      ...modelPoints(model).map(p => p.id),
      ...modelElements(model).map(e => e.id),
      ...modelSliders(model).map(s => s.id),
    ];
    const newStep: VisualStep = {
      id: `step${nextIdx}`,
      label: `Paso ${nextIdx}`,
      description: 'Descripción del nuevo paso de la demostración.',
      visibleTargets: allObjectIds,
    };
    handleVisualEdit({ ...model, steps: [...(model.steps || []), newStep] }, { label: `Añadir paso ${nextIdx}` });
    showSteps();
    setActiveStepIndex(nextIdx - 1);
    setActiveStep(newStep.id);
  }, [handleVisualEdit, model, setActiveStep, setActiveStepIndex, showSteps]);

  return {
    pendingRefs,
    setPendingRefs,
    handleSelectTool,
    handleChooseReferenceForTool,
    handleCompleteTool,
    handleCancelTool,
    handleAddSliderClick,
    handleAddGliderPoint,
    handleAddStepClick,
  };
}
