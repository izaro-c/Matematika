import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

export const Pasch = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const mathHighlight = useMathStore(state => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore(state => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;

  useEffect(() => {
    if (!boardRef.current) return;

    const board = JXG.JSXGraph.initBoard(boardRef.current, {
      boundingbox: [-5, 5, 6, -5],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    const pA = board.create('point', [0, 3.5], {
      name: 'A', size: 5, fillColor: '#C86446', strokeColor: '#C86446',
      showInfobox: false, fixed: false,
    });
    const pB = board.create('point', [-3.5, -2.5], {
      name: 'B', size: 5, fillColor: '#C86446', strokeColor: '#C86446',
      showInfobox: false, fixed: false,
    });
    const pC = board.create('point', [4, -2], {
      name: 'C', size: 5, fillColor: '#C86446', strokeColor: '#C86446',
      showInfobox: false, fixed: false,
    });

    const sideAB = board.create('segment', [pA, pB], {
      strokeColor: '#333333', strokeWidth: 2,
    });
    const sideBC = board.create('segment', [pB, pC], {
      strokeColor: '#333333', strokeWidth: 2,
    });
    const sideCA = board.create('segment', [pC, pA], {
      strokeColor: '#333333', strokeWidth: 2,
    });

    const triangle = board.create('polygon', [pA, pB, pC], {
      fillColor: '#C86446', fillOpacity: 0.04,
      borders: { visible: false }, vertices: { visible: false },
    });

    const pP = board.create('glider', [-1, 0.5, sideAB], {
      name: 'P', size: 5, fillColor: '#C86446', strokeColor: '#C86446',
      showInfobox: false,
    });
    const pQ = board.create('glider', [2, -1, sideBC], {
      name: 'Q', size: 5, fillColor: '#C86446', strokeColor: '#C86446',
      showInfobox: false,
    });

    const lineL = board.create('line', [pP, pQ], {
      strokeColor: '#5D7080', strokeWidth: 2.5,
    });

    elementsRef.current = { pA, pB, pC, pP, pQ, sideAB, sideBC, sideCA, triangle, lineL, board };

    board.update();

    return () => {
      JXG.JSXGraph.freeBoard(board);
      elementsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const { pA, pB, pC, pP, pQ, sideAB, sideBC, sideCA, triangle, lineL, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    [pA, pB, pC, pP, pQ].forEach(pt => pt.setAttribute({ size: 5, fillColor: '#C86446', strokeColor: '#C86446' }));
    [sideAB, sideBC, sideCA].forEach(s => s.setAttribute({ strokeColor: '#333333', strokeWidth: 2 }));
    lineL.setAttribute({ strokeColor: '#5D7080', strokeWidth: 2.5 });
    triangle.setAttribute({ fillOpacity: 0.04 });

    if (highlight === 'triangle') triangle.setAttribute({ fillOpacity: 0.15 });
    if (highlight === 'lineL') lineL.setAttribute({ strokeColor: '#C86446', strokeWidth: 4 });
    if (highlight === 'pP') pP.setAttribute({ size: 9, fillColor: '#f5c542' });
    if (highlight === 'pQ') pQ.setAttribute({ size: 9, fillColor: '#f5c542' });

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[500px] relative bg-lienzo/30">
      <div className="absolute top-3 left-3 z-10 text-[10px] font-sans text-pizarra/50 uppercase tracking-wider">
        Arrastra los vértices y los puntos P, Q
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
