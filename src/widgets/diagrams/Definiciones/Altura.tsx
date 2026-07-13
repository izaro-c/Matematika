import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createLine, createSegment, createPolygon
} from '@/shared/diagrams/core/MathFactory';





export const Altura = () => {







  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const C_PRIM = theme.pavo;
    const C_ACC = theme.terracota;
    const C_ORTHO = theme.salvia;
    const C_BASE = theme.carbon;

    const A = createPoint(board, [-2, -2], { name: 'A', size: 4, fillColor: C_PRIM, strokeColor: C_PRIM }, theme);
    const B = createPoint(board, [3, -1], { name: 'B', size: 4, fillColor: C_PRIM, strokeColor: C_PRIM }, theme);
    const C = createPoint(board, [0, 3], { name: 'C', size: 4, fillColor: C_PRIM, strokeColor: C_PRIM }, theme);

    const poly = createPolygon(board, [A, B, C], {
      fillColor: C_PRIM, fillOpacity: 0.1, borders: { strokeWidth: 2, strokeColor: C_PRIM }
    }, theme);

    const baseAB = createLine(board, [A, B], { visible: false }, theme);
    const baseBC = createLine(board, [B, C], { visible: false }, theme);
    const baseCA = createLine(board, [C, A], { visible: false }, theme);

    const HC = board.create('intersection', [
      baseAB, board.create('perpendicular', [baseAB, C], { visible: false }), 0
    ], { name: 'H_c', size: 3, fillColor: C_ACC, strokeColor: C_ACC, visible: false });

    const alturaC = createSegment(board, [C, HC], { strokeColor: C_ACC, strokeWidth: 2, dash: 2 }, theme);

    const extEnd = board.create('point', [
      () => {
        const dx = B.X() - A.X(), dy = B.Y() - A.Y();
        const len2 = dx * dx + dy * dy;
        if (len2 < 1e-10) return A.X();
        const t = ((HC.X() - A.X()) * dx + (HC.Y() - A.Y()) * dy) / len2;
        if (t < 0) return A.X();
        if (t > 1) return B.X();
        return HC.X();
      },
      () => {
        const dx = B.X() - A.X(), dy = B.Y() - A.Y();
        const len2 = dx * dx + dy * dy;
        if (len2 < 1e-10) return A.Y();
        const t = ((HC.X() - A.X()) * dx + (HC.Y() - A.Y()) * dy) / len2;
        if (t < 0) return A.Y();
        if (t > 1) return B.Y();
        return HC.Y();
      }
    ], { visible: false });

    const baseExtension = createSegment(board, [extEnd, HC], {
      dash: 2, strokeWidth: 1.5, strokeColor: C_BASE, visible: false
    }, theme);

    const sqSize = 0.5;
    const baseDir = () => {
      const mx = (A.X() + B.X()) / 2, my = (A.Y() + B.Y()) / 2;
      const dx = mx - HC.X(), dy = my - HC.Y();
      const len = Math.hypot(dx, dy);
      if (len < 1e-6) return { x: 1, y: 0 };
      return { x: dx / len, y: dy / len };
    };
    const altDir = () => {
      const dx = C.X() - HC.X(), dy = C.Y() - HC.Y();
      const len = Math.hypot(dx, dy);
      if (len < 1e-6) return { x: 0, y: 1 };
      return { x: dx / len, y: dy / len };
    };

    const sq0 = createPoint(board, [() => HC.X(), () => HC.Y()], { visible: false }, theme);
    const sq1 = board.create('point', [
      () => { const d = baseDir(); return HC.X() + d.x * sqSize; },
      () => { const d = baseDir(); return HC.Y() + d.y * sqSize; }
    ], { visible: false });
    const sq2 = board.create('point', [
      () => { const d = baseDir(); const a = altDir(); return HC.X() + d.x * sqSize + a.x * sqSize; },
      () => { const d = baseDir(); const a = altDir(); return HC.Y() + d.y * sqSize + a.y * sqSize; }
    ], { visible: false });
    const sq3 = board.create('point', [
      () => { const a = altDir(); return HC.X() + a.x * sqSize; },
      () => { const a = altDir(); return HC.Y() + a.y * sqSize; }
    ], { visible: false });

    const angRecto = createPolygon(board, [sq0, sq1, sq2, sq3], {
      fillColor: C_ORTHO, fillOpacity: 0.3,
      strokeColor: C_ORTHO, strokeWidth: 1.5,
      vertices: { visible: false },
      borders: { strokeColor: C_ORTHO, strokeWidth: 1.5 },
      visible: false
    }, theme);

    const HA = board.create('intersection', [
      baseBC, board.create('perpendicular', [baseBC, A], { visible: false }), 0
    ], { name: 'H_a', size: 3, fillColor: C_ORTHO, strokeColor: C_ORTHO, visible: false });
    const alturaA = createSegment(board, [A, HA], { strokeColor: C_ORTHO, strokeWidth: 2, dash: 2, visible: false }, theme);

    const HB = board.create('intersection', [
      baseCA, board.create('perpendicular', [baseCA, B], { visible: false }), 0
    ], { name: 'H_b', size: 3, fillColor: C_ORTHO, strokeColor: C_ORTHO, visible: false });
    const alturaB = createSegment(board, [B, HB], { strokeColor: C_ORTHO, strokeWidth: 2, dash: 2, visible: false }, theme);

    const ortocentro = board.create('intersection', [
      createLine(board, [C, HC], { visible: false }, theme),
      createLine(board, [A, HA], { visible: false }, theme), 0
    ], { name: 'Ortocentro', size: 4, fillColor: C_ORTHO, strokeColor: C_ORTHO, visible: false });

    const updateExtension = () => {
      const dx = B.X() - A.X(), dy = B.Y() - A.Y();
      const len2 = dx * dx + dy * dy;
      let outside = false;
      if (len2 > 1e-10) {
        const t = ((HC.X() - A.X()) * dx + (HC.Y() - A.Y()) * dy) / len2;
        outside = t < -0.001 || t > 1.001;
      }
      baseExtension.setAttribute({ visible: outside });
    };
    board.on('update', updateExtension);

      // Registrar elementos para interactividad y auditoría
      els.A = A;
        els.B = B;
        els.C = C;
        els.poly = poly;
        els.ladoAB = (poly as any).borders[0];
        els.alturaC = alturaC;
        els.HC = HC;
        els.baseExtension = baseExtension;
        els.angRecto = angRecto;
        els.alturaA = alturaA;
        els.alturaB = alturaB;
        els.HA = HA;
        els.HB = HB;
        els.ortocentro = ortocentro;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { C, ladoAB, alturaC, HC, angRecto, alturaA, alturaB, HA, HB, ortocentro } = els;
      const hVert = isHighlight('vertice-opuesto');
    const hLado = isHighlight('lado-opuesto');
    const hAlt = isHighlight('altura');
    const hOrt = isHighlight('ortogonal');
    const hOrtocentro = isHighlight('ortocentro');
    const showAll = !hVert && !hLado && !hAlt && !hOrt && !hOrtocentro;

    C.setAttribute({ strokeOpacity: hVert || showAll ? 1 : 0.3, fillOpacity: hVert || showAll ? 1 : 0.3, size: hVert ? 6 : 4 });
    ladoAB.setAttribute({ strokeOpacity: hLado || showAll ? 1 : 0.3, strokeWidth: hLado ? 4 : 2 });
    alturaC.setAttribute({ strokeOpacity: hAlt || showAll || hOrtocentro ? 1 : 0.3, strokeWidth: hAlt ? 4 : 2 });

    angRecto.setAttribute({
      visible: hOrt || showAll || hAlt,
      strokeOpacity: hOrt || showAll || hAlt ? 1 : 0.2,
      fillOpacity: hOrt ? 0.45 : 0.15
    });
    HC.setAttribute({ visible: hOrt || hAlt || showAll || hOrtocentro, strokeOpacity: hOrt || hAlt || showAll ? 1 : 0.3, fillOpacity: hOrt || hAlt || showAll ? 1 : 0.3 });

    alturaA.setAttribute({ visible: hOrtocentro });
    alturaB.setAttribute({ visible: hOrtocentro });
    HA.setAttribute({ visible: hOrtocentro });
    HB.setAttribute({ visible: hOrtocentro });
    ortocentro.setAttribute({ visible: hOrtocentro });
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
