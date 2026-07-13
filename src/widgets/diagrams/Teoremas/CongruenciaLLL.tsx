import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createSegment, createCircle, createPolygon, createAngle
} from '@/shared/diagrams/core/MathFactory';





export const CongruenciaLLL = () => {






  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const C_PRIM = theme.carbon;
    const C_ACC  = theme.terracota;
    const C_POL1 = theme.salvia;
    const C_POL2 = theme.pavo;

    const SNAP = 0.5;
    const pCfg = { size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP };

    const A1 = createPoint(board, [0, 0], { name: 'A', ...pCfg, fixed: true }, theme);
    const B1 = createPoint(board, [5, 0], { name: 'B', ...pCfg, fixed: true }, theme);
    const C1 = createPoint(board, [1.5, 4], { name: 'C', ...pCfg }, theme);

    const segAB1 = createSegment(board, [A1, B1], { strokeColor: C_PRIM, strokeWidth: 3 }, theme);
    const segBC1 = createSegment(board, [B1, C1], { strokeColor: C_PRIM, strokeWidth: 3 }, theme);
    const segCA1 = createSegment(board, [C1, A1], { strokeColor: C_PRIM, strokeWidth: 3 }, theme);
    createPolygon(board, [A1, B1, C1], { fillColor: C_POL1, fillOpacity: 0.07, borders: { visible: false }, vertices: { visible: false } }, theme);

    const A2 = createPoint(board, [0, -3], { name: "A'", size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, fixed: true }, theme);
    const B2 = createPoint(board, [() => A2.X() + A1.Dist(B1), () => A2.Y()], { name: "B'", size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, fixed: true }, theme);

    const circA2 = createCircle(board, [A2, () => A1.Dist(C1)], { visible: false }, theme);
    const circB2 = createCircle(board, [B2, () => B1.Dist(C1)], { visible: false }, theme);
    const C2 = board.create('intersection', [circA2, circB2, 0], { name: "C'", size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false });

    const segAB2 = createSegment(board, [A2, B2], { strokeColor: C_PRIM, strokeWidth: 3 }, theme);
    const segBC2 = createSegment(board, [B2, C2], { strokeColor: C_PRIM, strokeWidth: 3 }, theme);
    const segCA2 = createSegment(board, [C2, A2], { strokeColor: C_PRIM, strokeWidth: 3 }, theme);
    createPolygon(board, [A2, B2, C2], { fillColor: C_POL2, fillOpacity: 0.07, borders: { visible: false }, vertices: { visible: false } }, theme);

    const C_ANG = theme.ocre;
    const angleA1 = createAngle(board, [B1, A1, C1], { name: '∠A', radius: 0.6, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector', visible: false }, theme) as any;
    const angleB1 = createAngle(board, [C1, B1, A1], { name: '∠B', radius: 0.6, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector', visible: false }, theme) as any;
    const angleC1 = createAngle(board, [A1, C1, B1], { name: '∠C', radius: 0.6, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector', visible: false }, theme) as any;
    const angleA2 = createAngle(board, [C2, A2, B2], { name: '∠A', radius: 0.6, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector', visible: false }, theme) as any;
    const angleB2 = createAngle(board, [A2, B2, C2], { name: '∠B', radius: 0.6, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector', visible: false }, theme) as any;
    const angleC2 = createAngle(board, [B2, C2, A2], { name: '∠C', radius: 0.6, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector', visible: false }, theme) as any;

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
        const t0 = createPoint(board, [() => cx() + dy()*.28, () => cy() - dx()*.28], { visible: false }, theme);
        const t1 = createPoint(board, [() => cx() - dy()*.28, () => cy() + dx()*.28], { visible: false }, theme);
        ts.push(createSegment(board, [t0, t1], { strokeColor: C_ACC, strokeWidth: 2.2, visible: true }, theme) as any);
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
      return `<div style="font-family: var(--font-serif); color:${theme.carbon}; line-height:1.3;">
        <strong style="font-size:1.1rem;">Criterio LLL</strong><br/>
        <small>AB = ${c.toFixed(1)} &nbsp; BC = ${a.toFixed(1)}</small><br/>
        <small>CA = ${b.toFixed(1)}</small>
      </div>`;
    }], { fixed: true, anchorX: 'left', anchorY: 'top' });






    const obs = new MutationObserver(() => {
      if (board) {   }
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

      // Registrar elementos para interactividad y auditoría
      els.segAB1 = segAB1;
        els.segBC1 = segBC1;
        els.segCA1 = segCA1;
        els.segAB2 = segAB2;
        els.segBC2 = segBC2;
        els.segCA2 = segCA2;
        els.angleA1 = angleA1;
        els.angleB1 = angleB1;
        els.angleC1 = angleC1;
        els.angleA2 = angleA2;
        els.angleB2 = angleB2;
        els.angleC2 = angleC2;
        els.ticksAB = ticksAB;
        els.ticksBC = ticksBC;
        els.ticksCA = ticksCA;
        els.infoText = infoText;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { segAB1, segBC1, segCA1, segAB2, segBC2, segCA2, angleA1, angleB1, angleC1, angleA2, angleB2, angleC2, ticksAB, ticksBC, ticksCA } = els;
      if (!els.board) return;


    const hGlobal = isHighlight('globalmente-congruentes');
    const hLados = isHighlight('lados');
    const hLadoAB = isHighlight('lado-ab');
    const hLadoBC = isHighlight('lado-bc');
    const hLadoCA = isHighlight('lado-ca');
    const hLAL = isHighlight('lal-axiom');
    const anyH = hGlobal || hLados || hLadoAB || hLadoBC || hLadoCA || hLAL;
    const showAll = !anyH;

    const C_ACC = theme.terracota;
    const C_PRIM = theme.carbon;
    const C_ANG = theme.ocre;

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
    };;

  return (
    <MathBoard
      boundingbox={[-4, 9, 9, -9]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra <span className="font-bold not-italic text-terracota">C</span>: ambos tri&aacute;ngulos son congruentes
      </div>
    </MathBoard>
  );
};
