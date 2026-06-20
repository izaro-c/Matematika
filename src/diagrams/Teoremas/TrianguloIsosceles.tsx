import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';

function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}

export const TrianguloIsosceles = () => {
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
    const C_ACC  = getCSSVar('--theme-terracota');
    const C_ANG  = getCSSVar('--theme-salvia');
    const C_POL  = getCSSVar('--theme-pavo');

    const SNAP = 0.5;
    const pCfg = { size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP };

    const A = board.create('point', [-2.5, -2], { name: 'A', ...pCfg });
    const B = board.create('point', [2.5, -2],  { name: 'B', ...pCfg });
    const C = board.create('point', [0, 3],     { name: 'C', ...pCfg });

    const poly = board.create('polygon', [A, B, C], {
      fillColor: C_POL, fillOpacity: 0.06,
      borders: { strokeWidth: 2.5, strokeColor: C_PRIM },
      vertices: { visible: false }
    });

    const angleA = board.create('angle', [B, A, C], { name: '&alpha;', radius: 0.85, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.35, type: 'sector', visible: false }) as any;
    const angleB = board.create('angle', [C, B, A], { name: '&alpha;', radius: 0.85, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.35, type: 'sector', visible: false }) as any;

    board.update();

    const sides = { AB: (poly as any).borders[0], AC: (poly as any).borders[1], BC: (poly as any).borders[2] };

    const mkTick = (p: any, q: any) => {
      const mA = board.create('point', [() => (p.X() + q.X()) / 2, () => (p.Y() + q.Y()) / 2], { visible: false });
      const t0 = board.create('point', [
        () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return mA.X() + dy/len * 0.28; },
        () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return mA.Y() - dx/len * 0.28; }
      ], { visible: false });
      const t1 = board.create('point', [
        () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return mA.X() - dy/len * 0.28; },
        () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return mA.Y() + dx/len * 0.28; }
      ], { visible: false });
      return board.create('segment', [t0, t1], { strokeColor: C_ACC, strokeWidth: 2.2, visible: false }) as any;
    };

    const congAC = mkTick(A, C);
    const congBC = mkTick(B, C);

    const midAB = board.create('midpoint', [A, B], { visible: false });
    const lineAB = board.create('line', [A, B], { visible: false });
    const bisector = board.create('perpendicular', [lineAB, midAB], { visible: false });
    C.setAttribute({ attractors: [bisector], attractorDistance: 0.3, snatchDistance: 0.6 });

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
        const dAC = C.Dist(A), dBC = C.Dist(B);
        const tol = 0.15;
        const isIsosc = Math.abs(dAC - dBC) < tol;

        congAC.setAttribute({ visible: isIsosc });
        congBC.setAttribute({ visible: isIsosc });

        if (isIsosc) {
          sides.AC.setAttribute({ strokeWidth: 3.5, strokeColor: C_ACC });
          sides.BC.setAttribute({ strokeWidth: 3.5, strokeColor: C_ACC });
          sides.AB.setAttribute({ strokeWidth: 2.5, strokeColor: C_PRIM });
          angleA.setAttribute({ visible: true });
          angleB.setAttribute({ visible: true });
        } else {
          sides.AC.setAttribute({ strokeWidth: 2.5, strokeColor: C_PRIM });
          sides.BC.setAttribute({ strokeWidth: 2.5, strokeColor: C_PRIM });
          sides.AB.setAttribute({ strokeWidth: 2.5, strokeColor: C_PRIM });
          angleA.setAttribute({ visible: false });
          angleB.setAttribute({ visible: false });
        }

        return `<div style="font-family: var(--font-serif); color: ${getCSSVar('--theme-carbon')}; line-height:1.5;">
          <strong style="font-size: 1.15rem; color:${isIsosc ? getCSSVar('--theme-terracota') : getCSSVar('--theme-carbon')};">${isIsosc ? 'Tri\u00e1ngulo Is\u00f3sceles' : 'Tri\u00e1ngulo Escaleno'}</strong><br/>
          <small>AC = ${dAC.toFixed(2)} &nbsp; BC = ${dBC.toFixed(2)}</small>
        </div>`;
      }
    ], { fixed: true, anchorX: 'left', anchorY: 'top' });

    elementsRef.current = { A, B, C, poly, sides, angleA, angleB, congAC, congBC, infoText, board };

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
    const { A, B, C, poly, sides, angleA, angleB, congAC, congBC, board } = els;

    const C_PRIM = getCSSVar('--theme-carbon');
    const C_ACC  = getCSSVar('--theme-terracota');
    const C_ANG  = getCSSVar('--theme-salvia');

    const hLados = isHighlight('lados-iguales');
    const hAngulos = isHighlight('angulos-iguales');
    const hTri = isHighlight('triangulo');
    const anyH = hLados || hAngulos || hTri;
    const showAll = !anyH;

    const vOp = anyH ? 0.12 : 1;

    [A, B, C].forEach((p: any) => p.setAttribute({
      strokeOpacity: showAll ? 1 : vOp,
      fillOpacity: showAll ? 1 : vOp,
      size: hTri ? 7 : 5,
      fillColor: hTri ? C_ACC : C_PRIM,
      strokeColor: hTri ? C_ACC : C_PRIM
    }));

    sides.AC.setAttribute({ strokeColor: hLados ? C_ACC : C_PRIM, strokeWidth: hLados ? 4 : 2.5, strokeOpacity: showAll ? 1 : vOp });
    sides.BC.setAttribute({ strokeColor: hLados ? C_ACC : C_PRIM, strokeWidth: hLados ? 4 : 2.5, strokeOpacity: showAll ? 1 : vOp });
    sides.AB.setAttribute({ strokeColor: C_PRIM, strokeWidth: 2.5, strokeOpacity: showAll ? 1 : vOp });

    congAC.setAttribute({ strokeOpacity: showAll ? 1 : vOp });
    congBC.setAttribute({ strokeOpacity: showAll ? 1 : vOp });

    angleA.setAttribute({
      fillColor: hAngulos ? C_ACC : C_ANG,
      strokeColor: hAngulos ? C_ACC : C_ANG,
      fillOpacity: hAngulos ? 0.5 : 0.35,
      strokeOpacity: showAll ? 1 : vOp
    });
    angleB.setAttribute({
      fillColor: hAngulos ? C_ACC : C_ANG,
      strokeColor: hAngulos ? C_ACC : C_ANG,
      fillOpacity: hAngulos ? 0.5 : 0.35,
      strokeOpacity: showAll ? 1 : vOp
    });

    poly.setAttribute({ fillOpacity: hTri ? 0.2 : 0.06 });

    board.update();
  }, [highlight, isHighlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra <span className="font-bold not-italic text-terracota">C</span> hacia el centro para hacerlo is&oacute;sceles
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
