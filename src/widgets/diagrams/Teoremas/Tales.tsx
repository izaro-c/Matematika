import { useRef } from 'react';
import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createLine, createSegment, createGlider, createPolygon
} from '@/shared/diagrams/core/MathFactory';





export const Tales = () => {


  const updatingRef = useRef(false);




  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const C_PRIM = theme.carbon;
    const C_ACC  = theme.terracota;
    const C_PAR  = theme.salvia;
    const C_POL  = theme.pavo;

    const SNAP = 0.5;
    const A = createPoint(board, [-3, -2], { name: 'A', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP }, theme);
    const B = createPoint(board, [3, -2], { name: 'B', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP }, theme);
    const C = createPoint(board, [4, 3], { name: 'C', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP }, theme);

    const segAB = createSegment(board, [A, B], { strokeColor: C_PRIM, strokeWidth: 2 }, theme);
    const segBC = createSegment(board, [B, C], { strokeColor: C_PAR, strokeWidth: 2.5 }, theme);
    const segCA = createSegment(board, [C, A], { strokeColor: C_PRIM, strokeWidth: 2 }, theme);

    const poly = createPolygon(board, [A, B, C], {
      fillColor: C_POL, fillOpacity: 0.06,
      borders: { visible: false }, vertices: { visible: false }
    }, theme);

    const lineBC = createLine(board, [B, C], { visible: false }, theme);
    const lineAB = createLine(board, [A, B], { visible: false }, theme);
    const lineCA = createLine(board, [C, A], { visible: false }, theme);

    const D = createGlider(board, [-1, -2, segAB], { name: 'D', size: 4, fillColor: C_ACC, strokeColor: C_ACC, showInfobox: false }, theme);
    const parDE = board.create('parallel', [lineBC, D], { visible: false });
    const E = board.create('intersection', [parDE, lineCA, 0], { name: 'E', size: 4, fillColor: C_ACC, strokeColor: C_ACC, showInfobox: false });

    const parE_line = board.create('parallel', [lineBC, E], { visible: false });
    const Dcomp = board.create('intersection', [parE_line, lineAB, 0], { visible: false });

    D.on('drag', () => {
      if (updatingRef.current) return;
      updatingRef.current = true;
      D.setAttribute({ fillColor: C_ACC, strokeColor: C_ACC });
      updatingRef.current = false;
    });

    E.on('drag', () => {
      if (updatingRef.current) return;
      updatingRef.current = true;
      const nx = Dcomp.X(), ny = Dcomp.Y();
      D.moveTo([nx, ny], 0);
      updatingRef.current = false;
    });

    const segDE = createSegment(board, [D, E], { strokeColor: C_PAR, strokeWidth: 2.5, dash: 2 }, theme);
    const segAD = createSegment(board, [A, D], { strokeColor: C_ACC, strokeWidth: 2, dash: 1 }, theme);
    const segAE = createSegment(board, [A, E], { strokeColor: C_ACC, strokeWidth: 2, dash: 1 }, theme);

    const infoText = board.create('text', [
      -5.5, 5.5,
      () => {
        const dAD = A.Dist(D), dDB = D.Dist(B);
        const dAE = A.Dist(E), dEC = E.Dist(C);
        const ratio1 = dAD / Math.max(dDB, 0.001);
        const ratio2 = dAE / Math.max(dEC, 0.001);
        const ok = Math.abs(ratio1 - ratio2) < 0.01;
        return `<div style="font-family: var(--font-serif); color: ${theme.carbon}; line-height:1.5;">
          <strong style="font-size: 1.1rem;">Teorema de Tales</strong><br/>
          <small>DE \u2225 BC</small><br/>
          <span>AD/DB = ${ratio1.toFixed(2)}</span><br/>
          <span>AE/EC = ${ratio2.toFixed(2)}</span><br/>
          <strong style="color:${ok ? theme.musgo : theme.granada};">
            ${ok ? 'AD/DB \u2261 AE/EC' : 'AD/DB \u2260 AE/EC'}
          </strong>
        </div>`;
      }
    ], { fixed: true, anchorX: 'left', anchorY: 'top' });

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

      // Registrar elementos para interactividad y auditoría
      els.A = A;
        els.B = B;
        els.C = C;
        els.D = D;
        els.E = E;
        els.poly = poly;
        els.segAB = segAB;
        els.segBC = segBC;
        els.segCA = segCA;
        els.segDE = segDE;
        els.segAD = segAD;
        els.segAE = segAE;
        els.infoText = infoText;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { A, B, C, D, E, poly, segAB, segBC, segCA, segDE, segAD, segAE } = els;
      const hRecta = isHighlight('recta-de');
    const hTri = isHighlight('triangulo-abc');
    const hSegD = isHighlight('segmento-ad');
    const hSegE = isHighlight('segmento-ae');
    const hProp = isHighlight('proporcion');
    const showAll = !hRecta && !hTri && !hSegD && !hSegE && !hProp;

    const dim = (active: boolean) => active || showAll ? 1 : 0.15;

    segBC.setAttribute({ strokeOpacity: dim(hRecta), strokeWidth: hRecta ? 4 : 2.5 });
    segDE.setAttribute({ strokeOpacity: dim(hRecta), strokeWidth: hRecta ? 4 : 2.5 });

    segAB.setAttribute({ strokeOpacity: dim(showAll) });
    segCA.setAttribute({ strokeOpacity: dim(showAll) });
    segAD.setAttribute({ strokeOpacity: dim(hSegD || hProp || showAll), strokeWidth: hSegD ? 3 : 2 });
    segAE.setAttribute({ strokeOpacity: dim(hSegE || hProp || showAll), strokeWidth: hSegE ? 3 : 2 });

    [A, B, C].forEach((p: any) => p.setAttribute({ strokeOpacity: dim(showAll), fillOpacity: dim(showAll) }));
    [D, E].forEach((p: any) => p.setAttribute({
      strokeOpacity: dim(hRecta || hSegD || hSegE || hProp || showAll),
      fillOpacity: dim(hRecta || hSegD || hSegE || hProp || showAll),
      size: (hSegD || hSegE) ? 6 : 4,
      fillColor: hTri ? theme.terracota : theme.carbon
    }));
    poly.setAttribute({ fillOpacity: hTri ? 0.18 : 0.06 });
    };;

  return (
    <MathBoard
      boundingbox={[-6, 6, 6, -5]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra <span className="font-bold not-italic text-terracota">D</span> o <span className="font-bold not-italic text-terracota">E</span>
      </div>
    </MathBoard>
  );
};
