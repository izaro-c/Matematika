import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '@/app/providers/MathStoreContext';

function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}

export const DosRectasUnPunto = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-5, 5, 5, -5],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    const C_LINE = getCSSVar('--theme-carbon');
    const C_POINT = getCSSVar('--theme-terracota');

    const A = board.create('point', [-3, 2],   { name: 'A', size: 4, fillColor: C_LINE, strokeColor: C_LINE, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 });
    const B = board.create('point', [3, -1],   { name: 'B', size: 4, fillColor: C_LINE, strokeColor: C_LINE, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 });
    const C = board.create('point', [-2, -2],  { name: 'C', size: 4, fillColor: C_LINE, strokeColor: C_LINE, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 });
    const D = board.create('point', [4, 2],    { name: 'D', size: 4, fillColor: C_LINE, strokeColor: C_LINE, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 });

    const line1 = board.create('line', [A, B], { strokeColor: C_LINE, strokeWidth: 2 });
    const line2 = board.create('line', [C, D], { strokeColor: C_LINE, strokeWidth: 2 });

    const P = board.create('intersection', [line1, line2, 0], { name: 'P', size: 6, fillColor: C_POINT, strokeColor: C_POINT });

    const infoText = board.create('text', [-4.5, 4.5, () => {
      const dPA = P.Dist(A), dPB = P.Dist(B), dPC = P.Dist(C), dPD = P.Dist(D);
      const onAB = Math.abs(dPA + dPB - A.Dist(B)) < 0.1;
      const onCD = Math.abs(dPC + dPD - C.Dist(D)) < 0.1;
      return `<div style="font-family: var(--font-serif); color:${getCSSVar('--theme-carbon')}; line-height:1.3;">
        <strong style="font-size:1.1rem;">Intersecci&oacute;n &uacute;nica</strong><br/>
        <small>P ∈ l ∩ m</small><br/>
        <small>${onAB && onCD ? 'Un &uacute;nico punto com&uacute;n' : 'Rectas paralelas'}</small>
      </div>`;
    }], { fixed: true, anchorX: 'left', anchorY: 'top' });

    elementsRef.current = { A, B, C, D, P, line1, line2, infoText, board };

    board.update();
    (board.renderer as any).container.style.backgroundColor = getCSSVar('--theme-lienzo');

    const obs = new MutationObserver(() => {
      if (board) { (board.renderer as any).container.style.backgroundColor = getCSSVar('--theme-lienzo'); board.update(); }
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => { obs.disconnect(); JXG.JSXGraph.freeBoard(board); elementsRef.current = {}; };
  }, []);

  useEffect(() => {
    const els = elementsRef.current as Record<string, any>;
    if (!els.board) return;
    const { A, B, C, D, P, line1, line2, board } = els;

    const hRectas = isHighlight('rectas');
    const hPunto = isHighlight('punto');
    const showAll = !hRectas && !hPunto;

    const op = (t: any) => t || showAll ? 1 : 0.15;
    const C_ACC = getCSSVar('--theme-terracota');

    line1.setAttribute({ strokeOpacity: op(hRectas), strokeColor: hRectas ? C_ACC : getCSSVar('--theme-carbon'), strokeWidth: hRectas ? 3 : 2 });
    line2.setAttribute({ strokeOpacity: op(hRectas), strokeColor: hRectas ? C_ACC : getCSSVar('--theme-carbon'), strokeWidth: hRectas ? 3 : 2 });
    P.setAttribute({ strokeOpacity: op(hPunto), fillOpacity: op(hPunto), size: hPunto ? 8 : 6 });
    [A, B, C, D].forEach((p: any) => p.setAttribute({ strokeOpacity: op(showAll), fillOpacity: op(showAll) }));

    board.update();
  }, [highlight, isHighlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra los puntos: dos rectas se cortan en a lo sumo un punto
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
