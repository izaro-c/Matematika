import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint
} from '@/shared/diagrams/core/MathFactory';







export const Punto = () => {








  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const p = createPoint(board, [0, 0], {
      name: 'P',
      size: 6,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      fixed: false,
    }, theme);

      // Registrar elementos para interactividad y auditoría
      els.p = p;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { p } = els;
      p.setAttribute({ size: 6, fillColor: theme.terracota, strokeColor: theme.terracota });

    if (isHL('pPoint')) {
      p.setAttribute({ size: 12, fillColor: theme.ocre, strokeColor: theme.ocre });
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
        Arrastra el punto <span className="font-bold not-italic text-terracota">P</span>
      </div>
    </MathBoard>
  );
};
