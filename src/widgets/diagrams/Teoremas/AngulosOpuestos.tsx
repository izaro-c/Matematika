import { getCSSVar } from '@/shared/diagrams/core/MathUtils';
import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createLine, createAngle
} from '@/shared/diagrams/core/MathFactory';





export const AngulosOpuestos = () => {






  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const C_O   = theme.terracota;
    const C_A   = theme.salvia;
    const C_B   = theme.pavo;
    const C_LINE = theme.carbon;

    const O = createPoint(board, [0, 0], { name: 'O', size: 6, fillColor: C_O, strokeColor: C_O, fixed: true, showInfobox: false }, theme);

    const A = createPoint(board, [3, 2], { name: 'A', size: 4, fillColor: C_A, strokeColor: C_A, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 }, theme);
    const B = createPoint(board, [-3.5, 1.5], { name: 'B', size: 4, fillColor: C_B, strokeColor: C_B, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 }, theme);

    const Ap = createPoint(board, [() => -A.X(), () => -A.Y()], { name: "A'", size: 4, fillColor: C_A, strokeColor: C_A, showInfobox: false }, theme);
    const Bp = createPoint(board, [() => -B.X(), () => -B.Y()], { name: "B'", size: 4, fillColor: C_B, strokeColor: C_B, showInfobox: false }, theme);

    createLine(board, [A, Ap], { strokeColor: C_LINE, strokeWidth: 2, fixed: true }, theme);
    createLine(board, [B, Bp], { strokeColor: C_LINE, strokeWidth: 2, fixed: true }, theme);

    const angleA1 = createAngle(board, [B, O, Ap], { name: '&alpha;', radius: 0.7, fillColor: C_A, strokeColor: C_A, fillOpacity: 0.2, type: 'sector' }, theme) as any;
    const angleA2 = createAngle(board, [Bp, O, A], { name: '&alpha;', radius: 0.7, fillColor: C_A, strokeColor: C_A, fillOpacity: 0.2, type: 'sector' }, theme) as any;
    const angleB1 = createAngle(board, [A, O, B], { name: '&beta;',  radius: 0.7, fillColor: C_B, strokeColor: C_B, fillOpacity: 0.2, type: 'sector' }, theme) as any;
    const angleB2 = createAngle(board, [Ap, O, Bp], { name: '&beta;',  radius: 0.7, fillColor: C_B, strokeColor: C_B, fillOpacity: 0.2, type: 'sector' }, theme) as any;

    const orientAO = () => Math.atan2(A.Y(), A.X());
    const orientBO = () => Math.atan2(B.Y(), B.X());
    A.on('drag', () => {
      const aB = orientBO(), aA = orientAO();
      let diff = aA - aB;
      if (diff < 0) diff += 2 * Math.PI;
      if (diff < 0.05 || diff > 2 * Math.PI - 0.05) A.moveTo([B.X() * 0.5, B.Y() * 0.5], 0);
    });
    B.on('drag', () => {
      const aB = orientBO(), aA = orientAO();
      let diff = aB - aA;
      if (diff < 0) diff += 2 * Math.PI;
      if (diff < 0.05 || diff > 2 * Math.PI - 0.05) B.moveTo([A.X() * 0.5, A.Y() * 0.5], 0);
    });

      // Registrar elementos para interactividad y auditoría
      els.O = O;
        els.A = A;
        els.B = B;
        els.Ap = Ap;
        els.Bp = Bp;
        els.angleA1 = angleA1;
        els.angleA2 = angleA2;
        els.angleB1 = angleB1;
        els.angleB2 = angleB2;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { angleA1, angleA2, angleB1, angleB2 } = els;
      if (!els.board) return;


    const hAlpha = isHighlight('alpha');
    const hBeta = isHighlight('beta');
    const anyH = hAlpha || hBeta;
    const showAll = !anyH;

    const C_A = theme.salvia;
    const C_B = theme.pavo;

    const sop = (active: boolean) => active || showAll ? 1 : 0.08;

    angleA1.setAttribute({ fillOpacity: hAlpha ? 0.45 : 0.2, strokeOpacity: sop(hAlpha), strokeColor: C_A, fillColor: C_A, strokeWidth: hAlpha ? 3 : 1.5 });
    angleA2.setAttribute({ fillOpacity: hAlpha ? 0.45 : 0.2, strokeOpacity: sop(hAlpha), strokeColor: C_A, fillColor: C_A, strokeWidth: hAlpha ? 3 : 1.5 });
    angleB1.setAttribute({ fillOpacity: hBeta  ? 0.45 : 0.2, strokeOpacity: sop(hBeta),  strokeColor: C_B, fillColor: C_B, strokeWidth: hBeta  ? 3 : 1.5 });
    angleB2.setAttribute({ fillOpacity: hBeta  ? 0.45 : 0.2, strokeOpacity: sop(hBeta),  strokeColor: C_B, fillColor: C_B, strokeWidth: hBeta  ? 3 : 1.5 });
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
        Arrastra <span className="font-bold not-italic" style={{color:getCSSVar('--theme-salvia')}}>A</span> o <span className="font-bold not-italic" style={{color:getCSSVar('--theme-pavo')}}>B</span>
      </div>
    </MathBoard>
  );
};
