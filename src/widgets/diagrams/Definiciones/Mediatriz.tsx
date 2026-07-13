import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createSegment, createGlider, createPolygon
} from '@/shared/diagrams/core/MathFactory';





export const Mediatriz = () => {






  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const C_PRIM  = theme.ocre;
    const C_MED   = theme.terracota;
    const C_EQ    = theme.salvia;
    const C_ORTHO = theme.pavo;

    const SNAP = 0.5;
    const A = createPoint(board, [-3.5, -1], { name: 'A', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP }, theme);
    const B = createPoint(board, [3, 1.5], { name: 'B', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP }, theme);

    const segmento = createSegment(board, [A, B], { strokeColor: C_PRIM, strokeWidth: 2.5 }, theme);

    const M = board.create('midpoint', [A, B], { name: 'M', size: 5, fillColor: C_MED, strokeColor: C_MED });

    const mediatriz = board.create('perpendicular', [segmento, M], {
      strokeColor: C_MED, strokeWidth: 2.5
    });

    const P = createGlider(board, [0, 3, mediatriz], { name: 'P', size: 4, fillColor: C_EQ, strokeColor: C_EQ }, theme);

    const distPA = createSegment(board, [P, A], { strokeColor: C_EQ, strokeWidth: 2, dash: 2 }, theme);
    const distPB = createSegment(board, [P, B], { strokeColor: C_EQ, strokeWidth: 2, dash: 2 }, theme);

    const sqSize = 0.45;
    const segDir = () => {
      const dx = B.X() - A.X(), dy = B.Y() - A.Y();
      const len = Math.hypot(dx, dy);
      if (len < 1e-6) return { x: 1, y: 0 };
      return { x: dx / len, y: dy / len };
    };
    const perpDir = () => {
      const d = segDir();
      return { x: -d.y, y: d.x };
    };

    const sq0 = createPoint(board, [() => M.X(), () => M.Y()], { visible: false }, theme);
    const sq1 = board.create('point', [
      () => { const d = segDir(); return M.X() + d.x * sqSize; },
      () => { const d = segDir(); return M.Y() + d.y * sqSize; }
    ], { visible: false });
    const sq2 = board.create('point', [
      () => { const d = segDir(); const p = perpDir(); return M.X() + d.x * sqSize + p.x * sqSize; },
      () => { const d = segDir(); const p = perpDir(); return M.Y() + d.y * sqSize + p.y * sqSize; }
    ], { visible: false });
    const sq3 = board.create('point', [
      () => { const p = perpDir(); return M.X() + p.x * sqSize; },
      () => { const p = perpDir(); return M.Y() + p.y * sqSize; }
    ], { visible: false });

    const angRecto = createPolygon(board, [sq0, sq1, sq2, sq3], {
      fillColor: C_ORTHO, fillOpacity: 0.35,
      strokeColor: C_ORTHO, strokeWidth: 1.5,
      vertices: { visible: false },
      borders: { strokeColor: C_ORTHO, strokeWidth: 1.5 },
      visible: false
    }, theme);

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
      return createSegment(board, [t0, t1], { strokeColor: C_PRIM, strokeWidth: 2.2, visible: false }, theme) as any;
    };

    const congAM = mkTick(A, M);
    const congMB = mkTick(M, B);

    const infoText = board.create('text', [
      -5.5, 5.5,
      () => {
        const dPA = P.Dist(A), dPB = P.Dist(B);
        return `<div style="font-family: var(--font-serif); color: ${theme.carbon}; line-height:1.3;">
          <strong style="font-size: 1.1rem; color:${theme.terracota};">Equidistancia</strong><br/>
          <small>PA = ${dPA.toFixed(2)}</small><br/>
          <small>PB = ${dPB.toFixed(2)}</small><br/>
          <small style="color:${dPA === dPB ? theme.musgo : theme.granada};">
            ${Math.abs(dPA - dPB) < 0.01 ? 'PA \u2261 PB' : 'PA \u2260 PB'}
          </small>
        </div>`;
      }
    ], { fixed: true, anchorX: 'left', anchorY: 'top' });

      // Registrar elementos para interactividad y auditoría
      els.A = A;
        els.B = B;
        els.segmento = segmento;
        els.M = M;
        els.mediatriz = mediatriz;
        els.P = P;
        els.distPA = distPA;
        els.distPB = distPB;
        els.angRecto = angRecto;
        els.congAM = congAM;
        els.congMB = congMB;
        els.infoText = infoText;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { A, B, segmento, M, mediatriz, P, distPA, distPB, angRecto, congAM, congMB } = els;
      const isExtr = isHighlight('extremo');
    const isEq = isHighlight('equidistancia');
    const isPP = isHighlight('punto-p');
    const isMed = isHighlight('mediatriz');
    const isMid = isHighlight('punto-medio');
    const isSeg = isHighlight('segmento');
    const showAll = !isExtr && !isEq && !isPP && !isMed && !isMid && !isSeg;

    A.setAttribute({ strokeOpacity: isExtr || showAll ? 1 : 0.3, fillOpacity: isExtr || showAll ? 1 : 0.3, size: isExtr ? 7 : 5 });
    B.setAttribute({ strokeOpacity: isExtr || showAll ? 1 : 0.3, fillOpacity: isExtr || showAll ? 1 : 0.3, size: isExtr ? 7 : 5 });

    segmento.setAttribute({ strokeOpacity: isSeg || showAll ? 1 : 0.3, strokeWidth: isSeg ? 4 : 2.5 });

    distPA.setAttribute({ strokeOpacity: isEq || showAll ? 1 : 0.2, strokeWidth: isEq ? 3 : 2 });
    distPB.setAttribute({ strokeOpacity: isEq || showAll ? 1 : 0.2, strokeWidth: isEq ? 3 : 2 });
    P.setAttribute({ strokeOpacity: isPP || isEq || showAll ? 1 : 0.3, fillOpacity: isPP || isEq || showAll ? 1 : 0.3, size: isPP ? 6 : 4 });

    mediatriz.setAttribute({ strokeOpacity: isMed || showAll ? 1 : 0.3, strokeWidth: isMed ? 4 : 2.5 });

    angRecto.setAttribute({ visible: isMed || showAll, strokeOpacity: isMed || showAll ? 1 : 0.2, fillOpacity: isMed ? 0.5 : 0.2 });
    congAM.setAttribute({ visible: isMid || isMed || showAll });
    congMB.setAttribute({ visible: isMid || isMed || showAll });

    M.setAttribute({ strokeOpacity: isMid || isMed || showAll ? 1 : 0.3, fillOpacity: isMid || isMed || showAll ? 1 : 0.3, size: isMid ? 6 : 5 });
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
        Arrastra <span className="font-bold not-italic text-terracota">P</span> sobre la mediatriz
      </div>
    </MathBoard>
  );
};
