import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createLine, createSegment, createPolygon, createAngle
} from '@/shared/diagrams/core/MathFactory';





export const TrianguloIsosceles = () => {






  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const C_PRIM = theme.carbon;
    const C_ACC  = theme.terracota;
    const C_ANG  = theme.salvia;
    const C_POL  = theme.pavo;

    const SNAP = 0.5;
    const pCfg = { size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP };

    const A = createPoint(board, [-2.5, -2], { name: 'A', ...pCfg }, theme);
    const B = createPoint(board, [2.5, -2], { name: 'B', ...pCfg }, theme);
    const C = createPoint(board, [0, 3], { name: 'C', ...pCfg }, theme);

    const poly = createPolygon(board, [A, B, C], {
      fillColor: C_POL, fillOpacity: 0.06,
      borders: { strokeWidth: 2.5, strokeColor: C_PRIM },
      vertices: { visible: false }
    }, theme);

    const angleA = createAngle(board, [B, A, C], { name: '&alpha;', radius: 0.85, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.35, type: 'sector', visible: false }, theme) as any;
    const angleB = createAngle(board, [C, B, A], { name: '&alpha;', radius: 0.85, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.35, type: 'sector', visible: false }, theme) as any;



    const sides = { AB: (poly as any).borders[0], AC: (poly as any).borders[1], BC: (poly as any).borders[2] };

    const mkTick = (p: any, q: any) => {
      const mA = createPoint(board, [() => (p.X() + q.X()) / 2, () => (p.Y() + q.Y()) / 2], { visible: false }, theme);
      const t0 = board.create('point', [
        () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return mA.X() + dy/len * 0.28; },
        () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return mA.Y() - dx/len * 0.28; }
      ], { visible: false });
      const t1 = board.create('point', [
        () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return mA.X() - dy/len * 0.28; },
        () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return mA.Y() + dx/len * 0.28; }
      ], { visible: false });
      return createSegment(board, [t0, t1], { strokeColor: C_ACC, strokeWidth: 2.2, visible: false }, theme) as any;
    };

    const congAC = mkTick(A, C);
    const congBC = mkTick(B, C);

    const midAB = board.create('midpoint', [A, B], { visible: false });
    const lineAB = createLine(board, [A, B], { visible: false }, theme);
    const bisector = board.create('perpendicular', [lineAB, midAB], { visible: false });
    C.setAttribute({ attractors: [bisector], attractorDistance: 0.3, snatchDistance: 0.6 });

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

    const infoText = board.create('text', [
      -4.5, 4.5,
      () => {
        const dAC = C.Dist(A), dBC = C.Dist(B);
        const tol = 0.15;
        const isIsosc = Math.abs(dAC - dBC) < tol;

        congAC.setAttribute({ visible: isIsosc });
        congBC.setAttribute({ visible: isIsosc });

        if (isIsosc) {
          sides.AC.setAttribute({ strokeWidth: 3.5, strokeColor: C_ACC });
          sides.BC.setAttribute({ strokeWidth: 3.5, strokeColor: C_ACC });
          sides.AB.setAttribute({ strokeWidth: 2.5, strokeColor: C_PRIM });
          angleA.setAttribute({ visible: true });
          angleB.setAttribute({ visible: true });
        } else {
          sides.AC.setAttribute({ strokeWidth: 2.5, strokeColor: C_PRIM });
          sides.BC.setAttribute({ strokeWidth: 2.5, strokeColor: C_PRIM });
          sides.AB.setAttribute({ strokeWidth: 2.5, strokeColor: C_PRIM });
          angleA.setAttribute({ visible: false });
          angleB.setAttribute({ visible: false });
        }

        return `<div style="font-family: var(--font-serif); color: ${theme.carbon}; line-height:1.5;">
          <strong style="font-size: 1.15rem; color:${isIsosc ? theme.terracota : theme.carbon};">${isIsosc ? 'Tri\u00e1ngulo Is\u00f3sceles' : 'Tri\u00e1ngulo Escaleno'}</strong><br/>
          <small>AC = ${dAC.toFixed(2)} &nbsp; BC = ${dBC.toFixed(2)}</small>
        </div>`;
      }
    ], { fixed: true, anchorX: 'left', anchorY: 'top' });

      // Registrar elementos para interactividad y auditoría
      els.A = A;
        els.B = B;
        els.C = C;
        els.poly = poly;
        els.sides = sides;
        els.angleA = angleA;
        els.angleB = angleB;
        els.congAC = congAC;
        els.congBC = congBC;
        els.infoText = infoText;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { A, B, C, poly, sides, angleA, angleB, congAC, congBC } = els;
      if (!els.board) return;


    const C_PRIM = theme.carbon;
    const C_ACC  = theme.terracota;
    const C_ANG  = theme.salvia;

    const hLados = isHighlight('lados-iguales');
    const hAngulos = isHighlight('angulos-iguales');
    const hTri = isHighlight('triangulo');
    const anyH = hLados || hAngulos || hTri;
    const showAll = !anyH;

    const vOp = anyH ? 0.12 : 1;

    [A, B, C].forEach((p: any) => p.setAttribute({
      strokeOpacity: showAll ? 1 : vOp,
      fillOpacity: showAll ? 1 : vOp,
      size: hTri ? 7 : 5,
      fillColor: hTri ? C_ACC : C_PRIM,
      strokeColor: hTri ? C_ACC : C_PRIM
    }));

    sides.AC.setAttribute({ strokeColor: hLados ? C_ACC : C_PRIM, strokeWidth: hLados ? 4 : 2.5, strokeOpacity: showAll ? 1 : vOp });
    sides.BC.setAttribute({ strokeColor: hLados ? C_ACC : C_PRIM, strokeWidth: hLados ? 4 : 2.5, strokeOpacity: showAll ? 1 : vOp });
    sides.AB.setAttribute({ strokeColor: C_PRIM, strokeWidth: 2.5, strokeOpacity: showAll ? 1 : vOp });

    congAC.setAttribute({ strokeOpacity: showAll ? 1 : vOp });
    congBC.setAttribute({ strokeOpacity: showAll ? 1 : vOp });

    angleA.setAttribute({
      fillColor: hAngulos ? C_ACC : C_ANG,
      strokeColor: hAngulos ? C_ACC : C_ANG,
      fillOpacity: hAngulos ? 0.5 : 0.35,
      strokeOpacity: showAll ? 1 : vOp
    });
    angleB.setAttribute({
      fillColor: hAngulos ? C_ACC : C_ANG,
      strokeColor: hAngulos ? C_ACC : C_ANG,
      fillOpacity: hAngulos ? 0.5 : 0.35,
      strokeOpacity: showAll ? 1 : vOp
    });

    poly.setAttribute({ fillOpacity: hTri ? 0.2 : 0.06 });
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
        Arrastra <span className="font-bold not-italic text-terracota">C</span> hacia el centro para hacerlo is&oacute;sceles
      </div>
    </MathBoard>
  );
};
