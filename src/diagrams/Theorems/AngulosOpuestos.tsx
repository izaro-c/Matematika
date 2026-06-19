import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

export const AngulosOpuestos = () => {
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

    const O = board.create('point', [0, 0], {
      name: 'O', size: 5, fillColor: '#C86446', strokeColor: '#C86446', showInfobox: false, fixed: true,
    });

    const A = board.create('point', [-3.5, 2], {
      name: 'A', size: 4, fillColor: '#C86446', strokeColor: '#C86446', showInfobox: false,
    });

    const Ap = board.create('point', [3.5, -2], {
      name: "A'", size: 4, fillColor: '#C86446', strokeColor: '#C86446', showInfobox: false,
    });

    const B = board.create('point', [3.5, 2], {
      name: 'B', size: 4, fillColor: '#5D7080', strokeColor: '#5D7080', showInfobox: false,
    });

    const Bp = board.create('point', [-3.5, -2], {
      name: "B'", size: 4, fillColor: '#5D7080', strokeColor: '#5D7080', showInfobox: false,
    });

    const l = board.create('line', [A, Ap], {
      strokeColor: '#333333', strokeWidth: 2, fixed: true, highlight: false,
    });

    const m = board.create('line', [B, Bp], {
      strokeColor: '#333333', strokeWidth: 2, fixed: true, highlight: false,
    });

    const angle1 = board.create('angle', [B, O, Ap], {
      strokeColor: '#C86446', fillColor: '#C86446', fillOpacity: 0.15,
      radius: 0.8, name: 'α', label: { fontSize: 16 },
    });

    const angle2 = board.create('angle', [Bp, O, A], {
      strokeColor: '#C86446', fillColor: '#C86446', fillOpacity: 0.15,
      radius: 0.8, name: 'α', label: { fontSize: 16 },
    });

    const angle3 = board.create('angle', [A, O, B], {
      strokeColor: '#5D7080', fillColor: '#5D7080', fillOpacity: 0.15,
      radius: 0.8, name: 'β', label: { fontSize: 16 },
    });

    const angle4 = board.create('angle', [Ap, O, Bp], {
      strokeColor: '#5D7080', fillColor: '#5D7080', fillOpacity: 0.15,
      radius: 0.8, name: 'β', label: { fontSize: 16 },
    });

    elementsRef.current = { board, angle1, angle2, angle3, angle4, O, A, B, Ap, Bp, l, m };

    board.update();

    return () => {
      JXG.JSXGraph.freeBoard(board);
      elementsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const { board, angle1, angle2, angle3, angle4 } = elementsRef.current as Record<string, any>;
    if (!board) return;

    if (highlight === 'alpha') {
      angle1.setAttribute({ fillOpacity: 0.4, strokeColor: '#C86446', strokeWidth: 3 });
      angle2.setAttribute({ fillOpacity: 0.4, strokeColor: '#C86446', strokeWidth: 3 });
      angle3.setAttribute({ fillOpacity: 0.05 });
      angle4.setAttribute({ fillOpacity: 0.05 });
    } else if (highlight === 'beta') {
      angle3.setAttribute({ fillOpacity: 0.4, strokeColor: '#5D7080', strokeWidth: 3 });
      angle4.setAttribute({ fillOpacity: 0.4, strokeColor: '#5D7080', strokeWidth: 3 });
      angle1.setAttribute({ fillOpacity: 0.05 });
      angle2.setAttribute({ fillOpacity: 0.05 });
    }

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra los puntos para ver los ángulos opuestos
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
