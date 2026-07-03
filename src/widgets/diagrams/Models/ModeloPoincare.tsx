import { useRef, useEffect } from 'react';
import { getCSSVar } from '@/features/graph/ui/MathUtils';
import JXG from 'jsxgraph';

export const ModeloPoincare = () => {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-1.1, 1.1, 1.1, -1.1],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    const C_BOUNDARY = getCSSVar('--theme-carbon');
    const C_MAIN     = getCSSVar('--theme-terracota');
    const C_LIMIT    = getCSSVar('--theme-ocre');
    const C_PAR      = getCSSVar('--theme-salvia');
    const C_DISK     = getCSSVar('--theme-pavo');
    const C_BG       = getCSSVar('--theme-lienzo');

    const O = board.create('point', [0, 0], { visible: false, fixed: true });
    const unitCircle = board.create('circle', [O, 1], { strokeColor: C_BOUNDARY, strokeWidth: 2.5, fillColor: C_DISK, fillOpacity: 0.04, fixed: true });

    const L1 = board.create('glider', [0.866, 0.5, unitCircle],  { name: '', size: 5, fillColor: C_MAIN, strokeColor: C_MAIN, showInfobox: false });
    const L2 = board.create('glider', [-0.866, 0.5, unitCircle], { name: '', size: 5, fillColor: C_MAIN, strokeColor: C_MAIN, showInfobox: false });

    const P = board.create('point', [0.4, -0.25], { name: 'P', size: 6, fillColor: C_MAIN, strokeColor: C_MAIN, showInfobox: false });
    P.on('drag', () => { if (P.Dist(O)>0.95) { const a=Math.atan2(P.Y(),P.X()); P.moveTo([0.9*Math.cos(a),0.9*Math.sin(a)],0); } });

    const calcOtherEndpoint = (bp: any) => board.create('point', [
      () => {
        const p1=P.X(), p2=P.Y(), u1=bp.X(), u2=bp.Y();
        const det = u1*p2 - u2*p1;
        if (Math.abs(det) < 1e-10) return -bp.X();
        const s = (p1*p1 + p2*p2 + 1)/2;
        const cx = (p2 - u2*s)/det, cy = (u1*s - p1)/det;
        const phi = Math.atan2(cy, cx), uAng = Math.atan2(u2, u1);
        return Math.cos(2*phi - uAng);
      },
      () => {
        const p1=P.X(), p2=P.Y(), u1=bp.X(), u2=bp.Y();
        const det = u1*p2 - u2*p1;
        if (Math.abs(det) < 1e-10) return -bp.Y();
        const s = (p1*p1 + p2*p2 + 1)/2;
        const cx = (p2 - u2*s)/det, cy = (u1*s - p1)/det;
        const phi = Math.atan2(cy, cx), uAng = Math.atan2(u2, u1);
        return Math.sin(2*phi - uAng);
      }
    ], { visible: false });

    const createHyperbolicLine = (pA: any, pB: any, color: string, width: number, dash: number = 0) => {
      return board.create('curve', [
        (t: number) => {
          const ax=pA.X(), ay=pA.Y(), bx=pB.X(), by=pB.Y();
          const det = ax*by - ay*bx;
          if (Math.abs(det) < 1e-4) return ax + t*(bx - ax);
          const cx = (by - ay)/det, cy = (ax - bx)/det;
          const r = Math.sqrt(Math.max(0, cx*cx + cy*cy - 1));
          let angA = Math.atan2(ay - cy, ax - cx);
          let angB = Math.atan2(by - cy, bx - cx);
          if ((ax - cx)*(by - cy) - (ay - cy)*(bx - cx) > 0) {
            if (angB < angA) angB += 2*Math.PI;
          } else {
            if (angA < angB) angA += 2*Math.PI;
          }
          return cx + r * Math.cos(angA + t*(angB - angA));
        },
        (t: number) => {
          const ax=pA.X(), ay=pA.Y(), bx=pB.X(), by=pB.Y();
          const det = ax*by - ay*bx;
          if (Math.abs(det) < 1e-4) return ay + t*(by - ay);
          const cx = (by - ay)/det, cy = (ax - bx)/det;
          const r = Math.sqrt(Math.max(0, cx*cx + cy*cy - 1));
          let angA = Math.atan2(ay - cy, ax - cx);
          let angB = Math.atan2(by - cy, bx - cx);
          if ((ax - cx)*(by - cy) - (ay - cy)*(bx - cx) > 0) {
            if (angB < angA) angB += 2*Math.PI;
          } else {
            if (angA < angB) angA += 2*Math.PI;
          }
          return cy + r * Math.sin(angA + t*(angB - angA));
        },
        0, 1
      ], { strokeColor: color, strokeWidth: width, dash: dash });
    };

    createHyperbolicLine(L1, L2, C_MAIN, 3, 0);

    const E1 = calcOtherEndpoint(L1);
    const E2 = calcOtherEndpoint(L2);
    
    createHyperbolicLine(L1, E1, C_LIMIT, 2.5, 2);
    createHyperbolicLine(L2, E2, C_LIMIT, 2.5, 2);

    const getUltraAng = (i: number) => {
      const pts = [
        { type: 'L', ang: Math.atan2(L1.Y(), L1.X()) },
        { type: 'L', ang: Math.atan2(L2.Y(), L2.X()) },
        { type: 'E', ang: Math.atan2(E1.Y(), E1.X()) },
        { type: 'E', ang: Math.atan2(E2.Y(), E2.X()) }
      ];
      pts.forEach(p => { if (p.ang < 0) p.ang += 2*Math.PI; });
      pts.sort((a, b) => a.ang - b.ang);

      let startAng = 0, span = 0;
      for (let j = 0; j < 4; j++) {
        const p1 = pts[j];
        const p2 = pts[(j+1)%4];
        if (p1.type !== p2.type) {
          startAng = p1.ang;
          let endAng = p2.ang;
          if (endAng < startAng) endAng += 2*Math.PI;
          span = endAng - startAng;
          break;
        }
      }
      return startAng + span * i / 5;
    };

    for (let i = 1; i <= 4; i++) {
      const pt = board.create('point', [
        () => Math.cos(getUltraAng(i)),
        () => Math.sin(getUltraAng(i))
      ], { visible: false });
      const ptE = calcOtherEndpoint(pt);
      createHyperbolicLine(pt, ptE, C_PAR, 2, 2);
    }

    board.create('text', [-1.0, 1.0, () => {
      const a1=Math.round(Math.atan2(L1.Y(),L1.X())*180/Math.PI);
      const a2=Math.round(Math.atan2(L2.Y(),L2.X())*180/Math.PI);
      return `<div style="font-family: var(--font-serif); color:${C_BOUNDARY}; font-size:12px;">
        l: ${a1}\u00b0 \u2013 ${a2}\u00b0 &nbsp;|P|=${P.Dist(O).toFixed(2)}
      </div>`;
    }], { fixed: true, anchorX: 'left', anchorY: 'bottom' });

    board.update();
    (board.renderer as any).container.style.backgroundColor = C_BG;

    const obs = new MutationObserver(() => {
      if (board) { (board.renderer as any).container.style.backgroundColor = C_BG; board.update(); }
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => { obs.disconnect(); JXG.JSXGraph.freeBoard(board); };
  }, []);

  return (
    <div className="w-full h-full min-h-[420px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Disco de Poincar&eacute; &middot; Arrastra <span className="font-bold not-italic" style={{color:getCSSVar('--theme-terracota')}}>L&#8321;, L&#8322;</span> y <span className="font-bold not-italic" style={{color:getCSSVar('--theme-terracota')}}>P</span>
      </div>
      <div className="absolute bottom-3 right-4 z-10 flex flex-col gap-1.5 text-xs font-sans text-carbon/80 bg-lienzo/95 p-3 rounded-md shadow-sm border border-pizarra/20 backdrop-blur-md pointer-events-none">
        <h4 className="font-bold text-[10px] uppercase tracking-widest text-carbon/60 mb-0.5">Leyenda</h4>
        <div className="flex items-center gap-2"><div className="w-4 h-[2px] rounded-full" style={{backgroundColor: getCSSVar('--theme-terracota')}}></div> Recta principal (l)</div>
        <div className="flex items-center gap-2"><div className="w-4 h-[2px] border-t-2 border-dashed" style={{borderColor: getCSSVar('--theme-ocre')}}></div> Paralelas l&iacute;mite</div>
        <div className="flex items-center gap-2"><div className="w-4 h-[2px] border-t-2 border-dashed" style={{borderColor: getCSSVar('--theme-salvia')}}></div> Ultraparalelas</div>
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" role="img" aria-label="Disco de Poincaré: frontera circular, recta hiperbólica l, punto P, paralelas límite y ultraparalelas que pasan por P" />
    </div>
  );
};
