import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createCircle, createPolygon, createAngle
} from '@/shared/diagrams/core/MathFactory';





export const SumaAngulos = () => {






  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const C_PRIM = theme.carbon;
    const C_ANG  = theme.salvia;
    const C_POL  = theme.pavo;

    const SNAP = 0.5;
    const A = createPoint(board, [-2.5, -2], { name: 'A', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP }, theme);
    const B = createPoint(board, [3, -1.5], { name: 'B', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP }, theme);
    const C = createPoint(board, [0, 3], { name: 'C', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP }, theme);

    const poly = createPolygon(board, [A, B, C], {
      fillColor: C_POL, fillOpacity: 0.08,
      borders: { strokeWidth: 2.5, strokeColor: C_PRIM },
      vertices: { visible: false }
    }, theme);

    const angleA = createAngle(board, [B, A, C], { name: '&alpha;', radius: 0.9, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.3, type: 'sector' }, theme) as any;
    const angleB = createAngle(board, [C, B, A], { name: '&beta;',  radius: 0.9, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.3, type: 'sector' }, theme) as any;
    const angleC = createAngle(board, [A, C, B], { name: '&gamma;', radius: 0.9, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.3, type: 'sector' }, theme) as any;

    const infoText = board.create('text', [
      -4.5, 4.5,
      () => {
        const vA = angleA.Value(), vB = angleB.Value(), vC = angleC.Value();
        const sum = vA + vB + vC;
        const sumDeg = Math.round(sum * 180 / Math.PI);
        return `<div style="font-family: var(--font-serif); color: ${theme.carbon}; line-height:1.5;">
          <strong style="font-size: 1.15rem;">Suma de &aacute;ngulos</strong><br/>
          &alpha; + &beta; + &gamma; = ${sumDeg}&deg;<br/>
          <strong style="color:${sumDeg === 180 ? theme.musgo : theme.granada};">
            ${sumDeg === 180 ? '\u2261 180\u00b0' : '\u2260 180\u00b0'}
          </strong>
          <br/><small>(${Math.round(vA*180/Math.PI)}&deg; + ${Math.round(vB*180/Math.PI)}&deg; + ${Math.round(vC*180/Math.PI)}&deg;)</small>
        </div>`;
      }
    ], { fixed: true, anchorX: 'left', anchorY: 'top' });



    const midAB = board.create('midpoint', [A, B], { visible: false });
    const midBC = board.create('midpoint', [B, C], { visible: false });
    const midCA = board.create('midpoint', [C, A], { visible: false });
    const thalesAB = createCircle(board, [midAB, A], { visible: false }, theme);
    const thalesBC = createCircle(board, [midBC, B], { visible: false }, theme);
    const thalesCA = createCircle(board, [midCA, C], { visible: false }, theme);
    C.setAttribute({ attractors: [thalesAB], attractorDistance: 0.3, snatchDistance: 0.5 });
    A.setAttribute({ attractors: [thalesBC], attractorDistance: 0.3, snatchDistance: 0.5 });
    B.setAttribute({ attractors: [thalesCA], attractorDistance: 0.3, snatchDistance: 0.5 });

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
        els.poly = poly;
        els.angleA = angleA;
        els.angleB = angleB;
        els.angleC = angleC;
        els.infoText = infoText;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { A, B, C, poly, angleA, angleB, angleC } = els;
      const hAngulos = isHighlight('angulos');
    const hTri = isHighlight('triangulo');
    const showAll = !hAngulos && !hTri;

    const dim = (active: boolean) => active || showAll ? 1 : 0.2;

    [angleA, angleB, angleC].forEach((a: any) => a.setAttribute({
      fillOpacity: hAngulos ? 0.5 : 0.3,
      strokeOpacity: dim(hAngulos)
    }));

    [A, B, C].forEach((p: any) => p.setAttribute({ strokeOpacity: dim(showAll), fillOpacity: dim(showAll) }));
    poly.setAttribute({ fillOpacity: hTri ? 0.2 : 0.08 });
    ((poly as any).borders as any[]).forEach((b: any) => b.setAttribute({ strokeOpacity: dim(showAll) }));
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
        Arrastra los v&eacute;rtices: la suma siempre es 180&deg;
      </div>
    </MathBoard>
  );
};
