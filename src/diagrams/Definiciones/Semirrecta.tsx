import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

export const Semirrecta = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const mathHighlight = useMathStore(state => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore(state => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;

  useEffect(() => {
    if (!boardRef.current) return;

    const board = JXG.JSXGraph.initBoard(boardRef.current, {
      boundingbox: [-4, 3, 5, -3],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    const pO = board.create('point', [-1, 0], {
      name: 'O',
      size: 6,
      fillColor: '#5D7080',
      strokeColor: '#5D7080',
      showInfobox: false,
      fixed: true,
    });

    const pA = board.create('point', [2, 0.5], {
      name: 'A',
      size: 6,
      fillColor: '#C86446',
      strokeColor: '#C86446',
      showInfobox: false,
      fixed: false,
    });

    const farEnd = board.create('point', [
      function () { return pO.X() + 20 * (pA.X() - pO.X()); },
      function () { return pO.Y() + 20 * (pA.Y() - pO.Y()); },
    ], { visible: false, fixed: true });

    const ray = board.create('segment', [pO, farEnd], {
      strokeColor: '#333333',
      strokeWidth: 2,
      lastArrow: { type: 2 },
    });

    elementsRef.current = { pO, pA, ray, board };

    board.update();

    return () => {
      JXG.JSXGraph.freeBoard(board);
      elementsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const { pO, pA, ray, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    pO.setAttribute({ size: 6, fillColor: '#5D7080', strokeColor: '#5D7080' });
    pA.setAttribute({ size: 6, fillColor: '#C86446', strokeColor: '#C86446' });
    ray.setAttribute({ strokeColor: '#333333', strokeWidth: 2 });

    if (highlight === 'pO') {
      pO.setAttribute({ size: 10, fillColor: '#f5c542', strokeColor: '#f5c542' });
    }
    if (highlight === 'pA') {
      pA.setAttribute({ size: 10, fillColor: '#f5c542', strokeColor: '#f5c542' });
    }
    if (highlight === 'rayOA') {
      ray.setAttribute({ strokeColor: '#C86446', strokeWidth: 4 });
    }

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra el punto <span className="font-bold not-italic text-terracota">A</span>
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
