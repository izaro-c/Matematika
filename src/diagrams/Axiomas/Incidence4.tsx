import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

export const Incidence4 = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const mathHighlight = useMathStore(state => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore(state => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;

  useEffect(() => {
    if (!boardRef.current) return;

    const board = JXG.JSXGraph.initBoard(boardRef.current, {
      boundingbox: [-4, 4, 4, -3],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    // Triángulo: tres puntos no colineales
    const A = board.create('point', [-2.5, -1], {
      name: 'A', size: 5, fillColor: '#C86446', strokeColor: '#C86446', showInfobox: false,
    });
    const B = board.create('point', [2.5, -1], {
      name: 'B', size: 5, fillColor: '#C86446', strokeColor: '#C86446', showInfobox: false,
    });
    const C = board.create('point', [0, 2.5], {
      name: 'C', size: 5, fillColor: '#C86446', strokeColor: '#C86446', showInfobox: false,
    });

    // Lados del triángulo
    const lab = board.create('line', [A, B], {
      strokeColor: '#333333', strokeWidth: 1.5, highlight: false, dash: 1,
    });
    const lac = board.create('line', [A, C], {
      strokeColor: '#333333', strokeWidth: 1.5, highlight: false, dash: 1,
    });
    const lbc = board.create('line', [B, C], {
      strokeColor: '#333333', strokeWidth: 1.5, highlight: false, dash: 1,
    });

    // Segmentos destacados
    board.create('segment', [A, B], { strokeColor: '#5A805A', strokeWidth: 2.5, highlight: false });
    board.create('segment', [A, C], { strokeColor: '#5A805A', strokeWidth: 2.5, highlight: false });
    board.create('segment', [B, C], { strokeColor: '#5A805A', strokeWidth: 2.5, highlight: false });

    // Etiqueta "plano" con relleno suave
    const polygonABC = board.create('polygon', [A, B, C], {
      fillColor: '#5D7080', fillOpacity: 0.08, borders: { visible: false }, vertices: { visible: false },
    });

    elementsRef.current = { board, A, B, C, lab, lac, lbc, polygonABC };

    board.update();

    return () => {
      JXG.JSXGraph.freeBoard(board);
      elementsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const { board, A, B, C, polygonABC } = elementsRef.current as Record<string, any>;
    if (!board) return;

    const reset = () => {
      A.setAttribute({ size: 5, fillColor: '#C86446', strokeColor: '#C86446' });
      B.setAttribute({ size: 5, fillColor: '#C86446', strokeColor: '#C86446' });
      C.setAttribute({ size: 5, fillColor: '#C86446', strokeColor: '#C86446' });
      if (polygonABC) polygonABC.setAttribute({ fillOpacity: 0.08, fillColor: '#5D7080' });
    };

    reset();
    if (highlight === 'pA') A.setAttribute({ size: 10, fillColor: '#f5c542', strokeColor: '#f5c542' });
    else if (highlight === 'pB') B.setAttribute({ size: 10, fillColor: '#f5c542', strokeColor: '#f5c542' });
    else if (highlight === 'pC') C.setAttribute({ size: 10, fillColor: '#f5c542', strokeColor: '#f5c542' });
    else if (highlight === 'polygonABC' && polygonABC) polygonABC.setAttribute({ fillOpacity: 0.25, fillColor: '#5A805A' });

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Tres puntos no colineales determinan un <span className="font-bold not-italic text-terracota">plano</span>
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
