import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

export const Incidence3 = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const mathHighlight = useMathStore(state => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore(state => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;

  useEffect(() => {
    if (!boardRef.current) return;

    const board = JXG.JSXGraph.initBoard(boardRef.current, {
      boundingbox: [-5, 5, 5, -5],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    const pA = board.create('point', [-1, 3], {
      name: 'A',
      size: 6,
      fillColor: '#C86446',
      strokeColor: '#C86446',
      showInfobox: false,
      fixed: false,
    });

    const pB = board.create('point', [-3, -2], {
      name: 'B',
      size: 6,
      fillColor: '#C86446',
      strokeColor: '#C86446',
      showInfobox: false,
      fixed: false,
    });

    const pC = board.create('point', [3, -1], {
      name: 'C',
      size: 6,
      fillColor: '#C86446',
      strokeColor: '#C86446',
      showInfobox: false,
      fixed: false,
    });

    const sideAB = board.create('segment', [pA, pB], {
      strokeColor: '#5D7080',
      strokeWidth: 1.5,
      dash: 2,
    });

    const sideBC = board.create('segment', [pB, pC], {
      strokeColor: '#5D7080',
      strokeWidth: 1.5,
      dash: 2,
    });

    const sideCA = board.create('segment', [pC, pA], {
      strokeColor: '#5D7080',
      strokeWidth: 1.5,
      dash: 2,
    });

    const triangle = board.create('polygon', [pA, pB, pC], {
      fillColor: '#C86446',
      fillOpacity: 0.06,
      borders: { visible: false },
      vertices: { visible: false },
    });

    elementsRef.current = { pA, pB, pC, sideAB, sideBC, sideCA, triangle, board };

    board.update();

    return () => {
      JXG.JSXGraph.freeBoard(board);
      elementsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const { pA, pB, pC, sideAB, sideBC, sideCA, triangle, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    pA.setAttribute({ size: 6, fillColor: '#C86446', strokeColor: '#C86446' });
    pB.setAttribute({ size: 6, fillColor: '#C86446', strokeColor: '#C86446' });
    pC.setAttribute({ size: 6, fillColor: '#C86446', strokeColor: '#C86446' });
    sideAB.setAttribute({ strokeColor: '#5D7080', strokeWidth: 1.5 });
    sideBC.setAttribute({ strokeColor: '#5D7080', strokeWidth: 1.5 });
    sideCA.setAttribute({ strokeColor: '#5D7080', strokeWidth: 1.5 });
    triangle.setAttribute({ fillOpacity: 0.06 });

    if (highlight === 'pA') pA.setAttribute({ size: 10, fillColor: '#f5c542', strokeColor: '#f5c542' });
    if (highlight === 'pB') pB.setAttribute({ size: 10, fillColor: '#f5c542', strokeColor: '#f5c542' });
    if (highlight === 'pC') pC.setAttribute({ size: 10, fillColor: '#f5c542', strokeColor: '#f5c542' });
    if (highlight === 'triangle') triangle.setAttribute({ fillOpacity: 0.2 });

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[500px] relative bg-lienzo/30">
      <div className="absolute top-3 left-3 z-10 text-[10px] font-sans text-pizarra/50 uppercase tracking-wider">
        Arrastra los vértices
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
