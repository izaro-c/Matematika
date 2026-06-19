import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';

export const CongruenciaLLL = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  useEffect(() => {
    if (!boardRef.current) return;

    const board = JXG.JSXGraph.initBoard(boardRef.current, {
      boundingbox: [-2, 5, 8, -3],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    // Primer triángulo
    const A1 = board.create('point', [0, 0], {
      name: 'A', size: 4, fillColor: '#C86446', strokeColor: '#C86446', showInfobox: false, fixed: true,
    });
    const B1 = board.create('point', [4, 0], {
      name: 'B', size: 4, fillColor: '#C86446', strokeColor: '#C86446', showInfobox: false, fixed: true,
    });
    const C1 = board.create('point', [1, 3], {
      name: 'C', size: 4, fillColor: '#5A805A', strokeColor: '#5A805A', showInfobox: false,
    });

    const s1 = board.create('segment', [A1, B1], { strokeColor: '#333333', strokeWidth: 3, highlight: false });
    const s2 = board.create('segment', [B1, C1], { strokeColor: '#333333', strokeWidth: 3, highlight: false });
    const s3 = board.create('segment', [A1, C1], { strokeColor: '#333333', strokeWidth: 3, highlight: false });
    board.create('polygon', [A1, B1, C1], {
      fillColor: '#C86446', fillOpacity: 0.05, borders: { visible: false }, vertices: { visible: false },
    });

    // Segundo triángulo (congruente, reflejado)
    const A2 = board.create('point', [0, -1], {
      name: "A'", size: 4, fillColor: '#C86446', strokeColor: '#C86446', showInfobox: false, fixed: true,
    });
    const B2 = board.create('point', [4, -1], {
      name: "B'", size: 4, fillColor: '#C86446', strokeColor: '#C86446', showInfobox: false, fixed: true,
    });
    const C2 = board.create('point', [3, -4], {
      name: "C'", size: 4, fillColor: '#5D7080', strokeColor: '#5D7080', showInfobox: false,
    });

    board.create('segment', [A2, B2], { strokeColor: '#333333', strokeWidth: 3, highlight: false });
    board.create('segment', [B2, C2], { strokeColor: '#333333', strokeWidth: 3, highlight: false });
    board.create('segment', [A2, C2], { strokeColor: '#333333', strokeWidth: 3, highlight: false });
    board.create('polygon', [A2, B2, C2], {
      fillColor: '#5D7080', fillOpacity: 0.05, borders: { visible: false }, vertices: { visible: false },
    });

    // Marcas de congruencia (tick marks) en los lados
    const midAB1 = board.create('midpoint', [A1, B1], { visible: false });
    const midAB2 = board.create('midpoint', [A2, B2], { visible: false });
    board.create('segment', [
      [() => midAB1.X() - 0.1, () => midAB1.Y() + 0.2],
      [() => midAB1.X() + 0.1, () => midAB1.Y() - 0.2],
    ], { strokeColor: '#C86446', strokeWidth: 2, highlight: false });
    board.create('segment', [
      [() => midAB2.X() - 0.1, () => midAB2.Y() + 0.2],
      [() => midAB2.X() + 0.1, () => midAB2.Y() - 0.2],
    ], { strokeColor: '#C86446', strokeWidth: 2, highlight: false });

    elementsRef.current = { board, s1, s2, s3, A1, B1, C1, A2, B2, C2 };

    board.update();

    return () => {
      JXG.JSXGraph.freeBoard(board);
      elementsRef.current = {};
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Triángulos congruentes por el criterio <span className="font-bold not-italic text-terracota">LLL</span>
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
