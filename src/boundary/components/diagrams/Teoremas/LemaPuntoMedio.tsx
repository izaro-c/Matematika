import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '@/boundary/contexts/MathStoreContext';

function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}

export const LemaPuntoMedio = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-6, 4, 6, -4],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    const C_PRIM = getCSSVar('--theme-carbon');
    const C_MED  = getCSSVar('--theme-terracota');

    const SNAP = 0.5;
    const A = board.create('point', [-4, 0], { name: 'A', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP });
    const B = board.create('point', [4, 0],  { name: 'B', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP });

    const segmento = board.create('segment', [A, B], { strokeColor: C_PRIM, strokeWidth: 2.5 });
    const M = board.create('midpoint', [A, B], { name: 'M', size: 6, fillColor: C_MED, strokeColor: C_MED });

    const mkTick = (p: any, q: any) => {
      const mA = board.create('point', [() => (p.X()+q.X())/2, () => (p.Y()+q.Y())/2], { visible: false });
      const dy = () => { const dx = q.X()-p.X(), dyy = q.Y()-p.Y(); const len = Math.hypot(dx,dyy)||1; return dyy/len; };
      const dx = () => { const dxx = q.X()-p.X(), dyy = q.Y()-p.Y(); const len = Math.hypot(dxx,dyy)||1; return dxx/len; };
      const t0 = board.create('point', [() => mA.X()+dy()*.3, () => mA.Y()-dx()*.3], { visible: false });
      const t1 = board.create('point', [() => mA.X()-dy()*.3, () => mA.Y()+dx()*.3], { visible: false });
      return board.create('segment', [t0, t1], { strokeColor: C_MED, strokeWidth: 2.2, visible: true }) as any;
    };

    const congAM = mkTick(A, M);
    const congMB = mkTick(M, B);

    elementsRef.current = { A, B, M, segmento, congAM, congMB, board };

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
    const { A, B, M, segmento, congAM, congMB, board } = els;

    const hSeg = isHighlight('segmento');
    const hMedio = isHighlight('punto-medio');
    const hCong = isHighlight('congruencia');
    const showAll = !hSeg && !hMedio && !hCong;

    const op = (t: any) => t || showAll ? 1 : 0.15;
    const C_ACC = getCSSVar('--theme-terracota');
    const C_PRIM = getCSSVar('--theme-carbon');

    segmento.setAttribute({ strokeOpacity: op(hSeg), strokeColor: hSeg ? C_ACC : C_PRIM, strokeWidth: hSeg ? 4 : 2.5 });
    M.setAttribute({ strokeOpacity: op(hMedio), fillOpacity: op(hMedio), size: hMedio ? 8 : 6, fillColor: C_ACC, strokeColor: C_ACC });
    [congAM, congMB].forEach((t: any) => t.setAttribute({ visible: true, strokeOpacity: op(hCong), strokeColor: C_ACC }));
    [A, B].forEach((p: any) => p.setAttribute({ strokeOpacity: op(showAll), fillOpacity: op(showAll) }));

    board.update();
  }, [highlight, isHighlight]);

  return (
    <div className="w-full h-full min-h-[250px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
