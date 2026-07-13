import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createLine, createText
} from '@/shared/diagrams/core/MathFactory';







export const HyperbolicParallel = () => {








  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      createLine(board, [[-4, 2], [4, 1.5]], {
      strokeColor: theme.carbon, strokeWidth: 2.5,
    }, theme);

    createText(board, [4.2, 1.8, 'l'], {
      fontSize: 14, fillColor: theme.carbon, highlightFillColor: theme.carbon,
    }, theme);

    const pP = createPoint(board, [0, -1.5], {
      name: 'P', size: 6, fillColor: theme.terracota, strokeColor: theme.terracota,
      showInfobox: false, fixed: false,
    }, theme);

    const lineM = board.create('functiongraph', [
      function(x: number) {
        const dx = x - pP.X();
        return pP.Y() + 2 * (1 - Math.exp(-0.2 * dx * dx));
      }
    ], {
      strokeColor: theme.terracota, strokeWidth: 2.5,
    });

    createText(board, [4.2, function() { return pP.Y() + 2.3; }, 'm'], {
      fontSize: 14, fillColor: theme.carbon, highlightFillColor: theme.carbon,
    }, theme);

    const lineN = board.create('functiongraph', [
      function(x: number) {
        const dx = x - pP.X();
        return pP.Y() + 2.8 * (1 - Math.exp(-0.1 * dx * dx));
      }
    ], {
      strokeColor: theme.pizarra, strokeWidth: 2.5,
    });

    createText(board, [4.2, function() { return pP.Y() + 3.1; }, 'n'], {
      fontSize: 14, fillColor: theme.carbon, highlightFillColor: theme.carbon,
    }, theme);

      // Registrar elementos para interactividad y auditoría
      els.pP = pP;
        els.lineM = lineM;
        els.lineN = lineN;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { pP, lineM, lineN } = els;
      pP.setAttribute({ size: 6, fillColor: theme.terracota, strokeColor: theme.terracota });
    lineM.setAttribute({ strokeColor: theme.terracota, strokeWidth: 2.5 });
    lineN.setAttribute({ strokeColor: theme.pizarra, strokeWidth: 2.5 });

    if (isHL('pP')) pP.setAttribute({ size: 10, fillColor: theme.ocre });
    if (isHL('lineM')) lineM.setAttribute({ strokeColor: theme.ocre, strokeWidth: 4 });
    if (isHL('lineN')) lineN.setAttribute({ strokeColor: theme.ocre, strokeWidth: 4 });
    };;

  return (
    <MathBoard
      boundingbox={[-5, 4, 5, -4]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >
      <div className="absolute top-3 left-3 z-10 text-[10px] font-sans text-pizarra/50 uppercase tracking-wider">
        Arrastra el punto P
      </div>
    </MathBoard>
  );
};
