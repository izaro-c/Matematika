import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '@/boundary/contexts/MathStoreContext';

function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}

export const DesigualdadTriangular = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});
  const hlRef = useRef<any>(null);

  const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  useEffect(() => { hlRef.current = highlight; }, [highlight]);

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
    const C_POL  = getCSSVar('--theme-pavo');

    const SNAP = 0.5;
    const pCfg = { size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP };

    const A = board.create('point', [-2.5, -2], { name: 'A', ...pCfg });
    const B = board.create('point', [2.5, -2],  { name: 'B', ...pCfg });
    const C = board.create('point', [0, 2.5],   { name: 'C', ...pCfg });

    const segAB = board.create('segment', [A, B], { strokeColor: C_PRIM, strokeWidth: 2.5 });
    const segBC = board.create('segment', [B, C], { strokeColor: C_PRIM, strokeWidth: 2.5 });
    const segCA = board.create('segment', [C, A], { strokeColor: C_PRIM, strokeWidth: 2.5 });

    const poly = board.create('polygon', [A, B, C], {
      fillColor: C_POL, fillOpacity: 0.06,
      borders: { visible: false }, vertices: { visible: false }
    });

    const mkLabel = (p: any, q: any, offX: number, offY: number) => board.create('text', [
      () => (p.X() + q.X()) / 2 + offX,
      () => (p.Y() + q.Y()) / 2 + offY,
      () => p.Dist(q).toFixed(1)
    ], { fixed: true, fontSize: 15, cssClass: 'font-serif font-bold', color: C_PRIM, anchorX: 'middle', anchorY: 'middle' });

    const labAB = mkLabel(A, B, 0, -0.55);
    const labBC = mkLabel(B, C, 0.55, 0);
    const labCA = mkLabel(C, A, -0.55, 0);

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

    const infoText = board.create('text', [
      -4.5, 4.5,
      () => {
        const c = A.Dist(B), a = B.Dist(C), b = C.Dist(A);
        const ok1 = a + b > c + 0.001, ok2 = a + c > b + 0.001, ok3 = b + c > a + 0.001;
        const allOk = ok1 && ok2 && ok3;
        const h = hlRef.current;
        const isDesig = h === 'desigualdad' || (Array.isArray(h) && (h as string[]).includes('desigualdad'));
        const col = isDesig ? getCSSVar('--theme-terracota') : getCSSVar('--theme-carbon');
        const fs = isDesig ? 14 : 13;
        return `<div style="font-family: var(--font-serif); color:${col}; font-size:${fs}px; line-height:1.5;">
          <strong style="font-size: 1.15rem;">Desigualdad Triangular</strong><br/>
          <span style="color:${ok1 ? getCSSVar('--theme-musgo') : getCSSVar('--theme-granada')};">a + b = ${(a+b).toFixed(1)} ${ok1 ? '>' : '\u2264'} c = ${c.toFixed(1)}</span><br/>
          <span style="color:${ok2 ? getCSSVar('--theme-musgo') : getCSSVar('--theme-granada')};">a + c = ${(a+c).toFixed(1)} ${ok2 ? '>' : '\u2264'} b = ${b.toFixed(1)}</span><br/>
          <span style="color:${ok3 ? getCSSVar('--theme-musgo') : getCSSVar('--theme-granada')};">b + c = ${(b+c).toFixed(1)} ${ok3 ? '>' : '\u2264'} a = ${a.toFixed(1)}</span><br/>
          <strong style="color:${allOk ? getCSSVar('--theme-musgo') : getCSSVar('--theme-granada')};">${allOk ? 'Tri\u00e1ngulo v\u00e1lido' : 'Tri\u00e1ngulo degenerado'}</strong>
        </div>`;
      }
    ], { fixed: true, anchorX: 'left', anchorY: 'top' });

    elementsRef.current = { A, B, C, poly, segAB, segBC, segCA, labAB, labBC, labCA, infoText, board };

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
    const els = elementsRef.current as Record<string, any>;
    if (!els.board) return;
    const { A, B, C, poly, segAB, segBC, segCA, labAB, labBC, labCA, board } = els;

    const C_PRIM = getCSSVar('--theme-carbon');
    const C_ACC  = getCSSVar('--theme-terracota');

    const hTri = isHighlight('triangulo');
    const hLados = isHighlight('lados');
    const hDesig = isHighlight('desigualdad');
    const hLadoA = isHighlight('lado-a');
    const hLadoB = isHighlight('lado-b');
    const hLadoC = isHighlight('lado-c');
    const anyH = hTri || hLados || hDesig || hLadoA || hLadoB || hLadoC;
    const showAll = !anyH;

    const vOp = anyH ? 0.12 : 1;

    const sideStyle = (seg: any, lab: any, active: boolean) => {
      seg.setAttribute({ strokeOpacity: showAll ? 1 : vOp, strokeColor: active ? C_ACC : C_PRIM, strokeWidth: active ? 4 : 2.5 });
      lab.setAttribute({ visible: showAll || active, color: active ? C_ACC : C_PRIM });
    };

    sideStyle(segAB, labAB, hLadoC || hLados || hDesig);
    sideStyle(segBC, labBC, hLadoA || hLados || hDesig);
    sideStyle(segCA, labCA, hLadoB || hLados || hDesig);

    [A, B, C].forEach((p: any) => p.setAttribute({
      strokeOpacity: showAll ? 1 : vOp, fillOpacity: showAll ? 1 : vOp,
      size: hTri ? 7 : 5, fillColor: hTri ? C_ACC : C_PRIM, strokeColor: hTri ? C_ACC : C_PRIM
    }));

    poly.setAttribute({ fillOpacity: hTri ? 0.18 : 0.06 });

    board.update();
  }, [highlight, isHighlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        La suma de dos lados siempre supera al tercero
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
