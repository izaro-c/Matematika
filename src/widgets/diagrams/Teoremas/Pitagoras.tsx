import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createLine, createSegment, createGlider, createPolygon, createAngle
} from '@/shared/diagrams/core/MathFactory';





export const Pitagoras = () => {






  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const C_PRIM  = theme.carbon;
    const C_SQ_A  = theme.salvia;
    const C_SQ_B  = theme.terracota;
    const C_SQ_C  = theme.ocre;
    const C_RIGHT = theme.pavo;

    const C = createPoint(board, [0, 0], { name: 'C', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, fixed: true }, theme);

    const axisY = createLine(board, [C, createPoint(board, [0, 1], { visible: false }, theme)], { visible: false }, theme);
    const axisX = createLine(board, [C, createPoint(board, [1, 0], { visible: false }, theme)], { visible: false }, theme);

    const A = createGlider(board, [0, 4, axisY], { name: 'A', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 }, theme);
    const B = createGlider(board, [3, 0, axisX], { name: 'B', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 }, theme);

    const segBC = createSegment(board, [B, C], { strokeColor: C_PRIM, strokeWidth: 2 }, theme);
    const segCA = createSegment(board, [C, A], { strokeColor: C_PRIM, strokeWidth: 2 }, theme);
    const segAB = createSegment(board, [A, B], { strokeColor: C_PRIM, strokeWidth: 2.5 }, theme);

    const poly = createPolygon(board, [A, B, C], {
      fillColor: C_PRIM, fillOpacity: 0.06,
      borders: { visible: false }, vertices: { visible: false }
    }, theme);

    const label = (p: any, q: any, text: string, color: string) => {
      const mx = () => (p.X() + q.X()) / 2;
      const my = () => (p.Y() + q.Y()) / 2;
      const dx = () => q.X() - p.X();
      const dy = () => q.Y() - p.Y();
      const nl = () => Math.hypot(dx(), dy()) || 1;
      const off = 0.5;
      return board.create('text', [
        () => mx() - dy() / nl() * off,
        () => my() + dx() / nl() * off,
        text
      ], { fixed: true, fontSize: 18, cssClass: 'font-serif font-bold', anchorX: 'middle', anchorY: 'middle', color });
    };

    const labA = label(B, C, 'a', C_SQ_A);
    const labB = label(C, A, 'b', C_SQ_B);
    const labC = label(A, B, 'c', C_SQ_C);

    const mkSqPts = (p1: any, p2: any, opp: any) => {
      const lenAB = () => p1.Dist(p2);
      const dx = () => p2.X() - p1.X();
      const dy = () => p2.Y() - p1.Y();
      const ndx = () => -dy() / Math.max(lenAB(), 0.001);
      const ndy = () => dx() / Math.max(lenAB(), 0.001);
      const mx = () => (p1.X() + p2.X()) / 2;
      const my = () => (p1.Y() + p2.Y()) / 2;
      const sign = () => ((opp.X() - mx()) * ndx() + (opp.Y() - my()) * ndy() > 0 ? -1 : 1);
      const p3 = board.create('point', [
        () => p2.X() + ndx() * lenAB() * sign(),
        () => p2.Y() + ndy() * lenAB() * sign()
      ], { visible: false });
      const p4 = board.create('point', [
        () => p1.X() + ndx() * lenAB() * sign(),
        () => p1.Y() + ndy() * lenAB() * sign()
      ], { visible: false });
      return [p1, p2, p3, p4];
    };

    const sqBC = board.create('polygon', mkSqPts(B, C, A), {
      fillColor: C_SQ_A, fillOpacity: 0.15,
      borders: { strokeColor: C_SQ_A, strokeWidth: 2 },
      vertices: { visible: false }
    });
    const sqCA = board.create('polygon', mkSqPts(C, A, B), {
      fillColor: C_SQ_B, fillOpacity: 0.15,
      borders: { strokeColor: C_SQ_B, strokeWidth: 2 },
      vertices: { visible: false }
    });
    const sqAB = board.create('polygon', mkSqPts(A, B, C), {
      fillColor: C_SQ_C, fillOpacity: 0.15,
      borders: { strokeColor: C_SQ_C, strokeWidth: 2.5 },
      vertices: { visible: false }
    });

    const rightAng = createAngle(board, [B, C, A], {
      radius: 0.6, type: 'sector', orthotype: 'square',
      fillColor: C_RIGHT, strokeColor: C_RIGHT, fillOpacity: 0.4
    }, theme);

    const infoText = board.create('text', [
      -7.5, 7.5,
      () => {
        const a = B.Dist(C);
        const b = C.Dist(A);
        const c = A.Dist(B);
        const a2 = a * a, b2 = b * b, c2 = c * c;
        const sum = a2 + b2;
        return `<div style="font-family: var(--font-serif); color: ${theme.carbon}; line-height:1.5;">
          <strong style="font-size: 1.15rem;">Teorema de Pit\u00e1goras</strong><br/>
          <span style="color:${theme.ocre};">c\u00b2 = ${c2.toFixed(1)}</span><br/>
          <span style="color:${theme.salvia};">a\u00b2 = ${a2.toFixed(1)}</span> &nbsp;
          <span style="color:${theme.terracota};">b\u00b2 = ${b2.toFixed(1)}</span><br/>
          <strong>a\u00b2 + b\u00b2 = ${sum.toFixed(1)} ${Math.abs(sum - c2) < 0.5 ? '\u2261' : '\u2260'} c\u00b2</strong>
        </div>`;
      }
    ], { fixed: true, anchorX: 'left', anchorY: 'top' });

    const lastValidA = [0, 4];
    const lastValidB = [3, 0];
    A.on('drag', () => { if (A.Y() < 0.25) A.moveTo([lastValidA[0], lastValidA[1]], 0); else { lastValidA[0] = A.X(); lastValidA[1] = A.Y(); } });
    B.on('drag', () => { if (B.X() < 0.25) B.moveTo([lastValidB[0], lastValidB[1]], 0); else { lastValidB[0] = B.X(); lastValidB[1] = B.Y(); } });

      // Registrar elementos para interactividad y auditoría
      els.A = A;
        els.B = B;
        els.C = C;
        els.poly = poly;
        els.segBC = segBC;
        els.segCA = segCA;
        els.segAB = segAB;
        els.sqBC = sqBC;
        els.sqCA = sqCA;
        els.sqAB = sqAB;
        els.rightAng = rightAng;
        els.labA = labA;
        els.labB = labB;
        els.labC = labC;
        els.infoText = infoText;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { A, B, C, segBC, segCA, segAB, sqBC, sqCA, sqAB, rightAng, labA, labB, labC } = els;
      const hSqA = isHighlight('cuadrado-a');
    const hSqB = isHighlight('cuadrado-b');
    const hSqC = isHighlight('cuadrado-c');
    const hTri = isHighlight('triangulo');
    const showAll = !hSqA && !hSqB && !hSqC && !hTri;

    const dim = (active: boolean) => active || showAll ? 1 : 0.15;
    const sop = (active: boolean) => active || showAll ? 1 : 0.15;

    sqBC.setAttribute({ fillOpacity: hSqA ? 0.3 : 0.10, strokeOpacity: sop(hSqA) });
    sqCA.setAttribute({ fillOpacity: hSqB ? 0.3 : 0.10, strokeOpacity: sop(hSqB) });
    sqAB.setAttribute({ fillOpacity: hSqC ? 0.35 : 0.12, strokeOpacity: sop(hSqC) });
    rightAng.setAttribute({ fillOpacity: showAll ? 0.4 : 0.08 });

    segBC.setAttribute({ strokeOpacity: dim(showAll), strokeWidth: hSqA ? 4 : 2 });
    segCA.setAttribute({ strokeOpacity: dim(showAll), strokeWidth: hSqB ? 4 : 2 });
    segAB.setAttribute({ strokeOpacity: dim(showAll), strokeWidth: hSqC ? 4 : 2.5 });

    labA.setAttribute({ visible: dim(hSqA || showAll) > 0.5 });
    labB.setAttribute({ visible: dim(hSqB || showAll) > 0.5 });
    labC.setAttribute({ visible: dim(hSqC || showAll) > 0.5 });

    [A, B, C].forEach((p: any) => p.setAttribute({
      strokeOpacity: dim(showAll),
      fillOpacity: dim(showAll),
      size: hTri ? 7 : 5,
      fillColor: hTri ? theme.terracota : theme.carbon
    }));
    };;

  return (
    <MathBoard
      boundingbox={[-8, 8, 8, -8]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >

    </MathBoard>
  );
};
