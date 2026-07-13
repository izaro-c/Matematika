import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createLine
} from '@/shared/diagrams/core/MathFactory';





export const DosRectasUnPunto = () => {






  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const C_LINE = theme.carbon;
    const C_POINT = theme.terracota;

    const A = createPoint(board, [-3, 2], { name: 'A', size: 4, fillColor: C_LINE, strokeColor: C_LINE, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 }, theme);
    const B = createPoint(board, [3, -1], { name: 'B', size: 4, fillColor: C_LINE, strokeColor: C_LINE, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 }, theme);
    const C = createPoint(board, [-2, -2], { name: 'C', size: 4, fillColor: C_LINE, strokeColor: C_LINE, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 }, theme);
    const D = createPoint(board, [4, 2], { name: 'D', size: 4, fillColor: C_LINE, strokeColor: C_LINE, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 }, theme);

    const line1 = createLine(board, [A, B], { strokeColor: C_LINE, strokeWidth: 2 }, theme);
    const line2 = createLine(board, [C, D], { strokeColor: C_LINE, strokeWidth: 2 }, theme);

    const P = board.create('intersection', [line1, line2, 0], { name: 'P', size: 6, fillColor: C_POINT, strokeColor: C_POINT });

    const infoText = board.create('text', [-4.5, 4.5, () => {
      const dPA = P.Dist(A), dPB = P.Dist(B), dPC = P.Dist(C), dPD = P.Dist(D);
      const onAB = Math.abs(dPA + dPB - A.Dist(B)) < 0.1;
      const onCD = Math.abs(dPC + dPD - C.Dist(D)) < 0.1;
      return `<div style="font-family: var(--font-serif); color:${theme.carbon}; line-height:1.3;">
        <strong style="font-size:1.1rem;">Intersecci&oacute;n &uacute;nica</strong><br/>
        <small>P ∈ l ∩ m</small><br/>
        <small>${onAB && onCD ? 'Un &uacute;nico punto com&uacute;n' : 'Rectas paralelas'}</small>
      </div>`;
    }], { fixed: true, anchorX: 'left', anchorY: 'top' });






    const obs = new MutationObserver(() => {
      if (board) {   }
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

      // Registrar elementos para interactividad y auditoría
      els.A = A;
        els.B = B;
        els.C = C;
        els.D = D;
        els.P = P;
        els.line1 = line1;
        els.line2 = line2;
        els.infoText = infoText;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { A, B, C, D, P, line1, line2 } = els;
      if (!els.board) return;


    const hRectas = isHighlight('rectas');
    const hPunto = isHighlight('punto');
    const showAll = !hRectas && !hPunto;

    const op = (t: any) => t || showAll ? 1 : 0.15;
    const C_ACC = theme.terracota;

    line1.setAttribute({ strokeOpacity: op(hRectas), strokeColor: hRectas ? C_ACC : theme.carbon, strokeWidth: hRectas ? 3 : 2 });
    line2.setAttribute({ strokeOpacity: op(hRectas), strokeColor: hRectas ? C_ACC : theme.carbon, strokeWidth: hRectas ? 3 : 2 });
    P.setAttribute({ strokeOpacity: op(hPunto), fillOpacity: op(hPunto), size: hPunto ? 8 : 6 });
    [A, B, C, D].forEach((p: any) => p.setAttribute({ strokeOpacity: op(showAll), fillOpacity: op(showAll) }));
    };;

  return (
    <MathBoard
      boundingbox={[-5, 5, 5, -5]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra los puntos: dos rectas se cortan en a lo sumo un punto
      </div>
    </MathBoard>
  );
};
