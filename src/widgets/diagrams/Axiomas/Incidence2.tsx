import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createLine, createSegment, createGlider
} from '@/shared/diagrams/core/MathFactory';







export const Incidence2 = () => {








  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const l = createLine(board, [[-3.5, 0], [3.5, 0]], {
      strokeColor: theme.carbon, strokeWidth: 2, fixed: true, highlight: false,
      name: 'l', withLabel: true, label: {
        position: 'top',
        offset: [20, 10],
        display: 'internal',
        fontFamily: 'Charter, Georgia, serif',
        fontStyle: 'italic',
        fontSize: 24,
        strokeColor: theme.carbon
      },
    }, theme);

    const A = createGlider(board, [-2.5, 0, l], {
      name: 'A', size: 5, fillColor: theme.terracota, strokeColor: theme.terracota, showInfobox: false,
    }, theme);

    const B = createGlider(board, [2.5, 0, l], {
      name: 'B', size: 5, fillColor: theme.terracota, strokeColor: theme.terracota, showInfobox: false,
    }, theme);

    // Marca visual: al menos dos puntos en la recta
    createSegment(board, [A, B], {
      strokeColor: theme.terracota, strokeWidth: 1, dash: 2, highlight: false,
    }, theme);

      // Registrar elementos para interactividad y auditoría
      els.l = l;
        els.A = A;
        els.B = B;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { l, A, B } = els;
      if (isHL('pA')) {
      A.setAttribute({ size: 10, fillColor: theme.ocre, strokeColor: theme.ocre });
    } else if (isHL('pB')) {
      B.setAttribute({ size: 10, fillColor: theme.ocre, strokeColor: theme.ocre });
    } else if (isHL('lineAB') || isHL('l')) {
      l.setAttribute({ strokeColor: theme.terracota, strokeWidth: 4 });
      if (l.label) l.label.setAttribute({ strokeColor: theme.terracota });
    } else {
      A.setAttribute({ size: 5, fillColor: theme.terracota, strokeColor: theme.terracota });
      B.setAttribute({ size: 5, fillColor: theme.terracota, strokeColor: theme.terracota });
      l.setAttribute({ strokeColor: theme.carbon, strokeWidth: 2 });
      if (l.label) l.label.setAttribute({ strokeColor: theme.carbon });
    }
    };;

  return (
    <MathBoard
      boundingbox={[-4, 3, 4, -3]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Toda recta contiene al menos <span className="font-bold not-italic text-terracota">dos</span> puntos
      </div>
    </MathBoard>
  );
};
