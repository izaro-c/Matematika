import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '@/app/providers/MathStoreContext';

function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}

export const SumaAngulos = () => {
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

    const C_PRIM = getCSSVar('--theme-carbon');
    const C_ANG  = getCSSVar('--theme-salvia');
    const C_POL  = getCSSVar('--theme-pavo');

    const SNAP = 0.5;
    const A = board.create('point', [-2.5, -2], { name: 'A', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP });
    const B = board.create('point', [3, -1.5],  { name: 'B', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP });
    const C = board.create('point', [0, 3],     { name: 'C', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP });

    const poly = board.create('polygon', [A, B, C], {
      fillColor: C_POL, fillOpacity: 0.08,
      borders: { strokeWidth: 2.5, strokeColor: C_PRIM },
      vertices: { visible: false }
    });

    const angleA = board.create('angle', [B, A, C], { name: '&alpha;', radius: 0.9, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.3, type: 'sector' }) as any;
    const angleB = board.create('angle', [C, B, A], { name: '&beta;',  radius: 0.9, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.3, type: 'sector' }) as any;
    const angleC = board.create('angle', [A, C, B], { name: '&gamma;', radius: 0.9, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.3, type: 'sector' }) as any;

    const infoText = board.create('text', [
      -4.5, 4.5,
      () => {
        const vA = angleA.Value(), vB = angleB.Value(), vC = angleC.Value();
        const sum = vA + vB + vC;
        const sumDeg = Math.round(sum * 180 / Math.PI);
        return `<div style="font-family: var(--font-serif); color: ${getCSSVar('--theme-carbon')}; line-height:1.5;">
          <strong style="font-size: 1.15rem;">Suma de &aacute;ngulos</strong><br/>
          &alpha; + &beta; + &gamma; = ${sumDeg}&deg;<br/>
          <strong style="color:${sumDeg === 180 ? getCSSVar('--theme-musgo') : getCSSVar('--theme-granada')};">
            ${sumDeg === 180 ? '\u2261 180\u00b0' : '\u2260 180\u00b0'}
          </strong>
          <br/><small>(${Math.round(vA*180/Math.PI)}&deg; + ${Math.round(vB*180/Math.PI)}&deg; + ${Math.round(vC*180/Math.PI)}&deg;)</small>
        </div>`;
      }
    ], { fixed: true, anchorX: 'left', anchorY: 'top' });

    board.update();

    const midAB = board.create('midpoint', [A, B], { visible: false });
    const midBC = board.create('midpoint', [B, C], { visible: false });
    const midCA = board.create('midpoint', [C, A], { visible: false });
    const thalesAB = board.create('circle', [midAB, A], { visible: false });
    const thalesBC = board.create('circle', [midBC, B], { visible: false });
    const thalesCA = board.create('circle', [midCA, C], { visible: false });
    C.setAttribute({ attractors: [thalesAB], attractorDistance: 0.3, snatchDistance: 0.5 });
    A.setAttribute({ attractors: [thalesBC], attractorDistance: 0.3, snatchDistance: 0.5 });
    B.setAttribute({ attractors: [thalesCA], attractorDistance: 0.3, snatchDistance: 0.5 });

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

    elementsRef.current = { A, B, C, poly, angleA, angleB, angleC, infoText, board };

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
    const { A, B, C, poly, angleA, angleB, angleC, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    const hAngulos = isHighlight('angulos');
    const hTri = isHighlight('triangulo');
    const showAll = !hAngulos && !hTri;

    const dim = (active: boolean) => active || showAll ? 1 : 0.2;

    [angleA, angleB, angleC].forEach((a: any) => a.setAttribute({
      fillOpacity: hAngulos ? 0.5 : 0.3,
      strokeOpacity: dim(hAngulos)
    }));

    [A, B, C].forEach((p: any) => p.setAttribute({ strokeOpacity: dim(showAll), fillOpacity: dim(showAll) }));
    poly.setAttribute({ fillOpacity: hTri ? 0.2 : 0.08 });
    ((poly as any).borders as any[]).forEach((b: any) => b.setAttribute({ strokeOpacity: dim(showAll) }));

    board.update();
  }, [highlight, isHighlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra los v&eacute;rtices: la suma siempre es 180&deg;
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
