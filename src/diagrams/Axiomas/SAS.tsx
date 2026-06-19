import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

export const SAS = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const mathHighlight = useMathStore(state => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore(state => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;

  useEffect(() => {
    if (!boardRef.current) return;

    const board = JXG.JSXGraph.initBoard(boardRef.current, {
      boundingbox: [-5, 5, 7, -5],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    const pA = board.create('point', [-3, 2], {
      name: 'A', size: 5, fillColor: '#C86446', strokeColor: '#C86446',
      showInfobox: false, fixed: true,
    });
    const pB = board.create('point', [-4, -2], {
      name: 'B', size: 5, fillColor: '#C86446', strokeColor: '#C86446',
      showInfobox: false, fixed: true,
    });
    const pC = board.create('point', [-1, -1.5], {
      name: 'C', size: 5, fillColor: '#C86446', strokeColor: '#C86446',
      showInfobox: false, fixed: true,
    });

    const t1 = board.create('polygon', [pA, pB, pC], {
      fillColor: '#C86446', fillOpacity: 0.08,
      borders: { strokeColor: '#333333', strokeWidth: 2 },
      vertices: { visible: false },
    });

    const side1 = board.create('segment', [pA, pB], {
      strokeColor: '#C86446', strokeWidth: 4,
    });
    const side2 = board.create('segment', [pA, pC], {
      strokeColor: '#C86446', strokeWidth: 4,
    });
    board.create('segment', [pB, pC], {
      strokeColor: '#5D7080', strokeWidth: 2, dash: 1,
    });

    const angle1 = board.create('angle', [pB, pA, pC], {
      radius: 0.5, fillColor: '#A2C2A2', fillOpacity: 0.3,
    });

    const pA2 = board.create('point', [3, 2], {
      name: "A'", size: 5, fillColor: '#5D7080', strokeColor: '#5D7080',
      showInfobox: false, fixed: false,
    });
    const pB2 = board.create('point', [2, -2], {
      name: "B'", size: 5, fillColor: '#5D7080', strokeColor: '#5D7080',
      showInfobox: false, fixed: false,
    });
    const pC2 = board.create('point', [5, -1.5], {
      name: "C'", size: 5, fillColor: '#5D7080', strokeColor: '#5D7080',
      showInfobox: false, fixed: false,
    });

    const t2 = board.create('polygon', [pA2, pB2, pC2], {
      fillColor: '#5D7080', fillOpacity: 0.08,
      borders: { strokeColor: '#333333', strokeWidth: 2, dash: 2 },
      vertices: { visible: false },
    });

    const side1B = board.create('segment', [pA2, pB2], {
      strokeColor: '#C86446', strokeWidth: 4, dash: 3,
    });
    const side2B = board.create('segment', [pA2, pC2], {
      strokeColor: '#C86446', strokeWidth: 4, dash: 3,
    });
    board.create('segment', [pB2, pC2], {
      strokeColor: '#5D7080', strokeWidth: 2, dash: 1,
    });

    const angle2 = board.create('angle', [pB2, pA2, pC2], {
      radius: 0.5, fillColor: '#A2C2A2', fillOpacity: 0.3,
    });

    board.create('text', [-3, 3, 'Original'], {
      fontSize: 10, anchorX: 'middle',
    });
    board.create('text', [3.5, 3, 'Arrastra A\', B\', C\''], {
      fontSize: 10, anchorX: 'middle',
    });

    elementsRef.current = { t1, t2, side1, side2, side1B, side2B, angle1, angle2, board };

    board.update();

    return () => {
      JXG.JSXGraph.freeBoard(board);
      elementsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const { t1, t2, side1, side2, side1B, side2B, angle1, angle2, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    side1.setAttribute({ strokeColor: '#C86446', strokeWidth: 4 });
    side2.setAttribute({ strokeColor: '#C86446', strokeWidth: 4 });
    side1B.setAttribute({ strokeColor: '#C86446', strokeWidth: 4 });
    side2B.setAttribute({ strokeColor: '#C86446', strokeWidth: 4 });
    angle1.setAttribute({ fillOpacity: 0.3 });
    angle2.setAttribute({ fillOpacity: 0.3 });
    t1.setAttribute({ fillOpacity: 0.08 });
    t2.setAttribute({ fillOpacity: 0.08 });

    if (highlight === 'side1' || highlight === 'side1B') {
      side1.setAttribute({ strokeColor: '#f5c542', strokeWidth: 6 });
      side1B.setAttribute({ strokeColor: '#f5c542', strokeWidth: 6 });
    }
    if (highlight === 'side2' || highlight === 'side2B') {
      side2.setAttribute({ strokeColor: '#f5c542', strokeWidth: 6 });
      side2B.setAttribute({ strokeColor: '#f5c542', strokeWidth: 6 });
    }
    if (highlight === 'angle1' || highlight === 'angle2') {
      angle1.setAttribute({ fillOpacity: 0.6 });
      angle2.setAttribute({ fillOpacity: 0.6 });
    }

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[500px] relative bg-lienzo/30">
      <div className="absolute top-3 left-3 z-10 text-[10px] font-sans text-pizarra/50 uppercase tracking-wider">
        Arrastra los puntos del segundo triángulo
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
