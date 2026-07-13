import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createSegment
} from '@/shared/diagrams/core/MathFactory';





export const LemaPuntoMedio = () => {






  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const C_PRIM = theme.carbon;
    const C_MED  = theme.terracota;

    const SNAP = 0.5;
    const A = createPoint(board, [-4, 0], { name: 'A', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP }, theme);
    const B = createPoint(board, [4, 0], { name: 'B', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP }, theme);

    const segmento = createSegment(board, [A, B], { strokeColor: C_PRIM, strokeWidth: 2.5 }, theme);
    const M = board.create('midpoint', [A, B], { name: 'M', size: 6, fillColor: C_MED, strokeColor: C_MED });

    const mkTick = (p: any, q: any) => {
      const mA = createPoint(board, [() => (p.X()+q.X())/2, () => (p.Y()+q.Y())/2], { visible: false }, theme);
      const dy = () => { const dx = q.X()-p.X(), dyy = q.Y()-p.Y(); const len = Math.hypot(dx,dyy)||1; return dyy/len; };
      const dx = () => { const dxx = q.X()-p.X(), dyy = q.Y()-p.Y(); const len = Math.hypot(dxx,dyy)||1; return dxx/len; };
      const t0 = createPoint(board, [() => mA.X()+dy()*.3, () => mA.Y()-dx()*.3], { visible: false }, theme);
      const t1 = createPoint(board, [() => mA.X()-dy()*.3, () => mA.Y()+dx()*.3], { visible: false }, theme);
      return createSegment(board, [t0, t1], { strokeColor: C_MED, strokeWidth: 2.2, visible: true }, theme) as any;
    };

    const congAM = mkTick(A, M);
    const congMB = mkTick(M, B);






    const obs = new MutationObserver(() => {
      if (board) {   }
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

      // Registrar elementos para interactividad y auditoría
      els.A = A;
        els.B = B;
        els.M = M;
        els.segmento = segmento;
        els.congAM = congAM;
        els.congMB = congMB;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { A, B, M, segmento, congAM, congMB } = els;
      if (!els.board) return;


    const hSeg = isHighlight('segmento');
    const hMedio = isHighlight('punto-medio');
    const hCong = isHighlight('congruencia');
    const showAll = !hSeg && !hMedio && !hCong;

    const op = (t: any) => t || showAll ? 1 : 0.15;
    const C_ACC = theme.terracota;
    const C_PRIM = theme.carbon;

    segmento.setAttribute({ strokeOpacity: op(hSeg), strokeColor: hSeg ? C_ACC : C_PRIM, strokeWidth: hSeg ? 4 : 2.5 });
    M.setAttribute({ strokeOpacity: op(hMedio), fillOpacity: op(hMedio), size: hMedio ? 8 : 6, fillColor: C_ACC, strokeColor: C_ACC });
    [congAM, congMB].forEach((t: any) => t.setAttribute({ visible: true, strokeOpacity: op(hCong), strokeColor: C_ACC }));
    [A, B].forEach((p: any) => p.setAttribute({ strokeOpacity: op(showAll), fillOpacity: op(showAll) }));
    };;

  return (
    <MathBoard
      boundingbox={[-6, 4, 6, -4]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >

    </MathBoard>
  );
};
