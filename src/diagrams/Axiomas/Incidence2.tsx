import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

export const Incidence2 = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const mathHighlight = useMathStore(state => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore(state => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;

  useEffect(() => {
    if (!boardRef.current) return;

    const board = JXG.JSXGraph.initBoard(boardRef.current, {
      boundingbox: [-4, 3, 4, -3],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    const l = board.create('line', [[-3.5, 0], [3.5, 0]], {
      strokeColor: '#333333', strokeWidth: 2, fixed: true, highlight: false,
      name: 'l', label: { fontSize: 16, position: "rt" },
    });

    const A = board.create('point', [-2.5, 0], {
      name: 'A', size: 5, fillColor: '#C86446', strokeColor: '#C86446', showInfobox: false,
    });

    const B = board.create('point', [2.5, 0], {
      name: 'B', size: 5, fillColor: '#C86446', strokeColor: '#C86446', showInfobox: false,
    });

    // Marca visual: al menos dos puntos en la recta
    board.create('segment', [A, B], {
      strokeColor: '#C86446', strokeWidth: 1, dash: 2, highlight: false,
    });

    elementsRef.current = { board, l, A, B };

    board.update();

    return () => {
      JXG.JSXGraph.freeBoard(board);
      elementsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const { board, A, B } = elementsRef.current as Record<string, any>;
    if (!board) return;

    if (highlight === 'pA') {
      A.setAttribute({ size: 10, fillColor: '#f5c542', strokeColor: '#f5c542' });
    } else if (highlight === 'pB') {
      B.setAttribute({ size: 10, fillColor: '#f5c542', strokeColor: '#f5c542' });
    } else {
      A.setAttribute({ size: 5, fillColor: '#C86446', strokeColor: '#C86446' });
      B.setAttribute({ size: 5, fillColor: '#C86446', strokeColor: '#C86446' });
    }

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Toda recta contiene al menos <span className="font-bold not-italic text-terracota">dos</span> puntos
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
