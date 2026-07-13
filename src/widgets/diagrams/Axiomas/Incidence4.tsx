import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createLine, createSegment, createPolygon
} from '@/shared/diagrams/core/MathFactory';







export const Incidence4 = () => {








  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      // Triángulo: tres puntos no colineales
    const A = createPoint(board, [-2.5, -1], {
      name: 'A', size: 5, fillColor: theme.terracota, strokeColor: theme.terracota, showInfobox: false,
    }, theme);
    const B = createPoint(board, [2.5, -1], {
      name: 'B', size: 5, fillColor: theme.terracota, strokeColor: theme.terracota, showInfobox: false,
    }, theme);
    const C = createPoint(board, [0, 2.5], {
      name: 'C', size: 5, fillColor: theme.terracota, strokeColor: theme.terracota, showInfobox: false,
    }, theme);

    // Lados del triángulo
    const lab = createLine(board, [A, B], {
      strokeColor: theme.carbon, strokeWidth: 1.5, highlight: false, dash: 1,
    }, theme);
    const lac = createLine(board, [A, C], {
      strokeColor: theme.carbon, strokeWidth: 1.5, highlight: false, dash: 1,
    }, theme);
    const lbc = createLine(board, [B, C], {
      strokeColor: theme.carbon, strokeWidth: 1.5, highlight: false, dash: 1,
    }, theme);

    // Segmentos destacados
    createSegment(board, [A, B], { strokeColor: theme.musgo, strokeWidth: 2.5, highlight: false }, theme);
    createSegment(board, [A, C], { strokeColor: theme.musgo, strokeWidth: 2.5, highlight: false }, theme);
    createSegment(board, [B, C], { strokeColor: theme.musgo, strokeWidth: 2.5, highlight: false }, theme);

    // Etiqueta "plano" con relleno suave
    const polygonABC = createPolygon(board, [A, B, C], {
      fillColor: theme.pizarra, fillOpacity: 0.08, borders: { visible: false }, vertices: { visible: false },
    }, theme);

      // Registrar elementos para interactividad y auditoría
      els.A = A;
        els.B = B;
        els.C = C;
        els.lab = lab;
        els.lac = lac;
        els.lbc = lbc;
        els.polygonABC = polygonABC;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { A, B, C, polygonABC } = els;
      const reset = () => {
      A.setAttribute({ size: 5, fillColor: theme.terracota, strokeColor: theme.terracota });
      B.setAttribute({ size: 5, fillColor: theme.terracota, strokeColor: theme.terracota });
      C.setAttribute({ size: 5, fillColor: theme.terracota, strokeColor: theme.terracota });
      if (polygonABC) polygonABC.setAttribute({ fillOpacity: 0.08, fillColor: theme.pizarra });
    };

    reset();
    if (isHL('pA')) A.setAttribute({ size: 10, fillColor: theme.ocre, strokeColor: theme.ocre });
    else if (isHL('pB')) B.setAttribute({ size: 10, fillColor: theme.ocre, strokeColor: theme.ocre });
    else if (isHL('pC')) C.setAttribute({ size: 10, fillColor: theme.ocre, strokeColor: theme.ocre });
    else if (isHL('polygonABC') && polygonABC) polygonABC.setAttribute({ fillOpacity: 0.25, fillColor: theme.musgo });
    };;

  return (
    <MathBoard
      boundingbox={[-4, 4, 4, -3]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Tres puntos no colineales determinan un <span className="font-bold not-italic text-terracota">plano</span>
      </div>
    </MathBoard>
  );
};
