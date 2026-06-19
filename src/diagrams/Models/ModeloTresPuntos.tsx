import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';

export const ModeloTresPuntos = () => {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!boardRef.current) return;

    const board = JXG.JSXGraph.initBoard(boardRef.current, {
      boundingbox: [-3, 3, 3, -3],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    const A = board.create('point', [-2, -1], {
      name: 'A', size: 6, fillColor: '#C86446', strokeColor: '#C86446', showInfobox: false, fixed: true,
    });
    const B = board.create('point', [2, -1], {
      name: 'B', size: 6, fillColor: '#C86446', strokeColor: '#C86446', showInfobox: false, fixed: true,
    });
    const C = board.create('point', [0, 2], {
      name: 'C', size: 6, fillColor: '#C86446', strokeColor: '#C86446', showInfobox: false, fixed: true,
    });

    board.create('line', [A, B], {
      strokeColor: '#333333', strokeWidth: 2, highlight: false,
      name: 'r_AB', label: { fontSize: 14, position: "bl" },
    });
    board.create('line', [B, C], {
      strokeColor: '#333333', strokeWidth: 2, highlight: false,
      name: 'r_BC', label: { fontSize: 14, position: "rt" },
    });
    board.create('line', [C, A], {
      strokeColor: '#333333', strokeWidth: 2, highlight: false,
      name: 'r_CA', label: { fontSize: 14, position: "lt" },
    });

    board.create('polygon', [A, B, C], {
      fillColor: '#5A805A', fillOpacity: 0.08, borders: { visible: false }, vertices: { visible: false },
    });

    board.update();

    return () => {
      JXG.JSXGraph.freeBoard(board);
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Modelo de 3 puntos: 3 puntos, 3 rectas, 1 plano
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
