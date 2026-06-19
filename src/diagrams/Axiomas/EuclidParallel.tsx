import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

export const EuclidParallel = () => {
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

    const lineL = board.create('line', [[-4, 2], [4, 1.5]], {
      strokeColor: '#333333', strokeWidth: 2.5,
    });

    board.create('text', [4.2, 1.8, 'l'], {
      fontSize: 14, fillColor: '#F8F6F1', highlightFillColor: '#F8F6F1',
    });

    const pP = board.create('point', [0, -1.5], {
      name: 'P', size: 6, fillColor: '#C86446', strokeColor: '#C86446',
      showInfobox: false, fixed: false,
    });

    const lineM = board.create('parallel', [pP, lineL], {
      strokeColor: '#C86446', strokeWidth: 2.5,
    });

    board.create('text', [4.2, function() { return pP.Y() - 0.3; }, 'm'], {
      fontSize: 14, fillColor: '#F8F6F1', highlightFillColor: '#F8F6F1',
    });

    elementsRef.current = { lineL, pP, lineM, board };

    board.update();

    return () => {
      JXG.JSXGraph.freeBoard(board);
      elementsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const { lineL, pP, lineM, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    lineL.setAttribute({ strokeColor: '#333333', strokeWidth: 2.5 });
    pP.setAttribute({ size: 6, fillColor: '#C86446', strokeColor: '#C86446' });
    lineM.setAttribute({ strokeColor: '#C86446', strokeWidth: 2.5 });

    if (highlight === 'lineL') lineL.setAttribute({ strokeColor: '#C86446', strokeWidth: 4 });
    if (highlight === 'pP') pP.setAttribute({ size: 10, fillColor: '#f5c542' });
    if (highlight === 'lineM') lineM.setAttribute({ strokeColor: '#f5c542', strokeWidth: 4 });

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[500px] relative bg-lienzo/30">
      <div className="absolute top-3 left-3 z-10 text-[10px] font-sans text-pizarra/50 uppercase tracking-wider">
        Arrastra el punto P
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
