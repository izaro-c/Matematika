import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createLine, createSegment
} from '@/shared/diagrams/core/MathFactory';







export const Segmento = () => {








  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const pA = createPoint(board, [-2, 0.5], {
      name: 'A',
      size: 6,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      fixed: false,
    }, theme);

    const pB = createPoint(board, [2, -0.3], {
      name: 'B',
      size: 6,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      fixed: false,
    }, theme);

    const lineL = createLine(board, [pA, pB], {
      strokeColor: theme.pizarra,
      strokeWidth: 1,
      dash: 2,
      name: 'l',
      withLabel: true,
      label: { position: 'rt', offset: [10, 10] }
    }, theme);

    const seg = createSegment(board, [pA, pB], {
      strokeColor: theme.carbon,
      strokeWidth: 3,
    }, theme);

      // Registrar elementos para interactividad y auditoría
      els.pA = pA;
        els.pB = pB;
        els.seg = seg;
        els.lineL = lineL;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { pA, pB, seg, lineL } = els;
      pA.setAttribute({ size: 6, fillColor: theme.terracota, strokeColor: theme.terracota });
    pB.setAttribute({ size: 6, fillColor: theme.terracota, strokeColor: theme.terracota });
    seg.setAttribute({ strokeColor: theme.carbon, strokeWidth: 3 });
    lineL.setAttribute({ strokeColor: theme.pizarra, strokeWidth: 1, dash: 2 });

    if (isHL('pA')) {
      pA.setAttribute({ size: 10, fillColor: theme.ocre, strokeColor: theme.ocre });
    }
    if (isHL('pB')) {
      pB.setAttribute({ size: 10, fillColor: theme.ocre, strokeColor: theme.ocre });
    }
    if (isHL('segmentAB')) {
      seg.setAttribute({ strokeColor: theme.terracota, strokeWidth: 5 });
    }
    if (isHL('lineL')) {
      lineL.setAttribute({ strokeColor: theme.terracota, strokeWidth: 2, dash: 0 });
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
        Arrastra los extremos <span className="font-bold not-italic text-terracota">A</span>, <span className="font-bold not-italic text-terracota">B</span>
      </div>
    </MathBoard>
  );
};
