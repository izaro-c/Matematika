import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createLine, createGlider
} from '@/shared/diagrams/core/MathFactory';







export const Order3 = () => {







  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const line = createLine(board, [[-10, 0], [10, 0]], {
      name: 'l', withLabel: true, label: { position: 'bot', offset: [-15, -15], strokeColor: theme.carbon, fontSize: 16 },
      strokeColor: theme.carbon, strokeWidth: 2, straightFirst: true, straightLast: true,
    }, theme);

    const p1 = createGlider(board, [-3, 0, line], {
      name: 'A', size: 5, fillColor: theme.terracota, strokeColor: theme.terracota, showInfobox: false,
    }, theme);
    const p2 = createGlider(board, [0, 0, line], {
      name: 'B', size: 5, fillColor: theme.terracota, strokeColor: theme.terracota, showInfobox: false,
    }, theme);
    const p3 = createGlider(board, [3, 0, line], {
      name: 'C', size: 5, fillColor: theme.terracota, strokeColor: theme.terracota, showInfobox: false,
    }, theme);

      // Registrar elementos para interactividad y auditoría
      els.line = line;
        els.p1 = p1;
        els.p2 = p2;
        els.p3 = p3;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { line, p1, p2, p3 } = els;
      line.setAttribute({ strokeColor: isHL('line') ? theme.ocre : theme.carbon, strokeWidth: isHL('line') ? 4 : 2 });

    [p1, p2, p3].forEach((p, idx) => {
      const id = `p${idx+1}`;
      if (isHL(id)) p.setAttribute({ fillColor: theme.ocre, strokeColor: theme.ocre, size: 8 });
      else p.setAttribute({ fillColor: theme.terracota, strokeColor: theme.terracota, size: 5 });
    });
    };;

  return (
    <MathBoard
      boundingbox={[-5, 2, 5, -2]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >
      <div className="absolute top-3 left-3 z-10 text-[10px] font-sans text-pizarra/50 uppercase tracking-wider">
        Ordena libremente los puntos en la recta
      </div>
    </MathBoard>
  );
};
