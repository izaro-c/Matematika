import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';

export const CongruenciaALA = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  useEffect(() => {
    if (!boardRef.current) return;

    const board = JXG.JSXGraph.initBoard(boardRef.current, {
      boundingbox: [-2, 5, 8, -2],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    // Primer triángulo
    const A1 = board.create('point', [0, 0], {
      name: 'A', size: 4, fillColor: '#C86446', strokeColor: '#C86446', showInfobox: false, fixed: true,
    });
    const B1 = board.create('point', [5, 0], {
      name: 'B', size: 4, fillColor: '#C86446', strokeColor: '#C86446', showInfobox: false, fixed: true,
    });
    const C1 = board.create('point', [1.5, 3], {
      name: 'C', size: 4, fillColor: '#5A805A', strokeColor: '#5A805A', showInfobox: false,
    });

    board.create('segment', [A1, B1], {
      strokeColor: '#333333', strokeWidth: 3, highlight: false, name: 'AB',
      label: { fontSize: 14 },
    });
    board.create('segment', [A1, C1], {
      strokeColor: '#333333', strokeWidth: 2, highlight: false,
    });
    board.create('segment', [B1, C1], {
      strokeColor: '#333333', strokeWidth: 2, highlight: false,
    });
    board.create('polygon', [A1, B1, C1], {
      fillColor: '#C86446', fillOpacity: 0.05, borders: { visible: false }, vertices: { visible: false },
    });

    // Segundo triángulo (congruente)
    const A2 = board.create('point', [0, -0.8], {
      name: "A'", size: 4, fillColor: '#C86446', strokeColor: '#C86446', showInfobox: false, fixed: true,
    });
    const B2 = board.create('point', [5, -0.8], {
      name: "B'", size: 4, fillColor: '#C86446', strokeColor: '#C86446', showInfobox: false, fixed: true,
    });
    const C2 = board.create('point', [3.5, -3.5], {
      name: "C'", size: 4, fillColor: '#5D7080', strokeColor: '#5D7080', showInfobox: false,
    });

    board.create('segment', [A2, B2], {
      strokeColor: '#333333', strokeWidth: 3, highlight: false, name: "A'B'",
      label: { fontSize: 14 },
    });
    board.create('segment', [A2, C2], {
      strokeColor: '#333333', strokeWidth: 2, highlight: false,
    });
    board.create('segment', [B2, C2], {
      strokeColor: '#333333', strokeWidth: 2, highlight: false,
    });
    board.create('polygon', [A2, B2, C2], {
      fillColor: '#5D7080', fillOpacity: 0.05, borders: { visible: false }, vertices: { visible: false },
    });

    // Marcas de congruencia en AB y A'B'
    board.create('segment', [A1, B1], {
      strokeColor: 'transparent', highlight: false,
    });

    // Ángulos
    board.create('angle', [B1, A1, C1], {
      strokeColor: '#C86446', fillColor: '#C86446', fillOpacity: 0.15,
      radius: 0.5, name: '∠A', label: { fontSize: 14 },
    });
    board.create('angle', [A2, B2, C2], {
      strokeColor: '#C86446', fillColor: '#C86446', fillOpacity: 0.15,
      radius: 0.5, name: "∠B'", label: { fontSize: 14 },
    });

    elementsRef.current = { board, A1, B1, C1, A2, B2, C2 };

    board.update();

    return () => {
      JXG.JSXGraph.freeBoard(board);
      elementsRef.current = {};
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Triángulos congruentes por el criterio <span className="font-bold not-italic text-terracota">ALA</span>
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
