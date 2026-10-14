import { isControlObject, isPositionedPoint, objectKind, type ControlObject, type DiagramObject } from '@/diagrams';
import type { ElementKind, VisualDiagramModel, VisualElement, VisualPoint } from '../types';

/**
 * Vistas del editor sobre `objects`: puntos con posición propia (inspector de
 * punto), controles (inspector de control) y el resto de objetos (inspector de
 * elemento, incluidos los puntos construidos).
 */
export function modelPoints(model: Pick<VisualDiagramModel, 'objects'>): VisualPoint[] {
  return model.objects.filter(isPositionedPoint);
}

export function modelSliders(model: Pick<VisualDiagramModel, 'objects'>): ControlObject[] {
  return model.objects.filter(isControlObject);
}

export function isModelElement(object: DiagramObject | undefined): object is VisualElement {
  return Boolean(object) && !isPositionedPoint(object) && !isControlObject(object);
}

export function modelElements(model: Pick<VisualDiagramModel, 'objects'>): VisualElement[] {
  return model.objects.filter(isModelElement);
}

export function findModelObject(model: Pick<VisualDiagramModel, 'objects'>, id: string | undefined): DiagramObject | undefined {
  return id === undefined ? undefined : model.objects.find(object => object.id === id);
}

/** Clase de construcción de un objeto del inspector de elementos (nunca `point` ni `control`). */
export function elementKind(element: VisualElement): ElementKind {
  return objectKind(element) as ElementKind;
}
