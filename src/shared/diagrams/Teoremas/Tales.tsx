import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '@/app/providers/MathStoreContext';

function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}

export const Tales = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});
  const updatingRef = useRef(false);

  const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-6, 6, 6, -5],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    const C_PRIM = getCSSVar('--theme-carbon');
    const C_ACC  = getCSSVar('--theme-terracota');
    const C_PAR  = getCSSVar('--theme-salvia');
    const C_POL  = getCSSVar('--theme-pavo');

    const SNAP = 0.5;
    const A = board.create('point', [-3, -2], { name: 'A', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP });
    const B = board.create('point', [3, -2],  { name: 'B', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP });
    const C = board.create('point', [4, 3],   { name: 'C', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP });

    const segAB = board.create('segment', [A, B], { strokeColor: C_PRIM, strokeWidth: 2 });
    const segBC = board.create('segment', [B, C], { strokeColor: C_PAR, strokeWidth: 2.5 });
    const segCA = board.create('segment', [C, A], { strokeColor: C_PRIM, strokeWidth: 2 });

    const poly = board.create('polygon', [A, B, C], {
      fillColor: C_POL, fillOpacity: 0.06,
      borders: { visible: false }, vertices: { visible: false }
    });

    const lineBC = board.create('line', [B, C], { visible: false });
    const lineAB = board.create('line', [A, B], { visible: false });
    const lineCA = board.create('line', [C, A], { visible: false });

    const D = board.create('glider', [-1, -2, segAB], { name: 'D', size: 4, fillColor: C_ACC, strokeColor: C_ACC, showInfobox: false });
    const parDE = board.create('parallel', [lineBC, D], { visible: false });
    const E = board.create('intersection', [parDE, lineCA, 0], { name: 'E', size: 4, fillColor: C_ACC, strokeColor: C_ACC, showInfobox: false });

    const parE_line = board.create('parallel', [lineBC, E], { visible: false });
    const Dcomp = board.create('intersection', [parE_line, lineAB, 0], { visible: false });

    D.on('drag', () => {
      if (updatingRef.current) return;
      updatingRef.current = true;
      D.setAttribute({ fillColor: C_ACC, strokeColor: C_ACC });
      updatingRef.current = false;
    });

    E.on('drag', () => {
      if (updatingRef.current) return;
      updatingRef.current = true;
      const nx = Dcomp.X(), ny = Dcomp.Y();
      D.moveTo([nx, ny], 0);
      updatingRef.current = false;
    });

    const segDE = board.create('segment', [D, E], { strokeColor: C_PAR, strokeWidth: 2.5, dash: 2 });
    const segAD = board.create('segment', [A, D], { strokeColor: C_ACC, strokeWidth: 2, dash: 1 });
    const segAE = board.create('segment', [A, E], { strokeColor: C_ACC, strokeWidth: 2, dash: 1 });

    const infoText = board.create('text', [
      -5.5, 5.5,
      () => {
        const dAD = A.Dist(D), dDB = D.Dist(B);
        const dAE = A.Dist(E), dEC = E.Dist(C);
        const ratio1 = dAD / Math.max(dDB, 0.001);
        const ratio2 = dAE / Math.max(dEC, 0.001);
        const ok = Math.abs(ratio1 - ratio2) < 0.01;
        return `<div style="font-family: var(--font-serif); color: ${getCSSVar('--theme-carbon')}; line-height:1.5;">
          <strong style="font-size: 1.1rem;">Teorema de Tales</strong><br/>
          <small>DE \u2225 BC</small><br/>
          <span>AD/DB = ${ratio1.toFixed(2)}</span><br/>
          <span>AE/EC = ${ratio2.toFixed(2)}</span><br/>
          <strong style="color:${ok ? getCSSVar('--theme-musgo') : getCSSVar('--theme-granada')};">
            ${ok ? 'AD/DB \u2261 AE/EC' : 'AD/DB \u2260 AE/EC'}
          </strong>
        </div>`;
      }
    ], { fixed: true, anchorX: 'left', anchorY: 'top' });

    const orientABC = () => (B.X() - A.X()) * (C.Y() - A.Y()) - (B.Y() - A.Y()) * (C.X() - A.X());
    const initialOrient = orientABC();
    const lastValid: Record<string, [number, number]> = { A: [A.X(), A.Y()], B: [B.X(), B.Y()], C: [C.X(), C.Y()] };
    [A, B, C].forEach((p: any, idx: number) => {
      const name = String.fromCharCode(65 + idx);
      p.on('drag', () => {
        const cur = orientABC();
        if (Math.abs(cur) < 0.01 || (initialOrient > 0.01 && cur < -0.01) || (initialOrient < -0.01 && cur > 0.01)) {
          p.moveTo([lastValid[name][0], lastValid[name][1]], 0);
        } else {
          lastValid[name][0] = p.X();
          lastValid[name][1] = p.Y();
        }
      });
    });

    elementsRef.current = { A, B, C, D, E, poly, segAB, segBC, segCA, segDE, segAD, segAE, infoText, board };

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
    const { A, B, C, D, E, poly, segAB, segBC, segCA, segDE, segAD, segAE, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    const hRecta = isHighlight('recta-de');
    const hTri = isHighlight('triangulo-abc');
    const hSegD = isHighlight('segmento-ad');
    const hSegE = isHighlight('segmento-ae');
    const hProp = isHighlight('proporcion');
    const showAll = !hRecta && !hTri && !hSegD && !hSegE && !hProp;

    const dim = (active: boolean) => active || showAll ? 1 : 0.15;

    segBC.setAttribute({ strokeOpacity: dim(hRecta), strokeWidth: hRecta ? 4 : 2.5 });
    segDE.setAttribute({ strokeOpacity: dim(hRecta), strokeWidth: hRecta ? 4 : 2.5 });

    segAB.setAttribute({ strokeOpacity: dim(showAll) });
    segCA.setAttribute({ strokeOpacity: dim(showAll) });
    segAD.setAttribute({ strokeOpacity: dim(hSegD || hProp || showAll), strokeWidth: hSegD ? 3 : 2 });
    segAE.setAttribute({ strokeOpacity: dim(hSegE || hProp || showAll), strokeWidth: hSegE ? 3 : 2 });

    [A, B, C].forEach((p: any) => p.setAttribute({ strokeOpacity: dim(showAll), fillOpacity: dim(showAll) }));
    [D, E].forEach((p: any) => p.setAttribute({
      strokeOpacity: dim(hRecta || hSegD || hSegE || hProp || showAll),
      fillOpacity: dim(hRecta || hSegD || hSegE || hProp || showAll),
      size: (hSegD || hSegE) ? 6 : 4,
      fillColor: hTri ? getCSSVar('--theme-terracota') : getCSSVar('--theme-carbon')
    }));
    poly.setAttribute({ fillOpacity: hTri ? 0.18 : 0.06 });

    board.update();
  }, [highlight, isHighlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra <span className="font-bold not-italic text-terracota">D</span> o <span className="font-bold not-italic text-terracota">E</span>
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
