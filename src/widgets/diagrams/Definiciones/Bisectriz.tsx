import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createLine, createSegment, createAngle
} from '@/shared/diagrams/core/MathFactory';





export const Bisectriz = () => {







  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const C_ANG = theme.ocre;
    const C_BIS = theme.salvia;
    const C_VERT = theme.terracota;

    const pointCfg = { size: 4, fillColor: C_VERT, strokeColor: C_VERT, showInfobox: false };

    const B = createPoint(board, [0, 0], { name: 'V', ...pointCfg }, theme);
    const A = createPoint(board, [3.5, -1.5], { name: 'A', ...pointCfg }, theme);
    const C = createPoint(board, [1.5, 3], { name: 'C', ...pointCfg }, theme);

    const lado1 = createSegment(board, [B, A], { strokeColor: C_ANG, strokeWidth: 2 }, theme);
    const lado2 = createSegment(board, [B, C], { strokeColor: C_ANG, strokeWidth: 2 }, theme);

    const bisecDir = board.create('point', [
      () => {
        const ux = A.X() - B.X(), uy = A.Y() - B.Y();
        const vx = C.X() - B.X(), vy = C.Y() - B.Y();
        const uLen = Math.hypot(ux, uy) || 1, vLen = Math.hypot(vx, vy) || 1;
        const dx = ux / uLen + vx / vLen, dy = uy / uLen + vy / vLen;
        const dLen = Math.hypot(dx, dy) || 1;
        return B.X() + dx / dLen;
      },
      () => {
        const ux = A.X() - B.X(), uy = A.Y() - B.Y();
        const vx = C.X() - B.X(), vy = C.Y() - B.Y();
        const uLen = Math.hypot(ux, uy) || 1, vLen = Math.hypot(vx, vy) || 1;
        const dx = ux / uLen + vx / vLen, dy = uy / uLen + vy / vLen;
        const dLen = Math.hypot(dx, dy) || 1;
        return B.Y() + dy / dLen;
      }
    ], { visible: false });

    const bisectriz = createLine(board, [B, bisecDir], {
      strokeColor: C_BIS, strokeWidth: 2.5, dash: 2,
      straightFirst: false, straightLast: true
    }, theme);

    const P = board.create('point', [
      () => {
        const ux = A.X() - B.X(), uy = A.Y() - B.Y();
        const vx = C.X() - B.X(), vy = C.Y() - B.Y();
        const uLen = Math.hypot(ux, uy) || 1, vLen = Math.hypot(vx, vy) || 1;
        const dx = ux / uLen + vx / vLen, dy = uy / uLen + vy / vLen;
        const dLen = Math.hypot(dx, dy) || 1;
        return B.X() + dx / dLen * 2.5;
      },
      () => {
        const ux = A.X() - B.X(), uy = A.Y() - B.Y();
        const vx = C.X() - B.X(), vy = C.Y() - B.Y();
        const uLen = Math.hypot(ux, uy) || 1, vLen = Math.hypot(vx, vy) || 1;
        const dx = ux / uLen + vx / vLen, dy = uy / uLen + vy / vLen;
        const dLen = Math.hypot(dx, dy) || 1;
        return B.Y() + dy / dLen * 2.5;
      }
    ], { visible: false });

    const aCfg = { name: '&alpha;', type: 'sector' as const, fillColor: C_BIS, strokeColor: C_BIS, fillOpacity: 0.2, radius: 1.2, label: { fontSize: 16, cssClass: 'font-serif font-bold italic' } };
    const a1ccw = board.create('angle', [A, B, P], aCfg);
    const a2ccw = board.create('angle', [P, B, C], aCfg);
    const a1cw = createAngle(board, [P, B, A], { ...aCfg, visible: false }, theme);
    const a2cw = createAngle(board, [C, B, P], { ...aCfg, visible: false }, theme);

    const totalAng = createAngle(board, [A, B, C], { visible: false, name: '', radius: 0.001 }, theme);
    const infoText = board.create('text', [
      -3.8, 4.5,
      () => {
        const total = (totalAng as any).Value();
        const half = total / 2;
        const totalDeg = Math.round(total * 180 / Math.PI);
        const halfDeg = Math.round(half * 180 / Math.PI);

        const aA = Math.atan2(A.Y() - B.Y(), A.X() - B.X());
        const aC = Math.atan2(C.Y() - B.Y(), C.X() - B.X());
        let ccwFromAtoC = aC - aA;
        if (ccwFromAtoC < 0) ccwFromAtoC += 2 * Math.PI;
        const useCCW = ccwFromAtoC <= Math.PI;

        (a1ccw as any).setAttribute({ visible: useCCW });
        (a2ccw as any).setAttribute({ visible: useCCW });
        (a1cw as any).setAttribute({ visible: !useCCW });
        (a2cw as any).setAttribute({ visible: !useCCW });

        return `<div style="font-family: var(--font-serif); color: ${theme.carbon};">
          <strong style="font-size: 1.1rem;">&alpha; = ${halfDeg}&deg;</strong><br/>
          <i>&Aacute;ngulo: ${totalDeg}&deg;</i>
        </div>`;
      }
    ], { fixed: true, anchorX: 'left', anchorY: 'top' });

      // Registrar elementos para interactividad y auditoría
      els.A = A;
        els.B = B;
        els.C = C;
        els.lado1 = lado1;
        els.lado2 = lado2;
        els.bisectriz = bisectriz;
        els.P = P;
        els.a1ccw = a1ccw;
        els.a2ccw = a2ccw;
        els.a1cw = a1cw;
        els.a2cw = a2cw;
        els.infoText = infoText;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { B, lado1, lado2, bisectriz, a1ccw, a2ccw, a1cw, a2cw } = els;
      const hAngulo = isHighlight('angulo');
    const hBis = isHighlight('bisectriz');
    const hCong = isHighlight('angulos-congruentes');
    const hVert = isHighlight('vertice');
    const showAll = !hAngulo && !hBis && !hCong && !hVert;

    lado1.setAttribute({ strokeOpacity: hAngulo || showAll ? 1 : 0.3, strokeWidth: hAngulo ? 4 : 2 });
    lado2.setAttribute({ strokeOpacity: hAngulo || showAll ? 1 : 0.3, strokeWidth: hAngulo ? 4 : 2 });
    B.setAttribute({ strokeOpacity: hVert || showAll ? 1 : 0.3, fillOpacity: hVert || showAll ? 1 : 0.3, size: hVert ? 6 : 4 });
    bisectriz.setAttribute({ strokeOpacity: hBis || showAll ? 1 : 0.3, strokeWidth: hBis ? 4 : 2.5 });

    [a1ccw, a2ccw, a1cw, a2cw].forEach((a: any) => a.setAttribute({
      fillOpacity: hCong ? 0.45 : 0.2, strokeOpacity: hCong || showAll ? 1 : 0.3, radius: hCong ? 1.5 : 1.2
    }));
    };;

  return (
    <MathBoard
      boundingbox={[-4, 5, 5, -4]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra los puntos para ampliar o reducir el &aacute;ngulo
      </div>
    </MathBoard>
  );
};
