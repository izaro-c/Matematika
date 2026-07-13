import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createSegment, createPolygon
} from '@/shared/diagrams/core/MathFactory';







export const Incidence3 = () => {








  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const pA = createPoint(board, [-1, 2.5], {
      name: 'A',
      size: 6,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      fixed: false,
    }, theme);

    const pB = createPoint(board, [-3, -2], {
      name: 'B',
      size: 6,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      fixed: false,
    }, theme);

    const pC = createPoint(board, [3, -1], {
      name: 'C',
      size: 6,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      fixed: false,
    }, theme);

    const sideAB = createSegment(board, [pA, pB], {
      strokeColor: theme.pizarra,
      strokeWidth: 1.5,
      dash: 2,
    }, theme);

    const sideBC = createSegment(board, [pB, pC], {
      strokeColor: theme.pizarra,
      strokeWidth: 1.5,
      dash: 2,
    }, theme);

    const sideCA = createSegment(board, [pC, pA], {
      strokeColor: theme.pizarra,
      strokeWidth: 1.5,
      dash: 2,
    }, theme);

    const triangle = createPolygon(board, [pA, pB, pC], {
      fillColor: theme.terracota,
      fillOpacity: 0.06,
      borders: { visible: false },
      vertices: { visible: false },
    }, theme);

      // Registrar elementos para interactividad y auditoría
      els.pA = pA;
        els.pB = pB;
        els.pC = pC;
        els.sideAB = sideAB;
        els.sideBC = sideBC;
        els.sideCA = sideCA;
        els.triangle = triangle;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { pA, pB, pC, sideAB, sideBC, sideCA, triangle } = els;
      pA.setAttribute({ size: 6, fillColor: theme.terracota, strokeColor: theme.terracota });
    pB.setAttribute({ size: 6, fillColor: theme.terracota, strokeColor: theme.terracota });
    pC.setAttribute({ size: 6, fillColor: theme.terracota, strokeColor: theme.terracota });
    sideAB.setAttribute({ strokeColor: theme.pizarra, strokeWidth: 1.5 });
    sideBC.setAttribute({ strokeColor: theme.pizarra, strokeWidth: 1.5 });
    sideCA.setAttribute({ strokeColor: theme.pizarra, strokeWidth: 1.5 });
    triangle.setAttribute({ fillOpacity: 0.06 });

    if (isHL('pA')) pA.setAttribute({ size: 10, fillColor: theme.ocre, strokeColor: theme.ocre });
    if (isHL('pB')) pB.setAttribute({ size: 10, fillColor: theme.ocre, strokeColor: theme.ocre });
    if (isHL('pC')) pC.setAttribute({ size: 10, fillColor: theme.ocre, strokeColor: theme.ocre });
    if (isHL('triangle')) triangle.setAttribute({ fillOpacity: 0.2 });
    };;

  return (
    <MathBoard
      boundingbox={[-5, 5, 5, -5]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >
      <div className="absolute top-3 left-3 z-10 text-[10px] font-sans text-pizarra/50 uppercase tracking-wider">
        Arrastra los vértices
      </div>
    </MathBoard>
  );
};
