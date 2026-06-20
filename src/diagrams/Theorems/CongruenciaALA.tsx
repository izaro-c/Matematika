import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';

function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}

export const CongruenciaALA = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-4, 9, 9, -9],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    const C_PRIM = getCSSVar('--theme-carbon');
    const C_ACC  = getCSSVar('--theme-terracota');
    const C_POL1 = getCSSVar('--theme-salvia');
    const C_POL2 = getCSSVar('--theme-pavo');
    const C_ANG  = getCSSVar('--theme-ocre');

    const SNAP = 0.5;
    const pCfg = { size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP };

    const A1 = board.create('point', [0, 0], { name: 'A', ...pCfg, fixed: true });
    const B1 = board.create('point', [5, 0], { name: 'B', ...pCfg, fixed: true });
    const C1 = board.create('point', [1.5, 4], { name: 'C', ...pCfg });

    const segAB1 = board.create('segment', [A1, B1], { strokeColor: C_PRIM, strokeWidth: 3 });
    const segAC1 = board.create('segment', [A1, C1], { strokeColor: C_PRIM, strokeWidth: 2.5 });
    const segBC1 = board.create('segment', [B1, C1], { strokeColor: C_PRIM, strokeWidth: 2.5 });
    board.create('polygon', [A1, B1, C1], { fillColor: C_POL1, fillOpacity: 0.07, borders: { visible: false }, vertices: { visible: false } });

    const angleA1 = board.create('angle', [B1, A1, C1], { name: '∠A', radius: 0.6, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector' }) as any;
    const angleB1 = board.create('angle', [C1, B1, A1], { name: '∠B', radius: 0.6, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector' }) as any;

    const A2 = board.create('point', [0, -3], { name: "A'", size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, fixed: true });
    const B2 = board.create('point', [() => A2.X() + A1.Dist(B1), () => A2.Y()], { name: "B'", size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, fixed: true });

    const C2 = board.create('point', [
      () => A2.X() + (C1.X() - A1.X()),
      () => A2.Y() - (C1.Y() - A1.Y())
    ], { name: "C'", size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false });

    const segAB2 = board.create('segment', [A2, B2], { strokeColor: C_PRIM, strokeWidth: 3 });
    const segAC2 = board.create('segment', [A2, C2], { strokeColor: C_PRIM, strokeWidth: 2.5 });
    const segBC2 = board.create('segment', [B2, C2], { strokeColor: C_PRIM, strokeWidth: 2.5 });
    board.create('polygon', [A2, B2, C2], { fillColor: C_POL2, fillOpacity: 0.07, borders: { visible: false }, vertices: { visible: false } });

    const angleA2 = board.create('angle', [C2, A2, B2], { name: '∠A', radius: 0.6, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector', visible: false }) as any;
    const angleB2 = board.create('angle', [A2, B2, C2], { name: '∠B', radius: 0.6, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector', visible: false }) as any;
    const angleC1 = board.create('angle', [A1, C1, B1], { name: '∠C', radius: 0.6, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector', visible: false }) as any;
    const angleC2 = board.create('angle', [B2, C2, A2], { name: '∠C', radius: 0.6, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector', visible: false }) as any;

    const mkTick = (p: any, q: any, cnt: number) => {
      const mx = () => (p.X()+q.X())/2, my = () => (p.Y()+q.Y())/2;
      const dy = () => { const dx= q.X()-p.X(), dyy= q.Y()-p.Y(); const l = Math.hypot(dx,dyy)||1; return dyy/l; };
      const dx = () => { const dxx= q.X()-p.X(), dyy= q.Y()-p.Y(); const l = Math.hypot(dxx,dyy)||1; return dxx/l; };
      const ts: any[] = [];
      const off = (k: number) => (k - (cnt-1)/2) * 0.22;
      for (let i = 0; i < cnt; i++) {
        const o = off(i);
        const cx = () => mx() + dx() * o;
        const cy = () => my() + dy() * o;
        const t0 = board.create('point', [() => cx() + dy()*.28, () => cy() - dx()*.28], { visible: false });
        const t1 = board.create('point', [() => cx() - dy()*.28, () => cy() + dx()*.28], { visible: false });
        ts.push(board.create('segment', [t0, t1], { strokeColor: C_ACC, strokeWidth: 2.2, visible: true }) as any);
      }
      return ts;
    };

    const tAB1 = mkTick(A1, B1, 1), tAB2 = mkTick(A2, B2, 1);
    const tAC1 = mkTick(A1, C1, 2), tAC2 = mkTick(A2, C2, 2);
    const tBC1 = mkTick(B1, C1, 3), tBC2 = mkTick(B2, C2, 3);
    const ticksAB = [...tAB1, ...tAB2], ticksAC = [...tAC1, ...tAC2], ticksBC = [...tBC1, ...tBC2];

    const orientABC = () => (B1.X()-A1.X())*(C1.Y()-A1.Y()) - (B1.Y()-A1.Y())*(C1.X()-A1.X());
    const initialOrient = orientABC();
    const last = [C1.X(), C1.Y()];
    C1.on('drag', () => {
      const cur = orientABC();
      if (Math.abs(cur) < 0.01 || (initialOrient > 0.01 && cur < -0.01) || (initialOrient < -0.01 && cur > 0.01)) {
        C1.moveTo([last[0], last[1]], 0);
      } else { last[0] = C1.X(); last[1] = C1.Y(); }
    });

    const infoText = board.create('text', [-2.5, 7.5, () => {
      const vA = angleA1.Value(), vB = angleB1.Value();
      return `<div style="font-family: var(--font-serif); color:${getCSSVar('--theme-carbon')}; line-height:1.3;">
        <strong style="font-size:1.1rem;">Criterio ALA</strong><br/>
        <small>∠A = ${Math.round(vA*180/Math.PI)}° &nbsp; ∠B = ${Math.round(vB*180/Math.PI)}°</small><br/>
        <small>AB = ${A1.Dist(B1).toFixed(1)} ≅ A'B'</small>
      </div>`;
    }], { fixed: true, anchorX: 'left', anchorY: 'top' });

    elementsRef.current = { A1, B1, C1, A2, B2, C2, segAB1, segAC1, segBC1, segAB2, segAC2, segBC2, angleA1, angleB1, angleC1, angleA2, angleB2, angleC2, ticksAB, ticksAC, ticksBC, infoText, board };

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
    const { segAB1, segAC1, segBC1, segAB2, segAC2, segBC2, angleA1, angleB1, angleC1, angleA2, angleB2, angleC2, ticksAB, ticksAC, ticksBC, board } = els;

    const hGlobal = isHighlight('globalmente-congruentes');
    const hLadoAB = isHighlight('lado-ab');
    const hAngA = isHighlight('angulo-a');
    const hAngB = isHighlight('angulo-b');
    const anyH = hGlobal || hLadoAB || hAngA || hAngB;
    const showAll = !anyH;

    const C_ACC = getCSSVar('--theme-terracota');
    const C_PRIM = getCSSVar('--theme-carbon');
    const C_ANG = getCSSVar('--theme-ocre');

    const bright = (target: any) => showAll || target || hGlobal;
    const op = (target: any) => bright(target) ? 1 : 0.15;

    segAB1.setAttribute({ strokeColor: (hLadoAB || hGlobal) ? C_ACC : C_PRIM, strokeWidth: (hLadoAB || hGlobal) ? 4 : 3, strokeOpacity: op(hLadoAB) });
    segAB2.setAttribute({ strokeColor: (hLadoAB || hGlobal) ? C_ACC : C_PRIM, strokeWidth: (hLadoAB || hGlobal) ? 4 : 3, strokeOpacity: op(hLadoAB) });
    segAC1.setAttribute({ strokeColor: hGlobal ? C_ACC : C_PRIM, strokeOpacity: op(hGlobal) });
    segBC1.setAttribute({ strokeColor: hGlobal ? C_ACC : C_PRIM, strokeOpacity: op(hGlobal) });
    segAC2.setAttribute({ strokeColor: hGlobal ? C_ACC : C_PRIM, strokeOpacity: op(hGlobal) });
    segBC2.setAttribute({ strokeColor: hGlobal ? C_ACC : C_PRIM, strokeOpacity: op(hGlobal) });

    ticksAB.forEach((t: any) => t.setAttribute({ visible: true, strokeOpacity: op(hLadoAB || hGlobal) }));
    ticksAC.forEach((t: any) => t.setAttribute({ visible: hGlobal, strokeOpacity: op(hGlobal) }));
    ticksBC.forEach((t: any) => t.setAttribute({ visible: hGlobal, strokeOpacity: op(hGlobal) }));

    [angleA1, angleA2].forEach((a: any) => a.setAttribute({ visible: true, fillOpacity: (hAngA || hGlobal) ? 0.5 : 0.25, strokeOpacity: op(hAngA), strokeColor: (hAngA || hGlobal) ? C_ACC : C_ANG, strokeWidth: (hAngA || hGlobal) ? 3 : 1.5 }));
    [angleB1, angleB2].forEach((a: any) => a.setAttribute({ visible: true, fillOpacity: (hAngB || hGlobal) ? 0.5 : 0.25, strokeOpacity: op(hAngB), strokeColor: (hAngB || hGlobal) ? C_ACC : C_ANG, strokeWidth: (hAngB || hGlobal) ? 3 : 1.5 }));
    [angleC1, angleC2].forEach((a: any) => a.setAttribute({ visible: hGlobal, fillOpacity: 0.25, strokeOpacity: op(hGlobal) }));

    board.update();
  }, [highlight, isHighlight]);

  return (
    <div className="w-full h-full min-h-[350px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra <span className="font-bold not-italic text-terracota">C</span>: ambos tri&aacute;ngulos son congruentes
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
