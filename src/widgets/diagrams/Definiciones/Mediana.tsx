import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createSegment
} from '@/shared/diagrams/core/MathFactory';





export const Mediana = () => {






  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const C_PRIM = theme.pavo;
    const C_MED  = theme.ocre;
    const C_BAR  = theme.terracota;
    const C_SIDE = theme.carbon;

    const SNAP = 0.5;
    const A = createPoint(board, [-2.5, -2], { name: 'A', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP }, theme);
    const B = createPoint(board, [3, -1.5], { name: 'B', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP }, theme);
    const C = createPoint(board, [0, 3], { name: 'C', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP }, theme);

    const ladoAB = createSegment(board, [A, B], { strokeColor: C_SIDE, strokeWidth: 2 }, theme);
    const ladoBC = createSegment(board, [B, C], { strokeColor: C_SIDE, strokeWidth: 2 }, theme);
    const ladoCA = createSegment(board, [C, A], { strokeColor: C_SIDE, strokeWidth: 2 }, theme);

    const M_AB = board.create('midpoint', [A, B], { name: 'M_c', size: 4, fillColor: C_MED, strokeColor: C_MED });
    const M_BC = board.create('midpoint', [B, C], { name: 'M_a', size: 4, fillColor: C_MED, strokeColor: C_MED });
    const M_CA = board.create('midpoint', [C, A], { name: 'M_b', size: 4, fillColor: C_MED, strokeColor: C_MED });

    const medA = createSegment(board, [A, M_BC], { strokeColor: C_MED, strokeWidth: 2.5, dash: 2 }, theme);
    const medB = createSegment(board, [B, M_CA], { strokeColor: C_MED, strokeWidth: 2.5, dash: 2 }, theme);
    const medC = createSegment(board, [C, M_AB], { strokeColor: C_MED, strokeWidth: 2.5, dash: 2 }, theme);

    const G = board.create('intersection', [medA, medB, 0], { name: 'G', size: 6, fillColor: C_BAR, strokeColor: C_BAR });

    const mkTick = (p: any, q: any) => {
      const mA = createPoint(board, [() => (p.X() + q.X()) / 2, () => (p.Y() + q.Y()) / 2], { visible: false }, theme);
      const t0 = board.create('point', [
        () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return mA.X() + dy/len * 0.25; },
        () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return mA.Y() - dx/len * 0.25; }
      ], { visible: false });
      const t1 = board.create('point', [
        () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return mA.X() - dy/len * 0.25; },
        () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return mA.Y() + dx/len * 0.25; }
      ], { visible: false });
      return createSegment(board, [t0, t1], { strokeColor: C_MED, strokeWidth: 2.2, visible: false }, theme) as any;
    };

    const halfTicks = [
      mkTick(A, M_AB), mkTick(M_AB, B),
      mkTick(B, M_BC), mkTick(M_BC, C),
      mkTick(C, M_CA), mkTick(M_CA, A)
    ];

    const infoText = board.create('text', [
      -4.5, 4.5,
      () => {
        const dAG = A.Dist(G), dGMbc = G.Dist(M_BC);
        const dBG = B.Dist(G), dGMcA = G.Dist(M_CA);
        const dCG = C.Dist(G), dGMAb = G.Dist(M_AB);
        return `<div style="font-family: var(--font-serif); color: ${theme.carbon}; line-height:1.3;">
          <strong style="font-size: 1.1rem; color:${theme.terracota};">Baricentro G</strong><br/>
          <small>AG/GM<sub>a</sub> = ${(dAG / Math.max(dGMbc, 0.001)).toFixed(2)}</small><br/>
          <small>BG/GM<sub>b</sub> = ${(dBG / Math.max(dGMcA, 0.001)).toFixed(2)}</small><br/>
          <small>CG/GM<sub>c</sub> = ${(dCG / Math.max(dGMAb, 0.001)).toFixed(2)}</small>
        </div>`;
      }
    ], { fixed: true, anchorX: 'left', anchorY: 'top' });

      // Registrar elementos para interactividad y auditoría
      els.A = A;
        els.B = B;
        els.C = C;
        els.ladoAB = ladoAB;
        els.ladoBC = ladoBC;
        els.ladoCA = ladoCA;
        els.M_AB = M_AB;
        els.M_BC = M_BC;
        els.M_CA = M_CA;
        els.medA = medA;
        els.medB = medB;
        els.medC = medC;
        els.G = G;
        els.halfTicks = halfTicks;
        els.infoText = infoText;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { A, B, C, ladoAB, ladoBC, ladoCA, M_AB, M_BC, M_CA, medA, medB, medC, G, halfTicks } = els;
      const hVertice = isHighlight('vertice');
    const hMedio = isHighlight('punto-medio');
    const hMediana = isHighlight('mediana');
    const hBaricentro = isHighlight('baricentro');
    const hLado = isHighlight('lado');
    const showAll = !hVertice && !hMedio && !hMediana && !hBaricentro && !hLado;

    [A, B, C].forEach((v: any) => v.setAttribute({
      strokeOpacity: hVertice || showAll ? 1 : 0.3,
      fillOpacity: hVertice || showAll ? 1 : 0.3,
      size: hVertice ? 7 : 5
    }));

    [ladoAB, ladoBC, ladoCA].forEach((l: any) => l.setAttribute({
      strokeOpacity: hLado || showAll ? 1 : 0.2
    }));

    [M_AB, M_BC, M_CA].forEach((m: any) => m.setAttribute({
      strokeOpacity: hMedio || showAll || hMediana ? 1 : 0.2,
      fillOpacity: hMedio || showAll || hMediana ? 1 : 0.2,
      size: hMedio ? 6 : 4
    }));

    halfTicks.forEach((t: any) => t.setAttribute({ visible: hMedio }));

    [medA, medB, medC].forEach((m: any) => m.setAttribute({
      strokeOpacity: hMediana || showAll || hBaricentro ? 1 : 0.15,
      strokeWidth: hMediana ? 3.5 : 2.5
    }));

    G.setAttribute({
      strokeOpacity: hBaricentro || showAll ? 1 : 0.2,
      fillOpacity: hBaricentro || showAll ? 1 : 0.2,
      size: hBaricentro ? 8 : 6
    });
    };;

  return (
    <MathBoard
      boundingbox={[-5, 5, 5, -5]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >

    </MathBoard>
  );
};
