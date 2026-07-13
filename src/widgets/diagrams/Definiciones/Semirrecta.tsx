import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createLine, createSegment
} from '@/shared/diagrams/core/MathFactory';







export const Semirrecta = () => {








  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const pO = createPoint(board, [-1, 0], {
      name: 'O',
      size: 6,
      fillColor: theme.pizarra,
      strokeColor: theme.pizarra,
      showInfobox: false,
      fixed: true,
    }, theme);

    const pA = createPoint(board, [2, 0.5], {
      name: 'A',
      size: 6,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      fixed: false,
    }, theme);

    const farEnd = board.create('point', [
      function () { return pO.X() + 20 * (pA.X() - pO.X()); },
      function () { return pO.Y() + 20 * (pA.Y() - pO.Y()); },
    ], { visible: false, fixed: true });

    const lineL = createLine(board, [pO, pA], {
      strokeColor: theme.pizarra,
      strokeWidth: 1,
      dash: 2,
      name: 'l',
      withLabel: true,
      label: { position: 'rt', offset: [10, 10] }
    }, theme);

    const ray = createSegment(board, [pO, farEnd], {
      strokeColor: theme.carbon,
      strokeWidth: 2,
      lastArrow: { type: 2 },
    }, theme);

      // Registrar elementos para interactividad y auditoría
      els.pO = pO;
        els.pA = pA;
        els.ray = ray;
        els.lineL = lineL;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { pO, pA, ray, lineL } = els;
      pO.setAttribute({ size: 6, fillColor: theme.pizarra, strokeColor: theme.pizarra });
    pA.setAttribute({ size: 6, fillColor: theme.terracota, strokeColor: theme.terracota });
    ray.setAttribute({ strokeColor: theme.carbon, strokeWidth: 2 });
    lineL.setAttribute({ strokeColor: theme.pizarra, strokeWidth: 1, dash: 2 });

    if (isHL('pO')) {
      pO.setAttribute({ size: 10, fillColor: theme.ocre, strokeColor: theme.ocre });
    }
    if (isHL('pA')) {
      pA.setAttribute({ size: 10, fillColor: theme.ocre, strokeColor: theme.ocre });
    }
    if (isHL('rayOA')) {
      ray.setAttribute({ strokeColor: theme.terracota, strokeWidth: 4 });
    }
    if (isHL('lineL')) {
      lineL.setAttribute({ strokeColor: theme.terracota, strokeWidth: 2, dash: 0 });
    }
    };;

  return (
    <MathBoard
      boundingbox={[-4, 3, 5, -3]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra el punto <span className="font-bold not-italic text-terracota">A</span>
      </div>
    </MathBoard>
  );
};
