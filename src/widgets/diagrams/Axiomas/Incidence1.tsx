import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createLine
} from '@/shared/diagrams/core/MathFactory';







export const Incidence1 = () => {








  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const pA = createPoint(board, [-1, 1.5], {
      name: 'A',
      size: 6,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      fixed: false,
    }, theme);

    const pB = createPoint(board, [3, -0.5], {
      name: 'B',
      size: 6,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      fixed: false,
    }, theme);

    const lineAB = createLine(board, [pA, pB], {
      strokeColor: theme.carbon,
      strokeWidth: 2,
    }, theme);

      // Registrar elementos para interactividad y auditoría
      els.pA = pA;
        els.pB = pB;
        els.lineAB = lineAB;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { pA, pB, lineAB } = els;
      pA.setAttribute({ size: 6, fillColor: theme.terracota, strokeColor: theme.terracota });
    pB.setAttribute({ size: 6, fillColor: theme.terracota, strokeColor: theme.terracota });
    lineAB.setAttribute({ strokeColor: theme.carbon, strokeWidth: 2 });

    if (isHL('pA')) {
      pA.setAttribute({ size: 10, fillColor: theme.ocre, strokeColor: theme.ocre });
    }
    if (isHL('pB')) {
      pB.setAttribute({ size: 10, fillColor: theme.ocre, strokeColor: theme.ocre });
    }
    if (isHL('lineAB')) {
      lineAB.setAttribute({ strokeColor: theme.terracota, strokeWidth: 4 });
    }
    };;

  return (
    <MathBoard
      boundingbox={[-5, 4, 6, -4]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >
      <div className="absolute top-3 left-3 z-10 text-[10px] font-sans text-pizarra/50 uppercase tracking-wider">
        Arrastra los puntos A, B
      </div>
    </MathBoard>
  );
};
