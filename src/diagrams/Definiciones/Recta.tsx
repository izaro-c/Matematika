import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

export const Recta = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const mathHighlight = useMathStore(state => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore(state => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;

  useEffect(() => {
    if (!boardRef.current) return;

    const board = JXG.JSXGraph.initBoard(boardRef.current, {
      boundingbox: [-5, 4, 5, -4],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    const pA = board.create('point', [-2, 1], {
      name: 'A',
      size: 6,
      fillColor: '#C86446',
      strokeColor: '#C86446',
      showInfobox: false,
      fixed: false,
    });

    const pB = board.create('point', [3, -0.5], {
      name: 'B',
      size: 6,
      fillColor: '#C86446',
      strokeColor: '#C86446',
      showInfobox: false,
      fixed: false,
    });

    const lineAB = board.create('line', [pA, pB], {
      strokeColor: '#333333',
      strokeWidth: 2,
    });

    elementsRef.current = { pA, pB, lineAB, board };

    board.update();

    return () => {
      JXG.JSXGraph.freeBoard(board);
      elementsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const { pA, pB, lineAB, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    pA.setAttribute({ size: 6, fillColor: '#C86446', strokeColor: '#C86446' });
    pB.setAttribute({ size: 6, fillColor: '#C86446', strokeColor: '#C86446' });
    lineAB.setAttribute({ strokeColor: '#333333', strokeWidth: 2 });

    if (highlight === 'pA') {
      pA.setAttribute({ size: 10, fillColor: '#f5c542', strokeColor: '#f5c542' });
    }
    if (highlight === 'pB') {
      pB.setAttribute({ size: 10, fillColor: '#f5c542', strokeColor: '#f5c542' });
    }
    if (highlight === 'lineAB') {
      lineAB.setAttribute({ strokeColor: '#C86446', strokeWidth: 4 });
    }

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra los puntos <span className="font-bold not-italic text-terracota">A</span>, <span className="font-bold not-italic text-terracota">B</span>
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
