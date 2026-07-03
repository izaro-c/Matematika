import { useRef, useEffect } from 'react';
import { getCSSVar } from '@/features/graph/ui/MathUtils';
import JXG from 'jsxgraph';
import { useMathStore } from '@/app/providers/MathStoreContext';

export const CongruenciaLLL = () => {
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

    const SNAP = 0.5;
    const pCfg = { size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP };

    const A1 = board.create('point', [0, 0], { name: 'A', ...pCfg, fixed: true });
    const B1 = board.create('point', [5, 0], { name: 'B', ...pCfg, fixed: true });
    const C1 = board.create('point', [1.5, 4], { name: 'C', ...pCfg });

    const segAB1 = board.create('segment', [A1, B1], { strokeColor: C_PRIM, strokeWidth: 3 });
    const segBC1 = board.create('segment', [B1, C1], { strokeColor: C_PRIM, strokeWidth: 3 });
    const segCA1 = board.create('segment', [C1, A1], { strokeColor: C_PRIM, strokeWidth: 3 });
    board.create('polygon', [A1, B1, C1], { fillColor: C_POL1, fillOpacity: 0.07, borders: { visible: false }, vertices: { visible: false } });

    const A2 = board.create('point', [0, -3], { name: "A'", size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, fixed: true });
    const B2 = board.create('point', [() => A2.X() + A1.Dist(B1), () => A2.Y()], { name: "B'", size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, fixed: true });

    const circA2 = board.create('circle', [A2, () => A1.Dist(C1)], { visible: false });
    const circB2 = board.create('circle', [B2, () => B1.Dist(C1)], { visible: false });
    const C2 = board.create('intersection', [circA2, circB2, 0], { name: "C'", size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false });

    const segAB2 = board.create('segment', [A2, B2], { strokeColor: C_PRIM, strokeWidth: 3 });
    const segBC2 = board.create('segment', [B2, C2], { strokeColor: C_PRIM, strokeWidth: 3 });
    const segCA2 = board.create('segment', [C2, A2], { strokeColor: C_PRIM, strokeWidth: 3 });
    board.create('polygon', [A2, B2, C2], { fillColor: C_POL2, fillOpacity: 0.07, borders: { visible: false }, vertices: { visible: false } });

    const C_ANG = getCSSVar('--theme-ocre');
    const angleA1 = board.create('angle', [B1, A1, C1], { name: '∠A', radius: 0.6, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector', visible: false }) as any;
    const angleB1 = board.create('angle', [C1, B1, A1], { name: '∠B', radius: 0.6, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector', visible: false }) as any;
    const angleC1 = board.create('angle', [A1, C1, B1], { name: '∠C', radius: 0.6, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector', visible: false }) as any;
    const angleA2 = board.create('angle', [C2, A2, B2], { name: '∠A', radius: 0.6, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector', visible: false }) as any;
    const angleB2 = board.create('angle', [A2, B2, C2], { name: '∠B', radius: 0.6, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector', visible: false }) as any;
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
    const tBC1 = mkTick(B1, C1, 2), tBC2 = mkTick(B2, C2, 2);
    const tCA1 = mkTick(C1, A1, 3), tCA2 = mkTick(C2, A2, 3);
    const ticksAB = [...tAB1, ...tAB2], ticksBC = [...tBC1, ...tBC2], ticksCA = [...tCA1, ...tCA2];

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
      const a = B1.Dist(C1), b = C1.Dist(A1), c = A1.Dist(B1);
      return `<div style="font-family: var(--font-serif); color:${getCSSVar('--theme-carbon')}; line-height:1.3;">
        <strong style="font-size:1.1rem;">Criterio LLL</strong><br/>
        <small>AB = ${c.toFixed(1)} &nbsp; BC = ${a.toFixed(1)}</small><br/>
        <small>CA = ${b.toFixed(1)}</small>
      </div>`;
    }], { fixed: true, anchorX: 'left', anchorY: 'top' });

    elementsRef.current = { segAB1, segBC1, segCA1, segAB2, segBC2, segCA2, angleA1, angleB1, angleC1, angleA2, angleB2, angleC2, ticksAB, ticksBC, ticksCA, infoText, board };

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
    const { segAB1, segBC1, segCA1, segAB2, segBC2, segCA2, angleA1, angleB1, angleC1, angleA2, angleB2, angleC2, ticksAB, ticksBC, ticksCA, board } = els;

    const hGlobal = isHighlight('globalmente-congruentes');
    const hLados = isHighlight('lados');
    const hLadoAB = isHighlight('lado-ab');
    const hLadoBC = isHighlight('lado-bc');
    const hLadoCA = isHighlight('lado-ca');
    const hLAL = isHighlight('lal-axiom');
    const anyH = hGlobal || hLados || hLadoAB || hLadoBC || hLadoCA || hLAL;
    const showAll = !anyH;

    const C_ACC = getCSSVar('--theme-terracota');
    const C_PRIM = getCSSVar('--theme-carbon');
    const C_ANG = getCSSVar('--theme-ocre');

    const dim = (active: boolean) => active || showAll ? 1 : 0.15;
    const side = (s: any, active: boolean) => s.setAttribute({ strokeColor: active ? C_ACC : C_PRIM, strokeWidth: active ? 4 : 3, strokeOpacity: dim(active) });

    const lalAB = hLAL || hLadoAB || hLados || hGlobal;
    const lalBC = hLAL || hLadoBC || hLados || hGlobal;
    const lalCA = hLadoCA || hLados || hGlobal;
    side(segAB1, lalAB); side(segAB2, lalAB);
    side(segBC1, lalBC); side(segBC2, lalBC);
    side(segCA1, lalCA); side(segCA2, lalCA);

    ticksAB.forEach((t: any) => t.setAttribute({ visible: true, strokeColor: C_ACC }));
    ticksBC.forEach((t: any) => t.setAttribute({ visible: true, strokeColor: C_ACC }));
    ticksCA.forEach((t: any) => t.setAttribute({ visible: true, strokeColor: C_ACC }));

    const showAngles = hGlobal;
    [angleA1, angleB1, angleC1, angleA2, angleB2, angleC2].forEach((a: any) => a.setAttribute({ visible: showAngles }));
    [angleB1, angleB2].forEach((a: any) => a.setAttribute({ visible: showAngles || hLAL, fillOpacity: hLAL ? 0.45 : 0.25, strokeColor: hLAL ? C_ACC : C_ANG, strokeWidth: hLAL ? 3 : 1.5 }));

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
