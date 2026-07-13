import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createSegment, createGlider, createCircle, createPolygon, createAngle, createText
} from '@/shared/diagrams/core/MathFactory';







export const SAS = () => {








  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const pA = createPoint(board, [-3, 2], {
      name: 'A', size: 5, fillColor: theme.terracota, strokeColor: theme.terracota,
      showInfobox: false, fixed: false,
    }, theme);
    const pB = createPoint(board, [-4, -2], {
      name: 'B', size: 5, fillColor: theme.terracota, strokeColor: theme.terracota,
      showInfobox: false, fixed: false,
    }, theme);
    const pC = createPoint(board, [-1, -1.5], {
      name: 'C', size: 5, fillColor: theme.terracota, strokeColor: theme.terracota,
      showInfobox: false, fixed: false,
    }, theme);

    const t1 = createPolygon(board, [pA, pB, pC], {
      fillColor: theme.terracota, fillOpacity: 0.08,
      borders: { strokeColor: theme.carbon, strokeWidth: 2 },
      vertices: { visible: false },
    }, theme);

    const side1 = createSegment(board, [pA, pB], {
      strokeColor: theme.terracota, strokeWidth: 4,
    }, theme);
    const side2 = createSegment(board, [pA, pC], {
      strokeColor: theme.terracota, strokeWidth: 4,
    }, theme);
    createSegment(board, [pB, pC], {
      strokeColor: theme.pizarra, strokeWidth: 2, dash: 1,
    }, theme);

    const angle1 = createAngle(board, [pB, pA, pC], {
      radius: 0.5, fillColor: theme.salvia, fillOpacity: 0.3,
    }, theme);

    const pA2 = createPoint(board, [3, 2], {
      name: "A'", size: 5, fillColor: theme.pizarra, strokeColor: theme.pizarra,
      showInfobox: false, fixed: false,
    }, theme);
    const cB2 = createCircle(board, [pA2, () => pA.Dist(pB)], { visible: false }, theme);
    const pB2 = createGlider(board, [2, -2, cB2], {
      name: "B'", size: 5, fillColor: theme.pizarra, strokeColor: theme.pizarra,
      showInfobox: false, fixed: false,
    }, theme);
    const pC2 = board.create('point', [
      () => {
        const aA = Math.atan2(pC.Y() - pA.Y(), pC.X() - pA.X()) - Math.atan2(pB.Y() - pA.Y(), pB.X() - pA.X());
        const aA2 = Math.atan2(pB2.Y() - pA2.Y(), pB2.X() - pA2.X());
        const totalAngle = aA2 + aA;
        return pA2.X() + pA.Dist(pC) * Math.cos(totalAngle);
      },
      () => {
        const aA = Math.atan2(pC.Y() - pA.Y(), pC.X() - pA.X()) - Math.atan2(pB.Y() - pA.Y(), pB.X() - pA.X());
        const aA2 = Math.atan2(pB2.Y() - pA2.Y(), pB2.X() - pA2.X());
        const totalAngle = aA2 + aA;
        return pA2.Y() + pA.Dist(pC) * Math.sin(totalAngle);
      }
    ], {
      name: "C'", size: 5, fillColor: theme.pizarra, strokeColor: theme.pizarra,
      showInfobox: false, fixed: true,
    });

    const t2 = createPolygon(board, [pA2, pB2, pC2], {
      fillColor: theme.pizarra, fillOpacity: 0.08,
      borders: { strokeColor: theme.carbon, strokeWidth: 2, dash: 2 },
      vertices: { visible: false },
    }, theme);

    const side1B = createSegment(board, [pA2, pB2], {
      strokeColor: theme.terracota, strokeWidth: 4, dash: 3,
    }, theme);
    const side2B = createSegment(board, [pA2, pC2], {
      strokeColor: theme.terracota, strokeWidth: 4, dash: 3,
    }, theme);
    createSegment(board, [pB2, pC2], {
      strokeColor: theme.pizarra, strokeWidth: 2, dash: 1,
    }, theme);

    const angle2 = createAngle(board, [pB2, pA2, pC2], {
      radius: 0.5, fillColor: theme.salvia, fillOpacity: 0.3,
    }, theme);

    createText(board, [-2, 3, 'Triángulo Original (Modificable)'], {
      fontSize: 10, anchorX: 'middle',
    }, theme);
    createText(board, [3.5, 3, "Triángulo Congruente (Arrastra para mover)"], {
      fontSize: 10, anchorX: 'middle',
    }, theme);

      // Registrar elementos para interactividad y auditoría
      els.t1 = t1;
        els.t2 = t2;
        els.side1 = side1;
        els.side2 = side2;
        els.side1B = side1B;
        els.side2B = side2B;
        els.angle1 = angle1;
        els.angle2 = angle2;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { t1, t2, side1, side2, side1B, side2B, angle1, angle2 } = els;
      side1.setAttribute({ strokeColor: theme.terracota, strokeWidth: 4 });
    side2.setAttribute({ strokeColor: theme.terracota, strokeWidth: 4 });
    side1B.setAttribute({ strokeColor: theme.terracota, strokeWidth: 4 });
    side2B.setAttribute({ strokeColor: theme.terracota, strokeWidth: 4 });
    angle1.setAttribute({ fillOpacity: 0.3 });
    angle2.setAttribute({ fillOpacity: 0.3 });
    t1.setAttribute({ fillOpacity: 0.08 });
    t2.setAttribute({ fillOpacity: 0.08 });

    if (isHL('side1') || isHL('side1B')) {
      side1.setAttribute({ strokeColor: theme.ocre, strokeWidth: 6 });
      side1B.setAttribute({ strokeColor: theme.ocre, strokeWidth: 6 });
    }
    if (isHL('side2') || isHL('side2B')) {
      side2.setAttribute({ strokeColor: theme.ocre, strokeWidth: 6 });
      side2B.setAttribute({ strokeColor: theme.ocre, strokeWidth: 6 });
    }
    if (isHL('angle1') || isHL('angle2')) {
      angle1.setAttribute({ fillOpacity: 0.6 });
      angle2.setAttribute({ fillOpacity: 0.6 });
    }
    };;

  return (
    <MathBoard
      boundingbox={[-5, 5, 7, -5]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >
      <div className="absolute top-3 left-3 z-10 text-[10px] font-sans text-pizarra/50 uppercase tracking-wider">
        Modifica el triángulo original, y manipula el triángulo clonado
      </div>
    </MathBoard>
  );
};
