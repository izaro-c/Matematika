import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

export const Punto = () => {
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

    const p = board.create('point', [0, 0], {
      name: 'P',
      size: 6,
      fillColor: '#C86446',
      strokeColor: '#C86446',
      showInfobox: false,
      fixed: false,
    });

    elementsRef.current = { p, board };

    board.update();

    return () => {
      JXG.JSXGraph.freeBoard(board);
      elementsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const { p, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    p.setAttribute({ size: 6, fillColor: '#C86446', strokeColor: '#C86446' });

    if (highlight === 'pPoint') {
      p.setAttribute({ size: 12, fillColor: '#f5c542', strokeColor: '#f5c542' });
    }

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra el punto <span className="font-bold not-italic text-terracota">P</span>
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
