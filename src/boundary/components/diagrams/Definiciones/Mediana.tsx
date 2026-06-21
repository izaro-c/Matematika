import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '@/boundary/contexts/MathStoreContext';

function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}

export const Mediana = () => {
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

    const C_PRIM = getCSSVar('--theme-pavo');
    const C_MED  = getCSSVar('--theme-ocre');
    const C_BAR  = getCSSVar('--theme-terracota');
    const C_SIDE = getCSSVar('--theme-carbon');

    const SNAP = 0.5;
    const A = board.create('point', [-2.5, -2], { name: 'A', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP });
    const B = board.create('point', [3, -1.5],  { name: 'B', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP });
    const C = board.create('point', [0, 3],     { name: 'C', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP });

    const ladoAB = board.create('segment', [A, B], { strokeColor: C_SIDE, strokeWidth: 2 });
    const ladoBC = board.create('segment', [B, C], { strokeColor: C_SIDE, strokeWidth: 2 });
    const ladoCA = board.create('segment', [C, A], { strokeColor: C_SIDE, strokeWidth: 2 });

    const M_AB = board.create('midpoint', [A, B], { name: 'M_c', size: 4, fillColor: C_MED, strokeColor: C_MED });
    const M_BC = board.create('midpoint', [B, C], { name: 'M_a', size: 4, fillColor: C_MED, strokeColor: C_MED });
    const M_CA = board.create('midpoint', [C, A], { name: 'M_b', size: 4, fillColor: C_MED, strokeColor: C_MED });

    const medA = board.create('segment', [A, M_BC], { strokeColor: C_MED, strokeWidth: 2.5, dash: 2 });
    const medB = board.create('segment', [B, M_CA], { strokeColor: C_MED, strokeWidth: 2.5, dash: 2 });
    const medC = board.create('segment', [C, M_AB], { strokeColor: C_MED, strokeWidth: 2.5, dash: 2 });

    const G = board.create('intersection', [medA, medB, 0], { name: 'G', size: 6, fillColor: C_BAR, strokeColor: C_BAR });

    const mkTick = (p: any, q: any) => {
      const mA = board.create('point', [() => (p.X() + q.X()) / 2, () => (p.Y() + q.Y()) / 2], { visible: false });
      const t0 = board.create('point', [
        () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return mA.X() + dy/len * 0.25; },
        () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return mA.Y() - dx/len * 0.25; }
      ], { visible: false });
      const t1 = board.create('point', [
        () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return mA.X() - dy/len * 0.25; },
        () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return mA.Y() + dx/len * 0.25; }
      ], { visible: false });
      return board.create('segment', [t0, t1], { strokeColor: C_MED, strokeWidth: 2.2, visible: false }) as any;
    };

    const halfTicks = [
      mkTick(A, M_AB), mkTick(M_AB, B),
      mkTick(B, M_BC), mkTick(M_BC, C),
      mkTick(C, M_CA), mkTick(M_CA, A)
    ];

    const infoText = board.create('text', [
      -4.5, 4.5,
      () => {
        const dAG = A.Dist(G), dGMbc = G.Dist(M_BC);
        const dBG = B.Dist(G), dGMcA = G.Dist(M_CA);
        const dCG = C.Dist(G), dGMAb = G.Dist(M_AB);
        return `<div style="font-family: var(--font-serif); color: ${getCSSVar('--theme-carbon')}; line-height:1.3;">
          <strong style="font-size: 1.1rem; color:${getCSSVar('--theme-terracota')};">Baricentro G</strong><br/>
          <small>AG/GM<sub>a</sub> = ${(dAG / Math.max(dGMbc, 0.001)).toFixed(2)}</small><br/>
          <small>BG/GM<sub>b</sub> = ${(dBG / Math.max(dGMcA, 0.001)).toFixed(2)}</small><br/>
          <small>CG/GM<sub>c</sub> = ${(dCG / Math.max(dGMAb, 0.001)).toFixed(2)}</small>
        </div>`;
      }
    ], { fixed: true, anchorX: 'left', anchorY: 'top' });

    elementsRef.current = { A, B, C, ladoAB, ladoBC, ladoCA, M_AB, M_BC, M_CA, medA, medB, medC, G, halfTicks, infoText, board };

    board.update();
    (board.renderer as any).container.style.backgroundColor = getCSSVar('--theme-lienzo');

    const observer = new MutationObserver(() => {
      if (board) {
        (board.renderer as any).container.style.backgroundColor = getCSSVar('--theme-lienzo');
        board.update();
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
      JXG.JSXGraph.freeBoard(board);
      elementsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const { A, B, C, ladoAB, ladoBC, ladoCA, M_AB, M_BC, M_CA, medA, medB, medC, G, halfTicks, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    const hVertice = isHighlight('vertice');
    const hMedio = isHighlight('punto-medio');
    const hMediana = isHighlight('mediana');
    const hBaricentro = isHighlight('baricentro');
    const hLado = isHighlight('lado');
    const showAll = !hVertice && !hMedio && !hMediana && !hBaricentro && !hLado;

    [A, B, C].forEach((v: any) => v.setAttribute({
      strokeOpacity: hVertice || showAll ? 1 : 0.3,
      fillOpacity: hVertice || showAll ? 1 : 0.3,
      size: hVertice ? 7 : 5
    }));

    [ladoAB, ladoBC, ladoCA].forEach((l: any) => l.setAttribute({
      strokeOpacity: hLado || showAll ? 1 : 0.2
    }));

    [M_AB, M_BC, M_CA].forEach((m: any) => m.setAttribute({
      strokeOpacity: hMedio || showAll || hMediana ? 1 : 0.2,
      fillOpacity: hMedio || showAll || hMediana ? 1 : 0.2,
      size: hMedio ? 6 : 4
    }));

    halfTicks.forEach((t: any) => t.setAttribute({ visible: hMedio }));

    [medA, medB, medC].forEach((m: any) => m.setAttribute({
      strokeOpacity: hMediana || showAll || hBaricentro ? 1 : 0.15,
      strokeWidth: hMediana ? 3.5 : 2.5
    }));

    G.setAttribute({
      strokeOpacity: hBaricentro || showAll ? 1 : 0.2,
      fillOpacity: hBaricentro || showAll ? 1 : 0.2,
      size: hBaricentro ? 8 : 6
    });

    board.update();
  }, [highlight, isHighlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
