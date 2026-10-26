/**
 * JSXGraph reinserta el nodo de la línea en el DOM (`insertBefore` sobre sí mismo)
 * cada vez que cambia el color o el grosor de una flecha, para forzar el repintado
 * de los `<marker>` en Safari. Reinsertar un nodo anula su transición CSS, así que
 * el resaltado y el atenuado de las flechas saltaban de golpe. Las puntas usan
 * `context-stroke` y `markerUnits="strokeWidth"`, de modo que siguen al trazo sin
 * reinserción: aquí se reescriben ambos métodos sin ella.
 */
export function keepArrowTransitions(board: { renderer?: Record<string, unknown> } | null | undefined): void {
  const renderer = board?.renderer;
  if (!renderer || renderer.__matematikaArrowTransitions) return;
  renderer.__matematikaArrowTransitions = true;

  renderer._setArrowColor = function (
    this: { _setAttribute: (fn: () => void, old: unknown) => void },
    node: SVGElement | null,
    color: unknown,
    _opacity: unknown,
    el: { visPropOld: { fillcolor: unknown } },
    type: number,
  ) {
    if (!node || typeof color !== 'string') return;
    this._setAttribute(() => {
      if (type !== 7) {
        node.setAttributeNS(null, 'fill', 'context-stroke');
      } else {
        node.setAttributeNS(null, 'fill', 'none');
        node.setAttributeNS(null, 'stroke', 'context-stroke');
      }
    }, el.visPropOld.fillcolor);
  };

  renderer._setArrowWidth = function (node: SVGElement | null, width: number, _parentNode: unknown, size: number) {
    if (!node) return;
    const d = width * size;
    node.setAttributeNS(null, 'viewBox', `0 0 ${width * 10} ${width * 10}`);
    node.setAttributeNS(null, 'markerHeight', String(d));
    node.setAttributeNS(null, 'markerWidth', String(d));
    node.setAttributeNS(null, 'display', 'inherit');
  };
}
