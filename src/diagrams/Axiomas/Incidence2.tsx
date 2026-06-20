import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';


function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}


export const Incidence2 = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoard = useRef<any>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const mathHighlight = useMathStore(state => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore(state => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;

  useEffect(() => {
    if (!boardRef.current) return;

    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-4, 3, 4, -3],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });
    jxgBoard.current = board;

    const l = board.create('line', [[-3.5, 0], [3.5, 0]], {
      strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2, fixed: true, highlight: false,
      name: 'l', withLabel: true, label: { 
        position: 'top', 
        offset: [20, 10],
        display: 'internal',
        fontFamily: 'Charter, Georgia, serif',
        fontStyle: 'italic',
        fontSize: 24,
        strokeColor: getCSSVar('--theme-carbon')
      },
    });

    const A = board.create('glider', [-2.5, 0, l], {
      name: 'A', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false,
    });

    const B = board.create('glider', [2.5, 0, l], {
      name: 'B', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false,
    });

    // Marca visual: al menos dos puntos en la recta
    board.create('segment', [A, B], {
      strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 1, dash: 2, highlight: false,
    });

    elementsRef.current = { board, l, A, B };

    board.update();    (board.renderer as any).container.style.backgroundColor = getCSSVar('--theme-lienzo');



        const observer = new MutationObserver(() => {
      if (board) {
        (board.renderer as any).container.style.backgroundColor = getCSSVar('--theme-lienzo');
        board.update();
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
      JXG.JSXGraph.freeBoard(board);
      jxgBoard.current = null;
      elementsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const { board, l, A, B } = elementsRef.current as Record<string, any>;
    if (!board) return;

    if (highlight === 'pA') {
      A.setAttribute({ size: 10, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    } else if (highlight === 'pB') {
      B.setAttribute({ size: 10, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    } else if (highlight === 'lineAB' || highlight === 'l') {
      l.setAttribute({ strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 4 });
      if (l.label) l.label.setAttribute({ strokeColor: getCSSVar('--theme-terracota') });
    } else {
      A.setAttribute({ size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });
      B.setAttribute({ size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });
      l.setAttribute({ strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2 });
      if (l.label) l.label.setAttribute({ strokeColor: getCSSVar('--theme-carbon') });
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
