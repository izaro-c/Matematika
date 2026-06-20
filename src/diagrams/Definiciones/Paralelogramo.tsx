import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';

function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}

export const Paralelogramo = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

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
    const C_ACC2 = getCSSVar('--theme-pavo');
    const C_ANG  = getCSSVar('--theme-salvia');
    const C_RIGHT = getCSSVar('--theme-ocre');
    const C_DIAG  = getCSSVar('--theme-pizarra');

    const SNAP = 0.5;
    const pCfg = { size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP };

    const A = board.create('point', [-3, -2], { name: 'A', ...pCfg });
    const B = board.create('point', [2, -2],  { name: 'B', ...pCfg });
    const C = board.create('point', [4, 2],   { name: 'C', ...pCfg });

    const lineAB = board.create('line', [A, B], { visible: false });
    const lineBC = board.create('line', [B, C], { visible: false });
    const parCD = board.create('parallel', [lineAB, C], { visible: false });
    const parAD = board.create('parallel', [lineBC, A], { visible: false });
    const D = board.create('intersection', [parCD, parAD, 0], { name: 'D', ...pCfg });

    const poly = board.create('polygon', [A, B, C, D], {
      fillColor: C_ACC2, fillOpacity: 0.08,
      borders: { strokeWidth: 2.5, strokeColor: C_PRIM },
      vertices: { visible: false }
    });

    board.update();

    const orientABC = () => (B.X() - A.X()) * (C.Y() - A.Y()) - (B.Y() - A.Y()) * (C.X() - A.X());
    const initialOrient = orientABC();
    const lastValid: Record<string, [number, number]> = { A: [A.X(), A.Y()], B: [B.X(), B.Y()], C: [C.X(), C.Y()] };

    [A, B, C].forEach((p: any, idx: number) => {
      const name = String.fromCharCode(65 + idx);
      p.on('drag', () => {
        const curOrient = orientABC();
        if (Math.abs(curOrient) < 0.01 || (initialOrient > 0.01 && curOrient < -0.01) || (initialOrient < -0.01 && curOrient > 0.01)) {
          p.moveTo([lastValid[name][0], lastValid[name][1]], 0);
        } else {
          lastValid[name][0] = p.X();
          lastValid[name][1] = p.Y();
        }
      });
    });

    const sides = {
      AB: (poly as any).borders[0],
      BC: (poly as any).borders[1],
      CD: (poly as any).borders[2],
      DA: (poly as any).borders[3]
    };

    const mkTickSeg = (p: any, q: any, color: string, centerOffset = 0) => {
      const mA = board.create('point', [() => (p.X() + q.X()) / 2, () => (p.Y() + q.Y()) / 2], { visible: false });
      const dNorm = () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return { dx: dx/len, dy: dy/len }; };
      const cx = () => { const dn = dNorm(); return mA.X() + dn.dx * centerOffset; };
      const cy = () => { const dn = dNorm(); return mA.Y() + dn.dy * centerOffset; };
      const t0 = board.create('point', [
        () => { const dn = dNorm(); return cx() + dn.dy * 0.3; },
        () => { const dn = dNorm(); return cy() - dn.dx * 0.3; }
      ], { visible: false });
      const t1 = board.create('point', [
        () => { const dn = dNorm(); return cx() - dn.dy * 0.3; },
        () => { const dn = dNorm(); return cy() + dn.dx * 0.3; }
      ], { visible: false });
      return board.create('segment', [t0, t1], { strokeColor: color, strokeWidth: 2.4, visible: false }) as any;
    };

    const congAB = mkTickSeg(A, B, C_PRIM);
    const congCD = mkTickSeg(C, D, C_PRIM);
    const congBC1 = mkTickSeg(B, C, C_PRIM, -0.18);
    const congBC2 = mkTickSeg(B, C, C_PRIM, 0.18);
    const congDA1 = mkTickSeg(D, A, C_PRIM, -0.18);
    const congDA2 = mkTickSeg(D, A, C_PRIM, 0.18);

    const angleA = board.create('angle', [B, A, D], { name: '&alpha;', radius: 0.85, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.22, type: 'sector', visible: false }) as any;
    const angleC = board.create('angle', [D, C, B], { name: '&alpha;', radius: 0.85, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.22, type: 'sector', visible: false }) as any;
    const angleB = board.create('angle', [C, B, A], { name: '&beta;',  radius: 0.85, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.22, type: 'sector', visible: false }) as any;
    const angleD = board.create('angle', [A, D, C], { name: '&beta;',  radius: 0.85, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.22, type: 'sector', visible: false }) as any;

    const rightA = board.create('angle', [B, A, D], { radius: 0.55, type: 'sector', orthotype: 'square', fillColor: C_RIGHT, strokeColor: C_RIGHT, fillOpacity: 0.4, visible: false }) as any;
    const rightB = board.create('angle', [C, B, A], { radius: 0.55, type: 'sector', orthotype: 'square', fillColor: C_RIGHT, strokeColor: C_RIGHT, fillOpacity: 0.4, visible: false }) as any;
    const rightC = board.create('angle', [D, C, B], { radius: 0.55, type: 'sector', orthotype: 'square', fillColor: C_RIGHT, strokeColor: C_RIGHT, fillOpacity: 0.4, visible: false }) as any;
    const rightD = board.create('angle', [A, D, C], { radius: 0.55, type: 'sector', orthotype: 'square', fillColor: C_RIGHT, strokeColor: C_RIGHT, fillOpacity: 0.4, visible: false }) as any;

    const diagAC = board.create('segment', [A, C], { strokeColor: C_DIAG, strokeWidth: 1.2, dash: 3, fixed: true, visible: true });
    const diagBD = board.create('segment', [B, D], { strokeColor: C_DIAG, strokeWidth: 1.2, dash: 3, fixed: true, visible: true });
    const diagM = board.create('intersection', [diagAC, diagBD, 0], { name: 'M', fillColor: C_PRIM, strokeColor: C_PRIM, size: 3, visible: true });

    const infoText = board.create('text', [
      -5.5, 5.5,
      () => {
        const vA = angleA.Value(), vB = angleB.Value(), vC = angleC.Value(), vD = angleD.Value();
        const dAB = A.Dist(B), dBC = B.Dist(C), dCD = C.Dist(D), dDA = D.Dist(A);
        const tol = 0.15;
        const isRight = (v: number) => Math.abs(v - Math.PI / 2) < 0.1;
        const isEq = (a: number, b: number) => Math.abs(a - b) < tol;
        const allRight = isRight(vA) && isRight(vB) && isRight(vC) && isRight(vD);
        const allSidesEq = isEq(dAB, dBC) && isEq(dBC, dCD) && isEq(dCD, dDA);

        let clase = "Paralelogramo";
        let props = "2 pares \u2225 \u00b7 lados opuestos \u2261 \u00b7 \u2220 opuestos \u2261 \u00b7 diags se bisecan";
        if (allSidesEq && allRight) { clase = "Cuadrado"; props = "4 lados \u2261 \u00b7 4 \u2220 rectos \u00b7 diags \u22a5 y \u2261"; }
        else if (allRight) { clase = "Rect\u00e1ngulo"; props = "4 \u2220 rectos \u00b7 diags \u2261"; }
        else if (allSidesEq) { clase = "Rombo"; props = "4 lados \u2261 \u00b7 diags \u22a5"; }

        return `<div style="font-family: var(--font-serif); color: ${getCSSVar('--theme-carbon')}; line-height:1.4;">
          <strong style="font-size: 1.25rem; color:${clase==='Paralelogramo' ? getCSSVar('--theme-carbon') : getCSSVar('--theme-terracota')};">${clase}</strong><br/>
          <small style="color:${getCSSVar('--theme-pizarra')};">${props}</small>
        </div>`;
      }
    ], { fixed: true, anchorX: 'left', anchorY: 'top' });

    elementsRef.current = { A, B, C, D, poly, sides, congAB, congCD, congBC1, congBC2, congDA1, congDA2, angleA, angleB, angleC, angleD, rightA, rightB, rightC, rightD, diagAC, diagBD, diagM, infoText, board };

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

    const { A, B, C, D, poly, sides, congAB, congCD, congBC1, congBC2, congDA1, congDA2, angleA, angleB, angleC, angleD, rightA, rightB, rightC, rightD, diagAC, diagBD, diagM, board } = els;

    const isPara = isHighlight('paralelogramo');
    const isLados = isHighlight('lados-opuestos');
    const isAngulos = isHighlight('angulos-opuestos');
    const isDiagonales = isHighlight('diagonales');
    const showAll = !isPara && !isLados && !isAngulos && !isDiagonales;

    const vA = angleA.Value(), vB = angleB.Value(), vC = angleC.Value(), vD = angleD.Value();
    const dAB = A.Dist(B), dBC = B.Dist(C), dCD = C.Dist(D), dDA = D.Dist(A);
    const dAC = A.Dist(C), dBD = B.Dist(D);
    const tol = 0.15;
    const isRight = (v: number) => Math.abs(v - Math.PI / 2) < 0.1;
    const isEq = (a: number, b: number) => Math.abs(a - b) < tol;
    const allRight = isRight(vA) && isRight(vB) && isRight(vC) && isRight(vD);
    const allSidesEq = isEq(dAB, dBC) && isEq(dBC, dCD) && isEq(dCD, dDA);
    const eqDiags = isEq(dAC, dBD);
    const isRectOrSquare = allRight;
    const isSquare = allRight && allSidesEq;

    const C_PRIM = getCSSVar('--theme-carbon');
    const C_ACC  = getCSSVar('--theme-terracota');
    const C_ACC2 = getCSSVar('--theme-pavo');
    const C_DIAG  = getCSSVar('--theme-pizarra');

    const dim = (showAllValue: boolean) => showAllValue ? 1 : 0.2;
    const dimVis = (showAllValue: boolean) => showAllValue;

    sides.AB.setAttribute({ strokeColor: showAll ? C_ACC : C_PRIM, strokeWidth: showAll ? 3 : 2.5, strokeOpacity: dim(isLados || showAll) });
    sides.CD.setAttribute({ strokeColor: showAll ? C_ACC : C_PRIM, strokeWidth: showAll ? 3 : 2.5, strokeOpacity: dim(isLados || showAll) });
    sides.BC.setAttribute({ strokeColor: showAll ? C_ACC2 : C_PRIM, strokeWidth: showAll ? 3 : 2.5, strokeOpacity: dim(isLados || showAll) });
    sides.DA.setAttribute({ strokeColor: showAll ? C_ACC2 : C_PRIM, strokeWidth: showAll ? 3 : 2.5, strokeOpacity: dim(isLados || showAll) });

    [A, B, C, D].forEach((p: any) => p.setAttribute({ strokeOpacity: dim(showAll), fillOpacity: dim(showAll) }));

    const congVis = dimVis(isLados || showAll);
    congAB.setAttribute({ visible: congVis }); congCD.setAttribute({ visible: congVis });
    congBC1.setAttribute({ visible: congVis }); congBC2.setAttribute({ visible: congVis });
    congDA1.setAttribute({ visible: congVis }); congDA2.setAttribute({ visible: congVis });

    const showAngles = showAll && !isRectOrSquare;
    const angVis = dimVis(isAngulos || showAngles);
    const angOp = isAngulos || showAngles ? 1 : 0.3;
    angleA.setAttribute({ visible: angVis, strokeOpacity: angOp }); angleC.setAttribute({ visible: angVis, strokeOpacity: angOp });
    angleB.setAttribute({ visible: angVis, strokeOpacity: angOp }); angleD.setAttribute({ visible: angVis, strokeOpacity: angOp });

    const showRights = showAll && isRectOrSquare;
    const rightVis = showRights;
    rightA.setAttribute({ visible: rightVis }); rightB.setAttribute({ visible: rightVis });
    rightC.setAttribute({ visible: rightVis }); rightD.setAttribute({ visible: rightVis });

    const diagVis = dimVis(isDiagonales || showAll);
    diagAC.setAttribute({ visible: diagVis, strokeOpacity: dim(isDiagonales || showAll), strokeColor: showAll && isSquare ? C_ACC : showAll && eqDiags ? C_ACC : C_DIAG, dash: showAll && isSquare ? 0 : showAll && eqDiags ? 0 : 3 });
    diagBD.setAttribute({ visible: diagVis, strokeOpacity: dim(isDiagonales || showAll), strokeColor: showAll && isSquare ? C_ACC : showAll && eqDiags ? C_ACC : C_DIAG, dash: showAll && isSquare ? 0 : showAll && eqDiags ? 0 : 3 });
    diagM.setAttribute({ visible: diagVis, strokeOpacity: dim(isDiagonales || showAll), fillOpacity: dim(isDiagonales || showAll) });

    poly.setAttribute({ fillOpacity: isPara ? 0.25 : 0.08 });

    board.update();
  }, [highlight, isHighlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra <span className="font-bold not-italic text-terracota">A</span>, <span className="font-bold not-italic text-terracota">B</span> o <span className="font-bold not-italic text-terracota">C</span>
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
