import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createLine, createSegment, createGlider
} from '@/shared/diagrams/core/MathFactory';







export const Order2 = () => {







  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const line = createLine(board, [[-10, 0], [10, 0]], {
      name: 'l', withLabel: true, label: { position: 'bot', offset: [-15, -15], strokeColor: theme.carbon, fontSize: 16 },
      strokeColor: theme.carbon, strokeWidth: 2, straightFirst: true, straightLast: true,
    }, theme);

    const pA = createGlider(board, [-2, 0, line], {
      name: 'A', size: 5, fillColor: theme.terracota, strokeColor: theme.terracota, showInfobox: false,
    }, theme);
    const pC = createGlider(board, [2, 0, line], {
      name: 'C', size: 5, fillColor: theme.terracota, strokeColor: theme.terracota, showInfobox: false,
    }, theme);

    const seg = createSegment(board, [pA, pC], { visible: false }, theme);
    const pB = createGlider(board, [0, 0, seg], {
      name: 'B', size: 5, fillColor: theme.ocre, strokeColor: theme.ocre, showInfobox: false,
    }, theme);

      // Registrar elementos para interactividad y auditoría
      els.line = line;
        els.pA = pA;
        els.pB = pB;
        els.pC = pC;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { pA, pB, pC } = els;
      [pA, pC].forEach(p => p.setAttribute({ fillColor: theme.terracota, strokeColor: theme.terracota, size: 5 }));
    pB.setAttribute({ fillColor: theme.ocre, strokeColor: theme.ocre, size: 5 });

    if (isHL('pA')) pA.setAttribute({ fillColor: theme.salvia, strokeColor: theme.salvia, size: 8 });
    if (isHL('pB')) pB.setAttribute({ fillColor: theme.salvia, strokeColor: theme.salvia, size: 8 });
    if (isHL('pC')) pC.setAttribute({ fillColor: theme.salvia, strokeColor: theme.salvia, size: 8 });
    };;

  return (
    <MathBoard
      boundingbox={[-5, 2, 5, -2]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >

    </MathBoard>
  );
};
