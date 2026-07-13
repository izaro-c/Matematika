import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createLine, createSegment, createGlider, createPolygon
} from '@/shared/diagrams/core/MathFactory';







export const Pasch = () => {








  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const pA = createPoint(board, [0, 2.5], {
      name: 'A', size: 5, fillColor: theme.terracota, strokeColor: theme.terracota,
      showInfobox: false, fixed: false,
    }, theme);
    const pB = createPoint(board, [-3.5, -2], {
      name: 'B', size: 5, fillColor: theme.terracota, strokeColor: theme.terracota,
      showInfobox: false, fixed: false,
    }, theme);
    const pC = createPoint(board, [4, -1.5], {
      name: 'C', size: 5, fillColor: theme.terracota, strokeColor: theme.terracota,
      showInfobox: false, fixed: false,
    }, theme);

    const sideAB = createSegment(board, [pA, pB], {
      strokeColor: theme.carbon, strokeWidth: 2,
    }, theme);
    const sideBC = createSegment(board, [pB, pC], {
      strokeColor: theme.carbon, strokeWidth: 2,
    }, theme);
    const sideCA = createSegment(board, [pC, pA], {
      strokeColor: theme.carbon, strokeWidth: 2,
    }, theme);

    const triangle = createPolygon(board, [pA, pB, pC], {
      fillColor: theme.terracota, fillOpacity: 0.04,
      borders: { visible: false }, vertices: { visible: false },
    }, theme);

    const pP = createGlider(board, [-1, 0.5, sideAB], {
      name: 'P', size: 5, fillColor: theme.terracota, strokeColor: theme.terracota,
      showInfobox: false,
    }, theme);

    // Punto libre para dirigir la línea
    const pDir = createPoint(board, [2, -1], {
      name: '', size: 5, fillColor: theme.pizarra, strokeColor: theme.pizarra,
      showInfobox: false,
    }, theme);

    const lineL = createLine(board, [pP, pDir], {
      name: 'l', withLabel: true, label: { position: 'top', offset: [-15, 15], strokeColor: theme.pizarra, fontSize: 16 },
      strokeColor: theme.pizarra, strokeWidth: 2.5, straightFirst: true, straightLast: true,
    }, theme);

    // Función robusta para comprobar si un punto está dentro del segmento usando coordenadas
    const isOnSegment = (pt: any, seg: any) => {
      if (!pt || !seg || !seg.point1 || !seg.point2) return false;
      const d1 = Math.hypot(pt.X() - seg.point1.X(), pt.Y() - seg.point1.Y());
      const d2 = Math.hypot(pt.X() - seg.point2.X(), pt.Y() - seg.point2.Y());
      const d = Math.hypot(seg.point1.X() - seg.point2.X(), seg.point1.Y() - seg.point2.Y());
      return Math.abs(d1 + d2 - d) < 0.001;
    };

    // Intersecciones con los otros dos lados
    const intBC = board.create('intersection', [lineL, sideBC, 0], {
      name: 'Q', size: 5, fillColor: theme.terracota, strokeColor: theme.terracota,
      showInfobox: false
    });
    intBC.setAttribute({ visible: () => isOnSegment(intBC, sideBC) });

    const intCA = board.create('intersection', [lineL, sideCA, 0], {
      name: 'Q', size: 5, fillColor: theme.terracota, strokeColor: theme.terracota,
      showInfobox: false
    });
    intCA.setAttribute({ visible: () => isOnSegment(intCA, sideCA) });

      // Registrar elementos para interactividad y auditoría
      els.pA = pA;
        els.pB = pB;
        els.pC = pC;
        els.pP = pP;
        els.pDir = pDir;
        els.intBC = intBC;
        els.intCA = intCA;
        els.sideAB = sideAB;
        els.sideBC = sideBC;
        els.sideCA = sideCA;
        els.triangle = triangle;
        els.lineL = lineL;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { pA, pB, pC, pP, pDir, intBC, intCA, sideAB, sideBC, sideCA, triangle, lineL } = els;
      [pA, pB, pC, pP, intBC, intCA].forEach(pt => pt.setAttribute({ size: 5, fillColor: theme.terracota, strokeColor: theme.terracota }));
    pDir.setAttribute({ size: 5, fillColor: theme.pizarra, strokeColor: theme.pizarra });
    [sideAB, sideBC, sideCA].forEach(s => s.setAttribute({ strokeColor: theme.carbon, strokeWidth: 2 }));
    lineL.setAttribute({ strokeColor: theme.pizarra, strokeWidth: 2.5 });
    triangle.setAttribute({ fillOpacity: 0.04 });

    if (isHL('triangle')) triangle.setAttribute({ fillOpacity: 0.15 });
    if (isHL('lineL')) lineL.setAttribute({ strokeColor: theme.terracota, strokeWidth: 4 });
    if (isHL('pP')) pP.setAttribute({ size: 9, fillColor: theme.ocre });
    if (isHL('pQ')) {
      intBC.setAttribute({ size: 9, fillColor: theme.ocre });
      intCA.setAttribute({ size: 9, fillColor: theme.ocre });
    }
    };;

  return (
    <MathBoard
      boundingbox={[-5, 5, 6, -5]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >
      <div className="absolute top-3 left-3 z-10 text-[10px] font-sans text-pizarra/50 uppercase tracking-wider">
        Arrastra los vértices, el punto P y el punto de dirección
      </div>
    </MathBoard>
  );
};
