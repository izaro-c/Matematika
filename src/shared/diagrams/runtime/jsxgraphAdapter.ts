/**
 * Superficie mínima de JSXGraph consumida por el runtime de diagramas.
 * Mantiene la API dinámica de la librería confinada a un único adaptador.
 */
export interface JxgElementAdapter {
  X?: () => number;
  Y?: () => number;
  Value?: () => number;
  Dist?: (other: JxgElementAdapter) => number;
  point1?: JxgElementAdapter;
  point2?: JxgElementAdapter;
  borders?: JxgElementAdapter[];
  label?: JxgElementAdapter;
  rendNode?: HTMLElement;
  on?: (event: string, listener: (event?: Event) => void) => void;
  setAttribute?: (attributes: Record<string, unknown>) => void;
  highlight?: () => void;
  noHighlight?: () => void;
  popSlideObject?: () => void;
  slideObject?: JxgElementAdapter;
  visProp?: { attractors?: JxgElementAdapter[] };
}

export type JxgElementMap = Record<string, JxgElementAdapter | undefined>;

export function hasCoordinates(element: JxgElementAdapter | undefined): element is JxgElementAdapter & Required<Pick<JxgElementAdapter, 'X' | 'Y'>> {
  return typeof element?.X === 'function' && typeof element.Y === 'function';
}

export function existingElements(elements: JxgElementMap): JxgElementAdapter[] {
  return Object.values(elements).filter((element): element is JxgElementAdapter => Boolean(element));
}
