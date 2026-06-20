import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';

function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}

export const Pitagoras = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-8, 8, 8, -8],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    const C_PRIM  = getCSSVar('--theme-carbon');
    const C_SQ_A  = getCSSVar('--theme-salvia');
    const C_SQ_B  = getCSSVar('--theme-terracota');
    const C_SQ_C  = getCSSVar('--theme-ocre');
    const C_RIGHT = getCSSVar('--theme-pavo');

    const C = board.create('point', [0, 0], { name: 'C', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, fixed: true });

    const axisY = board.create('line', [C, board.create('point', [0, 1], { visible: false })], { visible: false });
    const axisX = board.create('line', [C, board.create('point', [1, 0], { visible: false })], { visible: false });

    const A = board.create('glider', [0, 4, axisY], { name: 'A', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 });
    const B = board.create('glider', [3, 0, axisX], { name: 'B', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 });

    const segBC = board.create('segment', [B, C], { strokeColor: C_PRIM, strokeWidth: 2 });
    const segCA = board.create('segment', [C, A], { strokeColor: C_PRIM, strokeWidth: 2 });
    const segAB = board.create('segment', [A, B], { strokeColor: C_PRIM, strokeWidth: 2.5 });

    const poly = board.create('polygon', [A, B, C], {
      fillColor: C_PRIM, fillOpacity: 0.06,
      borders: { visible: false }, vertices: { visible: false }
    });

    const label = (p: any, q: any, text: string, color: string) => {
      const mx = () => (p.X() + q.X()) / 2;
      const my = () => (p.Y() + q.Y()) / 2;
      const dx = () => q.X() - p.X();
      const dy = () => q.Y() - p.Y();
      const nl = () => Math.hypot(dx(), dy()) || 1;
      const off = 0.5;
      return board.create('text', [
        () => mx() - dy() / nl() * off,
        () => my() + dx() / nl() * off,
        text
      ], { fixed: true, fontSize: 18, cssClass: 'font-serif font-bold', anchorX: 'middle', anchorY: 'middle', color });
    };

    const labA = label(B, C, 'a', C_SQ_A);
    const labB = label(C, A, 'b', C_SQ_B);
    const labC = label(A, B, 'c', C_SQ_C);

    const mkSqPts = (p1: any, p2: any, opp: any) => {
      const lenAB = () => p1.Dist(p2);
      const dx = () => p2.X() - p1.X();
      const dy = () => p2.Y() - p1.Y();
      const ndx = () => -dy() / Math.max(lenAB(), 0.001);
      const ndy = () => dx() / Math.max(lenAB(), 0.001);
      const mx = () => (p1.X() + p2.X()) / 2;
      const my = () => (p1.Y() + p2.Y()) / 2;
      const sign = () => ((opp.X() - mx()) * ndx() + (opp.Y() - my()) * ndy() > 0 ? -1 : 1);
      const p3 = board.create('point', [
        () => p2.X() + ndx() * lenAB() * sign(),
        () => p2.Y() + ndy() * lenAB() * sign()
      ], { visible: false });
      const p4 = board.create('point', [
        () => p1.X() + ndx() * lenAB() * sign(),
        () => p1.Y() + ndy() * lenAB() * sign()
      ], { visible: false });
      return [p1, p2, p3, p4];
    };

    const sqBC = board.create('polygon', mkSqPts(B, C, A), {
      fillColor: C_SQ_A, fillOpacity: 0.15,
      borders: { strokeColor: C_SQ_A, strokeWidth: 2 },
      vertices: { visible: false }
    });
    const sqCA = board.create('polygon', mkSqPts(C, A, B), {
      fillColor: C_SQ_B, fillOpacity: 0.15,
      borders: { strokeColor: C_SQ_B, strokeWidth: 2 },
      vertices: { visible: false }
    });
    const sqAB = board.create('polygon', mkSqPts(A, B, C), {
      fillColor: C_SQ_C, fillOpacity: 0.15,
      borders: { strokeColor: C_SQ_C, strokeWidth: 2.5 },
      vertices: { visible: false }
    });

    const rightAng = board.create('angle', [B, C, A], {
      radius: 0.6, type: 'sector', orthotype: 'square',
      fillColor: C_RIGHT, strokeColor: C_RIGHT, fillOpacity: 0.4
    });

    const infoText = board.create('text', [
      -7.5, 7.5,
      () => {
        const a = B.Dist(C);
        const b = C.Dist(A);
        const c = A.Dist(B);
        const a2 = a * a, b2 = b * b, c2 = c * c;
        const sum = a2 + b2;
        return `<div style="font-family: var(--font-serif); color: ${getCSSVar('--theme-carbon')}; line-height:1.5;">
          <strong style="font-size: 1.15rem;">Teorema de Pit\u00e1goras</strong><br/>
          <span style="color:${getCSSVar('--theme-ocre')};">c\u00b2 = ${c2.toFixed(1)}</span><br/>
          <span style="color:${getCSSVar('--theme-salvia')};">a\u00b2 = ${a2.toFixed(1)}</span> &nbsp;
          <span style="color:${getCSSVar('--theme-terracota')};">b\u00b2 = ${b2.toFixed(1)}</span><br/>
          <strong>a\u00b2 + b\u00b2 = ${sum.toFixed(1)} ${Math.abs(sum - c2) < 0.5 ? '\u2261' : '\u2260'} c\u00b2</strong>
        </div>`;
      }
    ], { fixed: true, anchorX: 'left', anchorY: 'top' });

    const lastValidA = [0, 4];
    const lastValidB = [3, 0];
    A.on('drag', () => { if (A.Y() < 0.25) A.moveTo([lastValidA[0], lastValidA[1]], 0); else { lastValidA[0] = A.X(); lastValidA[1] = A.Y(); } });
    B.on('drag', () => { if (B.X() < 0.25) B.moveTo([lastValidB[0], lastValidB[1]], 0); else { lastValidB[0] = B.X(); lastValidB[1] = B.Y(); } });

    elementsRef.current = { A, B, C, poly, segBC, segCA, segAB, sqBC, sqCA, sqAB, rightAng, labA, labB, labC, infoText, board };

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
    const { A, B, C, segBC, segCA, segAB, sqBC, sqCA, sqAB, rightAng, labA, labB, labC, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    const hSqA = isHighlight('cuadrado-a');
    const hSqB = isHighlight('cuadrado-b');
    const hSqC = isHighlight('cuadrado-c');
    const hTri = isHighlight('triangulo');
    const showAll = !hSqA && !hSqB && !hSqC && !hTri;

    const dim = (active: boolean) => active || showAll ? 1 : 0.15;
    const sop = (active: boolean) => active || showAll ? 1 : 0.15;

    sqBC.setAttribute({ fillOpacity: hSqA ? 0.3 : 0.10, strokeOpacity: sop(hSqA) });
    sqCA.setAttribute({ fillOpacity: hSqB ? 0.3 : 0.10, strokeOpacity: sop(hSqB) });
    sqAB.setAttribute({ fillOpacity: hSqC ? 0.35 : 0.12, strokeOpacity: sop(hSqC) });
    rightAng.setAttribute({ fillOpacity: showAll ? 0.4 : 0.08 });

    segBC.setAttribute({ strokeOpacity: dim(showAll), strokeWidth: hSqA ? 4 : 2 });
    segCA.setAttribute({ strokeOpacity: dim(showAll), strokeWidth: hSqB ? 4 : 2 });
    segAB.setAttribute({ strokeOpacity: dim(showAll), strokeWidth: hSqC ? 4 : 2.5 });

    labA.setAttribute({ visible: dim(hSqA || showAll) > 0.5 });
    labB.setAttribute({ visible: dim(hSqB || showAll) > 0.5 });
    labC.setAttribute({ visible: dim(hSqC || showAll) > 0.5 });

    [A, B, C].forEach((p: any) => p.setAttribute({
      strokeOpacity: dim(showAll),
      fillOpacity: dim(showAll),
      size: hTri ? 7 : 5,
      fillColor: hTri ? getCSSVar('--theme-terracota') : getCSSVar('--theme-carbon')
    }));

    board.update();
  }, [highlight, isHighlight]);

  return (
    <div className="w-full h-full min-h-[350px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
